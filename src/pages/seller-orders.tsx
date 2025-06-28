import { useUser } from "@clerk/clerk-react";
import { useNavigate, Link } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import RoleProtectedRoute from "@/components/wrappers/RoleProtectedRoute";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

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

  if (myOrders === undefined) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold mb-4">Pesanan Saya</h1>
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
