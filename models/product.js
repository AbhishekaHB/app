const mongoose = require('mongoose');

const products = new mongoose.Schema({
    productname : {
       type : String,
       required : true 
    },
    productid : {
        type : String,
        required : true 
     },
     productsubid : {
        type : String,
        required : true 
     },
    date : {
        type : Date,
        default : Date.now
    },
    duedate : {
        type : Date,
    }
})

module.exports = mongoose.model('products',products);