import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { useState, useEffect } from "react";
import { api } from "../../convex/_generated/api";
import RoleProtectedRoute from "@/components/wrappers/RoleProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function SellerOrders() {
  return (
    <RoleProtectedRoute roles={["seller", "admin"]}>
      <SellerOrdersContent />
    </RoleProtectedRoute>
  );
}

function SellerOrdersContent() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [params, setParams] = useSearchParams();
  const [statusFilter, setStatusFilter] = useState(
    params.get("status") || "all",
  );
  const [searchTerm, setSearchTerm] = useState(params.get("q") || "");

  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const myOrders = useQuery(
    api.marketplace.getOrdersByUser,
    currentUser ? { userId: currentUser._id, type: "seller" } : "skip",
  );

  useEffect(() => {
    const sp = new URLSearchParams();
    if (statusFilter && statusFilter !== "all") sp.set("status", statusFilter);
    if (searchTerm) sp.set("q", searchTerm);
    setParams(sp, { replace: true });
  }, [statusFilter, searchTerm, setParams]);

  const filteredOrders = (myOrders || []).filter((o: any) => {
    const matchStatus = statusFilter === "all" || o.orderStatus === statusFilter;
    const matchSearch =
      searchTerm.trim() === "" ||
      o.productTitle.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  if (myOrders === undefined) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Pesanan Saya</h1>
        <div className="flex flex-col sm:flex-row gap-4 mb-4">
          <Input
            placeholder="Cari pesanan..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="neumorphic-input border-0 flex-1"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="neumorphic-input border-0 w-full sm:w-48">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="neumorphic-card border-0">
              <SelectItem value="all">Semua Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="shipped">Shipped</SelectItem>
              <SelectItem value="delivered">Delivered</SelectItem>
              <SelectItem value="finished">Finished</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {filteredOrders.length === 0 ? (
          <p className="text-center text-[#86868B]">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((o: any) => (
              <Card key={o._id} className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {o.productTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {o.orderStatus}
                    </Badge>
                    <span className="text-sm text-[#86868B]">{o.paymentStatus}</span>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => navigate(`/marketplace/lapak/orders/${o._id}`)}
                  >
                    Lihat Detail
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        <div className="pt-4">
          <Link to="/marketplace/lapak" className="text-sm text-[#718096]">
            &larr; Kembali ke Lapak
          </Link>
        </div>
      </main>
    </div>
  );
}
