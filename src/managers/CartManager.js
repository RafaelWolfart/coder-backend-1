const fs = require("fs");
const path = require("path");

class CartManager {
  constructor() {
    this.path = path.join(__dirname, "../../data/carts.json");
  }

  async getCarts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los carritos:", error);
      return [];
    }
  }

  async createCart() {
    try {
      const carts = await this.getCarts();

      const newID = carts.length > 0 ? carts[carts.length - 1].id + 1 : 1;

      const newCart = {
        id: newID,
        products: [],
      };
      carts.push(newCart);

      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return newCart;
    } catch (error) {
      console.error("Error al crear el carrito:", error);
      throw error;
    }
  }
  async getCartById(cid) {
    try {
      const carts = await this.getCarts();
      const cart = carts.find((c) => c.id === cid);
      return cart || null;
    } catch (error) {
      console.error("Error al obtener el carrito por ID:", error);
      throw error;
    }
  }
  async addProductToCart(cid, pid) {
    try {
      const carts = await this.getCarts();
      const cartIndex = carts.findIndex((c) => c.id === cid);
      if (cartIndex === -1) {
        throw new Error(`Carrito con ID ${cid} no encontrado`);
      }
      const cart = carts[cartIndex];

      const existProducts = cart.products.find((p) => p.productId === pid);
      if (existProducts) {
        existProducts.quantity += 1;
      } else {
        cart.products.push({ productId: pid, quantity: 1 });
      }
      await fs.promises.writeFile(this.path, JSON.stringify(carts, null, 2));
      return cart;
    } catch (error) {
      console.error("Error al agregar producto al carrito:", error);
      throw error;
    }
  }
}
module.exports = CartManager;
