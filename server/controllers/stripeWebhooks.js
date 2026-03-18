import stripe from "stripe";
import Booking from "../models/Booking.js"; // ✅ Import add kiya

export const stripeWebhooks = async (req, res) => { // ✅ req, res parameters add kiye
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = req.headers['stripe-signature']; // ✅ request -> req
    let event;
    
    try {
        event = stripeInstance.webhooks.constructEvent(
            req.body, 
            sig, 
            process.env.STRIPE_WEBHOOK_SECRET // ✅ WENHOOK -> WEBHOOK spelling fix
        );
    } catch (error) {
        return res.status(400).send(`Webhook Error: ${error.message}`); // ✅ Response -> res
    }
    
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        const paymentIntentId = paymentIntent.id; // ✅ aymentIntent -> paymentIntent spelling fix

        const session = await stripeInstance.checkout.sessions.list({
            payment_intent: paymentIntentId,
        });
        
        const { bookingId } = session.data[0].metadata;
        await Booking.findByIdAndUpdate( // ✅ findbYIdAndUpdate -> findByIdAndUpdate fix
            bookingId, 
            { 
                isPaid: true, 
                paymentMethod: "stripe" 
            }
        );
        
        console.log("Payment successful for booking:", bookingId);
    } else {
        console.log("Unhandled event type:", event.type);
    }
    
    res.json({ received: true }); // ✅ response -> res
}