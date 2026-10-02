import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { HeroSection } from '../components/storefront/HeroSection';
import { ProductCard } from '../components/storefront/ProductCard';
import { ProductFilterBar } from '../components/storefront/ProductFilterBar';
import { ShieldCheck, Zap, Headphones, CheckCircle2, Star, ArrowRight, Sparkles, Plus, X, MessageSquare } from 'lucide-react';

interface HomePageProps {
  onNavigate: (path: string) => void;
  onSelectProduct: (product: Product) => void;
  onCheckoutProduct: (product: Product) => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onNavigate,
  onSelectProduct,
  onCheckoutProduct,
}) => {
  const { settings, products, reviews, averageRatings, createReview, currentUser } = useStore();
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [homeReviewerName, setHomeReviewerName] = useState(currentUser?.name || '');
  const [homeServiceRating, setHomeServiceRating] = useState(5);
  const [homeProductRating, setHomeProductRating] = useState(5);
  const [homeComment, setHomeComment] = useState('');
  const [homeSelectedProdId, setHomeSelectedProdId] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular' | 'discount_desc'>('newest');

  // Extract unique games
  const availableGames = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.status !== 'ARCHIVED') set.add(p.game);
    });
    return Array.from(set);
  }, [products]);

  // Filtered products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status === 'ARCHIVED' || p.status === 'HIDDEN') return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedGame !== 'ALL' && p.game !== selectedGame) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesGame = p.game.toLowerCase().includes(q);
        const matchesRank = p.rank.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesGame && !matchesRank && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price_asc') return a.finalPrice - b.finalPrice;
      if (selectedSort === 'price_desc') return b.finalPrice - a.finalPrice;
      if (selectedSort === 'popular') return (b.views || 0) - (a.views || 0);
      if (selectedSort === 'discount_desc') return (b.price - b.finalPrice) - (a.price - a.finalPrice);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedStatus, selectedGame, searchQuery, selectedSort]);

  return (
    <div className="space-y-16 pb-20">
      {/* 1. Hero Section */}
      <HeroSection
        onExploreClick={() => {
          const el = document.getElementById('catalog-section');
          el?.scrollIntoView({ behavior: 'smooth' });
        }}
        onHowToOrderClick={() => onNavigate('/how-to-order')}
      />

      {/* 2. Featured Catalog Grid */}
      <section id="catalog-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2 border-b border-white/5 pb-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Pilihan Terbaik</span>
            <h2 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase">
              Katalog Akun Gaming Ready Stock
            </h2>
          </div>
          <button
            onClick={() => onNavigate('/products')}
            className="text-xs font-semibold text-cyan-400 hover:text-cyan-300 flex items-center gap-1 transition-colors self-start sm:self-auto"
          >
            <span>Buka Semua Koleksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Filter Bar */}
        <ProductFilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedGame={selectedGame}
          onGameChange={setSelectedGame}
          selectedSort={selectedSort}
          onSortChange={setSelectedSort}
          selectedStatus={selectedStatus}
          onStatusChange={setSelectedStatus}
          availableGames={availableGames}
          totalResults={filteredProducts.length}
        />

        {/* Product Cards Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 pt-2">
            {filteredProducts.map((prod) => (
              <ProductCard
                key={prod.id}
                product={prod}
                onSelect={onSelectProduct}
                onQuickCheckout={onCheckoutProduct}
              />
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="py-16 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-lg mx-auto">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
                Stok Akun Sedang Dipersiapkan
              </h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Stok akun gaming baru sedang diunggah oleh admin toko. Hubungi WhatsApp admin di <strong className="text-cyan-400">085819822250</strong> untuk pre-order atau menanyakan ketersediaan akun favoritmu.
              </p>
            </div>
            <a
              href="https://wa.me/6285819822250?text=Halo%20Admin%2C%20apakah%20ada%20stok%20akun%20gaming%20yang%20ready%3F"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
            >
              <span>Chat WhatsApp Admin (085819822250)</span>
            </a>
          </div>
        ) : (
          <div className="py-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-3">
            <p className="text-sm font-semibold text-slate-300">Tidak ada akun gaming yang cocok dengan pencarian.</p>
            <p className="text-xs text-slate-500">Coba ubah kata kunci atau reset filter kategori.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedGame('ALL');
                setSelectedStatus('ALL');
              }}
              className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700 transition-colors"
            >
              Reset Semua Filter
            </button>
          </div>
        )}
      </section>

      {/* 3. Why Buy From Vortex ID */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-white/5 bg-gradient-to-b from-slate-900/80 to-slate-950 p-8 sm:p-12 space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Keunggulan Layanan</span>
            <h3 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase">
              Kenapa Memilih {settings.storeName}?
            </h3>
            <p className="text-xs sm:text-sm text-slate-400">
              Transaksi akun game sering kali berisiko penipuan. Di {settings.storeName}, setiap akun telah melewati inspeksi keamanan ketat.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/10 text-cyan-400 flex items-center justify-center border border-blue-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Garansi Anti-Hackback</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Kami memberikan garansi pengamanan data dan bantuan recovery jika terjadi kendala pada akun yang telah diserahterimakan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center border border-emerald-500/20">
                <Zap className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Pembayaran QRIS Nasional</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Bayar aman dan mudah lewat semua aplikasi e-Wallet (BCA, GoPay, OVO, DANA, ShopeePay) dengan konfirmasi nota otomatis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center border border-amber-500/20">
                <Headphones className="w-5 h-5" />
              </div>
              <h4 className="text-base font-semibold text-white">Panduan Handover 1-on-1</h4>
              <p className="text-xs text-slate-400 leading-relaxed">
                Admin siap memandu penggantian email login Moonton/Google/Riot sampai 100% aman di tangan pembeli.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Customer Testimonials & Service/Product Ratings */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Bukti Nyata Kepuasan
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/20">
                Rating {averageRatings.serviceAverage > 0 ? averageRatings.serviceAverage.toFixed(1) : '5.0'} / 5.0
              </span>
            </div>
            <h3 className="font-heading text-2xl font-bold text-white uppercase">
              Rating Layanan & Kualitas Produk
            </h3>
            <p className="text-xs text-slate-400 max-w-xl">
              Ulasan jujur pembeli terverifikasi tentang kualitas akun game all unbind dan kecepatan respon admin toko {settings.storeName}.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={() => {
                if (currentUser) setHomeReviewerName(currentUser.name);
                setIsReviewModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-md shadow-blue-600/20"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Beri Rating</span>
            </button>
            <button
              onClick={() => onNavigate('/reviews')}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 hover:border-slate-700 transition-colors"
            >
              <span>Semua Ulasan ({reviews.length})</span>
              <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
            </button>
          </div>
        </div>

        {/* Dynamic Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviews.slice(0, 3).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition-all space-y-3.5 flex flex-col justify-between shadow-lg"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between gap-2">
                  {/* Stars for service & product */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.productRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-current" />
                      ))}
                    </div>
                    <span className="text-[11px] font-bold text-slate-300">
                      {rev.productRating || 5}.0
                    </span>
                  </div>

                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Terverifikasi
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-[10px]">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/20">
                    Layanan: {rev.serviceRating || 5}★
                  </span>
                  <span className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                    Akun: {rev.productRating || 5}★
                  </span>
                </div>

                <p className="text-xs text-slate-300 italic leading-relaxed">
                  "{rev.comment}"
                </p>
              </div>

              <div className="text-xs font-semibold text-white pt-2 border-t border-slate-800/80 flex items-center justify-between">
                <span>{rev.userName}</span>
                <span className="text-[10px] text-slate-500 font-normal">
                  {rev.productName ? rev.productName.split('-')[0] : 'Layanan Toko'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Review Submission Modal on HomePage */}
      {isReviewModalOpen && (
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
                  Ulasan Anda sangat berarti untuk membantu pembeli lain di {settings.storeName}.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsReviewModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (!homeReviewerName.trim()) return;
                if (!homeComment.trim()) return;
                const prod = products.find((p) => p.id === homeSelectedProdId);
                createReview({
                  productId: prod ? prod.id : undefined,
                  productName: prod ? prod.name : undefined,
                  userId: currentUser?.id || 'guest',
                  userName: homeReviewerName.trim(),
                  productRating: homeProductRating,
                  serviceRating: homeServiceRating,
                  comment: homeComment.trim(),
                  type: prod ? 'COMBINED' : 'SERVICE',
                });
                setHomeComment('');
                setIsReviewModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap / Panggilan</label>
                <input
                  type="text"
                  required
                  value={homeReviewerName}
                  onChange={(e) => setHomeReviewerName(e.target.value)}
                  placeholder="Contoh: Fajar Nugroho"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              {products.length > 0 && (
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">
                    Akun yang Dibeli (Opsional)
                  </label>
                  <select
                    value={homeSelectedProdId}
                    onChange={(e) => setHomeSelectedProdId(e.target.value)}
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
                  <span className="font-semibold text-slate-200">1. Rating Pelayanan & CS:</span>
                  <span className="text-cyan-400 font-bold">{homeServiceRating} dari 5 Bintang</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setHomeServiceRating(star)}
                      className="p-1 text-cyan-400 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= homeServiceRating ? 'fill-cyan-400 text-cyan-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Product Rating */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">2. Rating Kualitas Akun Game:</span>
                  <span className="text-amber-400 font-bold">{homeProductRating} dari 5 Bintang</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setHomeProductRating(star)}
                      className="p-1 text-amber-400 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= homeProductRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Comment */}
              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ulasan Pengalaman Anda
                </label>
                <textarea
                  rows={3}
                  required
                  value={homeComment}
                  onChange={(e) => setHomeComment(e.target.value)}
                  placeholder="Ceritakan pengalaman Anda belanja akun di Vortex ID..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white bg-slate-800 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
                >
                  Kirim Ulasan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
