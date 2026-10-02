import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { Order } from '../../types';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  Search,
  CheckCircle2,
  XCircle,
  FileText,
  Eye,
  Clock,
  MessageCircle,
  ShieldCheck,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AdminOrdersPageProps {
  onViewInvoice: (orderId: string) => void;
}

export const AdminOrdersPage: React.FC<AdminOrdersPageProps> = ({ onViewInvoice }) => {
  const { orders, verifyOrder, cancelOrder, settings } = useStore();
  const { success, error } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('ALL');
  const [dateFilter, setDateFilter] = useState<'all' | 'today' | 'week' | 'month'>('all');

  // Detail Modal State
  const [viewingOrder, setViewingOrder] = useState<Order | null>(null);

  // Cancel Modal State
  const [orderToCancel, setOrderToCancel] = useState<Order | null>(null);
  const [cancellationReason, setCancellationReason] = useState('');

  // Internal note editing
  const [adminNote, setAdminNote] = useState('');

  const filteredOrders = orders.filter((o) => {
    if (selectedStatus !== 'ALL' && o.orderStatus !== selectedStatus) return false;
    if (selectedPaymentStatus !== 'ALL' && o.paymentStatus !== selectedPaymentStatus) return false;

    if (dateFilter !== 'all') {
      const orderDate = new Date(o.createdAt);
      const now = new Date();
      const cutoff = new Date();
      if (dateFilter === 'today') cutoff.setHours(0, 0, 0, 0);
      else if (dateFilter === 'week') cutoff.setDate(now.getDate() - 7);
      else if (dateFilter === 'month') cutoff.setDate(now.getDate() - 30);
      if (orderDate < cutoff) return false;
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchCust = o.customerName.toLowerCase().includes(q) || o.customerEmail.toLowerCase().includes(q);
      const matchProd = o.items.some((i) => i.productNameSnapshot.toLowerCase().includes(q));
      if (!matchNum && !matchCust && !matchProd) return false;
    }

    return true;
  });

  const handleVerify = (orderId: string) => {
    verifyOrder(orderId, adminNote);
    if (viewingOrder?.id === orderId) {
      setViewingOrder(null);
    }
  };

  const handleConfirmCancel = () => {
    if (!orderToCancel) return;
    if (!cancellationReason.trim()) {
      error('Mohon isi alasan pembatalan order.');
      return;
    }
    cancelOrder(orderToCancel.id, cancellationReason);
    setOrderToCancel(null);
    setCancellationReason('');
    if (viewingOrder?.id === orderToCancel.id) {
      setViewingOrder(null);
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
          Manajemen Transaksi & Order
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Periksa mutasi pembayaran QRIS, verifikasi transfer pembeli, serahkan kredensial, dan kelola invoice.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari order ID, nama, atau produk..."
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Date filter */}
            <select
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value as any)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="all">Semua Waktu</option>
              <option value="today">Hari Ini</option>
              <option value="week">Minggu Ini (7 Hari)</option>
              <option value="month">Bulan Ini (30 Hari)</option>
            </select>

            {/* Payment filter */}
            <select
              value={selectedPaymentStatus}
              onChange={(e) => setSelectedPaymentStatus(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">Semua Bayar</option>
              <option value="PAID">PAID (Sudah Bayar)</option>
              <option value="WAITING_VERIFICATION">Menunggu Verifikasi</option>
              <option value="UNPAID">UNPAID (Belum Bayar)</option>
            </select>

            {/* Order status filter */}
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
            >
              <option value="ALL">Semua Order</option>
              <option value="PENDING">PENDING</option>
              <option value="PROCESSING">PROCESSING</option>
              <option value="COMPLETED">COMPLETED</option>
              <option value="CANCELLED">CANCELLED</option>
            </select>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Order ID</th>
              <th className="py-3 px-3">Pembeli</th>
              <th className="py-3 px-3">Produk Akun</th>
              <th className="py-3 px-3 text-right">Total Tagihan</th>
              <th className="py-3 px-3 text-center">Status Bayar</th>
              <th className="py-3 px-3 text-center">Status Pesanan</th>
              <th className="py-3 px-3">Tanggal</th>
              <th className="py-3 px-3 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredOrders.map((ord) => (
              <tr key={ord.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3 font-mono font-bold text-white">
                  #{ord.orderNumber}
                </td>

                <td className="py-3.5 px-3">
                  <p className="font-semibold text-white">{ord.customerName}</p>
                  <p className="text-[11px] text-slate-400">{ord.customerPhone}</p>
                </td>

                <td className="py-3.5 px-3 max-w-[220px]">
                  <p className="font-medium text-slate-200 truncate">{ord.items[0]?.productNameSnapshot}</p>
                  <span className="text-[10px] text-cyan-400 uppercase font-bold">
                    {ord.items[0]?.productGameSnapshot}
                  </span>
                </td>

                <td className="py-3.5 px-3 text-right font-bold text-white tabular-nums">
                  Rp {ord.total.toLocaleString('id-ID')}
                </td>

                <td className="py-3.5 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ord.paymentStatus === 'PAID'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                        : ord.paymentStatus === 'WAITING_VERIFICATION'
                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/30 animate-pulse'
                        : 'bg-slate-800 text-slate-400 border border-slate-700'
                    }`}
                  >
                    {ord.paymentStatus}
                  </span>
                </td>

                <td className="py-3.5 px-3 text-center">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      ord.orderStatus === 'COMPLETED'
                        ? 'text-emerald-300 font-semibold'
                        : ord.orderStatus === 'CANCELLED'
                        ? 'text-rose-400'
                        : 'text-slate-300'
                    }`}
                  >
                    {ord.orderStatus}
                  </span>
                </td>

                <td className="py-3.5 px-3 text-slate-400 tabular-nums">
                  {new Date(ord.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </td>

                <td className="py-3.5 px-3 text-right">
                  <div className="flex items-center justify-end gap-1.5">
                    {ord.paymentStatus !== 'PAID' && ord.orderStatus !== 'CANCELLED' && (
                      <button
                        onClick={() => handleVerify(ord.id)}
                        className="px-2.5 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                        title="Verifikasi Pembayaran & Serahkan Kredensial"
                      >
                        Verifikasi
                      </button>
                    )}
                    <button
                      onClick={() => {
                        setViewingOrder(ord);
                        setAdminNote(ord.internalNote || '');
                      }}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      title="Lihat Detail Transaksi & Bukti Transfer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => onViewInvoice(ord.id)}
                      className="p-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-cyan-400 transition-colors"
                      title="Lihat Invoice"
                    >
                      <FileText className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Detail & Verification Modal */}
      {viewingOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            className="w-full max-w-2xl bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-[11px] font-bold text-cyan-400 uppercase tracking-wider">
                  Rincian Transaksi
                </span>
                <h3 className="font-heading text-xl font-bold text-white uppercase mt-0.5">
                  Order #{viewingOrder.orderNumber}
                </h3>
              </div>
              <button
                onClick={() => setViewingOrder(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Buyer Contact details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                  Informasi Pembeli:
                </span>
                <p className="font-bold text-white text-sm">{viewingOrder.customerName}</p>
                <p className="text-slate-300">{viewingOrder.customerPhone}</p>
                <p className="text-slate-400">{viewingOrder.customerEmail}</p>
                <a
                  href={`https://wa.me/${viewingOrder.customerPhone.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-emerald-400 hover:underline pt-1 font-semibold"
                >
                  <MessageCircle className="w-3.5 h-3.5" />
                  <span>Chat WhatsApp Pembeli</span>
                </a>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                <span className="text-slate-500 font-semibold block uppercase tracking-wider text-[10px]">
                  Ringkasan Finansial:
                </span>
                <p className="text-slate-400">Metode: {viewingOrder.paymentMethod} QRIS</p>
                <p className="text-slate-400">
                  Subtotal: Rp {viewingOrder.subtotal.toLocaleString('id-ID')}
                </p>
                {viewingOrder.voucherCode && (
                  <p className="text-emerald-400">
                    Voucher {viewingOrder.voucherCode}: -Rp {viewingOrder.voucherDiscount.toLocaleString('id-ID')}
                  </p>
                )}
                <p className="text-base font-bold text-white pt-1">
                  Total Bayar: Rp {viewingOrder.total.toLocaleString('id-ID')}
                </p>
              </div>
            </div>

            {/* Payment Proof View */}
            <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
              <span className="text-xs font-bold text-white uppercase tracking-wider block">
                Bukti Transfer Pelanggan:
              </span>
              {viewingOrder.paymentProofUrl ? (
                <div className="space-y-2">
                  <div className="max-h-80 overflow-hidden rounded-xl border border-slate-800 flex items-center justify-center bg-black/40">
                    <img
                      src={viewingOrder.paymentProofUrl}
                      alt="Payment proof"
                      className="max-h-80 w-auto object-contain"
                    />
                  </div>
                  {viewingOrder.paymentProofNote && (
                    <p className="text-xs text-slate-400 italic">
                      Catatan pembeli: "{viewingOrder.paymentProofNote}"
                    </p>
                  )}
                </div>
              ) : (
                <p className="text-xs text-slate-500 italic">
                  Belum ada bukti pembayaran yang diunggah untuk order ini.
                </p>
              )}
            </div>

            {/* Actions Inside Modal */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-slate-800">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onViewInvoice(viewingOrder.id)}
                  className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-white flex items-center gap-1.5"
                >
                  <FileText className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Invoice</span>
                </button>
                {viewingOrder.orderStatus !== 'CANCELLED' && viewingOrder.orderStatus !== 'COMPLETED' && (
                  <button
                    onClick={() => {
                      setOrderToCancel(viewingOrder);
                    }}
                    className="px-3 py-2 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs font-semibold text-rose-300 border border-rose-500/30"
                  >
                    Batalkan Order
                  </button>
                )}
              </div>

              {viewingOrder.paymentStatus !== 'PAID' && viewingOrder.orderStatus !== 'CANCELLED' && (
                <button
                  onClick={() => handleVerify(viewingOrder.id)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-xs font-bold text-white shadow-lg shadow-emerald-600/20 flex items-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Verifikasi Sah & Selesaikan Order</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Cancel Order Dialog */}
      <ConfirmModal
        isOpen={Boolean(orderToCancel)}
        onClose={() => setOrderToCancel(null)}
        onConfirm={handleConfirmCancel}
        title="Batalkan Pesanan Pelanggan?"
        message={`Batalkan transaksi #${orderToCancel?.orderNumber}. Wajib menyertakan alasan pembatalan untuk dicatat pada audit log.`}
        confirmLabel="Ya, Batalkan Transaksi"
        variant="danger"
      >
        <div className="space-y-1.5 text-xs text-left">
          <label className="font-semibold text-slate-300">Alasan Pembatalan:</label>
          <textarea
            required
            rows={3}
            value={cancellationReason}
            onChange={(e) => setCancellationReason(e.target.value)}
            placeholder="Contoh: Bukti transfer palsu / tidak valid, stok akun kosong, customer meminta pembatalan..."
            className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-rose-500"
          />
        </div>
      </ConfirmModal>
    </div>
  );
};
