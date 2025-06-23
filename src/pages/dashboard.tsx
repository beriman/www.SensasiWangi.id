import { useUser } from "@clerk/clerk-react";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";

export default function Dashboard() {
  const { user } = useUser();
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

  const marketplaceStats = useQuery(api.marketplace.getMarketplaceStats);

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
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

          {/* User Stats Section */}
          <div className="mb-12">
            <UserStats
              level={Math.floor((userData?.contributionPoints || 0) / 100) + 1}
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
      </div>

      <ActivityMetrics posts={userTopics || []} comments={userComments || []} />

      {marketplaceStats && (
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-[#1D1D1F] mb-4">
            Marketplace Stats
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="neumorphic-card p-4 text-center">
              <Package className="h-6 w-6 text-[#667eea] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#667eea]">
                {marketplaceStats.activeProducts}
              </div>
              <div className="text-sm text-[#718096]">Produk Aktif</div>
            </div>
            <div className="neumorphic-card p-4 text-center">
              <ShoppingCart className="h-6 w-6 text-[#667eea] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#667eea]">
                {marketplaceStats.soldProducts}
              </div>
              <div className="text-sm text-[#718096]">Terjual</div>
            </div>
            <div className="neumorphic-card p-4 text-center">
              <ArrowRight className="h-6 w-6 text-[#667eea] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#667eea]">
                {marketplaceStats.totalOrders}
              </div>
              <div className="text-sm text-[#718096]">Total Order</div>
            </div>
            <div className="neumorphic-card p-4 text-center">
              <DollarSign className="h-6 w-6 text-[#667eea] mx-auto mb-2" />
              <div className="text-xl font-bold text-[#667eea]">
                {new Intl.NumberFormat("id-ID", {
                  notation: "compact",
                  maximumFractionDigits: 1,
                }).format(marketplaceStats.totalValue)}
              </div>
              <div className="text-sm text-[#718096]">Total Nilai</div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Clerk User Data */}
            <DataCard
              title="Informasi Pengguna Clerk"
              icon={<User className="h-5 w-5 text-[#0066CC]" />}
            >
              <div className="space-y-2">
                <DataRow label="Nama Lengkap" value={user?.fullName} />
                <DataRow
                  label="Email"
                  value={user?.primaryEmailAddress?.emailAddress}
                />
                <DataRow label="ID Pengguna" value={user?.id} />
                <DataRow
                  label="Dibuat"
                  value={new Date(user?.createdAt || "").toLocaleDateString()}
                />
                <DataRow
                  label="Email Terverifikasi"
                  value={
                    user?.primaryEmailAddress?.verification.status ===
                    "verified"
                      ? "Ya"
                      : "Tidak"
                  }
                />
              </div>
            </DataCard>

            {/* Database User Data */}
            <DataCard
              title="Informasi Pengguna Database"
              icon={<Database className="h-5 w-5 text-[#0066CC]" />}
            >
              <div className="space-y-2">
                <DataRow label="ID Database" value={userData?._id} />
                <DataRow label="Nama" value={userData?.name} />
                <DataRow label="Email" value={userData?.email} />
                <DataRow label="Token ID" value={userData?.tokenIdentifier} />
                <DataRow
                  label="Terakhir Diperbarui"
                  value={
                    userData?._creationTime
                      ? new Date(userData._creationTime).toLocaleDateString()
                      : undefined
                  }
                />
              </div>
            </DataCard>

            {/* Session Information */}
            <DataCard
              title="Sesi Saat Ini"
              icon={<Clock className="h-5 w-5 text-[#0066CC]" />}
            >
              <div className="space-y-2">
                <DataRow
                  label="Terakhir Aktif"
                  value={new Date(user?.lastSignInAt || "").toLocaleString()}
                />
                <DataRow
                  label="Strategi Auth"
                  value={user?.primaryEmailAddress?.verification.strategy}
                />
              </div>
            </DataCard>

            {/* Additional User Details */}
            <DataCard
              title="Detail Profil"
              icon={<Shield className="h-5 w-5 text-[#0066CC]" />}
            >
              <div className="space-y-2">
                <DataRow label="Username" value={user?.username} />
                <DataRow label="Nama Depan" value={user?.firstName} />
                <DataRow label="Nama Belakang" value={user?.lastName} />
                <DataRow
                  label="Gambar Profil"
                  value={user?.imageUrl ? "Tersedia" : "Belum Diatur"}
                />
              </div>
            </DataCard>
          </div>

          {/* JSON Data Preview */}
          <div className="mt-12">
            <DataCard
              title="Pratinjau Data Mentah"
              className="neumorphic-card-inset"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1F] mb-2">
                    Data Pengguna Clerk
                  </h3>
                  <pre className="neumorphic-input p-6 text-sm overflow-auto max-h-64 border-0">
                    {JSON.stringify(user, null, 2)}
                  </pre>
                </div>
                <div>
                  <h3 className="text-sm font-medium text-[#1D1D1F] mb-2">
                    Data Pengguna Database
                  </h3>
                  <pre className="neumorphic-input p-6 text-sm overflow-auto max-h-64 border-0">
                    {JSON.stringify(userData, null, 2)}
                  </pre>
                </div>
              </div>
            </DataCard>
          </div>
        </div>
      </main>
      <Footer />
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
      <span className="text-[#86868B]">{label}</span>
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
