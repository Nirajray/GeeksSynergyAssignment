const express= require("express")
const router = express.Router();
const userController= require("../Controller/userController")
const mid= require("../Middleware/auth")


// register user
router.post("/registerUser", userController.createUser)

// Login user
router.post("/Login", userController.login)

//get list of all users
router.get("/getUsers", mid.authentication, userController.getUser)

//Update users according to their fields
router.put("/updateUser/:userId", mid.authentication, mid.authorization, userController.updateUser )

//Delete user
router.delete("/deleteUser/:userId", mid.authentication, mid.authorization, userController.deleteUser)


module.exports=router