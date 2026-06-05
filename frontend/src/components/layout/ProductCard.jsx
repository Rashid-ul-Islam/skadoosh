import React, { useState } from "react";
import { Heart, Star, ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

const ProductCard = ({
  product,
  onProductClick,
  onAddToCart,
  showQuantityControls = true,
  showFavoriteButton = true,
  showAddToCartButton = true,
  className = "",
  imageHeight = "h-48",
  cardPadding = "p-6",
}) => {
  const navigate = useNavigate();

  const productId = product?.product_id || product?.id;

  const [quantity, setQuantity] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleToggleFavorite = () => {
    setIsLiked((prev) => !prev);
  };

  const handleProductClick = () => {
    if (onProductClick) {
      onProductClick(product);
    } else {
      navigate(`/product/${productId}`);
    }
  };

  const handleAddToCart = () => {
    if (quantity <= 0) return;

    setIsLoading(true);

    setTimeout(() => {
      onAddToCart?.(product, quantity);
      setQuantity(0);
      setIsLoading(false);
    }, 300);
  };

  return (
    <div
      className={`bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 border border-gray-100 overflow-hidden ${className}`}
    >
      <div className="relative overflow-hidden">
        <img
          src={
            product.image ||
            product.image_url ||
            "https://placehold.co/600x400?text=No+Image"
          }
          alt={product.name}
          onClick={handleProductClick}
          className={`w-full ${imageHeight} object-cover cursor-pointer hover:scale-110 transition-transform duration-500`}
        />

        {showFavoriteButton && (
          <button
            onClick={handleToggleFavorite}
            className="absolute top-3 right-3 p-2 rounded-full bg-white shadow"
          >
            <Heart
              className={`w-5 h-5 ${
                isLiked ? "fill-red-500 text-red-500" : "text-gray-500"
              }`}
            />
          </button>
        )}
      </div>

      <div className={cardPadding}>
        <h3
          onClick={handleProductClick}
          className="font-bold text-lg text-gray-800 cursor-pointer mb-2"
        >
          {product.name}
        </h3>

        <div className="flex items-center mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < (product.rating || 4)
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-gray-300"
              }`}
            />
          ))}

          <span className="ml-2 text-sm text-gray-500">
            ({product.reviews || 0})
          </span>
        </div>

        <div className="flex items-center justify-between mb-4">
          <span className="text-2xl font-bold text-purple-600">
            {product.price}
          </span>

          <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {product.quantity || 1} {product.unit || "pc"}
          </span>
        </div>

        {showQuantityControls && (
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => setQuantity((prev) => Math.max(0, prev - 1))}
              className="w-8 h-8 bg-blue-600 text-white rounded"
            >
              -
            </button>

            <span className="w-8 text-center text-black">{quantity}</span>

            <button
              onClick={() => setQuantity((prev) => prev + 1)}
              className="w-8 h-8 bg-blue-600 text-white rounded"
            >
              +
            </button>
          </div>
        )}

        {showAddToCartButton && (
          <button
            disabled={quantity === 0 || isLoading}
            onClick={handleAddToCart}
            className={`w-full py-3 rounded-lg text-white font-medium flex items-center justify-center gap-2 ${
              quantity > 0
                ? "bg-green-600 hover:bg-green-700"
                : "bg-gray-400 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              "Adding..."
            ) : (
              <>
                <ShoppingCart className="w-4 h-4" />
                {quantity > 0 ? `Add ${quantity} To Cart` : "Select Quantity"}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export const ProductCardSkeleton = ({
  imageHeight = "h-48",
  cardPadding = "p-6",
}) => (
  <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-pulse">
    <div className={`${imageHeight} bg-gray-200`} />

    <div className={cardPadding}>
      <div className="h-6 bg-gray-200 rounded mb-3" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-3" />
      <div className="h-8 bg-gray-200 rounded w-24 mb-4" />
      <div className="h-10 bg-gray-200 rounded" />
    </div>
  </div>
);

export default ProductCard;
