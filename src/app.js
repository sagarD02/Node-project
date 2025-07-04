const express = require('express');
const connectDB = require("./config/database")
const app = express();
// const {validateSignupData } = require("./utlis/validation")
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const {userAuth} = require("./middlewares/auth");
const cookieParser = require('cookie-parser');

//middleware
app.use(express.json());
app.use(cookieParser());

const authRouter = require("./routes/auth");
const profileRouter = require("./routes/profile");
const requestRouter = require("./routes/request");
const userRouter = require("./routes/user");
const cors = require('cors')

app.use(cors({
    origin:"http://localhost:5173",
    credentials:true
}))
app.use("/", authRouter)
app.use("/", profileRouter)
app.use("/", requestRouter)
app.use("/", userRouter)

// app.get("/profile", userAuth, async(req,res) => {
//     try {
//         const user = req.user;
//         res.send(user)
//     } catch(err) {
//         res.status(400).send("error while saving data" + err.message)
//       }
// });

// app.post("/sendConectionRequest", userAuth,async(req,res) => {
//     res.send("Conection request sent")
// })

//login API 
// app.post("/login",async(req,res) => {
//     //Validation of data
//   try {
//    const {emailId,password} = req.body;
//    const user = await User.findOne({emailId:emailId});
//    if(!user) {
//     throw new Error("Invalid Credentials")
//    }
//    const isPasswordValid = await user.validatePassword(password);
   
//    if(isPasswordValid) {

//     //create token
//     const token = await user.getJWT();
//     //add token to cookie & send response back to user
//     res.cookie("token",token)
//     res.send("Login Successful")
//    } else {
//         throw new Error("Invalid Credentials")
//    }
  
   
//  } catch(err) {
//    res.status(400).send("error while saving data" + err.message)
//  }
 
// });
// app.post("/signup", userAuth,async(req,res) => {
//      //Validation of data
//    try {
//     validateSignupData(req);
//     const {firstName,lastName,emailId,password} = req.body;
//     //Encrypt
//     const passwordHash = await bcrypt.hash(password,10)
   
//   //creating a new instance of User model
//   const user = new User({
//         firstName,
//         lastName,
//         emailId, 
//         password : passwordHash,
//     })
//     await user.save();
//     res.send("User added successfully")
//   } catch(err) {
//     res.status(400).send("error while saving data" + err.message)
//   }
  
// });

//update data of user
// app.patch("/user/:userId",userAuth,async (req,res) => {
//     const userId = req.params?.userId;
   
//     try {
//         const ALLOWED_UPDATES = ["emailId"]
//         const isUpdateAllowed = Object.keys(req.body).every((k) => ALLOWED_UPDATES.includes(k));
//         if(!isUpdateAllowed) {
//             throw new error("update not allowed")
//         }
//         const user = await User.findByIdAndUpdate({_id:userId},req.body,{returnDocument:"after", runValidators :true});
//        console.log(user)
//         res.send("User updated successfully")
//     } catch(err){
//       res.status(400).send("something went wrong" + err)
//     }
// })

//delete user from database
// app.delete("/user",userAuth,async(req,res)=>{
//     const userId = req.body.userId;
//     try {
//         const user = await User.findByIdAndDelete(userId)
//         res.send("user deleted successfully")
//     } catch(err){
//         res.status(400).send("something went wrong")
//       }
// })
//get all users 
// app.get("/feed",userAuth,async (req,res) => {
//     try {
//         const users = await User.find({});
//         res.send(users)
//     } catch(err){
//       res.status(400).send("something went wrong")
//     }
// })
connectDB().then(()=>{
    console.log("Connection established")
    app.listen(3000,()=>{
        console.log("server listening")
    });
}).catch(err=>{
    console.log("errr",err)
})