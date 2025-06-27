import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Star, Share, Instagram, Twitter } from "lucide-react";
import { Helmet } from "react-helmet";

export default function MarketplaceProduct() {
  const { id } = useParams();
  const product = useQuery(
    api.marketplace.getProductById,
    id ? { productId: id as any } : "skip",
  );
  const reviews = useQuery(
    api.marketplace.getReviewsByProduct,
    id ? { productId: id as any } : "skip",
  );

  if (product === undefined) return <div>Loading...</div>;
  if (product === null) return <div>Produk tidak ditemukan</div>;

  const averageRating =
    reviews && reviews.length > 0
      ? reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
      : 0;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const handleShare = (platform?: string) => {
    const url = `${window.location.origin}/marketplace/product/${product._id}`;
    const shareData = { title: product.title, url };
    if (navigator.share) {
      navigator.share(shareData);
    } else {
      navigator.clipboard.writeText(url);
      alert("Link disalin");
    }
    if (platform === "whatsapp") {
      window.open(
        `https://wa.me/?text=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (platform === "twitter") {
      window.open(
        `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`,
        "_blank",
      );
    } else if (platform === "instagram") {
      navigator.clipboard.writeText(url);
      alert("Link disalin");
    }
  };

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Helmet>
        <title>{`${product.title} - Marketplace - Sensasi Wangi`}</title>
        <meta
          name="description"
          content={product.description || "Product details on Sensasi Wangi"}
        />
      </Helmet>
      <main className="flex-grow container mx-auto px-4 py-8 space-y-8">
        <div className="flex flex-col md:flex-row gap-8">
          <img
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1541643600914-78b084683601?w=600&q=80"
            }
            alt={product.title}
            className="w-full md:w-1/2 rounded-3xl object-cover"
          />
          <div className="flex-1 space-y-4">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p className="text-gray-500">{product.brand}</p>
            {reviews && reviews.length > 0 && (
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <Star
                    key={n}
                    className={`h-4 w-4 ${
                      averageRating >= n
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-gray-300"
                    }`}
                  />
                ))}
                <span>{averageRating.toFixed(1)}</span>
              </div>
            )}
            <p className="text-2xl font-bold">{formatPrice(product.price)}</p>
            {product.originalPrice && product.originalPrice > product.price && (
              <p className="text-gray-500 line-through">
                {formatPrice(product.originalPrice)}
              </p>
            )}
            <Button className="mt-4">Beli</Button>
            <div className="flex gap-2 mt-4">
              <Button
                variant="secondary"
                onClick={() => handleShare("whatsapp")}
              >
                <Share className="h-4 w-4 mr-2" /> WhatsApp
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleShare("twitter")}
              >
                <Twitter className="h-4 w-4 mr-2" /> Twitter
              </Button>
              <Button
                variant="secondary"
                onClick={() => handleShare("instagram")}
              >
                <Instagram className="h-4 w-4 mr-2" /> Instagram
              </Button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-xl font-semibold mb-4">Deskripsi</h2>
          <p>{product.description}</p>
        </div>
        {reviews && reviews.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold mb-4">Ulasan</h2>
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review._id} className="border rounded-xl p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {[1, 2, 3, 4, 5].map((n) => (
                      <Star
                        key={n}
                        className={`h-3 w-3 ${
                          review.rating >= n
                            ? "text-yellow-500 fill-yellow-500"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p>{review.comment}</p>
                  <div className="text-sm text-gray-500">{review.reviewerName}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

