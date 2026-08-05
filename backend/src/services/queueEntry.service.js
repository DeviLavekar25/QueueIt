const QueueEntry = require("../models/queueEntry.model");
const ApiError = require("../utils/ApiError");

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
    return queueEntry;
}

module.exports = {cancelQueueEntry,};