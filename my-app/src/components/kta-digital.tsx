"use client";

import { useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GonjongIcon, MarawaStrip } from "@/components/minang-icons";
import {
  Download,
  CreditCard,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Printer,
  Sparkles,
} from "lucide-react";

interface KtaCardProps {
  user: {
    nik: string;
    nama: string;
    suku: string;
    jorong: string;
    jk: "L" | "P";
    ibuKandung: string;
    ayahDatuak: string;
    alamatDomisili: string;
    createdAt: Date | string;
  };
}

export function KtaDigital({ user }: KtaCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  const formattedTglDaftar = new Date(user.createdAt).toLocaleDateString("id-ID", {
    month: "short",
    year: "numeric",
  });

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-amber-400" />
            <span>Kartu Tanda Anggota (KTA) Digital PWS</span>
          </h3>
          <p className="text-xs text-zinc-400">
            Identitas resmi warga persatuan berhias motif dan identitas adat Minangkabau.
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handlePrint}
            variant="outline"
            size="sm"
            className="gap-1.5 border-zinc-700 bg-zinc-900 text-zinc-200 hover:bg-zinc-800 text-xs"
          >
            <Printer className="h-4 w-4 text-amber-400" />
            <span>Cetak Kartu</span>
          </Button>
        </div>
      </div>

      {/* Kartu KTA Visual */}
      <div className="flex justify-center py-4">
        <div
          ref={cardRef}
          className="relative w-full max-w-md overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-gradient-to-br from-zinc-950 via-zinc-900 to-amber-950/50 p-6 text-white shadow-2xl shadow-amber-500/10"
          style={{ minHeight: "260px" }}
        >
          {/* Marawa Strip Header */}
          <div className="absolute top-0 left-0 right-0">
            <MarawaStrip className="h-2 w-full" />
          </div>

          {/* Background Watermark Gonjong */}
          <div className="absolute right-[-20px] bottom-[-20px] opacity-10 pointer-events-none">
            <GonjongIcon className="h-64 w-64 text-amber-400" />
          </div>

          {/* Header Card */}
          <div className="flex items-center justify-between pb-4 border-b border-zinc-800/80">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400 shadow-sm">
                <GonjongIcon className="h-6 w-6 text-amber-400" />
              </div>
              <div>
                <p className="font-extrabold text-sm tracking-tight text-white leading-tight">
                  PERSATUAN WARGA SUNGAYANG
                </p>
                <p className="text-[10px] text-amber-400 font-medium tracking-wide">
                  SIWAS • KARTU TANDA ANGGOTA DIGITAL
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-mono">ANGGOTA SEJAK</span>
              <span className="text-xs font-semibold text-zinc-300 font-mono">{formattedTglDaftar}</span>
            </div>
          </div>

          {/* Body Card */}
          <div className="py-4 grid grid-cols-3 gap-3 items-center">
            {/* Foto / Inisial Avatar */}
            <div className="col-span-1 flex flex-col items-center text-center">
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500/20 to-red-600/20 border-2 border-amber-500/40 text-amber-300 shadow-inner">
                <span className="text-2xl font-black">{user.nama.charAt(0).toUpperCase()}</span>
                <div className="absolute -bottom-1.5 -right-1.5 bg-amber-500 text-zinc-950 p-0.5 rounded-full">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                </div>
              </div>
              <span className="mt-2 text-[10px] font-semibold text-zinc-400">
                {user.jk === "L" ? "Laki-laki" : "Perempuan"}
              </span>
            </div>

            {/* Biodata */}
            <div className="col-span-2 space-y-2">
              <div>
                <p className="text-[10px] text-zinc-500 uppercase tracking-wider font-medium">Nama Anggota</p>
                <p className="font-bold text-sm text-white truncate">{user.nama}</p>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <p className="text-[9px] text-amber-400 uppercase tracking-wider font-semibold">Payung Suku</p>
                  <p className="font-bold text-amber-300">Suku {user.suku}</p>
                </div>
                <div>
                  <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-semibold">Jorong Asal</p>
                  <p className="font-medium text-zinc-200 truncate">{user.jorong.replace("Jorong ", "")}</p>
                </div>
              </div>

              <div>
                <p className="text-[9px] text-zinc-500 uppercase tracking-wider font-medium">Mandeh (Ibu Kandung)</p>
                <p className="text-xs text-amber-200/90 font-medium truncate">{user.ibuKandung || "-"}</p>
              </div>
            </div>
          </div>

          {/* Footer Card */}
          <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
            <div>
              <p className="text-[9px] text-zinc-500 uppercase tracking-widest font-mono">NOMOR ANGGOTA / NIK</p>
              <p className="font-mono font-bold text-xs text-amber-400 tracking-wider">
                {user.nik}
              </p>
            </div>

            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
              <QrCode className="h-4 w-4 text-amber-400" />
              <span className="text-[10px] font-mono font-semibold text-zinc-300">TERVERIFIKASI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Info Tambahan */}
      <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 text-xs text-zinc-400 flex items-start gap-3">
        <ShieldCheck className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-zinc-200 mb-0.5">Dokumen Keanggotaan Terpadu</p>
          <p>
            KTA Digital ini merupakan tanda pengenal sah keanggotaan warga Nagari Sungayang di perantauan.
            Gunakan fitur cetak peramban (*browser print*) untuk mencetak atau menyimpannya sebagai format PDF.
          </p>
        </div>
      </div>
    </div>
  );
}
