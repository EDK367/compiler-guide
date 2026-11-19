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
  attrs: Record<string, number>;
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
  value: number;
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
  value: number;
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
  finalResult: number;
  svgWidth: number;
  svgHeight: number;
  grammarTitle: string;
  expression: string;
}

// -------------------------------------------------------------
// GRAMÁTICA 1: ARITMÉTICA (+, *) SIN RECURSIVIDAD IZQUIERDA
// Basada en diapositivas 31 y 34 de Mario Ramírez Tobar
// L -> E
// E -> T E'      { E'.her = T.val; E.val = E'.sin }
// E' -> + T E'1  { E'1.her = E'.her + T.val; E'.sin = E'1.sin }
// E' -> ε        { E'.sin = E'.her }
// T -> F T'      { T'.her = F.val; T.val = T'.sin }
// T' -> * F T'1  { T'1.her = T'.her * F.val; T'.sin = T'1.sin }
// T' -> ε        { T'.sin = T'.her }
// F -> ( E )     { F.val = E.val }
// F -> digito    { F.val = digito.valex }
// -------------------------------------------------------------

interface Token {
  type: string;
  val?: number;
}

function tokenize(input: string): Token[] {
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
      i++; // Omitir caracteres no soportados limpiamente
    }
  }
  tokens.push({ type: 'EOF' });
  return tokens;
}

export function parseArithmeticSdd(expression: string): SddTreeResult {
  const tokens = tokenize(expression);
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

  // -------------------------------------------------------------
  // EVALUACIÓN DE ATRIBUTOS, DEPENDENCIAS Y TRAZABILIDAD
  // -------------------------------------------------------------
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
      const valex = dig.attrs['valex'];
      // Registrar atributo léxico
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

      // F.val = digito.valex
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
      const val = eNode.attrs['val'];
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

      const fVal = fNode.attrs['val'];
      const herVal = node.attrs['her'];
      const newHer = herVal * fVal;

      // T'1.her = T'.her * F.val
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
      const sinVal = tp1Node.attrs['sin'];

      // T'.sin = T'1.sin
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
      const herVal = node.attrs['her'];
      // T'.sin = T'.her
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

    const fVal = fNode.attrs['val'];
    // T'.her = F.val
    addStep(
      tpNode,
      'her',
      'inherited',
      fVal,
      'T -> F T\'',
      "T'.her = F.val",
      `T'.her = ${fVal}`,
      [`${fNode.id}.val`]
    );

    evalTp(tpNode);
    const sinVal = tpNode.attrs['sin'];

    // T.val = T'.sin
    addStep(
      node,
      'val',
      'synthesized',
      sinVal,
      'T -> F T\'',
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

      const tVal = tNode.attrs['val'];
      const herVal = node.attrs['her'];
      const newHer = herVal + tVal;

      // E'1.her = E'.her + T.val
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
      const sinVal = ep1Node.attrs['sin'];

      // E'.sin = E'1.sin
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
      const herVal = node.attrs['her'];
      // E'.sin = E'.her
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

    const tVal = tNode.attrs['val'];
    // E'.her = T.val
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
    const sinVal = epNode.attrs['sin'];

    // E.val = E'.sin
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
    const eVal = eNode.attrs['val'];

    // L.val = E.val
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

  // -------------------------------------------------------------
  // CÁLCULO DE COORDENADAS PARA RENDERIZADO VISUAL
  // -------------------------------------------------------------
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

  // Generar lista de atributos con sus coordenadas absolutas
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

  // Generar lista de aristas dirigidas (Grafo de Dependencias)
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
    expression
  };
}

// -------------------------------------------------------------
// GRAMÁTICA 2: MULTIPLICACIÓN PURA CON ATRIBUTOS HEREDADOS
// Basada en diapositivas 24 y 25 de Mario Ramírez Tobar
// S -> T          { imprimir(T.total) }
// T -> F T'       { T'.valh = F.val; T.total = T'.total }
// T' -> * F T'1   { T'1.valh = T'.valh * F.val; T'.total = T'1.total }
// T' -> λ         { T'.total = T'.valh }
// F -> num        { F.val = num.val }
// -------------------------------------------------------------

export function parseMultiplicationSdd(expression: string): SddTreeResult {
  const tokens = tokenize(expression).filter(t => t.type === 'NUM' || t.type === '*');
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

  // Construir árbol
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

  // Base λ
  const lambdaNode = createNode('λ', true);
  curTp.children.push(lambdaNode);
  tpChain.push({ tpNode: curTp });

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

  // 1. F.val para el primer término
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

  // 2. T'.valh inicial = F.val
  const topTp = tNode.children[1];
  addStep(
    topTp,
    'valh',
    'inherited',
    nums[0],
    'T -> F T\'',
    "T'.valh = F.val",
    `T'.valh = ${nums[0]}`,
    [`${firstF.id}.val`]
  );

  // 3. Cadena de multiplicación heredada
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

  // 4. Caso base lambda: T'.total = T'.valh
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

  // 5. Propagación sintetizada hacia arriba: T'.total = T'1.total
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

  // 6. T.total = T'.total
  addStep(
    tNode,
    'total',
    'synthesized',
    curValh,
    'T -> F T\'',
    "T.total = T'.total",
    `T.total = ${curValh}`,
    [`${topTp.id}.total`]
  );

  // 7. S -> Imprimir(T.total)
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

  // Layout árbol
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
    expression
  };
}

