// src/utils/sddParser.ts
// Motor formal de Eliminación de Recursividad Izquierda y Evaluación de Definiciones Dirigidas por la Sintaxis (DDS/SDD)
// Basado en el material de cátedra oficial del Ing. Mario Ramírez Tobar:
// "Traducción Dirigida por la sintaxis y comprobación de tipos"

export interface LeftRecursionItem {
  head: string;
  isRecursive: boolean;
  originalAlts: string[];
  alphas: string[]; // Sufijos tras el no-terminal recursivo
  betas: string[];  // Producciones base que no inician con el no-terminal
  auxHead: string;  // Símbolo auxiliar generado (ej: E')
  transformedRules: string[];
  warning?: string;
  explanation: string;
}

export interface LeftRecursionResult {
  items: LeftRecursionItem[];
  allTransformedText: string;
  totalRecursive: number;
}

/**
 * Elimina la recursividad izquierda directa de una gramática libre de contexto,
 * tratando las acciones semánticas { ... } como símbolos terminales según
 * la regla de la diapositiva 38 de Mario Ramírez Tobar:
 * "Al transformar la gramática, trate a las acciones como si fueran símbolos terminales."
 */
export function eliminateLeftRecursion(grammarText: string): LeftRecursionResult {
  const lines = grammarText
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0 && !l.startsWith('//') && !l.startsWith('#'));

  const rulesMap: Map<string, string[]> = new Map();

  for (const line of lines) {
    let sep = '->';
    if (line.includes('->')) sep = '->';
    else if (line.includes('→')) sep = '→';
    else if (line.includes('::=')) sep = '::=';
    else continue;

    const parts = line.split(sep);
    const head = parts[0].trim();
    const bodyStr = parts.slice(1).join(sep).trim();

    // Separar alternativas por '|' respetando bloques de llaves { ... }
    const alts: string[] = [];
    let cur = '';
    let depth = 0;
    for (let i = 0; i < bodyStr.length; i++) {
      const ch = bodyStr[i];
      if (ch === '{') {
        depth++;
        cur += ch;
      } else if (ch === '}') {
        depth--;
        cur += ch;
      } else if (ch === '|' && depth === 0) {
        if (cur.trim()) alts.push(cur.trim());
        cur = '';
      } else {
        cur += ch;
      }
    }
    if (cur.trim()) alts.push(cur.trim());

    if (!rulesMap.has(head)) {
      rulesMap.set(head, []);
    }
    rulesMap.get(head)!.push(...alts);
  }

  const items: LeftRecursionItem[] = [];
  let totalRecursive = 0;

  for (const [head, alts] of rulesMap.entries()) {
    const alphas: string[] = [];
    const betas: string[] = [];

    for (const alt of alts) {
      const trimmed = alt.trim();
      // Comprobar si alt empieza exactamente con 'head' como token individual
      const regex = new RegExp(`^${escapeRegex(head)}(\\s+.*|\\{.*|$)`);
      const match = trimmed.match(regex);
      if (match) {
        let alpha = match[1]?.trim() || '';
        if (!alpha) alpha = 'ε';
        alphas.push(alpha);
      } else {
        betas.push(trimmed);
      }
    }

    const isRecursive = alphas.length > 0;
    if (isRecursive) totalRecursive++;

    const auxHead = head.endsWith("'") ? `${head}'` : `${head}'`;
    let warning: string | undefined;

    if (isRecursive && betas.length === 0) {
      warning = `¡Atención! El no-terminal ${head} no posee caso base (β). Se añadió ε para evitar bloqueo de derivación.`;
      betas.push('ε');
    }

    const transformedRules: string[] = [];
    let explanation = '';

    if (isRecursive) {
      // Regla formal:
      // A -> beta1 A' | beta2 A' ...
      // A' -> alpha1 A' | alpha2 A' ... | ε
      const newHeadAlts = betas.map(b => (b === 'ε' ? auxHead : `${b} ${auxHead}`));
      const newAuxAlts = alphas.map(a => `${a} ${auxHead}`).concat(['ε']);

      transformedRules.push(`${head} -> ${newHeadAlts.join(' | ')}`);
      transformedRules.push(`${auxHead} -> ${newAuxAlts.join(' | ')}`);

      explanation = `Se detectaron ${alphas.length} rama(s) recursiva(s) (α) y ${betas.length} caso(s) base (β). Las acciones semánticas se mantuvieron fijas en sus respectivos sufijos α o β.`;
    } else {
      transformedRules.push(`${head} -> ${alts.join(' | ')}`);
      explanation = `La producción ${head} no tiene recursividad izquierda directa (ninguna alternativa inicia con '${head}').`;
    }

    items.push({
      head,
      isRecursive,
      originalAlts: alts,
      alphas,
      betas,
      auxHead,
      transformedRules,
      warning,
      explanation
    });
  }

  const allTransformedText = items.map(item => item.transformedRules.join('\n')).join('\n');

  return {
    items,
    allTransformedText,
    totalRecursive
  };
}

function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// -------------------------------------------------------------
// MODELO DE DATOS PARA ÁRBOLES ANOTADOS Y GRAFOS DE DEPENDENCIA
// -------------------------------------------------------------

export interface SddNode {
  id: number;
  sym: string;
  isTerminal?: boolean;
  children: SddNode[];
  attrs: Record<string, number | boolean | string>;
  // Coordenadas calculadas para el renderizado SVG
  x: number;
  y: number;
  width: number;
}

export interface SddAttributeRef {
  nodeId: number;
  nodeSym: string;
  attrName: string;
  attrType: 'inherited' | 'synthesized' | 'lexical';
  value: number | boolean | string;
  x: number;
  y: number;
}

export interface DependencyEdge {
  id: string;
  from: SddAttributeRef;
  to: SddAttributeRef;
  ruleDesc: string;
  edgeType: 'inherited' | 'synthesized';
}

export interface EvaluationStep {
  stepNumber: number;
  targetNodeId: number;
  targetSym: string;
  targetAttr: string;
  attrType: 'inherited' | 'synthesized' | 'lexical';
  value: number | boolean | string;
  ruleTitle: string;
  ruleFormula: string;
  calculationStr: string;
  dependencies: string[]; // claves 'nodeId.attr'
}

export interface SddTreeResult {
  root: SddNode;
  nodesList: SddNode[];
  attributesList: SddAttributeRef[];
  edgesList: DependencyEdge[];
  stepsList: EvaluationStep[];
  finalResult: number | boolean | string;
  svgWidth: number;
  svgHeight: number;
  grammarTitle: string;
  grammarType: 'arithmetic' | 'multiplication' | 'boolean';
  expression: string;
}

/**
 * Detecta automáticamente si una expresión es de tipo boolean, multiplicación o aritmética estándar.
 */
export function detectGrammarType(expr: string): 'arithmetic' | 'multiplication' | 'boolean' {
  const lower = expr.toLowerCase();
  if (
    lower.includes('and') ||
    lower.includes('or') ||
    lower.includes('not') ||
    lower.includes('true') ||
    lower.includes('false') ||
    lower.includes('&&') ||
    lower.includes('||') ||
    lower.includes('!')
  ) {
    return 'boolean';
  }
  if (lower.includes('+') || lower.includes('(') || lower.includes(')')) {
    return 'arithmetic';
  }
  if (lower.includes('*') && !lower.includes('+')) {
    return 'multiplication';
  }
  return 'arithmetic';
}

// -------------------------------------------------------------
// GRAMÁTICA 1: ARITMÉTICA (+, *) SIN RECURSIVIDAD IZQUIERDA
// Basada en diapositivas 31 y 34 de Mario Ramírez Tobar
// -------------------------------------------------------------

interface Token {
  type: string;
  val?: number;
  boolVal?: boolean;
}

function tokenizeArithmetic(input: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) {
      i++;
    } else if (/\d/.test(c)) {
      let numStr = '';
      while (i < input.length && /\d/.test(input[i])) {
        numStr += input[i];
        i++;
      }
      tokens.push({ type: 'NUM', val: parseInt(numStr, 10) });
    } else if (c === '+' || c === '*' || c === '(' || c === ')') {
      tokens.push({ type: c });
      i++;
    } else {
      i++;
    }
  }
  tokens.push({ type: 'EOF' });
  return tokens;
}

export function parseArithmeticSdd(expression: string): SddTreeResult {
  const tokens = tokenizeArithmetic(expression);
  let tokenIdx = 0;
  let nodeCounter = 0;

  function peek(): Token {
    return tokens[tokenIdx];
  }

  function consume(expected?: string): Token {
    const tok = tokens[tokenIdx];
    if (expected && tok.type !== expected) {
      throw new Error(`Se esperaba token '${expected}' pero se encontró '${tok.type}'`);
    }
    tokenIdx++;
    return tok;
  }

  function createNode(sym: string, isTerminal = false): SddNode {
    nodeCounter++;
    return {
      id: nodeCounter,
      sym,
      isTerminal,
      children: [],
      attrs: {},
      x: 0,
      y: 0,
      width: 0
    };
  }

  function parseL(): SddNode {
    const node = createNode('L');
    const eNode = parseE();
    node.children.push(eNode);
    return node;
  }

  function parseE(): SddNode {
    const node = createNode('E');
    const tNode = parseT();
    const epNode = parseEp();
    node.children.push(tNode, epNode);
    return node;
  }

  function parseEp(): SddNode {
    const node = createNode("E'");
    if (peek().type === '+') {
      const plusTok = consume('+');
      const plusNode = createNode('+', true);
      const tNode = parseT();
      const ep1Node = parseEp();
      node.children.push(plusNode, tNode, ep1Node);
    } else {
      const epsNode = createNode('ε', true);
      node.children.push(epsNode);
    }
    return node;
  }

  function parseT(): SddNode {
    const node = createNode('T');
    const fNode = parseF();
    const tpNode = parseTp();
    node.children.push(fNode, tpNode);
    return node;
  }

  function parseTp(): SddNode {
    const node = createNode("T'");
    if (peek().type === '*') {
      const mulTok = consume('*');
      const mulNode = createNode('*', true);
      const fNode = parseF();
      const tp1Node = parseTp();
      node.children.push(mulNode, fNode, tp1Node);
    } else {
      const epsNode = createNode('ε', true);
      node.children.push(epsNode);
    }
    return node;
  }

  function parseF(): SddNode {
    const node = createNode('F');
    if (peek().type === '(') {
      const lpar = createNode('(', true);
      consume('(');
      const eNode = parseE();
      const rpar = createNode(')', true);
      consume(')');
      node.children.push(lpar, eNode, rpar);
    } else if (peek().type === 'NUM') {
      const numTok = consume('NUM');
      const numNode = createNode('digito', true);
      numNode.attrs['valex'] = numTok.val || 0;
      node.children.push(numNode);
    } else {
      throw new Error(`Token inesperado en F: '${peek().type}'`);
    }
    return node;
  }

  const root = parseL();

  // Recolectar nodos
  const nodesList: SddNode[] = [];
  function collectNodes(n: SddNode) {
    nodesList.push(n);
    for (const c of n.children) collectNodes(c);
  }
  collectNodes(root);

  const stepsList: EvaluationStep[] = [];
  const edgesList: DependencyEdge[] = [];

  function addStep(
    targetNode: SddNode,
    targetAttr: string,
    attrType: 'inherited' | 'synthesized' | 'lexical',
    value: number,
    ruleTitle: string,
    ruleFormula: string,
    calcStr: string,
    depKeys: string[]
  ) {
    targetNode.attrs[targetAttr] = value;
    stepsList.push({
      stepNumber: stepsList.length + 1,
      targetNodeId: targetNode.id,
      targetSym: targetNode.sym,
      targetAttr,
      attrType,
      value,
      ruleTitle,
      ruleFormula,
      calculationStr: calcStr,
      dependencies: depKeys
    });
  }

  function evalF(node: SddNode) {
    if (node.children.length === 1 && node.children[0].sym === 'digito') {
      const dig = node.children[0];
      const valex = Number(dig.attrs['valex'] || 0);
      addStep(
        dig,
        'valex',
        'lexical',
        valex,
        'Escáner Léxico',
        'digito.valex',
        `Token constante = ${valex}`,
        []
      );

      addStep(
        node,
        'val',
        'synthesized',
        valex,
        'F -> digito',
        'F.val = digito.valex',
        `F.val = ${valex}`,
        [`${dig.id}.valex`]
      );
    } else if (node.children.length === 3 && node.children[0].sym === '(') {
      const eNode = node.children[1];
      evalE(eNode);
      const val = Number(eNode.attrs['val'] || 0);
      addStep(
        node,
        'val',
        'synthesized',
        val,
        'F -> ( E )',
        'F.val = E.val',
        `F.val = E.val = ${val}`,
        [`${eNode.id}.val`]
      );
    }
  }

  function evalTp(node: SddNode) {
    if (node.children.length === 3 && node.children[0].sym === '*') {
      const fNode = node.children[1];
      const tp1Node = node.children[2];
      evalF(fNode);

      const fVal = Number(fNode.attrs['val'] || 0);
      const herVal = Number(node.attrs['her'] || 0);
      const newHer = herVal * fVal;

      addStep(
        tp1Node,
        'her',
        'inherited',
        newHer,
        "T' -> * F T'1",
        "T'1.her = T'.her * F.val",
        `T'1.her = ${herVal} * ${fVal} = ${newHer}`,
        [`${node.id}.her`, `${fNode.id}.val`]
      );

      evalTp(tp1Node);
      const sinVal = Number(tp1Node.attrs['sin'] || 0);

      addStep(
        node,
        'sin',
        'synthesized',
        sinVal,
        "T' -> * F T'1",
        "T'.sin = T'1.sin",
        `T'.sin = T'1.sin = ${sinVal}`,
        [`${tp1Node.id}.sin`]
      );
    } else if (node.children.length === 1 && node.children[0].sym === 'ε') {
      const herVal = Number(node.attrs['her'] || 0);
      addStep(
        node,
        'sin',
        'synthesized',
        herVal,
        "T' -> ε",
        "T'.sin = T'.her",
        `T'.sin = T'.her = ${herVal}`,
        [`${node.id}.her`]
      );
    }
  }

  function evalT(node: SddNode) {
    const fNode = node.children[0];
    const tpNode = node.children[1];
    evalF(fNode);

    const fVal = Number(fNode.attrs['val'] || 0);
    addStep(
      tpNode,
      'her',
      'inherited',
      fVal,
      "T -> F T'",
      "T'.her = F.val",
      `T'.her = ${fVal}`,
      [`${fNode.id}.val`]
    );

    evalTp(tpNode);
    const sinVal = Number(tpNode.attrs['sin'] || 0);

    addStep(
      node,
      'val',
      'synthesized',
      sinVal,
      "T -> F T'",
      "T.val = T'.sin",
      `T.val = T'.sin = ${sinVal}`,
      [`${tpNode.id}.sin`]
    );
  }

  function evalEp(node: SddNode) {
    if (node.children.length === 3 && node.children[0].sym === '+') {
      const tNode = node.children[1];
      const ep1Node = node.children[2];
      evalT(tNode);

      const tVal = Number(tNode.attrs['val'] || 0);
      const herVal = Number(node.attrs['her'] || 0);
      const newHer = herVal + tVal;

      addStep(
        ep1Node,
        'her',
        'inherited',
        newHer,
        "E' -> + T E'1",
        "E'1.her = E'.her + T.val",
        `E'1.her = ${herVal} + ${tVal} = ${newHer}`,
        [`${node.id}.her`, `${tNode.id}.val`]
      );

      evalEp(ep1Node);
      const sinVal = Number(ep1Node.attrs['sin'] || 0);

      addStep(
        node,
        'sin',
        'synthesized',
        sinVal,
        "E' -> + T E'1",
        "E'.sin = E'1.sin",
        `E'.sin = E'1.sin = ${sinVal}`,
        [`${ep1Node.id}.sin`]
      );
    } else if (node.children.length === 1 && node.children[0].sym === 'ε') {
      const herVal = Number(node.attrs['her'] || 0);
      addStep(
        node,
        'sin',
        'synthesized',
        herVal,
        "E' -> ε",
        "E'.sin = E'.her",
        `E'.sin = E'.her = ${herVal}`,
        [`${node.id}.her`]
      );
    }
  }

  function evalE(node: SddNode) {
    const tNode = node.children[0];
    const epNode = node.children[1];
    evalT(tNode);

    const tVal = Number(tNode.attrs['val'] || 0);
    addStep(
      epNode,
      'her',
      'inherited',
      tVal,
      "E -> T E'",
      "E'.her = T.val",
      `E'.her = ${tVal}`,
      [`${tNode.id}.val`]
    );

    evalEp(epNode);
    const sinVal = Number(epNode.attrs['sin'] || 0);

    addStep(
      node,
      'val',
      'synthesized',
      sinVal,
      "E -> T E'",
      "E.val = E'.sin",
      `E.val = E'.sin = ${sinVal}`,
      [`${epNode.id}.sin`]
    );
  }

  function evalL(node: SddNode) {
    const eNode = node.children[0];
    evalE(eNode);
    const eVal = Number(eNode.attrs['val'] || 0);

    addStep(
      node,
      'val',
      'synthesized',
      eVal,
      'L -> E',
      'L.val = E.val',
      `L.val = E.val = ${eVal}`,
      [`${eNode.id}.val`]
    );
  }

  evalL(root);

  // Layout árbol
  const minNodeWidth = 110;
  const levelHeight = 110;

  function computeSubtreeWidth(n: SddNode): number {
    if (!n.children || n.children.length === 0) {
      n.width = minNodeWidth;
      return minNodeWidth;
    }
    const sumW = n.children.reduce((acc, c) => acc + computeSubtreeWidth(c), 0);
    n.width = Math.max(sumW, minNodeWidth);
    return n.width;
  }
  computeSubtreeWidth(root);

  function layoutTree(n: SddNode, left: number, depth: number) {
    n.y = depth * levelHeight + 60;
    if (!n.children || n.children.length === 0) {
      n.x = left + n.width / 2;
      return;
    }
    const childrenTotalW = n.children.reduce((acc, c) => acc + c.width, 0);
    const extra = Math.max(0, (n.width - childrenTotalW) / 2);
    let curX = left + extra;
    for (const c of n.children) {
      layoutTree(c, curX, depth + 1);
      curX += c.width;
    }
    n.x = (n.children[0].x + n.children[n.children.length - 1].x) / 2;
  }
  layoutTree(root, 40, 0);

  const attributesList: SddAttributeRef[] = [];
  const attrMap: Map<string, SddAttributeRef> = new Map();

  for (const n of nodesList) {
    for (const [attrName, val] of Object.entries(n.attrs)) {
      let attrType: 'inherited' | 'synthesized' | 'lexical' = 'synthesized';
      let offsetX = 0;
      let offsetY = 0;

      if (attrName === 'her' || attrName === 'valh') {
        attrType = 'inherited';
        offsetX = -40;
        offsetY = -12;
      } else if (attrName === 'sin' || attrName === 'total') {
        attrType = 'synthesized';
        offsetX = 40;
        offsetY = -12;
      } else if (attrName === 'val') {
        attrType = 'synthesized';
        offsetX = 36;
        offsetY = 16;
      } else if (attrName === 'valex') {
        attrType = 'lexical';
        offsetX = 0;
        offsetY = 24;
      }

      const attrRef: SddAttributeRef = {
        nodeId: n.id,
        nodeSym: n.sym,
        attrName,
        attrType,
        value: val,
        x: n.x + offsetX,
        y: n.y + offsetY
      };

      attributesList.push(attrRef);
      attrMap.set(`${n.id}.${attrName}`, attrRef);
    }
  }

  for (const step of stepsList) {
    const toRef = attrMap.get(`${step.targetNodeId}.${step.targetAttr}`);
    if (!toRef) continue;

    for (const depKey of step.dependencies) {
      const fromRef = attrMap.get(depKey);
      if (fromRef) {
        edgesList.push({
          id: `edge-${fromRef.nodeId}.${fromRef.attrName}->${toRef.nodeId}.${toRef.attrName}`,
          from: fromRef,
          to: toRef,
          ruleDesc: step.ruleFormula,
          edgeType: toRef.attrType === 'inherited' ? 'inherited' : 'synthesized'
        });
      }
    }
  }

  let maxX = 0;
  let maxY = 0;
  for (const n of nodesList) {
    if (n.x > maxX) maxX = n.x;
    if (n.y > maxY) maxY = n.y;
  }

  return {
    root,
    nodesList,
    attributesList,
    edgesList,
    stepsList,
    finalResult: root.attrs['val'] ?? 0,
    svgWidth: Math.max(maxX + 120, 900),
    svgHeight: maxY + 140,
    grammarTitle: 'Expresiones Aritméticas (+, *) con Atributos Heredados y Sintetizados (Diap. 31 & 34)',
    grammarType: 'arithmetic',
    expression
  };
}

// -------------------------------------------------------------
// GRAMÁTICA 2: MULTIPLICACIÓN PURA CON ATRIBUTOS HEREDADOS
// Basada en diapositivas 24 y 25 de Mario Ramírez Tobar
// -------------------------------------------------------------

export function parseMultiplicationSdd(expression: string): SddTreeResult {
  const tokens = tokenizeArithmetic(expression).filter(t => t.type === 'NUM' || t.type === '*');
  const nums = tokens.filter(t => t.type === 'NUM').map(t => t.val || 1);

  let nodeCounter = 0;
  function createNode(sym: string, isTerminal = false): SddNode {
    nodeCounter++;
    return {
      id: nodeCounter,
      sym,
      isTerminal,
      children: [],
      attrs: {},
      x: 0,
      y: 0,
      width: 0
    };
  }

  const root = createNode('S');
  const tNode = createNode('T');
  root.children.push(tNode);

  if (nums.length === 0) nums.push(1);

  const firstF = createNode('F');
  const firstNum = createNode('num', true);
  firstNum.attrs['val'] = nums[0];
  firstF.children.push(firstNum);
  tNode.children.push(firstF);

  let curTp = createNode("T'");
  tNode.children.push(curTp);

  const tpChain: { tpNode: SddNode; fNode?: SddNode; numVal?: number }[] = [];

  for (let idx = 1; idx < nums.length; idx++) {
    const starNode = createNode('*', true);
    const fNode = createNode('F');
    const numNode = createNode('num', true);
    numNode.attrs['val'] = nums[idx];
    fNode.children.push(numNode);

    const nextTp = createNode("T'");
    curTp.children.push(starNode, fNode, nextTp);
    tpChain.push({ tpNode: curTp, fNode, numVal: nums[idx] });
    curTp = nextTp;
  }

  const lambdaNode = createNode('λ', true);
  curTp.children.push(lambdaNode);
  tpChain.push({ tpNode: curTp });

  const nodesList: SddNode[] = [];
  function collect(n: SddNode) {
    nodesList.push(n);
    for (const c of n.children) collect(c);
  }
  collect(root);

  const stepsList: EvaluationStep[] = [];
  const edgesList: DependencyEdge[] = [];

  function addStep(
    targetNode: SddNode,
    targetAttr: string,
    attrType: 'inherited' | 'synthesized' | 'lexical',
    value: number,
    ruleTitle: string,
    ruleFormula: string,
    calcStr: string,
    depKeys: string[]
  ) {
    targetNode.attrs[targetAttr] = value;
    stepsList.push({
      stepNumber: stepsList.length + 1,
      targetNodeId: targetNode.id,
      targetSym: targetNode.sym,
      targetAttr,
      attrType,
      value,
      ruleTitle,
      ruleFormula,
      calculationStr: calcStr,
      dependencies: depKeys
    });
  }

  addStep(
    firstNum,
    'val',
    'lexical',
    nums[0],
    'Token Léxico',
    'num.val',
    `num.val = ${nums[0]}`,
    []
  );
  addStep(
    firstF,
    'val',
    'synthesized',
    nums[0],
    'F -> num',
    'F.val = num.val',
    `F.val = ${nums[0]}`,
    [`${firstNum.id}.val`]
  );

  const topTp = tNode.children[1];
  addStep(
    topTp,
    'valh',
    'inherited',
    nums[0],
    "T -> F T'",
    "T'.valh = F.val",
    `T'.valh = ${nums[0]}`,
    [`${firstF.id}.val`]
  );

  let curValh = nums[0];
  for (let i = 0; i < tpChain.length - 1; i++) {
    const item = tpChain[i];
    const numVal = item.numVal!;
    const fNode = item.fNode!;
    const nextTpNode = item.tpNode.children[2];

    const numLeaf = fNode.children[0];
    addStep(
      numLeaf,
      'val',
      'lexical',
      numVal,
      'Token Léxico',
      'num.val',
      `num.val = ${numVal}`,
      []
    );
    addStep(
      fNode,
      'val',
      'synthesized',
      numVal,
      'F -> num',
      'F.val = num.val',
      `F.val = ${numVal}`,
      [`${numLeaf.id}.val`]
    );

    const nextValh = curValh * numVal;
    addStep(
      nextTpNode,
      'valh',
      'inherited',
      nextValh,
      "T' -> * F T'1",
      "T'1.valh = T'.valh * F.val",
      `T'1.valh = ${curValh} * ${numVal} = ${nextValh}`,
      [`${item.tpNode.id}.valh`, `${fNode.id}.val`]
    );
    curValh = nextValh;
  }

  const lastTp = tpChain[tpChain.length - 1].tpNode;
  addStep(
    lastTp,
    'total',
    'synthesized',
    curValh,
    "T' -> λ",
    "T'.total = T'.valh",
    `T'.total = ${curValh}`,
    [`${lastTp.id}.valh`]
  );

  for (let i = tpChain.length - 2; i >= 0; i--) {
    const parentTp = tpChain[i].tpNode;
    const childTp = parentTp.children[2];
    addStep(
      parentTp,
      'total',
      'synthesized',
      curValh,
      "T' -> * F T'1",
      "T'.total = T'1.total",
      `T'.total = ${curValh}`,
      [`${childTp.id}.total`]
    );
  }

  addStep(
    tNode,
    'total',
    'synthesized',
    curValh,
    "T -> F T'",
    "T.total = T'.total",
    `T.total = ${curValh}`,
    [`${topTp.id}.total`]
  );

  addStep(
    root,
    'total',
    'synthesized',
    curValh,
    'S -> T',
    'Imprimir(T.total)',
    `Impresión = ${curValh}`,
    [`${tNode.id}.total`]
  );

  const minNodeWidth = 120;
  const levelHeight = 110;

  function computeSubtreeWidth(n: SddNode): number {
    if (!n.children || n.children.length === 0) {
      n.width = minNodeWidth;
      return minNodeWidth;
    }
    const sumW = n.children.reduce((acc, c) => acc + computeSubtreeWidth(c), 0);
    n.width = Math.max(sumW, minNodeWidth);
    return n.width;
  }
  computeSubtreeWidth(root);

  function layoutTree(n: SddNode, left: number, depth: number) {
    n.y = depth * levelHeight + 60;
    if (!n.children || n.children.length === 0) {
      n.x = left + n.width / 2;
      return;
    }
    const childrenTotalW = n.children.reduce((acc, c) => acc + c.width, 0);
    const extra = Math.max(0, (n.width - childrenTotalW) / 2);
    let curX = left + extra;
    for (const c of n.children) {
      layoutTree(c, curX, depth + 1);
      curX += c.width;
    }
    n.x = (n.children[0].x + n.children[n.children.length - 1].x) / 2;
  }
  layoutTree(root, 40, 0);

  const attributesList: SddAttributeRef[] = [];
  const attrMap: Map<string, SddAttributeRef> = new Map();

  for (const n of nodesList) {
    for (const [attrName, val] of Object.entries(n.attrs)) {
      let attrType: 'inherited' | 'synthesized' | 'lexical' = 'synthesized';
      let offsetX = 0;
      let offsetY = 0;

      if (attrName === 'valh') {
        attrType = 'inherited';
        offsetX = -40;
        offsetY = -12;
      } else if (attrName === 'total') {
        attrType = 'synthesized';
        offsetX = 40;
        offsetY = -12;
      } else if (attrName === 'val') {
        attrType = n.isTerminal ? 'lexical' : 'synthesized';
        offsetX = 0;
        offsetY = 20;
      }

      const attrRef: SddAttributeRef = {
        nodeId: n.id,
        nodeSym: n.sym,
        attrName,
        attrType,
        value: val,
        x: n.x + offsetX,
        y: n.y + offsetY
      };
      attributesList.push(attrRef);
      attrMap.set(`${n.id}.${attrName}`, attrRef);
    }
  }

  for (const step of stepsList) {
    const toRef = attrMap.get(`${step.targetNodeId}.${step.targetAttr}`);
    if (!toRef) continue;

    for (const depKey of step.dependencies) {
      const fromRef = attrMap.get(depKey);
      if (fromRef) {
        edgesList.push({
          id: `edge-${fromRef.nodeId}.${fromRef.attrName}->${toRef.nodeId}.${toRef.attrName}`,
          from: fromRef,
          to: toRef,
          ruleDesc: step.ruleFormula,
          edgeType: toRef.attrType === 'inherited' ? 'inherited' : 'synthesized'
        });
      }
    }
  }

  let maxX = 0;
  let maxY = 0;
  for (const n of nodesList) {
    if (n.x > maxX) maxX = n.x;
    if (n.y > maxY) maxY = n.y;
  }

  return {
    root,
    nodesList,
    attributesList,
    edgesList,
    stepsList,
    finalResult: curValh,
    svgWidth: Math.max(maxX + 120, 800),
    svgHeight: maxY + 140,
    grammarTitle: 'Esquema de Multiplicación con Atributos Heredados valh y Sintetizados total (Diap. 24 & 25)',
    grammarType: 'multiplication',
    expression
  };
}

// -------------------------------------------------------------
// GRAMÁTICA 3: EXPRESIONES BOOLEANAS (OR, AND, NOT, TRUE, FALSE)
// Con eliminación de recursividad por la izquierda y DDS L-Atribuida
//
// Gramática original con recursividad izquierda:
// B -> B or T | T
// T -> T and F | F
// F -> not F | ( B ) | true | false
//
// Gramática transformada sin recursividad izquierda (LL):
// L -> B          { L.val = B.val }
// B -> T B'       { B'.her = T.val; B.val = B'.sin }
// B' -> or T B'1  { B'1.her = B'.her or T.val; B'.sin = B'1.sin }
// B' -> ε         { B'.sin = B'.her }
// T -> F T'       { T'.her = F.val; T.val = T'.sin }
// T' -> and F T'1 { T'1.her = T'.her and F.val; T'.sin = T'1.sin }
// T' -> ε         { T'.sin = T'.her }
// F -> not F1     { F.val = not F1.val }
// F -> ( B )      { F.val = B.val }
// F -> true       { F.val = true }
// F -> false      { F.val = false }
// -------------------------------------------------------------

interface BoolToken {
  type: 'OR' | 'AND' | 'NOT' | 'TRUE' | 'FALSE' | '(' | ')' | 'EOF';
  raw: string;
  boolVal?: boolean;
}

function tokenizeBoolean(input: string): BoolToken[] {
  const tokens: BoolToken[] = [];
  let i = 0;
  while (i < input.length) {
    const c = input[i];
    if (/\s/.test(c)) {
      i++;
    } else if (input.slice(i, i + 2) === '||') {
      tokens.push({ type: 'OR', raw: '||' });
      i += 2;
    } else if (input.slice(i, i + 2) === '&&') {
      tokens.push({ type: 'AND', raw: '&&' });
      i += 2;
    } else if (c === '!') {
      tokens.push({ type: 'NOT', raw: '!' });
      i++;
    } else if (c === '(' || c === ')') {
      tokens.push({ type: c, raw: c });
      i++;
    } else if (/[a-zA-Z_]/.test(c)) {
      let word = '';
      while (i < input.length && /[a-zA-Z0-9_]/.test(input[i])) {
        word += input[i];
        i++;
      }
      const lower = word.toLowerCase();
      if (lower === 'or') {
        tokens.push({ type: 'OR', raw: word });
      } else if (lower === 'and') {
        tokens.push({ type: 'AND', raw: word });
      } else if (lower === 'not') {
        tokens.push({ type: 'NOT', raw: word });
      } else if (lower === 'true' || lower === '1') {
        tokens.push({ type: 'TRUE', raw: word, boolVal: true });
      } else if (lower === 'false' || lower === '0') {
        tokens.push({ type: 'FALSE', raw: word, boolVal: false });
      } else {
        // En caso de identificador no reconocido, tratar como false o error
        throw new Error(`Identificador o token no reconocido en expresión booleana: '${word}'`);
      }
    } else {
      i++;
    }
  }
  tokens.push({ type: 'EOF', raw: '$' });
  return tokens;
}

export function parseBooleanSdd(expression: string): SddTreeResult {
  const tokens = tokenizeBoolean(expression);
  let tokenIdx = 0;
  let nodeCounter = 0;

  function peek(): BoolToken {
    return tokens[tokenIdx];
  }

  function consume(expected?: string): BoolToken {
    const tok = tokens[tokenIdx];
    if (expected && tok.type !== expected) {
      throw new Error(`Se esperaba token '${expected}' pero se encontró '${tok.type}'`);
    }
    tokenIdx++;
    return tok;
  }

  function createNode(sym: string, isTerminal = false): SddNode {
    nodeCounter++;
    return {
      id: nodeCounter,
      sym,
      isTerminal,
      children: [],
      attrs: {},
      x: 0,
      y: 0,
      width: 0
    };
  }

  function parseL(): SddNode {
    const node = createNode('L');
    const bNode = parseB();
    node.children.push(bNode);
    return node;
  }

  function parseB(): SddNode {
    const node = createNode('B');
    const tNode = parseT();
    const bpNode = parseBp();
    node.children.push(tNode, bpNode);
    return node;
  }

  function parseBp(): SddNode {
    const node = createNode("B'");
    if (peek().type === 'OR') {
      const orTok = consume('OR');
      const orNode = createNode('or', true);
      const tNode = parseT();
      const bp1Node = parseBp();
      node.children.push(orNode, tNode, bp1Node);
    } else {
      const epsNode = createNode('ε', true);
      node.children.push(epsNode);
    }
    return node;
  }

  function parseT(): SddNode {
    const node = createNode('T');
    const fNode = parseF();
    const tpNode = parseTp();
    node.children.push(fNode, tpNode);
    return node;
  }

  function parseTp(): SddNode {
    const node = createNode("T'");
    if (peek().type === 'AND') {
      const andTok = consume('AND');
      const andNode = createNode('and', true);
      const fNode = parseF();
      const tp1Node = parseTp();
      node.children.push(andNode, fNode, tp1Node);
    } else {
      const epsNode = createNode('ε', true);
      node.children.push(epsNode);
    }
    return node;
  }

  function parseF(): SddNode {
    const node = createNode('F');
    if (peek().type === 'NOT') {
      const notTok = consume('NOT');
      const notNode = createNode('not', true);
      const f1Node = parseF();
      node.children.push(notNode, f1Node);
    } else if (peek().type === '(') {
      const lpar = createNode('(', true);
      consume('(');
      const bNode = parseB();
      const rpar = createNode(')', true);
      consume(')');
      node.children.push(lpar, bNode, rpar);
    } else if (peek().type === 'TRUE') {
      consume('TRUE');
      const trueNode = createNode('true', true);
      trueNode.attrs['val'] = true;
      node.children.push(trueNode);
    } else if (peek().type === 'FALSE') {
      consume('FALSE');
      const falseNode = createNode('false', true);
      falseNode.attrs['val'] = false;
      node.children.push(falseNode);
    } else {
      throw new Error(`Token booleano inesperado en F: '${peek().type}'`);
    }
    return node;
  }

  const root = parseL();

  // Recolectar nodos
  const nodesList: SddNode[] = [];
  function collect(n: SddNode) {
    nodesList.push(n);
    for (const c of n.children) collect(c);
  }
  collect(root);

  const stepsList: EvaluationStep[] = [];
  const edgesList: DependencyEdge[] = [];

  function addStep(
    targetNode: SddNode,
    targetAttr: string,
    attrType: 'inherited' | 'synthesized' | 'lexical',
    value: boolean,
    ruleTitle: string,
    ruleFormula: string,
    calcStr: string,
    depKeys: string[]
  ) {
    targetNode.attrs[targetAttr] = value;
    stepsList.push({
      stepNumber: stepsList.length + 1,
      targetNodeId: targetNode.id,
      targetSym: targetNode.sym,
      targetAttr,
      attrType,
      value,
      ruleTitle,
      ruleFormula,
      calculationStr: calcStr,
      dependencies: depKeys
    });
  }

  function evalF(node: SddNode) {
    if (node.children.length === 1 && (node.children[0].sym === 'true' || node.children[0].sym === 'false')) {
      const leaf = node.children[0];
      const val = Boolean(leaf.attrs['val']);
      addStep(
        leaf,
        'val',
        'lexical',
        val,
        'Token Booleano',
        `${leaf.sym}.val`,
        `Constante = ${val}`,
        []
      );
      addStep(
        node,
        'val',
        'synthesized',
        val,
        `F -> ${leaf.sym}`,
        `F.val = ${leaf.sym}.val`,
        `F.val = ${val}`,
        [`${leaf.id}.val`]
      );
    } else if (node.children.length === 2 && node.children[0].sym === 'not') {
      const f1Node = node.children[1];
      evalF(f1Node);
      const f1Val = Boolean(f1Node.attrs['val']);
      const val = !f1Val;
      addStep(
        node,
        'val',
        'synthesized',
        val,
        'F -> not F1',
        'F.val = not F1.val',
        `F.val = not (${f1Val}) = ${val}`,
        [`${f1Node.id}.val`]
      );
    } else if (node.children.length === 3 && node.children[0].sym === '(') {
      const bNode = node.children[1];
      evalB(bNode);
      const bVal = Boolean(bNode.attrs['val']);
      addStep(
        node,
        'val',
        'synthesized',
        bVal,
        'F -> ( B )',
        'F.val = B.val',
        `F.val = B.val = ${bVal}`,
        [`${bNode.id}.val`]
      );
    }
  }

  function evalTp(node: SddNode) {
    if (node.children.length === 3 && node.children[0].sym === 'and') {
      const fNode = node.children[1];
      const tp1Node = node.children[2];
      evalF(fNode);

      const fVal = Boolean(fNode.attrs['val']);
      const herVal = Boolean(node.attrs['her']);
      const newHer = herVal && fVal;

      addStep(
        tp1Node,
        'her',
        'inherited',
        newHer,
        "T' -> and F T'1",
        "T'1.her = T'.her and F.val",
        `T'1.her = ${herVal} and ${fVal} = ${newHer}`,
        [`${node.id}.her`, `${fNode.id}.val`]
      );

      evalTp(tp1Node);
      const sinVal = Boolean(tp1Node.attrs['sin']);

      addStep(
        node,
        'sin',
        'synthesized',
        sinVal,
        "T' -> and F T'1",
        "T'.sin = T'1.sin",
        `T'.sin = T'1.sin = ${sinVal}`,
        [`${tp1Node.id}.sin`]
      );
    } else if (node.children.length === 1 && node.children[0].sym === 'ε') {
      const herVal = Boolean(node.attrs['her']);
      addStep(
        node,
        'sin',
        'synthesized',
        herVal,
        "T' -> ε",
        "T'.sin = T'.her",
        `T'.sin = T'.her = ${herVal}`,
        [`${node.id}.her`]
      );
    }
  }

  function evalT(node: SddNode) {
    const fNode = node.children[0];
    const tpNode = node.children[1];
    evalF(fNode);

    const fVal = Boolean(fNode.attrs['val']);
    addStep(
      tpNode,
      'her',
      'inherited',
      fVal,
      "T -> F T'",
      "T'.her = F.val",
      `T'.her = ${fVal}`,
      [`${fNode.id}.val`]
    );

    evalTp(tpNode);
    const sinVal = Boolean(tpNode.attrs['sin']);

    addStep(
      node,
      'val',
      'synthesized',
      sinVal,
      "T -> F T'",
      "T.val = T'.sin",
      `T.val = T'.sin = ${sinVal}`,
      [`${tpNode.id}.sin`]
    );
  }

  function evalBp(node: SddNode) {
    if (node.children.length === 3 && node.children[0].sym === 'or') {
      const tNode = node.children[1];
      const bp1Node = node.children[2];
      evalT(tNode);

      const tVal = Boolean(tNode.attrs['val']);
      const herVal = Boolean(node.attrs['her']);
      const newHer = herVal || tVal;

      addStep(
        bp1Node,
        'her',
        'inherited',
        newHer,
        "B' -> or T B'1",
        "B'1.her = B'.her or T.val",
        `B'1.her = ${herVal} or ${tVal} = ${newHer}`,
        [`${node.id}.her`, `${tNode.id}.val`]
      );

      evalBp(bp1Node);
      const sinVal = Boolean(bp1Node.attrs['sin']);

      addStep(
        node,
        'sin',
        'synthesized',
        sinVal,
        "B' -> or T B'1",
        "B'.sin = B'1.sin",
        `B'.sin = B'1.sin = ${sinVal}`,
        [`${bp1Node.id}.sin`]
      );
    } else if (node.children.length === 1 && node.children[0].sym === 'ε') {
      const herVal = Boolean(node.attrs['her']);
      addStep(
        node,
        'sin',
        'synthesized',
        herVal,
        "B' -> ε",
        "B'.sin = B'.her",
        `B'.sin = B'.her = ${herVal}`,
        [`${node.id}.her`]
      );
    }
  }

  function evalB(node: SddNode) {
    const tNode = node.children[0];
    const bpNode = node.children[1];
    evalT(tNode);

    const tVal = Boolean(tNode.attrs['val']);
    addStep(
      bpNode,
      'her',
      'inherited',
      tVal,
      "B -> T B'",
      "B'.her = T.val",
      `B'.her = ${tVal}`,
      [`${tNode.id}.val`]
    );

    evalBp(bpNode);
    const sinVal = Boolean(bpNode.attrs['sin']);

    addStep(
      node,
      'val',
      'synthesized',
      sinVal,
      "B -> T B'",
      "B.val = B'.sin",
      `B.val = B'.sin = ${sinVal}`,
      [`${bpNode.id}.sin`]
    );
  }

  function evalL(node: SddNode) {
    const bNode = node.children[0];
    evalB(bNode);
    const bVal = Boolean(bNode.attrs['val']);

    addStep(
      node,
      'val',
      'synthesized',
      bVal,
      'L -> B',
      'L.val = B.val',
      `L.val = B.val = ${bVal}`,
      [`${bNode.id}.val`]
    );
  }

  evalL(root);

  // Layout árbol
  const minNodeWidth = 115;
  const levelHeight = 110;

  function computeSubtreeWidth(n: SddNode): number {
    if (!n.children || n.children.length === 0) {
      n.width = minNodeWidth;
      return minNodeWidth;
    }
    const sumW = n.children.reduce((acc, c) => acc + computeSubtreeWidth(c), 0);
    n.width = Math.max(sumW, minNodeWidth);
    return n.width;
  }
  computeSubtreeWidth(root);

  function layoutTree(n: SddNode, left: number, depth: number) {
    n.y = depth * levelHeight + 60;
    if (!n.children || n.children.length === 0) {
      n.x = left + n.width / 2;
      return;
    }
    const childrenTotalW = n.children.reduce((acc, c) => acc + c.width, 0);
    const extra = Math.max(0, (n.width - childrenTotalW) / 2);
    let curX = left + extra;
    for (const c of n.children) {
      layoutTree(c, curX, depth + 1);
      curX += c.width;
    }
    n.x = (n.children[0].x + n.children[n.children.length - 1].x) / 2;
  }
  layoutTree(root, 40, 0);

  const attributesList: SddAttributeRef[] = [];
  const attrMap: Map<string, SddAttributeRef> = new Map();

  for (const n of nodesList) {
    for (const [attrName, val] of Object.entries(n.attrs)) {
      let attrType: 'inherited' | 'synthesized' | 'lexical' = 'synthesized';
      let offsetX = 0;
      let offsetY = 0;

      if (attrName === 'her') {
        attrType = 'inherited';
        offsetX = -40;
        offsetY = -12;
      } else if (attrName === 'sin') {
        attrType = 'synthesized';
        offsetX = 40;
        offsetY = -12;
      } else if (attrName === 'val') {
        attrType = n.isTerminal ? 'lexical' : 'synthesized';
        offsetX = n.isTerminal ? 0 : 36;
        offsetY = n.isTerminal ? 24 : 16;
      }

      const attrRef: SddAttributeRef = {
        nodeId: n.id,
        nodeSym: n.sym,
        attrName,
        attrType,
        value: val,
        x: n.x + offsetX,
        y: n.y + offsetY
      };

      attributesList.push(attrRef);
      attrMap.set(`${n.id}.${attrName}`, attrRef);
    }
  }

  for (const step of stepsList) {
    const toRef = attrMap.get(`${step.targetNodeId}.${step.targetAttr}`);
    if (!toRef) continue;

    for (const depKey of step.dependencies) {
      const fromRef = attrMap.get(depKey);
      if (fromRef) {
        edgesList.push({
          id: `edge-${fromRef.nodeId}.${fromRef.attrName}->${toRef.nodeId}.${toRef.attrName}`,
          from: fromRef,
          to: toRef,
          ruleDesc: step.ruleFormula,
          edgeType: toRef.attrType === 'inherited' ? 'inherited' : 'synthesized'
        });
      }
    }
  }

  let maxX = 0;
  let maxY = 0;
  for (const n of nodesList) {
    if (n.x > maxX) maxX = n.x;
    if (n.y > maxY) maxY = n.y;
  }

  return {
    root,
    nodesList,
    attributesList,
    edgesList,
    stepsList,
    finalResult: root.attrs['val'] ?? false,
    svgWidth: Math.max(maxX + 120, 900),
    svgHeight: maxY + 140,
    grammarTitle: 'Expresiones Booleanas (OR, AND, NOT) con Eliminación de Recursividad Izquierda y DDS L-Atribuida',
    grammarType: 'boolean',
    expression
  };
}
