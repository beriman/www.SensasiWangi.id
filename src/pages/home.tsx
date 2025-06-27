import { Button } from "@/components/ui/button";
import { useUser } from "@clerk/clerk-react";
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
import { useNavigate, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Helmet } from "react-helmet";

const FEATURES = [
  {
    icon: <Users className="h-8 w-8" />,
    titleKey: "home.features.community.title",
    descKey: "home.features.community.desc",
  },
  {
    icon: <Trophy className="h-8 w-8" />,
    titleKey: "home.features.gamified.title",
    descKey: "home.features.gamified.desc",
  },
  {
    icon: <Palette className="h-8 w-8" />,
    titleKey: "home.features.noteExplorer.title",
    descKey: "home.features.noteExplorer.desc",
  },
  {
    icon: <MessageCircle className="h-8 w-8" />,
    titleKey: "home.features.expertDiscussions.title",
    descKey: "home.features.expertDiscussions.desc",
  },
] as const;

const STATS = [
  { icon: <Users className="h-6 w-6" />, label: "Members", value: "5k+" },
  { icon: <MessageCircle className="h-6 w-6" />, label: "Posts", value: "10k+" },
  { icon: <TrendingUp className="h-6 w-6" />, label: "Reviews", value: "3k+" },
] as const;

const MEMBERSHIP = [
  { feature: "Access Forum", buyer: true, business: true },
  { feature: "Sell Products", buyer: false, business: true },
  { feature: "View Analytics", buyer: false, business: true },
  { feature: "Earn Badges", buyer: true, business: true },
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
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Helmet>
        <title>Sensasi Wangi - Home</title>
        <meta
          name="description"
          content="Discover fragrances and join the Sensasi Wangi community"
        />
      </Helmet>
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
              {t('home.hero.heading')}
            </h1>
            <p className="text-2xl text-[#718096] max-w-[700px] leading-relaxed font-light">
              {t('home.hero.tagline')}
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
                    <Link to="/login">
                      <Button className="neumorphic-button h-14 px-10 text-lg text-[#2d3748] bg-transparent font-semibold border-0 shadow-none transition-all">
                        <ArrowRight className="mr-2 h-5 w-5" />
                        {t('home.hero.buttonStart')}
                      </Button>
                    </Link>
                    <Link to="/onboarding" className="text-sm text-[#667eea] underline ml-4 inline-flex items-center">
                      Panduan Singkat
                    </Link>
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
                {t('home.navCards.forum.title')}
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                {t('home.navCards.forum.desc')}
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
                {t('home.navCards.marketplace.title')}
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                {t('home.navCards.marketplace.desc')}
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
                {t('home.navCards.kursus.title')}
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                {t('home.navCards.kursus.desc')}
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
                {t('home.navCards.database.title')}
              </h3>
              <p className="text-lg text-[#718096] leading-relaxed">
                {t('home.navCards.database.desc')}
              </p>
            </div>
          </div>
          {/* Features Grid */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
            {FEATURES.map((f) => (
              <div key={f.titleKey} className="neumorphic-card p-6 text-center">
                <div className="text-[#667eea] mb-4 mx-auto">{f.icon}</div>
                <h3 className="text-lg font-semibold text-[#2d3748] mb-2">
                  {t(f.titleKey)}
                </h3>
                <p className="text-[#718096]">{t(f.descKey)}</p>
              </div>
            ))}
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 py-12">
            {STATS.map((s) => (
              <div key={s.label} className="neumorphic-card p-6 text-center">
                <div className="text-[#667eea] mb-2 mx-auto">{s.icon}</div>
                <div className="text-2xl font-bold text-[#2d3748]">{s.value}</div>
                <p className="text-[#718096]">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Testimonials Section */}
          <div className="py-16">
            <h2 className="text-3xl font-bold text-center text-[#2d3748] mb-10">
              {t('home.testimonials')}
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {TESTIMONIALS.map((tst, i) => (
                <div key={i} className="neumorphic-card p-8">
                  <p className="text-lg text-[#4a5568] mb-6">"{tst.content}"</p>
                  <div className="flex items-center gap-4">
                    <img
                      src={tst.image}
                      alt={tst.author}
                      className="h-12 w-12 rounded-full object-cover"
                    />
                    <div>
                      <p className="font-semibold text-[#2d3748]">{tst.author}</p>
                      <p className="text-sm text-[#718096]">
                        {tst.role}, {tst.company}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Membership Comparison */}
          <div className="py-20">
            <h2 className="text-3xl font-bold text-center text-[#2d3748] mb-8">
              {t('home.membership.heading')}
            </h2>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left">
                <thead>
                  <tr>
                    <th className="py-3" />
                    <th className="py-3 text-center">{t('home.membership.buyer')}</th>
                    <th className="py-3 text-center">{t('home.membership.business')}</th>
                  </tr>
                </thead>
                <tbody>
                  {MEMBERSHIP.map((m) => (
                    <tr key={m.feature} className="border-t">
                      <td className="py-3 font-medium text-[#2d3748]">{m.feature}</td>
                      <td className="py-3 text-center">{m.buyer ? '✓' : '-'}</td>
                      <td className="py-3 text-center">{m.business ? '✓' : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* CTA Section */}
        </div>
      </main>
    </div>
  );
}

export default App;
