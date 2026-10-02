import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ChevronDown, HelpCircle, ShieldCheck, MessageCircle } from 'lucide-react';

export const FaqPage: React.FC = () => {
  const { settings } = useStore();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Apakah akun yang dijual di Vortex ID bergaransi?',
      a: 'Ya, semua akun yang Anda beli di Vortex ID memiliki garansi resmi anti-hackback. Apabila terjadi kendala pada data login yang bukan diakibatkan kelalaian pembeli (misal terkena phising pihak ketiga), tim kami siap membantu recovery atau refund sesuai ketentuan.',
    },
    {
      q: 'Bagaimana cara serah terima akun setelah pembayaran?',
      a: 'Setelah pembayaran QRIS berhasil Anda transfer dan diverifikasi oleh admin toko, halaman Pesanan Anda otomatis berubah menjadi COMPLETED dan kredensial login (Username, Password, Email Recovery) akan langsung ditampilkan.',
    },
    {
      q: 'Apakah bisa ganti email login ke email pribadi saya?',
      a: 'Bisa banget! Akun yang kami jual berstatus "All Unbind / Sepaket Email". Anda dapat mengubah email Moonton, Riot ID, Google, atau Hoyoverse langsung ke email pribadi Anda. Admin kami juga siap memandu 1-on-1 via WhatsApp.',
    },
    {
      q: 'Metode pembayaran apa saja yang didukung?',
      a: 'Kami menggunakan QRIS Nasional resmi yang kompatibel dengan seluruh bank di Indonesia (BCA, Mandiri, BRI, BNI, CIMB) serta semua dompet digital (GoPay, OVO, DANA, ShopeePay, LinkAja).',
    },
    {
      q: 'Berapa lama proses verifikasi pembayaran berlangsung?',
      a: 'Verifikasi biasanya membutuhkan waktu antara 5 hingga 15 menit pada jam operasional toko (08:00 - 23:00 WIB). Di luar jam tersebut, verifikasi akan diproses pada antrean pertama pagi hari.',
    },
    {
      q: 'Apakah bisa membatalkan pesanan yang sudah dibuat?',
      a: 'Pesanan dengan status PENDING (belum dibayar atau belum diproses serah terima) dapat dibatalkan langsung melalui tombol "Batalkan Pesanan" di halaman detail pesanan.',
    },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Pusat Bantuan</span>
        <h1 className="font-heading text-3xl font-bold text-white uppercase">
          Frequently Asked Questions (FAQ)
        </h1>
        <p className="text-xs sm:text-sm text-slate-400">
          Pertanyaan umum seputar keamanan, serah terima akun, dan metode pembayaran di {settings.storeName}.
        </p>
      </div>

      <div className="space-y-3">
        {faqs.map((faq, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-slate-900 border border-slate-800 overflow-hidden transition-all shadow-md"
            >
              <button
                onClick={() => setOpenIndex(isOpen ? null : idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 font-semibold text-sm text-white hover:text-cyan-400 transition-colors"
              >
                <span>{faq.q}</span>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                    isOpen ? 'rotate-180 text-cyan-400' : ''
                  }`}
                />
              </button>

              {isOpen && (
                <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-400 border-t border-slate-800/80 leading-relaxed animate-in fade-in duration-200">
                  {faq.a}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Still need help CTA */}
      <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 text-center space-y-3">
        <p className="text-sm font-semibold text-white">Masih punya pertanyaan yang belum terjawab?</p>
        <p className="text-xs text-slate-400">Hubungi langsung admin resmi kami melalui WhatsApp untuk respon instan.</p>
        <button
          onClick={() => {
            let phone = settings.contact.whatsapp.replace(/\D/g, '');
            if (phone.startsWith('0')) {
              phone = '62' + phone.substring(1);
            }
            window.open(`https://wa.me/${phone}`, '_blank');
          }}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs shadow-lg transition-all"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Chat WhatsApp Admin</span>
        </button>
      </div>
    </div>
  );
};
