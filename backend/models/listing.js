import mongoose from "mongoose";

const listingSchema = new mongoose.Schema(
    {
        seller: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
            index: true,
        },

        listingType: {
            type: String,
            enum: ["sell", "rent"],
            required: true,
        },

        // ── Core fields ──────────────────────────────────────────────────────────
        title: {
            type: String,
            required: true,
            trim: true,
            maxlength: 100,
        },
        category: {
            type: String,
            required: true,
            enum: [
                "Electronics & Gadgets",
                "Furniture & Home",
                "Clothing & Accessories",
                "Books & Stationery",
                "Sports & Outdoors",
                "Toys & Games",
                "Tools & Equipment",
                "Vehicles & Parts",
                "Kitchen & Appliances",
                "Musical Instruments",
                "Art & Collectibles",
                "Other",
            ],
        },
        condition: {
            type: String,
            required: true,
            enum: ["new", "like_new", "good", "fair", "poor"],
        },
        description: {
            type: String,
            required: true,
            trim: true,
            maxlength: 2000,
        },
        quantity: {
            type: Number,
            default: 1,
            min: 1,
        },

        // ── Images ───────────────────────────────────────────────────────────────
        images: [
            {
                url: { type: String, required: true },
                filename: { type: String },
            },
        ],

        // ── Sale-specific ─────────────────────────────────────────────────────────
        price: {
            type: Number,
            min: 0,
        },
        negotiable: {
            type: Boolean,
            default: false,
        },
        deliveryAvailable: {
            type: Boolean,
            default: false,
        },

        // ── Rent-specific ─────────────────────────────────────────────────────────
        rentPricePerDay: {
            type: Number,
            min: 0,
        },
        depositAmount: {
            type: Number,
            min: 0,
            default: 0,
        },
        minRentalDays: {
            type: Number,
            min: 1,
        },
        maxRentalDays: {
            type: Number,
            min: 1,
        },
        rentTerms: {
            type: String,
            trim: true,
            maxlength: 1000,
        },

        // ── Location (copied from seller at creation time) ────────────────────────
        // Stored on the listing so geo queries don't require a join through User.
        location: {
            type: {
                type: String,
                enum: ["Point"],
                default: "Point",
            },
            coordinates: {
                type: [Number], // [lng, lat]  ← GeoJSON order
                required: true,
            },
        },

        // ── Status ────────────────────────────────────────────────────────────────
        status: {
            type: String,
            enum: ["active", "sold", "rented", "archived"],
            default: "active",
            index: true,
        },
    },
    { timestamps: true }
);

// ── Indexes ───────────────────────────────────────────────────────────────────
listingSchema.index({ title: "text", description: "text" });
listingSchema.index({ location: "2dsphere" }); // enables $near / $geoWithin queries

export default mongoose.model("Listing", listingSchema);