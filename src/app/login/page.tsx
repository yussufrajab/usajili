"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import { Loader2, User, Lock } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function LoginPage() {
  const [submitting, setSubmitting] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const result = await res.json();

      if (!res.ok) {
        toast.error(result.error || "Login umeshindikana");
        return;
      }

      toast.success("Login umefanikiwa!");
      router.push("/dashboard");
    } catch {
      toast.error("Kuna tatizo. Tafadhali jaribu tena.");
    } finally {
      setSubmitting(false);
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
            INGIA KAMA
            <br />
            <span className="bg-gradient-to-r from-emerald-700 via-blue-700 to-amber-600 bg-clip-text text-transparent">
              MSIMAMIZI
            </span>
          </h1>
          <p className="text-emerald-700/60 mt-2 text-base">
            Weka stahi zako kupata ufikiaji
          </p>
        </div>

        {/* Login card */}
        <div className="bg-white/80 backdrop-blur-xl rounded-3xl border border-emerald-200/60 shadow-xl shadow-emerald-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-emerald-900 text-base font-medium flex items-center gap-2">
                <User className="h-4 w-4 text-amber-600" />
                Jina la Mtumiaji
              </Label>
              <Input
                id="username"
                type="text"
                placeholder="admin"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                className="h-12 rounded-xl bg-white border-emerald-200 text-emerald-950 text-base placeholder:text-emerald-500/50 placeholder:text-lg focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-emerald-900 text-base font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-amber-600" />
                Nenosiri
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="h-12 rounded-xl bg-white border-emerald-200 text-emerald-950 text-base placeholder:text-emerald-500/50 placeholder:text-lg focus:border-emerald-500 focus:ring-emerald-500/20 transition-all duration-200"
              />
            </div>

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-13 mt-3 bg-gradient-to-r from-emerald-600 via-blue-600 to-emerald-500 hover:from-emerald-700 hover:via-blue-700 hover:to-emerald-600 text-white font-bold text-lg rounded-xl shadow-lg shadow-emerald-300/40 transition-all duration-300 hover:shadow-emerald-400/50 hover:scale-[1.02] active:scale-[0.98] border-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Inawasilisha...
                </>
              ) : (
                "INGIA"
              )}
            </Button>
          </form>
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