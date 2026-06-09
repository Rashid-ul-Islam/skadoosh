import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import multer from "multer";
import Listing from "../models/Listing.js";

// ── __dirname shim for ESM ────────────────────────────────────────────────────
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ── Multer storage ────────────────────────────────────────────────────────────
const uploadsDir = path.join(__dirname, "../uploads/listings");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadsDir),
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
    },
});

const fileFilter = (_req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) cb(null, true);
    else cb(new Error("Only JPEG, PNG, WEBP and GIF images are allowed"), false);
};

export const upload = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024, files: 6 }, // 5 MB each, max 6
});

// ── Helper: parse numeric / boolean strings from FormData ────────────────────
const num = (v) => (v !== undefined && v !== "" ? Number(v) : undefined);
const bool = (v) => v === "true" || v === true;

// ── POST /api/listings ────────────────────────────────────────────────────────
export const createListing = async (req, res) => {
    try {
        const {
            listingType,
            title,
            category,
            condition,
            description,
            quantity,
            negotiable,
            deliveryAvailable,
            // sell
            price,
            // rent
            rentPricePerDay,
            depositAmount,
            minRentalDays,
            maxRentalDays,
            rentTerms,
        } = req.body;

        // ── Basic field validation ──────────────────────────────────────────────
        const missing = [];
        if (!title?.trim()) missing.push("title");
        if (!category) missing.push("category");
        if (!condition) missing.push("condition");
        if (!description?.trim()) missing.push("description");
        if (listingType === "sell" && !price) missing.push("price");
        if (listingType === "rent" && !rentPricePerDay)
            missing.push("rentPricePerDay");

        if (missing.length) {
            return res
                .status(400)
                .json({ error: `Missing required fields: ${missing.join(", ")}` });
        }

        if (!req.files || req.files.length === 0) {
            return res
                .status(400)
                .json({ error: "At least one image is required." });
        }

        // ── Build image array ───────────────────────────────────────────────────
        const images = req.files.map((f) => ({
            url: `/uploads/listings/${f.filename}`,
            filename: f.filename,
        }));

        // ── Create document ─────────────────────────────────────────────────────
        const listing = await Listing.create({
            seller: req.user._id,
            listingType,
            title: title.trim(),
            category,
            condition,
            description: description.trim(),
            quantity: num(quantity) ?? 1,
            negotiable: bool(negotiable),
            deliveryAvailable: bool(deliveryAvailable),
            images,
            // sell
            ...(listingType === "sell" && { price: num(price) }),
            // rent
            ...(listingType === "rent" && {
                rentPricePerDay: num(rentPricePerDay),
                depositAmount: num(depositAmount) ?? 0,
                ...(minRentalDays && { minRentalDays: num(minRentalDays) }),
                ...(maxRentalDays && { maxRentalDays: num(maxRentalDays) }),
                rentTerms: rentTerms?.trim() || "",
            }),
        });

        return res.status(201).json({
            message: "Listing created successfully.",
            listing,
        });
    } catch (err) {
        // Clean up uploaded files if DB save failed
        if (req.files) {
            req.files.forEach((f) => {
                fs.unlink(f.path, () => { });
            });
        }
        console.error("createListing error:", err);
        return res.status(500).json({ error: "Failed to create listing." });
    }
};

// ── GET /api/listings ─────────────────────────────────────────────────────────
export const getListings = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 20,
            category,
            listingType,
            condition,
            minPrice,
            maxPrice,
            search,
            status = "active",
        } = req.query;

        const filter = { status };
        if (category) filter.category = category;
        if (listingType) filter.listingType = listingType;
        if (condition) filter.condition = condition;
        if (minPrice || maxPrice) {
            filter.price = {};
            if (minPrice) filter.price.$gte = Number(minPrice);
            if (maxPrice) filter.price.$lte = Number(maxPrice);
        }
        if (search) filter.$text = { $search: search };

        const [listings, total] = await Promise.all([
            Listing.find(filter)
                .populate("seller", "name email")
                .sort({ createdAt: -1 })
                .skip((page - 1) * limit)
                .limit(Number(limit)),
            Listing.countDocuments(filter),
        ]);

        res.json({ listings, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (err) {
        console.error("getListings error:", err);
        res.status(500).json({ error: "Failed to fetch listings." });
    }
};

// ── GET /api/listings/:id ─────────────────────────────────────────────────────
export const getListingById = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id).populate(
            "seller",
            "name email"
        );
        if (!listing) return res.status(404).json({ error: "Listing not found." });
        res.json({ listing });
    } catch (err) {
        console.error("getListingById error:", err);
        res.status(500).json({ error: "Failed to fetch listing." });
    }
};

// ── DELETE /api/listings/:id ──────────────────────────────────────────────────
export const deleteListing = async (req, res) => {
    try {
        const listing = await Listing.findById(req.params.id);
        if (!listing) return res.status(404).json({ error: "Listing not found." });

        if (listing.seller.toString() !== req.user._id.toString()) {
            return res.status(403).json({ error: "Not authorised." });
        }

        // Delete image files from disk
        listing.images.forEach(({ filename }) => {
            if (filename) {
                fs.unlink(path.join(uploadsDir, filename), () => { });
            }
        });

        await listing.deleteOne();
        res.json({ message: "Listing deleted." });
    } catch (err) {
        console.error("deleteListing error:", err);
        res.status(500).json({ error: "Failed to delete listing." });
    }
};