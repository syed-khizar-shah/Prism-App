const express = require("express");
const { loginUser, registerUser, getUsers } = require("../controllers/user");
const authMiddleware = require("../middleware/auth");

const router = express.Router();

router.post("/login",loginUser);
router.post("/register",registerUser);
// router.get("/",getUsers);
router.get("/verify",authMiddleware,(req,res)=>{
    res.json({user:req.user});
})


module.exports = router;