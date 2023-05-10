const Sauce = require('../models/Sauce'); // Importation du modèle Sauce
const fs = require('fs'); // Importation du module fs de Node.js pour la gestion des fichiers

exports.createSauce = (req, res, next) => { // Fonction de création d'une sauce
  const sauceObject = JSON.parse(req.body.sauce); // Récupération de l'objet sauce depuis la requête et conversion en objet JavaScript

  const sauce = new Sauce({ // Création d'une instance de Sauce avec les propriétés de l'objet sauce
    ...sauceObject,
    imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}` // Ajout de l'URL de l'image de la sauce
  });
  sauce.save() // Sauvegarde de la sauce dans la base de données
    .then(() => res.status(201).json({ message: 'Sauce enregistrée !'}))
    .catch(error => res.status(400).json({ error })); // Gestion des erreurs
};
exports.getAllSauces = (req, res) => {
  Sauce.find() // Recherche toutes les sauces dans la base de données
    .then((sauces) => res.status(200).json(sauces)) // Envoie une réponse avec les sauces trouvées en format JSON
    .catch((error) => res.status(400).json({ error })); // Gestion des erreurs
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id }) // Recherche une sauce spécifique dans la base de données en utilisant son ID
    .then((sauce) => res.status(200).json(sauce)) // Envoie une réponse avec la sauce trouvée en format JSON
    .catch((error) => res.status(404).json({ error })); // Gestion des erreurs
};

exports.modifySauce = (req, res) => {
  if (req.file) {
    // Si un fichier est inclus dans la requête (mise à jour de l'image de la sauce)
    Sauce.findOne({ _id: req.params.id }) // Recherche la sauce spécifique dans la base de données en utilisant son ID
      .then((sauce) => {
        if (sauce && sauce.imageUrl) {
          const filename = sauce.imageUrl.split("/images")[1]; // Récupère le nom du fichier à supprimer en extrayant à partir de l'URL de l'image

          fs.unlink(`images/${filename}`, (err) => {
            if (err) throw err; // Gestion des erreurs lors de la suppression du fichier
          });
        }
      })
      .catch((error) => res.status(400).json({ error })); // Gestion des erreurs
  } else {
    // Si aucun fichier n'est inclus dans la requête (mise à jour des autres champs de la sauce)
  }

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${req.file.filename}`, // Construction de l'URL de l'image mise à jour de la sauce
      }
    : { ...req.body }; // Utilisation des autres champs de la requête

  Sauce.updateOne(
    { _id: req.params.id }, // Recherche de la sauce spécifique dans la base de données en utilisant son ID
    { ...sauceObject, _id: req.params.id } // Mise à jour des champs de la sauce avec les nouvelles valeurs
  )
    .then(res.status(200).json({ message: "Sauce modifiée" })) // Envoie une réponse de succès
    .catch((error) => res.status(400).json({ error })); // Gestion des erreurs
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id }) // Recherche la sauce spécifique dans la base de données en utilisant son ID
    .then((sauce) => {
      if (sauce && sauce.imageUrl) {
        const filename = sauce.imageUrl.split("/images")[1]; // Récupère le nom du fichier à supprimer en extrayant à partir de l'URL de l'image

        //Le module fs est utilisé pour effectuer des opérations liées à la gestion des fichiers, (création, modification, suppression)
        //Ici il sert à supprimer les fichiers d'images associés à une sauce lorsque cette sauce est modifiée ou supprimée. 
        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err; // Gestion des erreurs lors de la suppression du fichier
        });
      }

      Sauce.deleteOne({ _id: req.params.id }) // Supprime la sauce de la base de données en utilisant son ID
        .then(() => res.status(200).json({ message: "Sauce supprimée" })) // Envoie une réponse de succès
        .catch((error) => res.status(400).json({ error })); // Gestion des erreurs lors de la suppression de la sauce
    })
    .catch((error) => res.status(400).json({ error })); // Gestion des erreurs lors de la recherche de la sauce
};

const LIKE_MODE = {
  LIKE: 1,
  CANCEL: 0,
  DISLIKE: -1
}

exports.likeSauce = async (req, res) => {
  const { like: likeMode, userId } = req.body; // Récupère les valeurs de "like" et "userId" à partir du corps de la requête
  const sauce = await Sauce.findOne({ _id: req.params.id }); // Recherche la sauce spécifique dans la base de données en utilisant son ID
  if (!sauce) return res.status(404).send("Sauce not found"); // Si la sauce n'est pas trouvée, envoie une réponse d'erreur

  // ============ Like ============
  if (likeMode === LIKE_MODE.LIKE && !sauce.usersLiked.includes(userId)) {
    // Si le mode est "LIKE" et que l'utilisateur n'a pas déjà liké la sauce
    await sauce.updateOne({
      $inc: { likes: 1 }, // Incrémente le nombre de likes de la sauce
      $addToSet: { usersLiked: userId }, // Ajoute l'ID de l'utilisateur au tableau des utilisateurs qui ont liké la sauce
      $pull: { usersDisliked: userId }, // Retire l'ID de l'utilisateur du tableau des utilisateurs qui ont disliké la sauce
    });
  }
  // ============ Annulation ============
  else if (likeMode === LIKE_MODE.CANCEL) {
    // Si le mode est "CANCEL" (annulation du like/dislike)
    if (sauce.usersDisliked.includes(userId)) {
      // Si l'utilisateur est dans le tableau des utilisateurs qui ont disliké la sauce
      await sauce.updateOne({
        $inc: { dislikes: -1 }, // Décrémente le nombre de dislikes de la sauce
        $pull: { usersDisliked: userId }, // Retire l'ID de l'utilisateur du tableau des utilisateurs qui ont disliké la sauce
      });
    }
    if (sauce.usersLiked.includes(userId)) {
      // Si l'utilisateur est dans le tableau des utilisateurs qui ont liké la sauce
      await sauce.updateOne({
        $inc: { likes: -1 }, // Décrémente le nombre de likes de la sauce
        $pull: { usersLiked: userId }, // Retire l'ID de l'utilisateur du tableau des utilisateurs qui ont liké la sauce
      });
    }
  }
// ============ Dislike ============
else if (likeMode === LIKE_MODE.DISLIKE && !sauce.usersDisliked.includes(userId)) {
  // Si le mode est "DISLIKE" et que l'utilisateur n'a pas déjà disliké la sauce
  await sauce.updateOne({
    $inc: { dislikes: 1 }, // Incrémente le nombre de dislikes de la sauce
    $addToSet: { usersDisliked: userId }, // Ajoute l'ID de l'utilisateur au tableau des utilisateurs qui ont disliké la sauce
    $pull: { usersLiked: userId }, // Retire l'ID de l'utilisateur du tableau des utilisateurs qui ont liké la sauce
  });
}
return res.json({ message: sauce.likes || 0 }); // Retourne le nombre de likes de la sauce ou 0 si aucun like
};