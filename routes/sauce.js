const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");
const multer = require("../middleware/multer-config");

// controller de sauce
const sauceController = require("../controllers/Sauce");

// create one sauce
router.post("/sauces", auth, multer, sauceController.createSauce);
// get all sauces
router.get("/sauces", auth, sauceController.getAllSauces);
// get une sauce
router.get("/sauces/:id", auth, sauceController.getOneSauce);
// modifier une sauce
router.put("/sauces/:id", auth, multer, sauceController.modifySauce);

router.delete("/sauces/:id", auth, multer, sauceController.deleteSauce);


module.exports = router;
