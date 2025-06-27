import { useUser } from "@clerk/clerk-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";

export default function OrderReviewPage() {
  const { orderId } = useParams();
  const { register, handleSubmit } = useForm<{ rating: number; comment: string }>();
  const order = useQuery(
    api.marketplace.getOrderById,
    orderId ? { orderId: orderId as any } : "skip",
  );
  const createReview = useMutation(api.marketplace.createReview);
  const navigate = useNavigate();

  if (order === undefined) return <div>Loading...</div>;
  if (order === null) return <div>Order tidak ditemukan</div>;

  const onSubmit = handleSubmit(async (data) => {
    await createReview({
      orderId: order._id,
      rating: Number(data.rating),
      comment: data.comment,
    });
    navigate(`/marketplace/product/${order.productId}`);
  });

  if (order.orderStatus !== "delivered") {
    return <div>Pesanan belum selesai.</div>;
  }

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-16">
        <h1 className="text-2xl font-semibold mb-6">Berikan Ulasan</h1>
        <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
          <div>
            <Label htmlFor="rating">Rating</Label>
            <select id="rating" {...register("rating", { required: true })} className="w-full mt-1">
              {[1,2,3,4,5].map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>
          <div>
            <Label htmlFor="comment">Ulasan</Label>
            <Textarea id="comment" {...register("comment", { required: true })} />
          </div>
          <Button type="submit">Kirim</Button>
        </form>
      </main>
    </div>
  );
}
