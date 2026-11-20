import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import MemberDashboardClient from "./member-dashboard-client";

export default async function MemberDashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if ((session.user as any).role === "ADMIN") {
    redirect("/dashboard/admin");
  }

  const user = await prisma.user.findUnique({
    where: { id: (session.user as any).id },
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
      createdAt: true,
    },
  });

  if (!user) {
    redirect("/login");
  }

  return <MemberDashboardClient user={user} />;
}