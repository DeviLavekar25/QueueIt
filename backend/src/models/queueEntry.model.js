const mongoose = require("mongoose")

const queueEntrySchema = new mongoose.Schema(
    {
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true,
        },
        queue:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Queue",
            required:true,
        },
        tokenNumber:{
            type:Number,
            required:true,
        },
        status:{
            type:String,
            enum:["waiting","served","cancelled","skipped"],
            default:"waiting",
        },
        joinedAt:{
            type:Date,
            default:Date.now,
        },
        servedAt:{
            type:Date,
            default:null,
        },
    },{timestamps:true}
);

module.exports = mongoose.model("QueueEntry", queueEntrySchema);
