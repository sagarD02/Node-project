const express  = require('express');
const {userAuth} = require("../middlewares/auth");
const {validateEditProfile} = require("../utlis/validation")
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async(req,res) => {
    try {
        const user = req.user;
        res.send(user)
    } catch(err) {
        res.status(400).send("error while saving data" + err.message)
      }
});

profileRouter.patch("/profile/edit", userAuth, async(req,res) => {
    try {
        if(!validateEditProfile(req)){
            throw new Error("Invalid Edit Request")
        }
        const loggedInUser = req.user;
        Object.keys(req.body).forEach(key =>loggedInUser[key] = req.body[key])
        await loggedInUser.save()
        res.send("Profile updated successfully")
    } catch(err) {
        res.status(400).send("error while saving data" + err.message)
      }
});


module.exports = profileRouter; 