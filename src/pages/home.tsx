import { Footer } from "@/components/footer";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { SignInButton, useUser } from "@clerk/clerk-react";
import { Authenticated, Unauthenticated } from "convex/react";
import {
  ArrowRight,
  Star,
  Users,
  Trophy,
  Palette,
  MessageCircle,
  TrendingUp,
  Award,
} from "lucide-react";
import { useNavigate } from "react-router";

const FEATURES = [
  {
    icon: <Users className="h-8 w-8" />,
    title: "Community Hub",
    description:
      "Connect with fellow perfume enthusiasts and creators in our vibrant community",
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    title: "Gamified Experience",
    description:
      "Earn badges, level up, and unlock rewards for your contributions and expertise",
  },
  {
    icon: <Palette className="h-8 w-8" />,
    title: "Note Explorer",
    description:
      "Discover and explore scent families with our interactive perfume note visualization",
  },
  {
    icon: <MessageCircle className="h-8 w-8" />,
    title: "Expert Discussions",
    description:
      "Share reviews, formulas, and insights with moderated quality discussions",
  },
] as const;

const TESTIMONIALS = [
  {
    content:
      "This platform has transformed how I discover and discuss fragrances. The community is incredibly knowledgeable and the gamification keeps me engaged.",
    author: "Elena Rossi",
    role: "Fragrance Blogger",
    company: "Scent Stories",
    image:
      "https://images.unsplash.com/photo-1494790108755-2616b612b786?q=80&w=400&auto=format&fit=crop",
  },
  {
    content:
      "As a perfumer, I love sharing my formulas here. The note explorer helps visualize complex compositions, and the feedback from the community is invaluable.",
    author: "Marcus Chen",
    role: "Independent Perfumer",
    company: "Artisan Scents",
    image:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=400&auto=format&fit=crop",
  },
];

function App() {
  const { user, isLoaded: isUserLoaded } = useUser();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow">
        <div className="container mx-auto px-4 py-24">
          {/* Hero Section */}
          <div className="relative flex flex-col items-center text-center space-y-8 pb-32">
            <div className="absolute inset-0 bg-gradient-to-br from-[#f0f2f5] via-[#ffffff] to-[#e8ebf0] opacity-60 blur-3xl -z-10" />

            {/* Floating Badge */}
            <div className="neumorphic-button-sm inline-flex items-center gap-3 px-8 py-4">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 text-amber-500 fill-amber-500"
                  />
                ))}
              </div>
              <span className="text-sm font-semibold text-[#2d3748]">
                5k+ Fragrance Enthusiasts
              </span>
            </div>

            <h1 className="text-7xl font-bold text-[#2d3748] tracking-tight max-w-[900px] leading-[1.05] bg-gradient-to-br from-[#2d3748] to-[#4a5568] bg-clip-text text-transparent">
              Parfum Enthusiast Forum
            </h1>
            <p className="text-2xl text-[#718096] max-w-[700px] leading-relaxed font-light">
              A neumorphic community connecting perfume lovers and creators with
              gamified interactions and sleek design inspired by balanced
              stones.
            </p>

            <div className="flex gap-4 pt-8">
              {!isUserLoaded ? (
                <div className="h-14 px-10 w-[180px] rounded-[20px] bg-gray-200 animate-pulse neumorphic-card"></div>
              ) : (
                <>
                  <Authenticated>
                    <Button
                      onClick={() => navigate("/dashboard")}
                      className="neumorphic-button h-14 px-10 text-lg text-[#2d3748] bg-transparent font-semibold border-0 shadow-none transition-all"
                    >
                      <ArrowRight className="mr-2 h-5 w-5" />
                      Dashboard
                    </Button>
                  </Authenticated>
                  <Unauthenticated>
                    <SignInButton
                      mode="modal"
                      signUpFallbackRedirectUrl="/dashboard"
                      fallbackRedirectUrl="/dashboard"
                    >
                      <Button className="neumorphic-button h-14 px-10 text-lg text-[#2d3748] bg-transparent font-semibold border-0 shadow-none transition-all">
                        <ArrowRight className="mr-2 h-5 w-5" />
                        Mulai Sekarang
                      </Button>
                    </SignInButton>
                  </Unauthenticated>
                </>
              )}
            </div>
          </div>
          {/* Navigation Cards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 py-20">
            <div
              className="neumorphic-card-large group p-10 transition-all duration-500 cursor-pointer"
              onClick={() => navigate("/forum")}
            >
              <div className="text-[#667eea] mb-8 transform-gpu transition-all duration-300 group-hover:scale-125 group-hover:rotate-6">
                <MessageCircle className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[#2d3748] mb-6 group-hover:text-[#667eea] transition-colors">
                Forum
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                Join discussions, share reviews, and connect with fellow
                fragrance enthusiasts
              </p>
            </div>

            <div
              className="neumorphic-card-large group p-10 transition-all duration-500 cursor-pointer"
              onClick={() => navigate("/marketplace")}
            >
              <div className="text-[#667eea] mb-8 transform-gpu transition-all duration-300 group-hover:scale-125 group-hover:rotate-6">
                <Trophy className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[#2d3748] mb-6 group-hover:text-[#667eea] transition-colors">
                Marketplace
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                Buy and sell rare fragrances, discover exclusive collections
              </p>
            </div>

            <div
              className="neumorphic-card-large group p-10 transition-all duration-500 cursor-pointer"
              onClick={() => navigate("/kursus")}
            >
              <div className="text-[#667eea] mb-8 transform-gpu transition-all duration-300 group-hover:scale-125 group-hover:rotate-6">
                <Award className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[#2d3748] mb-6 group-hover:text-[#667eea] transition-colors">
                Kursus
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                Learn perfumery techniques from master perfumers and industry
                experts
              </p>
            </div>

            <div
              className="neumorphic-card-large group p-10 transition-all duration-500 cursor-pointer"
              onClick={() => navigate("/database")}
            >
              <div className="text-[#667eea] mb-8 transform-gpu transition-all duration-300 group-hover:scale-125 group-hover:rotate-6">
                <Palette className="h-12 w-12" />
              </div>
              <h3 className="text-2xl font-bold text-[#2d3748] mb-6 group-hover:text-[#667eea] transition-colors">
                Database
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                Jelajahi database parfum lengkap dengan catatan dan komposisi
              </p>
            </div>
          </div>
          {/* Features Grid */}
          {/* Stats Section */}
          {/* Testimonials Section */}

          {/* CTA Section */}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default App;
