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
import AdvancedSearchDialog from "@/components/AdvancedSearchDialog";
import EditHistory from "@/components/EditHistory";
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
  Share,
  BarChart2,
  Bookmark,
  Bell,
  BellOff,
} from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { usePaginatedQuery, useMutation, useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useUser } from "@clerk/clerk-react";

import React, { useState, useEffect } from "react";
import { useToast } from "@/components/ui/use-toast";
import { LoadingSpinner } from "@/components/loading-spinner";
import { Helmet } from "react-helmet";

interface Topic {
  _id: Id<"topics">;
  title: string;
  content: string;
  category: string;
  authorId: Id<"users">;
  authorName: string;
  views: number;
  likes: number;
  score: number;
  isHot: boolean;
  isPinned: boolean;
  isLocked: boolean;
  solvedCommentId?: Id<"comments"> | null;
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
  score: number;
  createdAt: number;
  updatedAt: number;
}

interface AdvancedFilters {
  authorId?: string;
  startDate?: number;
  endDate?: number;
  tags?: string[];
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
  const { category, id } = useParams<{ category?: string; id?: string }>();

  const [isNewTopicOpen, setIsNewTopicOpen] = useState(false);
  const [newTopicTitle, setNewTopicTitle] = useState("");
  const [newTopicContent, setNewTopicContent] = useState("");
  const [newTopicCategory, setNewTopicCategory] = useState(
    "Diskusi Umum Parfum",
  );
  const [embeddedVideos, setEmbeddedVideos] = useState<VideoData[]>([]);
  const [embeddedImages, setEmbeddedImages] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>(category || "all");
  const [selectedTag, setSelectedTag] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"newest" | "popular" | "unanswered">(
    "newest",
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [advancedFilters, setAdvancedFilters] = useState<AdvancedFilters | null>(null);
  const [newTopicTags, setNewTopicTags] = useState("");
  const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
  const [isTopicDetailOpen, setIsTopicDetailOpen] = useState(false);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [commentList, setCommentList] = useState<Comment[]>([]);
  const [isEditTopicOpen, setIsEditTopicOpen] = useState(false);
  const [editTopicTitle, setEditTopicTitle] = useState("");
  const [editTopicContent, setEditTopicContent] = useState("");
  const [isEditCommentOpen, setIsEditCommentOpen] = useState(false);
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null);
  const [editCommentContent, setEditCommentContent] = useState("");
  const [isEditHistoryOpen, setIsEditHistoryOpen] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (category) {
      setSelectedCategory(category);
    }
    if (id) {
      // Fetch and display single topic
      // This will be implemented in the next step
    }
  }, [category, id]);

  // Convex queries and mutations
  const topicsResult = usePaginatedQuery(
    api.forum.getTopics,
    {
      category: category === "all" ? undefined : category,
      sortBy: sortBy,
      searchQuery: searchQuery || undefined,
      tag: selectedTag === "all" ? undefined : selectedTag,
    },
    { initialNumItems: 10 },
  );

  const advancedResults = useQuery(
    api.forum.advancedSearchTopics,
    advancedFilters ? advancedFilters : "skip",
  );

  const pinnedTopics = useQuery(
    api.forum.getPinnedTopics,
    selectedCategory !== "all"
      ? { category: selectedCategory }
      : { category: undefined },
  );

  const forumStats = useQuery(api.forum.getForumStats);
  const categories = useQuery(api.forum.getCategories);
  const allTags = useQuery(api.forum.getAllTags);
  const createTopicMutation = useMutation(api.forum.createTopic);
  const toggleLikeMutation = useMutation(api.forum.toggleTopicLike);
  const toggleTopicVoteMutation = useMutation(api.forum.toggleTopicVote);
  const toggleBookmarkMutation = useMutation(api.bookmarks.toggleBookmark);
  const togglePinMutation = useMutation(api.forum.togglePinTopic);
  const toggleLockMutation = useMutation(api.forum.toggleLockTopic);
  const markSolvedMutation = useMutation(api.forum.markTopicSolved);
  const incrementViewsMutation = useMutation(api.forum.incrementTopicViews);
  const editTopicMutation = useMutation(api.forum.editTopic);
  const createCommentMutation = useMutation(api.forum.createComment);
  const editCommentMutation = useMutation(api.forum.editComment);
  const toggleCommentVoteMutation = useMutation(api.forum.toggleCommentVote);
  const subscribeTopicMutation = useMutation(api.forum.subscribeTopic);
  const unsubscribeTopicMutation = useMutation(api.forum.unsubscribeTopic);
  const initializeCategoriesMutation = useMutation(
    api.forum.initializeCategories,
  );
  const updateAllCategoryCountsMutation = useMutation(
    api.forum.updateAllCategoryCounts,
  );
  const mergeTopicsMutation = useMutation(api.forum.mergeTopics);
  const moveTopicMutation = useMutation(api.forum.moveTopic);
  const saveSearchMutation = useMutation(api.forum.saveSearch);

  const currentUser = useQuery(
    api.users.getUserByToken,
    user ? { tokenIdentifier: user.id } : "skip",
  );

  const savedSearches = useQuery(
    api.forum.getSavedSearches,
    currentUser ? { userId: currentUser._id } : "skip",
  );

  const selectedTopicComments = useQuery(
    api.forum.getCommentsByTopic,
    selectedTopic ? { topicId: selectedTopic._id } : "skip",
  );

  const singleTopic = useQuery(
    api.forum.getTopicById,
    id ? { topicId: id as Id<"topics"> } : "skip",
  );

  useEffect(() => {
    if (selectedTopicComments) {
      setCommentList(selectedTopicComments as Comment[]);
    }
  }, [selectedTopicComments]);

  useEffect(() => {
    if (id && singleTopic) {
      handleTopicClick(singleTopic);
    }
  }, [id, singleTopic]);


  const userBookmarks = useQuery(
    api.bookmarks.getBookmarksByUser,
    currentUser ? { userId: currentUser._id, type: "topic" } : "skip",
  );

  const userLikedTopics = useQuery(
    api.forum.hasUserLikedTopic,
    selectedTopic && currentUser
      ? { topicId: selectedTopic._id, userId: currentUser._id }
      : "skip",
  );

  const isSubscribed = useQuery(
    api.forum.isUserSubscribed,
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

  const handleAdvancedSearch = (filters: AdvancedFilters) => {
    setAdvancedFilters(filters);
  };

  const handleSaveSearch = async (name: string, filters: AdvancedFilters) => {
    try {
      await saveSearchMutation({ name, filters });
      toast({ title: "Saved search" });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    }
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

      // Perbarui state topik jika sedang dibuka
      if (selectedTopic && selectedTopic._id === topicId) {
        const newLikes = liked
          ? selectedTopic.likes + 1
          : Math.max(0, selectedTopic.likes - 1);
        setSelectedTopic({
          ...selectedTopic,
          likes: newLikes,
          isHot: newLikes >= 10 || selectedTopic.isHot,
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      toast({
        title: "Error",
        description: "Gagal melakukan like. Silakan coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleVoteTopic = async (topicId: Id<"topics">, value: 1 | -1) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk vote!",
        variant: "destructive",
      });
      return;
    }
    try {
      const newScore = await toggleTopicVoteMutation({ topicId, value });
      if (selectedTopic && selectedTopic._id === topicId) {
        setSelectedTopic({ ...selectedTopic, score: newScore });
      }
    } catch (error) {
      console.error("Error toggling vote:", error);
    }
  };

  const handleBookmarkTopic = async (topicId: Id<"topics">) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk bookmark!",
        variant: "destructive",
      });
      return;
    }

    try {
      const bookmarked = await toggleBookmarkMutation({
        itemId: topicId,
        type: "topic",
      });
      toast({
        title: bookmarked ? "Ditambahkan ke koleksi" : "Dihapus dari koleksi",
      });
      if (bookmarked && navigator.serviceWorker?.controller) {
        navigator.serviceWorker.controller.postMessage({
          type: "CACHE_URLS",
          urls: [`/forum?topic=${topicId}`],
        });
      }
    } catch (error) {
      console.error("Error toggling bookmark:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah bookmark.",
        variant: "destructive",
      });
    }
  };

  const handleSubscribe = async (topicId: Id<"topics">) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk berlangganan!",
        variant: "destructive",
      });
      return;
    }
    try {
      await subscribeTopicMutation({ topicId });
      toast({ title: "Berlangganan" });
    } catch (err) {
      console.error("Error subscribe", err);
    }
  };

  const handleUnsubscribe = async (topicId: Id<"topics">) => {
    if (!user) return;
    try {
      await unsubscribeTopicMutation({ topicId });
      toast({ title: "Berhenti langganan" });
    } catch (err) {
      console.error("Error unsubscribe", err);
    }
  };

  const handleTogglePin = async (topicId: Id<"topics">) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk pin topik!",
        variant: "destructive",
      });
      return;
    }

    try {
      const pinned = await togglePinMutation({ topicId });
      toast({
        title: pinned ? "Topik dipin" : "Pin dilepas",
      });
    } catch (error) {
      console.error("Error toggling pin:", error);
      toast({
        title: "Error",
        description: "Gagal mengubah pin. Coba lagi.",
        variant: "destructive",
      });
    }
  };

  const handleToggleLock = async (topicId: Id<"topics">) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk lock topik!",
        variant: "destructive",
      });
      return;
    }
    try {
      const locked = await toggleLockMutation({ topicId });
      toast({ title: locked ? "Topik dikunci" : "Kunci dibuka" });
      if (selectedTopic && selectedTopic._id === topicId) {
        setSelectedTopic({ ...selectedTopic, isLocked: locked });
      }
    } catch (error) {
      console.error("Error toggling lock:", error);
    }
  };

  const handleMoveTopic = async () => {
    if (!currentUser || currentUser.role !== "admin" || !selectedTopic) return;
    const newCat = prompt("Kategori baru");
    if (!newCat) return;
    try {
      await moveTopicMutation({ topicId: selectedTopic._id, newCategory: newCat } as any);
      setSelectedTopic({ ...selectedTopic, category: newCat });
      toast({ title: "Topik dipindahkan" });
    } catch (err) {
      console.error("Error moving topic", err);
    }
  };

  const handleMergeTopic = async () => {
    if (!currentUser || currentUser.role !== "admin" || !selectedTopic) return;
    const targetId = prompt("ID topik tujuan");
    if (!targetId) return;
    try {
      await mergeTopicsMutation({ sourceId: selectedTopic._id, targetId: targetId as any } as any);
      toast({ title: "Topik digabung" });
      setIsTopicDetailOpen(false);
    } catch (err) {
      console.error("Error merging topics", err);
    }
  };

  const handleEditTopic = async () => {
    if (!selectedTopic) return;
    if (!editTopicTitle.trim() || !editTopicContent.trim()) {
      toast({
        title: "Error",
        description: "Judul dan konten tidak boleh kosong!",
        variant: "destructive",
      });
      return;
    }

    try {
      await editTopicMutation({
        topicId: selectedTopic._id,
        title: editTopicTitle,
        content: editTopicContent,
      } as any);

      setSelectedTopic({
        ...selectedTopic,
        title: editTopicTitle,
        content: editTopicContent,
      });
      setIsEditTopicOpen(false);
      toast({ title: "Topik berhasil diperbarui!" });
    } catch (error: any) {
      console.error("Error editing topic:", error);
      toast({
        title: "Error",
        description: error.message,
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
    setEditTopicTitle(topic.title);
    setEditTopicContent(topic.content);
    setIsTopicDetailOpen(true);
  };

  useEffect(() => {
    if (id && singleTopic) {
      handleTopicClick(singleTopic);
    }
  }, [id, singleTopic]);

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

  const handleVoteComment = async (
    commentId: Id<"comments">,
    value: 1 | -1,
  ) => {
    if (!user) {
      toast({
        title: "Login diperlukan",
        description: "Anda harus login untuk vote!",
        variant: "destructive",
      });
      return;
    }
    try {
      const newScore = await toggleCommentVoteMutation({ commentId, value });
      setCommentList((prev) =>
        prev.map((c) => (c._id === commentId ? { ...c, score: newScore } : c)),
      );
    } catch (error) {
      console.error("Error toggling comment vote:", error);
    }
  };

  const handleMarkSolved = async (commentId: Id<"comments">) => {
    if (!user || !selectedTopic) return;
    try {
      await markSolvedMutation({ topicId: selectedTopic._id, commentId });
      setSelectedTopic({ ...selectedTopic, solvedCommentId: commentId });
      toast({ title: "Topik ditandai selesai" });
    } catch (err) {
      console.error("Error marking solved", err);
    }
  };

  const handleEditComment = async () => {
    if (!selectedComment) return;
    if (!editCommentContent.trim()) {
      toast({
        title: "Error",
        description: "Komentar tidak boleh kosong!",
        variant: "destructive",
      });
      return;
    }
    try {
      await editCommentMutation({
        commentId: selectedComment._id,
        content: editCommentContent,
      } as any);
      setCommentList((prev) =>
        prev.map((c) =>
          c._id === selectedComment._id ? { ...c, content: editCommentContent } : c,
        ),
      );
      setIsEditCommentOpen(false);
      toast({ title: "Komentar berhasil diperbarui!" });
    } catch (error: any) {
      console.error("Error editing comment:", error);
      toast({
        title: "Error",
        description: error.message,
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

  const highlightText = (text: string, query: string) => {
    if (!query) return text;
    const terms = (query.match(/(?:AND|OR|NOT)|[^\s]+/gi) || [])
      .filter((t) => !/^(AND|OR|NOT)$/i.test(t))
      .map((t) => t.toLowerCase());
    if (terms.length === 0) return text;
    const escaped = terms.map((t) => t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
    const regex = new RegExp(`(${escaped.join("|")})`, "gi");
    return text.split(regex).map((part, i) =>
      terms.includes(part.toLowerCase()) ? (
        <mark key={i} className="bg-yellow-200">
          {part}
        </mark>
      ) : (
        part
      ),
    );
  };

  const topics = advancedFilters
    ? advancedResults || []
    : topicsResult?.results || [];
  const unpinnedTopics = topics.filter((t: any) => !t.isPinned);
  const hasMore = advancedFilters ? false : topicsResult?.status === "CanLoadMore";
  const isLoading = advancedFilters
    ? advancedResults === undefined
    : topicsResult?.status === "LoadingFirstPage";
  const isLoadingCategories = categories === undefined;
  const isLoadingStats = forumStats === undefined;

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

  // Show loading spinner if essential data is still loading
  if (isLoadingCategories || isLoadingStats) {
    return <LoadingSpinner />;
  }

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Helmet>
        <title>Sensasi Wangi - Forum</title>
        <meta
          name="description"
          content="Discuss perfumes and share tips with other enthusiasts"
        />
      </Helmet>
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
                      value={selectedTag}
                      onValueChange={(val) => setSelectedTag(val)}
                    >
                      <SelectTrigger className="neumorphic-input border-0 w-full sm:w-48">
                        <SelectValue placeholder="Filter Tag" />
                      </SelectTrigger>
                      <SelectContent className="neumorphic-card border-0">
                        <SelectItem value="all">Semua Tag</SelectItem>
                        {allTags?.map((tag) => (
                          <SelectItem key={tag} value={tag}>
                            {tag}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {selectedCategory !== "all" && (
                      <Button
                        onClick={() => setSelectedCategory("all")}
                        variant="outline"
                        className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                      >
                        ✕ {selectedCategory}
                      </Button>
                    )}
                    <AdvancedSearchDialog
                      onSearch={handleAdvancedSearch}
                      onSave={handleSaveSearch}
                    />
                  </div>
                  {savedSearches && savedSearches.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {savedSearches.map((s: any) => (
                        <Button
                          key={s._id}
                          variant="outline"
                          size="sm"
                          className="neumorphic-button-sm bg-transparent text-[#2d3748] border-0 shadow-none"
                          onClick={() => handleAdvancedSearch(s.filters)}
                        >
                          {s.name}
                        </Button>
                      ))}
                    </div>
                  )}
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
                            <label htmlFor="topic-title" className="text-sm font-medium text-[#2d3748]">
                              Judul Topik
                            </label>
                            <Input
                              id="topic-title"
                              placeholder="Masukkan judul topik yang menarik..."
                              value={newTopicTitle}
                              onChange={(e) => setNewTopicTitle(e.target.value)}
                              className="neumorphic-input border-0"
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="topic-content" className="text-sm font-medium text-[#2d3748]">
                              Konten
                            </label>
                            <Textarea
                              id="topic-content"
                              placeholder="Tulis konten topik Anda di sini... Bagikan pengalaman, ajukan pertanyaan, atau mulai diskusi menarik!"
                              value={newTopicContent}
                              onChange={(e) =>
                                setNewTopicContent(e.target.value)
                              }
                              className="neumorphic-input border-0 min-h-[120px] resize-none"
                            />
                          </div>

                          <div className="space-y-2">
                            <label htmlFor="topic-tags" className="text-sm font-medium text-[#2d3748]">
                              Tags (pisahkan dengan koma)
                            </label>
                            <Input
                              id="topic-tags"
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
                    <Link
                      to="/polling"
                      className="neumorphic-button bg-transparent text-[#2d3748] font-semibold hover:text-[#667eea] border-0 shadow-none"
                    >
                      <BarChart2 className="h-4 w-4 mr-2" />
                      Buat Polling
                    </Link>
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
              {id && selectedTopic ? (
                <div className="space-y-4">
                  <Card className="neumorphic-card transition-all duration-300 cursor-pointer border-0 shadow-none">
                    <CardHeader className="pb-3">
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
                        {selectedTopic.solvedCommentId && (
                          <Badge
                            variant="outline"
                            className="text-xs text-emerald-600 border-emerald-200"
                          >
                            ✔ Solved
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-2xl font-bold text-[#2d3748] text-left">
                        {selectedTopic.title}
                      </CardTitle>
                      <CardDescription className="text-[#718096] text-left">
                        oleh {selectedTopic.authorName} •{" "}
                        {formatDateString(selectedTopic.createdAt)} •{" "}
                        {selectedTopic.views} dilihat
                      </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <div className="prose max-w-none">
                        <p className="text-[#2d3748] leading-relaxed">
                          {selectedTopic.content}
                        </p>
                        {selectedTopic.imageUrls &&
                          selectedTopic.imageUrls.length > 0 && (
                            <div className="grid grid-cols-2 gap-4 mt-4">
                              {selectedTopic.imageUrls.map((url, idx) => (
                                <img
                                  key={idx}
                                  src={url}
                                  alt={selectedTopic.title}
                                  className="w-full rounded-lg"
                                />
                              ))}
                            </div>
                          )}
                        {selectedTopic.videoUrls &&
                          selectedTopic.videoUrls.length > 0 && (
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
                        <button
                          onClick={() => handleVoteTopic(selectedTopic._id, 1)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-[#718096]"
                        >
                          Upvote {selectedTopic.score}
                        </button>
                        <button
                          onClick={() => handleVoteTopic(selectedTopic._id, -1)}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-[#718096]"
                        >
                          Downvote
                        </button>
                        <button
                          onClick={() =>
                            handleBookmarkTopic(selectedTopic._id)
                          }
                          className={`flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-[#718096] ${
                            userBookmarks?.some(
                              (b: any) => b.data._id === selectedTopic._id,
                            )
                              ? "text-yellow-500"
                              : ""
                          }`}
                        >
                          <Bookmark className="h-5 w-5" />
                          <span>Koleksi</span>
                        </button>
                        <button
                          onClick={() =>
                            isSubscribed
                              ? handleUnsubscribe(selectedTopic._id)
                              : handleSubscribe(selectedTopic._id)
                          }
                          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-[#718096]"
                        >
                          {isSubscribed ? (
                            <BellOff className="h-5 w-5" />
                          ) : (
                            <Bell className="h-5 w-5" />
                          )}
                          <span>
                            {isSubscribed ? "Unsubscribe" : "Subscribe"}
                          </span>
                        </button>
                        <button
                          onClick={() => {
                            if (navigator.share) {
                              navigator.share({
                                title: selectedTopic.title,
                                url: `${window.location.origin}/forum?topic=${selectedTopic._id}`,
                              });
                            } else {
                              navigator.clipboard.writeText(
                                `${window.location.origin}/forum?topic=${selectedTopic._id}`,
                              );
                              toast({ title: "Link disalin" });
                            }
                          }}
                          className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-[#718096]"
                        >
                        <Share className="h-5 w-5" />
                        <span>Bagikan</span>
                      </button>

                      {currentUser &&
                        selectedTopic.authorId === currentUser._id && (
                          <Button
                            onClick={() => {
                              setEditTopicTitle(selectedTopic.title);
                              setEditTopicContent(selectedTopic.content);
                              setIsEditTopicOpen(true);
                            }}
                            variant="outline"
                            className="neumorphic-button-sm"
                          >
                            Edit
                          </Button>
                        )}

                      <Dialog
                        open={isEditHistoryOpen}
                        onOpenChange={setIsEditHistoryOpen}
                      >
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="neumorphic-button-sm"
                          >
                            Riwayat Edit
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="neumorphic-card border-0 shadow-none max-w-2xl max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                          <DialogHeader>
                            <DialogTitle className="text-[#2d3748]">
                              Riwayat Edit
                            </DialogTitle>
                          </DialogHeader>
                          {selectedTopic && (
                            <EditHistory
                              docType="topic"
                              docId={selectedTopic._id}
                            />
                          )}
                        </DialogContent>
                      </Dialog>

                      <div className="flex items-center gap-2 text-[#718096]">
                        <MessageCircle className="h-5 w-5" />
                        <span>{commentList.length} Balasan</span>
                      </div>
                        {currentUser &&
                          selectedTopic.authorId === currentUser._id && (
                            <Button
                              onClick={() =>
                                handleTogglePin(selectedTopic._id)
                              }
                              variant="outline"
                              className="neumorphic-button-sm"
                            >
                              {selectedTopic.isPinned ? "Unpin" : "Pin"}
                            </Button>
                          )}
                        {currentUser &&
                          selectedTopic.authorId === currentUser._id && (
                            <Button
                              onClick={() =>
                                handleToggleLock(selectedTopic._id)
                              }
                              variant="outline"
                              className="neumorphic-button-sm"
                            >
                              {selectedTopic.isLocked ? "Unlock" : "Lock"}
                            </Button>
                          )}
                        {currentUser && currentUser.role === "admin" && (
                          <>
                            <Button
                              onClick={handleMoveTopic}
                              variant="outline"
                              className="neumorphic-button-sm"
                            >
                              Move
                            </Button>
                            <Button
                              onClick={handleMergeTopic}
                              variant="outline"
                              className="neumorphic-button-sm"
                            >
                              Merge
                            </Button>
                          </>
                        )}

                      {/* Comments Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold text-[#2d3748]">
                          Balasan ({commentList.length})
                        </h3>

                        {commentList.length === 0 ? (
                          <div className="text-center py-8 text-[#718096]">
                            <MessageCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
                            <p>Belum ada balasan. Jadilah yang pertama!</p>
                          </div>
                        ) : (
                          <div className="space-y-4">
                            {commentList.map((comment) => (
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
                                  <div
                                    className={`flex-1 ${
                                      selectedTopic.solvedCommentId === comment._id
                                        ? "bg-emerald-50"
                                        : ""
                                    }`}
                                  >
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="font-medium text-[#2d3748]">
                                        {comment.authorName}
                                      </span>
                                      <span className="text-xs text-[#718096]">
                                        {formatDate(comment.createdAt)}
                                      </span>
                                      {selectedTopic.solvedCommentId === comment._id && (
                                        <Badge
                                          variant="outline"
                                          className="text-xs text-emerald-600 border-emerald-200"
                                        >
                                          ✔ Solved
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-[#2d3748]">
                                      {comment.content}
                                    </p>
                                    <div className="flex items-center gap-2 text-xs mt-2">
                                    <button
                                        onClick={() => handleVoteComment(comment._id, 1)}
                                        className="hover:text-green-600"
                                      >
                                        Upvote
                                      </button>
                                      <span>{comment.score}</span>
                                      <button
                                        onClick={() => handleVoteComment(comment._id, -1)}
                                        className="hover:text-red-600"
                                      >
                                        Downvote
                                      </button>
                                      {currentUser && comment.authorId === currentUser._id && (
                                        <button
                                          onClick={() => {
                                            setSelectedComment(comment);
                                            setEditCommentContent(comment.content);
                                            setIsEditCommentOpen(true);
                                          }}
                                          className="hover:text-blue-600"
                                        >
                                          Edit
                                        </button>
                                      )}
                                      {currentUser &&
                                        selectedTopic?.authorId === currentUser._id &&
                                        !selectedTopic.solvedCommentId && (
                                          <button
                                            onClick={() => handleMarkSolved(comment._id)}
                                            className="hover:text-emerald-600"
                                          >
                                            Tandai Solved
                                          </button>
                                        )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {selectedTopic.isLocked && (
                          <p className="text-sm text-red-600">Diskusi telah dikunci.</p>
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
                            disabled={!user || !newCommentContent.trim() || selectedTopic?.isLocked}
                            className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none disabled:opacity-50"
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Kirim Balasan
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ) : (
                <div className="space-y-4">
                  {isLoading ? (
                    <div className="neumorphic-card p-12 text-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#667eea] mx-auto mb-4"></div>
                      <p className="text-[#718096]">Memuat topik...</p>
                    </div>
                  ) : unpinnedTopics.length === 0 &&
                    (!pinnedTopics || pinnedTopics.length === 0) ? (
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
                    <>
                      {pinnedTopics &&
                        pinnedTopics.map((topic) => (
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
                                    {topic.solvedCommentId && (
                                      <Badge
                                        variant="outline"
                                        className="text-xs text-emerald-600 border-emerald-200"
                                      >
                                        ✔ Solved
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
                                    {highlightText(topic.title, searchQuery)}
                                  </CardTitle>
                                  <CardDescription className="text-sm text-[#718096] mt-1">
                                    oleh {topic.authorName} •{" "}
                                    {formatDateString(topic.createdAt)}
                                  </CardDescription>
                                  <p className="text-sm text-[#718096] mt-2 line-clamp-2">
                                    {highlightText(topic.content.substring(0, 150), searchQuery)}...
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
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVoteTopic(topic._id, 1);
                                    }}
                                    className="flex items-center gap-1 hover:text-green-600"
                                  >
                                    Upvote {topic.score}
                                  </button>
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleVoteTopic(topic._id, -1);
                                    }}
                                    className="flex items-center gap-1 hover:text-red-600"
                                  >
                                    Downvote
                                  </button>
                                  <button
                                    aria-label="Bookmark topic"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleBookmarkTopic(topic._id);
                                    }}
                                    className={`flex items-center gap-1 hover:text-yellow-500 transition-colors ${
                                      userBookmarks?.some(
                                        (b: any) => b.data._id === topic._id,
                                      )
                                        ? "text-yellow-500"
                                        : ""
                                    }`}
                                  >
                                    <Bookmark className="h-4 w-4" />
                                  </button>
                                  <button
                                    aria-label="Share topic"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      if (navigator.share) {
                                        navigator.share({
                                          title: topic.title,
                                          url: `${window.location.origin}/forum?topic=${topic._id}`,
                                        });
                                      } else {
                                        navigator.clipboard.writeText(
                                          `${window.location.origin}/forum?topic=${topic._id}`,
                                        );
                                        toast({ title: "Link disalin" });
                                      }
                                    }}
                                    className="flex items-center gap-1 hover:text-blue-500 transition-colors"
                                  >
                                    <Share className="h-4 w-4" />
                                  </button>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Clock className="h-4 w-4" />
                                  <span>{formatDate(topic.updatedAt)}</span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </>
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
                </div>
              )}

              </Button>
                    </div>
                  )}
                </div>
              )}

              <Dialog
                open={isEditCommentOpen}
                onOpenChange={setIsEditCommentOpen}
              >
                <DialogContent className="neumorphic-card border-0 shadow-none max-w-2xl fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                  <DialogHeader>
                    <DialogTitle className="text-[#2d3748]">Edit Komentar</DialogTitle>
                    <DialogDescription className="text-[#718096]">
                      Ubah isi komentar Anda.
                    </DialogDescription>
                  </DialogHeader>
                  <Textarea
                    value={editCommentContent}
                    onChange={(e) => setEditCommentContent(e.target.value)}
                    className="neumorphic-input border-0 min-h-[120px] resize-none my-4"
                  />
                  <DialogFooter className="flex gap-2">
                    <Button
                      onClick={() => setIsEditCommentOpen(false)}
                      variant="outline"
                      className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleEditComment}
                      className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Simpan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
              <Dialog
                open={isEditTopicOpen}
                onOpenChange={setIsEditTopicOpen}
              >
                <DialogContent className="neumorphic-card border-0 shadow-none max-w-2xl max-h-[90vh] overflow-y-auto fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
                  <DialogHeader>
                    <DialogTitle className="text-[#2d3748]">Edit Topik</DialogTitle>
                    <DialogDescription className="text-[#718096]">
                      Ubah judul atau konten topik Anda.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label htmlFor="edit-topic-title" className="text-sm font-medium text-[#2d3748]">
                        Judul Topik
                      </label>
                      <Input
                        id="edit-topic-title"
                        value={editTopicTitle}
                        onChange={(e) => setEditTopicTitle(e.target.value)}
                        className="neumorphic-input border-0"
                      />
                    </div>
                    <div className="space-y-2">
                      <label htmlFor="edit-topic-content" className="text-sm font-medium text-[#2d3748]">
                        Konten
                      </label>
                      <Textarea
                        id="edit-topic-content"
                        value={editTopicContent}
                        onChange={(e) => setEditTopicContent(e.target.value)}
                        className="neumorphic-input border-0 min-h-[120px] resize-none"
                      />
                    </div>
                  </div>
                  <DialogFooter className="flex gap-2">
                    <Button
                      onClick={() => setIsEditTopicOpen(false)}
                      variant="outline"
                      className="neumorphic-button-sm bg-transparent text-[#718096] border-0 shadow-none"
                    >
                      Batal
                    </Button>
                    <Button
                      onClick={handleEditTopic}
                      className="neumorphic-button bg-transparent text-[#2d3748] font-semibold border-0 shadow-none"
                    >
                      <Send className="h-4 w-4 mr-2" />
                      Simpan Perubahan
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
