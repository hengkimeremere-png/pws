export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// GET: Dapat diakses oleh warga / publik untuk melihat bagan struktur organisasi PWS
export async function GET(request: NextRequest) {
  try {
    const matrix = await prisma.managementMatrix.findMany({
      orderBy: [{ level: "asc" }, { urutan: "asc" }, { id: "asc" }],
    });

    return NextResponse.json({ matrix });
  } catch (error) {
    console.error("Get management matrix error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}

// POST: Hanya ADMIN yang dapat menambah / menyusun pengurus baru atau memuat data struktur awal
export async function POST(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();

    // Support Seeding Initial Structure jika diminta
    if (body.action === "seed_default") {
      const defaultPositions = [
        // Level 1: Pimpinan Pusat
        { jabatan: "Ketua Umum", level: 1, nama: "Bapak Ahmad Hidayat", suku: "Chaniago", jorong: "Jorong Balai Gadang", ibuKandung: "Ibu Nurhayati", ayahDatuak: "Dt. Marajo", noHp: "081234567801", periode: "2024-2029", urutan: 1 },
        { jabatan: "Wakil Ketua", level: 1, nama: "Bapak Rizki Pratama", suku: "Piliang", jorong: "Jorong Koto Baru", ibuKandung: "Ibu Fatimah", ayahDatuak: "Dt. Bandaro Basa", noHp: "081234567802", periode: "2024-2029", urutan: 2 },
        { jabatan: "Sekretaris Umum", level: 1, nama: "Ibu Siti Rahayu", suku: "Bodi Caniago", jorong: "Jorong Koto Tangah", ibuKandung: "Ibu Salmah", ayahDatuak: "Dt. Tan Manih", noHp: "081234567803", periode: "2024-2029", urutan: 3 },
        { jabatan: "Bendahara Umum", level: 1, nama: "Bapak Dedi Kurniawan", suku: "Sikumbang", jorong: "Jorong Sianau Indah", ibuKandung: "Ibu Mardiana", ayahDatuak: "Dt. Kayo", noHp: "081234567804", periode: "2024-2029", urutan: 4 },
        
        // Level 2: Bidang Inti
        { jabatan: "Koord. Bidang Sosial & Budaya", level: 2, nama: "Bapak Andi Wijaya", suku: "Guci", jorong: "Jorong Balai Gadang", ibuKandung: "Ibu Rosma", ayahDatuak: "Dt. Pangulu", noHp: "081234567805", periode: "2024-2029", urutan: 1 },
        { jabatan: "Koord. Bidang Pendidikan & Dakwah", level: 2, nama: "Ibu Maya Sari", suku: "Koto", jorong: "Jorong Koto Baru", ibuKandung: "Ibu Zulfa", ayahDatuak: "Dt. Malano", noHp: "081234567806", periode: "2024-2029", urutan: 2 },
        { jabatan: "Koord. Bidang Ekonomi & UMKM", level: 2, nama: "Bapak Budi Santoso", suku: "Mandahiliang", jorong: "Jorong Minangkabau", ibuKandung: "Ibu Syamsiar", ayahDatuak: "Dt. Rajo Mantari", noHp: "081234567807", periode: "2024-2029", urutan: 3 },
        { jabatan: "Koord. Bidang Pemuda & Olahraga", level: 2, nama: "Bapak Eko Prasetyo", suku: "Pitopang", jorong: "Jorong Sianau Indah", ibuKandung: "Ibu Darnis", ayahDatuak: "Dt. Sinaro", noHp: "081234567808", periode: "2024-2029", urutan: 4 },

        // Level 3: Koordinator Jorong
        { jabatan: "Koord. Jorong Balai Gadang", level: 3, nama: "Bapak Joko Susilo", suku: "Pitopang", jorong: "Jorong Balai Gadang", ibuKandung: "Ibu Yulinar", ayahDatuak: "Dt. Rangkayo Basa", noHp: "081234567809", periode: "2024-2029", urutan: 1 },
        { jabatan: "Koord. Jorong Koto Baru", level: 3, nama: "Bapak Agus Setiawan", suku: "Chaniago", jorong: "Jorong Koto Baru", ibuKandung: "Ibu Ermawati", ayahDatuak: "Dt. Mangkuto Alam", noHp: "081234567810", periode: "2024-2029", urutan: 2 },
        { jabatan: "Koord. Jorong Koto Tangah", level: 3, nama: "Ibu Dewi Lestari", suku: "Koto", jorong: "Jorong Koto Tangah", ibuKandung: "Ibu Rohana", ayahDatuak: "Dt. Sati", noHp: "081234567811", periode: "2024-2029", urutan: 3 },
        { jabatan: "Koord. Jorong Sianau Indah", level: 3, nama: "Bapak Hendra Gunawan", suku: "Piliang", jorong: "Jorong Sianau Indah", ibuKandung: "Ibu Yusnidar", ayahDatuak: "Dt. Sampono Basa", noHp: "081234567812", periode: "2024-2029", urutan: 4 },
      ];

      await prisma.managementMatrix.createMany({
        data: defaultPositions,
      });

      const updated = await prisma.managementMatrix.findMany({
        orderBy: [{ level: "asc" }, { urutan: "asc" }, { id: "asc" }],
      });

      return NextResponse.json({ message: "Struktur awal berhasil dimuat", matrix: updated }, { status: 201 });
    }

    const { jabatan, level, nama, suku, jorong, ibuKandung, ayahDatuak, noHp, periode, urutan } = body;

    if (!jabatan || !level || !nama || !suku || !jorong || !ibuKandung || !ayahDatuak || !noHp || !periode) {
      return NextResponse.json({ error: "Semua field wajib diisi" }, { status: 400 });
    }

    if (level < 1 || level > 4) {
      return NextResponse.json({ error: "Level harus antara 1-4" }, { status: 400 });
    }

    const matrix = await prisma.managementMatrix.create({
      data: {
        jabatan,
        level: parseInt(level),
        nama,
        suku,
        jorong,
        ibuKandung,
        ayahDatuak,
        noHp,
        periode,
        urutan: urutan ? parseInt(urutan) : 0,
      },
    });

    return NextResponse.json({ matrix }, { status: 201 });
  } catch (error) {
    console.error("Create management matrix error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}
