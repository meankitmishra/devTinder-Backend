const express = require("express");
const { signUpValidation } = require("../utils/validation.js");
const User = require("../models/user.js");
const bcrypt = require("bcrypt");
const { userAuth } = require("../middlewares/auth.js");

const authRouter = express.Router();


authRouter.post("/signup",async (req,res)=>{
    // const { firstName, lastName, emailId, password, age, gender } = req.body;
    try {
        //validation 
        signUpValidation(req);
        //encrypt password
        const {firstName,lastName,emailId,password,gender} = req.body;
        const passwordHash = await bcrypt.hash(password,15);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password:passwordHash,
            gender
        });
        await user.save();
        res.send("user added successfully");
    } catch (err) {
        res.status(400).send("user not added "+ err.message);
    }
    
});

authRouter.post("/login", async (req,res)=>{
    try {
        const {emailId,password} = req.body;
        //checking if email is present 
        const isOldUser = await User.findOne({emailId}) ;
        if(!isOldUser){
            throw new Error("Invalid Credentials");
        }
        //validating password
        const isPasswordValid = await isOldUser.validatePassword(password);

        if(isPasswordValid){
            // create JWT Token 
            const token = await isOldUser.getJWT();

            //Add the Token to the cookie

            res.cookie("token",token);
            res.send("Login successful")
        }else{
            throw new Error("Invalid Credentials")
        }
    } catch (error) {
        res.status(400).send("Error: "+error.message);
    }
});

authRouter.post("/logout",userAuth,async(req,res)=>{
    try {
        const user = req.user;
        res.cookie("token", null ,{
            expires:new Date(Date.now())
        });
        res.send("Logged out successfully");
    } catch (error) {
        
    }
})


module.exports = authRouter;