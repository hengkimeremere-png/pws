"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { GenealogyTreeSimple } from "@/components/genealogy-tree-simple";
import { OrganizationalChart } from "@/components/organizational-chart";
import { GonjongIcon, MarawaStrip } from "@/components/minang-icons";
import SilsilahWarga from "@/components/silsilah-warga";
import { KtaDigital } from "@/components/kta-digital";
import { PersebaranMap } from "@/components/persebaran-map";
import { WartaNagari } from "@/components/warta-nagari";
import {
  User,
  LogOut,
  MapPin,
  Phone,
  Mail,
  Calendar,
  GitFork,
  Users,
  ShieldCheck,
  Award,
  Sparkles,
  Edit,
  Navigation,
  ExternalLink,
  Loader2,
  CheckCircle2,
  CreditCard,
  Globe2,
  Bell,
} from "lucide-react";

interface MemberProps {
  user: {
    id: string;
    nik: string;
    nama: string;
    tempatLahir: string | null;
    tglLahir: Date | string | null;
    jk: "L" | "P";
    suku: string;
    ibuKandung: string;
    ayahDatuak: string;
    jorong: string;
    pekerjaan: string | null;
    noHp: string;
    alamatDomisili: string;
    latitude?: number | null;
    longitude?: number | null;
    mapUrl?: string | null;
    email: string;
    createdAt: Date | string;
  };
}

export default function MemberDashboardClient({ user: initialUser }: MemberProps) {
  const [user, setUser] = useState(initialUser);
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [gettingLocation, setGettingLocation] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Edit Form State
  const [formData, setFormData] = useState({
    nama: user.nama,
    tempatLahir: user.tempatLahir || "",
    tglLahir: user.tglLahir ? new Date(user.tglLahir).toISOString().split("T")[0] : "",
    jk: user.jk,
    suku: user.suku,
    ibuKandung: user.ibuKandung,
    ayahDatuak: user.ayahDatuak,
    jorong: user.jorong,
    pekerjaan: user.pekerjaan || "",
    noHp: user.noHp,
    alamatDomisili: user.alamatDomisili,
    latitude: user.latitude !== undefined && user.latitude !== null ? user.latitude.toString() : "",
    longitude: user.longitude !== undefined && user.longitude !== null ? user.longitude.toString() : "",
    mapUrl: user.mapUrl || "",
  });

  const handleOpenEdit = () => {
    setFormData({
      nama: user.nama,
      tempatLahir: user.tempatLahir || "",
      tglLahir: user.tglLahir ? new Date(user.tglLahir).toISOString().split("T")[0] : "",
      jk: user.jk,
      suku: user.suku,
      ibuKandung: user.ibuKandung,
      ayahDatuak: user.ayahDatuak,
      jorong: user.jorong,
      pekerjaan: user.pekerjaan || "",
      noHp: user.noHp,
      alamatDomisili: user.alamatDomisili,
      latitude: user.latitude !== undefined && user.latitude !== null ? user.latitude.toString() : "",
      longitude: user.longitude !== undefined && user.longitude !== null ? user.longitude.toString() : "",
      mapUrl: user.mapUrl || "",
    });
    setSaveSuccess(false);
    setEditOpen(true);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Get current device geolocation (GPS)
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung deteksi lokasi otomatis");
      return;
    }

    setGettingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = Number(position.coords.latitude.toFixed(6));
        const lng = Number(position.coords.longitude.toFixed(6));
        setFormData((prev) => ({
          ...prev,
          latitude: lat.toString(),
          longitude: lng.toString(),
          mapUrl: `https://www.google.com/maps?q=${lat},${lng}`,
        }));
        setGettingLocation(false);
      },
      (err) => {
        alert("Gagal mendeteksi lokasi GPS: " + err.message);
        setGettingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Save profile and map updates
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          latitude: formData.latitude ? parseFloat(formData.latitude) : null,
          longitude: formData.longitude ? parseFloat(formData.longitude) : null,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setUser(data.user);
        setSaveSuccess(true);
        setTimeout(() => {
          setEditOpen(false);
          setSaveSuccess(false);
        }, 1200);
      } else {
        const err = await res.json();
        alert(err.error || "Gagal memperbarui profil");
      }
    } catch {
      alert("Terjadi kesalahan koneksi");
    } finally {
      setSaving(false);
    }
  };

  const formattedTglLahir = user.tglLahir
    ? new Date(user.tglLahir).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "-";

  const formattedTglDaftar = new Date(user.createdAt).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const hasCoordinates =
    user.latitude !== undefined &&
    user.latitude !== null &&
    user.longitude !== undefined &&
    user.longitude !== null;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      {/* Marawa Ribbon Accent */}
      <MarawaStrip className="h-2 w-full" />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 p-0.5 shadow-md shadow-amber-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950 text-amber-400">
                <GonjongIcon className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="text-base sm:text-lg font-bold leading-tight text-white flex items-center gap-1.5">
                SIWAS <span className="text-amber-400 font-serif">Sungayang</span>
              </h1>
              <p className="text-xs text-zinc-400">
                Portal Warga & Tarombo Nagari Sungayang
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <Button
              onClick={handleOpenEdit}
              size="sm"
              className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold gap-1.5 shadow-md shadow-amber-500/20"
            >
              <Edit className="h-4 w-4" />
              <span className="hidden sm:inline">Edit Profil & Peta</span>
              <span className="sm:hidden">Edit</span>
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="gap-2 border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline">Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Welcome Card with Minang Heritage Background */}
        <div className="relative mb-8 overflow-hidden rounded-2xl border border-amber-500/30 bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/40 p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between relative z-10">
            <div>
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 px-3 py-1 text-xs font-semibold text-amber-300">
                <ShieldCheck className="h-3.5 w-3.5 text-amber-400" />
                <span>Warga Sah Persatuan Warga Sungayang</span>
              </div>
              <h2 className="mt-3 text-2xl font-bold sm:text-3xl text-white">
                Salamaik Datang, {user.nama}
              </h2>
              <p className="mt-1 max-w-xl text-zinc-300 text-sm sm:text-base">
                Data kependudukan dan silsilah matrilineal Anda tercatat pada Suku{" "}
                <span className="font-semibold text-amber-400">{user.suku}</span>, Asal{" "}
                <span className="font-semibold text-amber-400">{user.jorong}</span>, Nagari Sungayang, Tanah Datar.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 text-xs">
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 px-4 py-2.5 backdrop-blur-md">
                <p className="text-zinc-500 text-[10px] uppercase tracking-wider">NIK Kependudukan</p>
                <p className="font-mono font-semibold text-amber-300">{user.nik}</p>
              </div>
              <div className="rounded-xl border border-amber-500/20 bg-amber-950/30 px-4 py-2.5 backdrop-blur-md">
                <p className="text-amber-400/80 text-[10px] uppercase tracking-wider">Payung Suku</p>
                <p className="font-bold text-amber-300">{user.suku}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 sm:grid-cols-7 max-w-4xl mx-auto sm:mx-0 bg-zinc-900 border border-zinc-800 p-1">
            <TabsTrigger
              value="profile"
              className="gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 font-semibold text-xs"
            >
              <User className="h-3.5 w-3.5" />
              <span>Profil</span>
            </TabsTrigger>
            <TabsTrigger
              value="kta"
              className="gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 font-semibold text-xs"
            >
              <CreditCard className="h-3.5 w-3.5" />
              <span>KTA</span>
            </TabsTrigger>
            <TabsTrigger
              value="genealogy"
              className="gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 font-semibold text-xs"
            >
              <GitFork className="h-3.5 w-3.5" />
              <span>Tarombo</span>
            </TabsTrigger>
            <TabsTrigger
              value="silsilah-warga"
              className="gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 font-semibold text-xs"
            >
              <Sparkles className="h-3.5 w-3.5" />
              <span>Silsilah</span>
            </TabsTrigger>
            <TabsTrigger
              value="persebaran"
              className="gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 font-semibold text-xs"
            >
              <Globe2 className="h-3.5 w-3.5" />
              <span>Persebaran</span>
            </TabsTrigger>
            <TabsTrigger
              value="warta"
              className="gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 font-semibold text-xs"
            >
              <Bell className="h-3.5 w-3.5" />
              <span>Warta</span>
            </TabsTrigger>
            <TabsTrigger
              value="organization"
              className="gap-1.5 data-[state=active]:bg-amber-500 data-[state=active]:text-zinc-950 font-semibold text-xs"
            >
              <Users className="h-3.5 w-3.5" />
              <span>Pengurus</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Profile & Map */}
          <TabsContent value="profile" className="space-y-6">
            <div className="grid gap-6 md:grid-cols-3">
              {/* Profile Card Summary */}
              <Card className="md:col-span-1 border border-zinc-800 bg-zinc-900/60 shadow-lg backdrop-blur-md">
                <CardHeader className="text-center pb-2">
                  <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                    <GonjongIcon className="h-10 w-10 text-amber-400" />
                  </div>
                  <CardTitle className="mt-4 text-xl text-white">{user.nama}</CardTitle>
                  <CardDescription className="text-zinc-400 text-xs font-mono">
                    {user.nik}
                  </CardDescription>
                  <div className="mt-3 flex justify-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Suku {user.suku}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-zinc-800 text-zinc-300">
                      {user.jorong}
                    </span>
                  </div>
                </CardHeader>
                <CardContent className="mt-4 space-y-3.5 text-sm border-t border-zinc-800/80 pt-4">
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Mail className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <Phone className="h-4 w-4 text-amber-400 shrink-0" />
                    <span>{user.noHp}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-300">
                    <MapPin className="h-4 w-4 text-amber-400 shrink-0" />
                    <span className="truncate">{user.alamatDomisili}</span>
                  </div>
                  <div className="flex items-center gap-3 text-zinc-400 text-xs">
                    <Calendar className="h-4 w-4 text-zinc-500 shrink-0" />
                    <span>Terdaftar: {formattedTglDaftar}</span>
                  </div>

                  <div className="pt-2">
                    <Button
                      onClick={handleOpenEdit}
                      variant="outline"
                      className="w-full border-zinc-700 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 text-xs gap-1.5"
                    >
                      <Edit className="h-3.5 w-3.5 text-amber-400" />
                      <span>Edit Identitas & Lokasi Peta</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Detail Information */}
              <Card className="md:col-span-2 border border-zinc-800 bg-zinc-900/60 shadow-lg backdrop-blur-md">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle className="text-lg text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-400" />
                      <span>Biodata & Garis Silsilah Minangkabau</span>
                    </CardTitle>
                    <CardDescription className="text-zinc-400">
                      Dokumentasi kependudukan dan pewarisan suku matrilineal
                    </CardDescription>
                  </div>
                  <Button
                    onClick={handleOpenEdit}
                    size="sm"
                    variant="outline"
                    className="border-amber-500/30 text-amber-400 hover:bg-amber-950/30 gap-1.5 text-xs"
                  >
                    <Edit className="h-3.5 w-3.5" />
                    <span>Edit Profil</span>
                  </Button>
                </CardHeader>
                <CardContent>
                  <dl className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Nomor Induk Kependudukan (NIK)
                      </dt>
                      <dd className="mt-1 font-mono text-sm font-semibold text-amber-400">
                        {user.nik}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Nama Lengkap
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-white">
                        {user.nama}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Tempat, Tanggal Lahir
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-zinc-200">
                        {user.tempatLahir ? `${user.tempatLahir}, ` : ""}
                        {formattedTglLahir}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Jenis Kelamin
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-zinc-200">
                        {user.jk === "L" ? "Laki-laki" : "Perempuan"}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-amber-500/30 p-3.5">
                      <dt className="text-xs font-medium text-amber-400 uppercase tracking-wider">
                        Suku Warisan (Matrilineal)
                      </dt>
                      <dd className="mt-1 text-sm font-bold text-amber-300">
                        Suku {user.suku}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Jorong Asal di Nagari Sungayang
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-zinc-200">
                        {user.jorong}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Ibu Kandung (Mandeh)
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-amber-300">
                        {user.ibuKandung}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Ayah / Datuak
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-zinc-200">
                        {user.ayahDatuak}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Pekerjaan
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-zinc-200">
                        {user.pekerjaan || "Belum diisi"}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Nomor HP / WhatsApp
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-zinc-200">
                        {user.noHp}
                      </dd>
                    </div>

                    <div className="rounded-xl bg-zinc-950 border border-zinc-800/80 p-3.5 sm:col-span-2">
                      <dt className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                        Alamat Domisili Sekarang
                      </dt>
                      <dd className="mt-1 text-sm font-semibold text-zinc-200">
                        {user.alamatDomisili}
                      </dd>
                    </div>
                  </dl>
                </CardContent>
              </Card>

              {/* IDENTITAS PETA DOMISILI (MAP SECTION) */}
              <Card className="md:col-span-3 border border-zinc-800 bg-zinc-900/60 shadow-lg backdrop-blur-md">
                <CardHeader>
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div>
                      <CardTitle className="text-lg text-white flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-amber-400" />
                        <span>Identitas Peta Domisili Warga (GIS Perantauan)</span>
                      </CardTitle>
                      <CardDescription className="text-zinc-400">
                        Lokasi titik koordinat domisili warga untuk pemetaan persebaran perantau Nagari Sungayang
                      </CardDescription>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={handleOpenEdit}
                        variant="outline"
                        size="sm"
                        className="gap-1.5 border-amber-500/30 text-amber-400 hover:bg-amber-950/30 text-xs"
                      >
                        <Navigation className="h-3.5 w-3.5" />
                        <span>Atur Koordinat Peta</span>
                      </Button>
                      {hasCoordinates && (
                        <a
                          href={`https://www.google.com/maps?q=${user.latitude},${user.longitude}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <Button size="sm" variant="outline" className="gap-1.5 border-zinc-700 text-xs">
                            <ExternalLink className="h-3.5 w-3.5" />
                            <span>Buka di Google Maps</span>
                          </Button>
                        </a>
                      )}
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {hasCoordinates ? (
                    <div className="space-y-3">
                      <div className="flex flex-wrap items-center gap-4 text-xs bg-zinc-950 border border-zinc-800 p-3 rounded-xl">
                        <div>
                          <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Latitude (Lintang)</span>
                          <span className="font-mono font-semibold text-amber-300">{user.latitude}</span>
                        </div>
                        <div className="w-px h-6 bg-zinc-800" />
                        <div>
                          <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Longitude (Bujur)</span>
                          <span className="font-mono font-semibold text-amber-300">{user.longitude}</span>
                        </div>
                        <div className="w-px h-6 bg-zinc-800" />
                        <div className="flex-1 truncate">
                          <span className="text-zinc-500 uppercase tracking-wider text-[10px] block">Alamat Tersemat</span>
                          <span className="text-zinc-300 truncate">{user.alamatDomisili}</span>
                        </div>
                      </div>

                      {/* Interactive OpenStreetMap Embed */}
                      <div className="relative w-full h-80 rounded-xl overflow-hidden border border-zinc-800 shadow-inner">
                        <iframe
                          title="Peta Domisili Warga"
                          width="100%"
                          height="100%"
                          frameBorder="0"
                          scrolling="no"
                          marginHeight={0}
                          marginWidth={0}
                          src={`https://www.openstreetmap.org/export/embed.html?bbox=${Number(user.longitude) - 0.02}%2C${Number(user.latitude) - 0.02}%2C${Number(user.longitude) + 0.02}%2C${Number(user.latitude) + 0.02}&layer=mapnik&marker=${user.latitude}%2C${user.longitude}`}
                          className="w-full h-full filter contrast-125 brightness-90"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-950/60 p-8 text-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-400 mb-3 border border-amber-500/20">
                        <MapPin className="h-6 w-6" />
                      </div>
                      <h4 className="text-sm font-semibold text-white">Titik Koordinat Peta Belum Diatur</h4>
                      <p className="text-xs text-zinc-400 max-w-md mx-auto mt-1 mb-4">
                        Tambahkan titik lokasi domisili Anda di perantauan untuk melengkapi basis data pemetaan warga Persatuan Warga Sungayang (PWS).
                      </p>
                      <Button
                        onClick={handleOpenEdit}
                        className="bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold gap-1.5 text-xs shadow-md shadow-amber-500/20"
                      >
                        <Navigation className="h-4 w-4" />
                        <span>Tentukan Titik Peta Sekarang</span>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* TAB 2: KTA Digital */}
          <TabsContent value="kta">
            <Card className="border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md p-6">
              <KtaDigital user={user} />
            </Card>
          </TabsContent>

          {/* TAB 3: Genealogy */}
          <TabsContent value="genealogy">
            <Card className="border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-white">
                  Bagan Tarombo Silsilah Adat Minangkabau
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Garis suku diturunkan melalui jalur Ibu Kandung (*Mandeh*) kepada anak
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto py-6">
                <GenealogyTreeSimple
                  user={{
                    nama: user.nama,
                    suku: user.suku,
                    ibuKandung: user.ibuKandung,
                    ayahDatuak: user.ayahDatuak,
                    jorong: user.jorong,
                    nik: user.nik,
                  }}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 4: Silsilah Semua Warga */}
          <TabsContent value="silsilah-warga">
            <SilsilahWarga />
          </TabsContent>

          {/* TAB 5: Peta Persebaran */}
          <TabsContent value="persebaran">
            <Card className="border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md p-6">
              <PersebaranMap />
            </Card>
          </TabsContent>

          {/* TAB 6: Warta Nagari */}
          <TabsContent value="warta">
            <Card className="border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md p-6">
              <WartaNagari />
            </Card>
          </TabsContent>

          {/* TAB 7: Organizational Chart */}
          <TabsContent value="organization">
            <Card className="border border-zinc-800 bg-zinc-900/60 shadow-xl backdrop-blur-md">
              <CardHeader className="text-center">
                <CardTitle className="text-xl text-white">
                  Struktur Kepengurusan Persatuan Warga Sungayang (PWS)
                </CardTitle>
                <CardDescription className="text-zinc-400">
                  Susunan hirarki pengurus PWS dari Pimpinan Pusat hingga Koordinator Jorong (Live dari Database)
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto py-6">
                <OrganizationalChart />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* DIALOG: EDIT IDENTITAS & MAP WARGA */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2">
              <Edit className="h-5 w-5 text-amber-400" />
              <span>Edit Identitas & Lokasi Peta Warga</span>
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Perbarui biodata, garis keturunan adat, serta koordinat peta domisili Anda.
            </DialogDescription>
          </DialogHeader>

          {saveSuccess ? (
            <div className="py-8 text-center space-y-3">
              <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto animate-bounce" />
              <h4 className="text-base font-bold text-white">Perubahan Berhasil Disimpan!</h4>
              <p className="text-xs text-zinc-400">Data profil dan identitas peta telah diperbarui.</p>
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="border-b border-zinc-800 pb-1">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  1. Biodata Kependudukan
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="nama" className="text-zinc-300">Nama Lengkap *</Label>
                <Input
                  id="nama"
                  name="nama"
                  value={formData.nama}
                  onChange={handleInputChange}
                  required
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="tempatLahir" className="text-zinc-300">Tempat Lahir</Label>
                  <Input
                    id="tempatLahir"
                    name="tempatLahir"
                    placeholder="Contoh: Padang"
                    value={formData.tempatLahir}
                    onChange={handleInputChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="tglLahir" className="text-zinc-300">Tanggal Lahir</Label>
                  <Input
                    id="tglLahir"
                    name="tglLahir"
                    type="date"
                    value={formData.tglLahir}
                    onChange={handleInputChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="jk" className="text-zinc-300">Jenis Kelamin</Label>
                  <Select
                    id="jk"
                    name="jk"
                    value={formData.jk}
                    onChange={handleInputChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </Select>
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="pekerjaan" className="text-zinc-300">Pekerjaan</Label>
                  <Input
                    id="pekerjaan"
                    name="pekerjaan"
                    placeholder="Profesi / Pekerjaan"
                    value={formData.pekerjaan}
                    onChange={handleInputChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="border-b border-zinc-800 pb-1 pt-2">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  2. Garis Keturunan Adat Minangkabau
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="suku" className="text-zinc-300">Suku (Garis Mandeh) *</Label>
                  <Select
                    id="suku"
                    name="suku"
                    value={formData.suku}
                    onChange={handleInputChange}
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
                  <Label htmlFor="jorong" className="text-zinc-300">Jorong Asal Sungayang *</Label>
                  <Select
                    id="jorong"
                    name="jorong"
                    value={formData.jorong}
                    onChange={handleInputChange}
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

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="ibuKandung" className="text-zinc-300">Ibu Kandung (Mandeh)</Label>
                  <Input
                    id="ibuKandung"
                    name="ibuKandung"
                    placeholder="Nama Ibu Kandung"
                    value={formData.ibuKandung}
                    onChange={handleInputChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="ayahDatuak" className="text-zinc-300">Ayah / Datuak</Label>
                  <Input
                    id="ayahDatuak"
                    name="ayahDatuak"
                    placeholder="Nama Ayah / Gelar Datuak"
                    value={formData.ayahDatuak}
                    onChange={handleInputChange}
                    className="bg-zinc-950 border-zinc-800 text-white"
                  />
                </div>
              </div>

              <div className="border-b border-zinc-800 pb-1 pt-2">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wider">
                  3. Kontak & Identitas Peta Domisili
                </p>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="noHp" className="text-zinc-300">Nomor HP / WhatsApp</Label>
                <Input
                  id="noHp"
                  name="noHp"
                  placeholder="081234567890"
                  value={formData.noHp}
                  onChange={handleInputChange}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="alamatDomisili" className="text-zinc-300">Alamat Lengkap Domisili</Label>
                <Input
                  id="alamatDomisili"
                  name="alamatDomisili"
                  placeholder="Jalan, RT/RW, Kelurahan/Kecamatan, Kota/Kabupaten"
                  value={formData.alamatDomisili}
                  onChange={handleInputChange}
                  className="bg-zinc-950 border-zinc-800 text-white"
                />
              </div>

              {/* MAP COORD INPUTS & GPS BUTTON */}
              <div className="rounded-xl border border-zinc-800 bg-zinc-950/80 p-3.5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-amber-300">
                    <MapPin className="h-4 w-4" />
                    <span>Titik Koordinat Peta (GPS / Map)</span>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleGetLocation}
                    disabled={gettingLocation}
                    className="gap-1.5 text-xs border-amber-500/40 text-amber-400 hover:bg-amber-950/40 h-8"
                  >
                    {gettingLocation ? (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    ) : (
                      <Navigation className="h-3.5 w-3.5" />
                    )}
                    <span>{gettingLocation ? "Mendeteksi..." : "Ambil Lokasi Saya (GPS)"}</span>
                  </Button>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="latitude" className="text-[11px] text-zinc-400">Latitude (Garis Lintang)</Label>
                    <Input
                      id="latitude"
                      name="latitude"
                      placeholder="-0.9471"
                      value={formData.latitude}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                    />
                  </div>
                  <div className="space-y-1">
                    <Label htmlFor="longitude" className="text-[11px] text-zinc-400">Longitude (Garis Bujur)</Label>
                    <Input
                      id="longitude"
                      name="longitude"
                      placeholder="100.4172"
                      value={formData.longitude}
                      onChange={handleInputChange}
                      className="bg-zinc-900 border-zinc-800 text-white font-mono text-xs"
                    />
                  </div>
                </div>
              </div>

              <DialogFooter className="pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setEditOpen(false)}
                  disabled={saving}
                  className="border-zinc-800 text-zinc-300"
                >
                  Batal
                </Button>
                <Button
                  type="submit"
                  disabled={saving}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold"
                >
                  {saving ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Menyimpan Perubahan...
                    </>
                  ) : (
                    "Simpan Identitas & Peta"
                  )}
                </Button>
              </DialogFooter>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
