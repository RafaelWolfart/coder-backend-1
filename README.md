# 🛒 API de Productos y Carritos — Entrega Nº1

## 📌 Descripción General

Este proyecto implementa una **API REST** construida con **Node.js** y **Express**, diseñada para administrar productos y carritos de compra. La información se almacena utilizando archivos JSON mediante un sistema de persistencia simple y totalmente modularizado.

---

## 🚀 Tecnologías Utilizadas

- **Node.js** – Ejecuta la lógica del servidor.
- **Express.js** – Manejo de rutas y middleware de forma simple y eficaz.
- **File System (fs)** – Persistencia en archivos locales JSON.
- **JavaScript (ES6+)** – Código moderno y organizado.

---

## 📁 Estructura del Proyecto

```
ENTREGA/
├── data/
│   ├── products.json        # Almacenamiento de productos
│   └── carts.json           # Almacenamiento de carritos
├── src/
│   ├── index.js             # Punto de entrada del servidor
│   ├── app.js               # Configuración de Express
│   ├── routes/
│   │   ├── products.router.js  # Rutas de productos
│   │   └── carts.router.js     # Rutas de carritos
│   ├── managers/
│   │   ├── ProductManager.js   # Lógica CRUD de productos
│   │   └── CartManager.js      # Lógica de carritos
│   └── utils/
│       └── fileUtils.js        # Funciones para leer y escribir JSON
├── package.json             # Dependencias y scripts
└── README.md                # Documentación del proyecto
```

Servidor disponible en: **http://localhost:8080**

---

## 🔧 Funcionalidades Principales

### 🧩 Products

El **ProductManager** implementa:

- Creación de productos con **IDs autogenerados incrementales**.
- Listado completo de productos.
- Búsqueda por ID.
- Actualización parcial sin sobrescribir ni eliminar el ID.
- Eliminación definitiva del item.
- Validación básica de campos requeridos.
- Persistencia en `products.json`.

### 🛒 Carts

El **CartManager** permite:

- Crear carritos nuevos.
- Obtener el contenido de un carrito por ID.
- Añadir productos a un carrito.
- Incrementar automáticamente la cantidad cuando el producto ya está presente.
- Validar que el producto exista antes de agregarlo.
- Persistencia en `carts.json`.

---

## 📘 Ejemplos de Respuesta

### ✅ Respuesta exitosa

```json
{
  "status": "success",
  "data": {}
}
```

### ❌ Respuesta con error

```json
{
  "status": "error",
  "message": "Descripción del error"
}
```

---

## ✅ Validaciones Incluidas

- Revisión de campos obligatorios en creación de productos.
- Imposibilidad de sobrescribir el ID al actualizar.
- Validación de existencia de productos antes de agregarlos a un carrito.
- Validación de existencia de carritos antes de operar sobre ellos.
- Incremento automático de cantidades en carritos.

---

## 📝 Notas Técnicas

- **Puerto por defecto:** 8080
- **Persistencia:** Archivos JSON dentro de `/data/`
- **Estructura modular:** Rutas, managers y utilidades separadas.
- **Métodos asíncronos:** Garantiza un flujo no bloqueante.

---
