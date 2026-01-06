const express = require("express");
const router = express.Router();
const ProductManager = require("../managers/ProductManager");

const productManager = new ProductManager();

router.get("/", async (req, res) => {
  try {
    const { limit, page, query, sort } = req.query;

    const result = await productManager.getProducts({
      limit,
      page,
      query,
      sort,
    });

    res.status(200).json(result);
  } catch (error) {
    console.error("Error al obtener los productos:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    // Validar ObjectId
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de producto inválido",
      });
    }

    const product = await productManager.getProductById(pid);

    if (!product) {
      return res.status(404).json({
        status: "error",
        message: "Producto no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: product,
    });
  } catch (error) {
    console.error("Error al obtener producto por ID:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/", async (req, res) => {
  try {
    const productData = req.body;

    // Campos requeridos
    const requiredFields = [
      "title",
      "description",
      "code",
      "price",
      "stock",
      "category",
    ];

    const missingFields = requiredFields.filter(
      (field) => productData[field] === undefined || productData[field] === null
    );

    if (missingFields.length > 0) {
      return res.status(400).json({
        status: "error",
        message: `Faltan los siguientes campos: ${missingFields.join(", ")}`,
      });
    }

    // Validar tipos
    if (typeof productData.price !== "number" || productData.price < 0) {
      return res.status(400).json({
        status: "error",
        message: "El precio debe ser un número válido y positivo",
      });
    }

    if (typeof productData.stock !== "number" || productData.stock < 0) {
      return res.status(400).json({
        status: "error",
        message: "El stock debe ser un número válido y positivo",
      });
    }

    const result = await productManager.addProduct(productData);

    res.status(201).json({
      status: "success",
      message: result.message,
      product: result.product,
    });
  } catch (error) {
    console.error("Error en POST /api/products:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/**
 * Actualizar un producto existente
 */
router.put("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;
    const updateFields = req.body;

    // Validar ObjectId
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de producto inválido",
      });
    }

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({
        status: "error",
        message: "No se enviaron campos para actualizar",
      });
    }

    const result = await productManager.updateProduct(pid, updateFields);

    res.status(200).json({
      status: "success",
      message: result.message,
      product: result.product,
    });
  } catch (error) {
    console.error("Error en PUT /api/products/:pid:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

/**
 * Eliminar un producto
 */
router.delete("/:pid", async (req, res) => {
  try {
    const { pid } = req.params;

    // Validar ObjectId
    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de producto inválido",
      });
    }

    const result = await productManager.deleteProduct(pid);

    res.status(200).json({
      status: "success",
      message: result.message,
    });
  } catch (error) {
    console.error("Error en DELETE /api/products/:pid:", error.message);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
