require("dotenv").config();
const mongoose = require("mongoose");

console.log("\n VERIFICACIÓN DE MONGODB ATLAS");
console.log("═".repeat(50));

// 1. VERIFICAR VARIABLES DE ENTORNO
console.log("\n  VARIABLES DE ENTORNO:");
console.log("─".repeat(50));

const requiredVars = ["MONGO_URL", "PORT", "NODE_ENV"];
let varsOk = true;

requiredVars.forEach((varName) => {
  const value = process.env[varName];
  if (value) {
    // Ocultar partes sensibles de la URL
    let displayValue = value;
    if (varName === "MONGO_URL") {
      displayValue = value.replace(/:([^:@]+)@/, ":****@");
    }
    console.log(` ${varName.padEnd(15)} = ${displayValue}`);
  } else {
    console.log(` ${varName.padEnd(15)} = NO DEFINIDA`);
    varsOk = false;
  }
});

if (!varsOk) {
  console.log("\n  Algunas variables no están definidas en .env");
  process.exit(1);
}

// 2. VALIDAR FORMATO DE URL
console.log("\n  VALIDACIÓN DE URL:");
console.log("─".repeat(50));

const mongoURL = process.env.MONGO_URL;
const urlRegex = /^mongodb\+srv:\/\/(.+):(.+)@(.+)\/(.+)/;
const isValidURL = urlRegex.test(mongoURL);

if (isValidURL) {
  console.log(" Formato de URL válido (MongoDB Atlas)");
  const match = mongoURL.match(urlRegex);
  console.log(`   Usuario: ${match[1]}`);
  console.log(`   Cluster: ${match[3]}`);
  console.log(`   BD: ${match[4].split("?")[0]}`);
} else {
  console.log(" Formato de URL inválido");
  console.log("   Debería ser: mongodb+srv://usuario:pass@cluster/dbname");
  process.exit(1);
}

// 3. INTENTAR CONEXIÓN
console.log("\n  CONECTANDO A MONGODB ATLAS...");
console.log("─".repeat(50));

mongoose
  .connect(mongoURL, {
    retryWrites: true,
    w: "majority",
  })
  .then(async () => {
    console.log(" CONEXIÓN EXITOSA");

    // 4. OBTENER INFO DE LA BD
    console.log("\n  INFORMACIÓN DE LA BASE DE DATOS:");
    console.log("─".repeat(50));

    try {
      const db = mongoose.connection.db;
      const collections = await db.listCollections().toArray();

      console.log(`Base de datos: ${db.name}`);
      console.log(`Colecciones: ${collections.length}`);

      if (collections.length > 0) {
        console.log("\nColecciones disponibles:");
        for (const col of collections) {
          const count = await db.collection(col.name).countDocuments();
          console.log(`  • ${col.name.padEnd(20)} (${count} documentos)`);
        }
      } else {
        console.log("⚠️  No hay colecciones (BD vacía)");
      }

      // 5. RESUMEN FINAL
      console.log("\n  RESUMEN FINAL:");
      console.log("─".repeat(50));
      console.log(" Variables de entorno: OK");
      console.log(" Formato de URL: OK");
      console.log(" Conexión a MongoDB Atlas: OK");
      console.log(" Base de datos accesible: OK");

      console.log("\n TODO ESTÁ CONFIGURADO CORRECTAMENTE\n");

      process.exit(0);
    } catch (err) {
      console.log(" Error al obtener información de BD:", err.message);
      process.exit(1);
    }
  })
  .catch((err) => {
    console.log(" CONEXIÓN FALLIDA");
    console.log("\nDetalles del error:");
    console.log(`   ${err.message}`);

    if (err.message.includes("ENOTFOUND")) {
      console.log(
        "\n Posible solución: Verifica el nombre del cluster en la URL"
      );
    }

    if (err.message.includes("authentication failed")) {
      console.log(
        "\n Posible solución: Usuario o contraseña incorrectos en .env"
      );
    }

    if (err.message.includes("ip_whitelist")) {
      console.log(
        "\n Posible solución: Tu IP no está en la whitelist de MongoDB Atlas"
      );
      console.log("   Ve a: MongoDB Atlas → Network Access → Add IP Address");
    }

    process.exit(1);
  });

// Timeout de seguridad
setTimeout(() => {
  console.log("\n  Timeout: La conexión tomó demasiado tiempo");
  process.exit(1);
}, 10000);
