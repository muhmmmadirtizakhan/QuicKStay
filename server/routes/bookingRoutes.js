import express from "express"
import { protect } from "../middleware/authMiddleware.js"  // ✅ protect import
import { 
  checkAvailabilityAPI, 
  createBooking, 
  getHotelBookings, 
  getUserBookings 
} from "../controllers/bookingController.js"  // ✅ specific file with .js

const bookingRouter = express.Router();

bookingRouter.post('/check-availability', checkAvailabilityAPI);
bookingRouter.post('/book', protect, createBooking);
bookingRouter.get('/user', protect, getUserBookings);
bookingRouter.get('/hotel', protect, getHotelBookings);  // ✅ './hotel' nahi, '/hotel'

export default bookingRouter;