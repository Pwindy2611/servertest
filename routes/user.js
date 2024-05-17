import express from "express";
import {verifyToken,
    verifyTokenAndUserAuthorization,
    verifyTokenAndAdmin,} from "../controllers/middlewareControllers.js";
import userController from "../controllers/userControllers.js";

const router = express.Router();


//GET ALL USERS
router.get("/",verifyToken,userController.getAllUsers);

//DELETE USERS
router.delete("/:id",verifyTokenAndUserAuthorization,userController.deleteUser);

export default router;