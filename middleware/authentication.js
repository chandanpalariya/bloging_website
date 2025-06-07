const { validateToken } = require("../services/authentication");

function checkforAuthenticationCookie(cookieName) {
    return (req, res, next) => {
        const tokenCookieValue = req.cookies[cookieName];
        
        if (!tokenCookieValue) {
            return next(); // ✅ prevent continuing further
        }

        try {
            const userPayload = validateToken(tokenCookieValue);
            req.user = userPayload;
        } catch (error) {
            // Optional: console.log("Invalid token:", error.message);
        }

        return next(); // ✅ safe to continue
    };
}

module.exports = {
    checkforAuthenticationCookie
};
