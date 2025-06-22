import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/clerk-react";
import { Calendar, Users } from "lucide-react";

const SHIPPING_METHODS = [
  "JNE",
  "J&T Express",
  "SiCepat",
  "Pos Indonesia",
  "Anteraja",
  "Ninja Express",
];

function EnrollDialog({ product }: { product: any }) {
  const { user } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const [portionsRequested, setPortionsRequested] = useState(1);
  const [shippingMethod, setShippingMethod] = useState("");
  const [shippingAddress, setShippingAddress] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    province: "",
  });
  const [origin, setOrigin] = useState("");
  const [destination, setDestination] = useState("");
  const [shippingCost, setShippingCost] = useState(0);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enrollSambat = useMutation(api.marketplace.enrollSambat);
  const calculateCost = useAction(api.marketplace.calculateShippingCost);
  const hasEnrolled = useQuery(
    api.marketplace.hasUserEnrolledSambat,
    user ? { sambatProductId: product._id, userId: user.id as any } : "skip",
  );

  useEffect(() => {
    const loadCost = async () => {
      if (!origin || !destination || !shippingMethod) return;
      try {
        const cost = await calculateCost({
          origin,
          destination,
          courier: shippingMethod,
        });
        setShippingCost(cost);
      } catch (err) {
        console.error(err);
      }
    };
    loadCost();
  }, [origin, destination, shippingMethod]);

  const handleSubmit = async () => {
    if (
      !user ||
      !shippingMethod ||
      !origin ||
      !destination ||
      !shippingAddress.name.trim()
    )
      return;

    setIsSubmitting(true);
    try {
      await enrollSambat({
        sambatProductId: product._id,
        portionsRequested,
        shippingAddress,
        origin,
        destination,
        shippingMethod,
        shippingCost,
        notes: notes.trim() || undefined,
      });
      setIsOpen(false);
      alert("Berhasil mendaftar sambatan! Silakan lakukan pembayaran.");
    } catch (error: any) {
      alert(error.message || "Terjadi kesalahan");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const totalPrice = portionsRequested * product.pricePerPortion + shippingCost;
  const maxPortions = Math.min(
    5,
    product.maxParticipants - product.currentParticipants,
  ); // Max 5 porsi per user

  if (hasEnrolled) {
    return (
      <Button
        disabled
        className="neumorphic-button-sm text-[#718096] bg-transparent border-0"
      >
        <Users className="h-4 w-4 mr-2" />
        Sudah Terdaftar
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          disabled={product.status !== "active" || maxPortions <= 0}
          className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
        >
          <Users className="h-4 w-4 mr-2" />
          Ikut Sambatan
        </Button>
      </DialogTrigger>
      <DialogContent className="neumorphic-card border-0 max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-[#2d3748]">
            Ikut Sambatan: {product.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Product Info */}
          <div className="neumorphic-card-inset p-4">
            <div className="flex items-center gap-4">
              <img
                src={
                  product.images[0] ||
                  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=100&q=80"
                }
                alt={product.title}
                className="w-16 h-16 object-cover rounded-2xl"
              />
              <div className="flex-1">
                <h4 className="font-semibold text-[#2d3748]">
                  {product.title}
                </h4>
                <p className="text-sm text-[#718096]">{product.brand}</p>
                <p className="text-sm text-[#667eea] font-medium">
                  {formatPrice(product.pricePerPortion)} per{" "}
                  {product.portionSize}
                </p>
              </div>
            </div>
          </div>

          {/* Portions */}
          <div>
            <Label className="text-[#2d3748] font-medium mb-2 block">
              Jumlah Porsi (Max {maxPortions})
            </Label>
            <Select
              value={portionsRequested.toString()}
              onValueChange={(value) => setPortionsRequested(parseInt(value))}
            >
              <SelectTrigger className="neumorphic-input border-0">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="neumorphic-card border-0">
                {Array.from({ length: maxPortions }, (_, i) => i + 1).map(
                  (num) => (
                    <SelectItem key={num} value={num.toString()}>
                      {num} porsi - {formatPrice(num * product.pricePerPortion)}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>

          {/* Shipping Address */}
          <div className="space-y-4">
            <Label className="text-[#2d3748] font-medium">
              Alamat Pengiriman
            </Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-[#718096]">Nama Lengkap</Label>
                <Input
                  value={shippingAddress.name}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  className="neumorphic-input border-0 mt-1"
                  placeholder="Nama penerima"
                />
              </div>
              <div>
                <Label className="text-sm text-[#718096]">No. Telepon</Label>
                <Input
                  value={shippingAddress.phone}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      phone: e.target.value,
                    }))
                  }
                  className="neumorphic-input border-0 mt-1"
                  placeholder="08xxxxxxxxxx"
                />
              </div>
            </div>
            <div>
              <Label className="text-sm text-[#718096]">Alamat Lengkap</Label>
              <Textarea
                value={shippingAddress.address}
                onChange={(e) =>
                  setShippingAddress((prev) => ({
                    ...prev,
                    address: e.target.value,
                  }))
                }
                className="neumorphic-input border-0 mt-1"
                placeholder="Jalan, RT/RW, Kelurahan"
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label className="text-sm text-[#718096]">Kota</Label>
                <Input
                  value={shippingAddress.city}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      city: e.target.value,
                    }))
                  }
                  className="neumorphic-input border-0 mt-1"
                  placeholder="Kota"
                />
              </div>
              <div>
                <Label className="text-sm text-[#718096]">Kode Pos</Label>
                <Input
                  value={shippingAddress.postalCode}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      postalCode: e.target.value,
                    }))
                  }
                  className="neumorphic-input border-0 mt-1"
                  placeholder="12345"
                />
              </div>
              <div>
                <Label className="text-sm text-[#718096]">Provinsi</Label>
                <Input
                  value={shippingAddress.province}
                  onChange={(e) =>
                    setShippingAddress((prev) => ({
                      ...prev,
                      province: e.target.value,
                    }))
                  }
                  className="neumorphic-input border-0 mt-1"
                  placeholder="Provinsi"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
              <div>
                <Label className="text-sm text-[#718096]">Asal</Label>
                <Input
                  value={origin}
                  onChange={(e) => setOrigin(e.target.value)}
                  className="neumorphic-input border-0 mt-1"
                  placeholder="Kota asal"
                />
              </div>
              <div>
                <Label className="text-sm text-[#718096]">Tujuan</Label>
                <Input
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  className="neumorphic-input border-0 mt-1"
                  placeholder="Kota tujuan"
                />
              </div>
            </div>
          </div>

          {/* Shipping Method */}
          <div>
            <Label className="text-[#2d3748] font-medium mb-2 block">
              Metode Pengiriman
            </Label>
            <Select value={shippingMethod} onValueChange={setShippingMethod}>
              <SelectTrigger className="neumorphic-input border-0">
                <SelectValue placeholder="Pilih kurir" />
              </SelectTrigger>
              <SelectContent className="neumorphic-card border-0">
                {SHIPPING_METHODS.map((method) => (
                  <SelectItem key={method} value={method}>
                    {method}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div>
            <Label className="text-[#2d3748] font-medium mb-2 block">
              Catatan (Opsional)
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="neumorphic-input border-0"
              placeholder="Catatan untuk penjual..."
            />
          </div>

          {/* Total */}
          <div className="neumorphic-card-inset p-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal ({portionsRequested} porsi)</span>
                <span>
                  {formatPrice(portionsRequested * product.pricePerPortion)}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Ongkir</span>
                <span>{formatPrice(shippingCost)}</span>
              </div>
              <div className="flex justify-between font-semibold text-[#2d3748] pt-2 border-t border-[#e2e8f0]">
                <span>Total</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 neumorphic-button-sm text-[#718096] bg-transparent border-0"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={
                isSubmitting || !shippingMethod || !shippingAddress.name.trim()
              }
              className="flex-1 neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
            >
              {isSubmitting ? "Memproses..." : "Daftar & Bayar"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function MarketplaceSambatDetail() {
  const { id } = useParams();
  const product = useQuery(
    api.marketplace.getSambatProductById,
    id ? { sambatProductId: id as any } : "skip",
  );
  const enrollments = useQuery(
    api.marketplace.getSambatEnrollments,
    id ? { sambatProductId: id as any } : "skip",
  );

  if (product === undefined) return <div>Loading...</div>;
  if (product === null) return <div>Produk tidak ditemukan</div>;

  const progressPercentage =
    (product.currentParticipants / product.maxParticipants) * 100;

  const getTimeLeft = (deadline: number) => {
    const now = Date.now();
    const timeLeft = deadline - now;
    if (timeLeft <= 0) return "Berakhir";
    const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
    const hours = Math.floor(
      (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60),
    );
    if (days > 0) return `${days} hari lagi`;
    return `${hours} jam lagi`;
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <img
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80"
            }
            alt={product.title}
            className="w-full rounded-3xl object-cover"
          />
          <div className="space-y-4">
            <h1 className="text-3xl font-bold text-[#2d3748]">
              {product.title}
            </h1>
            <p className="text-[#718096]">{product.brand}</p>
            <div className="space-y-2">
              <Progress value={progressPercentage} className="h-2" />
              <p className="text-sm">
                {product.currentParticipants}/{product.maxParticipants} porsi
              </p>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#718096]">
              <Calendar className="h-4 w-4" />
              <span>{getTimeLeft(product.deadline)}</span>
            </div>
            <EnrollDialog product={product} />
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">Deskripsi</h2>
          <p className="text-[#2d3748] whitespace-pre-line">
            {product.description}
          </p>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-2">
            Peserta ({enrollments?.length || 0})
          </h2>
          <ul className="space-y-2">
            {enrollments?.map((e: any) => (
              <li
                key={e._id}
                className="neumorphic-card p-4 border-0 flex justify-between"
              >
                <span>{e.userName}</span>
                <span>{e.portionsRequested} porsi</span>
              </li>
            ))}
          </ul>
        </div>
      </main>
      <Footer />
    </div>
  );
}
