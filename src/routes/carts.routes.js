const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");

const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();
    res.status(201).json({
      message: "Carrito creado exitosamente",
      cart: newCart,
    });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({ error: "Error al crear el carrito" });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const cart = await cartManager.getCartById(cid);
    if (!cart) {
      return res.status(404).json({ error: "Carrito no encontrado" });
    }
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error al obtener el carrito por ID:", error);
    res.status(500).json({ error: "Error al obtener el carrito por ID " });
  }
});
router.post("/:cid/product/:pid", async (req, res) => {
  try {
    const cid = parseInt(req.params.cid);
    const pid = parseInt(req.params.pid);

    const updateCart = await cartManager.addProductToCart(cid, pid);

    res.status(200).json({
      message: `Producto ${pid} agregado al carrito ${cid} exitosamente`,
      cart: updateCart,
    });
  } catch (error) {
    console.error("Error al agregar el producto al carrito:", error);
    if (error.message.includes("No se encontró carrito")) {
      return res.status(404).json({ error: error.message });
    }
    return res
      .status(500)
      .json({ error: "Error al agregar el producto al carrito" });
  }
});

module.exports = router;
