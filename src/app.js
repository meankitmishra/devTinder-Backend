const express = require("express");

const app = express();

app.use("/test",(req,res)=>{
    console.log("test");
    res.send("Hello, is the server working?");
});

app.use("/",(req,res)=>{
    console.log("hello");
    res.send("Welcome to our homepage!");
});

app.listen(7777,()=>{
    console.log("listening on port 7777");
});

