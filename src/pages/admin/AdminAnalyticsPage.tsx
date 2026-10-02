import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import {
  DollarSign,
  ShoppingBag,
  TrendingUp,
  Eye,
  BarChart2,
  Calendar,
  Layers,
  ArrowUpRight,
} from 'lucide-react';

export const AdminAnalyticsPage: React.FC = () => {
  const { analytics, products, orders } = useStore();
  const [timeframe, setTimeframe] = useState<'7days' | '30days'>('7days');

  // Compute per-product detailed conversion stats
  const productStats = products.map((prod) => {
    const matchingCompletedOrders = orders.filter(
      (o) =>
        (o.paymentStatus === 'PAID' || o.orderStatus === 'COMPLETED') &&
        o.items.some((i) => i.productId === prod.id)
    );
    const revenue = matchingCompletedOrders.reduce((sum, o) => {
      const item = o.items.find((i) => i.productId === prod.id);
      return sum + (item ? item.finalPriceSnapshot * item.quantity : 0);
    }, 0);
    const sales = matchingCompletedOrders.length;
    const views = prod.views || 0;
    const checkouts = prod.checkoutCount || (sales * 4 + 2);
    const conversion = views > 0 ? Number(((sales / views) * 100).toFixed(2)) : 0;

    return {
      product: prod,
      views,
      checkouts,
      sales,
      revenue,
      conversion,
    };
  });

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
            Laporan Analitik & Performa Penjualan
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Analisis data tayangan akun (views), inisiasi checkout, rasio konversi, dan pertumbuhan omset.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-slate-900 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            onClick={() => setTimeframe('7days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === '7days' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            7 Hari Terakhir
          </button>
          <button
            onClick={() => setTimeframe('30days')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              timeframe === '30days' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            Bulan Ini
          </button>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Total Omset Sukses</span>
          <div className="text-2xl font-bold text-white tabular-nums">
            Rp {analytics.totalRevenue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-emerald-400 flex items-center gap-1 pt-1">
            <TrendingUp className="w-3 h-3" />
            <span>{analytics.completedOrders} transaksi berhasil</span>
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Rata-rata Nilai Order (AOV)</span>
          <div className="text-2xl font-bold text-white tabular-nums">
            Rp {analytics.averageOrderValue.toLocaleString('id-ID')}
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Per transaksi selesai</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Rasio Konversi Toko</span>
          <div className="text-2xl font-bold text-white tabular-nums">
            {analytics.conversionRate}%
          </div>
          <p className="text-[11px] text-cyan-400 pt-1">Views ke transaksi sah</p>
        </div>

        <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-1">
          <span className="text-xs text-slate-400">Total Akun Terjual</span>
          <div className="text-2xl font-bold text-white tabular-nums">
            {analytics.soldProducts} Akun
          </div>
          <p className="text-[11px] text-slate-400 pt-1">Dari {analytics.totalProducts} akun tersedia</p>
        </div>
      </div>

      {/* Revenue & Volume Chart */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <h2 className="text-sm font-bold text-white uppercase tracking-wider">
          Grafik Omset Harian (7 Hari Terakhir)
        </h2>

        <div className="h-64 flex items-end justify-between gap-4 pt-6 pb-2 border-b border-slate-800">
          {analytics.dailyRevenue.map((item, idx) => {
            const max = Math.max(...analytics.dailyRevenue.map((d) => d.revenue), 1000000);
            const heightPct = Math.max(12, Math.round((item.revenue / max) * 100));

            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group h-full justify-end">
                <div className="text-[11px] font-mono text-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity tabular-nums">
                  Rp {(item.revenue / 1000).toFixed(0)}k
                </div>
                <div
                  style={{ height: `${heightPct}%` }}
                  className="w-full rounded-t-xl bg-gradient-to-t from-blue-600 via-cyan-500 to-teal-400 group-hover:scale-102 transition-all shadow-lg shadow-cyan-500/10 cursor-pointer"
                  title={`${item.date}: Rp ${item.revenue.toLocaleString('id-ID')} (${item.orders} order)`}
                />
                <span className="text-[10px] font-mono text-slate-400">{item.date}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Per-Product Analytics Table */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl space-y-4">
        <div>
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Performa Akun Gaming Individual (Product Analytics)
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Statistik rinci views, inisiasi checkout, sales, revenue, dan conversion rate tiap akun.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
                <th className="py-3 px-3">Nama Akun & Game</th>
                <th className="py-3 px-3 text-center">Tayangan (Views)</th>
                <th className="py-3 px-3 text-center">Inisiasi Checkout</th>
                <th className="py-3 px-3 text-center">Terjual (Sales)</th>
                <th className="py-3 px-3 text-right">Total Omset</th>
                <th className="py-3 px-3 text-right">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {productStats.map((stat) => (
                <tr key={stat.product.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="py-3.5 px-3">
                    <p className="font-semibold text-white">{stat.product.name}</p>
                    <span className="text-[10px] font-bold text-cyan-400 uppercase">
                      {stat.product.game} · {stat.product.rank}
                    </span>
                  </td>
                  <td className="py-3.5 px-3 text-center tabular-nums text-slate-200 font-medium">
                    {stat.views.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-3 text-center tabular-nums text-amber-300 font-medium">
                    {stat.checkouts}
                  </td>
                  <td className="py-3.5 px-3 text-center tabular-nums text-emerald-400 font-bold">
                    {stat.sales}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums font-bold text-white">
                    Rp {stat.revenue.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-3 text-right tabular-nums font-semibold text-cyan-400">
                    {stat.conversion}%
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
