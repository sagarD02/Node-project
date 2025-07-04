const jwt = require('jsonwebtoken');
const User = require ("../models/user")


const userAuth = async(req,res,next) => {
    try {
        //read token from req cookies
        const {token} = req.cookies;
        if(!token){
            return res.status(401).send("Please Login !")
        }

        //validate the token
        const decodeObj = await jwt.verify(token,"DEV-SW@g@r",{expiresIn: "1d"});

        const{_id} = decodeObj;
        const user = await User.findById(_id);
        if(!user) {
            throw new Error("User not found")
        }

        req.user = user;

        //next handler
        next();

    } catch(err) {
        res.status(400).send("ERROR:" + err.message);
    }
   
    
}



module.exports ={userAuth}