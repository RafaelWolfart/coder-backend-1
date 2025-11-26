const express = require("express");
const app = express();
const { paths } = require("./config/config");
const handlebars = require("express-handlebars");

app.use(express.json());

const apiRoutes = require("./routes/index");
app.use("/api", apiRoutes);

const viewsRouter = require("./routes/views.routes");
app.use("/", viewsRouter);

app.use("/public", express.static(paths.public));

app.engine(
  "hbs",
  handlebars.engine({
    extname: ".hbs",
    defaultLayout: "main",
    layoutsDir: paths.layouts,
    partialsDir: paths.partials,
    helpers: {
      getFirstImage: (thumbnails) => {
        return thumbnails && thumbnails.length > 0 ? thumbnails[0] : null;
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", paths.views);

module.exports = app;
