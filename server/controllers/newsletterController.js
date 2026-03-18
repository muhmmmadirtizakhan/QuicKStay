import crypto from "crypto";
import NewsletterSubscriber from "../models/NewsletterSubscriber.js";
import transporter from "../configs/nodemailer.js";

const buildVerifyLink = (token) => {
  const frontend = process.env.FRONTEND_URL || "http://localhost:5173";
  return `${frontend}/?newsletter_verify=${token}`;
};

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes("@")) {
      return res.json({ success: false, message: "Please provide a valid email" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const token = crypto.randomBytes(24).toString("hex");
    const verifyLink = buildVerifyLink(token);

    const existing = await NewsletterSubscriber.findOne({ email: normalizedEmail });
    if (existing && existing.verified) {
      return res.json({ success: true, message: "You are already subscribed" });
    }

    if (existing) {
      existing.token = token;
      await existing.save();
    } else {
      await NewsletterSubscriber.create({ email: normalizedEmail, token, verified: false });
    }

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: normalizedEmail,
      subject: "Verify your newsletter subscription",
      html: `
        <h2>Confirm your subscription</h2>
        <p>Click the button below to verify your email and complete subscription.</p>
        <p><a href="${verifyLink}" target="_blank" rel="noreferrer">Verify Email</a></p>
        <p>If you did not request this, you can ignore this email.</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.json({ success: true, message: "Verification email sent. Please check your inbox." });
  } catch (error) {
    console.log("subscribeNewsletter error:", error.message);
    res.json({ success: false, message: error.message || "Failed to subscribe" });
  }
};

export const verifyNewsletter = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) {
      return res.json({ success: false, message: "Invalid token" });
    }

    const subscriber = await NewsletterSubscriber.findOne({ token });
    if (!subscriber) {
      return res.json({ success: false, message: "Token not found or already verified" });
    }

    subscriber.verified = true;
    subscriber.token = null;
    await subscriber.save();

    res.json({ success: true, message: "Email verified successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message || "Verification failed" });
  }
};
