import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ImageUploader } from '../components/common/ImageUploader';
import { ShieldCheck, Tag, ArrowLeft, QrCode, CheckCircle2, AlertCircle } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface CheckoutPageProps {
  product: Product;
  onBack: () => void;
  onOrderCreated: (orderId: string) => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  product,
  onBack,
  onOrderCreated,
}) => {
  const { settings, currentUser, createOrder, validateVoucher, uploadPaymentProof } = useStore();
  const { success, error } = useToast();

  const [customerName, setCustomerName] = useState(currentUser?.name || '');
  const [customerPhone, setCustomerPhone] = useState(currentUser?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(currentUser?.email || '');
  const [notes, setNotes] = useState('');

  // Voucher state
  const [voucherCodeInput, setVoucherCodeInput] = useState('');
  const [appliedVoucherCode, setAppliedVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherMessage, setVoucherMessage] = useState<string | null>(null);
  const [isVoucherValid, setIsVoucherValid] = useState<boolean | null>(null);

  // Payment proof state
  const [paymentProofUrl, setPaymentProofUrl] = useState('');
  const [paymentProofNote, setPaymentProofNote] = useState('');

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Financial calculations
  const subtotal = product.price;
  const productDiscount = Math.max(0, product.price - product.finalPrice);
  const subtotalAfterProduct = product.finalPrice;
  const total = Math.max(0, subtotalAfterProduct - voucherDiscount);

  const handleApplyVoucher = () => {
    if (!voucherCodeInput.trim()) {
      error('Silakan ketikkan kode voucher.');
      return;
    }

    const res = validateVoucher(voucherCodeInput, subtotalAfterProduct);
    if (res.valid) {
      setAppliedVoucherCode(voucherCodeInput.trim().toUpperCase());
      setVoucherDiscount(res.discount);
      setVoucherMessage(res.message);
      setIsVoucherValid(true);
      success(res.message);
    } else {
      setAppliedVoucherCode('');
      setVoucherDiscount(0);
      setVoucherMessage(res.message);
      setIsVoucherValid(false);
      error(res.message);
    }
  };

  const handleRemoveVoucher = () => {
    setAppliedVoucherCode('');
    setVoucherCodeInput('');
    setVoucherDiscount(0);
    setVoucherMessage(null);
    setIsVoucherValid(null);
  };

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!customerName.trim()) {
      error('Mohon lengkapi Nama Anda.');
      return;
    }
    if (!customerPhone.trim()) {
      error('Mohon lengkapi Nomor WhatsApp untuk serah terima akun.');
      return;
    }
    if (!customerEmail.trim()) {
      error('Mohon lengkapi Email aktif untuk pengiriman nota.');
      return;
    }

    try {
      setIsSubmitting(true);
      const newOrder = createOrder({
        productId: product.id,
        customerName,
        customerPhone,
        customerEmail,
        paymentMethod: 'QRIS',
        voucherCode: appliedVoucherCode || undefined,
        notes,
      });

      // If buyer already uploaded payment proof during checkout, attach it
      if (paymentProofUrl) {
        uploadPaymentProof(newOrder.id, paymentProofUrl, paymentProofNote);
      }

      onOrderCreated(newOrder.id);
    } catch (err: any) {
      error(err.message || 'Terjadi kesalahan saat memproses pesanan.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Kembali ke Detail Akun</span>
      </button>

      <div>
        <h1 className="font-heading text-3xl font-bold text-white uppercase">Checkout Pesanan</h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Lengkapi data penerima dan scan QRIS toko untuk menyelesaikan transaksi akun game Anda.
        </p>
      </div>

      <form onSubmit={handleSubmitOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Buyer Information & QRIS (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Form: Data Pembeli */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>1. Data Pembeli & Kontak Serah Terima</span>
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
                <input
                  type="text"
                  required
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  placeholder="Contoh: Reza Pratama"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Aktif</label>
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Contoh: 081234567890"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Admin akan menghubungi nomor ini untuk serah terima akun
                  </span>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Email Aktif</label>
                  <input
                    type="email"
                    required
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Contoh: gamer@gmail.com"
                    className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                  />
                  <span className="text-[10px] text-slate-500 mt-0.5 block">
                    Invoice resmi otomatis dikirimkan ke email ini
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Catatan Tambahan (Opsional)</label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Contoh: Tolong hubungi jam 7 malam ya min..."
                  className="w-full px-3.5 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          </div>

          {/* Form: QRIS Payment Section */}
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <QrCode className="w-4 h-4 text-emerald-400" />
                <span>2. Pembayaran QRIS Toko Resmi</span>
              </h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Otomatis Verifikasi
              </span>
            </div>

            {/* QRIS Display Card */}
            <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-4">
              <p className="text-xs text-slate-300 font-medium">
                Scan QRIS di bawah menggunakan BCA, GoPay, OVO, DANA, ShopeePay, atau Bank apa saja:
              </p>

              <div className="max-w-[240px] mx-auto p-3 rounded-2xl bg-white shadow-xl shadow-cyan-500/5">
                <img
                  src={settings.qrisImage}
                  alt="QRIS Toko Resmi"
                  className="w-full h-auto aspect-square object-contain mx-auto rounded-lg"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="p-3 rounded-xl bg-slate-900 border border-slate-800 max-w-sm mx-auto">
                <span className="text-[11px] text-slate-400 block">Nominal yang harus dibayarkan:</span>
                <span className="text-xl font-bold text-cyan-400 tabular-nums">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>

              <p className="text-[11px] text-slate-500 max-w-md mx-auto whitespace-pre-line leading-relaxed">
                {settings.paymentInstructions}
              </p>
            </div>

            {/* Optional Immediate Proof Upload */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-semibold text-slate-300">
                  Upload Bukti Transfer (Bisa sekarang atau setelah checkout)
                </label>
                <span className="text-[11px] text-slate-500">Opsional</span>
              </div>
              <ImageUploader
                value={paymentProofUrl}
                onChange={setPaymentProofUrl}
                label=""
                helperText="Upload screenshot resi m-Banking / e-Wallet Anda"
                aspectRatio="video"
              />
              {paymentProofUrl && (
                <input
                  type="text"
                  value={paymentProofNote}
                  onChange={(e) => setPaymentProofNote(e.target.value)}
                  placeholder="Catatan transfer (Contoh: Transfer atas nama Budi via BCA)"
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white"
                />
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Order Snapshot & Voucher & Subtotal (5 cols) */}
        <div className="lg:col-span-5 space-y-5 lg:sticky lg:top-24">
          <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">
              Ringkasan Pembelian
            </h2>

            {/* Product Item Preview */}
            <div className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800">
              <img
                src={product.images[0] || '/src/assets/images/mlbb_mythic_showcase_1790923035330.jpg'}
                alt={product.name}
                className="w-16 h-16 rounded-lg object-cover shrink-0 border border-slate-800"
              />
              <div className="min-w-0 flex-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {product.game} · {product.rank}
                </span>
                <h3 className="text-xs font-semibold text-white truncate">{product.name}</h3>
                <p className="text-xs font-bold text-slate-300 tabular-nums mt-0.5">
                  Rp {product.finalPrice.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Voucher Box */}
            <div className="space-y-2 pt-2 border-t border-slate-800">
              <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-cyan-400" />
                <span>Punya Kode Voucher / Kupon?</span>
              </label>

              {appliedVoucherCode ? (
                <div className="flex items-center justify-between p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-xs">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-emerald-300 uppercase">{appliedVoucherCode}</span>
                      <p className="text-[11px] text-emerald-400 font-medium">
                        Potongan: -Rp {voucherDiscount.toLocaleString('id-ID')}
                      </p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleRemoveVoucher}
                    className="text-xs text-slate-400 hover:text-white px-2 py-1"
                  >
                    Batal
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={voucherCodeInput}
                    onChange={(e) => setVoucherCodeInput(e.target.value.toUpperCase())}
                    placeholder="Contoh: VORTEX10"
                    className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white uppercase placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                  />
                  <button
                    type="button"
                    onClick={handleApplyVoucher}
                    className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
                  >
                    Gunakan
                  </button>
                </div>
              )}

              {/* Suggestions */}
              <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-500">
                <span>Voucher aktif demo:</span>
                <button
                  type="button"
                  onClick={() => setVoucherCodeInput('VORTEX10')}
                  className="text-cyan-400 hover:underline font-mono font-semibold"
                >
                  VORTEX10
                </button>
                <span>·</span>
                <button
                  type="button"
                  onClick={() => setVoucherCodeInput('GAMERHEMAT')}
                  className="text-cyan-400 hover:underline font-mono font-semibold"
                >
                  GAMERHEMAT
                </button>
              </div>

              {voucherMessage && isVoucherValid === false && (
                <p className="text-xs text-rose-400 font-medium flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  {voucherMessage}
                </p>
              )}
            </div>

            {/* Calculations Breakdown */}
            <div className="space-y-2 pt-3 border-t border-slate-800 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Harga Normal</span>
                <span className="tabular-nums">Rp {subtotal.toLocaleString('id-ID')}</span>
              </div>
              {productDiscount > 0 && (
                <div className="flex justify-between text-amber-400 font-medium">
                  <span>Diskon Akun Langsung</span>
                  <span className="tabular-nums">- Rp {productDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}
              {voucherDiscount > 0 && (
                <div className="flex justify-between text-emerald-400 font-medium">
                  <span>Diskon Voucher ({appliedVoucherCode})</span>
                  <span className="tabular-nums">- Rp {voucherDiscount.toLocaleString('id-ID')}</span>
                </div>
              )}

              <div className="pt-3 border-t border-slate-800 flex justify-between items-baseline">
                <span className="text-sm font-bold text-white">Total Tagihan</span>
                <span className="text-2xl font-bold text-white tabular-nums tracking-tight text-cyan-400">
                  Rp {total.toLocaleString('id-ID')}
                </span>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl font-semibold text-sm text-white bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-50"
            >
              {isSubmitting ? 'Memproses Pesanan...' : 'Konfirmasi & Buat Pesanan'}
            </button>

            <p className="text-[11px] text-slate-500 text-center leading-relaxed">
              Dengan mengklik tombol di atas, Anda menyetujui syarat & ketentuan transaksi akun game di {settings.storeName}.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
};
