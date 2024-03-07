const mongoose = require('mongoose');

// Creating Structure of the collection
const user_schema = new mongoose.Schema({
    name: {
        type: String
    },
    email: {
        type: String,
    },
    phoneNumber: {
        type: String
    },
    otp: {
        type: String
    },
    gstin: {
        type: String
    },
    country: {
        type: String
    },
    state: {
        type: String
    },
    userid: {
        type: String,
        require:true
    },
    verified: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
})


module.exports = mongoose.model(
    "profiledata", user_schema
);