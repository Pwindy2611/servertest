const authController = require("../controllers/authControllers");
const middlewareController = require("../controllers/middlewareControllers");

const router = require("express").Router();

//REGISTER

router.post('/register',authController.registerUser);

//LOGIN
router.post('/login',authController.loginUser);

//REFRESH
router.post('/refresh',authController.requestRefreshToken);

//LOGOUTlo
router.post('/logout',middlewareController.verifyToken,authController.logoutUser);

module.exports = router;