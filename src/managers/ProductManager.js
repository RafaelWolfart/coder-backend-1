const fs = require("fs");
const path = require("path");

class ProductManager {
  constructor() {
    this.path = path.join(__dirname, "../../data/products.json");
  }

  async getProducts() {
    try {
      const data = await fs.promises.readFile(this.path, "utf-8");
      return JSON.parse(data);
    } catch (error) {
      console.error("Error al leer los productos:", error);
      return [];
    }
  }
  async getProductById(pid) {
    try {
      const data = await this.getProducts();

      const product = data.find((p) => p.id === pid);

      if (!product) {
        return null;
      }

      return product;
    } catch (error) {
      console.error("Error al obtener el producto por ID:", error);
      throw error;
    }
  }

  async addProduct(product) {
    try {
      const data = await this.getProducts();

      const maxId = data.length > 0 ? Math.max(...data.map((p) => p.id)) : 0;
      const newProduct = {
        id: maxId + 1,
        ...product,
      };
      data.push(newProduct);

      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
      return {
        message: "Producto agregado exitosamente",
        product: newProduct,
      };
    } catch (error) {
      console.error("Error al agregar el producto:", error);
      throw error;
    }
  }

  async updateProduct(pid, updateFields) {
    try {
      const data = await this.getProducts();
      const index = data.findIndex((p) => p.id === pid);

      if (index === -1) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }
      const updateProduct = {
        ...data[index],
        ...updateFields,
        id: data[index].id,
      };
      data[index] = updateProduct;

      await fs.promises.writeFile(this.path, JSON.stringify(data, null, 2));
      return {
        message: "Producto actualizado exitosamente",
        product: updateProduct,
      };
    } catch (error) {
      console.error("Error al actualizar el producto:", error);
      throw error;
    }
  }

  async deleteProduct(pid) {
    try {
      const data = await this.getProducts();

      const newData = data.filter((p) => p.id !== pid);

      if (data.length === newData.length) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      await fs.promises.writeFile(this.path, JSON.stringify(newData, null, 2));

      return { message: `Producto con ID ${pid} eliminado correctamente` };
    } catch (error) {
      console.error("Error al eliminar el producto:", error);
      throw error;
    }
  }

  async saveProducts(products) {
    try {
      await fs.promises.writeFile(this.path, JSON.stringify(products, null, 2));
      return true;
    } catch (error) {
      console.error("Error al guardar productos:", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
