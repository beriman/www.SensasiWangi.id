import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";
import { useState } from "react";

export default function Settings() {
  return (
    <ProtectedRoute>
      <SettingsContent />
    </ProtectedRoute>
  );
}

function SettingsContent() {
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip"
  );
  const updateProfile = useMutation(api.users.updateUserProfile);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");

  if (!currentUser) return null;

  const handleSave = async () => {
    await updateProfile({ instagram, twitter, website });
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-4">
        <h1 className="text-2xl font-bold">Pengaturan Privasi & Sosial</h1>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Instagram</label>
          <Input value={instagram} onChange={(e) => setInstagram(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Twitter</label>
          <Input value={twitter} onChange={(e) => setTwitter(e.target.value)} />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium">Website</label>
          <Input value={website} onChange={(e) => setWebsite(e.target.value)} />
        </div>
        <Button onClick={handleSave}>Simpan</Button>
      </main>
      <Footer />
    </div>
  );
}
