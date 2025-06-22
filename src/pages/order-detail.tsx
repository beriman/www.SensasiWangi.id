import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useParams } from "react-router-dom";

export default function OrderDetail() {
  const { orderId } = useParams();
  const order = useQuery(
    api.marketplace.getOrderById,
    orderId ? { orderId: orderId as any } : "skip",
  );

  if (order === undefined) return <div>Loading...</div>;
  if (order === null) return <div>Order tidak ditemukan</div>;

  const address = order.shippingAddress;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-2xl font-semibold mb-6">Detail Pesanan</h1>
        <section className="space-y-2">
          <h2 className="font-semibold">Status</h2>
          <p>Status Pesanan: {order.orderStatus}</p>
          <p>Status Pembayaran: {order.paymentStatus}</p>
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold">Bukti Pembayaran</h2>
          {order.virtualAccountNumber && (
            <p>Virtual Account: {order.virtualAccountNumber}</p>
          )}
          <p>Metode Pembayaran: {order.paymentMethod}</p>
          {order.paymentExpiry && (
            <p>Bayar sebelum: {new Date(order.paymentExpiry).toLocaleString()}</p>
          )}
        </section>
        <section className="space-y-2">
          <h2 className="font-semibold">Informasi Pengiriman</h2>
          <p>Metode Pengiriman: {order.shippingMethod}</p>
          {order.trackingNumber && <p>Nomor Resi: {order.trackingNumber}</p>}
          <p>
            {address.name} ({address.phone})<br />
            {address.address}, {address.city}, {address.province} {address.postalCode}
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
