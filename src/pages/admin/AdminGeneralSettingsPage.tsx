import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Save, Settings, Phone, MessageSquare, Send, Instagram, Video, FileText, Trash2, AlertTriangle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminGeneralSettingsPage: React.FC = () => {
  const { settings, updateSettings, resetToCleanSlate, resetProductsOnly, resetToFactory } = useStore();
  const { success } = useToast();

  const [whatsapp, setWhatsapp] = useState(settings.contact.whatsapp);
  const [telegram, setTelegram] = useState(settings.contact.telegram);
  const [instagram, setInstagram] = useState(settings.contact.instagram);
  const [tiktok, setTiktok] = useState(settings.contact.tiktok);
  const [email, setEmail] = useState(settings.contact.email);

  const [invoicePrefix, setInvoicePrefix] = useState(settings.invoicePrefix);
  const [invoiceFooterText, setInvoiceFooterText] = useState(settings.invoiceFooterText);
  const [isWipeModalOpen, setIsWipeModalOpen] = useState(false);
  const [isWipeProductsModalOpen, setIsWipeProductsModalOpen] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      contact: {
        whatsapp: whatsapp.trim() || '085819822250',
        telegram: telegram.trim(),
        instagram: instagram.trim(),
        tiktok: tiktok.trim(),
        email: email.trim(),
      },
      invoicePrefix: invoicePrefix.trim().toUpperCase() || 'VX',
      invoiceFooterText: invoiceFooterText.trim(),
    });
    success('Pengaturan umum dan channel customer support berhasil disimpan.');
  };

  const handleConfirmWipe = () => {
    resetToCleanSlate();
    setIsWipeModalOpen(false);
  };

  const handleConfirmWipeProducts = () => {
    resetProductsOnly();
    setIsWipeProductsModalOpen(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
          Pengaturan Umum & Kontak Support
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Atur nomor WhatsApp admin, akun media sosial untuk channel support, serta format prefix nomor invoice.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* Contact Channels */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-cyan-400" />
            <span>Channel Customer Support & Media Sosial</span>
          </h2>
          <p className="text-[11px] text-slate-400">
            Nomor WhatsApp ini digunakan untuk tombol "Hubungi Admin" dan konfirmasi serah terima akun kepada pembeli.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Admin Resmi</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={whatsapp}
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="085819822250"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Dukungan Pelanggan</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="support@vortex.id"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Username Telegram</label>
              <div className="relative">
                <Send className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={telegram}
                  onChange={(e) => setTelegram(e.target.value)}
                  placeholder="vortexid_support"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Akun Instagram</label>
              <div className="relative">
                <Instagram className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={instagram}
                  onChange={(e) => setInstagram(e.target.value)}
                  placeholder="vortexid.store"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Akun TikTok Official</label>
              <div className="relative">
                <Video className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={tiktok}
                  onChange={(e) => setTiktok(e.target.value)}
                  placeholder="vortexid.official"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Invoice Settings */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Format & Catatan Invoice</span>
          </h2>

          <div className="space-y-3">
            <div className="max-w-xs">
              <label className="block text-slate-300 font-semibold mb-1">Awalan / Prefix Order ID</label>
              <input
                type="text"
                required
                maxLength={6}
                value={invoicePrefix}
                onChange={(e) => setInvoicePrefix(e.target.value.toUpperCase())}
                placeholder="VX"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase font-bold"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Contoh hasil: {invoicePrefix || 'VX'}-20261002-0001
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Catatan Kaki Invoice (Syarat & Garansi)</label>
              <textarea
                rows={3}
                value={invoiceFooterText}
                onChange={(e) => setInvoiceFooterText(e.target.value)}
                className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan</span>
          </button>
        </div>
      </form>

      {/* Danger Zone: Wipe all data to zero */}
      <div className="p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 text-rose-400">
          <AlertTriangle className="w-5 h-5 shrink-0" />
          <h2 className="text-sm font-bold uppercase tracking-wider">
            Zona Pengosongan Data Toko (Mulai dari Nol)
          </h2>
        </div>
        <p className="text-xs text-slate-300 leading-relaxed">
          Gunakan opsi di bawah ini jika Anda ingin mengosongkan stok akun atau seluruh transaksi toko agar bersih menjadi <strong>0</strong>.
          Branding toko, nama, logo, QRIS, dan akun Admin Anda tidak akan terhapus. Toko akan bersih total sehingga Anda dapat mulai menginput stok akun game riil Anda dari awal (maksimal 10 slide foto per produk).
        </p>

        <div className="pt-2 flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setIsWipeProductsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-rose-300 hover:text-white bg-rose-950/60 hover:bg-rose-900/80 border border-rose-500/40 transition-all shadow-sm"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>Kosongkan Stok Akun (Hanya Produk = 0)</span>
          </button>

          <button
            type="button"
            onClick={() => setIsWipeModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-rose-600 hover:bg-rose-500 shadow-lg shadow-rose-600/20 transition-all"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Total Toko ke 0 (Produk, Pesanan, & Voucher)</span>
          </button>

          <button
            type="button"
            onClick={resetToFactory}
            className="text-xs font-semibold text-slate-400 hover:text-white px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Muat Ulang Demo Data
          </button>
        </div>
      </div>

      {/* Modal for Products Wipe */}
      <ConfirmModal
        isOpen={isWipeProductsModalOpen}
        onClose={() => setIsWipeProductsModalOpen(false)}
        onConfirm={handleConfirmWipeProducts}
        title="Kosongkan Semua Stok Produk ke 0?"
        message="PERINGATAN: Seluruh stok produk akun akan dihapus sehingga etalase menjadi 0. Data transaksi yang sudah ada sebelumnya dan voucher tidak akan dihapus. Anda dapat mulai mengisi stok baru."
        confirmLabel="Ya, Kosongkan Stok Akun"
        variant="danger"
      />

      {/* Modal for Total Wipe */}
      <ConfirmModal
        isOpen={isWipeModalOpen}
        onClose={() => setIsWipeModalOpen(false)}
        onConfirm={handleConfirmWipe}
        title="Konfirmasi Reset Total Semua Data ke Nol"
        message="PERINGATAN: Semua produk di etalase, seluruh riwayat transaksi, dan kupon voucher akan dihapus permanen menjadi 0 agar Anda dapat mulai mengisi stok baru dari awal. Apakah Anda yakin?"
        confirmLabel="Ya, Kosongkan Semua Data Sekarang"
        variant="danger"
      />
    </div>
  );
};
