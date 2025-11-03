const express = require("express");
const app = express();
const PORT = 3000;

// Middleware to parse JSON requests
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const users = [
  {
    id: 1,
    nombre: "Juan",
    apellido: "Perez",
    edad: 28,
    email: "juanperez@mail.com"
  },
  {
    id: 2,
    nombre: "Maria",
    apellido: "Gomez",
    edad: 34,
    email: "mariagomez@mail.com"
  },
  { 
    id: 3,
    nombre: "Carlos",
    apellido: "Lopez",
    edad: 22,
    email: "carlosperez@mail.com"
  },
  {
    id: 4,
    nombre: "Ana",
    apellido: "Martinez",
    edad: 29,
    email: "anamartinez@mail.com"
  }
]

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port http://localhost:${PORT}`);
});

module.exports = app;
