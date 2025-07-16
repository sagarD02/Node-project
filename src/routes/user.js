const express  = require('express');
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest =  require("../models/connectionReqest")
const userRouter = express.Router();
const User = require("../models/user");

const USER_SAFE_DATA="firstName lastName photoUrl age gender about skills"
//get all pending request for logged in user
userRouter.get("/user/requests/received", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;

        const connectRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status:'interested'
        }).populate("fromUserId", USER_SAFE_DATA)

        res.json({
            message:"Data Fetch Successfully",
            data: connectRequests,
        })

    } catch(err){
        res.statusCode(400).send("Error "+ err.message)
    }
})

//fetch people connected(Connections)
userRouter.get("/user/connections", userAuth, async(req,res)=>{
   try {
    const loggedInUser = req.user;

    const connectionReqests = await ConnectionRequest.find({
        $or: [
            {toUserId: loggedInUser._id, status:"accepted"},
            {fromUserId: loggedInUser._id, status:"accepted"}
        ]
    }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",["firstName","lastName","skills","age","photoUrl"])

    const userData = connectionReqests.map(row=>{
        if(row.fromUserId._id.toString() === loggedInUser._id.toString()){
          return row.toUserId;
        }

        return row.fromUserId;
    })
    res.json({data:userData})

   } catch(err) {
    res.status(400).send("Error" + err.message)
   }
})

userRouter.get("/feed", userAuth, async(req,res)=>{
    try {
        const loggedInUser = req.user;

        const page = parseInt(req.query.page) ||1;
        let limit = parseInt(req.query.limit) ||10;
        const skip = (page-1)*limit;
         
        limit = limit >50 ? 50 :limit;


        const connectionRequests = await ConnectionRequest.find({
            $or:[{fromUserId: loggedInUser._id},{toUserId :loggedInUser._id}]
        }).select("fromUserId toUserId");

        const hideUsersFromFeed = new Set();
        connectionRequests.forEach(req =>{
            hideUsersFromFeed.add(req.fromUserId?.toString());
            hideUsersFromFeed.add(req.toUserId?.toString());
        })  

        const users = await User.find({
           $and:[{_id:{$nin: Array.from(hideUsersFromFeed)}},{ _id: {$ne:loggedInUser._id}}] 
        }).select(USER_SAFE_DATA).skip(skip).limit(limit);

        res.json({data: users})

    } catch(err){
        res.status(400).send('Error' + err.message)
    }
})

module.exports = userRouter;
