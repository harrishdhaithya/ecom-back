const express = require("express")
const { check, validationResult } = require("express-validator");
const router = express.Router();
const {signout, signup, signin, isSignedIn} = require("../controllers/auth.js");



router.post("/signup",[
    check("name","Name should be atleasr 3 char").isLength({min:3}),
    check("email","email is required").isEmail(),
    check("password","password should be at least 3 char").isLength({min:3})
],signup) 

router.post("/signin",[
    check("email","email is required").isEmail(),
    check("password","Enter the correct password").isLength({min:3})
],signin) 
router.get("/signout",signout);
router.get("/testroute",isSignedIn,(req,res)=>{
    res.json(req.profile);
})

module.exports = router;