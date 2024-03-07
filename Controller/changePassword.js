const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const usermodel = require('../Model/userModel.js');

async function changepassword(req, res) {
    try {
        const { password, confirmpassword } = req.body
        const { userID } = jwt.verify(req.cookies.token, process.env.JWT_SECRATE_KEY);
        if (password && confirmpassword) {
            // new hash password
            const salt = await bcrypt.genSalt(10);
            const newHashPassword = await bcrypt.hash(confirmpassword, salt);

            // matching both password
            if (password == confirmpassword) {

                // updating password
                await usermodel.findByIdAndUpdate(userID, { $set: { password: newHashPassword } })
                return res.status(200).send({ "status": "successful", "message": "password changed successfully" });
            } else {
                return res.status(200).send({ "status": "failed", "message": "password doen't matched" });
            }

        } else {
            return res.status(400).send({ "status": "failed", "message": "All field are required" });
        }

    } catch (error) {
        return res.status(400).send({ "status": "failed", "message": error });
    }

}

module.exports = {
    changepassword: changepassword,
};