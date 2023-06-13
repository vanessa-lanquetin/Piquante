const express = require("express");
const router = express.Router();

// controller de user
const userController = require("../controllers/user.js");

// routes pour inscription et connexion
router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);


module.exports = router;
