import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserStats } from "@/components/UserStats";
import { ActivityMetrics } from "@/components/ActivityMetrics";
import {
  ArrowRight,
  User,
  Database,
  Clock,
  Shield,
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
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";

export default function Dashboard() {
  const { user } = useUser();
  const [activeTab, setActiveTab] = useState("overview");
  const userData = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );

  const userTopics = useQuery(
    api.forum.getTopicsByAuthor,
    userData ? { authorId: userData._id } : "skip",
  );

  const userComments = useQuery(
    api.forum.getCommentsByAuthor,
    userData ? { authorId: userData._id } : "skip",
  );

  // Marketplace data
  const marketplaceStats = useQuery(api.marketplace.getMarketplaceStats);
  const userProducts = useQuery(
    api.marketplace.getProductsBySeller,
    userData ? { sellerId: userData._id } : "skip",
  );
  const userBuyerOrders = useQuery(
    api.marketplace.getOrdersByUser,
    userData ? { userId: userData._id, type: "buyer" } : "skip",
  );
  const userSellerOrders = useQuery(
    api.marketplace.getOrdersByUser,
    userData ? { userId: userData._id, type: "seller" } : "skip",
  );

  const totalRevenue =
    userSellerOrders
      ?.filter((o) => o.orderStatus === "delivered" || o.orderStatus === "finished")
      .reduce((sum, order) => sum + order.totalAmount, 0) || 0;
  const activeProducts =
    userProducts?.filter((p) => p.status === "active").length || 0;
  const soldProducts =
    userProducts?.filter((p) => p.status === "sold").length || 0;
  const totalViews =
    userProducts?.reduce((sum, p) => sum + (p.views || 0), 0) || 0;
  const totalLikes =
    userProducts?.reduce((sum, p) => sum + (p.likes || 0), 0) || 0;
  const totalSambats =
    userProducts?.reduce((sum, p) => sum + (p.sambatCount || 0), 0) || 0;

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          <div className="relative mb-12">
            <div className="absolute inset-x-0 -top-16 -bottom-16 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
            <h1 className="text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
              Dashboard Anda
            </h1>
            <p className="text-xl text-[#86868B] max-w-[600px] leading-relaxed mb-8">
              Lihat dan kelola informasi akun serta data pengguna Anda dalam
              satu tempat.
            </p>
          </div>

          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="neumorphic-card p-1 mb-8">
              <TabsTrigger
                value="overview"
                className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none data-[state=active]:bg-white data-[state=active]:text-[#1D1D1F] data-[state=active]:shadow-inner"
              >
                <User className="h-4 w-4 mr-2" />
                Ringkasan
              </TabsTrigger>
              <TabsTrigger
                value="marketplace"
                className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none data-[state=active]:bg-white data-[state=active]:text-[#1D1D1F] data-[state=active]:shadow-inner"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                Marketplace
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-12">
              {/* User Stats Section */}
              <UserStats
                level={
                  Math.floor((userData?.contributionPoints || 0) / 100) + 1
                }
                contributionPoints={userData?.contributionPoints || 0}
                postsCount={userTopics?.length || 0}
                likesReceived={
                  userTopics?.reduce((sum, t) => sum + t.likes, 0) || 0
                }
                commentsCount={userComments?.length || 0}
                joinDate={new Date(user?.createdAt || "").toLocaleDateString()}
                badges={userData?.badges || []}
                weeklyGoal={100}
                weeklyProgress={(userData?.contributionPoints || 0) % 100}
              />

              {/* Activity Metrics */}
              <ActivityMetrics
                posts={userTopics || []}
                comments={userComments || []}
              />

              {/* Quick Actions */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Link to="/profile" className="block">
                  <div className="neumorphic-card p-6 text-center transition-all hover:scale-105 active:scale-95">
                    <User className="h-8 w-8 text-[#667eea] mx-auto mb-3" />
                    <h3 className="font-semibold text-[#1D1D1F] mb-2">
                      Profil Saya
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Kelola informasi profil dan aktivitas forum
                    </p>
                  </div>
                </Link>
                <div
                  className="block cursor-pointer"
                  onClick={() => setActiveTab("marketplace")}
                >
                  <div className="neumorphic-card p-6 text-center transition-all hover:scale-105 active:scale-95">
                    <ShoppingCart className="h-8 w-8 text-[#667eea] mx-auto mb-3" />
                    <h3 className="font-semibold text-[#1D1D1F] mb-2">
                      Konsol Marketplace
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Kelola penjualan dan riwayat pembelian
                    </p>
                  </div>
                </div>
                <Link to="/forum" className="block">
                  <div className="neumorphic-card p-6 text-center transition-all hover:scale-105 active:scale-95">
                    <Database className="h-8 w-8 text-[#667eea] mx-auto mb-3" />
                    <h3 className="font-semibold text-[#1D1D1F] mb-2">Forum</h3>
                    <p className="text-sm text-[#86868B]">
                      Diskusi dan berbagi pengalaman parfum
                    </p>
                  </div>
                </Link>
                <Link to="/collections" className="block">
                  <div className="neumorphic-card p-6 text-center transition-all hover:scale-105 active:scale-95">
                    <Package className="h-8 w-8 text-[#667eea] mx-auto mb-3" />
                    <h3 className="font-semibold text-[#1D1D1F] mb-2">
                      Koleksi
                    </h3>
                    <p className="text-sm text-[#86868B]">
                      Lihat dan kelola koleksi parfum Anda
                    </p>
                  </div>
                </Link>
              </div>
            </TabsContent>

            <TabsContent value="marketplace" className="space-y-8">
              {/* Marketplace Console Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-3xl font-semibold text-[#1D1D1F] tracking-tight mb-2">
                    Konsol Marketplace
                  </h2>
                  <p className="text-lg text-[#86868B] max-w-[600px] leading-relaxed">
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

              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
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
                    <Eye className="h-6 w-6 text-[#667eea]" />
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                    {totalViews}
                  </div>
                  <div className="text-sm text-[#86868B]">Total Views</div>
                </div>
                <div className="neumorphic-card p-6 text-center">
                  <div className="neumorphic-card-inset w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MessageCircle className="h-6 w-6 text-[#667eea]" />
                  </div>
                  <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                    {totalSambats}
                  </div>
                  <div className="text-sm text-[#86868B]">Total Sambat</div>
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
                    {!userBuyerOrders || userBuyerOrders.length === 0 ? (
                      <div className="text-center py-8">
                        <ShoppingCart className="h-12 w-12 text-[#86868B] mx-auto mb-4 opacity-50" />
                        <p className="text-[#86868B]">
                          Anda belum melakukan pembelian
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userBuyerOrders.slice(0, 3).map((order) => (
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
                                        : order.orderStatus === "shipped"
                                          ? "Dikirim"
                                          : "Dibatalkan"}
                                  </Badge>
                                </div>
                                <h4 className="font-semibold text-[#1D1D1F] mb-1">
                                  {order.productTitle}
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
                                      order.createdAt,
                                    ).toLocaleDateString("id-ID")}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                        {userBuyerOrders.length > 3 && (
                          <div className="text-center pt-4">
                            <Button
                              variant="outline"
                              className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                            >
                              Lihat Semua Pesanan ({userBuyerOrders.length})
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
                        +12%
                      </div>
                      <div className="text-sm text-[#86868B]">
                        Penjualan Bulan Ini
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
                        <ArrowUpRight className="h-3 w-3" />
                        Naik dari bulan lalu
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Eye className="h-6 w-6 text-[#667eea]" />
                      </div>
                      <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                        {Math.round(totalViews / (userProducts?.length || 1))}
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
                        4.8
                      </div>
                      <div className="text-sm text-[#86868B]">
                        Rating Rata-rata
                      </div>
                      <div className="flex items-center justify-center gap-1 text-xs text-green-600 mt-1">
                        <ArrowUpRight className="h-3 w-3" />
                        Meningkat 0.2 poin
                      </div>
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
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function DataCard({
  title,
  children,
  icon,
  className = "",
}: {
  title: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`neumorphic-card p-8 transition-all ${className}`}>
      <div className="flex items-center gap-2 mb-4">
        {icon && <div className="flex-shrink-0">{icon}</div>}
        <h2 className="text-lg font-semibold text-[#1D1D1F]">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function DataRow({
  label,
  value,
}: {
  label: string;
  value: string | number | null | undefined;
}) {
  return (
    <div className="flex justify-between py-2 border-b border-[#F5F5F7] last:border-0">
      <span className="text-[#1D1D1F] font-medium">{value || "—"}</span>
    </div>
  );
}

function formatDate(timestamp: number | undefined) {
  if (!timestamp) return "—";
  return new Date(timestamp).toLocaleDateString();
}

function formatCurrency(amount: number | undefined, currency: string = "USD") {
  if (amount === undefined) return "—";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount / 100);
}

function StatusBadge({ status }: { status: string | undefined }) {
  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case "active":
        return "bg-[#E3F2E3] text-[#1D8A1D]";
      case "canceled":
        return "bg-[#FFEAEA] text-[#D93025]";
      default:
        return "bg-[#F5F5F7] text-[#86868B]";
    }
  };

  return (
    <span
      className={`px-3 py-1 rounded-[14px] text-sm font-medium ${getStatusColor(status)}`}
    >
      {status || "Tidak ada status"}
    </span>
  );
}
