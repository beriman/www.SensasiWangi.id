import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
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
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import {
  Search,
  Filter,
  Heart,
  Eye,
  MapPin,
  Users,
  Clock,
  Plus,
  ShoppingCart,
  Calendar,
  Package,
  AlertCircle,
  CheckCircle,
  Timer,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const CATEGORIES = [
  "Parfum Pria",
  "Parfum Wanita",
  "Parfum Unisex",
  "Parfum Niche",
  "Parfum Designer",
  "Parfum Vintage",
  "Decant",
  "Atomizer",
  "Aksesoris",
];

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "deadline", label: "Deadline Terdekat" },
  { value: "popular", label: "Paling Dilihat" },
  { value: "liked", label: "Paling Disukai" },
];

const SHIPPING_METHODS = [
  "JNE",
  "J&T Express",
  "SiCepat",
  "Pos Indonesia",
  "Anteraja",
  "Ninja Express",
];

function SambatProductCard({ product }: { product: any }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const toggleLike = useMutation(api.marketplace.toggleSambatProductLike);
  const incrementViews = useMutation(
    api.marketplace.incrementSambatProductViews,
  );
  const hasLiked = useQuery(
    api.marketplace.hasUserLikedSambatProduct,
    user ? { sambatProductId: product._id, userId: user.id as any } : "skip",
  );

  const handleCardClick = () => {
    incrementViews({ sambatProductId: product._id });
    // Navigate to detail page (will be created later)
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleLike({ sambatProductId: product._id });
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

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

  const progressPercentage =
    (product.currentParticipants / product.maxParticipants) * 100;
  const isDeadlineSoon = product.deadline - Date.now() < 24 * 60 * 60 * 1000; // kurang dari 24 jam

  return (
    <Card
      className="neumorphic-card cursor-pointer transition-all duration-300 hover:scale-105 border-0"
      onClick={handleCardClick}
    >
      <div className="relative">
        <img
          src={
            product.images[0] ||
            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80"
          }
          alt={product.title}
          className="w-full h-48 object-cover rounded-t-3xl"
        />
        <button
          onClick={handleLike}
          className={`absolute top-3 right-3 p-2 rounded-full neumorphic-button-sm transition-colors ${
            hasLiked ? "text-red-500" : "text-gray-400"
          }`}
        >
          <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
        </button>

        {/* Status Badge */}
        <Badge
          className={`absolute top-3 left-3 ${
            product.status === "active"
              ? "bg-green-100 text-green-800"
              : product.status === "full"
                ? "bg-blue-100 text-blue-800"
                : "bg-gray-100 text-gray-800"
          }`}
        >
          {product.status === "active"
            ? "Aktif"
            : product.status === "full"
              ? "Penuh"
              : "Selesai"}
        </Badge>

        {/* Deadline Warning */}
        {isDeadlineSoon && product.status === "active" && (
          <Badge className="absolute bottom-3 left-3 bg-red-100 text-red-800">
            <Timer className="h-3 w-3 mr-1" />
            Segera Berakhir
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-[#2d3748] line-clamp-2 mb-1">
              {product.title}
            </h3>
            <p className="text-sm text-[#718096]">{product.brand}</p>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-[#718096]">Progress</span>
              <span className="text-[#2d3748] font-medium">
                {product.currentParticipants}/{product.maxParticipants} porsi
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          {/* Pricing */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-[#2d3748]">
                  {formatPrice(product.pricePerPortion)}
                </p>
                <p className="text-xs text-[#718096]">
                  per {product.portionSize}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-[#718096] line-through">
                  {formatPrice(product.originalPrice)}
                </p>
                <p className="text-xs text-green-600 font-medium">
                  Hemat{" "}
                  {Math.round(
                    ((product.originalPrice -
                      product.pricePerPortion * product.totalPortions) /
                      product.originalPrice) *
                      100,
                  )}
                  %
                </p>
              </div>
            </div>
          </div>

          {/* Info Row */}
          <div className="flex items-center justify-between text-xs text-[#718096]">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{product.location}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>{getTimeLeft(product.deadline)}</span>
            </div>
          </div>

          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-[#718096] pt-2 border-t border-[#e2e8f0]">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{product.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{product.likes}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span>Min {product.minParticipants} orang</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

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
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const enrollSambat = useMutation(api.marketplace.enrollSambat);
  const hasEnrolled = useQuery(
    api.marketplace.hasUserEnrolledSambat,
    user ? { sambatProductId: product._id, userId: user.id as any } : "skip",
  );

  const handleSubmit = async () => {
    if (!user || !shippingMethod || !shippingAddress.name.trim()) return;

    setIsSubmitting(true);
    try {
      await enrollSambat({
        sambatProductId: product._id,
        portionsRequested,
        shippingAddress,
        shippingMethod,
        shippingCost: 15000, // Default shipping cost
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

  const totalPrice = portionsRequested * product.pricePerPortion + 15000; // + shipping
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
        <CheckCircle className="h-4 w-4 mr-2" />
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
                    {method} - Rp 15.000
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
                <span>{formatPrice(15000)}</span>
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

export default function MarketplaceSambat() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const products = useQuery(api.marketplace.getSambatProducts, {
    paginationOpts: { numItems: 20, cursor: null },
    category: selectedCategory || undefined,
    sortBy,
    searchQuery: searchQuery || undefined,
    location: location || undefined,
    status: "active",
  });

  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2d3748] mb-4">
              Sambatan Parfum
            </h1>
            <p className="text-lg text-[#718096] mb-8">
              Patungan beli parfum premium dengan harga terjangkau
            </p>

            {/* Info Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="neumorphic-card p-6 text-center">
                <Users className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                  Patungan Bersama
                </h3>
                <p className="text-[#718096]">
                  Bergabung dengan pembeli lain untuk mendapatkan harga lebih
                  murah
                </p>
              </div>

              <div className="neumorphic-card p-6 text-center">
                <Package className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                  Porsi Sesuai Kebutuhan
                </h3>
                <p className="text-[#718096]">
                  Beli sesuai kebutuhan, mulai dari 5ml hingga 50ml
                </p>
              </div>

              <div className="neumorphic-card p-6 text-center">
                <ShoppingCart className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                  Pengiriman Langsung
                </h3>
                <p className="text-[#718096]">
                  Produk dikirim langsung ke alamat masing-masing pembeli
                </p>
              </div>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="neumorphic-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#718096]" />
                <Input
                  placeholder="Cari sambatan parfum..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="neumorphic-input pl-10 border-0"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="neumorphic-button-sm text-[#2d3748] bg-transparent border-0 shadow-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                onClick={() => navigate("/marketplace/sambat/create")}
                className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Buat Sambatan
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#e2e8f0]">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="neumorphic-input border-0">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent className="neumorphic-card border-0">
                    <SelectItem value="">Semua Kategori</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Lokasi"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="neumorphic-input border-0"
                />

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="neumorphic-input border-0">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent className="neumorphic-card border-0">
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setLocation("");
                    setSortBy("newest");
                  }}
                  className="neumorphic-button-sm text-[#718096] bg-transparent border-0"
                >
                  Reset
                </Button>
              </div>
            )}
          </div>

          {/* Products Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {products?.page?.map((product) => (
              <div key={product._id} className="space-y-4">
                <SambatProductCard product={product} />
                <EnrollDialog product={product} />
              </div>
            ))}
          </div>

          {/* Empty State */}
          {products?.page?.length === 0 && (
            <div className="text-center py-16">
              <div className="neumorphic-card-inset p-12 max-w-md mx-auto">
                <Users className="h-16 w-16 text-[#718096] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2d3748] mb-2">
                  Belum ada sambatan aktif
                </h3>
                <p className="text-[#718096] mb-6">
                  Jadilah yang pertama membuat sambatan parfum
                </p>
                <Button
                  onClick={() => navigate("/marketplace/sambat/create")}
                  className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                >
                  Buat Sambatan
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
