const express = require("express");
const bodyparser = require('body-parser');
const dotenv = require(`dotenv`);
const cors = require('cors');
dotenv.config();
const app = express();
const PORT = process.env.PORT;
const database = require("./Database/mongodb");
const userRoute = require("./Routes/userRoute");
var cookies = require("cookie-parser");

// json
app.use(express.urlencoded({ extended: false }));
app.use(cookies());
app.use(bodyparser.json());
//CORS Policy
app.use(cors());

// database connection
database();

//routes
app.use('', userRoute);

//server listener
app.listen(PORT, () => {
    console.log(`server running port ${PORT}`);
})


