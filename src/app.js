const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
const { paths } = require("./config/config");
const handlebars = require("express-handlebars");

// Conectar a MongoDB
const mongoURL = process.env.MONGO_URL;

mongoose
  .connect(mongoURL)
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => {
    console.error("Error al conectar a MongoDB:", err);
    process.exit(1);
  });

// Middleware: parsear JSON y CORS
app.use(express.json());
app.use(cors());

// Rutas API
const apiRoutes = require("./routes/index");
app.use("/api", apiRoutes);

// Rutas de Vistas
const viewsRouter = require("./routes/views.routes");
app.use("/", viewsRouter);

// Servir archivos estáticos
app.use(express.static(paths.public));

// Configurar Handlebars
app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: paths.layouts,
    partialsDir: paths.partials,
    runtimeOptions: {
      allowProtoPropertiesByDefault: true,
      allowSuperPropertiesByDefault: true,
    },
    helpers: {
      // Helper: obtener primera imagen
      getFirstImage: (thumbnails) => {
        return thumbnails && thumbnails.length > 0 ? thumbnails[0] : null;
      },
      // Helper: formatear precio
      formatPrice: (price) => {
        return `$${parseFloat(price).toFixed(2)}`;
      },
      // Helper: comparación
      eq: (a, b) => a === b,
      // Helper: multiplicar dos números
      multiply: (a, b) => a * b,
      // Helper: comparación mayor que
      gt: (a, b) => a > b,
      // Helper: generar rango de números (para paginación)
      range: (start, end) => {
        const result = [];
        if (typeof start === "number" && typeof end === "number") {
          for (let i = start; i <= end; i++) {
            result.push(i);
          }
        }
        return result;
      },
    },
  })
);

app.set("view engine", "hbs");
app.set("views", paths.views);

// Error handler global - DEBE IR AL FINAL
app.use((err, req, res, next) => {
  const status = err.status || err.statusCode || 500;
  const message = err.message || "Error interno del servidor";

  console.error(`\n❌ Error [${status}]:`, message);
  console.error("Stack:", err.stack);

  // Si es un error de MongoDB
  if (err.name === "ValidationError") {
    return res.status(400).json({
      status: "error",
      message: "Validación fallida",
      details: Object.values(err.errors).map((e) => e.message),
    });
  }

  if (err.name === "CastError") {
    return res.status(400).json({
      status: "error",
      message: "ID inválido",
    });
  }

  res.status(status).json({
    status: "error",
    message,
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: `Ruta no encontrada: ${req.method} ${req.originalUrl}`,
  });
});

module.exports = app;
