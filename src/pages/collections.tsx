import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { Link } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";

export default function Collections() {
  return (
    <ProtectedRoute>
      <CollectionsContent />
    </ProtectedRoute>
  );
}

function CollectionsContent() {
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const bookmarks = useQuery(
    api.bookmarks.getBookmarksByUser,
    currentUser ? { userId: currentUser._id } : "skip",
  );

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Koleksi Saya</h1>
        {!bookmarks || bookmarks.length === 0 ? (
          <p className="text-center text-[#86868B]">Belum ada koleksi.</p>
        ) : (
          <div className="space-y-4">
            {bookmarks.map((b: any) => (
              <Card key={b.data._id} className="neumorphic-card border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="text-lg font-semibold">
                    {b.data.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Link
                    to={
                      b.type === "topic"
                        ? `/forum?topic=${b.data._id}`
                        : `/marketplace/product/${b.data._id}`
                    }
                    className="text-sm text-[#667eea]"
                  >
                    Lihat {b.type === "topic" ? "Topik" : "Produk"}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
