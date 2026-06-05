import { useState } from "react";

const products = {
  recent: [
    {
      id: 1,
      emoji: "📱",
      bg: "#E1F5EE",
      title: "Samsung S23 FE",
      price: "৳28,500",
      meta: "12 min ago",
      seller: "Rahim K.",
      initials: "RK",
      avatarBg: "#E1F5EE",
      avatarColor: "#0F6E56",
      verified: true,
      badge: "New",
      badgeClass: "badge-new",
    },
    {
      id: 2,
      emoji: "👟",
      bg: "#FAEEDA",
      title: "Nike Air Max 97",
      price: "৳4,200",
      meta: "28 min ago",
      seller: "Sabina N.",
      initials: "SN",
      avatarBg: "#FAEEDA",
      avatarColor: "#854F0B",
      verified: true,
      badge: "Hot",
      badgeClass: "badge-hot",
    },
    {
      id: 3,
      emoji: "💻",
      bg: "#E6F1FB",
      title: "MacBook Air M2",
      price: "৳95,000",
      meta: "45 min ago",
      seller: "Tanvir H.",
      initials: "TH",
      avatarBg: "#E6F1FB",
      avatarColor: "#185FA5",
      verified: true,
      badge: "New",
      badgeClass: "badge-new",
    },
    {
      id: 4,
      emoji: "🪑",
      bg: "#FBEAF0",
      title: "Office Chair",
      price: "৳3,800",
      meta: "1 hr ago",
      seller: "Mina A.",
      initials: "MA",
      avatarBg: "#FBEAF0",
      avatarColor: "#72243E",
      verified: false,
      badge: null,
    },
  ],
  nearby: [
    {
      id: 1,
      emoji: "🥗",
      bg: "#E1F5EE",
      title: "Organic Veggies Box",
      price: "৳650",
      meta: "Dhanmondi",
      seller: "Green Farm",
      initials: "GF",
      avatarBg: "#E1F5EE",
      avatarColor: "#0F6E56",
      verified: true,
      badge: "0.4 km",
      badgeClass: "badge-nearby",
    },
    {
      id: 2,
      emoji: "🛋️",
      bg: "#FAEEDA",
      title: "3-Seater Sofa",
      price: "৳14,000",
      meta: "Gulshan",
      seller: "Karim A.",
      initials: "KA",
      avatarBg: "#FAEEDA",
      avatarColor: "#854F0B",
      verified: true,
      badge: "1.1 km",
      badgeClass: "badge-nearby",
    },
    {
      id: 3,
      emoji: "📚",
      bg: "#E6F1FB",
      title: "HSC Books Set",
      price: "৳900",
      meta: "Mirpur",
      seller: "Farhan J.",
      initials: "FJ",
      avatarBg: "#E6F1FB",
      avatarColor: "#185FA5",
      verified: false,
      badge: "1.8 km",
      badgeClass: "badge-nearby",
    },
    {
      id: 4,
      emoji: "🚲",
      bg: "#FCEBEB",
      title: "Kids Bicycle",
      price: "৳2,200",
      meta: "Banani",
      seller: "Nadia R.",
      initials: "NR",
      avatarBg: "#FCEBEB",
      avatarColor: "#A32D2D",
      verified: true,
      badge: "2.0 km",
      badgeClass: "badge-nearby",
    },
  ],
  rent: [
    {
      id: 1,
      emoji: "📷",
      bg: "#FAEEDA",
      title: "Canon DSLR Kit",
      price: "৳1,200/day",
      meta: "Min. 1 day",
      seller: "Photo Studio",
      initials: "PS",
      avatarBg: "#FAEEDA",
      avatarColor: "#854F0B",
      verified: true,
    },
    {
      id: 2,
      emoji: "🎪",
      bg: "#E6F1FB",
      title: "Event Tent 10×10",
      price: "৳3,500/day",
      meta: "Min. 1 day",
      seller: "Event Rentals",
      initials: "ER",
      avatarBg: "#E6F1FB",
      avatarColor: "#185FA5",
      verified: true,
    },
    {
      id: 3,
      emoji: "🔧",
      bg: "#EAF3DE",
      title: "Power Drill Set",
      price: "৳400/day",
      meta: "Min. 2 days",
      seller: "Tool Trade",
      initials: "TT",
      avatarBg: "#EAF3DE",
      avatarColor: "#3B6D11",
      verified: false,
    },
    {
      id: 4,
      emoji: "🎸",
      bg: "#FBEAF0",
      title: "Acoustic Guitar",
      price: "৳350/day",
      meta: "Min. 3 days",
      seller: "Music Buddy",
      initials: "MB",
      avatarBg: "#FBEAF0",
      avatarColor: "#72243E",
      verified: true,
    },
  ],
};

const recentFilters = [
  "Latest",
  "Electronics",
  "Fashion",
  "Home & Garden",
  "Books",
];
const nearbyFilters = ["≤ 2 km", "≤ 5 km", "≤ 10 km", "Delivery"];
const rentFilters = ["All", "Per day", "Per week", "Events", "Equipment"];

function ProductCard({ item, metaIcon, priceClass = "" }) {
  return (
    <div className="bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:-translate-y-0.5 hover:border-gray-300 transition-all duration-150">
      {/* Image area */}
      <div
        className="relative w-full aspect-square flex items-center justify-center text-4xl"
        style={{ background: item.bg }}
      >
        <span>{item.emoji}</span>
        {item.badge && (
          <span
            className={`absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full ${item.badgeClass}`}
          >
            {item.badge}
          </span>
        )}
        {item.badgeClass === "badge-rent" && (
          <span className="absolute top-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-full badge-rent">
            Rent
          </span>
        )}
      </div>

      {/* Body */}
      <div className="px-2.5 pt-2 pb-2.5">
        <p className="text-[13px] font-medium text-gray-900 dark:text-gray-100 truncate mb-0.5">
          {item.title}
        </p>
        <p
          className={`font-bold text-[14px] mb-1 ${priceClass || "text-[#1D9E75]"}`}
        >
          {item.price}
        </p>
        <p className="text-[11px] text-gray-400 flex items-center gap-1">
          <span>{metaIcon}</span> {item.meta}
        </p>

        {/* Seller row */}
        <div className="flex items-center gap-1.5 mt-1.5 pt-1.5 border-t border-gray-100 dark:border-gray-800">
          <div
            className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold flex-shrink-0"
            style={{ background: item.avatarBg, color: item.avatarColor }}
          >
            {item.initials}
          </div>
          <span className="text-[11px] text-gray-500 truncate">
            {item.seller}
          </span>
          {item.verified && (
            <span
              className="ml-auto text-[#1D9E75] text-[11px] flex-shrink-0"
              title="Verified seller"
            >
              ✔
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

function FilterChips({ filters, active, onSelect }) {
  return (
    <div className="flex gap-1.5 flex-wrap mb-3">
      {filters.map((f) => (
        <button
          key={f}
          onClick={() => onSelect(f)}
          className={`text-xs px-3 py-1 rounded-full border transition-all duration-100 font-medium ${
            active === f
              ? "bg-[#1D9E75] text-white border-[#1D9E75]"
              : "bg-white dark:bg-gray-900 text-gray-500 border-gray-200 dark:border-gray-700 hover:border-gray-400"
          }`}
        >
          {f}
        </button>
      ))}
    </div>
  );
}

export default function MarketplaceHomepage() {
  const [recentFilter, setRecentFilter] = useState("Latest");
  const [nearbyFilter, setNearbyFilter] = useState("≤ 2 km");
  const [rentFilter, setRentFilter] = useState("All");

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 font-sans">
      {/* ── Header ── */}
      <header className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 flex items-center justify-between h-14">
        <div
          className="flex items-center gap-1.5 font-extrabold text-xl tracking-tight"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          <span className="w-2 h-2 rounded-full bg-[#1D9E75] inline-block animate-pulse" />
          <span className="text-gray-900 dark:text-white">Bazaar</span>
          <span className="text-[#1D9E75]">Hub</span>
        </div>
        <nav className="flex items-center gap-2">
          <button className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            ♡
          </button>
          <button className="text-sm px-3 py-1.5 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 transition">
            🔔
          </button>
          <button className="text-sm px-4 py-1.5 rounded-lg bg-[#1D9E75] text-white font-medium hover:bg-[#0F6E56] transition">
            + Sell
          </button>
        </nav>
      </header>

      {/* ── Hero ── */}
      <section className="bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800 px-6 py-10">
        <div className="max-w-2xl mx-auto">
          {/* Badge */}
          <div
            className="inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: "#E1F5EE", color: "#0F6E56" }}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1D9E75] animate-pulse inline-block" />
            Zero commission · Keep 100% of sales
          </div>

          {/* Headline */}
          <h1
            className="text-[32px] font-extrabold leading-tight tracking-tight text-gray-900 dark:text-white mb-3"
            style={{ fontFamily: "'Syne', sans-serif" }}
          >
            Your local marketplace,
            <br />
            <span className="text-[#1D9E75]">no middleman</span> fees.
          </h1>

          <p className="text-[15px] text-gray-500 dark:text-gray-400 leading-relaxed max-w-lg mb-5 font-light">
            Buy and sell products directly with people in your community.
            Verified sellers, secure payments, and real-time delivery tracking —
            all in one place.
          </p>

          {/* Search */}
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl px-3.5 h-11">
              <span className="text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search products, categories..."
                className="bg-transparent border-none outline-none text-sm text-gray-800 dark:text-gray-100 placeholder-gray-400 flex-1"
              />
            </div>
            <button className="h-11 px-5 bg-[#1D9E75] text-white rounded-xl text-sm font-medium hover:bg-[#0F6E56] transition whitespace-nowrap">
              📍 Nearby
            </button>
          </div>

          {/* Stats */}
          <div className="flex flex-wrap gap-x-5 gap-y-1 mt-5">
            {[
              ["24,800+", "active listings"],
              ["6,200", "verified sellers"],
              ["3.2 km", "avg. delivery radius"],
            ].map(([num, label], i) => (
              <span
                key={i}
                className="text-sm text-gray-400 flex items-center gap-1"
              >
                <strong className="text-gray-700 dark:text-gray-200 font-medium">
                  {num}
                </strong>{" "}
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ── Body ── */}
      <div className="max-w-2xl mx-auto px-6 pb-16">
        {/* ── Section: Recent Uploads ── */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3.5">
            <h2
              className="flex items-center gap-2 text-[17px] font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "#E1F5EE", color: "#0F6E56" }}
              >
                🕐
              </span>
              Recent uploads
            </h2>
            <button className="text-sm text-[#1D9E75] font-medium flex items-center gap-1 hover:underline">
              See all →
            </button>
          </div>
          <FilterChips
            filters={recentFilters}
            active={recentFilter}
            onSelect={setRecentFilter}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {products.recent.map((item) => (
              <ProductCard key={item.id} item={item} metaIcon="🕐" />
            ))}
          </div>
        </section>

        {/* ── Section: Nearby Products ── */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3.5">
            <h2
              className="flex items-center gap-2 text-[17px] font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "#E6F1FB", color: "#185FA5" }}
              >
                📍
              </span>
              Nearby products
            </h2>
            <button className="text-sm text-[#1D9E75] font-medium flex items-center gap-1 hover:underline">
              See all →
            </button>
          </div>
          <FilterChips
            filters={nearbyFilters}
            active={nearbyFilter}
            onSelect={setNearbyFilter}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {products.nearby.map((item) => (
              <ProductCard key={item.id} item={item} metaIcon="📍" />
            ))}
          </div>
        </section>

        {/* ── Section: Products for Rent ── */}
        <section className="mt-8">
          <div className="flex items-center justify-between mb-3.5">
            <h2
              className="flex items-center gap-2 text-[17px] font-bold text-gray-900 dark:text-white"
              style={{ fontFamily: "'Syne', sans-serif" }}
            >
              <span
                className="w-7 h-7 rounded-lg flex items-center justify-center text-sm"
                style={{ background: "#FAEEDA", color: "#854F0B" }}
              >
                📅
              </span>
              Products for rent
            </h2>
            <button className="text-sm text-[#1D9E75] font-medium flex items-center gap-1 hover:underline">
              See all →
            </button>
          </div>
          <FilterChips
            filters={rentFilters}
            active={rentFilter}
            onSelect={setRentFilter}
          />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            {products.rent.map((item) => (
              <ProductCard
                key={item.id}
                item={{
                  ...item,
                  badge: "badge-rent",
                  badgeClass: "badge-rent",
                }}
                metaIcon="📅"
                priceClass="text-[#854F0B]"
              />
            ))}
          </div>
        </section>
      </div>

      {/* Badge color styles */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Syne:wght@700;800&display=swap');
        .badge-new  { background: #E1F5EE; color: #0F6E56; }
        .badge-hot  { background: #FCEBEB; color: #A32D2D; }
        .badge-nearby { background: #E6F1FB; color: #185FA5; }
        .badge-rent { background: #FAEEDA; color: #854F0B; }
      `}</style>
    </div>
  );
}
