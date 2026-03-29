import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { toast } from "sonner";
import { useCheckout } from "../context/CheckoutContext";

const ADDRESS_TYPES = ["Home", "Work", "Hotel", "Other"];

export default function Checkout() {
  const navigate = useNavigate();
  const { address, setAddress } = useCheckout();

  const set = (field: keyof typeof address, value: string) =>
    setAddress({ ...address, [field]: value });

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }
    toast.info("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        set(
          "area",
          `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`,
        );
        toast.success(
          "Location detected! Please fill in the remaining fields.",
        );
      },
      () => toast.error("Could not detect location. Please enter manually."),
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["flat", "area", "name", "phone"] as const;
    for (const f of required) {
      if (!address[f].trim()) {
        toast.error(`Please fill in the ${f} field.`);
        return;
      }
    }
    navigate({ to: "/payment" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-8">Delivery Address</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Map placeholder */}
        <div className="flex flex-col gap-4">
          <div
            className="bg-secondary border border-border rounded-2xl overflow-hidden relative"
            style={{ minHeight: 320 }}
            data-ocid="checkout.map_marker"
          >
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "linear-gradient(to right, oklch(0.9 0 0) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.9 0 0) 1px, transparent 1px)",
                backgroundSize: "32px 32px",
              }}
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
              <div className="bg-white rounded-full p-4 shadow-card">
                <MapPin className="w-8 h-8 text-[#FF6B00]" />
              </div>
              <p className="text-sm font-semibold text-muted-foreground">
                Your delivery location
              </p>
              {address.area?.startsWith("Lat:") && (
                <div className="bg-white rounded-lg px-3 py-1.5 shadow-card text-xs font-mono text-foreground">
                  {address.area}
                </div>
              )}
            </div>
          </div>

          <button
            type="button"
            onClick={detectLocation}
            className="flex items-center justify-center gap-2 border-2 border-[#FF6B00] text-[#FF6B00] hover:bg-[#FF6B00] hover:text-white font-bold py-3 rounded-xl transition-all duration-200"
            data-ocid="checkout.detect_location.button"
          >
            <Navigation className="w-5 h-5" />
            Detect My Location
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <div>
            <Label className="text-sm font-bold uppercase tracking-wider text-muted-foreground mb-2 block">
              Address Type
            </Label>
            <div className="flex flex-wrap gap-2">
              {ADDRESS_TYPES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => set("addressType", t)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold border transition-all ${
                    address.addressType === t
                      ? "bg-foreground text-white border-foreground"
                      : "border-border text-foreground hover:border-foreground"
                  }`}
                  data-ocid="checkout.address_type.toggle"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="flat">Flat / House No / Building *</Label>
              <Input
                id="flat"
                value={address.flat}
                onChange={(e) => set("flat", e.target.value)}
                placeholder="e.g. 101, A Block"
                data-ocid="checkout.flat.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                value={address.floor}
                onChange={(e) => set("floor", e.target.value)}
                placeholder="e.g. Ground, 2nd"
                data-ocid="checkout.floor.input"
              />
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="area">Area / Sector / Locality *</Label>
            <Input
              id="area"
              value={address.area}
              onChange={(e) => set("area", e.target.value)}
              placeholder="e.g. Koramangala, Bangalore"
              data-ocid="checkout.area.input"
            />
          </div>

          <div className="space-y-1">
            <Label htmlFor="landmark">Nearby Landmark</Label>
            <Input
              id="landmark"
              value={address.landmark}
              onChange={(e) => set("landmark", e.target.value)}
              placeholder="e.g. Near City Mall"
              data-ocid="checkout.landmark.input"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="name">Full Name *</Label>
              <Input
                id="name"
                value={address.name}
                onChange={(e) => set("name", e.target.value)}
                placeholder="Your name"
                data-ocid="checkout.name.input"
              />
            </div>
            <div className="space-y-1">
              <Label htmlFor="phone">Phone Number *</Label>
              <Input
                id="phone"
                type="tel"
                value={address.phone}
                onChange={(e) => set("phone", e.target.value)}
                placeholder="10-digit mobile number"
                data-ocid="checkout.phone.input"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold py-4 rounded-xl text-lg transition-colors shadow-orange mt-2"
            data-ocid="checkout.save_continue.submit_button"
          >
            Save & Continue →
          </button>
        </form>
      </div>
    </div>
  );
}
