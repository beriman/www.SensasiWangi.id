import { useState } from "react";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
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
  Database,
  RefreshCw,
  Trash2,
  Edit,
  UserCheck,
  UserX,
  Ban,
  AlertTriangle,
  Activity,
  Server,
  HardDrive,
  Zap,
} from "lucide-react";
import RoleProtectedRoute from "@/components/wrappers/RoleProtectedRoute";

export default function Admin() {
  return (
    <RoleProtectedRoute roles={["admin"]}>
      <AdminContent />
    </RoleProtectedRoute>
  );
}

function AdminContent() {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [isUserDialogOpen, setIsUserDialogOpen] = useState(false);
  const [systemMessage, setSystemMessage] = useState("");
  const [couponForm, setCouponForm] = useState({
    code: "",
    discountType: "percentage",
    amount: 0,
    expiresAt: "",
    productId: "",
    sellerId: "",
  });
  const navigate = useNavigate();

  const pendingOrders = useQuery(api.marketplace.getPendingOrders);
  const allUsers = useQuery(api.users.getAllUsers);
  const forumStats = useQuery(api.forum.getForumStats);
  const systemHealth = useQuery(api.admin.getSystemHealth);
  const platformAnalytics = useQuery(api.admin.getPlatformAnalytics);
  const pendingReports = useQuery(api.forum.getTopReports);
  const orderReports = useQuery(api.marketplace.getOrderReports);

  const verifyPayment = useMutation(api.marketplace.verifyOrderPayment);
  const updateStatus = useMutation(api.marketplace.updateOrderStatus);
  const releasePayment = useMutation(api.marketplace.releaseSellerPayment);
  const trackShipment = useAction(api.marketplace.trackShipment);
  const updateUserRole = useMutation(api.users.updateUserRole);
  const suspendUser = useMutation(api.admin.suspendUser);
  const deleteUser = useMutation(api.admin.deleteUser);
  const issueWarning = useMutation(api.admin.issueWarning);
  const tempBanUser = useMutation(api.admin.tempBanUser);
  const permBanUser = useMutation(api.admin.permBanUser);
  const resolveOrderReport = useMutation(api.marketplace.resolveOrderReport);
  const voteReport = useMutation(api.forum.voteReport);
  const broadcastMessage = useMutation(api.admin.broadcastSystemMessage);
  const clearCache = useMutation(api.admin.clearSystemCache);
  const backupDatabase = useMutation(api.admin.backupDatabase);
  const initializeCategories = useMutation(api.forum.initializeCategories);
  const briWebhookEvents = useQuery(api.webhooks.listBriWebhookEvents, {
    limit: 20,
  });

  const suggestionsData = useQuery(api.marketplace.getSuggestions, {
    paginationOpts: { numItems: 20, cursor: null },
  });
  const suggestionStats = useQuery(api.marketplace.getSuggestionStats);

  const updateSuggestionStatus = useMutation(
    api.marketplace.updateSuggestionStatus,
  );
  const updateSuggestionPriority = useMutation(
    api.marketplace.updateSuggestionPriority,
  );
  const coupons = useQuery(api.marketplace.listCoupons);
  const createCoupon = useMutation(api.marketplace.createCoupon);
  const deleteCoupon = useMutation(api.marketplace.deleteCoupon);

  const { toast } = useToast();
  const [reportStatuses, setReportStatuses] = useState<Record<string, string>>({});

  // Data statistik real-time
  const stats = {
    totalUsers: platformAnalytics?.userCount || 0,
    totalPosts:
      (platformAnalytics?.topicCount || 0) +
      (platformAnalytics?.commentCount || 0),
    pendingReports: pendingReports?.length || 0,
    activeDiscussions: forumStats?.activeToday || 0,
    systemUptime: systemHealth?.uptime || "99.9%",
    memoryUsage: systemHealth?.memoryUsage || "0%",
    diskUsage: systemHealth?.diskUsage || "N/A",
    activeConnections: systemHealth?.activeConnections || 0,
  };

  const recentReports = pendingReports || [];


  return (
    <div className="min-h-screen bg-[#F5F5F7]">

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
            <TabsTrigger
              value="coupons"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <Ticket className="w-4 h-4 mr-2" />
              Kupon
            </TabsTrigger>
            <TabsTrigger
              value="order-reports"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <Flag className="w-4 h-4 mr-2" />
              Order Reports
            </TabsTrigger>
            <TabsTrigger
              value="bri-events"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <Eye className="w-4 h-4 mr-2" />
              BRI Events
            </TabsTrigger>
            <TabsTrigger
              value="system"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <Server className="w-4 h-4 mr-2" />
              Sistem
            </TabsTrigger>
            <TabsTrigger
              value="maintenance"
              className="neumorphic-button-sm data-[state=active]:bg-white data-[state=active]:shadow-inner text-[#1D1D1F]"
            >
              <Settings className="w-4 h-4 mr-2" />
              Pemeliharaan
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
                      <TableHead className="text-[#1D1D1F]">Suara</TableHead>
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
                        <TableCell className="text-center text-[#1D1D1F]">
                          {report.votes}
                        </TableCell>
                        <TableCell className="text-center">
                          {reportStatuses[report.id] ? (
                            <Badge variant="secondary" className="text-xs">
                              {reportStatuses[report.id]}
                            </Badge>
                          ) : (
                            "-"
                          )}
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
                              onClick={async () => {
                                await voteReport({ reportId: report.id, value: 1 });
                                setReportStatuses((s) => ({ ...s, [report.id]: "Diterima" }));
                                toast({ title: "Laporan diterima" });
                              }}
                            >
                              <CheckCircle className="w-3 h-3 mr-1" />
                              Terima
                            </Button>
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs"
                              onClick={async () => {
                                await voteReport({ reportId: report.id, value: -1 });
                                setReportStatuses((s) => ({ ...s, [report.id]: "Ditolak" }));
                                toast({ title: "Laporan ditolak" });
                              }}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Tolak
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

      <TabsContent value="order-reports" className="space-y-6">
        <Card className="neumorphic-card border-0">
          <CardHeader>
            <CardTitle className="text-[#1D1D1F]">Laporan Pesanan</CardTitle>
            <CardDescription className="text-[#86868B]">
              Tinjau dan selesaikan laporan terkait pesanan
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-[#1D1D1F]">Pesanan</TableHead>
                  <TableHead className="text-[#1D1D1F]">Pelapor</TableHead>
                  <TableHead className="text-[#1D1D1F]">Alasan</TableHead>
                  <TableHead className="text-[#1D1D1F]">Status</TableHead>
                  <TableHead className="text-[#1D1D1F]">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {!orderReports
                  ? null
                  : orderReports.map((rep: any) => (
                      <TableRow key={rep.id}>
                        <TableCell className="text-[#1D1D1F]">
                          {rep.orderTitle}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {rep.reporter}
                        </TableCell>
                        <TableCell className="text-[#86868B] max-w-xs truncate">
                          {rep.reason}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          <Badge variant="secondary" className="text-xs">
                            {rep.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {rep.status === "pending" && (
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs"
                              onClick={async () => {
                                await resolveOrderReport({ reportId: rep.id });
                              }}
                            >
                              Resolve
                            </Button>
                          )}
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
                      <TableHead className="text-[#1D1D1F]">Role</TableHead>
                      <TableHead className="text-[#1D1D1F]">Poin</TableHead>
                      <TableHead className="text-[#1D1D1F]">Peringatan</TableHead>
                      <TableHead className="text-[#1D1D1F]">Banned Sampai</TableHead>
                      <TableHead className="text-[#1D1D1F]">
                        Bergabung
                      </TableHead>
                      <TableHead className="text-[#1D1D1F]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {allUsers?.map((user) => (
                      <TableRow key={user._id}>
                        <TableCell className="text-[#1D1D1F] font-medium">
                          {user.name || "Anonymous"}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {user.email}
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.role === "admin" ? "default" : "secondary"
                            }
                            className={
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-800"
                                : user.role === "seller"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-gray-100 text-gray-800"
                            }
                          >
                            {user.role}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {user.contributionPoints || 0}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {user.warnings || 0}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {user.bannedUntil
                            ? user.bannedUntil === -1
                              ? "Permanent"
                              : new Date(user.bannedUntil).toLocaleDateString(
                                  "id-ID",
                                )
                            : "-"}
                        </TableCell>
                        <TableCell className="text-[#86868B]">
                          {user.createdAt
                            ? new Date(user.createdAt).toLocaleDateString(
                                "id-ID",
                              )
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs"
                              onClick={() => {
                                setSelectedUser(user);
                                setIsUserDialogOpen(true);
                              }}
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              Detail
                            </Button>
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs text-blue-600"
                              onClick={async () => {
                                const newRole =
                                  user.role === "admin" ? "buyer" : "admin";
                                await updateUserRole({
                                  userId: user._id,
                                  role: newRole,
                                });
                              }}
                            >
                              <UserCheck className="w-3 h-3 mr-1" />
                              {user.role === "admin" ? "Demote" : "Promote"}
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button
                                  size="sm"
                                  className="neumorphic-button-sm h-8 px-3 text-xs text-red-600"
                                >
                                  <Ban className="w-3 h-3 mr-1" />
                                  Suspend
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="neumorphic-card">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>
                                    Suspend Pengguna
                                  </AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menangguhkan
                                    pengguna {user.name}? Mereka tidak akan bisa
                                    mengakses platform sampai ditangguhkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel className="neumorphic-button-sm">
                                    Batal
                                  </AlertDialogCancel>
                                  <AlertDialogAction
                                    className="neumorphic-button-sm bg-red-500 text-white"
                                    onClick={async () => {
                                      await suspendUser({ userId: user._id });
                                    }}
                                  >
                                    Suspend
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs text-yellow-600"
                              onClick={async () => {
                                await issueWarning({ userId: user._id });
                              }}
                            >
                              <AlertTriangle className="w-3 h-3 mr-1" />
                              Warning
                            </Button>
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs text-orange-600"
                              onClick={async () => {
                                const days = parseInt(
                                  prompt('Ban berapa hari?') || '0',
                                  10,
                                );
                                if (days > 0) {
                                  await tempBanUser({ userId: user._id, days });
                                }
                              }}
                            >
                              <Ban className="w-3 h-3 mr-1" />
                              Temp Ban
                            </Button>
                            <Button
                              size="sm"
                              className="neumorphic-button-sm h-8 px-3 text-xs text-red-800"
                              onClick={async () => {
                                if (confirm('Ban permanen?')) {
                                  await permBanUser({ userId: user._id });
                                }
                              }}
                            >
                              <XCircle className="w-3 h-3 mr-1" />
                              Ban
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    )) || []}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Dialog Detail Pengguna */}
            <Dialog open={isUserDialogOpen} onOpenChange={setIsUserDialogOpen}>
              <DialogContent className="neumorphic-card max-w-2xl">
                <DialogHeader>
                  <DialogTitle className="text-[#1D1D1F]">
                    Detail Pengguna: {selectedUser?.name}
                  </DialogTitle>
                  <DialogDescription className="text-[#86868B]">
                    Informasi lengkap tentang pengguna ini
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-[#1D1D1F]">
                        Email
                      </label>
                      <p className="text-[#86868B]">{selectedUser?.email}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#1D1D1F]">
                        Role
                      </label>
                      <p className="text-[#86868B]">{selectedUser?.role}</p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#1D1D1F]">
                        Poin Kontribusi
                      </label>
                      <p className="text-[#86868B]">
                        {selectedUser?.contributionPoints || 0}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-[#1D1D1F]">
                        Badges
                      </label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {selectedUser?.badges?.map(
                          (badge: string, index: number) => (
                            <Badge key={index} className="text-xs">
                              {badge}
                            </Badge>
                          ),
                        ) || (
                          <span className="text-[#86868B] text-sm">
                            Tidak ada badge
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-[#1D1D1F]">
                      Tanggal Bergabung
                    </label>
                    <p className="text-[#86868B]">
                      {selectedUser?.createdAt
                        ? new Date(selectedUser.createdAt).toLocaleString(
                            "id-ID",
                          )
                        : "-"}
                    </p>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
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
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {suggestionStats?.total ?? 0}
                  </div>
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
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {suggestionStats?.suggestions ?? 0}
                  </div>
                  <p className="text-xs text-[#86868B]">
                    {(
                      ((suggestionStats?.suggestions ?? 0) /
                        Math.max(suggestionStats?.total ?? 1, 1)) *
                      100
                    ).toFixed(0)}% dari total
                  </p>
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
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {suggestionStats?.bugReports ?? 0}
                  </div>
                  <p className="text-xs text-[#86868B]">
                    {(
                      ((suggestionStats?.bugReports ?? 0) /
                        Math.max(suggestionStats?.total ?? 1, 1)) *
                      100
                    ).toFixed(0)}% dari total
                  </p>
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
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {suggestionStats?.pending ?? 0}
                  </div>
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
                    {!suggestionsData
                      ? null
                      : suggestionsData.page.map((s: any) => (
                          <TableRow key={s._id}>
                            <TableCell>
                              <Badge
                                className={
                                  s.type === "suggestion"
                                    ? "bg-blue-100 text-blue-800"
                                    : "bg-red-100 text-red-800"
                                }
                              >
                                {s.type === "suggestion" ? "Saran" : "Bug"}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[#1D1D1F] max-w-xs truncate">
                              {s.subject}
                            </TableCell>
                            <TableCell className="text-[#86868B]">{s.name}</TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  s.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : s.status === "in_progress"
                                    ? "bg-blue-100 text-blue-800"
                                    : s.status === "resolved"
                                    ? "bg-green-100 text-green-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {s.status.replaceAll("_", " ")}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  s.priority === "urgent"
                                    ? "bg-red-100 text-red-800"
                                    : s.priority === "high"
                                    ? "bg-orange-100 text-orange-800"
                                    : s.priority === "medium"
                                    ? "bg-gray-100 text-gray-800"
                                    : "bg-gray-100 text-gray-800"
                                }
                              >
                                {s.priority.charAt(0).toUpperCase() +
                                  s.priority.slice(1)}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-[#86868B]">
                              {new Date(s.createdAt).toISOString().slice(0, 10)}
                            </TableCell>
                            <TableCell>
                              <div className="flex space-x-2">
                                <Button
                                  size="sm"
                                  className="neumorphic-button-sm h-8 px-3 text-xs"
                                  onClick={async () => {
                                    const status = window.prompt(
                                      "Status (pending/in_progress/resolved/closed)",
                                      s.status,
                                    );
                                    if (status) {
                                      await updateSuggestionStatus({
                                        suggestionId: s._id,
                                        status,
                                      });
                                    }
                                  }}
                                >
                                  Update Status
                                </Button>
                                <Button
                                  size="sm"
                                  className="neumorphic-button-sm h-8 px-3 text-xs"
                                  onClick={async () => {
                                    const priority = window.prompt(
                                      "Prioritas (low/medium/high/urgent)",
                                      s.priority,
                                    );
                                    if (priority) {
                                      await updateSuggestionPriority({
                                        suggestionId: s._id,
                                        priority,
                                      });
                                    }
                                  }}
                                >
                                  Ubah Prioritas
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

          <TabsContent value="orders" className="space-y-6">
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Manajemen Pesanan
                </CardTitle>
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
                    <TableHead className="text-[#1D1D1F]">
                        Pembayaran
                      </TableHead>
                      <TableHead className="text-[#1D1D1F]">Payout</TableHead>
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
                              {order.payoutStatus ?? "pending"}
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
                                    navigate(`/marketplace/lapak/orders/${order._id}`)
                                  }
                                >
                                  Lihat Detail
                                </Button>
                                {order.paymentStatus === "pending" && (
                                  <Button
                                    size="sm"
                                    className="neumorphic-button-sm h-8 px-3 text-xs"
                                    onClick={async () => {
                                      await verifyPayment({
                                        orderId: order._id,
                                      });
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
                                  <>
                                    <Button
                                      size="sm"
                                      className="neumorphic-button-sm h-8 px-3 text-xs"
                                      onClick={async () => {
                                        await trackShipment({ orderId: order._id });
                                      }}
                                    >
                                      Refresh
                                    </Button>
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
                                  </>
                                )}
                                {order.orderStatus === "delivered" && order.payoutStatus !== "sent" && (
                                  <Button
                                    size="sm"
                                    className="neumorphic-button-sm h-8 px-3 text-xs"
                                    onClick={async () => {
                                      await releasePayment({ orderId: order._id });
                                    }}
                                  >
                                    Release Payment
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

          <TabsContent value="coupons" className="space-y-6">
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">Manajemen Kupon</CardTitle>
                <CardDescription className="text-[#86868B]">
                  Buat dan hapus kode kupon diskon
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1D1D1F]">Kode</TableHead>
                      <TableHead className="text-[#1D1D1F]">Tipe</TableHead>
                      <TableHead className="text-[#1D1D1F]">Jumlah</TableHead>
                      <TableHead className="text-[#1D1D1F]">Kadaluarsa</TableHead>
                      <TableHead className="text-[#1D1D1F]">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!coupons
                      ? null
                      : coupons.map((c: any) => (
                          <TableRow key={c._id}>
                            <TableCell className="text-[#1D1D1F]">{c.code}</TableCell>
                            <TableCell className="text-[#86868B]">
                              {c.discountType}
                            </TableCell>
                            <TableCell className="text-[#86868B]">
                              {c.discountType === "percentage" ? `${c.amount}%` : c.amount}
                            </TableCell>
                            <TableCell className="text-[#86868B]">
                              {new Date(c.expiresAt).toLocaleDateString("id-ID")}
                            </TableCell>
                            <TableCell>
                              <Button
                                size="sm"
                                className="neumorphic-button-sm h-8 px-3 text-xs"
                                onClick={async () => {
                                  await deleteCoupon({ couponId: c._id });
                                }}
                              >
                                Hapus
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
                <div className="space-y-2 mt-4">
                  <Input
                    placeholder="Kode"
                    value={couponForm.code}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, code: e.target.value })
                    }
                    className="neumorphic-input border-0"
                  />
                  <Select
                    value={couponForm.discountType}
                    onValueChange={(val) =>
                      setCouponForm({ ...couponForm, discountType: val })
                    }
                  >
                    <SelectTrigger className="neumorphic-input border-0">
                      <SelectValue placeholder="Tipe" />
                    </SelectTrigger>
                    <SelectContent className="neumorphic-card border-0">
                      <SelectItem value="percentage">Persentase</SelectItem>
                      <SelectItem value="amount">Nominal</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="number"
                    placeholder="Jumlah"
                    value={couponForm.amount}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, amount: Number(e.target.value) })
                    }
                    className="neumorphic-input border-0"
                  />
                  <Input
                    type="date"
                    value={couponForm.expiresAt}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, expiresAt: e.target.value })
                    }
                    className="neumorphic-input border-0"
                  />
                  <Input
                    placeholder="Product ID (opsional)"
                    value={couponForm.productId}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, productId: e.target.value })
                    }
                    className="neumorphic-input border-0"
                  />
                  <Input
                    placeholder="Seller ID (opsional)"
                    value={couponForm.sellerId}
                    onChange={(e) =>
                      setCouponForm({ ...couponForm, sellerId: e.target.value })
                    }
                    className="neumorphic-input border-0"
                  />
                  <Button
                    className="neumorphic-button"
                    onClick={async () => {
                      await createCoupon({
                        code: couponForm.code,
                        discountType: couponForm.discountType,
                        amount: Number(couponForm.amount),
                        expiresAt: new Date(couponForm.expiresAt).getTime(),
                        productId: couponForm.productId ? (couponForm.productId as any) : undefined,
                        sellerId: couponForm.sellerId ? (couponForm.sellerId as any) : undefined,
                      });
                      setCouponForm({
                        code: "",
                        discountType: "percentage",
                        amount: 0,
                        expiresAt: "",
                        productId: "",
                        sellerId: "",
                      });
                    }}
                  >
                    Tambah Kupon
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bri-events" className="space-y-6">
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">BRI Webhook Events</CardTitle>
                <CardDescription className="text-[#86868B]">
                  Log of recent callbacks from BRI
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-[#1D1D1F]">Event</TableHead>
                      <TableHead className="text-[#1D1D1F]">Timestamp</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {!briWebhookEvents
                      ? null
                      : briWebhookEvents.map((ev: any) => (
                          <TableRow key={ev._id}>
                            <TableCell className="text-[#86868B]">
                              {ev.eventType}
                            </TableCell>
                            <TableCell className="text-[#86868B]">
                              {new Date(ev.createdAt).toLocaleString("id-ID")}
                            </TableCell>
                          </TableRow>
                        ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    System Uptime
                  </CardTitle>
                  <Activity className="h-4 w-4 text-green-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.systemUptime}
                  </div>
                  <p className="text-xs text-[#86868B]">
                    Dalam 30 hari terakhir
                  </p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Memory Usage
                  </CardTitle>
                  <HardDrive className="h-4 w-4 text-blue-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.memoryUsage}
                  </div>
                  <p className="text-xs text-[#86868B]">Dari total RAM</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Disk Usage
                  </CardTitle>
                  <Database className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.diskUsage}
                  </div>
                  <p className="text-xs text-[#86868B]">Dari total storage</p>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium text-[#1D1D1F]">
                    Active Connections
                  </CardTitle>
                  <Zap className="h-4 w-4 text-purple-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-[#1D1D1F]">
                    {stats.activeConnections}
                  </div>
                  <p className="text-xs text-[#86868B]">Koneksi real-time</p>
                </CardContent>
              </Card>
            </div>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  System Health Monitor
                </CardTitle>
                <CardDescription className="text-[#86868B]">
                  Monitor kesehatan sistem dan performa aplikasi
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 neumorphic-card-inset rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[#1D1D1F] font-medium">
                        Database Connection
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 neumorphic-card-inset rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[#1D1D1F] font-medium">
                        API Services
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Operational
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 neumorphic-card-inset rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full animate-pulse"></div>
                      <span className="text-[#1D1D1F] font-medium">
                        Cache System
                      </span>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800">
                      Warning
                    </Badge>
                  </div>
                  <div className="flex justify-between items-center p-4 neumorphic-card-inset rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-[#1D1D1F] font-medium">
                        File Storage
                      </span>
                    </div>
                    <Badge className="bg-green-100 text-green-800">
                      Healthy
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Broadcast System Message
                </CardTitle>
                <CardDescription className="text-[#86868B]">
                  Kirim pesan sistem ke semua pengguna
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Masukkan pesan sistem yang akan dikirim ke semua pengguna..."
                  value={systemMessage}
                  onChange={(e) => setSystemMessage(e.target.value)}
                  className="neumorphic-input"
                />
                <Button
                  className="neumorphic-button"
                  onClick={async () => {
                    if (systemMessage.trim()) {
                      await broadcastMessage({ message: systemMessage });
                      setSystemMessage("");
                    }
                  }}
                  disabled={!systemMessage.trim()}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Kirim Pesan Sistem
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="maintenance" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="text-[#1D1D1F]">
                    Database Operations
                  </CardTitle>
                  <CardDescription className="text-[#86868B]">
                    Operasi pemeliharaan database
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="neumorphic-button w-full justify-start"
                    onClick={async () => {
                      await backupDatabase();
                    }}
                  >
                    <Database className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                  <Button
                    className="neumorphic-button w-full justify-start"
                    onClick={async () => {
                      await initializeCategories();
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Initialize Forum Categories
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="neumorphic-button w-full justify-start text-red-600">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Reset All Data
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="neumorphic-card">
                      <AlertDialogHeader>
                        <AlertDialogTitle>Reset Semua Data</AlertDialogTitle>
                        <AlertDialogDescription>
                          PERINGATAN: Ini akan menghapus SEMUA data dari
                          database. Operasi ini tidak dapat dibatalkan. Pastikan
                          Anda sudah membuat backup.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel className="neumorphic-button-sm">
                          Batal
                        </AlertDialogCancel>
                        <AlertDialogAction className="neumorphic-button-sm bg-red-500 text-white">
                          Ya, Reset Semua
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardContent>
              </Card>

              <Card className="neumorphic-card border-0">
                <CardHeader>
                  <CardTitle className="text-[#1D1D1F]">
                    Cache Management
                  </CardTitle>
                  <CardDescription className="text-[#86868B]">
                    Kelola cache sistem untuk performa optimal
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button
                    className="neumorphic-button w-full justify-start"
                    onClick={async () => {
                      await clearCache({ type: "all" });
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear All Cache
                  </Button>
                  <Button
                    className="neumorphic-button w-full justify-start"
                    onClick={async () => {
                      await clearCache({ type: "images" });
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear Image Cache
                  </Button>
                  <Button
                    className="neumorphic-button w-full justify-start"
                    onClick={async () => {
                      await clearCache({ type: "api" });
                    }}
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    Clear API Cache
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  System Maintenance Tools
                </CardTitle>
                <CardDescription className="text-[#86868B]">
                  Tools untuk pemeliharaan dan optimasi sistem
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <Button className="neumorphic-button h-20 flex-col">
                    <Activity className="w-6 h-6 mb-2" />
                    <span>System Health Check</span>
                  </Button>
                  <Button className="neumorphic-button h-20 flex-col">
                    <HardDrive className="w-6 h-6 mb-2" />
                    <span>Disk Cleanup</span>
                  </Button>
                  <Button className="neumorphic-button h-20 flex-col">
                    <Zap className="w-6 h-6 mb-2" />
                    <span>Performance Optimization</span>
                  </Button>
                  <Button className="neumorphic-button h-20 flex-col">
                    <Shield className="w-6 h-6 mb-2" />
                    <span>Security Scan</span>
                  </Button>
                  <Button className="neumorphic-button h-20 flex-col">
                    <Database className="w-6 h-6 mb-2" />
                    <span>Database Optimization</span>
                  </Button>
                  <Button className="neumorphic-button h-20 flex-col">
                    <RefreshCw className="w-6 h-6 mb-2" />
                    <span>System Restart</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

    </div>
  );
}
