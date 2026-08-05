const {createQueue,getAllQueues,getQueueById, updateQueue, deleteQueue, joinQueue, serveNextToken, getQueueStatus, getQueueHistory}= require("../services/queue.service");
const asyncHandler = require("../utils/asyncHandler");

const create = asyncHandler(async(req,res)=>{
    const queue = await createQueue(req.body);

    res.status(201).json({
        success:true, message:"Queue created successfully", queue,
    })
})

const getAll = asyncHandler(async(req,res)=>{
    const queues = await getAllQueues();
    res.status(200).json({
        success:true, count:queues.length, queues
    })
})

const getById = asyncHandler(async(req,res)=>{
    const queues = await getQueueById(req.params.id);
    res.status(200).json({
        success:true, queues
    })
})

const update = asyncHandler(async(req,res)=>{
    const queue = await updateQueue(
        req.params.id, req.body
    );
    res.status(200).json({
        success:true, message:"Queue updated successfully",queue,
    })
})

const remove = asyncHandler(async(req,res)=>{
    await deleteQueue(req.params.id);

    res.status(200).json({
        success:true, message:"Queue deleted successfully",
    })
})

const join = asyncHandler(async(req,res)=>{
    const result = await joinQueue(
        req.params.id, req.user._id
    );

    res.status(200).json({
        success:true,
        message:"Succesfully joined queue.",
        ...result,
    });
});

const next = asyncHandler(async(req,res)=>{
    const result = await serveNextToken(req.params.id);

    res.status(200).json({
        success:true, message:"Nexr customer served ",...result,
    })
})

const getStatus = asyncHandler(async(req,res)=>{
    const status = await getQueueStatus(req.params.id);
    res.status(200).json({
        success:true, data:status
    })
})

const getHistory = asyncHandler(async(req,res)=>{
    const history = await getQueueHistory(req.params.id);
    res.status(200).json({
        success:true, history,
    })
})

module.exports = {create,getAll, getById, update,remove,join,next,getStatus,getHistory};