const mongoose = require("mongoose")

const venueSchema = new mongoose.Schema({
    name:{
        type:String,
        required:[true,"Venue name is required"],
        trim:true,
    },
    address:{
        type:String,
        required:[true,"Adress is required."],
        trim:true
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Category",
        required:true,
    },
    admins:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
        },
    ],
    isActive:{
        type:Boolean,
        default:true,
    },

},{timestamps:true});

module.exports = mongoose.model("Venue",venueSchema);