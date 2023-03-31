const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const userRouter = require("./routes/user.js");
const sauceRouter = require("./routes/sauce.js");

const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});

//const mongoConnection = process.env.CONEXTION_MONGO
const mongoConnection = process.env.mongoConnection;
//connexion à la BDD
mongoose.set("strictQuery", true);
if(mongoConnection){
  mongoose
  .connect(mongoConnection)
  .then(() => console.log("MongoDB  ok "))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
}

//middleware qui permet d'accéder aux requêtes qui contiennent du json

// utiliser le router
app.use("/api/", userRouter);

// sauce le router
app.use("/api/", sauceRouter);

app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
