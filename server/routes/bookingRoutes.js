import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
  checkAvailabilityAPI, 
  createBooking, 
  getHotelBookings, 
  getUserBookings, 
  stripePayment,      // ✅ Fixed: stringPayment → stripePayment
  stripeSuccess
} from "../controllers/bookingController.js";

const bookingRouter = express.Router();

// Public routes
bookingRouter.post('/check-availability', checkAvailabilityAPI);

// Protected routes
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);
bookingRouter.post('/stripe-payment', protect, stripePayment);  // ✅ Fixed
bookingRouter.get('/stripe-success', protect, stripeSuccess);

export default bookingRouter;