const express = require("express");
const router = express.Router();

const productsRouter = require("./products.routes");
const cartsRouter = require("./carts.routes");

router.use("/products", productsRouter);
router.use("/carts", cartsRouter);

module.exports = router;
