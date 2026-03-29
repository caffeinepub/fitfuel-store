import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { MapPin, Phone, User } from "lucide-react";
import { useState } from "react";
import type { Order, UserProfile } from "../backend.d";
import { OrderStatus } from "../backend.d";
import { useActor } from "../hooks/useActor";

function statusBadge(status: OrderStatus) {
  if (status === OrderStatus.delivered)
    return (
      <Badge className="bg-green-100 text-green-700 border-green-200">
        Delivered
      </Badge>
    );
  if (status === OrderStatus.confirmed)
    return (
      <Badge className="bg-blue-100 text-blue-700 border-blue-200">
        Confirmed
      </Badge>
    );
  return (
    <Badge className="bg-orange-100 text-orange-700 border-orange-200">
      Pending
    </Badge>
  );
}

export default function Profile() {
  const { actor, isFetching } = useActor();
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [searched, setSearched] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !actor) return;
    setLoading(true);
    setError("");
    try {
      const [profileResult, allOrders] = await Promise.all([
        actor.getUserByPhone(phone.trim()),
        actor.getAllOrders(),
      ]);
      setProfile(profileResult);
      const filtered = allOrders.filter(
        (o) => o.address.phone.toString() === phone.trim(),
      );
      setOrders(filtered);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
      setSearched(true);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
      <h1 className="text-3xl font-extrabold mb-2">My Profile</h1>
      <p className="text-muted-foreground mb-8">
        Enter your phone number to view your profile and order history.
      </p>

      <form
        onSubmit={handleSearch}
        className="flex gap-3 mb-10"
        data-ocid="profile.section"
      >
        <div className="flex-1 space-y-1">
          <Label htmlFor="profile-phone">Phone Number</Label>
          <Input
            id="profile-phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter your 10-digit mobile number"
            data-ocid="profile.phone.input"
          />
        </div>
        <div className="flex items-end">
          <Button
            type="submit"
            disabled={loading || isFetching || !phone.trim()}
            className="bg-[#FF6B00] hover:bg-[#E65C00] text-white font-bold px-6"
            data-ocid="profile.search.primary_button"
          >
            {loading ? "Searching..." : "View Profile"}
          </Button>
        </div>
      </form>

      {loading && (
        <div className="space-y-4" data-ocid="profile.loading_state">
          <Skeleton className="h-32 rounded-2xl" />
          <Skeleton className="h-48 rounded-2xl" />
        </div>
      )}

      {error && (
        <div
          className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm"
          data-ocid="profile.error_state"
        >
          {error}
        </div>
      )}

      {searched &&
        !loading &&
        !error &&
        (!profile ? (
          <div className="text-center py-16" data-ocid="profile.empty_state">
            <User className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-xl font-bold mb-2">No Profile Found</h2>
            <p className="text-muted-foreground">
              No profile found for this number. Place your first order to create
              a profile!
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white border border-border rounded-2xl p-6 shadow-sm">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 rounded-full bg-[#FF6B00]/10 flex items-center justify-center">
                  <User className="w-7 h-7 text-[#FF6B00]" />
                </div>
                <div>
                  <h2 className="text-xl font-extrabold">{profile.name}</h2>
                  <div className="flex items-center gap-1 text-muted-foreground text-sm">
                    <Phone className="w-3.5 h-3.5" />
                    <span>+91 {profile.phone}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4 mt-0.5 text-[#FF6B00] flex-shrink-0" />
                <span>
                  {profile.flat}, {profile.floor && `Floor ${profile.floor}, `}
                  {profile.area}
                  {profile.landmark && `, Near ${profile.landmark}`}
                </span>
              </div>
            </div>

            {/* Order History */}
            <div>
              <h3 className="text-lg font-extrabold mb-4">Order History</h3>
              {orders.length === 0 ? (
                <div
                  className="text-center py-8 text-muted-foreground"
                  data-ocid="profile.orders.empty_state"
                >
                  No orders found for this number.
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((order, idx) => (
                    <div
                      key={order.orderId.toString()}
                      className="bg-white border border-border rounded-xl p-4"
                      data-ocid={`profile.orders.item.${idx + 1}`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-bold text-muted-foreground">
                          Order #{order.orderId.toString()}
                        </span>
                        {statusBadge(order.status)}
                      </div>
                      <div className="text-sm text-muted-foreground mb-1">
                        {new Date(Number(order.timestamp)).toLocaleDateString(
                          "en-IN",
                          {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          },
                        )}
                      </div>
                      <div className="text-sm mb-2">
                        {order.products
                          .map((p) => `${p.name} \u00d7 ${p.quantity}`)
                          .join(", ")}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          Delivery:{" "}
                          {order.deliveryCharge === 0n
                            ? "FREE"
                            : `\u20b9${order.deliveryCharge}`}
                        </span>
                        <span className="font-extrabold text-[#FF6B00]">
                          \u20b9{order.totalAmount.toString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
    </div>
  );
}
