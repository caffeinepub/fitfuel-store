import { Link, useParams } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { getProductById } from "../data/products";

const FALLBACK_IMG =
  "https://cdn.shopify.com/s/files/1/0538/2137/4655/files/01-11_d446c524-4dc6-4543-ae82-d3fdfe7428e2.jpg?v=1751603962";

export default function ProductDetail() {
  const { id } = useParams({ from: "/product/$id" });
  const product = getProductById(id);
  const { addToCart } = useCart();

  const [activeVariant, setActiveVariant] = useState(0);
  const [activeSize, setActiveSize] = useState(0);
  const [qty, setQty] = useState(1);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Product not found</h2>
          <Link to="/products" className="text-[#FF6B00] font-semibold">
            Browse products
          </Link>
        </div>
      </div>
    );
  }

  const variant = product.variants[activeVariant];
  const size = product.sizes[activeSize];
  const savings = (size.mrp - size.price) * qty;
  const total = size.price * qty;

  const handleAddToCart = () => {
    for (let i = 0; i < qty; i++) {
      addToCart({
        cartKey: `${product.id}-${variant.label}-${size.label}`,
        productId: product.id,
        productName: product.name,
        variant: variant.label,
        size: size.label,
        mrp: size.mrp,
        price: size.price,
        discountPct: size.discountPct,
        image: variant.image,
      });
    }
    toast.success("Added to cart!", {
      description: `${product.name} · ${variant.label} · ${size.label} × ${qty}`,
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
      {/* Breadcrumb */}
      <nav className="text-sm text-muted-foreground mb-8">
        <Link to="/" className="hover:text-foreground">
          Home
        </Link>
        {" / "}
        <Link to="/products" className="hover:text-foreground">
          Products
        </Link>
        {" / "}
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-gray-50 rounded-2xl p-8 flex items-center justify-center aspect-square"
        >
          <img
            src={variant.image}
            alt={`${product.name} ${variant.label}`}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).src = FALLBACK_IMG;
            }}
          />
        </motion.div>

        {/* Info */}
        <motion.div
          initial={{ opacity: 0, x: 24 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-col gap-5"
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#FF6B00] bg-orange-50 px-3 py-1 rounded-full">
              {product.category}
            </span>
            <h1 className="text-3xl font-extrabold mt-3 mb-2">
              {product.name}
            </h1>
            <p className="text-muted-foreground leading-relaxed">
              {product.description}
            </p>
          </div>

          {/* Variant selector */}
          {product.variants.length > 1 && (
            <div>
              <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
                Flavor
              </p>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((v, i) => (
                  <button
                    type="button"
                    key={v.label}
                    onClick={() => setActiveVariant(i)}
                    className={`px-4 py-2 rounded-full border text-sm font-semibold transition-all ${
                      i === activeVariant
                        ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                        : "border-border text-foreground hover:border-[#FF6B00]"
                    }`}
                  >
                    {v.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Size selector */}
          <div>
            <p className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2">
              Size
            </p>
            <div className="flex flex-wrap gap-2">
              {product.sizes.map((s, i) => (
                <button
                  type="button"
                  key={s.label}
                  onClick={() => setActiveSize(i)}
                  className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all ${
                    i === activeSize
                      ? "bg-foreground text-white border-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                >
                  <span className="block">{s.label}</span>
                  <span className="block text-xs font-normal mt-0.5">
                    ₹{s.price}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="bg-secondary rounded-xl p-4">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-extrabold">₹{size.price}</span>
              <span className="text-lg text-muted-foreground line-through">
                ₹{size.mrp}
              </span>
              <span className="bg-[#FF6B00] text-white text-xs font-bold px-2 py-0.5 rounded-full">
                {size.discountPct}% OFF
              </span>
            </div>
            <p className="text-green-600 text-sm font-semibold mt-1">
              You save ₹{size.mrp - size.price} per unit
            </p>
          </div>

          {/* Qty */}
          <div className="flex items-center gap-3">
            <p className="text-sm font-semibold">Qty:</p>
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                type="button"
                onClick={() => setQty(Math.max(1, qty - 1))}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-secondary transition-colors"
              >
                −
              </button>
              <span className="w-12 text-center font-bold">{qty}</span>
              <button
                type="button"
                onClick={() => setQty(qty + 1)}
                className="w-10 h-10 flex items-center justify-center text-lg font-bold hover:bg-secondary transition-colors"
              >
                +
              </button>
            </div>
            {qty > 1 && (
              <p className="text-sm text-muted-foreground">
                Total: <strong className="text-foreground">₹{total}</strong> ·
                Save ₹{savings}
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={handleAddToCart}
            className="flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold py-4 rounded-xl text-lg transition-all shadow-orange hover:scale-[1.02] duration-200"
            data-ocid="product.add_to_cart.primary_button"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart — ₹{total}
          </button>
        </motion.div>
      </div>
    </div>
  );
}
