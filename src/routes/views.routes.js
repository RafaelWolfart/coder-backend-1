const express = require("express");
const router = express.Router();

const ProductManager = require("../managers/ProductManager");
const CartManager = require("../managers/CartManager");

const productManager = new ProductManager();
const cartManager = new CartManager();

router.get("/", (req, res) => {
  res.redirect("/products");
});

router.get("/products", async (req, res) => {
  try {
    const { limit, page, query, sort } = req.query;

    // Obtener productos con manager
    const result = await productManager.getProducts({
      limit,
      page,
      query,
      sort,
    });

    res.render("pages/products", {
      title: "Catálogo de Productos",
      ...result, // Spread del resultado (payload, totalPages, etc.)
      limit: limit || 10, // Para mantener en el formulario
    });
  } catch (error) {
    res.status(500).send(`Error cargando productos: ${error.message}`);
  }
});

router.get("/products/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    // Validar ObjectId
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send("ID de producto inválido");
    }

    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).send("Producto no encontrado");
    }

    res.render("pages/productDetail", {
      title: `${product.title} - Detalles`,
      product,
    });
  } catch (error) {
    res.status(500).send(`Error cargando producto: ${error.message}`);
  }
});

router.get("/carts/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Validar ObjectId
    if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).send("ID de carrito inválido");
    }

    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).send("Carrito no encontrado");
    }

    // Calcular totales
    let subtotal = 0;
    cart.products.forEach((item) => {
      subtotal += item.product.price * item.quantity;
    });

    const tax = subtotal * 0.21; // 21% de IVA
    const total = subtotal + tax;

    res.render("pages/cart", {
      title: "Mi Carrito",
      cart: {
        ...cart.toObject(),
        subtotal,
        tax,
        total,
      },
    });
  } catch (error) {
    res.status(500).send(`Error cargando carrito: ${error.message}`);
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const result = await productManager.getProducts();

    res.render("pages/realTimeProd", {
      title: "Productos en Tiempo Real",
      products: result.payload,
    });
  } catch (error) {
    res.status(500).send(`Error cargando productos: ${error.message}`);
  }
});

module.exports = router;
