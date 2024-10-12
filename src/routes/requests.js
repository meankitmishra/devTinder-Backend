const express = require("express");
const {userAuth} = require("../middlewares/auth.js");
const ConnectionRequest = require("../models/connectionRequest.js");
const User = require("../models/user.js");

const requestRouter = express.Router();

requestRouter.post("/request/send/:status/:toUserId", userAuth , async(req,res)=>{
    try {
        const toUserId = req.params.toUserId;
        const fromUserId = req.user._id;
        const status = req.params.status;
        const allowedStatus = ["ignored","interested"];
        const isValidStatus = allowedStatus.includes(status);
        if(!isValidStatus){
            throw new Error("The status is not valid");
        }
        const isValidUser = await User.findById(toUserId);
        if(!isValidUser){
            throw new Error("The requested user is not valid");
        }

        // if(toUserId.equals(fromUserId)){
        //     throw new Error("Cannot send request to ourself")
        // } checked on schema level using .pre()
        
        const isExistingRequest = await ConnectionRequest.findOne({
            $or:[
                { fromUserId,toUserId },
                { fromUserId:toUserId, toUserId:fromUserId }
            ]
        })
        if(isExistingRequest){
            throw new Error("Connection request already exists")
        }
        const connectionRequest = new ConnectionRequest({
            toUserId,
            fromUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({status:"success",
            message:`connection request successfully ${status}`,
            data
        });
    } catch (error) {
        res.status(400).json({status:"failed",
            message:"Error: "+error.message,
        });
    }
});

requestRouter.post("/request/review/accepted/:requestId" , userAuth, async(req,res)=>{
    
})





module.exports = requestRouter;
