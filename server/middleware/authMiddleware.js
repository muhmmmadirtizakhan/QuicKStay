import User from "../models/User.js";

export const protect = async (req, res, next) => {
    const authData = typeof req.auth === 'function' ? req.auth() : req.auth;
    const userId = authData?.userId;
    
    if (!userId) {
        return res.json({ success: false, message: "not authenticated" });
    } else {
        const user = await User.findById(userId);
        req.user = user;
        next();
    }
}
