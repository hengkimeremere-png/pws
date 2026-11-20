export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/persebaran - Data titik koordinat warga perantau
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const suku = searchParams.get("suku");
    const jorong = searchParams.get("jorong");

    const where: any = {
      latitude: { not: null },
      longitude: { not: null },
    };

    if (suku) where.suku = suku;
    if (jorong) where.jorong = jorong;

    const wargaMap = await prisma.user.findMany({
      where,
      select: {
        id: true,
        nama: true,
        suku: true,
        jorong: true,
        alamatDomisili: true,
        latitude: true,
        longitude: true,
        ibuKandung: true,
        ayahDatuak: true,
      },
    });

    const totalTerpetakan = await prisma.user.count({
      where: {
        latitude: { not: null },
        longitude: { not: null },
      },
    });

    const totalWarga = await prisma.user.count();

    return NextResponse.json({
      warga: wargaMap,
      stats: {
        terpetakan: totalTerpetakan,
        totalWarga,
      },
    });
  } catch (error) {
    console.error("GET Persebaran error:", error);
    return NextResponse.json({ error: "Gagal mengambil data peta persebaran" }, { status: 500 });
  }
}
