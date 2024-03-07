const usermodel = require('../Model/userModel.js');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");
const web_link = process.env.WEB_LINK;
const { generatToken } = require('./tokengenerate.js');
const { sendMail } = require('./emaildelivery.js');

async function forgetpassword(req, res) {
    try {
        const { email } = req.body
        if (email) {
            // finding existing user
            const user = await usermodel.findOne({ email: email })
            if (user) {
                // generating jwt token
                var token = generatToken(user._id, process.env.JWT_SECRATE_KEY, '10m');

                const link = `${web_link}/reset?link=${token}`
                // send link
                sendMail("password reset", user.email, "password reset link " + link);
                res.status(200).send({ "status": "success", "message": "email send " + link });
            } else {
                res.status(200).send({ "status": "failed", "message": "Email doesn't exists" });
            }
        } else {
            res.status(400).send({ "status": "failed", "message": "Email Field is Required" });
        }
    } catch (error) {
        res.status(400).send({ "status": "failed", "message": error })
    }
}

async function userPasswordReset(req, res) {
    try {
        const { password, password_confirmation } = req.body
        const tempToken = req.query.link;

        const { userID } = jwt.verify(tempToken, process.env.JWT_SECRATE_KEY);
        console.log(userID);
        const user = await usermodel.findById(userID)
        if (userID == user._id) {
            if (password && password_confirmation) {
                if (password !== password_confirmation) {
                    return res.status(200).send({ "status": "failed", "message": "New Password and Confirm New Password doesn't match" })
                } else {
                    const salt = await bcrypt.genSalt(10);
                    const newHashPassword = await bcrypt.hash(password, salt);
                    await usermodel.findByIdAndUpdate(user._id, { $set: { password: newHashPassword } });
                    res.status(200).send({ "status": "success", "message": "Password Reset Successfully" });
                }
            } else {
                res.status(200).send({ "status": "failed", "message": "All Fields are Required" })
            }
        } else {
            res.status(200).send({ "status": "failed", "message": "Invalid Token" })
        }
    } catch (error) {
        res.status(400).send({ "status": "failed", "message": error })
    }
}


module.exports = {
    forgetpassword: forgetpassword,
    Passwordreset: userPasswordReset,
};


