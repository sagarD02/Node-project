const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userScheme = new mongoose.Schema({
    firstName:{
        type: String,
        required: true,
        minLength:4,
        maxLength:50,
        index:true
    },
    lastName:{
        type: String,
        required: true,
        minLength:4,
        maxLength:50,
        index:true
    },
    emailId:{
        type: String,
        required: true,
        unique:true,
        trim:true,
        validate(value) {
            if(!validator.isEmail(value)){
                throw new Error("Invalid Email")
            }
        }
    },
    password:{
        type: String,
        required: true,
    },
    age:{
        type: Number,
        min:18,
    },
    gender:{
        type: String,
        validate(value){
            if(!["Male","Female", "others"].includes(value)){
                throw new Error("Gender data is not valid")
            }
        }
    },
    photoUrl :{
        type: String,
        dafault:"https://th.bing.com/th/id/OIP.c03ouvJo3Iu3uoERIAgoXwHaGw?w=206&h=187&c=7&r=0&o=7&dpr=1.2&pid=1.7&rm=3",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Invalid photo URL" + value)
            }
        }
    },
    about :{
        type: String,
    },
    skills :{
        type: [String]
    }
}, {
    timestamps:true
});


userScheme.methods.getJWT = async function(){
    const user= this;
    const token = await jwt.sign({_id:user._id},"DEV-SW@g@r",{expiresIn: "1d"})
     return token;
}

userScheme.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const isPasswordValid = await bcrypt.compare(passwordInputByUser, this.password)
     return isPasswordValid;
}

const User = mongoose.model("User", userScheme);
module.exports = User;
