"use client";

import { useState, useEffect, useCallback } from "react";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select } from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { OrganizationalChart } from "@/components/organizational-chart";
import { GonjongIcon, MarawaStrip } from "@/components/minang-icons";
import {
  Users,
  ShieldAlert,
  LogOut,
  Download,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  Network,
  RefreshCw,
} from "lucide-react";

interface UserItem {
  id: string;
  nik: string;
  nama: string;
  email: string;
  jk: "L" | "P";
  suku: string;
  jorong: string;
  ibuKandung: string;
  ayahDatuak: string;
  noHp: string;
  role: string;
  createdAt: string;
}

interface ManagementItem {
  id: number;
  jabatan: string;
  level: number;
  nama: string;
  suku: string;
  jorong: string;
  ibuKandung: string;
  ayahDatuak: string;
  noHp: string;
  periode: string;
  urutan?: number;
}

export default function AdminDashboardClient() {
  // Users state
  const [users, setUsers] = useState<UserItem[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [search, setSearch] = useState("");
  const [filterSuku, setFilterSuku] = useState("");
  const [filterJorong, setFilterJorong] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);

  // Management Matrix state
  const [matrix, setMatrix] = useState<ManagementItem[]>([]);
  const [loadingMatrix, setLoadingMatrix] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [formData, setFormData] = useState({
    jabatan: "",
    level: 1,
    nama: "",
    suku: "Chaniago",
    jorong: "Jorong Balai Gadang",
    ibuKandung: "",
    ayahDatuak: "",
    noHp: "",
    periode: "2024-2029",
    urutan: 1,
  });
  const [savingMatrix, setSavingMatrix] = useState(false);

  // Seed default structure
  const handleSeedDefault = async () => {
    if (!confirm("Muat susunan struktur kepengurusan PWS standar Nagari Sungayang?")) return;
    setLoadingMatrix(true);
    try {
      const res = await fetch("/api/management", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "seed_default" }),
      });
      if (res.ok) {
        const data = await res.json();
        setMatrix(data.matrix || []);
      }
    } catch {
      alert("Gagal memuat struktur default");
    } finally {
      setLoadingMatrix(false);
    }
  };

  // Fetch Users
  const fetchUsers = useCallback(async () => {
    setLoadingUsers(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "15",
        search,
        suku: filterSuku,
        jorong: filterJorong,
      });
      const res = await fetch(`/api/users?${params.toString()}`);
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || []);
        setTotalPages(data.pagination?.totalPages || 1);
        setTotalUsers(data.pagination?.total || 0);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoadingUsers(false);
    }
  }, [page, search, filterSuku, filterJorong]);

  // Fetch Matrix
  const fetchMatrix = useCallback(async () => {
    setLoadingMatrix(true);
    try {
      const res = await fetch("/api/management");
      if (res.ok) {
        const data = await res.json();
        setMatrix(data.matrix || []);
      }
    } catch (err) {
      console.error("Error fetching matrix:", err);
    } finally {
      setLoadingMatrix(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  useEffect(() => {
    fetchMatrix();
  }, [fetchMatrix]);

  // Handle Form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "level" ? parseInt(value) || 1 : value,
    }));
  };

  // Open add dialog
  const handleOpenAdd = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      jabatan: "",
      level: 1,
      nama: "",
      suku: "Chaniago",
      jorong: "Jorong Balai Gadang",
      ibuKandung: "",
      ayahDatuak: "",
      noHp: "",
      periode: "2024-2029",
      urutan: matrix.length + 1,
    });
    setDialogOpen(true);
  };

  // Open edit dialog
  const handleOpenEdit = (item: ManagementItem) => {
    setIsEditing(true);
    setEditId(item.id);
    setFormData({
      jabatan: item.jabatan,
      level: item.level,
      nama: item.nama,
      suku: item.suku,
      jorong: item.jorong,
      ibuKandung: item.ibuKandung,
      ayahDatuak: item.ayahDatuak,
      noHp: item.noHp,
      periode: item.periode,
      urutan: item.urutan || 1,
    });
    setDialogOpen(true);
  };

  // Save matrix item
  const handleSaveMatrix = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingMatrix(true);
    try {
      const url = isEditing ? `/api/management/${editId}` : "/api/management";
      const method = isEditing ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setDialogOpen(false);
        fetchMatrix();
      } else {
        const data = await res.json();
        alert(data.error || "Gagal menyimpan pengurus");
      }
    } catch {
      alert("Terjadi kesalahan");
    } finally {
      setSavingMatrix(false);
    }
  };

  // Delete matrix item
  const handleDeleteMatrix = async (id: number) => {
    if (!confirm("Apakah Anda yakin ingin menghapus data pengurus ini?")) return;
    try {
      const res = await fetch(`/api/management/${id}`, { method: "DELETE" });
      if (res.ok) {
        fetchMatrix();
      } else {
        alert("Gagal menghapus");
      }
    } catch {
      alert("Terjadi kesalahan");
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 selection:bg-amber-500 selection:text-black">
      {/* Marawa Ribbon Accent */}
      <MarawaStrip className="h-2 w-full" />

      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-800 bg-zinc-950/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-red-700 p-0.5 shadow-md shadow-amber-500/20">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-zinc-950 text-amber-400">
                <GonjongIcon className="h-6 w-6 text-amber-400" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base sm:text-lg font-bold leading-tight text-white flex items-center gap-1.5">
                  Admin SIWAS <span className="text-amber-400 font-serif">Sungayang</span>
                </h1>
                <Badge variant="destructive" className="text-[10px] py-0 px-1.5 uppercase bg-red-950 border border-red-700 text-red-300">
                  Administrator
                </Badge>
              </div>
              <p className="text-xs text-zinc-400">
                Panel Manajemen Warga & Pengurus PWS Tanah Datar
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="gap-2 border-zinc-800 bg-zinc-900 text-zinc-300 hover:bg-zinc-800 hover:text-white"
            >
              <LogOut className="h-4 w-4" />
              <span>Keluar</span>
            </Button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Quick Stats Header */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Total Warga Terdaftar
                  </p>
                  <p className="mt-2 text-3xl font-bold">{totalUsers}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30">
                  <Users className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Total Pengurus Aktif
                  </p>
                  <p className="mt-2 text-3xl font-bold">{matrix.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-100 text-purple-600 dark:bg-purple-900/30">
                  <Network className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider">
                    Export Data (CSV)
                  </p>
                  <div className="mt-2 flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("/api/export?type=users&format=csv")}
                      className="text-xs gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Warga
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open("/api/export?type=management&format=csv")}
                      className="text-xs gap-1.5"
                    >
                      <Download className="h-3.5 w-3.5" />
                      Pengurus
                    </Button>
                  </div>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100 text-green-600 dark:bg-green-900/30">
                  <Download className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs for Admin Features */}
        <Tabs defaultValue="warga" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-lg">
            <TabsTrigger value="warga" className="gap-2">
              <Users className="h-4 w-4" />
              <span>Data Warga</span>
            </TabsTrigger>
            <TabsTrigger value="pengurus" className="gap-2">
              <Network className="h-4 w-4" />
              <span>Matriks Pengurus</span>
            </TabsTrigger>
            <TabsTrigger value="bagan" className="gap-2">
              <ShieldAlert className="h-4 w-4" />
              <span>Bagan Organisasi</span>
            </TabsTrigger>
          </TabsList>

          {/* TAB 1: Data Warga */}
          <TabsContent value="warga" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Daftar Warga Terdaftar</CardTitle>
                    <CardDescription>
                      Kelola dan filter data seluruh warga Persatuan Warga Sungayang
                    </CardDescription>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={fetchUsers}
                    disabled={loadingUsers}
                    className="gap-2 w-fit"
                  >
                    <RefreshCw className={`h-4 w-4 ${loadingUsers ? "animate-spin" : ""}`} />
                    <span>Refresh</span>
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Search & Filters */}
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div className="relative sm:col-span-2">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      placeholder="Cari nama, NIK, atau email..."
                      value={search}
                      onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                      }}
                      className="pl-9"
                    />
                  </div>
                  <Input
                    placeholder="Filter Suku..."
                    value={filterSuku}
                    onChange={(e) => {
                      setFilterSuku(e.target.value);
                      setPage(1);
                    }}
                  />
                  <Input
                    placeholder="Filter Jorong..."
                    value={filterJorong}
                    onChange={(e) => {
                      setFilterJorong(e.target.value);
                      setPage(1);
                    }}
                  />
                </div>

                {/* Table */}
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>NIK</TableHead>
                        <TableHead>Nama Warga</TableHead>
                        <TableHead>Suku</TableHead>
                        <TableHead>Jorong</TableHead>
                        <TableHead>Ibu Kandung</TableHead>
                        <TableHead>No. HP</TableHead>
                        <TableHead>Role</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingUsers ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-28 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-blue-600" />
                            <p className="mt-2 text-xs text-zinc-500">Memuat data warga...</p>
                          </TableCell>
                        </TableRow>
                      ) : users.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-24 text-center text-zinc-500">
                            Tidak ada data warga ditemukan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        users.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-mono text-xs">{u.nik}</TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium text-zinc-900 dark:text-zinc-100">{u.nama}</p>
                                <p className="text-xs text-zinc-500">{u.email}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline">{u.suku}</Badge>
                            </TableCell>
                            <TableCell>{u.jorong}</TableCell>
                            <TableCell className="text-pink-600 dark:text-pink-400 text-xs">
                              {u.ibuKandung}
                            </TableCell>
                            <TableCell className="text-xs">{u.noHp}</TableCell>
                            <TableCell>
                              <Badge variant={u.role === "ADMIN" ? "destructive" : "secondary"}>
                                {u.role}
                              </Badge>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2">
                    <p className="text-xs text-zinc-500">
                      Halaman {page} dari {totalPages}
                    </p>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page <= 1 || loadingUsers}
                        onClick={() => setPage((p) => Math.max(p - 1, 1))}
                      >
                        Sebelumnya
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        disabled={page >= totalPages || loadingUsers}
                        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
                      >
                        Selanjutnya
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 2: Matriks Pengurus */}
          <TabsContent value="pengurus" className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <CardTitle className="text-xl">Matriks Kepengurusan PWS</CardTitle>
                    <CardDescription>
                      Atur tingkatan jabatan (Level 1: Pimpinan Pusat s/d Level 4: Anggota)
                    </CardDescription>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {matrix.length === 0 && (
                      <Button
                        variant="outline"
                        onClick={handleSeedDefault}
                        disabled={loadingMatrix}
                        className="gap-2 border-amber-500/40 text-amber-400 hover:bg-amber-950/30"
                      >
                        <RefreshCw className={`h-4 w-4 ${loadingMatrix ? "animate-spin" : ""}`} />
                        <span>Muat Susunan Standar</span>
                      </Button>
                    )}
                    <Button onClick={handleOpenAdd} className="gap-2 w-fit bg-amber-500 hover:bg-amber-600 text-zinc-950 font-semibold">
                      <Plus className="h-4 w-4" />
                      <span>Tambah Pengurus</span>
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Struktur / Bagian</TableHead>
                        <TableHead>Nama Jabatan</TableHead>
                        <TableHead>Nama</TableHead>
                        <TableHead>Suku / Jorong</TableHead>
                        <TableHead>Garis Keturunan</TableHead>
                        <TableHead>No. HP</TableHead>
                        <TableHead>Periode</TableHead>
                        <TableHead className="text-right">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {loadingMatrix ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-28 text-center">
                            <Loader2 className="mx-auto h-6 w-6 animate-spin text-purple-600" />
                            <p className="mt-2 text-xs text-zinc-500">Memuat matriks pengurus...</p>
                          </TableCell>
                        </TableRow>
                      ) : matrix.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={8} className="h-24 text-center text-zinc-500">
                            Belum ada pengurus di matriks. Klik &quot;Tambah Pengurus&quot; untuk menambahkan.
                          </TableCell>
                        </TableRow>
                      ) : (
                        matrix.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell>
                              <Badge
                                variant={
                                  item.level === 1
                                    ? "default"
                                    : item.level === 2
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                Level {item.level}
                              </Badge>
                            </TableCell>
                            <TableCell className="font-semibold text-zinc-900 dark:text-zinc-100">
                              {item.jabatan}
                            </TableCell>
                            <TableCell>{item.nama}</TableCell>
                            <TableCell className="text-xs">
                              {item.suku} / {item.jorong}
                            </TableCell>
                            <TableCell className="text-xs">
                              Ibu: {item.ibuKandung} <br />
                              Ayah: {item.ayahDatuak}
                            </TableCell>
                            <TableCell className="text-xs">{item.noHp}</TableCell>
                            <TableCell className="text-xs">{item.periode}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleOpenEdit(item)}
                                >
                                  <Edit2 className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => handleDeleteMatrix(item.id)}
                                  className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* TAB 3: Bagan Organisasi Preview */}
          <TabsContent value="bagan">
            <Card>
              <CardHeader className="text-center">
                <CardTitle className="text-xl">Bagan Struktur Organisasi</CardTitle>
                <CardDescription>
                  Tampilan hirarki kepengurusan Persatuan Warga Sungayang (Live dari Database)
                </CardDescription>
              </CardHeader>
              <CardContent className="overflow-x-auto py-6">
                <OrganizationalChart matrix={matrix} />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      {/* Dialog Form Tambah/Edit Pengurus */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogHeader>
            <DialogTitle>
              {isEditing ? "Edit Data Pengurus" : "Tambah Pengurus Baru"}
            </DialogTitle>
            <DialogDescription>
              Isi data pengurus sesuai dengan tingkatan jabatan dalam struktur PWS
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveMatrix} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="level">Tingkatan (Level)</Label>
                <Select
                  id="level"
                  name="level"
                  value={formData.level.toString()}
                  onChange={handleFormChange}
                  required
                >
                  <option value="1">Level 1 - Pimpinan Pusat</option>
                  <option value="2">Level 2 - Bidang Inti</option>
                  <option value="3">Level 3 - Koord. Jorong</option>
                  <option value="4">Level 4 - Anggota</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="jabatan">Nama Jabatan</Label>
                <Input
                  id="jabatan"
                  name="jabatan"
                  placeholder="Contoh: Ketua Umum"
                  value={formData.jabatan}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="nama">Nama Lengkap</Label>
              <Input
                id="nama"
                name="nama"
                placeholder="Nama lengkap pejabat pengurus"
                value={formData.nama}
                onChange={handleFormChange}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="suku">Suku Minang</Label>
                <Select
                  id="suku"
                  name="suku"
                  value={formData.suku}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Chaniago">Chaniago</option>
                  <option value="Piliang">Piliang</option>
                  <option value="Bodi Caniago">Bodi Caniago</option>
                  <option value="Koto">Koto</option>
                  <option value="Sikumbang">Sikumbang</option>
                  <option value="Guci">Guci</option>
                  <option value="Mandahiliang">Mandahiliang</option>
                  <option value="Pitopang">Pitopang</option>
                  <option value="Melayu">Melayu</option>
                  <option value="Jambak">Jambak</option>
                </Select>
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="jorong">Jorong Asal</Label>
                <Select
                  id="jorong"
                  name="jorong"
                  value={formData.jorong}
                  onChange={handleFormChange}
                  required
                >
                  <option value="Jorong Balai Gadang">Jorong Balai Gadang</option>
                  <option value="Jorong Koto Baru">Jorong Koto Baru</option>
                  <option value="Jorong Koto Tangah">Jorong Koto Tangah</option>
                  <option value="Jorong Sianau Indah">Jorong Sianau Indah</option>
                  <option value="Jorong Minangkabau">Jorong Minangkabau</option>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label htmlFor="ibuKandung">Ibu Kandung</Label>
                <Input
                  id="ibuKandung"
                  name="ibuKandung"
                  placeholder="Nama ibu kandung"
                  value={formData.ibuKandung}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1.5">
                <Label htmlFor="ayahDatuak">Ayah / Datuak</Label>
                <Input
                  id="ayahDatuak"
                  name="ayahDatuak"
                  placeholder="Nama ayah / datuak"
                  value={formData.ayahDatuak}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="urutan">Urutan Posisi</Label>
                <Input
                  id="urutan"
                  name="urutan"
                  type="number"
                  min={1}
                  placeholder="1"
                  value={formData.urutan}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="noHp">No. HP / WA</Label>
                <Input
                  id="noHp"
                  name="noHp"
                  placeholder="08xxxxxxxxxx"
                  value={formData.noHp}
                  onChange={handleFormChange}
                  required
                />
              </div>

              <div className="space-y-1.5 sm:col-span-1">
                <Label htmlFor="periode">Periode</Label>
                <Input
                  id="periode"
                  name="periode"
                  placeholder="2024-2029"
                  value={formData.periode}
                  onChange={handleFormChange}
                  required
                />
              </div>
            </div>

            <DialogFooter className="mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setDialogOpen(false)}
                disabled={savingMatrix}
              >
                Batal
              </Button>
              <Button type="submit" disabled={savingMatrix}>
                {savingMatrix ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  "Simpan"
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
