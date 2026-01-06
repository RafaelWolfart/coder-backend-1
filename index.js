const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");
const { PORT } = require("./src/config/config");

const ProductManager = require("./src/managers/ProductManager");
const productManager = new ProductManager();

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente conectado vía WebSocket");

  // Enviar productos iniciales
  try {
    const products = await productManager.getProducts();
    socket.emit("updateProducts", products.payload);
  } catch (error) {
    console.error("Error al obtener productos:", error);
  }

  // Crear producto
  socket.on("crearProducto", async (data) => {
    console.log("Producto recibido:", data);

    try {
      const newProduct = await productManager.addProduct({
        title: data.title || data.name,
        description: data.description || "",
        code: data.code,
        price: Number(data.price) || 0,
        status: data.status !== undefined ? data.status : true,
        stock: Number(data.stock) || 0,
        category: data.category || "general",
        thumbnails: data.thumbnails || [],
      });

      // Emitir actualización a todos los clientes
      const products = await productManager.getProducts();
      io.emit("updateProducts", products.payload);

      socket.emit("success", {
        message: "Producto creado exitosamente",
        product: newProduct,
      });
    } catch (error) {
      console.error("Error al crear producto:", error);
      socket.emit("error", { message: error.message });
    }
  });

  // Eliminar producto
  socket.on("eliminarProducto", async (productId) => {
    console.log("Eliminando producto ID:", productId);

    try {
      await productManager.deleteProduct(productId);

      // Emitir actualización a todos los clientes
      const products = await productManager.getProducts();
      io.emit("updateProducts", products.payload);

      socket.emit("success", { message: "Producto eliminado exitosamente" });
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      socket.emit("error", { message: error.message });
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

server.listen(PORT, () =>
  console.log(`Servidor HTTP/WS (Socket.io) corriendo en puerto ${PORT}`)
);
