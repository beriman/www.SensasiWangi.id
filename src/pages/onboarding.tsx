import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Onboarding() {
  const guides = [
    {
      title: "Forum",
      desc: "Buat dan balas topik untuk berdiskusi dengan komunitas parfum.",
    },
    {
      title: "Marketplace",
      desc: "Jual beli parfum langka dan koleksi eksklusif dengan aman.",
    },
    {
      title: "Reward System",
      desc: "Dapatkan poin dari aktivitas dan tukarkan dengan badge menarik.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col neumorphic-bg">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
        <h1 className="text-3xl font-bold text-center mb-8">Panduan Singkat</h1>
        {guides.map((g, idx) => (
          <Card key={idx} className="neumorphic-card border-0">
            <CardHeader>
              <CardTitle>{g.title}</CardTitle>
            </CardHeader>
            <CardContent className="text-[#4a5568]">{g.desc}</CardContent>
          </Card>
        ))}
      </main>
      <Footer />
    </div>
  );
}
