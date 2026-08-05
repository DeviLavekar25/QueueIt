const Queue = require("../models/queue.model")
const Venue = require("../models/venue.model")
const QueueEntry = require("../models/queueEntry.model")
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

const joinQueue = async(queueId, userId)=>{
    const queue = await Queue.findById(queueId);
    if(!queue){
        throw new ApiError(404,"Queue not found");
    }
    if(queue.status==="closed"){
        throw new ApiError(400,"Queue is currently closed")
    }
    
    const existingEntry= await QueueEntry.findOne({
        queue:queueId, user:userId, status:"waiting",
    })
    if(existingEntry){
        throw new ApiEror(409,"You are already in this queue.")
    }

    const tokenNumber = queue.lastToken + 1;
    queue.lastToken = tokenNumber;

    await queue.save();

    const queueEntry = await QueueEntry.create({
        queue:queueId, user:userId, tokenNumber, status:"waiting",
    })

    const position = tokenNumber - queue.currentToken - 1;
    const estimatedWaitTime = position * queue.estimatedServiceTime;
    return{
        queueEntry, tokenNumber, position, estimatedWaitTime,
    };
}

const serveNextToken = async(queueId)=>{
    const queue = await Queue.findById(queueId);
    if(!queue){
        throw new ApiError(404,"Queue not found")
    };
    const nextEntry = await QueueEntry.findOne({
        queue:queueId, status:"waiting"
    }).sort({tokenNumber:1,})

    if(!nextEntry){
        throw new ApiError(400,"No customers waiting in the queue.")
    }

    nextEntry.status="served";
    nextEntry.servedAt= new Date();

    await nextEntry.save();

    queue.currentToken = nextEntry.tokenNumber;
    await queue.save();

    return{
        servedToken:nextEntry.tokenNumber,
        queueEntry:nextEntry,
    };

}

const getQueueStatus = async(queueId)=>{
    const queue = await Queue.findById(queueId).populate(queuePopulate);
    if(!queue){
        throw new ApiError(404,"Queue not found")
    }
    const peopleWaiting = await QueueEntry.countDocuments({
        queue:queueId,
        status:"waiting"
    });

    return{
        serviceName: queue.serviceName,
        venue:queue.venue,
        currentToken: queue.currentToken,
        lastToken:queue.lastToken,
        peopleWaiting,
        estimatedServiceTime:queue.estimatedServiceTime,
        status:queue.status
    }
}

const getQueueHistory = async(queueId)=>{
    const queue = await Queue.findById(queueId);
    if(!queue){
        throw new ApiError(404,"Queue not found")
    }
    const history = await QueueEntry.find({
        queue:queueId
    }).populate("user","name email").sort({
        tokenNumber:1
    })
    return history;
}

module.exports = {createQueue,getQueueById, getAllQueues, updateQueue, deleteQueue, joinQueue, serveNextToken,getQueueStatus, getQueueHistory};