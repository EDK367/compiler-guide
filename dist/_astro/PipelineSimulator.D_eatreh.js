import{B as e,S as t,V as n,a as r,c as i,f as a,i as o,m as s,t as c,v as l,y as u}from"./runtime-core.esm-bundler.Dw7sqdCr.js";import{t as d}from"./_plugin-vue_export-helper.BDNMzG2s.js";var f=s({__name:`PipelineSimulator`,setup(e,{expose:n}){n();let r=t(0),i=t(0),a=[{name:`Código Fuente`,subtitle:`Entrada en alto nivel`,structure:`Texto crudo / Streams`},{name:`Análisis Léxico`,subtitle:`Escaneo de tokens`,structure:`Tuplas <Token, Lexema>`},{name:`Análisis Sintáctico`,subtitle:`Construcción jerárquica`,structure:`AST (Abstract Syntax Tree)`},{name:`Análisis Semántico`,subtitle:`Tipos y ámbitos`,structure:`Tabla de Símbolos Decorada`},{name:`Código Intermedio`,subtitle:`Aplanado y temporales`,structure:`C3D / Cuádruplas`},{name:`RISC-V RV32I`,subtitle:`Emisión de ensamble`,structure:`Instrucciones Máquina`}],s=[{title:`Aritmética & Asignación`,stageExplanations:[`El programador escribe una asignación aritmética compuesta en lenguaje fuente con precedencia de operadores.`,`El escáner convierte el flujo de caracteres en tokens clasificados, reconociendo números, variables y delimitadores.`,`El parser valida las producciones de la gramática libre de contexto y construye el Árbol Sintáctico Abstracto.`,`El comprobador de tipos verifica que las variables estén declaradas en el ámbito actual y que los tipos sean compatibles.`,`Se descompone la expresión respetando la regla del Ing. Mario Ramírez Tobar: máximo 3 accesos a memoria por instrucción.`,`El generador mapea los temporales a registros temporales (t0-t6) e instrucciones RV32I con offsets canónicos.`],stageArtifacts:[`// Código Fuente Original
int x;
x = (10 + 5) * 3 - 2;`,`// Flujo de Tokens Léxicos
<KW_INT, "int"> <ID, "x"> <SEMICOLON, ";">
<ID, "x"> <ASSIGN, "="> <LPAREN, "("> <NUM, "10"> <OP_ADD, "+">
<NUM, "5"> <RPAREN, ")"> <OP_MUL, "*"> <NUM, "3"> <OP_SUB, "-"> <NUM, "2"> <SEMICOLON, ";">`,`// Árbol Sintáctico Abstracto (AST)
Assignment (=)
 ├── Target: ID(x)
 └── Value: BinaryOp (-)
      ├── Left: BinaryOp (*)
      │    ├── Left: BinaryOp (+)
      │    │    ├── Left: Num(10)
      │    │    └── Right: Num(5)
      │    └── Right: Num(3)
      └── Right: Num(2)`,`// Comprobación Semántica & Tabla de Símbolos
--------------------------------------------------------
Nombre   | Categoría | Tipo  | Ámbito | Offset / Dirección
--------------------------------------------------------
x        | Variable  | int32 | Local  | -12(fp)

Comprobación de Tipos:
  (10 + 5) => int + int = int
  (int) * 3 => int * int = int
  (int) - 2 => int - int = int
  x = int   => Compatibilidad estricta: CORRECTA`,`// Código de Tres Direcciones (C3D) & Temporales
t1 = 10 + 5
t2 = t1 * 3
t3 = t2 - 2
x = t3`,`# Código Objeto Ensamblador RISC-V (RV32I)
  li t0, 10
  li t1, 5
  add t2, t0, t1      # t2 = 10 + 5 = 15
  li t3, 3
  mul t4, t2, t3      # t4 = 15 * 3 = 45
  li t5, 2
  sub t6, t4, t5      # t6 = 45 - 2 = 43
  sw t6, -12(fp)      # Almacena en la variable local x`]},{title:`Condicional If-Else`,stageExplanations:[`Sentencia condicional con salto alternativo.`,`Reconocimiento de palabras reservadas "if", "else" y operadores de comparación.`,`AST con nodo IfElse que contiene la condición, rama verdadera y rama falsa.`,`Verificación semántica: la condición debe evaluar estrictamente a tipo booleano.`,`Traducción C3D con etiquetas de salto condicional (L_VERDADERO, L_FALSO, L_FIN).`,`Traducción a saltos condicionales RISC-V con bgt, beq y saltos incondicionales j.`],stageArtifacts:[`// Código Fuente Original
if (a > b) {
    max = a;
} else {
    max = b;
}`,`<KW_IF, "if"> <LPAREN, "("> <ID, "a"> <OP_GT, ">"> <ID, "b"> <RPAREN, ")">
<LBRACE, "{"> <ID, "max"> <ASSIGN, "="> <ID, "a"> <SEMICOLON, ";"> <RBRACE, "}">
<KW_ELSE, "else"> <LBRACE, "{"> <ID, "max"> <ASSIGN, "="> <ID, "b"> <SEMICOLON, ";"> <RBRACE, "}">`,`IfElseNode
 ├── Condition: RelOp (>)
 │    ├── Left: ID(a)
 │    └── Right: ID(b)
 ├── TrueBranch:
 │    └── Assignment(max = a)
 └── FalseBranch:
      └── Assignment(max = b)`,`Tabla de Símbolos:
  a   : int (-12(fp))
  b   : int (-16(fp))
  max : int (-20(fp))

Comprobación Semántica:
  Condition: (a > b) -> bool (válida para if)`,`// C3D con Etiquetas de Flujo
  if a > b goto L1
  goto L2
L1:
  max = a
  goto L3
L2:
  max = b
L3:
  // Fin de bloque`,`# Ensamble RISC-V RV32I
  lw t0, -12(fp)      # t0 = a
  lw t1, -16(fp)      # t1 = b
  bgt t0, t1, .L1     # Salta si a > b
  j .L2
.L1:
  sw t0, -20(fp)      # max = a
  j .L3
.L2:
  sw t1, -20(fp)      # max = b
.L3:
  # continúa ejecución`]}],c=o(()=>s[i.value]);function l(e){i.value=e,r.value=0}function u(){r.value<a.length-1&&r.value++}function d(){r.value>0&&r.value--}let f={currentStage:r,selectedCaseIdx:i,stages:a,cases:s,currentCaseData:c,selectCase:l,nextStage:u,prevStage:d};return Object.defineProperty(f,"__isScriptSetup",{enumerable:!1,value:!0}),f}}),p={class:`bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200`},m={class:`flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3`},h={class:`flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs`},g=[`onClick`],_={class:`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6`},v=[`onClick`],y={class:`text-[10px] uppercase tracking-wider opacity-80 font-mono`},b={class:`truncate w-full font-sans text-xs`},x={class:`bg-[#080d1a] border border-slate-800 rounded-xl p-4 sm:p-5 mb-4 min-h-64 shadow-inner`},S={class:`flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-800 pb-2.5`},C={class:`flex items-center gap-2`},w={class:`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30`},T={class:`text-xs text-slate-400 hidden sm:inline`},E={class:`text-xs font-mono text-purple-300`},D={class:`text-white`},O={class:`mb-4 text-xs text-slate-300 leading-relaxed bg-slate-900/70 p-3.5 rounded-xl border border-slate-800`},k={class:`overflow-x-auto`},A={class:`font-mono text-xs p-4 bg-[#0a101f] rounded-xl border border-slate-800 text-cyan-200 leading-relaxed whitespace-pre-wrap`},j={class:`flex items-center justify-between gap-2`},M=[`disabled`],N={class:`text-xs font-mono text-slate-400`},P=[`disabled`];function F(t,o,s,d,f,F){return l(),i(`div`,p,[r(`div`,m,[o[1]||=r(`div`,null,[r(`h3`,{class:`text-lg sm:text-xl font-bold text-white flex items-center gap-2`},[r(`span`,{class:`inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]`}),a(` Simulador de Traducción Multi-Etapa `)]),r(`p`,{class:`text-xs text-slate-400 mt-0.5`},`Visualización del flujo de transformación del programa a través de las 6 fases`)],-1),r(`div`,h,[o[0]||=r(`span`,{class:`text-slate-400`},`Casos:`,-1),(l(),i(c,null,u(d.cases,(t,i)=>r(`button`,{key:i,onClick:e=>d.selectCase(i),class:e([d.selectedCaseIdx===i?`bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]`:`bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700`,`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer`])},n(t.title),11,g)),64))])]),r(`div`,_,[(l(),i(c,null,u(d.stages,(t,i)=>r(`button`,{key:i,onClick:e=>d.currentStage=i,class:e([d.currentStage===i?`bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 scale-[1.02]`:d.currentStage>i?`bg-purple-950/50 text-purple-300 border border-purple-500/40`:`bg-slate-900 text-slate-400 border border-slate-800`,`px-2 py-2.5 rounded-xl text-xs flex flex-col items-center justify-center transition cursor-pointer text-center`])},[r(`span`,y,`Fase `+n(i+1),1),r(`span`,b,n(t.name),1)],10,v)),64))]),r(`div`,x,[r(`div`,S,[r(`div`,C,[r(`span`,w,` Fase `+n(d.currentStage+1)+`: `+n(d.stages[d.currentStage].name),1),r(`span`,T,n(d.stages[d.currentStage].subtitle),1)]),r(`div`,E,[o[2]||=a(` Estructura: `,-1),r(`strong`,D,n(d.stages[d.currentStage].structure),1)])]),r(`div`,O,n(d.currentCaseData.stageExplanations[d.currentStage]),1),r(`div`,k,[r(`pre`,A,n(d.currentCaseData.stageArtifacts[d.currentStage]),1)])]),r(`div`,j,[r(`button`,{onClick:d.prevStage,disabled:d.currentStage===0,class:e([d.currentStage===0?`opacity-30 cursor-not-allowed`:`hover:bg-slate-800 cursor-pointer text-cyan-400`,`px-3 sm:px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono flex items-center gap-1.5 transition`])},` ◀ Fase Anterior `,10,M),r(`span`,N,` Paso `+n(d.currentStage+1)+` de `+n(d.stages.length),1),r(`button`,{onClick:d.nextStage,disabled:d.currentStage===d.stages.length-1,class:e([d.currentStage===d.stages.length-1?`opacity-30 cursor-not-allowed`:`hover:opacity-90 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]`,`px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition`])},` Siguiente Fase ▶ `,10,P)])])}var I=d(f,[[`render`,F]]);export{I as default};