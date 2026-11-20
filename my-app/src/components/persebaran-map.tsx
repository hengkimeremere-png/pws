"use client";

import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Users,
  Navigation,
  Globe2,
  ExternalLink,
  Loader2,
  RefreshCw,
  Compass,
} from "lucide-react";

interface WargaPoint {
  id: string;
  nama: string;
  suku: string;
  jorong: string;
  alamatDomisili: string;
  latitude: number;
  longitude: number;
  ibuKandung: string;
  ayahDatuak: string;
}

const SUKU_LIST = [
  "Chaniago", "Piliang", "Bodi Caniago", "Koto", "Sikumbang",
  "Guci", "Mandahiliang", "Pitopang", "Melayu", "Jambak",
];

export function PersebaranMap() {
  const [points, setPoints] = useState<WargaPoint[]>([]);
  const [stats, setStats] = useState({ terpetakan: 0, totalWarga: 0 });
  const [loading, setLoading] = useState(true);
  const [selectedSuku, setSelectedSuku] = useState("");
  const [selectedWarga, setSelectedWarga] = useState<WargaPoint | null>(null);

  const fetchPoints = async () => {
    setLoading(true);
    try {
      const url = selectedSuku ? `/api/persebaran?suku=${selectedSuku}` : `/api/persebaran`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setPoints(data.warga || []);
        setStats(data.stats || { terpetakan: 0, totalWarga: 0 });
        if (data.warga?.length > 0 && !selectedWarga) {
          setSelectedWarga(data.warga[0]);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPoints();
  }, [selectedSuku]);

  // Titik tengah default (Indonesia / Sumbar)
  const activeLat = selectedWarga ? selectedWarga.latitude : -0.9471;
  const activeLng = selectedWarga ? selectedWarga.longitude : 100.4172;

  return (
    <div className="space-y-6">
      {/* Header Info & Filter */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-amber-400" />
            <span>Peta Persebaran Warga Perantau (WebGIS Sungayang)</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Pemetaan titik domisili dunsanak Nagari Sungayang di seluruh nusantara.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Select
            value={selectedSuku}
            onChange={(e) => setSelectedSuku(e.target.value)}
            className="bg-zinc-900 border-zinc-800 text-zinc-200 text-xs w-44"
          >
            <option value="">Semua Suku</option>
            {SUKU_LIST.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </Select>
          <Button
            size="sm"
            variant="outline"
            onClick={fetchPoints}
            className="border-zinc-800 bg-zinc-900 text-xs gap-1.5"
          >
            <RefreshCw className={`h-3.5 w-3.5 text-amber-400 ${loading ? "animate-spin" : ""}`} />
            <span>Segarkan</span>
          </Button>
        </div>
      </div>

      {/* Statistik Ringkas */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Warga Terpetakan</p>
          <p className="text-xl font-bold text-amber-400 mt-0.5">{stats.terpetakan} Titik</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Total Warga Terdaftar</p>
          <p className="text-xl font-bold text-white mt-0.5">{stats.totalWarga} Orang</p>
        </div>
        <div className="rounded-xl border border-zinc-800 bg-zinc-900/60 p-3.5 col-span-2 sm:col-span-1">
          <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Filter Aktif</p>
          <p className="text-xs font-semibold text-amber-300 mt-1 truncate">
            {selectedSuku ? `Suku ${selectedSuku}` : "Seluruh Suku"} ({points.length} warga)
          </p>
        </div>
      </div>

      {/* Grid: Peta Interaktif + List Warga */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Peta Interaktif Embed */}
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-zinc-800 bg-zinc-950 relative h-96 shadow-lg">
          {loading ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-zinc-500">
              <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
              <p className="text-xs">Memuat peta GIS...</p>
            </div>
          ) : points.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center gap-2 text-center p-6 text-zinc-500">
              <MapPin className="h-8 w-8 text-zinc-600 mb-1" />
              <p className="text-sm font-semibold text-zinc-300">Belum Ada Titik Koordinat</p>
              <p className="text-xs max-w-sm">
                Warga dapat menentukan koordinat titik peta domisili melalui tombol Edit Profil & Peta.
              </p>
            </div>
          ) : (
            <>
              <iframe
                title="Peta Persebaran Warga PWS"
                width="100%"
                height="100%"
                frameBorder="0"
                scrolling="no"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${activeLng - 0.05}%2C${activeLat - 0.05}%2C${activeLng + 0.05}%2C${activeLat + 0.05}&layer=mapnik&marker=${activeLat}%2C${activeLng}`}
                className="w-full h-full filter contrast-125 brightness-95"
              />
              {selectedWarga && (
                <div className="absolute bottom-3 left-3 right-3 bg-zinc-950/90 backdrop-blur-md border border-amber-500/30 rounded-xl p-3 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-amber-400 font-semibold block">Titik Terpilih</span>
                    <span className="font-bold text-white text-sm">{selectedWarga.nama}</span>
                    <span className="text-zinc-400 block truncate max-w-xs">{selectedWarga.alamatDomisili}</span>
                  </div>
                  <a
                    href={`https://www.google.com/maps?q=${selectedWarga.latitude},${selectedWarga.longitude}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button size="sm" className="bg-amber-500 hover:bg-amber-600 text-zinc-950 text-xs font-semibold gap-1">
                      <ExternalLink className="h-3 w-3" />
                      <span>Rute Maps</span>
                    </Button>
                  </a>
                </div>
              )}
            </>
          )}
        </div>

        {/* List Titik Warga Terpetakan */}
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 flex flex-col h-96">
          <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
            <span className="text-xs font-semibold text-white flex items-center gap-1.5">
              <Compass className="h-4 w-4 text-amber-400" />
              <span>Daftar Domisili Warga</span>
            </span>
            <span className="text-[11px] font-mono text-zinc-500">{points.length} titik</span>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-zinc-800/60 pt-2 pr-1 space-y-1">
            {points.map((w) => {
              const isSelected = selectedWarga?.id === w.id;
              return (
                <button
                  key={w.id}
                  onClick={() => setSelectedWarga(w)}
                  className={`w-full text-left p-2.5 rounded-xl transition-colors flex items-start gap-2.5 ${
                    isSelected ? "bg-amber-500/15 border border-amber-500/40" : "hover:bg-zinc-800/60"
                  }`}
                >
                  <MapPin className={`h-4 w-4 mt-0.5 shrink-0 ${isSelected ? "text-amber-400" : "text-zinc-500"}`} />
                  <div className="min-w-0 flex-1">
                    <p className={`font-semibold text-xs leading-tight truncate ${isSelected ? "text-amber-300" : "text-zinc-200"}`}>
                      {w.nama}
                    </p>
                    <p className="text-[10px] text-zinc-400 truncate mt-0.5">Suku {w.suku} • {w.jorong.replace("Jorong ", "")}</p>
                    <p className="text-[10px] text-zinc-500 truncate mt-0.5">{w.alamatDomisili}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
