import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ConfirmModal } from '../../components/common/ConfirmModal';
import {
  LayoutDashboard,
  Gamepad2,
  Receipt,
  Tag,
  BarChart3,
  Palette,
  QrCode,
  Settings,
  History,
  Store,
  LogOut,
  RotateCcw,
  Menu,
  X,
  Sparkles,
  ShieldAlert,
  Trash2,
  Star,
} from 'lucide-react';

interface AdminLayoutProps {
  currentTab: string;
  onNavigateTab: (tab: string) => void;
  onBackToStore: () => void;
  children: React.ReactNode;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentTab,
  onNavigateTab,
  onBackToStore,
  children,
}) => {
  const { settings, currentUser, setCurrentUser, resetToFactory, resetToCleanSlate, logout, login } = useStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [isCleanSlateModalOpen, setIsCleanSlateModalOpen] = useState(false);

  const [adminEmailInput, setAdminEmailInput] = useState('');
  const [adminPasswordInput, setAdminPasswordInput] = useState('');
  const [loginError, setLoginError] = useState('');

  // If not admin, provide secure admin login gate
  if (currentUser?.role !== 'ADMIN') {
    const handleAdminLogin = (e: React.FormEvent) => {
      e.preventDefault();
      if (adminEmailInput.toLowerCase().trim() === 'admin@vortex.id') {
        const ok = login('admin@vortex.id');
        if (!ok) setLoginError('Kata sandi atau email admin tidak sesuai.');
      } else {
        setLoginError('Email tidak terdaftar sebagai Administrator.');
      }
    };

    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
        <div className="max-w-md w-full p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 flex items-center justify-center mx-auto">
              <ShieldAlert className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-bold text-white uppercase tracking-wider">Akses Panel Admin</h2>
            <p className="text-xs text-slate-400">
              Area khusus pemilik toko {settings.storeName}. Masukkan kredensial administrator Anda.
            </p>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Administrator</label>
              <input
                type="email"
                required
                value={adminEmailInput}
                onChange={(e) => setAdminEmailInput(e.target.value)}
                placeholder="admin@vortex.id"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kata Sandi</label>
              <input
                type="password"
                required
                value={adminPasswordInput}
                onChange={(e) => setAdminPasswordInput(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            {loginError && (
              <p className="text-xs text-rose-400 font-medium">{loginError}</p>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 transition-colors shadow-lg shadow-blue-600/20"
            >
              Masuk ke Admin Panel
            </button>
          </form>

          <div className="pt-2 text-center border-t border-slate-800/80">
            <button
              onClick={onBackToStore}
              className="text-xs text-slate-400 hover:text-white transition-colors"
            >
              ← Kembali ke Toko
            </button>
          </div>
        </div>
      </div>
    );
  }

  const navItems = [
    { id: 'dashboard', label: 'Ringkasan & KPI', icon: LayoutDashboard },
    { id: 'products', label: 'Kelola Produk', icon: Gamepad2 },
    { id: 'orders', label: 'Transaksi & Pesanan', icon: Receipt },
    { id: 'reviews', label: 'Ulasan & Rating', icon: Star },
    { id: 'vouchers', label: 'Kupon & Voucher', icon: Tag },
    { id: 'analytics', label: 'Analitik Penjualan', icon: BarChart3 },
    { id: 'appearance', label: 'Tema & Tampilan', icon: Palette },
    { id: 'payment', label: 'Pengaturan QRIS', icon: QrCode },
    { id: 'settings', label: 'Pengaturan Toko', icon: Settings },
    { id: 'audit-logs', label: 'Audit Log', icon: History },
  ];

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col md:flex-row text-slate-100">
      {/* Sidebar for Desktop */}
      <aside className="hidden md:flex flex-col w-64 border-r border-white/5 bg-slate-950/90 shrink-0">
        {/* Brand header */}
        <div className="p-5 border-b border-white/5 flex items-center justify-between">
          <div className="flex items-center gap-2.5 min-w-0">
            {settings.logo ? (
              <img
                src={settings.logo}
                alt={settings.storeName}
                className="w-8 h-8 rounded-lg object-contain border border-cyan-500/30"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white">
                V
              </div>
            )}
            <div className="min-w-0">
              <span className="font-heading text-sm font-bold text-white uppercase tracking-wider block truncate">
                {settings.storeName}
              </span>
              <span className="text-[10px] text-cyan-400 font-semibold uppercase block">Admin Dashboard</span>
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-3 space-y-1 flex-1 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigateTab(item.id)}
                className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-blue-600/30 to-cyan-600/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-white hover:bg-slate-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-cyan-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Footer controls in sidebar */}
        <div className="p-3 border-t border-white/5 space-y-2">
          <button
            onClick={onBackToStore}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-semibold text-slate-300 hover:text-white transition-colors border border-slate-800"
          >
            <Store className="w-4 h-4 text-cyan-400" />
            <span>Lihat Storefront Toko</span>
          </button>

          <button
            onClick={() => setIsCleanSlateModalOpen(true)}
            title="Kosongkan semua produk, pesanan, dan voucher agar siap mulai dari nol"
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-rose-950/40 hover:bg-rose-900/60 text-xs font-semibold text-rose-300 hover:text-white transition-colors border border-rose-500/30"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Kosongkan Data (Mulai Nol)</span>
          </button>

          <button
            onClick={resetToFactory}
            title="Kembalikan semua data ke seed data default"
            className="w-full flex items-center justify-center gap-1.5 py-1 text-[11px] font-medium text-slate-500 hover:text-slate-300 transition-colors"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Isi Ulang Demo Data</span>
          </button>
        </div>
      </aside>

      {/* Mobile Top Header */}
      <div className="md:hidden flex items-center justify-between p-4 border-b border-white/5 bg-slate-950">
        <div className="flex items-center gap-2">
          {settings.logo && (
            <img src={settings.logo} alt="" className="w-7 h-7 rounded-lg object-contain" />
          )}
          <span className="font-heading text-sm font-bold text-white uppercase">{settings.storeName}</span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={onBackToStore}
            className="p-1.5 rounded-lg bg-slate-900 border border-slate-800 text-cyan-400 text-xs font-semibold"
          >
            <Store className="w-4 h-4" />
          </button>
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-1.5 rounded-lg bg-slate-900 text-slate-300"
          >
            {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="md:hidden border-b border-white/5 bg-slate-950 p-4 space-y-1 z-40">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigateTab(item.id);
                  setMobileSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-semibold ${
                  isActive ? 'bg-cyan-500/20 text-cyan-300' : 'text-slate-400 hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Main Admin Content Viewport */}
      <main className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top bar inside admin */}
        <div className="h-14 border-b border-white/5 px-6 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>Admin</span>
            <span>/</span>
            <span className="text-white font-semibold capitalize">
              {navItems.find((n) => n.id === currentTab)?.label || currentTab}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-slate-300 font-medium hidden sm:inline">{currentUser.name}</span>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-8 flex-1">{children}</div>
      </main>

      {/* Confirmation Modal to Clear All Store Data to 0 */}
      <ConfirmModal
        isOpen={isCleanSlateModalOpen}
        onClose={() => setIsCleanSlateModalOpen(false)}
        onConfirm={resetToCleanSlate}
        title="Kosongkan Semua Data Toko (Mulai dari Nol)?"
        message="Tindakan ini akan mengosongkan seluruh data: 0 Produk (Stok Bersih), 0 Transaksi & Riwayat Order, serta 0 Voucher Promo. Pengaturan toko, nama, logo, QRIS, dan akses akun Admin Anda tetap aman tersimpan. Anda siap memasukkan stok produk asli toko dari awal."
        confirmLabel="Ya, Kosongkan Semua Data ke Nol"
        variant="danger"
      />
    </div>
  );
};
