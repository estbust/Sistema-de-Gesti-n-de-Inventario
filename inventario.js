#!/usr/bin/env node
/**
 * ====================================================================
 * PROYECTO: Sistema de Gestión de Inventario (Node.js CLI)
 * Basado en Diagrama de Flujo de Algoritmos
 * ====================================================================
 * Simbología utilizada en el algoritmo:
 * - Óvalo: Inicio y Fin del algoritmo.
 * - Rectángulo: Procesos internos (Mostrar menú, guardar datos, actualizar total).
 * - Rombo: Decisiones y bifurcaciones (¿Qué opción eligió?, ¿Existe el producto?).
 * - Paralelogramo: Entradas y salidas de datos (pedir información, mostrar mensajes).
 * ====================================================================
 */

import * as readline from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';

// Estructura de datos en memoria para el inventario
export const inventario = [
  { nombre: 'Cuaderno Universitario', cantidad: 25, precio: 3.50 },
  { nombre: 'Bolígrafo Tinta Negra', cantidad: 50, precio: 0.85 },
  { nombre: 'Resma de Papel A4', cantidad: 12, precio: 4.20 }
];

const mostrarSeparador = () => console.log('='.repeat(60));

// [Rectángulo]: Mostrar Menú Principal
export const mostrarMenu = () => {
  mostrarSeparador();
  console.log('             SISTEMA DE GESTIÓN DE INVENTARIO              ');
  console.log('                (Algoritmo de Control)                     ');
  mostrarSeparador();
  console.log('  1. Agregar producto');
  console.log('  2. Ver inventario');
  console.log('  3. Actualizar inventario');
  console.log('  4. Salir');
  mostrarSeparador();
};

// [Opción 1]
// [Paralelogramo]: Pedir nombre, cantidad y precio
// [Rectángulo]: Guardar en el inventario
export const agregarProducto = async (rl) => {
  console.log('\n--- [OPCIÓN 1: AGREGAR PRODUCTO] ---');
  console.log('>> Entrada de datos:');

  const nombre = (await rl.question(' Ingrese el nombre del producto: ')).trim();
  if (!nombre) {
    console.log(' [!] El nombre no puede estar vacío.');
    return;
  }

  const existente = inventario.find(p => p.nombre.toLowerCase() === nombre.toLowerCase());
  if (existente) {
    console.log(` [!] El producto '${existente.nombre}' ya existe en el inventario con ${existente.cantidad} unidades.`);
    console.log('     Si desea modificar su stock, use la Opción 3 (Actualizar inventario).');
    return;
  }

  const cantidadStr = await rl.question(' Ingrese la cantidad (entero): ');
  const cantidad = parseInt(cantidadStr, 10);
  if (isNaN(cantidad) || cantidad < 0) {
    console.log(' [!] Error: Debe ingresar un número entero válido y no negativo para la cantidad.');
    return;
  }

  const precioStr = await rl.question(' Ingrese el precio unitario ($): ');
  const precio = parseFloat(precioStr);
  if (isNaN(precio) || precio <= 0) {
    console.log(' [!] Error: Debe ingresar un valor numérico mayor a 0 para el precio.');
    return;
  }

  // [Rectángulo]: Guardar en el inventario
  const nuevoProducto = {
    nombre,
    cantidad,
    precio: Number(precio.toFixed(2))
  };
  inventario.push(nuevoProducto);

  console.log('\n[+] [Rectángulo: Guardar en inventario] Éxito:');
  console.log(`    Producto '${nombre}' guardado exitosamente con ${cantidad} unidades a $${precio.toFixed(2)} c/u.`);
  console.log('    -> Regresando a Mostrar Menú Principal...');
};

// [Opción 2]
// [Rectángulo]: Leer lista de productos
// [Paralelogramo]: Mostrar productos en pantalla
export const verInventario = () => {
  console.log('\n--- [OPCIÓN 2: VER INVENTARIO] ---');
  // [Rectángulo]: Leer lista de productos
  const total = inventario.length;

  // [Paralelogramo]: Mostrar productos en pantalla
  if (total === 0) {
    console.log(' [i] El inventario está vacío. No hay productos registrados.');
  } else {
    console.log(` Total de productos registrados: ${total}`);
    console.log('-'.repeat(65));
    console.log(
      '#'.padEnd(4) +
      'Nombre del Producto'.padEnd(28) +
      'Cantidad'.padEnd(10) +
      'Precio U.'.padEnd(10) +
      'Subtotal'
    );
    console.log('-'.repeat(65));

    let granTotal = 0;
    let totalUnidades = 0;

    inventario.forEach((prod, index) => {
      const subtotal = prod.cantidad * prod.precio;
      granTotal += subtotal;
      totalUnidades += prod.cantidad;
      console.log(
        String(index + 1).padEnd(4) +
        prod.nombre.padEnd(28) +
        String(prod.cantidad).padEnd(10) +
        `$${prod.precio.toFixed(2)}`.padEnd(10) +
        `$${subtotal.toFixed(2)}`
      );
    });

    console.log('-'.repeat(65));
    console.log(` Resumen: ${totalUnidades} unidades totales en stock | Valor total: $${granTotal.toFixed(2)}`);
  }

  console.log('\n -> Regresando a Mostrar Menú Principal...');
};

// [Opción 3]
// [Paralelogramo]: Pedir nombre del producto
// [Rombo]: ¿Existe el producto?
//   Sí: [Paralelogramo] Pedir cantidad a sumar/restar -> [Rectángulo] Actualizar total
//   No: [Paralelogramo] Mostrar mensaje de error
export const actualizarInventario = async (rl) => {
  console.log('\n--- [OPCIÓN 3: ACTUALIZAR INVENTARIO] ---');
  // [Paralelogramo]: Pedir nombre del producto
  const nombreBuscado = (await rl.question(' Ingrese el nombre del producto a actualizar: ')).trim();

  // [Rombo]: ¿Existe el producto?
  const productoEncontrado = inventario.find(
    p => p.nombre.toLowerCase() === nombreBuscado.toLowerCase()
  );

  if (!productoEncontrado) {
    // [No]: [Paralelogramo] Mostrar mensaje de error
    console.log(`\n [❌ ERROR] El producto '${nombreBuscado}' NO existe en el inventario.`);
    console.log('    -> Regresando a Mostrar Menú Principal...');
    return;
  }

  // [Sí]: Existe el producto
  console.log(`\n [✓] Producto encontrado: '${productoEncontrado.nombre}'`);
  console.log(`     Stock actual: {productoEncontrado.cantidad} unidades`);
  console.log(`     Precio unitario: ${productoEncontrado.precio.toFixed(2)}`);

  console.log('\n Seleccione la operación:');
  console.log('   1. Sumar (aumentar inventario)');
  console.log('   2. Restar (disminuir inventario)');

  const opTipo = (await rl.question(' Elija una opción (1 o 2): ')).trim();
  if (opTipo !== '1' && opTipo !== '2') {
    console.log(' [!] Opción no válida.');
    console.log('    -> Regresando a Mostrar Menú Principal...');
    return;
  }

  const deltaStr = await rl.question(' Ingrese la cantidad a sumar/restar: ');
  const delta = parseInt(deltaStr, 10);
  if (isNaN(delta) || delta <= 0) {
    console.log(' [!] Error: Debe ingresar un número entero mayor que 0.');
    console.log('    -> Regresando a Mostrar Menú Principal...');
    return;
  }

  // [Rectángulo]: Actualizar total
  const stockAnterior = productoEncontrado.cantidad;
  if (opTipo === '1') {
    const nuevoTotal = stockAnterior + delta;
    productoEncontrado.cantidad = nuevoTotal;
    console.log(`\n [+] [Rectángulo: Actualizar total] Operación: Suma (+${delta})`);
    console.log(`     Stock previo: ${stockAnterior} -> Nuevo stock total: ${nuevoTotal}`);
  } else {
    if (delta > stockAnterior) {
      console.log(`\n [!] Advertencia: No es posible restar ${delta} unidades porque el stock actual es de solo ${stockAnterior}.`);
      const confirm = (await rl.question('     ¿Desea dejar el stock en 0? (s/n): ')).trim().toLowerCase();
      if (confirm === 's') {
        productoEncontrado.cantidad = 0;
        console.log('     Stock actualizado a 0 unidades.');
      } else {
        console.log('     Operación cancelada.');
        console.log('    -> Regresando a Mostrar Menú Principal...');
        return;
      }
    } else {
      const nuevoTotal = stockAnterior - delta;
      productoEncontrado.cantidad = nuevoTotal;
      console.log(`\n [-] [Rectángulo: Actualizar total] Operación: Resta (-${delta})`);
      console.log(`     Stock previo: ${stockAnterior} -> Nuevo stock total: ${nuevoTotal}`);
    }
  }

  console.log('    -> Regresando a Mostrar Menú Principal...');
};

// [Inicio (Óvalo)] -> Ciclo Principal
export async function main() {
  const rl = readline.createInterface({ input, output });

  console.log('\n' + '#'.repeat(60));
  console.log('       >>> [INICIO (ÓVALO)] DEL ALGORITMO DE INVENTARIO <<<');
  console.log('#'.repeat(60));

  let continuar = true;
  while (continuar) {
    // [Rectángulo]: Mostrar Menú Principal
    mostrarMenu();

    // [Rombo]: ¿Qué opción eligió?
    let opcion;
    try {
      opcion = (await rl.question(' Ingrese el número de su opción (1-4): ')).trim();
    } catch {
      break;
    }

    switch (opcion) {
      case '1':
        await agregarProducto(rl);
        break;
      case '2':
        verInventario();
        break;
      case '3':
        await actualizarInventario(rl);
        break;
      case '4': {
        // [Opción 4: Salir]
        // [Paralelogramo]: Mensaje de despedida
        console.log('\n' + '='.repeat(60));
        console.log(' [Paralelogramo: Mensaje de Despedida]');
        console.log(' ¡Muchas gracias por utilizar el Sistema de Gestión de Inventario!');
        console.log(' Esperamos que la gestión de sus productos haya sido exitosa.');
        console.log('='.repeat(60));

        // [Fin (Óvalo)]
        console.log('\n' + '#'.repeat(60));
        console.log('         >>> [FIN (ÓVALO)] DEL ALGORITMO <<<');
        console.log('#'.repeat(60) + '\n');
        continuar = false;
        break;
      }
      default:
        console.log(`\n [!] Opción '${opcion}' inválida. Por favor elija un número del 1 al 4.`);
        break;
    }
  }

  rl.close();
}

// Ejecutar si se invoca por CLI
if (process.argv[1]?.endsWith('inventario.js')) {
  main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}
