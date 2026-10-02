import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ImageUploader } from '../../components/common/ImageUploader';
import { QrCode, Save, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminPaymentSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const { success } = useToast();

  const [qrisImage, setQrisImage] = useState(settings.qrisImage);
  const [qrisActive, setQrisActive] = useState(settings.qrisActive);
  const [instructions, setInstructions] = useState(settings.paymentInstructions);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSettings({
      qrisImage,
      qrisActive,
      paymentInstructions: instructions,
    });
    success('Pengaturan QRIS dan instruksi pembayaran berhasil disimpan.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
          Pengaturan QRIS & Pembayaran Toko
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Unggah barcode QRIS toko resmi Anda (BCA, GoPay, OVO, ShopeePay, DANA). QRIS ini otomatis muncul di halaman checkout pelanggan.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <QrCode className="w-4 h-4 text-emerald-400" />
              <span>Gambar Barcode QRIS Resmi</span>
            </h2>

            {/* QRIS Active Toggle */}
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={qrisActive}
                onChange={(e) => setQrisActive(e.target.checked)}
                className="rounded bg-slate-950 border-slate-800 text-emerald-500 focus:ring-0"
              />
              <span className="text-xs font-semibold text-slate-300">
                {qrisActive ? 'QRIS Aktif' : 'QRIS Dinonaktifkan'}
              </span>
            </label>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
            <div className="md:col-span-5">
              <ImageUploader
                value={qrisImage}
                onChange={setQrisImage}
                label="Upload File QRIS (Rasio 1:1)"
                helperText="Upload gambar QRIS statis atau dinamis merchant Anda"
                aspectRatio="square"
              />
            </div>

            <div className="md:col-span-7 space-y-3 text-xs">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2">
                <span className="font-semibold text-white block">Status Integrasi QRIS:</span>
                <p className="text-slate-400 leading-relaxed">
                  Ketika pelanggan melakukan checkout, QRIS ini akan ditampilkan bersama nominal tagihan yang harus dibayar.
                  Pelanggan selanjutnya dapat mengunggah bukti transfer, dan status order akan masuk ke antrean verifikasi Anda.
                </p>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Instruksi Langkah Pembayaran (Ditampilkan di Checkout)
                </label>
                <textarea
                  rows={6}
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-emerald-500/50 leading-relaxed font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Simpan Pengaturan QRIS</span>
          </button>
        </div>
      </form>
    </div>
  );
};
