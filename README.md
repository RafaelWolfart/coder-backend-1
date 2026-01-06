# Apple Store Backend - MongoDB Edition

## Migración a MongoDB Completada

Este proyecto ha sido actualizado de almacenamiento JSON a **MongoDB** con Mongoose, manteniendo toda la funcionalidad existente.

---

## Características Principales

### API REST con Paginación Profesional

```
GET /api/products?limit=10&page=1&sort=asc&query=celular
```

Respuesta:

```json
{
  "status": "success",
  "payload": [...],
  "totalPages": 2,
  "prevPage": null,
  "nextPage": 2,
  "page": 1,
  "hasPrevPage": false,
  "hasNextPage": true,
  "prevLink": null,
  "nextLink": "/api/products?limit=10&page=2&sort=asc&query=celular"
}
```

### Gestión de Carritos

- `POST /api/carts` - Crear carrito
- `GET /api/carts/:cid` - Obtener carrito con productos poblados
- `POST /api/carts/:cid/products/:pid` - Agregar producto
- `PUT /api/carts/:cid/products/:pid` - Actualizar cantidad
- `DELETE /api/carts/:cid/products/:pid` - Eliminar producto
- `DELETE /api/carts/:cid` - Vaciar carrito
- `PUT /api/carts/:cid` - Reemplazar productos

### Vistas Modernas con Handlebars

- `/products` - Catálogo con paginación, filtros y ordenamiento
- `/products/:pid` - Detalle del producto
- `/carts/:cid` - Visualización del carrito con totales
- `/realtimeproducts` - Productos en tiempo real (WebSocket)

### Socket.IO para Actualizaciones en Tiempo Real

```javascript
socket.on("crearProducto", async (data) => { ... })
socket.on("eliminarProducto", async (productId) => { ... })
socket.on("updateProducts", (products) => { ... })
```

---

## Instalación y Configuración

### Instalar Dependencias

```powershell
npm install
```

**Nuevas dependencias añadidas:**

- `mongoose@^8.0.0` - ODM para MongoDB
- `dotenv@^16.3.1` - Gestión de variables de entorno

### Configurar Variables de Entorno

Crear archivo `.env` en la raíz del proyecto:

```env
MONGODB_URL=mongodb://localhost:27017/apple_store
NODE_ENV=development
PORT=8080
```

**Opciones de MongoDB:**

- **Local:** `mongodb://localhost:27017/apple_store`
- **MongoDB Atlas:** `mongodb+srv://usuario:contraseña@cluster.mongodb.net/apple_store`

### Conectar MongoDB

**Windows Local:**

```powershell
# Descargar MongoDB Community Edition
# https://www.mongodb.com/try/download/community

# Iniciar MongoDB en terminal separada
mongod

# Verificar conexión
mongo
```

**Docker:**

```powershell
docker run -d -p 27017:27017 --name mongodb mongo
```

### Poblar Base de Datos

```powershell
node scripts/seed.js
```

Output esperado:

```
 Conectado a MongoDB
  Colecciones limpiadas
 5 productos insertados
 Carrito de ejemplo creado
 Seed completado correctamente
```

### Iniciar Servidor

```powershell
npm start
```

Servidor correrá en `http://localhost:8080`

---

## Estructura del Proyecto

```
src/
├── models/
│   ├── Product.js       # Mongoose schema para productos
│   └── Cart.js          # Mongoose schema para carritos
├── managers/
│   ├── ProductManager.js # CRUD con paginación y filtros
│   └── CartManager.js    # Gestión de carritos con populate()
├── routes/
│   ├── index.js         # Enrutador principal
│   ├── products.routes.js # API REST de productos
│   ├── carts.routes.js   # API REST de carritos
│   └── views.routes.js   # Rutas de vistas (Handlebars)
├── views/
│   ├── layouts/main.hbs  # Layout principal
│   ├── pages/
│   │   ├── products.hbs  # Catálogo con paginación
│   │   ├── productDetail.hbs # Detalle del producto
│   │   ├── cart.hbs      # Visualización del carrito
│   │   └── realTimeProd.hbs  # Productos en tiempo real
│   └── partials/
│       ├── header.hbs
│       ├── navbar.hbs    # Navegación actualizada
│       └── footer.hbs
├── config/config.js      # Configuración de rutas
└── app.js               # Configuración de Express y MongoDB

scripts/
└── seed.js              # Script para poblar base de datos

index.js                 # Entrada principal con Socket.IO
```

---

## Estructura de Datos

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

## Ejemplos de Uso

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

# Respuesta: { "status": "success", "cart": { "_id": "..." } }

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

## Cambios Principales desde Versión Anterior

### Eliminado

- Almacenamiento en JSON (`data/products.json`)
- Métodos `saveProducts()` de ProductManager
- IDs númericos secuenciales

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

## Testing

### Endpoints de Productos

```bash
# GET /api/products - Listar con paginación
# GET /api/products/:pid - Obtener uno
# POST /api/products - Crear
# PUT /api/products/:pid - Actualizar
# DELETE /api/products/:pid - Eliminar
```

### Endpoints de Carritos

```bash
# POST /api/carts - Crear
# GET /api/carts/:cid - Obtener
# POST /api/carts/:cid/products/:pid - Agregar
# PUT /api/carts/:cid/products/:pid - Actualizar cantidad
# DELETE /api/carts/:cid/products/:pid - Eliminar producto
# DELETE /api/carts/:cid - Vaciar carrito
# PUT /api/carts/:cid - Reemplazar productos
```

### Vistas

```bash
GET http://localhost:8080/products              # Catálogo
GET http://localhost:8080/products/[id]        # Detalle
GET http://localhost:8080/carts/[cartId]       # Carrito
GET http://localhost:8080/realtimeproducts     # Tiempo real
```

---

## Helpers Handlebars Disponibles

- `formatPrice(number)` - Formatea como $X.XX
- `eq(a, b)` - Comparación de igualdad
- `multiply(a, b)` - Multiplicación
- `gt(a, b)` - Mayor que
- `range(start, end)` - Genera array de números
- `getFirstImage(thumbnails)` - Obtiene primera imagen

Ejemplo en plantilla:

```handlebars
{{formatPrice price}}
{{#each (range 1 totalPages)}}
  <a href="/products?page={{this}}">{{this}}</a>
{{/each}}
{{#if (gt stock 0)}} En stock {{/if}}
```

---

## Troubleshooting

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
MONGODB_URL=mongodb://localhost:27017/apple_store
```

### "Carrito no encontrado" - ID inválido

```bash
# Asegurarse de usar ObjectId válido (24 caracteres hex)
curl http://localhost:8080/api/carts/507f1f77bcf86cd799439011
```

---

## Soporte

Para reportar bugs o sugerencias:

1. Revisar logs en consola
2. Verificar variables de entorno en `.env`
3. Confirmar conexión a MongoDB: `mongo` o `mongosh`
4. Revisar estructura de payload enviado vs schema esperado

---

**Versión:** 2.0.0 (MongoDB Edition)  
**Última actualización:** 2024  
**Estado:** Producción
