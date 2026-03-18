import express from "express";
import { subscribeNewsletter, verifyNewsletter } from "../controllers/newsletterController.js";

const newsletterRouter = express.Router();

newsletterRouter.post("/subscribe", subscribeNewsletter);
newsletterRouter.get("/verify", verifyNewsletter);

export default newsletterRouter;
