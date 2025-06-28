import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import {
  Package,
  ShoppingCart,
  DollarSign,
  TrendingUp,
  Eye,
  Star,
  Plus,
  BarChart3,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";

export default function MarketplaceConsole() {
  return (
    <ProtectedRoute>
      <MarketplaceConsoleContent />
    </ProtectedRoute>
  );
}

function MarketplaceConsoleContent() {
  const { user } = useUser();
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const marketplaceStats = useQuery(api.marketplace.getMarketplaceStats);
  const userProducts = useQuery(
    api.marketplace.getProductsBySeller,
    userData ? { sellerId: userData._id } : "skip",
  );
  const userOrders = useQuery(
    api.marketplace.getOrdersByUser,
    userData ? { userId: userData._id, type: "buyer" } : "skip",
  );
  const userSales = useQuery(
    api.marketplace.getOrdersByUser,
    userData ? { userId: userData._id, type: "seller" } : "skip",
  );

  const sellerAnalytics = useQuery(
    api.marketplace.getSellerAnalytics,
    userData ? { sellerId: userData._id } : "skip",
  );

  const totalRevenue = sellerAnalytics?.totalRevenue ?? 0;
  const thisMonthRevenue = sellerAnalytics?.thisMonthRevenue ?? 0;
  const activeProducts = sellerAnalytics?.activeProducts ?? 0;
  const soldProducts = sellerAnalytics?.soldProducts ?? 0;
  const totalViews = sellerAnalytics?.totalViews ?? 0;
  const avgViews = Math.round(
    totalViews / (sellerAnalytics?.totalProducts || 1),
  );

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="relative mb-12">
            <div className="absolute inset-x-0 -top-16 -bottom-16 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
                  Konsol Marketplace
                </h1>
                <p className="text-xl text-[#86868B] max-w-[600px] leading-relaxed">
                  Kelola penjualan, lihat riwayat pembelian, dan analisis
                  performa produk Anda
                </p>
              </div>
              <Link to="/marketplace/sell">
                <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none hover:scale-105 active:scale-95 transition-all">
                  <Plus className="h-4 w-4 mr-2" />
                  Jual Produk Baru
                </Button>
              </Link>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
            <div className="neumorphic-card p-6 text-center">
              <div className="neumorphic-card-inset w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="h-6 w-6 text-[#667eea]" />
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                {activeProducts}
              </div>
              <div className="text-sm text-[#86868B]">Produk Aktif</div>
            </div>
            <div className="neumorphic-card p-6 text-center">
              <div className="neumorphic-card-inset w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="h-6 w-6 text-[#667eea]" />
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                {soldProducts}
              </div>
              <div className="text-sm text-[#86868B]">Produk Terjual</div>
            </div>
            <div className="neumorphic-card p-6 text-center">
              <div className="neumorphic-card-inset w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <DollarSign className="h-6 w-6 text-[#667eea]" />
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(totalRevenue)}
              </div>
              <div className="text-sm text-[#86868B]">Total Pendapatan</div>
            </div>
            <div className="neumorphic-card p-6 text-center">
              <div className="neumorphic-card-inset w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-[#667eea]" />
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                {new Intl.NumberFormat("id-ID", {
                  style: "currency",
                  currency: "IDR",
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(thisMonthRevenue)}
              </div>
              <div className="text-sm text-[#86868B]">Pendapatan Bulan Ini</div>
            </div>
            <div className="neumorphic-card p-6 text-center">
              <div className="neumorphic-card-inset w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                <Eye className="h-6 w-6 text-[#667eea]" />
              </div>
              <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                {totalViews}
              </div>
              <div className="text-sm text-[#86868B]">Total Views</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Sales Management */}
            <Card className="neumorphic-card border-0 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1D1D1F]">
                  <Package className="h-5 w-5 text-[#667eea]" />
                  Manajemen Penjualan
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!userProducts || userProducts.length === 0 ? (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-[#86868B] mx-auto mb-4 opacity-50" />
                    <p className="text-[#86868B] mb-4">
                      Anda belum memiliki produk untuk dijual
                    </p>
                    <Link to="/marketplace/sell">
                      <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none">
                        Mulai Jual Produk
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userProducts.slice(0, 3).map((product) => (
                      <div
                        key={product._id}
                        className="neumorphic-card-inset p-4 transition-all hover:scale-[1.02]"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  product.status === "active"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {product.status === "active"
                                  ? "Aktif"
                                  : "Tidak Aktif"}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-[#1D1D1F] mb-1">
                              {product.title}
                            </h4>
                            <p className="text-sm text-[#86868B] mb-2">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(product.price)}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-[#86868B]">
                              <span className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                {product.views || 0}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {userProducts.length > 3 && (
                      <div className="text-center pt-4">
                        <Link to="/marketplace/my-shop">
                          <Button
                            variant="outline"
                            className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                          >
                            Lihat Semua Produk ({userProducts.length})
                          </Button>
                        </Link>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Purchase History */}
            <Card className="neumorphic-card border-0 shadow-none">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-[#1D1D1F]">
                  <ShoppingCart className="h-5 w-5 text-[#667eea]" />
                  Riwayat Pembelian
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!userOrders || userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <ShoppingCart className="h-12 w-12 text-[#86868B] mx-auto mb-4 opacity-50" />
                    <p className="text-[#86868B]">
                      Anda belum melakukan pembelian
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.slice(0, 3).map((order) => (
                      <div
                        key={order._id}
                        className="neumorphic-card-inset p-4"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge
                                variant={
                                  order.orderStatus === "delivered" || order.orderStatus === "finished"
                                    ? "default"
                                    : "secondary"
                                }
                                className="text-xs"
                              >
                                {order.orderStatus === "delivered" || order.orderStatus === "finished"
                                  ? "Selesai"
                                  : order.orderStatus === "pending"
                                    ? "Pending"
                                    : "Dibatalkan"}
                              </Badge>
                            </div>
                            <h4 className="font-semibold text-[#1D1D1F] mb-1">
                              Order #{order._id.slice(-8)}
                            </h4>
                            <p className="text-sm text-[#86868B] mb-2">
                              {new Intl.NumberFormat("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              }).format(order.totalAmount)}
                            </p>
                            <div className="flex items-center gap-4 text-xs text-[#86868B]">
                              <span className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                {new Date(
                                  order._creationTime,
                                ).toLocaleDateString("id-ID")}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                    {userOrders.length > 3 && (
                      <div className="text-center pt-4">
                        <Button
                          variant="outline"
                          className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                        >
                          Lihat Semua Pesanan ({userOrders.length})
                        </Button>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Analytics Section */}
          <Card className="neumorphic-card border-0 shadow-none mt-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-[#1D1D1F]">
                <BarChart3 className="h-5 w-5 text-[#667eea]" />
                Analisis Penjualan
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <TrendingUp className="h-6 w-6 text-green-600" />
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                    {new Intl.NumberFormat("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      notation: "compact",
                      maximumFractionDigits: 1,
                    }).format(thisMonthRevenue)}
                  </div>
                  <div className="text-sm text-[#86868B]">Pendapatan Bulan Ini</div>
                </div>
                <div className="text-center">
                  <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Eye className="h-6 w-6 text-[#667eea]" />
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                    {avgViews}
                  </div>
                  <div className="text-sm text-[#86868B]">
                    Rata-rata Views per Produk
                  </div>
                </div>
                <div className="text-center">
                  <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                    <Star className="h-6 w-6 text-yellow-500" />
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                    {sellerAnalytics?.averageRating ?? 0}
                  </div>
                  <div className="text-sm text-[#86868B]">Rating Rata-rata</div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/marketplace/sell">
              <Button className="neumorphic-button w-full bg-transparent text-[#2d3748] font-semibold border-0 shadow-none hover:scale-105 active:scale-95 transition-all">
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk Baru
              </Button>
            </Link>
            <Link to="/marketplace/my-shop">
              <Button
                variant="outline"
                className="neumorphic-button-sm w-full bg-transparent text-[#718096] border-0 shadow-none hover:scale-105 active:scale-95 transition-all"
              >
                <Package className="h-4 w-4 mr-2" />
                Kelola Toko Saya
              </Button>
            </Link>
            <Link to="/marketplace">
              <Button
                variant="outline"
                className="neumorphic-button-sm w-full bg-transparent text-[#718096] border-0 shadow-none hover:scale-105 active:scale-95 transition-all"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Jelajahi Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
