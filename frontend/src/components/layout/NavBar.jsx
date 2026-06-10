// src/components/layout/NavBar.jsx
import { useState, useEffect, useRef } from "react";
import { Search, X, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { ShoppingCart, Heart, User, PackageSearch, Shield } from "lucide-react";
import { Button } from "../ui/button.jsx";
import LoginModal from "../auth/LoginModal.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { API_BASE_URL } from "../../config/api.js";
import { Tag } from "lucide-react";

// Product catalog used for quick search
const MOCK_PRODUCTS = [
  {
    id: 1,
    name: "Fresh Tomatoes",
    price: "45.00",
    category_name: "Vegetables",
    image_url: "https://placehold.co/48x48?text=🍅",
  },
  {
    id: 2,
    name: "Basmati Rice (5 kg)",
    price: "320.00",
    category_name: "Grains",
    image_url: "https://placehold.co/48x48?text=🌾",
  },
  {
    id: 3,
    name: "Organic Eggs (12 pc)",
    price: "135.00",
    category_name: "Dairy",
    image_url: "https://placehold.co/48x48?text=🥚",
  },
  {
    id: 4,
    name: "Sunflower Oil (1 L)",
    price: "195.00",
    category_name: "Oils",
    image_url: "https://placehold.co/48x48?text=🫙",
  },
  {
    id: 5,
    name: "Green Chili",
    price: "30.00",
    category_name: "Vegetables",
    image_url: "https://placehold.co/48x48?text=🌶️",
  },
  {
    id: 6,
    name: "Lentil (Masoor Dal)",
    price: "110.00",
    category_name: "Pulses",
    image_url: "https://placehold.co/48x48?text=🫘",
  },
  {
    id: 7,
    name: "Chicken Breast",
    price: "280.00",
    category_name: "Meat",
    image_url: "https://placehold.co/48x48?text=🍗",
  },
  {
    id: 8,
    name: "Mango (Fazlee)",
    price: "90.00",
    category_name: "Fruits",
    image_url: "https://placehold.co/48x48?text=🥭",
  },
];

// Client-side quick search — filters MOCK_PRODUCTS by query
function mockQuickSearch(query) {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  return MOCK_PRODUCTS.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.category_name.toLowerCase().includes(q),
  ).slice(0, 5);
}

// ---------------------------------------------------------------------------
// NavBar
// ---------------------------------------------------------------------------
export default function NavBar() {
  const { user, isLoggedIn, logout: authLogout } = useAuth();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [pendingRedirect, setPendingRedirect] = useState(null);
  const [wishlistItemCount, setWishlistItemCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchLoading, setSearchLoading] = useState(false);
  const searchRef = useRef(null);
  const navigate = useNavigate();

  const isAdmin = user?.role_id === "admin";
  const isDeliveryBoy = user?.role_id === "delivery_boy";

  useEffect(() => {
    if (isLoggedIn && user) {
      const count = user.wishlist?.length ?? 0;
      setWishlistItemCount(count);
    } else {
      setWishlistItemCount(0);
    }
  }, [isLoggedIn, user]);

  // ------------------------------------------------------------------
  // Quick search — filter mock products instead of API
  // ------------------------------------------------------------------
  const fetchQuickSearch = (query) => {
    if (!query.trim()) {
      setSearchResults([]);
      setShowResults(false);
      return;
    }
    setSearchLoading(true);
    // Simulate a short async delay
    setTimeout(() => {
      const results = mockQuickSearch(query);
      setSearchResults(results);
      setShowResults(true);
      setSearchLoading(false);
    }, 200);
  };

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    clearTimeout(window.searchTimeout);
    window.searchTimeout = setTimeout(() => fetchQuickSearch(value), 300);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      setShowResults(false);
      navigate(`/search?q=${encodeURIComponent(searchTerm)}`);
    }
  };

  const handleProductClick = (productId) => {
    setShowResults(false);
    setSearchTerm("");
    navigate(`/product/${productId}`);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Search form submit (saves history in real app; skipped here)
  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    navigate(`/search?query=${encodeURIComponent(searchTerm)}`);
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchResults([]);
    setShowResults(false);
  };
  const handleWishlistClick = (e) => {
    if (isLoggedIn) return; // let the <Link> navigate normally
    e.preventDefault();
    setPendingRedirect("/wishlist");
    setIsLoginModalOpen(true);
  };

  const handleSellClick = (e) => {
    e.preventDefault();

    if (isLoggedIn) {
      navigate("/sell");
      return;
    }

    setPendingRedirect("/sell");
    setIsLoginModalOpen(true);
  };
  const handleLoginSuccess = (userData) => {
    setIsLoginModalOpen(false);

    if (pendingRedirect) {
      navigate(pendingRedirect);
      setPendingRedirect(null);
    }
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (token) {
        await fetch(`${API_BASE_URL}/api/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Swallow network errors — client-side logout still proceeds
    } finally {
      authLogout();
      navigate("/");
    }
  };

  const currentPath = window.location.pathname;

  return (
    <>
      <nav className="bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800 backdrop-blur-md shadow-2xl sticky top-0 z-50 px-8 py-4 border-b border-slate-700/50 transition-all duration-300">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          {/* Logo */}
          <Link
            to="/"
            className="text-4xl font-extrabold flex items-center gap-3 text-white hover:text-emerald-400 transition-all duration-500 hover:scale-110 select-none group focus:outline-none"
          >
            <span className="transition-transform duration-500 group-hover:rotate-12">
              🛒
            </span>
            <span className="hidden sm:inline bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent hover:from-yellow-400 hover:via-orange-400 hover:to-red-400 transition-all duration-500">
              GroCart
            </span>
          </Link>

          {/* Search bar */}
          <div className="flex-1 max-w-2xl mx-8 relative" ref={searchRef}>
            <form onSubmit={handleSearchSubmit} className="relative">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5 transition-colors duration-300 group-focus-within:text-emerald-400" />
                <input
                  type="text"
                  placeholder="Search for products, categories..."
                  value={searchTerm}
                  onChange={handleSearchInput}
                  className="w-full pl-10 pr-10 py-3 bg-slate-800/90 border border-slate-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-white placeholder-slate-400 transition-all duration-300 hover:bg-slate-700/90 focus:bg-slate-700/90 backdrop-blur-sm"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-red-400 transition-all duration-300 hover:scale-110 hover:rotate-90"
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
            </form>

            {/* Search Results Dropdown */}
            {showResults && (
              <div className="absolute z-50 w-full bg-slate-800/95 border border-slate-600 rounded-xl shadow-2xl mt-2 max-h-96 overflow-y-auto backdrop-blur-md animate-in slide-in-from-top-2 duration-300">
                {searchLoading ? (
                  <div className="flex items-center justify-center p-4">
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                    <span className="ml-2 text-slate-300">Searching...</span>
                  </div>
                ) : searchResults.length > 0 ? (
                  <>
                    {searchResults.map((product, index) => (
                      <div
                        key={product.id}
                        className="flex items-center p-3 hover:bg-slate-700/70 cursor-pointer border-b border-slate-700 last:border-b-0 transition-all duration-300 hover:translate-x-1 animate-in slide-in-from-left-1"
                        style={{ animationDelay: `${index * 50}ms` }}
                        onClick={() => handleProductClick(product.id)}
                      >
                        <img
                          src={product.image_url || "/default-product.png"}
                          alt={product.name}
                          className="w-12 h-12 object-cover rounded-lg mr-3 transition-transform duration-300 hover:scale-110"
                        />
                        <div className="flex-1">
                          <div className="font-medium text-white text-sm transition-colors duration-300 hover:text-emerald-400">
                            {product.name}
                          </div>
                          <div className="text-xs text-slate-400">
                            {product.category_name || "Uncategorized"}
                          </div>
                          <div className="text-sm font-semibold text-emerald-400">
                            ৳{parseFloat(product.price)?.toFixed(2) || "N/A"}
                          </div>
                        </div>
                      </div>
                    ))}
                    {searchTerm && (
                      <div
                        className="p-3 text-center text-emerald-400 hover:bg-slate-700/70 cursor-pointer border-t border-slate-700 font-medium transition-all duration-300 hover:text-emerald-300"
                        onClick={() => {
                          setShowResults(false);
                          navigate(
                            `/search?q=${encodeURIComponent(searchTerm)}`,
                          );
                        }}
                      >
                        View all results for "{searchTerm}"
                      </div>
                    )}
                  </>
                ) : (
                  searchTerm && (
                    <div className="p-4 text-center text-slate-400">
                      No products found for "{searchTerm}"
                    </div>
                  )
                )}
              </div>
            )}
          </div>

          {/* Right-side controls */}
          <div className="flex items-center gap-8 text-white">
            {/* Admin Panel */}
            {isAdmin && (
              <Link
                to="/admin"
                className="hover:text-emerald-400 transition-all duration-300 hover:scale-110 group"
                title="Admin Panel"
              >
                <Shield className="w-7 h-7 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </Link>
            )}

            {/* Delivery Boy */}
            {isDeliveryBoy && (
              <Link
                to="/delivery"
                className="hover:text-emerald-400 transition-all duration-300 hover:scale-110 group"
                title="Delivery Boy"
              >
                <Shield className="w-7 h-7 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </Link>
            )}

            {/* Orders */}
            {isLoggedIn && (
              <Link
                to="/orders"
                className="hover:text-emerald-400 transition-all duration-300 hidden sm:inline hover:scale-110 group"
                title="My Orders"
              >
                <PackageSearch className="w-7 h-7 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              </Link>
            )}

            {/* Wishlist */}
            <Link
              to="/wishlist"
              onClick={handleWishlistClick}
              className="relative hover:text-emerald-400 transition-all duration-300 hover:scale-110 group"
              title="Wishlist"
            >
              <Heart className="w-7 h-7 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
              {wishlistItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                  {wishlistItemCount}
                </span>
              )}
            </Link>

            <button
              onClick={handleSellClick}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#1D9E75] hover:bg-[#0F6E56] text-white text-sm font-medium rounded-full transition-colors"
            >
              <Tag size={14} />
              Sell
            </button>

            {/* User dropdown */}
            <div className="relative group">
              <Button
                variant="ghost"
                className="p-0 rounded-full hover:bg-slate-700/50 focus:ring-4 focus:ring-emerald-500/30 transition-all duration-300 flex items-center space-x-2 group hover:scale-105"
              >
                <User className="w-7 h-7 text-white hover:text-emerald-400 transition-all duration-300 group-hover:drop-shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                {isLoggedIn && (
                  <span className="hidden md:block text-white hover:text-emerald-400 font-medium transition-colors duration-300">
                    {user?.first_name}
                  </span>
                )}
              </Button>
              <div className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-md shadow-2xl rounded-xl border border-slate-600 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-50 animate-in slide-in-from-top-2">
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 border-b border-slate-700 bg-gradient-to-r from-slate-800 to-slate-700 rounded-t-xl">
                      <p className="font-bold text-white">
                        {user?.first_name} {user?.last_name}
                      </p>
                      <p className="text-sm text-slate-300">{user?.email}</p>
                    </div>
                    <Link
                      to="/profile"
                      className="block hover:bg-slate-700/70 px-4 py-2 cursor-pointer transition-all duration-300 text-white hover:text-emerald-400 hover:translate-x-1"
                    >
                      Profile
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin"
                        className="block hover:bg-slate-700/70 px-4 py-2 cursor-pointer transition-all duration-300 text-white hover:text-emerald-400 hover:translate-x-1"
                      >
                        Admin Panel
                      </Link>
                    )}
                    <Link
                      to="/orders"
                      className="block hover:bg-slate-700/70 px-4 py-2 cursor-pointer transition-all duration-300 text-white hover:text-emerald-400 hover:translate-x-1"
                    >
                      My Orders
                    </Link>
                    <Link
                      to="/my-orders"
                      className="block hover:bg-slate-700/70 px-4 py-2 cursor-pointer transition-all duration-300 text-white hover:text-emerald-400 hover:translate-x-1"
                    >
                      Order History
                    </Link>
                    <Link
                      to="/listings"
                      className="block hover:bg-slate-700/70 px-4 py-2 cursor-pointer transition-all duration-300 text-white hover:text-emerald-400 hover:translate-x-1"
                    >
                      My Listings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left hover:bg-red-900/30 px-4 py-2 cursor-pointer transition-all duration-300 text-red-400 hover:text-red-300 border-t border-slate-700 hover:translate-x-1 rounded-b-xl"
                    >
                      Logout
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => setIsLoginModalOpen(true)}
                      className="block w-full text-left hover:bg-slate-700/70 px-4 py-2 cursor-pointer transition-all duration-300 text-white hover:text-emerald-400 font-medium hover:translate-x-1 rounded-t-xl"
                    >
                      Login
                    </button>
                    <Link
                      to="/register"
                      className="block hover:bg-slate-700/70 px-4 py-2 cursor-pointer transition-all duration-300 text-white hover:text-emerald-400 hover:translate-x-1 rounded-b-xl"
                    >
                      Register
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Login Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
        currentPath={currentPath}
      />
    </>
  );
}
