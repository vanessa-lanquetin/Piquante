// Importation du module jsonwebtoken
const jwt = require("jsonwebtoken");

// Importation du module dotenv et configuration des variables d'environnement
require("dotenv").config();

// Récupération de la clé secrète JWT depuis les variables d'environnement
// Utilisation d'une valeur par défaut si la clé n'est pas définie
const jwtSecret = process.env.JWT_SECRET || "defaultsecret";

// Exportation d'une fonction middleware
module.exports = (req, res, next) => {
  try {
    // Récupération du token d'authentification depuis l'en-tête Authorization
    const token = req.headers.authorization.split(" ")[1];

    // Vérification et décodage du token à l'aide de la clé secrète
    const decodedToken = jwt.verify(token, jwtSecret);

    // Vérification si le token décodé est invalide ou non un objet
    if (!decodedToken || typeof decodedToken !== "object") {
      // Si le token est invalide, retourner une réponse d'erreur avec le statut 401 (Non autorisé)
      return res.status(401).json({ message: "Invalid token" });
    }

    // Extraction de l'identifiant de l'utilisateur à partir du token décodé
    const userId = decodedToken.userId;

    // Ajout de l'identifiant de l'utilisateur à l'objet req pour une utilisation ultérieure
    req.auth = {
      userId: userId,
    };

    // Appel du prochain middleware ou de la fonction de routage
    next();
  } catch (error) {
    // Si une erreur se produit pendant le processus d'authentification,
    // retourner une réponse d'erreur avec le statut 401 (Non autorisé) et un message d'erreur
    res.status(401).json({ message: error });
  }
};
