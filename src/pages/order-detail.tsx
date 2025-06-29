import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  const cancelOrder = useMutation(api.marketplace.cancelOrder);
  const tracking = useQuery(
    api.marketplace.getOrderTracking,
    order && order.trackingNumber ? { orderId: order._id } : "skip",
  );
  const submitReport = useMutation(api.marketplace.submitOrderReport);
  const navigate = useNavigate();
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

        {order.trackingNumber && tracking && (
          <Card className="neumorphic-card border-0">
            <CardHeader>
              <CardTitle>Riwayat Pengiriman</CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-1">
              <ul className="space-y-1">
                {tracking.map((t: any, idx: number) => (
                  <li key={idx}>
                    {t.manifestDate} {t.manifestTime} - {t.description}
                    {t.cityName ? ` (${t.cityName})` : ""}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

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

        {order.orderStatus === "delivered" && (
          <Link to={`/order/${order._id}/review`}>
            <Button className="mt-4">Beri Ulasan</Button>
          </Link>
        )}
        {currentUser &&
          currentUser._id === order.buyerId &&
          order.paymentStatus === "pending" && (
            <Button
              className="mt-4"
              onClick={async () => {
                if (confirm("Batalkan order ini?")) {
                  await cancelOrder({ orderId: order._id });
                  navigate("/dashboard");
                }
              }}
            >
              Batalkan Order
            </Button>
          )}
        {currentUser &&
          currentUser._id === order.sellerId &&
          order.orderStatus === "shipped" &&
          Date.now() - order.updatedAt > 7 * 24 * 60 * 60 * 1000 && (
            <Button
              className="mt-4"
              onClick={async () => {
                const reason = window.prompt("Alasan laporan?");
                if (reason) {
                  await submitReport({ orderId: order._id, reason });
                  alert("Laporan dikirim");
                }
              }}
            >
              Laporkan Masalah
            </Button>
          )}
      </main>
    </div>
  );
}
