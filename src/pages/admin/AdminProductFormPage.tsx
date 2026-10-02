import React, { useState, useEffect } from 'react';
import { useStore } from '../../context/StoreContext';
import { Product, ProductBadge, ProductStatus } from '../../types';
import { MultiImageUploader } from '../../components/common/MultiImageUploader';
import { ArrowLeft, Save, Sparkles, Lock, Plus, X } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

interface AdminProductFormPageProps {
  productId?: string;
  onBack: () => void;
  onSaved: () => void;
}

export const AdminProductFormPage: React.FC<AdminProductFormPageProps> = ({
  productId,
  onBack,
  onSaved,
}) => {
  const { getProduct, createProduct, updateProduct } = useStore();
  const { success, error } = useToast();

  const isEdit = Boolean(productId);
  const existingProduct = productId ? getProduct(productId) : null;

  // Form states
  const [name, setName] = useState('');
  const [game, setGame] = useState('Mobile Legends');
  const [category, setCategory] = useState('MOBA');
  const [platform, setPlatform] = useState('Android / iOS');
  const [rank, setRank] = useState('');
  const [level, setLevel] = useState<number>(50);
  const [skinCount, setSkinCount] = useState<number>(20);
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState<number>(500000);
  const [discountType, setDiscountType] = useState<'NONE' | 'PERCENTAGE' | 'FIXED'>('NONE');
  const [discountValue, setDiscountValue] = useState<number>(0);
  const [status, setStatus] = useState<ProductStatus>('AVAILABLE');
  const [badge, setBadge] = useState<ProductBadge>('AVAILABLE');
  const [images, setImages] = useState<string[]>([
    '/src/assets/images/mlbb_mythic_showcase_1790923035330.jpg',
  ]);
  const [internalNotes, setInternalNotes] = useState('');

  // Sensitive credentials (shown only in admin and unlocked for buyer upon completion)
  const [loginType, setLoginType] = useState('Moonton All Unbind');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailRecovery, setEmailRecovery] = useState('');
  const [handoverNotes, setHandoverNotes] = useState('');

  // Premium skins tags
  const [premiumSkinsInput, setPremiumSkinsInput] = useState('');
  const [premiumSkins, setPremiumSkins] = useState<string[]>([]);

  useEffect(() => {
    if (existingProduct) {
      setName(existingProduct.name);
      setGame(existingProduct.game);
      setCategory(existingProduct.category);
      setPlatform(existingProduct.platform);
      setRank(existingProduct.rank);
      setLevel(existingProduct.level);
      setSkinCount(existingProduct.skinCount);
      setDescription(existingProduct.description);
      setPrice(existingProduct.price);
      setDiscountType(existingProduct.discountType);
      setDiscountValue(existingProduct.discountValue);
      setStatus(existingProduct.status);
      if (existingProduct.badge) setBadge(existingProduct.badge);
      setImages(existingProduct.images || []);
      setInternalNotes(existingProduct.internalNotes || '');
      setPremiumSkins(existingProduct.premiumSkins || []);

      if (existingProduct.credentials) {
        setLoginType(existingProduct.credentials.loginType || '');
        setUsername(existingProduct.credentials.username || '');
        setPassword(existingProduct.credentials.password || '');
        setEmailRecovery(existingProduct.credentials.emailRecovery || '');
        setHandoverNotes(existingProduct.credentials.handoverNotes || '');
      }
    }
  }, [existingProduct]);

  // Calculated final price preview
  let finalPrice = price;
  if (discountType === 'PERCENTAGE' && discountValue > 0) {
    finalPrice = Math.max(0, Math.round(price * (1 - discountValue / 100)));
  } else if (discountType === 'FIXED' && discountValue > 0) {
    finalPrice = Math.max(0, price - discountValue);
  }

  const handleAddSkinTag = () => {
    if (premiumSkinsInput.trim()) {
      setPremiumSkins([...premiumSkins, premiumSkinsInput.trim()]);
      setPremiumSkinsInput('');
    }
  };

  const handleRemoveSkinTag = (idx: number) => {
    setPremiumSkins(premiumSkins.filter((_, i) => i !== idx));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      error('Mohon isi nama akun / produk.');
      return;
    }
    if (!rank.trim()) {
      error('Mohon isi tier rank akun.');
      return;
    }
    if (price <= 0) {
      error('Harga akun harus lebih besar dari 0.');
      return;
    }
    if (images.length === 0 || !images[0]) {
      error('Mohon sertakan minimal satu gambar showcase akun.');
      return;
    }

    const payload = {
      name: name.trim(),
      game,
      category,
      platform,
      rank: rank.trim(),
      level: Number(level) || 1,
      skinCount: Number(skinCount) || 0,
      premiumSkins,
      description: description.trim(),
      price: Number(price),
      discountType,
      discountValue: Number(discountValue) || 0,
      finalPrice,
      status,
      badge,
      images,
      internalNotes: internalNotes.trim(),
      credentials: {
        loginType,
        username,
        password,
        emailRecovery,
        handoverNotes,
      },
    };

    if (isEdit && productId) {
      updateProduct(productId, payload);
      onSaved();
    } else {
      createProduct(payload);
      onSaved();
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Top Bar */}
      <div className="flex items-center justify-between border-b border-white/5 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali ke Daftar Akun</span>
        </button>

        <h2 className="font-heading text-xl font-bold text-white uppercase">
          {isEdit ? 'Edit Akun Gaming' : 'Tambah Akun Gaming Baru'}
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 text-xs">
        {/* Section 1: Basic Information */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Informasi Dasar Produk
          </h3>

          <div className="space-y-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Produk / Akun</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Contoh: Vortex MLBB #003 - Mythic Glory Collector"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Game</label>
                <select
                  value={game}
                  onChange={(e) => setGame(e.target.value)}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none"
                >
                  <option value="Mobile Legends">Mobile Legends</option>
                  <option value="Free Fire">Free Fire</option>
                  <option value="Valorant">Valorant</option>
                  <option value="Genshin Impact">Genshin Impact</option>
                  <option value="PUBG Mobile">PUBG Mobile</option>
                  <option value="Honor of Kings">Honor of Kings</option>
                  <option value="Steam / PC Games">Steam / PC Games</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Kategori</label>
                <input
                  type="text"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="Contoh: MOBA, FPS, Battle Royale"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Platform</label>
                <input
                  type="text"
                  value={platform}
                  onChange={(e) => setPlatform(e.target.value)}
                  placeholder="Contoh: Android / iOS, PC"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">Tier / Rank Akun</label>
                <input
                  type="text"
                  required
                  value={rank}
                  onChange={(e) => setRank(e.target.value)}
                  placeholder="Contoh: Mythic Glory (100 Stars), Immortal 2"
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Total Skin</label>
                <input
                  type="number"
                  min="0"
                  value={skinCount}
                  onChange={(e) => setSkinCount(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>

              <div>
                <label className="block text-slate-300 font-semibold mb-1">Level Akun</label>
                <input
                  type="number"
                  min="1"
                  value={level}
                  onChange={(e) => setLevel(Number(e.target.value))}
                  className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
              </div>
            </div>

            {/* Premium Skins Tag Input */}
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Daftar Skin Mewah / Premium</label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={premiumSkinsInput}
                  onChange={(e) => setPremiumSkinsInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSkinTag();
                    }
                  }}
                  placeholder="Ketik skin lalu tekan Enter (Contoh: Gusion Legend, Bundle Titan)"
                  className="flex-1 px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
                />
                <button
                  type="button"
                  onClick={handleAddSkinTag}
                  className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-semibold"
                >
                  Tambah
                </button>
              </div>

              {premiumSkins.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {premiumSkins.map((sk, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-1 rounded-lg bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 flex items-center gap-1.5"
                    >
                      <span>{sk}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveSkinTag(idx)}
                        className="text-slate-400 hover:text-white"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Deskripsi Lengkap Akun</label>
              <textarea
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Rincian akun, winrate, status unbind, kelengkapan emblem..."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Pricing & Discount */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            2. Harga & Skema Diskon
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Harga Normal (Rp)</label>
              <input
                type="number"
                required
                min="1000"
                step="1000"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold tabular-nums"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Jenis Diskon</label>
              <select
                value={discountType}
                onChange={(e) => setDiscountType(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="NONE">Tidak Ada Diskon</option>
                <option value="PERCENTAGE">Persentase (%)</option>
                <option value="FIXED">Nominal Langsung (Rp)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                Nilai Diskon {discountType === 'PERCENTAGE' ? '(%)' : '(Rp)'}
              </label>
              <input
                type="number"
                min="0"
                disabled={discountType === 'NONE'}
                value={discountValue}
                onChange={(e) => setDiscountValue(Number(e.target.value))}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white disabled:opacity-40"
              />
            </div>
          </div>

          {/* Live Price Preview Box */}
          <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <span className="text-slate-400 font-medium">Harga Akhir yang Ditampilkan ke Pembeli:</span>
            <div className="text-right">
              {discountType !== 'NONE' && discountValue > 0 && (
                <span className="line-through text-slate-500 block text-[11px] tabular-nums">
                  Rp {price.toLocaleString('id-ID')}
                </span>
              )}
              <span className="text-base font-bold text-cyan-400 tabular-nums">
                Rp {finalPrice.toLocaleString('id-ID')}
              </span>
            </div>
          </div>
        </div>

        {/* Section 3: Status, Badge, & Showcase Images */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
          <h3 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Status Etalase & Gambar Akun
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Status Publikasi</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="AVAILABLE">Tersedia (Ready Stock di Toko)</option>
                <option value="SOLD">Sudah Terjual (Sold Out)</option>
                <option value="HIDDEN">Sembunyikan dari Etalase</option>
                <option value="ARCHIVED">Diarsipkan (Soft Delete)</option>
              </select>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Badge Sorotan</label>
              <select
                value={badge}
                onChange={(e) => setBadge(e.target.value as any)}
                className="w-full px-3 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="AVAILABLE">AVAILABLE</option>
                <option value="HOT">HOT (Paling Dicari)</option>
                <option value="NEW">NEW (Akun Baru Masuk)</option>
                <option value="DISCOUNT">DISCOUNT (Promo)</option>
                <option value="SOLD">SOLD</option>
              </select>
            </div>
          </div>

          <div className="pt-2">
            <MultiImageUploader
              images={images}
              onChange={setImages}
              maxImages={10}
              label="Galeri Foto Showcase Akun (Maksimal 10 Slide)"
              helperText="Upload hingga 10 tangkapan layar akun (Profil, skin, tier, winrate, emblem). Foto pertama (Cover) tampil di etalase katalog."
            />
          </div>
        </div>

        {/* Section 4: Sensitive Account Credentials (SAFELY ENCRYPTED / ONLY RELEASED ON COMPLETED) */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-900 to-slate-950 border border-cyan-500/20 space-y-4 shadow-xl">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-cyan-400" />
            <h3 className="text-sm font-bold text-white uppercase tracking-wider">
              4. Kredensial Akun Game (Disimpan Aman untuk Serah Terima)
            </h3>
          </div>
          <p className="text-[11px] text-slate-400">
            Data ini TIDAK AKAN ditampilkan kepada publik. Hanya akan otomatis diserahkan kepada pembeli setelah admin memverifikasi pembayaran (Status: COMPLETED).
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Metode Login</label>
              <input
                type="text"
                value={loginType}
                onChange={(e) => setLoginType(e.target.value)}
                placeholder="Contoh: Moonton Sepaket Email / Google Account"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Email Pemulihan / Kontak Garansi</label>
              <input
                type="text"
                value={emailRecovery}
                onChange={(e) => setEmailRecovery(e.target.value)}
                placeholder="recovery@vortex.id"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Username / ID Login Akun</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="email_akun@gmail.com"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Kata Sandi (Password)</label>
              <input
                type="text"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="PasswordRahasia123!"
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Panduan Serah Terima Khusus untuk Pembeli</label>
            <textarea
              rows={2}
              value={handoverNotes}
              onChange={(e) => setHandoverNotes(e.target.value)}
              placeholder="Instruksi khusus setelah login, misal: Ganti nomor HP Moonton dan email primary."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
            />
          </div>

          <div>
            <label className="block text-slate-300 font-semibold mb-1">Catatan Internal Toko (Hanya Terlihat Admin)</label>
            <input
              type="text"
              value={internalNotes}
              onChange={(e) => setInternalNotes(e.target.value)}
              placeholder="Asal supplier, tanggal beli masuk, modal awal..."
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-slate-400"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onBack}
            className="px-5 py-2.5 rounded-xl font-semibold text-xs text-slate-400 hover:text-white bg-slate-800 transition-colors"
          >
            Batal
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isEdit ? 'Simpan Perubahan Akun' : 'Publikasikan Akun ke Toko'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
