import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import RoleProtectedRoute from "@/components/wrappers/RoleProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Papa from "papaparse";

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
  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const myOrders = useQuery(
    api.marketplace.getOrdersByUser,
    currentUser ? { userId: currentUser._id, type: "seller" } : "skip",
  );

  const handleExport = () => {
    if (!myOrders || myOrders.length === 0) return;
    const data = myOrders.map((o: any) => ({
      orderDate: new Date(o.createdAt).toLocaleDateString("id-ID"),
      buyerName: o.buyerName,
      productTitle: o.productTitle,
      status: o.orderStatus,
      totalAmount: o.totalAmount,
    }));
    const csv = Papa.unparse(data);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (myOrders === undefined) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-3xl font-bold">Pesanan Saya</h1>
          <Button size="sm" onClick={handleExport}>
            Export CSV
          </Button>
        </div>
        {(!myOrders || myOrders.length === 0) ? (
          <p className="text-center text-[#86868B]">Belum ada pesanan.</p>
        ) : (
          <div className="space-y-4">
            {myOrders.map((o: any) => (
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
