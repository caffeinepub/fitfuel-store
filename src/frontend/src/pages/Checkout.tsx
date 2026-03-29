import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "@tanstack/react-router";
import { MapPin, Navigation } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { useCart } from "../context/CartContext";
import { useCheckout } from "../context/CheckoutContext";
import { useActor } from "../hooks/useActor";

const ADDRESS_TYPES = ["Home", "Work", "Hotel", "Other"];
const STORE_LAT = 26.9124;
const STORE_LNG = 75.8648;

function haversine(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

export default function Checkout() {
  const navigate = useNavigate();
  const { address, setAddress } = useCheckout();
  const { items, setGpsDeliveryCharge } = useCart();
  const { actor } = useActor();
  const [gpsMessage, setGpsMessage] = useState<string | null>(null);

  const set = (field: keyof typeof address, value: string) =>
    setAddress({ ...address, [field]: value });

  // Try to pre-fill from localStorage when user finishes typing phone number
  const handlePhoneBlur = () => {
    if (!address.phone) return;
    const saved = localStorage.getItem(`fitfuel_profile_${address.phone}`);
    if (saved) {
      try {
        const profile = JSON.parse(saved);
        setAddress({ ...address, ...profile, phone: address.phone });
        toast.success("Welcome back! We've filled in your saved address.");
      } catch {
        // ignore
      }
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error("Geolocation not supported by your browser.");
      return;
    }
    toast.info("Detecting your location...");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        const dist = haversine(STORE_LAT, STORE_LNG, latitude, longitude);
        const distKm = dist.toFixed(1);

        let charge: number;
        if (dist <= 5) {
          charge = 0;
          setGpsMessage(
            `\ud83d\udccd Your location is ${distKm} km from our store \u2014 FREE delivery!`,
          );
        } else {
          charge = items.length >= 3 ? 0 : 30;
          setGpsMessage(
            `\ud83d\udccd Your location is ${distKm} km from our store \u2014 ${
              charge === 0
                ? "FREE delivery (3+ items)"
                : "\u20b930 delivery charge"
            }`,
          );
        }
        setGpsDeliveryCharge(charge);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = ["flat", "area", "name", "phone"] as const;
    for (const f of required) {
      if (!address[f].trim()) {
        toast.error(`Please fill in the ${f} field.`);
        return;
      }
    }

    const profileData = {
      flat: address.flat,
      floor: address.floor,
      area: address.area,
      landmark: address.landmark,
      name: address.name,
      addressType: address.addressType,
    };
    localStorage.setItem(
      `fitfuel_profile_${address.phone}`,
      JSON.stringify(profileData),
    );

    if (actor) {
      actor
        .saveUserProfile({
          name: address.name,
          phone: address.phone,
          area: address.area,
          flat: address.flat,
          floor: address.floor,
          addressType: address.addressType,
          landmark: address.landmark,
        })
        .catch(() => {});
    }

    navigate({ to: "/payment" });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2">Delivery Address</h1>

      <div className="mb-6 flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-xl px-4 py-3 text-sm text-orange-800">
        <MapPin className="w-4 h-4 flex-shrink-0" />
        <span>
          \ud83d\udccd <strong>Free Delivery within 5 KM</strong> of our store
          (Hasanpura, Jaipur)
        </span>
      </div>

      {gpsMessage && (
        <div className="mb-6 flex items-center gap-2 bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-800 font-medium">
          {gpsMessage}
        </div>
      )}

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
              placeholder="e.g. Hasanpura, Jaipur"
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
                onBlur={handlePhoneBlur}
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
            Save & Continue \u2192
          </button>
        </form>
      </div>
    </div>
  );
}
