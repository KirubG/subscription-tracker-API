import { JWT_SECRET } from "../config/env.js";
import User from "../model/user.model.js";
import jwt from "jsonwebtoken";

const authorize = async (req, res, next) => {
try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        token = req.headers.authorization.split(" ")[1];
    } 
    if(!token) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }

    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password -__v");
    if (!user) {
        return res.status(401).json({
            message: "Unauthorized",
            success: false,
        });
    }
    req.user = user;
    next();
} catch (error) {
    res.status(401).json({
        message: "Unauthorized",
        success: false,
    });
    next(error)
    
}
}

export default authorize;