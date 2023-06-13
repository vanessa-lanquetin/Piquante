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
  //Qui peut accéder à l'API
  res.setHeader("Access-Control-Allow-Origin", "*");
  //Quels headers sont autoriés
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content, Accept, Content-Type, Authorization"
  );
  //Quelles méthodes sont possibles
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, DELETE, PATCH, OPTIONS"
  );
  next();
});


const mongoConnection = process.env.mongoConnection;
//connexion à la BDD
mongoose.set("strictQuery", true);
if(mongoConnection){
  mongoose
  .connect(mongoConnection)
  .then(() => console.log("MongoDB  ok "))
  .catch(() => console.log("Connexion à MongoDB échouée !"));
}

//Définition des chemins de l'API

// Chemin pur l'authentification
app.use("/api/", userRouter);

// Chemin pour les sauces
app.use("/api/", sauceRouter);

//Chemin pour les images
app.use("/images", express.static(path.join(__dirname, "images")));

module.exports = app;
