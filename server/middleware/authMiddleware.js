import User from "../models/User.js";
import { getAuth } from "@clerk/express";

export const protect = async (req, res, next) => {
    const { userId } = getAuth(req);
    
    if (!userId) {
        return res.json({ success: false, message: "not authenticated" });
    } else {
        const user = await User.findById(userId);
        if (!user) {
            return res.json({ success: false, message: "user not found" });
        }
        req.user = user;
        next();
    }
}
