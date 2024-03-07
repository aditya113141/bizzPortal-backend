const mongoose = require('mongoose');

// Creating Structure of the collection
const user_schema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        require: true,
    },
    otp:{
        type:String
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})

// Creating collection
// const collections = mongoose.model(
//     "userdata", user_schema
// )

module.exports = mongoose.model(
    "userdata", user_schema
);