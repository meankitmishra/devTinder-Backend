const jwt = require("jsonwebtoken");
const User = require("../models/user.js");

const userAuth = async (req,res,next)=>{
    try {
        const cookies = req.cookies;
        const { token } = cookies;
        if(!token){
            throw new Error("Please Login");
        }
        const decodedMessage = await jwt.verify(token,"ThisisMessedUp@25");
        const {_id} = decodedMessage;
        const user = await User.findById(_id);
        if(!user){
            throw new Error("User not found");
        }
        req.user = user;
        next();
    } catch (error) {
        res.status(400).send("Error: "+error.message);
    }
}
module.exports = {
    userAuth,
};