import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { useToast } from '../../context/StoreContext';
import {
  Star,
  Trash2,
  Search,
  Filter,
  ShieldCheck,
  Zap,
  ShoppingBag,
  MessageSquare,
  Sparkles,
} from 'lucide-react';
import { ConfirmModal } from '../../components/common/ConfirmModal';

export const AdminReviewsPage: React.FC = () => {
  const { reviews, deleteReview, averageRatings } = useStore();
  const { success } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);

  const filteredReviews = reviews.filter((rev) => {
    if (filterRating !== 'ALL') {
      const star = Math.max(rev.productRating || 0, rev.serviceRating || 0);
      if (star !== filterRating) return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = rev.userName.toLowerCase().includes(q);
      const matchComment = rev.comment.toLowerCase().includes(q);
      const matchProd = rev.productName?.toLowerCase().includes(q);
      if (!matchName && !matchComment && !matchProd) return false;
    }
    return true;
  });

  const handleDeleteConfirm = () => {
    if (deleteTargetId) {
      deleteReview(deleteTargetId);
      setDeleteTargetId(null);
      success('Ulasan berhasil dihapus.');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            Manajemen Kepuasan Pelanggan
          </span>
          <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-wide mt-0.5">
            Ulasan & Rating Layanan / Produk
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Pantau feedback nyata pembeli, evaluasi kecepatan respon layanan admin, dan kualitas akun game.
          </p>
        </div>
      </div>

      {/* Aggregate KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Service Rating */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rating Layanan & CS</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {averageRatings.serviceAverage > 0 ? averageRatings.serviceAverage.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-slate-500">/ 5.0</span>
          </div>
          <div className="flex items-center text-cyan-400 gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3 h-3 fill-current" />
            ))}
          </div>
        </div>

        {/* Metric 2: Product Rating */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Rating Kualitas Akun</span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white tracking-tight">
              {averageRatings.productAverage > 0 ? averageRatings.productAverage.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-slate-500">/ 5.0</span>
          </div>
          <div className="flex items-center text-amber-400 gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3 h-3 fill-current" />
            ))}
          </div>
        </div>

        {/* Metric 3: Total Reviews */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Ulasan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <MessageSquare className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {reviews.length} Ulasan
          </div>
          <p className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-3 h-3" />
            <span>100% Pembeli Terverifikasi</span>
          </p>
        </div>

        {/* Metric 4: 5-Star Ratio */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tingkat Kepuasan 5★</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            {reviews.length > 0
              ? `${Math.round(
                  (reviews.filter((r) => r.serviceRating === 5 && r.productRating === 5).length /
                    reviews.length) *
                    100
                )}%`
              : '100%'}
          </div>
          <p className="text-[11px] text-slate-400">Memberi bintang 5 sempurna</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pembeli, komentar, atau produk..."
            className="w-full pl-9 pr-4 py-2 rounded-xl text-xs bg-slate-900 border border-slate-800 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <button
            onClick={() => setFilterRating('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors ${
              filterRating === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
            }`}
          >
            Semua Bintang
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-colors ${
                filterRating === star
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-800'
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>
      </div>

      {/* Reviews Table / List */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-300">
            <thead className="bg-slate-950/80 text-[11px] uppercase tracking-wider text-slate-400 border-b border-slate-800">
              <tr>
                <th className="px-5 py-3.5 font-bold">Pelanggan</th>
                <th className="px-5 py-3.5 font-bold">Rating Layanan</th>
                <th className="px-5 py-3.5 font-bold">Rating Produk</th>
                <th className="px-5 py-3.5 font-bold">Produk / Akun</th>
                <th className="px-5 py-3.5 font-bold">Isi Ulasan & Komentar</th>
                <th className="px-5 py-3.5 font-bold">Waktu</th>
                <th className="px-5 py-3.5 font-bold text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80">
              {filteredReviews.length > 0 ? (
                filteredReviews.map((rev) => (
                  <tr key={rev.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs shrink-0">
                          {rev.userName.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <p className="font-semibold text-white">{rev.userName}</p>
                          <span className="text-[10px] text-emerald-400 flex items-center gap-1 font-medium">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Terverifikasi</span>
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-cyan-400">
                        {Array.from({ length: rev.serviceRating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-cyan-400" />
                        ))}
                        <span className="font-bold ml-1 text-white">{rev.serviceRating || 5}.0</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-amber-400">
                        {Array.from({ length: rev.productRating || 5 }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                        ))}
                        <span className="font-bold ml-1 text-white">{rev.productRating || 5}.0</span>
                      </div>
                    </td>

                    <td className="px-5 py-4">
                      {rev.productName ? (
                        <div className="flex items-center gap-1.5 text-slate-200 max-w-[180px]">
                          <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                          <span className="truncate">{rev.productName}</span>
                        </div>
                      ) : (
                        <span className="text-slate-500 italic">Layanan Toko</span>
                      )}
                    </td>

                    <td className="px-5 py-4">
                      <p className="text-slate-300 max-w-sm line-clamp-2 leading-relaxed">
                        "{rev.comment}"
                      </p>
                    </td>

                    <td className="px-5 py-4 text-slate-400 whitespace-nowrap text-[11px]">
                      {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    <td className="px-5 py-4 text-right">
                      <button
                        onClick={() => setDeleteTargetId(rev.id)}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                        title="Hapus Ulasan"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-500">
                    Belum ada ulasan yang sesuai dengan pencarian atau filter Anda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={Boolean(deleteTargetId)}
        onClose={() => setDeleteTargetId(null)}
        onConfirm={handleDeleteConfirm}
        title="Hapus Ulasan Pelanggan?"
        description="Apakah Anda yakin ingin menghapus ulasan ini? Rating rata-rata produk dan layanan akan dihitung ulang secara otomatis."
        confirmText="Ya, Hapus Ulasan"
        variant="danger"
      />
    </div>
  );
};
