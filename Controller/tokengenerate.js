const jwt = require('jsonwebtoken');


//generate token
function generatToken(user_uid, secrate, expirytime) {
    return jwt.sign({ userID: user_uid }, secrate, { expiresIn: expirytime });
}

module.exports = {
    generatToken
};