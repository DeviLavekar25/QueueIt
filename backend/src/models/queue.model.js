const mongoose = require("mongoose")

const queueSchema = new mongoose.Schema(
    {
        venue:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"Venue",
            required:true,
        },
        serviceName:{
            type:String,
            required:[true,"Service name is required."],
            trim:true,
        },
        currentToken:{
            type:Number,
            default:0,
        },
        lastToken:{
            type:Number,
            default:0,
        },
        status:{
            type:String,
            enum:["open","closed"],
            default:"open",
        },
        estimatedServiceTime:{
            type:Number,
            default:5,
            min:[1,"Estimated service time must atleast be 1 minute"],
        },
    },{timestamps:true}
);

module.exports = mongoose.model("Queue",queueSchema);