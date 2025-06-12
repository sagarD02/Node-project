const mongoose = require("mongoose");

const conectionRequestSchema = new mongoose.Schema({
  fromUserId :{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //"reference to User collection"
    required:true
  },
  toUserId:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", //"reference to User collection"
    required:true
  },
  status:{
    type:String,
    required:true,
    enum:{
        values:["ignore","interested","accepted","ignored"],
        message:`{VALUE} is incorrect status type`
    },
  },
},
  {
    timestamps:true,
  }
);

//compound index
//1=> ascending
//-1 => descending
conectionRequestSchema.index({fromUserId:1,toUserId:1})

conectionRequestSchema.pre("save", function(next){
  const connectReq = this;
  //check from & to User Id
  if(connectReq.fromUserId.equals(connectReq.toUserId)){
      throw new Error ("You can't sent request youreself")
  }
  next();
})


const ConnectionRequestModel = mongoose.model(
  "ConnectionRequest",
  conectionRequestSchema
);
module.exports = ConnectionRequestModel;