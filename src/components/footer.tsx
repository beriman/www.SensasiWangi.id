import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MessageSquare, Bug, Send, CheckCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export function Footer() {
  const [showFeedbackForm, setShowFeedbackForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    type: "",
    subject: "",
    message: "",
  });

  const createSuggestion = useMutation(api.marketplace.createSuggestion);
  const { toast } = useToast();

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.type ||
      !formData.subject ||
      !formData.message
    ) {
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

      setIsSubmitted(true);
      toast({
        title: "Berhasil!",
        description:
          "Terima kasih atas masukan Anda. Kami akan meninjau dan merespons segera.",
      });

      // Reset form after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
        setShowFeedbackForm(false);
        setFormData({
          name: "",
          email: "",
          type: "",
          subject: "",
          message: "",
        });
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description:
          "Terjadi kesalahan saat mengirim masukan. Silakan coba lagi.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="w-full neumorphic-card mx-4 mb-4 rounded-3xl border-0">
      <div className="container mx-auto px-4 py-16">
        {/* Feedback Form */}
        {showFeedbackForm && (
          <div className="mb-12">
            <Card className="neumorphic-card border-0 max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  {isSubmitted ? (
                    <>
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      Terima Kasih!
                    </>
                  ) : (
                    <>
                      <MessageSquare className="w-5 h-5" />
                      Berikan Masukan Anda
                    </>
                  )}
                </CardTitle>
                <CardDescription className="text-[#86868B]">
                  {isSubmitted
                    ? "Masukan Anda telah diterima dan akan segera kami tinjau."
                    : "Bantu kami meningkatkan platform dengan memberikan saran atau melaporkan bug."}
                </CardDescription>
              </CardHeader>
              {!isSubmitted && (
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">
                          Nama *
                        </label>
                        <Input
                          value={formData.name}
                          onChange={(e) =>
                            handleInputChange("name", e.target.value)
                          }
                          placeholder="Nama lengkap Anda"
                          className="neumorphic-input"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">
                          Email *
                        </label>
                        <Input
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            handleInputChange("email", e.target.value)
                          }
                          placeholder="email@example.com"
                          className="neumorphic-input"
                          required
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">
                        Jenis Masukan *
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) =>
                          handleInputChange("type", value)
                        }
                      >
                        <SelectTrigger className="neumorphic-input">
                          <SelectValue placeholder="Pilih jenis masukan" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="suggestion">
                            <div className="flex items-center gap-2">
                              <MessageSquare className="w-4 h-4" />
                              Saran Perbaikan
                            </div>
                          </SelectItem>
                          <SelectItem value="bug_report">
                            <div className="flex items-center gap-2">
                              <Bug className="w-4 h-4" />
                              Laporan Bug
                            </div>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">
                        Subjek *
                      </label>
                      <Input
                        value={formData.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                        placeholder="Ringkasan singkat masukan Anda"
                        className="neumorphic-input"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-sm font-medium text-[#1D1D1F] mb-2 block">
                        Pesan *
                      </label>
                      <Textarea
                        value={formData.message}
                        onChange={(e) =>
                          handleInputChange("message", e.target.value)
                        }
                        placeholder="Jelaskan masukan Anda secara detail..."
                        className="neumorphic-input min-h-[120px]"
                        required
                      />
                    </div>

                    <div className="flex gap-3 pt-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="neumorphic-button flex-1"
                      >
                        {isSubmitting ? (
                          "Mengirim..."
                        ) : (
                          <>
                            <Send className="w-4 h-4 mr-2" />
                            Kirim Masukan
                          </>
                        )}
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setShowFeedbackForm(false)}
                        className="neumorphic-button-outline"
                      >
                        Batal
                      </Button>
                    </div>
                  </form>
                </CardContent>
              )}
            </Card>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="space-y-4">
            <h3 className="text-base font-semibold text-[#1D1D1F]">
              Parfum Enthusiast Forum
            </h3>
            <p className="text-base text-[#86868B] leading-relaxed">
              Komunitas pecinta parfum Indonesia untuk berbagi pengalaman,
              review, dan pengetahuan.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => setShowFeedbackForm(!showFeedbackForm)}
                className="neumorphic-button-sm text-sm"
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                {showFeedbackForm ? "Tutup Form" : "Berikan Masukan"}
              </Button>
            </div>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">
              Fitur Utama
            </h4>
            <ul className="space-y-3">
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                Forum Diskusi
              </li>
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                Marketplace
              </li>
              <li className="text-base text-[#86868B] hover:text-[#1D1D1F] transition-colors">
                Sambat Parfum
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Bantuan</h4>
            <ul className="space-y-3">
              <li>
                <button
                  onClick={() => setShowFeedbackForm(true)}
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors text-left"
                >
                  Saran & Masukan
                </button>
              </li>
              <li>
                <button
                  onClick={() => {
                    setFormData((prev) => ({ ...prev, type: "bug_report" }));
                    setShowFeedbackForm(true);
                  }}
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors text-left"
                >
                  Laporkan Bug
                </button>
              </li>
              <li>
                <a
                  href="mailto:support@parfumforum.id"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Kontak Support
                </a>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-base font-semibold text-[#1D1D1F]">Legal</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="/privacy"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Kebijakan Privasi
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="text-base text-[#86868B] hover:text-[#0066CC] transition-colors"
                >
                  Syarat & Ketentuan
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="mt-16 pt-8 border-t border-neutral-200/50">
          <p className="text-center text-sm text-[#86868B]">
            © {new Date().getFullYear()} Parfum Enthusiast Forum. Semua hak
            dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
