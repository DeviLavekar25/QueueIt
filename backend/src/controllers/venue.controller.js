const {createVenue, getAllVenues, getVenueById, updateVenue, deleteVenue} = require("../services/venue.service");
const asyncHandler = require("../utils/asyncHandler");

const create = asyncHandler(async(req,res)=>{
    const venue = await createVenue(req.body);
    
    res.status(201).json({
        success:true, message:"Venue created successfully", venue,
    })
})

const getAll = asyncHandler(async(req,res)=>{
    const venues = await getAllVenues();

    res.status(200).json({
        success:true, count:venues.length, venues,
    })
})

const getById = asyncHandler(async(req,res)=>{
    const venue = await getVenueById(req.params.id);
    res.status(200).json({
        success:true, venue,
    })
})

const update = asyncHandler(async(req,res)=>{
    const venue = await updateVenue(
      req.params.id, req.body
    );

    res.status(200).json({
        success:true, message:"Venue updated successfully", venue,
    })
})

const remove = asyncHandler(async(req,res)=>{
    await deleteVenue(req.params.id);

    res.status(200).json({
        success:true, message:"Venue deleted successfully",
    })
})

module.exports={create, getAll, getById, update, remove}