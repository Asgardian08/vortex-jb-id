import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { useToast } from '../context/StoreContext';
import {
  Star,
  ShieldCheck,
  Zap,
  MessageCircle,
  Plus,
  X,
  Search,
  CheckCircle2,
  Lock,
  Sparkles,
  ShoppingBag,
} from 'lucide-react';

interface ReviewsPageProps {
  onBrowseProducts: () => void;
}

export const ReviewsPage: React.FC<ReviewsPageProps> = ({ onBrowseProducts }) => {
  const { reviews, createReview, averageRatings, currentUser, products, settings } = useStore();
  const { success, error } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterRating, setFilterRating] = useState<number | 'ALL'>('ALL');
  const [filterType, setFilterType] = useState<'ALL' | 'SERVICE' | 'COMBINED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');
  const [selectedProductId, setSelectedProductId] = useState('');
  const [serviceRating, setServiceRating] = useState(5);
  const [productRating, setProductRating] = useState(5);
  const [comment, setComment] = useState('');

  const filteredReviews = reviews.filter((rev) => {
    if (filterRating !== 'ALL') {
      const maxStar = Math.max(rev.productRating || 0, rev.serviceRating || 0);
      if (maxStar !== filterRating) return false;
    }
    if (filterType !== 'ALL' && rev.type !== filterType) {
      return false;
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

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reviewerName.trim()) {
      error('Mohon cantumkan nama Anda.');
      return;
    }
    if (!comment.trim()) {
      error('Mohon tulis ulasan atau pengalaman Anda.');
      return;
    }

    const selectedProduct = products.find((p) => p.id === selectedProductId);

    createReview({
      productId: selectedProduct ? selectedProduct.id : undefined,
      productName: selectedProduct ? selectedProduct.name : undefined,
      userId: currentUser?.id || 'guest',
      userName: reviewerName.trim(),
      productRating: productRating,
      serviceRating: serviceRating,
      comment: comment.trim(),
      type: selectedProduct ? 'COMBINED' : 'SERVICE',
    });

    setComment('');
    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header & Page Title */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
              Transparansi & Kepuasan Pelanggan
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
              100% Real Feedback
            </span>
          </div>
          <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white uppercase tracking-wide">
            Rating Layanan & Kualitas Produk
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 max-w-2xl leading-relaxed">
            Lihat testimoni asli dari pembeli akun gaming {settings.storeName}. Seluruh ulasan mencakup penilaian kualitas akun dan kecepatan layanan verifikasi admin.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (currentUser) {
                setReviewerName(currentUser.name);
              }
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 shrink-0"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Rating & Ulasan</span>
          </button>
        </div>
      </div>

      {/* Aggregate Score Highlight Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Service Rating */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-cyan-400 uppercase text-[11px] tracking-wider">
              Rating Pelayanan Admin
            </span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Zap className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {averageRatings.serviceAverage > 0 ? averageRatings.serviceAverage.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center text-cyan-400 gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            Respon cepat WA & verifikasi QRIS &lt; 15 menit.
          </p>
        </div>

        {/* Card 2: Product Quality Rating */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-amber-400 uppercase text-[11px] tracking-wider">
              Rating Kualitas Akun
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-white tracking-tight">
              {averageRatings.productAverage > 0 ? averageRatings.productAverage.toFixed(1) : '5.0'}
            </span>
            <span className="text-xs text-slate-400">/ 5.0</span>
          </div>
          <div className="flex items-center text-amber-400 gap-0.5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star key={s} className="w-3.5 h-3.5 fill-current" />
            ))}
          </div>
          <p className="text-[11px] text-slate-400">
            100% akun aman, all unbind, spesifikasi sesuai katalog.
          </p>
        </div>

        {/* Card 3: Total Reviews */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-emerald-400 uppercase text-[11px] tracking-wider">
              Total Ulasan Terverifikasi
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {reviews.length} Ulasan
          </div>
          <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Garansi Pembeli Terlindungi</span>
          </div>
          <p className="text-[11px] text-slate-400">
            Dari pembeli aktif MLBB, Free Fire, Valorant, dll.
          </p>
        </div>

        {/* Card 4: Guarantee & Delivery */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span className="font-semibold text-purple-400 uppercase text-[11px] tracking-wider">
              Privasi & Serah Terima
            </span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Lock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tracking-tight">
            Email Delivery
          </div>
          <p className="text-[11px] text-slate-300 leading-relaxed">
            Data kredensial dikirimkan privat ke email pembeli, tidak bocor di web publik.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* Rating Star Filters */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 text-xs">
          <button
            onClick={() => setFilterRating('ALL')}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
              filterRating === 'ALL'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Semua Bintang
          </button>
          {[5, 4, 3].map((star) => (
            <button
              key={star}
              onClick={() => setFilterRating(star)}
              className={`flex items-center gap-1 px-3 py-1.5 rounded-lg font-semibold transition-colors shrink-0 ${
                filterRating === star
                  ? 'bg-amber-500 text-slate-950 font-bold'
                  : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <span>{star}</span>
              <Star className="w-3 h-3 fill-current" />
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative flex-1 max-w-xs">
          <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari pembeli atau ulasan..."
            className="w-full pl-9 pr-3 py-1.5 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>
      </div>

      {/* Reviews Grid */}
      {filteredReviews.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="p-6 rounded-2xl bg-slate-900/70 border border-slate-800 hover:border-slate-700 transition-all shadow-lg flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                {/* User info and tags */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-sm shadow-md">
                      {rev.userName.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="text-sm font-bold text-white">{rev.userName}</h3>
                        <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                          Pembeli Terverifikasi
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-500 block">
                        {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                        })}
                      </span>
                    </div>
                  </div>

                  {rev.productName && (
                    <span className="text-[10px] text-slate-400 font-mono bg-slate-950 px-2.5 py-1 rounded-lg border border-slate-800 max-w-[160px] truncate hidden sm:inline-block">
                      {rev.productName}
                    </span>
                  )}
                </div>

                {/* Dual Rating Badges */}
                <div className="flex flex-wrap items-center gap-2 pt-1">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-xs">
                    <span className="text-amber-300 font-medium">Kualitas Akun:</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.productRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-xs">
                    <span className="text-cyan-300 font-medium">Pelayanan Toko:</span>
                    <div className="flex items-center text-cyan-400">
                      {Array.from({ length: rev.serviceRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic pt-1">
                  "{rev.comment}"
                </p>
              </div>

              {/* Product link if applicable */}
              {rev.productName && (
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                  <span className="flex items-center gap-1.5 truncate">
                    <ShoppingBag className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                    <span className="truncate">{rev.productName}</span>
                  </span>
                  <span className="text-[11px] text-emerald-400 font-semibold shrink-0">
                    Akun Terkirim
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <Star className="w-10 h-10 text-slate-600 mx-auto" />
          <p className="text-sm font-semibold text-slate-300">Tidak ada ulasan yang sesuai filter.</p>
          <button
            onClick={() => {
              setFilterRating('ALL');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700"
          >
            Reset Filter
          </button>
        </div>
      )}

      {/* Bottom CTA to Browse Catalog */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-blue-950/40 via-slate-900 to-cyan-950/40 border border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="space-y-1">
          <h3 className="font-heading text-xl font-bold text-white uppercase">
            Ingin Akun Gaming Sultan & Bergaransi?
          </h3>
          <p className="text-xs text-slate-400">
            Jelajahi ratusan stok akun terverifikasi ready stock di etalase kami dengan garansi 100% anti hackback.
          </p>
        </div>
        <button
          onClick={onBrowseProducts}
          className="px-6 py-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 shrink-0"
        >
          Lihat Katalog Akun
        </button>
      </div>

      {/* Review Submission Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Form Penilaian Kepuasan
                </span>
                <h3 className="font-heading text-xl font-bold text-white uppercase mt-0.5">
                  Beri Rating Layanan & Produk
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ulasan Anda sangat berarti untuk kemajuan kualitas toko {settings.storeName}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap / Panggilan</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Contoh: Ryan Gaming"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {products.length > 0 && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Akun yang Dibeli (Opsional)
                  </label>
                  <select
                    value={selectedProductId}
                    onChange={(e) => setSelectedProductId(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500/50"
                  >
                    <option value="">Layanan Umum / Transaksi Toko</option>
                    {products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.game})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {/* Service Rating */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">1. Rating Pelayanan & CS Admin:</span>
                  <span className="text-cyan-400 font-bold">{serviceRating} dari 5 Bintang</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setServiceRating(star)}
                      className="p-1 text-cyan-400 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= serviceRating ? 'fill-cyan-400 text-cyan-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">
                  Kecepatan chat WhatsApp, keramahan, dan panduan handover akun.
                </p>
              </div>

              {/* Product Rating */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">2. Rating Kualitas Akun Game:</span>
                  <span className="text-amber-400 font-bold">{productRating} dari 5 Bintang</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setProductRating(star)}
                      className="p-1 text-amber-400 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= productRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
                <p className="text-[10px] text-slate-500">
                  Kesesuaian skin, tier rank, level akun, dan status all unbind aman.
                </p>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Komentar / Pengalaman Anda
                </label>
                <textarea
                  rows={3}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda belanja di Vortex ID..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Kirim Ulasan & Rating
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
