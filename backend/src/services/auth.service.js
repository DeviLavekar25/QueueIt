const User= require("../models/user.model")
const generateToken = require("../utils/generateToken")
const ApiError = require("../utils/ApiError");

const registerUser = async({name,email,password})=>{
    const exists = await User.findOne({email});
    if(exists){
        throw new ApiError(409, "User already exists");
    }

    const user = await User.create({
        name,email,password
    });

    return{
        user:{
            id:user._id,
            name:user.name,
            email:user.email,
            role:user.role
        },
        token:generateToken(user._id)
    };
};

const loginUser = async({email,password}) =>{
    const user = await User.findOne({email}).select("+password");
    if(!user){
        throw new ApiError(401,"Ïnvalid email or password");
    }

    const isMatch = await user.comparePassword(password);
    if(!isMatch){
        throw new ApiError(401,"Invalid email or password")
    }

    return {
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        token: generateToken(user._id)
    };   
};

const getProfile = async(userId)=>{
    const user = await User.findById(userId);
    if(!user){
        throw new ApiError(404,"User not found.")
    }
    return{
        id:user._id,
        name:user.name,
        email:user.email,
        role:user.role,
        history:user.history
    }
}

module.exports = {
    registerUser,loginUser, getProfile
};
