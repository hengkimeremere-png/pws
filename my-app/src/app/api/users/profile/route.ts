export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        nik: true,
        nama: true,
        tempatLahir: true,
        tglLahir: true,
        jk: true,
        suku: true,
        ibuKandung: true,
        ayahDatuak: true,
        jorong: true,
        pekerjaan: true,
        noHp: true,
        alamatDomisili: true,
        latitude: true,
        longitude: true,
        mapUrl: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    console.error("Get user profile error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = (session.user as any).id;
    const body = await request.json();

    const {
      nama,
      tempatLahir,
      tglLahir,
      jk,
      suku,
      ibuKandung,
      ayahDatuak,
      jorong,
      pekerjaan,
      noHp,
      alamatDomisili,
      latitude,
      longitude,
      mapUrl,
    } = body;

    if (!nama || !suku || !jorong) {
      return NextResponse.json(
        { error: "Nama, Suku, dan Jorong wajib diisi" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        nama,
        tempatLahir: tempatLahir || null,
        tglLahir: tglLahir ? new Date(tglLahir) : null,
        jk: (jk as "L" | "P") || "L",
        suku,
        ibuKandung: ibuKandung || "Belum diisi",
        ayahDatuak: ayahDatuak || "Belum diisi",
        jorong,
        pekerjaan: pekerjaan || null,
        noHp: noHp || "Belum diisi",
        alamatDomisili: alamatDomisili || "Belum diisi",
        latitude: latitude !== undefined && latitude !== null && !isNaN(Number(latitude)) ? Number(latitude) : null,
        longitude: longitude !== undefined && longitude !== null && !isNaN(Number(longitude)) ? Number(longitude) : null,
        mapUrl: mapUrl || null,
      },
      select: {
        id: true,
        nik: true,
        nama: true,
        tempatLahir: true,
        tglLahir: true,
        jk: true,
        suku: true,
        ibuKandung: true,
        ayahDatuak: true,
        jorong: true,
        pekerjaan: true,
        noHp: true,
        alamatDomisili: true,
        latitude: true,
        longitude: true,
        mapUrl: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      message: "Profil dan identitas peta berhasil diperbarui",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    return NextResponse.json({ error: "Gagal memperbarui profil" }, { status: 500 });
  }
}

