const app = require("./src/app");
const http = require("http");
const { Server } = require("socket.io");

const ProductManager = require("./src/managers/ProductManager");
const productManager = new ProductManager();

const server = http.createServer(app);

const io = new Server(server);

io.on("connection", async (socket) => {
  console.log("Cliente conectado vía WebSocket");

  const products = await productManager.getProducts();
  socket.emit("updateProducts", products);

  socket.on("crearProducto", async (data) => {
    console.log("Producto Apple recibido:", data);

    try {
      let products = await productManager.getProducts();

      const maxId =
        products.length > 0 ? Math.max(...products.map((p) => p.id)) : 0;

      const newProduct = {
        id: maxId + 1,
        name: data.name,
        description: data.description,
        price: Number(data.price),
      };

      products.push(newProduct);

      await productManager.saveProducts(products);

      io.emit("updateProducts", products);
    } catch (error) {
      console.error(" Error al crear producto:", error);
    }
  });

  socket.on("eliminarProducto", async (productId) => {
    console.log("Eliminando producto ID:", productId);

    try {
      let products = await productManager.getProducts();

      products = products.filter((p) => p.id !== productId);

      await productManager.saveProducts(products);

      io.emit("updateProducts", products);
    } catch (error) {
      console.error(" Error al eliminar producto:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log("Cliente desconectado");
  });
});

const PORT = 8080;

server.listen(PORT, () =>
  console.log(`Servidor HTTP/WS (Socket.io) corriendo en puerto ${PORT}`)
);
