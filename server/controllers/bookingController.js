import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import transporter from "../configs/nodemailer.js";
import Stripe from "stripe";  // ✅ Fixed: 'stripe' → 'Stripe' (capital S)

const checkAvailability = async (checkInDate, checkOutDate, room) => {
    try {
        const bookings = await Booking.find({
            room,
            checkInDate: { $lte: checkOutDate },
            checkOutDate: { $gte: checkInDate },
        });
        
        const isAvailable = bookings.length === 0;
        return isAvailable;
        
    } catch (error) {
        console.log(error.message);
        return false;
    }
}

export const checkAvailabilityAPI = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate } = req.body;
        const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);
        res.json({ success: true, isAvailable });
    } catch (error) {
        res.json({ success: false, message: error.message });
    }
}

export const createBooking = async (req, res) => {
    try {
        const { room, checkInDate, checkOutDate, guests } = req.body;
        const user = req.user._id;
        
        const isAvailable = await checkAvailability(checkInDate, checkOutDate, room);
        
        if (!isAvailable) {
            return res.json({ success: false, message: "ROOM IS NOT AVAILABLE" });
        }
        
        const roomData = await Room.findById(room).populate("hotel");
        
        // ✅ Check if room exists
        if (!roomData) {
            return res.json({ success: false, message: "Room not found" });
        }
        
        let totalPrice = roomData.pricePerNight;
        
        const checkIn = new Date(checkInDate);
        const checkOut = new Date(checkOutDate);
        const timeDiff = checkOut.getTime() - checkIn.getTime();
        const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        totalPrice *= nights;
        
        const booking = await Booking.create({
            user: user?.toString?.() || user,
            room: room?.toString?.() || room,
            hotel: roomData.hotel?._id?.toString?.() || roomData.hotel?._id,
            hotelOwner: roomData.hotel?.owner?.toString?.() || roomData.hotel?.owner,
            guests: +guests,
            checkInDate,
            checkOutDate,
            totalPrice,
        });
        
        const mailOptions = {
            from: process.env.SENDER_EMAIL,
            to: req.user.email,
            subject: "Hotel Booking Details",
            html: `
                <h2>Your Booking Details</h2>
                <p>Dear ${req.user.username},</p>
                <p>Thank you for your booking! Here are your details: </p>
                <ul>
                    <li><strong>Booking ID:</strong> ${booking._id}</li>
                    <li><strong>Hotel Name:</strong> ${roomData.hotel.name}</li>
                    <li><strong>Location:</strong> ${roomData.hotel.address}</li>
                    <li><strong>Date:</strong> ${new Date(booking.checkInDate).toDateString()}</li>
                    <li><strong>Booking Amount:</strong> ${process.env.CURRENCY || '$'}${booking.totalPrice}</li>
                </ul>
                <p>We look forward to welcoming you!</p>
            `
        };
        
        await transporter.sendMail(mailOptions);
        
        res.json({ success: true, message: "BOOKING CREATED SUCCESSFULLY" });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: "failed to create booking" });
    }
};

export const getUserBookings = async (req, res) => {
    try {
        const authUserId = req.auth?.()?.userId;
        const userId = req.user?._id || authUserId;
        if (!userId) {
            return res.json({ success: false, message: "not authenticated" });
        }
        const bookings = await Booking.find({ user: userId.toString() })
            .populate("room hotel")
            .sort({ createdAt: -1 });
        res.json({ success: true, bookings });
    } catch (error) {
        res.json({ success: false, message: "failed to fetch bookings" });
    }
};

export const getHotelBookings = async (req, res) => {
    try {
        const authUserId = req.auth?.()?.userId;
        const userId = (req.user?._id || authUserId)?.toString?.() || req.user?._id || authUserId;
        if (!userId) {
            return res.json({ success: false, message: "not authenticated" });
        }

        const hotels = await Hotel.find({ owner: userId }).select("_id");
        if (!hotels || hotels.length === 0) {
            return res.json({ success: true, dashboardData: { totalBookings: 0, totalRevenue: 0, bookings: [] } });
        }

        const hotelIds = hotels.map((h) => h._id?.toString?.() || h._id);
        const bookings = await Booking.find({ hotelOwner: userId })
            .populate("room hotel user")
            .sort({ createdAt: -1 });
            
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((acc, booking) => acc + booking.totalPrice, 0);
        
        res.json({ 
            success: true, 
            dashboardData: {
                totalBookings,
                totalRevenue,
                bookings
            }
        });
    } catch (error) {
        console.log("getHotelBookings error:", error.message);
        res.json({ success: false, message: error.message || "FAILED TO FETCH BOOKINGS" });
    }
};

// ✅ FIXED: stringPayment → stripePayment
export const stripePayment = async (req, res) => {
    try {
        const { bookingId } = req.body;
        const booking = await Booking.findById(bookingId);
        
        if (!booking) {
            return res.json({ success: false, message: "Booking not found" });
        }
        
        const roomData = await Room.findById(booking.room).populate('hotel');
        
        if (!roomData || !roomData.hotel) {
            return res.json({ success: false, message: "Room or hotel not found" });
        }
        
        const totalPrice = booking.totalPrice;
        const { origin } = req.headers;
        
        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);  // ✅ Fixed: stripe → Stripe
        
        const line_items = [
            {
                price_data: {
                    currency: "usd",
                    product_data: {
                        name: roomData.hotel.name,  // ✅ Name properly set
                        description: `${roomData.roomType || 'Room'} at ${roomData.hotel.name}`
                    },
                    unit_amount: totalPrice * 100,  // ✅ Comma (,) not semicolon (;)
                },
                quantity: 1,
            }
        ];
        
        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/my-bookings?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: `${origin}/my-bookings?canceled=1`,
            metadata: {
                bookingId,
            }
        });
        
        res.json({ success: true, url: session.url });
    } catch (error) {
        console.log("Stripe payment error:", error);
        res.json({ success: false, message: error.message || "payment failed" });
    }
}

export const stripeSuccess = async (req, res) => {
    try {
        const { session_id } = req.query;
        if (!session_id) {
            return res.json({ success: false, message: "missing session id" });
        }

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);  // ✅ Fixed: stripe → Stripe
        const session = await stripeInstance.checkout.sessions.retrieve(session_id);

        if (session.payment_status !== "paid") {
            return res.json({ success: false, message: "payment not completed" });
        }

        const bookingId = session.metadata?.bookingId;
        if (!bookingId) {
            return res.json({ success: false, message: "missing booking id" });
        }

        const booking = await Booking.findById(bookingId);
        if (!booking) {
            return res.json({ success: false, message: "booking not found" });
        }

        if (!booking.isPaid) {
            booking.isPaid = true;
            booking.paidAt = new Date();
            await booking.save();
        }

        res.json({ success: true, message: "payment verified" });
    } catch (error) {
        console.log("Stripe success error:", error);
        res.json({ success: false, message: error.message || "payment verification failed" });
    }
}