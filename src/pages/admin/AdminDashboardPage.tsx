import React from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  Gamepad2,
  Users,
  TrendingUp,
  Plus,
  Tag,
  Settings,
  QrCode,
  ArrowRight,
  Eye,
  CheckCircle2,
  Clock,
  Star,
  MessageSquare,
} from 'lucide-react';

interface AdminDashboardPageProps {
  onNavigateTab: (tab: string) => void;
  onSelectOrder: (orderId: string) => void;
  onEditProduct: (productId: string) => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  onNavigateTab,
  onSelectOrder,
  onEditProduct,
}) => {
  const { analytics, orders, products, verifyOrder, reviews, averageRatings } = useStore();

  const recentOrders = orders.slice(0, 5);
  const availableProducts = products.filter((p) => p.status === 'AVAILABLE').slice(0, 4);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl sm:text-3xl font-bold text-white uppercase tracking-tight">
            Good morning, Admin 👋
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Berikut ringkasan performa toko, transaksi terbaru, dan ketersediaan akun gaming Anda.
          </p>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => onNavigateTab('products-new')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Produk</span>
          </button>
          <button
            onClick={() => onNavigateTab('vouchers')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Buat Voucher</span>
          </button>
          <button
            onClick={() => onNavigateTab('payment')}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
          >
            <QrCode className="w-3.5 h-3.5 text-emerald-400" />
            <span>QRIS</span>
          </button>
          <button
            onClick={() => onNavigateTab('settings')}
            className="p-2 rounded-xl text-slate-400 hover:text-white bg-slate-900 border border-slate-800 transition-colors"
            title="Pengaturan"
          >
            <Settings className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 4 Overview Metrics Cards */}
      {products.length === 0 && (
        <div className="p-4 sm:p-5 rounded-2xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center shrink-0">
              <Gamepad2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-bold text-white uppercase tracking-wider">
                Stok Toko Masih 0 (Bersih / Siap Diisi)
              </p>
              <p className="text-[11px] text-slate-300">
                Semua data stok telah kosong. Anda dapat mengunggah akun gaming asli Anda sekarang dengan fitur galeri maksimal 10 slide foto per akun.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateTab('products-new')}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 transition-colors shrink-0 shadow-md shadow-blue-600/20"
          >
            + Upload Akun Sekarang (Maks 10 Slide)
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Revenue */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Pendapatan</span>
            <div className="w-8 h-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            Rp {analytics.totalRevenue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>{analytics.completedOrders} order sukses terverifikasi</span>
          </p>
        </div>

        {/* Metric 2: Orders */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Total Transaksi</span>
            <div className="w-8 h-8 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {analytics.totalOrders}
          </div>
          <p className="text-[11px] text-amber-400 flex items-center gap-1 font-medium">
            <Clock className="w-3 h-3" />
            <span>{analytics.pendingOrders} order menunggu proses</span>
          </p>
        </div>

        {/* Metric 3: Products */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Katalog Produk</span>
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 text-cyan-400 flex items-center justify-center">
              <Gamepad2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {analytics.totalProducts} Akun
          </div>
          <p className="text-[11px] text-cyan-400 font-medium">
            <span>{analytics.availableProducts} ready stock · {analytics.soldProducts} terjual</span>
          </p>
        </div>

        {/* Metric 4: Conversion */}
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg space-y-2">
          <div className="flex items-center justify-between text-xs text-slate-400">
            <span>Tingkat Konversi</span>
            <div className="w-8 h-8 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-white tabular-nums tracking-tight">
            {analytics.conversionRate}%
          </div>
          <p className="text-[11px] text-slate-400">
            Rata-rata: Rp {analytics.averageOrderValue.toLocaleString('id-ID')}
          </p>
        </div>
      </div>

      {/* Interactive Revenue Chart & Top Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Interactive Revenue Chart (8 cols) */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white uppercase tracking-wider">
                Tren Pendapatan 7 Hari Terakhir
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">Grafik omset harian dan volume order</p>
            </div>
            <button
              onClick={() => onNavigateTab('analytics')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
            >
              <span>Laporan Lengkap</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Simple Clean Responsive SVG Bar Chart */}
          <div className="pt-4">
            <div className="h-56 flex items-end justify-between gap-3 sm:gap-6 border-b border-slate-800 pb-2">
              {analytics.dailyRevenue.map((d, idx) => {
                const maxRev = Math.max(...analytics.dailyRevenue.map((i) => i.revenue), 1000000);
                const heightPct = Math.max(10, Math.round((d.revenue / maxRev) * 100));

                return (
                  <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                    <div className="text-[10px] text-slate-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                      {d.revenue > 0 ? `${(d.revenue / 1000).toFixed(0)}k` : '0'}
                    </div>
                    <div
                      style={{ height: `${heightPct}%` }}
                      className="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-cyan-400 group-hover:from-blue-500 group-hover:to-cyan-300 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
                      title={`${d.date}: Rp ${d.revenue.toLocaleString('id-ID')} (${d.orders} order)`}
                    />
                    <span className="text-[10px] font-mono text-slate-400">{d.date}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
              <span>* Klik kolom bar untuk melihat rincian tanggal transaksi</span>
              <span className="tabular-nums">Skala: Real-time Database</span>
            </div>
          </div>
        </div>

        {/* Right Column: Top Products (4 cols) */}
        <div className="lg:col-span-4 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Top Produk</h2>
            <button
              onClick={() => onNavigateTab('products')}
              className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold"
            >
              Semua
            </button>
          </div>

          <div className="space-y-3">
            {analytics.topProducts.slice(0, 4).map(({ product, revenue, orders: ordCount, views }) => (
              <div
                key={product.id}
                onClick={() => onEditProduct(product.id)}
                className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-cyan-500/40 transition-colors cursor-pointer flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-white truncate">{product.name}</p>
                  <p className="text-[10px] text-slate-400">
                    {product.game} · {views} views · {ordCount} laku
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-xs font-bold text-cyan-400 tabular-nums">
                    Rp {revenue.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Rating & Customer Satisfaction Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-950/30 via-slate-900 to-cyan-950/30 border border-slate-800 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center shrink-0">
            <Star className="w-6 h-6 fill-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">
                Indeks Kepuasan Pelanggan (CSAT)
              </h3>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                {reviews.length} Ulasan Terverifikasi
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5">
              Rating Pelayanan: <strong className="text-cyan-400">{averageRatings.serviceAverage > 0 ? averageRatings.serviceAverage.toFixed(1) : '5.0'}★</strong> · Kualitas Akun: <strong className="text-amber-400">{averageRatings.productAverage > 0 ? averageRatings.productAverage.toFixed(1) : '5.0'}★</strong>
            </p>
          </div>
        </div>

        <button
          onClick={() => onNavigateTab('reviews')}
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors shrink-0"
        >
          <span>Kelola Semua Ulasan & Rating</span>
          <ArrowRight className="w-3.5 h-3.5 text-cyan-400" />
        </button>
      </div>

      {/* Recent Orders Section */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-white uppercase tracking-wider">Transaksi Terbaru</h2>
            <p className="text-xs text-slate-400 mt-0.5">Daftar transaksi yang baru masuk dari pembeli</p>
          </div>
          <button
            onClick={() => onNavigateTab('orders')}
            className="text-xs text-cyan-400 hover:text-cyan-300 font-semibold flex items-center gap-1"
          >
            <span>Buka Semua Transaksi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Order ID</th>
                <th className="py-3 px-3">Customer</th>
                <th className="py-3 px-3">Produk</th>
                <th className="py-3 px-3 text-right">Total</th>
                <th className="py-3 px-3 text-center">Status Bayar</th>
                <th className="py-3 px-3 text-center">Status Order</th>
                <th className="py-3 px-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {recentOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3 font-mono font-bold text-white">
                    #{ord.orderNumber}
                  </td>
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">{ord.customerName}</p>
                    <p className="text-[11px] text-slate-400">{ord.customerPhone}</p>
                  </td>
                  <td className="py-3.5 px-3 max-w-[200px] truncate text-slate-300">
                    {ord.items[0]?.productNameSnapshot || 'Akun Gaming'}
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
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      {ord.paymentStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center">
                    <span className="text-[11px] font-semibold text-slate-300">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      {ord.paymentStatus === 'WAITING_VERIFICATION' && (
                        <button
                          onClick={() => verifyOrder(ord.id)}
                          className="px-2 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-[11px] transition-colors"
                          title="Verifikasi Pembayaran"
                        >
                          Verifikasi
                        </button>
                      )}
                      <button
                        onClick={() => onSelectOrder(ord.id)}
                        className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] transition-colors"
                      >
                        Detail
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
