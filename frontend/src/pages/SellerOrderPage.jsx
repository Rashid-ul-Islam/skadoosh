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
  User,
  Tag,
  Calendar,
  MessageSquare,
  Store,
  ArrowUpRight,
  Filter,
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
    color: "amber",
    icon: Clock,
    bg: "bg-amber-50",
    border: "border-amber-200",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-400",
  },
  accepted: {
    label: "Accepted",
    color: "blue",
    icon: CheckCircle2,
    bg: "bg-blue-50",
    border: "border-blue-200",
    badge: "bg-blue-100 text-blue-700",
    dot: "bg-blue-400",
  },
  rejected: {
    label: "Rejected",
    color: "red",
    icon: XCircle,
    bg: "bg-red-50",
    border: "border-red-200",
    badge: "bg-red-100 text-red-600",
    dot: "bg-red-400",
  },
  delivered: {
    label: "Delivered",
    color: "purple",
    icon: Truck,
    bg: "bg-purple-50",
    border: "border-purple-200",
    badge: "bg-purple-100 text-purple-700",
    dot: "bg-purple-400",
  },
  completed: {
    label: "Completed",
    color: "green",
    icon: Trophy,
    bg: "bg-green-50",
    border: "border-green-200",
    badge: "bg-green-100 text-green-700",
    dot: "bg-green-400",
  },
  cancelled: {
    label: "Cancelled",
    color: "gray",
    icon: Ban,
    bg: "bg-gray-50",
    border: "border-gray-200",
    badge: "bg-gray-100 text-gray-500",
    dot: "bg-gray-400",
  },
  disputed: {
    label: "Disputed",
    color: "orange",
    icon: AlertTriangle,
    bg: "bg-orange-50",
    border: "border-orange-200",
    badge: "bg-orange-100 text-orange-700",
    dot: "bg-orange-400",
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

// ── Stats card ────────────────────────────────────────────────────────────────
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

// ── Action buttons per status ─────────────────────────────────────────────────
function OrderActions({ order, onAction, loading }) {
  const { status } = order;

  if (status === "requested") {
    return (
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onAction(order._id, "accept")}
          disabled={loading}
          className="flex-1 py-2.5 bg-blue-500 hover:bg-blue-600 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          Accept
        </button>
        <button
          onClick={() => onAction(order._id, "reject")}
          disabled={loading}
          className="flex-1 py-2.5 bg-red-50 hover:bg-red-100 disabled:opacity-60 text-red-600 border border-red-200 rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          <XCircle className="w-4 h-4" />
          Decline
        </button>
      </div>
    );
  }

  if (status === "accepted") {
    return (
      <div className="flex gap-2 mt-4">
        <button
          onClick={() => onAction(order._id, "deliver")}
          disabled={loading}
          className="flex-1 py-2.5 bg-purple-500 hover:bg-purple-600 disabled:opacity-60 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-1.5"
        >
          {loading ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Truck className="w-4 h-4" />
          )}
          Mark as Delivered
        </button>
        <button
          onClick={() => onAction(order._id, "cancel")}
          disabled={loading}
          className="py-2.5 px-4 bg-gray-100 hover:bg-gray-200 disabled:opacity-60 text-gray-600 rounded-xl text-sm font-semibold transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return null;
}

// ── Single order card ─────────────────────────────────────────────────────────
function OrderCard({ order, onAction, actionLoadingId }) {
  const [expanded, setExpanded] = useState(false);
  const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.requested;
  const Icon = cfg.icon;
  const isLoading = actionLoadingId === order._id;

  return (
    <div
      className={`bg-white rounded-2xl border-2 ${cfg.border} overflow-hidden shadow-sm transition-shadow hover:shadow-md`}
    >
      {/* Card header */}
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

      {/* Main content */}
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
              <div className="flex items-center gap-1.5 text-sm">
                <User className="w-3.5 h-3.5 text-gray-400" />
                <span className="text-gray-500 text-xs">Buyer:</span>
                <span className="font-semibold text-gray-700 text-sm">
                  {order.snapshot?.buyerName || "—"}
                </span>
              </div>
              <span className="text-lg font-bold text-blue-600">
                {fmt(order.totalAmount)}
              </span>
            </div>
          </div>
        </div>

        {/* Buyer note preview */}
        {order.buyerNote && (
          <div className="mt-3 flex items-start gap-2 text-xs text-gray-500 bg-gray-50 rounded-lg px-3 py-2">
            <MessageSquare className="w-3.5 h-3.5 flex-shrink-0 mt-0.5 text-gray-400" />
            <p className="leading-relaxed line-clamp-2">{order.buyerNote}</p>
          </div>
        )}

        {/* Actions */}
        <OrderActions order={order} onAction={onAction} loading={isLoading} />

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
                  {order.paymentMethod.replace("_", " ")}
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
            {order.agreedPrice && (
              <div>
                <p className="text-xs text-gray-400">Unit price</p>
                <p className="font-medium text-gray-700">
                  {fmt(order.agreedPrice)}
                </p>
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
          </div>
        )}
      </div>
    </div>
  );
}

// ── Main component ────────────────────────────────────────────────────────────
export default function SellerOrdersPage() {
  const { token, isHydrating } = useAuth();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [actionMessage, setActionMessage] = useState(null); // { type, text }

  // ── Fetch orders ────────────────────────────────────────────────────────────
  const fetchOrders = useCallback(async () => {
    if (isHydrating || !token) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/orders/seller`, {
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
      // Sort: newest first
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

  // ── Status actions ──────────────────────────────────────────────────────────
  const handleAction = async (orderId, action) => {
    setActionLoadingId(orderId);
    setActionMessage(null);
    try {
      const res = await fetch(
        `${API_BASE_URL}/api/orders/${orderId}/${action}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Action failed");

      // Update order in list
      setOrders((prev) =>
        prev.map((o) => (o._id === orderId ? { ...o, ...data.order } : o)),
      );

      const labels = {
        accept: "Order accepted! Chat with the buyer to coordinate.",
        reject: "Order declined.",
        deliver: "Marked as delivered. Waiting for buyer confirmation.",
        cancel: "Order cancelled.",
      };
      setActionMessage({ type: "success", text: labels[action] || "Done." });
    } catch (err) {
      setActionMessage({ type: "error", text: err.message });
    } finally {
      setActionLoadingId(null);
      setTimeout(() => setActionMessage(null), 4000);
    }
  };

  // ── Computed stats ──────────────────────────────────────────────────────────
  const counts = ALL_STATUSES.reduce((acc, s) => {
    acc[s] = orders.filter((o) => o.status === s).length;
    return acc;
  }, {});

  const pendingCount = counts.requested;
  const activeCount = counts.accepted + counts.delivered;
  const completedCount = counts.completed;
  const totalEarned = orders
    .filter((o) => o.status === "completed")
    .reduce((s, o) => s + (o.totalAmount || 0), 0);

  // ── Filter ──────────────────────────────────────────────────────────────────
  const filtered =
    activeFilter === "all"
      ? orders
      : orders.filter((o) => o.status === activeFilter);

  // ── Render ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Seller Dashboard
                </h1>
                <p className="text-sm text-gray-500">
                  Manage requests for your listings
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
        {/* Action message toast */}
        {actionMessage && (
          <div
            className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium shadow-sm ${
              actionMessage.type === "success"
                ? "bg-green-50 border border-green-200 text-green-700"
                : "bg-red-50 border border-red-200 text-red-700"
            }`}
          >
            {actionMessage.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 flex-shrink-0" />
            )}
            {actionMessage.text}
          </div>
        )}

        {/* Stats row */}
        {!loading && !error && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <StatCard
              label="Pending Requests"
              value={pendingCount}
              icon={Clock}
              colorClass="bg-amber-100 text-amber-600"
            />
            <StatCard
              label="Active Orders"
              value={activeCount}
              icon={Package}
              colorClass="bg-blue-100 text-blue-600"
            />
            <StatCard
              label="Completed"
              value={completedCount}
              icon={Trophy}
              colorClass="bg-green-100 text-green-600"
            />
            <StatCard
              label="Total Earned"
              value={fmt(totalEarned)}
              icon={Tag}
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
            <p className="font-medium">Loading orders…</p>
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

        {/* Empty state */}
        {!loading && !error && orders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <ShoppingBagEmpty />
            </div>
            <h2 className="text-xl font-bold text-gray-700 mb-2">
              No orders yet
            </h2>
            <p className="text-gray-500 text-sm mb-6 max-w-sm mx-auto">
              When buyers request your listings, they'll show up here. Make sure
              your listings are active!
            </p>
            <Link
              to="/my-listings"
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-500 text-white rounded-xl font-semibold hover:bg-blue-600 transition-colors text-sm"
            >
              View My Listings
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

        {/* Order cards */}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((order) => (
              <OrderCard
                key={order._id}
                order={order}
                onAction={handleAction}
                actionLoadingId={actionLoadingId}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Inline SVG placeholder for empty state
function ShoppingBagEmpty() {
  return (
    <svg
      width="40"
      height="40"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#9ca3af"
      strokeWidth="1.5"
    >
      <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
      <line x1="3" y1="6" x2="21" y2="6" />
      <path d="M16 10a4 4 0 01-8 0" />
    </svg>
  );
}
