const QueueEntry = require("../models/queueEntry.model");
const ApiError = require("../utils/ApiError");
const Queue = require("../models/queue.model")
const {getIO} = require("../sockets/socket")

const cancelQueueEntry = async(queueEntryId,userId)=>{

    const queueEntry = await QueueEntry.findById(queueEntryId);
    if(!queueEntry){
        throw new ApiError(404,"Queue entry not found.")
    }
    if(queueEntry.user.toString() !== userId.toString()){
        throw new ApiError(403,"You are not allowed to cancel this queue entry.")
    }
    if(queueEntry.status==="served"){
        throw new ApiError(400,"This token has already been served.")
    }
    if(queueEntry.status==="cancelled"){
        throw new ApiError(400,"Queue entry is already cancelled.")
    }

    queueEntry.status="cancelled";
    await queueEntry.save();

    const peopleWaiting = await QueueEntry.countDocuments({
        queue:queueEntry.queue,
        status:"waiting"
    });

    const queue = await Queue.findById(queueEntry.queue);
    if(!queue){
        throw new ApiError(404,"Queue not found");
    }

    const io = getIO();

    io.to(`queue_${queue._id}`).emit("queueUpdated",{
        queueId:queue._id,
        currentToken:queue.currentToken,
        lastToken:queue.lastToken,
        peopleWaiting,
    })

    return queueEntry;
}

const getMyQueue = async(userId)=>{
    const queueEntry = await QueueEntry.findOne({
        user:userId,
        status:"waiting",
    })
      .populate({
        path:"queue",
        populate:{
            path:"venue",
            select:"name address",
        },
      })
      .sort({joinedAt:-1});

      if(!queueEntry){
        throw new ApiError(404,"You are not currently in any queue.")
      }
    return queueEntry;
    
}

module.exports = {cancelQueueEntry,getMyQueue};