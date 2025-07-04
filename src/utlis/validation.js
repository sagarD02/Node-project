const validator = require("validator")
const validateSignupData = (req) => {
    const {firstName, lastName, emailId,password} = req.body;
  if(!firstName || !lastName){
    throw new Error("Name is not valid")
  }
  else if(firstName.length <4 || lastName.length <4) {
    throw new Error("Data is not valid")
  } else if(!validator.isEmail(emailId)) {
    throw new Error("Invalid email id")
  } else if(!validator.isStrongPassword(password)) {
    throw new Error("Please enter valid password")
  }
}

const validateEditProfile = (req) =>{
    const allowedEditFields = ["firstName","lastName","emailId", "gender","age","about","gender", "photoUrl"]
    const isEditAllowd = Object.keys(req.body).every(field => allowedEditFields.includes(field))
    return isEditAllowd;
}

module.exports ={validateSignupData,validateEditProfile}