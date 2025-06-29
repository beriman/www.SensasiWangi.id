import { useState, useEffect } from "react";
import { useMutation, useQuery, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
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
import QRCode from "react-qr-code";

const SHIPPING_METHODS = [
  "JNE",
  "J&T Express",
  "SiCepat",
  "Pos Indonesia",
  "Anteraja",
  "Ninja Express",
];

const PAYMENT_METHODS = [
  { value: "transfer", label: "Transfer Bank (BRI VA)" },
  { value: "qris", label: "QRIS" },
];

type CartItem = { id: string; title: string; price: number };

export default function MarketplaceCheckout() {
  const { user } = useUser();
  const [params] = useSearchParams();
  const navigate = useNavigate();
  const productId = params.get("productId");

  const product = useQuery(
    api.marketplace.getProductById,
    productId ? { productId: productId as any } : "skip",
  );

  const [cart, setCart] = useState<CartItem[]>([]);
  const calculateCost = useAction(api.marketplace.calculateShippingCost);

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
  const [paymentMethod, setPaymentMethod] = useState("transfer");
  const [qrString, setQrString] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shippingCost, setShippingCost] = useState(0);
  const order = useQuery(
    api.marketplace.getOrderById,
    orderId ? { orderId: orderId as any } : "skip",
  );

  useEffect(() => {
    if (productId) {
      if (product) {
        setCart([{ id: product._id, title: product.title, price: product.price }]);
      }
    } else {
      const stored = localStorage.getItem("marketplaceCart");
      if (stored) setCart(JSON.parse(stored));
    }
  }, [productId, product]);

  useEffect(() => {
    const loadCost = async () => {
      if (!shippingMethod || !shippingAddress.city || cart.length === 0) return;
      try {
        const cost = await calculateCost({
          origin: shippingAddress.city,
          destination: shippingAddress.city,
          courier: shippingMethod,
          weight: cart.length * 1000,
        });
        setShippingCost(cost);
      } catch (err) {
        console.error(err);
      }
    };
    loadCost();
  }, [shippingMethod, shippingAddress.city, cart]);

  useEffect(() => {
    if (order && order.orderStatus === "cancelled") {
      navigate("/dashboard");
    }
  }, [order, navigate]);

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const subtotal = cart.reduce((s, i) => s + i.price, 0);
  const totalAmount = subtotal + shippingCost;

  if (productId && product === undefined) return <div>Loading...</div>;
  if (productId && product === null) return <div>Produk tidak ditemukan</div>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      alert("Anda harus login");
      return;
    }
    setIsSubmitting(true);
    try {
      const ids = [] as string[];
      for (const item of cart) {
        const res = await createOrder({
          productId: item.id as any,
          shippingAddress,
          origin: shippingAddress.city,
          destination: shippingAddress.city,
          shippingMethod,
          shippingCost,
          paymentMethod,
          notes: notes.trim() || undefined,
        });
        ids.push(res.orderId as any);
        if (paymentMethod === "qris") setQrString(res.qrString || "");
      }
      setOrderId(ids[0] as any);
      localStorage.removeItem("marketplaceCart");
      setCart([]);
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
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
        {!orderId ? (
          <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
            <div className="space-y-2">
              {cart.map((item) => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span>{item.title}</span>
                  <span>{formatPrice(item.price)}</span>
                </div>
              ))}
              <div className="flex justify-between text-sm">
                <span>Ongkir</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold border-t pt-2">
                <span>Total</span>
                <span>{formatPrice(totalAmount)}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name" className="text-sm text-[#718096]">
                  Nama Lengkap
                </Label>
                <Input
                  id="name"
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress((p) => ({ ...p, name: e.target.value }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm text-[#718096]">
                  No. Telepon
                </Label>
                <Input
                  id="phone"
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress((p) => ({ ...p, phone: e.target.value }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
            </div>
            <div>
              <Label htmlFor="address" className="text-sm text-[#718096]">
                Alamat Lengkap
              </Label>
              <Textarea
                id="address"
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress((p) => ({ ...p, address: e.target.value }))
                }
                className="neumorphic-input border-0 mt-1"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="city" className="text-sm text-[#718096]">
                  Kota
                </Label>
                <Input
                  id="city"
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((p) => ({ ...p, city: e.target.value }))
                  }
                  className="neumorphic-input border-0 mt-1"
                />
              </div>
              <div>
                <Label htmlFor="postalCode" className="text-sm text-[#718096]">
                  Kode Pos
                </Label>
                <Input
                  id="postalCode"
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
                <Label htmlFor="province" className="text-sm text-[#718096]">
                  Provinsi
                </Label>
                <Input
                  id="province"
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
                Metode Pembayaran
              </Label>
              <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                <SelectTrigger className="neumorphic-input border-0">
                  <SelectValue placeholder="Pilih metode" />
                </SelectTrigger>
                <SelectContent className="neumorphic-card border-0">
                  {PAYMENT_METHODS.map((m) => (
                    <SelectItem key={m.value} value={m.value}>
                      {m.label}
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
            {paymentMethod === "qris" && qrString ? (
              <div className="space-y-2">
                <p>Scan QR berikut untuk membayar:</p>
                <QRCode value={qrString} />
              </div>
            ) : (
              <p>
                Order berhasil dibuat. Silakan transfer total pembayaran ke
                nomor virtual account masing-masing order. Setelah membayar,
                unggah bukti pembayaran Anda.
              </p>
            )}
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
    </div>
  );
}
