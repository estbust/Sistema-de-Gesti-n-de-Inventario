/**
 * algorithmDoc.js
 * Componente didáctico que documenta la teoría del algoritmo,
 * la correspondencia con las figuras geométricas y el pseudocódigo estructurado.
 */

import { store } from '../data/inventoryStore.js';

export function renderAlgorithmDoc(container) {
  container.innerHTML = `
    <div class="docs-wrapper">
      <div class="docs-header">
        <h2 class="section-title">📖 Documentación del Algoritmo & Simbología</h2>
        <p class="section-subtitle">
          Guía pedagógica que vincula los requerimientos, el diagrama de flujo y la implementación de software.
        </p>
      </div>

      <!-- Tabla Comparativa de Simbología -->
      <div class="doc-card">
        <h3 class="card-title">1. Simbología Estándar de Diagramas de Flujo (ISO/ANSI)</h3>
        <p class="text-secondary mb-3">
          En la programación estructurada y la teoría de algoritmos, cada figura geométrica cumple un rol específico:
        </p>

        <div class="symbols-table-wrapper">
          <table class="symbols-table">
            <thead>
              <tr>
                <th width="140">Forma</th>
                <th width="140">Tipo</th>
                <th>Significado Teórico</th>
                <th>Presencia en Este Proyecto</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  <div class="shape-demo demo-oval">Óvalo</div>
                </td>
                <td><strong>Terminal</strong></td>
                <td>Indica el inicio o la finalización de un algoritmo o subrutina.</td>
                <td>
                  <span class="tag-pill tag-green">Inicio (Óvalo)</span> y 
                  <span class="tag-pill tag-red">Fin (Óvalo)</span>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="shape-demo demo-rect">Rectángulo</div>
                </td>
                <td><strong>Proceso</strong></td>
                <td>Representa una operación aritmética, asignación de memoria o procedimiento interno.</td>
                <td>
                  <ul>
                    <li>Mostrar Menú Principal</li>
                    <li>Guardar en el inventario</li>
                    <li>Leer lista de productos</li>
                    <li>Actualizar total</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="shape-demo demo-rhombus">Rombo</div>
                </td>
                <td><strong>Decisión</strong></td>
                <td>Bifurcación lógica condicional evaluando una o múltiples condiciones (Sí/No, Switch).</td>
                <td>
                  <ul>
                    <li><strong>¿Qué opción eligió?</strong> (Opciones 1, 2, 3, 4)</li>
                    <li><strong>¿Existe el producto?</strong> (Sí ➔ Sumar/Restar, No ➔ Error)</li>
                  </ul>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="shape-demo demo-para">Paralelogramo</div>
                </td>
                <td><strong>Entrada / Salida (I/O)</strong></td>
                <td>Entrada de datos desde el usuario (teclado) o salida mostrada en pantalla/impresora.</td>
                <td>
                  <ul>
                    <li>Pedir nombre, cantidad y precio (Entrada)</li>
                    <li>Mostrar productos en pantalla (Salida)</li>
                    <li>Pedir nombre del producto (Entrada)</li>
                    <li>Pedir cantidad a sumar/restar (Entrada)</li>
                    <li>Mostrar mensaje de error (Salida)</li>
                    <li>Mensaje de despedida (Salida)</li>
                  </ul>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Pseudocódigo Estructurado -->
      <div class="doc-card">
        <div class="flex-between">
          <h3 class="card-title">2. Pseudocódigo del Algoritmo</h3>
          <button class="btn btn-secondary btn-sm" id="btn-copy-pseudocode">
            📋 Copiar Pseudocódigo
          </button>
        </div>
        <p class="text-secondary mb-2">
          Representación algorítmica formal en pseudocódigo estándar:
        </p>

        <pre class="code-block" id="pseudocode-content"><code>Algoritmo GestionInventario
    // Estructura de almacenamiento
    Dimension inventario[100]
    
    // [Óvalo: Inicio]
    Repetir
        // [Rectángulo: Mostrar Menú Principal]
        Escribir "================================="
        Escribir "   MENÚ PRINCIPAL INVENTARIO     "
        Escribir "================================="
        Escribir "1. Agregar producto"
        Escribir "2. Ver inventario"
        Escribir "3. Actualizar inventario"
        Escribir "4. Salir"
        
        // [Rombo: ¿Qué opción eligió?]
        Leer opcion
        
        Segun opcion Hacer
            Caso "1":
                // [Paralelogramo: Entrada de datos]
                Escribir "Ingrese nombre del producto:"
                Leer nombre
                Escribir "Ingrese cantidad:"
                Leer cantidad
                Escribir "Ingrese precio:"
                Leer precio
                
                // [Rectángulo: Guardar en el inventario]
                GuardarEnInventario(nombre, cantidad, precio)
                Escribir "Producto guardado con éxito."
                // Flecha de regreso al Menú
                
            Caso "2":
                // [Rectángulo: Leer lista de productos]
                productos &lt;- LeerListaDeProductos()
                
                // [Paralelogramo: Mostrar productos en pantalla]
                Para Cada prod en productos Hacer
                    Escribir prod.nombre, " - Cant:", prod.cantidad, " - $", prod.precio
                FinPara
                // Flecha de regreso al Menú
                
            Caso "3":
                // [Paralelogramo: Pedir nombre del producto]
                Escribir "Ingrese nombre del producto a actualizar:"
                Leer nombreBuscado
                
                // [Rombo: ¿Existe el producto?]
                Si ExisteProducto(nombreBuscado) Entonces
                    // Rama SÍ
                    // [Paralelogramo: Pedir cantidad a sumar/restar]
                    Escribir "1. Sumar  2. Restar"
                    Leer tipoOp
                    Escribir "Ingrese cantidad a modificar:"
                    Leer delta
                    
                    // [Rectángulo: Actualizar total]
                    Si tipoOp = "1" Entonces
                        total &lt;- stockActual + delta
                    Sino
                        total &lt;- stockActual - delta
                    FinSi
                    ActualizarTotalEnInventario(nombreBuscado, total)
                Sino
                    // Rama NO
                    // [Paralelogramo: Mostrar mensaje de error]
                    Escribir "Error: El producto no existe en el inventario."
                FinSi
                // Flecha de regreso al Menú
                
            Caso "4":
                // [Paralelogramo: Mensaje de despedida]
                Escribir "Muchas gracias por utilizar el sistema de inventario."
                salir &lt;- Verdadero
                
            De Otro Modo:
                Escribir "Opción inválida. Intente de nuevo."
        FinSegun
    Hasta Que salir = Verdadero
    
    // [Óvalo: Fin]
FinAlgoritmo</code></pre>
      </div>

      <!-- Guía de Ejecución en Consola -->
      <div class="doc-card">
        <h3 class="card-title">3. Modos de Ejecución Disponibles</h3>
        <p class="text-secondary mb-3">
          Este proyecto incluye 3 alternativas de ejecución completas para máxima versatilidad:
        </p>

        <div class="exec-modes-grid">
          <div class="exec-mode-card">
            <div class="em-icon">🌐</div>
            <h4>1. Aplicación Web Vite</h4>
            <p>Interfaz interactiva con diagrama SVG en tiempo real y persistencia local.</p>
            <code>pnpm dev</code>
          </div>

          <div class="exec-mode-card">
            <div class="em-icon">🐍</div>
            <h4>2. Script de Consola Python</h4>
            <p>Algoritmo modular en Python 3 para terminal.</p>
            <code>python3 inventario.py</code>
          </div>

          <div class="exec-mode-card">
            <div class="em-icon">🟢</div>
            <h4>3. Script de Consola Node.js</h4>
            <p>CLI interactivo mediante módulo nativo <code>readline</code>.</p>
            <code>node inventario.js</code>
          </div>
        </div>

        <div class="mt-4 flex-between">
          <button class="btn btn-secondary" id="btn-export-data">
            💾 Exportar Datos a JSON
          </button>
          <button class="btn btn-primary" id="btn-return-app">
            🚀 Ir a la Aplicación Interactiva
          </button>
        </div>
      </div>
    </div>
  `;

  // Listeners
  const copyBtn = container.querySelector('#btn-copy-pseudocode');
  if (copyBtn) {
    copyBtn.addEventListener('click', () => {
      const code = container.querySelector('#pseudocode-content').innerText;
      navigator.clipboard.writeText(code).then(() => {
        copyBtn.textContent = '✓ ¡Copiado!';
        setTimeout(() => {
          copyBtn.textContent = '📋 Copiar Pseudocódigo';
        }, 1500);
      });
    });
  }

  const exportBtn = container.querySelector('#btn-export-data');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(store.getProducts(), null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute('href', dataStr);
      downloadAnchor.setAttribute('download', `inventario_${new Date().toISOString().slice(0, 10)}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
    });
  }

  const returnAppBtn = container.querySelector('#btn-return-app');
  if (returnAppBtn) {
    returnAppBtn.addEventListener('click', () => {
      store.setActiveTab('app');
    });
  }
}
