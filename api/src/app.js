const express = require('express')
const cors = require('cors')
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const routes = require("./routes/index.js");

const app = express()

var whitelist = ['http://localhost:3000/', 'otro dominio']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}

app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(express.json({ limit: "50mb" }));
app.use(cookieParser());
app.use(morgan("dev"));
app.use("/", cors(corsOptions), routes);

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = app;