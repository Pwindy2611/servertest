const userController = require("../controllers/userControllers");

const router = require("express").Router();


//GET ALL USERS
router.get("/",userController.getAllUsers);

//DELETE USERS
router.get("/:id")
module.exports = router;