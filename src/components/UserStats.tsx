import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Trophy,
  Star,
  MessageCircle,
  Heart,
  Award,
  TrendingUp,
  Calendar,
  Target,
} from "lucide-react";

interface UserStatsProps {
  level?: number;
  contributionPoints?: number;
  postsCount?: number;
  likesReceived?: number;
  commentsCount?: number;
  joinDate?: string;
  badges?: string[];
  weeklyGoal?: number;
  weeklyProgress?: number;
}

export function UserStats({
  level = 1,
  contributionPoints = 0,
  postsCount = 0,
  likesReceived = 0,
  commentsCount = 0,
  joinDate = new Date().toLocaleDateString(),
  badges = [],
  weeklyGoal = 100,
  weeklyProgress = 0,
}: UserStatsProps) {
  const progressPercentage = Math.min((weeklyProgress / weeklyGoal) * 100, 100);

  const getLevelColor = (level: number) => {
    if (level >= 10) return "bg-gradient-to-r from-purple-500 to-pink-500";
    if (level >= 5) return "bg-gradient-to-r from-blue-500 to-cyan-500";
    return "bg-gradient-to-r from-green-500 to-emerald-500";
  };

  const getLevelTitle = (level: number) => {
    if (level >= 10) return "Master Parfumeur";
    if (level >= 5) return "Enthusiast";
    return "Pemula";
  };

  return (
    <div className="neumorphic-bg">
      {/* Header Stats */}
      <div className="neumorphic-card p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-full ${getLevelColor(level)} flex items-center justify-center text-white font-bold text-lg`}
            >
              {level}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-[#1D1D1F]">
                Level {level}
              </h3>
              <p className="text-sm text-[#86868B]">{getLevelTitle(level)}</p>
            </div>
          </div>
          <Badge variant="secondary" className="neumorphic-button-sm px-3 py-1">
            <Trophy className="w-3 h-3 mr-1" />
            {contributionPoints} Poin
          </Badge>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-[#86868B]">Progress Mingguan</span>
            <span className="text-[#1D1D1F] font-medium">
              {weeklyProgress}/{weeklyGoal}
            </span>
          </div>
          <div className="neumorphic-card-inset rounded-full h-3 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Activity Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<MessageCircle className="w-5 h-5 text-blue-500" />}
          label="Postingan"
          value={postsCount}
        />
        <StatCard
          icon={<Heart className="w-5 h-5 text-red-500" />}
          label="Disukai"
          value={likesReceived}
        />
        <StatCard
          icon={<MessageCircle className="w-5 h-5 text-green-500" />}
          label="Komentar"
          value={commentsCount}
        />
        <StatCard
          icon={<Calendar className="w-5 h-5 text-purple-500" />}
          label="Bergabung"
          value={joinDate}
          isDate
        />
      </div>

      {/* Badges Section */}
      {badges.length > 0 && (
        <div className="neumorphic-card p-6 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-[#0066CC]" />
            <h3 className="text-lg font-semibold text-[#1D1D1F]">Lencana</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {badges.map((badge, index) => (
              <Badge
                key={index}
                variant="outline"
                className="neumorphic-button-sm px-3 py-1"
              >
                <Star className="w-3 h-3 mr-1" />
                {badge}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Achievement Goals */}
      <div className="neumorphic-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <Target className="w-5 h-5 text-[#0066CC]" />
          <h3 className="text-lg font-semibold text-[#1D1D1F]">
            Target Pencapaian
          </h3>
        </div>
        <div className="space-y-3">
          <AchievementItem
            title="Kontributor Aktif"
            description="Buat 10 postingan dalam sebulan"
            progress={postsCount}
            target={10}
            completed={postsCount >= 10}
          />
          <AchievementItem
            title="Populer"
            description="Dapatkan 50 like"
            progress={likesReceived}
            target={50}
            completed={likesReceived >= 50}
          />
          <AchievementItem
            title="Diskusi Aktif"
            description="Buat 25 komentar"
            progress={commentsCount}
            target={25}
            completed={commentsCount >= 25}
          />
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  isDate = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: number | string;
  isDate?: boolean;
}) {
  return (
    <div className="neumorphic-card p-4 text-center">
      <div className="flex justify-center mb-2">{icon}</div>
      <div className="text-lg font-semibold text-[#1D1D1F] mb-1">
        {isDate
          ? value
          : typeof value === "number"
            ? value.toLocaleString()
            : value}
      </div>
      <div className="text-xs text-[#86868B]">{label}</div>
    </div>
  );
}

function AchievementItem({
  title,
  description,
  progress,
  target,
  completed,
}: {
  title: string;
  description: string;
  progress: number;
  target: number;
  completed: boolean;
}) {
  const progressPercentage = Math.min((progress / target) * 100, 100);

  return (
    <div className="flex items-center justify-between p-3 neumorphic-card-inset rounded-lg">
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="text-sm font-medium text-[#1D1D1F]">{title}</h4>
          {completed && (
            <Badge variant="default" className="text-xs px-2 py-0">
              ✓ Selesai
            </Badge>
          )}
        </div>
        <p className="text-xs text-[#86868B] mb-2">{description}</p>
        <div className="flex items-center gap-2">
          <div className="flex-1 neumorphic-card-inset rounded-full h-2 overflow-hidden">
            <div
              className={`h-full transition-all duration-500 ${
                completed
                  ? "bg-gradient-to-r from-green-500 to-emerald-500"
                  : "bg-gradient-to-r from-blue-500 to-purple-500"
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <span className="text-xs text-[#86868B] min-w-fit">
            {progress}/{target}
          </span>
        </div>
      </div>
    </div>
  );
}

export default UserStats;
