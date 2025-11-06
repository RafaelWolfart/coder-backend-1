const path = require("path");

const routeFile = function (nameFile) {
  const mypath = path.join(__dirname, "..", "src", "data", nameFile);
  return mypath;
};

module.exports = { routeFile };
