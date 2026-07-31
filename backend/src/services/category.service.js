const Category = require("../models/category.model");
const ApiError = require("../utils/ApiError");

const createCategory = async ({name,description})=>{
    const existingCategory = await Category.findOne({name});
    if(existingCategory){
        throw new ApiError(409,"Category already exists.");
    }

    const category = await Category.create({name,description});

    return category;   
};

const getAllCategories = async() =>{
    const categories = await Category.find().sort({name:1});

    return categories;
}

const getCategoryById = async(id)=>{
    const category = await Category.findById(id);
    if(!category){
        throw new ApiError(404,"Category not found");
    }
    return category;
}

const updateCategory = async(id,data)=>{
    const category = await Category.findByIdAndUpdate(id,data,{
        new:true, runValidators:true,
    });
    if(!category){
        throw new Error("Category not found");
    }
    return category;
}

const deleteCategory = async(id)=>{
    const category = await Category.findByIdAndDelete(id);
    if(!category){
        throw new Error("Category not found");
    }
    return category;
}

module.exports = {createCategory,getAllCategories, getCategoryById, updateCategory, deleteCategory};