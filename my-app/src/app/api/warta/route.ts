export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/warta - Ambil warta & pengumuman
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const kategori = searchParams.get("kategori");

    const where: any = {};
    if (kategori && kategori !== "SEMUA") {
      where.kategori = kategori;
    }

    let wartaList = await prisma.warta.findMany({
      where,
      orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      take: 30,
    });

    // Jika database warta masih kosong, sediakan warta pembuka / default
    if (wartaList.length === 0 && !kategori) {
      const initialWarta = [
        {
          judul: "Selamat Datang di Portal Resmi SIWAS Sungayang",
          kategori: "PENGUMUMAN" as const,
          ringkasan: "Peluncuran sistem informasi dan pendataan warga perantauan Nagari Sungayang.",
          konten: "Assalamu'alaikum Wr. Wb. Seluruh dunsanak dan warga Persatuan Warga Sungayang (PWS). Mari bersama-sama melengkapi biodata kependudukan, payung suku matrilineal, serta titik domisili di perantauan untuk mempererat silaturahmi ranah dan rantau.",
          penulisNama: "Pimpinan Pusat PWS",
          isPinned: true,
        },
        {
          judul: "Pembaruan Bagan Organisasi & Struktur Kepengurusan PWS",
          kategori: "BERITA" as const,
          ringkasan: "Struktur kepengurusan periode terkini telah diperbarui pada sistem.",
          konten: "Bagan struktur kepengurusan dari Pimpinan Pusat, Bidang Inti, hingga Koordinator Jorong kini dapat diakses secara transparan melalui tab Pengurus PWS.",
          penulisNama: "Sekretariat PWS",
          isPinned: false,
        },
        {
          judul: "Agenda Silaturahmi Akbar & Musyawarah Warga Perantau",
          kategori: "KEGIATAN" as const,
          ringkasan: "Persiapan pertemuan tahunan warga Sungayang di perantauan.",
          konten: "Diharapkan partisipasi seluruh koordinator jorong dan warga untuk menghadiri temu silaturahmi akbar tahunan. Rincian tanggal dan lokasi akan diumumkan segera.",
          penulisNama: "Bidang Sosial & Budaya",
          isPinned: false,
        },
      ];

      for (const item of initialWarta) {
        await prisma.warta.create({ data: item });
      }

      wartaList = await prisma.warta.findMany({
        orderBy: [{ isPinned: "desc" }, { createdAt: "desc" }],
      });
    }

    return NextResponse.json({ warta: wartaList });
  } catch (error) {
    console.error("GET Warta error:", error);
    return NextResponse.json({ error: "Gagal mengambil warta" }, { status: 500 });
  }
}

// POST /api/warta - Tambah warta (Hanya ADMIN)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { judul, kategori, ringkasan, konten, isPinned } = body;

    if (!judul || !konten) {
      return NextResponse.json({ error: "Judul dan konten wajib diisi" }, { status: 400 });
    }

    const created = await prisma.warta.create({
      data: {
        judul,
        kategori: kategori || "PENGUMUMAN",
        ringkasan: ringkasan || null,
        konten,
        isPinned: Boolean(isPinned),
        penulisNama: (session.user as any).nama || "Pengurus PWS",
        penulisId: (session.user as any).id,
      },
    });

    return NextResponse.json({ warta: created }, { status: 201 });
  } catch (error) {
    console.error("POST Warta error:", error);
    return NextResponse.json({ error: "Gagal membuat warta" }, { status: 500 });
  }
}
