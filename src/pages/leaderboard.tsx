import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Link } from "react-router-dom";

export default function Leaderboard() {
  const contributors = useQuery(api.rewards.getTopContributors, {});

  const getInitials = (name: string | undefined | null) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-3xl font-bold text-center mb-8">Leaderboard</h1>
        {!contributors ? (
          <p className="text-center text-[#86868B]">Loading...</p>
        ) : contributors.length === 0 ? (
          <p className="text-center text-[#86868B]">Belum ada data.</p>
        ) : (
          <div className="space-y-4 max-w-xl mx-auto">
            {contributors.map((u, idx) => (
              <Link
                to={`/u/${u._id}`}
                key={u._id}
                className="neumorphic-card p-4 flex items-center gap-4 hover:scale-[1.02] transition"
              >
                <span className="font-bold text-xl w-6 text-center">{idx + 1}</span>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={u.image || undefined} />
                  <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h2 className="font-semibold text-[#1D1D1F]">{u.name || "Pengguna"}</h2>
                </div>
                <div className="font-medium text-sm">
                  {u.contributionPoints} pts
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
