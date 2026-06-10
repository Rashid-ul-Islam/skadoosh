import express from "express";
import { authenticate } from "../middleware/auth.js"; // your existing JWT middleware
import {
    getCart,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
} from "../controllers/cartController.js";

const router = express.Router();

// All cart routes require authentication
router.use(authenticate);

// GET    /api/cart          → get current user's cart
router.get("/", getCart);

// POST   /api/cart/items    → add item to cart
router.post("/items", addToCart);

// PATCH  /api/cart/items/:itemId  → update quantity / rentalDays
router.patch("/items/:itemId", updateCartItem);

// DELETE /api/cart/items/:itemId  → remove one item
router.delete("/items/:itemId", removeCartItem);

// DELETE /api/cart          → clear entire cart
router.delete("/", clearCart);

export default router;