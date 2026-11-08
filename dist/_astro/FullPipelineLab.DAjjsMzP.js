import{B as e,S as t,V as n,a as r,c as i,d as a,f as o,i as s,m as c,s as l,t as u,v as d,x as f,y as p}from"./runtime-core.esm-bundler.Dw7sqdCr.js";import{i as m}from"./runtime-dom.esm-bundler.CXbk3v1J.js";import{t as h}from"./_plugin-vue_export-helper.BDNMzG2s.js";var g=c({__name:`FullPipelineLab`,setup(e,{expose:n}){n();let r=[{id:`poo-this-heap`,badge:`1. POO & Puntero this`,category:`Programación Orientada a Objetos`,academicNote:`En POO, la invocación de un método traduce el puntero "this" implícito al primer argumento (registro a0). Los atributos del objeto residen en memoria Heap (a partir de 0x1000) y se acceden mediante direccionamiento indexado offset(this), evitando duplicar la clase en la pila.`,code:`class CuentaBancaria {
    int saldo;
    int titularId;

    int depositar(int monto) {
        this.saldo = this.saldo + monto;
        return this.saldo;
    }

    int transferir(int destinoId, int monto) {
        if (this.saldo >= monto) {
            this.saldo = this.saldo - monto;
            return 1; // Éxito
        }
        return 0; // Fondos insuficientes
    }
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra`},{offset:`-8(fp)`,name:`Puntero "this" de la clase`,reg:`sw a0`},{offset:`-12(fp)`,name:`Primer parámetro (monto)`,reg:`sw a1`}],heapLayout:[{addr:`0x1000`,field:`this.saldo (int32)`,value:`1500`},{addr:`0x1004`,field:`this.titularId (int32)`,value:`48291`}],c3dLines:[`// Subprograma: CuentaBancaria_depositar`,`CuentaBancaria_depositar:`,`t0 = Heap[this + 0]          // Carga atributo this.saldo desde Heap`,`t1 = t0 + monto             // Suma local`,`Heap[this + 0] = t1          // Actualiza atributo this.saldo en Heap`,`return t1                    // Retorna nuevo saldo`,``,`// Subprograma: CuentaBancaria_transferir`,`CuentaBancaria_transferir:`,`t2 = Heap[this + 0]          // Carga this.saldo`,`if t2 >= monto goto L_SUFICIENTE`,`return 0                    // Fondos insuficientes`,`L_SUFICIENTE:`,`t3 = t2 - monto`,`Heap[this + 0] = t3          // Descuenta saldo`,`return 1                    // Éxito en transferencia`],quadruples:[{index:1,op:`=[]`,arg1:`this`,arg2:`0`,dest:`t0`},{index:2,op:`+`,arg1:`t0`,arg2:`monto`,dest:`t1`},{index:3,op:`[]=`,arg1:`this`,arg2:`0`,dest:`t1`},{index:4,op:`return`,arg1:`t1`,arg2:`-`,dest:`-`},{index:5,op:`=[]`,arg1:`this`,arg2:`0`,dest:`t2`},{index:6,op:`>=`,arg1:`t2`,arg2:`monto`,dest:`goto (8)`},{index:7,op:`return`,arg1:`0`,arg2:`-`,dest:`-`},{index:8,op:`-`,arg1:`t2`,arg2:`monto`,dest:`t3`},{index:9,op:`[]=`,arg1:`this`,arg2:`0`,dest:`t3`},{index:10,op:`return`,arg1:`1`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl CuentaBancaria_depositar
CuentaBancaria_depositar:
    # 1. Prólogo de función con Frame Pointer
    addi sp, sp, -16        # Reserva marco en la pila
    sw ra, 12(sp)           # Preserva dirección de retorno
    sw s0, 8(sp)            # Preserva frame pointer anterior
    addi s0, sp, 16         # Nuevo Frame Pointer
    sw a0, -8(s0)           # Guarda puntero "this" (a0) en la pila
    sw a1, -12(s0)          # Guarda parámetro "monto" (a1) en la pila

    # 2. Cuerpo del método: Acceso al Heap
    lw t0, 0(a0)            # t0 = this.saldo (offset 0 en Heap)
    lw t1, -12(s0)          # t1 = monto
    add t2, t0, t1          # t2 = saldo + monto
    sw t2, 0(a0)            # Actualiza Heap[this + 0] = t2
    mv a0, t2               # Convención ABI: valor de retorno en a0

    # 3. Epílogo canónico
    lw s0, 8(sp)            # Restaura frame pointer anterior
    lw ra, 12(sp)           # Restaura dirección de retorno
    addi sp, sp, 16         # Libera marco de pila
    ret                     # Retorno a llamador (jalr zero, ra, 0)`},{id:`recursivo-factorial`,badge:`2. Recursión: Factorial`,category:`Llamadas Recursivas & Pila`,academicNote:`En funciones recursivas, cada llamada anidada crea un nuevo registro de activación en la pila. La convención exige preservar ra y s0/fp en cada nivel para que al alcanzar el caso base (n <= 1), la pila se desenrolle correctamente multiplicando hacia arriba.`,code:`class Matematicas {
    int factorial(int n) {
        if (n <= 1) {
            return 1;
        }
        return n * factorial(n - 1);
    }
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`},{offset:`-8(fp)`,name:`Argumento n de este marco`,reg:`sw a0, -8(fp)`},{offset:`-12(fp)`,name:`Temporal n * resultado`,reg:`sw t2, -12(fp)`}],heapLayout:[{addr:`0x1000`,field:`Instancia Matematicas`,value:`vtable_ptr`}],c3dLines:[`// Subprograma: Matematicas_factorial`,`Matematicas_factorial:`,`if n <= 1 goto L_BASE`,`t0 = n - 1`,`param t0                    // Prepara parámetro para llamada recursiva`,`t1 = call Matematicas_factorial, 1`,`t2 = n * t1                 // Multiplica al regresar de la recursión`,`return t2`,`L_BASE:`,`return 1`],quadruples:[{index:1,op:`<=`,arg1:`n`,arg2:`1`,dest:`goto (8)`},{index:2,op:`-`,arg1:`n`,arg2:`1`,dest:`t0`},{index:3,op:`param`,arg1:`t0`,arg2:`-`,dest:`-`},{index:4,op:`call`,arg1:`factorial`,arg2:`1`,dest:`t1`},{index:5,op:`*`,arg1:`n`,arg2:`t1`,dest:`t2`},{index:6,op:`return`,arg1:`t2`,arg2:`-`,dest:`-`},{index:7,op:`goto`,arg1:`-`,arg2:`-`,dest:`(9)`},{index:8,op:`return`,arg1:`1`,arg2:`-`,dest:`-`},{index:9,op:`end`,arg1:`-`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl Matematicas_factorial
Matematicas_factorial:
    # 1. Prólogo canónico: reserva 32 bytes y ancla Frame Pointer
    addi sp, sp, -32
    sw ra, 28(sp)           # Salva ra para retorno seguro tras llamada
    sw s0, 24(sp)           # Salva fp llamador
    addi s0, sp, 32         # s0 apunta a la base del marco actual
    sw a0, -8(s0)           # Preserva el argumento n actual

    # 2. Caso base: if (n <= 1) return 1
    lw t0, -8(s0)           # t0 = n
    li t1, 1
    ble t0, t1, .L_BASE     # Salta si n <= 1

    # 3. Llamada recursiva: factorial(n - 1)
    addi a0, t0, -1         # a0 = n - 1 (prepara argumento)
    jal ra, Matematicas_factorial # Llamada recursiva (ra = PC + 4)
    # Al retornar, a0 contiene el resultado de factorial(n - 1)

    # 4. Desenrollado: n * factorial(n - 1)
    lw t0, -8(s0)           # Recupera el n original de este marco
    mul a0, t0, a0          # a0 = n * factorial(n - 1)
    j .L_EPILOGO

.L_BASE:
    li a0, 1                # Resultado caso base = 1

.L_EPILOGO:
    # 5. Epílogo: restaura y libera marco
    lw s0, 24(sp)
    lw ra, 28(sp)
    addi sp, sp, 32
    ret`},{id:`recursivo-fibonacci`,badge:`3. Recursión Doble: Fibonacci`,category:`Llamadas Múltiples en Árbol`,academicNote:`En algoritmos con ramificación recursiva como Fibonacci, un marco de función debe realizar múltiples llamadas consecutivas (fib(n-1) y fib(n-2)), obligando a guardar en la pila local el resultado de la primera llamada mientras se ejecuta la segunda.`,code:`class Algoritmos {
    int fibonacci(int n) {
        if (n <= 0) { return 0; }
        if (n == 1) { return 1; }
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`},{offset:`-8(fp)`,name:`Argumento n de este marco`,reg:`sw a0, -8(fp)`},{offset:`-12(fp)`,name:`Resultado intermedio fib(n-1)`,reg:`sw s1, -12(fp)`}],heapLayout:[],c3dLines:[`Algoritmos_fibonacci:`,`if n <= 0 goto L_CERO`,`if n == 1 goto L_UNO`,`t0 = n - 1`,`param t0`,`t1 = call Algoritmos_fibonacci, 1`,`t2 = n - 2`,`param t2`,`t3 = call Algoritmos_fibonacci, 1`,`t4 = t1 + t3`,`return t4`,`L_CERO: return 0`,`L_UNO:  return 1`],quadruples:[{index:1,op:`<=`,arg1:`n`,arg2:`0`,dest:`goto (12)`},{index:2,op:`==`,arg1:`n`,arg2:`1`,dest:`goto (13)`},{index:3,op:`-`,arg1:`n`,arg2:`1`,dest:`t0`},{index:4,op:`param`,arg1:`t0`,arg2:`-`,dest:`-`},{index:5,op:`call`,arg1:`fibonacci`,arg2:`1`,dest:`t1`},{index:6,op:`-`,arg1:`n`,arg2:`2`,dest:`t2`},{index:7,op:`param`,arg1:`t2`,arg2:`-`,dest:`-`},{index:8,op:`call`,arg1:`fibonacci`,arg2:`1`,dest:`t3`},{index:9,op:`+`,arg1:`t1`,arg2:`t3`,dest:`t4`},{index:10,op:`return`,arg1:`t4`,arg2:`-`,dest:`-`},{index:11,op:`goto`,arg1:`-`,arg2:`-`,dest:`(14)`},{index:12,op:`return`,arg1:`0`,arg2:`-`,dest:`-`},{index:13,op:`return`,arg1:`1`,arg2:`-`,dest:`-`},{index:14,op:`end`,arg1:`-`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl Algoritmos_fibonacci
Algoritmos_fibonacci:
    addi sp, sp, -32
    sw ra, 28(sp)
    sw s0, 24(sp)
    sw s1, 20(sp)           # s1 es un registro preservado callee-saved
    addi s0, sp, 32
    sw a0, -8(s0)           # Guarda n

    # Casos base
    lw t0, -8(s0)
    blez t0, .L_FIB_ZERO
    li t1, 1
    beq t0, t1, .L_FIB_ONE

    # Primera llamada: fib(n - 1)
    addi a0, t0, -1
    jal ra, Algoritmos_fibonacci
    mv s1, a0               # Preserva el resultado de fib(n-1) en s1

    # Segunda llamada: fib(n - 2)
    lw t0, -8(s0)           # Recupera n
    addi a0, t0, -2
    jal ra, Algoritmos_fibonacci
    # a0 tiene fib(n-2)

    # Suma: fib(n-1) + fib(n-2)
    add a0, s1, a0
    j .L_FIB_END

.L_FIB_ZERO:
    li a0, 0
    j .L_FIB_END
.L_FIB_ONE:
    li a0, 1

.L_FIB_END:
    lw s1, 20(sp)
    lw s0, 24(sp)
    lw ra, 28(sp)
    addi sp, sp, 32
    ret`},{id:`desbordamiento-args`,badge:`4. >8 Parámetros (Pila Positiva)`,category:`Convención ABI & Desbordamiento`,academicNote:`RISC-V dispone de exactamente 8 registros de argumentos (a0-a7). Si una función recibe 9 o más parámetros, el compilador los empuja a la pila en orden inverso antes de la llamada. Dentro de la función, estos argumentos adicionales se leen en offsets POSITIVOS respecto al Frame Pointer: 0(fp), 4(fp), etc.`,code:`class Facturacion {
    int liquidar(int p1, int p2, int p3, int p4, int p5, int p6, int p7, int p8, int extra1, int extra2) {
        int base = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8;
        int recargo = extra1 + extra2;
        return base + recargo;
    }
}`,stackLayout:[{offset:`4(fp)`,name:`Parámetro 10 (extra2)`,reg:`lw t1, 4(fp)`},{offset:`0(fp)`,name:`Parámetro 9 (extra1)`,reg:`lw t0, 0(fp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, -4(fp)`},{offset:`-8(fp)`,name:`Antiguo Frame Pointer`,reg:`sw s0, -8(fp)`},{offset:`-12(fp)`,name:`Variable local "base"`,reg:`sw t2, -12(fp)`}],heapLayout:[],c3dLines:[`Facturacion_liquidar:`,`t0 = p1 + p2`,`t1 = t0 + p3`,`// ... suma p4 hasta p8`,`t6 = t5 + p8`,`base = t6`,`t7 = extra1 + extra2        // extra1 y extra2 vienen de la pila positiva`,`recargo = t7`,`t8 = base + recargo`,`return t8`],quadruples:[{index:1,op:`+`,arg1:`p1`,arg2:`p2`,dest:`t0`},{index:2,op:`+`,arg1:`extra1`,arg2:`extra2`,dest:`recargo`},{index:3,op:`+`,arg1:`base`,arg2:`recargo`,dest:`t8`},{index:4,op:`return`,arg1:`t8`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl Facturacion_liquidar
Facturacion_liquidar:
    # Argumentos p1 a p8 llegan en registros a0 a a7
    # Argumentos extra1 y extra2 fueron empujados en la pila por el llamador
    addi sp, sp, -16
    sw s0, 8(sp)
    addi s0, sp, 16

    # 1. Suma los primeros 8 parámetros recibidos en registros ABI
    add t0, a0, a1
    add t0, t0, a2
    add t0, t0, a3
    add t0, t0, a4
    add t0, t0, a5
    add t0, t0, a6
    add t0, t0, a7          # t0 = suma(p1..p8)

    # 2. Lee los parámetros que desbordaron a la pila positiva (offsets >= 0(s0))
    lw t1, 0(s0)            # t1 = extra1 (offset positivo 0(fp))
    lw t2, 4(s0)            # t2 = extra2 (offset positivo 4(fp))
    add t3, t1, t2          # t3 = recargo

    # 3. Retorno del total
    add a0, t0, t3          # a0 = base + recargo

    lw s0, 8(sp)
    addi sp, sp, 16
    ret`}],i=t(0),a=t(`c3d`),o=s(()=>r[i.value]),c=t(r[0].code),l=s(()=>({c3dLines:o.value.c3dLines,quadruples:o.value.quadruples,riscvAssembly:o.value.riscvAssembly}));function u(e){i.value=e,c.value=r[e].code}function d(){c.value=o.value.code}function f(){a.value=`c3d`}let p={presets:r,selectedPresetIdx:i,activeOutputTab:a,currentPreset:o,sourceCode:c,compiledResult:l,selectPreset:u,resetToCurrentPreset:d,compileCustom:f};return Object.defineProperty(p,"__isScriptSetup",{enumerable:!1,value:!0}),p}}),_={class:`bg-[#0d1527] border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl text-slate-200 space-y-6`},v={class:`flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5`},y={class:`flex flex-wrap items-center gap-2 text-xs`},b=[`onClick`],x={class:`grid grid-cols-1 lg:grid-cols-12 gap-6`},S={class:`lg:col-span-5 space-y-3`},C={class:`flex items-center justify-between border-b border-slate-800 pb-2`},w={class:`text-xs font-mono text-purple-300`},T={class:`relative rounded-2xl border border-slate-700/80 bg-[#080d1a] overflow-hidden shadow-inner focus-within:border-cyan-400 transition`},E={class:`p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-2 text-xs leading-relaxed`},D={class:`text-slate-300`},O={class:`lg:col-span-7 space-y-3`},k={class:`flex border-b border-slate-800 text-xs font-mono overflow-x-auto gap-1`},A={key:0,class:`space-y-3`},j={class:`p-4 bg-[#080d1a] rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner max-h-[460px] overflow-y-auto`},M={class:`space-y-1`},N={class:`text-xs text-slate-500 w-8 select-none font-mono`},P={key:1,class:`space-y-3`},F={class:`overflow-x-auto max-h-[460px] overflow-y-auto border border-slate-800 rounded-2xl bg-[#080d1a] shadow-inner`},ee={class:`w-full text-left text-xs font-mono min-w-[550px]`},I={class:`divide-y divide-slate-800/60`},L={class:`p-2.5 text-slate-500`},R={class:`p-2.5 font-bold text-purple-400`},z={class:`p-2.5 text-cyan-300`},B={class:`p-2.5 text-cyan-300`},V={class:`p-2.5`},H={class:`text-sky-300 font-bold bg-slate-900 border border-sky-500/30 px-2 py-0.5 rounded`},U={key:2,class:`space-y-3`},W={class:`p-4 bg-[#080d1a] rounded-2xl border border-slate-800 font-mono text-xs sm:text-sm overflow-x-auto shadow-inner max-h-[460px] overflow-y-auto`},G={class:`text-slate-200 leading-relaxed whitespace-pre font-mono`},K={key:3,class:`space-y-4`},q={class:`grid grid-cols-1 md:grid-cols-2 gap-4`},J={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3`},Y={class:`space-y-1.5 font-mono text-xs`},X={class:`text-purple-400 font-bold`},Z={class:`text-slate-200`},Q={class:`text-[11px] text-cyan-400 font-bold bg-[#080d1a] px-2 py-0.5 rounded`},$={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3`},te={class:`space-y-1.5 font-mono text-xs`},ne={class:`text-emerald-400 font-bold`},re={class:`text-slate-200`},ie={class:`text-[11px] text-amber-300 font-bold bg-[#080d1a] px-2 py-0.5 rounded`};function ae(t,s,c,h,g,ae){return d(),i(`div`,_,[r(`div`,v,[s[6]||=a(`<div><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 mb-2 shadow-[0_0_10px_rgba(6,182,212,0.25)]"><span>🚀</span><span>COMPILADOR EN VIVO: JAVA ➔ C3D ➔ CUARTETAS ➔ RISC-V</span></div><h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5"><span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse"></span> Laboratorio de Traducción Integral </h3><p class="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed"> Escriba código estilo Java o seleccione casos complejos avanzados (POO con puntero <code class="text-cyan-400 font-bold">this</code> y Heap, llamadas recursivas y manejo del Frame Pointer). Observe en tiempo real la descomposición a Código Intermedio, Cuartetas y Ensamblador RV32I. </p></div>`,1),r(`div`,y,[s[5]||=r(`span`,{class:`text-slate-400 font-mono font-bold`},`Casos Avanzados:`,-1),(d(),i(u,null,p(h.presets,(t,i)=>r(`button`,{key:t.id,onClick:e=>h.selectPreset(i),class:e([h.selectedPresetIdx===i?`bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]`:`bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700`,`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer`])},n(t.badge),11,b)),64))])]),r(`div`,x,[r(`div`,S,[r(`div`,C,[s[7]||=r(`label`,{class:`text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2`},[r(`span`,{class:`w-2 h-2 rounded-full bg-purple-400`}),o(` Código Fuente (Estilo Java / C) `)],-1),r(`span`,w,n(h.currentPreset.category),1)]),r(`div`,T,[f(r(`textarea`,{"onUpdate:modelValue":s[0]||=e=>h.sourceCode=e,rows:`18`,spellcheck:`false`,class:`w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-cyan-200 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500 selection:text-slate-950`,placeholder:`// Escriba su clase, métodos, condicionales o recursión...`},null,512),[[m,h.sourceCode]])]),r(`div`,{class:`flex flex-wrap items-center justify-between gap-3 pt-1`},[r(`button`,{onClick:h.compileCustom,class:`px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold font-mono text-xs shadow-[0_0_18px_rgba(168,85,247,0.35)] transition cursor-pointer flex items-center gap-2`},[...s[8]||=[r(`span`,null,`⚡ Compilar y Analizar Pipeline`,-1)]]),r(`button`,{onClick:h.resetToCurrentPreset,class:`px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer`},` Restaurar Caso `)]),r(`div`,E,[s[9]||=r(`h4`,{class:`font-bold text-cyan-300 font-mono flex items-center gap-1.5`},[r(`span`,null,`💡`),o(` Concepto Clave del Compilador: `)],-1),r(`p`,D,n(h.currentPreset.academicNote),1)])]),r(`div`,O,[r(`div`,k,[r(`button`,{onClick:s[1]||=e=>h.activeOutputTab=`c3d`,class:e([h.activeOutputTab===`c3d`?`border-b-2 border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...s[10]||=[r(`span`,null,`1. Código Intermedio (C3D)`,-1)]],2),r(`button`,{onClick:s[2]||=e=>h.activeOutputTab=`cuartetas`,class:e([h.activeOutputTab===`cuartetas`?`border-b-2 border-purple-400 text-purple-300 font-bold bg-purple-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...s[11]||=[r(`span`,null,`2. Cuartetas / Cuádruplas`,-1)]],2),r(`button`,{onClick:s[3]||=e=>h.activeOutputTab=`riscv`,class:e([h.activeOutputTab===`riscv`?`border-b-2 border-sky-400 text-sky-300 font-bold bg-sky-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...s[12]||=[r(`span`,null,`3. Ensamblador RISC-V RV32I`,-1)]],2),r(`button`,{onClick:s[4]||=e=>h.activeOutputTab=`memoria`,class:e([h.activeOutputTab===`memoria`?`border-b-2 border-emerald-400 text-emerald-300 font-bold bg-emerald-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...s[13]||=[r(`span`,null,`4. Pila & Heap (Memoria)`,-1)]],2)]),h.activeOutputTab===`c3d`?(d(),i(`div`,A,[r(`div`,j,[r(`div`,M,[(d(!0),i(u,null,p(h.compiledResult.c3dLines,(t,a)=>(d(),i(`div`,{key:a,class:`flex items-center gap-3 py-0.5 hover:bg-slate-900/60 px-2 rounded`},[r(`span`,N,n(a+1)+`.`,1),r(`span`,{class:e(t.endsWith(`:`)?`text-purple-400 font-bold`:t.startsWith(`//`)?`text-slate-500 italic`:`text-slate-200`)},n(t),3)]))),128))])]),s[14]||=r(`div`,{class:`p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-slate-300 leading-relaxed`},[r(`strong`,{class:`text-cyan-300`},`Regla C3D de Cátedra:`),o(` Cada instrucción intermedia descompone operaciones complejas y accesos a objetos en asignaciones con como máximo un operador y dos operandos (`),r(`code`,{class:`text-cyan-300`},`dest = op1 op op2`),o(`). `)],-1)])):l(``,!0),h.activeOutputTab===`cuartetas`?(d(),i(`div`,P,[r(`div`,F,[r(`table`,ee,[s[15]||=r(`thead`,{class:`bg-[#0a101f] text-slate-300 sticky top-0 border-b border-slate-800`},[r(`tr`,null,[r(`th`,{class:`p-2.5`},`#`),r(`th`,{class:`p-2.5 text-purple-400`},`Operador (op)`),r(`th`,{class:`p-2.5 text-cyan-400`},`Argumento 1`),r(`th`,{class:`p-2.5 text-cyan-400`},`Argumento 2`),r(`th`,{class:`p-2.5 text-sky-400`},`Resultado / Destino`)])],-1),r(`tbody`,I,[(d(!0),i(u,null,p(h.compiledResult.quadruples,e=>(d(),i(`tr`,{key:e.index,class:`hover:bg-slate-900/50`},[r(`td`,L,`(`+n(e.index)+`)`,1),r(`td`,R,n(e.op),1),r(`td`,z,n(e.arg1),1),r(`td`,B,n(e.arg2),1),r(`td`,V,[r(`span`,H,n(e.dest),1)])]))),128))])])]),s[16]||=a(`<p class="text-xs text-slate-400"> En POO y funciones, las cuartetas formales registran operaciones de llamada (<code class="text-purple-300">param</code>, <code class="text-purple-300">call</code>), accesos indirectos a campos en el Heap (<code class="text-purple-300">[]=</code>, <code class="text-purple-300">=[]</code>) y saltos de control. </p>`,1)])):l(``,!0),h.activeOutputTab===`riscv`?(d(),i(`div`,U,[r(`div`,W,[r(`pre`,G,[r(`code`,null,n(h.compiledResult.riscvAssembly),1)])]),s[17]||=a(`<div class="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-slate-300 leading-relaxed"><strong class="text-purple-300">Convención RISC-V del Ing. Mario Ramírez Tobar:</strong> Las funciones preservan su Frame Pointer en <code class="text-cyan-300">0(fp)</code> o en el prólogo, la dirección de retorno en <code class="text-cyan-300">-4(fp)</code>, y los argumentos en <code class="text-cyan-300">-8(fp)</code> en adelante. </div>`,1)])):l(``,!0),h.activeOutputTab===`memoria`?(d(),i(`div`,K,[r(`div`,q,[r(`div`,J,[s[18]||=r(`div`,{class:`flex items-center justify-between border-b border-slate-800 pb-2`},[r(`span`,{class:`text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5`},[r(`span`,null,`⬇`),o(` Pila (Stack Frame) `)]),r(`span`,{class:`text-[11px] font-mono text-slate-400`},`Offset respecto a fp`)],-1),r(`div`,Y,[(d(!0),i(u,null,p(h.currentPreset.stackLayout,(e,t)=>(d(),i(`div`,{key:t,class:`p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between`},[r(`span`,X,n(e.offset),1),r(`span`,Z,n(e.name),1),r(`span`,Q,n(e.reg),1)]))),128))])]),r(`div`,$,[s[19]||=r(`div`,{class:`flex items-center justify-between border-b border-slate-800 pb-2`},[r(`span`,{class:`text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5`},[r(`span`,null,`📦`),o(` Heap (Instancia POO 0x1000) `)]),r(`span`,{class:`text-[11px] font-mono text-slate-400`},"Puntero `this`")],-1),r(`div`,te,[(d(!0),i(u,null,p(h.currentPreset.heapLayout,(e,t)=>(d(),i(`div`,{key:t,class:`p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between`},[r(`span`,ne,n(e.addr),1),r(`span`,re,n(e.field),1),r(`span`,ie,n(e.value),1)]))),128))]),s[20]||=r(`p`,{class:`text-[11px] text-slate-400 leading-normal pt-1`},[o(" * En POO, los atributos residen únicamente en el Heap. Durante recursión o llamadas a métodos, el puntero `this` se pasa en "),r(`code`,{class:`text-cyan-400 font-bold`},`a0`),o(` sin duplicar atributos en la pila. `)],-1)])])])):l(``,!0)])])])}var oe=h(g,[[`render`,ae]]);export{oe as default};