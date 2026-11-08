export interface Token {
  type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'OPERATOR' | 'RELOP' | 'LOGOP' | 'ASSIGN' | 'DELIMITER';
  value: string;
  line: number;
  col: number;
}

export interface ASTNode {
  id: string;
  type: string;
  value?: string;
  left?: ASTNode;
  right?: ASTNode;
  children?: ASTNode[];
  meta?: Record<string, any>;
}

export interface Quadruple {
  index: number;
  op: string;
  arg1: string;
  arg2: string;
  dest: string;
}

export interface Triple {
  index: number;
  op: string;
  arg1: string;
  arg2: string;
}

export interface TranslationResult {
  tokens: Token[];
  ast: ASTNode | null;
  tacLines: string[];
  quadruples: Quadruple[];
  triples: Triple[];
  riscvCode: string[];
  errors: string[];
}

export function tokenize(source: string): { tokens: Token[]; errors: string[] } {
  const tokens: Token[] = [];
  const errors: string[] = [];
  let pos = 0;
  let line = 1;
  let col = 1;

  const keywords = new Set(['if', 'else', 'while', 'for', 'int', 'boolean', 'return', 'void', 'true', 'false']);

  while (pos < source.length) {
    const ch = source[pos];

    // Espacios en blanco
    if (ch === ' ' || ch === '\t' || ch === '\r') {
      pos++;
      col++;
      continue;
    }
    if (ch === '\n') {
      line++;
      col = 1;
      pos++;
      continue;
    }

    // Comentarios
    if (ch === '/' && source[pos + 1] === '/') {
      while (pos < source.length && source[pos] !== '\n') pos++;
      continue;
    }

    // Identificadores y palabras reservadas
    if (/[a-zA-Z_]/.test(ch)) {
      const startCol = col;
      let val = '';
      while (pos < source.length && /[a-zA-Z0-9_]/.test(source[pos])) {
        val += source[pos];
        pos++;
        col++;
      }
      if (keywords.has(val)) {
        tokens.push({ type: 'KEYWORD', value: val, line, col: startCol });
      } else {
        tokens.push({ type: 'IDENTIFIER', value: val, line, col: startCol });
      }
      continue;
    }

    // Números enteros o flotantes
    if (/[0-9]/.test(ch)) {
      const startCol = col;
      let val = '';
      while (pos < source.length && /[0-9.]/.test(source[pos])) {
        val += source[pos];
        pos++;
        col++;
      }
      tokens.push({ type: 'NUMBER', value: val, line, col: startCol });
      continue;
    }

    // Operadores lógicos y relacionales de 2 caracteres
    const twoChars = source.slice(pos, pos + 2);
    if (['==', '!=', '>=', '<='].includes(twoChars)) {
      tokens.push({ type: 'RELOP', value: twoChars, line, col });
      pos += 2;
      col += 2;
      continue;
    }
    if (twoChars === '&&' || twoChars === '||') {
      tokens.push({ type: 'LOGOP', value: twoChars, line, col });
      pos += 2;
      col += 2;
      continue;
    }

    // Operadores relacionales de 1 caracter
    if (ch === '>' || ch === '<') {
      tokens.push({ type: 'RELOP', value: ch, line, col });
      pos++;
      col++;
      continue;
    }

    // Operadores lógicos
    if (ch === '!') {
      tokens.push({ type: 'LOGOP', value: ch, line, col });
      pos++;
      col++;
      continue;
    }

    // Asignación
    if (ch === '=') {
      tokens.push({ type: 'ASSIGN', value: ch, line, col });
      pos++;
      col++;
      continue;
    }

    // Operadores aritméticos
    if (['+', '-', '*', '/', '%'].includes(ch)) {
      tokens.push({ type: 'OPERATOR', value: ch, line, col });
      pos++;
      col++;
      continue;
    }

    // Delimitadores y puntuación
    if (['(', ')', '{', '}', ';', ',', '[', ']'].includes(ch)) {
      tokens.push({ type: 'DELIMITER', value: ch, line, col });
      pos++;
      col++;
      continue;
    }

    // Error léxico
    errors.push(`Error léxico en línea ${line}, col ${col}: Carácter no reconocido '${ch}'`);
    pos++;
    col++;
  }

  return { tokens, errors };
}

export function compileToC3D(source: string): TranslationResult {
  const { tokens, errors } = tokenize(source);
  if (errors.length > 0) {
    return {
      tokens,
      ast: null,
      tacLines: [],
      quadruples: [],
      triples: [],
      riscvCode: [],
      errors
    };
  }

  let tokenIdx = 0;
  function peek(): Token | undefined {
    return tokens[tokenIdx];
  }
  function consume(expected?: string): Token {
    const t = tokens[tokenIdx++];
    if (!t) throw new Error('Fin de tokens inesperado');
    if (expected && t.value !== expected) {
      throw new Error(`Se esperaba '${expected}' pero se encontró '${t.value}'`);
    }
    return t;
  }

  let tempCounter = 1;
  let labelCounter = 1;
  function newTemp(): string {
    return `t${tempCounter++}`;
  }
  function newLabel(): string {
    return `et${labelCounter++}`;
  }

  const tacLines: string[] = [];
  const quadruples: Quadruple[] = [];
  const triples: Triple[] = [];
  const riscvLines: string[] = [];

  function emitQuad(op: string, arg1: string, arg2: string, dest: string, tacText: string) {
    const idx = quadruples.length;
    quadruples.push({ index: idx, op, arg1, arg2, dest });
    triples.push({ index: idx, op, arg1, arg2 });
    tacLines.push(tacText);
  }

  // Mapa de ranuras en la pila para variables (-offset(fp))
  const stackSlots: Record<string, number> = {};
  let currentOffset = -12; // Inicia en -12(fp) según la bibliografía canónica

  function getSlot(name: string): number {
    if (!(name in stackSlots)) {
      stackSlots[name] = currentOffset;
      currentOffset -= 4;
    }
    return stackSlots[name];
  }

  // Parseador de expresiones
  function parseExpression(): { ast: ASTNode; place: string } {
    return parseLogicalOr();
  }

  function parseLogicalOr(): { ast: ASTNode; place: string } {
    let { ast: leftNode, place: leftPlace } = parseLogicalAnd();
    while (peek() && peek()!.value === '||') {
      const opTok = consume();
      const { ast: rightNode, place: rightPlace } = parseLogicalAnd();
      const dest = newTemp();
      const node: ASTNode = {
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'LogicalOr',
        value: '||',
        left: leftNode,
        right: rightNode
      };
      emitQuad('||', leftPlace, rightPlace, dest, `${dest} = ${leftPlace} || ${rightPlace}`);
      leftNode = node;
      leftPlace = dest;
    }
    return { ast: leftNode, place: leftPlace };
  }

  function parseLogicalAnd(): { ast: ASTNode; place: string } {
    let { ast: leftNode, place: leftPlace } = parseRelational();
    while (peek() && peek()!.value === '&&') {
      const opTok = consume();
      const { ast: rightNode, place: rightPlace } = parseRelational();
      const dest = newTemp();
      const node: ASTNode = {
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'LogicalAnd',
        value: '&&',
        left: leftNode,
        right: rightNode
      };
      emitQuad('&&', leftPlace, rightPlace, dest, `${dest} = ${leftPlace} && ${rightPlace}`);
      leftNode = node;
      leftPlace = dest;
    }
    return { ast: leftNode, place: leftPlace };
  }

  function parseRelational(): { ast: ASTNode; place: string } {
    let { ast: leftNode, place: leftPlace } = parseAdditive();
    if (peek() && ['>', '<', '>=', '<=', '==', '!='].includes(peek()!.value)) {
      const relOp = consume().value;
      const { ast: rightNode, place: rightPlace } = parseAdditive();
      const dest = newTemp();
      const node: ASTNode = {
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'RelationalOp',
        value: relOp,
        left: leftNode,
        right: rightNode
      };
      emitQuad(relOp, leftPlace, rightPlace, dest, `${dest} = ${leftPlace} ${relOp} ${rightPlace}`);
      return { ast: node, place: dest };
    }
    return { ast: leftNode, place: leftPlace };
  }

  function parseAdditive(): { ast: ASTNode; place: string } {
    let { ast: leftNode, place: leftPlace } = parseMultiplicative();
    while (peek() && (peek()!.value === '+' || peek()!.value === '-')) {
      const op = consume().value;
      const { ast: rightNode, place: rightPlace } = parseMultiplicative();
      const dest = newTemp();
      const node: ASTNode = {
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'BinaryOp',
        value: op,
        left: leftNode,
        right: rightNode
      };
      emitQuad(op, leftPlace, rightPlace, dest, `${dest} = ${leftPlace} ${op} ${rightPlace}`);
      leftNode = node;
      leftPlace = dest;
    }
    return { ast: leftNode, place: leftPlace };
  }

  function parseMultiplicative(): { ast: ASTNode; place: string } {
    let { ast: leftNode, place: leftPlace } = parseUnary();
    while (peek() && (peek()!.value === '*' || peek()!.value === '/' || peek()!.value === '%')) {
      const op = consume().value;
      const { ast: rightNode, place: rightPlace } = parseUnary();
      const dest = newTemp();
      const node: ASTNode = {
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'BinaryOp',
        value: op,
        left: leftNode,
        right: rightNode
      };
      emitQuad(op, leftPlace, rightPlace, dest, `${dest} = ${leftPlace} ${op} ${rightPlace}`);
      leftNode = node;
      leftPlace = dest;
    }
    return { ast: leftNode, place: leftPlace };
  }

  function parseUnary(): { ast: ASTNode; place: string } {
    if (peek() && (peek()!.value === '-' || peek()!.value === '!')) {
      const op = consume().value;
      const { ast: subNode, place: subPlace } = parsePrimary();
      const dest = newTemp();
      const node: ASTNode = {
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'UnaryOp',
        value: op,
        left: subNode
      };
      emitQuad(op, subPlace, '_', dest, `${dest} = ${op}${subPlace}`);
      return { ast: node, place: dest };
    }
    return parsePrimary();
  }

  function parsePrimary(): { ast: ASTNode; place: string } {
    const t = peek();
    if (!t) throw new Error('Expresión incompleta');

    if (t.value === '(') {
      consume('(');
      const res = parseExpression();
      consume(')');
      return res;
    }

    if (t.type === 'NUMBER') {
      consume();
      return {
        ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'Literal', value: t.value },
        place: t.value
      };
    }

    if (t.type === 'IDENTIFIER') {
      consume();
      // Verificamos si es acceso a arreglo
      if (peek() && peek()!.value === '[') {
        consume('[');
        const idx = parseExpression();
        consume(']');
        const dest = newTemp();
        emitQuad('[]', t.value, idx.place, dest, `${dest} = ${t.value}[${idx.place}]`);
        return {
          ast: {
            id: `node_${Math.random().toString(36).substring(2, 7)}`,
            type: 'ArrayAccess',
            value: `${t.value}[]`,
            left: idx.ast
          },
          place: dest
        };
      }
      return {
        ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'Identifier', value: t.value },
        place: t.value
      };
    }

    throw new Error(`Token inesperado en expresión: '${t.value}'`);
  }

  // Parseador de sentencias completas
  const rootAST: ASTNode = {
    id: 'root',
    type: 'Program',
    children: []
  };

  try {
    while (tokenIdx < tokens.length) {
      const tok = peek();
      if (!tok) break;

      // Declaración o asignación
      if (tok.value === 'int' || tok.value === 'boolean') {
        consume(); // Tipo
        const idTok = consume();
        if (peek() && peek()!.value === '=') {
          consume('=');
          const expr = parseExpression();
          consume(';');
          emitQuad('=', expr.place, '_', idTok.value, `${idTok.value} = ${expr.place}`);
          rootAST.children!.push({
            id: `node_${Math.random().toString(36).substring(2, 7)}`,
            type: 'Assignment',
            value: idTok.value,
            right: expr.ast
          });
        } else {
          consume(';');
        }
        continue;
      }

      // if (cond) { ... } else { ... }
      if (tok.value === 'if') {
        consume('if');
        consume('(');
        const cond = parseExpression();
        consume(')');
        consume('{');

        const labelTrue = newLabel();
        const labelFalse = newLabel();
        const labelEnd = newLabel();

        emitQuad('if', cond.place, '_', labelTrue, `if ${cond.place} goto ${labelTrue}`);
        emitQuad('goto', '_', '_', labelFalse, `goto ${labelFalse}`);
        emitQuad('label', '_', '_', labelTrue, `${labelTrue}:`);

        // Bloque if simplificado (asume asignaciones adentro)
        while (peek() && peek()!.value !== '}') {
          const varTok = consume();
          consume('=');
          const subExpr = parseExpression();
          consume(';');
          emitQuad('=', subExpr.place, '_', varTok.value, `${varTok.value} = ${subExpr.place}`);
        }
        consume('}');
        emitQuad('goto', '_', '_', labelEnd, `goto ${labelEnd}`);
        emitQuad('label', '_', '_', labelFalse, `${labelFalse}:`);

        if (peek() && peek()!.value === 'else') {
          consume('else');
          consume('{');
          while (peek() && peek()!.value !== '}') {
            const varTok = consume();
            consume('=');
            const subExpr = parseExpression();
            consume(';');
            emitQuad('=', subExpr.place, '_', varTok.value, `${varTok.value} = ${subExpr.place}`);
          }
          consume('}');
        }
        emitQuad('label', '_', '_', labelEnd, `${labelEnd}:`);
        continue;
      }

      // while (cond) { ... }
      if (tok.value === 'while') {
        consume('while');
        const lCond = newLabel();
        const lBody = newLabel();
        const lEnd = newLabel();

        emitQuad('label', '_', '_', lCond, `${lCond}:`);
        consume('(');
        const cond = parseExpression();
        consume(')');
        consume('{');

        emitQuad('if', cond.place, '_', lBody, `if ${cond.place} goto ${lBody}`);
        emitQuad('goto', '_', '_', lEnd, `goto ${lEnd}`);
        emitQuad('label', '_', '_', lBody, `${lBody}:`);

        while (peek() && peek()!.value !== '}') {
          const varTok = consume();
          consume('=');
          const subExpr = parseExpression();
          consume(';');
          emitQuad('=', subExpr.place, '_', varTok.value, `${varTok.value} = ${subExpr.place}`);
        }
        consume('}');
        emitQuad('goto', '_', '_', lCond, `goto ${lCond}`);
        emitQuad('label', '_', '_', lEnd, `${lEnd}:`);
        continue;
      }

      // Asignación simple x = expr;
      if (tok.type === 'IDENTIFIER') {
        const idTok = consume();
        if (peek() && peek()!.value === '=') {
          consume('=');
          const expr = parseExpression();
          consume(';');
          emitQuad('=', expr.place, '_', idTok.value, `${idTok.value} = ${expr.place}`);
          rootAST.children!.push({
            id: `node_${Math.random().toString(36).substring(2, 7)}`,
            type: 'Assignment',
            value: idTok.value,
            right: expr.ast
          });
          continue;
        }
      }

      // Si es una expresión sola:
      const expr = parseExpression();
      if (peek() && peek()!.value === ';') consume(';');
      rootAST.children!.push(expr.ast);
    }
  } catch (err: any) {
    errors.push(`Error de sintaxis: ${err.message}`);
  }

  // Traducción a RISC-V basada en la matriz del material
  riscvLines.push('# --- Prólogo del subprograma ---');
  riscvLines.push('  addi sp, sp, -32        # Reservar 32B en Pila (múltiplo de 16)');
  riscvLines.push('  sw   s0, 28(sp)         # 0(fp): Salvar Frame Pointer anterior');
  riscvLines.push('  sw   ra, 24(sp)         # -4(fp): Salvar dirección de retorno');
  riscvLines.push('  addi s0, sp, 28         # Fijar s0 como base fija e inalterable\n');

  for (const q of quadruples) {
    if (q.op === '=') {
      const isNum = /^[0-9]+$/.test(q.arg1);
      const isTemp = /^t[0-9]+$/.test(q.arg1);
      const destSlot = getSlot(q.dest);

      if (isNum) {
        riscvLines.push(`  li   t0, ${q.arg1}`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)      # ${q.dest} = ${q.arg1}`);
      } else if (isTemp) {
        const srcSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   t0, ${srcSlot}(s0)      # Leer ${q.arg1}`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)      # ${q.dest} = ${q.arg1}`);
      } else {
        const srcSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   t0, ${srcSlot}(s0)      # Leer ${q.arg1}`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)      # ${q.dest} = ${q.arg1}`);
      }
    } else if (['+', '-', '*', '/'].includes(q.op)) {
      const destSlot = getSlot(q.dest);
      const loadOperand = (arg: string, reg: string) => {
        if (/^[0-9]+$/.test(arg)) {
          riscvLines.push(`  li   ${reg}, ${arg}`);
        } else {
          const slot = getSlot(arg);
          riscvLines.push(`  lw   ${reg}, ${slot}(s0)      # Cargar ${arg}`);
        }
      };

      loadOperand(q.arg1, 't0');
      loadOperand(q.arg2, 't1');

      const opMap: Record<string, string> = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div' };
      riscvLines.push(`  ${opMap[q.op]}  t2, t0, t1       # t2 = ${q.arg1} ${q.op} ${q.arg2}`);
      riscvLines.push(`  sw   t2, ${destSlot}(s0)      # Guardar en ${q.dest}`);
    } else if (q.op === 'label') {
      riscvLines.push(`${q.dest}`);
    } else if (q.op === 'goto') {
      riscvLines.push(`  j    ${q.dest}               # Salto incondicional`);
    } else if (q.op === 'if') {
      const condSlot = getSlot(q.arg1);
      riscvLines.push(`  lw   t0, ${condSlot}(s0)`);
      riscvLines.push(`  bne  t0, zero, ${q.dest}     # if (${q.arg1} != 0) goto ${q.dest}`);
    }
  }

  riscvLines.push('\n# --- Epílogo ---');
  riscvLines.push('  lw   ra, -4(s0)         # Restaurar ra');
  riscvLines.push('  lw   s0, 0(s0)          # Restaurar s0');
  riscvLines.push('  addi sp, sp, 32         # Desapilar marco');
  riscvLines.push('  ret                     # Retornar al invocador');

  return {
    tokens,
    ast: rootAST.children!.length === 1 ? rootAST.children![0] : rootAST,
    tacLines,
    quadruples,
    triples,
    riscvCode: riscvLines,
    errors
  };
}

