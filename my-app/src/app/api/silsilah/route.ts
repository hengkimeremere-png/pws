export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET /api/silsilah — semua member yang sudah login bisa melihat silsilah warga
export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search") || "";
    const suku = searchParams.get("suku") || "";
    const jorong = searchParams.get("jorong") || "";
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "24");
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};

    if (search) {
      where.OR = [
        { nama: { contains: search, mode: "insensitive" } },
        { ibuKandung: { contains: search, mode: "insensitive" } },
        { ayahDatuak: { contains: search, mode: "insensitive" } },
      ];
    }
    if (suku) where.suku = suku;
    if (jorong) where.jorong = jorong;

    const [members, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: [{ suku: "asc" }, { nama: "asc" }],
        select: {
          id: true,
          nama: true,
          suku: true,
          jorong: true,
          ibuKandung: true,
          ayahDatuak: true,
          jk: true,
          tempatLahir: true,
          tglLahir: true,
          pekerjaan: true,
          // Privasi: NIK & noHp tidak di-expose ke sesama member
        },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      members,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Silsilah API error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

