const mongoose = require('mongoose');
const password = process.env.MONGODB_PASSWORD;
const userName=process.env.MONGODB_USER_NAME;
function connection() {
    mongoose.connect(`mongodb+srv://${userName}:${password}@cluster0.sjwfxza.mongodb.net/intern?retryWrites=true&w=majority`).then(() => {
        console.log("mongodb database Connected  Successfully");
    }).catch((err) => {
        console.log("Error in mongodb databse Connection " + err);
    })
}

module.exports = connection;