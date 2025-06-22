import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { useEffect, useState } from "react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function PrivacySettings() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const privacy = useQuery(
    api.users.getPrivacySettings,
    userData ? { userId: userData._id } : "skip",
  );

  const updatePrivacy = useMutation(api.users.updatePrivacySettings);

  const [profileVisibility, setProfileVisibility] = useState("public");
  const [activityVisibility, setActivityVisibility] = useState("public");
  const [commentsVisibility, setCommentsVisibility] = useState("public");

  useEffect(() => {
    if (privacy) {
      setProfileVisibility(privacy.profileVisibility);
      setActivityVisibility(privacy.activityVisibility);
      setCommentsVisibility(privacy.commentsVisibility);
    }
  }, [privacy]);

  const handleSave = async () => {
    if (!userData) return;
    await updatePrivacy({
      userId: userData._id,
      profileVisibility,
      activityVisibility,
      commentsVisibility,
    });
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <Card className="neumorphic-card border-0 max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-[#1D1D1F]">
                Pengaturan Privasi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Visibilitas Profil
                </label>
                <Select
                  value={profileVisibility}
                  onValueChange={setProfileVisibility}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih visibilitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Publik</SelectItem>
                    <SelectItem value="followers">Pengikut</SelectItem>
                    <SelectItem value="private">Privat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Siapa yang dapat melihat aktivitas Anda
                </label>
                <Select
                  value={activityVisibility}
                  onValueChange={setActivityVisibility}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih visibilitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Publik</SelectItem>
                    <SelectItem value="followers">Pengikut</SelectItem>
                    <SelectItem value="private">Privat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Siapa yang dapat melihat komentar Anda
                </label>
                <Select
                  value={commentsVisibility}
                  onValueChange={setCommentsVisibility}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Pilih visibilitas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Publik</SelectItem>
                    <SelectItem value="followers">Pengikut</SelectItem>
                    <SelectItem value="private">Privat</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={handleSave}
                className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none"
              >
                Simpan
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
