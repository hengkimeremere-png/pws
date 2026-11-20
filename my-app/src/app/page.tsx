import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  GonjongIcon,
  MarawaStrip,
  PucukRebungBorder,
  SongketCorner,
} from "@/components/minang-icons";
import {
  Users,
  Shield,
  GitBranch,
  ArrowRight,
  UserCheck,
  Compass,
  Award,
  Sparkles,
  HeartHandshake,
} from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-black">
      {/* Authentic Marawa Ribbon at the very top */}
      <MarawaStrip className="h-2 w-full" />

      {/* Navbar with Minangkabau Brand Identity */}
      <header className="border-b border-amber-900/30 bg-zinc-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3.5">
            {/* Rumah Gadang Icon Badge */}
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 p-0.5 shadow-lg shadow-amber-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950 text-amber-400">
                <GonjongIcon className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
                  SIWAS <span className="text-amber-400 font-serif">Sungayang</span>
                </h1>
                <span className="hidden sm:inline-flex rounded-full bg-red-950/80 border border-red-700/50 px-2 py-0.5 text-[10px] font-semibold text-red-300">
                  Tanah Datar
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Sistem Informasi Warga & Tarombo Nagari Sungayang
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button
                variant="outline"
                size="sm"
                className="border-zinc-800 bg-zinc-900/80 hover:bg-zinc-800 hover:text-amber-300 text-zinc-200"
              >
                Masuk
              </Button>
            </Link>
            <Link href="/register">
              <Button
                size="sm"
                className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-semibold shadow-md shadow-amber-500/20 border-none"
              >
                Daftar Warga
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Hero & Culture Showcase */}
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-12 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full text-center relative overflow-hidden">
        {/* Subtle Watermark Gonjong Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] opacity-[0.03] pointer-events-none text-amber-400">
          <GonjongIcon className="w-full h-full" />
        </div>

        {/* Minang Adat Badge */}
        <div className="inline-flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/30 px-4 py-1.5 text-xs font-medium text-amber-300 mb-6 backdrop-blur-sm shadow-inner shadow-amber-500/10">
          <GonjongIcon className="h-4 w-4 text-amber-400" />
          <span className="font-serif italic tracking-wide">
            Adat Basandi Syarak, Syarak Basandi Kitabullah
          </span>
        </div>

        {/* Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white max-w-4xl leading-tight">
          Sistem Informasi & Tarombo Silsilah Digital{" "}
          <span className="bg-gradient-to-r from-amber-300 via-amber-400 to-yellow-500 bg-clip-text text-transparent">
            Warga Sungayang
          </span>
        </h1>

        <p className="mt-6 text-base sm:text-xl text-zinc-300 max-w-3xl leading-relaxed">
          Pusat pendataan warga ranah dan rantau, visualisasi silsilah garis keturunan ibu (*Matrilineal*), serta tata kelola organisasi Persatuan Warga Sungayang (PWS) Luhak Nan Tuo Tanah Datar.
        </p>

        {/* CTA Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center w-full max-w-md">
          <Link href="/register" className="w-full sm:w-auto">
            <Button
              size="lg"
              className="w-full gap-2 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-zinc-950 font-bold shadow-xl shadow-amber-500/25 border-none"
            >
              <span>Daftar Warga Baru</span>
              <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/login" className="w-full sm:w-auto">
            <Button
              variant="outline"
              size="lg"
              className="w-full border-zinc-700 bg-zinc-900/60 hover:bg-zinc-800 hover:border-amber-500/50 text-white"
            >
              Masuk ke Akun
            </Button>
          </Link>
        </div>

        {/* Marawa Cultural Strip Meaning */}
        <div className="mt-14 w-full max-w-4xl bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-5 backdrop-blur-md">
          <div className="flex items-center justify-center gap-2 mb-3 text-xs uppercase tracking-widest text-amber-400 font-semibold">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Filosofi Tri-Warna Marawa Minangkabau</span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-left">
            {/* Hitam */}
            <div className="border border-zinc-800 bg-zinc-950/80 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-3.5 h-10 rounded-full bg-black border border-zinc-700 shrink-0" />
              <div>
                <p className="text-xs font-bold text-white">Hitam • Luhak 50 Kota</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Lambang ketabahan, akal budi luhur, dan keteguhan hati warga Sungayang.
                </p>
              </div>
            </div>

            {/* Merah */}
            <div className="border border-red-950/40 bg-red-950/10 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-3.5 h-10 rounded-full bg-red-600 shrink-0 shadow-sm shadow-red-600/30" />
              <div>
                <p className="text-xs font-bold text-red-200">Merah • Luhak Agam</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Lambang keberanian menegakkan kebenaran, kearifan berunding dan mupakat.
                </p>
              </div>
            </div>

            {/* Kuning */}
            <div className="border border-amber-950/50 bg-amber-950/15 rounded-xl p-3.5 flex items-start gap-3">
              <div className="w-3.5 h-10 rounded-full bg-amber-400 shrink-0 shadow-sm shadow-amber-400/30" />
              <div>
                <p className="text-xs font-bold text-amber-300">Kuning • Luhak Tanah Datar</p>
                <p className="text-[11px] text-zinc-400 mt-0.5">
                  Lambang kebesaran adat nagari Sungayang, hukum, dan kedaulatan niniak mamak.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards with Songket Styling */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full text-left">
          {/* Card 1 */}
          <Card className="relative overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-md hover:border-amber-500/40 transition-all duration-300 group">
            <div className="absolute top-2 right-2 text-zinc-800 group-hover:text-amber-500/30 transition-colors">
              <SongketCorner className="w-8 h-8" />
            </div>
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <UserCheck className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-1.5 flex items-center gap-2">
                <span>Registrasi Warga Sah</span>
                <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-800 text-zinc-400 font-mono">
                  NIK
                </span>
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Pendataan kependudukan terpadu berdasarkan NIK, Suku asal, Jorong di Nagari Sungayang, dan alamat domisili di perantauan.
              </p>
            </CardContent>
          </Card>

          {/* Card 2 */}
          <Card className="relative overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-md hover:border-red-500/40 transition-all duration-300 group">
            <div className="absolute top-2 right-2 text-zinc-800 group-hover:text-red-500/30 transition-colors">
              <SongketCorner className="w-8 h-8" />
            </div>
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 flex items-center justify-center mb-4">
                <GitBranch className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-1.5">
                Tarombo Silsilah Matrilineal
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Visualisasi pohon silsilah keluarga adat Minangkabau: hubungan garis ibu (*Mandeh*), suku warisan, dan datuak/ayah secara digital.
              </p>
            </CardContent>
          </Card>

          {/* Card 3 */}
          <Card className="relative overflow-hidden border border-zinc-800 bg-zinc-900/50 backdrop-blur-md hover:border-amber-500/40 transition-all duration-300 group">
            <div className="absolute top-2 right-2 text-zinc-800 group-hover:text-amber-500/30 transition-colors">
              <SongketCorner className="w-8 h-8" />
            </div>
            <CardContent className="pt-6">
              <div className="h-11 w-11 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
                <HeartHandshake className="h-5 w-5" />
              </div>
              <h3 className="font-bold text-base text-white mb-1.5">
                Struktur Kepengurusan PWS
              </h3>
              <p className="text-sm text-zinc-400 leading-relaxed">
                Matriks hirarki organisasi Persatuan Warga Sungayang dari Pimpinan Pusat, Bidang Inti, hingga Koordinator Jorong.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* 5 Jorong Nagari Sungayang Pills */}
        <div className="mt-12 w-full flex flex-col items-center">
          <p className="text-xs uppercase tracking-widest text-zinc-400 font-semibold mb-3">
            Jorong di Nagari Sungayang, Tanah Datar
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              "Jorong Balai Gadang",
              "Jorong Koto Baru",
              "Jorong Koto Tangah",
              "Jorong Sianau Indah",
              "Jorong Minangkabau",
            ].map((jorong, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3 py-1.5 text-xs text-zinc-300 font-medium"
              >
                <Compass className="h-3 w-3 text-amber-400" />
                {jorong}
              </span>
            ))}
          </div>
        </div>
      </main>

      {/* Footer with Pucuk Rebung Motif and Minang Pepatah */}
      <footer className="border-t border-zinc-800/80 bg-zinc-950 py-8 px-4 text-center text-xs text-zinc-400">
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="text-amber-500/40 max-w-sm mx-auto">
            <PucukRebungBorder className="w-full h-3" />
          </div>

          <p className="font-serif italic text-zinc-400 text-sm">
            &ldquo;Barek samo dipikua, ringan samo dijinjiang. Ka pai tampek batanyo, pulang tampek babarito.&rdquo;
          </p>

          <p className="text-zinc-500">
            &copy; {new Date().getFullYear()} Persatuan Warga Sungayang (PWS). Hak Cipta Dilindungi Undang-Undang.
          </p>
        </div>
      </footer>
    </div>
  );
}
