"use client";

import { GonjongIcon, MarawaStrip } from "@/components/minang-icons";
import { Sparkles, Heart, Shield, Award } from "lucide-react";

interface UserData {
  nama: string;
  suku: string;
  ibuKandung: string;
  ayahDatuak: string;
  jorong: string;
  nik: string;
}

export function GenealogyTreeSimple({ user }: { user: UserData }) {
  const svgWidth = 760;
  const svgHeight = 480;

  const fatherX = svgWidth * 0.22;
  const motherX = svgWidth * 0.78;
  const parentY = 50;
  const childX = svgWidth / 2;
  const childY = 240;
  const sukuX = svgWidth / 2;
  const sukuY = 380;

  return (
    <div className="flex flex-col items-center">
      {/* Adat Explanation Ribbon */}
      <div className="mb-6 flex items-center gap-2 rounded-full border border-amber-500/30 bg-amber-950/20 px-4 py-1 text-xs text-amber-300">
        <Sparkles className="h-3.5 w-3.5 text-amber-400" />
        <span>Garis Suku Minangkabau: Diturunkan Melalui Jalur Ibu Kandung (Matrilineal)</span>
      </div>

      <div
        className="relative overflow-visible"
        style={{ width: svgWidth, height: svgHeight, maxWidth: "100%" }}
      >
        <svg
          width={svgWidth}
          height={svgHeight}
          className="block w-full h-auto"
          viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        >
          <defs>
            <marker
              id="goldArrow"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L0,7 L9,3.5 Z" fill="#f59e0b" />
            </marker>
            <marker
              id="silverArrow"
              markerWidth="10"
              markerHeight="7"
              refX="9"
              refY="3.5"
              orient="auto"
            >
              <path d="M0,0 L0,7 L9,3.5 Z" fill="#71717a" />
            </marker>
          </defs>

          {/* Pernikahan Line between Ayah and Ibu */}
          <line
            x1={fatherX + 110}
            y1={parentY + 70}
            x2={motherX - 110}
            y2={parentY + 70}
            stroke="#52525b"
            strokeWidth={2}
            strokeDasharray="6,4"
          />

          {/* Connection Ayah to Anak (Garis Patrilineal / Urang Sumando) */}
          <path
            d={`M${fatherX + 80} ${parentY + 120} Q${childX - 60} ${parentY + 170} ${childX - 40} ${childY - 30}`}
            stroke="#71717a"
            strokeWidth={2}
            strokeDasharray="4,4"
            fill="none"
            markerEnd="url(#silverArrow)"
          />

          {/* Strong Golden Line from Ibu to Anak (Garis Matrilineal Sakato Mandeh) */}
          <path
            d={`M${motherX - 80} ${parentY + 120} Q${childX + 60} ${parentY + 170} ${childX + 40} ${childY - 30}`}
            stroke="#f59e0b"
            strokeWidth={3}
            fill="none"
            markerEnd="url(#goldArrow)"
          />

          {/* Line from Anak to Suku Warisan */}
          <line
            x1={childX}
            y1={childY + 80}
            x2={sukuX}
            y2={sukuY - 30}
            stroke="#f59e0b"
            strokeWidth={2.5}
            markerEnd="url(#goldArrow)"
          />
        </svg>

        {/* AYAH / DATUAK CARD */}
        <div
          className="absolute"
          style={{ left: fatherX, top: parentY, transform: "translateX(-50%)" }}
        >
          <div className="w-64 rounded-xl border border-zinc-800 bg-zinc-900/90 shadow-xl overflow-hidden backdrop-blur-md">
            <div className="bg-zinc-800/80 px-3 py-1.5 flex items-center justify-between border-b border-zinc-700/60">
              <span className="text-[11px] font-semibold text-zinc-300 flex items-center gap-1.5">
                <Shield className="h-3.5 w-3.5 text-zinc-400" />
                Ayah / Datuak (Urang Sumando)
              </span>
            </div>
            <div className="p-3.5 text-center">
              <p className="font-bold text-sm text-white">{user.ayahDatuak}</p>
              <p className="text-[11px] text-zinc-400 mt-1">Tokoh Kaum / Penjaga Adat</p>
            </div>
          </div>
        </div>

        {/* IBU KANDUNG (MANDEH) CARD */}
        <div
          className="absolute"
          style={{ left: motherX, top: parentY, transform: "translateX(-50%)" }}
        >
          <div className="w-64 rounded-xl border border-amber-500/40 bg-zinc-900/90 shadow-xl overflow-hidden backdrop-blur-md ring-1 ring-amber-500/20">
            <MarawaStrip className="h-1.5 w-full" />
            <div className="bg-amber-950/30 px-3 py-1.5 flex items-center justify-between border-b border-amber-500/20">
              <span className="text-[11px] font-semibold text-amber-300 flex items-center gap-1.5">
                <Heart className="h-3.5 w-3.5 text-amber-400" />
                Ibu Kandung (Mandeh)
              </span>
              <span className="text-[10px] bg-amber-500/20 text-amber-300 px-1.5 py-0.5 rounded font-mono">
                Matrilineal
              </span>
            </div>
            <div className="p-3.5 text-center">
              <p className="font-bold text-sm text-amber-200">{user.ibuKandung}</p>
              <div className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-amber-400/10 px-2.5 py-0.5 text-xs font-semibold text-amber-300 border border-amber-400/20">
                <span>Pewaris Suku: {user.suku}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ANAK / WARGA CARD */}
        <div
          className="absolute z-10"
          style={{ left: childX, top: childY, transform: "translateX(-50%)" }}
        >
          <div className="w-80 rounded-2xl border-2 border-amber-500 bg-gradient-to-b from-zinc-900 to-zinc-950 p-4 shadow-2xl text-center backdrop-blur-md">
            <div className="flex justify-center mb-2">
              <div className="h-9 w-9 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center">
                <GonjongIcon className="h-5 w-5" />
              </div>
            </div>
            <p className="text-xs uppercase font-semibold tracking-wider text-amber-400">
              Anak / Anggota Warga
            </p>
            <h4 className="text-lg font-bold text-white mt-0.5">{user.nama}</h4>
            <div className="mt-2 flex items-center justify-center gap-2">
              <span className="rounded-full bg-gradient-to-r from-amber-500 to-yellow-600 px-3 py-0.5 text-xs font-bold text-zinc-950 shadow-sm">
                Suku {user.suku}
              </span>
              <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-300 border border-zinc-700">
                Jorong {user.jorong}
              </span>
            </div>
            <p className="text-[11px] text-zinc-400 mt-2 font-mono">NIK: {user.nik}</p>
          </div>
        </div>

        {/* SUKU WARISAN BADGE */}
        <div
          className="absolute"
          style={{ left: sukuX, top: sukuY, transform: "translateX(-50%)" }}
        >
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-2 rounded-full border border-amber-500/40 bg-zinc-900/90 px-4 py-1.5 shadow-lg backdrop-blur-md">
              <Award className="h-4 w-4 text-amber-400" />
              <span className="text-xs font-semibold text-zinc-300">
                Payung Panji Adat:{" "}
                <span className="font-bold text-amber-400">Suku {user.suku} Nagari Sungayang</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
