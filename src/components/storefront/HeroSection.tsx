import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, Zap, Award, ArrowRight, Sparkles } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onHowToOrderClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onExploreClick,
  onHowToOrderClick,
}) => {
  const { settings } = useStore();

  return (
    <section className="relative overflow-hidden pt-8 pb-16 md:pt-14 md:pb-24 border-b border-white/5">
      {/* Background Glow Mesh */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-blue-600/15 via-cyan-500/10 to-transparent blur-3xl rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Headlines & CTAs */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-cyan-500/30 bg-cyan-500/10 text-cyan-400 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Official Gaming Store · Akun Terverifikasi</span>
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white uppercase leading-none">
              Beli Akun Gaming <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-400 to-teal-300">
                Aman & Terpercaya
              </span>
            </h1>

            <p className="text-base sm:text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 font-normal leading-relaxed">
              {settings.tagline} Temukan akun game idamanmu dengan proses transaksi sederhana, pembayaran QRIS instan, dan nota otomatis.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
              <button
                onClick={onExploreClick}
                className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 shadow-lg shadow-cyan-500/25 transition-all group"
              >
                <span>Lihat Produk Tersedia</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
              <button
                onClick={onHowToOrderClick}
                className="px-5 py-3.5 rounded-xl font-semibold text-sm text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 transition-colors"
              >
                Cara Order & Garansi
              </button>
            </div>

            {/* 3 Trust Markers adhering to anti-slop Claim-to-Proof */}
            <div className="pt-8 border-t border-white/5 grid grid-cols-3 gap-4 text-left">
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Garansi Resmi</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Garansi anti-hackback</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Zap className="w-4 h-4 text-cyan-400 shrink-0" />
                  <span>Proses Cepat</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">Verifikasi 5-15 menit</p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-xs font-semibold text-white">
                  <Award className="w-4 h-4 text-amber-400 shrink-0" />
                  <span>Data Bersih</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5">All unbind siap pakai</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl bg-slate-900 aspect-[16/10] group">
              <img
                src={settings.banner}
                alt="Vortex ID Gaming Showcase"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-slate-950/80 backdrop-blur-md border border-white/10 flex items-center justify-between">
                <div>
                  <span className="text-[10px] uppercase font-bold tracking-wider text-cyan-400">Featured Catalog</span>
                  <p className="text-sm font-semibold text-white">Mythic & Sultan Ready Stock</p>
                </div>
                <button
                  onClick={onExploreClick}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-xs font-semibold text-white transition-colors"
                >
                  Beli Sekarang
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
