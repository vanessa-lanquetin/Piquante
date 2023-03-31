const express = require("express");
const router = express.Router();

// controller de user
const userController = require("../controllers/user.js");

// routes pour le functions
router.post("/auth/signup", userController.signup);
router.post("/auth/login", userController.login);

/*

api/auth/signup 


*/

module.exports = router;
