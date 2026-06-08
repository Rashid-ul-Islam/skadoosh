import express from "express";
import rateLimit from "express-rate-limit";
import {
    register,
    verifyEmail,
    resendVerification,
    checkEmail,
} from "../controllers/authController.js";
import { validateRegister, validateCheckEmail } from "../middleware/validate.js";

const router = express.Router();

// ── Rate limiters ──────────────────────────────────────────────────────────────

/**
 * Strict limiter for registration — prevents bulk account creation / bots.
 * 5 attempts per IP per 15 minutes.
 */
const registerLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    message: { error: "Too many registration attempts. Please try again in 15 minutes." },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * Resend-verification limiter — prevents email flooding.
 * 3 attempts per IP per hour.
 */
const resendLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 3,
    message: { error: "Too many resend requests. Please wait an hour before trying again." },
    standardHeaders: true,
    legacyHeaders: false,
});

/**
 * General auth limiter for read operations.
 * 30 requests per IP per minute.
 */
const generalLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    message: { error: "Too many requests. Please slow down." },
    standardHeaders: true,
    legacyHeaders: false,
});

// ── Routes ─────────────────────────────────────────────────────────────────────

// POST /api/auth/register
router.post("/register", registerLimiter, validateRegister, register);

// GET  /api/auth/verify-email?token=<token>
router.get("/verify-email", generalLimiter, verifyEmail);

// POST /api/auth/resend-verification   body: { email }
router.post("/resend-verification", resendLimiter, resendVerification);

// GET  /api/auth/check-email/:email
router.get("/check-email/:email", generalLimiter, validateCheckEmail, checkEmail);

export default router;