"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { GenealogyTreeSimple } from "@/components/genealogy-tree-simple";
import {
  Search,
  GitFork,
  Users,
  Filter,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TreePine,
  Heart,
} from "lucide-react";

interface WargaSilsilah {
  id: string;
  nama: string;
  suku: string;
  jorong: string;
  ibuKandung: string;
  ayahDatuak: string;
  jk: "L" | "P";
  tempatLahir: string | null;
  tglLahir: string | null;
  pekerjaan: string | null;
}

const SUKU_LIST = [
  "Chaniago", "Piliang", "Bodi Caniago", "Koto", "Sikumbang",
  "Guci", "Mandahiliang", "Pitopang", "Melayu", "Jambak",
];

const JORONG_LIST = [
  "Jorong Balai Gadang", "Jorong Koto Baru", "Jorong Koto Tangah",
  "Jorong Sianau Indah", "Jorong Minangkabau",
];

// Warna badge per suku
const SUKU_COLORS: Record<string, string> = {
  Chaniago:       "bg-blue-500/20 text-blue-300 border-blue-500/30",
  Piliang:        "bg-amber-500/20 text-amber-300 border-amber-500/30",
  "Bodi Caniago": "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  Koto:           "bg-purple-500/20 text-purple-300 border-purple-500/30",
  Sikumbang:      "bg-rose-500/20 text-rose-300 border-rose-500/30",
  Guci:           "bg-teal-500/20 text-teal-300 border-teal-500/30",
  Mandahiliang:   "bg-orange-500/20 text-orange-300 border-orange-500/30",
  Pitopang:       "bg-pink-500/20 text-pink-300 border-pink-500/30",
  Melayu:         "bg-cyan-500/20 text-cyan-300 border-cyan-500/30",
  Jambak:         "bg-lime-500/20 text-lime-300 border-lime-500/30",
};

function getSukuColor(suku: string) {
  return SUKU_COLORS[suku] || "bg-zinc-700/50 text-zinc-300 border-zinc-600";
}

export default function SilsilahWarga() {
  const [members, setMembers] = useState<WargaSilsilah[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterSuku, setFilterSuku] = useState("");
  const [filterJorong, setFilterJorong] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  // Dialog detail silsilah
  const [selected, setSelected] = useState<WargaSilsilah | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchMembers = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "24",
        ...(search && { search }),
        ...(filterSuku && { suku: filterSuku }),
        ...(filterJorong && { jorong: filterJorong }),
      });
      const res = await fetch(`/api/silsilah?${params}`);
      if (res.ok) {
        const data = await res.json();
        setMembers(data.members);
        setTotalPages(data.pagination.totalPages);
        setTotal(data.pagination.total);
      }
    } finally {
      setLoading(false);
    }
  }, [page, search, filterSuku, filterJorong]);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMembers();
    }, 300);
    return () => clearTimeout(timer);
  }, [fetchMembers]);

  // Reset page saat filter berubah
  useEffect(() => {
    setPage(1);
  }, [search, filterSuku, filterJorong]);

  const handleViewSilsilah = (member: WargaSilsilah) => {
    setSelected(member);
    setDialogOpen(true);
  };

  const formatTglLahir = (tgl: string | null) => {
    if (!tgl) return null;
    return new Date(tgl).toLocaleDateString("id-ID", {
      day: "numeric", month: "long", year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <Card className="border border-amber-500/20 bg-gradient-to-r from-zinc-900 via-zinc-900 to-amber-950/20 shadow-lg">
        <CardContent className="py-5 px-6">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
                <TreePine className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-bold text-white text-base">
                  Direktori Silsilah Warga Sungayang
                </h3>
                <p className="text-xs text-zinc-400">
                  Telusuri tarombo matrilineal seluruh warga terdaftar —{" "}
                  <span className="text-amber-400 font-semibold">{total} warga</span> tercatat
                </p>
              </div>
            </div>
            <div className="sm:ml-auto">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 px-3 py-1 text-xs text-amber-300">
                <Heart className="h-3 w-3 fill-amber-400 text-amber-400" />
                <span>Garis Ibu Kandung (Matrilineal)</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Filter Bar */}
      <Card className="border border-zinc-800 bg-zinc-900/60 shadow-md">
        <CardContent className="py-4 px-5">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
              <Input
                placeholder="Cari nama, ibu kandung, ayah/datuak…"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-zinc-950 border-zinc-800 text-white placeholder:text-zinc-600"
              />
            </div>
            <div className="flex gap-2">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-zinc-500 pointer-events-none z-10" />
                <Select
                  value={filterSuku}
                  onChange={(e) => setFilterSuku(e.target.value)}
                  className="pl-8 pr-3 bg-zinc-950 border-zinc-800 text-zinc-200 text-sm w-40"
                >
                  <option value="">Semua Suku</option>
                  {SUKU_LIST.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </Select>
              </div>
              <Select
                value={filterJorong}
                onChange={(e) => setFilterJorong(e.target.value)}
                className="bg-zinc-950 border-zinc-800 text-zinc-200 text-sm w-44"
              >
                <option value="">Semua Jorong</option>
                {JORONG_LIST.map((j) => (
                  <option key={j} value={j}>{j.replace("Jorong ", "")}</option>
                ))}
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Grid Kartu Warga */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-zinc-400">Memuat data silsilah warga…</p>
        </div>
      ) : members.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 py-16 text-center">
          <Users className="h-10 w-10 text-zinc-600 mx-auto mb-3" />
          <p className="text-sm font-semibold text-zinc-400">Tidak ada warga ditemukan</p>
          <p className="text-xs text-zinc-600 mt-1">Coba ubah kata kunci atau filter pencarian</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {members.map((member) => (
              <Card
                key={member.id}
                className="border border-zinc-800 bg-zinc-900/60 hover:border-amber-500/40 hover:bg-zinc-900 transition-all duration-200 group cursor-pointer shadow-sm"
                onClick={() => handleViewSilsilah(member)}
              >
                <CardContent className="p-4 space-y-3">
                  {/* Avatar + Nama */}
                  <div className="flex items-start gap-3">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold text-sm group-hover:bg-amber-500/20 transition-colors">
                      {member.nama.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="font-semibold text-white text-sm leading-tight truncate group-hover:text-amber-300 transition-colors">
                        {member.nama}
                      </p>
                      <p className="text-xs text-zinc-500 mt-0.5 truncate">
                        {member.jk === "L" ? "Laki-laki" : "Perempuan"}
                        {member.tempatLahir ? ` · ${member.tempatLahir}` : ""}
                      </p>
                    </div>
                  </div>

                  {/* Suku + Jorong */}
                  <div className="flex flex-wrap gap-1.5">
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${getSukuColor(member.suku)}`}>
                      Suku {member.suku}
                    </span>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] border border-zinc-700 bg-zinc-800/60 text-zinc-400">
                      {member.jorong.replace("Jorong ", "")}
                    </span>
                  </div>

                  {/* Garis Silsilah */}
                  <div className="border-t border-zinc-800/80 pt-3 space-y-1.5 text-xs">
                    <div className="flex items-start gap-2">
                      <span className="text-amber-400 shrink-0 mt-0.5">♀</span>
                      <div className="min-w-0">
                        <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Ibu Kandung</span>
                        <span className="text-amber-300 font-medium truncate block">{member.ibuKandung || "—"}</span>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-zinc-400 shrink-0 mt-0.5">♂</span>
                      <div className="min-w-0">
                        <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Ayah / Datuak</span>
                        <span className="text-zinc-300 font-medium truncate block">{member.ayahDatuak || "—"}</span>
                      </div>
                    </div>
                  </div>

                  {/* CTA */}
                  <Button
                    size="sm"
                    variant="outline"
                    className="w-full text-xs border-amber-500/20 text-amber-400 hover:bg-amber-500/10 gap-1.5 mt-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleViewSilsilah(member);
                    }}
                  >
                    <GitFork className="h-3.5 w-3.5" />
                    Lihat Bagan Tarombo
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-xs text-zinc-500">
                Halaman {page} dari {totalPages} · {total} warga
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 gap-1 text-xs"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Sebelumnya
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page >= totalPages}
                  onClick={() => setPage((p) => p + 1)}
                  className="border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 gap-1 text-xs"
                >
                  Berikutnya
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Dialog: Bagan Tarombo Detail */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-white flex items-center gap-2 text-base">
              <GitFork className="h-5 w-5 text-amber-400" />
              Bagan Tarombo — {selected?.nama}
            </DialogTitle>
            <DialogDescription className="text-zinc-400 text-xs">
              Silsilah matrilineal Minangkabau berdasarkan garis Ibu Kandung (Mandeh).
              Suku diwariskan dari ibu kepada anak.
            </DialogDescription>
          </DialogHeader>

          {selected && (
            <div className="space-y-4 pt-2">
              {/* Info ringkas warga */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 text-xs">
                <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                  <p className="text-zinc-500 uppercase tracking-wider text-[10px]">Nama Lengkap</p>
                  <p className="font-semibold text-white mt-1">{selected.nama}</p>
                </div>
                <div className="rounded-xl bg-zinc-950 border border-amber-500/30 p-3">
                  <p className="text-amber-400/80 uppercase tracking-wider text-[10px]">Suku (Matrilineal)</p>
                  <p className="font-bold text-amber-300 mt-1">Suku {selected.suku}</p>
                </div>
                <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                  <p className="text-zinc-500 uppercase tracking-wider text-[10px]">Jorong Asal</p>
                  <p className="font-semibold text-zinc-200 mt-1">{selected.jorong}</p>
                </div>
                <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                  <p className="text-zinc-500 uppercase tracking-wider text-[10px]">Jenis Kelamin</p>
                  <p className="font-semibold text-zinc-200 mt-1">
                    {selected.jk === "L" ? "Laki-laki" : "Perempuan"}
                  </p>
                </div>
                {selected.tempatLahir && (
                  <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                    <p className="text-zinc-500 uppercase tracking-wider text-[10px]">Tempat Lahir</p>
                    <p className="font-semibold text-zinc-200 mt-1">{selected.tempatLahir}</p>
                  </div>
                )}
                {selected.tglLahir && (
                  <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                    <p className="text-zinc-500 uppercase tracking-wider text-[10px]">Tanggal Lahir</p>
                    <p className="font-semibold text-zinc-200 mt-1">{formatTglLahir(selected.tglLahir)}</p>
                  </div>
                )}
                {selected.pekerjaan && (
                  <div className="rounded-xl bg-zinc-950 border border-zinc-800 p-3">
                    <p className="text-zinc-500 uppercase tracking-wider text-[10px]">Pekerjaan</p>
                    <p className="font-semibold text-zinc-200 mt-1">{selected.pekerjaan}</p>
                  </div>
                )}
              </div>

              {/* Bagan Tarombo */}
              <div className="border-t border-zinc-800 pt-4 overflow-x-auto">
                <GenealogyTreeSimple
                  user={{
                    nama: selected.nama,
                    suku: selected.suku,
                    ibuKandung: selected.ibuKandung,
                    ayahDatuak: selected.ayahDatuak,
                    jorong: selected.jorong,
                    nik: "",
                  }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

