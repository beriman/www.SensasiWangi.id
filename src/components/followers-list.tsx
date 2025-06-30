import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import FollowButton from "@/components/follow-button";
import { Id } from "../../convex/_generated/dataModel";

function getInitials(name: string | null | undefined) {
  if (!name) return "U";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function FollowersList({ userId }: { userId: Id<"users"> }) {
  const followers = useQuery(api.follows.getFollowers, { userId });

  if (followers === undefined) {
    return <div className="p-4 text-center">Memuat...</div>;
  }

  if (!followers.length) {
    return (
      <div className="p-4 text-center text-[#86868B]">Belum ada pengikut.</div>
    );
  }

  return (
    <div className="space-y-4">
      {followers.map((u: any) => (
        <div key={u._id} className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar className="w-8 h-8">
              <AvatarImage src={u.image} alt={u.name || "User"} />
              <AvatarFallback>{getInitials(u.name)}</AvatarFallback>
            </Avatar>
            <span className="text-sm font-medium text-[#1D1D1F]">{u.name}</span>
          </div>
          <FollowButton userId={u._id as any} />
        </div>
      ))}
    </div>
  );
}
