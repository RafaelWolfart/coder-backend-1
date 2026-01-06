const mongoose = require("mongoose");
require("dotenv").config({ path: ".env" });

const Product = require("../src/models/Product.model");
const Cart = require("../src/models/Cart.model");

const seedData = [
  {
    title: "iPhone 15 Pro",
    description: "Smartphone Apple con chip A17 Pro y cámara de 48 MP",
    code: "APL-IP15P",
    price: 1499,
    status: true,
    stock: 15,
    category: "celular",
    thumbnails: ["https://example.com/img/iphone15pro.png"],
  },
  {
    title: "MacBook Air M3",
    description: "Notebook ultradelgada con chip Apple M3 y 512GB SSD",
    code: "APL-MBA-M3",
    price: 1899,
    status: true,
    stock: 10,
    category: "notebook",
    thumbnails: ["https://example.com/img/macbookairm3.png"],
  },
  {
    title: "Apple Watch Series 10",
    description: "Reloj inteligente con pantalla Retina y sensores de salud",
    code: "APL-WCH-S10",
    price: 699,
    status: true,
    stock: 25,
    category: "smartwatch",
    thumbnails: ["https://example.com/img/applewatchs10.png"],
  },
  {
    title: "AirPods Pro 2",
    description: "Auriculares inalámbricos con cancelación de ruido activa",
    code: "APL-APP2",
    price: 349,
    status: true,
    stock: 30,
    category: "auriculares",
    thumbnails: ["https://example.com/img/airpodspro2.png"],
  },
  {
    title: "iPad Pro 12.9",
    description: "Tablet con pantalla ProMotion 120Hz y chip M2",
    code: "APL-IPAD-P129",
    price: 1199,
    status: true,
    stock: 8,
    category: "general",
    thumbnails: ["https://example.com/img/ipadpro129.png"],
  },
];

const seedDB = async () => {
  try {
    // Conectar a MongoDB
    const mongoURL =
      process.env.MONGO_URL || "mongodb://localhost:27017/apple_store";

    await mongoose.connect(mongoURL);
    console.log(" Conectado a MongoDB");

    // Limpiar colecciones existentes
    await Product.deleteMany({});
    await Cart.deleteMany({});
    console.log("  Colecciones limpiadas");

    // Insertar productos
    const createdProducts = await Product.insertMany(seedData);
    console.log(` ${createdProducts.length} productos insertados`);

    // Crear un carrito de ejemplo
    const sampleCart = new Cart({
      products: [
        {
          product: createdProducts[0]._id,
          quantity: 1,
        },
        {
          product: createdProducts[1]._id,
          quantity: 2,
        },
      ],
    });

    await sampleCart.save();
    console.log(" Carrito de ejemplo creado");

    console.log("\n Datos de Seed:");
    console.log(
      "Productos:",
      createdProducts.map((p) => p.title)
    );
    console.log("Carrito ID:", sampleCart._id);

    // Desconectar
    await mongoose.disconnect();
    console.log("\n Seed completado correctamente");
  } catch (error) {
    console.error(" Error en seed:", error);
    process.exit(1);
  }
};

seedDB();
