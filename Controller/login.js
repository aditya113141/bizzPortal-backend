const usermodel = require('../Model/userModel.js');
const { generatToken } = require('./tokengenerate.js');
const bcrypt = require('bcrypt');
const { sendMail } = require('./emaildelivery.js');
const profileModel = require("../Model/profileModel.js");
// const { verify } = require('jsonwebtoken');


// login
async function userLogin(req, res) {
    try {
        // extracting email
        const { email } = req.body;

        if (!email) {
            return res.status(400).send({ "status": "failed", "message": "All field are required" });
        }

        // checking user present or not
        const userExist = await usermodel.findOne({ email: email });
        if (!userExist) {
            return res.status(400).send({ "status": "failed", "message": "User dosen't exist" });
        }
        // generate otp 
        const OTP = Math.floor(100000 + Math.random() * 900000);
        if (userExist) {
            const updateData = await usermodel.findByIdAndUpdate({ _id: userExist._id }, {
                otp: OTP
            }, { new: true }
            );
            await updateData.save();
        }

        //send mail
        const mailId = await sendMail({
            from: process.env.EMAIL_FROM,
            to: email,
            subject: "OTP verification",
            text: `OTP valid for 3 minutes only  ${OTP}`,
        });
        console.log(mailId);
        if (mailId == "true") {
            return res.status(200).send({ "status": "successfull", "message": "OTP send", "check": "true" });
        } else {
            return res.status(200).send({ "status": "failed", "message": "OTP not send", "check": "false" });
        }
        // // comparing user password
        // // const isMatch = bcrypt.compare(password, user.password);

        // // validating user email and password
        // if ((email === user.email) && isMatch) {
        //     // generating jwt token
        //     const token = generatToken(user._id, process.env.JWT_SECRATE_KEY, '10d');
        //     // Response
        //     res.status(200).cookie("token", token, {
        //         httpOnly: true,
        //     }).send({ "status": "successful", "message": "login successfully" });;

        // } else{
        // return res.status(200).send({ "status": "successfull", "message": "OTP send", "check": "true" });
        // }

    } catch (error) {
        return res.status(500).send({ "status": "internal error", "message": error });
    }
};

async function verifyOTP(req, res) {
    try {
        const { otp, email } = req.body;
        if (!email || !otp) {
            return res.status(400).send({ "status": "failed", "message": "All field are required" });
        }
        // verify OTP 
        const user = await usermodel.findOne({ email: email });

        // is profile available or not
        var profileExist = false;
        const userExist = await profileModel.findOne({ userid: user._id });
        if (userExist) {
            profileExist = true;
        }

        //validating otp
        if (user.otp != otp) {
            return res.status(400).send({ "status": "failed", "message": "wrong OTP" });
        }
        // generating jwt token
        const token = generatToken(user._id, process.env.JWT_SECRATE_KEY, '10d');
        // Response
        res.status(200).json({ message: "User Login Succesfully Done", userToken: token, "profileExist": profileExist });
        // res.status(200).cookie("token", token, 
        // // {httpOnly: true,}
        // ).send({ "status": "successful", "message": "user login successfully" });

    } catch {
        return res.status(500).send({ "status": "internal error", "message": error });
    }
};

module.exports = {
    login: userLogin,
    verifyotp: verifyOTP,
};