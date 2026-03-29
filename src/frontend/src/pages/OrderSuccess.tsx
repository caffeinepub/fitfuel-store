import { Link } from "@tanstack/react-router";
import { CheckCircle, MessageCircle } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useRef } from "react";
import { OrderStatus } from "../backend.d";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";
import { useActor } from "../hooks/useActor";

export default function OrderSuccess() {
  const { items, grandTotal, deliveryCharge, clearCart } = useCart();
  const { address, paymentMethod, upiId } = useCheckout();
  const { actor } = useActor();
  const submitted = useRef(false);
  // Capture snapshot at render so effect only re-runs when actor changes
  const snapshot = useRef({
    items,
    grandTotal,
    deliveryCharge,
    address,
    paymentMethod,
    upiId,
    clearCart,
  });

  useEffect(() => {
    const {
      items: its,
      grandTotal: gt,
      deliveryCharge: dc,
      address: addr,
      paymentMethod: pm,
      upiId: uid,
      clearCart: cc,
    } = snapshot.current;
    if (!actor || submitted.current || its.length === 0) return;
    submitted.current = true;

    const order = {
      orderId: 0n,
      status: OrderStatus.pending,
      products: its.map((item) => ({
        name: `${item.productName} (${item.variant})`,
        size: item.size,
        quantity: BigInt(item.quantity),
        price: BigInt(item.price),
      })),
      address: {
        addressType: addr.addressType,
        flat: addr.flat,
        floor: addr.floor,
        area: addr.area,
        landmark: addr.landmark,
        name: addr.name,
        phone: addr.phone ? BigInt(addr.phone) : 0n,
      },
      paymentMethod:
        pm === "upi"
          ? { __kind__: "upi" as const, upi: uid }
          : { __kind__: "cod" as const, cod: null },
      totalAmount: BigInt(gt),
      deliveryCharge: BigInt(dc),
      timestamp: BigInt(Date.now()),
    };

    actor.submitOrder(order).catch(() => {});
    cc();
  }, [actor]);

  const buildWhatsAppMessage = () => {
    const lines: string[] = ["🛒 *New Order — FitFuel Store*", ""];
    lines.push("*Products:*");
    for (const item of items) {
      lines.push(
        `• ${item.productName} (${item.variant}) — ${item.size} × ${item.quantity} = ₹${item.price * item.quantity}`,
      );
    }
    lines.push("");
    lines.push(
      `*Delivery Charges:* ₹${deliveryCharge === 0 ? "0 (FREE)" : deliveryCharge}`,
    );
    lines.push(`*Total Amount:* ₹${grandTotal}`);
    lines.push("");
    lines.push("*Delivery Address:*");
    lines.push(
      `${address.addressType}: ${address.flat}, Floor ${address.floor || "—"}`,
    );
    lines.push(
      `${address.area}${address.landmark ? `, Near ${address.landmark}` : ""}`,
    );
    lines.push(`Name: ${address.name}`);
    lines.push(`Phone: ${address.phone}`);
    lines.push("");
    lines.push(
      `*Payment:* ${paymentMethod === "upi" ? `UPI (${upiId || "paid"})` : "Cash on Delivery"}`,
    );
    return encodeURIComponent(lines.join("\n"));
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-16 text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="flex justify-center mb-6"
      >
        <CheckCircle className="w-24 h-24 text-green-500" />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">
          Order Placed Successfully! 🎉
        </h1>
        <p className="text-muted-foreground mb-8">
          Thank you for your order! Please send us the order details on WhatsApp
          to confirm.
        </p>

        <div className="bg-secondary rounded-2xl p-6 text-left mb-8">
          <h3 className="font-extrabold mb-4">Order Summary</h3>
          <div className="space-y-2 text-sm">
            {items.map((item) => (
              <div key={item.cartKey} className="flex justify-between">
                <span className="text-muted-foreground">
                  {item.productName} ({item.variant}) · {item.size} ×{" "}
                  {item.quantity}
                </span>
                <span className="font-semibold">
                  ₹{item.price * item.quantity}
                </span>
              </div>
            ))}
            <div className="border-t border-border pt-2 flex justify-between">
              <span className="text-muted-foreground">Delivery</span>
              <span
                className={`font-semibold ${deliveryCharge === 0 ? "text-green-600" : ""}`}
              >
                {deliveryCharge === 0 ? "FREE" : `₹${deliveryCharge}`}
              </span>
            </div>
            <div className="flex justify-between font-extrabold text-base">
              <span>Total</span>
              <span>₹{grandTotal}</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <a
            href={`https://wa.me/919549958286?text=${buildWhatsAppMessage()}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white font-bold px-8 py-4 rounded-xl transition-colors text-lg"
            data-ocid="order_success.whatsapp.primary_button"
          >
            <MessageCircle className="w-5 h-5" />
            Send Order on WhatsApp
          </a>
          <Link
            to="/products"
            className="flex items-center justify-center gap-2 border-2 border-foreground text-foreground hover:bg-foreground hover:text-white font-bold px-8 py-4 rounded-xl transition-all duration-200"
            data-ocid="order_success.continue_shopping.secondary_button"
          >
            Continue Shopping
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
