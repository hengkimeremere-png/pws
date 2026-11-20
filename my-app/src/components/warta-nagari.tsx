"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Bell,
  Calendar,
  Pin,
  Megaphone,
  HeartHandshake,
  HeartPulse,
  Sparkles,
  ChevronRight,
  Loader2,
  RefreshCw,
} from "lucide-react";

interface WartaItem {
  id: number;
  judul: string;
  kategori: "BERITA" | "KEGIATAN" | "DUKA" | "ALEK" | "PENGUMUMAN";
  ringkasan: string | null;
  konten: string;
  penulisNama: string;
  isPinned: boolean;
  createdAt: string;
}

const KATEGORI_CONFIG = {
  PENGUMUMAN: { label: "Pengumuman", color: "bg-blue-500/20 text-blue-300 border-blue-500/30", icon: Megaphone },
  BERITA: { label: "Berita Nagari", color: "bg-amber-500/20 text-amber-300 border-amber-500/30", icon: Sparkles },
  KEGIATAN: { label: "Agenda & Kegiatan", color: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30", icon: Calendar },
  ALEK: { label: "Alek & Syukuran", color: "bg-purple-500/20 text-purple-300 border-purple-500/30", icon: HeartHandshake },
  DUKA: { label: "Kabar Duka Cita", color: "bg-rose-500/20 text-rose-300 border-rose-500/30", icon: HeartPulse },
};

export function WartaNagari() {
  const [warta, setWarta] = useState<WartaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState("SEMUA");
  const [activeItem, setActiveItem] = useState<WartaItem | null>(null);

  const fetchWarta = async () => {
    setLoading(true);
    try {
      const url = selectedFilter !== "SEMUA" ? `/api/warta?kategori=${selectedFilter}` : `/api/warta`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setWarta(data.warta || []);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWarta();
  }, [selectedFilter]);

  return (
    <div className="space-y-6">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Bell className="h-5 w-5 text-amber-400" />
            <span>Warta Nagari & Pengumuman Adat PWS</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Pusat siaran kabar ranah dan rantau: pengumuman, agenda kegiatan, serta kabar alek & duka.
          </p>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={fetchWarta}
          className="border-zinc-800 bg-zinc-900 text-xs gap-1.5 w-fit"
        >
          <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
          <span>Segarkan Warta</span>
        </Button>
      </div>

      {/* Filter Kategori Tabs */}
      <div className="flex flex-wrap gap-2">
        {["SEMUA", "PENGUMUMAN", "BERITA", "KEGIATAN", "ALEK", "DUKA"].map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedFilter(cat)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
              selectedFilter === cat
                ? "bg-amber-500 text-zinc-950 font-bold shadow-md shadow-amber-500/20"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white border border-zinc-800"
            }`}
          >
            {cat === "SEMUA" ? "Semua Warta" : KATEGORI_CONFIG[cat as keyof typeof KATEGORI_CONFIG]?.label || cat}
          </button>
        ))}
      </div>

      {/* Daftar Warta Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
          <p className="text-sm text-zinc-400">Memuat kabar warta...</p>
        </div>
      ) : warta.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/40 py-16 text-center">
          <Bell className="h-8 w-8 text-zinc-600 mx-auto mb-2" />
          <p className="text-sm font-semibold text-zinc-400">Belum ada warta di kategori ini</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {warta.map((item) => {
            const config = KATEGORI_CONFIG[item.kategori] || KATEGORI_CONFIG.PENGUMUMAN;
            const Icon = config.icon;
            const tgl = new Date(item.createdAt).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            });

            return (
              <Card
                key={item.id}
                className={`border bg-zinc-900/60 hover:bg-zinc-900 transition-all cursor-pointer ${
                  item.isPinned ? "border-amber-500/40 shadow-md shadow-amber-500/5" : "border-zinc-800"
                }`}
                onClick={() => setActiveItem(item)}
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${config.color}`}>
                      <Icon className="h-3 w-3" />
                      <span>{config.label}</span>
                    </span>
                    <div className="flex items-center gap-2">
                      {item.isPinned && (
                        <span className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
                          <Pin className="h-3 w-3" />
                          <span>Penting</span>
                        </span>
                      )}
                      <span className="text-[11px] text-zinc-500 font-mono">{tgl}</span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-bold text-white text-base leading-snug group-hover:text-amber-300">
                      {item.judul}
                    </h4>
                    {item.ringkasan && (
                      <p className="text-xs text-zinc-400 mt-1 line-clamp-2">
                        {item.ringkasan}
                      </p>
                    )}
                  </div>

                  <div className="pt-2 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                    <span>Oleh: <strong className="text-zinc-300">{item.penulisNama}</strong></span>
                    <span className="text-amber-400 font-medium inline-flex items-center gap-1">
                      Baca Selengkapnya
                      <ChevronRight className="h-3 w-3" />
                    </span>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Modal Baca Warta Lengkap */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-6 shadow-2xl space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${KATEGORI_CONFIG[activeItem.kategori]?.color}`}>
                {KATEGORI_CONFIG[activeItem.kategori]?.label}
              </span>
              <span className="text-xs text-zinc-500 font-mono">
                {new Date(activeItem.createdAt).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
            </div>

            <div>
              <h3 className="text-lg font-bold text-white leading-tight">{activeItem.judul}</h3>
              <p className="text-xs text-zinc-400 mt-1">Diterbitkan oleh: <span className="text-amber-300 font-semibold">{activeItem.penulisNama}</span></p>
            </div>

            <div className="border-t border-zinc-800 pt-3 text-sm text-zinc-300 leading-relaxed whitespace-pre-line max-h-72 overflow-y-auto pr-2">
              {activeItem.konten}
            </div>

            <div className="pt-2 flex justify-end">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setActiveItem(null)}
                className="border-zinc-800 text-xs"
              >
                Tutup
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
