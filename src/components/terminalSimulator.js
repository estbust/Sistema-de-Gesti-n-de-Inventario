/**
 * terminalSimulator.js
 * Simulador de consola interactiva en el navegador.
 * Permite ejecutar el algoritmo paso a paso por teclado,
 * manteniendo sincronizado el estado del inventario y del diagrama.
 */

import { store } from '../data/inventoryStore.js';

export function renderTerminalSimulator(container) {
  container.innerHTML = `
    <div class="terminal-wrapper">
      <div class="terminal-bar">
        <div class="terminal-dots">
          <span class="dot dot-red"></span>
          <span class="dot dot-yellow"></span>
          <span class="dot dot-green"></span>
        </div>
        <div class="terminal-title">inventario@algoritmo: ~ (Simulador CLI Interactivo)</div>
        <div class="terminal-actions">
          <button class="btn-term-tool" id="btn-term-clear" title="Limpiar pantalla">🧹 Limpiar</button>
          <button class="btn-term-tool" id="btn-term-restart" title="Reiniciar sesión">🔄 Reiniciar</button>
        </div>
      </div>

      <div class="terminal-body" id="term-output">
        <!-- Contenido generado por la máquina de estados -->
      </div>

      <div class="terminal-input-line">
        <span class="term-prompt">&gt;</span>
        <input 
          type="text" 
          id="term-input" 
          class="term-input" 
          placeholder="Escriba aquí (ej. 1, 2, 3, 4) y presione Enter..." 
          autocomplete="off" 
          autofocus 
        />
        <button class="btn btn-primary btn-sm" id="btn-term-send">Enviar</button>
      </div>

      <div class="terminal-quick-keys">
        <span>Accesos rápidos:</span>
        <button class="btn-pill" data-key="1">1: Agregar</button>
        <button class="btn-pill" data-key="2">2: Ver</button>
        <button class="btn-pill" data-key="3">3: Actualizar</button>
        <button class="btn-pill" data-key="4">4: Salir</button>
      </div>
    </div>
  `;

  initTerminalLogic(container);
}

function initTerminalLogic(container) {
  const outputEl = container.querySelector('#term-output');
  const inputEl = container.querySelector('#term-input');
  const sendBtn = container.querySelector('#btn-term-send');
  const clearBtn = container.querySelector('#btn-term-clear');
  const restartBtn = container.querySelector('#btn-term-restart');

  // Estado del flujo CLI:
  // 'MENU' | 'ADD_NAME' | 'ADD_QTY' | 'ADD_PRICE' | 'UPDATE_NAME' | 'UPDATE_OP' | 'UPDATE_QTY' | 'EXITED'
  let state = 'MENU';
  let tempProduct = {};

  const printLine = (text, className = '') => {
    const p = document.createElement('div');
    p.className = `term-line ${className}`;
    p.innerHTML = text;
    outputEl.appendChild(p);
    outputEl.scrollTop = outputEl.scrollHeight;
  };

  const printBanner = () => {
    printLine('############################################################', 'text-yellow');
    printLine('       &gt;&gt;&gt; [INICIO (ÓVALO)] DEL ALGORITMO DE INVENTARIO &lt;&lt;&lt;', 'text-accent');
    printLine('############################################################', 'text-yellow');
  };

  const printMenu = () => {
    store.setActiveNode('menu', 'CLI: Mostrar Menú Principal (Rectángulo)');
    printLine('============================================================', 'text-dim');
    printLine('             SISTEMA DE GESTIÓN DE INVENTARIO              ', 'text-bold');
    printLine('                (Algoritmo de Control)                     ', 'text-cyan');
    printLine('============================================================', 'text-dim');
    printLine('  <strong class="text-accent">1.</strong> Agregar producto <span class="text-dim">[Paralelogramo ➔ Rectángulo]</span>');
    printLine('  <strong class="text-accent">2.</strong> Ver inventario <span class="text-dim">[Rectángulo ➔ Paralelogramo]</span>');
    printLine('  <strong class="text-accent">3.</strong> Actualizar inventario <span class="text-dim">[Paralelogramo ➔ Rombo]</span>');
    printLine('  <strong class="text-accent">4.</strong> Salir <span class="text-dim">[Paralelogramo ➔ Fin]</span>');
    printLine('============================================================', 'text-dim');
    printLine('<span class="text-yellow">Rombo: [¿Qué opción eligió?]</span> Ingrese opción (1-4):');
    state = 'MENU';
    tempProduct = {};
  };

  const processInput = (rawVal) => {
    const val = rawVal.trim();
    printLine(`<span class="term-user-echo">&gt; ${escapeHtml(rawVal)}</span>`);
    inputEl.value = '';

    if (state === 'EXITED') {
      if (val.toLowerCase() === 'r' || val === '1' || val === 'menu') {
        outputEl.innerHTML = '';
        printBanner();
        printMenu();
      } else {
        printLine('El algoritmo está en estado [FIN]. Escriba "r" o "menu" para reiniciar un nuevo ciclo.');
      }
      return;
    }

    switch (state) {
      case 'MENU': {
        store.setActiveNode('decision', `CLI: ¿Qué opción eligió? Entrada: "${val}"`);
        if (val === '1') {
          // Opción 1: Agregar producto
          store.setActiveNode('op1_pedir', 'CLI: Opción 1 - Pedir nombre, cantidad y precio');
          printLine('\n<span class="text-cyan">--- [OPCIÓN 1: AGREGAR PRODUCTO] ---</span>');
          printLine('&gt;&gt; [Paralelogramo] Entrada de datos:');
          printLine(' Ingrese el nombre del producto:');
          state = 'ADD_NAME';
        } else if (val === '2') {
          // Opción 2: Ver inventario
          store.setActiveNode('op2_leer', 'CLI: Opción 2 - Leer lista de productos');
          printLine('\n<span class="text-cyan">--- [OPCIÓN 2: VER INVENTARIO] ---</span>');
          const products = store.getProducts();
          store.setActiveNode('op2_mostrar', 'CLI: Opción 2 - Mostrar productos en pantalla');

          if (products.length === 0) {
            printLine(' [i] El inventario está vacío. No hay productos registrados.', 'text-yellow');
          } else {
            printLine(` Total de productos registrados: ${products.length}`);
            printLine('-'.repeat(65), 'text-dim');
            printLine(
              '#'.padEnd(4) +
              'Nombre del Producto'.padEnd(28) +
              'Cantidad'.padEnd(10) +
              'Precio U.'.padEnd(10) +
              'Subtotal',
              'text-bold'
            );
            printLine('-'.repeat(65), 'text-dim');

            let granTotal = 0;
            let totalUnidades = 0;
            products.forEach((prod, idx) => {
              const subtotal = prod.cantidad * prod.precio;
              granTotal += subtotal;
              totalUnidades += prod.cantidad;
              printLine(
                String(idx + 1).padEnd(4) +
                prod.nombre.padEnd(28) +
                String(prod.cantidad).padEnd(10) +
                `$${prod.precio.toFixed(2)}`.padEnd(10) +
                `$${subtotal.toFixed(2)}`
              );
            });
            printLine('-'.repeat(65), 'text-dim');
            printLine(` Resumen: ${totalUnidades} unidades en stock | Valor total: $${granTotal.toFixed(2)}`, 'text-accent');
          }

          printLine('\n &rarr; Flecha de regreso a Mostrar Menú Principal...\n', 'text-cyan');
          printMenu();
        } else if (val === '3') {
          // Opción 3: Actualizar inventario
          store.setActiveNode('op3_pedir', 'CLI: Opción 3 - Pedir nombre del producto');
          printLine('\n<span class="text-cyan">--- [OPCIÓN 3: ACTUALIZAR INVENTARIO] ---</span>');
          printLine('&gt;&gt; [Paralelogramo] Pedir nombre del producto:');
          printLine(' Ingrese el nombre del producto a actualizar:');
          state = 'UPDATE_NAME';
        } else if (val === '4') {
          // Opción 4: Salir
          store.setActiveNode('op4_despedida', 'CLI: Opción 4 - Mensaje de despedida');
          printLine('\n============================================================', 'text-dim');
          printLine(' [Paralelogramo: Mensaje de Despedida]', 'text-cyan');
          printLine(' ¡Muchas gracias por utilizar el Sistema de Gestión de Inventario!', 'text-bold');
          printLine(' Esperamos que la gestión de sus productos haya sido exitosa.');
          printLine('============================================================', 'text-dim');

          store.setActiveNode('fin', 'CLI: Algoritmo terminado en [Fin (Óvalo)]');
          printLine('\n############################################################', 'text-yellow');
          printLine('         &gt;&gt;&gt; [FIN (ÓVALO)] DEL ALGORITMO &lt;&lt;&lt;', 'text-danger');
          printLine('############################################################\n', 'text-yellow');
          printLine('<span class="text-dim">Escriba "r" para reiniciar o seleccione otra pestaña.</span>');
          state = 'EXITED';
        } else {
          printLine(` [!] Opción "${escapeHtml(val)}" inválida. Por favor elija un número del 1 al 4.`, 'text-danger');
          printMenu();
        }
        break;
      }

      case 'ADD_NAME': {
        if (!val) {
          printLine(' [!] El nombre no puede estar vacío. Ingrese el nombre:', 'text-danger');
          return;
        }
        const existe = store.findProductByName(val);
        if (existe) {
          printLine(` [!] El producto "${existe.nombre}" ya existe con ${existe.cantidad} unidades.`, 'text-warning');
          printLine('     Para modificar su cantidad use la Opción 3. Regresando al Menú...\n');
          printMenu();
          return;
        }
        tempProduct.nombre = val;
        printLine(' Ingrese la cantidad (número entero >= 0):');
        state = 'ADD_QTY';
        break;
      }

      case 'ADD_QTY': {
        const cant = parseInt(val, 10);
        if (isNaN(cant) || cant < 0) {
          printLine(' [!] Error: Debe ingresar un entero mayor o igual a 0. Ingrese cantidad:', 'text-danger');
          return;
        }
        tempProduct.cantidad = cant;
        printLine(' Ingrese el precio unitario ($ ej. 2.50):');
        state = 'ADD_PRICE';
        break;
      }

      case 'ADD_PRICE': {
        const prec = parseFloat(val);
        if (isNaN(prec) || prec <= 0) {
          printLine(' [!] Error: El precio debe ser un número mayor a 0. Ingrese precio:', 'text-danger');
          return;
        }
        tempProduct.precio = prec;

        // Guardar en inventario
        const res = store.addProduct(tempProduct.nombre, tempProduct.cantidad, tempProduct.precio);
        if (res.success) {
          printLine(`\n[+] [Rectángulo: Guardar en el inventario] Éxito:`, 'text-accent');
          printLine(`    Producto "${tempProduct.nombre}" guardado con ${tempProduct.cantidad} unidades a $${prec.toFixed(2)} c/u.`);
        } else {
          printLine(`\n[!] Error: ${res.message}`, 'text-danger');
        }
        printLine('\n &rarr; Flecha de regreso a Mostrar Menú Principal...\n', 'text-cyan');
        printMenu();
        break;
      }

      case 'UPDATE_NAME': {
        if (!val) {
          printLine(' [!] Ingrese un nombre válido:');
          return;
        }

        // Rombo: ¿Existe el producto?
        store.setActiveNode('op3_decision', `CLI: Rombo - ¿Existe el producto "${val}"?`);
        const found = store.findProductByName(val);

        if (!found) {
          // No: Mostrar mensaje de error (Paralelogramo)
          store.setActiveNode('op3_no', `CLI: Rombo [NO] - Producto "${val}" no existe`);
          printLine(`\n [❌ ERROR] El producto "${val}" NO existe en el inventario.`, 'text-danger');
          printLine(' &rarr; Flecha de regreso a Mostrar Menú Principal...\n', 'text-cyan');
          printMenu();
        } else {
          // Sí: Pedir cantidad a sumar/restar
          store.setActiveNode('op3_si', `CLI: Rombo [SÍ] - Producto "${found.nombre}" encontrado`);
          tempProduct.nombre = found.nombre;
          tempProduct.stockActual = found.cantidad;
          printLine(`\n [✓] Producto encontrado: "${found.nombre}"`, 'text-accent');
          printLine(`     Stock actual: ${found.cantidad} unidades`);
          printLine(' Seleccione la operación:');
          printLine('   1. Sumar (aumentar inventario)');
          printLine('   2. Restar (disminuir inventario)');
          printLine(' Elija una opción (1 o 2):');
          state = 'UPDATE_OP';
        }
        break;
      }

      case 'UPDATE_OP': {
        if (val !== '1' && val !== '2') {
          printLine(' [!] Opción no válida. Elija 1 para Sumar o 2 para Restar:', 'text-danger');
          return;
        }
        tempProduct.operacion = val === '1' ? 'sumar' : 'restar';
        printLine(` Ingrese la cantidad a ${tempProduct.operacion === 'sumar' ? 'sumar' : 'restar'}:`);
        state = 'UPDATE_QTY';
        break;
      }

      case 'UPDATE_QTY': {
        const delta = parseInt(val, 10);
        if (isNaN(delta) || delta <= 0) {
          printLine(' [!] Error: Debe ingresar un entero mayor a 0. Ingrese cantidad:', 'text-danger');
          return;
        }

        const res = store.updateStock(tempProduct.nombre, delta, tempProduct.operacion);
        if (res.success) {
          printLine(`\n[✓] [Rectángulo: Actualizar total] Operación: ${tempProduct.operacion.toUpperCase()}`, 'text-accent');
          printLine(`    Stock anterior: ${res.stockAnterior} &rarr; Nuevo total: ${res.nuevoTotal} unidades.`);
        } else {
          printLine(`\n[!] Error: ${res.message}`, 'text-danger');
        }

        printLine('\n &rarr; Flecha de regreso a Mostrar Menú Principal...\n', 'text-cyan');
        printMenu();
        break;
      }
    }
  };

  // Event Listeners
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      processInput(inputEl.value);
    }
  });

  sendBtn.addEventListener('click', () => {
    processInput(inputEl.value);
  });

  clearBtn.addEventListener('click', () => {
    outputEl.innerHTML = '';
    printMenu();
  });

  restartBtn.addEventListener('click', () => {
    outputEl.innerHTML = '';
    printBanner();
    printMenu();
  });

  container.querySelectorAll('.btn-pill[data-key]').forEach(btn => {
    btn.addEventListener('click', () => {
      const key = btn.dataset.key;
      inputEl.value = key;
      processInput(key);
    });
  });

  // Iniciar terminal
  printBanner();
  printMenu();
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
