import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { useEffect, useRef } from "react";
import { api } from "../../convex/_generated/api";
import { toast } from "@/components/ui/use-toast";

export default function NotificationListener() {
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user ? { tokenIdentifier: user.id } : "skip",
  );

  const notifications = useQuery(
    api.notifications.getNotifications,
    currentUser ? { userId: currentUser._id } : "skip",
  );

  const markRead = useMutation(api.notifications.markNotificationRead);
  const seenIds = useRef(new Set<string>());

  useEffect(() => {
    if (!notifications) return;
    notifications.forEach((n) => {
      if (!n.read && !seenIds.current.has(n._id)) {
        seenIds.current.add(n._id);
        toast({ title: "Notifikasi", description: n.message });
        markRead({ notificationId: n._id });
      }
    });
  }, [notifications, markRead]);

  return null;
}
