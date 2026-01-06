const express = require("express");
const router = express.Router();
const CartManager = require("../managers/CartManager");

const cartManager = new CartManager();

router.post("/", async (req, res) => {
  try {
    const newCart = await cartManager.createCart();

    res.status(201).json({
      status: "success",
      message: "Carrito creado exitosamente",
      cart: newCart,
    });
  } catch (error) {
    console.error("Error al crear el carrito:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.get("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Validar ObjectId
    if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de carrito inválido",
      });
    }

    const cart = await cartManager.getCartById(cid);

    if (!cart) {
      return res.status(404).json({
        status: "error",
        message: "Carrito no encontrado",
      });
    }

    res.status(200).json({
      status: "success",
      payload: cart,
    });
  } catch (error) {
    console.error("Error al obtener el carrito por ID:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.post("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity = 1 } = req.body;

    // Validar ObjectIds
    if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de carrito inválido",
      });
    }

    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de producto inválido",
      });
    }

    const updatedCart = await cartManager.addProductToCart(cid, pid, quantity);

    res.status(200).json({
      status: "success",
      message: `Producto ${pid} agregado al carrito exitosamente`,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al agregar producto al carrito:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;
    const { quantity } = req.body;

    // Validar ObjectIds
    if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de carrito inválido",
      });
    }

    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de producto inválido",
      });
    }

    if (quantity === undefined || quantity === null) {
      return res.status(400).json({
        status: "error",
        message: "Se requiere el campo 'quantity'",
      });
    }

    if (typeof quantity !== "number" || quantity <= 0) {
      return res.status(400).json({
        status: "error",
        message: "La cantidad debe ser un número mayor a 0",
      });
    }

    const updatedCart = await cartManager.updateProductQuantity(
      cid,
      pid,
      quantity
    );

    res.status(200).json({
      status: "success",
      message: "Cantidad actualizada",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar cantidad:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:cid/products/:pid", async (req, res) => {
  try {
    const { cid, pid } = req.params;

    // Validar ObjectIds
    if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de carrito inválido",
      });
    }

    if (!pid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de producto inválido",
      });
    }

    const updatedCart = await cartManager.removeProductFromCart(cid, pid);

    res.status(200).json({
      status: "success",
      message: `Producto ${pid} eliminado del carrito`,
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al eliminar producto del carrito:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.delete("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;

    // Validar ObjectId
    if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de carrito inválido",
      });
    }

    const emptyCart = await cartManager.clearCart(cid);

    res.status(200).json({
      status: "success",
      message: "Carrito vaciado exitosamente",
      cart: emptyCart,
    });
  } catch (error) {
    console.error("Error al vaciar carrito:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

router.put("/:cid", async (req, res) => {
  try {
    const { cid } = req.params;
    const { products } = req.body;

    // Validar ObjectId del carrito
    if (!cid.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        status: "error",
        message: "ID de carrito inválido",
      });
    }

    if (!Array.isArray(products)) {
      return res.status(400).json({
        status: "error",
        message: "El campo 'products' debe ser un array",
      });
    }

    const updatedCart = await cartManager.updateCart(cid, products);

    res.status(200).json({
      status: "success",
      message: "Carrito actualizado",
      cart: updatedCart,
    });
  } catch (error) {
    console.error("Error al actualizar carrito:", error);
    res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

module.exports = router;
