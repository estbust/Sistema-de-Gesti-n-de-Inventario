#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
====================================================================
PROYECTO: Sistema de Gestión de Inventario
Basado en Diagrama de Flujo de Algoritmos
====================================================================
Simbología utilizada en el algoritmo:
- Óvalo: Inicio y Fin del algoritmo.
- Rectángulo: Procesos internos (Mostrar menú, guardar datos, actualizar total).
- Rombo: Decisiones y bifurcaciones (¿Qué opción eligió?, ¿Existe el producto?).
- Paralelogramo: Entradas y salidas de datos (pedir información, mostrar mensajes).
====================================================================
"""

import sys

# Estructura de datos para almacenar el inventario
# Lista de diccionarios con claves: 'nombre', 'cantidad', 'precio'
inventario = [
    {"nombre": "Cuaderno Universitario", "cantidad": 25, "precio": 3.50},
    {"nombre": "Bolígrafo Tinta Negra", "cantidad": 50, "precio": 0.85},
    {"nombre": "Resma de Papel A4", "cantidad": 12, "precio": 4.20}
]

def mostrar_separador():
    print("=" * 60)

# [Rectángulo]: Mostrar Menú Principal
def mostrar_menu():
    mostrar_separador()
    print("             SISTEMA DE GESTIÓN DE INVENTARIO              ")
    print("                (Algoritmo de Control)                     ")
    mostrar_separador()
    print("  1. Agregar producto")
    print("  2. Ver inventario")
    print("  3. Actualizar inventario")
    print("  4. Salir")
    mostrar_separador()

# [Opción 1]
# [Paralelogramo]: Pedir nombre, cantidad y precio
# [Rectángulo]: Guardar en el inventario
def agregar_producto():
    print("\n--- [OPCIÓN 1: AGREGAR PRODUCTO] ---")
    print(">> Entrada de datos:")
    
    nombre = input(" Ingrese el nombre del producto: ").strip()
    if not nombre:
        print(" [!] El nombre no puede estar vacío.")
        return

    # Verificar si ya existe para evitar duplicados accidentales
    producto_existente = next((p for p in inventario if p["nombre"].lower() == nombre.lower()), None)
    if producto_existente:
        print(f" [!] El producto '{producto_existente['nombre']}' ya existe en el inventario con {producto_existente['cantidad']} unidades.")
        print("     Si desea modificar su stock, use la Opción 3 (Actualizar inventario).")
        return

    try:
        cantidad = int(input(" Ingrese la cantidad (entero): "))
        if cantidad < 0:
            print(" [!] La cantidad no puede ser negativa.")
            return
    except ValueError:
        print(" [!] Error: Debe ingresar un número entero válido para la cantidad.")
        return

    try:
        precio = float(input(" Ingrese el precio unitario ($): "))
        if precio <= 0:
            print(" [!] El precio debe ser mayor a 0.")
            return
    except ValueError:
        print(" [!] Error: Debe ingresar un valor numérico para el precio.")
        return

    # [Rectángulo]: Guardar en el inventario
    nuevo_producto = {
        "nombre": nombre,
        "cantidad": cantidad,
        "precio": round(precio, 2)
    }
    inventario.append(nuevo_producto)
    
    print("\n[+] [Rectángulo: Guardar en inventario] Éxito:")
    print(f"    Producto '{nombre}' guardado exitosamente con {cantidad} unidades a ${precio:.2f} c/u.")
    print("    -> Regresando a Mostrar Menú Principal...")

# [Opción 2]
# [Rectángulo]: Leer lista de productos
# [Paralelogramo]: Mostrar productos en pantalla
def ver_inventario():
    print("\n--- [OPCIÓN 2: VER INVENTARIO] ---")
    # [Rectángulo]: Leer lista de productos
    total_productos = len(inventario)
    
    # [Paralelogramo]: Mostrar productos en pantalla
    if total_productos == 0:
        print(" [i] El inventario está vacío. No hay productos registrados.")
    else:
        print(f" Total de productos registrados: {total_productos}")
        print("-" * 65)
        print(f"{'#':<4} {'Nombre del Producto':<28} {'Cantidad':<10} {'Precio U.':<10} {'Subtotal':<10}")
        print("-" * 65)
        
        gran_total = 0.0
        total_unidades = 0
        for i, prod in enumerate(inventario, start=1):
            subtotal = prod["cantidad"] * prod["precio"]
            gran_total += subtotal
            total_unidades += prod["cantidad"]
            print(f"{i:<4} {prod['nombre']:<28} {prod['cantidad']:<10} ${prod['precio']:<9.2f} ${subtotal:<9.2f}")
        
        print("-" * 65)
        print(f" Resumen: {total_unidades} unidades totales en stock | Valor total: ${gran_total:.2f}")
        
    print("\n -> Regresando a Mostrar Menú Principal...")

# [Opción 3]
# [Paralelogramo]: Pedir nombre del producto
# [Rombo]: ¿Existe el producto?
#   Sí: [Paralelogramo] Pedir cantidad a sumar/restar -> [Rectángulo] Actualizar total
#   No: [Paralelogramo] Mostrar mensaje de error
def actualizar_inventario():
    print("\n--- [OPCIÓN 3: ACTUALIZAR INVENTARIO] ---")
    # [Paralelogramo]: Pedir nombre del producto
    nombre_buscado = input(" Ingrese el nombre del producto a actualizar: ").strip()
    
    # [Rombo]: ¿Existe el producto?
    producto_encontrado = None
    for p in inventario:
        if p["nombre"].lower() == nombre_buscado.lower():
            producto_encontrado = p
            break
            
    if producto_encontrado is None:
        # [No]: [Paralelogramo] Mostrar mensaje de error
        print(f"\n [❌ ERROR] El producto '{nombre_buscado}' NO existe en el inventario.")
        print("    -> Regresando a Mostrar Menú Principal...")
        return

    # [Sí]: Existe el producto
    print(f"\n [✓] Producto encontrado: '{producto_encontrado['nombre']}'")
    print(f"     Stock actual: {producto_encontrado['cantidad']} unidades")
    print(f"     Precio unitario: ${producto_encontrado['precio']:.2f}")
    
    print("\n Seleccione la operación:")
    print("   1. Sumar (aumentar inventario)")
    print("   2. Restar (disminuir inventario)")
    
    op_tipo = input(" Elija una opción (1 o 2): ").strip()
    if op_tipo not in ["1", "2"]:
        print(" [!] Opción no válida.")
        print("    -> Regresando a Mostrar Menú Principal...")
        return

    try:
        delta = int(input(" Ingrese la cantidad a sumar/restar: "))
        if delta <= 0:
            print(" [!] La cantidad debe ser un número entero mayor que 0.")
            print("    -> Regresando a Mostrar Menú Principal...")
            return
    except ValueError:
        print(" [!] Error: Debe ingresar un número entero válido.")
        print("    -> Regresando a Mostrar Menú Principal...")
        return

    # [Rectángulo]: Actualizar total
    stock_anterior = producto_encontrado["cantidad"]
    if op_tipo == "1":
        nuevo_total = stock_anterior + delta
        producto_encontrado["cantidad"] = nuevo_total
        print(f"\n [+] [Rectángulo: Actualizar total] Operación: Suma (+{delta})")
        print(f"     Stock previo: {stock_anterior} -> Nuevo stock total: {nuevo_total}")
    else:
        if delta > stock_anterior:
            print(f"\n [!] Advertencia: No es posible restar {delta} unidades porque el stock actual es de sólo {stock_anterior}.")
            print("     ¿Desea dejar el stock en 0? (s/n): ", end="")
            confirm = input().strip().lower()
            if confirm == "s":
                producto_encontrado["cantidad"] = 0
                print(f"     Stock actualizado a 0 unidades.")
            else:
                print("     Operación cancelada.")
                print("    -> Regresando a Mostrar Menú Principal...")
                return
        else:
            nuevo_total = stock_anterior - delta
            producto_encontrado["cantidad"] = nuevo_total
            print(f"\n [-] [Rectángulo: Actualizar total] Operación: Resta (-{delta})")
            print(f"     Stock previo: {stock_anterior} -> Nuevo stock total: {nuevo_total}")

    print("    -> Regresando a Mostrar Menú Principal...")

# [Inicio (Óvalo)] -> Ciclo Principal
def main():
    print("\n" + "#" * 60)
    print("       >>> [INICIO (ÓVALO)] DEL ALGORITMO DE INVENTARIO <<<")
    print("#" * 60)
    
    while True:
        # [Rectángulo]: Mostrar Menú Principal
        mostrar_menu()
        
        # [Rombo]: ¿Qué opción eligió?
        opcion = input(" Ingrese el número de su opción (1-4): ").strip()
        
        if opcion == "1":
            agregar_producto()
        elif opcion == "2":
            ver_inventario()
        elif opcion == "3":
            actualizar_inventario()
        elif opcion == "4":
            # [Opción 4: Salir]
            # [Paralelogramo]: Mensaje de despedida
            print("\n" + "=" * 60)
            print(" [Paralelogramo: Mensaje de Despedida]")
            print(" ¡Muchas gracias por utilizar el Sistema de Gestión de Inventario!")
            print(" Esperamos que la gestión de sus productos haya sido exitosa.")
            print("=" * 60)
            
            # [Fin (Óvalo)]
            print("\n" + "#" * 60)
            print("         >>> [FIN (ÓVALO)] DEL ALGORITMO <<<")
            print("#" * 60 + "\n")
            break
        else:
            print(f"\n [!] Opción '{opcion}' inválida. Por favor elija un número del 1 al 4.")

if __name__ == "__main__":
    try:
        main()
    except (KeyboardInterrupt, EOFError):
        print("\n\n [!] Ejecución interrumpida por el usuario. Fin del programa.")
        sys.exit(0)
