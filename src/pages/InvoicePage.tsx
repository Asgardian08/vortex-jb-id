import React from 'react';
import { useStore } from '../context/StoreContext';
import { Printer, ArrowLeft, Download, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface InvoicePageProps {
  orderId: string;
  onBack: () => void;
}

export const InvoicePage: React.FC<InvoicePageProps> = ({ orderId, onBack }) => {
  const { getOrder, settings } = useStore();
  const order = getOrder(orderId);

  if (!order) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center space-y-4">
        <p className="text-sm font-semibold text-slate-300">Invoice tidak ditemukan.</p>
        <button
          onClick={onBack}
          className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white"
        >
          Kembali
        </button>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const isPaid = order.paymentStatus === 'PAID';
  const orderDate = new Date(order.createdAt).toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      {/* Top Action Bar (hidden in print) */}
      <div className="flex items-center justify-between no-print border-b border-white/5 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Pesanan</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-500/20 transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Download PDF</span>
          </button>
        </div>
      </div>

      {/* Invoice Card / Printable Area */}
      <div className="invoice-printable p-8 sm:p-12 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-8 text-slate-200">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 border-b border-slate-800 pb-8">
          <div className="flex items-center gap-3">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.storeName}
                className="w-12 h-12 rounded-xl object-contain border border-cyan-500/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center font-bold text-white text-xl">
                V
              </div>
            )}
            <div>
              <h1 className="font-heading text-2xl font-bold tracking-wider text-white uppercase">
                {settings.storeName}
              </h1>
              <p className="text-xs text-slate-400">{settings.tagline}</p>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-400 block">
              OFFICIAL INVOICE
            </span>
            <span className="text-lg font-mono font-bold text-white mt-1 block">
              {order.orderNumber}
            </span>
            <span className="text-xs text-slate-400 block">Tanggal: {orderDate}</span>
          </div>
        </div>

        {/* Customer & Payment Info */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
          <div>
            <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
              Diterbitkan Untuk:
            </span>
            <p className="text-sm font-bold text-white mt-1">{order.customerName}</p>
            <p className="text-slate-400 mt-0.5">{order.customerPhone}</p>
            <p className="text-cyan-400 font-mono text-[11px]">{order.customerEmail}</p>
          </div>

          <div>
            <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
              Metode & Status Bayar:
            </span>
            <p className="text-sm font-bold text-white mt-1">{order.paymentMethod}</p>
            <div className="mt-1">
              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-md text-[11px] font-bold uppercase tracking-wider ${
                  isPaid
                    ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                    : 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                }`}
              >
                {isPaid && <CheckCircle2 className="w-3.5 h-3.5" />}
                {order.paymentStatus}
              </span>
            </div>
          </div>

          <div className="p-3 rounded-xl bg-slate-950 border border-slate-800">
            <span className="text-slate-400 font-semibold block uppercase tracking-wider text-[10px]">
              Serah Terima Kredensial:
            </span>
            <p className="text-xs font-semibold text-emerald-400 mt-1 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
              <span>Terkirim ke Email Pembeli</span>
            </p>
            <p className="text-[10px] text-slate-500 mt-0.5 leading-relaxed">
              Demi keamanan akun, username & password tidak dicetak di invoice dan langsung dikirim ke email terdaftar.
            </p>
          </div>
        </div>

        {/* Itemized Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-2">Deskripsi Produk</th>
                <th className="py-3 px-2 text-center">Game</th>
                <th className="py-3 px-2 text-right">Harga Satuan</th>
                <th className="py-3 px-2 text-right">Diskon</th>
                <th className="py-3 px-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {order.items.map((item) => (
                <tr key={item.id}>
                  <td className="py-4 px-2">
                    <p className="font-semibold text-white">{item.productNameSnapshot}</p>
                    <p className="text-[11px] text-slate-400">{item.productRankSnapshot}</p>
                  </td>
                  <td className="py-4 px-2 text-center font-medium text-slate-300">
                    {item.productGameSnapshot}
                  </td>
                  <td className="py-4 px-2 text-right tabular-nums text-slate-300">
                    Rp {item.priceSnapshot.toLocaleString('id-ID')}
                  </td>
                  <td className="py-4 px-2 text-right tabular-nums text-amber-400">
                    {item.discountSnapshot > 0 ? `- Rp ${item.discountSnapshot.toLocaleString('id-ID')}` : '-'}
                  </td>
                  <td className="py-4 px-2 text-right tabular-nums font-bold text-white">
                    Rp {item.finalPriceSnapshot.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Voucher */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
          <div className="text-xs text-slate-400 max-w-sm space-y-1">
            <p className="font-semibold text-slate-300">Catatan Garansi:</p>
            <p className="text-[11px] leading-relaxed">
              {settings.invoiceFooterText}
            </p>
          </div>

          <div className="w-full sm:w-64 space-y-2 text-xs">
            <div className="flex justify-between text-slate-400">
              <span>Subtotal Produk</span>
              <span className="tabular-nums">Rp {order.subtotal.toLocaleString('id-ID')}</span>
            </div>
            {order.productDiscount > 0 && (
              <div className="flex justify-between text-amber-400">
                <span>Diskon Produk</span>
                <span className="tabular-nums">- Rp {order.productDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            {order.voucherDiscount > 0 && (
              <div className="flex justify-between text-emerald-400">
                <span>Voucher ({order.voucherCode})</span>
                <span className="tabular-nums">- Rp {order.voucherDiscount.toLocaleString('id-ID')}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-800 flex justify-between items-baseline">
              <span className="text-sm font-bold text-white">Grand Total</span>
              <span className="text-xl font-bold text-cyan-400 tabular-nums">
                Rp {order.total.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Footer Seal */}
        <div className="pt-8 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-cyan-400" />
            <span>Dokumen ini merupakan bukti transaksi sah yang diterbitkan oleh sistem {settings.storeName}.</span>
          </div>
          <span className="font-mono text-[10px]">ID: {order.id}</span>
        </div>
      </div>
    </div>
  );
};
