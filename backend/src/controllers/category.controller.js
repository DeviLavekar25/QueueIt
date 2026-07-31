const {createCategory, getAllCategories, getCategoryById, updateCategory, deleteCategory} = require("../services/category.service")
const asyncHandler = require("../utils/asyncHandler");

const create = asyncHandler(async(req,res)=>{
  
        const category = await createCategory(req.body);
        res.status(201).json({
            success:true, message:"Category created successfully.",category,
        });

});

const getAll = asyncHandler(async(req,res)=>{

        const categories = await getAllCategories();

        res.status(200).json({
            success:true, count:categories.length, categories,
        })

});

const getById = asyncHandler(async(req,res)=>{

        const category = await getCategoryById(req.params.id);

        res.status(200).json({
            success:true, category
        })

});

const update = asyncHandler(async(req,res)=>{
   
       const category = await updateCategory(req.params.id, req.body);
       res.status(200).json({
        success:true, message:"Category updated successfully."
       });
});

const remove = asyncHandler(async(req,res)=>{

       await deleteCategory(req.params.id);
       res.status(200).json({
        success:true, message:"Category deleted successfully",
       })

});

module.exports = {create,getAll,getById, update, remove};