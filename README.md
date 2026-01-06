# 🛒 Apple Store Backend — MongoDB Edition

## 📌 Descripción General

Tienda de productos **Apple** construida con **Node.js**, **Express** y **MongoDB**, diseñada para administrar productos y carritos de compra con persistencia en base de datos NoSQL. Incluye vistas dinámicas con **Handlebars** y actualizaciones en tiempo real con **Socket.IO**.

---

## 🚀 Tecnologías Utilizadas

- **Node.js** – Ejecuta la lógica del servidor.
- **Express.js** – Manejo de rutas y middleware.
- **MongoDB** – Base de datos NoSQL escalable.
- **Mongoose** – ODM para modelado de datos.
- **Express-Handlebars** – Plantillas dinámicas en el servidor.
- **Socket.IO** – Comunicación en tiempo real.
- **Cors** – Permitir peticiones cross-origin.

---

## 📁 Estructura del Proyecto

```
server-backend/
├── data/
│   ├── products.json        # Datos de productos (legacy)
│   └── carts.json           # Datos de carritos (legacy)
├── public/
│   ├── js/
│   │   └── realTimeProd.js  # Script WebSocket del cliente
│   └── styles/
│       └── style.css         # Estilos CSS
├── scripts/
│   ├── seed.js              # Poblador de BD
│   └── verify-mongodb.js    # Verificación de conexión
├── src/
│   ├── app.js               # Configuración de Express
│   ├── config/
│   │   └── config.js        # Configuración de rutas
│   ├── models/
│   │   ├── Product.model.js # Schema Mongoose de productos
│   │   └── Cart.model.js    # Schema Mongoose de carritos
│   ├── managers/
│   │   ├── ProductManager.js # Lógica CRUD de productos
│   │   └── CartManager.js    # Lógica de carritos
│   ├── routes/
│   │   ├── index.js         # Enrutador principal
│   │   ├── products.routes.js # API REST de productos
│   │   ├── carts.routes.js   # API REST de carritos
│   │   └── views.routes.js   # Rutas de vistas (Handlebars)
│   └── views/
│       ├── layouts/
│       │   └── main.hbs      # Layout principal
│       ├── pages/
│       │   ├── products.hbs  # Catálogo
│       │   ├── productDetail.hbs # Detalle de producto
│       │   ├── cart.hbs      # Vista del carrito
│       │   └── realTimeProd.hbs # Productos tiempo real
│       └── partials/
│           ├── navbar.hbs    # Barra de navegación
│           ├── header.hbs    # Encabezado
│           └── footer.hbs    # Pie de página
├── .env                     # Variables de entorno
├── .gitignore               # Archivos ignorados
├── package.json             # Dependencias y scripts
├── index.js                 # Punto de entrada
└── README.md                # Documentación
```

---

## 🔧 Funcionalidades Principales

### 📦 Productos

El **ProductManager** implementa:

- **CRUD completo** de productos en MongoDB.
- **Paginación profesional** con metadatos (totalPages, prevPage, nextPage, links).
- **Filtrado por categoría** (case-insensitive).
- **Ordenamiento por precio** (ascendente/descendente).
- **Búsqueda por disponibilidad** (status=true).
- **Validación** de campos requeridos mediante Mongoose.
- **Manejo de errores** con mensajes descriptivos.

**Endpoints:**

```
GET    /api/products                              # Listar todos (paginado)
GET    /api/products/:pid                         # Obtener por ID
POST   /api/products                              # Crear producto
PUT    /api/products/:pid                         # Actualizar
DELETE /api/products/:pid                         # Eliminar
```

### 🛒 Carritos

El **CartManager** permite:

- **Crear carritos** nuevos sin productos.
- **Obtener carritos** con productos poblados (populate).
- **Añadir productos** a un carrito.
- **Actualizar cantidades** de productos.
- **Eliminar productos** del carrito.
- **Vaciar carritos** completamente.
- **Validación** de existencia de carritos y productos.

**Endpoints:**

```
POST   /api/carts                                 # Crear carrito
GET    /api/carts/:cid                            # Obtener carrito
POST   /api/carts/:cid/products/:pid              # Agregar producto
PUT    /api/carts/:cid/products/:pid              # Actualizar cantidad
DELETE /api/carts/:cid/products/:pid              # Eliminar producto
DELETE /api/carts/:cid                            # Vaciar carrito
PUT    /api/carts/:cid                            # Reemplazar productos
```

### 🌐 Vistas Dinámicas

- **`/products`** – Catálogo con paginación, filtros y ordenamiento.
- **`/products/:pid`** – Detalle completo del producto.
- **`/carts/:cid`** – Visualización del carrito con totales (subtotal, IVA, total).
- **`/realtimeproducts`** – Panel tiempo real con WebSocket.

### ⚡ Socket.IO en Tiempo Real

```javascript
socket.on("crearProducto", async (data) => { ... })  // Crear producto
socket.on("eliminarProducto", async (productId) => { ... }) // Eliminar
socket.on("updateProducts", (products) => { ... }) // Actualización broadcast
```

---

## 📊 Ejemplos de Respuesta

### ✅ Respuesta exitosa - Lista de productos paginada

```json
{
  "status": "success",
  "payload": [
    {
      "_id": "695be5daab0a8a65cdebc57c",
      "title": "iPhone 15 Pro",
      "description": "Smartphone Apple con chip A17 Pro",
      "price": 1499,
      "category": "celular",
      "stock": 15,
      "status": true
    }
  ],
  "totalPages": 2,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true
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

## 🚀 Instalación y Uso

### 1. Instalar Dependencias

```powershell
npm install
```

### 2. Configurar Variables de Entorno

Crear archivo `.env` en la raíz:

```env
MONGO_URL=mongodb+srv://usuario:contraseña@cluster.mongodb.net/ProductAppleDB
NODE_ENV=development
PORT=8080
```

**Opciones de conexión:**

- **MongoDB Local:** `mongodb://localhost:27017/ProductAppleDB`
- **MongoDB Atlas:** `mongodb+srv://user:pass@cluster.mongodb.net/ProductAppleDB`

### 3. Poblar Base de Datos

```powershell
node scripts/seed.js
```

Esto crea 5 productos de ejemplo y 1 carrito.

### 4. Verificar Conexión a MongoDB

```powershell
node scripts/verify-mongodb.js
```

### 5. Iniciar Servidor

```powershell
npm start
```

Accede a: **http://localhost:8080**

---

## ✅ Validaciones Incluidas

- Validación de campos obligatorios en modelos Mongoose.
- Verificación de existencia de productos antes de agregarlos.
- Verificación de existencia de carritos.
- Control de cantidades positivas.
- Conversión automática de types (String → Number).
- Mensajes de error descriptivos por validación.

---

## 📝 Notas Técnicas

- **Puerto por defecto:** 8080
- **Base de datos:** MongoDB (local o cloud).
- **ODM:** Mongoose v8.21.0
- **Estructura modular:** Rutas, managers, modelos y vistas separadas.
- **Métodos asíncronos:** Flujo no bloqueante con async/await.
- **CORS habilitado:** Permite peticiones desde cualquier origen.
- **Handlebars helpers:** Funciones personalizadas para templates.

---

## 📦 Estructura de Datos

### Product

```javascript
{
  _id: ObjectId,
  title: String (requerido),
  description: String,
  code: String (único, requerido),
  price: Number (requerido, >= 0),
  status: Boolean (default: true),
  stock: Number (requerido, >= 0),
  category: enum ["celular", "notebook", "smartwatch", "auriculares", "general"],
  thumbnails: [String],
  createdAt: Date,
  updatedAt: Date
}
```

### Cart

```javascript
{
  _id: ObjectId,
  products: [
    {
      product: ObjectId (referencia a Product),
      quantity: Number (default: 1)
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

---

## 🧪 Ejemplos de Uso

### Obtener productos con filtros

```bash
# Todos los productos (default: limit=10, page=1)
curl http://localhost:8080/api/products

# Celulares, página 2, ordenados por precio descendente
curl "http://localhost:8080/api/products?query=celular&page=2&sort=desc"

# Máximo 5 productos
curl "http://localhost:8080/api/products?limit=5"
```

### Crear carrito y agregar productos

```bash
# 1. Crear carrito
curl -X POST http://localhost:8080/api/carts

# Respuesta: { "status": "success", "payload": { "_id": "..." } }

# 2. Obtener ID del producto
curl http://localhost:8080/api/products

# 3. Agregar producto al carrito
curl -X POST http://localhost:8080/api/carts/{cartId}/products/{productId} \
  -H "Content-Type: application/json" \
  -d '{"quantity": 2}'

# 4. Ver carrito completo
curl http://localhost:8080/api/carts/{cartId}
```

### Actualizar cantidad en carrito

```bash
curl -X PUT http://localhost:8080/api/carts/{cartId}/products/{productId} \
  -H "Content-Type: application/json" \
  -d '{"quantity": 5}'
```

### Vaciar carrito

```bash
curl -X DELETE http://localhost:8080/api/carts/{cartId}
```

---

## 🔄 Cambios Principales desde Versión Anterior

### Eliminado

- Almacenamiento en JSON (`data/products.json`)
- Métodos `saveProducts()` de ProductManager
- IDs numéricos secuenciales

### Agregado

- Conexión MongoDB con Mongoose
- Validación de schema en BD
- Índices para optimizar queries
- Método `populate()` para relaciones entre colecciones
- Validación ObjectId en todas las rutas
- Respuestas profesionales con status y metadata

### Modificado

- `ProductManager.getProducts()` ahora retorna objeto con paginación
- `CartManager` completamente reescrito para MongoDB
- Rutas API ahora validan ObjectId
- WebSocket en `index.js` usa métodos de MongoDB

---

## 🐛 Troubleshooting

### "connect ECONNREFUSED" - MongoDB no está conectado

```powershell
# Verificar si MongoDB está corriendo
Get-Process mongod

# Si no está, iniciar MongoDB
# Windows: mongod desde cmd/powershell
# Docker: docker start mongodb
```

### "MongoNetworkError" - URL de conexión inválida

```env
# Verificar formato en .env
MONGO_URL=mongodb://localhost:27017/ProductAppleDB
```

### "Carrito no encontrado" - ID inválido

```bash
# Asegurarse de usar ObjectId válido (24 caracteres hex)
curl http://localhost:8080/api/carts/507f1f77bcf86cd799439011
```

### Los productos no se ven en el frontend

```powershell
# 1. Verificar que los datos están en MongoDB
node scripts/verify-mongodb.js

# 2. Poblar la BD si está vacía
node scripts/seed.js

# 3. Reiniciar el servidor
npm start

# 4. Limpiar caché del navegador: Ctrl+Shift+R
```

---

## 📞 Soporte

Para reportar bugs o sugerencias:

1. Revisar logs en consola
2. Verificar variables de entorno en `.env`
3. Confirmar conexión a MongoDB: `mongosh` o `mongo`
4. Revisar estructura de payload enviado vs schema esperado

---

**Versión:** 2.0.0 (MongoDB Edition)  
**Última actualización:** Enero 2026  
**Estado:** Producción ✅
