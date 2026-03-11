import express from 'express'
import "dotenv/config";
import cors from "cors";
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";  // ✅ Perfect match

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// 5:52:23 - Isko hata do agar comment nahi hai to
app.use("/api/clerk", clerkWebhook); // ✅ Consistent name use karo

app.get('/', (req, res) => res.send("API WORKING"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));