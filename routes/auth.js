import express from "express";
import authController from "../controllers/authControllers.js";
import middlewareController from "../controllers/middlewareControllers.js";

const router = express.Router();

//REGISTER

router.post('/register',authController.registerUser);

//LOGIN
router.post('/login',authController.loginUser);

//REFRESH
router.post('/refresh',authController.requestRefreshToken);

//LOGOUTlo
router.post('/logout',middlewareController.verifyToken,authController.logoutUser);

export default router;