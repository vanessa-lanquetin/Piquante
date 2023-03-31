const Sauce = require("../models/sauce");
const fs = require("fs-extra");

exports.createSauce = (req, res) => {
  const newSauce = JSON.parse(req.body.sauce);
  delete newSauce._id;
  delete newSauce._userId;
  console.log(newSauce);

  const sauce = new Sauce({
    ...newSauce,
    userId: req.auth.userId,
    imageUrl: `${req.protocol}://${req.get("host")}/images/${
      req.file.filename
    }`,
  });
  sauce
    .save()
    .then(() => res.status(201).json({ message: "Sauce créé !" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.getAllSauces = (req, res) => {
  Sauce.find()
    .then((sauces) => res.status(200).json(sauces))
    .catch((error) => res.status(400).json({ error }));
};

exports.getOneSauce = (req, res, next) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => res.status(200).json(sauce))
    .catch((error) => res.status(404).json({ error }));
};

exports.modifySauce = (req, res) => {
  // verify image
  if (req.file) {
    Sauce.findOne({ _id: req.params.id })
      .then((sauce) => {
        if (sauce && sauce.imageUrl) {
          const filename = sauce.imageUrl.split("/images")[1];

          fs.unlink(`images/${filename}`, (err) => {
            if (err) throw err;
          });
        }
      })
      .catch((error) => res.status(400).json({ error }));
  } else {
  }

  const sauceObject = req.file
    ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get("host")}/images/${
          req.file.filename
        }`,
      }
    : { ...req.body };

  Sauce.updateOne(
    { _id: req.params.id },
    { ...sauceObject, _id: req.params.id }
  )
    .then(res.status(200).json({ message: "Sauce modifiée" }))
    .catch((error) => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res) => {
  Sauce.findOne({ _id: req.params.id })
    .then((sauce) => {
      if (sauce && sauce.imageUrl) {
        const filename = sauce.imageUrl.split("/images")[1];

        fs.unlink(`images/${filename}`, (err) => {
          if (err) throw err;
        });
      }
      Sauce.deleteOne({ _id: req.params.id })
        .then(() => res.status(200).json({ message: "Sauce supprimée" }))
        .catch((error) => res.status(400).json({ error }));
    })
    .catch((error) => res.status(400).json({ error }));
};
