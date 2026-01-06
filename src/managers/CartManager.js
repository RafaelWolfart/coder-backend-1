const Cart = require("../models/Cart.model");
const Product = require("../models/Product.model");

class CartManager {
  async createCart() {
    try {
      const newCart = new Cart({ products: [] });
      await newCart.save();
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }

  async getCartById(cid) {
    try {
      // populate obtiene los datos completos de los productos
      const cart = await Cart.findById(cid).populate("products.product");
      return cart || null;
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw error;
    }
  }

  async addProductToCart(cid, pid, quantity = 1) {
    try {
      // Validar que el producto existe
      const product = await Product.findById(pid);
      if (!product) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      // Obtener el carrito
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      // Buscar si el producto ya está en el carrito
      const existingProduct = cart.products.find(
        (p) => p.product.toString() === pid
      );

      if (existingProduct) {
        // Si existe, incrementar cantidad
        existingProduct.quantity += quantity;
      } else {
        // Si no existe, agregarlo
        cart.products.push({ product: pid, quantity });
      }

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }

  // Eliminar un producto del carrito
  async removeProductFromCart(cid, pid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      // Filtrar y eliminar el producto
      cart.products = cart.products.filter((p) => p.product.toString() !== pid);

      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al eliminar producto del carrito:", error);
      throw error;
    }
  }

  // Actualizar la cantidad de un producto en el carrito
  async updateProductQuantity(cid, pid, quantity) {
    try {
      if (quantity <= 0) {
        throw new Error("La cantidad debe ser mayor a 0");
      }

      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      const productInCart = cart.products.find(
        (p) => p.product.toString() === pid
      );
      if (!productInCart) {
        throw new Error(`Producto con ID ${pid} no encontrado en el carrito`);
      }

      productInCart.quantity = quantity;
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar cantidad:", error);
      throw error;
    }
  }

  // Vaciar el carrito
  async clearCart(cid) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      cart.products = [];
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al vaciar carrito:", error);
      throw error;
    }
  }

  // Actualizar el carrito con un nuevo array de productos
  async updateCart(cid, productsArray) {
    try {
      const cart = await Cart.findById(cid);
      if (!cart) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }

      // Validar que todos los productos existen
      for (const item of productsArray) {
        const product = await Product.findById(item.product);
        if (!product) {
          throw new Error(`Producto con ID ${item.product} no encontrado`);
        }
      }

      cart.products = productsArray;
      await cart.save();
      return cart;
    } catch (error) {
      console.error("Error al actualizar carrito:", error);
      throw error;
    }
  }
}

module.exports = CartManager;
