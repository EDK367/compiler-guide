import{I as e,L as t,R as n,_ as r,a as i,b as a,d as o,i as s,o as c,p as l,s as u,t as d,u as f,v as p,x as m}from"./runtime-core.esm-bundler.38a7Ky-5.js";import{r as h}from"./runtime-dom.esm-bundler.Cvu8JrEH.js";import{n as g,t as _}from"./editorUtils.BAsKNdq0.js";import{i as ee,n as te,o as v}from"./syntaxHighlight.G9m-4a8p.js";import{t as y}from"./_plugin-vue_export-helper.BDNMzG2s.js";var b=l({__name:`FullPipelineLab`,setup(e,{expose:t}){t();let n=[{id:`poo-this-heap`,badge:`1. POO & Puntero this`,category:`Programación Orientada a Objetos`,academicNote:`En POO, la invocación de un método traduce el puntero "this" implícito al primer argumento (registro a0). Los atributos del objeto residen en memoria Heap (a partir de 0x1000) y se acceden mediante direccionamiento indexado offset(this), evitando duplicar la clase en la pila.`,code:`// Caso 1: Programación Orientada a Objetos con Atributos en Memoria Heap
// El puntero 'this' se transfiere en el registro ABI a0 como primer argumento.
class CuentaBancaria {
    int saldo;        // Reside en Heap: offset 0 respecto a this
    int titularId;    // Reside en Heap: offset 4 respecto a this

    // Método para incrementar el saldo de la cuenta
    int depositar(int monto) {
        this.saldo = this.saldo + monto; // Modifica atributo persistente en Heap
        return this.saldo;
    }

    // Método para transferir con comprobación de fondos suficientes
    int transferir(int destinoId, int monto) {
        if (this.saldo >= monto) {
            this.saldo = this.saldo - monto;
            return 1; // Éxito en la transferencia
        }
        return 0;     // Fondos insuficientes
    }
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra`},{offset:`-8(fp)`,name:`Puntero "this" de la clase`,reg:`sw a0`},{offset:`-12(fp)`,name:`Primer parámetro (monto)`,reg:`sw a1`}],heapLayout:[{addr:`0x1000`,field:`this.saldo (int32)`,value:`1500`},{addr:`0x1004`,field:`this.titularId (int32)`,value:`48291`}],c3dLines:[`// Sitio de llamada (invocación con paso de parámetros)`,`param this                   // Parámetro 1: referencia a la instancia en Heap`,`param monto                  // Parámetro 2: valor a depositar`,`t_ret = call CuentaBancaria_depositar, 2`,``,`// Subprograma: CuentaBancaria_depositar`,`CuentaBancaria_depositar:`,`t0 = Heap[this + 0]          // Carga atributo this.saldo desde Heap`,`t1 = t0 + monto              // Suma saldo actual y monto recibido`,`Heap[this + 0] = t1          // Almacena nuevo saldo en Heap`,`return t1                    // Retorna nuevo saldo en a0`,``,`// Sitio de llamada (invocación a transferir)`,`param this                   // Parámetro 1: referencia al objeto`,`param destinoId              // Parámetro 2: id destino`,`param monto                  // Parámetro 3: monto a debitar`,`t_ret2 = call CuentaBancaria_transferir, 3`,``,`// Subprograma: CuentaBancaria_transferir (Traducción Dirigida por Sintaxis NO Optimizada)`,`CuentaBancaria_transferir:`,`t2 = Heap[this + 0]          // Carga this.saldo desde Heap`,`if t2 >= monto goto L_SUF_TRUE // Salto si condición se cumple`,`goto L_SUF_FALSE             // GOTO TRAS IF: salto a rama falsa`,`L_SUF_TRUE:                  // Rama verdadera (fondos suficientes)`,`t3 = t2 - monto`,`Heap[this + 0] = t3          // Descuenta saldo en Heap`,`return 1                     // Retorna 1 (éxito)`,`goto L_TRANS_FIN             // Salto al fin de la estructura`,`L_SUF_FALSE:                 // Rama falsa (fondos insuficientes)`,`return 0                     // Retorna 0 (error)`,`L_TRANS_FIN:`],c3dLinesUnoptimized:[`// Sitio de llamada (invocación con paso de parámetros)`,`param this                   // Parámetro 1: referencia a la instancia en Heap`,`param monto                  // Parámetro 2: valor a depositar`,`t_ret = call CuentaBancaria_depositar, 2`,``,`// Subprograma: CuentaBancaria_depositar`,`CuentaBancaria_depositar:`,`t0 = Heap[this + 0]          // Carga atributo this.saldo desde Heap`,`t1 = t0 + monto              // Suma saldo actual y monto recibido`,`Heap[this + 0] = t1          // Almacena nuevo saldo en Heap`,`return t1                    // Retorna saldo actualizado en a0`,``,`// Sitio de llamada (invocación a transferir)`,`param this                   // Parámetro 1: referencia al objeto`,`param destinoId              // Parámetro 2: id destino`,`param monto                  // Parámetro 3: monto a debitar`,`t_ret2 = call CuentaBancaria_transferir, 3`,``,`// Subprograma: CuentaBancaria_transferir (Traducción Dirigida por Sintaxis NO Optimizada)`,`CuentaBancaria_transferir:`,`t2 = Heap[this + 0]          // Carga this.saldo desde Heap`,`if t2 >= monto goto L_SUF_TRUE // Salto si condición se cumple`,`goto L_SUF_FALSE             // GOTO TRAS IF: salto a rama falsa`,`L_SUF_TRUE:                  // Rama verdadera (fondos suficientes)`,`t3 = t2 - monto`,`Heap[this + 0] = t3          // Descuenta saldo en Heap`,`return 1                     // Retorna 1 (éxito)`,`goto L_TRANS_FIN             // Salto al fin de la estructura`,`L_SUF_FALSE:                 // Rama falsa (fondos insuficientes)`,`return 0                     // Retorna 0 (error)`,`L_TRANS_FIN:`],c3dLinesOptimized:`// Invocación externa del método depositar:.param this.param monto.t_ret = call CuentaBancaria_depositar, 2..// Subprograma: CuentaBancaria_depositar.CuentaBancaria_depositar:.t0 = Heap[this + 0].t1 = t0 + monto.Heap[this + 0] = t1.return t1..// Invocación externa del método transferir:.param this.param destinoId.param monto.t_ret2 = call CuentaBancaria_transferir, 3..// Subprograma: CuentaBancaria_transferir (Optimizado por inversión de saltos).CuentaBancaria_transferir:.t2 = Heap[this + 0].// Optimización: salto directo si saldo < monto (elimina L_SUF_TRUE y goto extra).if t2 < monto goto L_SUF_FALLA.t3 = t2 - monto.Heap[this + 0] = t3.return 1.L_SUF_FALLA:.return 0`.split(`.`),quadruples:[{index:1,op:`param`,arg1:`this`,arg2:`-`,dest:`-`},{index:2,op:`param`,arg1:`monto`,arg2:`-`,dest:`-`},{index:3,op:`call`,arg1:`depositar`,arg2:`2`,dest:`t_ret`},{index:4,op:`=[]`,arg1:`this`,arg2:`0`,dest:`t0`},{index:5,op:`+`,arg1:`t0`,arg2:`monto`,dest:`t1`},{index:6,op:`[]=`,arg1:`this`,arg2:`0`,dest:`t1`},{index:7,op:`return`,arg1:`t1`,arg2:`-`,dest:`-`},{index:8,op:`param`,arg1:`this`,arg2:`-`,dest:`-`},{index:9,op:`param`,arg1:`destinoId`,arg2:`-`,dest:`-`},{index:10,op:`param`,arg1:`monto`,arg2:`-`,dest:`-`},{index:11,op:`call`,arg1:`transferir`,arg2:`3`,dest:`t_ret2`},{index:12,op:`=[]`,arg1:`this`,arg2:`0`,dest:`t2`},{index:13,op:`>=`,arg1:`t2`,arg2:`monto`,dest:`goto (15)`},{index:14,op:`return`,arg1:`0`,arg2:`-`,dest:`-`},{index:15,op:`-`,arg1:`t2`,arg2:`monto`,dest:`t3`},{index:16,op:`[]=`,arg1:`this`,arg2:`0`,dest:`t3`},{index:17,op:`return`,arg1:`1`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl CuentaBancaria_depositar
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
    ret                     # Retorno a llamador (jalr zero, ra, 0)`},{id:`recursivo-factorial`,badge:`2. Recursión: Factorial`,category:`Llamadas Recursivas & Pila`,academicNote:`En funciones recursivas, cada llamada anidada crea un nuevo registro de activación en la pila. La convención exige preservar ra y s0/fp en cada nivel para que al alcanzar el caso base (n <= 1), la pila se desenrolle correctamente multiplicando hacia arriba.`,code:`// Caso 2: Función Recursiva Simple - Cálculo de Factorial
// Demuestra la preservación del marco de pila y el desenrollado LIFO.
class Matematicas {
    int factorial(int n) {
        // Caso base: 0! = 1! = 1
        if (n <= 1) {
            return 1;
        }
        // Llamada recursiva anidada: n * factorial(n - 1)
        return n * factorial(n - 1);
    }
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`},{offset:`-8(fp)`,name:`Argumento n de este marco`,reg:`sw a0, -8(fp)`},{offset:`-12(fp)`,name:`Temporal n * resultado`,reg:`sw t2, -12(fp)`}],heapLayout:[{addr:`0x1000`,field:`Instancia Matematicas`,value:`vtable_ptr`}],c3dLines:[`// Subprograma: Matematicas_factorial (Traducción canónica no optimizada)`,`Matematicas_factorial:`,`if n <= 1 goto L_BASE_TRUE   // Salto condicional al caso base`,`goto L_RECURSION_FALSE       // GOTO TRAS IF: salto a recursión`,`L_BASE_TRUE:`,`return 1                     // Caso base: 0! = 1! = 1`,`goto L_FACT_END`,`L_RECURSION_FALSE:`,`t0 = n - 1                   // Prepara argumento recursivo`,`param t0                     // Pasa t0 a la llamada recursiva`,`t1 = call Matematicas_factorial, 1`,`t2 = n * t1                  // Multiplica al regresar del desenrollado`,`return t2`,`L_FACT_END:`],c3dLinesUnoptimized:[`// Subprograma: Matematicas_factorial (Traducción canónica no optimizada)`,`Matematicas_factorial:`,`if n <= 1 goto L_BASE_TRUE   // Salto condicional al caso base`,`goto L_RECURSION_FALSE       // GOTO TRAS IF: salto a recursión`,`L_BASE_TRUE:`,`return 1                     // Caso base: 0! = 1! = 1`,`goto L_FACT_END`,`L_RECURSION_FALSE:`,`t0 = n - 1                   // Prepara argumento recursivo`,`param t0                     // Pasa t0 a la llamada recursiva`,`t1 = call Matematicas_factorial, 1`,`t2 = n * t1                  // Multiplica al regresar del desenrollado`,`return t2`,`L_FACT_END:`],c3dLinesOptimized:[`// Subprograma: Matematicas_factorial (Optimizado por inversión de salto)`,`Matematicas_factorial:`,`// Optimización: salto directo a recursión si n > 1 (caso base retornado inline)`,`if n > 1 goto L_RECURSION`,`return 1                     // Caso base retornado de inmediato`,`L_RECURSION:`,`t0 = n - 1`,`param t0`,`t1 = call Matematicas_factorial, 1`,`t2 = n * t1`,`return t2`],quadruples:[{index:1,op:`<=`,arg1:`n`,arg2:`1`,dest:`goto (8)`},{index:2,op:`-`,arg1:`n`,arg2:`1`,dest:`t0`},{index:3,op:`param`,arg1:`t0`,arg2:`-`,dest:`-`},{index:4,op:`call`,arg1:`factorial`,arg2:`1`,dest:`t1`},{index:5,op:`*`,arg1:`n`,arg2:`t1`,dest:`t2`},{index:6,op:`return`,arg1:`t2`,arg2:`-`,dest:`-`},{index:7,op:`goto`,arg1:`-`,arg2:`-`,dest:`(9)`},{index:8,op:`return`,arg1:`1`,arg2:`-`,dest:`-`},{index:9,op:`end`,arg1:`-`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl Matematicas_factorial
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
    ret`},{id:`recursivo-fibonacci`,badge:`3. Recursión Doble: Fibonacci`,category:`Llamadas Múltiples en Árbol`,academicNote:`En algoritmos con ramificación recursiva como Fibonacci, cada marco de función debe realizar múltiples llamadas consecutivas (fib(n-1) y fib(n-2)), obligando a guardar en la pila local el resultado de la primera llamada mientras se ejecuta la segunda. El registro callee-saved s1 y la ranura -12(fp) protegen este valor.`,code:`// Caso 3: Recursión Doble - Secuencia de Fibonacci
// El compilador gestiona marcos ramificados en árbol binario
class Algoritmos {
    // Calcula el n-ésimo término de Fibonacci: fib(n) = fib(n-1) + fib(n-2)
    int fibonacci(int n) {
        // CASO BASE 1: Si n <= 0, el valor de la serie es 0
        if (n <= 0) { 
            return 0; // Retorna 0 inmediatamente sin bifurcar
        }
        
        // CASO BASE 2: Si n == 1, el valor de la serie es 1
        if (n == 1) { 
            return 1; // Retorna 1 inmediatamente sin bifurcar
        }
        
        // PASO RECURSIVO DOBLE (Bifurcación en árbol):
        // 1. Se calcula fib(n - 1) y su resultado se resguarda en el registro s1.
        // 2. Se calcula fib(n - 2) en una segunda llamada recursiva.
        // 3. Se suman ambos resultados al regresar del desenrollado de la pila.
        return fibonacci(n - 1) + fibonacci(n - 2);
    }
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`},{offset:`-8(fp)`,name:`Argumento n de este marco`,reg:`sw a0, -8(fp)`},{offset:`-12(fp)`,name:`Resultado intermedio fib(n-1)`,reg:`sw s1, -12(fp)`}],heapLayout:[],c3dLines:`// Subprograma: Algoritmos_fibonacci (Canónico con goto tras if).Algoritmos_fibonacci:.// Evaluación caso base 1 (n <= 0):.if n <= 0 goto L_BASE0_TRUE.goto L_BASE0_FALSE           // GOTO TRAS IF: continúa evaluación.L_BASE0_TRUE:.return 0.goto L_FIB_END.L_BASE0_FALSE:.// Evaluación caso base 2 (n == 1):.if n == 1 goto L_BASE1_TRUE.goto L_RECURSION_DOBLE       // GOTO TRAS IF: continúa a recursión.L_BASE1_TRUE:.return 1.goto L_FIB_END.L_RECURSION_DOBLE:.// Rama izquierda: fib(n - 1).t0 = n - 1.param t0.t1 = call Algoritmos_fibonacci, 1.// Rama derecha: fib(n - 2).t2 = n - 2.param t2.t3 = call Algoritmos_fibonacci, 1.t4 = t1 + t3.return t4.L_FIB_END:`.split(`.`),c3dLinesUnoptimized:`// Subprograma: Algoritmos_fibonacci (Canónico con goto tras if).Algoritmos_fibonacci:.// Evaluación caso base 1 (n <= 0):.if n <= 0 goto L_BASE0_TRUE.goto L_BASE0_FALSE           // GOTO TRAS IF: continúa evaluación.L_BASE0_TRUE:.return 0.goto L_FIB_END.L_BASE0_FALSE:.// Evaluación caso base 2 (n == 1):.if n == 1 goto L_BASE1_TRUE.goto L_RECURSION_DOBLE       // GOTO TRAS IF: continúa a recursión.L_BASE1_TRUE:.return 1.goto L_FIB_END.L_RECURSION_DOBLE:.// Rama izquierda: fib(n - 1).t0 = n - 1.param t0.t1 = call Algoritmos_fibonacci, 1.// Rama derecha: fib(n - 2).t2 = n - 2.param t2.t3 = call Algoritmos_fibonacci, 1.t4 = t1 + t3.return t4.L_FIB_END:`.split(`.`),c3dLinesOptimized:[`// Subprograma: Algoritmos_fibonacci (Optimizado con poda de saltos)`,`Algoritmos_fibonacci:`,`// Optimización: saltos directos sin bifurcaciones intermedias redundantes`,`if n <= 0 goto L_CERO`,`if n == 1 goto L_UNO`,`t0 = n - 1`,`param t0`,`t1 = call Algoritmos_fibonacci, 1`,`t2 = n - 2`,`param t2`,`t3 = call Algoritmos_fibonacci, 1`,`t4 = t1 + t3`,`return t4`,`L_CERO:`,`return 0`,`L_UNO:`,`return 1`],quadruples:[{index:1,op:`<=`,arg1:`n`,arg2:`0`,dest:`goto (12)`},{index:2,op:`==`,arg1:`n`,arg2:`1`,dest:`goto (13)`},{index:3,op:`-`,arg1:`n`,arg2:`1`,dest:`t0`},{index:4,op:`param`,arg1:`t0`,arg2:`-`,dest:`-`},{index:5,op:`call`,arg1:`fibonacci`,arg2:`1`,dest:`t1`},{index:6,op:`-`,arg1:`n`,arg2:`2`,dest:`t2`},{index:7,op:`param`,arg1:`t2`,arg2:`-`,dest:`-`},{index:8,op:`call`,arg1:`fibonacci`,arg2:`1`,dest:`t3`},{index:9,op:`+`,arg1:`t1`,arg2:`t3`,dest:`t4`},{index:10,op:`return`,arg1:`t4`,arg2:`-`,dest:`-`},{index:11,op:`goto`,arg1:`-`,arg2:`-`,dest:`(14)`},{index:12,op:`return`,arg1:`0`,arg2:`-`,dest:`-`},{index:13,op:`return`,arg1:`1`,arg2:`-`,dest:`-`},{index:14,op:`end`,arg1:`-`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl Algoritmos_fibonacci
Algoritmos_fibonacci:
    # 1. Prólogo canónico: Reserva marco de 32 bytes y salva ra, s0 y s1
    addi sp, sp, -32        # Decrementa SP: reserva marco de activación
    sw ra, 28(sp)           # Preserva dirección de retorno ra en offset 28
    sw s0, 24(sp)           # Preserva Frame Pointer del llamador en offset 24
    sw s1, 20(sp)           # Preserva registro s1 (para guardar rama izquierda)
    addi s0, sp, 32         # Establece nuevo Frame Pointer anclado en la base
    sw a0, -8(s0)           # Guarda argumento n (a0) en la ranura local -8(fp)

    # 2. Evaluación de casos base
    lw t0, -8(s0)           # Carga parámetro n desde la pila local a t0
    blez t0, .L_FIB_ZERO    # Si n <= 0, salta a retornar 0
    li t1, 1                # Carga constante 1 para comparación
    beq t0, t1, .L_FIB_ONE  # Si n == 1, salta a retornar 1

    # 3. Primera llamada recursiva: fib(n - 1) (Rama Izquierda)
    addi a0, t0, -1         # Prepara argumento para hijo izquierdo: a0 = n - 1
    jal ra, Algoritmos_fibonacci # Salta y enlaza (ra = PC + 4, crea nuevo marco)
    mv s1, a0               # PROTEGE resultado en s1 (callee-saved resiste llamadas)

    # 4. Segunda llamada recursiva: fib(n - 2) (Rama Derecha)
    lw t0, -8(s0)           # RECUPERA n original de este marco (no el del hijo)
    addi a0, t0, -2         # Prepara argumento para hijo derecho: a0 = n - 2
    jal ra, Algoritmos_fibonacci # Salta y enlaza (segunda llamada recursiva)

    # 5. Combinación de resultados
    add a0, s1, a0          # a0 = s1 (fib(n-1)) + a0 (fib(n-2))
    j .L_FIB_END            # Salta al epílogo común para retornar

.L_FIB_ZERO:
    li a0, 0                # Caso base: valor de retorno = 0
    j .L_FIB_END

.L_FIB_ONE:
    li a0, 1                # Caso base: valor de retorno = 1

.L_FIB_END:
    # 6. Epílogo canónico: Restaura registros preservados y destruye marco
    lw s1, 20(sp)           # Restaura s1 original del llamador
    lw s0, 24(sp)           # Restaura Frame Pointer original
    lw ra, 28(sp)           # Restaura dirección de retorno ra
    addi sp, sp, 32         # Libera los 32 bytes del marco de la pila
    ret                     # Retorna al llamador (jalr zero, ra, 0)`},{id:`desbordamiento-args`,badge:`4. >8 Parámetros (Pila Positiva)`,category:`Convención ABI & Desbordamiento`,academicNote:`RISC-V dispone de exactamente 8 registros de argumentos (a0-a7). Si una función recibe 9 o más parámetros, el compilador los empuja a la pila en orden inverso antes de la llamada. Dentro de la función, estos argumentos adicionales se leen en offsets POSITIVOS respecto al Frame Pointer: 0(fp), 4(fp), etc.`,code:`// Caso 4: Desbordamiento de Argumentos (>8 parámetros)
// Los primeros 8 parámetros se transmiten en registros a0 a a7.
// Los parámetros adicionales se envían en la Pila Positiva (offsets >= 0(fp)).
class Facturacion {
    int liquidar(int p1, int p2, int p3, int p4, int p5, int p6, int p7, int p8, int extra1, int extra2) {
        int base = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8;
        int recargo = extra1 + extra2; // extra1 y extra2 se leen de la pila positiva
        return base + recargo;
    }
}`,stackLayout:[{offset:`4(fp)`,name:`Parámetro 10 (extra2)`,reg:`lw t1, 4(fp)`},{offset:`0(fp)`,name:`Parámetro 9 (extra1)`,reg:`lw t0, 0(fp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, -4(fp)`},{offset:`-8(fp)`,name:`Antiguo Frame Pointer`,reg:`sw s0, -8(fp)`},{offset:`-12(fp)`,name:`Variable local "base"`,reg:`sw t2, -12(fp)`}],heapLayout:[],c3dLines:[`// Subprograma: Facturacion_liquidar (Canónico sin reducción de temporales)`,`Facturacion_liquidar:`,`t0 = p1 + p2`,`t1 = t0 + p3`,`t2 = t1 + p4`,`t3 = t2 + p5`,`t4 = t3 + p6`,`t5 = t4 + p7`,`t6 = t5 + p8`,`base = t6                   // Asignación de copia intermedia`,`t7 = extra1 + extra2        // Argumentos desbordados en pila positiva (>= 0(fp))`,`recargo = t7                // Asignación de copia intermedia`,`t8 = base + recargo`,`total = t8`,`return total`],c3dLinesUnoptimized:[`// Subprograma: Facturacion_liquidar (Canónico sin reducción de temporales)`,`Facturacion_liquidar:`,`t0 = p1 + p2`,`t1 = t0 + p3`,`t2 = t1 + p4`,`t3 = t2 + p5`,`t4 = t3 + p6`,`t5 = t4 + p7`,`t6 = t5 + p8`,`base = t6                   // Asignación de copia intermedia`,`t7 = extra1 + extra2        // Argumentos desbordados en pila positiva (>= 0(fp))`,`recargo = t7                // Asignación de copia intermedia`,`t8 = base + recargo`,`total = t8`,`return total`],c3dLinesOptimized:[`// Subprograma: Facturacion_liquidar (Optimizado: reutilización y eliminación de copias)`,`Facturacion_liquidar:`,`t0 = p1 + p2`,`t0 = t0 + p3`,`t0 = t0 + p4`,`t0 = t0 + p5`,`t0 = t0 + p6`,`t0 = t0 + p7`,`t0 = t0 + p8                // Acumulador unificado en t0`,`t1 = extra1 + extra2        // Leídos de 0(fp) y 4(fp)`,`t0 = t0 + t1                // Eliminadas variables intermedias base y recargo`,`return t0`],quadruples:[{index:1,op:`+`,arg1:`p1`,arg2:`p2`,dest:`t0`},{index:2,op:`+`,arg1:`extra1`,arg2:`extra2`,dest:`recargo`},{index:3,op:`+`,arg1:`base`,arg2:`recargo`,dest:`t8`},{index:4,op:`return`,arg1:`t8`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl Facturacion_liquidar
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
    ret`},{id:`programa-completo-main-arreglos`,badge:`5. Programa Completo: Main & Arreglos`,category:`Arquitectura Integral de Programa`,academicNote:`Este laboratorio representa la integración completa de un compilador de producción: función "main" de inicio, asignación e indexación de arreglos unidimensionales en memoria Heap, llamadas a subprogramas con paso de parámetros, ciclos "while", condicionales "if-else", variables booleanas (true/false) y cadenas literales con salida a consola.`,code:`// Caso 5: Programa Integral Completo (Main, Funciones, Arreglos, Ciclos & Strings)
// Demuestra la coordinación completa entre el Stack Frame, el Heap y la sección .data
class SistemaEstadistico {
    int[] datos;           // Referencia al búfer de datos en memoria Heap
    int cantidad;          // Cantidad de elementos registrados en el sistema
    boolean procesado;     // Bandera booleana de estado de cálculo

    // Función auxiliar: Recorre el arreglo, filtra por umbral y acumula la suma
    int calcularSumaFiltrada(int[] arr, int n, int umbral) {
        int suma = 0;              // Acumulador local
        int i = 0;                 // Variable de control del ciclo
        boolean hayValidos = false; // Bandera de detección de elementos válidos

        // Ciclo iterativo para recorrer los elementos del arreglo
        while (i < n) {
            int elemento = arr[i]; // Acceso indexado arr[i] en memoria Heap
            
            // Condicional de filtrado respecto al umbral requerido
            if (elemento > umbral) {
                suma = suma + elemento; // Acumula elemento válido
                hayValidos = true;      // Activa bandera booleana
            } else {
                suma = suma + 0;        // Ignora valores menores o iguales
            }
            i = i + 1; // Incremento de la variable de inducción
        }

        // Si se encontraron elementos válidos retorna la suma, de lo contrario -1
        if (hayValidos == true) {
            return suma;
        } else {
            return -1;
        }
    }

    // Método principal: punto de entrada y orquestador del programa
    void main() {
        // 1. Inicialización de atributos del objeto en el Heap
        this.cantidad = 5;
        this.procesado = false;
        
        // 2. Creación e inicialización del arreglo de 5 elementos en el Heap
        int[] lista = new int[5];
        lista[0] = 10;
        lista[1] = 25;
        lista[2] = 5;
        lista[3] = 40;
        lista[4] = 15;

        // 3. Invocación a función auxiliar pasando arreglo, tamaño y umbral de corte
        int umbralCorte = 12;
        int total = calcularSumaFiltrada(lista, this.cantidad, umbralCorte);

        // 4. Actualización del estado booleano
        this.procesado = true;
        
        // 5. Salida por consola con cadenas literales y valores finales
        System.out.println("Procesamiento completado con exito");
        System.out.println("Total acumulado filtrado:");
    }
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`},{offset:`-8(fp)`,name:`Puntero arr (base en Heap)`,reg:`sw a0, -8(fp)`},{offset:`-12(fp)`,name:`Parámetro n (tamaño)`,reg:`sw a1, -12(fp)`},{offset:`-16(fp)`,name:`Parámetro umbral de corte`,reg:`sw a2, -16(fp)`},{offset:`-20(fp)`,name:`Variable local "suma"`,reg:`sw t0, -20(fp)`},{offset:`-24(fp)`,name:`Variable local índice "i"`,reg:`sw t1, -24(fp)`},{offset:`-28(fp)`,name:`Bandera booleana "hayValidos"`,reg:`sw t2, -28(fp)`}],heapLayout:[{addr:`0x1000`,field:`this.vptr (Clase)`,value:`SistemaEstadistico`},{addr:`0x1004`,field:`this.cantidad (int32)`,value:`5`},{addr:`0x1008`,field:`this.procesado (bool)`,value:`true (1)`},{addr:`0x1020`,field:`lista[0] (int32)`,value:`10`},{addr:`0x1024`,field:`lista[1] (int32)`,value:`25`},{addr:`0x1028`,field:`lista[2] (int32)`,value:`5`},{addr:`0x102c`,field:`lista[3] (int32)`,value:`40`},{addr:`0x1030`,field:`lista[4] (int32)`,value:`15`}],c3dLines:[`// Subprograma: calcularSumaFiltrada (Traducción canónica NO optimizada)`,`calcularSumaFiltrada:`,`suma = 0`,`i = 0`,`hayValidos = 0               // false en C3D`,``,`L_WHILE_TEST:`,`// Bucle canónico con goto tras if:`,`if i < n goto L_WHILE_BODY   // Si i < n entra al cuerpo`,`goto L_WHILE_END             // GOTO TRAS IF: si i >= n salta a la salida`,`L_WHILE_BODY:`,`t0 = i * 4                   // Desplazamiento en bytes sin optimizar`,`t1 = arr + t0                // Dirección efectiva arr[i]`,`elemento = Heap[t1]         // Carga elemento desde Heap`,``,`// Condicional if-else con goto tras if:`,`if elemento > umbral goto L_FILTRO_TRUE`,`goto L_FILTRO_FALSE          // GOTO TRAS IF: salta a rama else`,`L_FILTRO_TRUE:`,`suma = suma + elemento      // Acumula elemento`,`hayValidos = 1               // true`,`goto L_INCREMENTO            // Salto incondicional al fin del if-else`,`L_FILTRO_FALSE:`,`suma = suma + 0              // Identidad algebraica (+ 0) sin eliminar`,`L_INCREMENTO:`,`i = i + 1                   // Variable de inducción`,`goto L_WHILE_TEST            // Regresa a evaluar condición del ciclo`,`L_WHILE_END:`,``,`// Verificación booleana final no optimizada:`,`if hayValidos == 1 goto L_RET_SUMA`,`goto L_RET_NEG               // GOTO TRAS IF`,`L_RET_SUMA:`,`return suma                 // Retorna total acumulado en a0`,`goto L_FUNC_FIN`,`L_RET_NEG:`,`return -1                   // No hubo elementos válidos`,`L_FUNC_FIN:`,``,`// Subprograma Principal main()`,`main:`,`Heap[this + 4] = 5           // this.cantidad = 5`,`Heap[this + 8] = 0           // this.procesado = false`,`t2 = 0x1020                 // Dirección base del arreglo en Heap`,`lista = t2`,`Heap[lista + 0] = 10         // lista[0] = 10`,`Heap[lista + 4] = 25         // lista[1] = 25`,`Heap[lista + 8] = 5          // lista[2] = 5`,`Heap[lista + 12] = 40        // lista[3] = 40`,`Heap[lista + 16] = 15        // lista[4] = 15`,``,`umbralCorte = 12`,`param lista                  // Invocación con paso de parámetros`,`param 5`,`param umbralCorte`,`total = call calcularSumaFiltrada, 3`,`Heap[this + 8] = 1           // this.procesado = true`,`param "Procesamiento completado con exito" // Cadena en .data`,`call printString, 1`,`return`],c3dLinesUnoptimized:[`// Subprograma: calcularSumaFiltrada (Traducción canónica NO optimizada)`,`calcularSumaFiltrada:`,`suma = 0`,`i = 0`,`hayValidos = 0               // false en C3D`,``,`L_WHILE_TEST:`,`// Bucle canónico con goto tras if:`,`if i < n goto L_WHILE_BODY   // Si i < n entra al cuerpo`,`goto L_WHILE_END             // GOTO TRAS IF: si i >= n salta a la salida`,`L_WHILE_BODY:`,`t0 = i * 4                   // Desplazamiento en bytes sin optimizar`,`t1 = arr + t0                // Dirección efectiva arr[i]`,`elemento = Heap[t1]         // Carga elemento desde Heap`,``,`// Condicional if-else con goto tras if:`,`if elemento > umbral goto L_FILTRO_TRUE`,`goto L_FILTRO_FALSE          // GOTO TRAS IF: salta a rama else`,`L_FILTRO_TRUE:`,`suma = suma + elemento      // Acumula elemento`,`hayValidos = 1               // true`,`goto L_INCREMENTO            // Salto incondicional al fin del if-else`,`L_FILTRO_FALSE:`,`suma = suma + 0              // Identidad algebraica (+ 0) sin eliminar`,`L_INCREMENTO:`,`i = i + 1                   // Variable de inducción`,`goto L_WHILE_TEST            // Regresa a evaluar condición del ciclo`,`L_WHILE_END:`,``,`// Verificación booleana final no optimizada:`,`if hayValidos == 1 goto L_RET_SUMA`,`goto L_RET_NEG               // GOTO TRAS IF`,`L_RET_SUMA:`,`return suma                 // Retorna total acumulado en a0`,`goto L_FUNC_FIN`,`L_RET_NEG:`,`return -1                   // No hubo elementos válidos`,`L_FUNC_FIN:`,``,`// Subprograma Principal main()`,`main:`,`Heap[this + 4] = 5           // this.cantidad = 5`,`Heap[this + 8] = 0           // this.procesado = false`,`t2 = 0x1020                 // Dirección base del arreglo en Heap`,`lista = t2`,`Heap[lista + 0] = 10         // lista[0] = 10`,`Heap[lista + 4] = 25         // lista[1] = 25`,`Heap[lista + 8] = 5          // lista[2] = 5`,`Heap[lista + 12] = 40        // lista[3] = 40`,`Heap[lista + 16] = 15        // lista[4] = 15`,``,`umbralCorte = 12`,`param lista                  // Invocación con paso de parámetros`,`param 5`,`param umbralCorte`,`total = call calcularSumaFiltrada, 3`,`Heap[this + 8] = 1           // this.procesado = true`,`param "Procesamiento completado con exito" // Cadena en .data`,`call printString, 1`,`return`],c3dLinesOptimized:`// Subprograma: calcularSumaFiltrada (Optimizado por inversión de saltos).calcularSumaFiltrada:.suma = 0.i = 0.hayValidos = 0..L_WHILE_TEST:.// Optimización: salto directo si i >= n (elimina L_WHILE_BODY y goto redundante).if i >= n goto L_WHILE_END.t0 = i << 2                  // Reducción de fuerza: i * 4 a i << 2.t1 = arr + t0.elemento = Heap[t1]..// Optimización: inversión de condición y eliminación de rama else vacía (+ 0).if elemento <= umbral goto L_SKIP.suma = suma + elemento.hayValidos = 1.L_SKIP:.i = i + 1.goto L_WHILE_TEST.L_WHILE_END:..// Optimización: retorno directo.if hayValidos == 0 goto L_FALLO.return suma.L_FALLO:.return -1..// Subprograma Principal main().main:.Heap[this + 4] = 5.Heap[this + 8] = 0.lista = 0x1020.Heap[lista + 0] = 10.Heap[lista + 4] = 25.Heap[lista + 8] = 5.Heap[lista + 12] = 40.Heap[lista + 16] = 15..param lista.param 5.param 12.total = call calcularSumaFiltrada, 3.Heap[this + 8] = 1.param "Procesamiento completado con exito".call printString, 1.return`.split(`.`),quadruples:[{index:1,op:`=`,arg1:`0`,arg2:`-`,dest:`suma`},{index:2,op:`=`,arg1:`0`,arg2:`-`,dest:`i`},{index:3,op:`=`,arg1:`false`,arg2:`-`,dest:`hayValidos`},{index:4,op:`>=`,arg1:`i`,arg2:`n`,dest:`goto (14)`},{index:5,op:`*`,arg1:`i`,arg2:`4`,dest:`t0`},{index:6,op:`+`,arg1:`arr`,arg2:`t0`,dest:`t1`},{index:7,op:`=[]`,arg1:`Heap`,arg2:`t1`,dest:`elemento`},{index:8,op:`>`,arg1:`elemento`,arg2:`umbral`,dest:`goto (10)`},{index:9,op:`goto`,arg1:`-`,arg2:`-`,dest:`(12)`},{index:10,op:`+`,arg1:`suma`,arg2:`elemento`,dest:`suma`},{index:11,op:`=`,arg1:`true`,arg2:`-`,dest:`hayValidos`},{index:12,op:`+`,arg1:`i`,arg2:`1`,dest:`i`},{index:13,op:`goto`,arg1:`-`,arg2:`-`,dest:`(4)`},{index:14,op:`==`,arg1:`hayValidos`,arg2:`true`,dest:`goto (17)`},{index:15,op:`return`,arg1:`-1`,arg2:`-`,dest:`-`},{index:16,op:`goto`,arg1:`-`,arg2:`-`,dest:`(18)`},{index:17,op:`return`,arg1:`suma`,arg2:`-`,dest:`-`},{index:18,op:`call`,arg1:`calcularSumaFiltrada`,arg2:`3`,dest:`total`}],riscvAssembly:`.data
str_exito:   .string "Procesamiento completado con exito"
str_total:   .string "Total acumulado filtrado:"

.text
.globl main
.globl calcularSumaFiltrada

# Función auxiliar: calcularSumaFiltrada(arr: a0, n: a1, umbral: a2)
# Registros ABI: a0=dir_arreglo, a1=tamaño, a2=umbral
calcularSumaFiltrada:
    # 1. Prólogo: Reserva 32 bytes y ancla Frame Pointer
    addi sp, sp, -32        # Reserva marco en la pila
    sw ra, 28(sp)           # Preserva dirección de retorno
    sw s0, 24(sp)           # Preserva frame pointer llamador
    addi s0, sp, 32         # Nuevo Frame Pointer
    sw a0, -8(s0)           # Guarda puntero arr en pila (-8)
    sw a1, -12(s0)          # Guarda tamaño n en pila (-12)
    sw a2, -16(s0)          # Guarda umbral en pila (-16)

    # 2. Inicialización de variables locales
    li t0, 0                # t0 = suma = 0
    sw t0, -20(s0)
    li t1, 0                # t1 = i = 0
    sw t1, -24(s0)
    li t2, 0                # t2 = hayValidos = false (0)
    sw t2, -28(s0)

.L_LOOP_TEST:
    # 3. Condición del bucle while (i < n)
    lw t1, -24(s0)          # t1 = i
    lw a1, -12(s0)          # a1 = n
    bge t1, a1, .L_LOOP_END # Si i >= n, termina el ciclo

    # 4. Acceso indexado arr[i] en memoria Heap
    lw a0, -8(s0)           # a0 = dirección base del arreglo
    slli t3, t1, 2          # t3 = i * 4 (offset en bytes, int32 = 4 bytes)
    add t4, a0, t3          # t4 = dirección efectiva arr + i*4
    lw t5, 0(t4)            # t5 = arr[i] (carga elemento desde Heap)

    # 5. Condicional if (elemento > umbral)
    lw a2, -16(s0)          # a2 = umbral
    ble t5, a2, .L_NEXT_ITER # Si arr[i] <= umbral, salta

    # 6. Rama verdadera: suma += arr[i] y hayValidos = true
    lw t0, -20(s0)          # t0 = suma actual
    add t0, t0, t5          # t0 = suma + arr[i]
    sw t0, -20(s0)          # Actualiza suma en pila local
    li t2, 1                # t2 = true (1)
    sw t2, -28(s0)          # hayValidos = true

.L_NEXT_ITER:
    # 7. Incremento i = i + 1 y retorno al test
    lw t1, -24(s0)          # t1 = i
    addi t1, t1, 1          # i++
    sw t1, -24(s0)          # Guarda nuevo i
    j .L_LOOP_TEST          # Siguiente iteración

.L_LOOP_END:
    # 8. Verificación booleana final: if (hayValidos == true)
    lw t2, -28(s0)          # Carga hayValidos
    beqz t2, .L_RET_NO_VALID # Si es false (0), retorna -1
    lw a0, -20(s0)          # a0 = suma acumulada (valor de retorno)
    j .L_FUNC_EPILOGO

.L_RET_NO_VALID:
    li a0, -1               # Valor de retorno = -1

.L_FUNC_EPILOGO:
    # 9. Epílogo: Restaura marco y retorna
    lw s0, 24(sp)
    lw ra, 28(sp)
    addi sp, sp, 32
    ret

# Método principal: main()
main:
    addi sp, sp, -32        # Marco de main
    sw ra, 28(sp)
    sw s0, 24(sp)
    addi s0, sp, 32

    # Inicialización del objeto en el Heap (0x1000)
    li s1, 0x1000           # s1 = dirección base de la instancia en Heap
    li t0, 5
    sw t0, 4(s1)            # this.cantidad = 5 en 0x1004
    li t1, 0
    sw t1, 8(s1)            # this.procesado = false en 0x1008

    # Llenado de los 5 elementos del arreglo en Heap (0x1020 en adelante)
    li s2, 0x1020           # s2 = dirección base del arreglo
    li t0, 10
    sw t0, 0(s2)            # lista[0] = 10
    li t0, 25
    sw t0, 4(s2)            # lista[1] = 25
    li t0, 5
    sw t0, 8(s2)            # lista[2] = 5
    li t0, 40
    sw t0, 12(s2)           # lista[3] = 40
    li t0, 15
    sw t0, 16(s2)           # lista[4] = 15

    # Preparación de argumentos para llamada a calcularSumaFiltrada
    mv a0, s2               # a0 = dirección del arreglo (0x1020)
    lw a1, 4(s1)            # a1 = this.cantidad (5)
    li a2, 12               # a2 = umbral (12)
    jal ra, calcularSumaFiltrada # Llamada a la función (retorna en a0)

    # Actualiza bandera this.procesado = true (1)
    li t2, 1
    sw t2, 8(s1)            # this.procesado = true en 0x1008

    # Impresión de cadena de salida usando ecall del sistema
    la a0, str_exito        # a0 = dirección de la cadena literal
    li a7, 4                # a7 = syscall 4 (print_string)
    ecall

    # Epílogo de main
    lw s0, 24(sp)
    lw ra, 28(sp)
    addi sp, sp, 32
    ret`}],r=m(0),i=m(`c3d`),a=m(`edit`),o=m(520),c=m(!1),l=m(`unoptimized`);function u(e){let t=[],n=0;for(;n<e.length;){let r=e[n],i=e[n+1]||``,a=e[n+2]||``,o=r.match(/^if\s+(.*?)\s+goto\s+(\w+)/),s=i.match(/^goto\s+(\w+)/),c=a.match(/^(\w+):/);if(o&&s&&c&&o[2]===c[1]){let e=o[1],r=s[1],i=`!(${e})`;e.includes(`==`)?i=e.replace(`==`,`!=`):e.includes(`!=`)?i=e.replace(`!=`,`==`):e.includes(`>=`)?i=e.replace(`>=`,`<`):e.includes(`<=`)?i=e.replace(`<=`,`>`):e.includes(`>`)?i=e.replace(`>`,`<=`):e.includes(`<`)&&(i=e.replace(`<`,`>=`)),t.push(`if ${i} goto ${r} // Optimización peephole: salto invertido`),n+=2}else if(r.includes(`+ 0`)||r.includes(`* 1`)){let e=r.replace(/\s*\+\s*0/,``).replace(/\s*\*\s*1/,``);t.push(`${e} // Optimización: identidad algebraica`),n++}else t.push(r),n++}return t}let d=s(()=>n[r.value]),f=m(n[0].code),p=s(()=>f.value.split(`
`)),h=s(()=>f.value.trim()!==d.value.code.trim()),y=m(!1);function b(e){let t=[],n=[],r=e.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)/),i=r?r[1]:``;[...e.matchAll(/(?:int|boolean)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*;/g)].forEach((e,t)=>{n.push({addr:`0x${(4096+t*4).toString(16)}`,field:`this.${e[1]} (int32)`,value:`0`})});let a=e.match(/(?:int|void|boolean)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/),o=a&&a[2].trim()?a[2].split(`,`).map(e=>e.trim().split(/\s+/).pop()||``):[];t.push({offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`}),t.push({offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`}),i&&t.push({offset:`-8(fp)`,name:`Puntero "this" (a0)`,reg:`sw a0, -8(fp)`}),o.forEach((e,n)=>{let r=-12-n*4;t.push({offset:`${r}(fp)`,name:`Parámetro '${e}'`,reg:`sw a${n+1}, ${r}(fp)`})});let s=g(e);return{c3dLines:s.tacLines,quadruples:s.quadruples,riscvAssembly:s.riscvCode.join(`
`),stackLayout:t,heapLayout:n,errors:s.errors}}let x=s(()=>h.value?b(f.value):null),S=s(()=>x.value?x.value.errors.length===0?{c3dLines:x.value.c3dLines,quadruples:x.value.quadruples,riscvAssembly:x.value.riscvAssembly}:{c3dLines:[`// Error al compilar código fuente personalizado:`,`// ${x.value.errors[0]}`],quadruples:[],riscvAssembly:`# Error de sintaxis en el código:\n# ${x.value.errors[0]}`}:{c3dLines:d.value.c3dLines,quadruples:d.value.quadruples,riscvAssembly:d.value.riscvAssembly}),C=s(()=>x.value?x.value.errors.length===0?x.value.c3dLines:[`// Error al compilar código fuente personalizado:`,`// ${x.value.errors[0]}`]:d.value.c3dLinesUnoptimized||d.value.c3dLines),w=s(()=>x.value?x.value.errors.length===0?u(x.value.c3dLines):[`// Error al compilar código fuente personalizado:`,`// ${x.value.errors[0]}`]:d.value.c3dLinesOptimized||d.value.c3dLines),T=s(()=>x.value&&x.value.stackLayout.length>0?x.value.stackLayout:d.value.stackLayout),E=s(()=>x.value&&x.value.heapLayout.length>0?x.value.heapLayout:d.value.heapLayout);function D(e){r.value=e,f.value=n[e].code}function O(){f.value=d.value.code}function k(){i.value=`c3d`,y.value=!0,setTimeout(()=>{y.value=!1},2500)}function A(e){_(e,()=>f.value,e=>{f.value=e})}let j={presets:n,selectedPresetIdx:r,activeOutputTab:i,editorMode:a,editorHeight:o,editorExpanded:c,c3dOptMode:l,optimizeC3DLines:u,currentPreset:d,sourceCode:f,sourceCodeLines:p,isCustom:h,compileSuccessToast:y,compileJavaLikeCode:b,customCompilation:x,compiledResult:S,activeC3dUnoptimized:C,activeC3dOptimized:w,activeStackLayout:T,activeHeapLayout:E,selectPreset:D,resetToCurrentPreset:O,compileCustom:k,onKeydown:A,get highlightC3DLine(){return te},get highlightRiscvLine(){return v},get highlightGenericLine(){return ee}};return Object.defineProperty(j,"__isScriptSetup",{enumerable:!1,value:!0}),j}}),x={class:`bg-[#0d1527] border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl text-slate-200 space-y-6`},S={class:`flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5`},C={class:`flex flex-wrap items-center gap-2 text-xs`},w=[`onClick`],T={class:`grid grid-cols-1 lg:grid-cols-12 gap-6`},E={class:`flex flex-wrap items-center justify-between border-b border-slate-800 pb-2.5 gap-2`},D={class:`flex items-center gap-2`},O={class:`flex flex-wrap items-center gap-2`},k={class:`flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-700 text-xs font-mono`},A={class:`flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-800 text-[11px] font-mono`},j=[`onClick`],M=[`title`],N={class:`relative rounded-2xl border border-slate-700/80 bg-[#080d1a] overflow-hidden shadow-inner focus-within:border-cyan-400 transition`},P={class:`px-3 py-1.5 bg-[#090f20] border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between`},F={class:`text-[10px] text-slate-500`},I={class:`text-xs text-slate-500 w-8 select-none text-right shrink-0 font-mono`},L=[`innerHTML`],R={key:0,class:`p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-mono flex items-center gap-2`},z={key:1,class:`p-2.5 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-cyan-300 text-xs font-mono flex items-center justify-between`},B={class:`flex items-center gap-2`},V={class:`p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-2 text-xs leading-relaxed`},H={class:`text-slate-300`},U={class:`flex border-b border-slate-800 text-xs font-mono overflow-x-auto gap-1`},W={key:0,class:`space-y-3`},G={class:`flex flex-wrap items-center justify-between gap-2 p-2 bg-[#090f20] rounded-xl border border-slate-800 text-xs font-mono`},K={class:`flex flex-wrap items-center gap-1.5`},q={class:`text-[10px] text-slate-500 hidden sm:inline`},J={key:0,class:`space-y-3`},Y={class:`bg-[#080d1a] rounded-2xl border border-amber-900/40 p-4 font-mono text-xs overflow-x-auto shadow-inner h-[380px] overflow-y-auto`},X={class:`space-y-1`},Z={class:`text-xs text-slate-500 w-8 select-none text-right shrink-0`},Q=[`innerHTML`],ne={key:1,class:`space-y-3`},re={class:`bg-[#080d1a] rounded-2xl border border-emerald-900/40 p-4 font-mono text-xs overflow-x-auto shadow-inner h-[380px] overflow-y-auto`},ie={class:`space-y-1`},ae={class:`text-xs text-slate-500 w-8 select-none text-right shrink-0`},oe=[`innerHTML`],se={key:2,class:`space-y-3`},ce={class:`grid grid-cols-1 md:grid-cols-2 gap-3 h-[400px] overflow-hidden`},le={class:`flex flex-col bg-[#080d1a] rounded-xl border border-amber-900/40 overflow-hidden`},ue={class:`px-3 py-1.5 bg-amber-950/40 border-b border-amber-900/40 text-[11px] font-mono font-bold text-amber-300 flex items-center justify-between`},de={class:`text-[10px] text-slate-400`},fe={class:`flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1`},pe={class:`text-[11px] text-slate-600 w-6 select-none text-right shrink-0`},me=[`innerHTML`],he={class:`flex flex-col bg-[#080d1a] rounded-xl border border-emerald-900/40 overflow-hidden`},ge={class:`px-3 py-1.5 bg-emerald-950/40 border-b border-emerald-900/40 text-[11px] font-mono font-bold text-emerald-300 flex items-center justify-between`},_e={class:`text-[10px] text-slate-400`},ve={class:`flex-1 overflow-y-auto p-3 font-mono text-xs space-y-1`},ye={class:`text-[11px] text-slate-600 w-6 select-none text-right shrink-0`},be=[`innerHTML`],xe={key:1,class:`space-y-3`},Se={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner h-[380px] overflow-y-auto`},Ce={class:`w-full text-left border-collapse min-w-[500px]`},we={class:`divide-y divide-slate-800/80`},Te={class:`p-2.5 text-slate-500 font-mono`},Ee={class:`p-2.5 font-bold text-purple-300`},De={class:`p-2.5 text-slate-200`},Oe={class:`p-2.5 text-slate-200`},ke={class:`p-2.5 font-bold text-emerald-300`},Ae={key:2,class:`space-y-3`},je={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner h-[380px] overflow-y-auto`},Me={class:`space-y-1`},Ne={class:`text-xs text-slate-500 w-8 select-none text-right shrink-0`},Pe=[`innerHTML`],$={key:3,class:`space-y-4`},Fe={class:`grid grid-cols-1 md:grid-cols-2 gap-4`},Ie={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3`},Le={class:`space-y-1.5 font-mono text-xs`},Re={class:`text-purple-400 font-bold`},ze={class:`text-slate-200`},Be={class:`text-[11px] text-cyan-400 font-bold bg-[#080d1a] px-2 py-0.5 rounded`},Ve={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3`},He={class:`space-y-1.5 font-mono text-xs`},Ue={class:`text-emerald-400 font-bold`},We={class:`text-slate-200`},Ge={class:`text-[11px] text-amber-300 font-bold bg-[#080d1a] px-2 py-0.5 rounded`};function Ke(s,l,m,g,_,ee){return r(),u(`div`,x,[i(`div`,S,[l[12]||=f(`<div><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 mb-2 shadow-[0_0_10px_rgba(6,182,212,0.25)]"><span>🚀</span><span>COMPILADOR EN VIVO: JAVA ➔ C3D ➔ CUARTETAS ➔ RISC-V</span></div><h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5"><span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse"></span> Laboratorio de Traducción Integral </h3><p class="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed"> Escriba código estilo Java o seleccione casos complejos avanzados (POO con puntero <code class="text-cyan-400 font-bold">this</code> y Heap, llamadas recursivas, y programas completos con <code class="text-purple-300 font-bold">main</code>, funciones y arreglos). Observe en tiempo real la descomposición a Código Intermedio, Cuartetas y Ensamblador RV32I. </p></div>`,1),i(`div`,C,[l[11]||=i(`span`,{class:`text-slate-400 font-mono font-bold`},`Casos Académicos:`,-1),(r(),u(d,null,p(g.presets,(t,r)=>i(`button`,{key:t.id,onClick:e=>g.selectPreset(r),class:e([g.selectedPresetIdx===r&&!g.isCustom?`bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]`:`bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700`,`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer`])},n(t.badge),11,w)),64))])]),i(`div`,T,[i(`div`,{class:e([g.editorExpanded?`lg:col-span-12`:`lg:col-span-5`,`space-y-3 transition-all duration-300`])},[i(`div`,E,[i(`div`,D,[l[13]||=i(`label`,{class:`text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2`},[i(`span`,{class:`w-2 h-2 rounded-full bg-purple-400`}),o(` Código Fuente (Java / C) `)],-1),i(`span`,{class:e([`text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-900 border border-slate-800`,g.isCustom?`text-cyan-300 font-bold`:`text-purple-300`])},n(g.isCustom?`✏️ Personalizado`:g.currentPreset.category),3)]),i(`div`,O,[i(`div`,k,[i(`button`,{onClick:l[0]||=e=>g.editorMode=`edit`,class:e([g.editorMode===`edit`?`bg-purple-950/80 text-purple-200 border border-purple-500/50 font-bold`:`text-slate-400 hover:text-slate-200`,`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1`]),title:`Editar código fuente (presione Tab para indentar)`},[...l[14]||=[i(`span`,null,`✏️`,-1),i(`span`,null,`Editor`,-1)]],2),i(`button`,{onClick:l[1]||=e=>g.editorMode=`preview`,class:e([g.editorMode===`preview`?`bg-cyan-950/80 text-cyan-200 border border-cyan-500/50 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]`:`text-slate-400 hover:text-slate-200`,`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1`]),title:`Ver código fuente con resaltado sintáctico cromático`},[...l[15]||=[i(`span`,null,`🎨`,-1),i(`span`,null,`Coloreado`,-1)]],2)]),i(`div`,A,[l[16]||=i(`span`,{class:`text-slate-500 pl-1 text-[10px]`},`↕ Altura:`,-1),(r(),u(d,null,p([380,520,680],t=>i(`button`,{key:t,onClick:e=>g.editorHeight=t,class:e([g.editorHeight===t?`bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40`:`text-slate-400 hover:text-white`,`px-1.5 py-0.5 rounded text-[10px] transition cursor-pointer`])},n(t)+`px `,11,j)),64))]),i(`button`,{onClick:l[2]||=e=>g.editorExpanded=!g.editorExpanded,class:e([g.editorExpanded?`bg-cyan-900/60 text-cyan-200 border-cyan-500/50`:`bg-slate-900 text-slate-400 border-slate-800 hover:text-white`,`px-2.5 py-1 rounded-xl border text-[11px] font-mono transition cursor-pointer flex items-center gap-1`]),title:g.editorExpanded?`Reducir a vista de 2 columnas`:`Expandir editor al ancho completo de la pantalla`},[i(`span`,null,n(g.editorExpanded?`⤡ Normal`:`⤢ Pantalla Ancha`),1)],10,M)])]),i(`div`,N,[g.editorMode===`edit`?(r(),u(`div`,{key:0,class:`flex flex-col`,style:t({minHeight:`${g.editorHeight}px`})},[l[17]||=i(`div`,{class:`px-3 py-1.5 bg-[#090f20] border-b border-slate-800 text-[11px] font-mono text-slate-400 flex items-center justify-between`},[i(`span`,{class:`flex items-center gap-1.5 text-cyan-300 font-bold`},[i(`span`,null,`✏️`),o(` Editor Interactivo de Alto Nivel `)]),i(`span`,{class:`text-[10px] text-slate-500`},`Tab = Indentar | Arrastre esquina inferior para redimensionar`)],-1),a(i(`textarea`,{"onUpdate:modelValue":l[3]||=e=>g.sourceCode=e,onKeydown:g.onKeydown,spellcheck:`false`,class:`w-full flex-1 bg-transparent p-4 font-mono text-xs sm:text-sm text-cyan-200 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500 selection:text-slate-950`,style:t({minHeight:`${g.editorHeight-34}px`}),placeholder:`// Escriba su clase, métodos, condicionales o recursión... (Presione Tab para indentar)`},null,36),[[h,g.sourceCode]])],4)):(r(),u(`div`,{key:1,class:`flex flex-col bg-[#060a14]`,style:t({minHeight:`${g.editorHeight}px`})},[i(`div`,P,[l[18]||=i(`span`,{class:`flex items-center gap-1.5 text-purple-300 font-bold`},[i(`span`,null,`🎨`),o(` Resaltado Sintáctico Cromático de Alto Nivel `)],-1),i(`span`,F,n(g.sourceCodeLines.length)+` líneas analizadas`,1)]),i(`div`,{class:`overflow-y-auto p-4 font-mono text-xs sm:text-sm leading-relaxed space-y-0.5 select-text`,style:t({height:`${g.editorHeight-34}px`})},[(r(!0),u(d,null,p(g.sourceCodeLines,(e,t)=>(r(),u(`div`,{key:t,class:`flex items-start gap-3 hover:bg-slate-900/60 px-1 py-0.2 rounded`},[i(`span`,I,n(t+1)+`.`,1),i(`span`,{innerHTML:g.highlightGenericLine(e),class:`whitespace-pre font-mono flex-1`},null,8,L)]))),128))],4)],4))]),g.customCompilation&&g.customCompilation.errors.length>0?(r(),u(`div`,R,[l[19]||=i(`span`,null,`⚠️`,-1),i(`span`,null,n(g.customCompilation.errors[0]),1)])):g.compileSuccessToast||g.isCustom?(r(),u(`div`,z,[i(`span`,B,[l[20]||=i(`span`,{class:`w-2 h-2 rounded-full bg-cyan-400 animate-pulse`},null,-1),i(`span`,null,`Pipeline activo: `+n(g.compiledResult.quadruples.length)+` cuartetas, `+n((g.c3dOptMode===`optimized`?g.activeC3dOptimized:g.activeC3dUnoptimized).length)+` líneas C3D (`+n(g.c3dOptMode===`unoptimized`?`No Optimizado`:g.c3dOptMode===`optimized`?`Optimizado`:`Comparativa`)+`)`,1)]),l[21]||=i(`span`,{class:`text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded text-cyan-200`},`RV32I Sincronizado`,-1)])):c(``,!0),i(`div`,{class:`flex flex-wrap items-center justify-between gap-3 pt-1`},[i(`button`,{onClick:g.compileCustom,class:`px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold font-mono text-xs shadow-[0_0_18px_rgba(168,85,247,0.35)] transition cursor-pointer flex items-center gap-2`},[...l[22]||=[i(`span`,null,`⚡ Compilar y Analizar Pipeline`,-1)]]),i(`button`,{onClick:g.resetToCurrentPreset,class:`px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer`},` Restaurar Caso `)]),i(`div`,V,[l[23]||=i(`h4`,{class:`font-bold text-cyan-300 font-mono flex items-center gap-1.5`},[i(`span`,null,`💡`),o(` Concepto Clave del Compilador: `)],-1),i(`p`,H,n(g.currentPreset.academicNote),1)])],2),i(`div`,{class:e([g.editorExpanded?`lg:col-span-12`:`lg:col-span-7`,`space-y-3 transition-all duration-300`])},[i(`div`,U,[i(`button`,{onClick:l[4]||=e=>g.activeOutputTab=`c3d`,class:e([g.activeOutputTab===`c3d`?`border-b-2 border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...l[24]||=[i(`span`,null,`1. Código Intermedio (C3D)`,-1)]],2),i(`button`,{onClick:l[5]||=e=>g.activeOutputTab=`cuartetas`,class:e([g.activeOutputTab===`cuartetas`?`border-b-2 border-purple-400 text-purple-300 font-bold bg-purple-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...l[25]||=[i(`span`,null,`2. Cuartetas / Cuádruplas`,-1)]],2),i(`button`,{onClick:l[6]||=e=>g.activeOutputTab=`riscv`,class:e([g.activeOutputTab===`riscv`?`border-b-2 border-sky-400 text-sky-300 font-bold bg-sky-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...l[26]||=[i(`span`,null,`3. Ensamblador RISC-V RV32I`,-1)]],2),i(`button`,{onClick:l[7]||=e=>g.activeOutputTab=`memoria`,class:e([g.activeOutputTab===`memoria`?`border-b-2 border-emerald-400 text-emerald-300 font-bold bg-emerald-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...l[27]||=[i(`span`,null,`4. Pila & Heap (Memoria)`,-1)]],2)]),g.activeOutputTab===`c3d`?(r(),u(`div`,W,[i(`div`,G,[i(`div`,K,[l[31]||=i(`span`,{class:`text-slate-400 text-[11px] font-bold`},`Modo C3D:`,-1),i(`button`,{onClick:l[8]||=e=>g.c3dOptMode=`unoptimized`,class:e([g.c3dOptMode===`unoptimized`?`bg-amber-950/80 text-amber-300 border border-amber-500/50 font-bold shadow-[0_0_10px_rgba(245,158,11,0.25)]`:`text-slate-400 hover:text-slate-200`,`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1`]),title:`Traducción dirigida por la sintaxis pura con saltos goto tras if`},[...l[28]||=[i(`span`,null,`⚠️`,-1),i(`span`,null,`No Optimizado (Canónico)`,-1)]],2),i(`button`,{onClick:l[9]||=e=>g.c3dOptMode=`optimized`,class:e([g.c3dOptMode===`optimized`?`bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 font-bold shadow-[0_0_10px_rgba(16,185,129,0.25)]`:`text-slate-400 hover:text-slate-200`,`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1`]),title:`Código C3D con inversión de saltos condicionales y reducción`},[...l[29]||=[i(`span`,null,`⚡`,-1),i(`span`,null,`Optimizado`,-1)]],2),i(`button`,{onClick:l[10]||=e=>g.c3dOptMode=`diff`,class:e([g.c3dOptMode===`diff`?`bg-purple-950/80 text-purple-300 border border-purple-500/50 font-bold shadow-[0_0_10px_rgba(168,85,247,0.25)]`:`text-slate-400 hover:text-slate-200`,`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1`]),title:`Comparar ambas versiones lado a lado`},[...l[30]||=[i(`span`,null,`⚖️`,-1),i(`span`,null,`Comparativa`,-1)]],2)]),i(`span`,q,n(g.c3dOptMode===`unoptimized`?`Trad. Dirigida por Sintaxis (SDT)`:g.c3dOptMode===`optimized`?`Peephole / Inversión de saltos`:`Contraste Lado a Lado`),1)]),g.c3dOptMode===`unoptimized`?(r(),u(`div`,J,[i(`div`,Y,[i(`div`,X,[(r(!0),u(d,null,p(g.activeC3dUnoptimized,(e,t)=>(r(),u(`div`,{key:t,class:`flex items-start gap-3 hover:bg-slate-900/60 px-2 py-0.5 rounded`},[i(`span`,Z,n(t+1)+`.`,1),i(`span`,{innerHTML:g.highlightC3DLine(e),class:`whitespace-pre font-mono flex-1`},null,8,Q)]))),128))])]),l[32]||=i(`div`,{class:`p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl text-xs text-amber-200/90 leading-relaxed font-sans`},[i(`strong`,{class:`text-amber-300 font-mono`},`⚠️ Regla Canónica de C3D No Optimizado (Ing. Mario Ramírez Tobar):`),o(` En la traducción directa, toda estructura condicional genera obligatoriamente un salto `),i(`code`,{class:`text-purple-300 font-mono font-bold`},`if cond goto L_TRUE`),o(` seguido de un `),i(`code`,{class:`text-cyan-300 font-mono font-bold`},`goto L_FALSE`),o(` inmediato. Este esquema formal preserva el árbol sintáctico intacto antes de las optimizaciones de mirilla. `)],-1)])):g.c3dOptMode===`optimized`?(r(),u(`div`,ne,[i(`div`,re,[i(`div`,ie,[(r(!0),u(d,null,p(g.activeC3dOptimized,(e,t)=>(r(),u(`div`,{key:t,class:`flex items-start gap-3 hover:bg-slate-900/60 px-2 py-0.5 rounded`},[i(`span`,ae,n(t+1)+`.`,1),i(`span`,{innerHTML:g.highlightC3DLine(e),class:`whitespace-pre font-mono flex-1`},null,8,oe)]))),128))])]),l[33]||=f(`<div class="p-3 bg-emerald-950/20 border border-emerald-500/30 rounded-xl text-xs text-emerald-200/90 leading-relaxed font-sans"><strong class="text-emerald-300 font-mono">⚡ Fase de Optimización de Mirilla (Peephole):</strong> Invierte la condición de salto relacional, suprimiendo la etiqueta intermedia y el <code class="text-cyan-300 font-mono font-bold">goto</code> redundante posterior al <code class="text-purple-300 font-mono font-bold">if</code>. También elimina operaciones de identidad algebraica (<code class="text-cyan-300 font-mono font-bold">+ 0</code>) y aplica reducción de fuerza. </div>`,1)])):(r(),u(`div`,se,[i(`div`,ce,[i(`div`,le,[i(`div`,ue,[l[34]||=i(`span`,null,`⚠️ No Optimizado (Canónico)`,-1),i(`span`,de,n(g.activeC3dUnoptimized.length)+` líneas`,1)]),i(`div`,fe,[(r(!0),u(d,null,p(g.activeC3dUnoptimized,(e,t)=>(r(),u(`div`,{key:t,class:`flex items-start gap-2 hover:bg-slate-900/60 px-1 py-0.2 rounded`},[i(`span`,pe,n(t+1)+`.`,1),i(`span`,{innerHTML:g.highlightC3DLine(e),class:`whitespace-pre font-mono flex-1 text-[11px]`},null,8,me)]))),128))])]),i(`div`,he,[i(`div`,ge,[l[35]||=i(`span`,null,`⚡ Optimizado (Post-Peephole)`,-1),i(`span`,_e,n(g.activeC3dOptimized.length)+` líneas`,1)]),i(`div`,ve,[(r(!0),u(d,null,p(g.activeC3dOptimized,(e,t)=>(r(),u(`div`,{key:t,class:`flex items-start gap-2 hover:bg-slate-900/60 px-1 py-0.2 rounded`},[i(`span`,ye,n(t+1)+`.`,1),i(`span`,{innerHTML:g.highlightC3DLine(e),class:`whitespace-pre font-mono flex-1 text-[11px]`},null,8,be)]))),128))])])]),l[36]||=i(`div`,{class:`p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-purple-200/90 leading-relaxed font-sans`},[i(`strong`,{class:`text-purple-300 font-mono`},`⚖️ Contraste Académico:`),o(` Compare directamente cómo la optimización elimina los saltos `),i(`code`,{class:`text-cyan-300 font-mono font-bold`},`goto`),o(` redundantes, fusiona etiquetas y economiza ciclos de reloj en la CPU. `)],-1)]))])):c(``,!0),g.activeOutputTab===`cuartetas`?(r(),u(`div`,xe,[i(`div`,Se,[i(`table`,Ce,[l[37]||=i(`thead`,{class:`border-b border-slate-700 text-slate-400 bg-slate-900/60`},[i(`tr`,null,[i(`th`,{class:`p-2.5`},`#`),i(`th`,{class:`p-2.5 text-purple-400 font-bold`},`Operador (op)`),i(`th`,{class:`p-2.5 text-cyan-300`},`Argumento 1`),i(`th`,{class:`p-2.5 text-cyan-300`},`Argumento 2`),i(`th`,{class:`p-2.5 text-emerald-400 font-bold`},`Resultado (dest)`)])],-1),i(`tbody`,we,[(r(!0),u(d,null,p(g.compiledResult.quadruples,e=>(r(),u(`tr`,{key:e.index,class:`hover:bg-slate-900/60`},[i(`td`,Te,n(e.index),1),i(`td`,Ee,n(e.op),1),i(`td`,De,n(e.arg1),1),i(`td`,Oe,n(e.arg2),1),i(`td`,ke,n(e.dest),1)]))),128))])])]),l[38]||=i(`div`,{class:`p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-slate-300 leading-relaxed`},[i(`strong`,{class:`text-purple-300`},`Representación Cuádrupla Canónica:`),o(` Estructura `),i(`code`,{class:`text-cyan-300 font-mono font-bold`},`(op, arg1, arg2, dest)`),o(`. Facilita las fases de optimización local y el algoritmo de coloreo de grafos para registros. `)],-1)])):c(``,!0),g.activeOutputTab===`riscv`?(r(),u(`div`,Ae,[i(`div`,je,[i(`div`,Me,[(r(!0),u(d,null,p(g.compiledResult.riscvAssembly.split(`
`),(e,t)=>(r(),u(`div`,{key:t,class:`flex items-start gap-3 hover:bg-slate-900/60 px-2 py-0.5 rounded`},[i(`span`,Ne,n(t+1)+`.`,1),i(`span`,{innerHTML:g.highlightRiscvLine(e),class:`whitespace-pre font-mono flex-1`},null,8,Pe)]))),128))])]),l[39]||=f(`<div class="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-slate-300 leading-relaxed"><strong class="text-purple-300">Convención RISC-V del Ing. Mario Ramírez Tobar:</strong> Las funciones preservan su Frame Pointer en <code class="text-cyan-300 font-bold">0(fp)</code> o en el prólogo, la dirección de retorno en <code class="text-cyan-300 font-bold">-4(fp)</code>, y los argumentos en <code class="text-cyan-300 font-bold">-8(fp)</code> en adelante. </div>`,1)])):c(``,!0),g.activeOutputTab===`memoria`?(r(),u(`div`,$,[i(`div`,Fe,[i(`div`,Ie,[l[40]||=i(`div`,{class:`flex items-center justify-between border-b border-slate-800 pb-2`},[i(`span`,{class:`text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5`},[i(`span`,null,`⬇`),o(` Pila (Stack Frame) `)]),i(`span`,{class:`text-[11px] font-mono text-slate-400`},`Offset respecto a fp`)],-1),i(`div`,Le,[(r(!0),u(d,null,p(g.activeStackLayout,(e,t)=>(r(),u(`div`,{key:t,class:`p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between`},[i(`span`,Re,n(e.offset),1),i(`span`,ze,n(e.name),1),i(`span`,Be,n(e.reg),1)]))),128))])]),i(`div`,Ve,[l[41]||=i(`div`,{class:`flex items-center justify-between border-b border-slate-800 pb-2`},[i(`span`,{class:`text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5`},[i(`span`,null,`📦`),o(` Heap (Instancia & Arreglos 0x1000) `)]),i(`span`,{class:`text-[11px] font-mono text-slate-400`},"Puntero `this` / Buffer")],-1),i(`div`,He,[(r(!0),u(d,null,p(g.activeHeapLayout,(e,t)=>(r(),u(`div`,{key:t,class:`p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between`},[i(`span`,Ue,n(e.addr),1),i(`span`,We,n(e.field),1),i(`span`,Ge,n(e.value),1)]))),128))]),l[42]||=i(`p`,{class:`text-[11px] text-slate-400 leading-normal pt-1`},[o(` * En POO y arreglos, los datos dinámicos residen únicamente en el Heap. Durante recursión o llamadas a métodos, las referencias se pasan en `),i(`code`,{class:`text-cyan-400 font-bold`},`a0`),o(` sin duplicar buffers en la pila. `)],-1)])])])):c(``,!0)],2)])])}var qe=y(b,[[`render`,Ke]]);export{qe as default};