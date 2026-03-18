import User from "../models/User.js";
import { getAuth } from "@clerk/express";

export const protect = async (req, res, next) => {
    const { userId, sessionClaims } = getAuth(req);
    
    if (!userId) {
        return res.json({ success: false, message: "not authenticated" });
    } else {
        let user = await User.findById(userId);
        if (!user) {
            const email =
                sessionClaims?.email ||
                sessionClaims?.email_address ||
                sessionClaims?.primary_email_address ||
                `${userId}@example.com`;
            const username =
                sessionClaims?.name ||
                sessionClaims?.username ||
                sessionClaims?.first_name ||
                `User ${userId.slice(0, 6)}`;
            const image =
                sessionClaims?.picture ||
                sessionClaims?.avatar ||
                "https://via.placeholder.com/150";

            user = await User.create({
                _id: userId,
                email,
                username,
                image,
                role: "user",
                recentSearchedCities: [],
            });
        }
        req.user = user;
        next();
    }
}
