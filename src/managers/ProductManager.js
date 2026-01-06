const Product = require("../models/Product.model");

class ProductManager {
  async getProducts(options = {}) {
    try {
      const { limit = 10, page = 1, query, sort } = options;

      // Convertir a números
      const pageNum = Math.max(1, parseInt(page));
      const limitNum = Math.max(1, parseInt(limit));

      // Construir filtro
      let filter = {};

      if (query) {
        // Si hay query, buscar por categoría o por disponibilidad
        if (query === "available") {
          filter.status = true;
        } else {
          // Buscar por categoría (case-insensitive)
          filter.category = { $regex: query, $options: "i" };
        }
      }

      // Construir ordenamiento
      let sortOptions = {};
      if (sort === "asc") {
        sortOptions.price = 1; // Ascendente
      } else if (sort === "desc") {
        sortOptions.price = -1; // Descendente
      }

      // Contar total de documentos
      const totalProducts = await Product.countDocuments(filter);
      const totalPages = Math.ceil(totalProducts / limitNum);

      // Validar página
      if (pageNum > totalPages && totalPages > 0) {
        throw new Error(`Página ${pageNum} no existe`);
      }

      // Calcular skip
      const skip = (pageNum - 1) * limitNum;

      // Ejecutar consulta
      const products = await Product.find(filter)
        .sort(sortOptions)
        .limit(limitNum)
        .skip(skip);

      // Construir links
      const baseUrl = "/api/products";
      const queryString = `limit=${limitNum}&sort=${sort || ""}`.replace(
        /&sort=$/,
        ""
      );
      const categoryFilter = query ? `&query=${query}` : "";

      const prevPage = pageNum > 1 ? pageNum - 1 : null;
      const nextPage = pageNum < totalPages ? pageNum + 1 : null;

      const prevLink =
        prevPage !== null
          ? `${baseUrl}?page=${prevPage}&${queryString}${categoryFilter}`
          : null;
      const nextLink =
        nextPage !== null
          ? `${baseUrl}?page=${nextPage}&${queryString}${categoryFilter}`
          : null;

      // Retornar respuesta profesional
      return {
        status: "success",
        payload: products,
        totalPages,
        prevPage,
        nextPage,
        page: pageNum,
        hasPrevPage: prevPage !== null,
        hasNextPage: nextPage !== null,
        prevLink,
        nextLink,
      };
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  }

  // Obtener un producto por ID
  async getProductById(pid) {
    try {
      const product = await Product.findById(pid);
      return product || null;
    } catch (error) {
      console.error("Error al obtener producto por ID:", error);
      throw error;
    }
  }

  // Agregar un nuevo producto
  async addProduct(productData) {
    try {
      // Validar que no exista el código
      const existingProduct = await Product.findOne({ code: productData.code });
      if (existingProduct) {
        throw new Error(`El código ${productData.code} ya existe`);
      }

      const product = new Product(productData);
      await product.save();

      return {
        message: "Producto agregado exitosamente",
        product,
      };
    } catch (error) {
      console.error("Error al agregar producto:", error);
      throw error;
    }
  }

  async updateProduct(pid, updateFields) {
    try {
      // No permitir actualizar el ID
      delete updateFields._id;

      const product = await Product.findByIdAndUpdate(pid, updateFields, {
        new: true, // Retornar documento actualizado
        runValidators: true,
      });

      if (!product) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      return {
        message: "Producto actualizado exitosamente",
        product,
      };
    } catch (error) {
      console.error("Error al actualizar producto:", error);
      throw error;
    }
  }

  // Eliminar un producto por ID
  async deleteProduct(pid) {
    try {
      const product = await Product.findByIdAndDelete(pid);

      if (!product) {
        throw new Error(`Producto con ID ${pid} no encontrado`);
      }

      return { message: `Producto con ID ${pid} eliminado correctamente` };
    } catch (error) {
      console.error("Error al eliminar producto:", error);
      throw error;
    }
  }
}

module.exports = ProductManager;
