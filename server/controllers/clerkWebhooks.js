import User from "../models/User.js";
import { Webhook } from "svix";

const clerkWebhooks = async (req, res) => {
    try {
        const whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
        
        const headers = {
            "svix-id": req.headers["svix-id"],
            "svix-timestamp": req.headers["svix-timestamp"],
            "svix-signature": req.headers["svix-signature"],
        };
        
        await whook.verify(JSON.stringify(req.body), headers);
        
        const { data, type } = req.body;
        
        const userData = {
            _id: data.id,
            email: data.email_addresses[0].email_address,
            username: data.first_name + " " + data.last_name,
            image: data.image_url,
        };
        
        switch (type) {
            case "user.created":  // ✅ "user.created" (small 'u')
                await User.create(userData);  // ✅ userData (capital D)
                break;
            case "user.updated":  // ✅ "user.updated"
                await User.findByIdAndUpdate(data.id, userData);  // ✅ findByIdAndUpdate
                break;
            case "user.deleted":  // ✅ "user.deleted"
                await User.findByIdAndDelete(data.id);  // ✅ findByIdAndDelete
                break;
            default:
                break;
        }
        
        res.json({ success: true, message: "webhook received" });  // ✅ success, message
        
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });  // ✅ success, message
    }
}

export default clerkWebhooks;