export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      nik,
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
      email,
      password,
    } = body;

    // Required fields: nik, nama, email, password, confirmPassword (validated in frontend)
    // Optional fields get defaults for simplified registration
    if (!nik || !nama || !email || !password) {
      return NextResponse.json(
        { error: "NIK, Nama, Email, dan Password wajib diisi" },
        { status: 400 }
      );
    }

    if (nik.length !== 16) {
      return NextResponse.json(
        { error: "NIK harus 16 digit" },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: "Password minimal 8 karakter" },
        { status: 400 }
      );
    }

    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { nik }],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "Email atau NIK sudah terdaftar" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const user = await prisma.user.create({
      data: {
        nik,
        nama,
        tempatLahir: tempatLahir || null,
        tglLahir: tglLahir ? new Date(tglLahir) : null,
        jk: (jk as "L" | "P") || "L",
        suku: suku || "Belum diisi",
        ibuKandung: ibuKandung || "Belum diisi",
        ayahDatuak: ayahDatuak || "Belum diisi",
        jorong: jorong || "Belum diisi",
        pekerjaan: pekerjaan || null,
        noHp: noHp || "Belum diisi",
        alamatDomisili: alamatDomisili || "Belum diisi",
        email,
        password: hashedPassword,
        role: "MEMBER",
      },
    });

    return NextResponse.json(
      { message: "Registrasi berhasil", user: { id: user.id, email: user.email, nama: user.nama } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan server" },
      { status: 500 }
    );
  }
}