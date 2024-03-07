const jwt = require('jsonwebtoken');
const UserModel = require('../Model/userModel');

 function checkUserauth(req, res, next) {
     
     try {
         
        //  console.log(req.cookies.token);
        if (!req.cookies.token) return res.status(401).json({ errorMessage: "Unautherised" });
        const {userID} = jwt.verify(req.cookies.token, process.env.JWT_SECRATE_KEY);
        // console.log(userID);
        next();
    } catch (err) {
        console.log(err);
        return res.status(400).json({ "status": "failed", Message: "Unautherised" });
    }
    

    // const { authorization } = req.headers;
    // if (authorization && authorization.startsWith('Bearer')) {
    //     // get token from header
    //     let token = authorization.split(' ')[1];
    //     // verify token
    //     const { userID } = jwt.verify(token, process.env.JWT_SECRATE_KEY);
    //     // get user from token
    //     req.user = await UserModel.findById(userID).select('-password');
    //     next();
    // } else {
    //     return res.status(401).send({ "status": "successful", "message": "unauthorized user ,no token" });
    // }
}

module.exports = {
    checkuserauth: checkUserauth,
};
