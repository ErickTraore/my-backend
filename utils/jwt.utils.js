const jwt = require('jsonwebtoken');
const JWT_SIGN_SECRET = '0f9f8e9d8c7b6a5z4e3r2t1y0u';

module.exports = {
    generateTokenForUser: function(userData) {
        return jwt.sign({
            userId: userData.id,
            isAdmin: userData.isAdmin
            },
        JWT_SIGN_SECRET,
        { expiresIn: '1h' })
        }
    }