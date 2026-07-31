const Queue = require("../models/queue.model")
const Venue = require("../models/venue.model")
const ApiError = require("../utils/ApiError")

//reusable populate fucntion
const queuePopulate={
    path:"venue", select:"name address",
    populate:{
        path:"category", select:"name",
    },
};

const createQueue = async({venue, serviceName, estimatedServiceTime,})=>{
    const existingVenue = await Venue.findById(venue);
    if(!existingVenue){
        throw new ApiError(404,"Venue not found");
    }

    const existingQueue = await Queue.findOne({
        venue, serviceName,
    });

    if(existingQueue){
        throw new ApiError(409,"Queue already exists for this service.")
    }

    const queue = await Queue.create({venue,serviceName,estimatedServiceTime,});

    return queue;
}

const getAllQueues = async()=>{
    const queues = await Queue.find().populate(queuePopulate).sort({createdAt: -1});

    return queues;
}

const getQueueById = async(id)=>{
    const queue = await Queue.findById(id).populate(queuePopulate);
    
    if(!queue){
        throw new ApiError (404,"Queue not found")
    }
    
    return queue;
}

const updateQueue = async(id,data)=>{
    const existingQueue = await Queue.findById(id);

    if(!existingQueue){
        throw new ApiError(404,"Queue not found");
    }

    if(data.venue){
        const existingVenue = await Venue.findById(data.venue);
        if(!existingVenue){
            throw new ApiError(404,"Venue not found");
        }
    }
    
    //prevent duplicate service names within the same venue
    if(data.serviceName || data.venue){
        const venueId = data.venue || existingQueue.venue;
        const serviceName = data.serviceName || existingQueue.serviceName;

        const duplicateQueue = await Queue.findOne({
            venue:venueId, serviceName, _id:{$ne:id},
        });

        if(duplicateQueue){
            throw new ApiError(409,"Another Queue with this service already exists for this venue.");
        }
    }

    const updatedQueue = await Queue.findByIdAndUpdate(
        id, data,{new:true, runValidators:true}
    ).populate(queuePopulate);

    return updatedQueue;

}

const deleteQueue = async(id)=>{
    const queue = await Queue.findByIdAndDelete(id);
    if(!queue){
        throw new ApiError(404,"Queue not found");
    }
}

module.exports = {createQueue,getQueueById, getAllQueues, updateQueue, deleteQueue};