"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { GonjongIcon, MarawaStrip } from "@/components/minang-icons";
import { AlertCircle, Loader2, Mail, Lock } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/dashboard/member";
  const registered = searchParams.get("registered");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const result = await signIn("credentials", {
        identifier,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Email/NIK atau password salah");
      } else {
        router.push(callbackUrl);
        router.refresh();
      }
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-950 px-4 py-12 text-zinc-100">
      <Card className="w-full max-w-md border border-zinc-800 bg-zinc-900/80 shadow-2xl backdrop-blur-md overflow-hidden">
        {/* Marawa Ribbon Accent */}
        <MarawaStrip className="h-1.5 w-full" />

        <CardHeader className="text-center pt-8">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 p-0.5 shadow-lg shadow-amber-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-zinc-950 text-amber-400">
              <GonjongIcon className="h-8 w-8 text-amber-400" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight text-white">
            SIWAS <span className="text-amber-400 font-serif">Sungayang</span>
          </CardTitle>
          <CardDescription className="text-zinc-400 text-xs">
            Sistem Informasi Warga & Tarombo Nagari Sungayang
          </CardDescription>
          <p className="text-[11px] text-amber-400/90 font-serif italic mt-1">
            &ldquo;Adat Basandi Syarak, Syarak Basandi Kitabullah&rdquo;
          </p>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {registered && (
              <div className="text-sm text-amber-300 bg-amber-950/40 border border-amber-600/40 p-3 rounded-md">
                Registrasi berhasil! Silakan masuk dengan akun Anda.
              </div>
            )}

            {error && (
              <div className="flex items-center gap-2 text-sm text-red-300 bg-red-950/40 border border-red-800/50 p-3 rounded-md">
                <AlertCircle className="h-4 w-4 flex-shrink-0 text-red-400" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="identifier" className="text-zinc-300">
                Email atau NIK
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="identifier"
                  type="text"
                  placeholder="Masukkan email atau 16 digit NIK"
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  className="pl-10 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-amber-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-zinc-300">
                  Password
                </Label>
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 bg-zinc-950 border-zinc-800 text-white focus-visible:ring-amber-500"
                  required
                  disabled={isLoading}
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-zinc-950 font-bold shadow-md shadow-amber-500/20 border-none mt-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Masuk...
                </>
              ) : (
                "Masuk ke Portal Warga"
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-6">
          <Separator>Belum Terdaftar?</Separator>
          <Link
            href="/register"
            className="text-center text-sm text-amber-400 hover:text-amber-300 hover:underline"
          >
            Daftar sebagai Warga Baru di sini
          </Link>
          <Link
            href="/"
            className="text-center text-xs text-zinc-500 hover:text-zinc-400"
          >
            ← Kembali ke Beranda
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-zinc-950">
          <Loader2 className="h-8 w-8 animate-spin text-amber-500" />
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}
