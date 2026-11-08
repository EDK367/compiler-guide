export interface Token {
  type: 'KEYWORD' | 'IDENTIFIER' | 'NUMBER' | 'STRING' | 'OPERATOR' | 'RELOP' | 'LOGOP' | 'ASSIGN' | 'DELIMITER';
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

  const keywords = new Set(['if', 'else', 'while', 'for', 'int', 'boolean', 'return', 'void', 'true', 'false', 'this', 'class', 'new']);

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

    // Comentarios de una línea
    if (ch === '/' && source[pos + 1] === '/') {
      while (pos < source.length && source[pos] !== '\n') pos++;
      continue;
    }

    // Comentarios multilínea /* ... */
    if (ch === '/' && source[pos + 1] === '*') {
      pos += 2;
      while (pos < source.length && !(source[pos] === '*' && source[pos + 1] === '/')) {
        if (source[pos] === '\n') { line++; col = 1; }
        pos++;
      }
      pos += 2;
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

    // Cadenas de texto literales "..." o '...'
    if (ch === '"' || ch === "'") {
      const quote = ch;
      const startCol = col;
      let val = '';
      pos++; // saltar comilla de apertura
      col++;
      while (pos < source.length && source[pos] !== quote) {
        if (source[pos] === '\\' && pos + 1 < source.length) {
          pos++;
          col++;
          const esc = source[pos];
          if (esc === 'n') val += '\\n';
          else if (esc === 't') val += '\\t';
          else if (esc === '"') val += '\\"';
          else if (esc === "'") val += "\\'";
          else if (esc === '\\') val += '\\\\';
          else val += esc;
        } else {
          val += source[pos];
        }
        pos++;
        col++;
      }
      if (pos < source.length) {
        pos++; // saltar comilla de cierre
        col++;
      }
      tokens.push({ type: 'STRING', value: `"${val}"`, line, col: startCol });
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

    // Operador lógico NOT
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

    // Delimitadores y puntuación (incluyendo punto '.' para this.x)
    if (['(', ')', '{', '}', ';', ',', '[', ']', '.'].includes(ch)) {
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
  function peek(offset = 0): Token | undefined {
    return tokens[tokenIdx + offset];
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
  let currentOffset = -12; // Inicia en -12(fp) según la convención de cátedra

  function getSlot(name: string): number {
    if (!(name in stackSlots)) {
      stackSlots[name] = currentOffset;
      currentOffset -= 4;
    }
    return stackSlots[name];
  }

  // --- PARSEADOR DESCENDENTE RECURSIVO DE EXPRESIONES ---
  function parseExpression(): { ast: ASTNode; place: string } {
    return parseLogicalOr();
  }

  function parseLogicalOr(): { ast: ASTNode; place: string } {
    let { ast: leftNode, place: leftPlace } = parseLogicalAnd();
    while (peek() && peek()!.value === '||') {
      consume('||');
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
      consume('&&');
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

    // Agrupación entre paréntesis
    if (t.value === '(') {
      consume('(');
      const res = parseExpression();
      consume(')');
      return res;
    }

    // Literales numéricos
    if (t.type === 'NUMBER') {
      consume();
      return {
        ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'Literal', value: t.value },
        place: t.value
      };
    }

    // Identificadores, palabras clave (this), arreglos multidimensionales y llamadas a métodos
    if (t.type === 'IDENTIFIER' || t.value === 'this') {
      const baseTok = consume();

      // 1. Acceso a campo de clase: this.saldo o obj.campo (Heap)
      if (peek() && peek()!.value === '.') {
        consume('.');
        const fieldTok = consume();
        const dest = newTemp();
        emitQuad('=[]', baseTok.value, fieldTok.value, dest, `${dest} = Heap[${baseTok.value} + ${fieldTok.value}]`);
        return {
          ast: {
            id: `node_${Math.random().toString(36).substring(2, 7)}`,
            type: 'FieldAccess',
            value: `${baseTok.value}.${fieldTok.value}`
          },
          place: dest
        };
      }

      // 2. Acceso a Arreglos: 1D (arr[i]), 2D (arr[i][j]) y 3D (arr[i][j][k])
      if (peek() && peek()!.value === '[') {
        const indexList: { ast: ASTNode; place: string }[] = [];
        while (peek() && peek()!.value === '[') {
          consume('[');
          indexList.push(parseExpression());
          consume(']');
        }

        const dest = newTemp();
        if (indexList.length === 1) {
          // Arreglo 1D: offset = i * 4
          const tIdx = newTemp();
          emitQuad('*', indexList[0].place, '4', tIdx, `${tIdx} = ${indexList[0].place} * 4`);
          emitQuad('=[]', baseTok.value, tIdx, dest, `${dest} = ${baseTok.value}[${tIdx}]`);
        } else if (indexList.length === 2) {
          // Arreglo 2D según fórmula del Ing. Ramírez Tobar: offset = (i * D2 + j) * 4 (asumiendo D2 = 10)
          const tMul = newTemp();
          const tSum = newTemp();
          const tBytes = newTemp();
          emitQuad('*', indexList[0].place, '10', tMul, `${tMul} = ${indexList[0].place} * 10`);
          emitQuad('+', tMul, indexList[1].place, tSum, `${tSum} = ${tMul} + ${indexList[1].place}`);
          emitQuad('*', tSum, '4', tBytes, `${tBytes} = ${tSum} * 4`);
          emitQuad('=[]', baseTok.value, tBytes, dest, `${dest} = ${baseTok.value}[${tBytes}]`);
        } else {
          // Arreglo 3D o superior
          let tAcc = indexList[0].place;
          for (let dim = 1; dim < indexList.length; dim++) {
            const tMul = newTemp();
            const tSum = newTemp();
            emitQuad('*', tAcc, '10', tMul, `${tMul} = ${tAcc} * 10`);
            emitQuad('+', tMul, indexList[dim].place, tSum, `${tSum} = ${tMul} + ${indexList[dim].place}`);
            tAcc = tSum;
          }
          const tBytes = newTemp();
          emitQuad('*', tAcc, '4', tBytes, `${tBytes} = ${tAcc} * 4`);
          emitQuad('=[]', baseTok.value, tBytes, dest, `${dest} = ${baseTok.value}[${tBytes}]`);
        }

        return {
          ast: {
            id: `node_${Math.random().toString(36).substring(2, 7)}`,
            type: 'ArrayAccess',
            value: `${baseTok.value}${indexList.map(() => '[]').join('')}`,
            children: indexList.map(item => item.ast)
          },
          place: dest
        };
      }

      // 3. Llamada a función: funcion(a, b)
      if (peek() && peek()!.value === '(') {
        consume('(');
        const args: { ast: ASTNode; place: string }[] = [];
        if (peek() && peek()!.value !== ')') {
          args.push(parseExpression());
          while (peek() && peek()!.value === ',') {
            consume(',');
            args.push(parseExpression());
          }
        }
        consume(')');

        for (const arg of args) {
          emitQuad('param', arg.place, '_', '_', `param ${arg.place}`);
        }
        const dest = newTemp();
        emitQuad('call', baseTok.value, `${args.length}`, dest, `${dest} = call ${baseTok.value}, ${args.length}`);
        return {
          ast: {
            id: `node_${Math.random().toString(36).substring(2, 7)}`,
            type: 'FunctionCall',
            value: baseTok.value,
            children: args.map(a => a.ast)
          },
          place: dest
        };
      }

      // Identificador simple
      return {
        ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'Identifier', value: baseTok.value },
        place: baseTok.value
      };
    }

    // 4. Literales booleanos (true / false)
    if (t.value === 'true' || t.value === 'false') {
      const boolTok = consume();
      return {
        ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'BooleanLiteral', value: boolTok.value },
        place: boolTok.value
      };
    }

    // 5. Literales de cadena ("...")
    if (t.type === 'STRING') {
      const strTok = consume();
      return {
        ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'StringLiteral', value: strTok.value },
        place: strTok.value
      };
    }

    // 6. Operador de instanciación new: new int[size] o new Clase()
    if (t.value === 'new') {
      consume('new');
      const typeTok = consume();
      if (peek() && peek()!.value === '[') {
        consume('[');
        const sizeExpr = parseExpression();
        consume(']');
        const dest = newTemp();
        emitQuad('alloc', sizeExpr.place, typeTok.value, dest, `${dest} = alloc(${sizeExpr.place} * 4)`);
        return {
          ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'NewArray', value: `new ${typeTok.value}[]`, children: [sizeExpr.ast] },
          place: dest
        };
      } else if (peek() && peek()!.value === '(') {
        consume('(');
        consume(')');
        const dest = newTemp();
        emitQuad('alloc', '32', typeTok.value, dest, `${dest} = alloc(${typeTok.value})`);
        return {
          ast: { id: `node_${Math.random().toString(36).substring(2, 7)}`, type: 'NewInstance', value: `new ${typeTok.value}()` },
          place: dest
        };
      }
    }

    throw new Error(`Token inesperado en expresión: '${t.value}'`);
  }

  // --- VERIFICADOR LOOKAHEAD PARA ASIGNACIÓN DE ARREGLO ---
  function isArrayAssignmentAhead(start: number): boolean {
    if (start >= tokens.length || tokens[start].type !== 'IDENTIFIER') return false;
    if (start + 1 >= tokens.length || tokens[start + 1].value !== '[') return false;
    let i = start + 1;
    while (i < tokens.length && tokens[i].value === '[') {
      let depth = 0;
      while (i < tokens.length) {
        if (tokens[i].value === '[') depth++;
        else if (tokens[i].value === ']') {
          depth--;
          if (depth === 0) {
            i++;
            break;
          }
        }
        i++;
      }
    }
    return i < tokens.length && tokens[i].value === '=';
  }

  // --- PARSEADOR UNIFICADO DE SENTENCIAS Y BLOQUES RECURSIVOS ---
  const rootAST: ASTNode = {
    id: 'root',
    type: 'Program',
    children: []
  };

  function parseStatementOrBlock(targetList: ASTNode[]) {
    if (peek() && peek()!.value === '{') {
      consume('{');
      while (peek() && peek()!.value !== '}') {
        parseStatement(targetList);
      }
      consume('}');
    } else {
      parseStatement(targetList);
    }
  }

  function parseStatement(targetList: ASTNode[]) {
    const tok = peek();
    if (!tok) return;

    // 1. Punto y coma suelto o vacío
    if (tok.value === ';') {
      consume(';');
      return;
    }

    // 2. Bloque compuesto { ... }
    if (tok.value === '{') {
      parseStatementOrBlock(targetList);
      return;
    }

    // 3. Declaración de clase: class Nombre { ... }
    if (tok.value === 'class') {
      consume('class');
      const className = consume().value;
      if (peek() && peek()!.value === '{') {
        consume('{');
        while (peek() && peek()!.value !== '}') {
          parseStatement(targetList);
        }
        consume('}');
      }
      return;
    }

    // 4. Declaración de método o variable tipada: int x = expr; o int[] arr = expr; o int metodo(int a) { ... }
    if (tok.value === 'int' || tok.value === 'boolean' || tok.value === 'void' || tok.value === 'String') {
      consume(); // tipo
      // Soporte para arreglos tipados tipo Java: int[] arr
      while (peek() && peek()!.value === '[') {
        consume('[');
        if (peek() && peek()!.value !== ']') parseExpression();
        consume(']');
      }
      const idTok = consume();

      // ¿Es declaración de método? int nombre(...) { ... }
      if (peek() && peek()!.value === '(') {
        consume('(');
        while (peek() && peek()!.value !== ')') {
          consume();
        }
        consume(')');
        emitQuad('label', '_', '_', idTok.value, `${idTok.value}:`);
        parseStatementOrBlock(targetList);
        return;
      }

      // Arreglo declarado: int arr[10]; o int[] arr = ...;
      if (peek() && peek()!.value === '[') {
        while (peek() && peek()!.value === '[') {
          consume('[');
          if (peek() && peek()!.value !== ']') parseExpression();
          consume(']');
        }
      }

      if (peek() && peek()!.value === '=') {
        consume('=');
        const expr = parseExpression();
        if (peek() && peek()!.value === ';') consume(';');
        emitQuad('=', expr.place, '_', idTok.value, `${idTok.value} = ${expr.place}`);
        targetList.push({
          id: `node_${Math.random().toString(36).substring(2, 7)}`,
          type: 'Assignment',
          value: idTok.value,
          right: expr.ast
        });
      } else {
        if (peek() && peek()!.value === ';') consume(';');
      }
      return;
    }

    // 5. return expr;
    if (tok.value === 'return') {
      consume('return');
      if (peek() && peek()!.value !== ';') {
        const retExpr = parseExpression();
        if (peek() && peek()!.value === ';') consume(';');
        emitQuad('return', retExpr.place, '_', '_', `return ${retExpr.place}`);
        targetList.push({
          id: `node_${Math.random().toString(36).substring(2, 7)}`,
          type: 'Return',
          value: retExpr.place,
          right: retExpr.ast
        });
      } else {
        if (peek() && peek()!.value === ';') consume(';');
        emitQuad('return', '0', '_', '_', `return 0`);
      }
      return;
    }

    // 6. if (cond) { ... } else { ... }
    if (tok.value === 'if') {
      consume('if');
      consume('(');
      const cond = parseExpression();
      consume(')');

      const labelTrue = newLabel();
      const labelFalse = newLabel();
      const labelEnd = newLabel();

      emitQuad('if', cond.place, '_', labelTrue, `if ${cond.place} goto ${labelTrue}`);
      emitQuad('goto', '_', '_', labelFalse, `goto ${labelFalse}`);
      emitQuad('label', '_', '_', labelTrue, `${labelTrue}:`);

      parseStatementOrBlock(targetList);

      emitQuad('goto', '_', '_', labelEnd, `goto ${labelEnd}`);
      emitQuad('label', '_', '_', labelFalse, `${labelFalse}:`);

      if (peek() && peek()!.value === 'else') {
        consume('else');
        parseStatementOrBlock(targetList);
      }
      emitQuad('label', '_', '_', labelEnd, `${labelEnd}:`);
      return;
    }

    // 7. while (cond) { ... }
    if (tok.value === 'while') {
      consume('while');
      const lCond = newLabel();
      const lBody = newLabel();
      const lEnd = newLabel();

      emitQuad('label', '_', '_', lCond, `${lCond}:`);
      consume('(');
      const cond = parseExpression();
      consume(')');

      emitQuad('if', cond.place, '_', lBody, `if ${cond.place} goto ${lBody}`);
      emitQuad('goto', '_', '_', lEnd, `goto ${lEnd}`);
      emitQuad('label', '_', '_', lBody, `${lBody}:`);

      parseStatementOrBlock(targetList);

      emitQuad('goto', '_', '_', lCond, `goto ${lCond}`);
      emitQuad('label', '_', '_', lEnd, `${lEnd}:`);
      return;
    }

    // 8. Campo de objeto: this.saldo = expr; o obj.campo = expr;
    if ((tok.type === 'IDENTIFIER' || tok.value === 'this') && peek(1) && peek(1)!.value === '.') {
      const baseId = consume().value;
      consume('.');
      const fieldId = consume().value;
      if (peek() && peek()!.value === '=') {
        consume('=');
        const expr = parseExpression();
        if (peek() && peek()!.value === ';') consume(';');
        emitQuad('[]=', baseId, fieldId, expr.place, `Heap[${baseId} + ${fieldId}] = ${expr.place}`);
        targetList.push({
          id: `node_${Math.random().toString(36).substring(2, 7)}`,
          type: 'FieldAssignment',
          value: `${baseId}.${fieldId}`,
          right: expr.ast
        });
        return;
      }
    }

    // 9. Asignación a arreglo: arr[i] = expr; o matriz[i][j] = expr;
    if (tok.type === 'IDENTIFIER' && peek(1) && peek(1)!.value === '[' && isArrayAssignmentAhead(tokenIdx)) {
      const arrId = consume().value;
      const indexList: { ast: ASTNode; place: string }[] = [];
      while (peek() && peek()!.value === '[') {
        consume('[');
        indexList.push(parseExpression());
        consume(']');
      }

      consume('=');
      const expr = parseExpression();
      if (peek() && peek()!.value === ';') consume(';');

      if (indexList.length === 1) {
        const tIdx = newTemp();
        emitQuad('*', indexList[0].place, '4', tIdx, `${tIdx} = ${indexList[0].place} * 4`);
        emitQuad('[]=', arrId, tIdx, expr.place, `${arrId}[${tIdx}] = ${expr.place}`);
      } else {
        const tMul = newTemp();
        const tSum = newTemp();
        const tBytes = newTemp();
        emitQuad('*', indexList[0].place, '10', tMul, `${tMul} = ${indexList[0].place} * 10`);
        emitQuad('+', tMul, indexList[1].place, tSum, `${tSum} = ${tMul} + ${indexList[1].place}`);
        emitQuad('*', tSum, '4', tBytes, `${tBytes} = ${tSum} * 4`);
        emitQuad('[]=', arrId, tBytes, expr.place, `${arrId}[${tBytes}] = ${expr.place}`);
      }

      targetList.push({
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'ArrayAssignment',
        value: `${arrId}[]`,
        right: expr.ast
      });
      return;
    }

    // 10. Asignación simple: x = expr;
    if (tok.type === 'IDENTIFIER' && peek(1) && peek(1)!.value === '=') {
      const idTok = consume();
      consume('=');
      const expr = parseExpression();
      if (peek() && peek()!.value === ';') consume(';');
      emitQuad('=', expr.place, '_', idTok.value, `${idTok.value} = ${expr.place}`);
      targetList.push({
        id: `node_${Math.random().toString(36).substring(2, 7)}`,
        type: 'Assignment',
        value: idTok.value,
        right: expr.ast
      });
      return;
    }

    // 10.5 Salida por consola: System.out.println(...) o print(...)
    if (tok.value === 'System' || tok.value === 'print' || tok.value === 'println') {
      while (peek() && peek()!.value !== '(' && peek()!.value !== ';') {
        consume();
      }
      if (peek() && peek()!.value === '(') {
        consume('(');
        let argExpr: { ast: ASTNode; place: string } | null = null;
        if (peek() && peek()!.value !== ')') {
          argExpr = parseExpression();
        }
        consume(')');
        if (peek() && peek()!.value === ';') consume(';');
        const argPlace = argExpr ? argExpr.place : '""';
        emitQuad('param', argPlace, '_', '_', `param ${argPlace}`);
        emitQuad('call', 'println', '1', '_', `call println, 1`);
        targetList.push({
          id: `node_${Math.random().toString(36).substring(2, 7)}`,
          type: 'ConsolePrint',
          value: 'System.out.println',
          children: argExpr ? [argExpr.ast] : []
        });
        return;
      }
    }

    // 11. Expresión suelta (ej: matriz[i][j] + 5; o x = 5 + 1 > y * 2; o funcion(a, b);)
    const expr = parseExpression();
    if (peek() && peek()!.value === ';') consume(';');
    targetList.push(expr.ast);
  }

  try {
    while (tokenIdx < tokens.length) {
      parseStatement(rootAST.children!);
    }
  } catch (err: any) {
    errors.push(`Error de sintaxis: ${err.message}`);
  }

  // --- TRADUCCIÓN A ENSAMBLADOR RISC-V RV32I COMPLETA ---
  riscvLines.push('# --- Prólogo canónico del subprograma ---');
  riscvLines.push('  addi sp, sp, -32        # Reservar 32B en Pila (múltiplo de 16)');
  riscvLines.push('  sw   ra, 28(sp)         # Salvar dirección de retorno');
  riscvLines.push('  sw   s0, 24(sp)         # Salvar Frame Pointer anterior');
  riscvLines.push('  addi s0, sp, 32         # Fijar s0/fp como ancla base inmutable\n');

  for (const q of quadruples) {
    // 1. Asignación directa x = y o x = num
    if (q.op === '=') {
      const isNum = /^[0-9]+$/.test(q.arg1);
      const destSlot = getSlot(q.dest);

      if (isNum) {
        riscvLines.push(`  li   t0, ${q.arg1}`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)      # ${q.dest} = ${q.arg1}`);
      } else if (q.arg1 === 'true') {
        riscvLines.push(`  li   t0, 1                   # ${q.dest} = true (1)`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)`);
      } else if (q.arg1 === 'false') {
        riscvLines.push(`  li   t0, 0                   # ${q.dest} = false (0)`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)`);
      } else if (q.arg1.startsWith('"')) {
        riscvLines.push(`  la   t0, str_literal         # Dirección de cadena literal`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)      # ${q.dest} = ${q.arg1}`);
      } else {
        const srcSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   t0, ${srcSlot}(s0)      # Leer ${q.arg1}`);
        riscvLines.push(`  sw   t0, ${destSlot}(s0)      # ${q.dest} = ${q.arg1}`);
      }
    }
    // 2. Operaciones aritméticas +, -, *, /, %
    else if (['+', '-', '*', '/', '%'].includes(q.op)) {
      const destSlot = getSlot(q.dest);
      const loadOperand = (arg: string, reg: string) => {
        if (/^[0-9]+$/.test(arg)) {
          riscvLines.push(`  li   ${reg}, ${arg}`);
        } else if (arg === 'true') {
          riscvLines.push(`  li   ${reg}, 1`);
        } else if (arg === 'false') {
          riscvLines.push(`  li   ${reg}, 0`);
        } else if (arg.startsWith('"')) {
          riscvLines.push(`  la   ${reg}, str_literal`);
        } else {
          const slot = getSlot(arg);
          riscvLines.push(`  lw   ${reg}, ${slot}(s0)      # Cargar ${arg}`);
        }
      };

      loadOperand(q.arg1, 't0');
      loadOperand(q.arg2, 't1');

      const opMap: Record<string, string> = { '+': 'add', '-': 'sub', '*': 'mul', '/': 'div', '%': 'rem' };
      riscvLines.push(`  ${opMap[q.op]}  t2, t0, t1       # t2 = ${q.arg1} ${q.op} ${q.arg2}`);
      riscvLines.push(`  sw   t2, ${destSlot}(s0)      # Guardar en ${q.dest}`);
    }
    // 3. Operaciones relacionales: >, <, >=, <=, ==, !=
    else if (['>', '<', '>=', '<=', '==', '!='].includes(q.op)) {
      const destSlot = getSlot(q.dest);
      const loadOperand = (arg: string, reg: string) => {
        if (/^[0-9]+$/.test(arg)) {
          riscvLines.push(`  li   ${reg}, ${arg}`);
        } else if (arg === 'true') {
          riscvLines.push(`  li   ${reg}, 1`);
        } else if (arg === 'false') {
          riscvLines.push(`  li   ${reg}, 0`);
        } else if (arg.startsWith('"')) {
          riscvLines.push(`  la   ${reg}, str_literal`);
        } else {
          const slot = getSlot(arg);
          riscvLines.push(`  lw   ${reg}, ${slot}(s0)      # Cargar ${arg}`);
        }
      };

      loadOperand(q.arg1, 't0');
      loadOperand(q.arg2, 't1');

      if (q.op === '>') {
        riscvLines.push(`  slt  t2, t1, t0       # t2 = 1 si (${q.arg1} > ${q.arg2})`);
      } else if (q.op === '<') {
        riscvLines.push(`  slt  t2, t0, t1       # t2 = 1 si (${q.arg1} < ${q.arg2})`);
      } else if (q.op === '>=') {
        riscvLines.push(`  slt  t2, t0, t1`);
        riscvLines.push(`  xori t2, t2, 1        # t2 = 1 si (${q.arg1} >= ${q.arg2})`);
      } else if (q.op === '<=') {
        riscvLines.push(`  slt  t2, t1, t0`);
        riscvLines.push(`  xori t2, t2, 1        # t2 = 1 si (${q.arg1} <= ${q.arg2})`);
      } else if (q.op === '==') {
        riscvLines.push(`  sub  t2, t0, t1`);
        riscvLines.push(`  seqz t2, t2           # t2 = 1 si (${q.arg1} == ${q.arg2})`);
      } else if (q.op === '!=') {
        riscvLines.push(`  sub  t2, t0, t1`);
        riscvLines.push(`  snez t2, t2           # t2 = 1 si (${q.arg1} != ${q.arg2})`);
      }
      riscvLines.push(`  sw   t2, ${destSlot}(s0)      # Guardar valor booleano en ${q.dest}`);
    }
    // 4. Lectura de Arreglo / Heap: dest = base[offset]
    else if (q.op === '=[]') {
      const destSlot = getSlot(q.dest);
      if (q.arg1 === 'this') {
        riscvLines.push(`  lw   t0, -8(s0)         # Cargar puntero this (Heap)`);
      } else {
        const baseSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   t0, ${baseSlot}(s0)      # Dirección base de ${q.arg1}`);
      }
      if (/^[0-9]+$/.test(q.arg2)) {
        riscvLines.push(`  addi t0, t0, ${q.arg2}`);
      } else {
        const offSlot = getSlot(q.arg2);
        riscvLines.push(`  lw   t1, ${offSlot}(s0)      # Desplazamiento ${q.arg2}`);
        riscvLines.push(`  add  t0, t0, t1`);
      }
      riscvLines.push(`  lw   t2, 0(t0)          # Cargar valor de memoria`);
      riscvLines.push(`  sw   t2, ${destSlot}(s0)      # Guardar en ${q.dest}`);
    }
    // 5. Escritura en Arreglo / Heap: base[offset] = val
    else if (q.op === '[]=') {
      if (q.arg1 === 'this') {
        riscvLines.push(`  lw   t0, -8(s0)         # Cargar puntero this (Heap)`);
      } else {
        const baseSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   t0, ${baseSlot}(s0)      # Dirección base de ${q.arg1}`);
      }
      if (/^[0-9]+$/.test(q.arg2)) {
        riscvLines.push(`  addi t0, t0, ${q.arg2}`);
      } else {
        const offSlot = getSlot(q.arg2);
        riscvLines.push(`  lw   t1, ${offSlot}(s0)      # Desplazamiento ${q.arg2}`);
        riscvLines.push(`  add  t0, t0, t1`);
      }
      if (/^[0-9]+$/.test(q.dest)) {
        riscvLines.push(`  li   t2, ${q.dest}           # Valor constante`);
      } else {
        const valSlot = getSlot(q.dest);
        riscvLines.push(`  lw   t2, ${valSlot}(s0)       # Cargar valor ${q.dest}`);
      }
      riscvLines.push(`  sw   t2, 0(t0)          # Guardar en memoria Heap / Arreglo`);
    }
    // 6. Etiquetas y Saltos
    else if (q.op === 'label') {
      if (q.dest.startsWith('et') || q.dest.startsWith('L_')) {
        riscvLines.push(`.${q.dest}:`);
      } else {
        riscvLines.push(`\n.globl ${q.dest}\n${q.dest}:`);
      }
    } else if (q.op === 'goto') {
      const target = q.dest.startsWith('et') || q.dest.startsWith('L_') ? `.${q.dest}` : q.dest;
      riscvLines.push(`  j    ${target}              # Salto incondicional`);
    } else if (q.op === 'if') {
      const target = q.dest.startsWith('et') || q.dest.startsWith('L_') ? `.${q.dest}` : q.dest;
      if (/^[0-9]+$/.test(q.arg1)) {
        riscvLines.push(`  li   t0, ${q.arg1}`);
      } else {
        const condSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   t0, ${condSlot}(s0)`);
      }
      riscvLines.push(`  bne  t0, zero, ${target}    # if (${q.arg1} != 0) goto ${target}`);
    }
    // 7. Parámetros, Llamadas y Asignación Dinámica
    else if (q.op === 'alloc') {
      const destSlot = getSlot(q.dest);
      riscvLines.push(`  li   t0, 0x1020              # Asignar bloque de memoria en Heap`);
      riscvLines.push(`  sw   t0, ${destSlot}(s0)      # Guardar dirección base`);
    } else if (q.op === 'param') {
      if (q.arg1 === 'true') {
        riscvLines.push(`  li   a0, 1                   # Parámetro booleano true`);
      } else if (q.arg1 === 'false') {
        riscvLines.push(`  li   a0, 0                   # Parámetro booleano false`);
      } else if (/^[0-9]+$/.test(q.arg1)) {
        riscvLines.push(`  li   a0, ${q.arg1}           # Parámetro constante`);
      } else if (q.arg1.startsWith('"')) {
        riscvLines.push(`  la   a0, str_literal         # Dirección de cadena literal`);
      } else {
        const pSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   a0, ${pSlot}(s0)         # Parámetro en a0`);
      }
    } else if (q.op === 'call') {
      if (q.arg1 === 'println' || q.arg1 === 'print') {
        riscvLines.push(`  li   a7, 4                   # Syscall ecall 4 (print_string)`);
        riscvLines.push(`  ecall`);
      } else {
        riscvLines.push(`  jal  ra, ${q.arg1}            # Invocación a subprograma`);
        if (q.dest && q.dest !== '_') {
          const destSlot = getSlot(q.dest);
          riscvLines.push(`  sw   a0, ${destSlot}(s0)      # Guardar retorno de a0 en ${q.dest}`);
        }
      }
    } else if (q.op === 'return') {
      if (/^[0-9]+$/.test(q.arg1)) {
        riscvLines.push(`  li   a0, ${q.arg1}           # Retorno constante`);
      } else {
        const retSlot = getSlot(q.arg1);
        riscvLines.push(`  lw   a0, ${retSlot}(s0)      # Retorno en a0`);
      }
      riscvLines.push(`  j    .L_EPILOGO`);
    }
  }

  riscvLines.push('\n.L_EPILOGO:');
  riscvLines.push('  # --- Epílogo canónico ---');
  riscvLines.push('  lw   ra, 28(sp)         # Restaurar ra');
  riscvLines.push('  lw   s0, 24(sp)         # Restaurar s0/fp');
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
