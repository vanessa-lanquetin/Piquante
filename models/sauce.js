// Importation du module mongoose
const mongoose = require("mongoose"); //mongoose permet d'interagir avec la base de données MongoDB.

// Définition du schéma pour les sauces en utilisant mongoose.Schema(). Cela spécifie les champs attendus et leurs types.
//usersLiked et usersDisliked sont des tableaux qui stockent les identifiants des utilisateurs ayant liké ou disliké la sauce.
const sauceSchema = new mongoose.Schema( 
  {
    // Champ pour l'identifiant de l'utilisateur qui a créé la sauce
    userId: { type: String, required: true },

    // Champ pour le nom de la sauce
    name: { type: String },

    // Champ pour le fabricant de la sauce
    manufacturer: { type: String },

    // Champ pour la description de la sauce
    description: { type: String },

    // Champ pour le principal ingrédient épicé de la sauce
    mainPepper: { type: String },

    // Champ pour l'URL de l'image de la sauce
    imageUrl: { type: String },

    // Champ pour le niveau de piquant de la sauce (nombre)
    heat: { type: Number },

    // Champ pour le nombre de likes de la sauce (par défaut 0)
    likes: { type: Number, default: 0 },

    // Champ pour le nombre de dislikes de la sauce (par défaut 0)
    dislikes: { type: Number, default: 0 },

    // Champ pour les utilisateurs ayant liké la sauce (tableau de chaînes de caractères)
    usersLiked: { type: [String] },

    // Champ pour les utilisateurs ayant disliké la sauce (tableau de chaînes de caractères)
    usersDisliked: { type: [String] },
  },
  { timestamps: true }
);

// Exportation du modèle basé sur le schéma de sauce
module.exports = mongoose.model("sauceSchema", sauceSchema);
