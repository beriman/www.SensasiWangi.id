import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  FileText,
  Users,
  ShoppingCart,
  Shield,
  AlertTriangle,
  Scale,
} from "lucide-react";

export default function Terms() {
  return (
    <div className="min-h-screen bg-[#F5F5F7]">

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex justify-center mb-4">
              <div className="neumorphic-card p-4 rounded-2xl">
                <FileText className="w-12 h-12 text-[#0066CC]" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-[#1D1D1F] mb-2">
              Syarat & Ketentuan
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
                <CardTitle className="text-[#1D1D1F]">
                  Penerimaan Syarat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Dengan mengakses dan menggunakan platform Parfum Enthusiast
                  Forum (&quot;Platform&quot;), Anda menyetujui untuk terikat
                  oleh syarat dan ketentuan ini. Jika Anda tidak menyetujui
                  syarat ini, mohon untuk tidak menggunakan platform kami.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Akun Pengguna
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Untuk menggunakan fitur tertentu, Anda harus membuat akun
                  dengan memberikan informasi yang akurat dan lengkap. Anda
                  bertanggung jawab untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Menjaga kerahasiaan kata sandi akun Anda</li>
                  <li>Semua aktivitas yang terjadi di bawah akun Anda</li>
                  <li>
                    Memberitahu kami segera jika terjadi penggunaan tidak sah
                  </li>
                  <li>Memastikan informasi akun selalu terkini</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Aturan Komunitas
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>Dalam menggunakan platform ini, Anda setuju untuk TIDAK:</p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Memposting konten yang melanggar hukum, menyinggung, atau
                    tidak pantas
                  </li>
                  <li>Melakukan spam atau mengirim pesan berulang</li>
                  <li>
                    Menyamar sebagai orang lain atau memberikan informasi palsu
                  </li>
                  <li>Melanggar hak kekayaan intelektual orang lain</li>
                  <li>Menggunakan platform untuk aktivitas ilegal</li>
                  <li>Mengganggu atau merusak fungsi platform</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5" />
                  Marketplace & Transaksi
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Platform kami menyediakan tempat bagi pengguna untuk menjual
                  dan membeli produk parfum. Ketentuan marketplace:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Kami tidak bertanggung jawab atas kualitas, keamanan, atau
                    legalitas produk yang dijual
                  </li>
                  <li>Transaksi terjadi langsung antara pembeli dan penjual</li>
                  <li>
                    Penjual bertanggung jawab atas deskripsi produk yang akurat
                  </li>
                  <li>
                    Pembeli bertanggung jawab untuk memeriksa produk sebelum
                    membeli
                  </li>
                  <li>
                    Sengketa transaksi harus diselesaikan antara pembeli dan
                    penjual
                  </li>
                  <li>
                    Kami berhak menghapus listing yang melanggar ketentuan
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Fitur Sambat Parfum
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Fitur sambat memungkinkan pengguna untuk berbagi pembelian
                  produk parfum. Ketentuan khusus:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Penyelenggara sambat bertanggung jawab atas pembagian produk
                    yang adil
                  </li>
                  <li>
                    Peserta harus membayar sesuai dengan porsi yang disepakati
                  </li>
                  <li>
                    Kami tidak bertanggung jawab atas sengketa dalam sambat
                  </li>
                  <li>
                    Pembatalan sambat harus mengikuti aturan yang ditetapkan
                    penyelenggara
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Hak Kekayaan Intelektual
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Platform dan kontennya dilindungi oleh hak cipta dan hak
                  kekayaan intelektual lainnya. Anda setuju untuk:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Tidak menyalin, memodifikasi, atau mendistribusikan konten
                    platform tanpa izin
                  </li>
                  <li>Menghormati hak kekayaan intelektual pengguna lain</li>
                  <li>
                    Memberikan lisensi kepada kami untuk menggunakan konten yang
                    Anda posting
                  </li>
                  <li>
                    Tidak menggunakan merek dagang kami tanpa izin tertulis
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5" />
                  Penafian Tanggung Jawab
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Platform disediakan &quot;sebagaimana adanya&quot; tanpa
                  jaminan apapun. Kami tidak bertanggung jawab atas:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>
                    Kerugian langsung atau tidak langsung dari penggunaan
                    platform
                  </li>
                  <li>Gangguan layanan atau kehilangan data</li>
                  <li>Tindakan atau kelalaian pengguna lain</li>
                  <li>Konten yang diposting oleh pengguna</li>
                  <li>Transaksi antara pengguna</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Pembatasan Tanggung Jawab
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Dalam hal apapun, tanggung jawab total kami kepada Anda tidak
                  akan melebihi jumlah yang Anda bayarkan kepada kami dalam 12
                  bulan terakhir, atau Rp 1.000.000, mana yang lebih kecil.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Penangguhan dan Penghentian
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Kami berhak untuk menangguhkan atau menghentikan akun Anda
                  jika:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-4">
                  <li>Anda melanggar syarat dan ketentuan ini</li>
                  <li>Kami mencurigai aktivitas penipuan atau ilegal</li>
                  <li>Anda tidak menggunakan akun dalam waktu lama</li>
                  <li>
                    Diperlukan untuk melindungi platform atau pengguna lain
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F] flex items-center gap-2">
                  <Scale className="w-5 h-5" />
                  Hukum yang Berlaku
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Syarat dan ketentuan ini diatur oleh hukum Republik Indonesia.
                  Setiap sengketa akan diselesaikan melalui pengadilan yang
                  berwenang di Jakarta.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">
                  Perubahan Syarat
                </CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Kami dapat mengubah syarat dan ketentuan ini kapan saja.
                  Perubahan akan diberitahukan melalui platform atau email.
                  Penggunaan berkelanjutan setelah perubahan berarti Anda
                  menyetujui syarat yang baru.
                </p>
              </CardContent>
            </Card>

            <Card className="neumorphic-card border-0">
              <CardHeader>
                <CardTitle className="text-[#1D1D1F]">Kontak</CardTitle>
              </CardHeader>
              <CardContent className="text-[#86868B] space-y-4">
                <p>
                  Jika Anda memiliki pertanyaan tentang syarat dan ketentuan
                  ini, silakan hubungi kami:
                </p>
                <div className="bg-[#F5F5F7] p-4 rounded-lg">
                  <p>
                    <strong>Email:</strong> legal@parfumforum.id
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
