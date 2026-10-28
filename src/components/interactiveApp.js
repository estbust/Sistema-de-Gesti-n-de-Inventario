/**
 * interactiveApp.js
 * Interfaz interactiva principal del Sistema de Gestión de Inventario.
 * Controla las 4 vistas del algoritmo y su sincronización con el flujo.
 */

import { store } from '../data/inventoryStore.js';

export function renderInteractiveApp(container) {
  const currentView = store.currentView;
  const metrics = store.getMetrics();

  container.innerHTML = `
    <div class="app-interface">
      <!-- Breadcrumb del Algoritmo -->
      <div class="algorithm-breadcrumb">
        <span class="bc-step ${currentView === 'menu' ? 'active' : ''}">
          <span class="bc-shape rect-mini"></span> Menú Principal
        </span>
        <span class="bc-arrow">➔</span>
        <span class="bc-step ${currentView !== 'menu' ? 'active' : ''}">
          ${getBreadcrumbTitle(currentView)}
        </span>
        ${currentView !== 'menu' && currentView !== 'exit' ? `
          <span class="bc-arrow">➔</span>
          <span class="bc-step return">
            <span class="bc-shape rect-mini"></span> Retorno a Menú
          </span>
        ` : ''}
      </div>

      <!-- Contenedor dinámico según la vista -->
      <div class="view-content" id="view-content-area">
        ${renderCurrentView(currentView, metrics)}
      </div>
    </div>
  `;

  // Attach event handlers
  attachViewEvents(container);
}

function getBreadcrumbTitle(view) {
  switch (view) {
    case 'menu': return 'Seleccionar Opción';
    case 'add': return 'Opción 1: Agregar Producto (Paralelogramo ➔ Rectángulo)';
    case 'view': return 'Opción 2: Ver Inventario (Rectángulo ➔ Paralelogramo)';
    case 'update': return 'Opción 3: Actualizar Inventario (Paralelogramo ➔ Rombo ➔ Proceso)';
    case 'exit': return 'Opción 4: Salir (Paralelogramo ➔ Fin)';
    default: return '';
  }
}

function renderCurrentView(view, metrics) {
  switch (view) {
    case 'menu':
      return renderMenuView(metrics);
    case 'add':
      return renderAddProductView();
    case 'view':
      return renderViewInventoryView(metrics);
    case 'update':
      return renderUpdateInventoryView();
    case 'exit':
      return renderExitView();
    default:
      return renderMenuView(metrics);
  }
}

/* =========================================================================
   VISTA: MOSTRAR MENÚ PRINCIPAL (Rectángulo)
   ========================================================================= */
function renderMenuView(metrics) {
  return `
    <div class="menu-view">
      <div class="menu-hero">
        <div class="shape-indicator">
          <span class="shape-badge shape-badge-rect">Rectángulo: Mostrar Menú Principal</span>
          <span class="shape-badge shape-badge-rhombus">Rombo: ¿Qué opción eligió?</span>
        </div>
        <h2 class="menu-hero-title">Menú Principal del Sistema</h2>
        <p class="menu-hero-desc">
          Seleccione una de las 4 opciones de decisión para ejecutar la rama correspondiente del algoritmo:
        </p>
      </div>

      <!-- Tarjetas de las 4 Opciones de Decisión -->
      <div class="options-grid">
        <!-- Opción 1 -->
        <div class="option-card card-op1" data-action="go-add">
          <div class="option-badge">Opción 1</div>
          <div class="option-icon">➕</div>
          <h3 class="option-title">Agregar producto</h3>
          <p class="option-desc">
            <strong>Entrada:</strong> Pedir nombre, cantidad y precio.<br>
            <strong>Proceso:</strong> Guardar en el inventario.
          </p>
          <div class="option-footer">
            <span class="btn-text">Ejecutar Opción 1 ➔</span>
          </div>
        </div>

        <!-- Opción 2 -->
        <div class="option-card card-op2" data-action="go-view">
          <div class="option-badge">Opción 2</div>
          <div class="option-icon">📋</div>
          <h3 class="option-title">Ver inventario</h3>
          <p class="option-desc">
            <strong>Proceso:</strong> Leer lista de productos.<br>
            <strong>Salida:</strong> Mostrar productos en pantalla.
          </p>
          <div class="option-footer">
            <span class="btn-text">Ejecutar Opción 2 ➔</span>
          </div>
        </div>

        <!-- Opción 3 -->
        <div class="option-card card-op3" data-action="go-update">
          <div class="option-badge">Opción 3</div>
          <div class="option-icon">🔄</div>
          <h3 class="option-title">Actualizar inventario</h3>
          <p class="option-desc">
            <strong>Entrada:</strong> Pedir nombre de producto.<br>
            <strong>Decisión:</strong> ¿Existe? Sumar/Restar stock o error.
          </p>
          <div class="option-footer">
            <span class="btn-text">Ejecutar Opción 3 ➔</span>
          </div>
        </div>

        <!-- Opción 4 -->
        <div class="option-card card-op4" data-action="go-exit">
          <div class="option-badge">Opción 4</div>
          <div class="option-icon">🚪</div>
          <h3 class="option-title">Salir</h3>
          <p class="option-desc">
            <strong>Salida:</strong> Mensaje de despedida.<br>
            <strong>Terminal:</strong> Fin del algoritmo.
          </p>
          <div class="option-footer">
            <span class="btn-text">Ejecutar Opción 4 ➔</span>
          </div>
        </div>
      </div>

      <!-- Resumen Rápido / Métricas -->
      <div class="metrics-bar">
        <div class="metric-item">
          <span class="metric-label">Productos Registrados</span>
          <span class="metric-value">${metrics.totalItems}</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-label">Unidades en Stock</span>
          <span class="metric-value">${metrics.totalUnits}</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <span class="metric-label">Valorización Total</span>
          <span class="metric-value val-money">$${metrics.totalValue.toFixed(2)}</span>
        </div>
        <div class="metric-divider"></div>
        <div class="metric-item">
          <button class="btn btn-secondary btn-sm" id="btn-quick-reset" title="Restablecer datos de muestra">
            🔄 Restablecer Demo
          </button>
        </div>
      </div>
    </div>
  `;
}

/* =========================================================================
   VISTA 1: AGREGAR PRODUCTO (Opción 1)
   Paralelogramo (Pedir nombre, cantidad, precio) -> Rectángulo (Guardar)
   ========================================================================= */
function renderAddProductView() {
  return `
    <div class="flow-card">
      <div class="flow-card-header">
        <div class="flow-shape-tag tag-parallelogram">
          <span class="tag-icon">▱</span> Paralelogramo: Pedir nombre, cantidad y precio
        </div>
        <h2>Opción 1: Agregar nuevo producto</h2>
        <p class="flow-card-subtitle">
          Ingrese los datos solicitados. Al hacer clic en Guardar, se ejecutará el <strong>[Rectángulo: Guardar en el inventario]</strong> y retornará al Menú Principal.
        </p>
      </div>

      <form id="form-add-product" class="product-form">
        <div class="form-group">
          <label for="prod-name">
            <span class="label-text">Nombre del Producto</span>
            <span class="required">*</span>
          </label>
          <input 
            type="text" 
            id="prod-name" 
            name="name" 
            placeholder="Ej. Cuaderno Universitario, Lápiz HB..." 
            autocomplete="off"
            required
            class="form-control"
          />
          <small class="form-hint">Entrada de datos: texto identificador del producto.</small>
        </div>

        <div class="form-row">
          <div class="form-group col-half">
            <label for="prod-quantity">
              <span class="label-text">Cantidad Inicial</span>
              <span class="required">*</span>
            </label>
            <input 
              type="number" 
              id="prod-quantity" 
              name="quantity" 
              min="0" 
              step="1" 
              placeholder="0" 
              required
              class="form-control"
            />
            <small class="form-hint">Número entero mayor o igual a 0.</small>
          </div>

          <div class="form-group col-half">
            <label for="prod-price">
              <span class="label-text">Precio Unitario ($)</span>
              <span class="required">*</span>
            </label>
            <input 
              type="number" 
              id="prod-price" 
              name="price" 
              min="0.01" 
              step="0.01" 
              placeholder="0.00" 
              required
              class="form-control"
            />
            <small class="form-hint">Valor decimal en dólares.</small>
          </div>
        </div>

        <div id="add-feedback" class="feedback-area"></div>

        <div class="form-actions">
          <button type="button" class="btn btn-secondary" data-action="go-menu">
            ⬅ Cancelar y Volver al Menú
          </button>
          <button type="submit" class="btn btn-primary" id="btn-submit-add">
            💾 Guardar en el Inventario (Rectángulo) ➔
          </button>
        </div>
      </form>
    </div>
  `;
}

/* =========================================================================
   VISTA 2: VER INVENTARIO (Opción 2)
   Rectángulo (Leer lista) -> Paralelogramo (Mostrar en pantalla)
   ========================================================================= */
function renderViewInventoryView(metrics) {
  const products = store.getProducts();

  return `
    <div class="flow-card">
      <div class="flow-card-header flex-header">
        <div>
          <div class="flow-shape-tag tag-rect">
            <span class="tag-icon">▭</span> Rectángulo: Leer lista de productos
          </div>
          <div class="flow-shape-tag tag-parallelogram">
            <span class="tag-icon">▱</span> Paralelogramo: Mostrar productos en pantalla
          </div>
          <h2>Opción 2: Inventario de Productos</h2>
          <p class="flow-card-subtitle">
            Mostrando todos los productos almacenados en la memoria del sistema.
          </p>
        </div>
        <button class="btn btn-secondary" data-action="go-menu">
          ⬅ Regresar al Menú Principal
        </button>
      </div>

      <!-- Barra de Filtro / Búsqueda -->
      <div class="table-toolbar">
        <div class="search-box">
          <span class="search-icon">🔍</span>
          <input type="text" id="inventory-search" placeholder="Buscar producto por nombre..." class="search-input" />
        </div>
        <div class="toolbar-stats">
          Total de registros: <strong>${products.length}</strong>
        </div>
      </div>

      <!-- Tabla de Productos -->
      <div class="table-responsive">
        <table class="inventory-table" id="table-products">
          <thead>
            <tr>
              <th width="50">#</th>
              <th>Nombre del Producto</th>
              <th width="130">Cantidad</th>
              <th width="120">Precio U.</th>
              <th width="130">Subtotal</th>
              <th width="140">Estado</th>
              <th width="110">Acción</th>
            </tr>
          </thead>
          <tbody id="inventory-table-body">
            ${renderTableRows(products)}
          </tbody>
        </table>
      </div>

      <!-- Pie con Resumen Financiero -->
      <div class="inventory-summary-footer">
        <div class="summary-card">
          <span>Unidades Totales:</span>
          <strong>${metrics.totalUnits}</strong>
        </div>
        <div class="summary-card highlight">
          <span>Valor Total del Inventario:</span>
          <strong>$${metrics.totalValue.toFixed(2)}</strong>
        </div>
      </div>

      <div class="card-bottom-action">
        <button class="btn btn-primary" data-action="go-menu">
          ⬅ Flecha de regreso a Mostrar Menú Principal
        </button>
      </div>
    </div>
  `;
}

function renderTableRows(products) {
  if (products.length === 0) {
    return `
      <tr>
        <td colspan="7" class="table-empty">
          <div class="empty-state">
            <span class="empty-icon">📭</span>
            <h4>El inventario está actualmente vacío</h4>
            <p>Utilice la <strong>Opción 1</strong> para agregar su primer producto.</p>
            <button class="btn btn-primary btn-sm" data-action="go-add">➕ Agregar Producto</button>
          </div>
        </td>
      </tr>
    `;
  }

  return products.map((prod, index) => {
    const subtotal = prod.cantidad * prod.precio;
    let badgeClass = 'badge-success';
    let badgeText = 'En stock';

    if (prod.cantidad === 0) {
      badgeClass = 'badge-danger';
      badgeText = 'Agotado';
    } else if (prod.cantidad <= 5) {
      badgeClass = 'badge-warning';
      badgeText = 'Stock bajo';
    }

    return `
      <tr data-id="${prod.id}" data-name="${prod.nombre.toLowerCase()}">
        <td class="col-center text-muted">${index + 1}</td>
        <td class="font-bold col-name">${escapeHtml(prod.nombre)}</td>
        <td class="col-center">
          <span class="quantity-badge">${prod.cantidad}</span>
        </td>
        <td class="col-right">$${prod.precio.toFixed(2)}</td>
        <td class="col-right font-bold text-accent">$${subtotal.toFixed(2)}</td>
        <td class="col-center">
          <span class="status-pill ${badgeClass}">${badgeText}</span>
        </td>
        <td class="col-center">
          <button class="btn-icon" data-action="quick-update" data-name="${escapeHtml(prod.nombre)}" title="Actualizar este producto">
            🔄
          </button>
        </td>
      </tr>
    `;
  }).join('');
}

/* =========================================================================
   VISTA 3: ACTUALIZAR INVENTARIO (Opción 3)
   Pedir nombre -> ¿Existe? Sí: Pedir cantidad -> Actualizar. No: Error
   ========================================================================= */
function renderUpdateInventoryView() {
  const products = store.getProducts();

  return `
    <div class="flow-card">
      <div class="flow-card-header">
        <div class="flow-shape-tag tag-parallelogram">
          <span class="tag-icon">▱</span> Paralelogramo: Pedir nombre del producto
        </div>
        <div class="flow-shape-tag tag-rhombus">
          <span class="tag-icon">◇</span> Rombo: ¿Existe el producto?
        </div>
        <h2>Opción 3: Actualizar inventario</h2>
        <p class="flow-card-subtitle">
          Aumente o disminuya la cantidad de un producto existente. El sistema verificará su existencia antes de proceder.
        </p>
      </div>

      <!-- Paso 1: Pedir Nombre del Producto -->
      <div class="update-step-box" id="step-search-product">
        <label for="update-prod-name" class="label-text">
          <strong>Paso 1:</strong> Ingrese el nombre del producto que desea actualizar:
        </label>
        <div class="input-with-button">
          <input 
            type="text" 
            id="update-prod-name" 
            placeholder="Escriba el nombre exacto del producto..." 
            list="products-datalist"
            autocomplete="off"
            class="form-control"
          />
          <datalist id="products-datalist">
            ${products.map(p => `<option value="${escapeHtml(p.nombre)}"></option>`).join('')}
          </datalist>
          <button type="button" class="btn btn-primary" id="btn-check-product">
            Comprobar Existencia (Rombo) ➔
          </button>
        </div>
        <small class="form-hint">Tip: Puede seleccionar de la lista desplegable o escribir cualquier nombre para probar el camino de error.</small>
      </div>

      <!-- Resultado del Rombo de Decisión -->
      <div id="update-flow-result" class="update-result-area"></div>

      <div class="form-actions mt-4">
        <button type="button" class="btn btn-secondary" data-action="go-menu">
          ⬅ Regresar al Menú Principal
        </button>
      </div>
    </div>
  `;
}

/* =========================================================================
   VISTA 4: SALIR (Opción 4)
   Paralelogramo (Mensaje de despedida) -> Óvalo (Fin)
   ========================================================================= */
function renderExitView() {
  return `
    <div class="exit-card">
      <div class="exit-shapes">
        <span class="flow-shape-tag tag-parallelogram">
          <span class="tag-icon">▱</span> Paralelogramo: Mensaje de despedida
        </span>
        <span class="flow-shape-tag tag-oval tag-danger">
          <span class="tag-icon">◯</span> Óvalo: Fin
        </span>
      </div>

      <div class="exit-icon-animation">👋</div>
      <h2 class="exit-title">¡Muchas gracias por utilizar el Sistema de Gestión de Inventario!</h2>
      <p class="exit-message">
        El algoritmo ha alcanzado satisfactoriamente el estado <strong>[Fin (Óvalo)]</strong>.<br>
        Todos sus cambios han sido guardados en el almacenamiento local.
      </p>

      <div class="exit-box">
        <div class="terminal-text-sample">
          <code>
            &gt; Mensaje de despedida emitido (Paralelogramo)<br>
            &gt; Proceso finalizado. Estado de salida: 0 (OK)<br>
            &gt; >>> FIN (ÓVALO) DEL ALGORITMO &lt;&lt;&lt;
          </code>
        </div>
      </div>

      <div class="exit-actions">
        <button class="btn btn-primary btn-lg" id="btn-restart-algorithm">
          🚀 Iniciar Nuevo Ciclo (Volver a Inicio / Menú)
        </button>
      </div>
    </div>
  `;
}

/* =========================================================================
   MANEJO DE EVENTOS DE LAS VISTAS
   ========================================================================= */
function attachViewEvents(container) {
  // Navegación rápida entre vistas
  container.addEventListener('click', (e) => {
    const target = e.target.closest('[data-action]');
    if (!target) return;

    const action = target.dataset.action;
    switch (action) {
      case 'go-menu':
        store.setCurrentView('menu');
        break;
      case 'go-add':
        store.setCurrentView('add');
        break;
      case 'go-view':
        store.setCurrentView('view');
        break;
      case 'go-update':
        store.setCurrentView('update');
        break;
      case 'go-exit':
        store.setCurrentView('exit');
        break;
      case 'quick-update': {
        const prodName = target.dataset.name;
        store.setCurrentView('update');
        setTimeout(() => {
          const input = document.querySelector('#update-prod-name');
          if (input) {
            input.value = prodName;
            document.querySelector('#btn-check-product')?.click();
          }
        }, 50);
        break;
      }
    }
  });

  // Botón reset en Menú
  const resetBtn = container.querySelector('#btn-quick-reset');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (confirm('¿Desea restablecer los productos por defecto de muestra?')) {
        store.resetToDefault();
      }
    });
  }

  // Opción 1: Formulario Agregar Producto
  const formAdd = container.querySelector('#form-add-product');
  if (formAdd) {
    formAdd.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = formAdd.elements['name'].value;
      const quantity = formAdd.elements['quantity'].value;
      const price = formAdd.elements['price'].value;
      const feedback = container.querySelector('#add-feedback');

      const result = store.addProduct(name, quantity, price);
      if (result.success) {
        feedback.innerHTML = `
          <div class="alert alert-success animate-fade-in">
            <strong>✓ [Rectángulo: Guardar en inventario] Éxito:</strong> ${escapeHtml(result.message)}
            <br><small>Redirigiendo automáticamente a Mostrar Menú Principal...</small>
          </div>
        `;
        formAdd.reset();
        setTimeout(() => {
          store.setCurrentView('menu');
        }, 1200);
      } else {
        feedback.innerHTML = `
          <div class="alert alert-danger animate-shake">
            <strong>❌ Error en entrada de datos:</strong> ${escapeHtml(result.message)}
          </div>
        `;
      }
    });
  }

  // Opción 2: Buscador en tiempo real de productos
  const searchInput = container.querySelector('#inventory-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase().trim();
      const rows = container.querySelectorAll('#inventory-table-body tr');
      rows.forEach(row => {
        const name = row.dataset.name || '';
        if (name.includes(q)) {
          row.style.display = '';
        } else {
          row.style.display = 'none';
        }
      });
    });
  }

  // Opción 3: Comprobar producto en Actualizar Inventario
  const btnCheck = container.querySelector('#btn-check-product');
  const inputUpdateName = container.querySelector('#update-prod-name');
  const resultArea = container.querySelector('#update-flow-result');

  if (btnCheck && inputUpdateName && resultArea) {
    const handleCheck = () => {
      const name = inputUpdateName.value.trim();
      if (!name) {
        resultArea.innerHTML = `
          <div class="alert alert-warning">
            Por favor, ingrese el nombre del producto que desea buscar.
          </div>
        `;
        return;
      }

      // Evaluar Rombo: ¿Existe el producto?
      store.setActiveNode('op3_decision', `[Rombo: ¿Existe el producto?] Buscando: "${name}"`);
      const product = store.findProductByName(name);

      if (!product) {
        // RAMA NO: Mostrar mensaje de error (Paralelogramo)
        store.setActiveNode('op3_no', `[Rombo: NO] El producto "${name}" no fue encontrado.`);
        resultArea.innerHTML = `
          <div class="decision-branch branch-no animate-shake">
            <div class="flow-shape-tag tag-parallelogram tag-danger">
              <span class="tag-icon">▱</span> Paralelogramo: Rama [NO] - Mensaje de error
            </div>
            <div class="error-box">
              <div class="error-icon">❌</div>
              <div>
                <h4 class="error-title">Error: El producto "${escapeHtml(name)}" NO existe</h4>
                <p class="error-desc">
                  No se encontró ningún artículo registrado bajo ese nombre en el inventario.
                </p>
                <div class="error-actions">
                  <button type="button" class="btn btn-secondary btn-sm" data-action="go-menu">
                    ⬅ Flecha de regreso a Mostrar Menú Principal
                  </button>
                  <button type="button" class="btn btn-primary btn-sm" data-action="go-add">
                    ➕ Ir a Opción 1 (Agregar Producto)
                  </button>
                </div>
              </div>
            </div>
          </div>
        `;
      } else {
        // RAMA SÍ: Pedir cantidad a sumar/restar (Paralelogramo)
        store.setActiveNode('op3_si', `[Rombo: SÍ] Producto encontrado: "${product.nombre}". Pedir cantidad.`);
        resultArea.innerHTML = `
          <div class="decision-branch branch-yes animate-fade-in">
            <div class="flow-shape-tag tag-parallelogram tag-success">
              <span class="tag-icon">▱</span> Paralelogramo: Rama [SÍ] - Pedir cantidad a sumar/restar
            </div>

            <div class="product-found-card">
              <div class="pfc-header">
                <div>
                  <span class="pfc-badge">Producto Encontrado</span>
                  <h3 class="pfc-title">${escapeHtml(product.nombre)}</h3>
                </div>
                <div class="pfc-stock">
                  Stock actual: <strong>${product.cantidad}</strong> unidades
                </div>
              </div>

              <!-- Formulario de Suma / Resta -->
              <form id="form-update-stock" class="update-stock-form mt-3">
                <div class="form-row">
                  <div class="form-group col-half">
                    <label class="label-text">Tipo de Operación:</label>
                    <div class="operation-selector">
                      <label class="radio-label">
                        <input type="radio" name="operacion" value="sumar" checked />
                        <span class="radio-custom op-add">➕ Sumar (Aumentar)</span>
                      </label>
                      <label class="radio-label">
                        <input type="radio" name="operacion" value="restar" />
                        <span class="radio-custom op-sub">➖ Restar (Disminuir)</span>
                      </label>
                    </div>
                  </div>

                  <div class="form-group col-half">
                    <label for="input-delta-quantity" class="label-text">
                      Cantidad a Modificar:
                    </label>
                    <input 
                      type="number" 
                      id="input-delta-quantity" 
                      min="1" 
                      step="1" 
                      placeholder="Ej. 5" 
                      required
                      class="form-control"
                    />
                  </div>
                </div>

                <!-- Preview interactivo del cálculo -->
                <div class="calc-preview" id="calc-preview">
                  <span class="cp-item">Stock Actual: <strong>${product.cantidad}</strong></span>
                  <span class="cp-operator" id="cp-op">+</span>
                  <span class="cp-item" id="cp-delta">0</span>
                  <span class="cp-operator">=</span>
                  <span class="cp-item result" id="cp-result">${product.cantidad} unidades</span>
                </div>

                <div id="update-delta-feedback"></div>

                <div class="form-actions mt-3">
                  <button type="button" class="btn btn-secondary" data-action="go-menu">
                    ⬅ Cancelar y Volver al Menú
                  </button>
                  <button type="submit" class="btn btn-primary" id="btn-save-update">
                    💾 Actualizar Total (Rectángulo) ➔
                  </button>
                </div>
              </form>
            </div>
          </div>
        `;

        // Eventos en vivo para el preview interactivo
        const updateForm = resultArea.querySelector('#form-update-stock');
        const inputDelta = resultArea.querySelector('#input-delta-quantity');
        const opRadios = resultArea.querySelectorAll('input[name="operacion"]');
        const cpOp = resultArea.querySelector('#cp-op');
        const cpDelta = resultArea.querySelector('#cp-delta');
        const cpResult = resultArea.querySelector('#cp-result');
        const deltaFeedback = resultArea.querySelector('#update-delta-feedback');

        const updatePreview = () => {
          const isAdd = resultArea.querySelector('input[name="operacion"]:checked').value === 'sumar';
          const delta = parseInt(inputDelta.value, 10) || 0;
          cpOp.textContent = isAdd ? '+' : '-';
          cpDelta.textContent = delta;

          const newTotal = isAdd ? (product.cantidad + delta) : (product.cantidad - delta);
          cpResult.textContent = `${newTotal} unidades`;

          if (!isAdd && delta > product.cantidad) {
            cpResult.classList.add('text-danger');
            deltaFeedback.innerHTML = `
              <div class="alert alert-warning animate-fade-in mt-2">
                ⚠️ Advertencia: No es posible restar ${delta} unidades porque el stock actual es de sólo ${product.cantidad}.
              </div>
            `;
          } else {
            cpResult.classList.remove('text-danger');
            deltaFeedback.innerHTML = '';
          }
        };

        inputDelta.addEventListener('input', updatePreview);
        opRadios.forEach(r => r.addEventListener('change', updatePreview));

        // Submit de la actualización
        updateForm.addEventListener('submit', (ev) => {
          ev.preventDefault();
          const op = resultArea.querySelector('input[name="operacion"]:checked').value;
          const delta = inputDelta.value;

          const res = store.updateStock(product.nombre, delta, op);
          if (res.success) {
            deltaFeedback.innerHTML = `
              <div class="alert alert-success animate-fade-in mt-2">
                <strong>✓ [Rectángulo: Actualizar total] Éxito:</strong> ${escapeHtml(res.message)}
                <br><small>Flecha de regreso a Mostrar Menú Principal en curso...</small>
              </div>
            `;
            setTimeout(() => {
              store.setCurrentView('menu');
            }, 1200);
          } else {
            deltaFeedback.innerHTML = `
              <div class="alert alert-danger animate-shake mt-2">
                <strong>❌ Error:</strong> ${escapeHtml(res.message)}
              </div>
            `;
          }
        });
      }
    };

    btnCheck.addEventListener('click', handleCheck);
    inputUpdateName.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleCheck();
      }
    });
  }

  // Opción 4: Botón reiniciar algoritmo
  const restartBtn = container.querySelector('#btn-restart-algorithm');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      store.setActiveNode('inicio', 'Reiniciando ciclo del algoritmo desde [Inicio (Óvalo)]');
      setTimeout(() => {
        store.setCurrentView('menu');
      }, 400);
    });
  }
}

function escapeHtml(str) {
  if (!str) return '';
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
