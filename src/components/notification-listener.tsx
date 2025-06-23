import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { useEffect, useRef, useState } from "react";
import { api } from "../../convex/_generated/api";
import { toast } from "@/components/ui/use-toast";
import { Bell, MessageCircle, Heart, Award, TrendingUp } from "lucide-react";

interface NotificationWithIcon {
  _id: string;
  type: string;
  message: string;
  url?: string;
  read: boolean;
  createdAt: number;
  icon: React.ReactNode;
  color: string;
}

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "comment":
      return {
        icon: <MessageCircle className="w-4 h-4" />,
        color: "text-blue-500",
      };
    case "like":
      return { icon: <Heart className="w-4 h-4" />, color: "text-red-500" };
    case "badge":
      return { icon: <Award className="w-4 h-4" />, color: "text-yellow-500" };
    case "achievement":
      return {
        icon: <TrendingUp className="w-4 h-4" />,
        color: "text-green-500",
      };
    default:
      return { icon: <Bell className="w-4 h-4" />, color: "text-gray-500" };
  }
};

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
  const [lastNotificationCount, setLastNotificationCount] = useState(0);

  useEffect(() => {
    if (!notifications) return;

    // Filter notifikasi yang belum dibaca dan belum pernah ditampilkan
    const unreadNotifications = notifications.filter(
      (n) => !n.read && !seenIds.current.has(n._id),
    );

    // Jika ada notifikasi baru, tampilkan toast
    if (unreadNotifications.length > 0) {
      unreadNotifications.forEach((notification) => {
        seenIds.current.add(notification._id);

        const { icon, color } = getNotificationIcon(notification.type);

        // Tampilkan toast dengan styling neumorphic
        toast({
          title: (
            <div className="flex items-center gap-2">
              <div className={`${color} neumorphic-button-sm p-1 rounded-full`}>
                {icon}
              </div>
              <span className="text-[#1D1D1F] font-semibold">
                Notifikasi Baru
              </span>
            </div>
          ),
          description: (
            <div className="text-[#1D1D1F] text-sm mt-1">
              {notification.message}
            </div>
          ),
          className: "neumorphic-card border-0 shadow-none bg-[#F5F5F7]",
        });

        // Tandai sebagai sudah dibaca setelah 3 detik
        setTimeout(() => {
          markRead({ notificationId: notification._id });
        }, 3000);
      });
    }

    // Update counter untuk deteksi notifikasi baru
    setLastNotificationCount(notifications.length);
  }, [notifications, markRead]);

  // Efek untuk menampilkan animasi atau suara ketika ada notifikasi baru
  useEffect(() => {
    if (
      notifications &&
      notifications.length > lastNotificationCount &&
      lastNotificationCount > 0
    ) {
      // Bisa ditambahkan efek suara atau animasi di sini
      console.log("🔔 Notifikasi baru diterima!");
    }
  }, [notifications, lastNotificationCount]);

  return null;
}
