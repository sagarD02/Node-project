const mongoose = require('mongoose');
const connectDB = async() =>{
    await mongoose.connect(
        "mongodb+srv://sagardakhore666:hqdcRrVksiltQrwZ@cluster0.n96kgav.mongodb.net/MakeFriend"
    )
}
module.exports = connectDB;