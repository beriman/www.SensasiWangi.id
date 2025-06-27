import { useState, useEffect } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { useUser } from "@clerk/clerk-react";
import {
  Search,
  Filter,
  Heart,
  Eye,
  MapPin,
  Star,
  MessageCircle,
  Share,
  Plus,
  ShoppingCart,
  Truck,
  Shield,
  TrendingUp,
  Clock,
  Users,
  Package,
  Zap,
  Grid,
  List,
  Bookmark,
  X,
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

const CONDITIONS = [
  { value: "new", label: "Baru" },
  { value: "like-new", label: "Seperti Baru" },
  { value: "good", label: "Baik" },
  { value: "fair", label: "Cukup" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "price_low", label: "Harga Terendah" },
  { value: "price_high", label: "Harga Tertinggi" },
  { value: "popular", label: "Paling Dilihat" },
  { value: "liked", label: "Paling Disukai" },
];

type CartItem = { id: string; title: string; price: number };

function ProductCard({
  product,
  viewMode = "grid",
  onAddToCart,
}: {
  product: any;
  viewMode?: "grid" | "list";
  onAddToCart?: (item: CartItem) => void;
}) {
  const { user } = useUser();
  const navigate = useNavigate();
  const toggleLike = useMutation(api.marketplace.toggleProductLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const incrementViews = useMutation(api.marketplace.incrementProductViews);
  const hasLiked = useQuery(
    api.marketplace.hasUserLikedProduct,
    user ? { productId: product._id, userId: user.id as any } : "skip",
  );
  const bookmarks = useQuery(
    api.bookmarks.getBookmarksByUser,
    user ? { userId: user.id as any, type: "product" } : "skip",
  );
  const reviews = useQuery(api.marketplace.getReviewsByProduct, {
    productId: product._id,
  });
  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        reviews.length
      : 0;

  const handleCardClick = () => {
    incrementViews({ productId: product._id });
    navigate(`/marketplace/product/${product._id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleLike({ productId: product._id });
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleBookmark({ itemId: product._id, type: "product" });
    }
  };

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.({
      id: product._id,
      title: product.title,
      price: product.price,
    });
  };


  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/marketplace/product/${product._id}`;
    const shareData = { title: product.title, url };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(url);
      alert("Link disalin");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getConditionColor = (condition: string) => {
    switch (condition) {
      case "new":
        return "bg-green-100 text-green-800";
      case "like-new":
        return "bg-blue-100 text-blue-800";
      case "good":
        return "bg-yellow-100 text-yellow-800";
      case "fair":
        return "bg-orange-100 text-orange-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (viewMode === "list") {
    return (
      <Card
        className="neumorphic-card cursor-pointer transition-all duration-300 hover:scale-[1.02] border-0"
        onClick={handleCardClick}
      >
        <div className="flex p-4 gap-4">
          <div className="relative flex-shrink-0">
            <img
              src={
                product.images[0] ||
                "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80"
              }
              alt={product.title}
              className="w-24 h-24 object-cover rounded-2xl"
            />
            <Badge
              className={`absolute -top-2 -left-2 text-xs ${getConditionColor(product.condition)}`}
            >
              {CONDITIONS.find((c) => c.value === product.condition)?.label}
            </Badge>
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="font-semibold text-[#2d3748] line-clamp-1">
                  {product.title}
                </h3>
                <p className="text-sm text-[#718096]">{product.brand}</p>
                {reviews && reviews.length > 0 && (
                  <div className="flex items-center gap-1 text-xs">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3 w-3 ${
                          averageRating >= n
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                    <span>{averageRating.toFixed(1)}</span>
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleLike}
                  className={`p-2 rounded-full neumorphic-button-sm transition-colors ${
                    hasLiked ? "text-red-500" : "text-gray-400"
                  }`}
                >
                  <Heart className={`h-4 w-4 ${hasLiked ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={handleBookmark}
                  className={`p-2 rounded-full neumorphic-button-sm transition-colors ${
                    bookmarks?.some((b: any) => b.data._id === product._id)
                      ? "text-yellow-500"
                      : "text-gray-400"
                  }`}
                >
                  <Bookmark className="h-4 w-4" />
                </button>
                <button
                  onClick={handleShare}
                  className="p-2 rounded-full neumorphic-button-sm text-gray-400"
                >
                  <Share className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-lg font-bold text-[#2d3748]">
                  {formatPrice(product.price)}
                </p>
                {product.originalPrice &&
                  product.originalPrice > product.price && (
                    <p className="text-sm text-[#718096] line-through">
                      {formatPrice(product.originalPrice)}
                    </p>
                  )}
              </div>
              {product.isNegotiable && (
                <Badge variant="outline" className="text-xs">
                  Nego
                </Badge>
              )}
            </div>

            <div className="flex items-center justify-between text-xs text-[#718096]">
              <div className="flex items-center gap-1">
                <MapPin className="h-3 w-3" />
                <span>{product.location}</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1">
                  <Eye className="h-3 w-3" />
                  <span>{product.views}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Heart className="h-3 w-3" />
                  <span>{product.likes}</span>
                </div>
                {product.sambatCount > 0 && (
                  <div className="flex items-center gap-1">
                    <MessageCircle className="h-3 w-3" />
                    <span>{product.sambatCount}</span>
                  </div>
                )}
              </div>
            </div>
            <Button size="sm" className="mt-2" onClick={handleAdd}>
              <ShoppingCart className="h-4 w-4 mr-2" />Tambah
            </Button>
          </div>
        </div>
      </Card>
    );
  }

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
        <button
          onClick={handleBookmark}
          className={`absolute top-3 right-12 p-2 rounded-full neumorphic-button-sm transition-colors ${
            bookmarks?.some((b: any) => b.data._id === product._id)
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
        >
          <Bookmark className="h-4 w-4" />
        </button>
        <button
          onClick={handleShare}
          className="absolute top-3 right-20 p-2 rounded-full neumorphic-button-sm text-gray-400"
        >
          <Share className="h-4 w-4" />
        </button>
        <Badge
          className={`absolute top-3 left-3 ${getConditionColor(product.condition)}`}
        >
          {CONDITIONS.find((c) => c.value === product.condition)?.label}
        </Badge>
      </div>

      <CardContent className="p-4">
        <div className="space-y-2">
          <h3 className="font-semibold text-[#2d3748] line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-[#718096] line-clamp-1">{product.brand}</p>
          {reviews && reviews.length > 0 && (
            <div className="flex items-center gap-1 text-xs">
              {[1, 2, 3, 4, 5].map((n) => (
                <Star
                  key={n}
                  className={`h-3 w-3 ${
                    averageRating >= n
                      ? "text-yellow-500 fill-yellow-500"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span>{averageRating.toFixed(1)}</span>
            </div>
          )}

          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <p className="text-lg font-bold text-[#2d3748]">
                {formatPrice(product.price)}
              </p>
              {product.originalPrice &&
                product.originalPrice > product.price && (
                  <p className="text-sm text-[#718096] line-through">
                    {formatPrice(product.originalPrice)}
                  </p>
                )}
            </div>
            {product.isNegotiable && (
              <Badge variant="outline" className="text-xs">
                Nego
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-[#718096]">
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3" />
              <span>{product.location}</span>
            </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1">
              <Eye className="h-3 w-3" />
              <span>{product.views}</span>
            </div>
            <div className="flex items-center gap-1">
              <Heart className="h-3 w-3" />
              <span>{product.likes}</span>
            </div>
            {product.sambatCount > 0 && (
              <div className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                <span>{product.sambatCount}</span>
              </div>
            )}
          </div>
        </div>
        <Button size="sm" className="mt-2 w-full" onClick={handleAdd}>
          <ShoppingCart className="h-4 w-4 mr-2" />Tambah
        </Button>
      </div>
    </CardContent>
    </Card>
  );
}

function SambatProductCard({ product }: { product: any }) {
  const { user } = useUser();
  const navigate = useNavigate();
  const toggleLike = useMutation(api.marketplace.toggleSambatProductLike);
  const toggleBookmark = useMutation(api.bookmarks.toggleBookmark);
  const incrementViews = useMutation(
    api.marketplace.incrementSambatProductViews,
  );
  const hasLiked = useQuery(
    api.marketplace.hasUserLikedSambatProduct,
    user ? { sambatProductId: product._id, userId: user.id as any } : "skip",
  );
  const hasEnrolled = useQuery(
    api.marketplace.hasUserEnrolledSambat,
    user ? { sambatProductId: product._id, userId: user.id as any } : "skip",
  );
  const bookmarks = useQuery(
    api.bookmarks.getBookmarksByUser,
    user ? { userId: user.id as any, type: "product" } : "skip",
  );

  const handleCardClick = () => {
    incrementViews({ sambatProductId: product._id });
    navigate(`/marketplace/sambat/${product._id}`);
  };

  const handleLike = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleLike({ sambatProductId: product._id });
    }
  };

  const handleBookmark = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (user) {
      toggleBookmark({ itemId: product._id, type: "product" });
    }
  };
  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    const url = `${window.location.origin}/marketplace/sambat/${product._id}`;
    const shareData = { title: product.title, url };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(url);
      alert("Link disalin");
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
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

  return (
    <Card
      className="neumorphic-card cursor-pointer transition-all duration-300 hover:scale-105 border-0 relative overflow-hidden"
      onClick={handleCardClick}
    >
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-pink-500"></div>

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
        <button
          onClick={handleBookmark}
          className={`absolute top-3 right-12 p-2 rounded-full neumorphic-button-sm transition-colors ${
            bookmarks?.some((b: any) => b.data._id === product._id)
              ? "text-yellow-500"
              : "text-gray-400"
          }`}
        >
          <Bookmark className="h-4 w-4" />
        </button>
        <button
          onClick={handleShare}
          className="absolute top-3 right-20 p-2 rounded-full neumorphic-button-sm text-gray-400"
        >
          <Share className="h-4 w-4" />
        </button>
        <Badge className="absolute top-3 left-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white">
          SAMBAT
        </Badge>
        {hasEnrolled && (
          <Badge className="absolute bottom-3 right-3 bg-green-500 text-white">
            Terdaftar
          </Badge>
        )}
      </div>

      <CardContent className="p-4">
        <div className="space-y-3">
          <h3 className="font-semibold text-[#2d3748] line-clamp-2">
            {product.title}
          </h3>
          <p className="text-sm text-[#718096] line-clamp-1">{product.brand}</p>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#718096]">Harga per porsi:</span>
              <span className="font-bold text-[#2d3748]">
                {formatPrice(product.pricePerPortion)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-[#718096]">Harga asli:</span>
              <span className="text-sm text-[#718096] line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-[#718096]">Progress:</span>
              <span className="text-[#2d3748] font-medium">
                {product.currentParticipants}/{product.maxParticipants}
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>

          <div className="flex items-center justify-between text-xs text-[#718096]">
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{getTimeLeft(product.deadline)}</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{product.views}</span>
              </div>
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{product.likes}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-3 w-3" />
                <span>{product.currentParticipants}</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1 text-xs text-[#718096]">
            <MapPin className="h-3 w-3" />
            <span>{product.location}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

function SambatDialog({ product }: { product: any }) {
  const { user } = useUser();
  const [message, setMessage] = useState("");
  const [offerPrice, setOfferPrice] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const createSambat = useMutation(api.marketplace.createSambat);

  const handleSubmit = async () => {
    if (!user || !message.trim()) return;

    try {
      await createSambat({
        productId: product._id,
        message: message.trim(),
        offerPrice: offerPrice ? parseInt(offerPrice) : undefined,
      });
      setMessage("");
      setOfferPrice("");
      setIsOpen(false);
    } catch (error) {
      console.error("Error creating sambat:", error);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="neumorphic-button flex-1 text-[#2d3748] bg-transparent border-0 shadow-none">
          <MessageCircle className="h-4 w-4 mr-2" />
          Sambat
        </Button>
      </DialogTrigger>
      <DialogContent className="neumorphic-card border-0">
        <DialogHeader>
          <DialogTitle className="text-[#2d3748]">
            Sambat untuk {product.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium text-[#2d3748] mb-2 block">
              Pesan Sambat
            </label>
            <Textarea
              placeholder="Tulis pesan sambat Anda..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="neumorphic-input border-0"
            />
          </div>

          {product.isNegotiable && (
            <div>
              <label className="text-sm font-medium text-[#2d3748] mb-2 block">
                Tawaran Harga (Opsional)
              </label>
              <Input
                type="number"
                placeholder={`Harga saat ini: ${formatPrice(product.price)}`}
                value={offerPrice}
                onChange={(e) => setOfferPrice(e.target.value)}
                className="neumorphic-input border-0"
              />
            </div>
          )}

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="flex-1 neumorphic-button-sm text-[#718096] bg-transparent border-0"
            >
              Batal
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={!message.trim()}
              className="flex-1 neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
            >
              Kirim Sambat
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function CartDialog({
  cart,
  onRemove,
  onCheckout,
}: {
  cart: CartItem[];
  onRemove: (id: string) => void;
  onCheckout: () => void;
}) {
  const [open, setOpen] = useState(false);
  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  const total = cart.reduce((sum, i) => sum + i.price, 0);
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="fixed bottom-6 right-6 rounded-full neumorphic-button p-4">
          <ShoppingCart className="h-5 w-5" />
          {cart.length > 0 && (
            <span className="ml-2 text-sm">{cart.length}</span>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent className="neumorphic-card border-0 max-w-md">
        <DialogHeader>
          <DialogTitle>Keranjang</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {cart.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between"
            >
              <span className="flex-1 mr-2 line-clamp-1">{item.title}</span>
              <span className="text-sm">{formatPrice(item.price)}</span>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => onRemove(item.id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
          {cart.length === 0 && (
            <p className="text-center text-sm text-[#718096]">Keranjang kosong</p>
          )}
          <div className="flex justify-between font-semibold border-t pt-2">
            <span>Total</span>
            <span>{formatPrice(total)}</span>
          </div>
          <Button
            onClick={() => {
              setOpen(false);
              onCheckout();
            }}
            disabled={cart.length === 0}
          >
            Checkout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Marketplace() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedCondition, setSelectedCondition] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showSambatProducts, setShowSambatProducts] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("marketplaceCart");
    if (stored) {
      setCart(JSON.parse(stored));
    }
  }, []);

  const addToCart = (item: CartItem) => {
    setCart((prev) => {
      if (prev.some((p) => p.id === item.id)) return prev;
      const updated = [...prev, item];
      localStorage.setItem("marketplaceCart", JSON.stringify(updated));
      return updated;
    });
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      localStorage.setItem("marketplaceCart", JSON.stringify(updated));
      return updated;
    });
  };

  const products = useQuery(api.marketplace.getProducts, {
    paginationOpts: { numItems: 20, cursor: null },
    category: selectedCategory === "all" ? undefined : selectedCategory,
    condition: selectedCondition === "all" ? undefined : selectedCondition,
    minPrice: minPrice ? parseInt(minPrice) : undefined,
    maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
    sortBy,
    searchQuery: searchQuery || undefined,
    location: location || undefined,
  });

  const sambatProducts = useQuery(api.marketplace.getSambatProducts, {
    paginationOpts: { numItems: 20, cursor: null },
    category: selectedCategory === "all" ? undefined : selectedCategory,
    sortBy,
    searchQuery: searchQuery || undefined,
    location: location || undefined,
  });

  const stats = useQuery(api.marketplace.getMarketplaceStats);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-[#2d3748] mb-4">
              Marketplace Parfum
            </h1>
            <p className="text-lg text-[#718096] mb-8">
              Jual beli parfum terpercaya dengan sistem sambat yang unik
            </p>

            {/* Stats */}
            {stats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                <div className="neumorphic-card p-4">
                  <div className="text-2xl font-bold text-[#667eea]">
                    {stats.activeProducts}
                  </div>
                  <div className="text-sm text-[#718096]">Produk Aktif</div>
                </div>
                <div className="neumorphic-card p-4">
                  <div className="text-2xl font-bold text-[#667eea]">
                    {stats.soldProducts}
                  </div>
                  <div className="text-sm text-[#718096]">Terjual</div>
                </div>
                <div className="neumorphic-card p-4">
                  <div className="text-2xl font-bold text-[#667eea]">
                    {stats.totalOrders}
                  </div>
                  <div className="text-sm text-[#718096]">Total Order</div>
                </div>
                <div className="neumorphic-card p-4">
                  <div className="text-2xl font-bold text-[#667eea]">
                    {new Intl.NumberFormat("id-ID", {
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(stats.totalValue)}
                  </div>
                  <div className="text-sm text-[#718096]">Total Nilai</div>
                </div>
              </div>
            )}
          </div>

          {/* Search and Filters */}
          <div className="neumorphic-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#718096]" />
                <Input
                  placeholder="Cari parfum, brand, atau kategori..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="neumorphic-input pl-10 border-0"
                />
              </div>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="sambat-toggle"
                  className="text-sm text-[#2d3748]"
                >
                  Sambat
                </Label>
                <Switch
                  id="sambat-toggle"
                  checked={showSambatProducts}
                  onCheckedChange={setShowSambatProducts}
                />
              </div>
              <div className="flex items-center gap-2 neumorphic-button-sm p-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className={`p-2 ${viewMode === "grid" ? "bg-white shadow-inner" : ""}`}
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className={`p-2 ${viewMode === "list" ? "bg-white shadow-inner" : ""}`}
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="neumorphic-button-sm text-[#2d3748] bg-transparent border-0 shadow-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
              <Button
                onClick={() => navigate("/marketplace/sell")}
                className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
              >
                <Plus className="h-4 w-4 mr-2" />
                Jual Produk
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 pt-4 border-t border-[#e2e8f0]">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="neumorphic-input border-0">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent className="neumorphic-card border-0">
                    <SelectItem value="all">Semua Kategori</SelectItem>
                    {CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={selectedCondition}
                  onValueChange={setSelectedCondition}
                >
                  <SelectTrigger className="neumorphic-input border-0">
                    <SelectValue placeholder="Kondisi" />
                  </SelectTrigger>
                  <SelectContent className="neumorphic-card border-0">
                    <SelectItem value="all">Semua Kondisi</SelectItem>
                    {CONDITIONS.map((condition) => (
                      <SelectItem key={condition.value} value={condition.value}>
                        {condition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Input
                  placeholder="Harga Min"
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  className="neumorphic-input border-0"
                />

                <Input
                  placeholder="Harga Max"
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  className="neumorphic-input border-0"
                />

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
              </div>
            )}
          </div>

          {/* Products Section */}
          <div className="mb-8">
            <div className="flex items-center gap-4 mb-6">
              <h2 className="text-2xl font-bold text-[#2d3748]">
                {showSambatProducts ? "Produk Sambatan" : "Produk Reguler"}
              </h2>
              {showSambatProducts && (
                <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white">
                  <Zap className="h-3 w-3 mr-1" />
                  Group Buying
                </Badge>
              )}
            </div>

            {showSambatProducts ? (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {sambatProducts?.page?.map((product) => (
                  <SambatProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div
                className={`grid gap-6 ${
                  viewMode === "grid"
                    ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                    : "grid-cols-1"
                }`}
              >
                {products?.page?.map((product) => (
                  <ProductCard
                    key={product._id}
                    product={product}
                    viewMode={viewMode}
                    onAddToCart={addToCart}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Empty State */}
          {((showSambatProducts && sambatProducts?.page?.length === 0) ||
            (!showSambatProducts && products?.page?.length === 0)) && (
            <div className="text-center py-16">
              <div className="neumorphic-card-inset p-12 max-w-md mx-auto">
                {showSambatProducts ? (
                  <Users className="h-16 w-16 text-[#718096] mx-auto mb-4" />
                ) : (
                  <ShoppingCart className="h-16 w-16 text-[#718096] mx-auto mb-4" />
                )}
                <h3 className="text-xl font-semibold text-[#2d3748] mb-2">
                  {showSambatProducts
                    ? "Tidak ada produk sambatan ditemukan"
                    : "Tidak ada produk ditemukan"}
                </h3>
                <p className="text-[#718096] mb-6">
                  {showSambatProducts
                    ? "Belum ada sambatan yang tersedia saat ini"
                    : "Coba ubah filter pencarian atau kata kunci Anda"}
                </p>
                <div className="flex gap-3 justify-center">
                  <Button
                    onClick={() => {
                      setSearchQuery("");
                      setSelectedCategory("all");
                      setSelectedCondition("all");
                      setMinPrice("");
                      setMaxPrice("");
                      setLocation("");
                    }}
                    className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                  >
                    Reset Filter
                  </Button>
                  {showSambatProducts && (
                    <Button
                      onClick={() => setShowSambatProducts(false)}
                      className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                    >
                      Lihat Produk Reguler
                    </Button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="neumorphic-card p-6 text-center">
              <Shield className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                Transaksi Aman
              </h3>
              <p className="text-[#718096]">
                Sistem pembayaran virtual account yang aman dan terpercaya
              </p>
            </div>

            <div className="neumorphic-card p-6 text-center">
              <MessageCircle className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                Fitur Sambat
              </h3>
              <p className="text-[#718096]">
                Ekspresikan keinginan membeli dengan fitur sambat yang unik
              </p>
            </div>

            <div className="neumorphic-card p-6 text-center">
              <Users className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                Group Buying
              </h3>
              <p className="text-[#718096]">
                Bergabung dalam pembelian grup untuk harga lebih murah
              </p>
            </div>

            <div className="neumorphic-card p-6 text-center">
              <Truck className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                Pengiriman Fleksibel
              </h3>
              <p className="text-[#718096]">
                Berbagai pilihan metode pengiriman sesuai kebutuhan
              </p>
            </div>
          </div>
        </div>
      </main>
      <CartDialog
        cart={cart}
        onRemove={removeFromCart}
        onCheckout={() => navigate("/marketplace/checkout")}
      />
    </div>
  );
}
