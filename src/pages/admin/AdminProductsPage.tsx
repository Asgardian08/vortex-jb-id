import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Plus,
  Search,
  Copy,
  Edit,
  Archive,
  Eye,
  CheckCircle2,
  Trash2,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AdminProductsPageProps {
  onAddNewProduct: () => void;
  onEditProduct: (productId: string) => void;
}

export const AdminProductsPage: React.FC<AdminProductsPageProps> = ({
  onAddNewProduct,
  onEditProduct,
}) => {
  const { products, archiveProduct, duplicateProduct, updateProduct, resetProductsOnly, resetToFactory } = useStore();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [archiveTargetId, setArchiveTargetId] = useState<string | null>(null);
  const [isResetStockModalOpen, setIsResetStockModalOpen] = useState(false);

  const games = Array.from(new Set(products.map((p) => p.game)));

  const filtered = products.filter((p) => {
    if (selectedGame !== 'ALL' && p.game !== selectedGame) return false;
    if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = p.name.toLowerCase().includes(q);
      const matchRank = p.rank.toLowerCase().includes(q);
      if (!matchName && !matchRank) return false;
    }
    return true;
  });

  const handleDuplicate = (productId: string) => {
    duplicateProduct(productId);
  };

  const handleConfirmArchive = () => {
    if (archiveTargetId) {
      archiveProduct(archiveTargetId);
      setArchiveTargetId(null);
    }
  };

  const handleToggleStatus = (p: Product) => {
    const nextStatus = p.status === 'AVAILABLE' ? 'SOLD' : 'AVAILABLE';
    updateProduct(p.id, { status: nextStatus, badge: nextStatus === 'SOLD' ? 'SOLD' : 'AVAILABLE' });
  };

  const handleConfirmResetStock = () => {
    resetProductsOnly();
    setIsResetStockModalOpen(false);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
            Kelola Akun Gaming
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar semua akun game yang diunggah. Edit, ubah status, duplikasi, atau arsipkan produk (Maks 10 slide foto per akun).
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
          {products.length > 0 && (
            <button
              type="button"
              onClick={() => setIsResetStockModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl font-semibold text-xs text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-all shadow-sm"
              title="Kosongkan seluruh produk akun agar stok menjadi 0 dan siap diisi dari awal"
            >
              <Trash2 className="w-4 h-4 text-rose-400" />
              <span>Kosongkan Stok (Reset ke 0)</span>
            </button>
          )}

          <button
            onClick={onAddNewProduct}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Akun Baru</span>
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama atau rank..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-2">
          <select
            value={selectedGame}
            onChange={(e) => setSelectedGame(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">Semua Game</option>
            {games.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
          >
            <option value="ALL">Semua Status</option>
            <option value="AVAILABLE">Tersedia (Ready)</option>
            <option value="SOLD">Terjual</option>
            <option value="HIDDEN">Disembunyikan</option>
            <option value="ARCHIVED">Diarsipkan (Soft Delete)</option>
          </select>
        </div>
      </div>

      {/* Products Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Produk & Game</th>
              <th className="py-3 px-3">Rank / Spesifikasi</th>
              <th className="py-3 px-3 text-right">Harga Normal</th>
              <th className="py-3 px-3 text-right">Harga Final</th>
              <th className="py-3 px-3 text-center">Status</th>
              <th className="py-3 px-3 text-center">Views / Sales</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filtered.map((p) => {
              const isArchived = p.status === 'ARCHIVED';
              return (
                <tr key={p.id} className="hover:bg-slate-800/40 transition-colors">
                  <td className="py-3.5 px-3">
                    <div className="flex items-center gap-3">
                      <img
                        src={p.images[0] || '/src/assets/images/mlbb_mythic_showcase_1790923035330.jpg'}
                        alt={p.name}
                        className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                      />
                      <div className="min-w-0">
                        <p className="font-semibold text-white truncate max-w-[200px]">{p.name}</p>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                          {p.game} · {p.platform}
                        </span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3.5 px-3">
                    <p className="font-medium text-slate-200">{p.rank}</p>
                    <p className="text-[11px] text-slate-400">
                      {p.skinCount} Skin · Level {p.level}
                    </p>
                  </td>

                  <td className="py-3.5 px-3 text-right tabular-nums text-slate-400">
                    Rp {p.price.toLocaleString('id-ID')}
                  </td>

                  <td className="py-3.5 px-3 text-right tabular-nums font-bold text-white">
                    Rp {p.finalPrice.toLocaleString('id-ID')}
                  </td>

                  <td className="py-3.5 px-3 text-center">
                    <button
                      onClick={() => handleToggleStatus(p)}
                      title="Klik untuk ubah status cepat (Tersedia / Terjual)"
                      className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border transition-colors ${
                        p.status === 'AVAILABLE'
                          ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20'
                          : p.status === 'SOLD'
                          ? 'bg-rose-500/10 text-rose-400 border-rose-500/30 hover:bg-rose-500/20'
                          : p.status === 'ARCHIVED'
                          ? 'bg-slate-800 text-slate-500 border-slate-700'
                          : 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                      }`}
                    >
                      {p.status}
                    </button>
                  </td>

                  <td className="py-3.5 px-3 text-center tabular-nums text-slate-400">
                    <span className="text-white font-medium">{p.views}</span> v /{' '}
                    <span className="text-cyan-400 font-medium">{p.salesCount || 0}</span> s
                  </td>

                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button
                        onClick={() => onEditProduct(p.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
                        title="Edit Produk"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDuplicate(p.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-300 transition-colors"
                        title="Duplikasi Produk"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                      {!isArchived && (
                        <button
                          onClick={() => setArchiveTargetId(p.id)}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-950/60 text-slate-400 hover:text-rose-400 transition-colors"
                          title="Arsipkan Produk (Soft Delete)"
                        >
                          <Archive className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* If completely 0 products in store */}
        {products.length === 0 && (
          <div className="py-16 text-center space-y-4 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-slate-800/80 border border-slate-700 flex items-center justify-center mx-auto text-slate-400">
              <Sparkles className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="space-y-1">
              <h3 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
                Stok Akun Masih Kosong (0 Produk)
              </h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toko Anda siap untuk diisi stok akun game riil. Setiap produk dapat mengunggah hingga <strong>10 slide foto showcase</strong> untuk memikat calon pembeli.
              </p>
            </div>
            <div className="pt-2 flex items-center justify-center gap-3 flex-wrap">
              <button
                type="button"
                onClick={onAddNewProduct}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>Tambah Akun Pertama (Maks 10 Slide)</span>
              </button>
              <button
                type="button"
                onClick={resetToFactory}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>Muat Data Contoh Demo</span>
              </button>
            </div>
          </div>
        )}

        {/* If products exist but filter returns 0 */}
        {products.length > 0 && filtered.length === 0 && (
          <div className="py-12 text-center space-y-3">
            <p className="text-xs font-semibold text-slate-300">Tidak ada produk yang cocok dengan pencarian filter.</p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedGame('ALL');
                setSelectedStatus('ALL');
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              Reset Filter Pencarian
            </button>
          </div>
        )}
      </div>

      {/* Confirmation Dialog for Soft Delete / Archive */}
      <ConfirmModal
        isOpen={Boolean(archiveTargetId)}
        onClose={() => setArchiveTargetId(null)}
        onConfirm={handleConfirmArchive}
        title="Arsipkan Akun Gaming?"
        message="Produk ini akan diarsipkan (soft delete) dan tidak akan tampil di storefront pelanggan, namun histori transaksi yang telah terjadi akan tetap tersimpan aman di database."
        confirmLabel="Ya, Arsipkan Produk"
        variant="warning"
      />

      {/* Confirmation Dialog to Reset Products Stock to 0 */}
      <ConfirmModal
        isOpen={isResetStockModalOpen}
        onClose={() => setIsResetStockModalOpen(false)}
        onConfirm={handleConfirmResetStock}
        title="Kosongkan Semua Stok Produk ke 0?"
        message="PERINGATAN: Seluruh stok akun gaming akan dihapus dari etalase sehingga stok menjadi 0. Pengaturan toko, nama, logo, QRIS, dan akses akun Admin Anda tetap aman tersimpan. Anda siap memasukkan stok produk asli toko dari awal."
        confirmLabel="Ya, Kosongkan Semua Stok ke 0"
        variant="danger"
      />
    </div>
  );
};
