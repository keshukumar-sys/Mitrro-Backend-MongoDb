function isAdmin(req, res, next) {
    const userRole = req.user.role; // Assuming req.user is set by isAuthenticated middleware
    const allowedRoles = ["admin"]; // Define roles that are allowed access
    if (!allowedRoles.includes(userRole)) {
        return res.status(403).json({ message: "Forbidden: You do not have access to this resource" });
    }
    next();
}

module.exports = isAdmin;