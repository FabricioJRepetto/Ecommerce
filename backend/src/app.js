require("dotenv").config();
const morgan = require("morgan");
const mongoose = require("mongoose");
const multer = require('multer');
const express = require("express");
const cors = require("cors");
const path = require('path');
const passport = require("passport");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const bodyParser = require("body-parser");
const { DB_URL, SESSION_SECRET_CODE } = process.env;
const router = require("./routes/index");
const { v4: uuidv4 } = require('uuid')

const app = express();

mongoose.connect(
  `${DB_URL}`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log("Mongoose connected");
  }
);

let whitelist = ["http://localhost:3000", "otro dominio"];
let corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
};

// ---------------- MIDDLEWARES
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

const storage = multer.diskStorage({
    destination: path.join(__dirname, 'public/uploads'),
    filename: (req, file, cb) => {
        cb(null, uuidv4() + path.extname(file.originalname));
    }
});
app.use(multer({ storage }).single('image')); //? single tiene el nombre del input

app.use(
  session({
    secret: `${SESSION_SECRET_CODE}`,
    resave: true,
    saveUninitialized: true,
  })
);
app.use(cookieParser(`${SESSION_SECRET_CODE}`));
app.use(passport.initialize());
app.use(passport.session());

app.use("/", cors(corsOptions), router);
require("./config/auth");

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = app;
