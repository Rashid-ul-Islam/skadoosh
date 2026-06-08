import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { sendVerificationEmail } from "../utils/sendEmail.js";

// ── Helpers ────────────────────────────────────────────────────────────────────

/**
 * Signs a JWT for the given user id.
 */
const signToken = (userId) =>
    jwt.sign({ id: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN || "7d",
    });

/**
 * Generates a secure random hex token and its SHA-256 hash.
 * The raw token goes in the email link; only the hash is stored in the DB
 * so that if the DB is compromised the tokens can't be used.
 */
const generateVerificationToken = () => {
    const rawToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto.createHash("sha256").update(rawToken).digest("hex");
    return { rawToken, hashedToken };
};

// ── Controllers ────────────────────────────────────────────────────────────────

/**
 * POST /api/auth/register
 *
 * 1. Check if email already exists
 * 2. Create user (password hashed via pre-save hook in User model)
 * 3. Generate email-verification token
 * 4. Send verification email
 * 5. Return success (do NOT log the user in yet — require email verification)
 */
export const register = async (req, res) => {
    try {
        const { firstName, lastName, email, password, phoneNumber, address, location } =
            req.sanitised; // set by validateRegister middleware

        // ── Duplicate email check ─────────────────────────────────────────────
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: "Email is already registered" });
        }

        // ── Build GeoJSON point ───────────────────────────────────────────────
        // Frontend sends { lat, lng }; GeoJSON stores [longitude, latitude]
        const geoLocation = {
            type: "Point",
            coordinates: [parseFloat(location.lng), parseFloat(location.lat)],
        };

        // ── Generate verification token ───────────────────────────────────────
        const { rawToken, hashedToken } = generateVerificationToken();
        const tokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

        // ── Create user ───────────────────────────────────────────────────────
        const user = await User.create({
            firstName,
            lastName,
            email,
            password,          // hashed by pre-save hook
            phoneNumber,
            address,
            location: geoLocation,
            emailVerificationToken: hashedToken,
            emailVerificationTokenExpires: tokenExpires,
        });

        // ── Send verification email ───────────────────────────────────────────
        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const verifyUrl = `${clientUrl}/verify-email?token=${rawToken}`;

        try {
            await sendVerificationEmail(email, firstName, verifyUrl);
        } catch (emailError) {
            // Email sending failed — user is created but not yet verified.
            // We still respond with success and tell the user to check their email.
            // Log the error server-side.
            console.error("Failed to send verification email:", emailError.message);
        }

        // ── Respond ───────────────────────────────────────────────────────────
        return res.status(201).json({
            message:
                "Account created successfully! Please check your email to verify your account before logging in.",
            user: user.toSafeObject(),
        });
    } catch (error) {
        console.error("Register error:", error);

        // Handle Mongoose duplicate key (race condition fallback)
        if (error.code === 11000) {
            return res.status(409).json({ error: "Email is already registered" });
        }

        // Handle Mongoose validation errors
        if (error.name === "ValidationError") {
            const errors = Object.values(error.errors).reduce((acc, e) => {
                acc[e.path] = e.message;
                return acc;
            }, {});
            return res.status(422).json({ errors });
        }

        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

/**
 * GET /api/auth/verify-email?token=<rawToken>
 *
 * Validates the token, marks the user as verified, and issues a JWT
 * so the user is logged in immediately after verifying.
 */
export const verifyEmail = async (req, res) => {
    try {
        const { token } = req.query;

        if (!token) {
            return res.status(400).json({ error: "Verification token is missing" });
        }

        // Hash the incoming raw token and look it up
        const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

        const user = await User.findOne({
            emailVerificationToken: hashedToken,
            emailVerificationTokenExpires: { $gt: Date.now() }, // not expired
        }).select("+emailVerificationToken +emailVerificationTokenExpires");

        if (!user) {
            return res.status(400).json({
                error: "Verification link is invalid or has expired. Please request a new one.",
            });
        }

        // Mark user as verified and clear the token fields
        user.isEmailVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationTokenExpires = undefined;
        user.lastLogin = new Date();
        await user.save();

        // Issue JWT — user is now logged in
        const jwtToken = signToken(user._id);

        return res.status(200).json({
            message: "Email verified successfully! Welcome to GrocCart.",
            token: jwtToken,
            user: user.toSafeObject(),
        });
    } catch (error) {
        console.error("Verify email error:", error);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

/**
 * POST /api/auth/resend-verification
 *
 * Resends a fresh verification email for accounts that haven't verified yet.
 * Rate-limited to prevent abuse (via express-rate-limit on the route).
 */
export const resendVerification = async (req, res) => {
    try {
        const email = req.body.email?.toLowerCase().trim();

        if (!email) {
            return res.status(400).json({ error: "Email is required" });
        }

        const user = await User.findOne({ email }).select(
            "+emailVerificationToken +emailVerificationTokenExpires"
        );

        // Always respond the same way to prevent email enumeration attacks
        const genericMsg =
            "If that email address is registered and unverified, a new verification link has been sent.";

        if (!user || user.isEmailVerified) {
            return res.status(200).json({ message: genericMsg });
        }

        // Generate a new token
        const { rawToken, hashedToken } = generateVerificationToken();
        user.emailVerificationToken = hashedToken;
        user.emailVerificationTokenExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
        await user.save();

        const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
        const verifyUrl = `${clientUrl}/verify-email?token=${rawToken}`;

        try {
            await sendVerificationEmail(email, user.firstName, verifyUrl);
        } catch (emailError) {
            console.error("Failed to resend verification email:", emailError.message);
        }

        return res.status(200).json({ message: genericMsg });
    } catch (error) {
        console.error("Resend verification error:", error);
        return res.status(500).json({ error: "Server error. Please try again later." });
    }
};

/**
 * GET /api/auth/check-email/:email
 *
 * Used by the frontend for real-time duplicate email checking.
 * Responds with { available: boolean }.
 */
export const checkEmail = async (req, res) => {
    try {
        const email = req.sanitisedEmail; // set by validateCheckEmail middleware
        const user = await User.findOne({ email }).select("_id").lean();
        return res.status(200).json({ available: !user });
    } catch (error) {
        console.error("Check email error:", error);
        return res.status(500).json({ error: "Server error" });
    }
};