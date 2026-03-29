import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Download, Lock, LogOut, ShieldCheck } from "lucide-react";
import { useEffect, useState } from "react";
import type { Order, UserProfile } from "../backend.d";
import { OrderStatus } from "../backend.d";
import { useActor } from "../hooks/useActor";

const ADMIN_PASSWORD = "Fit@123";

function downloadCSV(filename: string, rows: string[][]) {
  const content = rows.map((r) => r.map((c) => `"${c}"`).join(",")).join("\n");
  const blob = new Blob([content], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

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

export default function Admin() {
  const { actor, isFetching } = useActor();
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [pwError, setPwError] = useState("");
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setAuthed(true);
      setPwError("");
    } else {
      setPwError("Incorrect password");
    }
  };

  useEffect(() => {
    if (!authed || !actor || isFetching) return;
    setLoading(true);
    Promise.all([actor.getAllUsers(), actor.getAllOrders()])
      .then(([u, o]) => {
        setUsers(u);
        setOrders(o);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authed, actor, isFetching]);

  const exportCustomersCSV = () => {
    const rows = [
      ["Name", "Phone", "Address Type", "Flat", "Floor", "Area", "Landmark"],
      ...users.map((u) => [
        u.name,
        u.phone,
        u.addressType,
        u.flat,
        u.floor,
        u.area,
        u.landmark,
      ]),
    ];
    downloadCSV("fitfuel_customers.csv", rows);
  };

  const exportOrdersCSV = () => {
    const rows = [
      [
        "Order ID",
        "Date",
        "Customer Name",
        "Customer Phone",
        "Products",
        "Total",
        "Delivery",
        "Payment",
        "Status",
      ],
      ...orders.map((o) => [
        o.orderId.toString(),
        new Date(Number(o.timestamp)).toLocaleDateString("en-IN"),
        o.address.name,
        o.address.phone.toString(),
        o.products.map((p) => `${p.name} x${p.quantity}`).join("; "),
        o.totalAmount.toString(),
        o.deliveryCharge.toString(),
        o.paymentMethod.__kind__ === "upi"
          ? `UPI (${o.paymentMethod.upi})`
          : "COD",
        o.status,
      ]),
    ];
    downloadCSV("fitfuel_orders.csv", rows);
  };

  if (!authed) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="bg-white border border-border rounded-2xl shadow-lg p-8 w-full max-w-sm">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 rounded-full bg-gray-900 flex items-center justify-center">
              <Lock className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-2xl font-extrabold text-center mb-1">
            Admin Access
          </h1>
          <p className="text-muted-foreground text-sm text-center mb-6">
            FitFuel Store \u2014 Admin Panel
          </p>
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="admin-pw">Password</Label>
              <Input
                id="admin-pw"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                data-ocid="admin.password.input"
              />
              {pwError && (
                <p
                  className="text-red-600 text-xs mt-1"
                  data-ocid="admin.password.error_state"
                >
                  {pwError}
                </p>
              )}
            </div>
            <Button
              type="submit"
              className="w-full bg-gray-900 hover:bg-gray-800 text-white font-bold"
              data-ocid="admin.login.submit_button"
            >
              Login
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-7 h-7 text-[#FF6B00]" />
          <h1 className="text-2xl font-extrabold">FitFuel Admin Dashboard</h1>
        </div>
        <Button
          variant="outline"
          onClick={() => setAuthed(false)}
          className="flex items-center gap-2 text-sm"
          data-ocid="admin.logout.button"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </Button>
      </div>

      {loading ? (
        <div className="space-y-4" data-ocid="admin.loading_state">
          <Skeleton className="h-12 rounded-xl" />
          <Skeleton className="h-64 rounded-xl" />
        </div>
      ) : (
        <Tabs defaultValue="customers" data-ocid="admin.panel">
          <TabsList className="mb-6">
            <TabsTrigger value="customers" data-ocid="admin.customers.tab">
              Customers ({users.length})
            </TabsTrigger>
            <TabsTrigger value="orders" data-ocid="admin.orders.tab">
              Orders ({orders.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="customers">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">All Customers</h2>
              <Button
                onClick={exportCustomersCSV}
                className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E65C00] text-white"
                data-ocid="admin.customers.download.button"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
            {users.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.customers.empty_state"
              >
                No customer data yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold">Name</th>
                      <th className="text-left px-4 py-3 font-bold">Phone</th>
                      <th className="text-left px-4 py-3 font-bold">Address</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((u, i) => (
                      <tr
                        key={u.phone}
                        className="border-b border-border last:border-0 hover:bg-gray-50 transition-colors"
                        data-ocid={`admin.customers.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-medium">{u.name}</td>
                        <td className="px-4 py-3 text-muted-foreground">
                          +91 {u.phone}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {u.flat}, {u.area}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="orders">
            <div className="flex justify-between items-center mb-4">
              <h2 className="font-bold text-lg">All Orders</h2>
              <Button
                onClick={exportOrdersCSV}
                className="flex items-center gap-2 bg-[#FF6B00] hover:bg-[#E65C00] text-white"
                data-ocid="admin.orders.download.button"
              >
                <Download className="w-4 h-4" />
                Download CSV
              </Button>
            </div>
            {orders.length === 0 ? (
              <div
                className="text-center py-16 text-muted-foreground"
                data-ocid="admin.orders.empty_state"
              >
                No orders yet.
              </div>
            ) : (
              <div className="overflow-x-auto rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-border">
                    <tr>
                      <th className="text-left px-4 py-3 font-bold">
                        Order ID
                      </th>
                      <th className="text-left px-4 py-3 font-bold">Date</th>
                      <th className="text-left px-4 py-3 font-bold">
                        Customer
                      </th>
                      <th className="text-left px-4 py-3 font-bold">
                        Products
                      </th>
                      <th className="text-left px-4 py-3 font-bold">Total</th>
                      <th className="text-left px-4 py-3 font-bold">Payment</th>
                      <th className="text-left px-4 py-3 font-bold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((o, i) => (
                      <tr
                        key={o.orderId.toString()}
                        className="border-b border-border last:border-0 hover:bg-gray-50"
                        data-ocid={`admin.orders.item.${i + 1}`}
                      >
                        <td className="px-4 py-3 font-mono text-xs">
                          #{o.orderId.toString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {new Date(Number(o.timestamp)).toLocaleDateString(
                            "en-IN",
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <div className="font-medium">{o.address.name}</div>
                          <div className="text-xs text-muted-foreground">
                            +91 {o.address.phone.toString()}
                          </div>
                        </td>
                        <td className="px-4 py-3 text-muted-foreground max-w-[200px]">
                          {o.products
                            .map((p) => `${p.name} \u00d7${p.quantity}`)
                            .join(", ")}
                        </td>
                        <td className="px-4 py-3 font-bold text-[#FF6B00]">
                          \u20b9{o.totalAmount.toString()}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {o.paymentMethod.__kind__ === "upi" ? "UPI" : "COD"}
                        </td>
                        <td className="px-4 py-3">{statusBadge(o.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
}
