import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Link } from "react-router-dom";

export default function MyShop() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const orders = useQuery(
    api.marketplace.getOrdersByUser,
    userData ? { userId: userData._id, type: "seller" } : "skip",
  );

  if (orders === undefined) return <div>Loading...</div>;
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-6">Pesanan Toko Saya</h1>
        {orders.length === 0 ? (
          <p>Tidak ada pesanan.</p>
        ) : (
          <div className="space-y-4">
            {orders.map((o) => (
              <Link
                key={o._id}
                to={`/order/${o._id}`}
                className="block neumorphic-card p-4 hover:bg-[#f5f5f7]"
              >
                <div className="font-semibold">{o.productTitle}</div>
                <div className="text-sm text-[#86868B]">Pembeli: {o.buyerName}</div>
                <div className="text-sm">Status: {o.orderStatus}</div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
