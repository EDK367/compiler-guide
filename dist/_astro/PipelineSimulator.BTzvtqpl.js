import{I as e,R as t,_ as n,a as r,d as i,i as a,p as o,s,t as c,v as l,x as u}from"./runtime-core.esm-bundler.38a7Ky-5.js";import{i as d,r as f,t as p}from"./syntaxHighlight.DcstIGnS.js";import{t as m}from"./_plugin-vue_export-helper.BDNMzG2s.js";var h=o({__name:`PipelineSimulator`,setup(e,{expose:t}){t();let n=u(0),r=u(0),i=[{name:`Código Fuente`,subtitle:`Entrada en alto nivel`,structure:`Texto crudo / Streams`},{name:`Análisis Léxico`,subtitle:`Escaneo de tokens`,structure:`Tuplas <Token, Lexema>`},{name:`Análisis Sintáctico`,subtitle:`Construcción jerárquica`,structure:`AST (Abstract Syntax Tree)`},{name:`Análisis Semántico`,subtitle:`Tipos y ámbitos`,structure:`Tabla de Símbolos Decorada`},{name:`Código Intermedio`,subtitle:`Aplanado y temporales`,structure:`C3D / Cuádruplas`},{name:`RISC-V RV32I`,subtitle:`Emisión de ensamble`,structure:`Instrucciones Máquina`}],o=[{title:`Aritmética & Asignación`,stageExplanations:[`El programador escribe una asignación aritmética compuesta en lenguaje fuente con precedencia de operadores.`,`El escáner convierte el flujo de caracteres en tokens clasificados, reconociendo números, variables y delimitadores.`,`El parser valida las producciones de la gramática libre de contexto y construye el Árbol Sintáctico Abstracto.`,`El comprobador de tipos verifica que las variables estén declaradas en el ámbito actual y que los tipos sean compatibles.`,`Se descompone la expresión respetando la regla del Ing. Mario Ramírez Tobar: máximo 3 accesos a memoria por instrucción.`,`El generador mapea los temporales a registros temporales (t0-t6) e instrucciones RV32I con offsets canónicos.`],stageArtifacts:[`// Código Fuente Original
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
  # continúa ejecución`]}],s=a(()=>o[r.value]);function c(e){r.value=e,n.value=0}function l(){n.value<i.length-1&&n.value++}function m(){n.value>0&&n.value--}let h={currentStage:n,selectedCaseIdx:r,stages:i,cases:o,currentCaseData:s,selectCase:c,nextStage:l,prevStage:m,get highlightCode(){return f},get highlightC3D(){return p},get highlightRiscv(){return d}};return Object.defineProperty(h,"__isScriptSetup",{enumerable:!1,value:!0}),h}}),g={class:`bg-[#0d1527] border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl text-slate-200`},_={class:`flex flex-wrap items-center justify-between gap-3 mb-4 border-b border-slate-800 pb-3`},v={class:`flex flex-wrap items-center gap-1.5 sm:gap-2 text-xs`},y=[`onClick`],b={class:`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 mb-6`},x=[`onClick`],S={class:`text-[10px] uppercase tracking-wider opacity-80 font-mono`},C={class:`truncate w-full font-sans text-xs`},w={class:`bg-[#080d1a] border border-slate-800 rounded-xl p-4 sm:p-5 mb-4 min-h-64 shadow-inner`},T={class:`flex flex-wrap items-center justify-between gap-2 mb-3 border-b border-slate-800 pb-2.5`},E={class:`flex items-center gap-2`},D={class:`px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-cyan-500/10 text-cyan-300 border border-cyan-500/30`},O={class:`text-xs text-slate-400 hidden sm:inline`},k={class:`text-xs font-mono text-purple-300`},A={class:`text-white`},j={class:`mb-4 text-xs text-slate-300 leading-relaxed bg-slate-900/70 p-3.5 rounded-xl border border-slate-800`},M={class:`overflow-x-auto`},N=[`innerHTML`],P=[`innerHTML`],F=[`innerHTML`],I={key:3,class:`font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 text-cyan-200 leading-relaxed whitespace-pre-wrap`},L={class:`flex items-center justify-between gap-2`},R=[`disabled`],z={class:`text-xs font-mono text-slate-400`},B=[`disabled`];function V(a,o,u,d,f,p){return n(),s(`div`,g,[r(`div`,_,[o[1]||=r(`div`,null,[r(`h3`,{class:`text-lg sm:text-xl font-bold text-white flex items-center gap-2`},[r(`span`,{class:`inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]`}),i(` Simulador de Traducción Multi-Etapa `)]),r(`p`,{class:`text-xs text-slate-400 mt-0.5`},`Visualización del flujo de transformación del programa a través de las 6 fases`)],-1),r(`div`,v,[o[0]||=r(`span`,{class:`text-slate-400`},`Casos:`,-1),(n(),s(c,null,l(d.cases,(n,i)=>r(`button`,{key:i,onClick:e=>d.selectCase(i),class:e([d.selectedCaseIdx===i?`bg-gradient-to-r from-purple-500 to-indigo-600 text-white font-bold shadow-[0_0_12px_rgba(168,85,247,0.4)]`:`bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700`,`px-2.5 py-1 rounded-lg text-xs font-mono transition cursor-pointer`])},t(n.title),11,y)),64))])]),r(`div`,b,[(n(),s(c,null,l(d.stages,(n,i)=>r(`button`,{key:i,onClick:e=>d.currentStage=i,class:e([d.currentStage===i?`bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)] ring-2 ring-cyan-400 scale-[1.02]`:d.currentStage>i?`bg-purple-950/50 text-purple-300 border border-purple-500/40`:`bg-slate-900 text-slate-400 border border-slate-800`,`px-2 py-2.5 rounded-xl text-xs flex flex-col items-center justify-center transition cursor-pointer text-center`])},[r(`span`,S,`Fase `+t(i+1),1),r(`span`,C,t(n.name),1)],10,x)),64))]),r(`div`,w,[r(`div`,T,[r(`div`,E,[r(`span`,D,` Fase `+t(d.currentStage+1)+`: `+t(d.stages[d.currentStage].name),1),r(`span`,O,t(d.stages[d.currentStage].subtitle),1)]),r(`div`,k,[o[2]||=i(` Estructura: `,-1),r(`strong`,A,t(d.stages[d.currentStage].structure),1)])]),r(`div`,j,t(d.currentCaseData.stageExplanations[d.currentStage]),1),r(`div`,M,[d.currentStage===0?(n(),s(`pre`,{key:0,innerHTML:d.highlightCode(d.currentCaseData.stageArtifacts[d.currentStage],`c`),class:`font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap`},null,8,N)):d.currentStage===4?(n(),s(`pre`,{key:1,innerHTML:d.highlightC3D(d.currentCaseData.stageArtifacts[d.currentStage]),class:`font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap`},null,8,P)):d.currentStage===5?(n(),s(`pre`,{key:2,innerHTML:d.highlightRiscv(d.currentCaseData.stageArtifacts[d.currentStage]),class:`font-mono text-xs sm:text-sm p-4 bg-[#0a101f] rounded-xl border border-slate-800 leading-relaxed whitespace-pre-wrap`},null,8,F)):(n(),s(`pre`,I,t(d.currentCaseData.stageArtifacts[d.currentStage]),1))])]),r(`div`,L,[r(`button`,{onClick:d.prevStage,disabled:d.currentStage===0,class:e([d.currentStage===0?`opacity-30 cursor-not-allowed`:`hover:bg-slate-800 cursor-pointer text-cyan-400`,`px-3 sm:px-4 py-2 bg-slate-900 border border-slate-700 rounded-xl text-xs font-mono flex items-center gap-1.5 transition`])},` ◀ Fase Anterior `,10,R),r(`span`,z,` Paso `+t(d.currentStage+1)+` de `+t(d.stages.length),1),r(`button`,{onClick:d.nextStage,disabled:d.currentStage===d.stages.length-1,class:e([d.currentStage===d.stages.length-1?`opacity-30 cursor-not-allowed`:`hover:opacity-90 cursor-pointer shadow-[0_0_12px_rgba(6,182,212,0.4)]`,`px-3 sm:px-4 py-2 bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold rounded-xl text-xs font-mono flex items-center gap-1.5 transition`])},` Siguiente Fase ▶ `,10,B)])])}var H=m(h,[[`render`,V]]);export{H as default};