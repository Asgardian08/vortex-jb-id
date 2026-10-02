import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { History, Search, Shield, Filter } from 'lucide-react';

export const AdminAuditLogsPage: React.FC = () => {
  const { auditLogs } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const filteredLogs = auditLogs.filter((log) => {
    if (actionFilter !== 'ALL' && !log.action.includes(actionFilter)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchAction = log.action.toLowerCase().includes(q);
      const matchUser = log.userName.toLowerCase().includes(q);
      const matchDetails = log.details.toLowerCase().includes(q);
      if (!matchAction && !matchUser && !matchDetails) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
          Audit Log & Riwayat Aktivitas Sistem
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Rekaman jejak aktivitas admin: pembuatan produk, verifikasi pembayaran, pembatalan order, serta perubahan pengaturan.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-2xl border border-slate-800">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari aktivitas atau pengguna..."
            className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50"
          />
        </div>

        <select
          value={actionFilter}
          onChange={(e) => setActionFilter(e.target.value)}
          className="px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none"
        >
          <option value="ALL">Semua Aksi</option>
          <option value="PRODUCT">Produk (Created / Updated / Archived)</option>
          <option value="ORDER">Pesanan (Created / Verified / Cancelled)</option>
          <option value="VOUCHER">Voucher</option>
          <option value="SETTINGS">Pengaturan Toko</option>
        </select>
      </div>

      {/* Logs Table */}
      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-800 text-slate-400 font-semibold uppercase tracking-wider">
              <th className="py-3 px-3">Tindakan / Aksi</th>
              <th className="py-3 px-3">Pengguna</th>
              <th className="py-3 px-3">Target Entitas</th>
              <th className="py-3 px-3">Rincian Deskripsi</th>
              <th className="py-3 px-3 text-right">Waktu</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60">
            {filteredLogs.map((log) => (
              <tr key={log.id} className="hover:bg-slate-800/40 transition-colors">
                <td className="py-3.5 px-3">
                  <span
                    className={`font-mono text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${
                      log.action.includes('PAYMENT') || log.action.includes('CREATED')
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : log.action.includes('CANCEL') || log.action.includes('DELETE') || log.action.includes('ARCHIVE')
                        ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}
                  >
                    {log.action}
                  </span>
                </td>

                <td className="py-3.5 px-3 font-medium text-white">
                  {log.userName}
                </td>

                <td className="py-3.5 px-3 text-slate-300 font-mono text-[11px]">
                  {log.targetType} <span className="text-slate-500">#{log.targetId.slice(0, 14)}</span>
                </td>

                <td className="py-3.5 px-3 text-slate-300 max-w-md">
                  {log.details}
                </td>

                <td className="py-3.5 px-3 text-right tabular-nums text-slate-400 text-[11px]">
                  {new Date(log.createdAt).toLocaleString('id-ID', {
                    day: 'numeric',
                    month: 'short',
                    hour: '2-digit',
                    minute: '2-digit',
                    second: '2-digit',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
