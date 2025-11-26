const express = require("express");
const router = express.Router();

const ProductManager = require("../managers/ProductManager");
const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("pages/homeProd", {
      title: "Lista de productos",
      products,
    });
  } catch (error) {
    res.status(500).send("Error cargando productos");
  }
});

router.get("/realtimeproducts", async (req, res) => {
  try {
    const products = await productManager.getProducts();

    res.render("pages/realTimeProd", { products });
  } catch (error) {
    res.status(500).send("Error cargando productos (realtime)");
  }
});

module.exports = router;
