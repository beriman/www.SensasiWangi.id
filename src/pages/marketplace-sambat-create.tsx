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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Users,
  Package,
  DollarSign,
  Calendar,
  ImageIcon,
  X,
  AlertCircle,
  MapPin,
  Clock,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUser } from "@clerk/clerk-react";

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

const SHIPPING_METHODS = [
  "JNE",
  "J&T Express",
  "SiCepat",
  "Pos Indonesia",
  "Anteraja",
  "Ninja Express",
];

const PORTION_SIZES = ["5ml", "10ml", "15ml", "20ml", "25ml", "30ml", "50ml"];

export default function MarketplaceSambatCreate() {
  const { user } = useUser();
  const navigate = useNavigate();
  const createSambatProduct = useMutation(api.marketplace.createSambatProduct);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    description: "",
    originalPrice: "",
    pricePerPortion: "",
    totalPortions: "",
    minParticipants: "",
    maxParticipants: "",
    portionSize: "",
    location: "",
    shippingMethods: [] as string[],
    deadline: "",
    images: [] as string[],
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleImageUrlAdd = () => {
    const url = prompt("Masukkan URL gambar:");
    if (url && url.trim()) {
      setImageUrls((prev) => [...prev, url.trim()]);
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, url.trim()],
      }));
    }
  };

  const handleImageUrlRemove = (index: number) => {
    setImageUrls((prev) => prev.filter((_, i) => i !== index));
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  const handleShippingMethodToggle = (method: string) => {
    setFormData((prev) => ({
      ...prev,
      shippingMethods: prev.shippingMethods.includes(method)
        ? prev.shippingMethods.filter((m) => m !== method)
        : [...prev.shippingMethods, method],
    }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) newErrors.title = "Judul produk wajib diisi";
    if (!formData.brand.trim()) newErrors.brand = "Brand wajib diisi";
    if (!formData.category) newErrors.category = "Kategori wajib dipilih";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi wajib diisi";
    if (!formData.originalPrice || parseInt(formData.originalPrice) <= 0) {
      newErrors.originalPrice = "Harga asli wajib diisi dan harus lebih dari 0";
    }
    if (!formData.pricePerPortion || parseInt(formData.pricePerPortion) <= 0) {
      newErrors.pricePerPortion =
        "Harga per porsi wajib diisi dan harus lebih dari 0";
    }
    if (!formData.totalPortions || parseInt(formData.totalPortions) <= 0) {
      newErrors.totalPortions =
        "Total porsi wajib diisi dan harus lebih dari 0";
    }
    if (!formData.minParticipants || parseInt(formData.minParticipants) <= 0) {
      newErrors.minParticipants =
        "Minimum peserta wajib diisi dan harus lebih dari 0";
    }
    if (!formData.maxParticipants || parseInt(formData.maxParticipants) <= 0) {
      newErrors.maxParticipants =
        "Maksimum peserta wajib diisi dan harus lebih dari 0";
    }
    if (
      parseInt(formData.minParticipants) > parseInt(formData.maxParticipants)
    ) {
      newErrors.minParticipants =
        "Minimum peserta tidak boleh lebih dari maksimum";
    }
    if (!formData.portionSize)
      newErrors.portionSize = "Ukuran porsi wajib dipilih";
    if (!formData.location.trim()) newErrors.location = "Lokasi wajib diisi";
    if (formData.shippingMethods.length === 0) {
      newErrors.shippingMethods = "Pilih minimal satu metode pengiriman";
    }
    if (!formData.deadline) newErrors.deadline = "Deadline wajib diisi";

    // Validate deadline is in the future
    if (formData.deadline) {
      const deadlineDate = new Date(formData.deadline).getTime();
      const now = Date.now();
      if (deadlineDate <= now) {
        newErrors.deadline = "Deadline harus di masa depan";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Anda harus login untuk membuat sambatan");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      await createSambatProduct({
        title: formData.title.trim(),
        brand: formData.brand.trim(),
        category: formData.category,
        description: formData.description.trim(),
        originalPrice: parseInt(formData.originalPrice),
        pricePerPortion: parseInt(formData.pricePerPortion),
        totalPortions: parseInt(formData.totalPortions),
        minParticipants: parseInt(formData.minParticipants),
        maxParticipants: parseInt(formData.maxParticipants),
        portionSize: formData.portionSize,
        location: formData.location.trim(),
        shippingOptions: formData.shippingMethods,
        tags: [formData.brand, formData.category], // Simple tags
        deadline: new Date(formData.deadline).getTime(),
        images: formData.images,
      });

      alert("Sambatan berhasil dibuat!");
      navigate("/marketplace/sambat");
    } catch (error) {
      console.error("Error creating sambat product:", error);
      alert("Terjadi kesalahan saat membuat sambatan. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: string) => {
    if (!price) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseInt(price));
  };

  const calculateSavings = () => {
    if (
      !formData.originalPrice ||
      !formData.pricePerPortion ||
      !formData.totalPortions
    )
      return 0;
    const originalPrice = parseInt(formData.originalPrice);
    const totalSambatPrice =
      parseInt(formData.pricePerPortion) * parseInt(formData.totalPortions);
    return Math.round(
      ((originalPrice - totalSambatPrice) / originalPrice) * 100,
    );
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2d3748] mb-4">
              Buat Sambatan Parfum
            </h1>
            <p className="text-lg text-[#718096] mb-8">
              Buat sambatan untuk parfum premium dan ajak orang lain patungan
            </p>
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Basic Information */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <Package className="h-5 w-5" />
                      Informasi Produk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label
                        htmlFor="title"
                        className="text-[#2d3748] font-medium"
                      >
                        Judul Produk *
                      </Label>
                      <Input
                        id="title"
                        placeholder="Contoh: Tom Ford Oud Wood 100ml"
                        value={formData.title}
                        onChange={(e) =>
                          handleInputChange("title", e.target.value)
                        }
                        className={`neumorphic-input border-0 mt-1 ${errors.title ? "ring-2 ring-red-500" : ""}`}
                      />
                      {errors.title && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.title}
                        </p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="brand"
                          className="text-[#2d3748] font-medium"
                        >
                          Brand *
                        </Label>
                        <Input
                          id="brand"
                          placeholder="Contoh: Tom Ford"
                          value={formData.brand}
                          onChange={(e) =>
                            handleInputChange("brand", e.target.value)
                          }
                          className={`neumorphic-input border-0 mt-1 ${errors.brand ? "ring-2 ring-red-500" : ""}`}
                        />
                        {errors.brand && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.brand}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-[#2d3748] font-medium">
                          Kategori *
                        </Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) =>
                            handleInputChange("category", value)
                          }
                        >
                          <SelectTrigger
                            className={`neumorphic-input border-0 mt-1 ${errors.category ? "ring-2 ring-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Pilih kategori" />
                          </SelectTrigger>
                          <SelectContent className="neumorphic-card border-0">
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.category}
                          </p>
                        )}
                      </div>
                    </div>

                    <div>
                      <Label
                        htmlFor="description"
                        className="text-[#2d3748] font-medium"
                      >
                        Deskripsi *
                      </Label>
                      <Textarea
                        id="description"
                        placeholder="Deskripsikan parfum, aroma, dan alasan membuat sambatan..."
                        value={formData.description}
                        onChange={(e) =>
                          handleInputChange("description", e.target.value)
                        }
                        className={`neumorphic-input border-0 mt-1 min-h-[120px] ${errors.description ? "ring-2 ring-red-500" : ""}`}
                      />
                      {errors.description && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.description}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Pricing & Portions */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <DollarSign className="h-5 w-5" />
                      Harga & Porsi
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="originalPrice"
                          className="text-[#2d3748] font-medium"
                        >
                          Harga Asli Produk *
                        </Label>
                        <Input
                          id="originalPrice"
                          type="number"
                          placeholder="0"
                          value={formData.originalPrice}
                          onChange={(e) =>
                            handleInputChange("originalPrice", e.target.value)
                          }
                          className={`neumorphic-input border-0 mt-1 ${errors.originalPrice ? "ring-2 ring-red-500" : ""}`}
                        />
                        {formData.originalPrice && (
                          <p className="text-sm text-[#718096] mt-1">
                            {formatPrice(formData.originalPrice)}
                          </p>
                        )}
                        {errors.originalPrice && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.originalPrice}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="pricePerPortion"
                          className="text-[#2d3748] font-medium"
                        >
                          Harga per Porsi *
                        </Label>
                        <Input
                          id="pricePerPortion"
                          type="number"
                          placeholder="0"
                          value={formData.pricePerPortion}
                          onChange={(e) =>
                            handleInputChange("pricePerPortion", e.target.value)
                          }
                          className={`neumorphic-input border-0 mt-1 ${errors.pricePerPortion ? "ring-2 ring-red-500" : ""}`}
                        />
                        {formData.pricePerPortion && (
                          <p className="text-sm text-[#718096] mt-1">
                            {formatPrice(formData.pricePerPortion)}
                          </p>
                        )}
                        {errors.pricePerPortion && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.pricePerPortion}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <Label className="text-[#2d3748] font-medium">
                          Ukuran per Porsi *
                        </Label>
                        <Select
                          value={formData.portionSize}
                          onValueChange={(value) =>
                            handleInputChange("portionSize", value)
                          }
                        >
                          <SelectTrigger
                            className={`neumorphic-input border-0 mt-1 ${errors.portionSize ? "ring-2 ring-red-500" : ""}`}
                          >
                            <SelectValue placeholder="Pilih ukuran" />
                          </SelectTrigger>
                          <SelectContent className="neumorphic-card border-0">
                            {PORTION_SIZES.map((size) => (
                              <SelectItem key={size} value={size}>
                                {size}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.portionSize && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.portionSize}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="totalPortions"
                          className="text-[#2d3748] font-medium"
                        >
                          Total Porsi *
                        </Label>
                        <Input
                          id="totalPortions"
                          type="number"
                          placeholder="0"
                          value={formData.totalPortions}
                          onChange={(e) =>
                            handleInputChange("totalPortions", e.target.value)
                          }
                          className={`neumorphic-input border-0 mt-1 ${errors.totalPortions ? "ring-2 ring-red-500" : ""}`}
                        />
                        {errors.totalPortions && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.totalPortions}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label className="text-[#2d3748] font-medium">
                          Hemat
                        </Label>
                        <div className="neumorphic-card-inset p-3 mt-1">
                          <p className="text-lg font-bold text-green-600">
                            {calculateSavings()}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Participants */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <Users className="h-5 w-5" />
                      Peserta
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label
                          htmlFor="minParticipants"
                          className="text-[#2d3748] font-medium"
                        >
                          Minimum Peserta *
                        </Label>
                        <Input
                          id="minParticipants"
                          type="number"
                          placeholder="0"
                          value={formData.minParticipants}
                          onChange={(e) =>
                            handleInputChange("minParticipants", e.target.value)
                          }
                          className={`neumorphic-input border-0 mt-1 ${errors.minParticipants ? "ring-2 ring-red-500" : ""}`}
                        />
                        {errors.minParticipants && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.minParticipants}
                          </p>
                        )}
                      </div>

                      <div>
                        <Label
                          htmlFor="maxParticipants"
                          className="text-[#2d3748] font-medium"
                        >
                          Maksimum Peserta *
                        </Label>
                        <Input
                          id="maxParticipants"
                          type="number"
                          placeholder="0"
                          value={formData.maxParticipants}
                          onChange={(e) =>
                            handleInputChange("maxParticipants", e.target.value)
                          }
                          className={`neumorphic-input border-0 mt-1 ${errors.maxParticipants ? "ring-2 ring-red-500" : ""}`}
                        />
                        {errors.maxParticipants && (
                          <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {errors.maxParticipants}
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Location & Shipping */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <MapPin className="h-5 w-5" />
                      Lokasi & Pengiriman
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label
                        htmlFor="location"
                        className="text-[#2d3748] font-medium"
                      >
                        Lokasi *
                      </Label>
                      <Input
                        id="location"
                        placeholder="Contoh: Jakarta Selatan"
                        value={formData.location}
                        onChange={(e) =>
                          handleInputChange("location", e.target.value)
                        }
                        className={`neumorphic-input border-0 mt-1 ${errors.location ? "ring-2 ring-red-500" : ""}`}
                      />
                      {errors.location && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.location}
                        </p>
                      )}
                    </div>

                    <div>
                      <Label className="text-[#2d3748] font-medium mb-3 block">
                        Metode Pengiriman * (Pilih minimal 1)
                      </Label>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                        {SHIPPING_METHODS.map((method) => (
                          <div
                            key={method}
                            onClick={() => handleShippingMethodToggle(method)}
                            className={`p-3 rounded-2xl cursor-pointer transition-all ${
                              formData.shippingMethods.includes(method)
                                ? "neumorphic-card-inset bg-[#667eea]/10"
                                : "neumorphic-card hover:scale-105"
                            }`}
                          >
                            <div className="text-sm text-[#2d3748] text-center">
                              {method}
                            </div>
                          </div>
                        ))}
                      </div>
                      {errors.shippingMethods && (
                        <p className="text-red-500 text-sm mt-2 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.shippingMethods}
                        </p>
                      )}
                    </div>
                  </CardContent>
                </Card>

                {/* Deadline */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <Clock className="h-5 w-5" />
                      Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div>
                      <Label
                        htmlFor="deadline"
                        className="text-[#2d3748] font-medium"
                      >
                        Deadline Sambatan *
                      </Label>
                      <Input
                        id="deadline"
                        type="datetime-local"
                        value={formData.deadline}
                        onChange={(e) =>
                          handleInputChange("deadline", e.target.value)
                        }
                        className={`neumorphic-input border-0 mt-1 ${errors.deadline ? "ring-2 ring-red-500" : ""}`}
                      />
                      {errors.deadline && (
                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          {errors.deadline}
                        </p>
                      )}
                      <p className="text-xs text-[#718096] mt-1">
                        Sambatan akan otomatis berakhir pada waktu ini
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Images */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <ImageIcon className="h-5 w-5" />
                      Foto Produk
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button
                      type="button"
                      onClick={handleImageUrlAdd}
                      className="w-full neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Tambah URL Gambar
                    </Button>

                    {imageUrls.length > 0 && (
                      <div className="space-y-2">
                        {imageUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-24 object-cover rounded-2xl"
                              onError={(e) => {
                                e.currentTarget.src =
                                  "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80";
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => handleImageUrlRemove(index)}
                              className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </div>
                        ))}
                      </div>
                    )}

                    <p className="text-xs text-[#718096]">
                      Tambahkan foto produk untuk menarik peserta sambatan
                    </p>
                  </CardContent>
                </Card>

                {/* Summary */}
                {formData.originalPrice &&
                  formData.pricePerPortion &&
                  formData.totalPortions && (
                    <Card className="neumorphic-card border-0">
                      <CardHeader>
                        <CardTitle className="text-[#2d3748]">
                          Ringkasan
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Harga Asli</span>
                          <span>{formatPrice(formData.originalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Total Sambatan</span>
                          <span>
                            {formatPrice(
                              (
                                parseInt(formData.pricePerPortion) *
                                parseInt(formData.totalPortions)
                              ).toString(),
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between font-semibold text-green-600 pt-2 border-t border-[#e2e8f0]">
                          <span>Hemat</span>
                          <span>{calculateSavings()}%</span>
                        </div>
                      </CardContent>
                    </Card>
                  )}

                {/* Submit */}
                <Card className="neumorphic-card border-0">
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <Button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none h-12"
                      >
                        {isSubmitting ? "Membuat..." : "Buat Sambatan"}
                      </Button>

                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => navigate("/marketplace/sambat")}
                        className="w-full neumorphic-button-sm text-[#718096] bg-transparent border-0"
                      >
                        Batal
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </form>
        </div>
      </main>

    </div>
  );
}
