import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

export default function Help() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createSuggestion = useMutation(api.marketplace.createSuggestion);
  const { toast } = useToast();

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.type || !formData.subject || !formData.message) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    setIsSubmitting(true);
    try {
      await createSuggestion({
        name: formData.name,
        email: formData.email,
        type: formData.type,
        subject: formData.subject,
        message: formData.message,
      });
      toast({ title: "Berhasil!", description: "Pesan Anda telah dikirim." });
      setFormData({ name: "", email: "", type: "", subject: "", message: "" });
    } catch (_) {
      toast({ title: "Error", description: "Gagal mengirim pesan", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold text-[#1D1D1F]">Pusat Bantuan</h1>
            <p className="text-[#86868B]">Kirim pertanyaan atau saran melalui formulir di bawah ini.</p>
          </div>
          <Card className="neumorphic-card border-0">
            <CardHeader>
              <CardTitle className="text-[#1D1D1F]">Hubungi Kami</CardTitle>
              <CardDescription>Kami akan merespons secepatnya</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">Nama *</label>
                    <Input
                      value={formData.name}
                      onChange={(e) => handleChange("name", e.target.value)}
                      className="neumorphic-input"
                      placeholder="Nama lengkap"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">Email *</label>
                    <Input
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className="neumorphic-input"
                      placeholder="email@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">Jenis Pesan *</label>
                  <Select value={formData.type} onValueChange={(v) => handleChange("type", v)}>
                    <SelectTrigger className="neumorphic-input">
                      <SelectValue placeholder="Pilih jenis pesan" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="suggestion">Saran</SelectItem>
                      <SelectItem value="bug_report">Laporan Bug</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">Subjek *</label>
                  <Input
                    value={formData.subject}
                    onChange={(e) => handleChange("subject", e.target.value)}
                    className="neumorphic-input"
                    placeholder="Subjek pesan"
                    required
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">Pesan *</label>
                  <Textarea
                    value={formData.message}
                    onChange={(e) => handleChange("message", e.target.value)}
                    className="neumorphic-input min-h-[120px]"
                    placeholder="Tulis pesan Anda..."
                    required
                  />
                </div>
                <Button type="submit" disabled={isSubmitting} className="neumorphic-button w-full">
                  {isSubmitting ? "Mengirim..." : "Kirim"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
