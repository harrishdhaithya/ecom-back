const User = require("../models/user.js")
const { check, validationResult } = require("express-validator");
const jwt = require("jsonwebtoken")
const expressJwt = require("express-jwt")

exports.signup = (req,res)=>{

    const errors = validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        });
    }

    const user = new User(req.body);
    user.save((err,regUser)=>{
        if(err){
            return res.status(400).json({
                error:"Not able to save user"
            });
        }else{
            res.json({
                name:regUser.name,
                email:user.email,
                id:user._id
            });
        }
    });

}



exports.signin = (req,res)=>{
    const {email,password}=req.body;
    // console.log(email+" "+password)
    const errors = validationResult(req)
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        });
    }
    User.findOne({email:email},(err,user)=>{
        // console.log(user)
        if(err||!user){
            return res.status(400).json({
                error:"USER email does not exist"
            })
        }
        if(!user.authenticate(password)){
            return res.status(401).json({
                error:"Email and password do not match"
            })
        }
        //CREATE TOKEN 
        const token = jwt.sign({_id:user._id},process.env.SECRET)
        //PUT TOKEN IN COOKIE
        res.cookie("token",token,{expire:new Date()+9999})

        //send response to front end
        const {_id,name,email,role} = user;
        return res.json({token:token,user:{_id,name,email,role}});
    })

}

exports.signout = (req,res)=>{
    res.clearCookie("token");
    return res.json({
        message: "User signout success"
    });
}


//protected routes

exports.isSignedIn=expressJwt({
    secret:process.env.SECRET,
    requestProperty:"auth",
    algorithms:["HS256"]
});

//Custom middleware
exports.isAuthenticated = (req,res,next)=>{
    let checker = req.profile && req.auth && req.profile._id == req.auth._id;
    if(!checker){
        return res.status(403).json({
            error: "ACCESS DENIED"
        });
    }
    next();
}
exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0){
        return res.status(403).json({
            error: "You are not allowed to access Admin"
        })
    }
    next();
}