import { Link } from "react-router-dom";
import { Heart } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <Link
      to={`/product/${product.slug}`}
      className="group block rounded-2xl overflow-hidden bg-mist border border-black/5 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-light-stone">
        {product.primary_image && (
          <img
            src={product.primary_image}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}
        {product.is_featured && (
          <span className="absolute top-3 left-3 bg-brass text-charcoal text-[11px] font-semibold tracking-wide uppercase px-2.5 py-1 rounded-full">
            Featured
          </span>
        )}
        {product.is_low_stock && (
          <span className="absolute top-3 right-3 bg-charcoal/90 text-white text-[11px] font-medium px-2.5 py-1 rounded-full">
            Low stock
          </span>
        )}
        <button
          aria-label="Add to wishlist"
          onClick={(e) => e.preventDefault()}
          className="absolute bottom-3 right-3 w-9 h-9 rounded-full glass-card flex items-center justify-center text-charcoal opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart size={16} />
        </button>
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between text-[11px] font-mono text-fleck mb-1">
          <span>{product.product_code}</span>
          <span>{product.finish}</span>
        </div>
        <h3 className="font-display text-lg text-charcoal leading-snug">{product.name}</h3>
        <p className="text-sm text-fleck mt-0.5">{product.color} · {product.origin?.split(",")[0]}</p>
        <div className="mt-3 flex items-center justify-between">
          <span className="text-sm font-semibold text-charcoal">
            {product.price_per_sqft ? `₹${product.price_per_sqft} / sqft` : "Request quote"}
          </span>
          <span className="text-xs text-deep-blue font-medium">View details →</span>
        </div>
      </div>
    </Link>
  );
}
