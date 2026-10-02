import React from 'react';
import { useStore } from '../context/StoreContext';
import { Search, ShoppingBag, QrCode, Clock, Key, ShieldCheck, ArrowRight } from 'lucide-react';

interface HowToOrderPageProps {
  onBrowseProducts: () => void;
}

export const HowToOrderPage: React.FC<HowToOrderPageProps> = ({ onBrowseProducts }) => {
  const { settings } = useStore();

  const steps = [
    {
      num: '01',
      title: 'Pilih Akun Gaming',
      desc: 'Cari akun game (MLBB, Free Fire, Valorant, Genshin, PUBG) sesuai rank, skin idaman, dan budget Anda. Periksa rincian spesifikasi dengan teliti.',
      icon: Search,
    },
    {
      num: '02',
      title: 'Checkout & Masukkan Voucher',
      desc: 'Klik Beli Sekarang, lengkapi data kontak Anda (Nama, WhatsApp, Email). Masukkan kode voucher promo jika ada untuk mendapatkan potongan harga.',
      icon: ShoppingBag,
    },
    {
      num: '03',
      title: 'Scan QRIS & Transfer Tepat',
      desc: 'Buka aplikasi e-Wallet atau m-Banking pilihan Anda (BCA, GoPay, OVO, DANA, dll). Scan QRIS resmi toko dan bayar sesuai nominal total tagihan.',
      icon: QrCode,
    },
    {
      num: '04',
      title: 'Upload Bukti & Verifikasi',
      desc: 'Unggah tangkapan layar bukti transfer Anda. Admin toko kami akan memverifikasi dana yang masuk dalam estimasi 5-15 menit kerja.',
      icon: Clock,
    },
    {
      num: '05',
      title: 'Serah Terima Kredensial Akun',
      desc: 'Setelah pembayaran terverifikasi sah (Status COMPLETED), kredensial login akun akan langsung terbuka di halaman pesanan Anda dan siap dimainkan!',
      icon: Key,
    },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      <div className="text-center space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Panduan Transaksi</span>
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white uppercase">
          Cara Order Akun Gaming di {settings.storeName}
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Transaksi mudah, otomatis, dan bergaransi aman 100%. Ikuti 5 langkah sederhana berikut:
        </p>
      </div>

      {/* Stepper Timeline */}
      <div className="space-y-6">
        {steps.map((step, idx) => {
          const Icon = step.icon;
          return (
            <div
              key={step.num}
              className="flex items-start gap-4 sm:gap-6 p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-cyan-500/30 transition-all shadow-lg"
            >
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center font-bold text-sm shrink-0">
                <Icon className="w-5 h-5" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-cyan-400">LANGKAH {step.num}</span>
                  <span className="text-slate-600">·</span>
                  <h3 className="text-base font-bold text-white">{step.title}</h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{step.desc}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Trust Notice */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/40 to-slate-900 border border-blue-500/20 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-cyan-400 shrink-0" />
          <div className="text-xs">
            <h4 className="font-bold text-white text-sm">Garansi Resmi Anti-Hackback</h4>
            <p className="text-slate-400 mt-0.5">
              Seluruh akun yang diperjualbelikan merupakan akun tangan pertama atau unbind bersih terverifikasi.
            </p>
          </div>
        </div>
        <button
          onClick={onBrowseProducts}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0 flex items-center gap-1.5"
        >
          <span>Pilih Akun Sekarang</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
