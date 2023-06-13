const bcrypt = require("bcrypt");
const User = require("../models/user");
const jwt = require("jsonwebtoken");
const { set } = require("mongoose");
require("dotenv").config();
const passwordValidator = require("password-validator");

const emailRegex = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;

const passwordSchema = new passwordValidator();

passwordSchema
  .is()
  .min(6) // Longueur minimale de 6 caractères
  .has()
  .uppercase() // Doit contenir au moins une lettre majuscule
  .has()
  .lowercase() // Doit contenir au moins une lettre minuscule
  .has()
  .digits(); // Doit contenir au moins un chiffre

exports.signup = (req, res, next) => {
  const { email, password } = req.body;

  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: "Adresse email invalide" });
  }

  if (!passwordSchema.validate(password)) {
    return res.status(400).json({
      message:
        "Le mot de passe doit contenir au moins 1 lettre majuscule, 1 lettre minuscule, 1 chiffre et avoir une longueur minimale de 6 caractères",
    });
  }

  bcrypt
    .hash(password, 10)
    .then((hash) => {
      const user = new User({
        email: email,
        password: hash,
      });
      user
        .save()
        .then(() => res.status(201).json({ message: "Utilisateur créé !" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(500).json({ error }));
};

const jwtSecret = process.env.JWT_SECRET || "defaultsecret";

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const foundUser = await User.findOne({ email });

  if (!foundUser) {
    res.status(401).json({ msg: "identifiant/mot de passe incorrecte" });
  } else {
    const valid = await bcrypt.compare(password, foundUser.password);

    if (!valid) {
      res.status(401).json({ msg: "identifiant/mot de passe incorrecte" });
    } else {
      const token = jwt.sign(
        {
          userId: foundUser._id,
        },
        jwtSecret,
        { expiresIn: "24h" }
      );
      res.status(200).json({ userId: foundUser._id, token });
    }
  }
};
