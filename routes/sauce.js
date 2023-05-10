// Importer le module express
const express = require("express");

// Créer un routeur à l'aide de la méthode Router du module express
const router = express.Router();

// Importer le middleware d'authentification
const auth = require("../middleware/auth");

// Importer le middleware de configuration multer
const multer = require("../middleware/multer-config");

// Importer le contrôleur de sauces
const sauceController = require("../controllers/Sauce");

// Route pour créer une sauce en utilisant la méthode post
// Cette route nécessite l'authentification et le middleware multer pour la gestion des fichiers
router.post("/sauces", auth, multer, sauceController.createSauce);

// Route pour obtenir toutes les sauces en utilisant la méthode get
// Cette route nécessite l'authentification
router.get("/sauces", auth, sauceController.getAllSauces);

// Route pour obtenir une sauce spécifique en utilisant la méthode get
// Cette route nécessite l'authentification
router.get("/sauces/:id", auth, sauceController.getOneSauce);

// Route pour modifier une sauce spécifique en utilisant la méthode put
// Cette route nécessite l'authentification et le middleware multer pour la gestion des fichiers
router.put("/sauces/:id", auth, multer, sauceController.modifySauce);

// Route pour supprimer une sauce spécifique en utilisant la méthode delete
// Cette route nécessite l'authentification et le middleware multer pour la gestion des fichiers
router.delete("/sauces/:id", auth, multer, sauceController.deleteSauce);

// Créer une route pour la partie like en utilisant la méthode post
router.post("/sauces/:id/like", sauceController.likeSauce);

// Exporter le routeur pour pouvoir l'utiliser dans d'autres fichiers
module.exports = router;
