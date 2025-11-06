const { routeFile } = require("./config/config.js");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const cartRoute = routeFile("carts.json");

class CartManager {
  constructor() {
    this.path = cartRoute;
    this.carts = [];
  }

  async readFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.carts = JSON.parse(data);
    } catch (error) {
      this.carts = [];
    }
  }

  async writeFile() {
    await fs.promises.writeFile(this.path, JSON.stringify(this.carts, null, 2));
  }

  async createCart() {
    await this.readFile();

    const newCart = {
      id: uuidv4(),
      products: [],
    };

    this.carts.push(newCart);
    await this.writeFile();
    return newCart;
  }

  async getCartById(id) {
    await this.readFile();
    const cart = this.carts.find((c) => c.id === id);
    return cart || null;
  }

  async addProductCart(cartId, productId) {
    await this.readFile();

    const cartIndex = this.carts.findIndex((c) => c.id === cartId);

    if (cartIndex === -1) {
      console.log("no existe el carrito");
      return null;
    }

    const productIndex = this.carts[cartIndex].products.findIndex(
      (p) => p.product === productId
    );

    if (productIndex !== -1) {
      this.carts[cartIndex].products[productIndex].quantity += 1;
    } else {
      this.carts[cartIndex].products.push({
        product: productId,
        quantity: 1,
      });
    }

    await this.writeFile();
    return this.carts[cartIndex];
  }
}

module.exports = CartManager;
