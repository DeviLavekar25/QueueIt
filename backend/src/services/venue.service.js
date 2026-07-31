const Venue = require("../models/venue.model")
const Category = require("../models/category.model")
const ApiError = require("../utils/ApiError");

const createVenue = async ({name,address,category,})=>{
    const existingCategory = await Category.findById(category);

    if(!existingCategory){
        throw new ApiError(404,"Category not found");
    }

    const existingVenue = await Venue.findOne({name});
    if(existingVenue){
        throw new ApiError(409,"Venue already exists");
    }

    const venue = await Venue.create({
        name,
        address,category,
    });

    return venue;
};

const getAllVenues = async()=>{
    const venues = await Venue.find().populate({path:"category",select:"name description"}).sort({name:1});

    return venues;
}

const getVenueById = async(id)=>{
    const venue = await Venue.findById(id).populate({
        path:"category", select:"name description"
    })
    .populate({
        path:"admins", select:"name email"
    });

    if(!venue){
        throw new ApiError(404,"Venue not found");
    }
    return venue;
}

const updateVenue = async(id,data)=>{
    const existingVenue = await Venue.findById(id);
    if(!existingVenue){ throw new ApiError(404,"Venue not found");}

    if(data.category){
        const existingCategory = await Category.findById(data.category);
        if(!existingCategory){
            throw new ApiError(404,"category not found");
        }
    }

    const updatedVenue = await Venue.findByIdAndUpdate(
        id,data,{
            new:true, runValidators:true,
        }
    ).populate({
        path:"category", select:"name description",
    })
    .populate({
        path:"admins",select:"name email",
    });

    return updatedVenue;
}

const deleteVenue = async(id)=>{
    const venue = await Venue.findByIdAndDelete(id);
    if(!venue){ 
        throw new ApiError(404,"Venue not found");
    }
    return;
}

module.exports = {createVenue,getAllVenues, getVenueById, updateVenue, deleteVenue};

