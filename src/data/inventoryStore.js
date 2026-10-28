/**
 * inventoryStore.js
 * Almacenamiento reactivo del inventario con persistencia en localStorage
 * y seguimiento del estado del algoritmo (nodo activo del diagrama de flujo).
 */

const STORAGE_KEY = 'algoritmo_gestion_inventario_v1';

// Productos iniciales por defecto para pruebas y demostración didáctica
const DEFAULT_PRODUCTS = [
  { id: '1', nombre: 'Cuaderno Universitario', cantidad: 25, precio: 3.50, fecha: new Date().toISOString() },
  { id: '2', nombre: 'Bolígrafo Tinta Negra', cantidad: 50, precio: 0.85, fecha: new Date().toISOString() },
  { id: '3', nombre: 'Resma de Papel A4', cantidad: 12, precio: 4.20, fecha: new Date().toISOString() }
];

class InventoryStore {
  constructor() {
    this.products = this.loadProducts();
    // Nodo activo en el diagrama de flujo
    // Posibles: 'inicio', 'menu', 'decision', 'op1_pedir', 'op1_guardar',
    // 'op2_leer', 'op2_mostrar', 'op3_pedir', 'op3_decision', 'op3_si', 'op3_actualizar', 'op3_no', 'op4_despedida', 'fin'
    this.activeNode = 'menu';
    this.currentView = 'menu'; // 'menu', 'add', 'view', 'update', 'exit'
    this.activeTab = 'app'; // 'app', 'flowchart', 'terminal', 'docs'
    this.darkMode = localStorage.getItem('theme_mode') === 'dark';
    this.logs = [
      { timestamp: new Date().toLocaleTimeString(), text: 'Algoritmo iniciado. Mostrando Menú Principal.' }
    ];
    this.listeners = new Set();
  }

  loadProducts() {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (data) {
        const parsed = JSON.parse(data);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.warn('Error al cargar inventario de localStorage:', e);
    }
    return JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
  }

  saveProducts() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.products));
    } catch (e) {
      console.error('Error al guardar inventario:', e);
    }
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    this.listeners.forEach(fn => fn(this));
  }

  setActiveTab(tab) {
    this.activeTab = tab;
    this.notify();
  }

  setActiveNode(nodeId, logMessage = null) {
    this.activeNode = nodeId;
    if (logMessage) {
      this.logs.unshift({
        timestamp: new Date().toLocaleTimeString(),
        text: logMessage,
        nodeId
      });
      if (this.logs.length > 30) this.logs.pop();
    }
    this.notify();
  }

  setCurrentView(view) {
    this.currentView = view;
    // Sincronizar automáticamente con el nodo del diagrama de flujo
    switch (view) {
      case 'menu':
        this.setActiveNode('menu', 'Navegando a: Mostrar Menú Principal (Rectángulo)');
        break;
      case 'add':
        this.setActiveNode('op1_pedir', 'Opción 1 elegida: Pedir nombre, cantidad y precio (Paralelogramo)');
        break;
      case 'view':
        this.setActiveNode('op2_leer', 'Opción 2 elegida: Leer lista de productos (Rectángulo)');
        break;
      case 'update':
        this.setActiveNode('op3_pedir', 'Opción 3 elegida: Pedir nombre del producto (Paralelogramo)');
        break;
      case 'exit':
        this.setActiveNode('op4_despedida', 'Opción 4 elegida: Mensaje de despedida (Paralelogramo)');
        break;
      default:
        this.setActiveNode('menu');
        break;
    }
    this.notify();
  }

  toggleDarkMode() {
    this.darkMode = !this.darkMode;
    localStorage.setItem('theme_mode', this.darkMode ? 'dark' : 'light');
    if (this.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    this.notify();
  }

  /**
   * Opción 1: Agregar producto
   * Guarda en el inventario y actualiza el estado del algoritmo
   */
  addProduct(nombre, cantidad, precio) {
    const trimmed = nombre.trim();
    if (!trimmed) {
      return { success: false, message: 'El nombre del producto no puede estar vacío.' };
    }

    const existe = this.products.find(p => p.nombre.toLowerCase() === trimmed.toLowerCase());
    if (existe) {
      return {
        success: false,
        message: `El producto "${existe.nombre}" ya existe con ${existe.cantidad} unidades. Use "Actualizar inventario" para modificar su stock.`
      };
    }

    const cantNum = parseInt(cantidad, 10);
    if (isNaN(cantNum) || cantNum < 0) {
      return { success: false, message: 'La cantidad debe ser un número entero mayor o igual a 0.' };
    }

    const precNum = parseFloat(precio);
    if (isNaN(precNum) || precNum <= 0) {
      return { success: false, message: 'El precio debe ser un número mayor a 0.' };
    }

    // Paso: Guardar en el inventario (Rectángulo)
    this.setActiveNode('op1_guardar', `[Rectángulo] Guardando en inventario: "${trimmed}"`);

    const newProd = {
      id: Date.now().toString(),
      nombre: trimmed,
      cantidad: cantNum,
      precio: Number(precNum.toFixed(2)),
      fecha: new Date().toISOString()
    };

    this.products.push(newProd);
    this.saveProducts();

    return {
      success: true,
      product: newProd,
      message: `¡Producto "${trimmed}" guardado exitosamente con ${cantNum} unidades a $${precNum.toFixed(2)}!`
    };
  }

  /**
   * Opción 2: Leer y ver lista de productos
   */
  getProducts() {
    return [...this.products];
  }

  getMetrics() {
    const totalItems = this.products.length;
    const totalUnits = this.products.reduce((acc, p) => acc + p.cantidad, 0);
    const totalValue = this.products.reduce((acc, p) => acc + (p.cantidad * p.precio), 0);
    const lowStockCount = this.products.filter(p => p.cantidad > 0 && p.cantidad <= 5).length;
    const outOfStockCount = this.products.filter(p => p.cantidad === 0).length;

    return {
      totalItems,
      totalUnits,
      totalValue: Number(totalValue.toFixed(2)),
      lowStockCount,
      outOfStockCount
    };
  }

  /**
   * Opción 3: Actualizar inventario
   * 1. Pedir nombre
   * 2. Rombo: ¿Existe el producto?
   *    - Sí: Sumar/restar -> Actualizar total (Rectángulo)
   *    - No: Mensaje de error (Paralelogramo)
   */
  findProductByName(nombre) {
    const query = nombre.trim().toLowerCase();
    if (!query) return null;
    return this.products.find(p => p.nombre.toLowerCase() === query) || null;
  }

  updateStock(nombre, delta, operacion = 'sumar') {
    const product = this.findProductByName(nombre);
    
    // Rombo: ¿Existe el producto?
    if (!product) {
      // Rama NO: Mensaje de error (Paralelogramo)
      this.setActiveNode('op3_no', `[Rombo: NO] Error: El producto "${nombre}" NO existe en el inventario.`);
      return {
        success: false,
        exists: false,
        message: `El producto "${nombre}" no existe en el inventario.`
      };
    }

    const deltaNum = parseInt(delta, 10);
    if (isNaN(deltaNum) || deltaNum <= 0) {
      return {
        success: false,
        exists: true,
        message: 'Debe ingresar un valor numérico entero mayor a 0 para modificar la cantidad.'
      };
    }

    const stockAnterior = product.cantidad;
    let nuevoTotal = stockAnterior;

    if (operacion === 'sumar') {
      nuevoTotal = stockAnterior + deltaNum;
    } else if (operacion === 'restar') {
      if (deltaNum > stockAnterior) {
        return {
          success: false,
          exists: true,
          excessive: true,
          currentStock: stockAnterior,
          message: `No se pueden restar ${deltaNum} unidades porque el stock actual es de sólo ${stockAnterior} unidades.`
        };
      }
      nuevoTotal = stockAnterior - deltaNum;
    }

    // Paso: Actualizar total (Rectángulo)
    this.setActiveNode(
      'op3_actualizar',
      `[Rectángulo: Actualizar total] "${product.nombre}": ${stockAnterior} ${operacion === 'sumar' ? '+' : '-'} ${deltaNum} = ${nuevoTotal}`
    );

    product.cantidad = nuevoTotal;
    product.fecha = new Date().toISOString();
    this.saveProducts();

    return {
      success: true,
      exists: true,
      product,
      stockAnterior,
      nuevoTotal,
      operacion,
      message: `Stock de "${product.nombre}" actualizado correctamente: ${stockAnterior} ➔ ${nuevoTotal} unidades.`
    };
  }

  deleteProduct(id) {
    const idx = this.products.findIndex(p => p.id === id);
    if (idx !== -1) {
      const deleted = this.products.splice(idx, 1)[0];
      this.saveProducts();
      this.notify();
      return deleted;
    }
    return null;
  }

  resetToDefault() {
    this.products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    this.saveProducts();
    this.setCurrentView('menu');
    this.notify();
  }
}

export const store = new InventoryStore();
