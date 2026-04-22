"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registrationSchema, type RegistrationData } from "@/lib/validations";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Toaster, toast } from "sonner";
import {
  UserPlus,
  Loader2,
  User,
  AtSign,
  Mail,
  Phone,
  Lock,
  Building2,
} from "lucide-react";

const fields: {
  name: keyof RegistrationData;
  label: string;
  type: string;
  placeholder: string;
  icon: React.ElementType;
}[] = [
  { name: "fullName", label: "Jina Kamili", type: "text", placeholder: "Fatma Ali Kombo", icon: User },
  { name: "username", label: "Jina la Mtumiaji", type: "text", placeholder: "fatmakombo", icon: AtSign },
  { name: "email", label: "Barua Pepe", type: "email", placeholder: "fatma.kombo@zanzibar.go.tz", icon: Mail },
  { name: "phone", label: "Nambari ya Simu", type: "tel", placeholder: "0777123456", icon: Phone },
  { name: "password", label: "Nenosiri", type: "password", placeholder: "••••••", icon: Lock },
  { name: "institution", label: "Taasisi", type: "text", placeholder: "WIZARA YA AFYA", icon: Building2 },
];

export default function RegistrationPage() {
  const [submitting, setSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegistrationData>({
    resolver: zodResolver(registrationSchema),
  });

  const onSubmit = async (data: RegistrationData) => {
    setSubmitting(true);
    try {
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        if (res.status === 409) {
          toast.error(result.error);
        } else {
          toast.error(result.error || "Usajili umeshindikana");
        }
        return;
      }

      toast.success("Usajili umefanikiwa!");
      reset();
    } catch {
      toast.error("Kuna tatizo. Tafadhali jaribu tena.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-950 p-4">
      {/* Animated background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-amber-500/15 rounded-full blur-[100px] animate-pulse [animation-delay:2s]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-teal-500/10 rounded-full blur-[140px]" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      <Toaster richColors position="top-center" />

      <div className="w-full max-w-md relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-red-500 shadow-2xl shadow-orange-500/30 mb-5 ring-4 ring-white/10">
            <UserPlus className="h-10 w-10 text-white drop-shadow-lg" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight leading-tight">
            USAJILI WA
            <br />
            <span className="bg-gradient-to-r from-amber-300 via-orange-300 to-yellow-200 bg-clip-text text-transparent">
              WATUMIAJI WA MFUMO
            </span>
          </h1>
          <p className="text-slate-400 mt-2 text-sm">
            Jaza maelezo yako hapa chini kujiandikisha
          </p>
        </div>

        {/* Form card */}
        <div className="bg-white/[0.07] backdrop-blur-2xl rounded-3xl border border-white/10 shadow-2xl p-7">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {fields.map(({ name, label, type, placeholder, icon: Icon }) => (
              <div key={name} className="space-y-1.5">
                <Label htmlFor={name} className="text-slate-300 text-sm font-medium flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-amber-400" />
                  {label}
                </Label>
                <Input
                  id={name}
                  type={type}
                  placeholder={placeholder}
                  {...register(name)}
                  aria-invalid={!!errors[name]}
                  className="h-11 rounded-xl bg-white/[0.06] border-white/10 text-white placeholder:text-slate-500 focus:border-amber-500/60 focus:ring-amber-500/20 transition-all duration-200"
                />
                {errors[name] && (
                  <p className="text-sm text-red-400 mt-1 flex items-center gap-1">
                    <span className="inline-block w-1 h-1 rounded-full bg-red-400" />
                    {errors[name].message}
                  </p>
                )}
              </div>
            ))}

            <Button
              type="submit"
              disabled={submitting}
              className="w-full h-12 mt-3 bg-gradient-to-r from-amber-500 via-orange-500 to-red-500 hover:from-amber-600 hover:via-orange-600 hover:to-red-600 text-white font-bold text-base rounded-xl shadow-lg shadow-orange-500/25 transition-all duration-300 hover:shadow-orange-500/40 hover:scale-[1.02] active:scale-[0.98] border-0"
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Inawasilisha...
                </>
              ) : (
                "JIANDIKISHE"
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-center gap-2 mt-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
          <p className="text-slate-500 text-xs tracking-widest uppercase">
            Mfumo wa Usajili &bull; Zanzibar
          </p>
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-slate-700 to-transparent" />
        </div>
      </div>
    </div>
  );
}