require("dotenv").config();
const morgan = require("morgan");
const MongoStore = require("connect-mongo");
const mongoSanitize = require("express-mongo-sanitize");
const express = require("express");
const cors = require("cors");
const passport = require("passport");
const passportLocal = require("passport-local").Strategy;
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const { DB_NAME, SESSION_SECRET_CODE } = process.env;
const router = require("./routes/index");

const clientDb = require("./database/db");

const app = express();

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
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true, limit: "50mb" }));
app.use(morgan("dev"));

/* app.use(
  session({
    secret: SESSION_SECRET_CODE,
    resave: true,
    saveUninitialized: true,
    // store: MongoStore.create({
    //  clientPromise: clientDb,
    //  dbName: DB_NAME,
    }), 
  })
); */
app.use(cookieParser(/* SESSION_SECRET_CODE */));
/* app.use(passport.initialize());
app.use(passport.session()); */

app.use(mongoSanitize());
app.use("/", cors(corsOptions), router);
require("./config/auth");

app.use((err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || err;
  console.error(err);
  res.status(status).send(message);
});

module.exports = app;
