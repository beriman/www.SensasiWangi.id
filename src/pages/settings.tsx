import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";
import { useEffect, useState } from "react";

export default function Settings() {
  return (
    <ProtectedRoute allowedRoles={["buyer", "seller", "admin"]}>
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
  const userSettings = useQuery(api.users.getUserSettings);
  const updateSettings = useMutation(api.users.updateUserSettings);
  const updateProfile = useMutation(api.users.updateUserProfile);
  const [instagram, setInstagram] = useState("");
  const [twitter, setTwitter] = useState("");
  const [website, setWebsite] = useState("");
  const [prefs, setPrefs] = useState({
    badge: true,
    like: true,
    comment: true,
    product: true,
    order: true,
  });

  useEffect(() => {
    if (userSettings) {
      setPrefs(userSettings.notificationPreferences);
    }
  }, [userSettings]);

  if (!currentUser) return null;

  const handleSave = async () => {
    await updateProfile({ instagram, twitter, website });
    await updateSettings({ notificationPreferences: prefs });
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
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
        <h2 className="text-xl font-bold mt-6">Preferensi Notifikasi</h2>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Switch
              id="badge-toggle"
              checked={prefs.badge}
              onCheckedChange={(v) => setPrefs({ ...prefs, badge: v })}
            />
            <Label htmlFor="badge-toggle" className="text-sm">
              Badge baru
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="like-toggle"
              checked={prefs.like}
              onCheckedChange={(v) => setPrefs({ ...prefs, like: v })}
            />
            <Label htmlFor="like-toggle" className="text-sm">
              Suka pada konten
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="comment-toggle"
              checked={prefs.comment}
              onCheckedChange={(v) => setPrefs({ ...prefs, comment: v })}
            />
            <Label htmlFor="comment-toggle" className="text-sm">
              Komentar baru
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="product-toggle"
              checked={prefs.product}
              onCheckedChange={(v) => setPrefs({ ...prefs, product: v })}
            />
            <Label htmlFor="product-toggle" className="text-sm">
              Update produk
            </Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch
              id="order-toggle"
              checked={prefs.order}
              onCheckedChange={(v) => setPrefs({ ...prefs, order: v })}
            />
            <Label htmlFor="order-toggle" className="text-sm">
              Status pesanan
            </Label>
          </div>
        </div>
        <Button onClick={handleSave}>Simpan</Button>
      </main>
    </div>
  );
}
