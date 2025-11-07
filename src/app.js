const express = require("express");
const ProductManager = require("../product-manager.js");
const CartManager = require("../cart-manager.js");
const app = express();

const productManager = new ProductManager();
const cartManager = new CartManager();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/api/products", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.json({ status: "success", data: products });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "No se encontró el producto" });
    }

    res.json({ status: "success", data: product });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/products", async (req, res) => {
  try {
    const { title, description, code, price, stock, category, thumbnails } =
      req.body;

    const newProduct = await productManager.addProduct(
      title,
      description,
      code,
      price,
      stock,
      category,
      thumbnails
    );

    if (!newProduct) {
      return res.status(400).json({
        status: "error",
        message:
          "Error al crear el producto. Verifique que todos los campos sean válidos y el código sea único.",
      });
    }

    res.status(201).json({ status: "success", data: newProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.put("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updateData = req.body;

    const updatedProduct = await productManager.updateProduct(pid, updateData);

    if (!updatedProduct) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado o error en la actualización",
      });
    }

    res.json({ status: "success", data: updatedProduct });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.delete("/api/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    const deletedProduct = await productManager.deleteProduct(pid);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    res.json({
      status: "success",
      message: "Producto eliminado correctamente",
      data: deletedProduct,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/carts", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();

    res.status(201).json({
      status: "success",
      message: "Carrito creado correctamente",
      data: newCart,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.get("/api/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res
        .status(404)
        .json({ status: "error", message: "No se encontró el carrito" });
    }

    res.json({
      status: "success",
      data: cart.products,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

app.post("/api/carts/:cid/product/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    const product = await productManager.getProductById(pid);
    if (!product) {
      return res
        .status(404)
        .json({ status: "error", message: "Producto no encontrado" });
    }

    if (product.status === false) {
      return res.status(400).json({
        status: "error",
        message: "No se puede agregar un producto eliminado al carrito",
      });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid);

    if (!updatedCart) {
      return res
        .status(404)
        .json({ status: "error", message: "No se encontró carrito" });
    }

    res.json({
      status: "success",
      message: "Producto agregado al carrito",
      data: updatedCart,
    });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = app;
