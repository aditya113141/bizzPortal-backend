const { sendMail } = require('./emaildelivery.js');

async function contactdetails(req, res) {
    try {
        const { body } = req;

        const message = `My name is ${body.firstName} ${body.lastName}. \n${body.text}\n\nPhoneNumber: ${body.phoneNumber}`;
        //send mail
        const mailID = await sendMail({
            from: body.email,
            to: process.env.EMAIL_FROM,
            subject: "Enterprise Contact",
            text: message,
        });
        if (!mailID) {
            return res.status(200).send({ "status": "failed", "message": "email not send" });
        } else {
            return res.status(200).send({ "status": "successfull", "message": "email send" });
        }
    } catch (error) {
        return res.status(500).send({ "status": "internal error", "message": error });
    }
}

module.exports = {
    contact: contactdetails,
};