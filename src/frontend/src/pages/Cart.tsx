import { Link, useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, Truck } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useCart } from "../context/CartContext";

export default function Cart() {
  const {
    items,
    cartSubtotal,
    cartSavings,
    deliveryCharge,
    grandTotal,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const navigate = useNavigate();
  const itemsNeeded = 3 - items.length;

  if (items.length === 0) {
    return (
      <div
        className="min-h-[60vh] flex flex-col items-center justify-center gap-6 px-4"
        data-ocid="cart.empty_state"
      >
        <ShoppingBag className="w-20 h-20 text-muted-foreground/30" />
        <h2 className="text-2xl font-extrabold">Your cart is empty</h2>
        <p className="text-muted-foreground">
          Browse our products and add some fuel!
        </p>
        <Link
          to="/products"
          className="bg-[#FF6B00] text-white font-bold px-8 py-3 rounded-full hover:bg-[#E65C00] transition-colors"
          data-ocid="cart.shop_now.primary_button"
        >
          Shop Now
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>

      {itemsNeeded > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-[#FF6B00]/30 text-[#FF6B00] rounded-xl p-4 mb-6 flex items-center gap-3 text-sm font-semibold"
        >
          <Truck className="w-5 h-5 flex-shrink-0" />
          Add {itemsNeeded} more item{itemsNeeded > 1 ? "s" : ""} to get FREE
          delivery!
        </motion.div>
      )}
      {items.length >= 3 && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 text-green-700 rounded-xl p-4 mb-6 flex items-center gap-3 text-sm font-semibold"
        >
          <Truck className="w-5 h-5 flex-shrink-0" />🎉 You qualify for FREE
          delivery!
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <AnimatePresence>
            {items.map((item, idx) => (
              <motion.div
                key={item.cartKey}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -32 }}
                transition={{ delay: idx * 0.05 }}
                className="bg-white border border-border rounded-xl p-4 flex gap-4 items-start"
                data-ocid={`cart.item.${idx + 1}`}
              >
                <img
                  src={item.image}
                  alt={item.productName}
                  className="w-20 h-20 object-contain bg-gray-50 rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm line-clamp-2">
                    {item.productName}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.variant} · {item.size}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="font-extrabold text-[#FF6B00]">
                      ₹{item.price}
                    </span>
                    <span className="text-xs text-muted-foreground line-through">
                      ₹{item.mrp}
                    </span>
                    <span className="text-xs bg-[#FF6B00] text-white px-1.5 py-0.5 rounded-full font-bold">
                      {item.discountPct}% OFF
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-3">
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.cartKey)}
                    className="text-muted-foreground hover:text-destructive transition-colors"
                    data-ocid={`cart.delete_button.${idx + 1}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <div className="flex items-center border border-border rounded-lg overflow-hidden">
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartKey, item.quantity - 1)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-8 text-center text-sm font-bold">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() =>
                        updateQuantity(item.cartKey, item.quantity + 1)
                      }
                      className="w-8 h-8 flex items-center justify-center hover:bg-secondary transition-colors"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <p className="text-sm font-bold">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="lg:col-span-1">
          <div className="bg-white border border-border rounded-xl p-6 sticky top-24">
            <h3 className="font-extrabold text-lg mb-5">Order Summary</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item Subtotal</span>
                <span className="font-semibold">₹{cartSubtotal}</span>
              </div>
              <div className="flex justify-between text-green-600">
                <span>Total Savings</span>
                <span className="font-semibold">−₹{cartSavings}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                {deliveryCharge === 0 ? (
                  <span className="font-bold text-green-600">FREE</span>
                ) : (
                  <span className="font-semibold">₹{deliveryCharge}</span>
                )}
              </div>
              <div className="border-t border-border pt-3 flex justify-between font-extrabold text-base">
                <span>Grand Total</span>
                <span>₹{grandTotal}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate({ to: "/checkout" })}
              className="w-full mt-6 bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold py-3.5 rounded-xl transition-colors shadow-orange"
              data-ocid="cart.checkout.primary_button"
            >
              Proceed to Checkout →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
