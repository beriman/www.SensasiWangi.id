import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Link } from "react-router-dom";

export default function MarketplaceWishlist() {
  const { user } = useUser();
  const wishlist = useQuery(
    api.marketplace.getWishlistByUser,
    user ? { userId: user.id as any } : "skip",
  );

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  if (!user) return <div>Login terlebih dahulu</div>;
  if (wishlist === undefined) return <div>Loading...</div>;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-semibold mb-6">Wishlist</h1>
        {wishlist.length === 0 ? (
          <p>Wishlist kosong</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {wishlist.map((p: any) => (
              <Card key={p._id} className="neumorphic-card p-4">
                <img
                  src={
                    p.images[0] ||
                    "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80"
                  }
                  alt={p.title}
                  className="w-full h-40 object-cover rounded-xl"
                />
                <h3 className="mt-2 font-semibold line-clamp-1">{p.title}</h3>
                <p className="text-sm">{p.brand}</p>
                <p className="font-bold">{formatPrice(p.price)}</p>
                <Link to={`/marketplace/product/${p._id}`}>
                  <Button size="sm" className="mt-2">
                    Lihat
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
