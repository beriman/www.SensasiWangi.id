import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Clock,
  Star,
  Heart,
} from "lucide-react";

const TRENDING_TOPICS = [
  {
    id: 1,
    title: "Best Summer Fragrances 2024",
    author: "FragranceExpert",
    replies: 45,
    views: 1200,
    lastActivity: "2 hours ago",
    category: "Recommendations",
    isHot: true,
  },
  {
    id: 2,
    title: "DIY Perfume Making: Essential Oils Guide",
    author: "PerfumerPro",
    replies: 32,
    views: 890,
    lastActivity: "4 hours ago",
    category: "DIY & Tutorials",
    isHot: false,
  },
  {
    id: 3,
    title: "Creed Aventus vs. Tom Ford Oud Wood",
    author: "ScentCollector",
    replies: 67,
    views: 2100,
    lastActivity: "1 hour ago",
    category: "Reviews",
    isHot: true,
  },
  {
    id: 4,
    title: "Vintage Perfumes: Are They Worth It?",
    author: "VintageNose",
    replies: 23,
    views: 650,
    lastActivity: "6 hours ago",
    category: "Discussion",
    isHot: false,
  },
];

const CATEGORIES = [
  // Fragrance Enthusiasts
  {
    name: "Diskusi Umum Parfum",
    count: 1234,
    icon: MessageCircle,
    category: "enthusiasts",
  },
  { name: "Review & Rating", count: 856, icon: Star, category: "enthusiasts" },
  {
    name: "Rekomendasi Parfum",
    count: 678,
    icon: TrendingUp,
    category: "enthusiasts",
  },
  {
    name: "Koleksi & Showcase",
    count: 432,
    icon: Heart,
    category: "enthusiasts",
  },
  { name: "Marketplace", count: 234, icon: Users, category: "enthusiasts" },

  // Perfumers/Formulators
  {
    name: "Formula & Resep",
    count: 189,
    icon: MessageCircle,
    category: "formulators",
  },
  { name: "Bahan & Supplier", count: 145, icon: Star, category: "formulators" },
  {
    name: "Teknik Pembuatan",
    count: 267,
    icon: TrendingUp,
    category: "formulators",
  },
  {
    name: "Peralatan & Tools",
    count: 98,
    icon: Heart,
    category: "formulators",
  },
  { name: "Bisnis Parfum", count: 156, icon: Users, category: "formulators" },
];

export default function Forum() {
  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-orange-300 via-orange-600 to-teal-500 bg-clip-text text-transparent">
              Parfum Forum
            </h1>
            <p className="text-xl text-[#718096] max-w-2xl mx-auto">
              Connect with fellow fragrance enthusiasts, share reviews, and
              discover new scents
            </p>
          </div>

          <div className="grid lg:grid-cols-4 gap-8">
            {/* Categories Sidebar */}
            <div className="lg:col-span-1">
              <div className="neumorphic-card p-8 mb-8">
                <h2 className="text-xl font-bold text-[#2d3748] mb-6 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Kategori Forum
                </h2>

                {/* Fragrance Enthusiasts Section */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-[#667eea] mb-3 border-b border-[#e2e8f0] pb-2">
                    Fragrance Enthusiasts
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.filter(
                      (cat) => cat.category === "enthusiasts",
                    ).map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <div
                          key={category.name}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f7fafc] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-4 w-4 text-[#667eea]" />
                            <span className="text-sm font-medium text-[#2d3748]">
                              {category.name}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Perfumers/Formulators Section */}
                <div>
                  <h3 className="text-lg font-semibold text-[#667eea] mb-3 border-b border-[#e2e8f0] pb-2">
                    Perfumers & Formulators
                  </h3>
                  <div className="space-y-2">
                    {CATEGORIES.filter(
                      (cat) => cat.category === "formulators",
                    ).map((category) => {
                      const IconComponent = category.icon;
                      return (
                        <div
                          key={category.name}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f7fafc] transition-colors cursor-pointer"
                        >
                          <div className="flex items-center gap-3">
                            <IconComponent className="h-4 w-4 text-[#667eea]" />
                            <span className="text-sm font-medium text-[#2d3748]">
                              {category.name}
                            </span>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            {category.count}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Stats Card */}
              <div className="neumorphic-card p-8">
                <h3 className="text-lg font-bold text-[#2d3748] mb-4">
                  Community Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm text-[#718096]">
                      Total Members
                    </span>
                    <span className="text-sm font-semibold text-[#2d3748]">
                      5,234
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#718096]">Active Today</span>
                    <span className="text-sm font-semibold text-[#2d3748]">
                      342
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#718096]">Total Posts</span>
                    <span className="text-sm font-semibold text-[#2d3748]">
                      12,456
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Action Bar */}
              <div className="neumorphic-card p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold hover:text-[#667eea] border-0 shadow-none">
                      New Topic
                    </Button>
                    <div className="flex items-center gap-2 text-sm text-[#718096]">
                      <TrendingUp className="h-4 w-4" />
                      <span>Trending discussions</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button className="neumorphic-button-sm bg-transparent text-[#2d3748] font-medium border-0 shadow-none">
                      Latest
                    </Button>
                    <Button className="neumorphic-button-sm bg-transparent text-[#718096] font-medium border-0 shadow-none">
                      Popular
                    </Button>
                    <Button className="neumorphic-button-sm bg-transparent text-[#718096] font-medium border-0 shadow-none">
                      Unanswered
                    </Button>
                  </div>
                </div>
              </div>

              {/* Topics List */}
              <div className="space-y-4">
                {TRENDING_TOPICS.map((topic) => (
                  <Card
                    key={topic.id}
                    className="neumorphic-card transition-all duration-300 cursor-pointer border-0 shadow-none"
                  >
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={
                                topic.isHot ? "destructive" : "secondary"
                              }
                              className="text-xs"
                            >
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
                          <CardTitle className="text-lg font-semibold text-[#2d3748] hover:text-[#667eea] transition-colors">
                            {topic.title}
                          </CardTitle>
                          <CardDescription className="text-sm text-[#718096] mt-1">
                            by {topic.author}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center justify-between text-sm text-[#718096]">
                        <div className="flex items-center gap-4">
                          <div className="flex items-center gap-1">
                            <MessageCircle className="h-4 w-4" />
                            <span>{topic.replies} replies</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{topic.views} views</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          <span>{topic.lastActivity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Load More */}
              <div className="text-center mt-8">
                <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none px-8 py-4">
                  Load More Topics
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
