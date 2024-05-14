const authController = require("../controllers/authControllers");

const router = require("express").Router();

//REGISTER

router.post('/register',authController.registerUser);

//LOGIN
router.post('/login',authController.loginUser);

module.exports = router;