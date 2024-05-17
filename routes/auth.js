import express from "express";
import authController from "../controllers/authController.js";
import {verifyToken,
    verifyTokenAndUserAuthorization,
    verifyTokenAndAdmin,} from "../controllers/middlewareControllers.js";

const router = express.Router();

//REGISTER

router.post('/register',authController.registerUser);

//LOGIN
router.post('/login',authController.loginUser);

//REFRESH
router.post('/refresh',authController.requestRefreshToken);

//LOGOUTlo
router.post('/logout',verifyToken,authController.logoutUser);

export default router;