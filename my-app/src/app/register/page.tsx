"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GonjongIcon, MarawaStrip } from "@/components/minang-icons";
import { Loader2, AlertCircle, CheckCircle2, ChevronRight, ChevronLeft } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const [formData, setFormData] = useState({
    // Step 1: Akun & Kependudukan
    nik: "",
    nama: "",
    email: "",
    password: "",
    confirmPassword: "",
    // Step 2: Adat & Minangkabau Culture
    suku: "Chaniago",
    jorong: "Jorong Balai Gadang",
    ibuKandung: "",
    ayahDatuak: "",
    noHp: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.nik || formData.nik.length !== 16) {
      setError("NIK harus berjumlah 16 digit angka");
      return;
    }
    if (!formData.nama) {
      setError("Nama lengkap wajib diisi");
      return;
    }
    if (!formData.email) {
      setError("Email wajib diisi");
      return;
    }
    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Konfirmasi password tidak cocok");
      return;
    }

    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Registrasi gagal");
        return;
      }

      setSuccess(true);
      setTimeout(() => router.push("/login?registered=true"), 2000);
    } catch {
      setError("Terjadi kesalahan koneksi. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100">
        <Card className="w-full max-w-md border border-amber-500/30 bg-zinc-900/90 text-center shadow-2xl">
          <MarawaStrip className="h-1.5 w-full" />
          <CardContent className="pt-8 pb-8 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30">
              <CheckCircle2 className="h-10 w-10 text-amber-400" />
            </div>
            <CardTitle className="text-2xl font-bold text-white">
              Pendaftaran Berhasil!
            </CardTitle>
            <CardDescription className="text-zinc-400">
              Data Anda sebagai warga Nagari Sungayang telah tersimpan. Mengalihkan ke halaman masuk...
            </CardDescription>
            <Loader2 className="mx-auto h-7 w-7 animate-spin text-amber-400 mt-4" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100">
      <Card className="w-full max-w-lg border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md overflow-hidden">
        <MarawaStrip className="h-1.5 w-full" />

        <CardHeader className="text-center pt-8">
          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-red-700 p-0.5 shadow-md shadow-amber-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950 text-amber-400">
              <GonjongIcon className="h-7 w-7 text-amber-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white">
            Pendaftaran Warga Sungayang
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            Persatuan Warga Sungayang (PWS) • Luhak Nan Tuo Tanah Datar
          </CardDescription>

          {/* Step Indicator */}
          <div className="mt-4 flex items-center justify-center gap-2">
            <div
              className={`h-2 rounded-full transition-all ${
                step === 1 ? "w-10 bg-amber-500" : "w-4 bg-zinc-700"
              }`}
            />
            <div
              className={`h-2 rounded-full transition-all ${
                step === 2 ? "w-10 bg-amber-500" : "w-4 bg-zinc-700"
              }`}
            />
          </div>
        </CardHeader>

        <CardContent>
          {error && (
            <div className="mb-4 flex items-center gap-2 text-sm text-red-300 bg-red-950/40 border border-red-800/50 p-3 rounded-md">
              <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {step === 1 ? (
            <form onSubmit={handleNext} className="space-y-4">
              <div className="border-b border-zinc-800 pb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Langkah 1: Akun & Kependudukan
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nik" className="text-zinc-300">
                  Nomor Induk Kependudukan (NIK) *
                </Label>
                <Input
                  id="nik"
                  name="nik"
                  placeholder="16 digit NIK sesuai KTP"
                  value={formData.nik}
                  onChange={handleChange}
                  maxLength={16}
                  required
                  className="bg-zinc-950 border-zinc-800 text-white font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nama" className="text-zinc-300">
                  Nama Lengkap *
                </Label>
                <Input
                  id="nama"
                  name="nama"
                  placeholder="Nama lengkap (serta gelar jika ada)"
                  value={formData.nama}
                  onChange={handleChange}
                  required
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="email" className="text-zinc-300">
                  Email Aktif *
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="email@contoh.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="password" className="text-zinc-300">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    placeholder="Min. 8 karakter"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="confirmPassword" className="text-zinc-300">
                    Konfirmasi Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    placeholder="Ulangi password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    required
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold gap-2 mt-2"
              >
                <span>Lanjut: Data Adat & Suku</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </form>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="border-b border-zinc-800 pb-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-amber-400">
                  Langkah 2: Suku, Jorong & Garis Keturunan
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="suku" className="text-zinc-300">
                    Suku (Garis Mandeh) *
                  </Label>
                  <Select
                    id="suku"
                    name="suku"
                    value={formData.suku}
                    onChange={handleChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  >
                    <option value="Chaniago">Chaniago</option>
                    <option value="Piliang">Piliang</option>
                    <option value="Bodi Caniago">Bodi Caniago</option>
                    <option value="Koto">Koto</option>
                    <option value="Sikumbang">Sikumbang</option>
                    <option value="Guci">Guci</option>
                    <option value="Mandahiliang">Mandahiliang</option>
                    <option value="Pitopang">Pitopang</option>
                    <option value="Melayu">Melayu</option>
                    <option value="Jambak">Jambak</option>
                  </Select>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="jorong" className="text-zinc-300">
                    Jorong Asal Sungayang *
                  </Label>
                  <Select
                    id="jorong"
                    name="jorong"
                    value={formData.jorong}
                    onChange={handleChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  >
                    <option value="Jorong Balai Gadang">Jorong Balai Gadang</option>
                    <option value="Jorong Koto Baru">Jorong Koto Baru</option>
                    <option value="Jorong Koto Tangah">Jorong Koto Tangah</option>
                    <option value="Jorong Sianau Indah">Jorong Sianau Indah</option>
                    <option value="Jorong Minangkabau">Jorong Minangkabau</option>
                  </Select>
                </div>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ibuKandung" className="text-zinc-300">
                  Nama Ibu Kandung (Mandeh)
                </Label>
                <Input
                  id="ibuKandung"
                  name="ibuKandung"
                  placeholder="Nama Ibu Kandung (pewaris suku)"
                  value={formData.ibuKandung}
                  onChange={handleChange}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ayahDatuak" className="text-zinc-300">
                  Nama Ayah / Datuak
                </Label>
                <Input
                  id="ayahDatuak"
                  name="ayahDatuak"
                  placeholder="Nama Ayah / Gelar Datuak"
                  value={formData.ayahDatuak}
                  onChange={handleChange}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noHp" className="text-zinc-300">
                  Nomor HP / WhatsApp
                </Label>
                <Input
                  id="noHp"
                  name="noHp"
                  placeholder="Contoh: 081234567890"
                  value={formData.noHp}
                  onChange={handleChange}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(1)}
                  disabled={isLoading}
                  className="border-zinc-800 text-zinc-300 hover:bg-zinc-800"
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Kembali
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-zinc-950 font-bold"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Mendaftarkan Warga...
                    </>
                  ) : (
                    "Daftar Sekarang"
                  )}
                </Button>
              </div>
            </form>
          )}
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-6">
          <Separator>Sudah Punya Akun?</Separator>
          <Link
            href="/login"
            className="text-center text-sm text-amber-400 hover:text-amber-300 hover:underline"
          >
            Masuk ke Portal Warga
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
