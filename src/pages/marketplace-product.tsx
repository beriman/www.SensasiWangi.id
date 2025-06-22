import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/components/ui/use-toast";
import { Share, ArrowLeft } from "lucide-react";

export default function MarketplaceProduct() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const product = useQuery(
    api.marketplace.getProductById,
    productId ? { productId: productId as any } : "skip",
  );
  const shareUrl = `${window.location.origin}/marketplace/product/${productId}`;
  const [shortUrl, setShortUrl] = useState<string | null>(null);

  const getShortUrl = async () => {
    if (shortUrl) return shortUrl;
    try {
      const res = await fetch(
        `https://is.gd/create.php?format=simple&url=${encodeURIComponent(shareUrl)}`,
      );
      const txt = await res.text();
      setShortUrl(txt);
      return txt;
    } catch {
      setShortUrl(shareUrl);
      return shareUrl;
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      navigator.share({ title: product?.title, url: shareUrl });
    } else {
      await navigator.clipboard.writeText(shareUrl);
      toast({ title: "Link disalin" });
    }
  };

  const shareWhatsApp = async () => {
    const url = await getShortUrl();
    window.open(
      `https://wa.me/?text=${encodeURIComponent(`${product?.title} ${url}`)}`,
      "_blank",
    );
  };

  const shareTwitter = async () => {
    const url = await getShortUrl();
    window.open(
      `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        product?.title ?? "",
      )}&url=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const shareInstagram = async () => {
    const url = await getShortUrl();
    window.open(
      `https://www.instagram.com/stories/share/?url=${encodeURIComponent(url)}`,
      "_blank",
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  if (product === undefined) return <div>Loading...</div>;
  if (product === null) return <div>Produk tidak ditemukan</div>;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-8 space-y-4">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 w-fit neumorphic-button-sm border-0"
        >
          <ArrowLeft className="h-4 w-4" /> Kembali
        </Button>
        <div className="neumorphic-card p-4 space-y-4">
          <img
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1541643600914-78b084683601?w=400&q=80"
            }
            alt={product.title}
            className="w-full h-60 object-cover rounded-2xl"
          />
          <h1 className="text-2xl font-semibold">{product.title}</h1>
          <p className="text-sm text-[#718096]">{product.brand}</p>
          <p className="text-lg font-bold">{formatPrice(product.price)}</p>
          <p>{product.description}</p>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="neumorphic-button-sm" variant="outline">
                <Share className="h-4 w-4 mr-2" /> Bagikan
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="neumorphic-card border-0">
              <DropdownMenuItem onClick={handleShare}>Bagikan…</DropdownMenuItem>
              <DropdownMenuItem onClick={shareWhatsApp}>WhatsApp</DropdownMenuItem>
              <DropdownMenuItem onClick={shareTwitter}>Twitter</DropdownMenuItem>
              <DropdownMenuItem onClick={shareInstagram}>Instagram</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </main>
      <Footer />
    </div>
  );
}

