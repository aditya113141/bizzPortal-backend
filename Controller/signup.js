const usermodel = require('../Model/userModel.js');
const { generatToken } = require('./tokengenerate.js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { sendMail } = require('./emaildelivery.js');
const web_link = process.env.WEB_LINK;

// signUp
async function userSignup(req, res, next) {

    try {
        const body = req.body;
        if (
            !body.name ||
            !body.email ||
            !body.password
        ) {
            return res.status(400).send({ "status": "failed", "message": "All field are required" });
        }
        // checking user present or not
        const user = await usermodel.findOne({ email: body.email });
        if (user) {
            return res.status(400).send({ "status": "failed", "message": "user already exist" });
        } else {
            // hashing password
            const salt = await bcrypt.genSalt(10);
            const hashPassword = await bcrypt.hash(body.password, salt);

            // creating object
            const userdata = {
                name: body.name,
                email: body.email,
                password: hashPassword,
            };
            const newUser = await usermodel.create(userdata);
            return res.status(200).send({ "status": "successfull", "message": "account created" });
            // // generating jwt token
            // const token = generatToken(userdata, process.env.JWT_SECRATE_KEY, '10m');
            // // creating link
            // const link = `${web_link}/verify-email?link=${token}`;
            // // send link
            // sendMail("email verification", body.email, "verification link valid for 10 minutes " + link);
            // return res.status(200).send({ "status": "successfull", "message": "email send " });
        }
    } catch (error) {
        return res.status(500).send({ "status": "internal error", "message": error });
    }
}




// //not complete
// async function verifyAccount(req, res, next) {
//     try {
//         const tempToken = req.query.link;
//         const { userID } = jwt.verify(tempToken, process.env.JWT_SECRATE_KEY);
//         // creating new user 
//         const newUser = await usermodel.create({
//             name: userID.name,
//             email: userID.email,
//             password: userID.password,
//             verified: true
//         });
//         // redirect to signup page
//         if (!newUser._id) {
//             return res.status(400).send({ "status": "failed", "message": "account not created" }).redirect('\signup');
//         }
//         next();
//     } catch (error) {
//         return res.status(500).send({ "status": "failed", "message": error });
//     }
// }

module.exports = {
    signup: userSignup,
    // verifyemail: verifyAccount,
};