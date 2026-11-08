import{I as e,R as t,_ as n,a as r,b as i,d as a,i as o,o as s,p as c,s as l,t as u,u as d,v as f,x as p}from"./runtime-core.esm-bundler.38a7Ky-5.js";import{r as m}from"./runtime-dom.esm-bundler.Cvu8JrEH.js";import{n as h,t as ee}from"./editorUtils.BAsKNdq0.js";import{i as g,n as _,o as v}from"./syntaxHighlight.G9m-4a8p.js";import{t as y}from"./_plugin-vue_export-helper.BDNMzG2s.js";var b=c({__name:`FullPipelineLab`,setup(e,{expose:t}){t();let n=[{id:`poo-this-heap`,badge:`1. POO & Puntero this`,category:`Programación Orientada a Objetos`,academicNote:`En POO, la invocación de un método traduce el puntero "this" implícito al primer argumento (registro a0). Los atributos del objeto residen en memoria Heap (a partir de 0x1000) y se acceden mediante direccionamiento indexado offset(this), evitando duplicar la clase en la pila.`,code:`// ============================================================================
// Caso 1: Programación Orientada a Objetos con Atributos en Memoria Heap
// El puntero 'this' se transfiere en el registro ABI a0 como primer argumento.
// ============================================================================
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
    ret                     # Retorno a llamador (jalr zero, ra, 0)`},{id:`recursivo-factorial`,badge:`2. Recursión: Factorial`,category:`Llamadas Recursivas & Pila`,academicNote:`En funciones recursivas, cada llamada anidada crea un nuevo registro de activación en la pila. La convención exige preservar ra y s0/fp en cada nivel para que al alcanzar el caso base (n <= 1), la pila se desenrolle correctamente multiplicando hacia arriba.`,code:`// ============================================================================
// Caso 2: Función Recursiva Simple - Cálculo de Factorial
// Demuestra la preservación del marco de pila y el desenrollado LIFO.
// ============================================================================
class Matematicas {
    int factorial(int n) {
        // Caso base: 0! = 1! = 1
        if (n <= 1) {
            return 1;
        }
        // Llamada recursiva anidada: n * factorial(n - 1)
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
    ret`},{id:`recursivo-fibonacci`,badge:`3. Recursión Doble: Fibonacci`,category:`Llamadas Múltiples en Árbol`,academicNote:`En algoritmos con ramificación recursiva como Fibonacci, cada marco de función debe realizar múltiples llamadas consecutivas (fib(n-1) y fib(n-2)), obligando a guardar en la pila local el resultado de la primera llamada mientras se ejecuta la segunda. El registro callee-saved s1 y la ranura -12(fp) protegen este valor.`,code:`// ============================================================================
// Caso 3: Recursión Doble - Secuencia de Fibonacci
// Muestra cómo el compilador gestiona marcos ramificados en árbol binario.
// ============================================================================
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
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`},{offset:`-8(fp)`,name:`Argumento n de este marco`,reg:`sw a0, -8(fp)`},{offset:`-12(fp)`,name:`Resultado intermedio fib(n-1)`,reg:`sw s1, -12(fp)`}],heapLayout:[],c3dLines:`// ========================================================.// C3D: Subprograma Algoritmos_fibonacci.// Generado para arquitectura con Frame Pointer canónico.// ========================================================.Algoritmos_fibonacci:.// Verificación de casos base (poda del árbol recursivo).if n <= 0 goto L_CERO       // Salto a caso base 0.if n == 1 goto L_UNO        // Salto a caso base 1..// --- Primera llamada recursiva: fib(n - 1) (Rama Izquierda) ---.t0 = n - 1                  // Prepara argumento rama izquierda.param t0                    // Pasa t0 como primer argumento a0.t1 = call Algoritmos_fibonacci, 1 // t1 = fib(n - 1)..// --- Segunda llamada recursiva: fib(n - 2) (Rama Derecha) ---.t2 = n - 2                  // Prepara argumento rama derecha.param t2                    // Pasa t2 como primer argumento a0.t3 = call Algoritmos_fibonacci, 1 // t3 = fib(n - 2)..// --- Suma de ambas ramas del árbol y retorno ---.t4 = t1 + t3                // t4 = fib(n-1) + fib(n-2).return t4                   // Retorna resultado acumulado a0..// --- Puntos de retorno de casos base ---.L_CERO:.return 0                    // Retorna caso base n <= 0.L_UNO:.return 1                    // Retorna caso base n == 1`.split(`.`),quadruples:[{index:1,op:`<=`,arg1:`n`,arg2:`0`,dest:`goto (12)`},{index:2,op:`==`,arg1:`n`,arg2:`1`,dest:`goto (13)`},{index:3,op:`-`,arg1:`n`,arg2:`1`,dest:`t0`},{index:4,op:`param`,arg1:`t0`,arg2:`-`,dest:`-`},{index:5,op:`call`,arg1:`fibonacci`,arg2:`1`,dest:`t1`},{index:6,op:`-`,arg1:`n`,arg2:`2`,dest:`t2`},{index:7,op:`param`,arg1:`t2`,arg2:`-`,dest:`-`},{index:8,op:`call`,arg1:`fibonacci`,arg2:`1`,dest:`t3`},{index:9,op:`+`,arg1:`t1`,arg2:`t3`,dest:`t4`},{index:10,op:`return`,arg1:`t4`,arg2:`-`,dest:`-`},{index:11,op:`goto`,arg1:`-`,arg2:`-`,dest:`(14)`},{index:12,op:`return`,arg1:`0`,arg2:`-`,dest:`-`},{index:13,op:`return`,arg1:`1`,arg2:`-`,dest:`-`},{index:14,op:`end`,arg1:`-`,arg2:`-`,dest:`-`}],riscvAssembly:`.globl Algoritmos_fibonacci
Algoritmos_fibonacci:
    # =========================================================================
    # 1. PRÓLOGO CANÓNICO: Reserva marco de 32 bytes (múltiplo de 16)
    #    Salva ra, s0 (Frame Pointer) y s1 (registro callee-saved)
    # =========================================================================
    addi sp, sp, -32        # Decrementa SP: reserva marco de activación
    sw ra, 28(sp)           # Preserva dirección de retorno ra en offset 28
    sw s0, 24(sp)           # Preserva Frame Pointer del llamador en offset 24
    sw s1, 20(sp)           # Preserva registro s1 (para guardar rama izquierda)
    addi s0, sp, 32         # Establece nuevo Frame Pointer anclado en la base
    sw a0, -8(s0)           # Guarda argumento n (a0) en la ranura local -8(fp)

    # =========================================================================
    # 2. EVALUACIÓN DE CASOS BASE
    # =========================================================================
    lw t0, -8(s0)           # Carga parámetro n desde la pila local a t0
    blez t0, .L_FIB_ZERO    # Si n <= 0, salta a retornar 0
    li t1, 1                # Carga constante 1 para comparación
    beq t0, t1, .L_FIB_ONE  # Si n == 1, salta a retornar 1

    # =========================================================================
    # 3. PRIMERA LLAMADA RECURSIVA: fib(n - 1) (Rama Izquierda)
    # =========================================================================
    addi a0, t0, -1         # Prepara argumento para hijo izquierdo: a0 = n - 1
    jal ra, Algoritmos_fibonacci # Salta y enlaza (ra = PC + 4, crea nuevo marco)
    mv s1, a0               # PROTEGE resultado en s1 (callee-saved resiste llamadas)

    # =========================================================================
    # 4. SEGUNDA LLAMADA RECURSIVA: fib(n - 2) (Rama Derecha)
    # =========================================================================
    lw t0, -8(s0)           # RECUPERA n original de este marco (no el del hijo)
    addi a0, t0, -2         # Prepara argumento para hijo derecho: a0 = n - 2
    jal ra, Algoritmos_fibonacci # Salta y enlaza (segunda llamada recursiva)
    # Al retornar, a0 contiene el resultado de fib(n - 2)

    # =========================================================================
    # 5. COMBINACIÓN DE RESULTADOS
    # =========================================================================
    add a0, s1, a0          # a0 = s1 (fib(n-1)) + a0 (fib(n-2))
    j .L_FIB_END            # Salta al epílogo común para retornar

.L_FIB_ZERO:
    li a0, 0                # Caso base: valor de retorno = 0
    j .L_FIB_END

.L_FIB_ONE:
    li a0, 1                # Caso base: valor de retorno = 1

.L_FIB_END:
    # =========================================================================
    # 6. EPÍLOGO CANÓNICO: Restaura registros preservados y destruye marco
    # =========================================================================
    lw s1, 20(sp)           # Restaura s1 original del llamador
    lw s0, 24(sp)           # Restaura Frame Pointer original
    lw ra, 28(sp)           # Restaura dirección de retorno ra
    addi sp, sp, 32         # Libera los 32 bytes del marco de la pila
    ret                     # Retorna al llamador (jalr zero, ra, 0)`},{id:`desbordamiento-args`,badge:`4. >8 Parámetros (Pila Positiva)`,category:`Convención ABI & Desbordamiento`,academicNote:`RISC-V dispone de exactamente 8 registros de argumentos (a0-a7). Si una función recibe 9 o más parámetros, el compilador los empuja a la pila en orden inverso antes de la llamada. Dentro de la función, estos argumentos adicionales se leen en offsets POSITIVOS respecto al Frame Pointer: 0(fp), 4(fp), etc.`,code:`// ============================================================================
// Caso 4: Desbordamiento de Argumentos (>8 parámetros)
// Los primeros 8 parámetros se transmiten en registros a0 a a7.
// Los parámetros adicionales se envían en la Pila Positiva (offsets >= 0(fp)).
// ============================================================================
class Facturacion {
    int liquidar(int p1, int p2, int p3, int p4, int p5, int p6, int p7, int p8, int extra1, int extra2) {
        int base = p1 + p2 + p3 + p4 + p5 + p6 + p7 + p8;
        int recargo = extra1 + extra2; // extra1 y extra2 se leen de la pila positiva
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
    ret`},{id:`programa-completo-main-arreglos`,badge:`5. Programa Completo: Main & Arreglos`,category:`Arquitectura Integral de Programa`,academicNote:`Este laboratorio representa la integración completa de un compilador de producción: función "main" de inicio, asignación e indexación de arreglos unidimensionales en memoria Heap, llamadas a subprogramas con paso de parámetros, ciclos "while", condicionales "if-else", variables booleanas (true/false) y cadenas literales con salida a consola.`,code:`// ============================================================================
// Caso 5: PROGRAMA INTEGRAL COMPLETO (Main, Funciones, Arreglos, Ciclos & Strings)
// Demuestra la coordinación completa entre el Stack Frame, el Heap y la sección .data
// ============================================================================
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
}`,stackLayout:[{offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`},{offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`},{offset:`-8(fp)`,name:`Puntero arr (base en Heap)`,reg:`sw a0, -8(fp)`},{offset:`-12(fp)`,name:`Parámetro n (tamaño)`,reg:`sw a1, -12(fp)`},{offset:`-16(fp)`,name:`Parámetro umbral de corte`,reg:`sw a2, -16(fp)`},{offset:`-20(fp)`,name:`Variable local "suma"`,reg:`sw t0, -20(fp)`},{offset:`-24(fp)`,name:`Variable local índice "i"`,reg:`sw t1, -24(fp)`},{offset:`-28(fp)`,name:`Bandera booleana "hayValidos"`,reg:`sw t2, -28(fp)`}],heapLayout:[{addr:`0x1000`,field:`this.vptr (Clase)`,value:`SistemaEstadistico`},{addr:`0x1004`,field:`this.cantidad (int32)`,value:`5`},{addr:`0x1008`,field:`this.procesado (bool)`,value:`true (1)`},{addr:`0x1020`,field:`lista[0] (int32)`,value:`10`},{addr:`0x1024`,field:`lista[1] (int32)`,value:`25`},{addr:`0x1028`,field:`lista[2] (int32)`,value:`5`},{addr:`0x102c`,field:`lista[3] (int32)`,value:`40`},{addr:`0x1030`,field:`lista[4] (int32)`,value:`15`}],c3dLines:[`// ================================================================`,`// C3D: Subprograma calcularSumaFiltrada(arr, n, umbral)`,`// ================================================================`,`calcularSumaFiltrada:`,`suma = 0`,`i = 0`,`hayValidos = false          // Inicialización booleana`,``,`L_WHILE_TEST:`,`if i >= n goto L_WHILE_END   // Condición de parada del ciclo`,`t0 = i * 4                  // Cálculo de offset en bytes (int32 = 4B)`,`t1 = arr + t0               // Dirección efectiva arr[i]`,`elemento = Heap[t1]         // Carga elemento desde memoria Heap`,``,`if elemento > umbral goto L_FILTRO_TRUE`,`goto L_FILTRO_FALSE`,``,`L_FILTRO_TRUE:`,`suma = suma + elemento      // Acumula elemento válido`,`hayValidos = true           // Literal booleano en C3D`,`goto L_INCREMENTO`,``,`L_FILTRO_FALSE:`,`suma = suma + 0`,``,`L_INCREMENTO:`,`i = i + 1                   // Avanza índice de inducción`,`goto L_WHILE_TEST`,``,`L_WHILE_END:`,`if hayValidos == true goto L_RET_SUMA`,`return -1                   // No hubo elementos válidos`,``,`L_RET_SUMA:`,`return suma                 // Retorna total acumulado en a0`,``,`// ================================================================`,`// C3D: Subprograma Principal main()`,`// ================================================================`,`main:`,`Heap[this + 4] = 5           // this.cantidad = 5`,`Heap[this + 8] = false       // this.procesado = false`,`t2 = 0x1020                 // Dirección base del arreglo en Heap`,`lista = t2`,`Heap[lista + 0] = 10         // lista[0] = 10`,`Heap[lista + 4] = 25         // lista[1] = 25`,`Heap[lista + 8] = 5          // lista[2] = 5`,`Heap[lista + 12] = 40        // lista[3] = 40`,`Heap[lista + 16] = 15        // lista[4] = 15`,``,`umbralCorte = 12`,`param lista                  // Parámetro 1: dirección del arreglo`,`t3 = Heap[this + 4]          // Carga this.cantidad`,`param t3                     // Parámetro 2: tamaño (5)`,`param umbralCorte            // Parámetro 3: umbral (12)`,`total = call calcularSumaFiltrada, 3`,`Heap[this + 8] = true        // this.procesado = true`,`param "Procesamiento completado con exito" // Cadena en .data`,`call printString, 1`,`return`],quadruples:[{index:1,op:`=`,arg1:`0`,arg2:`-`,dest:`suma`},{index:2,op:`=`,arg1:`0`,arg2:`-`,dest:`i`},{index:3,op:`=`,arg1:`false`,arg2:`-`,dest:`hayValidos`},{index:4,op:`>=`,arg1:`i`,arg2:`n`,dest:`goto (14)`},{index:5,op:`*`,arg1:`i`,arg2:`4`,dest:`t0`},{index:6,op:`+`,arg1:`arr`,arg2:`t0`,dest:`t1`},{index:7,op:`=[]`,arg1:`Heap`,arg2:`t1`,dest:`elemento`},{index:8,op:`>`,arg1:`elemento`,arg2:`umbral`,dest:`goto (10)`},{index:9,op:`goto`,arg1:`-`,arg2:`-`,dest:`(12)`},{index:10,op:`+`,arg1:`suma`,arg2:`elemento`,dest:`suma`},{index:11,op:`=`,arg1:`true`,arg2:`-`,dest:`hayValidos`},{index:12,op:`+`,arg1:`i`,arg2:`1`,dest:`i`},{index:13,op:`goto`,arg1:`-`,arg2:`-`,dest:`(4)`},{index:14,op:`==`,arg1:`hayValidos`,arg2:`true`,dest:`goto (17)`},{index:15,op:`return`,arg1:`-1`,arg2:`-`,dest:`-`},{index:16,op:`goto`,arg1:`-`,arg2:`-`,dest:`(18)`},{index:17,op:`return`,arg1:`suma`,arg2:`-`,dest:`-`},{index:18,op:`call`,arg1:`calcularSumaFiltrada`,arg2:`3`,dest:`total`}],riscvAssembly:`.data
str_exito:   .string "Procesamiento completado con exito"
str_total:   .string "Total acumulado filtrado:"

.text
.globl main
.globl calcularSumaFiltrada

# =============================================================================
# FUNCIÓN AUXILIAR: calcularSumaFiltrada(arr: a0, n: a1, umbral: a2)
# Registros ABI: a0=dir_arreglo, a1=tamaño, a2=umbral
# =============================================================================
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

# =============================================================================
# MÉTODO PRINCIPAL: main()
# =============================================================================
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
    ret`}],r=p(0),i=p(`c3d`),a=p(`preview`),s=o(()=>n[r.value]),c=p(n[0].code),l=o(()=>c.value.split(`
`)),u=o(()=>c.value.trim()!==s.value.code.trim()),d=p(!1);function f(e){let t=[],n=[],r=e.match(/class\s+([a-zA-Z_][a-zA-Z0-9_]*)/),i=r?r[1]:``;[...e.matchAll(/(?:int|boolean)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*;/g)].forEach((e,t)=>{n.push({addr:`0x${(4096+t*4).toString(16)}`,field:`this.${e[1]} (int32)`,value:`0`})});let a=e.match(/(?:int|void|boolean)\s+([a-zA-Z_][a-zA-Z0-9_]*)\s*\(([^)]*)\)/),o=a&&a[2].trim()?a[2].split(`,`).map(e=>e.trim().split(/\s+/).pop()||``):[];t.push({offset:`0(fp)`,name:`Antiguo Frame Pointer (s0)`,reg:`sw s0, 24(sp)`}),t.push({offset:`-4(fp)`,name:`Dirección de retorno (ra)`,reg:`sw ra, 28(sp)`}),i&&t.push({offset:`-8(fp)`,name:`Puntero "this" (a0)`,reg:`sw a0, -8(fp)`}),o.forEach((e,n)=>{let r=-12-n*4;t.push({offset:`${r}(fp)`,name:`Parámetro '${e}'`,reg:`sw a${n+1}, ${r}(fp)`})});let s=h(e);return{c3dLines:s.tacLines,quadruples:s.quadruples,riscvAssembly:s.riscvCode.join(`
`),stackLayout:t,heapLayout:n,errors:s.errors}}let m=o(()=>u.value?f(c.value):null),y=o(()=>m.value?m.value.errors.length===0?{c3dLines:m.value.c3dLines,quadruples:m.value.quadruples,riscvAssembly:m.value.riscvAssembly}:{c3dLines:[`// Error al compilar código fuente personalizado:`,`// ${m.value.errors[0]}`],quadruples:[],riscvAssembly:`# Error de sintaxis en el código:\n# ${m.value.errors[0]}`}:{c3dLines:s.value.c3dLines,quadruples:s.value.quadruples,riscvAssembly:s.value.riscvAssembly}),b=o(()=>m.value&&m.value.stackLayout.length>0?m.value.stackLayout:s.value.stackLayout),x=o(()=>m.value&&m.value.heapLayout.length>0?m.value.heapLayout:s.value.heapLayout);function S(e){r.value=e,c.value=n[e].code}function C(){c.value=s.value.code}function w(){i.value=`c3d`,d.value=!0,setTimeout(()=>{d.value=!1},2500)}function T(e){ee(e,()=>c.value,e=>{c.value=e})}let E={presets:n,selectedPresetIdx:r,activeOutputTab:i,editorMode:a,currentPreset:s,sourceCode:c,sourceCodeLines:l,isCustom:u,compileSuccessToast:d,compileJavaLikeCode:f,customCompilation:m,compiledResult:y,activeStackLayout:b,activeHeapLayout:x,selectPreset:S,resetToCurrentPreset:C,compileCustom:w,onKeydown:T,get highlightC3DLine(){return _},get highlightRiscvLine(){return v},get highlightGenericLine(){return g}};return Object.defineProperty(E,"__isScriptSetup",{enumerable:!1,value:!0}),E}}),x={class:`bg-[#0d1527] border border-slate-800 rounded-3xl p-4 sm:p-7 shadow-2xl text-slate-200 space-y-6`},S={class:`flex flex-wrap items-center justify-between gap-4 border-b border-slate-800 pb-5`},C={class:`flex flex-wrap items-center gap-2 text-xs`},w=[`onClick`],T={class:`grid grid-cols-1 lg:grid-cols-12 gap-6`},E={class:`lg:col-span-5 space-y-3`},D={class:`flex items-center justify-between border-b border-slate-800 pb-2`},O={class:`flex items-center gap-2`},k={class:`flex items-center gap-1 bg-slate-900 p-0.5 rounded-xl border border-slate-700 text-xs font-mono`},A={class:`relative rounded-2xl border border-slate-700/80 bg-[#080d1a] overflow-hidden shadow-inner focus-within:border-cyan-400 transition`},j={key:1,class:`h-[410px] overflow-y-auto p-4 font-mono text-xs sm:text-sm leading-relaxed space-y-0.5 select-text bg-[#080d1a]`},M={class:`text-xs text-slate-500 w-8 select-none text-right shrink-0 font-mono`},N=[`innerHTML`],P={key:0,class:`p-3 bg-red-950/40 border border-red-500/40 rounded-xl text-red-300 text-xs font-mono flex items-center gap-2`},F={key:1,class:`p-2.5 bg-cyan-950/40 border border-cyan-500/40 rounded-xl text-cyan-300 text-xs font-mono flex items-center justify-between`},I={class:`flex items-center gap-2`},L={class:`p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-2 text-xs leading-relaxed`},R={class:`text-slate-300`},z={class:`lg:col-span-7 space-y-3`},B={class:`flex border-b border-slate-800 text-xs font-mono overflow-x-auto gap-1`},V={key:0,class:`space-y-3`},H={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner h-[380px] overflow-y-auto`},U={class:`space-y-1`},W={class:`text-xs text-slate-500 w-8 select-none text-right shrink-0`},G=[`innerHTML`],K={key:1,class:`space-y-3`},q={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner h-[380px] overflow-y-auto`},te={class:`w-full text-left border-collapse min-w-[500px]`},J={class:`divide-y divide-slate-800/80`},Y={class:`p-2.5 text-slate-500 font-mono`},X={class:`p-2.5 font-bold text-purple-300`},Z={class:`p-2.5 text-slate-200`},Q={class:`p-2.5 text-slate-200`},ne={class:`p-2.5 font-bold text-emerald-300`},re={key:2,class:`space-y-3`},ie={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 font-mono text-xs overflow-x-auto shadow-inner h-[380px] overflow-y-auto`},ae={class:`space-y-1`},oe={class:`text-xs text-slate-500 w-8 select-none text-right shrink-0`},se=[`innerHTML`],ce={key:3,class:`space-y-4`},le={class:`grid grid-cols-1 md:grid-cols-2 gap-4`},ue={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3`},de={class:`space-y-1.5 font-mono text-xs`},fe={class:`text-purple-400 font-bold`},pe={class:`text-slate-200`},$={class:`text-[11px] text-cyan-400 font-bold bg-[#080d1a] px-2 py-0.5 rounded`},me={class:`bg-[#080d1a] rounded-2xl border border-slate-800 p-4 shadow-inner space-y-3`},he={class:`space-y-1.5 font-mono text-xs`},ge={class:`text-emerald-400 font-bold`},_e={class:`text-slate-200`},ve={class:`text-[11px] text-amber-300 font-bold bg-[#080d1a] px-2 py-0.5 rounded`};function ye(o,c,p,h,ee,g){return n(),l(`div`,x,[r(`div`,S,[c[8]||=d(`<div><div class="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-mono font-bold bg-cyan-950/60 text-cyan-300 border border-cyan-500/30 mb-2 shadow-[0_0_10px_rgba(6,182,212,0.25)]"><span>🚀</span><span>COMPILADOR EN VIVO: JAVA ➔ C3D ➔ CUARTETAS ➔ RISC-V</span></div><h3 class="text-xl sm:text-2xl font-extrabold text-white flex items-center gap-2.5"><span class="inline-block w-3 h-3 rounded-full bg-cyan-400 shadow-[0_0_10px_rgba(34,211,238,0.9)] animate-pulse"></span> Laboratorio de Traducción Integral </h3><p class="text-xs sm:text-sm text-slate-400 mt-1 leading-relaxed"> Escriba código estilo Java o seleccione casos complejos avanzados (POO con puntero <code class="text-cyan-400 font-bold">this</code> y Heap, llamadas recursivas, y programas completos con <code class="text-purple-300 font-bold">main</code>, funciones y arreglos). Observe en tiempo real la descomposición a Código Intermedio, Cuartetas y Ensamblador RV32I. </p></div>`,1),r(`div`,C,[c[7]||=r(`span`,{class:`text-slate-400 font-mono font-bold`},`Casos Académicos:`,-1),(n(),l(u,null,f(h.presets,(n,i)=>r(`button`,{key:n.id,onClick:e=>h.selectPreset(i),class:e([h.selectedPresetIdx===i&&!h.isCustom?`bg-gradient-to-r from-cyan-400 to-sky-400 text-slate-950 font-bold shadow-[0_0_15px_rgba(6,182,212,0.4)]`:`bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700`,`px-3 py-1.5 rounded-xl text-xs font-mono transition cursor-pointer`])},t(n.badge),11,w)),64))])]),r(`div`,T,[r(`div`,E,[r(`div`,D,[c[11]||=r(`label`,{class:`text-xs font-mono uppercase tracking-wider text-slate-300 font-bold flex items-center gap-2`},[r(`span`,{class:`w-2 h-2 rounded-full bg-purple-400`}),a(` Código Fuente (Estilo Java / C) `)],-1),r(`div`,O,[r(`div`,k,[r(`button`,{onClick:c[0]||=e=>h.editorMode=`edit`,class:e([h.editorMode===`edit`?`bg-purple-950/80 text-purple-200 border border-purple-500/50 font-bold`:`text-slate-400 hover:text-slate-200`,`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1`]),title:`Editar código fuente (presione Tab para indentar)`},[...c[9]||=[r(`span`,null,`✏️`,-1),r(`span`,null,`Editor`,-1)]],2),r(`button`,{onClick:c[1]||=e=>h.editorMode=`preview`,class:e([h.editorMode===`preview`?`bg-cyan-950/80 text-cyan-200 border border-cyan-500/50 font-bold shadow-[0_0_10px_rgba(6,182,212,0.3)]`:`text-slate-400 hover:text-slate-200`,`px-2.5 py-1 rounded-lg transition cursor-pointer flex items-center gap-1`]),title:`Ver código fuente con resaltado sintáctico cromático`},[...c[10]||=[r(`span`,null,`🎨`,-1),r(`span`,null,`Coloreado`,-1)]],2)]),r(`span`,{class:e([`text-xs font-mono hidden sm:inline`,h.isCustom?`text-cyan-300 font-bold`:`text-purple-300`])},t(h.isCustom?`✏️ Personalizado`:h.currentPreset.category),3)])]),r(`div`,A,[h.editorMode===`edit`?i((n(),l(`textarea`,{key:0,"onUpdate:modelValue":c[2]||=e=>h.sourceCode=e,onKeydown:h.onKeydown,rows:`19`,spellcheck:`false`,class:`w-full bg-transparent p-4 font-mono text-xs sm:text-sm text-cyan-200 leading-relaxed focus:outline-none resize-y selection:bg-cyan-500 selection:text-slate-950`,placeholder:`// Escriba su clase, métodos, condicionales o recursión... (Presione Tab para indentar)`},null,544)),[[m,h.sourceCode]]):(n(),l(`div`,j,[(n(!0),l(u,null,f(h.sourceCodeLines,(e,i)=>(n(),l(`div`,{key:i,class:`flex items-start gap-3 hover:bg-slate-900/60 px-1 py-0.2 rounded`},[r(`span`,M,t(i+1)+`.`,1),r(`span`,{innerHTML:h.highlightGenericLine(e),class:`whitespace-pre font-mono flex-1`},null,8,N)]))),128))]))]),h.customCompilation&&h.customCompilation.errors.length>0?(n(),l(`div`,P,[c[12]||=r(`span`,null,`⚠️`,-1),r(`span`,null,t(h.customCompilation.errors[0]),1)])):h.compileSuccessToast||h.isCustom?(n(),l(`div`,F,[r(`span`,I,[c[13]||=r(`span`,{class:`w-2 h-2 rounded-full bg-cyan-400 animate-pulse`},null,-1),r(`span`,null,`Pipeline activo: `+t(h.compiledResult.quadruples.length)+` cuartetas, `+t(h.compiledResult.c3dLines.length)+` líneas C3D generadas`,1)]),c[14]||=r(`span`,{class:`text-[10px] bg-cyan-900/60 px-2 py-0.5 rounded text-cyan-200`},`RV32I Sincronizado`,-1)])):s(``,!0),r(`div`,{class:`flex flex-wrap items-center justify-between gap-3 pt-1`},[r(`button`,{onClick:h.compileCustom,class:`px-4 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 via-indigo-600 to-cyan-500 hover:opacity-90 text-white font-bold font-mono text-xs shadow-[0_0_18px_rgba(168,85,247,0.35)] transition cursor-pointer flex items-center gap-2`},[...c[15]||=[r(`span`,null,`⚡ Compilar y Analizar Pipeline`,-1)]]),r(`button`,{onClick:h.resetToCurrentPreset,class:`px-3 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-mono transition cursor-pointer`},` Restaurar Caso `)]),r(`div`,L,[c[16]||=r(`h4`,{class:`font-bold text-cyan-300 font-mono flex items-center gap-1.5`},[r(`span`,null,`💡`),a(` Concepto Clave del Compilador: `)],-1),r(`p`,R,t(h.currentPreset.academicNote),1)])]),r(`div`,z,[r(`div`,B,[r(`button`,{onClick:c[3]||=e=>h.activeOutputTab=`c3d`,class:e([h.activeOutputTab===`c3d`?`border-b-2 border-cyan-400 text-cyan-300 font-bold bg-cyan-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...c[17]||=[r(`span`,null,`1. Código Intermedio (C3D)`,-1)]],2),r(`button`,{onClick:c[4]||=e=>h.activeOutputTab=`cuartetas`,class:e([h.activeOutputTab===`cuartetas`?`border-b-2 border-purple-400 text-purple-300 font-bold bg-purple-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...c[18]||=[r(`span`,null,`2. Cuartetas / Cuádruplas`,-1)]],2),r(`button`,{onClick:c[5]||=e=>h.activeOutputTab=`riscv`,class:e([h.activeOutputTab===`riscv`?`border-b-2 border-sky-400 text-sky-300 font-bold bg-sky-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...c[19]||=[r(`span`,null,`3. Ensamblador RISC-V RV32I`,-1)]],2),r(`button`,{onClick:c[6]||=e=>h.activeOutputTab=`memoria`,class:e([h.activeOutputTab===`memoria`?`border-b-2 border-emerald-400 text-emerald-300 font-bold bg-emerald-950/20`:`text-slate-400 hover:text-white`,`px-3.5 py-2.5 rounded-t-xl transition cursor-pointer shrink-0 flex items-center gap-1.5`])},[...c[20]||=[r(`span`,null,`4. Pila & Heap (Memoria)`,-1)]],2)]),h.activeOutputTab===`c3d`?(n(),l(`div`,V,[r(`div`,H,[r(`div`,U,[(n(!0),l(u,null,f(h.compiledResult.c3dLines,(e,i)=>(n(),l(`div`,{key:i,class:`flex items-start gap-3 hover:bg-slate-900/60 px-2 py-0.5 rounded`},[r(`span`,W,t(i+1)+`.`,1),r(`span`,{innerHTML:h.highlightC3DLine(e),class:`whitespace-pre font-mono flex-1`},null,8,G)]))),128))])]),c[21]||=r(`div`,{class:`p-3 bg-cyan-950/20 border border-cyan-500/30 rounded-xl text-xs text-slate-300 leading-relaxed`},[r(`strong`,{class:`text-cyan-300`},`Regla del Ing. Mario Ramírez Tobar:`),a(` Toda instrucción de C3D cumple la restricción de a lo sumo 3 accesos a memoria por sentencia y lineariza estructuras de control complejas en saltos `),r(`code`,{class:`text-purple-300 font-bold`},`goto`),a(` y etiquetas. `)],-1)])):s(``,!0),h.activeOutputTab===`cuartetas`?(n(),l(`div`,K,[r(`div`,q,[r(`table`,te,[c[22]||=r(`thead`,{class:`border-b border-slate-700 text-slate-400 bg-slate-900/60`},[r(`tr`,null,[r(`th`,{class:`p-2.5`},`#`),r(`th`,{class:`p-2.5 text-purple-400 font-bold`},`Operador (op)`),r(`th`,{class:`p-2.5 text-cyan-300`},`Argumento 1`),r(`th`,{class:`p-2.5 text-cyan-300`},`Argumento 2`),r(`th`,{class:`p-2.5 text-emerald-400 font-bold`},`Resultado (dest)`)])],-1),r(`tbody`,J,[(n(!0),l(u,null,f(h.compiledResult.quadruples,e=>(n(),l(`tr`,{key:e.index,class:`hover:bg-slate-900/60`},[r(`td`,Y,t(e.index),1),r(`td`,X,t(e.op),1),r(`td`,Z,t(e.arg1),1),r(`td`,Q,t(e.arg2),1),r(`td`,ne,t(e.dest),1)]))),128))])])]),c[23]||=r(`div`,{class:`p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-slate-300 leading-relaxed`},[r(`strong`,{class:`text-purple-300`},`Representación Cuádrupla Canónica:`),a(` Estructura `),r(`code`,{class:`text-cyan-300 font-mono font-bold`},`(op, arg1, arg2, dest)`),a(`. Facilita las fases de optimización local y el algoritmo de coloreo de grafos para registros. `)],-1)])):s(``,!0),h.activeOutputTab===`riscv`?(n(),l(`div`,re,[r(`div`,ie,[r(`div`,ae,[(n(!0),l(u,null,f(h.compiledResult.riscvAssembly.split(`
`),(e,i)=>(n(),l(`div`,{key:i,class:`flex items-start gap-3 hover:bg-slate-900/60 px-2 py-0.5 rounded`},[r(`span`,oe,t(i+1)+`.`,1),r(`span`,{innerHTML:h.highlightRiscvLine(e),class:`whitespace-pre font-mono flex-1`},null,8,se)]))),128))])]),c[24]||=d(`<div class="p-3 bg-purple-950/20 border border-purple-500/30 rounded-xl text-xs text-slate-300 leading-relaxed"><strong class="text-purple-300">Convención RISC-V del Ing. Mario Ramírez Tobar:</strong> Las funciones preservan su Frame Pointer en <code class="text-cyan-300 font-bold">0(fp)</code> o en el prólogo, la dirección de retorno en <code class="text-cyan-300 font-bold">-4(fp)</code>, y los argumentos en <code class="text-cyan-300 font-bold">-8(fp)</code> en adelante. </div>`,1)])):s(``,!0),h.activeOutputTab===`memoria`?(n(),l(`div`,ce,[r(`div`,le,[r(`div`,ue,[c[25]||=r(`div`,{class:`flex items-center justify-between border-b border-slate-800 pb-2`},[r(`span`,{class:`text-xs font-mono font-bold text-cyan-300 flex items-center gap-1.5`},[r(`span`,null,`⬇`),a(` Pila (Stack Frame) `)]),r(`span`,{class:`text-[11px] font-mono text-slate-400`},`Offset respecto a fp`)],-1),r(`div`,de,[(n(!0),l(u,null,f(h.activeStackLayout,(e,i)=>(n(),l(`div`,{key:i,class:`p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between`},[r(`span`,fe,t(e.offset),1),r(`span`,pe,t(e.name),1),r(`span`,$,t(e.reg),1)]))),128))])]),r(`div`,me,[c[26]||=r(`div`,{class:`flex items-center justify-between border-b border-slate-800 pb-2`},[r(`span`,{class:`text-xs font-mono font-bold text-emerald-400 flex items-center gap-1.5`},[r(`span`,null,`📦`),a(` Heap (Instancia & Arreglos 0x1000) `)]),r(`span`,{class:`text-[11px] font-mono text-slate-400`},"Puntero `this` / Buffer")],-1),r(`div`,he,[(n(!0),l(u,null,f(h.activeHeapLayout,(e,i)=>(n(),l(`div`,{key:i,class:`p-2 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between`},[r(`span`,ge,t(e.addr),1),r(`span`,_e,t(e.field),1),r(`span`,ve,t(e.value),1)]))),128))]),c[27]||=r(`p`,{class:`text-[11px] text-slate-400 leading-normal pt-1`},[a(` * En POO y arreglos, los datos dinámicos residen únicamente en el Heap. Durante recursión o llamadas a métodos, las referencias se pasan en `),r(`code`,{class:`text-cyan-400 font-bold`},`a0`),a(` sin duplicar buffers en la pila. `)],-1)])])])):s(``,!0)])])])}var be=y(b,[[`render`,ye]]);export{be as default};