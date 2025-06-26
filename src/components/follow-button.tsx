import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Id } from "../../convex/_generated/dataModel";

export default function FollowButton({ userId }: { userId: Id<"users"> }) {
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const followers = useQuery(api.follows.getFollowers, { userId });
  const follow = useMutation(api.follows.followUser);
  const unfollow = useMutation(api.follows.unfollowUser);

  if (currentUser === undefined || followers === undefined) return null;
  if (!currentUser) return null;
  if (currentUser._id === userId) return null;

  const isFollowing = followers.some((f: any) => f._id === currentUser._id);

  const handleClick = async () => {
    if (isFollowing) {
      await unfollow({ userId });
    } else {
      await follow({ userId });
    }
  };

  return (
    <Button
      size="sm"
      variant={isFollowing ? "secondary" : "default"}
      onClick={handleClick}
      className="ml-2"
    >
      {isFollowing ? "Unfollow" : "Follow"}
    </Button>
  );
}
