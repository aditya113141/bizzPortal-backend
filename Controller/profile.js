const { Console, error } = require("console");
const jwt = require('jsonwebtoken');
const profileModel = require("../Model/profileModel.js");
const { phoneotp } = require('./phoneNoOtp.js');

async function sendPhoneOTP(req, res) {
    const { phoneNumber } = req.body;
    if (!!phoneNumber) {
        try {
            // generate otp 
            const OTP = Math.floor(1000 + Math.random() * 9000);
            // send otp to phone number
            const result = await phoneotp(phoneNumber, OTP);
            if (result == "true") {
                const userdata = {
                    phoneNumber: phoneNumber,
                    otp: OTP
                };
                const userExist = await profileModel.findOne({ phoneNumber: phoneNumber });
                if (userExist) {
                    const updateOtp = await profileModel.findByIdAndUpdate({ _id: userExist._id }, {
                        otp: OTP
                    }, { new: false }
                    );
                    await updateOtp.save();
                } else {
                    const newUser = await profileModel.create(userdata);
                }
                return res.status(200).send({ "status": "successfull", "message": "OTP send " });
            } else {
                return res.status(200).send({ "status": "failed", "message": "OTP not send " });
            }
        } catch (error) {
            return res.status(500).send({ "status": "internal error", "message": error });
        }
    }
}

async function verifyOTP(req, res) {
    try {
        const { otp, phoneNumber } = req.body;
        if (!phoneNumber || !otp) {
            return res.status(400).send({ "status": "failed", "message": "All field are required" });
        }
        // verify OTP 
        const user = await profileModel.findOne({ phoneNumber: phoneNumber });
        if (user.otp != otp) {
            return res.status(400).send({ "status": "failed", "message": "wrong OTP" });
        }
        return res.status(200).send({ "status": "successfull", "otp": "verified", "phoneNumber": phoneNumber });
    } catch {
        return res.status(500).send({ "status": "internal error", "message": error });
    }
}

async function profileDetails(req, res) {
    try {
        const { name, email, phoneNumber, gstin, country, state, verified, token } = req.body;
        // creating profile 
        const { userID } = jwt.verify(token, process.env.JWT_SECRATE_KEY);
        const userdata = {
            name: name,
            email: email,
            phoneNumber: phoneNumber,
            gstin: gstin,
            country: country,
            state: state,
            userid: userID,
            verified: verified
        };
        const oldUser = await profileModel.findOneAndDelete({ phoneNumber: phoneNumber });
        // console.log(oldUser);
        const newUser = await profileModel.create(userdata);
        return res.status(200).send({ "status": "successfull", "message": "profile created" });
    } catch (error) {
        return res.status(500).send({ "status": "internal error", "message": error });
    }
}


//getprofile testing
async function getProfiledata(req, res) {

    try {
        const token = req.query.id;
        const { userID } = jwt.verify(token, process.env.JWT_SECRATE_KEY);
        if (userID) {
            const data = await profileModel.findOne({ userid: userID });
            if (data) {
                const userdata = {
                    "name": data.name,
                    "email": data.email,
                    "phoneNumber": data.phoneNumber,
                    "gstin": data.gstin,
                    "country": data.country,
                    "state": data.state
                }
                res.status(200).send(userdata);
            } else {
                res.status(400).send({ "stataus": "failed", "message": "no user exist" });
            }
        } else {
            res.status(400).send({ "stataus": "failed", "message": "unable to get id" });
        }
    } catch (error) {
        return res.status(500).send({ "status": "internal error", "message": error });
    }
}

module.exports = {
    profile: profileDetails,
    phoneotp: sendPhoneOTP,
    verifyphoneOTP: verifyOTP,
    getprofile: getProfiledata,
};