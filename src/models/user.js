const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
    firstName:{
        type: String
    },
    lastName:{
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique:true,
        lowercase:true,
        trim:true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Not a valid Email");
            }
        }
    },
    password:{
        type: String,
        required: true,
        minLentgh:8,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Not a strong password");
            }
        }
    },
    age:{
        type: Number,
        min:18
    },
    gender:{
        type:String,
        validate(value){
            if(!["male","female","others"].includes(value)){
                throw new Error("Gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String
    },
    about:{
        type:String,
        default:"Hey I am new on devTinder"
    },
    skills:{
        type:[String]
    }
},{
    timestamps:true
})
userSchema.methods.getJWT = async function(){
    const user = this;
    const token = await jwt.sign({_id:user._id},"ThisisMessedUp@25",{
        expiresIn:"7d"
    });
    return token;
}

userSchema.methods.validatePassword = async function(passwordInoutByUser){
    const user = this;
    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(passwordInoutByUser,passwordHash);
    return isPasswordValid;
}
const User = mongoose.model("User", userSchema);

module.exports = User;
