"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Toaster, toast } from "sonner";
import { Download, LogOut, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function DashboardClient() {
  const [downloading, setDownloading] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const router = useRouter();

  const handleDownload = async () => {
    setDownloading(true);
    try {
      const res = await fetch("/api/download");
      if (!res.ok) {
        toast.error("Imeshindwa kupakua faili");
        return;
      }
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "users.md";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success("Faili imepakiwa kikamilifu!");
    } catch {
      toast.error("Kuna tatizo. Tafadhali jaribu tena.");
    } finally {
      setDownloading(false);
    }
  };

  const handleLogout = async () => {
    setLoggingOut(true);
    try {
      await fetch("/api/logout", { method: "POST" });
      router.push("/login");
    } catch {
      toast.error("Kuna tatizo. Tafadhali jaribu tena.");
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-gradient-to-br from-emerald-50 via-white to-blue-50 p-4">
      {/* Decorative background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-emerald-300/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-yellow-200/25 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-sky-200/20 rounded-full blur-[140px]" />
      </div>

      <Toaster richColors position="top-center" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-2xl bg-white shadow-xl mb-5 ring-4 ring-emerald-200 p-2">
            <Image
              src="/logo_smz.png"
              alt="SMZ Logo"
              width={80}
              height={80}
              className="object-contain"
              priority
            />
          </div>
          <h1 className="text-4xl font-extrabold text-emerald-900 tracking-tight leading-tight">
            DASHBOARD YA
            <br />
            <span className="bg-gradient-to-r from-emerald-700 via-blue-700 to-amber-600 bg-clip-text text-transparent">
              MSIMAMIZI
            </span>
          </h1>
          <p className="text-emerald-700/60 mt-2 text-base">
            Pakua data ya watumiaji waliosajiliwa
          </p>
        </div>

        {/* Dashboard card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-200/60 shadow-xl shadow-emerald-100 p-8 space-y-5">
          <div className="flex items-center gap-3 p-4 rounded-2xl bg-emerald-50 border border-emerald-200/50">
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-blue-600 flex items-center justify-center">
              <Download className="h-5 w-5 text-white" />
            </div>
            <div>
              <p className="text-emerald-900 font-semibold text-base">Watumiaji Waliosajiliwa</p>
              <p className="text-emerald-700/60 text-sm">users.md &bull; Faili ya data ya usajili</p>
            </div>
          </div>

          <Button
            onClick={handleDownload}
            disabled={downloading}
            className="w-full h-13 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-500 hover:from-emerald-700 hover:via-blue-700 hover:to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-300/40 transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-[1.02] active:scale-[0.98] border-0"
          >
            {downloading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Inapakua...
              </>
            ) : (
              <>
                <Download className="mr-2 h-5 w-5" />
                PAKUA WATUMIAJI
              </>
            )}
          </Button>

          <div className="h-px bg-emerald-200/60" />

          <Button
            onClick={handleLogout}
            disabled={loggingOut}
            variant="outline"
            className="w-full h-11 border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700 hover:border-red-300 font-medium text-base rounded-xl transition-all duration-200"
          >
            {loggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Inatoka...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Toka
              </>
            )}
          </Button>
        </div>

        {/* Footer */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center justify-center gap-2">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
            <p className="text-amber-700/60 text-sm tracking-widest uppercase">
              Mfumo wa Usajili &bull; Zanzibar
            </p>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-emerald-300 to-transparent" />
          </div>
          <div className="text-center">
            <Link
              href="/"
              className="text-emerald-600/50 hover:text-emerald-700 text-sm transition-colors duration-200"
            >
              &larr; Rudi kwenye Usajili
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}