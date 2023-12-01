const express = require("express");
const logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
require("dotenv").config();

const productsRouter = require("./routes/products");

const app = express();

const formatsLogger = app.get("env") === "development" ? "dev" : "short";

const corsOptions = {
  // origin: "http://localhost:3000",
  origin: true,
  // origin: "anastasiiadudnik.github.io/shop-test/",
  credentials: true,
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
};

app.use(logger(formatsLogger));
app.use(cors(corsOptions));
app.use(express.json());

// Handle preflight requests
app.options("*", cors(corsOptions));

const { SESSION_SECRET_KEY } = process.env;

app.use(
  session({
    secret: SESSION_SECRET_KEY,
    resave: false,
    saveUninitialized: true,
    debug: true,
  })
);

app.use("/products", productsRouter);

app.use((req, res) => {
  res.status(404).json({ message: "Not found" });
});

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
