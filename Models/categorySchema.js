const mongoose = require("mongoose");
const categorySchema = new mongoose.Schema({
    categoryTitle:{
        type:String,
        required:[true, "Category title must be required"]
    },
    categoryImage:{
        type:String, 
        required:[true , "Category image must be required"]
    }
} , {
    timestamps:true
});

const Category = mongoose.model("Category" , categorySchema);
module.exports = Category;

