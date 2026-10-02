import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { Order } from '../types';
import { ShoppingBag, Search, ChevronRight, FileText, CheckCircle2, Clock, XCircle, Lock, MailCheck, Star } from 'lucide-react';

interface OrdersHistoryPageProps {
  onSelectOrder: (orderId: string) => void;
  onViewInvoice: (orderId: string) => void;
  onBrowseProducts: () => void;
  onOpenAuth?: () => void;
}

export const OrdersHistoryPage: React.FC<OrdersHistoryPageProps> = ({
  onSelectOrder,
  onViewInvoice,
  onBrowseProducts,
  onOpenAuth,
}) => {
  const { orders, currentUser } = useStore();
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Restrict access: Only logged in customers can access Cek Pesanan
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
            Akses Cek Pesanan Terbatas
          </h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            Demi keamanan data transaksi dan privasi akun game Anda, fitur <strong>Cek Pesanan</strong> hanya dapat diakses oleh pelanggan yang telah login ke akun mereka.
          </p>
        </div>
        <div className="space-y-2.5 pt-2">
          <button
            onClick={onOpenAuth}
            className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
          >
            Masuk / Buat Akun Pelanggan
          </button>
          <button
            onClick={onBrowseProducts}
            className="w-full py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            Kembali ke Katalog Akun
          </button>
        </div>
      </div>
    );
  }

  // Filter orders strictly by the logged-in customer's ID or email
  const userOrders = orders.filter((o) => {
    if (currentUser.role === 'ADMIN') return true;
    return (
      o.userId === currentUser.id ||
      o.customerEmail.toLowerCase().trim() === currentUser.email.toLowerCase().trim()
    );
  });

  const filteredOrders = userOrders.filter((o) => {
    if (statusFilter !== 'ALL' && o.orderStatus !== statusFilter) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchNum = o.orderNumber.toLowerCase().includes(q);
      const matchName = o.customerName.toLowerCase().includes(q);
      const matchItem = o.items.some((i) => i.productNameSnapshot.toLowerCase().includes(q));
      if (!matchNum && !matchName && !matchItem) return false;
    }
    return true;
  });

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-heading text-3xl font-bold text-white uppercase">
          Riwayat & Cek Pesanan
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Pantau progres verifikasi akun game, upload bukti pembayaran, dan unduh invoice resmi Anda.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor order (VX-...) atau produk..."
            className="w-full pl-9 pr-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {[
            { label: 'Semua', val: 'ALL' },
            { label: 'Pending', val: 'PENDING' },
            { label: 'Diproses', val: 'PROCESSING' },
            { label: 'Selesai', val: 'COMPLETED' },
            { label: 'Dibatalkan', val: 'CANCELLED' },
          ].map((tab) => (
            <button
              key={tab.val}
              onClick={() => setStatusFilter(tab.val)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors shrink-0 ${
                statusFilter === tab.val
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      {filteredOrders.length > 0 ? (
        <div className="space-y-4">
          {filteredOrders.map((order) => {
            const isCompleted = order.orderStatus === 'COMPLETED';
            const isCancelled = order.orderStatus === 'CANCELLED';
            const isWaiting = order.paymentStatus === 'WAITING_VERIFICATION';

            return (
              <div
                key={order.id}
                onClick={() => onSelectOrder(order.id)}
                className="group p-5 rounded-2xl bg-slate-900/80 border border-slate-800 hover:border-cyan-500/40 transition-all cursor-pointer shadow-lg space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800/80 pb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold text-white group-hover:text-cyan-400 transition-colors">
                      #{order.orderNumber}
                    </span>
                    <span className="text-xs text-slate-500">·</span>
                    <span className="text-xs text-slate-400">
                      {new Date(order.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                  </div>

                  <span
                    className={`self-start sm:self-auto text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-md border ${
                      isCompleted
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : isCancelled
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : isWaiting
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                        : 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                    }`}
                  >
                    {isCompleted
                      ? 'SELESAI (TERKIRIM)'
                      : isCancelled
                      ? 'DIBATALKAN'
                      : isWaiting
                      ? 'MENUNGGU VERIFIKASI'
                      : 'MENUNGGU PEMBAYARAN'}
                  </span>
                </div>

                {/* Items */}
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={order.items[0]?.productImageSnapshot || '/src/assets/images/mlbb_mythic_showcase_1790923035330.jpg'}
                      alt={order.items[0]?.productNameSnapshot}
                      className="w-12 h-12 rounded-lg object-cover border border-slate-800 shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-white truncate">
                        {order.items[0]?.productNameSnapshot}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {order.items[0]?.productGameSnapshot} · {order.items[0]?.productRankSnapshot}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-[10px] text-slate-400 block">Total Tagihan</span>
                    <span className="text-sm font-bold text-white tabular-nums">
                      Rp {order.total.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>

                {/* Bottom Row Actions */}
                <div className="pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onViewInvoice(order.id);
                      }}
                      className="text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5" />
                      <span>Nota / Invoice</span>
                    </button>
                    {isCompleted && (
                      <>
                        <span className="text-emerald-400 font-semibold flex items-center gap-1">
                          <MailCheck className="w-3.5 h-3.5" />
                          Kredensial Terkirim ke Email
                        </span>
                        {order.reviewSubmitted ? (
                          <span className="text-amber-400 font-semibold flex items-center gap-1">
                            <Star className="w-3.5 h-3.5 fill-amber-400" />
                            Sudah Dinilai
                          </span>
                        ) : (
                          <span className="text-amber-400 font-semibold flex items-center gap-1 hover:text-amber-300">
                            <Star className="w-3.5 h-3.5" />
                            Beri Rating
                          </span>
                        )}
                      </>
                    )}
                  </div>

                  <div className="text-cyan-400 font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>Detail Pesanan</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="py-20 text-center rounded-2xl bg-slate-900/40 border border-slate-800 space-y-4">
          <ShoppingBag className="w-10 h-10 text-slate-600 mx-auto" />
          <div>
            <p className="text-sm font-semibold text-slate-300">Belum ada pesanan ditemukan.</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Anda belum melakukan pembelian akun gaming di {currentUser ? currentUser.name : 'toko kami'}.
            </p>
          </div>
          <button
            onClick={onBrowseProducts}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors"
          >
            Mulai Belanja Akun
          </button>
        </div>
      )}
    </div>
  );
};
