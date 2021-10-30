const jwt = require('jsonwebtoken');
const APP_SECRET = process.env.APP_SECRET;

function getTokenPayload(token) {
    return jwt.verify(token, APP_SECRET);
}

function getUserId(req, authToken) {
    if (req) {
        const authHeader = req.headers.authorization;
        if (authHeader) {
            const token = authHeader.replace('Bearer ', '');
            if (!token) {
                throw new Error('No token found');
            }
            const { userId } = getTokenPayload(token);
            return userId;
        }
    } else if (authToken) {
        const { userId } = getTokenPayload(authToken);
        return userId;
    }
    throw new Error('Not authenticated');
}

function validateEmailAddress(possibleMail) {
    const emailRegex =
        /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/g;
    return emailRegex.test(possibleMail);
}

// password should be at least eight chars long
function validatePassword(password) {
    return password.length >= 8;
}

module.exports = {
    APP_SECRET,
    getUserId,
    getTokenPayload,
    validateEmailAddress,
    validatePassword,
};
