import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { ImageUploader } from '../components/common/ImageUploader';
import { ConfirmModal } from '../components/common/ConfirmModal';
import {
  ShieldCheck,
  QrCode,
  FileText,
  Clock,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  Copy,
  Lock,
  Unlock,
  MessageCircle,
  ArrowLeft,
  Upload,
  MailCheck,
  Send,
  Star,
  ThumbsUp,
} from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface OrderDetailPageProps {
  orderId: string;
  onBack: () => void;
  onViewInvoice: (orderId: string) => void;
  onOpenAuth?: () => void;
}

export const OrderDetailPage: React.FC<OrderDetailPageProps> = ({
  orderId,
  onBack,
  onViewInvoice,
  onOpenAuth,
}) => {
  const { getOrder, uploadPaymentProof, cancelOrder, settings, currentUser, createReview } = useStore();
  const { success, error } = useToast();

  const order = getOrder(orderId);

  const [proofUrl, setProofUrl] = useState('');
  const [proofNote, setProofNote] = useState('');
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelReason, setCancelReason] = useState('');

  // Rating states
  const [ratingProduct, setRatingProduct] = useState(5);
  const [ratingService, setRatingService] = useState(5);
  const [ratingComment, setRatingComment] = useState('');

  // Access check: only logged in customers can view their order
  if (!currentUser) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-6">
        <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 flex items-center justify-center mx-auto shadow-xl">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
            Autentikasi Diperlukan
          </span>
          <h2 className="font-heading text-2xl font-bold text-white uppercase">
            Akses Pesanan Terbatas
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Demi keamanan data dan privasi transaksi, silakan masuk ke akun pelanggan Anda untuk melihat detail pesanan ini.
          </p>
        </div>
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onOpenAuth}
            className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            Masuk / Buat Akun
          </button>
          <button
            onClick={onBack}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm font-semibold text-slate-300">Pesanan tidak ditemukan.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  // Ensure customer can only view their own order
  const isOwner =
    currentUser.role === 'ADMIN' ||
    order.userId === currentUser.id ||
    order.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim();

  if (!isOwner) {
    return (
      <div className="max-w-md mx-auto px-4 py-20 text-center space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h3 className="font-heading text-lg font-bold text-white uppercase">Akses Ditolak</h3>
        <p className="text-xs text-slate-400">
          Anda tidak memiliki izin untuk melihat detail pesanan milik akun pelanggan lain.
        </p>
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-slate-800 hover:bg-slate-700"
        >
          Kembali ke Riwayat Saya
        </button>
      </div>
    );
  }

  const isCompleted = order.orderStatus === 'COMPLETED';
  const isCancelled = order.orderStatus === 'CANCELLED';
  const isPending = order.orderStatus === 'PENDING';
  const isWaitingVerification = order.paymentStatus === 'WAITING_VERIFICATION';
  const isPaid = order.paymentStatus === 'PAID';

  const handleUploadProof = () => {
    if (!proofUrl) {
      error('Silakan pilih file bukti transfer terlebih dahulu.');
      return;
    }
    uploadPaymentProof(order.id, proofUrl, proofNote);
    setProofUrl('');
    setProofNote('');
  };

  const handleConfirmCancel = () => {
    if (!cancelReason.trim()) {
      error('Mohon isi alasan pembatalan pesanan.');
      return;
    }
    cancelOrder(order.id, cancelReason);
    setCancelReason('');
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    success(`${label} berhasil disalin!`);
  };

  const handleContactAdmin = () => {
    let phone = settings.contact.whatsapp.replace(/\D/g, '');
    if (phone.startsWith('0')) {
      phone = '62' + phone.substring(1);
    }
    const msg = encodeURIComponent(
      `Halo Admin ${settings.storeName}, saya ingin menanyakan status pesanan nomor: ${order.orderNumber} (Total: Rp ${order.total.toLocaleString('id-ID')}).`
    );
    window.open(`https://wa.me/${phone}?text=${msg}`, '_blank');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Top Bar with Back and Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onViewInvoice(order.id)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <FileText className="w-4 h-4 text-cyan-400" />
            <span>Lihat / Cetak Invoice</span>
          </button>
          <button
            onClick={handleContactAdmin}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/30 transition-colors"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Hubungi Admin</span>
          </button>
        </div>
      </div>

      {/* Order Header Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">Status Transaksi</span>
            <h1 className="font-heading text-2xl font-bold text-white tracking-wide mt-0.5">
              Order #{order.orderNumber}
            </h1>
            <p className="text-xs text-slate-400 mt-1">
              Dibuat pada: {new Date(order.createdAt).toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' })}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider border ${
                isCompleted
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                  : isCancelled
                  ? 'bg-rose-500/20 text-rose-300 border-rose-500/40'
                  : isWaitingVerification
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                  : 'bg-blue-500/20 text-blue-300 border-blue-500/40'
              }`}
            >
              {isCompleted
                ? 'PESANAN SELESAI'
                : isCancelled
                ? 'DIBATALKAN'
                : isWaitingVerification
                ? 'MENUNGGU VERIFIKASI'
                : 'MENUNGGU PEMBAYARAN'}
            </span>
          </div>
        </div>

        {/* Transaction Stepper */}
        {!isCancelled && (
          <div className="pt-4 border-t border-slate-800/80">
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              {/* Step 1: Pesanan Dibuat */}
              <div className="space-y-1">
                <div className="w-8 h-8 rounded-full bg-cyan-500 text-slate-950 font-bold flex items-center justify-center mx-auto shadow-md shadow-cyan-500/20">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-white">Pesanan Dibuat</p>
              </div>

              {/* Step 2: Pembayaran */}
              <div className="space-y-1">
                <div
                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center mx-auto transition-colors ${
                    order.paymentProofUrl || isPaid
                      ? 'bg-cyan-500 text-slate-950'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-slate-300">Bayar QRIS</p>
              </div>

              {/* Step 3: Verifikasi */}
              <div className="space-y-1">
                <div
                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center mx-auto transition-colors ${
                    isPaid
                      ? 'bg-cyan-500 text-slate-950'
                      : isWaitingVerification
                      ? 'bg-amber-500/30 text-amber-300 border border-amber-500/40 animate-pulse'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <Clock className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-slate-300">Verifikasi Admin</p>
              </div>

              {/* Step 4: Serah Terima */}
              <div className="space-y-1">
                <div
                  className={`w-8 h-8 rounded-full font-bold flex items-center justify-center mx-auto transition-colors ${
                    isCompleted
                      ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4" />
                </div>
                <p className="text-[11px] font-semibold text-slate-300">Akun Diterima</p>
              </div>
            </div>
          </div>
        )}

        {isCancelled && (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/30 text-xs text-rose-300 space-y-1">
            <p className="font-bold flex items-center gap-1.5">
              <XCircle className="w-4 h-4" />
              Pesanan ini telah dibatalkan
            </p>
            {order.cancellationReason && (
              <p className="text-slate-300">Alasan pembatalan: "{order.cancellationReason}"</p>
            )}
          </div>
        )}
      </div>

      {/* SENSITIVE CREDENTIALS AUTOMATICALLY DISPATCHED TO EMAIL (PROTECTED & SECURED) */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-gradient-to-br from-emerald-950/40 via-slate-900 to-slate-900 border border-emerald-500/40 shadow-2xl space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center shrink-0">
                <MailCheck className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-bold text-white uppercase tracking-wider">
                    Data Login Akun Terkirim Otomatis ke Email
                  </h3>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    STATUS: TERKIRIM
                  </span>
                </div>
                <p className="text-xs text-slate-300 mt-0.5">
                  Demi keamanan maksimal dan privasi akun Anda, data kredensial tidak ditampilkan di layar browser dan langsung dikirimkan ke email terdaftar Anda.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => {
                success(`Kredensial dan data akun game berhasil dikirimkan ulang ke email: ${order.customerEmail}`);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-emerald-300 hover:text-white bg-emerald-950/60 hover:bg-emerald-900/60 border border-emerald-500/40 transition-colors shrink-0 shadow-sm"
            >
              <Send className="w-3.5 h-3.5" />
              <span>Kirim Ulang ke Email</span>
            </button>
          </div>

          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Alamat Email Penerima Kredensial:</span>
                <span className="font-mono font-bold text-cyan-300 text-sm select-all">{order.customerEmail}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-emerald-400 font-medium">
                <CheckCircle2 className="w-4 h-4" />
                <span>Terkirim Otomatis ke Inbox / Spam</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-800/80 text-xs text-slate-300 space-y-1.5">
              <p className="font-semibold text-white">Rincian data akun yang telah terkirim meliputi:</p>
              <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-400">
                <li>ID Game / Username / Email Login Akun</li>
                <li>Kata Sandi (Password) Resmi Akun Game</li>
                <li>Email Pemulihan / Kode Backup 2FA (jika ada)</li>
                <li>Panduan Lengkap Serah Terima, Amankan Akun, & Ganti Sandi Mandiri</li>
              </ul>
            </div>
          </div>

          <div className="p-3.5 rounded-xl bg-cyan-950/30 border border-cyan-500/20 flex items-start gap-2.5 text-xs text-slate-300">
            <ShieldCheck className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
            <p className="text-[11px] leading-relaxed">
              <strong>Tips Keamanan:</strong> Buka email <strong>{order.customerEmail}</strong> Anda sekarang. Jika belum masuk di Kotak Masuk (Inbox), silakan periksa folder <em>Spam / Promosi</em>. Segera amankan akun dengan mengaitkan nomor ponsel Anda sendiri dalam kurun 1x24 jam untuk klaim garansi.
            </p>
          </div>
        </div>
      )}

      {/* RATING & TESTIMONIAL FORM (ACTIVE WHEN ORDER IS COMPLETED) */}
      {isCompleted && (
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                  Kepuasan Pelanggan
                </span>
                {order.reviewSubmitted && (
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    SUDAH DINILAI
                  </span>
                )}
              </div>
              <h3 className="text-base font-bold text-white uppercase mt-0.5">
                Rating Layanan & Kualitas Akun
              </h3>
            </div>
            <p className="text-xs text-slate-400">
              {order.reviewSubmitted
                ? 'Terima kasih telah memberikan ulasan untuk pesanan ini!'
                : 'Berikan rating dan ulasan pengalaman Anda berbelanja di Vortex ID.'}
            </p>
          </div>

          {!order.reviewSubmitted ? (
            <form
              onSubmit={(e) => {
                e.preventDefault();
                createReview({
                  orderId: order.id,
                  productId: order.items[0]?.productId,
                  productName: order.items[0]?.productNameSnapshot,
                  userId: currentUser?.id || order.userId,
                  userName: currentUser?.name || order.customerName,
                  productRating: ratingProduct,
                  serviceRating: ratingService,
                  comment: ratingComment.trim() || 'Pelayanan cepat dan akun aman 100%. Mantap!',
                  type: 'COMBINED',
                });
                success('Terima kasih! Ulasan & rating Anda telah berhasil dikirim.');
              }}
              className="space-y-4 text-xs pt-1"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Rating Product */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">1. Kualitas Akun & Skin:</span>
                    <span className="text-amber-400 font-bold">{ratingProduct} ★</span>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRatingProduct(s)}
                        className="p-1 text-amber-400 hover:scale-115 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= ratingProduct ? 'fill-amber-400 text-amber-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Rating Service */}
                <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-200">2. Kecepatan & Pelayanan CS:</span>
                    <span className="text-cyan-400 font-bold">{ratingService} ★</span>
                  </div>
                  <div className="flex items-center gap-1 pt-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setRatingService(s)}
                        className="p-1 text-cyan-400 hover:scale-115 transition-transform"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            s <= ratingService ? 'fill-cyan-400 text-cyan-400' : 'text-slate-700'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">
                  Ulasan / Pesan Testimoni Anda
                </label>
                <textarea
                  rows={2}
                  value={ratingComment}
                  onChange={(e) => setRatingComment(e.target.value)}
                  placeholder="Contoh: Akun sesuai deskripsi, all unbind, admin fast respon dan amanah!"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="flex justify-end">
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 shadow-md shadow-amber-500/20 transition-all"
                >
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Kirim Rating & Testimoni</span>
                </button>
              </div>
            </form>
          ) : (
            <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/20 flex items-center justify-between text-xs text-slate-300">
              <div className="flex items-center gap-2.5">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <p>
                  Rating dan ulasan Anda telah tersimpan dan tercatat di etalase toko. Terima kasih atas kepercayaan Anda!
                </p>
              </div>
              <div className="flex items-center text-amber-400 gap-0.5 shrink-0 font-bold">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Main Order Details & Item Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Items & Payment info (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Purchased Items */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Item Akun Gaming</h3>

            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-4 p-4 rounded-xl bg-slate-950 border border-slate-800"
              >
                <img
                  src={item.productImageSnapshot || '/src/assets/images/mlbb_mythic_showcase_1790923035330.jpg'}
                  alt={item.productNameSnapshot}
                  className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-800"
                />
                <div className="min-w-0 flex-1">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                    {item.productGameSnapshot} · {item.productRankSnapshot}
                  </span>
                  <h4 className="text-sm font-semibold text-white truncate">{item.productNameSnapshot}</h4>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className="text-sm font-bold text-white tabular-nums">
                      Rp {item.finalPriceSnapshot.toLocaleString('id-ID')}
                    </span>
                    {item.discountSnapshot > 0 && (
                      <span className="text-xs line-through text-slate-500 tabular-nums">
                        Rp {item.priceSnapshot.toLocaleString('id-ID')}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Financial Summary */}
            <div className="space-y-2 pt-4 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Subtotal Akun</span>
                <span className="tabular-nums">Rp {order.subtotal.toLocaleString('id-ID')}</span>
              </div>
              {order.productDiscount > 0 && (
                <div className="flex justify-between text-amber-400 font-medium">
                  <span>Diskon Akun</span>
                  <span className="tabular-nums">- Rp {order.productDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {order.voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Diskon Voucher ({order.voucherCode})</span>
                  <span className="tabular-nums">- Rp {order.voucherDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Tagihan</span>
                <span className="text-xl font-bold text-cyan-400 tabular-nums">
                  Rp {order.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          </div>

          {/* Payment Proof Section */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">Bukti Pembayaran QRIS</h3>

            {order.paymentProofUrl ? (
              <div className="space-y-3">
                <div className="max-w-md rounded-xl overflow-hidden border border-slate-800 bg-slate-950 p-2">
                  <img
                    src={order.paymentProofUrl}
                    alt="Bukti Transfer"
                    className="w-full max-h-72 object-contain rounded-lg"
                    referrerPolicy="no-referrer"
                  />
                </div>
                {order.paymentProofNote && (
                  <p className="text-xs text-slate-400 italic">Catatan: "{order.paymentProofNote}"</p>
                )}
                {!isPaid && !isCancelled && (
                  <div className="pt-2">
                    <p className="text-xs text-amber-300 font-medium">
                      Bukti telah terkirim. Admin sedang memverifikasi transfer Anda.
                    </p>
                  </div>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-xs text-slate-400">
                  Anda belum mengunggah bukti pembayaran. Silakan transfer melalui QRIS lalu upload bukti di bawah:
                </p>
                <ImageUploader
                  value={proofUrl}
                  onChange={setProofUrl}
                  label="Upload Bukti Pembayaran"
                  helperText="Screenshot resi transfer m-Banking / e-Wallet"
                  aspectRatio="video"
                />
                <input
                  type="text"
                  value={proofNote}
                  onChange={(e) => setProofNote(e.target.value)}
                  placeholder="Catatan tambahan (Nama pengirim / nomor referensi)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
                <button
                  type="button"
                  disabled={!proofUrl}
                  onClick={handleUploadProof}
                  className="px-4 py-2.5 rounded-xl font-semibold text-xs text-white bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>Kirim Bukti Pembayaran</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: QRIS & Cancel Order Action (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* QRIS Scan Card if not paid */}
          {!isPaid && !isCancelled && (
            <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 text-center space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                Scan QRIS untuk Bayar
              </span>
              <div className="max-w-[200px] mx-auto p-2 rounded-xl bg-white shadow-xl">
                <img
                  src={settings.qrisImage}
                  alt="QRIS Store"
                  className="w-full h-auto aspect-square object-contain mx-auto"
                />
              </div>
              <div className="p-2.5 rounded-lg bg-slate-950 border border-slate-800">
                <span className="text-[11px] text-slate-400 block">Total Nominal:</span>
                <span className="text-lg font-bold text-cyan-400 tabular-nums">
                  Rp {order.total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          )}

          {/* Cancellation Card */}
          {isPending && !isPaid && !isCancelled && (
            <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <AlertTriangle className="w-4 h-4" />
                <span>Batalkan Pesanan</span>
              </div>
              <p className="text-xs text-slate-400">
                Pesanan masih dalam status PENDING dan dapat dibatalkan jika Anda berubah pikiran.
              </p>
              <button
                type="button"
                onClick={() => setIsCancelModalOpen(true)}
                className="w-full py-2.5 rounded-xl text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-500/30 transition-colors"
              >
                Batalkan Pesanan Ini
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Cancel Order Modal */}
      <ConfirmModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        title="Konfirmasi Pembatalan Pesanan"
        message={`Apakah Anda yakin ingin membatalkan pesanan #${order.orderNumber}?`}
        confirmLabel="Ya, Batalkan Pesanan"
        variant="danger"
      >
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-semibold text-slate-300">Alasan Pembatalan:</label>
          <textarea
            required
            rows={3}
            value={cancelReason}
            onChange={(e) => setCancelReason(e.target.value)}
            placeholder="Contoh: Salah pilih akun, ingin ganti metode pembayaran..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
          />
        </div>
      </ConfirmModal>
    </div>
  );
};
