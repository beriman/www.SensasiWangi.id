import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

const BRAND_CATEGORIES = ["Local", "Artisan", "Commercial", "Niche"];
const EXPERIENCE_LEVELS = ["Beginner", "Intermediate", "Expert", "Master"];
const FRAGRANCE_CATEGORIES = [
  "Citrus",
  "Floral",
  "Woody",
  "Oriental",
  "Fresh",
  "Gourmand",
];
const CONCENTRATIONS = ["EDT", "EDP", "Parfum", "Cologne"];
const GENDERS = ["Unisex", "Men", "Women"];

export default function DatabaseContribute() {
  const { user } = useUser();
  const navigate = useNavigate();
  const submitContribution = useMutation(
    api.marketplace.submitDatabaseContribution,
  );

  const [type, setType] = useState("brand");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<any>({});

  const handleChange = (field: string, value: any) => {
    setFormData((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await submitContribution({ type, data: { ...formData, user: user?.id } });
      alert("Kontribusi berhasil dikirim dan menunggu moderasi.");
      navigate("/database");
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan, silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <h1 className="text-3xl font-bold text-center text-[#1D1D1F]">
              Kontribusi Database
            </h1>
            <form onSubmit={handleSubmit} className="space-y-6">
              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle>Pilih Jenis Data</CardTitle>
                </CardHeader>
                <CardContent>
                  <Select
                    value={type}
                    onValueChange={(v) => {
                      setType(v);
                      setFormData({});
                    }}
                  >
                    <SelectTrigger className="w-full neumorphic-input">
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="perfumer">Perfumer</SelectItem>
                      <SelectItem value="fragrance">Parfum</SelectItem>
                    </SelectContent>
                  </Select>
                </CardContent>
              </Card>

              {type === "brand" && (
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle>Informasi Brand</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Nama Brand"
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Textarea
                      placeholder="Deskripsi"
                      value={formData.description || ""}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Input
                      placeholder="Website"
                      value={formData.website || ""}
                      onChange={(e) => handleChange("website", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Input
                      placeholder="Kota"
                      value={formData.city || ""}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Input
                      placeholder="Tahun Berdiri"
                      value={formData.foundedYear || ""}
                      onChange={(e) => handleChange("foundedYear", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Select
                      value={formData.category || ""}
                      onValueChange={(v) => handleChange("category", v)}
                    >
                      <SelectTrigger className="neumorphic-input">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {BRAND_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}

              {type === "perfumer" && (
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle>Informasi Perfumer</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Nama"
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Textarea
                      placeholder="Bio"
                      value={formData.bio || ""}
                      onChange={(e) => handleChange("bio", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Input
                      placeholder="Kota"
                      value={formData.city || ""}
                      onChange={(e) => handleChange("city", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Select
                      value={formData.experience || ""}
                      onValueChange={(v) => handleChange("experience", v)}
                    >
                      <SelectTrigger className="neumorphic-input">
                        <SelectValue placeholder="Tingkat Pengalaman" />
                      </SelectTrigger>
                      <SelectContent>
                        {EXPERIENCE_LEVELS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      placeholder="Spesialisasi (pisahkan dengan koma)"
                      value={formData.specialties || ""}
                      onChange={(e) => handleChange("specialties", e.target.value)}
                      className="neumorphic-input"
                    />
                  </CardContent>
                </Card>
              )}

              {type === "fragrance" && (
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle>Informasi Parfum</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Input
                      placeholder="Nama Parfum"
                      value={formData.name || ""}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Input
                      placeholder="Nama Brand"
                      value={formData.brandName || ""}
                      onChange={(e) => handleChange("brandName", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Textarea
                      placeholder="Deskripsi"
                      value={formData.description || ""}
                      onChange={(e) => handleChange("description", e.target.value)}
                      className="neumorphic-input"
                    />
                    <Select
                      value={formData.category || ""}
                      onValueChange={(v) => handleChange("category", v)}
                    >
                      <SelectTrigger className="neumorphic-input">
                        <SelectValue placeholder="Kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {FRAGRANCE_CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.concentration || ""}
                      onValueChange={(v) => handleChange("concentration", v)}
                    >
                      <SelectTrigger className="neumorphic-input">
                        <SelectValue placeholder="Konsentrasi" />
                      </SelectTrigger>
                      <SelectContent>
                        {CONCENTRATIONS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select
                      value={formData.gender || ""}
                      onValueChange={(v) => handleChange("gender", v)}
                    >
                      <SelectTrigger className="neumorphic-input">
                        <SelectValue placeholder="Gender" />
                      </SelectTrigger>
                      <SelectContent>
                        {GENDERS.map((c) => (
                          <SelectItem key={c} value={c}>
                            {c}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </CardContent>
                </Card>
              )}

              <div className="text-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="neumorphic-button h-12 px-8 bg-transparent border-0 shadow-none text-[#2d3748]"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim Kontribusi"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
