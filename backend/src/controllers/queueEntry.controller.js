const asyncHandler = require("../utils/asyncHandler")
const {cancelQueueEntry} = require("../services/queueEntry.service");

const cancel = asyncHandler(async(req,res)=>{
    const result = await cancelQueueEntry(req.params.id, req.user._id);
    res.status(200).json({
        success:true, message:"Queue entry cancelled successfully", queueEntry: result,
    })
})

module.exports = {cancel,}