const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const products = await productManager.getProducts();
    res.status(200).json(products);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({ error: "Error al obtener los productos" });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(product);
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({ error: "Error al obtener el producto" });
  }
});

router.post("/", async (req, res) => {
  try {
    /*
      Body esperado:
      {
        "title": "iPhone 16",
        "description": "Nuevo modelo 2025",
        "code": "APL-IP16",
        "price": 1599,
        "status": true,
        "stock": 20,
        "category": "smartphone",
        "thumbnails": ["url1","url2"]
      }
    */

    const productData = req.body;

    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
      "thumbnails",
    ];

    const missingFields = requiredFields.filter((field) => !productData[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Faltan los siguientes campos: ${missingFields.join(", ")}`,
      });
    }

    const result = await productManager.addProduct(productData);
    res.status(201).json(result);
  } catch (error) {
    console.error("Error en POST /api/products:", error.message);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

router.put("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);
    const updateFields = req.body;

    if (Object.keys(updateFields).length === 0) {
      return res
        .status(400)
        .json({ error: "No se enviaron campos para actualizar" });
    }

    const updated = await productManager.updateProduct(pid, updateFields);

    if (!updated) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error en PUT /api/products/:pid:", error.message);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

router.delete("/:pid", async (req, res) => {
  try {
    const pid = parseInt(req.params.pid);

    const result = await productManager.deleteProduct(pid);

    if (!result) {
      return res.status(404).json({ error: "Producto no encontrado" });
    }

    res.status(200).json(result);
  } catch (error) {
    console.error("Error en DELETE /api/products/:pid:", error.message);
    res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
});

module.exports = router;
