import React, { useState, useMemo } from 'react';
import { useStore } from '../context/StoreContext';
import { Product } from '../types';
import { ProductCard } from '../components/storefront/ProductCard';
import { Search, Filter, RotateCcw } from 'lucide-react';

interface ProductsPageProps {
  onSelectProduct: (product: Product) => void;
  onCheckoutProduct: (product: Product) => void;
}

export const ProductsPage: React.FC<ProductsPageProps> = ({
  onSelectProduct,
  onCheckoutProduct,
}) => {
  const { products } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGame, setSelectedGame] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');
  const [minPrice, setMinPrice] = useState<string>('');
  const [maxPrice, setMaxPrice] = useState<string>('');
  const [selectedSort, setSelectedSort] = useState<'newest' | 'price_asc' | 'price_desc' | 'popular' | 'discount_desc'>('newest');

  const availableGames = useMemo(() => {
    const set = new Set<string>();
    products.forEach((p) => {
      if (p.status !== 'ARCHIVED') set.add(p.game);
    });
    return Array.from(set);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      if (p.status === 'ARCHIVED' || p.status === 'HIDDEN') return false;
      if (selectedStatus !== 'ALL' && p.status !== selectedStatus) return false;
      if (selectedGame !== 'ALL' && p.game !== selectedGame) return false;
      if (minPrice && p.finalPrice < Number(minPrice)) return false;
      if (maxPrice && p.finalPrice > Number(maxPrice)) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesGame = p.game.toLowerCase().includes(q);
        const matchesRank = p.rank.toLowerCase().includes(q);
        const matchesDesc = p.description.toLowerCase().includes(q);
        if (!matchesName && !matchesGame && !matchesRank && !matchesDesc) return false;
      }
      return true;
    }).sort((a, b) => {
      if (selectedSort === 'price_asc') return a.finalPrice - b.finalPrice;
      if (selectedSort === 'price_desc') return b.finalPrice - a.finalPrice;
      if (selectedSort === 'popular') return (b.views || 0) - (a.views || 0);
      if (selectedSort === 'discount_desc') return (b.price - b.finalPrice) - (a.price - a.finalPrice);
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
  }, [products, selectedStatus, selectedGame, minPrice, maxPrice, searchQuery, selectedSort]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedGame('ALL');
    setSelectedStatus('ALL');
    setMinPrice('');
    setMaxPrice('');
    setSelectedSort('newest');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="border-b border-white/5 pb-6">
        <h1 className="font-heading text-3xl sm:text-4xl font-bold text-white uppercase">
          Katalog Akun Gaming
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Jelajahi akun Mobile Legends, Free Fire, Valorant, Genshin Impact, dan game populer lainnya dengan garansi resmi toko.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Left Filter Sidebar */}
        <aside className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-white font-semibold text-sm">
              <Filter className="w-4 h-4 text-cyan-400" />
              <span>Filter Akun</span>
            </div>
            <button
              onClick={handleResetFilters}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1 transition-colors"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Pencarian</label>
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Nama akun / rank..."
                className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Game Selection */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Pilih Game</label>
            <div className="flex flex-col gap-1">
              <button
                onClick={() => setSelectedGame('ALL')}
                className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                  selectedGame === 'ALL'
                    ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                Semua Game
              </button>
              {availableGames.map((game) => (
                <button
                  key={game}
                  onClick={() => setSelectedGame(game)}
                  className={`text-left px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                    selectedGame === game
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {game}
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Rentang Harga (Rp)</label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
              <input
                type="number"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Maks"
                className="w-full px-2.5 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500/50"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">Status Akun</label>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
            >
              <option value="ALL">Semua Akun</option>
              <option value="AVAILABLE">Tersedia (Ready Stock)</option>
              <option value="SOLD">Sudah Terjual</option>
            </select>
          </div>
        </aside>

        {/* Right Main Content */}
        <div className="lg:col-span-3 space-y-4">
          <div className="flex items-center justify-between gap-3 bg-slate-900/40 p-3 rounded-xl border border-slate-800">
            <span className="text-xs text-slate-400">
              Menampilkan <span className="font-bold text-white">{filteredProducts.length}</span> akun gaming
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Urutkan:</span>
              <select
                value={selectedSort}
                onChange={(e) => setSelectedSort(e.target.value as any)}
                className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
              >
                <option value="newest">Terbaru</option>
                <option value="popular">Paling Populer</option>
                <option value="price_asc">Harga Termurah</option>
                <option value="price_desc">Harga Tertinggi</option>
                <option value="discount_desc">Diskon Terbesar</option>
              </select>
            </div>
          </div>

          {filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={onSelectProduct}
                  onQuickCheckout={onCheckoutProduct}
                />
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="py-20 px-4 text-center rounded-3xl bg-slate-900/40 border border-slate-800 space-y-4 max-w-lg mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 flex items-center justify-center mx-auto">
                <Search className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h4 className="font-heading text-lg font-bold text-white uppercase tracking-wider">
                  Katalog Akun Sedang Disiapkan
                </h4>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Admin toko sedang mengunggah stok akun gaming pilihan. Ingin request akun tertentu? Silakan hubungi admin di WhatsApp <strong className="text-cyan-400">085819822250</strong>.
                </p>
              </div>
              <a
                href="https://wa.me/6285819822250?text=Halo%20Admin%2C%20apakah%20ada%20stok%20akun%20gaming%20yang%20ready%3F"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-xs text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-lg shadow-emerald-600/20"
              >
                <span>Hubungi Admin (085819822250)</span>
              </a>
            </div>
          ) : (
            <div className="py-20 text-center rounded-2xl bg-slate-900/30 border border-slate-800/80 space-y-3">
              <p className="text-sm font-semibold text-slate-300">Tidak ada produk yang sesuai dengan kriteria.</p>
              <p className="text-xs text-slate-500">Coba ubah filter harga atau kata kunci pencarian Anda.</p>
              <button
                onClick={handleResetFilters}
                className="px-4 py-2 rounded-lg text-xs font-semibold bg-slate-800 text-white hover:bg-slate-700"
              >
                Reset Filter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
