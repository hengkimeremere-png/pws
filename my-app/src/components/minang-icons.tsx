import React from "react";

// Gonjong Rumah Gadang Icon
export function GonjongIcon({ className = "h-6 w-6", ...props }: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      {...props}
    >
      {/* Gonjong Roof Curves */}
      <path
        d="M2 28C6 24 9 14 11 6C13 14 16 23 20 25C22 21 23 12 24 4C25 12 26 21 28 25C32 23 35 14 37 6C39 14 42 24 46 28L43 32L38 31V42H10V31L5 32L2 28Z"
        fill="currentColor"
      />
      {/* Rumah Gadang Pillars & Windows */}
      <rect x="14" y="33" width="4" height="6" rx="1" fill="#18181b" />
      <rect x="22" y="33" width="4" height="6" rx="1" fill="#18181b" />
      <rect x="30" y="33" width="4" height="6" rx="1" fill="#18181b" />
      {/* Decorative Ridge Line */}
      <path
        d="M6 28C10 26 18 27 24 26C30 27 38 26 42 28"
        stroke="#f59e0b"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

// Marawa Ribbon (Hitam, Merah, Kuning Emas)
export function MarawaStrip({ className = "h-1.5 w-full" }: { className?: string }) {
  return (
    <div className={`flex ${className} overflow-hidden shadow-sm`}>
      {/* Hitam (Luhak 50 Kota - Ketabahan) */}
      <div className="w-1/3 bg-black" />
      {/* Merah (Luhak Agam - Keberanian) */}
      <div className="w-1/3 bg-red-700" />
      {/* Kuning (Luhak Tanah Datar - Keagungan Adat & Luhak Nan Tuo) */}
      <div className="w-1/3 bg-amber-400" />
    </div>
  );
}

// Minang Pucuk Rebung Decorative Border SVG
export function PucukRebungBorder({ className = "w-full h-4" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 240 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      preserveAspectRatio="none"
    >
      <path
        d="M0 16L10 0L20 16L30 0L40 16L50 0L60 16L70 0L80 16L90 0L100 16L110 0L120 16L130 0L140 16L150 0L160 16L170 0L180 16L190 0L200 16L210 0L220 16L230 0L240 16"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Songket Filigree Corner Ornament
export function SongketCorner({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2 2H20M2 2V20M2 2L18 18M6 2C6 8 8 14 14 14M2 6C8 6 14 8 14 14M14 2L2 14"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

