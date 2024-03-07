const twilio = require('twilio');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

async function onRequestOTP(userPhoneNumber, otp) {

    const client = twilio(accountSid, authToken);
    const sendMessage = {
        body: `Your  OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: `+91${userPhoneNumber}` // recipient phone number // Add country before the number
    };
    const result = await client.messages.create(sendMessage);
    // console.log(result);
    if (result.body != null) {
        return "true";
    } else {
        return "false";
    }


}

module.exports = {
    phoneotp: onRequestOTP,
};