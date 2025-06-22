import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";

export default function OrderDetail() {
  const { orderId } = useParams();
  const order = useQuery(
    api.marketplace.getOrderById,
    orderId ? { orderId: orderId as any } : "skip",
  );

  if (order === undefined) return <div>Loading...</div>;
  if (order === null) return <div>Order tidak ditemukan</div>;

  const steps = ["pending", "confirmed", "shipped", "delivered"] as const;
  const currentIndex = steps.indexOf(order.orderStatus as any);

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-2xl font-semibold">Detail Pesanan</h1>
        <div className="neumorphic-card p-6 space-y-2">
          <div className="font-semibold">{order.productTitle}</div>
          <div>Pembeli: {order.buyerName}</div>
          <div>Metode Pembayaran: {order.paymentMethod}</div>
        </div>
        <div className="neumorphic-card p-6">
          <h2 className="font-semibold mb-2">Riwayat Status</h2>
          <ol className="list-decimal pl-4 space-y-1">
            {steps.map((status, idx) => (
              <li
                key={status}
                className={idx <= currentIndex ? "text-[#1D1D1F]" : "text-[#86868B]"}
              >
                {status}
              </li>
            ))}
          </ol>
        </div>
        <div className="neumorphic-card p-6">
          <h2 className="font-semibold mb-2">Bukti Bayar</h2>
          {order.paymentStatus === "paid" ? (
            <p>Virtual Account: {order.virtualAccountNumber}</p>
          ) : (
            <p>Belum dibayar</p>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
