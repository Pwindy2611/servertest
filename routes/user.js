import express from "express";
import middlewareController from "../controllers/middlewareControllers.js";
import userController from "../controllers/userControllers.js";

const router = express.Router();


//GET ALL USERS
router.get("/",middlewareController.verifyToken,userController.getAllUsers);

//DELETE USERS
router.delete("/:id",middlewareController.verifyTokenAndAdminAuth,userController.deleteUser);

export default router;