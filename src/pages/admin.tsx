import { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  BarChart3,
  Users,
  MessageSquare,
  Flag,
  TrendingUp,
  Shield,
  Settings,
  Eye,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function Admin() {
  const [activeTab, setActiveTab] = useState("overview");
  const navigate = useNavigate();

  const pendingOrders = useQuery(api.marketplace.getPendingOrders);
  const verifyPayment = useMutation(api.marketplace.verifyOrderPayment);
  const updateStatus = useMutation(api.marketplace.updateOrderStatus);

  // Mock data untuk demonstrasi
  const stats = {
    totalUsers: 1247,
    totalPosts: 3456,
    pendingReports: 12,
    activeDiscussions: 89,
  };

  const recentReports = [
    {
      id: 1,
      type: "Spam",
      content: "Posting berulang tentang produk...",
      reporter: "user123",
      status: "pending",
    },
    {
      id: 2,
      type: "Konten Tidak Pantas",
      content: "Komentar yang menyinggung...",
      reporter: "user456",
      status: "pending",
    },
    {
      id: 3,
      type: "Penipuan",
      content: "Penjualan produk palsu...",
      reporter: "user789",
      status: "resolved",
    },
  ];

  const recentUsers = [
    {
      id: 1,
      name: "Ahmad Rizki",
      email: "ahmad@email.com",
      joinDate: "2024-01-15",
      status: "active",
    },
    {
      id: 2,
      name: "Sari Dewi",
      email: "sari@email.com",
      joinDate: "2024-01-14",
      status: "active",
    },
    {
      id: 3,
      name: "Budi Santoso",
      email: "budi@email.com",
      joinDate: "2024-01-13",
      status: "suspended",
    },
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F7]">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-[#1D1D1F] mb-2">
            Panel Admin
          </h1>
          <p className="text-[#86868B]">
            Kelola konten, pengguna, dan analitik platform
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6"
        >
          <TabsList className="neumorphic-card border-0 p-1 bg-transparent">
            <TabsTrigger
              value="overview"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Ringkasan
            </TabsTrigger>
            <TabsTrigger
              value="moderation"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <Shield className="w-4 h-4 mr-2" />
              Moderasi
            </TabsTrigger>
            <TabsTrigger
              value="users"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <Users className="w-4 h-4 mr-2" />
              Pengguna
            </TabsTrigger>
            <TabsTrigger
              value="analytics"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Analitik
            </TabsTrigger>
            <TabsTrigger
              value="feedback"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <MessageSquare className="w-4 h-4 mr-2" />
              Masukan
            </TabsTrigger>
            <TabsTrigger
              value="orders"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <CheckCircle className="w-4 h-4 mr-2" />
              Pesanan
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Total Pengguna
                  </CardTitle>
                  <Users className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.totalUsers.toLocaleString()}
                  </div>
                  <p className="text-xs text-[#86868B]">+12% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Total Postingan
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.totalPosts.toLocaleString()}
                  </div>
                  <p className="text-xs text-[#86868B]">+8% dari bulan lalu</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Laporan Pending
                  </CardTitle>
                  <Flag className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.pendingReports}
                  </div>
                  <p className="text-xs text-[#86868B]">Perlu ditinjau</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Diskusi Aktif
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.activeDiscussions}
                  </div>
                  <p className="text-xs text-[#86868B]">Sedang berlangsung</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="text-[#1D1D1F]">
                    Aktivitas Terbaru
                  </CardTitle>
                  <CardDescription className="text-[#86868B]">
                    Ringkasan aktivitas platform hari ini
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-[#1D1D1F]">
                        15 pengguna baru bergabung
                      </p>
                      <p className="text-xs text-[#86868B]">2 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-[#1D1D1F]">
                        23 postingan baru dipublikasi
                      </p>
                      <p className="text-xs text-[#86868B]">4 jam yang lalu</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="text-sm text-[#1D1D1F]">
                        3 laporan baru diterima
                      </p>
                      <p className="text-xs text-[#86868B]">6 jam yang lalu</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="text-[#1D1D1F]">
                    Tren Mingguan
                  </CardTitle>
                  <CardDescription className="text-[#86868B]">
                    Performa platform minggu ini
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Pengguna Aktif
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +15%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Postingan Baru
                      </span>
                      <span className="text-sm font-medium text-green-600">
                        +8%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">Interaksi</span>
                      <span className="text-sm font-medium text-green-600">
                        +22%
                      </span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">Laporan</span>
                      <span className="text-sm font-medium text-red-600">
                        +3%
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="moderation" className="space-y-6">
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Moderasi Konten
                </CardTitle>
                <CardDescription className="text-[#86868B]">
                  Kelola laporan dan konten yang dilaporkan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1D1D1F]">
                        Jenis Laporan
                      </TableHead>
                      <TableHead className="text-[#1D1D1F]">Konten</TableHead>
                      <TableHead className="text-[#1D1D1F]">Pelapor</TableHead>
                      <TableHead className="text-[#1D1D1F]">Status</TableHead>
                      <TableHead className="text-[#1D1D1F]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentReports.map((report) => (
                      <TableRow key={report.id}>
                        <TableCell className="text-[#1D1D1F]">
                          {report.type}
                        </TableCell>
                        <TableCell className="text-[#86868B] max-w-xs truncate">
                          {report.content}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {report.reporter}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              report.status === "pending"
                                ? "destructive"
                                : "default"
                            }
                            className={
                              report.status === "pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }
                          >
                            {report.status === "pending"
                              ? "Pending"
                              : "Selesai"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Lihat
                            </Button>
                            {report.status === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="neumorphic-button-sm h-8 px-3 text-xs text-green-600"
                                >
                                  <CheckCircle className="w-3 h-3 mr-1" />
                                  Setuju
                                </Button>
                                <Button
                                  size="sm"
                                  className="neumorphic-button-sm h-8 px-3 text-xs text-red-600"
                                >
                                  <XCircle className="w-3 h-3 mr-1" />
                                  Tolak
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Manajemen Pengguna
                </CardTitle>
                <CardDescription className="text-[#86868B]">
                  Kelola akun pengguna dan status mereka
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1D1D1F]">Nama</TableHead>
                      <TableHead className="text-[#1D1D1F]">Email</TableHead>
                      <TableHead className="text-[#1D1D1F]">
                        Tanggal Bergabung
                      </TableHead>
                      <TableHead className="text-[#1D1D1F]">Status</TableHead>
                      <TableHead className="text-[#1D1D1F]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentUsers.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell className="text-[#1D1D1F] font-medium">
                          {user.name}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {user.email}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {user.joinDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "active"
                                ? "default"
                                : "destructive"
                            }
                            className={
                              user.status === "active"
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }
                          >
                            {user.status === "active"
                              ? "Aktif"
                              : "Ditangguhkan"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Lihat
                            </Button>
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs"
                            >
                              <Settings className="w-3 h-3 mr-1" />
                              Edit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="text-[#1D1D1F]">
                    Statistik Pengguna
                  </CardTitle>
                  <CardDescription className="text-[#86868B]">
                    Analisis aktivitas pengguna
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Pengguna Harian Aktif
                      </span>
                      <span className="text-sm font-medium text-[#1D1D1F]">
                        892
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-500 h-2 rounded-full"
                        style={{ width: "72%" }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Pengguna Mingguan Aktif
                      </span>
                      <span className="text-sm font-medium text-[#1D1D1F]">
                        1,247
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-500 h-2 rounded-full"
                        style={{ width: "85%" }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Tingkat Retensi
                      </span>
                      <span className="text-sm font-medium text-[#1D1D1F]">
                        68%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-purple-500 h-2 rounded-full"
                        style={{ width: "68%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="text-[#1D1D1F]">
                    Statistik Konten
                  </CardTitle>
                  <CardDescription className="text-[#86868B]">
                    Analisis konten dan interaksi
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Postingan per Hari
                      </span>
                      <span className="text-sm font-medium text-[#1D1D1F]">
                        45
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-500 h-2 rounded-full"
                        style={{ width: "60%" }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Komentar per Hari
                      </span>
                      <span className="text-sm font-medium text-[#1D1D1F]">
                        156
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-red-500 h-2 rounded-full"
                        style={{ width: "78%" }}
                      ></div>
                    </div>

                    <div className="flex justify-between items-center">
                      <span className="text-sm text-[#1D1D1F]">
                        Tingkat Engagement
                      </span>
                      <span className="text-sm font-medium text-[#1D1D1F]">
                        82%
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-teal-500 h-2 rounded-full"
                        style={{ width: "82%" }}
                      ></div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">Tren Bulanan</CardTitle>
                <CardDescription className="text-[#86868B]">
                  Performa platform dalam 6 bulan terakhir
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                  {["Jan", "Feb", "Mar", "Apr", "Mei", "Jun"].map(
                    (month, index) => (
                      <div key={month} className="text-center">
                        <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                          {Math.floor(Math.random() * 500) + 800}
                        </div>
                        <div className="text-xs text-[#86868B]">{month}</div>
                        <div className="text-xs text-green-600 mt-1">
                          +{Math.floor(Math.random() * 20) + 5}%
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="feedback" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Total Masukan
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">47</div>
                  <p className="text-xs text-[#86868B]">+5 minggu ini</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Saran
                  </CardTitle>
                  <MessageSquare className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">32</div>
                  <p className="text-xs text-[#86868B]">68% dari total</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Laporan Bug
                  </CardTitle>
                  <Flag className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">15</div>
                  <p className="text-xs text-[#86868B]">32% dari total</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Pending
                  </CardTitle>
                  <TrendingUp className="h-4 w-4 text-[#86868B]" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">8</div>
                  <p className="text-xs text-[#86868B]">Perlu ditinjau</p>
                </CardContent>
              </Card>
            </div>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Masukan & Laporan Terbaru
                </CardTitle>
                <CardDescription className="text-[#86868B]">
                  Kelola saran dan laporan bug dari pengguna
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1D1D1F]">Jenis</TableHead>
                      <TableHead className="text-[#1D1D1F]">Subjek</TableHead>
                      <TableHead className="text-[#1D1D1F]">Pengirim</TableHead>
                      <TableHead className="text-[#1D1D1F]">Status</TableHead>
                      <TableHead className="text-[#1D1D1F]">
                        Prioritas
                      </TableHead>
                      <TableHead className="text-[#1D1D1F]">Tanggal</TableHead>
                      <TableHead className="text-[#1D1D1F]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          Saran
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#1D1D1F] max-w-xs truncate">
                        Tambahkan fitur notifikasi real-time
                      </TableCell>
                      <TableCell className="text-[#86868B]">
                        Ahmad Rizki
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-orange-100 text-orange-800">
                          High
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#86868B]">
                        2024-01-15
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="neumorphic-button-sm h-8 px-3 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Lihat
                          </Button>
                          <Button
                            size="sm"
                            className="neumorphic-button-sm h-8 px-3 text-xs text-green-600"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Proses
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">Bug</Badge>
                      </TableCell>
                      <TableCell className="text-[#1D1D1F] max-w-xs truncate">
                        Error saat upload gambar produk
                      </TableCell>
                      <TableCell className="text-[#86868B]">
                        Sari Dewi
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          In Progress
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-red-100 text-red-800">
                          Urgent
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#86868B]">
                        2024-01-14
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="neumorphic-button-sm h-8 px-3 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Lihat
                          </Button>
                          <Button
                            size="sm"
                            className="neumorphic-button-sm h-8 px-3 text-xs text-green-600"
                          >
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Selesai
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800">
                          Saran
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#1D1D1F] max-w-xs truncate">
                        Perbaiki tampilan mobile
                      </TableCell>
                      <TableCell className="text-[#86868B]">
                        Budi Santoso
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800">
                          Resolved
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge className="bg-gray-100 text-gray-800">
                          Medium
                        </Badge>
                      </TableCell>
                      <TableCell className="text-[#86868B]">
                        2024-01-13
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            className="neumorphic-button-sm h-8 px-3 text-xs"
                          >
                            <Eye className="w-3 h-3 mr-1" />
                            Lihat
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="orders" className="space-y-6">
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">Manajemen Pesanan</CardTitle>
                <CardDescription className="text-[#86868B]">
                  Verifikasi pembayaran dan update status pengiriman
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1D1D1F]">Produk</TableHead>
                      <TableHead className="text-[#1D1D1F]">Pembeli</TableHead>
                      <TableHead className="text-[#1D1D1F]">Pembayaran</TableHead>
                      <TableHead className="text-[#1D1D1F]">Status</TableHead>
                      <TableHead className="text-[#1D1D1F]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!pendingOrders
                      ? null
                      : pendingOrders.map((order: any) => (
                          <TableRow key={order._id}>
                            <TableCell className="text-[#1D1D1F]">
                              {order.productTitle}
                            </TableCell>
                            <TableCell className="text-[#86868B]">
                              {order.buyerName}
                            </TableCell>
                            <TableCell className="text-[#86868B]">
                              {order.paymentStatus}
                            </TableCell>
                            <TableCell className="text-[#86868B]">
                              <Badge variant="secondary" className="text-xs">
                                {order.orderStatus}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="neumorphic-button-sm h-8 px-3 text-xs"
                                  onClick={() =>
                                    navigate(`/marketplace/order/${order._id}`)
                                  }
                                >
                                  Lihat Detail
                                </Button>
                                {order.paymentStatus === "pending" && (
                                  <Button
                                    size="sm"
                                    className="neumorphic-button-sm h-8 px-3 text-xs"
                                    onClick={async () => {
                                      await verifyPayment({ orderId: order._id });
                                    }}
                                  >
                                    Verifikasi
                                  </Button>
                                )}
                                {order.orderStatus === "confirmed" && (
                                  <Button
                                    size="sm"
                                    className="neumorphic-button-sm h-8 px-3 text-xs"
                                    onClick={async () => {
                                      const resi = window.prompt("Nomor Resi");
                                      if (resi) {
                                        await updateStatus({
                                          orderId: order._id,
                                          status: "shipped",
                                          trackingNumber: resi,
                                        });
                                      }
                                    }}
                                  >
                                    Kirim
                                  </Button>
                                )}
                                {order.orderStatus === "shipped" && (
                                  <Button
                                    size="sm"
                                    className="neumorphic-button-sm h-8 px-3 text-xs"
                                    onClick={async () => {
                                      await updateStatus({
                                        orderId: order._id,
                                        status: "delivered",
                                      });
                                    }}
                                  >
                                    Selesai
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Footer />
    </div>
  );
}
