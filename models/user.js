// Importation du module mongoose
const mongoose = require("mongoose");

// Importation du module mongoose-unique-validator pour valider l'unicité des champs
const uniqueValidator = require("mongoose-unique-validator");

// Définition du schéma pour les utilisateurs
const userSchema = new mongoose.Schema(
  {
    // Champ pour l'adresse e-mail de l'utilisateur
    email: { type: String, required: true, unique: true },

    // Champ pour le mot de passe de l'utilisateur
    password: { type: String, required: true },
  },
  { timestamps: true }
);

// Application du plugin uniqueValidator pour valider l'unicité des champs
userSchema.plugin(uniqueValidator);

// Exportation du modèle basé sur le schéma d'utilisateur
module.exports = mongoose.model("userSchema", userSchema);
