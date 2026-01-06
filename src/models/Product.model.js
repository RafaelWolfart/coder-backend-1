const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: Boolean,
      default: true,
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      // Categorías permitidas
      enum: ["celular", "notebook", "smartwatch", "auriculares", "general"],
    },
    thumbnails: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true, // Añade createdAt y updatedAt automáticamente
  }
);

// Crear índice para búsquedas más rápidas
productSchema.index({ category: 1, price: 1 });

module.exports = mongoose.model("Product", productSchema);
