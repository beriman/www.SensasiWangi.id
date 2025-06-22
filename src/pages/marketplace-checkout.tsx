import { useState } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUser } from "@clerk/clerk-react";
import { useNavigate, useSearchParams } from "react-router-dom";

const SHIPPING_METHODS = [
  "JNE",
  "J&T Express",
  "SiCepat",
  "Pos Indonesia",
  "Anteraja",
  "Ninja Express",
];

export default function MarketplaceCheckout() {
  const { user } = useUser();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const productId = params.get("productId");

  const product = useQuery(
    api.marketplace.getProductById,
    productId ? { productId: productId as any } : "skip",
  );

  const createOrder = useMutation(api.marketplace.createOrder);
  const generateUploadUrl = useMutation(api.marketplace.generateUploadUrl);
  const uploadPaymentProof = useMutation(api.marketplace.uploadPaymentProof);

  const [orderId, setOrderId] = useState<string | null>(null);
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
  });
  const [shippingMethod, setShippingMethod] = useState("");
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (productId && product === undefined) return <div>Loading...</div>;
  if (!productId || product === null) return <div>Produk tidak ditemukan</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Anda harus login");
      return;
    }
    setIsSubmitting(true);
    try {
      const id = await createOrder({
        productId: productId as any,
        shippingAddress,
        origin: shippingAddress.city,
        destination: shippingAddress.city,
        shippingMethod,
        shippingCost: 0,
        paymentMethod: "transfer",
        notes: notes.trim() || undefined,
      });
      setOrderId(id as any);
    } catch (err: any) {
      alert(err.message || "Gagal membuat order");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !orderId) return;
    try {
      const url = await generateUploadUrl();
      const res = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      const { storageId } = await res.json();
      await uploadPaymentProof({ orderId: orderId as any, storageId });
      alert("Bukti pembayaran berhasil diupload");
      navigate("/dashboard");
    } catch (err: any) {
      alert(err.message || "Gagal upload bukti");
    }
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        {!orderId ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#718096]">Nama Lengkap</Label>
                <Input
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress((p) => ({ ...p, name: e.target.value }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#718096]">No. Telepon</Label>
                <Input
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-[#718096]">Alamat Lengkap</Label>
              <Textarea
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress((p) => ({ ...p, address: e.target.value }))
                }
                className="neumorphic-input border-0 mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-[#718096]">Kota</Label>
                <Input
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((p) => ({ ...p, city: e.target.value }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#718096]">Kode Pos</Label>
                <Input
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress((p) => ({
                      ...p,
                      postalCode: e.target.value,
                    }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
              <div>
                <Label className="text-sm text-[#718096]">Provinsi</Label>
                <Input
                  value={shippingAddress.province}
                  onChange={(e) =>
                    setShippingAddress((p) => ({
                      ...p,
                      province: e.target.value,
                    }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
            </div>
            <div>
              <Label className="text-[#2d3748] font-medium mb-2 block">
                Metode Pengiriman
              </Label>
              <Select value={shippingMethod} onValueChange={setShippingMethod}>
                <SelectTrigger className="neumorphic-input border-0">
                  <SelectValue placeholder="Pilih kurir" />
                </SelectTrigger>
                <SelectContent className="neumorphic-card border-0">
                  {SHIPPING_METHODS.map((m) => (
                    <SelectItem key={m} value={m}>
                      {m}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-[#2d3748] font-medium mb-2 block">
                Catatan (Opsional)
              </Label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                className="neumorphic-input border-0"
              />
            </div>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Buat Order"}
            </Button>
          </form>
        ) : (
          <div className="space-y-4 max-w-lg">
            <p>
              Order berhasil dibuat. Silakan transfer total pembayaran ke nomor
              virtual account berikut dan unggah bukti transfer Anda.
            </p>
            <Input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />
            <Button onClick={handleUpload} disabled={!file}>
              Upload Bukti Pembayaran
            </Button>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
