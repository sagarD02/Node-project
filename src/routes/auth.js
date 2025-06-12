const express  = require('express');
const {validateSignupData } = require("../utlis/validation")
const User = require ("../models/user")
const bcrypt = require('bcrypt');
const {userAuth} = require("../middlewares/auth");

const authRouter = express.Router();

authRouter.post("/signup", userAuth,async(req,res) => {
    //Validation of data
  try {
   validateSignupData(req);
   const {firstName,lastName,emailId,password} = req.body;
   //Encrypt
   const passwordHash = await bcrypt.hash(password,10)
  
 //creating a new instance of User model
 const user = new User({
       firstName,
       lastName,
       emailId, 
       password : passwordHash,
   })
   await user.save();
   res.send("User added successfully")
 } catch(err) {
   res.status(400).send("error while saving data" + err.message)
 }
 
});

authRouter.post("/login",async(req,res) => {
    //Validation of data
  try {
   const {emailId,password} = req.body;
   const user = await User.findOne({emailId:emailId});
   if(!user) {
    throw new Error("Invalid Credentials")
   }
   const isPasswordValid = await user.validatePassword(password);
   
   if(isPasswordValid) {

    //create token
    const token = await user.getJWT();
    //add token to cookie & send response back to user
    res.cookie("token",token)
    res.send("Login Successful")
   } else {
        throw new Error("Invalid Credentials")
   }
  
   
 } catch(err) {
   res.status(400).send("error while saving data" + err.message)
 }
 
});

authRouter.post("/logout",async(req,res) => {
    //Validation of data
   res.cookie("token",null, {
    expires:new Date(Date.now()),
   })

   res.send("Logout Successfull !!");
 
});

module.exports = authRouter; 
