import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";

export default function Messages() {
  return (
    <ProtectedRoute>
      <MessagesContent />
    </ProtectedRoute>
  );
}

function MessagesContent() {
  const { user } = useUser();
  const [params] = useSearchParams();
  const otherUserId = params.get("user");
  const [content, setContent] = useState("");

  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const messages = useQuery(
    api.messages.listMessages,
    currentUser && otherUserId ? { otherUserId: otherUserId as any } : "skip",
  );

  const sendMessage = useMutation(api.messages.sendMessage);

  if (currentUser === undefined || messages === undefined) {
    return <div>Loading...</div>;
  }

  if (!otherUserId) {
    return <div>Pilih pengguna untuk memulai percakapan.</div>;
  }

  const handleSend = async () => {
    if (!content.trim()) return;
    await sendMessage({ recipientId: otherUserId as any, content });
    setContent("");
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-8 space-y-4">
        <div className="h-96 overflow-y-auto space-y-2 border rounded p-2">
          {messages &&
            messages.map((m) => (
              <div
                key={m._id}
                className={
                  m.senderId === currentUser._id ? "text-right" : "text-left"
                }
              >
                <span className="inline-block bg-gray-200 rounded px-2 py-1">
                  {m.content}
                </span>
              </div>
            ))}
        </div>
        <div className="flex gap-2">
          <Input
            placeholder="Tulis pesan..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Button onClick={handleSend}>Kirim</Button>
        </div>
      </main>
    </div>
  );
}
