const express = require("express");
const {userAuth} = require("../middlewares/auth.js"); 
const profileRouter = express.Router();

profileRouter.get("/profile/view",userAuth , async(req,res)=>{
    try {
        const user = req.user;
        res.send(user)
    } catch (error) {
        res.status(400).send("Error: "+error.message);
    }
    

})

profileRouter.patch("/profile/edit/:userId" , async (req,res)=>{
    
})

profileRouter.patch("/profile/password",userAuth,async (req,res)=>{
    
})



module.exports = profileRouter;