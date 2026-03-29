import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useNavigate } from "@tanstack/react-router";
import { QrCode, Smartphone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";

const UPI_ID = "9549958286@fam";

// Static deterministic QR-like cells with stable IDs
const QR_CELLS: Array<{ id: string; color: string }> = [
  { id: "c00", color: "#111" },
  { id: "c01", color: "#111" },
  { id: "c02", color: "#111" },
  { id: "c03", color: "#111" },
  { id: "c04", color: "#111" },
  { id: "c05", color: "#111" },
  { id: "c06", color: "#111" },
  { id: "c10", color: "#111" },
  { id: "c11", color: "transparent" },
  { id: "c12", color: "transparent" },
  { id: "c13", color: "transparent" },
  { id: "c14", color: "transparent" },
  { id: "c15", color: "transparent" },
  { id: "c16", color: "#111" },
  { id: "c20", color: "#111" },
  { id: "c21", color: "transparent" },
  { id: "c22", color: "#111" },
  { id: "c23", color: "transparent" },
  { id: "c24", color: "#111" },
  { id: "c25", color: "transparent" },
  { id: "c26", color: "#111" },
  { id: "c30", color: "#111" },
  { id: "c31", color: "transparent" },
  { id: "c32", color: "transparent" },
  { id: "c33", color: "#111" },
  { id: "c34", color: "transparent" },
  { id: "c35", color: "transparent" },
  { id: "c36", color: "#111" },
  { id: "c40", color: "#111" },
  { id: "c41", color: "transparent" },
  { id: "c42", color: "#111" },
  { id: "c43", color: "transparent" },
  { id: "c44", color: "#111" },
  { id: "c45", color: "transparent" },
  { id: "c46", color: "#111" },
  { id: "c50", color: "#111" },
  { id: "c51", color: "transparent" },
  { id: "c52", color: "transparent" },
  { id: "c53", color: "transparent" },
  { id: "c54", color: "transparent" },
  { id: "c55", color: "transparent" },
  { id: "c56", color: "#111" },
  { id: "c60", color: "#111" },
  { id: "c61", color: "#111" },
  { id: "c62", color: "#111" },
  { id: "c63", color: "#111" },
  { id: "c64", color: "#111" },
  { id: "c65", color: "#111" },
  { id: "c66", color: "#111" },
];

export default function Payment() {
  const navigate = useNavigate();
  const { grandTotal } = useCart();
  const { setPaymentMethod, setUpiId } = useCheckout();
  const [upiInput, setUpiInput] = useState("");
  const [tab, setTab] = useState("upi");

  const handlePaid = () => {
    setPaymentMethod("upi");
    setUpiId(upiInput);
    toast.success("Payment confirmed! Placing your order...");
    navigate({ to: "/order-success" });
  };

  const handleCOD = () => {
    setPaymentMethod("cod");
    setUpiId("");
    toast.success("Order confirmed with Cash on Delivery!");
    navigate({ to: "/order-success" });
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Payment</h1>

      <div className="bg-secondary rounded-2xl p-5 mb-8 flex justify-between items-center">
        <span className="text-muted-foreground font-semibold">
          Amount to pay
        </span>
        <span className="text-3xl font-extrabold">₹{grandTotal}</span>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList className="w-full mb-8 h-12">
          <TabsTrigger
            value="upi"
            className="flex-1 font-bold"
            data-ocid="payment.upi.tab"
          >
            <Smartphone className="w-4 h-4 mr-2" /> Pay Online (UPI)
          </TabsTrigger>
          <TabsTrigger
            value="cod"
            className="flex-1 font-bold"
            data-ocid="payment.cod.tab"
          >
            Cash on Delivery
          </TabsTrigger>
        </TabsList>

        <TabsContent value="upi">
          <div className="flex flex-col items-center gap-6">
            <div className="border-2 border-dashed border-border rounded-2xl p-8 flex flex-col items-center gap-4 w-full bg-white">
              <div className="bg-secondary p-6 rounded-xl">
                <div className="grid grid-cols-7 gap-1 w-48 h-48">
                  {QR_CELLS.map((cell) => (
                    <div
                      key={cell.id}
                      className="rounded-sm"
                      style={{ backgroundColor: cell.color }}
                    />
                  ))}
                </div>
              </div>
              <div className="text-center">
                <p className="font-bold text-lg">{UPI_ID}</p>
                <p className="text-sm text-muted-foreground mt-1 flex items-center gap-1 justify-center">
                  <QrCode className="w-4 h-4" /> Scan with any UPI app (PhonePe,
                  GPay, Paytm)
                </p>
              </div>
            </div>

            <div className="w-full space-y-2">
              <Label htmlFor="upi-ref">
                Your UPI ID (optional — for reference)
              </Label>
              <Input
                id="upi-ref"
                value={upiInput}
                onChange={(e) => setUpiInput(e.target.value)}
                placeholder="yourname@upi"
                data-ocid="payment.upi_id.input"
              />
            </div>

            <button
              type="button"
              onClick={handlePaid}
              className="w-full bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-orange"
              data-ocid="payment.i_have_paid.primary_button"
            >
              ✓ I have paid — ₹{grandTotal}
            </button>
          </div>
        </TabsContent>

        <TabsContent value="cod">
          <div className="flex flex-col items-center gap-6">
            <div className="bg-white border border-border rounded-2xl p-8 text-center w-full">
              <div className="text-6xl mb-4">💵</div>
              <h3 className="text-xl font-extrabold mb-2">Cash on Delivery</h3>
              <p className="text-muted-foreground">
                Pay <strong>₹{grandTotal}</strong> in cash when your order
                arrives.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Please keep exact change ready for a smooth delivery experience.
              </p>
            </div>
            <button
              type="button"
              onClick={handleCOD}
              className="w-full bg-foreground hover:bg-foreground/90 text-white font-bold py-4 rounded-xl text-lg transition-colors"
              data-ocid="payment.confirm_cod.primary_button"
            >
              Confirm Order — Pay on Delivery
            </button>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
