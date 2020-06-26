require("dotenv").config()
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const auth = async (req,res,next)=>{
    try{
        const token = req.header("Authorization").split(" ")[1]; // get the token value in authorization header
        const decode  = jwt.verify(token,process.env.SECRET_KEY); // verifying the token and get the payload value
        const  user = await User.findOne({_id:decode._id,"tokens.token":token}) // find the user in database
        if(!user) throw new Error()
        req.token = token; // get the token data
        req.user = user; // send user data for further use on router
        next()
    }catch(e){
        res.status(401).send({"error":"Unauthorized access"})
    }
}

module.exports = auth;

// authentication with json web token

/*in order to get json web token from user , we need to use http Authorization header. This header value will be = Bearer "tokenvalue"
we can get this header data by using req.header. then verify data using token and secret key value. if verification successfully then
we successfully authenticate user. How ever, we can enhanced security by using finding if the user actually exist in database. By using
token payload value. verifying the token it's return the payload value. */
