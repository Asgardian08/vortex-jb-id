import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Voucher } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import { Plus, Tag, Trash2, Edit, CheckCircle2, XCircle } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

export const AdminVouchersPage: React.FC = () => {
  const { vouchers, createVoucher, updateVoucher, deleteVoucher } = useStore();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingVoucherId, setEditingVoucherId] = useState<string | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  // Form states
  const [code, setCode] = useState('');
  const [name, setName] = useState('');
  const [discountType, setDiscountType] = useState<'PERCENTAGE' | 'FIXED'>('PERCENTAGE');
  const [discountValue, setDiscountValue] = useState<number>(10);
  const [minimumPurchase, setMinimumPurchase] = useState<number>(100000);
  const [maximumDiscount, setMaximumDiscount] = useState<number>(50000);
  const [usageLimit, setUsageLimit] = useState<number>(100);
  const [perUserLimit, setPerUserLimit] = useState<number>(1);
  const [expiresAt, setExpiresAt] = useState('2026-12-31');
  const [active, setActive] = useState(true);

  const handleOpenCreate = () => {
    setEditingVoucherId(null);
    setCode('');
    setName('');
    setDiscountType('PERCENTAGE');
    setDiscountValue(10);
    setMinimumPurchase(100000);
    setMaximumDiscount(50000);
    setUsageLimit(50);
    setPerUserLimit(1);
    setExpiresAt('2026-12-31');
    setActive(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (v: Voucher) => {
    setEditingVoucherId(v.id);
    setCode(v.code);
    setName(v.name);
    setDiscountType(v.discountType);
    setDiscountValue(v.discountValue);
    setMinimumPurchase(v.minimumPurchase);
    setMaximumDiscount(v.maximumDiscount);
    setUsageLimit(v.usageLimit);
    setPerUserLimit(v.perUserLimit);
    setExpiresAt(v.expiresAt.slice(0, 10));
    setActive(v.active);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      error('Mohon isi kode voucher.');
      return;
    }
    if (!name.trim()) {
      error('Mohon isi nama promo voucher.');
      return;
    }

    const payload = {
      code: code.trim().toUpperCase(),
      name: name.trim(),
      discountType,
      discountValue: Number(discountValue),
      minimumPurchase: Number(minimumPurchase),
      maximumDiscount: Number(maximumDiscount),
      usageLimit: Number(usageLimit),
      perUserLimit: Number(perUserLimit),
      startAt: new Date().toISOString(),
      expiresAt: new Date(expiresAt).toISOString(),
      active,
    };

    if (editingVoucherId) {
      updateVoucher(editingVoucherId, payload);
    } else {
      createVoucher(payload);
    }
    setIsModalOpen(false);
  };

  const handleConfirmDelete = () => {
    if (deleteTargetId) {
      deleteVoucher(deleteTargetId);
      setDeleteTargetId(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
            Manajemen Voucher & Diskon
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Buat voucher promo untuk menarik lebih banyak pembeli akun gaming ke toko Anda.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Buat Voucher Baru</span>
        </button>
      </div>

      {/* Vouchers Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Kode Voucher</th>
              <th className="py-3 px-3">Nama Promo</th>
              <th className="py-3 px-3">Potongan Diskon</th>
              <th className="py-3 px-3">Min. Belanja</th>
              <th className="py-3 px-3 text-center">Penggunaan</th>
              <th className="py-3 px-3">Berlaku Hingga</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {vouchers.map((v) => (
              <tr key={v.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3 font-mono font-bold text-cyan-400 text-sm">
                  {v.code}
                </td>

                <td className="py-3.5 px-3 font-medium text-white">
                  {v.name}
                </td>

                <td className="py-3.5 px-3">
                  <span className="font-semibold text-slate-200">
                    {v.discountType === 'PERCENTAGE'
                      ? `${v.discountValue}% (Maks. Rp ${v.maximumDiscount.toLocaleString('id-ID')})`
                      : `Rp ${v.discountValue.toLocaleString('id-ID')}`}
                  </span>
                </td>

                <td className="py-3.5 px-3 tabular-nums text-slate-300">
                  Rp {v.minimumPurchase.toLocaleString('id-ID')}
                </td>

                <td className="py-3.5 px-3 text-center tabular-nums text-slate-300">
                  <span className="font-bold text-white">{v.usedCount}</span> / {v.usageLimit}x
                </td>

                <td className="py-3.5 px-3 text-slate-400 tabular-nums">
                  {new Date(v.expiresAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    year: 'numeric',
                  })}
                </td>

                <td className="py-3.5 px-3 text-center">
                  <button
                    onClick={() => updateVoucher(v.id, { active: !v.active })}
                    className={`px-2.5 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                      v.active
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-slate-800 text-slate-500 border-slate-700'
                    }`}
                  >
                    {v.active ? 'Aktif' : 'Nonaktif'}
                  </button>
                </td>

                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1">
                    <button
                      onClick={() => handleOpenEdit(v)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Edit Voucher"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteTargetId(v.id)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                      title="Hapus Voucher"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add / Edit Voucher Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {editingVoucherId ? 'Perbarui Voucher' : 'Buat Voucher Baru'}
                </span>
                <h3 className="font-heading text-xl font-bold text-white uppercase mt-0.5">
                  Formulir Voucher Toko
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Kode Voucher</label>
                  <input
                    type="text"
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="Contoh: VORTEX20"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono uppercase focus:outline-none focus:border-cyan-500/50"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nama Voucher</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Contoh: Promo Gajian Gamer"
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Tipe Diskon</label>
                  <select
                    value={discountType}
                    onChange={(e) => setDiscountType(e.target.value as any)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  >
                    <option value="PERCENTAGE">Persentase (%)</option>
                    <option value="FIXED">Nominal Tetap (Rp)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Nilai Diskon {discountType === 'PERCENTAGE' ? '(%)' : '(Rp)'}
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={discountValue}
                    onChange={(e) => setDiscountValue(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Minimal Pembelian (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={minimumPurchase}
                    onChange={(e) => setMinimumPurchase(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Maksimal Diskon (Rp)</label>
                  <input
                    type="number"
                    min="0"
                    step="1000"
                    value={maximumDiscount}
                    onChange={(e) => setMaximumDiscount(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Batas Kuota Penggunaan</label>
                  <input
                    type="number"
                    min="1"
                    value={usageLimit}
                    onChange={(e) => setUsageLimit(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Berlaku Sampai Tanggal</label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="activeVoucher"
                  checked={active}
                  onChange={(e) => setActive(e.target.checked)}
                  className="rounded bg-slate-950 border-slate-800 text-cyan-500 focus:ring-0"
                />
                <label htmlFor="activeVoucher" className="text-slate-300 font-medium cursor-pointer">
                  Aktifkan voucher ini langsung di etalase toko
                </label>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-400 hover:text-white bg-slate-800"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white font-semibold bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20"
                >
                  Simpan Voucher
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleConfirmDelete}
        title="Hapus Voucher?"
        message="Voucher ini akan dihapus permanen dan tidak dapat digunakan lagi oleh pelanggan."
        confirmLabel="Ya, Hapus Voucher"
        variant="danger"
      />
    </div>
  );
};
