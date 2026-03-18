import express from "express";
import { protect } from "../middleware/authMiddleware.js";  // ✅ 1. protect import
import { registerHotel } from "../controllers/hotelController.js";  // ✅ 2. registerHotel import

const hotelRouter = express.Router();

hotelRouter.get('/', (req, res) => {
  res.json({ success: true, message: "Hotels endpoint is live" });
});
hotelRouter.post('/', protect, registerHotel);  // ✅ 3. './' nahi '/' hoga

export default hotelRouter;
