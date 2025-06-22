import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Filter,
  Star,
  Heart,
  Palette,
  Building2,
  User,
  Sparkles,
  MapPin,
  Calendar,
  Award,
  Globe,
} from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

const FRAGRANCE_CATEGORIES = [
  { name: "Citrus", color: "bg-yellow-100 text-yellow-800" },
  { name: "Floral", color: "bg-pink-100 text-pink-800" },
  { name: "Woody", color: "bg-amber-100 text-amber-800" },
  { name: "Oriental", color: "bg-purple-100 text-purple-800" },
  { name: "Fresh", color: "bg-blue-100 text-blue-800" },
  { name: "Gourmand", color: "bg-orange-100 text-orange-800" },
];

const BRAND_CATEGORIES = [
  { name: "Local", color: "bg-green-100 text-green-800" },
  { name: "Artisan", color: "bg-purple-100 text-purple-800" },
  { name: "Commercial", color: "bg-blue-100 text-blue-800" },
  { name: "Niche", color: "bg-amber-100 text-amber-800" },
];

const EXPERIENCE_LEVELS = [
  { name: "Beginner", color: "bg-gray-100 text-gray-800" },
  { name: "Intermediate", color: "bg-blue-100 text-blue-800" },
  { name: "Expert", color: "bg-purple-100 text-purple-800" },
  { name: "Master", color: "bg-amber-100 text-amber-800" },
];

export default function Database() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState("brands");
  const navigate = useNavigate();

  // Queries
  const databaseStats = useQuery(api.marketplace.getDatabaseStats);
    const brands = useQuery(api.marketplace.getIndonesianBrands, {
      paginationOpts: { numItems: 50, cursor: null },
      searchQuery: searchTerm || undefined,
      category: selectedCategory || undefined,
    });
    const perfumers = useQuery(api.marketplace.getIndonesianPerfumers, {
      paginationOpts: { numItems: 50, cursor: null },
      searchQuery: searchTerm || undefined,
      experience: selectedCategory || undefined,
    });
    const fragrances = useQuery(api.marketplace.getIndonesianFragrances, {
      paginationOpts: { numItems: 50, cursor: null },
      searchQuery: searchTerm || undefined,
      category: selectedCategory || undefined,
  });

  // Mutation for initializing sample data
  const initializeSampleData = useMutation(
    api.marketplace.initializeSampleData,
  );

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-12">
          {/* Header */}
          <div className="text-center mb-16">
            <div className="flex items-center justify-center gap-3 mb-6">
              <div className="neumorphic-button-sm p-4">
                <Palette className="h-8 w-8 text-[#667eea]" />
              </div>
            </div>
            <h1 className="text-5xl font-bold text-[#2d3748] mb-6">
              Database Parfum Indonesia
            </h1>
            <p className="text-xl text-[#718096] max-w-2xl mx-auto">
              Jelajahi koleksi lengkap brand, parfum, dan perfumer Indonesia
              dengan informasi detail dan ulasan dari komunitas
            </p>

            {/* Stats */}
            {databaseStats && (
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 max-w-4xl mx-auto">
                <div className="neumorphic-card p-6 text-center">
                  <Building2 className="h-8 w-8 text-[#667eea] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#2d3748]">
                    {databaseStats.totalBrands}
                  </div>
                  <div className="text-sm text-[#718096]">Brand</div>
                </div>
                <div className="neumorphic-card p-6 text-center">
                  <User className="h-8 w-8 text-[#667eea] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#2d3748]">
                    {databaseStats.totalPerfumers}
                  </div>
                  <div className="text-sm text-[#718096]">Perfumer</div>
                </div>
                <div className="neumorphic-card p-6 text-center">
                  <Sparkles className="h-8 w-8 text-[#667eea] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#2d3748]">
                    {databaseStats.totalFragrances}
                  </div>
                  <div className="text-sm text-[#718096]">Parfum</div>
                </div>
                <div className="neumorphic-card p-6 text-center">
                  <Star className="h-8 w-8 text-[#667eea] mx-auto mb-2" />
                  <div className="text-2xl font-bold text-[#2d3748]">
                    {databaseStats.averageFragranceRating?.toFixed(1) || "0.0"}
                  </div>
                  <div className="text-sm text-[#718096]">Rating Rata-rata</div>
                </div>
              </div>
            )}

            <div className="mt-8">
              <Button
                variant="outline"
                onClick={() => navigate("/database/contribute")}
                className="neumorphic-button h-12 px-8 text-[#2d3748] bg-transparent border-0 shadow-none"
              >
                Tambah Data
              </Button>
            </div>

            {/* Initialize Data Button */}
            {!brands?.page?.length &&
              !perfumers?.page?.length &&
              !fragrances?.page?.length && (
                <div className="mt-8">
                  <Button
                    onClick={() => initializeSampleData()}
                    className="neumorphic-button h-12 px-8 text-[#2d3748] bg-transparent font-semibold border-0 shadow-none"
                  >
                    Inisialisasi Data Sample
                  </Button>
                </div>
              )}
          </div>

          {/* Tabs Navigation */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="mb-12"
          >
            <TabsList className="neumorphic-card p-2 grid w-full grid-cols-3 max-w-md mx-auto">
              <TabsTrigger
                value="brands"
                className="data-[state=active]:neumorphic-button-pressed"
              >
                <Building2 className="h-4 w-4 mr-2" />
                Brand
              </TabsTrigger>
              <TabsTrigger
                value="perfumers"
                className="data-[state=active]:neumorphic-button-pressed"
              >
                <User className="h-4 w-4 mr-2" />
                Perfumer
              </TabsTrigger>
              <TabsTrigger
                value="fragrances"
                className="data-[state=active]:neumorphic-button-pressed"
              >
                <Sparkles className="h-4 w-4 mr-2" />
                Parfum
              </TabsTrigger>
            </TabsList>

            {/* Search and Filter */}
            <div className="neumorphic-card p-8 mb-12 mt-8">
              <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1 relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-[#718096]" />
                  <Input
                    placeholder={`Cari ${activeTab === "brands" ? "brand" : activeTab === "perfumers" ? "perfumer" : "parfum"}...`}
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-12 h-14 text-lg neumorphic-input"
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Filter className="h-5 w-5 text-[#718096]" />
                  <span className="text-[#718096] font-medium">Filter:</span>
                </div>
              </div>
            </div>

            {/* Categories */}
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-[#2d3748] mb-6">
                {activeTab === "brands"
                  ? "Kategori Brand"
                  : activeTab === "perfumers"
                    ? "Level Pengalaman"
                    : "Kategori Parfum"}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                {(activeTab === "brands"
                  ? BRAND_CATEGORIES
                  : activeTab === "perfumers"
                    ? EXPERIENCE_LEVELS
                    : FRAGRANCE_CATEGORIES
                ).map((category) => (
                  <div
                    key={category.name}
                    onClick={() =>
                      setSelectedCategory(
                        selectedCategory === category.name
                          ? null
                          : category.name,
                      )
                    }
                    className={`neumorphic-card p-6 text-center cursor-pointer transition-all duration-300 ${
                      selectedCategory === category.name
                        ? "ring-2 ring-[#667eea]"
                        : ""
                    }`}
                  >
                    <h3 className="font-semibold text-[#2d3748] mb-2">
                      {category.name}
                    </h3>
                    <Badge className={category.color}>Filter</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Tab Contents */}
            <TabsContent value="brands">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2d3748]">
                    {selectedCategory
                      ? `Brand ${selectedCategory}`
                      : "Semua Brand Indonesia"}
                  </h2>
                  <span className="text-[#718096]">
                    {brands?.page?.length || 0} brand ditemukan
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {brands?.page?.map((brand) => (
                    <Card
                      key={brand._id}
                      className="neumorphic-card overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-lg text-[#2d3748] group-hover:text-[#667eea] transition-colors mb-2">
                              {brand.name}
                            </CardTitle>
                            <CardDescription className="text-[#718096] text-sm mb-3">
                              {brand.description}
                            </CardDescription>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-[#718096]" />
                              <span className="text-sm text-[#718096]">
                                {brand.city}, {brand.country}
                              </span>
                            </div>
                            {brand.foundedYear && (
                              <div className="flex items-center gap-2 mb-3">
                                <Calendar className="h-4 w-4 text-[#718096]" />
                                <span className="text-sm text-[#718096]">
                                  Didirikan {brand.foundedYear}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(brand.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-[#2d3748]">
                            {brand.rating}
                          </span>
                          <span className="text-sm text-[#718096]">
                            ({brand.totalReviews} ulasan)
                          </span>
                        </div>

                        <div className="flex items-center justify-between mb-4">
                          <Badge
                            className={
                              BRAND_CATEGORIES.find(
                                (cat) => cat.name === brand.category,
                              )?.color || "bg-gray-100 text-gray-800"
                            }
                          >
                            {brand.category}
                          </Badge>
                          <span className="text-sm text-[#718096]">
                            {brand.totalProducts} produk
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1">
                          {brand.tags.slice(0, 3).map((tag, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="text-xs"
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>

                        {brand.website && (
                          <div className="mt-3 pt-3 border-t border-gray-100">
                            <div className="flex items-center gap-2">
                              <Globe className="h-4 w-4 text-[#718096]" />
                              <a
                                href={brand.website}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-sm text-[#667eea] hover:underline"
                              >
                                Website
                              </a>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="perfumers">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2d3748]">
                    {selectedCategory
                      ? `Perfumer ${selectedCategory}`
                      : "Semua Perfumer Indonesia"}
                  </h2>
                  <span className="text-[#718096]">
                    {perfumers?.page?.length || 0} perfumer ditemukan
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {perfumers?.page?.map((perfumer) => (
                    <Card
                      key={perfumer._id}
                      className="neumorphic-card overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                      <CardHeader className="pb-4">
                        <div className="flex items-start gap-4">
                          <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                            {perfumer.photo ? (
                              <img
                                src={perfumer.photo}
                                alt={perfumer.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <User className="h-8 w-8 text-gray-400" />
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <CardTitle className="text-lg text-[#2d3748] group-hover:text-[#667eea] transition-colors mb-1">
                              {perfumer.name}
                            </CardTitle>
                            <div className="flex items-center gap-2 mb-2">
                              <MapPin className="h-4 w-4 text-[#718096]" />
                              <span className="text-sm text-[#718096]">
                                {perfumer.city}, {perfumer.nationality}
                              </span>
                            </div>
                            <Badge
                              className={
                                EXPERIENCE_LEVELS.find(
                                  (exp) => exp.name === perfumer.experience,
                                )?.color || "bg-gray-100 text-gray-800"
                              }
                            >
                              {perfumer.experience}
                            </Badge>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <p className="text-sm text-[#718096] mb-4 line-clamp-3">
                          {perfumer.bio}
                        </p>

                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(perfumer.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-[#2d3748]">
                            {perfumer.rating}
                          </span>
                          <span className="text-sm text-[#718096]">
                            ({perfumer.totalReviews} ulasan)
                          </span>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-[#2d3748] mb-2">
                            Spesialisasi:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {perfumer.specialties
                              .slice(0, 3)
                              .map((specialty, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {specialty}
                                </Badge>
                              ))}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-[#718096]">
                          <span>{perfumer.totalCreations} kreasi</span>
                          {perfumer.achievements.length > 0 && (
                            <div className="flex items-center gap-1">
                              <Award className="h-4 w-4" />
                              <span>
                                {perfumer.achievements.length} penghargaan
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="fragrances">
              <div className="mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#2d3748]">
                    {selectedCategory
                      ? `Parfum ${selectedCategory}`
                      : "Semua Parfum Indonesia"}
                  </h2>
                  <span className="text-[#718096]">
                    {fragrances?.page?.length || 0} parfum ditemukan
                  </span>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {fragrances?.page?.map((fragrance) => (
                    <Card
                      key={fragrance._id}
                      className="neumorphic-card overflow-hidden group hover:shadow-xl transition-all duration-300"
                    >
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={
                            fragrance.images[0] ||
                            "https://images.unsplash.com/photo-1541643600914-78b084683601?w=300&q=80"
                          }
                          alt={fragrance.name}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                      <CardHeader className="pb-4">
                        <div className="flex items-start justify-between">
                          <div>
                            <CardTitle className="text-lg text-[#2d3748] group-hover:text-[#667eea] transition-colors">
                              {fragrance.name}
                            </CardTitle>
                            <CardDescription className="text-[#718096] font-medium">
                              {fragrance.brandName}
                            </CardDescription>
                            {fragrance.perfumerName && (
                              <CardDescription className="text-[#718096] text-sm">
                                by {fragrance.perfumerName}
                              </CardDescription>
                            )}
                          </div>
                          <Heart className="h-5 w-5 text-[#718096] hover:text-red-500 cursor-pointer transition-colors" />
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center gap-1">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < Math.floor(fragrance.rating) ? "text-amber-500 fill-amber-500" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="text-sm font-semibold text-[#2d3748]">
                            {fragrance.rating}
                          </span>
                          <span className="text-sm text-[#718096]">
                            ({fragrance.totalReviews} ulasan)
                          </span>
                        </div>

                        <div className="flex items-center gap-2 mb-4">
                          <Badge
                            className={
                              FRAGRANCE_CATEGORIES.find(
                                (cat) => cat.name === fragrance.category,
                              )?.color || "bg-gray-100 text-gray-800"
                            }
                          >
                            {fragrance.category}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {fragrance.concentration}
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {fragrance.gender}
                          </Badge>
                        </div>

                        <div className="mb-4">
                          <h4 className="text-sm font-semibold text-[#2d3748] mb-2">
                            Top Notes:
                          </h4>
                          <div className="flex flex-wrap gap-1">
                            {fragrance.topNotes
                              .slice(0, 3)
                              .map((note, index) => (
                                <Badge
                                  key={index}
                                  variant="outline"
                                  className="text-xs"
                                >
                                  {note}
                                </Badge>
                              ))}
                            {fragrance.topNotes.length > 3 && (
                              <Badge variant="outline" className="text-xs">
                                +{fragrance.topNotes.length - 3} lainnya
                              </Badge>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between text-sm text-[#718096]">
                          <span>{fragrance.longevity}</span>
                          <span>{fragrance.sillage}</span>
                          {fragrance.price && (
                            <span>Rp {fragrance.price.toLocaleString()}</span>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Empty State */}
          {((activeTab === "brands" && !brands?.page?.length) ||
            (activeTab === "perfumers" && !perfumers?.page?.length) ||
            (activeTab === "fragrances" && !fragrances?.page?.length)) && (
            <div className="text-center py-16">
              <div className="neumorphic-card p-12 max-w-md mx-auto">
                <Palette className="h-16 w-16 text-[#718096] mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-[#2d3748] mb-2">
                  Tidak ada{" "}
                  {activeTab === "brands"
                    ? "brand"
                    : activeTab === "perfumers"
                      ? "perfumer"
                      : "parfum"}{" "}
                  ditemukan
                </h3>
                <p className="text-[#718096]">
                  Coba ubah kata kunci pencarian atau filter kategori
                </p>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
