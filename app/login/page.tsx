import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

import { ArrowLeft, ArrowUpRight, Code2, Palette, ShieldCheck, Sparkles } from 'lucide-react';

import LoginForm from '@/components/auth/LoginForm';
import ThemeToggle from '@/components/shared/ThemeToggle';

export const metadata: Metadata = {
  title: 'Login Admin',
  description: 'Masuk ke dashboard pengelolaan DigiJockeys.',
  robots: {
    index: false,
    follow: false,
  },
};

export default function LoginPage() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background transition-colors duration-300">
      {/* Background Decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 size-[500px] rounded-full bg-[#1B4242]/15 blur-[130px]" />
        <div className="absolute -bottom-40 -right-40 size-[500px] rounded-full bg-[#285B58]/15 blur-[130px]" />

        <div
          className="absolute inset-0 opacity-[0.025] dark:opacity-[0.04]"
          style={{
            backgroundImage: 'linear-gradient(rgba(128,128,128,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(128,128,128,0.5) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />
      </div>

      {/* Theme Toggle */}
      <div className="absolute right-5 top-5 z-30 sm:right-8 sm:top-8">
        <ThemeToggle />
      </div>

      <div className="relative z-10 mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-5 py-20 sm:px-8 lg:grid-cols-2 lg:gap-20 lg:px-12">
        {/* LEFT: BRAND SECTION */}
        <section className="hidden lg:flex lg:flex-col lg:justify-between">
          <div>
            {/* Logo */}
            <Link href="/" className="inline-flex items-center gap-3 transition-opacity hover:opacity-80">
              <Image src="/logo.png" alt="DigiJockeys" width={48} height={48} priority className="size-12 object-contain" />

              <div>
                <p className="text-xl font-bold tracking-tight">
                  Digi<span className="text-[#39766D] dark:text-[#77B6A8]">Jockeys</span>
                </p>

                <p className="text-[9px] font-medium tracking-[0.25em] text-muted-foreground">DIGITAL CREATIVE STUDIO</p>
              </div>
            </Link>

            {/* Main Text */}
            <div className="mt-24 max-w-xl">
              <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#39766D]/25 bg-[#39766D]/10 px-4 py-2">
                <Sparkles className="size-4 text-[#39766D] dark:text-[#77B6A8]" />

                <span className="text-xs font-semibold tracking-wide text-[#39766D] dark:text-[#77B6A8]">RUANG KERJA DIGITAL</span>
              </div>

              <h1 className="text-5xl font-bold leading-[1.15] tracking-tight xl:text-6xl">
                Kelola Ide.
                <span className="block text-[#39766D] dark:text-[#77B6A8]">Ciptakan Solusi.</span>
              </h1>

              <p className="mt-7 max-w-md text-base leading-8 text-muted-foreground">Selamat datang di pusat pengelolaan DigiJockeys. Kelola layanan, portofolio, testimoni, dan konten website dengan mudah dalam satu tempat.</p>
            </div>

            {/* Feature Cards */}
            <div className="mt-14 grid max-w-lg grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#39766D]/10 text-[#39766D] dark:text-[#77B6A8]">
                  <Code2 className="size-5" />
                </div>

                <p className="text-sm font-semibold">Kelola Website</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">Atur konten dan layanan digital.</p>
              </div>

              <div className="rounded-2xl border border-border/70 bg-card/60 p-5 backdrop-blur-xl">
                <div className="mb-4 flex size-10 items-center justify-center rounded-xl bg-[#39766D]/10 text-[#39766D] dark:text-[#77B6A8]">
                  <Palette className="size-5" />
                </div>

                <p className="text-sm font-semibold">Kelola Kreativitas</p>

                <p className="mt-1 text-xs leading-5 text-muted-foreground">Tampilkan karya dan portofolio.</p>
              </div>
            </div>
          </div>

          {/* Left Footer */}
          <div className="mt-16 flex items-center gap-2 text-xs text-muted-foreground">
            <ShieldCheck className="size-4 text-[#39766D] dark:text-[#77B6A8]" />
            Sistem pengelolaan DigiJockeys yang aman dan terintegrasi.
          </div>
        </section>

        {/* RIGHT: LOGIN SECTION */}
        <section className="mx-auto w-full max-w-[440px]">
          {/* Mobile Brand */}
          <div className="mb-10 flex flex-col items-center text-center lg:hidden">
            <Link href="/" className="mb-6">
              <Image src="/logo.png" alt="DigiJockeys" width={64} height={64} priority className="size-16 object-contain" />
            </Link>

            <p className="text-xl font-bold tracking-tight">
              Digi<span className="text-[#39766D] dark:text-[#77B6A8]">Jockeys</span>
            </p>

            <p className="mt-1 text-[10px] tracking-[0.25em] text-muted-foreground">DIGITAL CREATIVE STUDIO</p>
          </div>

          {/* Login Card */}
          <div className="rounded-3xl border border-border/70 bg-card/80 p-6 shadow-2xl shadow-black/[0.04] backdrop-blur-2xl dark:bg-card/60 dark:shadow-black/20 sm:p-9">
            {/* Card Heading */}
            <div className="mb-8">
              <div className="mb-5 flex size-12 items-center justify-center rounded-2xl bg-[#39766D]/10 text-[#39766D] dark:text-[#77B6A8]">
                <ShieldCheck className="size-6" />
              </div>

              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#39766D] dark:text-[#77B6A8]">Area Administrator</p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight">Selamat Datang!</h2>

              <p className="mt-2 text-sm leading-6 text-muted-foreground">Silakan masuk menggunakan akun administrator untuk mengelola website DigiJockeys.</p>
            </div>

            <LoginForm />
          </div>

          {/* Back to Website */}
          <div className="mt-7 flex justify-center">
            <Link href="/" className="group inline-flex items-center gap-2 text-sm text-muted-foreground transition-colors hover:text-foreground">
              <ArrowLeft className="size-4 transition-transform group-hover:-translate-x-1" />
              Kembali ke halaman utama
              <ArrowUpRight className="size-3 opacity-50" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
