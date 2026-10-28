# 📦 Sistema de Gestión de Inventario (Algoritmo y Diagrama de Flujo)

Proyecto desarrollado para la gestión de productos e inventario, implementando fielmente el diseño de algoritmos estructurados con su respectivo **diagrama de flujo interactivo**, **aplicación web moderna** y **scripts de consola para terminal (Python y Node.js)**.

---

## 🧭 Correspondencia del Algoritmo y Diagrama de Flujo

El sistema sigue la simbología estándar internacional de diagramas de flujo (ISO/ANSI):

| Forma Geométrica | Tipo de Bloque | Función en el Algoritmo |
| :--- | :--- | :--- |
| **🟢 Óvalo** | **Terminal** | **Inicio** y **Fin** del algoritmo. |
| **🟦 Rectángulo** | **Proceso** | Operaciones internas: *Mostrar Menú Principal*, *Guardar en el inventario*, *Leer lista de productos*, *Actualizar total*. |
| **🔶 Rombo** | **Decisión** | Bifurcaciones lógicas: *¿Qué opción eligió?* (1, 2, 3 o 4) y *¿Existe el producto?* (Sí o No). |
| **🟪 Paralelogramo** | **Entrada / Salida (I/O)** | Captura de datos del usuario o despliegue en pantalla: *Pedir nombre/cantidad/precio*, *Mostrar productos en pantalla*, *Pedir nombre del producto*, *Pedir cantidad a sumar/restar*, *Mostrar mensaje de error*, *Mensaje de despedida*. |

---

## 📋 Estructura de Opciones del Algoritmo

### 1. Inicio (Óvalo)
Punto de arranque del algoritmo.

### 2. Mostrar Menú Principal (Rectángulo)
Despliega las 4 alternativas del sistema.

### 3. Decisión: ¿Qué opción eligió? (Rombo)

- **Opción 1: Agregar producto**
  1. *Pedir nombre, cantidad y precio* (**Paralelogramo / Entrada**).
  2. *Guardar en el inventario* (**Rectángulo / Proceso**).
  3. Flecha de regreso a *Mostrar Menú Principal*.

- **Opción 2: Ver inventario**
  1. *Leer lista de productos* (**Rectángulo / Proceso**).
  2. *Mostrar productos en pantalla* (**Paralelogramo / Salida**).
  3. Flecha de regreso a *Mostrar Menú Principal*.

- **Opción 3: Actualizar inventario**
  1. *Pedir nombre del producto* (**Paralelogramo / Entrada**).
  2. *¿Existe el producto?* (**Rombo / Decisión**):
     - **Sí**: *Pedir cantidad a sumar/restar* (**Paralelogramo**) ➔ *Actualizar total* (**Rectángulo**).
     - **No**: *Mostrar mensaje de error* (**Paralelogramo / Salida**).
  3. Flecha de regreso a *Mostrar Menú Principal*.

- **Opción 4: Salir**
  1. *Mensaje de despedida* (**Paralelogramo / Salida**).
  2. **Fin** (**Óvalo**).

---

## 🚀 Formas de Ejecución

### 1. Aplicación Web Interactiva (Vite)
Incluye la interfaz visual completa, diagrama SVG interactivo con animación del nodo activo en tiempo real, simulador de terminal y documentación:

```bash
# Iniciar servidor de desarrollo
pnpm dev
# o con npm:
# npm run dev
```
Luego abrir la URL local indicada (ej. `http://localhost:5173`).

---

### 2. Script de Consola en Python (`inventario.py`)
Script modular en Python 3 para ejecutar en cualquier terminal:

```bash
python3 inventario.py
```

---

### 3. Script de Consola en Node.js (`inventario.js`)
Script en JavaScript utilizando el módulo estándar `readline`:

```bash
node inventario.js
# o mediante script npm:
# pnpm start:cli
```

---

## 📂 Estructura del Código

```
algoritmo-gestion/
├── index.html                 # Página principal de la aplicación web
├── package.json               # Configuración y dependencias (Vite)
├── inventario.py              # Implementación ejecutable en Python 3 CLI
├── inventario.js              # Implementación ejecutable en Node.js CLI
├── README.md                  # Documentación del proyecto
└── src/
    ├── main.js                # Orquestador principal y navegación por pestañas
    ├── style.css              # Estilos CSS, variables de diseño y modo oscuro
    ├── data/
    │   └── inventoryStore.js  # Almacén reactivo con persistencia y nodo activo
    └── components/
        ├── interactiveApp.js  # Vistas de la aplicación (Menú, Agregar, Ver, Actualizar, Salir)
        ├── flowchart.js       # Diagrama de flujo SVG interactivo con formas geométricas exactas
        ├── terminalSimulator.js # Simulador de terminal integrado en el navegador
        └── algorithmDoc.js    # Documentación pedagógica y pseudocódigo
```

---

## ✨ Características Destacadas
- **Fidelidad al Diagrama de Flujo**: Cada pantalla y acción se vincula con su forma geométrica correspondiente.
- **Diagrama en Vivo**: El nodo actualmente en ejecución se ilumina con animación de pulso y resplandor.
- **Validaciones Rigurosas**: Previene nombres vacíos, productos duplicados accidentales, cantidades y precios negativos o restas que excedan el stock disponible.
- **Persistencia de Datos**: Almacenamiento local automático en el navegador (`localStorage`).
- **Modo Oscuro / Claro**: Paleta accesible y agradable para cualquier entorno.
