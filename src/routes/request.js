const express = require('express');
const {userAuth} = require("../middlewares/auth");
const ConnectionRequest =  require("../models/connectionReqest")
const User = require("../models/user");
const requestRouter =express.Router();
requestRouter.post("/request/send/:status/:toUserId", userAuth,async(req,res) => {
    try {
        const fromUserId = req.user.id;
        const toUserId = req.params.toUserId;
        const status = req.params.status;

        const allowedStatus = ['ignored', 'interested'];
        if(!allowedStatus.includes(status)){
            return res.status(400).status({
                message:"Invalid Status Type "+ status
            })
        }

        const toUser = await User.findById(toUserId)
        if(!toUser){
            return res.status(400).json({message:"User Not found"})
        }
        //check there is request exist or pending
        const existingConnectionReq = await ConnectionRequest.findOne({
            $or:[
                //already exist
                {fromUserId,toUserId},
                //or
                {fromUserId:toUserId, toUserId:fromUserId}
            ]
        })

        if(existingConnectionReq){
            throw new Error("Connection already exist")
        }

        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });

        const data = await connectionRequest.save();
        res.json({
            message:"connection req send successfully",
            data,
        })


    } catch(err){
        res.status(400).send("Error " + err.message)
    }
})

requestRouter.post('/request/review/:status/:requestId',userAuth, async(req,res) =>{
    try {
        const loggedInUser = req.user;
        const {status, requestId} = req.params;
        const allowedStatus = ["accepted", "rejected"];
        if(!allowedStatus.includes(status)){
            res.status(400).json({message : "Status not allowed"})
        }
        const connectionRequest = await ConnectionRequest.findOne({
            _id:requestId,
            toUserId: loggedInUser._id,
            status:"interested"
        })

        if(!connectionRequest){
            return res.status(400).json({message:"Connection req not found"})
        }

        connectionRequest.status = status;
        const data = await connectionRequest.save();
        res.json({message:"Connection request " + status, data})

    } catch(err){
        res.status(400).send("Error " + err.message)
    }
})

module.exports = requestRouter;
