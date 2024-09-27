const mongoose = require('mongoose');


//User Schema
const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
},{
    timestamps: true,
    toJSON: {virtuals: true}
});



//model
const User = mongoose.model("User", userSchema);


module.exports = User;