const { verifyJsonWebToken } = require("../Utils/verifyJsonWebToken");
async function isAuthenticated(req, res, next) {
    console.log("isAuthenticated middleware called");
    const token = req.cookies.token;    
    console.log("isAuthenticated middleware invoked. Token:", token);
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: No token provided" });
    }
    try {
        const decoded = await verifyJsonWebToken(token);
        req.user = decoded; // Attach decoded user info to request
        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized: Invalid token" });
    }
}

module.exports = isAuthenticated;