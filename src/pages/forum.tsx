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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import VideoEmbed, { VideoData } from "@/components/video-embed";
import ImageEmbed from "@/components/image-embed";
import {
  MessageCircle,
  Users,
  TrendingUp,
  Clock,
  Star,
  Heart,
  Plus,
  Video,
  Image,
  Send,
} from "lucide-react";
import { usePaginatedQuery, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";

import { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";

interface Topic {
  _id: Id<"topics">;
  title: string;
  content: string;
  category: string;
  authorId: Id<"users">;
  authorName: string;
  views: number;
  likes: number;
  isHot: boolean;
  isPinned: boolean;
  hasVideo: boolean;
  hasImages: boolean;
  tags: string[];
  videoUrls?: string[];
  imageUrls?: string[];
  createdAt: number;
  updatedAt: number;
}

interface Comment {
  _id: Id<"comments">;
  topicId: Id<"topics">;
  content: string;
  authorId: Id<"users">;
  authorName: string;
  likes: number;
  createdAt: number;
  updatedAt: number;
}

// Icon mapping untuk categories
const ICON_MAP: { [key: string]: any } = {
  MessageCircle,
  Star,
  TrendingUp,
  Heart,
  Users,
};

export default function Forum() {
  const { user } = useUser();
  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState(
    "Diskusi Umum Parfum",
  );
  const [embeddedVideos, setEmbeddedVideos] = useState<VideoData[]>([]);
  const [embeddedImages, setEmbeddedImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "unanswered">(
    "newest",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [newTopicTags, setNewTopicTags] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isTopicDetailOpen, setIsTopicDetailOpen] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const { toast } = useToast();

  // Convex queries and mutations
  const topicsResult = usePaginatedQuery(
    api.forum.getTopics,
    {
      category: selectedCategory || undefined,
      sortBy: sortBy,
      searchQuery: searchQuery || undefined,
      tag: selectedTag || undefined,
    },
    { initialNumItems: 10 },
  );

  const forumStats = useQuery(api.forum.getForumStats);
  const categories = useQuery(api.forum.getCategories);
  const allTags = useQuery(api.forum.getAllTags);
  const createTopicMutation = useMutation(api.forum.createTopic);
  const toggleLikeMutation = useMutation(api.forum.toggleTopicLike);
  const incrementViewsMutation = useMutation(api.forum.incrementTopicViews);
  const createCommentMutation = useMutation(api.forum.createComment);
  const initializeCategoriesMutation = useMutation(
    api.forum.initializeCategories,
  );
  const updateAllCategoryCountsMutation = useMutation(
    api.forum.updateAllCategoryCounts,
  );

  const selectedTopicComments = useQuery(
    api.forum.getCommentsByTopic,
    selectedTopic ? { topicId: selectedTopic._id } : "skip",
  );

  const currentUser = useQuery(
    api.users.getUserByToken,
    user ? { tokenIdentifier: user.id } : "skip",
  );

  const userLikedTopics = useQuery(
    api.forum.hasUserLikedTopic,
    selectedTopic && currentUser
      ? { topicId: selectedTopic._id, userId: currentUser._id }
      : "skip",
  );

  const handleVideoAdd = (videoData: VideoData) => {
    setEmbeddedVideos((prev) => [...prev, videoData]);
  };

  const handleImageAdd = (url: string) => {
    setEmbeddedImages((prev) => [...prev, url]);
  };

  const handleCreateTopic = async () => {
    if (!newTopicTitle.trim() || !newTopicContent.trim()) {
      toast({
        title: "Error",
        description: "Judul dan konten tidak boleh kosong!",
        variant: "destructive",
      });
      return;
    }

    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk membuat topik!",
        variant: "destructive",
      });
      return;
    }

    try {
      await createTopicMutation({
        title: newTopicTitle,
        content: newTopicContent,
        category: newTopicCategory,
        tags: newTopicTags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t.length > 0),
        hasVideo: embeddedVideos.length > 0,
        hasImages: embeddedImages.length > 0,
        videoUrls: embeddedVideos.map((v) => v.url),
        imageUrls: embeddedImages,
      } as any);

      // Reset form
      setNewTopicTitle("");
      setNewTopicContent("");
      setNewTopicTags("");
      setEmbeddedVideos([]);
      setEmbeddedImages([]);
      setIsNewTopicOpen(false);

      toast({
        title: "Topik berhasil dibuat!",
      });

      // Update category counts setelah membuat topik baru
      setTimeout(() => {
        updateAllCategoryCountsMutation();
      }, 1000);
    } catch (error) {
      console.error("Error creating topic:", error);
      toast({
        title: "Error",
        description: "Gagal membuat topik. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleLikeTopic = async (topicId: Id<"topics">) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk like topik!",
        variant: "destructive",
      });
      return;
    }

    try {
      const liked = await toggleLikeMutation({ topicId });
      toast({
        title: liked ? "Topik disukai" : "Batal menyukai topik",
      });
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Gagal melakukan like. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleTopicClick = async (topic: Topic) => {
    // Increment view count
    try {
      await incrementViewsMutation({ topicId: topic._id });
    } catch (error) {
      console.error("Error incrementing views:", error);
    }

    setSelectedTopic(topic);
    setIsTopicDetailOpen(true);
  };

  const handleCreateComment = async () => {
    if (!newCommentContent.trim()) {
      toast({
        title: "Error",
        description: "Komentar tidak boleh kosong!",
        variant: "destructive",
      });
      return;
    }

    if (!user || !selectedTopic) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk berkomentar!",
        variant: "destructive",
      });
      return;
    }

    try {
      await createCommentMutation({
        topicId: selectedTopic._id,
        content: newCommentContent,
      });

      setNewCommentContent("");
      toast({
        title: "Komentar berhasil ditambahkan!",
      });
    } catch (error) {
      console.error("Error creating comment:", error);
      toast({
        title: "Error",
        description: "Gagal menambahkan komentar. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60),
    );

    if (diffInHours < 1) {
      return "Baru saja";
    } else if (diffInHours < 24) {
      return `${diffInHours} jam lalu`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} hari lalu`;
    }
  };

  const formatDateString = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("id-ID");
  };

  const topics = topicsResult?.results || [];
  const hasMore = topicsResult?.status === "CanLoadMore";
  const isLoading = topicsResult?.status === "LoadingFirstPage";

  const loadMore = () => {
    if (hasMore) {
      topicsResult?.loadMore(10);
    }
  };

  // Initialize categories jika belum ada dan update counts
  useEffect(() => {
    if (categories && categories.length === 0) {
      initializeCategoriesMutation();
    } else if (categories && categories.length > 0) {
      // Update category counts saat pertama kali load
      updateAllCategoryCountsMutation();
    }
  }, [
    categories,
    initializeCategoriesMutation,
    updateAllCategoryCountsMutation,
  ]);

  // Group categories by type
  const enthusiastsCategories =
    categories?.filter((cat) => cat.type === "enthusiasts") || [];
  const formulatorsCategories =
    categories?.filter((cat) => cat.type === "formulators") || [];

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
                    {enthusiastsCategories.map((category) => {
                      const IconComponent =
                        ICON_MAP[category.icon] || MessageCircle;
                      return (
                        <div
                          key={category._id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f7fafc] transition-colors cursor-pointer"
                          onClick={() => setSelectedCategory(category.name)}
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
                    {formulatorsCategories.map((category) => {
                      const IconComponent =
                        ICON_MAP[category.icon] || MessageCircle;
                      return (
                        <div
                          key={category._id}
                          className="flex items-center justify-between p-3 rounded-lg hover:bg-[#f7fafc] transition-colors cursor-pointer"
                          onClick={() => setSelectedCategory(category.name)}
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
                      {forumStats?.totalMembers || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#718096]">Active Today</span>
                    <span className="text-sm font-semibold text-[#2d3748]">
                      {forumStats?.activeToday || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-[#718096]">Total Posts</span>
                    <span className="text-sm font-semibold text-[#2d3748]">
                      {forumStats?.totalPosts || 0}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Search and Filter Bar */}
              <div className="neumorphic-card p-6 mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Input
                      placeholder="Cari topik, konten, atau pengguna..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="neumorphic-input border-0 flex-1"
                    />
                    <Select
                      value={selectedTag || ""}
                      onValueChange={(val) =>
                        setSelectedTag(val === "" ? null : val)
                      }
                    >
                      <SelectTrigger className="neumorphic-input border-0 w-full sm:w-48">
                        <SelectValue placeholder="Filter Tag" />
                      </SelectTrigger>
                      <SelectContent className="neumorphic-card border-0">
                        <SelectItem value="">Semua Tag</SelectItem>
                        {allTags?.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory && (
                      <Button
                        onClick={() => setSelectedCategory(null)}
                        variant="outline"
                        className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                      >
                        ✕ {selectedCategory}
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Action Bar */}
              <div className="neumorphic-card p-6 mb-8">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <Dialog
                      open={isNewTopicOpen}
                      onOpenChange={setIsNewTopicOpen}
                    >
                      <DialogTrigger asChild>
                        <Button className="neumorphic-button bg-transparent text-[#2d3748] font-semibold hover:text-[#667eea] border-0 shadow-none">
                          <Plus className="h-4 w-4 mr-2" />
                          Topik Baru
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="neumorphic-card border-0 shadow-none max-w-2xl max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                        <DialogHeader>
                          <DialogTitle className="text-[#2d3748]">
                            Buat Topik Baru
                          </DialogTitle>
                          <DialogDescription className="text-[#718096]">
                            Bagikan pengalaman, pertanyaan, atau diskusi tentang
                            parfum dengan komunitas.
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-6">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2d3748]">
                              Kategori
                            </label>
                            <select
                              value={newTopicCategory}
                              onChange={(e) =>
                                setNewTopicCategory(e.target.value)
                              }
                              className="w-full p-3 rounded-lg neumorphic-input border-0 text-[#2d3748] bg-transparent"
                            >
                              <optgroup label="Fragrance Enthusiasts">
                                {enthusiastsCategories.map((category) => (
                                  <option
                                    key={category._id}
                                    value={category.name}
                                  >
                                    {category.name}
                                  </option>
                                ))}
                              </optgroup>
                              <optgroup label="Perfumers & Formulators">
                                {formulatorsCategories.map((category) => (
                                  <option
                                    key={category._id}
                                    value={category.name}
                                  >
                                    {category.name}
                                  </option>
                                ))}
                              </optgroup>
                            </select>
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2d3748]">
                              Judul Topik
                            </label>
                            <Input
                              placeholder="Masukkan judul topik yang menarik..."
                              value={newTopicTitle}
                              onChange={(e) => setNewTopicTitle(e.target.value)}
                              className="neumorphic-input border-0"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2d3748]">
                              Konten
                            </label>
                          <Textarea
                              placeholder="Tulis konten topik Anda di sini... Bagikan pengalaman, ajukan pertanyaan, atau mulai diskusi menarik!"
                              value={newTopicContent}
                              onChange={(e) =>
                                setNewTopicContent(e.target.value)
                              }
                              className="neumorphic-input border-0 min-h-[120px] resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label className="text-sm font-medium text-[#2d3748]">
                              Tags (pisahkan dengan koma)
                            </label>
                            <Input
                              placeholder="contoh: fruity, sweet"
                              value={newTopicTags}
                              onChange={(e) => setNewTopicTags(e.target.value)}
                              className="neumorphic-input border-0"
                            />
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-2 text-sm font-medium text-[#2d3748]">
                              <Video className="h-4 w-4" />
                              <span>Media</span>
                            </div>
                            <VideoEmbed onVideoAdd={handleVideoAdd} />
                            <ImageEmbed onImageAdd={handleImageAdd} />
                          </div>
                        </div>
                        <DialogFooter className="flex gap-2">
                          <Button
                            onClick={() => setIsNewTopicOpen(false)}
                            variant="outline"
                            className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                          >
                            Batal
                          </Button>
                          <Button
                            onClick={handleCreateTopic}
                            className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Posting Topik
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                    <div className="flex items-center gap-2 text-sm text-[#718096]">
                      <TrendingUp className="h-4 w-4" />
                      <span>Diskusi trending</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      onClick={() => setSortBy("newest")}
                      className={`neumorphic-button-sm bg-transparent font-medium border-0 shadow-none ${
                        sortBy === "newest"
                          ? "text-[#2d3748]"
                          : "text-[#718096]"
                      }`}
                    >
                      Terbaru
                    </Button>
                    <Button
                      onClick={() => setSortBy("popular")}
                      className={`neumorphic-button-sm bg-transparent font-medium border-0 shadow-none ${
                        sortBy === "popular"
                          ? "text-[#2d3748]"
                          : "text-[#718096]"
                      }`}
                    >
                      Populer
                    </Button>
                    <Button
                      onClick={() => setSortBy("unanswered")}
                      className={`neumorphic-button-sm bg-transparent font-medium border-0 shadow-none ${
                        sortBy === "unanswered"
                          ? "text-[#2d3748]"
                          : "text-[#718096]"
                      }`}
                    >
                      Belum Dijawab
                    </Button>
                  </div>
                </div>
              </div>

              {/* Topics List */}
              <div className="space-y-4">
                {isLoading ? (
                  <div className="neumorphic-card p-12 text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#667eea] mx-auto mb-4"></div>
                    <p className="text-[#718096]">Memuat topik...</p>
                  </div>
                ) : topics.length === 0 ? (
                  <div className="neumorphic-card p-12 text-center">
                    <MessageCircle className="h-12 w-12 text-[#718096] mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                      Tidak ada topik ditemukan
                    </h3>
                    <p className="text-[#718096] mb-4">
                      {searchQuery
                        ? "Coba ubah kata kunci pencarian Anda"
                        : "Belum ada topik dalam kategori ini"}
                    </p>
                    <Button
                      onClick={() => setIsNewTopicOpen(true)}
                      className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Buat Topik Pertama
                    </Button>
                  </div>
                ) : (
                  topics.map((topic) => (
                    <Card
                      key={topic._id}
                      className="neumorphic-card transition-all duration-300 cursor-pointer border-0 shadow-none hover:scale-[1.02]"
                      onClick={() => handleTopicClick(topic)}
                    >
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2 flex-wrap">
                              <Badge
                                variant={
                                  topic.isHot ? "destructive" : "secondary"
                                }
                                className="text-xs"
                              >
                                {topic.category}
                              </Badge>
                              {topic.isPinned && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-green-600 border-green-200"
                                >
                                  📌 Pinned
                                </Badge>
                              )}
                              {topic.isHot && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-orange-600 border-orange-200"
                                >
                                  🔥 Hot
                                </Badge>
                              )}
                              {topic.hasVideo && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-purple-600 border-purple-200 flex items-center gap-1"
                                >
                                  <Video className="h-3 w-3" />
                                  Video
                                </Badge>
                              )}
                              {(topic as any).hasImages && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-teal-600 border-teal-200 flex items-center gap-1"
                                >
                                  <Image className="h-3 w-3" />
                                  Gambar
                                </Badge>
                              )}
                              {(topic as any).replies === 0 && (
                                <Badge
                                  variant="outline"
                                  className="text-xs text-blue-600 border-blue-200"
                                >
                                  Belum Dijawab
                                </Badge>
                              )}
                            </div>
                            <CardTitle className="text-lg font-semibold text-[#2d3748] hover:text-[#667eea] transition-colors">
                              {topic.title}
                            </CardTitle>
                            <CardDescription className="text-sm text-[#718096] mt-1">
                              oleh {topic.authorName} •{" "}
                              {formatDateString(topic.createdAt)}
                            </CardDescription>
                            <p className="text-sm text-[#718096] mt-2 line-clamp-2">
                              {topic.content.substring(0, 150)}...
                            </p>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center justify-between text-sm text-[#718096]">
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <MessageCircle className="h-4 w-4" />
                              <span>
                                {selectedTopicComments?.length || 0} balasan
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              <span>{topic.views} dilihat</span>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLikeTopic(topic._id);
                              }}
                              className="flex items-center gap-1 hover:text-red-500 transition-colors"
                            >
                              <Heart className="h-4 w-4" />
                              <span>{topic.likes}</span>
                            </button>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{formatDate(topic.updatedAt)}</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>

              {/* Load More */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMore}
                    className="neumorphic-button bg-transparent text-[#2d3748] font-medium border-0 shadow-none"
                  >
                    Muat Lebih Banyak
                  </Button>
                </div>
              )}

              {/* Topic Detail Modal */}
              <Dialog
                open={isTopicDetailOpen}
                onOpenChange={setIsTopicDetailOpen}
              >
                <DialogContent className="neumorphic-card border-0 shadow-none max-w-4xl max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                  {selectedTopic && (
                    <>
                      <DialogHeader>
                        <div className="flex items-center gap-2 mb-2 flex-wrap">
                          <Badge variant="secondary" className="text-xs">
                            {selectedTopic.category}
                          </Badge>
                          {selectedTopic.isPinned && (
                            <Badge
                              variant="outline"
                              className="text-xs text-green-600 border-green-200"
                            >
                              📌 Pinned
                            </Badge>
                          )}
                          {selectedTopic.isHot && (
                            <Badge
                              variant="outline"
                              className="text-xs text-orange-600 border-orange-200"
                            >
                              🔥 Hot
                            </Badge>
                          )}
                        </div>
                        <DialogTitle className="text-2xl font-bold text-[#2d3748] text-left">
                          {selectedTopic.title}
                        </DialogTitle>
                        <DialogDescription className="text-[#718096] text-left">
                          oleh {selectedTopic.authorName} •{" "}
                          {formatDateString(selectedTopic.createdAt)} •{" "}
                          {selectedTopic.views} dilihat
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6">
                        <div className="prose max-w-none">
                          <p className="text-[#2d3748] leading-relaxed">
                            {selectedTopic.content}
                          </p>
                          {selectedTopic.imageUrls && selectedTopic.imageUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {selectedTopic.imageUrls.map((url, idx) => (
                                <img key={idx} src={url} className="w-full rounded-lg" />
                              ))}
                            </div>
                          )}
                          {selectedTopic.videoUrls && selectedTopic.videoUrls.length > 0 && (
                            <div className="space-y-4 mt-4">
                              {selectedTopic.videoUrls.map((v, idx) => (
                                <iframe
                                  key={idx}
                                  src={v}
                                  className="w-full aspect-video rounded-lg"
                                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                  allowFullScreen
                                />
                              ))}
                            </div>
                          )}
                        </div>

                        <div className="flex items-center gap-4 pt-4 border-t border-[#e2e8f0]">
                          <button
                            onClick={() => handleLikeTopic(selectedTopic._id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                              userLikedTopics
                                ? "bg-red-50 text-red-600"
                                : "hover:bg-gray-50 text-[#718096]"
                            }`}
                          >
                            <Heart
                              className={`h-5 w-5 ${userLikedTopics ? "fill-current" : ""}`}
                            />
                            <span>{selectedTopic.likes} Suka</span>
                          </button>

                          <div className="flex items-center gap-2 text-[#718096]">
                            <MessageCircle className="h-5 w-5" />
                            <span>
                              {selectedTopicComments?.length || 0} Balasan
                            </span>
                          </div>
                        </div>

                        {/* Comments Section Placeholder */}
                        <div className="space-y-4">
                          <h3 className="text-lg font-semibold text-[#2d3748]">
                            Balasan ({selectedTopicComments?.length || 0})
                          </h3>

                          {!selectedTopicComments ||
                          selectedTopicComments.length === 0 ? (
                            <div className="text-center py-8 text-[#718096]">
                              <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                              <p>Belum ada balasan. Jadilah yang pertama!</p>
                            </div>
                          ) : (
                            <div className="space-y-4">
                              {selectedTopicComments.map((comment) => (
                                <div
                                  key={comment._id}
                                  className="neumorphic-card-inset p-4"
                                >
                                  <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 rounded-full bg-[#667eea] flex items-center justify-center text-white text-sm font-semibold">
                                      {comment.authorName
                                        .charAt(0)
                                        .toUpperCase()}
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-1">
                                        <span className="font-medium text-[#2d3748]">
                                          {comment.authorName}
                                        </span>
                                        <span className="text-xs text-[#718096]">
                                          {formatDate(comment.createdAt)}
                                        </span>
                                      </div>
                                      <p className="text-[#2d3748]">
                                        {comment.content}
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Reply Form */}
                          <div className="neumorphic-card-inset p-4">
                            <h4 className="font-medium text-[#2d3748] mb-3">
                              Tulis Balasan
                            </h4>
                            <Textarea
                              placeholder="Tulis balasan Anda di sini..."
                              value={newCommentContent}
                              onChange={(e) =>
                                setNewCommentContent(e.target.value)
                              }
                              className="neumorphic-input border-0 mb-3"
                            />
                            <Button
                              onClick={handleCreateComment}
                              disabled={!user || !newCommentContent.trim()}
                              className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none disabled:opacity-50"
                            >
                              <Send className="h-4 w-4 mr-2" />
                              Kirim Balasan
                            </Button>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
