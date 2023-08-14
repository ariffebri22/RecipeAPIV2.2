const jwt = require("jsonwebtoken");
require("dotenv").config();
const secretKey = process.env.SECRET_KEY;

const Protect = async (req, res, next) => {
    try {
        let { authorization } = req.headers;

        if (!authorization || !authorization.startsWith("Bearer ")) {
            return res.status(401).json({ status: 401, message: "Unauthorized: Missing or invalid token" });
        }

        const token = authorization.split(" ")[1];

        if (!token) {
            return res.status(401).json({ status: 401, message: "Unauthorized: Missing token" });
        }

        let decoded;
        try {
            decoded = await jwt.verify(token, secretKey);
        } catch (err) {
            if (err.name === "TokenExpiredError") {
                return res.status(401).json({ status: 401, message: "Login session expired, please login again" });
            } else {
                return res.status(401).json({ status: 401, message: "Unauthorized: Invalid token" });
            }
        }

        if (!decoded) {
            return res.status(401).json({ status: 401, message: "Unauthorized: Invalid token" });
        }

        req.payload = decoded;
        next();
    } catch (err) {
        console.error(err);
        return res.status(500).json({ status: 500, message: "Internal server error" });
    }
};

module.exports = Protect;

module.exports = { Protect };
