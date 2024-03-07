const express = require("express");
const router = express.Router();
const { signup } = require('../Controller/signup');
const { login, verifyotp } = require('../Controller/login');
const { home } = require('../Controller/homepage');
const { changepassword } = require('../Controller/changePassword.js');
const { checkuserauth } = require('../middleware/auth_middleware.js');
const { forgetpassword, Passwordreset } = require("../Controller/forgetpassward.js");
const { contact } = require('../Controller/contact.js');
const { profile, phoneotp, verifyphoneOTP, getprofile } = require('../Controller/profile.js');


// public route
router.post('/signup', signup);
router.post('/login', login);
router.post('/verifyotp', verifyotp);

// forget password 
router.post('/forgetpassword', forgetpassword);
router.post('/reset', Passwordreset);

// contact 
router.post('/contact', contact);

// profile
router.post('/profile', profile);
router.post('/phoneotp', phoneotp);
router.post('/verifyphoneOTP', verifyphoneOTP);
router.get('/getprofile', getprofile);

//home page
router.get('/home', home);

// // protected route
router.post('/changepassword', checkuserauth, changepassword);





//for all wrong path
router.all('*', function (req, res) {
    try {
        return res.status(200).send(`Wrong url`);
    } catch (error) {
        return res.status(400).send("some went wrong" + error);
    }
})



module.exports = router;
