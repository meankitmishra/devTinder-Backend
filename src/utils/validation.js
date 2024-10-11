const validator = require("validator");

const signUpValidation = (req)=>{
    const {firstName,lastName,emailId,password,gender,skills} = req.body;

    if(!firstName || !lastName){
        throw new Error("Enter first Name and Last Name");
    }
    if(firstName.length<3 || firstName.length>50){
        throw new Error("Enter a valid name");
    }
    if(!validator.isEmail(emailId)){
        throw new Error("Enter a valid email id");
    }
    if(!validator.isStrongPassword(password)){
        throw new Error("Enter a strong password")
    }
};

module.exports = {
    signUpValidation
}