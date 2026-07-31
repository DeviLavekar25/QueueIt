const jwt = require("jsonwebtoken");  //creates and verifies tokens

const generateToken = (userId) =>{
    return jwt.sign(
        {
            id:userId,
        },
        process.env.JWT_SECRET,
        {
            expiresIn:"7d",
        }
    );
};


module.exports= generateToken;