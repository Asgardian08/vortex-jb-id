import React, { useEffect, useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import {
  ShieldCheck,
  Zap,
  Eye,
  CheckCircle2,
  Lock,
  ArrowLeft,
  Share2,
  MessageCircle,
  Sparkles,
  ShoppingBag,
  ChevronLeft,
  ChevronRight,
  Star,
  MessageSquare,
  ThumbsUp,
  Plus,
  X,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface ProductDetailPageProps {
  productId: string;
  onBack: () => void;
  onCheckout: (product: Product) => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  productId,
  onBack,
  onCheckout,
}) => {
  const { getProduct, recordProductView, settings, reviews, createReview, currentUser } = useStore();
  const { success, error } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  // Review states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [reviewProductRating, setReviewProductRating] = useState(5);
  const [reviewServiceRating, setReviewServiceRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState(currentUser?.name || '');

  useEffect(() => {
    const p = getProduct(productId);
    if (p) {
      setProduct(p);
      recordProductView(p.id);
    }
  }, [productId, getProduct, recordProductView]);

  if (!product) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm font-semibold text-slate-300">Akun gaming tidak ditemukan atau telah dihapus.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700"
        >
          Kembali ke Katalog
        </button>
      </div>
    );
  }

  const isSold = product.status === 'SOLD';
  const hasDiscount = product.discountType !== 'NONE' && product.discountValue > 0;

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    success('Tautan akun berhasil disalin ke clipboard!');
  };

  const handleChatAdmin = () => {
    let phone = settings.contact.whatsapp.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    const msg = encodeURIComponent(
      `Halo Admin ${settings.storeName}, saya tertarik dengan akun: ${product.name} (ID: ${product.id}). Apakah masih ready stock?`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Katalog</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Gallery Column (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main Visual Carousel with Slide Navigation */}
          <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-xl group">
            <img
              src={product.images[activeImageIndex] || product.images[0] || '/src/assets/images/mlbb_mythic_showcase_1790923035330.jpg'}
              alt={`${product.name} - Slide ${activeImageIndex + 1}`}
              className="w-full h-full object-cover object-center group-hover:scale-102 transition-transform duration-500"
              referrerPolicy="no-referrer"
            />

            {/* Top Badges & Slide Indicator */}
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-slate-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
                {product.game}
              </span>
              {isSold && (
                <span className="text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded-md bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md">
                  TERJUAL
                </span>
              )}
              {product.images.length > 1 && (
                <span className="text-xs font-mono font-semibold px-2 py-1 rounded-md bg-slate-950/80 text-slate-300 border border-slate-800 backdrop-blur-md">
                  Slide {activeImageIndex + 1} / {product.images.length}
                </span>
              )}
            </div>

            <button
              onClick={handleShare}
              className="absolute top-4 right-4 p-2 rounded-xl bg-slate-950/70 border border-slate-800 text-slate-300 hover:text-white transition-colors backdrop-blur-md"
              title="Bagikan Tautan Akun"
            >
              <Share2 className="w-4 h-4" />
            </button>

            {/* Prev and Next Arrow Buttons if multiple slides */}
            {product.images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === 0 ? product.images.length - 1 : prev - 1))
                  }
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/70 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
                  title="Foto Sebelumnya"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setActiveImageIndex((prev) => (prev === product.images.length - 1 ? 0 : prev + 1))
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-xl bg-slate-950/70 hover:bg-cyan-500 hover:text-slate-950 text-white border border-white/10 backdrop-blur-md transition-all shadow-lg"
                  title="Foto Berikutnya"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails Strip (Up to 10 slides) */}
          {product.images.length > 1 && (
            <div className="flex items-center gap-2.5 overflow-x-auto pb-2 scrollbar-thin">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-16 rounded-xl overflow-hidden border transition-all shrink-0 group ${
                    activeImageIndex === idx
                      ? 'border-cyan-400 ring-2 ring-cyan-500/40 opacity-100'
                      : 'border-slate-800 opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt={`Slide ${idx + 1}`} className="w-full h-full object-cover" />
                  <span className="absolute bottom-0.5 right-1 text-[9px] font-mono font-bold text-white bg-slate-950/80 px-1 rounded">
                    #{idx + 1}
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Detailed Account Description */}
          <div className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
            <div>
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300">Deskripsi Lengkap Akun</h3>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mt-2 whitespace-pre-line">
                {product.description}
              </p>
            </div>

            {/* Premium & Limited Skins Breakdown */}
            {product.premiumSkins && product.premiumSkins.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Koleksi Skin Premium / Legend / Collector:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {product.premiumSkins.map((skin, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-200 text-xs font-medium"
                    >
                      {skin}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {product.limitedSkins && product.limitedSkins.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Skin Event Terbatas / Limited Edition:</span>
                </h4>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {product.limitedSkins.map((skin, i) => (
                    <span
                      key={i}
                      className="px-2.5 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-200 text-xs font-medium"
                    >
                      {skin}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Security Notice */}
            <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800 flex items-start gap-3">
              <Lock className="w-5 h-5 text-cyan-400 shrink-0 mt-0.5" />
              <div className="text-xs space-y-1">
                <p className="font-semibold text-white">Privasi & Keamanan Data Akun Game</p>
                <p className="text-slate-400 leading-relaxed">
                  Demi keamanan akun dan mencegah pencurian data, username dan password login tidak ditampilkan di halaman publik.
                  Setelah transaksi Anda selesai diverifikasi (Status: COMPLETED), kredensial akun akan otomatis dikirimkan langsung ke alamat email terdaftar Anda.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Sticky Purchase Module (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span>ID: {product.id}</span>
                <span aria-hidden="true">·</span>
                <span className="flex items-center gap-1">
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  {product.views} dilihat
                </span>
                <span aria-hidden="true">·</span>
                <span>{product.salesCount || 0} terjual</span>
              </div>
              <h1 className="font-heading text-2xl font-bold text-white uppercase mt-1 leading-snug">
                {product.name}
              </h1>

              {/* Rating stars & review count */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center text-amber-400">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="text-xs font-bold text-white">
                  {product.rating ? product.rating.toFixed(1) : '5.0'}
                </span>
                <span className="text-xs text-slate-400">
                  ({reviews.filter((r) => r.productId === product.id).length || 4} Ulasan Pembeli)
                </span>
              </div>
            </div>

            {/* Specifications Grid */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">Rank Akun</span>
                <span className="text-white font-semibold truncate block mt-0.5">{product.rank}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">Total Skin</span>
                <span className="text-white font-semibold block mt-0.5">{product.skinCount} Skin</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">Level Akun</span>
                <span className="text-white font-semibold block mt-0.5">Level {product.level}</span>
              </div>
              <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <span className="text-slate-500 block text-[11px]">Platform</span>
                <span className="text-white font-semibold block mt-0.5">{product.platform}</span>
              </div>
            </div>

            {/* Price Box */}
            <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800/80 space-y-1">
              <div className="flex items-baseline justify-between">
                <span className="text-xs text-slate-400">Total Harga Akun</span>
                {hasDiscount && (
                  <span className="text-xs line-through text-slate-500 tabular-nums">
                    Rp {product.price.toLocaleString('id-ID')}
                  </span>
                )}
              </div>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white tabular-nums tracking-tight">
                  Rp {product.finalPrice.toLocaleString('id-ID')}
                </span>
                {hasDiscount && (
                  <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                    Hemat Rp {(product.price - product.finalPrice).toLocaleString('id-ID')}
                  </span>
                )}
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-2.5 pt-2">
              <button
                type="button"
                disabled={isSold}
                onClick={() => onCheckout(product)}
                className={`w-full py-3.5 px-4 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all shadow-lg ${
                  isSold
                    ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
                    : 'bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white shadow-cyan-500/20'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isSold ? 'Akun Ini Sudah Terjual' : 'Beli Sekarang (Checkout)'}</span>
              </button>

              <button
                type="button"
                onClick={handleChatAdmin}
                className="w-full py-3 px-4 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-800 border border-slate-700/80 flex items-center justify-center gap-2 transition-colors"
              >
                <MessageCircle className="w-4 h-4 text-emerald-400" />
                <span>Tanya Admin di WhatsApp</span>
              </button>
            </div>

            {/* Guarantee points */}
            <div className="pt-4 border-t border-slate-800 space-y-2 text-[11px] text-slate-400">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Garansi anti-hackback resmi {settings.storeName}</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
                <span>Pembayaran langsung verifikasi via QRIS</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                <span>Bantuan serah-terima email login sampai beres</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Customer Reviews & Ratings Section */}
      <section className="pt-8 border-t border-white/5 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Ulasan & Penilaian Pelanggan
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-400 border border-amber-500/30">
                Terverifikasi Pembeli
              </span>
            </div>
            <h2 className="font-heading text-xl sm:text-2xl font-bold text-white uppercase mt-1">
              Rating Produk & Pelayanan
            </h2>
          </div>

          <button
            type="button"
            onClick={() => setIsReviewModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" />
            <span>Tulis Ulasan / Rating</span>
          </button>
        </div>

        {/* Rating Summary Card */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          <div className="text-center md:border-r border-slate-800 space-y-1">
            <span className="text-4xl font-extrabold text-white tracking-tight">
              {product.rating ? product.rating.toFixed(1) : '5.0'}
            </span>
            <div className="flex items-center justify-center text-amber-400 gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="text-xs text-slate-400">
              Rata-rata dari {reviews.filter((r) => r.productId === product.id).length || 4} ulasan pembeli
            </p>
          </div>

          <div className="md:col-span-2 space-y-2 text-xs">
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Kesesuaian Akun & Data Unbind</span>
              </span>
              <span className="font-bold text-emerald-400">100% Sesuai Deskripsi</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Zap className="w-4 h-4 text-cyan-400" />
                <span>Kecepatan Respon & Verifikasi Toko</span>
              </span>
              <span className="font-bold text-cyan-400">&lt; 15 Menit</span>
            </div>
            <div className="flex items-center justify-between text-slate-300">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-blue-400" />
                <span>Jaminan Garansi Anti-Hackback</span>
              </span>
              <span className="font-bold text-blue-400">100% Aman & Diproteksi</span>
            </div>
          </div>
        </div>

        {/* List of Reviews */}
        <div className="space-y-4">
          {(reviews.filter((r) => r.productId === product.id).length > 0
            ? reviews.filter((r) => r.productId === product.id)
            : reviews.slice(0, 3)
          ).map((rev) => (
            <div
              key={rev.id}
              className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs">
                    {rev.userName.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{rev.userName}</span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        Pembeli Terverifikasi
                      </span>
                    </div>
                    <span className="text-[10px] text-slate-500">
                      {new Date(rev.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                </div>

                {/* Rating Badges */}
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="text-slate-500">Kualitas Akun:</span>
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: rev.productRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-[11px] text-slate-300">
                    <span className="text-slate-500">Pelayanan:</span>
                    <div className="flex items-center text-cyan-400">
                      {Array.from({ length: rev.serviceRating || 5 }).map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-cyan-400 text-cyan-400" />
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed pl-1">
                "{rev.comment}"
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Review Submission Modal */}
      {isReviewModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  Ulasan & Penilaian Pelanggan
                </span>
                <h3 className="font-heading text-xl font-bold text-white uppercase mt-0.5">
                  Beri Rating Akun & Layanan
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Ulasan Anda sangat berarti untuk membantu calon pembeli dan toko {settings.storeName}.
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
                if (!reviewerName.trim()) {
                  error('Mohon isi nama Anda.');
                  return;
                }
                if (!reviewComment.trim()) {
                  error('Mohon berikan ulasan atau komentar Anda.');
                  return;
                }
                createReview({
                  productId: product.id,
                  productName: product.name,
                  userId: currentUser?.id || 'guest',
                  userName: reviewerName.trim(),
                  productRating: reviewProductRating,
                  serviceRating: reviewServiceRating,
                  comment: reviewComment.trim(),
                  type: 'COMBINED',
                });
                setReviewComment('');
                setIsReviewModalOpen(false);
              }}
              className="space-y-4 text-xs"
            >
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Anda</label>
                <input
                  type="text"
                  required
                  value={reviewerName}
                  onChange={(e) => setReviewerName(e.target.value)}
                  placeholder="Contoh: Ryan Gaming"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              {/* Product Rating Star Picker */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Rating Kualitas Akun:</span>
                  <span className="text-amber-400 font-bold">{reviewProductRating} dari 5 Bintang</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewProductRating(star)}
                      className="p-1 text-amber-400 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewProductRating ? 'fill-amber-400 text-amber-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Service Rating Star Picker */}
              <div className="space-y-1.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800">
                <div className="flex justify-between items-center">
                  <span className="font-semibold text-slate-200">Rating Pelayanan & Kecepatan Admin:</span>
                  <span className="text-cyan-400 font-bold">{reviewServiceRating} dari 5 Bintang</span>
                </div>
                <div className="flex items-center gap-1.5 pt-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewServiceRating(star)}
                      className="p-1 text-cyan-400 hover:scale-115 transition-transform"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= reviewServiceRating ? 'fill-cyan-400 text-cyan-400' : 'text-slate-600'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Komentar / Pengalaman Berbelanja
                </label>
                <textarea
                  required
                  rows={3}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Ceritakan kepuasan Anda terhadap kondisi akun dan respon admin..."
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl font-semibold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all"
                >
                  Kirim Ulasan Sekarang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
