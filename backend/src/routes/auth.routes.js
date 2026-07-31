const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
const {protect,authorize} = require("../middleware/auth.middleware")

router.post("/register",authController.register);
router.post("/login",authController.login);
router.get("/profile",protect,authController.getProfile);

router.get("/admin-test",protect,authorize("admin"),(req,res)=>{
    res.json({success:true, message:"Welcome admin", user:req.user})
})

module.exports = router;

