import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import RoleProtectedRoute from "@/components/wrappers/RoleProtectedRoute";

export default function MyShop() {
  return (
    <RoleProtectedRoute roles={["seller", "admin"]}>
      <MyShopContent />
    </RoleProtectedRoute>
  );
}

function MyShopContent() {
  const { user } = useUser();
  const navigate = useNavigate();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const myProducts = useQuery(
    api.marketplace.getProductsBySeller,
    currentUser ? { sellerId: currentUser._id } : "skip",
  );
  const myOrders = useQuery(
    api.marketplace.getOrdersByUser,
    currentUser ? { userId: currentUser._id, type: "seller" } : "skip",
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16 space-y-12">
        <section>
          <h1 className="text-3xl font-bold mb-4">Produk Saya</h1>
          {!myProducts || myProducts.length === 0 ? (
            <p className="text-center text-[#86868B]">Belum ada produk.</p>
          ) : (
            <div className="space-y-4">
              {myProducts.map((p: any) => (
                <Card key={p._id} className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="text-lg font-semibold">
                      {p.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex items-center justify-between">
                    <span className="text-sm text-[#1D1D1F]">
                      {formatPrice(p.price)}
                    </span>
                    <Button
                      size="sm"
                      onClick={() =>
                        navigate(`/marketplace/sell?productId=${p._id}`)
                      }
                    >
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
        <section>
          <h2 className="text-3xl font-bold mb-4">Pesanan</h2>
          {!myOrders || myOrders.length === 0 ? (
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
                      <span className="text-sm text-[#86868B]">
                        {o.paymentStatus}
                      </span>
                    </div>
                    <Button
                      size="sm"
                      onClick={() => navigate(`/marketplace/order/${o._id}`)}
                    >
                      Lihat Detail
                    </Button>
                 </CardContent>
               </Card>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
