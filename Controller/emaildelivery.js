const nodemailer = require('nodemailer');

//cofigure mail and send it
async function sendMail(mailContent) {
  // try {
  const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
      user: process.env.EMAIL_FROM,
      pass: process.env.EMAIL_PASS
    }
  })
  // send email
  const result = await transporter.sendMail(mailContent);
  if (result.messageId != null) {
    return "true";
  } else {
    return "false";
  }
  // console.log(result.messageId);
  // return result.messageId;
  // } catch (error) {
  //   return error;
  // }
}

module.exports = {
  sendMail,
};