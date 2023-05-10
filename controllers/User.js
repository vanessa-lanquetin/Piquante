const bcrypt = require("bcrypt"); // Importation du module bcrypt pour le chiffrement des mots de passe
const User = require("../models/user"); // Importation du modèle User
const jwt = require("jsonwebtoken"); // Importation du module jsonwebtoken pour la gestion des tokens JWT
const { set } = require("mongoose"); // Importation de la fonction 'set' de Mongoose pour la gestion des paramètres
require("dotenv").config(); // Chargement des variables d'environnement depuis le fichier .env

const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{6,}$/; // Expression régulière pour valider le mot de passe
const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/; // Expression régulière pour valider l'adresse email

exports.signup = (req, res, next) => {
  const { email, password } = req.body; // Récupération de l'email et du mot de passe depuis le corps de la requête

  // Valider l'adresse email
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Adresse email invalide" });
  }

  // Valider le mot de passe
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et avoir une longueur minimale de 6 caractères",
    });
  }

  bcrypt
    .hash(password, 10) // Chiffrer le mot de passe avec un coût de hachage de 10
    .then((hash) => {
      const user = new User({
        email: email,
        password: hash, // Utiliser le mot de passe chiffré pour créer un nouvel utilisateur
      });
      user
        .save() // Sauvegarder l'utilisateur dans la base de données
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

const jwtSecret = process.env.JWT_SECRET || "defaultsecret"; // Clé secrète pour la génération des tokens JWT
exports.login = async (req, res, next) => {
  const { email, password } = req.body; // Récupération de l'email et du mot de passe depuis le corps de la requête

  const foundUser = await User.findOne({ email }); // Recherche de l'utilisateur dans la base de données par son email

  // Valider l'adresse email
  if (!foundUser) {
    res.status(401).json({ msg: "identifiant/mot de passe incorrecte" });
  } else {
    // Valider le mot de passe
    const valid = await bcrypt.compare(password, foundUser.password); // Comparer le mot de passe fourni avec celui stocké dans la base de données
    if (!valid) {
      res.status(401).json({ msg: "identifiant/mot de passe incorrecte" });
    } else {
      const token = jwt.sign(
        {
          userId: foundUser._id, // Création du token JWT avec l'ID de l'utilisateur comme payload
        },
        jwtSecret, // Utilisation de la clé secrète pour la génération du token JWT
        { expiresIn: "24h" } // Durée de validité du token (24 heures)
      );
      res.status(200).json({ userId: foundUser._id, token }); // Envoi de l'ID de l'utilisateur et du token JWT dans la réponse
    }
  }
};
