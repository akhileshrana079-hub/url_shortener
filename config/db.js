const mongoose = require('mongoose');

const connectedDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB Connnected');
    }catch(error){
        console.log('MongoDB Connection Error',error);
        process.exit(1);
    }
};

module.exports = connectedDB;