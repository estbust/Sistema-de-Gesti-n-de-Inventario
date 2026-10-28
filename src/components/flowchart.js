/**
 * flowchart.js
 * Componente de Diagrama de Flujo Interactivo con SVG Vectorial.
 * Representa con precisión las formas estándar de diagramas de flujo:
 * - Óvalo: Inicio y Fin
 * - Rectángulo: Procesos
 * - Rombo: Decisiones
 * - Paralelogramo: Entrada / Salida de datos
 * Con animación de pulso y resalte en tiempo real del nodo activo.
 */

import { store } from '../data/inventoryStore.js';

export function renderFlowchart(container) {
  const activeNode = store.activeNode;

  // Metadata de los nodos con explicaciones didácticas
  const nodes = [
    {
      id: 'inicio',
      tipo: 'Óvalo',
      simbologia: 'Terminal (Inicio)',
      color: '#10b981',
      title: 'Inicio',
      desc: 'Punto de partida del algoritmo de control de inventario.',
      viewTarget: 'menu'
    },
    {
      id: 'menu',
      tipo: 'Rectángulo',
      simbologia: 'Proceso',
      color: '#3b82f6',
      title: 'Mostrar Menú Principal',
      desc: 'Despliega en pantalla las 4 alternativas del sistema.',
      viewTarget: 'menu'
    },
    {
      id: 'decision',
      tipo: 'Rombo',
      simbologia: 'Decisión',
      color: '#f59e0b',
      title: '¿Qué opción eligió?',
      desc: 'Evalúa la entrada del usuario y bifurca hacia las opciones 1, 2, 3 o 4.',
      viewTarget: 'menu'
    },
    // Opción 1
    {
      id: 'op1_pedir',
      tipo: 'Paralelogramo',
      simbologia: 'Entrada de datos',
      color: '#8b5cf6',
      title: 'Pedir nombre, cantidad y precio',
      desc: 'Captura los datos requeridos para registrar un nuevo producto.',
      viewTarget: 'add'
    },
    {
      id: 'op1_guardar',
      tipo: 'Rectángulo',
      simbologia: 'Proceso',
      color: '#3b82f6',
      title: 'Guardar en el inventario',
      desc: 'Almacena el nuevo registro en la lista de productos.',
      viewTarget: 'add'
    },
    // Opción 2
    {
      id: 'op2_leer',
      tipo: 'Rectángulo',
      simbologia: 'Proceso',
      color: '#3b82f6',
      title: 'Leer lista de productos',
      desc: 'Recupera y procesa la colección de productos existentes.',
      viewTarget: 'view'
    },
    {
      id: 'op2_mostrar',
      tipo: 'Paralelogramo',
      simbologia: 'Salida de datos',
      color: '#8b5cf6',
      title: 'Mostrar productos en pantalla',
      desc: 'Imprime la tabla con cantidades, precios y subtotales.',
      viewTarget: 'view'
    },
    // Opción 3
    {
      id: 'op3_pedir',
      tipo: 'Paralelogramo',
      simbologia: 'Entrada de datos',
      color: '#8b5cf6',
      title: 'Pedir nombre del producto',
      desc: 'Solicita al usuario el identificador o nombre a buscar.',
      viewTarget: 'update'
    },
    {
      id: 'op3_decision',
      tipo: 'Rombo',
      simbologia: 'Decisión',
      color: '#f59e0b',
      title: '¿Existe el producto?',
      desc: 'Verifica si el nombre coincide con un producto registrado.',
      viewTarget: 'update'
    },
    {
      id: 'op3_si',
      tipo: 'Paralelogramo',
      simbologia: 'Entrada de datos',
      color: '#8b5cf6',
      title: 'Sí: Pedir cantidad a sumar/restar',
      desc: 'Captura la magnitud del cambio en el inventario.',
      viewTarget: 'update'
    },
    {
      id: 'op3_actualizar',
      tipo: 'Rectángulo',
      simbologia: 'Proceso',
      color: '#3b82f6',
      title: 'Actualizar total',
      desc: 'Calcula y asigna el nuevo stock total del producto.',
      viewTarget: 'update'
    },
    {
      id: 'op3_no',
      tipo: 'Paralelogramo',
      simbologia: 'Salida de datos',
      color: '#ef4444',
      title: 'No: Mostrar mensaje de error',
      desc: 'Notifica que el producto no fue encontrado.',
      viewTarget: 'update'
    },
    // Opción 4
    {
      id: 'op4_despedida',
      tipo: 'Paralelogramo',
      simbologia: 'Salida de datos',
      color: '#8b5cf6',
      title: 'Mensaje de despedida',
      desc: 'Emite el saludo de agradecimiento y cierre.',
      viewTarget: 'exit'
    },
    {
      id: 'fin',
      tipo: 'Óvalo',
      simbologia: 'Terminal (Fin)',
      color: '#ef4444',
      title: 'Fin',
      desc: 'Terminación formal de la ejecución del algoritmo.',
      viewTarget: 'exit'
    }
  ];

  const activeNodeInfo = nodes.find(n => n.id === activeNode) || nodes[1];

  container.innerHTML = `
    <div class="flowchart-wrapper">
      <div class="flowchart-header">
        <div>
          <h2 class="section-title">📊 Diagrama de Flujo del Algoritmo</h2>
          <p class="section-subtitle">
            Visualización con simbología estándar ISO/ANSI. El nodo en ejecución actual se ilumina con animación de pulso.
          </p>
        </div>
        <div class="flowchart-active-pill">
          <span class="pulse-dot"></span>
          <span>Nodo en ejecución: <strong>${activeNodeInfo.title}</strong> (${activeNodeInfo.tipo})</span>
        </div>
      </div>

      <!-- Leyenda Didáctica -->
      <div class="flowchart-legend">
        <div class="legend-item">
          <span class="legend-shape shape-oval"></span>
          <div>
            <strong>Óvalo</strong>
            <span>Inicio / Fin</span>
          </div>
        </div>
        <div class="legend-item">
          <span class="legend-shape shape-rect"></span>
          <div>
            <strong>Rectángulo</strong>
            <span>Proceso Interno</span>
          </div>
        </div>
        <div class="legend-item">
          <span class="legend-shape shape-rhombus"></span>
          <div>
            <strong>Rombo</strong>
            <span>Decisión Condicional</span>
          </div>
        </div>
        <div class="legend-item">
          <span class="legend-shape shape-parallelogram"></span>
          <div>
            <strong>Paralelogramo</strong>
            <span>Entrada / Salida (I/O)</span>
          </div>
        </div>
      </div>

      <!-- Canvas SVG del Diagrama -->
      <div class="flowchart-svg-container" id="svg-viewport">
        <svg viewBox="0 0 1100 840" class="flowchart-svg" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <!-- Marcador Flecha Normal -->
            <marker id="arrow" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="var(--svg-arrow, #64748b)" />
            </marker>
            <!-- Marcador Flecha Retorno -->
            <marker id="arrow-return" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
              <path d="M 0 1.5 L 8 5 L 0 8.5 z" fill="#0ea5e9" />
            </marker>
            <!-- Marcador Flecha Activa -->
            <marker id="arrow-active" viewBox="0 0 10 10" refX="6" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 1 L 9 5 L 0 9 z" fill="#3b82f6" />
            </marker>
            <!-- Filtro de Resplandor (Glow) para el nodo activo -->
            <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          <!-- ==================== LÍNEAS DE CONEXIÓN Y FLUJO ==================== -->
          
          <!-- Inicio -> Mostrar Menú -->
          <line x1="550" y1="65" x2="550" y2="105" class="flow-line ${isEdgeActive('inicio', 'menu') ? 'active-edge' : ''}" marker-end="url(#arrow)" />

          <!-- Menú -> Decisión ¿Qué opción eligió? -->
          <line x1="550" y1="165" x2="550" y2="205" class="flow-line ${isEdgeActive('menu', 'decision') ? 'active-edge' : ''}" marker-end="url(#arrow)" />

          <!-- Bifurcaciones desde ¿Qué opción eligió? -->
          <!-- A Opción 1 (x: 160) -->
          <path d="M 460 255 L 160 255 L 160 325" fill="none" class="flow-line ${isBranchActive('1') ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          <text x="310" y="247" class="branch-label">Opción 1: Agregar</text>

          <!-- A Opción 2 (x: 410) -->
          <path d="M 505 285 L 410 325" fill="none" class="flow-line ${isBranchActive('2') ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          <text x="415" y="295" class="branch-label">Opción 2: Ver</text>

          <!-- A Opción 3 (x: 690) -->
          <path d="M 595 285 L 690 325" fill="none" class="flow-line ${isBranchActive('3') ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          <text x="660" y="295" class="branch-label">Opción 3: Actualizar</text>

          <!-- A Opción 4 (x: 940) -->
          <path d="M 640 255 L 940 255 L 940 325" fill="none" class="flow-line ${isBranchActive('4') ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          <text x="790" y="247" class="branch-label">Opción 4: Salir</text>

          <!-- Rama 1: Pedir datos -> Guardar en inventario -->
          <line x1="160" y1="385" x2="160" y2="445" class="flow-line ${isEdgeActive('op1_pedir', 'op1_guardar') ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          
          <!-- Rama 1: Retorno a Menú Principal -->
          <path d="M 160 505 L 160 760 L 50 760 L 50 135 L 435 135" fill="none" class="return-line" marker-end="url(#arrow-return)" />
          <text x="60" y="470" class="return-text">Regreso a Menú</text>

          <!-- Rama 2: Leer productos -> Mostrar en pantalla -->
          <line x1="410" y1="385" x2="410" y2="445" class="flow-line ${isEdgeActive('op2_leer', 'op2_mostrar') ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          
          <!-- Rama 2: Retorno a Menú Principal -->
          <path d="M 410 505 L 410 740 L 75 740 L 75 145 L 435 145" fill="none" class="return-line" marker-end="url(#arrow-return)" />

          <!-- Rama 3: Pedir nombre -> ¿Existe el producto? -->
          <line x1="690" y1="385" x2="690" y2="435" class="flow-line ${isEdgeActive('op3_pedir', 'op3_decision') ? 'active-edge' : ''}" marker-end="url(#arrow)" />

          <!-- Rama 3 Rombo: Sí (hacia la izquierda x: 600) -->
          <path d="M 630 480 L 590 480 L 590 545" fill="none" class="flow-line ${activeNode === 'op3_si' || activeNode === 'op3_actualizar' ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          <text x="595" y="472" class="decision-label label-yes">Sí</text>

          <!-- Rama 3 Sí: Pedir cantidad -> Actualizar total -->
          <line x1="590" y1="605" x2="590" y2="655" class="flow-line ${isEdgeActive('op3_si', 'op3_actualizar') ? 'active-edge' : ''}" marker-end="url(#arrow)" />

          <!-- Rama 3 Sí: Retorno a Menú Principal -->
          <path d="M 590 715 L 590 780 L 100 780 L 100 155 L 435 155" fill="none" class="return-line" marker-end="url(#arrow-return)" />

          <!-- Rama 3 Rombo: No (hacia la derecha x: 790) -->
          <path d="M 750 480 L 790 480 L 790 545" fill="none" class="flow-line ${activeNode === 'op3_no' ? 'active-edge' : ''}" marker-end="url(#arrow)" />
          <text x="760" y="472" class="decision-label label-no">No</text>

          <!-- Rama 3 No: Retorno a Menú Principal -->
          <path d="M 790 605 L 790 800 L 125 800 L 125 165 L 435 165" fill="none" class="return-line" marker-end="url(#arrow-return)" />

          <!-- Rama 4: Mensaje de despedida -> Fin -->
          <line x1="940" y1="385" x2="940" y2="455" class="flow-line ${isEdgeActive('op4_despedida', 'fin') ? 'active-edge' : ''}" marker-end="url(#arrow)" />


          <!-- ==================== NODOS DEL DIAGRAMA ==================== -->

          <!-- 1. INICIO (ÓVALO) -->
          <g class="node-group ${activeNode === 'inicio' ? 'active' : ''}" data-node="inicio" transform="translate(550, 40)">
            <ellipse cx="0" cy="0" rx="90" ry="24" class="shape-element node-oval node-start" />
            <text x="0" y="5" class="node-title">Inicio</text>
          </g>

          <!-- 2. MOSTRAR MENÚ PRINCIPAL (RECTÁNGULO) -->
          <g class="node-group ${activeNode === 'menu' ? 'active' : ''}" data-node="menu" transform="translate(550, 135)">
            <rect x="-115" y="-30" width="230" height="60" rx="8" class="shape-element node-rect" />
            <text x="0" y="-5" class="node-title">Mostrar Menú</text>
            <text x="0" y="15" class="node-title">Principal</text>
          </g>

          <!-- 3. DECISIÓN: ¿QUÉ OPCIÓN ELIGIÓ? (ROMBO) -->
          <g class="node-group ${activeNode === 'decision' ? 'active' : ''}" data-node="decision" transform="translate(550, 255)">
            <polygon points="0,-48 92,0 0,48 -92,0" class="shape-element node-rhombus" />
            <text x="0" y="-4" class="node-title">¿Qué opción</text>
            <text x="0" y="14" class="node-title">eligió?</text>
          </g>

          <!-- ==================== OPCIÓN 1: AGREGAR PRODUCTO ==================== -->
          <!-- 1.1 Pedir nombre, cantidad y precio (Paralelogramo) -->
          <g class="node-group ${activeNode === 'op1_pedir' ? 'active' : ''}" data-node="op1_pedir" transform="translate(160, 355)">
            <polygon points="-90,-30 110,-30 90,30 -110,30" class="shape-element node-parallelogram" />
            <text x="0" y="-8" class="node-title small">Pedir nombre,</text>
            <text x="0" y="12" class="node-title small">cantidad y precio</text>
          </g>

          <!-- 1.2 Guardar en el inventario (Rectángulo) -->
          <g class="node-group ${activeNode === 'op1_guardar' ? 'active' : ''}" data-node="op1_guardar" transform="translate(160, 475)">
            <rect x="-95" y="-30" width="190" height="60" rx="8" class="shape-element node-rect" />
            <text x="0" y="-5" class="node-title small">Guardar en el</text>
            <text x="0" y="15" class="node-title small">inventario</text>
          </g>

          <!-- ==================== OPCIÓN 2: VER INVENTARIO ==================== -->
          <!-- 2.1 Leer lista de productos (Rectángulo) -->
          <g class="node-group ${activeNode === 'op2_leer' ? 'active' : ''}" data-node="op2_leer" transform="translate(410, 355)">
            <rect x="-90" y="-30" width="180" height="60" rx="8" class="shape-element node-rect" />
            <text x="0" y="-5" class="node-title small">Leer lista de</text>
            <text x="0" y="15" class="node-title small">productos</text>
          </g>

          <!-- 2.2 Mostrar productos en pantalla (Paralelogramo) -->
          <g class="node-group ${activeNode === 'op2_mostrar' ? 'active' : ''}" data-node="op2_mostrar" transform="translate(410, 475)">
            <polygon points="-85,-30 105,-30 85,30 -105,30" class="shape-element node-parallelogram" />
            <text x="0" y="-6" class="node-title small">Mostrar productos</text>
            <text x="0" y="14" class="node-title small">en pantalla</text>
          </g>

          <!-- ==================== OPCIÓN 3: ACTUALIZAR INVENTARIO ==================== -->
          <!-- 3.1 Pedir nombre del producto (Paralelogramo) -->
          <g class="node-group ${activeNode === 'op3_pedir' ? 'active' : ''}" data-node="op3_pedir" transform="translate(690, 355)">
            <polygon points="-85,-30 105,-30 85,30 -105,30" class="shape-element node-parallelogram" />
            <text x="0" y="-6" class="node-title small">Pedir nombre del</text>
            <text x="0" y="14" class="node-title small">producto</text>
          </g>

          <!-- 3.2 ¿Existe el producto? (Rombo) -->
          <g class="node-group ${activeNode === 'op3_decision' ? 'active' : ''}" data-node="op3_decision" transform="translate(690, 480)">
            <polygon points="0,-44 80,0 0,44 -80,0" class="shape-element node-rhombus" />
            <text x="0" y="-4" class="node-title small">¿Existe el</text>
            <text x="0" y="14" class="node-title small">producto?</text>
          </g>

          <!-- 3.3 Sí: Pedir cantidad a sumar/restar (Paralelogramo) -->
          <g class="node-group ${activeNode === 'op3_si' ? 'active' : ''}" data-node="op3_si" transform="translate(590, 575)">
            <polygon points="-80,-28 100,-28 80,28 -100,28" class="shape-element node-parallelogram" />
            <text x="0" y="-6" class="node-title tiny">Sí: Pedir cantidad</text>
            <text x="0" y="12" class="node-title tiny">a sumar/restar</text>
          </g>

          <!-- 3.4 Actualizar total (Rectángulo) -->
          <g class="node-group ${activeNode === 'op3_actualizar' ? 'active' : ''}" data-node="op3_actualizar" transform="translate(590, 685)">
            <rect x="-85" y="-28" width="170" height="56" rx="8" class="shape-element node-rect" />
            <text x="0" y="-3" class="node-title small">Actualizar</text>
            <text x="0" y="15" class="node-title small">total</text>
          </g>

          <!-- 3.5 No: Mostrar mensaje de error (Paralelogramo) -->
          <g class="node-group ${activeNode === 'op3_no' ? 'active' : ''}" data-node="op3_no" transform="translate(790, 575)">
            <polygon points="-75,-28 95,-28 75,28 -95,28" class="shape-element node-parallelogram error-shape" />
            <text x="0" y="-6" class="node-title tiny">No: Mostrar</text>
            <text x="0" y="12" class="node-title tiny">mensaje de error</text>
          </g>

          <!-- ==================== OPCIÓN 4: SALIR ==================== -->
          <!-- 4.1 Mensaje de despedida (Paralelogramo) -->
          <g class="node-group ${activeNode === 'op4_despedida' ? 'active' : ''}" data-node="op4_despedida" transform="translate(940, 355)">
            <polygon points="-80,-30 100,-30 80,30 -100,30" class="shape-element node-parallelogram" />
            <text x="0" y="-6" class="node-title small">Mensaje de</text>
            <text x="0" y="14" class="node-title small">despedida</text>
          </g>

          <!-- 4.2 Fin (Óvalo) -->
          <g class="node-group ${activeNode === 'fin' ? 'active' : ''}" data-node="fin" transform="translate(940, 485)">
            <ellipse cx="0" cy="0" rx="80" ry="24" class="shape-element node-oval node-end" />
            <text x="0" y="5" class="node-title">Fin</text>
          </g>
        </svg>
      </div>

      <!-- Detalle del nodo seleccionado o activo -->
      <div class="flowchart-info-box">
        <div class="info-badge" style="background: ${activeNodeInfo.color}22; color: ${activeNodeInfo.color}; border: 1px solid ${activeNodeInfo.color}55;">
          ${activeNodeInfo.tipo}: ${activeNodeInfo.simbologia}
        </div>
        <div class="info-content">
          <h4>${activeNodeInfo.title}</h4>
          <p>${activeNodeInfo.desc}</p>
        </div>
        <button class="btn btn-secondary btn-sm" id="btn-goto-view" data-view="${activeNodeInfo.viewTarget}">
          Ir a esta sección en la App ➔
        </button>
      </div>
    </div>
  `;

  // Listeners para clics en nodos del SVG
  container.querySelectorAll('.node-group').forEach(group => {
    group.addEventListener('click', () => {
      const nodeId = group.dataset.node;
      const target = nodes.find(n => n.id === nodeId);
      if (target) {
        store.setActiveNode(nodeId, `Seleccionado manualmente: ${target.title}`);
        if (target.viewTarget) {
          store.setCurrentView(target.viewTarget);
        }
      }
    });
  });

  const gotoBtn = container.querySelector('#btn-goto-view');
  if (gotoBtn) {
    gotoBtn.addEventListener('click', () => {
      const view = gotoBtn.dataset.view;
      if (view) {
        store.setActiveTab('app');
        store.setCurrentView(view);
      }
    });
  }
}

// Helpers para determinar si una conexión o rama está activa
function isEdgeActive(from, to) {
  const current = store.activeNode;
  return current === from || current === to;
}

function isBranchActive(branchNum) {
  const current = store.activeNode;
  if (branchNum === '1') {
    return current === 'op1_pedir' || current === 'op1_guardar';
  }
  if (branchNum === '2') {
    return current === 'op2_leer' || current === 'op2_mostrar';
  }
  if (branchNum === '3') {
    return current === 'op3_pedir' || current === 'op3_decision' || current === 'op3_si' || current === 'op3_actualizar' || current === 'op3_no';
  }
  if (branchNum === '4') {
    return current === 'op4_despedida' || current === 'fin';
  }
  return false;
}
