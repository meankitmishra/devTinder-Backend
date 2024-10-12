const express = require("express");
const {userAuth} = require("../middlewares/auth.js"); 
const {validateEditProfile} = require("../utils/validation.js");
const bcrypt = require("bcrypt");
const profileRouter = express.Router();
// const User = require("../models/user.js")
const validator = require("validator");

profileRouter.get("/profile/view",userAuth , async(req,res)=>{
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("Error: "+error.message);
    }
    
})

profileRouter.patch("/profile/edit/" ,userAuth, async (req,res)=>{
    try {
        if(!validateEditProfile(req)){
            throw new Error("Invalid edit");
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach((key)=>(loggedInUser[key] = req.body[key]))
        await loggedInUser.save();
        res.json({status:"Success",
            message:"Profile updated successfully",
            data:loggedInUser
        });
    } catch (error) {
        res.status(400).send("Error: "+error.message);
    }
})

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
    try {
        const loggedInUser = req.user;

        if(req.body.oldPassword == req.body.newPassword){
            throw new Error("New Password cant be same as old Password")
        }

        const isPasswordCorrect = await loggedInUser.validatePassword(req.body.oldPassword);

        if(!isPasswordCorrect){
            throw new Error("Incorrect Credentials");
        }

        if(!validator.isStrongPassword(req.body.newPassword)){
            throw new Error("Enter a strong password")
        }

        loggedInUser.password = await bcrypt.hash(req.body.newPassword,15);
        await loggedInUser.save();
        res.json({status:"Success",
            message:"Password changed"
        });
    } catch (error) {
        res.status(400).json({status:"failed",
            message:"Eroor: "+error.message,
        })
    }
})

module.exports = profileRouter;