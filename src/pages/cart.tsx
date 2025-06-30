import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Plus, Minus } from "lucide-react";

export type CartItem = {
  id: string;
  title: string;
  price: number;
  quantity?: number;
};

export default function CartPage() {
  const navigate = useNavigate();
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("marketplaceCart");
    if (stored) {
      const items = JSON.parse(stored).map((i: any) => ({
        ...i,
        quantity: i.quantity || 1,
      }));
      setCart(items);
    }
  }, []);

  const updateStorage = (items: CartItem[]) => {
    localStorage.setItem("marketplaceCart", JSON.stringify(items));
  };

  const changeQty = (id: string, qty: number) => {
    setCart((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, quantity: qty } : item,
      );
      updateStorage(updated);
      return updated;
    });
  };

  const increment = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    changeQty(id, (item.quantity || 1) + 1);
  };

  const decrement = (id: string) => {
    const item = cart.find((i) => i.id === id);
    if (!item) return;
    const newQty = Math.max(1, (item.quantity || 1) - 1);
    changeQty(id, newQty);
  };

  const removeItem = (id: string) => {
    setCart((prev) => {
      const updated = prev.filter((i) => i.id !== id);
      updateStorage(updated);
      return updated;
    });
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);

  const subtotal = cart.reduce(
    (s, i) => s + i.price * (i.quantity || 1),
    0,
  );

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow container mx-auto px-4 py-8 max-w-lg space-y-4">
        <h1 className="text-2xl font-semibold">Keranjang</h1>
        {cart.length === 0 ? (
          <p className="text-center text-sm text-[#718096]">Keranjang kosong</p>
        ) : (
          <div className="space-y-4">
            {cart.map((item) => (
              <div
                key={item.id}
                className="flex items-center justify-between"
              >
                <div className="flex-1 mr-2">
                  <p className="line-clamp-1 font-medium">{item.title}</p>
                  <p className="text-sm">{formatPrice(item.price)}</p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => decrement(item.id)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    className="w-12 h-8 text-center"
                    type="number"
                    min={1}
                    value={item.quantity || 1}
                    onChange={(e) =>
                      changeQty(item.id, Math.max(1, parseInt(e.target.value) || 1))
                    }
                  />
                  <Button
                    size="icon"
                    variant="outline"
                    onClick={() => increment(item.id)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => removeItem(item.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Button onClick={() => navigate("/marketplace/checkout")}>Checkout</Button>
          </div>
        )}
      </main>
    </div>
  );
}
