const { routeFile } = require("./config/config.js");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const productsRoute = routeFile("products.json");

class ProductManager {
  constructor() {
    this.path = productsRoute;
    this.products = [];
  }

  async readFile() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      this.products = JSON.parse(data);
    } catch (error) {
      this.products = [];
    }
  }

  async writeFile() {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify(this.products, null, 2)
    );
  }

  async getProducts(productDeleted = false) {
    await this.readFile();

    if (productDeleted) {
      return this.products;
    } else {
      return this.products.filter((p) => p.status === true);
    }
  }

  async getProductById(id) {
    await this.readFile();
    const product = this.products.find((p) => p.id === id);
    return product || null;
  }

  async addProduct(
    title,
    description,
    code,
    price,
    stock,
    category,
    thumbnails = []
  ) {
    await this.readFile();

    if (!title || !description || !code || !price || !stock || !category) {
      console.log("Todos los campos son obligatorios");
      return;
    }

    const trueCode = this.products.find((p) => p.code === code);
    if (trueCode) {
      console.log("Este código ya existe");
      return;
    }

    const newProduct = {
      id: uuidv4(),
      title,
      description,
      code,
      price,
      status: true,
      stock,
      category,
      thumbnails,
    };

    this.products.push(newProduct);
    await this.writeFile();
    return newProduct;
  }

  async updateProduct(id, updateItem) {
    await this.readFile();

    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      console.log("No se encontró el producto");
      return null;
    }

    if (updateItem.code) {
      const trueCode = this.products.find(
        (p) => p.code === updateItem.code && p.id !== id
      );
      if (trueCode) {
        console.log("Otro producto ya tiene este código");
        return null;
      }
    }

    if (updateItem.id) {
      delete updateItem.id;
    }

    const productUpdate = {
      ...this.products[productIndex],
      ...updateItem,
    };

    this.products[productIndex] = productUpdate;
    await this.writeFile();
    return productUpdate;
  }

  async deleteProduct(id) {
    await this.readFile();

    const productIndex = this.products.findIndex((p) => p.id === id);

    if (productIndex === -1) {
      console.log("No se encontró el producto");
      return null;
    }

    if (this.products[productIndex].status === false) {
      console.log("Ya se eliminó este producto");
      return null;
    }

    this.products[productIndex].status = false;

    await this.writeFile();
    return this.products[productIndex];
  }
}

module.exports = ProductManager;
