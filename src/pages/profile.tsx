import { useUser } from "@clerk/clerk-react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Link, useParams } from "react-router-dom";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { uploadImage } from "@/utils/cloudinary";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import FollowButton from "@/components/follow-button";
import {
  User,
  Mail,
  Calendar,
  Shield,
  MessageCircle,
  Heart,
  Eye,
  Trophy,
  Star,
  Award,
  Users,
  Settings,
  Edit3,
  Instagram,
  Twitter,
  Globe,
} from "lucide-react";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";
import { useEffect, useRef, useState } from "react";

export default function Profile() {
  return (
    <ProtectedRoute>
      <ProfileContent />
    </ProtectedRoute>
  );
}

function ProfileContent() {
  const { id } = useParams();
  const { user } = useUser();
  const currentUser = useQuery(
    api.users.getUserByToken,
    user?.id ? { tokenIdentifier: user.id } : "skip",
  );
  const profileData = useQuery(
    api.users.getUserProfile,
    id
      ? { userId: id as any }
      : currentUser
      ? { userId: currentUser._id }
      : "skip",
  );

  // Query untuk mendapatkan statistik user dari forum
  const userTopics = useQuery(
    api.forum.getTopicsByAuthor,
    profileData ? { authorId: profileData.user._id } : "skip",
  );

  const userComments = useQuery(
    api.forum.getCommentsByAuthor,
    profileData ? { authorId: profileData.user._id } : "skip",
  );

  const pointStats = useQuery(
    api.points.getUserStats,
    profileData ? { userId: profileData.user._id } : "skip",
  );
  const pointEvents = useQuery(
    api.points.getUserPointEvents,
    profileData ? { userId: profileData.user._id, limit: 5 } : "skip",
  );

  // Komentar terbaru dengan info topik
  const recentComments = useQuery(
    api.forum.getRecentCommentsWithTopic,
    profileData ? { authorId: profileData.user._id, limit: 5 } : "skip",
  );

  const userProfile = useQuery(
    api.marketplace.getUserProfile,
    profileData ? { userId: profileData.user._id } : "skip",
  );
  const userReviews = useQuery(
    api.marketplace.getReviewsByTargetUser,
    profileData ? { userId: profileData.user._id } : "skip",
  );

  const followers = useQuery(
    api.follows.getFollowers,
    profileData ? { userId: profileData.user._id } : "skip",
  );
  const following = useQuery(
    api.follows.getFollowing,
    profileData ? { userId: profileData.user._id } : "skip",
  );

  const updateProfile = useMutation(api.users.updateUserProfile);
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setFullName(user?.fullName || "");
    setUsername(user?.username || "");
  }, [user]);

  useEffect(() => {
    setBio(userProfile?.profile?.bio || "");
  }, [userProfile]);

  const handleNameBlur = async () => {
    if (!user) return;
    const parts = fullName.trim().split(" ");
    const firstName = parts.shift() || "";
    const lastName = parts.join(" ");
    await user.update({ firstName, lastName });
  };

  const handleUsernameBlur = async () => {
    if (!user) return;
    await user.update({ username });
  };

  const isOwnProfile =
    currentUser && profileData && currentUser._id === profileData.user._id;

  const handleBioBlur = async () => {
    if (!isOwnProfile) return;
    await updateProfile({ bio });
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !isOwnProfile) return;
    try {
      const url = await uploadImage(file, "avatars");
      await updateProfile({ avatar: url });
    } catch (err) {
      console.error(err);
    }
  };
  const averageRating =
    userReviews && userReviews.length > 0
      ? userReviews.reduce((sum: number, r: any) => sum + r.rating, 0) /
        userReviews.length
      : 0;

  const formatDate = (timestamp: number | Date | undefined) => {
    if (!timestamp) return "—";
    const date =
      typeof timestamp === "number" ? new Date(timestamp) : timestamp;
    return date.toLocaleDateString("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getInitials = (name: string | null | undefined) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const totalLikes = (userTopics || []).reduce(
    (sum, topic) => sum + topic.likes,
    0,
  );
  const totalViews = (userTopics || []).reduce(
    (sum, topic) => sum + topic.views,
    0,
  );

  const contributionPoints =
    pointStats?.contributionPoints ?? profileData?.user.contributionPoints ?? 0;
  const level = pointStats?.level ?? Math.floor(contributionPoints / 100) + 1;
  const progressPercentage = contributionPoints % 100;
  const badges = pointStats?.badges ?? profileData?.user.badges ?? [];

  const getUserBadge = () => {
    const posts = userTopics?.length || 0;
    if (posts >= 10) return "Top Contributor";
    if (posts >= 5) return "Kontributor";
    return "Pemula";
  };

  const userBadge = getUserBadge();

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-16">
          {/* Header Section */}
          <div className="relative mb-12">
            <div className="absolute inset-x-0 -top-16 -bottom-16 bg-gradient-to-b from-[#FBFBFD] via-white to-[#FBFBFD] opacity-80 blur-3xl -z-10" />
            <div className="text-center">
              <h1 className="text-4xl font-semibold text-[#1D1D1F] tracking-tight mb-4">
                Profil Saya
              </h1>
              <p className="text-xl text-[#86868B] max-w-[600px] mx-auto leading-relaxed">
                Kelola informasi profil dan lihat aktivitas Anda di komunitas
                parfum
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Card */}
            <div className="lg:col-span-1">
              <div className="neumorphic-card p-8 text-center">
                <div className="mb-6">
                  <div className="relative w-24 h-24 mx-auto mb-4">
                    <Avatar className="w-24 h-24 mx-auto neumorphic-button border-0">
                      <AvatarImage
                        src={userProfile?.profile?.avatar || profileData?.user.image}
                        alt={profileData?.user.name || "User"}
                      />
                      <AvatarFallback className="text-2xl font-semibold text-[#2d3748] bg-gradient-to-br from-[#e0e5ec] to-[#ffffff]">
                        {getInitials(profileData?.user.name)}
                      </AvatarFallback>
                    </Avatar>
                    {editing && (
                      <>
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageChange}
                          accept="image/*"
                          className="hidden"
                        />
                        <button
                          onClick={() => fileInputRef.current?.click()}
                          className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 text-white text-sm"
                        >
                          Ganti
                        </button>
                      </>
                    )}
                  </div>
                  {isOwnProfile && editing ? (
                    <Input
                      className="text-center mb-2"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      onBlur={handleNameBlur}
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-[#1D1D1F] mb-2">
                      {profileData?.user.name || "Pengguna"}
                    </h2>
                  )}
                  <p className="text-[#86868B] mb-2">
                    {profileData?.user.email}
                  </p>
                  {isOwnProfile && editing ? (
                    <Input
                      className="text-center mb-2"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      onBlur={handleUsernameBlur}
                    />
                  ) : (
                    user?.username && (
                      <p className="text-[#86868B] mb-2">@{user.username}</p>
                    )
                  )}
                  {isOwnProfile && editing ? (
                    <Textarea
                      className="text-center mb-4"
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      onBlur={handleBioBlur}
                    />
                  ) : (
                    userProfile?.profile?.bio && (
                      <p className="text-sm text-[#4a5568] mb-4 italic">
                        {userProfile.profile.bio}
                      </p>
                    )
                  )}
                  <div className="flex justify-center gap-2 mb-6">
                    <Badge
                      variant="secondary"
                      className="neumorphic-button-sm bg-transparent text-[#667eea] border-0 shadow-none"
                    >
                      <Trophy className="h-3 w-3 mr-1" />
                      {userBadge}
                    </Badge>
                    {user?.primaryEmailAddress?.verification.status ===
                      "verified" && (
                      <Badge
                        variant="secondary"
                        className="neumorphic-button-sm bg-transparent text-green-600 border-0 shadow-none"
                      >
                        <Shield className="h-3 w-3 mr-1" />
                        Terverifikasi
                      </Badge>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  {isOwnProfile ? (
                    <>
                      <Button
                        className="neumorphic-button w-full bg-transparent text-[#2d3748] font-semibold border-0 shadow-none hover:scale-105 active:scale-95 transition-all"
                        onClick={() => setEditing((e) => !e)}
                      >
                        <Edit3 className="h-4 w-4 mr-2" />
                        {editing ? "Selesai" : "Edit Profil"}
                      </Button>
                      <Link to="/settings">
                        <Button
                          variant="outline"
                          className="neumorphic-button-sm w-full bg-transparent text-[#718096] border-0 shadow-none hover:scale-105 active:scale-95 transition-all"
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Pengaturan
                        </Button>
                      </Link>
                      <Link to="/collections">
                        <Button
                          variant="outline"
                          className="neumorphic-button-sm w-full mt-2 bg-transparent text-[#718096] border-0 shadow-none hover:scale-105 active:scale-95 transition-all"
                        >
                          Koleksi Saya
                        </Button>
                      </Link>
                    </>
                  ) : (
                    profileData && (
                      <FollowButton userId={profileData.user._id as any} />
                    )
                  )}
                </div>
              </div>

              {/* Quick Stats */}
              <div className="neumorphic-card p-6 mt-6">
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">
                  Statistik Cepat
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <MessageCircle className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">Topik</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {userTopics?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Heart className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">Total Suka</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {totalLikes}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">
                        Total Views
                      </span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {totalViews}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">Rating</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {averageRating.toFixed(1)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">Pengikut</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {followers?.length || 0}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">Mengikuti</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {following?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              {/* Gamification */}
              <div className="neumorphic-card p-6 mt-6">
                <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">
                  Gamifikasi
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">Level</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {level}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Star className="h-4 w-4 text-[#667eea]" />
                      <span className="text-sm text-[#86868B]">Poin Kontribusi</span>
                    </div>
                    <span className="text-sm font-semibold text-[#1D1D1F]">
                      {contributionPoints}
                    </span>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-[#86868B]">Menuju Level {level + 1}</span>
                      <span className="text-[#1D1D1F] font-medium">
                        {progressPercentage}/100
                      </span>
                    </div>
                    <div className="neumorphic-card-inset rounded-full h-2 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-blue-500 to-purple-500"
                        style={{ width: `${progressPercentage}%` }}
                      />
                    </div>
                  </div>
                  {badges.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mt-2 mb-2">
                        <Award className="h-4 w-4 text-[#667eea]" />
                        <span className="text-sm text-[#86868B]">Lencana</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {badges.map((b, i) => (
                          <Badge
                            key={i}
                            variant="outline"
                            className="neumorphic-button-sm px-2 py-0"
                          >
                            {b}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {pointEvents && (
                <div className="neumorphic-card p-6 mt-6">
                  <h3 className="text-lg font-semibold text-[#1D1D1F] mb-4">
                    Riwayat Poin
                  </h3>
                  <ul className="space-y-2 text-sm">
                    {pointEvents.map((ev) => (
                      <li key={ev._id} className="flex justify-between">
                        <span>{new Date(ev.createdAt).toLocaleDateString()}</span>
                        <span>
                          {ev.activity} (+{ev.points})
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Account Information */}
              <Card className="neumorphic-card border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1D1D1F]">
                    <User className="h-5 w-5 text-[#667eea]" />
                    Informasi Akun
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <InfoItem
                        icon={<User className="h-4 w-4" />}
                        label="Nama Lengkap"
                        value={user?.fullName}
                      />
                      <InfoItem
                        icon={<Mail className="h-4 w-4" />}
                        label="Email"
                        value={user?.primaryEmailAddress?.emailAddress}
                      />
                      <InfoItem
                        icon={<User className="h-4 w-4" />}
                        label="Username"
                        value={user?.username || "Belum diatur"}
                      />
                      {userProfile?.profile?.bio && (
                        <InfoItem
                          icon={<User className="h-4 w-4" />}
                          label="Bio"
                          value={userProfile.profile.bio}
                        />
                      )}
                      {userProfile?.profile?.instagram && (
                        <InfoItem
                          icon={<Instagram className="h-4 w-4" />}
                          label="Instagram"
                          value={
                            <a
                              href={userProfile.profile.instagram}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {userProfile.profile.instagram}
                            </a>
                          }
                        />
                      )}
                      {userProfile?.profile?.twitter && (
                        <InfoItem
                          icon={<Twitter className="h-4 w-4" />}
                          label="Twitter"
                          value={
                            <a
                              href={userProfile.profile.twitter}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {userProfile.profile.twitter}
                            </a>
                          }
                        />
                      )}
                      {userProfile?.profile?.website && (
                        <InfoItem
                          icon={<Globe className="h-4 w-4" />}
                          label="Website"
                          value={
                            <a
                              href={userProfile.profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {userProfile.profile.website}
                            </a>
                          }
                        />
                      )}
                    </div>
                    <div className="space-y-4">
                      <InfoItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Bergabung"
                        value={formatDate(user?.createdAt)}
                      />
                      <InfoItem
                        icon={<Calendar className="h-4 w-4" />}
                        label="Terakhir Aktif"
                        value={formatDate(user?.lastSignInAt)}
                      />
                      <InfoItem
                        icon={<Shield className="h-4 w-4" />}
                        label="Status Email"
                        value={
                          user?.primaryEmailAddress?.verification.status ===
                          "verified"
                            ? "Terverifikasi"
                            : "Belum Terverifikasi"
                        }
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Recent Topics */}
              <Card className="neumorphic-card border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1D1D1F]">
                    <MessageCircle className="h-5 w-5 text-[#667eea]" />
                    Topik Terbaru Saya
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!userTopics || userTopics.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-[#86868B] mx-auto mb-4 opacity-50" />
                      <p className="text-[#86868B] mb-4">
                        Anda belum membuat topik apapun
                      </p>
                      <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none">
                        Buat Topik Pertama
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {userTopics.slice(0, 3).map((topic) => (
                        <div
                          key={topic._id}
                          className="neumorphic-card-inset p-4 transition-all hover:scale-[1.02]"
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Badge variant="secondary" className="text-xs">
                                  {topic.category}
                                </Badge>
                                {topic.isHot && (
                                  <Badge
                                    variant="outline"
                                    className="text-xs text-orange-600 border-orange-200"
                                  >
                                    🔥 Hot
                                  </Badge>
                                )}
                              </div>
                              <h4 className="font-semibold text-[#1D1D1F] mb-1">
                                {topic.title}
                              </h4>
                              <p className="text-sm text-[#86868B] mb-2">
                                {formatDate(topic.createdAt)}
                              </p>
                              <div className="flex items-center gap-4 text-xs text-[#86868B]">
                                <span className="flex items-center gap-1">
                                  <Heart className="h-3 w-3" />
                                  {topic.likes}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Eye className="h-3 w-3" />
                                  {topic.views}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                      {userTopics.length > 3 && (
                        <div className="text-center pt-4">
                          <Button
                            variant="outline"
                            className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                          >
                            Lihat Semua Topik ({userTopics.length})
                          </Button>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Recent Comments */}
              <Card className="neumorphic-card border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1D1D1F]">
                    <MessageCircle className="h-5 w-5 text-[#667eea]" />
                    Komentar Terbaru
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!recentComments || recentComments.length === 0 ? (
                    <div className="text-center py-8">
                      <MessageCircle className="h-12 w-12 text-[#86868B] mx-auto mb-4 opacity-50" />
                      <p className="text-[#86868B]">
                        Anda belum menulis komentar
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {recentComments.map((comment) => (
                        <div
                          key={comment._id}
                          className="neumorphic-card-inset p-4"
                        >
                          <h4 className="font-semibold text-[#1D1D1F] mb-1">
                            <Link
                              to={`/forum?topic=${comment.topicId}`}
                              className="hover:underline"
                            >
                              {comment.topicTitle || "Topik"}
                            </Link>
                          </h4>
                          <p className="text-sm text-[#4a5568] mb-2 line-clamp-2">
                            {comment.content}
                          </p>
                          <div className="flex items-center gap-4 text-xs text-[#86868B]">
                            <span className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              {comment.topicLikes}
                            </span>
                            <span className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              {comment.topicViews}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Activity Summary */}
              <Card className="neumorphic-card border-0 shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-[#1D1D1F]">
                    <Star className="h-5 w-5 text-[#667eea]" />
                    Ringkasan Aktivitas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-[#667eea]" />
                      </div>
                      <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                        {userTopics?.length || 0}
                      </div>
                      <div className="text-sm text-[#86868B]">Topik Dibuat</div>
                    </div>
                    <div className="text-center">
                      <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Heart className="h-6 w-6 text-[#667eea]" />
                      </div>
                      <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                        {totalLikes}
                      </div>
                      <div className="text-sm text-[#86868B]">Total Suka</div>
                    </div>
                    <div className="text-center">
                      <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <Eye className="h-6 w-6 text-[#667eea]" />
                      </div>
                      <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                        {totalViews}
                      </div>
                      <div className="text-sm text-[#86868B]">Total Views</div>
                    </div>
                    <div className="text-center">
                      <div className="neumorphic-card-inset w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
                        <MessageCircle className="h-6 w-6 text-[#667eea]" />
                      </div>
                      <div className="text-2xl font-bold text-[#1D1D1F] mb-1">
                        {userComments?.length || 0}
                      </div>
                      <div className="text-sm text-[#86868B]">Komentar</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-3">
      <div className="text-[#667eea] flex-shrink-0">{icon}</div>
      <div className="flex-1">
        <div className="text-sm text-[#86868B]">{label}</div>
        <div className="text-sm font-medium text-[#1D1D1F]">{value ?? "—"}</div>
      </div>
    </div>
  );
}
