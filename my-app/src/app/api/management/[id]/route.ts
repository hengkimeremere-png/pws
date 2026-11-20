export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { jabatan, level, nama, suku, jorong, ibuKandung, ayahDatuak, noHp, periode } = body;

    if (!jabatan || !level || !nama || !suku || !jorong || !ibuKandung || !ayahDatuak || !noHp || !periode) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    if (level < 1 || level > 4) {
      return NextResponse.json({ error: "Level harus antara 1-4" }, { status: 400 });
    }

    const matrix = await prisma.managementMatrix.update({
      where: { id: parseInt(id) },
      data: {
        jabatan,
        level,
        nama,
        suku,
        jorong,
        ibuKandung,
        ayahDatuak,
        noHp,
        periode,
        urutan: body.urutan !== undefined ? parseInt(body.urutan) : 0,
      },
    });

    return NextResponse.json({ matrix });
  } catch (error) {
    console.error("Update management matrix error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.managementMatrix.delete({
      where: { id: parseInt(id) },
    });

    return NextResponse.json({ message: "Data berhasil dihapus" });
  } catch (error) {
    console.error("Delete management matrix error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}