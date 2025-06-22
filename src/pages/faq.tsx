import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import ProtectedRoute from "@/components/wrappers/ProtectedRoute";

export default function FAQ() {
  const faqs = [
    {
      q: "Apa itu SensasiWangi.id?",
      a: "SensasiWangi.id adalah komunitas pecinta parfum Indonesia untuk berbagi informasi dan berdiskusi.",
    },
    {
      q: "Bagaimana cara membuat topik baru?",
      a: "Masuk ke halaman forum lalu klik tombol 'Buat Topik Baru'.",
    },
    {
      q: "Apa manfaat mendapatkan poin?",
      a: "Poin meningkatkan level akun dan dapat membuka badge khusus.",
    },
    {
      q: "Bagaimana cara menghubungi admin?",
      a: "Gunakan formulir kontak pada halaman profil atau kirim email ke admin@sensasiwangi.id.",
    },
  ];

  return (
    <ProtectedRoute>
      <div className="min-h-screen flex flex-col neumorphic-bg">
        <Navbar />
        <main className="flex-grow container mx-auto px-4 py-16 space-y-6">
          <h1 className="text-3xl font-bold text-center mb-8">FAQ</h1>
          {faqs.map((f, idx) => (
            <div key={idx} className="neumorphic-card p-6">
              <h2 className="font-semibold mb-2">{f.q}</h2>
              <p className="text-sm text-[#4a5568]">{f.a}</p>
            </div>
          ))}
        </main>
        <Footer />
      </div>
    </ProtectedRoute>
  );
}
