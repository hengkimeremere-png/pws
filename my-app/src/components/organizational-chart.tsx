"use client";

import { useEffect, useState } from "react";
import { GonjongIcon } from "@/components/minang-icons";
import {
  Loader2,
  Phone,
  MapPin,
  Users,
  Crown,
  ChevronDown,
  X,
  Calendar,
  Heart,
  UserCheck,
} from "lucide-react";

export interface ManagementItem {
  id: number;
  jabatan: string;
  level: number;
  nama: string;
  suku: string;
  jorong: string;
  ibuKandung: string;
  ayahDatuak: string;
  noHp: string;
  periode: string;
  urutan?: number;
}

interface OrganizationalChartProps {
  matrix?: ManagementItem[];
  onRefresh?: () => void;
}

// ─── Warna per level ───────────────────────────────────────────────────────
const LEVEL_THEME = {
  1: {
    bg: "bg-gradient-to-b from-amber-500/30 to-amber-950/30",
    border: "border-2 border-amber-500/70",
    ring: "ring-2 ring-amber-500/30",
    title: "text-amber-300",
    badge: "bg-amber-500/20 text-amber-200 border border-amber-500/40",
    dot: "bg-amber-400",
    line: "border-amber-500/50",
    icon: <Crown className="h-3.5 w-3.5 text-amber-400" />,
    section: "text-amber-400",
    sectionBg: "bg-amber-500/5 border-amber-500/20",
  },
  2: {
    bg: "bg-gradient-to-b from-red-900/30 to-zinc-900/60",
    border: "border border-red-700/60",
    ring: "ring-1 ring-red-500/20",
    title: "text-red-300",
    badge: "bg-red-900/50 text-red-200 border border-red-700/40",
    dot: "bg-red-400",
    line: "border-red-700/40",
    icon: <UserCheck className="h-3.5 w-3.5 text-red-400" />,
    section: "text-red-400",
    sectionBg: "bg-red-500/5 border-red-500/20",
  },
  3: {
    bg: "bg-gradient-to-b from-emerald-900/30 to-zinc-900/60",
    border: "border border-emerald-700/50",
    ring: "ring-1 ring-emerald-500/20",
    title: "text-emerald-300",
    badge: "bg-emerald-900/50 text-emerald-200 border border-emerald-700/40",
    dot: "bg-emerald-400",
    line: "border-emerald-700/40",
    icon: <MapPin className="h-3.5 w-3.5 text-emerald-400" />,
    section: "text-emerald-400",
    sectionBg: "bg-emerald-500/5 border-emerald-500/20",
  },
  4: {
    bg: "bg-zinc-900/80",
    border: "border border-zinc-700/60",
    ring: "ring-1 ring-zinc-700/20",
    title: "text-zinc-300",
    badge: "bg-zinc-800 text-zinc-300 border border-zinc-700",
    dot: "bg-zinc-500",
    line: "border-zinc-700/40",
    icon: <Users className="h-3.5 w-3.5 text-zinc-400" />,
    section: "text-zinc-400",
    sectionBg: "bg-zinc-800/30 border-zinc-700/30",
  },
} as const;

const SECTION_META = [
  { level: 1, title: "Pimpinan Pusat PWS", subtitle: "Payung Panji Kebijakan, Hukum & Adat" },
  { level: 2, title: "Bidang Inti & Program Kerja", subtitle: "Kekuatan Penggerak Warga Ranah & Rantau" },
  { level: 3, title: "Koordinator Jorong", subtitle: "Perpanjangan Tangan Tiap Wilayah Jorong" },
  { level: 4, title: "Anggota & Warga Sungayang", subtitle: "Barek Samo Dipikua, Ringan Samo Dijinjiang" },
];

// ─── Kartu Jabatan (hanya tampil nama jabatan) ─────────────────────────────
function JabatanCard({
  item,
  onClick,
}: {
  item: ManagementItem;
  onClick: (item: ManagementItem) => void;
}) {
  const theme = LEVEL_THEME[item.level as keyof typeof LEVEL_THEME] ?? LEVEL_THEME[4];
  return (
    <button
      onClick={() => onClick(item)}
      className={`
        group relative flex flex-col items-center gap-1.5 px-4 py-3
        rounded-xl ${theme.bg} ${theme.border} ${theme.ring}
        hover:scale-105 hover:brightness-110 transition-all duration-200
        cursor-pointer text-center min-w-[140px] max-w-[180px] shadow-md
      `}
    >
      {/* Icon level */}
      <div className="flex items-center justify-center gap-1.5 mb-0.5">
        {theme.icon}
      </div>
      {/* Nama Jabatan SAJA */}
      <p className={`font-bold text-xs leading-tight ${theme.title}`}>
        {item.jabatan}
      </p>
      {/* Nama Orang */}
      <p className="text-[11px] text-white font-medium leading-tight">
        {item.nama}
      </p>
      {/* Hint klik */}
      <ChevronDown className="h-3 w-3 text-zinc-600 group-hover:text-zinc-400 transition-colors mt-0.5" />
    </button>
  );
}

// ─── Modal Detail Pengurus ─────────────────────────────────────────────────
function DetailModal({
  item,
  onClose,
}: {
  item: ManagementItem;
  onClose: () => void;
}) {
  const theme = LEVEL_THEME[item.level as keyof typeof LEVEL_THEME] ?? LEVEL_THEME[4];
  const sec = SECTION_META.find((s) => s.level === item.level);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

      {/* Modal */}
      <div
        className={`relative z-10 w-full max-w-sm rounded-2xl ${theme.bg} ${theme.border} shadow-2xl p-5 text-left`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-zinc-500 hover:text-white transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="flex items-start gap-3 mb-4">
          <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${theme.sectionBg} border`}>
            {theme.icon}
          </div>
          <div>
            <p className={`text-xs font-semibold uppercase tracking-wider ${theme.section} mb-0.5`}>
              {sec?.title}
            </p>
            <h3 className={`font-bold text-sm ${theme.title}`}>{item.jabatan}</h3>
          </div>
        </div>

        {/* Nama utama */}
        <div className={`rounded-xl ${theme.sectionBg} border p-4 mb-4 text-center`}>
          <div className={`inline-flex items-center justify-center h-12 w-12 rounded-2xl bg-zinc-900 border ${theme.border} mb-2 mx-auto`}>
            <span className={`text-lg font-bold ${theme.title}`}>
              {item.nama.charAt(0)}
            </span>
          </div>
          <p className="font-bold text-white text-base">{item.nama}</p>
          <div className="flex flex-wrap gap-1.5 justify-center mt-2">
            <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${theme.badge}`}>
              Suku {item.suku}
            </span>
            <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700">
              {item.jorong}
            </span>
          </div>
        </div>

        {/* Rincian */}
        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-zinc-300">
            <Heart className="h-3.5 w-3.5 text-amber-400 shrink-0" />
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Ibu Kandung (Mandeh)</span>
              <span className="font-medium text-amber-300">{item.ibuKandung || "—"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300">
            <UserCheck className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Ayah / Datuak</span>
              <span className="font-medium">{item.ayahDatuak || "—"}</span>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300">
            <Phone className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Nomor HP / WhatsApp</span>
              <a
                href={`https://wa.me/${item.noHp?.replace(/\D/g, "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-emerald-400 hover:underline"
              >
                {item.noHp || "—"}
              </a>
            </div>
          </div>
          <div className="flex items-center gap-2.5 text-zinc-300">
            <Calendar className="h-3.5 w-3.5 text-zinc-400 shrink-0" />
            <div>
              <span className="text-zinc-500 block text-[10px] uppercase tracking-wider">Masa Bakti / Periode</span>
              <span className="font-medium">{item.periode || "—"}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Komponen Utama ────────────────────────────────────────────────────────
export function OrganizationalChart({ matrix: propMatrix }: OrganizationalChartProps) {
  const [matrix, setMatrix] = useState<ManagementItem[]>(propMatrix || []);
  const [loading, setLoading] = useState(!propMatrix);
  const [selected, setSelected] = useState<ManagementItem | null>(null);

  useEffect(() => {
    if (propMatrix) {
      setMatrix(propMatrix);
      setLoading(false);
      return;
    }
    const fetchData = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/management");
        if (res.ok) {
          const data = await res.json();
          setMatrix(data.matrix || []);
        }
      } catch (err) {
        console.error("Gagal memuat bagan struktur organisasi:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [propMatrix]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-amber-400" />
        <p className="text-sm text-zinc-400">Memuat bagan struktur organisasi…</p>
      </div>
    );
  }

  if (matrix.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-center max-w-xs mx-auto gap-4">
        <div className="h-14 w-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center">
          <GonjongIcon className="h-8 w-8 text-amber-400" />
        </div>
        <div>
          <h4 className="text-base font-bold text-white">Bagan Belum Tersedia</h4>
          <p className="text-xs text-zinc-500 mt-1">
            Admin dapat memuat struktur awal melalui tab Matriks Pengurus.
          </p>
        </div>
      </div>
    );
  }

  const byLevel = (lvl: number) =>
    matrix.filter((m) => m.level === lvl).sort((a, b) => (a.urutan ?? 0) - (b.urutan ?? 0));

  const level1 = byLevel(1);
  const level2 = byLevel(2);
  const level3 = byLevel(3);
  const level4 = byLevel(4);

  const renderConnector = (color: string) => (
    <div className="flex flex-col items-center my-1">
      <div className={`w-px h-6 ${color}`} />
      <div className={`w-2 h-2 rounded-full ${color.replace("bg-", "bg-")}`} />
    </div>
  );

  return (
    <>
      {/* ── Bagan Hierarki ── */}
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex flex-col items-center gap-0 min-w-max mx-auto">

          {/* ── LEVEL 1: Pimpinan Pusat ── */}
          {level1.length > 0 && (
            <>
              <SectionLabel level={1} />
              <div className="flex flex-wrap gap-3 justify-center">
                {level1.map((item) => (
                  <JabatanCard key={item.id} item={item} onClick={setSelected} />
                ))}
              </div>
              {/* Garis turun ke Level 2 */}
              {level2.length > 0 && (
                <div className="flex flex-col items-center my-2">
                  <div className="w-px h-8 bg-gradient-to-b from-amber-500/60 to-red-700/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm shadow-amber-400/40" />
                </div>
              )}
            </>
          )}

          {/* ── LEVEL 2: Bidang Inti ── */}
          {level2.length > 0 && (
            <>
              <SectionLabel level={2} />
              {/* Garis horizontal yang menghubungkan */}
              <div className="relative flex items-start gap-3 justify-center flex-wrap">
                {level2.map((item) => (
                  <JabatanCard key={item.id} item={item} onClick={setSelected} />
                ))}
              </div>
              {level3.length > 0 && (
                <div className="flex flex-col items-center my-2">
                  <div className="w-px h-8 bg-gradient-to-b from-red-700/50 to-emerald-700/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-red-400 shadow-sm shadow-red-400/30" />
                </div>
              )}
            </>
          )}

          {/* ── LEVEL 3: Koordinator Jorong ── */}
          {level3.length > 0 && (
            <>
              <SectionLabel level={3} />
              <div className="flex flex-wrap gap-3 justify-center">
                {level3.map((item) => (
                  <JabatanCard key={item.id} item={item} onClick={setSelected} />
                ))}
              </div>
              {level4.length > 0 && (
                <div className="flex flex-col items-center my-2">
                  <div className="w-px h-8 bg-gradient-to-b from-emerald-700/50 to-zinc-700/50" />
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-sm shadow-emerald-400/30" />
                </div>
              )}
            </>
          )}

          {/* ── LEVEL 4: Anggota ── */}
          {level4.length > 0 ? (
            <>
              <SectionLabel level={4} />
              <div className="flex flex-wrap gap-3 justify-center">
                {level4.map((item) => (
                  <JabatanCard key={item.id} item={item} onClick={setSelected} />
                ))}
              </div>
            </>
          ) : (
            /* Default Anggota jika level 4 kosong */
            <>
              {(level1.length > 0 || level2.length > 0 || level3.length > 0) && (
                <div className="flex flex-col items-center my-2">
                  <div className="w-px h-8 bg-gradient-to-b from-zinc-700/60 to-zinc-800/30" />
                  <div className="w-2.5 h-2.5 rounded-full bg-zinc-500" />
                </div>
              )}
              <SectionLabel level={4} />
              <div className="flex items-center gap-3 px-6 py-3 rounded-xl border border-zinc-700/50 bg-zinc-900/80 shadow-md">
                <Users className="h-5 w-5 text-zinc-400" />
                <div>
                  <p className="text-xs font-semibold text-zinc-200">Seluruh Warga Terdaftar PWS</p>
                  <p className="text-[11px] text-zinc-500">Ranah & Rantau Nagari Sungayang</p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hint klik */}
      <p className="text-center text-[10px] text-zinc-600 mt-5">
        ✦ Klik kotak jabatan untuk melihat identitas lengkap pengurus ✦
      </p>

      {/* Detail Modal */}
      {selected && (
        <DetailModal item={selected} onClose={() => setSelected(null)} />
      )}
    </>
  );
}

function SectionLabel({ level }: { level: number }) {
  const sec = SECTION_META.find((s) => s.level === level)!;
  const theme = LEVEL_THEME[level as keyof typeof LEVEL_THEME];
  const EMOJI = { 1: "👑", 2: "⚙️", 3: "🌿", 4: "🏘️" } as const;
  return (
    <div className="text-center mb-3 mt-1">
      <div className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full border ${theme.sectionBg} mb-1`}>
        <span>{EMOJI[level as keyof typeof EMOJI]}</span>
        <span className={`text-xs font-bold uppercase tracking-wider ${theme.section}`}>
          {sec.title}
        </span>
      </div>
      <p className="text-[11px] text-zinc-500">{sec.subtitle}</p>
    </div>
  );
}
