import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MessageCircle, Send, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useRef, useState } from "react";

interface Message {
  id: string;
  from: "bot" | "user";
  text: string;
}

const RESPONSES: Record<string, string> = {
  delivery:
    "We deliver across Jaipur! Free delivery within 5 KM of Hasanpura. For orders outside 5 KM: \u20b930 charge for 1-2 items, FREE for 3+ items. Typical delivery: 1-2 business days.",
  payment:
    "We accept UPI payments (scan QR or enter UPI ID) and Cash on Delivery. For UPI, pay to 9549956286@fam. If you've already paid and need help, tap 'Request Callback' below.",
  order:
    "Once you place an order, you'll get a confirmation. Please send your order details on WhatsApp to confirm. To track your order status, tap 'Request Callback' and we'll update you.",
  return:
    "We currently don't accept returns on opened products. For damaged or wrong items delivered, please contact us within 24 hours via WhatsApp.",
  product:
    "We sell authentic Pintola fitness nutrition products: High Protein Oats, High Protein Muesli, High Protein Peanut Butter, and Performance Peanut Butter. All products are 100% genuine.",
  discount:
    "Use coupon codes: SHAH10 (10% off), SHAH20 (20% off), SHAH25 (25% off), SHAH30 (30% off) at checkout.",
  contact:
    "You can reach us on WhatsApp at +91 95499 56286 or via Instagram @shahzuuu.lifts",
  default:
    "I'm not sure about that. Please tap 'Request Callback' and our team will assist you shortly!",
};

const QUICK_REPLIES = [
  { label: "Delivery Info", key: "delivery" },
  { label: "Payment Help", key: "payment" },
  { label: "Track Order", key: "order" },
  { label: "Discounts & Offers", key: "discount" },
  { label: "Contact Us", key: "contact" },
];

function getBotResponse(msg: string): string {
  const lower = msg.toLowerCase();
  if (/deliver|shipping|free|\bkm\b/.test(lower)) return RESPONSES.delivery;
  if (/pay|upi|cod|cash|qr/.test(lower)) return RESPONSES.payment;
  if (/order|track|status|confirm/.test(lower)) return RESPONSES.order;
  if (/return|refund|damage|wrong/.test(lower)) return RESPONSES.return;
  if (/product|oats|muesli|peanut|butter/.test(lower)) return RESPONSES.product;
  if (/discount|coupon|code|offer/.test(lower)) return RESPONSES.discount;
  if (/contact|number|call|phone|help/.test(lower)) return RESPONSES.contact;
  return RESPONSES.default;
}

function makeId() {
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function SupportChatbot() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: makeId(),
      from: "bot",
      text: "\ud83d\udc4b Hi! I'm the FitFuel support assistant. How can I help you today?",
    },
  ]);
  const [input, setInput] = useState("");
  const [showCallback, setShowCallback] = useState(false);
  const [callbackName, setCallbackName] = useState("");
  const [callbackPhone, setCallbackPhone] = useState("");
  const lastUserMsg = useRef("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const sendMessage = (text: string) => {
    if (!text.trim()) return;
    lastUserMsg.current = text.trim();
    const userMsg: Message = { id: makeId(), from: "user", text: text.trim() };
    const botMsg: Message = {
      id: makeId(),
      from: "bot",
      text: getBotResponse(text.trim()),
    };
    setMessages((prev) => [...prev, userMsg, botMsg]);
    setInput("");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleCallback = () => {
    if (!callbackName.trim() || !callbackPhone.trim()) return;
    const query = encodeURIComponent(lastUserMsg.current || "General query");
    const name = encodeURIComponent(callbackName.trim());
    const phone = encodeURIComponent(callbackPhone.trim());
    window.open(
      `https://wa.me/919549956286?text=%F0%9F%93%9E%20Callback%20Request%20from%20FitFuel%20Store%0AName%3A%20${name}%0APhone%3A%20${phone}%0AQuery%3A%20${query}`,
      "_blank",
    );
    setShowCallback(false);
    setCallbackName("");
    setCallbackPhone("");
    setMessages((prev) => [
      ...prev,
      {
        id: makeId(),
        from: "bot",
        text: "\u2705 Callback request sent! Our team will contact you shortly on WhatsApp.",
      },
    ]);
  };

  return (
    <>
      {/* Floating trigger */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-50 bg-gray-900 hover:bg-gray-800 text-white rounded-full px-4 py-3 flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-200 text-sm font-semibold"
        data-ocid="chatbot.open_modal_button"
        aria-label="Open support chat"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="hidden sm:inline">Need Help?</span>
      </button>

      {/* Chat panel */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 260, damping: 22 }}
            className="fixed bottom-24 left-4 sm:left-6 z-50 w-[calc(100vw-2rem)] sm:w-96 bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200"
            style={{ maxHeight: "70vh" }}
            data-ocid="chatbot.modal"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 bg-gray-900 text-white">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#FF6B00] flex items-center justify-center">
                  <MessageCircle className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-sm">FitFuel Support</div>
                  <div className="text-xs text-white/60">
                    Typically replies instantly
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="text-white/70 hover:text-white transition-colors"
                data-ocid="chatbot.close_button"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.from === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                      msg.from === "user"
                        ? "bg-[#FF6B00] text-white rounded-br-sm"
                        : "bg-white text-gray-800 border border-gray-200 rounded-bl-sm"
                    }`}
                  >
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={bottomRef} />
            </div>

            {/* Quick replies */}
            <div className="px-3 py-2 flex gap-2 overflow-x-auto bg-white border-t border-gray-100">
              {QUICK_REPLIES.map((qr) => (
                <button
                  key={qr.key}
                  type="button"
                  onClick={() => sendMessage(qr.label)}
                  className="flex-shrink-0 text-xs border border-gray-300 rounded-full px-3 py-1.5 text-gray-700 hover:border-[#FF6B00] hover:text-[#FF6B00] transition-colors"
                  data-ocid="chatbot.quick_reply.button"
                >
                  {qr.label}
                </button>
              ))}
            </div>

            {/* Input row */}
            <div className="flex gap-2 px-3 py-3 bg-white border-t border-gray-100">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage(input)}
                placeholder="Type your question..."
                className="flex-1 text-sm"
                data-ocid="chatbot.input"
              />
              <button
                type="button"
                onClick={() => sendMessage(input)}
                className="bg-[#FF6B00] hover:bg-[#E65C00] text-white rounded-lg px-3 py-2 transition-colors"
                data-ocid="chatbot.send.button"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>

            {/* Request callback */}
            {!showCallback ? (
              <div className="px-3 pb-3 bg-white">
                <button
                  type="button"
                  onClick={() => setShowCallback(true)}
                  className="w-full border-2 border-gray-900 text-gray-900 hover:bg-gray-900 hover:text-white font-bold py-2 rounded-xl text-sm transition-all"
                  data-ocid="chatbot.callback.button"
                >
                  \ud83d\udcde Request Callback
                </button>
              </div>
            ) : (
              <div className="px-3 pb-3 bg-white space-y-2">
                <p className="text-xs font-semibold text-gray-600">
                  Enter your details for a callback:
                </p>
                <Input
                  value={callbackName}
                  onChange={(e) => setCallbackName(e.target.value)}
                  placeholder="Your name"
                  className="text-sm"
                  data-ocid="chatbot.callback_name.input"
                />
                <Input
                  value={callbackPhone}
                  onChange={(e) => setCallbackPhone(e.target.value)}
                  placeholder="Your phone number"
                  type="tel"
                  className="text-sm"
                  data-ocid="chatbot.callback_phone.input"
                />
                <div className="flex gap-2">
                  <Button
                    onClick={handleCallback}
                    disabled={!callbackName.trim() || !callbackPhone.trim()}
                    className="flex-1 bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold text-sm"
                    data-ocid="chatbot.callback_submit.primary_button"
                  >
                    Send Request
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowCallback(false)}
                    className="text-sm"
                    data-ocid="chatbot.callback_cancel.cancel_button"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
