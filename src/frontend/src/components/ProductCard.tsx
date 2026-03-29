import { Link } from "@tanstack/react-router";
import { ShoppingCart } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import type { Product } from "../data/products";

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 1 }: ProductCardProps) {
  const { addToCart } = useCart();
  const [activeVariant, setActiveVariant] = useState(0);
  const [activeSize, setActiveSize] = useState(0);

  const variant = product.variants[activeVariant];
  const size = product.sizes[activeSize];

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
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
    toast.success("Added to cart!", {
      description: `${product.name} · ${variant.label} · ${size.label}`,
    });
  };

  return (
    <div
      className="bg-white rounded-xl border border-border shadow-card hover:shadow-card-hover transition-all duration-300 overflow-hidden group"
      data-ocid={`product.item.${index}`}
    >
      <Link to="/product/$id" params={{ id: product.id }} className="block">
        {/* Image */}
        <div className="relative bg-gray-50 aspect-square overflow-hidden">
          <img
            src={variant.image}
            alt={`${product.name} ${variant.label}`}
            className="w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {/* Discount badge */}
          <span className="absolute top-3 left-3 bg-[#FF6B00] text-white text-xs font-bold px-2 py-1 rounded-full">
            {size.discountPct}% OFF
          </span>
        </div>
      </Link>

      <div className="p-4">
        <Link to="/product/$id" params={{ id: product.id }}>
          <h3 className="font-bold text-sm text-foreground line-clamp-2 mb-2">
            {product.name}
          </h3>
        </Link>

        {/* Variant selector */}
        {product.variants.length > 1 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {product.variants.map((v, i) => (
              <button
                type="button"
                key={v.label}
                onClick={() => setActiveVariant(i)}
                className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                  i === activeVariant
                    ? "bg-[#FF6B00] text-white border-[#FF6B00]"
                    : "border-border text-muted-foreground hover:border-[#FF6B00]"
                }`}
              >
                {v.label}
              </button>
            ))}
          </div>
        )}

        {/* Size selector */}
        <div className="flex flex-wrap gap-1 mb-3">
          {product.sizes.map((s, i) => (
            <button
              type="button"
              key={s.label}
              onClick={() => setActiveSize(i)}
              className={`text-xs px-2 py-0.5 rounded-full border transition-colors ${
                i === activeSize
                  ? "bg-foreground text-white border-foreground"
                  : "border-border text-muted-foreground hover:border-foreground"
              }`}
            >
              {s.label}
            </button>
          ))}
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-1">
          <span className="text-xl font-extrabold text-foreground">
            ₹{size.price}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            ₹{size.mrp}
          </span>
        </div>
        <p className="text-xs text-green-600 font-semibold mb-3">
          You save ₹{size.mrp - size.price}
        </p>

        <button
          type="button"
          onClick={handleAddToCart}
          className="w-full flex items-center justify-center gap-2 bg-[#FF6B00] hover:bg-[#E65C00] text-white text-sm font-semibold py-2.5 rounded-lg transition-colors duration-200"
          data-ocid={`product.add_to_cart.${index}`}
        >
          <ShoppingCart className="w-4 h-4" />
          Add to Cart
        </button>
      </div>
    </div>
  );
}
