const express= require("express")
const router = express.Router();
const userController= require("../Controller/userController")


router.post("/RegisterUser", userController.createUser)
router.post("/Login", userController.login)
router.get("/getUsers", userController.getUser)
router.put("/updateUser",userController.updateUser )
router.delete("/deleteUser",userController.deleteUser)

module.exports=router