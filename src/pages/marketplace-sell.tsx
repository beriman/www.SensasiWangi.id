import { useState, useEffect, useRef } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import RoleProtectedRoute from "@/components/wrappers/RoleProtectedRoute";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { uploadImage } from "@/utils/cloudinary";
import { Progress } from "@/components/ui/progress";
import {
  Upload,
  X,
  ImageIcon,
  Package,
  MapPin,
  DollarSign,
  Tag,
  FileText,
  Camera,
  AlertCircle,
  CheckCircle,
  Info,
  Lightbulb,
  TrendingUp,
} from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
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

const CONDITIONS = [
  { value: "new", label: "Baru" },
  { value: "like-new", label: "Seperti Baru" },
  { value: "good", label: "Baik" },
  { value: "fair", label: "Cukup" },
];

const SHIPPING_METHODS = [
  "JNE",
  "J&T Express",
  "SiCepat",
  "Pos Indonesia",
  "Anteraja",
  "Ninja Express",
  "COD (Cash on Delivery)",
  "Pickup Langsung",
];

export default function MarketplaceSell() {
  return <MarketplaceSellContent />;
}

function MarketplaceSellContent() {
  const { user } = useUser();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get("productId");
  const productData = useQuery(
    api.marketplace.getProductById,
    productId ? { productId: productId as any } : "skip",
  );
  const createProduct = useMutation(api.marketplace.createProduct);
  const updateProduct = useMutation(api.marketplace.updateProduct);
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const createOrUpdateUser = useMutation(api.users.createOrUpdateUser);

  const [formData, setFormData] = useState({
    title: "",
    brand: "",
    category: "",
    condition: "",
    description: "",
    price: "",
    stock: "",
    originalPrice: "",
    size: "",
    location: "",
    shippingMethods: [] as string[],
    tags: [] as string[],
    isNegotiable: false,
    images: [] as string[],
  });

  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [showTips, setShowTips] = useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto-create user if not exists
  useEffect(() => {
    if (user && !userData) {
      createOrUpdateUser({});
    }
  }, [user, userData, createOrUpdateUser]);

  // Load product data when editing
  useEffect(() => {
    if (productId && productData) {
      setFormData({
        title: productData.title,
        brand: productData.brand,
        category: productData.category,
        condition: productData.condition,
        description: productData.description,
        price: String(productData.price),
        stock: String(productData.stock ?? 0),
        originalPrice: productData.originalPrice ? String(productData.originalPrice) : "",
        size: productData.size,
        location: productData.location,
        shippingMethods: productData.shippingOptions,
        tags: productData.tags,
        isNegotiable: productData.isNegotiable,
        images: productData.images,
      });
      setImageUrls(productData.images);
    }
  }, [productId, productData]);

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

  const handleImageFileChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const url = await uploadImage(file, "products");
      setImageUrls((prev) => [...prev, url]);
      setFormData((prev) => ({ ...prev, images: [...prev.images, url] }));
    } catch (err) {
      console.error(err);
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
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
    if (!formData.condition) newErrors.condition = "Kondisi wajib dipilih";
    if (!formData.description.trim())
      newErrors.description = "Deskripsi wajib diisi";
    if (!formData.price || parseInt(formData.price) <= 0) {
      newErrors.price = "Harga wajib diisi dan harus lebih dari 0";
    }
    if (!formData.stock || parseInt(formData.stock) <= 0) {
      newErrors.stock = "Stok wajib diisi dan harus lebih dari 0";
    }
    if (!formData.location.trim()) newErrors.location = "Lokasi wajib diisi";
    if (formData.shippingMethods.length === 0) {
      newErrors.shippingMethods = "Pilih minimal satu metode pengiriman";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      alert("Anda harus login untuk menjual produk");
      return;
    }

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      if (productId) {
        await updateProduct({
          productId: productId as any,
          title: formData.title.trim(),
          brand: formData.brand.trim(),
          category: formData.category,
          condition: formData.condition,
          description: formData.description.trim(),
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
          originalPrice: formData.originalPrice
            ? parseInt(formData.originalPrice)
            : undefined,
          location: formData.location.trim(),
          size: formData.size,
          shippingOptions: formData.shippingMethods,
          tags: formData.tags,
          isNegotiable: formData.isNegotiable,
          images: formData.images,
        });
        alert("Produk berhasil diperbarui");
        navigate(`/marketplace/product/${productId}`);
      } else {
        const newId = await createProduct({
          title: formData.title.trim(),
          brand: formData.brand.trim(),
          category: formData.category,
          condition: formData.condition,
          description: formData.description.trim(),
          price: parseInt(formData.price),
          stock: parseInt(formData.stock),
          originalPrice: formData.originalPrice
            ? parseInt(formData.originalPrice)
            : undefined,
          location: formData.location.trim(),
          size: formData.size,
          shippingOptions: formData.shippingMethods,
          tags: formData.tags,
          isNegotiable: formData.isNegotiable,
          images: formData.images,
        });

        // Show success message with next steps
        alert(
          "🎉 Produk berhasil ditambahkan!\n\n" +
            "Langkah selanjutnya:\n" +
            "• Produk Anda akan muncul di marketplace\n" +
            "• Pantau performa di dashboard\n" +
            "• Kelola pesanan yang masuk",
        );

        navigate(`/marketplace/product/${newId}`);
      }
    } catch (error) {
      console.error("Error creating product:", error);
      alert("Terjadi kesalahan saat menambahkan produk. Silakan coba lagi.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const nextStep = () => {
    if (currentStep < 3) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const getStepProgress = () => {
    return (currentStep / 3) * 100;
  };

  const formatPrice = (price: string) => {
    if (!price) return "";
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(parseInt(price));
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2d3748] mb-4">
              {productId ? "Edit Produk" : "Jual Produk Parfum"}
            </h1>
            <p className="text-lg text-[#718096] mb-8">
              Jual parfum Anda dengan mudah dan aman di marketplace kami
            </p>

            {/* Progress Indicator */}
            <div className="max-w-md mx-auto mb-8">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-[#718096]">
                  Langkah {currentStep} dari 3
                </span>
                <span className="text-sm text-[#718096]">
                  {Math.round(getStepProgress())}%
                </span>
              </div>
              <Progress value={getStepProgress()} className="h-2" />
              <div className="flex justify-between mt-2 text-xs text-[#718096]">
                <span className={currentStep >= 1 ? "text-[#667eea]" : ""}>
                  Info Produk
                </span>
                <span className={currentStep >= 2 ? "text-[#667eea]" : ""}>
                  Harga & Lokasi
                </span>
                <span className={currentStep >= 3 ? "text-[#667eea]" : ""}>
                  Foto & Publikasi
                </span>
              </div>
            </div>

            {/* Tips Card */}
            {showTips && (
              <Card className="neumorphic-card border-0 max-w-2xl mx-auto mb-8">
                <CardContent className="p-6">
                  <div className="flex items-start gap-3">
                    <Lightbulb className="h-5 w-5 text-yellow-500 mt-1 flex-shrink-0" />
                    <div className="text-left">
                      <h3 className="font-semibold text-[#2d3748] mb-2">
                        Tips Sukses Berjualan
                      </h3>
                      <ul className="text-sm text-[#718096] space-y-1">
                        <li>
                          • Gunakan foto berkualitas tinggi dan pencahayaan yang
                          baik
                        </li>
                        <li>
                          • Tulis deskripsi yang detail dan jujur tentang
                          kondisi produk
                        </li>
                        <li>
                          • Tentukan harga yang kompetitif dengan riset pasar
                        </li>
                        <li>
                          • Respon cepat pertanyaan dan sambat dari pembeli
                        </li>
                      </ul>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowTips(false)}
                      className="p-1 h-auto"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Form */}
              <div className="lg:col-span-2 space-y-6">
                {/* Step 1: Basic Information */}
                {currentStep === 1 && (
                  <div>
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
                            placeholder="Contoh: Dior Sauvage EDT 100ml"
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
                              placeholder="Contoh: Dior"
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
                          <Label className="text-[#2d3748] font-medium">
                            Kondisi *
                          </Label>
                          <Select
                            value={formData.condition}
                            onValueChange={(value) =>
                              handleInputChange("condition", value)
                            }
                          >
                            <SelectTrigger
                              className={`neumorphic-input border-0 mt-1 ${errors.condition ? "ring-2 ring-red-500" : ""}`}
                            >
                              <SelectValue placeholder="Pilih kondisi" />
                            </SelectTrigger>
                            <SelectContent className="neumorphic-card border-0">
                              {CONDITIONS.map((condition) => (
                                <SelectItem
                                  key={condition.value}
                                  value={condition.value}
                                >
                                  {condition.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          {errors.condition && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.condition}
                            </p>
                          )}
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
                            placeholder="Deskripsikan kondisi, aroma, dan detail lainnya..."
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
                  </div>
                )}

                {/* Step 2: Pricing & Location */}
                {currentStep === 2 && (
                  <>
                    {/* Pricing */}
                    <Card className="neumorphic-card border-0">
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                          <DollarSign className="h-5 w-5" />
                          Harga
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label
                              htmlFor="price"
                              className="text-[#2d3748] font-medium"
                            >
                              Harga Jual *
                            </Label>
                            <Input
                              id="price"
                              type="number"
                              placeholder="0"
                              value={formData.price}
                              onChange={(e) =>
                                handleInputChange("price", e.target.value)
                              }
                              className={`neumorphic-input border-0 mt-1 ${errors.price ? "ring-2 ring-red-500" : ""}`}
                            />
                            {formData.price && (
                              <p className="text-sm text-[#718096] mt-1">
                                {formatPrice(formData.price)}
                              </p>
                            )}
                            {errors.price && (
                              <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <AlertCircle className="h-3 w-3" />
                                {errors.price}
                              </p>
                            )}
                          </div>

                          <div>
                            <Label
                              htmlFor="originalPrice"
                              className="text-[#2d3748] font-medium"
                            >
                              Harga Asli (Opsional)
                            </Label>
                            <Input
                              id="originalPrice"
                              type="number"
                              placeholder="0"
                              value={formData.originalPrice}
                              onChange={(e) =>
                                handleInputChange(
                                  "originalPrice",
                                  e.target.value,
                                )
                              }
                              className="neumorphic-input border-0 mt-1"
                            />
                            {formData.originalPrice && (
                              <p className="text-sm text-[#718096] mt-1">
                                {formatPrice(formData.originalPrice)}
                              </p>
                            )}
                          </div>
                        </div>

                        <div>
                          <Label
                            htmlFor="stock"
                            className="text-[#2d3748] font-medium"
                          >
                            Stok Tersedia *
                          </Label>
                          <Input
                            id="stock"
                            type="number"
                            placeholder="0"
                            value={formData.stock}
                            onChange={(e) =>
                              handleInputChange("stock", e.target.value)
                            }
                            className={`neumorphic-input border-0 mt-1 ${errors.stock ? "ring-2 ring-red-500" : ""}`}
                          />
                          {errors.stock && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.stock}
                            </p>
                          )}
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="negotiable"
                            checked={formData.isNegotiable}
                            onCheckedChange={(checked) =>
                              handleInputChange("isNegotiable", checked)
                            }
                          />
                          <Label
                            htmlFor="negotiable"
                            className="text-[#2d3748]"
                          >
                            Harga bisa dinegosiasi
                          </Label>
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
                                onClick={() =>
                                  handleShippingMethodToggle(method)
                                }
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
                  </>
                )}

                {/* Step 3: Images & Final Details */}
                {currentStep === 3 && (
                  <Card className="neumorphic-card border-0">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                        <Camera className="h-5 w-5" />
                        Foto & Detail Tambahan
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label className="text-[#2d3748] font-medium mb-3 block">
                          Foto Produk (Opsional)
                        </Label>
                        <div className="space-y-4">
                          <input
                            type="file"
                            accept="image/*"
                            ref={fileInputRef}
                            onChange={handleImageFileChange}
                            className="hidden"
                          />
                          <Button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                          >
                            <Upload className="h-4 w-4 mr-2" /> Upload Gambar
                          </Button>
                          <Button
                            type="button"
                            onClick={handleImageUrlAdd}
                            className="w-full neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                          >
                            <ImageIcon className="h-4 w-4 mr-2" />
                            Tambah URL Gambar
                          </Button>

                          {imageUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-4">
                              {imageUrls.map((url, index) => (
                                <div key={index} className="relative">
                                  <img
                                    src={url}
                                    alt={`Preview ${index + 1}`}
                                    className="w-full h-32 object-cover rounded-2xl"
                                    onError={(e) => {
                                      e.currentTarget.src =
                                        "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80";
                                    }}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleImageUrlRemove(index)}
                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                                  >
                                    <X className="h-3 w-3" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                        <p className="text-xs text-[#718096] mt-2">
                          💡 Foto berkualitas tinggi meningkatkan peluang
                          penjualan hingga 3x lipat
                        </p>
                      </div>

                      <div>
                        <Label className="text-[#2d3748] font-medium mb-2 block">
                          Tag Produk (Opsional)
                        </Label>
                        <Input
                          placeholder="Contoh: vintage, rare, limited edition (pisahkan dengan koma)"
                          value={formData.tags.join(", ")}
                          onChange={(e) => {
                            const tags = e.target.value
                              .split(",")
                              .map((tag) => tag.trim())
                              .filter((tag) => tag);
                            handleInputChange("tags", tags);
                          }}
                          className="neumorphic-input border-0"
                        />
                        <p className="text-xs text-[#718096] mt-1">
                          Tag membantu pembeli menemukan produk Anda lebih mudah
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between pt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={prevStep}
                    disabled={currentStep === 1}
                    className="neumorphic-button-sm text-[#718096] bg-transparent border-0"
                  >
                    Sebelumnya
                  </Button>

                  {currentStep < 3 ? (
                    <Button
                      type="button"
                      onClick={nextStep}
                      className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                    >
                      Selanjutnya
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                    >
                      {isSubmitting ? "Menyimpan..." : "Publikasikan Produk"}
                    </Button>
                  )}
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Progress Summary */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <CheckCircle className="h-5 w-5" />
                      Progress Anda
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="space-y-3">
                      <div
                        className={`flex items-center gap-2 ${formData.title && formData.brand && formData.category ? "text-green-600" : "text-[#718096]"}`}
                      >
                        {formData.title &&
                        formData.brand &&
                        formData.category ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-[#718096]" />
                        )}
                        <span className="text-sm">Info Dasar Produk</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${
                          formData.price && formData.location && formData.stock
                            ? "text-green-600"
                            : "text-[#718096]"
                        }`}
                      >
                        {formData.price && formData.location && formData.stock ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-[#718096]" />
                        )}
                        <span className="text-sm">Harga & Lokasi</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 ${formData.shippingMethods.length > 0 ? "text-green-600" : "text-[#718096]"}`}
                      >
                        {formData.shippingMethods.length > 0 ? (
                          <CheckCircle className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4 rounded-full border-2 border-[#718096]" />
                        )}
                        <span className="text-sm">Metode Pengiriman</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Stats */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <TrendingUp className="h-5 w-5" />
                      Statistik Marketplace
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#667eea]">
                        85%
                      </div>
                      <div className="text-xs text-[#718096]">
                        Produk dengan foto terjual lebih cepat
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-[#667eea]">
                        3.2x
                      </div>
                      <div className="text-xs text-[#718096]">
                        Lebih banyak views dengan deskripsi lengkap
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Help & Support */}
                <Card className="neumorphic-card border-0">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-[#2d3748]">
                      <Info className="h-5 w-5" />
                      Butuh Bantuan?
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-[#718096] mb-4">
                      Tim support kami siap membantu Anda sukses berjualan
                    </p>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full neumorphic-button-sm text-[#718096] bg-transparent border-0"
                      onClick={() => window.open("/faq", "_blank")}
                    >
                      Lihat FAQ
                    </Button>
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
