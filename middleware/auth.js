const jwt = require("jsonwebtoken");
function auth(req, res, next) {
    const token = req.header("x-auth-token")
    if (!token) res.status(401).send("Access is denied .Token is required.");
    try {
        const decoded = jwt.verify(token,process.env.JWT_PRIVATE_KEY);
        req.user = decoded;
        next();
    }
    catch (e) { res.status(400).send("Invalid token") }
    
}
module.exports = auth;