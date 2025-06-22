import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";

export default function OrderDetail() {
  return (
    <ProtectedRoute>
      <OrderDetailContent />
    </ProtectedRoute>
  );
}

function OrderDetailContent() {
  const { user } = useUser();
  const { orderId } = useParams();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const order = useQuery(
    api.marketplace.getOrderById,
    orderId ? { orderId: orderId as any } : "skip",
  );
  if (order === undefined || currentUser === undefined) return <div>Loading...</div>;
  if (order === null) return <div>Order tidak ditemukan</div>;
  if (currentUser && currentUser._id !== order.buyerId && currentUser._id !== order.sellerId) {
    return <div>Anda tidak memiliki akses ke order ini.</div>;
  }

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const shipping: any = order.shippingAddress || {};

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-2xl font-semibold mb-4">Detail Order</h1>
        <Card className="neumorphic-card border-0">
          <CardHeader>
            <CardTitle>{order.productTitle}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Status Order: {order.orderStatus}</p>
            <p>Status Pembayaran: {order.paymentStatus}</p>
            <p>Total: {formatPrice(order.totalAmount)}</p>
          </CardContent>
        </Card>

        <Card className="neumorphic-card border-0">
          <CardHeader>
            <CardTitle>Detail Pengiriman</CardTitle>
          </CardHeader>
          <CardContent className="space-y-1 text-sm">
            <p>Nama: {shipping.name}</p>
            <p>Telepon: {shipping.phone}</p>
            <p>Alamat: {shipping.address}</p>
            <p>Kota: {shipping.city}</p>
            <p>Provinsi: {shipping.province}</p>
            <p>Kode Pos: {shipping.postalCode}</p>
            <p>Metode Pengiriman: {order.shippingMethod}</p>
            {order.trackingNumber && <p>Resi: {order.trackingNumber}</p>}
          </CardContent>
        </Card>

        {order.paymentProofUrl && (
          <Card className="neumorphic-card border-0">
            <CardHeader>
              <CardTitle>Bukti Pembayaran</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={order.paymentProofUrl}
                alt="Bukti Pembayaran"
                className="max-w-xs rounded"
              />
            </CardContent>
          </Card>
        )}
      </main>
      <Footer />
    </div>
  );
}
