import React, { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import {
  Package,
  Clock,
  CheckCircle2,
  XCircle,
  Truck,
  Trophy,
  AlertTriangle,
  Ban,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Loader2,
  Store,
  Tag,
  Calendar,
  MessageSquare,
  Star,
  ArrowUpRight,
  Filter,
  ShoppingBag,
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";
import { API_BASE_URL } from "../config/api.js";

// ── Helpers ───────────────────────────────────────────────────────────────────
const fmt = (n) => `৳${Number(n || 0).toLocaleString("en-BD")}`;

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-BD", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ── Status config ─────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  requested: {
    label: "Pending",
    icon: Clock,
    badge: "bg-amber-100 text-amber-700",
    border: "border-amber-200",
    bg: "bg-amber-50",
    dot: "bg-amber-400",
    description: "Waiting for the seller to respond.",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    badge: "bg-blue-100 text-blue-700",
    border: "border-blue-200",
    bg: "bg-blue-50",
    dot: "bg-blue-400",
    description: "Seller accepted. Coordinate via chat.",
  },
  rejected: {
    label: "Declined",
    icon: XCircle,
    badge: "bg-red-100 text-red-600",
    border: "border-red-200",
    bg: "bg-red-50",
    dot: "bg-red-400",
    description: "Seller declined this request.",
  },
  delivered: {
    label: "Delivered",
    icon: Truck,
    badge: "bg-purple-100 text-purple-700",
    border: "border-purple-200",
    bg: "bg-purple-50",
    dot: "bg-purple-400",
    description: "Seller marked as delivered. Please confirm receipt.",
  },
  completed: {
    label: "Completed",
    icon: Trophy,
    badge: "bg-green-100 text-green-700",
    border: "border-green-200",
    bg: "bg-green-50",
    dot: "bg-green-400",
    description: "Order completed successfully.",
  },
  cancelled: {
    label: "Cancelled",
    icon: Ban,
    badge: "bg-gray-100 text-gray-500",
    border: "border-gray-200",
    bg: "bg-gray-50",
    dot: "bg-gray-400",
    description: "This order was cancelled.",
  },
  disputed: {
    label: "Disputed",
    icon: AlertTriangle,
    badge: "bg-orange-100 text-orange-700",
    border: "border-orange-200",
    bg: "bg-orange-50",
    dot: "bg-orange-400",
    description: "A dispute has been opened. Our team will review.",
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

// ── Star rating input ─────────────────────────────────────────────────────────
function StarRating({ value, onChange }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110"
        >
          <Star
            className={`w-6 h-6 ${
              star <= (hovered || value)
                ? "fill-amber-400 text-amber-400"
                : "text-gray-300"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

// ── Review modal ──────────────────────────────────────────────────────────────
function ReviewModal({ order, onClose, onSubmit, submitting }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const canSubmit = rating >= 1 && !submitting;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Leave a Review</h2>
        <p className="text-sm text-gray-500 mb-5">
          How was your experience with{" "}
          <span className="font-semibold text-gray-700">
            {order.snapshot?.sellerName}
          </span>{" "}
          for{" "}
          <span className="font-semibold text-gray-700">
            {order.snapshot?.title}
          </span>
          ?
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Rating
          </label>
          <StarRating value={rating} onChange={setRating} />
        </div>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Comment{" "}
            <span className="text-gray-300 normal-case font-normal">
              (optional)
            </span>
          </label>
          <textarea
            rows={3}
            placeholder="Share your experience…"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-400 resize-none placeholder-gray-300"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(order._id, rating, comment)}
            disabled={!canSubmit}
            className="flex-1 py-2.5 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Star className="w-4 h-4" />
            )}
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Dispute modal ─────────────────────────────────────────────────────────────
function DisputeModal({ order, onClose, onSubmit, submitting }) {
  const [reason, setReason] = useState("");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6">
        <h2 className="text-lg font-bold text-gray-800 mb-1">Open a Dispute</h2>
        <p className="text-sm text-gray-500 mb-5">
          Describe the issue with your order for{" "}
          <span className="font-semibold text-gray-700">
            {order.snapshot?.title}
          </span>
          . Our team will review it.
        </p>

        <div className="mb-6">
          <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1.5">
            Reason <span className="text-red-400">*</span>
          </label>
          <textarea
            rows={4}
            placeholder="What went wrong? Be as specific as possible…"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-orange-300 focus:border-orange-400 resize-none placeholder-gray-300"
          />
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onSubmit(order._id, reason)}
            disabled={!reason.trim() || submitting}
            className="flex-1 py-2.5 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <AlertTriangle className="w-4 h-4" />
            )}
            Open Dispute
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Buyer action buttons ──────────────────────────────────────────────────────
function BuyerActions({
  order,
  onCancel,
  onComplete,
  onDispute,
  onReview,
  loadingId,
}) {
  const loading = loadingId === order._id;
  const { status } = order;

  return (
    <div className="flex flex-wrap gap-2 mt-4">
      {/* Cancel — while still pending */}
      {status === "requested" && (
        <button
          onClick={() => onCancel(order)}
          disabled={loading}
          className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 border border-red-200 text-red-600 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Ban className="w-4 h-4" />
          )}
          Cancel Request
        </button>
      )}

      {/* Confirm receipt — after seller marks delivered */}
      {status === "delivered" && (
        <>
          <button
            onClick={() => onComplete(order._id)}
            disabled={loading}
            className="flex-1 py-2.5 bg-green-500 hover:bg-green-600 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5 disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <CheckCircle2 className="w-4 h-4" />
            )}
            Confirm Receipt
          </button>
          <button
            onClick={() => onDispute(order)}
            disabled={loading}
            className="py-2.5 px-4 bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
          >
            Problem?
          </button>
        </>
      )}

      {/* Review — completed, not yet reviewed */}
      {status === "completed" && !order.review?.submittedAt && (
        <button
          onClick={() => onReview(order)}
          className="flex-1 py-2.5 bg-amber-50 hover:bg-amber-100 border border-amber-200 text-amber-700 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <Star className="w-4 h-4" />
          Leave a Review
        </button>
      )}
    </div>
  );
}

// ── Stat card ─────────────────────────────────────────────────────────────────
function StatCard({ label, value, icon: Icon, colorClass }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 flex items-center gap-4">
      <div className={`p-2.5 rounded-xl ${colorClass}`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className="text-xs text-gray-500 font-medium">{label}</p>
      </div>
    </div>
  );
}

// ── Single order card ─────────────────────────────────────────────────────────
function OrderCard({
  order,
  onCancel,
  onComplete,
  onDispute,
  onReview,
  actionLoadingId,
}) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.requested;
  const Icon = cfg.icon;

  return (
    <div
      className={`bg-white rounded-2xl border-2 ${cfg.border} overflow-hidden shadow-sm hover:shadow-md transition-shadow`}
    >
      {/* Status header */}
      <div className={`${cfg.bg} px-5 py-3 flex items-center justify-between`}>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${cfg.badge}`}
          >
            <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
            {cfg.label}
          </span>
          <span className="text-xs text-gray-400">
            #{order._id?.slice(-6).toUpperCase()}
          </span>
        </div>
        <span className="text-xs text-gray-400">
          {formatDate(order.createdAt)}
        </span>
      </div>

      {/* Body */}
      <div className="p-5">
        <div className="flex gap-4">
          {/* Thumbnail */}
          <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
            {order.snapshot?.image ? (
              <img
                src={order.snapshot.image}
                alt={order.snapshot.title}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-7 h-7 text-gray-300" />
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <h3 className="font-bold text-gray-800 leading-tight truncate mb-1">
              {order.snapshot?.title || "Untitled listing"}
            </h3>

            <div className="flex flex-wrap gap-1.5 mb-2">
              {order.snapshot?.listingType === "rent" ? (
                <span className="inline-flex items-center gap-1 text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">
                  <Calendar className="w-3 h-3" /> Rental
                  {order.rentalDays ? ` · ${order.rentalDays}d` : ""}
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                  <Tag className="w-3 h-3" /> For Sale
                </span>
              )}
              {order.quantity > 1 && (
                <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                  ×{order.quantity}
                </span>
              )}
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Store className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-xs text-gray-500">Seller:</span>
                <span className="text-sm font-semibold text-gray-700">
                  {order.snapshot?.sellerName || "—"}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {fmt(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Status description */}
        <p className="text-xs text-gray-400 mt-3 flex items-center gap-1.5">
          <Icon className="w-3.5 h-3.5 flex-shrink-0" />
          {cfg.description}
        </p>

        {/* Seller note */}
        {order.sellerNote && (
          <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
            <div>
              <span className="font-semibold text-gray-600">Seller: </span>
              {order.sellerNote}
            </div>
          </div>
        )}

        {/* Existing review */}
        {order.review?.submittedAt && (
          <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg px-3 py-2">
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`w-3.5 h-3.5 ${s <= order.review.rating ? "fill-amber-400 text-amber-400" : "text-gray-200"}`}
                />
              ))}
              <span className="text-xs text-gray-400 ml-1">Your review</span>
            </div>
            {order.review.comment && (
              <p className="text-xs text-gray-600">{order.review.comment}</p>
            )}
          </div>
        )}

        {/* Actions */}
        <BuyerActions
          order={order}
          onCancel={onCancel}
          onComplete={onComplete}
          onDispute={onDispute}
          onReview={onReview}
          loadingId={actionLoadingId}
        />

        {/* Expand toggle */}
        <button
          onClick={() => setExpanded((v) => !v)}
          className="mt-3 w-full flex items-center justify-center gap-1 text-xs text-gray-400 hover:text-gray-600 py-1 transition-colors"
        >
          {expanded ? (
            <>
              <ChevronUp className="w-3.5 h-3.5" /> Less details
            </>
          ) : (
            <>
              <ChevronDown className="w-3.5 h-3.5" /> More details
            </>
          )}
        </button>

        {/* Expanded details */}
        {expanded && (
          <div className="mt-3 pt-3 border-t border-gray-100 grid grid-cols-2 gap-x-4 gap-y-2 text-sm">
            {order.deliveryMethod && (
              <div>
                <p className="text-xs text-gray-400">Delivery</p>
                <p className="font-medium text-gray-700 capitalize">
                  {order.deliveryMethod}
                </p>
              </div>
            )}
            {order.paymentMethod && (
              <div>
                <p className="text-xs text-gray-400">Payment</p>
                <p className="font-medium text-gray-700 capitalize">
                  {order.paymentMethod.replace(/_/g, " ")}
                </p>
              </div>
            )}
            {order.deliveryAddress && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Delivery address</p>
                <p className="font-medium text-gray-700">
                  {order.deliveryAddress}
                </p>
              </div>
            )}
            {order.meetupLocation && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Meetup location</p>
                <p className="font-medium text-gray-700">
                  {order.meetupLocation}
                </p>
              </div>
            )}
            {order.rentalStartDate && (
              <div>
                <p className="text-xs text-gray-400">Rental start</p>
                <p className="font-medium text-gray-700">
                  {formatDate(order.rentalStartDate)}
                </p>
              </div>
            )}
            {order.rentalEndDate && (
              <div>
                <p className="text-xs text-gray-400">Rental end</p>
                <p className="font-medium text-gray-700">
                  {formatDate(order.rentalEndDate)}
                </p>
              </div>
            )}
            {order.buyerNote && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Your note</p>
                <p className="font-medium text-gray-700">{order.buyerNote}</p>
              </div>
            )}
            {order.cancellationReason && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Cancellation reason</p>
                <p className="font-medium text-gray-700">
                  {order.cancellationReason}
                </p>
              </div>
            )}
            {order.disputeReason && (
              <div className="col-span-2">
                <p className="text-xs text-gray-400">Dispute reason</p>
                <p className="font-medium text-gray-700">
                  {order.disputeReason}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function BuyerOrdersPage() {
  const { token, isHydrating } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [toast, setToast] = useState(null); // { type: 'success'|'error', text }

  // Modals
  const [reviewTarget, setReviewTarget] = useState(null);
  const [disputeTarget, setDisputeTarget] = useState(null);
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [disputeSubmitting, setDisputeSubmitting] = useState(false);

  const showToast = (type, text) => {
    setToast({ type, text });
    setTimeout(() => setToast(null), 4000);
  };

  // ── Fetch ───────────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (isHydrating || !token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/buyer`, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to load orders");
      const data = await res.json();
      const list = Array.isArray(data.orders)
        ? data.orders
        : Array.isArray(data)
          ? data
          : [];
      list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(list);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isHydrating, token]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  // ── Actions ─────────────────────────────────────────────────────────────────
  const patchOrder = async (orderId, action, body = {}) => {
    const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/${action}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Action failed");
    return data.order;
  };

  const updateOrderInList = (updated) => {
    setOrders((prev) =>
      prev.map((o) => (o._id === updated._id ? { ...o, ...updated } : o)),
    );
  };

  const handleCancel = async (order) => {
    setActionLoadingId(order._id);
    try {
      const updated = await patchOrder(order._id, "cancel");
      updateOrderInList(updated);
      showToast("success", "Order cancelled.");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleComplete = async (orderId) => {
    setActionLoadingId(orderId);
    try {
      const updated = await patchOrder(orderId, "complete");
      updateOrderInList(updated);
      showToast("success", "Receipt confirmed! Order completed.");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReviewSubmit = async (orderId, rating, comment) => {
    setReviewSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/${orderId}/review`, {
        method: "POST",
        headers: authHeaders,
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to submit review");
      // Patch review into the local order
      setOrders((prev) =>
        prev.map((o) =>
          o._id === orderId ? { ...o, review: data.review } : o,
        ),
      );
      setReviewTarget(null);
      showToast("success", "Review submitted. Thank you!");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setReviewSubmitting(false);
    }
  };

  const handleDisputeSubmit = async (orderId, reason) => {
    setDisputeSubmitting(true);
    try {
      const updated = await patchOrder(orderId, "dispute", { reason });
      updateOrderInList(updated);
      setDisputeTarget(null);
      showToast("success", "Dispute opened. Our team will review it.");
    } catch (err) {
      showToast("error", err.message);
    } finally {
      setDisputeSubmitting(false);
    }
  };

  // ── Computed stats ──────────────────────────────────────────────────────────
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const filtered =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Modals */}
      {reviewTarget && (
        <ReviewModal
          order={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmit={handleReviewSubmit}
          submitting={reviewSubmitting}
        />
      )}
      {disputeTarget && (
        <DisputeModal
          order={disputeTarget}
          onClose={() => setDisputeTarget(null)}
          onSubmit={handleDisputeSubmit}
          submitting={disputeSubmitting}
        />
      )}

      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <ShoppingBag className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">My Orders</h1>
                <p className="text-sm text-gray-500">
                  Track all your purchase requests
                </p>
              </div>
            </div>
            <button
              onClick={fetchOrders}
              disabled={loading}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl text-sm font-semibold transition-colors disabled:opacity-50"
            >
              <RefreshCw
                className={`w-4 h-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Toast */}
        {toast && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-sm ${
              toast.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {toast.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            {toast.text}
          </div>
        )}

        {/* Stats */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Pending"
              value={counts.requested}
              icon={Clock}
              colorClass="bg-amber-100 text-amber-600"
            />
            <StatCard
              label="Active"
              value={counts.accepted + counts.delivered}
              icon={Package}
              colorClass="bg-blue-100 text-blue-600"
            />
            <StatCard
              label="Completed"
              value={counts.completed}
              icon={Trophy}
              colorClass="bg-green-100 text-green-600"
            />
            <StatCard
              label="Total Orders"
              value={orders.length}
              icon={ShoppingBag}
              colorClass="bg-purple-100 text-purple-600"
            />
          </div>
        )}

        {/* Filter tabs */}
        {!loading && !error && orders.length > 0 && (
          <div className="flex items-center gap-2 flex-wrap">
            <Filter className="w-4 h-4 text-gray-400 mr-1" />
            <button
              onClick={() => setActiveFilter("all")}
              className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                activeFilter === "all"
                  ? "bg-gray-800 text-white"
                  : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
              }`}
            >
              All ({orders.length})
            </button>
            {ALL_STATUSES.filter((s) => counts[s] > 0).map((s) => {
              const cfg = STATUS_CONFIG[s];
              return (
                <button
                  key={s}
                  onClick={() => setActiveFilter(s)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-all ${
                    activeFilter === s
                      ? `${cfg.badge} border-2 ${cfg.border}`
                      : "bg-white border border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {cfg.label} ({counts[s]})
                </button>
              );
            })}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin mb-3 text-blue-400" />
            <p className="font-medium">Loading your orders…</p>
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-center py-16">
            <AlertTriangle className="w-12 h-12 text-red-400 mx-auto mb-3" />
            <h2 className="text-lg font-bold text-gray-700 mb-2">
              Couldn't load orders
            </h2>
            <p className="text-gray-500 mb-5 text-sm">{error}</p>
            <button
              onClick={fetchOrders}
              className="px-5 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm"
            >
              Try again
            </button>
          </div>
        )}

        {/* Empty */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBag className="w-9 h-9 text-gray-300" />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              When you request an item from a seller, it'll show up here so you
              can track it.
            </p>
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm"
            >
              Browse Listings
              <ArrowUpRight className="w-4 h-4" />
            </Link>
          </div>
        )}

        {/* Filtered empty */}
        {!loading && !error && orders.length > 0 && filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <p className="font-medium">
              No {STATUS_CONFIG[activeFilter]?.label.toLowerCase()} orders.
            </p>
          </div>
        )}

        {/* Cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onCancel={handleCancel}
                onComplete={handleComplete}
                onDispute={setDisputeTarget}
                onReview={setReviewTarget}
                actionLoadingId={actionLoadingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
