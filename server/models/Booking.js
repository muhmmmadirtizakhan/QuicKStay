import mongoose from "mongoose";
// import { GiConfirmed } from "react-icons/gi";  // <-- Remove this - React icon mongoose mein use nahi hota

const bookingSchema = new mongoose.Schema({
   user: { type: String, ref: "User", required: true },
   room: { type: String, ref: "Room", required: true },
   hotel: { type: String, ref: "Hotel", required: true },
   hotelOwner: { type: String, ref: "User", required: true },
   checkInDate: { type: Date, required: true },
   checkOutDate: { type: Date, required: true },
   totalPrice: { type: Number, required: true },
   guests: { type: Number, required: true },
   status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled"],
      default: "pending",
   },
   paymentsMethod: {
      type: String,
      required: true,
      default: "PAY AT HOTEL"
   },
   isPaid: { type: Boolean, default: false }  // Fixed: boolean -> Boolean
}, { timestamps: true });

const Booking = mongoose.model("Booking", bookingSchema);  // Fixed: booking -> Booking (capital B)
export default Booking;
