import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import { X, User, Lock, Mail, Phone, ShieldCheck } from 'lucide-react';
import { useToast } from '../context/ToastContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const { login, register, settings } = useStore();
  const { error } = useToast();
  const [isAdminPortal, setIsAdminPortal] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (isAdminPortal) {
      if (email.toLowerCase().trim() === 'admin@vortex.id') {
        const ok = login('admin@vortex.id');
        if (ok) {
          onClose();
          if (onSuccess) onSuccess();
        }
      } else {
        error('Akses ditolak. Email tidak terdaftar sebagai Administrator.');
      }
      return;
    }

    if (isRegister) {
      const ok = register(name, email, phone);
      if (ok) {
        onClose();
        if (onSuccess) onSuccess();
      }
    } else {
      const ok = login(email);
      if (ok) {
        onClose();
        if (onSuccess) onSuccess();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-cyan-400">
              {isAdminPortal ? 'Autentikasi Administrator' : 'Akun Pelanggan'}
            </span>
            <h2 className="font-heading text-2xl font-bold text-white uppercase mt-0.5">
              {isAdminPortal
                ? 'Portal Admin'
                : isRegister
                ? 'Daftar Akun'
                : `Masuk ke ${settings.storeName}`}
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              {isAdminPortal
                ? 'Akses terbatas khusus pemilik toko'
                : isRegister
                ? 'Buat akun untuk riwayat pembelian & invoice'
                : 'Masuk untuk memantau status pesanan Anda'}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Regular / Admin Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          {!isAdminPortal && isRegister && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Lengkap</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Contoh: Budi Santoso"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">
              {isAdminPortal ? 'Email Administrator' : 'Alamat Email'}
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder={isAdminPortal ? 'admin@vortex.id' : 'nama@email.com'}
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
            {isAdminPortal && (
              <span className="text-[10px] text-slate-500 mt-1 block">
                Petunjuk Admin: Masukkan <code>admin@vortex.id</code>
              </span>
            )}
          </div>

          {!isAdminPortal && isRegister && (
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nomor WhatsApp Aktif</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="08xxxxxxxxxx"
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Kata Sandi</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-lg shadow-blue-600/20 transition-all mt-2"
          >
            {isAdminPortal ? 'Masuk ke Panel Admin' : isRegister ? 'Daftar Sekarang' : 'Masuk ke Akun'}
          </button>
        </form>

        <div className="pt-2 flex flex-col items-center gap-2 text-xs text-slate-400 border-t border-slate-800/80">
          {!isAdminPortal ? (
            <>
              {isRegister ? (
                <p>
                  Sudah punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegister(false)}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Masuk di sini
                  </button>
                </p>
              ) : (
                <p>
                  Belum punya akun?{' '}
                  <button
                    type="button"
                    onClick={() => setIsRegister(true)}
                    className="text-cyan-400 hover:underline font-semibold"
                  >
                    Daftar akun baru
                  </button>
                </p>
              )}

              <button
                type="button"
                onClick={() => {
                  setIsAdminPortal(true);
                  setEmail('admin@vortex.id');
                  setPassword('admin123');
                }}
                className="text-[11px] text-slate-500 hover:text-slate-300 transition-colors pt-1"
              >
                Masuk sebagai Admin Toko
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={() => {
                setIsAdminPortal(false);
                setEmail('');
                setPassword('');
              }}
              className="text-xs text-cyan-400 hover:underline font-semibold"
            >
              ← Kembali ke Login Pelanggan
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
