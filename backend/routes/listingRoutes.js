import express from "express";
import {
    upload,
    createListing,
    getListings,
    getListingById,
    deleteListing,
} from "../controllers/listingController.js";
import { protect } from "../middleware/authMiddleware.js"; // reuse your existing auth guard

const router = express.Router();

// Public
router.get("/", getListings);
router.get("/:id", getListingById);

// Protected
router.post("/", protect, upload.array("images", 6), createListing);
router.delete("/:id", protect, deleteListing);

export default router;