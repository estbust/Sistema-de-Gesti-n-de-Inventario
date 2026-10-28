/**
 * main.js
 * Punto de entrada principal de la aplicación web.
 * Orquesta la navegación de pestañas, el cambio de tema,
 * la persistencia y la sincronización reactiva con el store.
 */

import './style.css';
import { store } from './data/inventoryStore.js';
import { renderInteractiveApp } from './components/interactiveApp.js';
import { renderFlowchart } from './components/flowchart.js';
import { renderTerminalSimulator } from './components/terminalSimulator.js';
import { renderAlgorithmDoc } from './components/algorithmDoc.js';

const app = document.querySelector('#app');

// Inicializar tema guardado
if (store.darkMode) {
  document.documentElement.classList.add('dark');
} else {
  document.documentElement.classList.remove('dark');
}

function renderShell() {
  app.innerHTML = `
    <div class="site-wrapper">
      <!-- Encabezado Principal -->
      <header class="site-header">
        <div class="brand-container">
          <div class="brand-icon">📦</div>
          <div>
            <h1 class="brand-title">Sistema de Gestión de Inventario</h1>
            <p class="brand-subtitle">Algoritmo de Control con Diagrama de Flujo Interactivo</p>
          </div>
        </div>

        <div class="header-controls">
          <button class="btn btn-secondary btn-sm" id="btn-theme-toggle" title="Cambiar tema">
            ${store.darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro'}
          </button>
        </div>
      </header>

      <!-- Pestañas de Navegación -->
      <nav class="tabs-navigation" role="tablist">
        <button class="tab-btn ${store.activeTab === 'app' ? 'active' : ''}" data-tab="app">
          <span>🖥️</span> Aplicación Interactiva
        </button>
        <button class="tab-btn ${store.activeTab === 'flowchart' ? 'active' : ''}" data-tab="flowchart">
          <span>📊</span> Diagrama de Flujo en Vivo
        </button>
        <button class="tab-btn ${store.activeTab === 'terminal' ? 'active' : ''}" data-tab="terminal">
          <span>💻</span> Simulador Consola CLI
        </button>
        <button class="tab-btn ${store.activeTab === 'docs' ? 'active' : ''}" data-tab="docs">
          <span>📖</span> Teoría & Pseudocódigo
        </button>
      </nav>

      <!-- Contenedor Principal de la Pestaña Activa -->
      <main id="tab-content-container"></main>
    </div>
  `;

  // Attach event handlers para tabs y controles
  const themeBtn = app.querySelector('#btn-theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      store.toggleDarkMode();
    });
  }

  const tabButtons = app.querySelectorAll('.tab-btn');
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.dataset.tab;
      store.setActiveTab(targetTab);
    });
  });

  renderActiveTabContent();
}

function renderActiveTabContent() {
  const container = document.querySelector('#tab-content-container');
  if (!container) return;

  // Actualizar clase activa en pestañas
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.tab === store.activeTab);
  });

  switch (store.activeTab) {
    case 'app':
      renderInteractiveApp(container);
      break;
    case 'flowchart':
      renderFlowchart(container);
      break;
    case 'terminal':
      renderTerminalSimulator(container);
      break;
    case 'docs':
      renderAlgorithmDoc(container);
      break;
    default:
      renderInteractiveApp(container);
      break;
  }
}

// Suscribirse a cambios en el store
store.subscribe(() => {
  // Si cambia el tema, actualizar texto del botón
  const themeBtn = document.querySelector('#btn-theme-toggle');
  if (themeBtn) {
    themeBtn.innerHTML = store.darkMode ? '☀️ Modo Claro' : '🌙 Modo Oscuro';
  }

  renderActiveTabContent();
});

// Atajo de teclado: Si está en Menú y presiona 1, 2, 3, o 4
window.addEventListener('keydown', (e) => {
  // Ignorar si el usuario está escribiendo en un input o textarea
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;

  if (store.activeTab === 'app' && store.currentView === 'menu') {
    if (e.key === '1') store.setCurrentView('add');
    if (e.key === '2') store.setCurrentView('view');
    if (e.key === '3') store.setCurrentView('update');
    if (e.key === '4') store.setCurrentView('exit');
  }
});

// Render inicial
renderShell();
