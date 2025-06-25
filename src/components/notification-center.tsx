import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Bell, MessageCircle, Heart, Award, TrendingUp } from "lucide-react";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "comment":
      return { icon: <MessageCircle className="w-4 h-4" />, color: "text-blue-500" };
    case "like":
      return { icon: <Heart className="w-4 h-4" />, color: "text-red-500" };
    case "badge":
      return { icon: <Award className="w-4 h-4" />, color: "text-yellow-500" };
    case "achievement":
      return { icon: <TrendingUp className="w-4 h-4" />, color: "text-green-500" };
    default:
      return { icon: <Bell className="w-4 h-4" />, color: "text-gray-500" };
  }
};

export default function NotificationCenter() {
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user ? { tokenIdentifier: user.id } : "skip",
  );

  const notifications = useQuery(
    api.notifications.getNotifications,
    currentUser ? { userId: currentUser._id } : "skip",
  );

  const unreadCount = useQuery(
    api.notifications.getUnreadCount,
    currentUser ? { userId: currentUser._id } : "skip",
  );

  const markRead = useMutation(api.notifications.markNotificationRead);

  if (!notifications) return null;

  const unread = notifications.filter((n) => !n.read);

  const handleMarkAll = async () => {
    for (const n of unread) {
      await markRead({ notificationId: n._id });
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-[#1D1D1F]">
          Notifikasi
          {unreadCount && unreadCount > 0 && (
            <Badge variant="destructive" className="ml-2">
              {unreadCount}
            </Badge>
          )}
        </h2>
        {unreadCount && unreadCount > 0 && (
          <Button
            size="sm"
            variant="ghost"
            className="neumorphic-button-sm border-0 shadow-none"
            onClick={handleMarkAll}
          >
            Tandai baca semua
          </Button>
        )}
      </div>
      <div className="space-y-2">
        {notifications.map((n) => {
          const { icon, color } = getNotificationIcon(n.type);
          return (
            <div
              key={n._id}
              className="neumorphic-card p-3 flex items-center justify-between"
            >
              <div className="flex items-center gap-2">
                <div className={`${color} neumorphic-button-sm p-1 rounded-full`}>
                  {icon}
                </div>
                <p className="text-sm text-[#1D1D1F]">{n.message}</p>
              </div>
              {!n.read && <Badge variant="secondary">baru</Badge>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
