const express = require("express");
const connectDB = require("./config/database.js");
// const User = require("./models/user.js");
// const {signUpValidation} = require("./utils/validation.js");
// const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
// const jwt = require("jsonwebtoken");
// const {userAuth} = require("./middlewares/auth.js");

const app = express();

app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth.js")
const profileRouter = require("./routes/profile.js");
const requestRouter = require("./routes/requests.js");
const userRouter = require("./routes/user.js");

app.use("/",authRouter);
app.use("/",profileRouter);
app.use("/",requestRouter);
app.use("/",userRouter);



connectDB()
    .then(()=>{
        console.log("Database connection establised");
        app.listen(7777,()=>{
            console.log("listening on port 7777");
        });
    })
    .catch((error)=>{
        console.error("Database cannot be connected!!")
    });