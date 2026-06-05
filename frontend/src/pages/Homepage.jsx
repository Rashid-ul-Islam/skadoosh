import React, { useState, useCallback, useRef } from "react";
import ProductCard from "../components/layout/ProductCard";
import CartBar from "../components/layout/CartBar.jsx";
import { useNavigate } from "react-router-dom";

const products = {
  recent: [
    { id: 1, title: "Samsung S23 FE", price: "৳28,500", emoji: "📱" },
    { id: 1, title: "Nike Air Max 97", price: "৳4,200", emoji: "👟" },
    { id: 1, title: "MacBook Air M2", price: "৳95,000", emoji: "💻" },
    { id: 1, title: "Office Chair", price: "৳3,800", emoji: "🪑" },
    { id: 1, title: "Sony WH-1000XM5", price: "৳22,000", emoji: "🎧" },
    { id: 1, title: 'iPad Pro 11"', price: "৳75,000", emoji: "📲" },
  ],

  nearby: [
    { id: 1, title: "Organic Veggies Box", price: "৳650", emoji: "🥗" },
    { id: 1, title: "3-Seater Sofa", price: "৳14,000", emoji: "🛋️" },
    { id: 1, title: "HSC Books Set", price: "৳900", emoji: "📚" },
    { id: 1, title: "Kids Bicycle", price: "৳2,200", emoji: "🚲" },
    { id: 1, title: "Electric Rice Cooker", price: "৳1,800", emoji: "🍚" },
    { id: 1, title: "Wall Clock", price: "৳750", emoji: "🕐" },
  ],

  rent: [
    { id: 1, title: "Canon DSLR Kit", price: "৳1,200/day", emoji: "📷" },
    { id: 1, title: "Event Tent 10×10", price: "৳3,500/day", emoji: "🎪" },
    { id: 1, title: "Power Drill Set", price: "৳400/day", emoji: "🔧" },
    { id: 1, title: "Acoustic Guitar", price: "৳350/day", emoji: "🎸" },
    { id: 1, title: "Projector + Screen", price: "৳2,000/day", emoji: "📽️" },
    { id: 1, title: "DJ Sound System", price: "৳5,000/day", emoji: "🔊" },
  ],
};

const VISIBLE_COUNT = 5;

const createImage = (emoji, title) =>
  `https://placehold.co/600x400?text=${encodeURIComponent(`${emoji} ${title}`)}`;

const transformProduct = (item) => ({
  id: item.id,
  product_id: item.id,
  name: item.title,
  price: item.price,
  image: createImage(item.emoji, item.title),
  rating: 4,
  reviews: 12,
  quantity: "1",
  unit: "pc",
});

// Returns VISIBLE_COUNT items starting from offset, wrapping around
const getVisibleItems = (items, offset) => {
  const total = items.length;
  return Array.from(
    { length: VISIBLE_COUNT },
    (_, i) => items[(offset + i) % total],
  );
};

const sectionMeta = {
  recent: {
    gradient: "from-violet-600 to-indigo-500",
    badge: "bg-violet-100 text-violet-700",
    dot: "bg-violet-500",
    accent: "#7c3aed",
  },
  nearby: {
    gradient: "from-emerald-500 to-teal-500",
    badge: "bg-emerald-100 text-emerald-700",
    dot: "bg-emerald-500",
    accent: "#059669",
  },
  rent: {
    gradient: "from-amber-500 to-orange-500",
    badge: "bg-amber-100 text-amber-700",
    dot: "bg-amber-500",
    accent: "#d97706",
  },
};

const ProductSection = ({
  sectionKey,
  title,
  tag,
  products,
  onProductClick,
  onAddToCart,
}) => {
  const [offset, setOffset] = useState(0);
  const meta = sectionMeta[sectionKey];
  const total = products.length;

  const handleNext = useCallback(() => {
    setOffset((prev) => (prev + 1) % total);
  }, [total]);

  const handlePrev = useCallback(() => {
    setOffset((prev) => (prev - 1 + total) % total);
  }, [total]);

  const visibleProducts = getVisibleItems(products, offset);

  return (
    <section className="mb-20">
      {/* Section Header */}
      <div className="flex items-end justify-between mb-6">
        <div className="flex items-center gap-3">
          <div
            className={`w-1 h-10 rounded-full bg-gradient-to-b ${meta.gradient}`}
          />
          <div>
            <span
              className={`text-xs font-semibold uppercase tracking-widest px-2 py-0.5 rounded-full ${meta.badge} mb-1 inline-block`}
            >
              {tag}
            </span>
            <h2 className="text-2xl font-extrabold text-gray-900 leading-tight">
              {title}
            </h2>
          </div>
        </div>

        {/* Nav Buttons */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-gray-400 mr-1">
            {offset + 1}–
            {Math.min(offset + VISIBLE_COUNT, total) > total
              ? VISIBLE_COUNT
              : ((offset + VISIBLE_COUNT - 1) % total) + 1}{" "}
            of {total}
          </span>
          <button
            onClick={handlePrev}
            aria-label="Previous products"
            className="w-9 h-9 rounded-full border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-100 hover:border-gray-300 transition-all duration-150"
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              viewBox="0 0 24 24"
            >
              <path
                d="M15 18l-6-6 6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={handleNext}
            aria-label="Next products"
            className="w-9 h-9 rounded-full flex items-center justify-center text-white transition-all duration-150 hover:opacity-90 hover:scale-105"
            style={{ background: meta.accent }}
          >
            <svg
              width="16"
              height="16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                d="M9 18l6-6-6-6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Product Grid — always renders VISIBLE_COUNT slots */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {visibleProducts.map((product, idx) => (
          <div
            key={`${product.id}-${offset}-${idx}`}
            className="animate-fadeSlide"
            style={{ animationDelay: `${idx * 40}ms` }}
          >
            <ProductCard
              product={product}
              onProductClick={onProductClick}
              onAddToCart={onAddToCart}
            />
          </div>
        ))}
      </div>

      {/* Dot Indicators */}
      <div className="flex gap-1.5 mt-4 justify-center">
        {products.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setOffset(idx)}
            aria-label={`Go to product ${idx + 1}`}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === offset ? `w-6 ${meta.dot}` : "w-1.5 bg-gray-300"
            }`}
          />
        ))}
      </div>
    </section>
  );
};

const HomePage = () => {
  const navigate = useNavigate();
  const cartRef = useRef(null);

  const homepageData = {
    recent: products.recent.map(transformProduct),
    nearby: products.nearby.map(transformProduct),
    rent: products.rent.map(transformProduct),
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`);
  };

  const handleAddToCart = (product, quantity) => {
    console.log(`Added ${quantity} x ${product.name}`);
    cartRef.current?.refreshCart();
  };

  const sectionConfigs = [
    {
      key: "recent",
      title: "Recent Uploads",
      tag: "New",
      products: homepageData.recent,
    },
    {
      key: "nearby",
      title: "Nearby Products",
      tag: "Local",
      products: homepageData.nearby,
    },
    {
      key: "rent",
      title: "Products For Rent",
      tag: "Rental",
      products: homepageData.rent,
    },
  ];

  return (
    <CartBar ref={cartRef}>
      <div className="min-h-screen bg-gray-50">
        {/* Hero Banner */}
        <div className="relative overflow-hidden bg-gradient-to-br from-violet-700 via-indigo-700 to-sky-600 px-6 py-14 mb-12">
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage:
                "radial-gradient(circle at 20% 50%, white 1px, transparent 1px), radial-gradient(circle at 80% 20%, white 1px, transparent 1px)",
              backgroundSize: "40px 40px",
            }}
          />
          <div className="relative container mx-auto max-w-3xl text-center">
            <span className="inline-block bg-white/20 text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full mb-4">
              Community Marketplace
            </span>
            <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
              Buy, Sell &amp; Rent
              <br />
              <span className="text-yellow-300">Anything, Anywhere</span>
            </h1>
            <p className="text-indigo-200 text-lg mb-8">
              Discover deals in your neighbourhood or list your items in
              seconds.
            </p>
          </div>
        </div>

        <main className="container mx-auto px-6 pb-16">
          {sectionConfigs.map((section) => (
            <ProductSection
              key={section.key}
              sectionKey={section.key}
              title={section.title}
              tag={section.tag}
              products={section.products}
              onProductClick={handleProductClick}
              onAddToCart={handleAddToCart}
            />
          ))}
        </main>

        {/* Inline animation style */}
        <style>{`
        @keyframes fadeSlide {
          from { opacity: 0; transform: translateX(12px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        .animate-fadeSlide {
          animation: fadeSlide 0.25s ease both;
        }
      `}</style>
      </div>
    </CartBar>
  );
};

export default HomePage;
