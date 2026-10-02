import React from 'react';
import { useStore } from '../../context/StoreContext';
import { ShieldCheck, MessageCircle, Send, Instagram, Video, HelpCircle } from 'lucide-react';

interface FooterProps {
  onNavigate: (path: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const { settings } = useStore();

  const openWhatsApp = () => {
    let phone = settings.contact.whatsapp.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    const text = encodeURIComponent(`Halo Admin ${settings.storeName}, saya ingin bertanya mengenai jual-beli akun game.`);
    window.open(`https://wa.me/${phone}?text=${text}`, '_blank');
  };

  return (
    <footer className="w-full border-t border-white/5 bg-slate-950/90 text-slate-400 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Col 1: Store Brand */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              {settings.logo ? (
                <img
                  src={settings.logo}
                  alt={settings.storeName}
                  className="w-8 h-8 rounded-lg object-contain border border-cyan-500/30"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                  V
                </div>
              )}
              <span className="font-heading text-lg font-bold text-white tracking-wider uppercase">
                {settings.storeName}
              </span>
            </div>
            <p className="text-slate-300 font-medium">{settings.tagline}</p>
            <p className="text-slate-500 leading-relaxed text-[11px]">
              Platform transaksi akun game terpercaya dengan verifikasi pembayaran resmi QRIS nasional, keamanan data, dan nota otomatis.
            </p>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Navigasi Toko</h4>
            <ul className="space-y-2">
              <li>
                <button onClick={() => onNavigate('/')} className="hover:text-cyan-400 transition-colors">
                  Beranda
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/products')} className="hover:text-cyan-400 transition-colors">
                  Katalog Akun Gaming
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/how-to-order')} className="hover:text-cyan-400 transition-colors">
                  Panduan Cara Order
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/orders')} className="hover:text-cyan-400 transition-colors">
                  Status & Riwayat Pesanan
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('/faq')} className="hover:text-cyan-400 transition-colors">
                  FAQ & Garansi Akun
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Safe Gaming Policy */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Keamanan & Garansi</h4>
            <div className="space-y-2 text-[11px] text-slate-400">
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                <span>Garansi anti-hackback sesuai syarat & ketentuan toko.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>Kredensial akun hanya diserahkan secara privat setelah status order COMPLETED.</span>
              </div>
              <div className="flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>Verifikasi manual oleh admin untuk mencegah penipuan.</span>
              </div>
            </div>
          </div>

          {/* Col 4: Contact & Social */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold uppercase tracking-wider text-[11px]">Customer Support</h4>
            <p className="text-[11px] text-slate-400">Butuh bantuan transaksi atau konsultasi akun?</p>
            <button
              onClick={openWhatsApp}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg shadow-emerald-600/20 transition-all w-full justify-center"
            >
              <MessageCircle className="w-4 h-4" />
              <span>Chat WhatsApp Admin</span>
            </button>
            <div className="flex items-center gap-3 pt-2 text-slate-400">
              {settings.contact.telegram && (
                <a
                  href={`https://t.me/${settings.contact.telegram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-400 transition-colors"
                  title="Telegram"
                >
                  <Send className="w-4 h-4" />
                </a>
              )}
              {settings.contact.instagram && (
                <a
                  href={`https://instagram.com/${settings.contact.instagram}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-pink-400 transition-colors"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4" />
                </a>
              )}
              {settings.contact.tiktok && (
                <a
                  href={`https://tiktok.com/@${settings.contact.tiktok}`}
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-cyan-300 transition-colors"
                  title="TikTok"
                >
                  <Video className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} {settings.storeName}. All rights reserved.</p>
          <p className="text-center sm:text-right">
            Transaksi dan kepemilikan akun wajib mematuhi ketentuan layanan penerbit game bersangkutan.
          </p>
        </div>
      </div>
    </footer>
  );
};
