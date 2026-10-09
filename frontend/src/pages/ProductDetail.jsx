import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { Phone, MessageCircle, Mail, Download, Share2, Heart, FileText } from "lucide-react";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";
import ProductCard from "../components/ProductCard";
import InquiryModal from "../components/InquiryModal";

export default function ProductDetail() {
  const { slug } = useParams();
  const { user } = useAuth();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [activeImg, setActiveImg] = useState(0);
  const [showInquiry, setShowInquiry] = useState(false);
  const [wishlisted, setWishlisted] = useState(false);

  useEffect(() => {
    setActiveImg(0);
    api.get(`/products/${slug}`).then(({ data }) => {
      setProduct(data.product);
      setRelated(data.related_products);
    });
  }, [slug]);

  if (!product) {
    return <div className="max-w-7xl mx-auto px-5 md:px-8 py-24 text-center text-fleck">Loading product...</div>;
  }

  const toggleWishlist = async () => {
    if (!user) return;
    try {
      if (wishlisted) {
        await api.delete(`/wishlist/${product.id}`);
      } else {
        await api.post(`/wishlist/${product.id}`);
      }
      setWishlisted(!wishlisted);
    } catch { /* noop */ }
  };

  const specs = [
    ["Product Code", product.product_code],
    ["Material", product.material],
    ["Color", product.color],
    ["Finish", product.finish],
    ["Origin", product.origin],
    ["Thickness", product.thickness_mm && `${product.thickness_mm} mm`],
    ["Dimensions", product.length_mm && `${product.length_mm} x ${product.width_mm} mm`],
    ["Weight", product.weight_kg_per_sqft && `${product.weight_kg_per_sqft} kg / sqft`],
    ["Available Quantity", `${product.available_quantity_sqft} sqft`],
    ["Minimum Order", `${product.minimum_order_sqft} sqft`],
  ].filter(([, v]) => v);

  return (
    <div className="max-w-7xl mx-auto px-5 md:px-8 py-10">
      <nav className="text-xs text-fleck mb-6 font-mono">
        <Link to="/catalog" className="hover:text-deep-blue">Catalog</Link> / {product.category} / <span className="text-charcoal">{product.name}</span>
      </nav>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Gallery */}
        <div>
          <div className="rounded-2xl overflow-hidden aspect-[4/3] bg-mist">
            <img src={product.images[activeImg]} alt={product.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex gap-3 mt-4">
            {product.images.map((img, i) => (
              <button
                key={i}
                onClick={() => setActiveImg(i)}
                className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-colors ${
                  activeImg === i ? "border-deep-blue" : "border-transparent"
                }`}
              >
                <img src={img} alt="" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Info */}
        <div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <span className="spec-tag inline-block text-xs text-fleck px-2.5 py-1 rounded-full mb-3">
                {product.product_code}
              </span>
              <h1 className="font-display text-4xl text-charcoal leading-tight">{product.name}</h1>
              <p className="mt-2 text-fleck">{product.color} · {product.finish} · {product.origin}</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button onClick={toggleWishlist} aria-label="Add to wishlist" className={`w-10 h-10 rounded-full border flex items-center justify-center transition-colors ${wishlisted ? "bg-deep-blue text-white border-deep-blue" : "border-black/10 text-charcoal"}`}>
                <Heart size={16} fill={wishlisted ? "currentColor" : "none"} />
              </button>
              <button aria-label="Share product" className="w-10 h-10 rounded-full border border-black/10 flex items-center justify-center text-charcoal">
                <Share2 size={16} />
              </button>
            </div>
          </div>

          <p className="mt-6 text-charcoal leading-relaxed">{product.description}</p>

          <div className="mt-6 flex items-center gap-3">
            <span className="text-2xl font-display text-charcoal">
              {product.price_per_sqft ? `₹${product.price_per_sqft} / sqft` : "Price on request"}
            </span>
            {product.is_low_stock && (
              <span className="text-xs bg-red-50 text-red-600 px-2.5 py-1 rounded-full font-medium">Low stock</span>
            )}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <button onClick={() => setShowInquiry(true)} className="bg-deep-blue hover:bg-deep-blue-hover text-white px-6 py-3 rounded-full font-medium text-sm transition-colors">
              Request Quote
            </button>
            <a href="tel:+919876543210" className="flex items-center gap-2 border border-black/10 px-5 py-3 rounded-full text-sm font-medium">
              <Phone size={15} /> Call Factory
            </a>
            <a href="https://wa.me/919876543210" target="_blank" rel="noreferrer" className="flex items-center gap-2 border border-black/10 px-5 py-3 rounded-full text-sm font-medium">
              <MessageCircle size={15} /> WhatsApp
            </a>
            <a href="mailto:hello@graniteinfy.com" className="flex items-center gap-2 border border-black/10 px-5 py-3 rounded-full text-sm font-medium">
              <Mail size={15} /> Email
            </a>
          </div>

          {product.brochure_url && (
            <a href={product.brochure_url} className="mt-4 inline-flex items-center gap-2 text-sm text-deep-blue font-medium">
              <Download size={15} /> Download Brochure (PDF)
            </a>
          )}

          {/* Specs */}
          <div className="mt-10 border border-black/10 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2 px-5 py-3 bg-mist border-b border-black/10">
              <FileText size={15} className="text-fleck" />
              <span className="text-xs font-semibold tracking-wide uppercase text-fleck">Technical Specifications</span>
            </div>
            <dl className="divide-y divide-black/5">
              {specs.map(([label, value]) => (
                <div key={label} className="flex justify-between px-5 py-3 text-sm">
                  <dt className="text-fleck">{label}</dt>
                  <dd className="font-mono text-charcoal">{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-20">
          <h2 className="font-display text-2xl text-charcoal mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {related.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      )}

      {showInquiry && <InquiryModal product={product} onClose={() => setShowInquiry(false)} />}
    </div>
  );
}
