import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Eye, Lock, Users, Database, Mail } from "lucide-react";

export default function Privacy() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="neumorphic-card p-4 rounded-2xl">
                <Shield className="w-12 h-12 text-[#0066CC]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#1D1D1F] mb-2">
              Kebijakan Privasi
            </h1>
            <p className="text-[#86868B] text-lg">
              Terakhir diperbarui:{" "}
              {new Date().toLocaleDateString("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            </p>
          </div>

          <div className="space-y-6">
            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Eye className="w-5 h-5" />
                  Informasi yang Kami Kumpulkan
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Kami mengumpulkan informasi yang Anda berikan secara langsung
                  kepada kami, seperti:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Informasi akun (nama, email, foto profil)</li>
                  <li>Konten yang Anda posting (diskusi, komentar, review)</li>
                  <li>Informasi produk yang Anda jual atau beli</li>
                  <li>Komunikasi dengan kami (pesan, laporan bug, saran)</li>
                  <li>
                    Informasi pembayaran (melalui penyedia layanan pihak ketiga)
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Database className="w-5 h-5" />
                  Bagaimana Kami Menggunakan Informasi Anda
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>Kami menggunakan informasi yang dikumpulkan untuk:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Menyediakan, mengoperasikan, dan memelihara layanan kami
                  </li>
                  <li>Memproses transaksi dan mengirim konfirmasi</li>
                  <li>Berkomunikasi dengan Anda tentang layanan kami</li>
                  <li>Meningkatkan dan mengembangkan fitur baru</li>
                  <li>Mencegah penipuan dan menjaga keamanan platform</li>
                  <li>Mematuhi kewajiban hukum</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Berbagi Informasi
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Kami tidak menjual, menyewakan, atau membagikan informasi
                  pribadi Anda kepada pihak ketiga, kecuali:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Dengan persetujuan eksplisit Anda</li>
                  <li>
                    Untuk memproses pembayaran (dengan penyedia layanan
                    pembayaran)
                  </li>
                  <li>Untuk mematuhi hukum atau proses hukum</li>
                  <li>
                    Untuk melindungi hak, properti, atau keselamatan kami atau
                    pengguna lain
                  </li>
                  <li>Dalam kasus merger, akuisisi, atau penjualan aset</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Lock className="w-5 h-5" />
                  Keamanan Data
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Kami menerapkan langkah-langkah keamanan yang sesuai untuk
                  melindungi informasi pribadi Anda:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Enkripsi data saat transit dan saat disimpan</li>
                  <li>Akses terbatas ke informasi pribadi</li>
                  <li>Pemantauan keamanan secara berkala</li>
                  <li>Pelatihan keamanan untuk tim kami</li>
                </ul>
                <p className="text-sm italic">
                  Namun, tidak ada metode transmisi melalui internet atau
                  penyimpanan elektronik yang 100% aman.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">Hak Anda</CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>Anda memiliki hak untuk:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Mengakses informasi pribadi yang kami miliki tentang Anda
                  </li>
                  <li>Memperbarui atau mengoreksi informasi Anda</li>
                  <li>Menghapus akun dan data Anda</li>
                  <li>Membatasi pemrosesan data Anda</li>
                  <li>Memindahkan data Anda ke layanan lain</li>
                  <li>Menolak pemrosesan data untuk tujuan tertentu</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Cookies dan Teknologi Pelacakan
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>Kami menggunakan cookies dan teknologi serupa untuk:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Mengingat preferensi dan pengaturan Anda</li>
                  <li>Menganalisis penggunaan situs web</li>
                  <li>Menyediakan fitur media sosial</li>
                  <li>Menampilkan iklan yang relevan</li>
                </ul>
                <p>
                  Anda dapat mengontrol penggunaan cookies melalui pengaturan
                  browser Anda.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Perubahan Kebijakan
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Kami dapat memperbarui kebijakan privasi ini dari waktu ke
                  waktu. Perubahan material akan diberitahukan melalui:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Email ke alamat yang terdaftar</li>
                  <li>Pemberitahuan di platform</li>
                  <li>Pembaruan tanggal &quot;terakhir diperbarui&quot;</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Mail className="w-5 h-5" />
                  Hubungi Kami
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Jika Anda memiliki pertanyaan tentang kebijakan privasi ini
                  atau ingin menggunakan hak Anda, silakan hubungi kami:
                </p>
                <div className="bg-[#F5F5F7] p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> privacy@parfumforum.id
                  </p>
                  <p>
                    <strong>Alamat:</strong> Jakarta, Indonesia
                  </p>
                  <p>
                    <strong>Telepon:</strong> +62-21-XXXXXXX
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

    </div>
  );
}
