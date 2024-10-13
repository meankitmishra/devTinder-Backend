const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const userRouter = express.Router();

userRouter.get("/user/requests", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;

        const connectionRequests = await ConnectionRequest.find({
            toUserId:loggedInUser._id,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","skills","about"])

        res.json({message:"Connection requests fetched",
            connectionRequests
        })

    } catch (err) {
        res.status(400).json({message:"Error: "+err.message});
    }
})

userRouter.get("/user/connections",userAuth ,async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            $or: [{toUserId: loggedInUser._id, status:"accepted"},
                {fromUserId:loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",["firstName","lastName","photoUrl","age","gender","skills","about"])
        .populate("toUserId",["firstName","lastName","photoUrl","age","gender","skills","about"]);

        const data = connectionRequests.map((users)=>{
            if(users.fromUserId._id.toString()=== loggedInUser._id.toString()){
                return users.toUserId;
            }
            return users.fromUserId;
        })
        res.json({message:"Connection fetched",data})
    } catch (err) {
        res.status(400).send({ message: "Error: "+ err.message });
    }
})

userRouter.get("/user/feed" ,userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page)||1;
        let limit =parseInt(req.query.limit)||10;
        limit=limit>20?10:limit;
        const skip = (page-1)*limit;

        const collectionRequest = await ConnectionRequest.find({
            $or:[
                {toUserId:loggedInUser._id},
                {fromUserId:loggedInUser._id}
            ]
        }).select("toUserId fromUserId");

        const hideUserFromFeed = new Set();
        collectionRequest.forEach((data)=>{
            hideUserFromFeed.add(data.toUserId.toString());
            hideUserFromFeed.add(data.fromUserId.toString());
        });

        const user = await User.find({
            $and:[{_id: {$nin: Array.from(hideUserFromFeed)}},{_id: {$ne:loggedInUser._id}}]
        }).select(["firstName","lastName","photoUrl","age","gender","skills","about"]).skip(skip).limit(limit)
        
        res.json(user)
    } catch (err) {
        res.status(400).send({ message: "Error: "+ err.message });
    }
})

module.exports = userRouter;