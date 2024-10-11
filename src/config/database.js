const mongoose = require("mongoose");
const MongoDBuri = require("../Constant.js")
const connectDB = async ()=>{
    await mongoose.connect(MongoDBuri);
};

module.exports = connectDB;
