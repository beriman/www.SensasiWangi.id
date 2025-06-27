import { useParams } from "react-router-dom";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Progress } from "@/components/ui/progress";
import { Helmet } from "react-helmet";

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
  if (product === null) return <div>Produk sambatan tidak ditemukan</div>;

  const progress =
    (product.currentParticipants / product.maxParticipants) * 100;

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const formatDate = (timestamp: number) =>
    new Date(timestamp).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Helmet>
        <title>{`${product.title} - Sambat - Sensasi Wangi`}</title>
        <meta
          name="description"
          content={`Join a shared purchase of ${product.title}`}
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
            <h1 className="text-2xl font-semibold text-[#2d3748]">
              {product.title}
            </h1>
            <p className="text-[#718096]">{product.brand}</p>
            <div className="space-y-1">
              <p className="font-bold text-[#2d3748]">
                {formatPrice(product.pricePerPortion)} per {product.portionSize}
              </p>
              <p className="text-sm text-[#718096] line-through">
                {formatPrice(product.originalPrice)}
              </p>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-[#718096]">Progress</span>
                <span className="text-[#2d3748] font-medium">
                  {product.currentParticipants}/{product.maxParticipants} porsi
                </span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
            <div className="text-sm text-[#718096]">
              Lokasi: {product.location}
            </div>
            <div className="text-sm text-[#718096]">
              Deadline: {formatDate(product.deadline)}
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-xl font-semibold text-[#2d3748] mb-4">Peserta</h2>
          <div className="space-y-2">
            {enrollments?.map((e) => (
              <div
                key={e._id}
                className="neumorphic-card p-4 flex items-center justify-between"
              >
                <span>{e.userName}</span>
                <span>{e.portionsRequested} porsi</span>
                <span className="text-sm text-[#718096]">{e.paymentStatus}</span>
              </div>
            ))}
            {enrollments && enrollments.length === 0 && (
              <p className="text-[#718096]">Belum ada peserta</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
