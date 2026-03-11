import express from 'express'
import "dotenv/config";
import cors from "cors";
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express'
import clerkWebhooks from "./controllers/clerkWebhooks.js";  // ✅ Import with correct name

connectDB();

const app = express();
app.use(cors());
app.use(express.json());
app.use(clerkMiddleware());

// Use the imported variable - Line 16
app.use("/api/clerk", clerkWebhooks);  // ✅ Use clerkWebhooks, not clerkWebhook

app.get('/', (req, res) => res.send("API WORKING"));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`SERVER RUNNING ON PORT ${PORT}`));

export default app;