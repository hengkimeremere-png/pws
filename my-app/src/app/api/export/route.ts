export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const session = await auth();

    if (!session?.user || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const format = searchParams.get("format") || "csv";
    const type = searchParams.get("type") || "users";

    if (type === "users") {
      const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
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
          email: true,
          role: true,
          createdAt: true,
        },
      });

      if (format === "csv") {
        const headers = [
          "NIK", "Nama", "Tempat Lahir", "Tanggal Lahir", "Jenis Kelamin",
          "Suku", "Ibu Kandung", "Ayah/Datuak", "Jorong", "Pekerjaan",
          "No. HP", "Alamat Domisili", "Email", "Role", "Tanggal Daftar"
        ];

        const rows = users.map(u => [
          u.nik,
          u.nama,
          u.tempatLahir || "",
          u.tglLahir ? new Date(u.tglLahir).toLocaleDateString("id-ID") : "",
          u.jk === "L" ? "Laki-laki" : "Perempuan",
          u.suku,
          u.ibuKandung,
          u.ayahDatuak,
          u.jorong,
          u.pekerjaan || "",
          u.noHp,
          u.alamatDomisili,
          u.email,
          u.role,
          new Date(u.createdAt).toLocaleDateString("id-ID"),
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="siwas-users-${new Date().toISOString().split("T")[0]}.csv"`,
          },
        });
      }
    }

    if (type === "management") {
      const matrix = await prisma.managementMatrix.findMany({
        orderBy: [{ level: "asc" }, { id: "asc" }],
      });

      if (format === "csv") {
        const headers = [
          "ID", "Jabatan", "Level", "Nama", "Suku", "Jorong",
          "Ibu Kandung", "Ayah/Datuak", "No. HP", "Periode"
        ];

        const rows = matrix.map(m => [
          m.id.toString(),
          m.jabatan,
          m.level.toString(),
          m.nama,
          m.suku,
          m.jorong,
          m.ibuKandung,
          m.ayahDatuak,
          m.noHp,
          m.periode,
        ]);

        const csv = [headers.join(","), ...rows.map(r => r.map(v => `"${v}"`).join(","))].join("\n");

        return new NextResponse(csv, {
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="siwas-management-${new Date().toISOString().split("T")[0]}.csv"`,
          },
        });
      }
    }

    return NextResponse.json({ error: "Invalid export type" }, { status: 400 });
  } catch (error) {
    console.error("Export error:", error);
    return NextResponse.json({ error: "Terjadi kesalahan server" }, { status: 500 });
  }
}