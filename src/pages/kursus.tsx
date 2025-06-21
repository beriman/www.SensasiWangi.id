import { useState } from "react";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Filter,
  Star,
  Clock,
  Users,
  Play,
  BookOpen,
  Award,
  TrendingUp,
  ChevronRight,
  Palette,
  Beaker,
  Lightbulb,
} from "lucide-react";

const COURSE_CATEGORIES = [
  "Dasar Parfum",
  "Teknik Blending",
  "Parfum Niche",
  "Parfum Komersial",
  "Analisis Aroma",
  "Bisnis Parfum",
];

const COURSE_LEVELS = [
  { value: "beginner", label: "Pemula" },
  { value: "intermediate", label: "Menengah" },
  { value: "advanced", label: "Lanjutan" },
  { value: "expert", label: "Ahli" },
];

const SORT_OPTIONS = [
  { value: "newest", label: "Terbaru" },
  { value: "popular", label: "Paling Populer" },
  { value: "rating", label: "Rating Tertinggi" },
  { value: "price_low", label: "Harga Terendah" },
  { value: "price_high", label: "Harga Tertinggi" },
];

// Sample course data
const SAMPLE_COURSES = [
  {
    id: 1,
    title: "Dasar-Dasar Parfumeri: Memahami Piramida Aroma",
    instructor: "Master Perfumer Jean-Claude",
    category: "Dasar Parfum",
    level: "beginner",
    duration: "4 jam",
    students: 1250,
    rating: 4.8,
    reviews: 324,
    price: 299000,
    originalPrice: 399000,
    image:
      "https://images.unsplash.com/photo-1594736797933-d0401ba2fe65?w=400&q=80",
    description:
      "Pelajari konsep fundamental dalam parfumeri, mulai dari top notes hingga base notes.",
    isPopular: true,
    isBestseller: false,
  },
  {
    id: 2,
    title: "Teknik Blending Profesional untuk Parfum Niche",
    instructor: "Perfumer Sarah Martinez",
    category: "Teknik Blending",
    level: "intermediate",
    duration: "6 jam",
    students: 890,
    rating: 4.9,
    reviews: 156,
    price: 599000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=400&q=80",
    description:
      "Kuasai teknik blending advanced untuk menciptakan parfum niche yang unik dan berkualitas tinggi.",
    isPopular: false,
    isBestseller: true,
  },
  {
    id: 3,
    title: "Analisis Molekul Aroma dan Komposisi Kimia",
    instructor: "Dr. Ahmad Perfume Lab",
    category: "Analisis Aroma",
    level: "advanced",
    duration: "8 jam",
    students: 456,
    rating: 4.7,
    reviews: 89,
    price: 899000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&q=80",
    description:
      "Memahami struktur molekul aroma dan cara menganalisis komposisi parfum secara ilmiah.",
    isPopular: false,
    isBestseller: false,
  },
  {
    id: 4,
    title: "Membangun Brand Parfum dari Nol",
    instructor: "Entrepreneur Lisa Chen",
    category: "Bisnis Parfum",
    level: "intermediate",
    duration: "5 jam",
    students: 723,
    rating: 4.6,
    reviews: 201,
    price: 449000,
    originalPrice: 599000,
    image:
      "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&q=80",
    description:
      "Panduan lengkap memulai bisnis parfum, dari konsep hingga pemasaran.",
    isPopular: true,
    isBestseller: false,
  },
  {
    id: 5,
    title: "Parfum Komersial: Formula dan Produksi Massal",
    instructor: "Industry Expert Robert Kim",
    category: "Parfum Komersial",
    level: "advanced",
    duration: "7 jam",
    students: 334,
    rating: 4.5,
    reviews: 67,
    price: 799000,
    originalPrice: null,
    image:
      "https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=400&q=80",
    description:
      "Pelajari cara mengembangkan formula parfum untuk produksi komersial skala besar.",
    isPopular: false,
    isBestseller: false,
  },
  {
    id: 6,
    title: "Kreativitas dalam Parfumeri: Menciptakan Signature Scent",
    instructor: "Creative Director Maya Sari",
    category: "Dasar Parfum",
    level: "beginner",
    duration: "3 jam",
    students: 1567,
    rating: 4.9,
    reviews: 445,
    price: 199000,
    originalPrice: 299000,
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80",
    description:
      "Temukan kreativitas Anda dalam menciptakan parfum signature yang mencerminkan kepribadian.",
    isPopular: true,
    isBestseller: true,
  },
];

function CourseCard({ course }: { course: any }) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getLevelColor = (level: string) => {
    switch (level) {
      case "beginner":
        return "bg-green-100 text-green-800";
      case "intermediate":
        return "bg-blue-100 text-blue-800";
      case "advanced":
        return "bg-orange-100 text-orange-800";
      case "expert":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="neumorphic-card cursor-pointer transition-all duration-300 hover:scale-105 border-0">
      <div className="relative">
        <img
          src={course.image}
          alt={course.title}
          className="w-full h-48 object-cover rounded-t-3xl"
        />
        <div className="absolute top-3 left-3 flex gap-2">
          <Badge className={getLevelColor(course.level)}>
            {COURSE_LEVELS.find((l) => l.value === course.level)?.label}
          </Badge>
          {course.isPopular && (
            <Badge className="bg-purple-100 text-purple-800">🔥 Populer</Badge>
          )}
          {course.isBestseller && (
            <Badge className="bg-yellow-100 text-yellow-800">
              ⭐ Bestseller
            </Badge>
          )}
        </div>
        <div className="absolute top-3 right-3">
          <div className="neumorphic-button-sm p-2 rounded-full">
            <Play className="h-4 w-4 text-[#667eea]" />
          </div>
        </div>
      </div>

      <CardContent className="p-6">
        <div className="space-y-3">
          <Badge variant="outline" className="text-xs">
            {course.category}
          </Badge>

          <h3 className="font-semibold text-[#2d3748] line-clamp-2 text-lg">
            {course.title}
          </h3>

          <p className="text-sm text-[#718096] line-clamp-2">
            {course.description}
          </p>

          <div className="flex items-center gap-2 text-sm text-[#718096]">
            <Users className="h-4 w-4" />
            <span>{course.instructor}</span>
          </div>

          <div className="flex items-center justify-between text-sm text-[#718096]">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{course.duration}</span>
              </div>
              <div className="flex items-center gap-1">
                <Users className="h-4 w-4" />
                <span>{course.students.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 text-yellow-500 fill-current" />
              <span className="font-medium">{course.rating}</span>
              <span>({course.reviews})</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-[#e2e8f0]">
            <div className="space-y-1">
              <p className="text-xl font-bold text-[#2d3748]">
                {formatPrice(course.price)}
              </p>
              {course.originalPrice && (
                <p className="text-sm text-[#718096] line-through">
                  {formatPrice(course.originalPrice)}
                </p>
              )}
            </div>
            <Button className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none">
              Lihat Detail
              <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function Kursus() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedLevel, setSelectedLevel] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // Filter courses based on search and filters
  const filteredCourses = SAMPLE_COURSES.filter((course) => {
    const matchesSearch =
      course.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      !selectedCategory || course.category === selectedCategory;
    const matchesLevel = !selectedLevel || course.level === selectedLevel;

    return matchesSearch && matchesCategory && matchesLevel;
  });

  // Sort courses
  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "popular":
        return b.students - a.students;
      case "rating":
        return b.rating - a.rating;
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      default:
        return b.id - a.id; // newest first
    }
  });

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />

      <main className="flex-grow">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 bg-clip-text text-transparent">
              Kursus Parfumeri
            </h1>
            <p className="text-xl text-[#718096] max-w-3xl mx-auto mb-8">
              Pelajari seni dan ilmu parfumeri dari master perfumer terbaik
              dunia. Dari dasar hingga teknik advanced, wujudkan impian menjadi
              perfumer profesional.
            </p>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="neumorphic-card p-6">
                <div className="text-3xl font-bold text-[#667eea] mb-2">
                  50+
                </div>
                <div className="text-sm text-[#718096]">Kursus Tersedia</div>
              </div>
              <div className="neumorphic-card p-6">
                <div className="text-3xl font-bold text-[#667eea] mb-2">
                  15K+
                </div>
                <div className="text-sm text-[#718096]">Siswa Aktif</div>
              </div>
              <div className="neumorphic-card p-6">
                <div className="text-3xl font-bold text-[#667eea] mb-2">
                  4.8
                </div>
                <div className="text-sm text-[#718096]">Rating Rata-rata</div>
              </div>
              <div className="neumorphic-card p-6">
                <div className="text-3xl font-bold text-[#667eea] mb-2">
                  95%
                </div>
                <div className="text-sm text-[#718096]">Tingkat Kepuasan</div>
              </div>
            </div>
          </div>

          {/* Featured Categories */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <div className="neumorphic-card-large p-8 text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="text-[#667eea] mb-4 transform-gpu transition-all duration-300 group-hover:scale-110">
                <Palette className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-[#2d3748] mb-3">
                Kursus Dasar
              </h3>
              <p className="text-[#718096]">
                Mulai perjalanan parfumeri Anda dengan pemahaman fundamental
              </p>
            </div>

            <div className="neumorphic-card-large p-8 text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="text-[#667eea] mb-4 transform-gpu transition-all duration-300 group-hover:scale-110">
                <Beaker className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-[#2d3748] mb-3">
                Teknik Advanced
              </h3>
              <p className="text-[#718096]">
                Kuasai teknik blending dan formulasi tingkat profesional
              </p>
            </div>

            <div className="neumorphic-card-large p-8 text-center group cursor-pointer transition-all duration-300 hover:scale-105">
              <div className="text-[#667eea] mb-4 transform-gpu transition-all duration-300 group-hover:scale-110">
                <Lightbulb className="h-12 w-12 mx-auto" />
              </div>
              <h3 className="text-xl font-bold text-[#2d3748] mb-3">
                Bisnis & Kreativitas
              </h3>
              <p className="text-[#718096]">
                Pelajari aspek bisnis dan pengembangan kreativitas dalam
                parfumeri
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="neumorphic-card p-6 mb-8">
            <div className="flex flex-col md:flex-row gap-4 mb-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-[#718096]" />
                <Input
                  placeholder="Cari kursus, instruktur, atau topik..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="neumorphic-input pl-10 border-0"
                />
              </div>
              <Button
                onClick={() => setShowFilters(!showFilters)}
                className="neumorphic-button-sm text-[#2d3748] bg-transparent border-0 shadow-none"
              >
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>

            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-4 border-t border-[#e2e8f0]">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="neumorphic-input border-0">
                    <SelectValue placeholder="Kategori" />
                  </SelectTrigger>
                  <SelectContent className="neumorphic-card border-0">
                    <SelectItem value="">Semua Kategori</SelectItem>
                    {COURSE_CATEGORIES.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={selectedLevel} onValueChange={setSelectedLevel}>
                  <SelectTrigger className="neumorphic-input border-0">
                    <SelectValue placeholder="Level" />
                  </SelectTrigger>
                  <SelectContent className="neumorphic-card border-0">
                    <SelectItem value="">Semua Level</SelectItem>
                    {COURSE_LEVELS.map((level) => (
                      <SelectItem key={level.value} value={level.value}>
                        {level.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="neumorphic-input border-0">
                    <SelectValue placeholder="Urutkan" />
                  </SelectTrigger>
                  <SelectContent className="neumorphic-card border-0">
                    {SORT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedLevel("");
                    setSortBy("newest");
                  }}
                  className="neumorphic-button-sm text-[#718096] bg-transparent border-0 shadow-none"
                >
                  Reset Filter
                </Button>
              </div>
            )}
          </div>

          {/* Courses Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {sortedCourses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>

          {/* Empty State */}
          {sortedCourses.length === 0 && (
            <div className="text-center py-16">
              <div className="neumorphic-card-inset p-12 max-w-md mx-auto">
                <BookOpen className="h-16 w-16 text-[#718096] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2d3748] mb-2">
                  Tidak ada kursus ditemukan
                </h3>
                <p className="text-[#718096] mb-6">
                  Coba ubah filter pencarian atau kata kunci Anda
                </p>
                <Button
                  onClick={() => {
                    setSearchQuery("");
                    setSelectedCategory("");
                    setSelectedLevel("");
                  }}
                  className="neumorphic-button text-[#2d3748] bg-transparent border-0 shadow-none"
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          )}

          {/* Why Choose Our Courses */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="neumorphic-card p-6 text-center">
              <Award className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                Instruktur Bersertifikat
              </h3>
              <p className="text-[#718096]">
                Belajar dari master perfumer dan ahli industri berpengalaman
                puluhan tahun
              </p>
            </div>

            <div className="neumorphic-card p-6 text-center">
              <Play className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                Pembelajaran Interaktif
              </h3>
              <p className="text-[#718096]">
                Video HD, praktik langsung, dan sesi tanya jawab dengan
                instruktur
              </p>
            </div>

            <div className="neumorphic-card p-6 text-center">
              <TrendingUp className="h-12 w-12 text-[#667eea] mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                Sertifikat Resmi
              </h3>
              <p className="text-[#718096]">
                Dapatkan sertifikat yang diakui industri setelah menyelesaikan
                kursus
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
