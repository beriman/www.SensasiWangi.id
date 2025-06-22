import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { useNavigate } from "react-router-dom";

export default function DatabaseContribute() {
  const [type, setType] = useState("brand");
  const [fields, setFields] = useState<Record<string, string>>({});
  const [targetId, setTargetId] = useState("");
  const { toast } = useToast();
  const navigate = useNavigate();
  const createContribution = useMutation(api.marketplace.createContribution);

  const handleField = (key: string, value: string) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createContribution({
        type,
        data: fields,
        targetId: targetId || undefined,
      } as any);
      toast({ title: "Kontribusi terkirim" });
      navigate("/database");
    } catch (err) {
      toast({ title: "Gagal mengirim", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-4xl font-bold text-[#2d3748] mb-8 text-center">Kontribusi Database</h1>
          <Card className="neumorphic-card border-0">
            <CardHeader>
              <CardTitle>Form Kontribusi</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Jenis Data</label>
                  <Select value={type} onValueChange={(v) => { setType(v); setFields({}); }}>
                    <SelectTrigger className="neumorphic-input mt-1">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="neumorphic-card border-0">
                      <SelectItem value="brand">Brand</SelectItem>
                      <SelectItem value="perfumer">Perfumer</SelectItem>
                      <SelectItem value="fragrance">Parfum</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">ID Data (opsional untuk update)</label>
                  <Input value={targetId} onChange={(e) => setTargetId(e.target.value)} className="neumorphic-input mt-1" />
                </div>
                {type === "brand" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Nama Brand</label>
                      <Input className="neumorphic-input mt-1" value={fields.name || ""} onChange={(e) => handleField("name", e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Deskripsi</label>
                      <Textarea className="neumorphic-input mt-1" value={fields.description || ""} onChange={(e) => handleField("description", e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Kategori</label>
                      <Input className="neumorphic-input mt-1" value={fields.category || ""} onChange={(e) => handleField("category", e.target.value)} />
                    </div>
                  </>
                )}
                {type === "perfumer" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Nama Perfumer</label>
                      <Input className="neumorphic-input mt-1" value={fields.name || ""} onChange={(e) => handleField("name", e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Bio Singkat</label>
                      <Textarea className="neumorphic-input mt-1" value={fields.bio || ""} onChange={(e) => handleField("bio", e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Pengalaman</label>
                      <Input className="neumorphic-input mt-1" value={fields.experience || ""} onChange={(e) => handleField("experience", e.target.value)} />
                    </div>
                  </>
                )}
                {type === "fragrance" && (
                  <>
                    <div>
                      <label className="text-sm font-medium">Nama Parfum</label>
                      <Input className="neumorphic-input mt-1" value={fields.name || ""} onChange={(e) => handleField("name", e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Brand</label>
                      <Input className="neumorphic-input mt-1" value={fields.brandName || ""} onChange={(e) => handleField("brandName", e.target.value)} required />
                    </div>
                    <div>
                      <label className="text-sm font-medium">Deskripsi</label>
                      <Textarea className="neumorphic-input mt-1" value={fields.description || ""} onChange={(e) => handleField("description", e.target.value)} required />
                    </div>
                  </>
                )}
                <div className="pt-2">
                  <Button type="submit" className="neumorphic-button">Kirim</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
