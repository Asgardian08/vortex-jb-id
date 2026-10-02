import React from 'react';
import { Search, Filter, SlidersHorizontal, X } from 'lucide-react';

interface ProductFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedGame: string;
  onGameChange: (game: string) => void;
  selectedSort: 'newest' | 'price_asc' | 'price_desc' | 'popular' | 'discount_desc';
  onSortChange: (sort: any) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  availableGames: string[];
  totalResults: number;
}

export const ProductFilterBar: React.FC<ProductFilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedGame,
  onGameChange,
  selectedSort,
  onSortChange,
  selectedStatus,
  onStatusChange,
  availableGames,
  totalResults,
}) => {
  return (
    <div className="space-y-4">
      {/* Top Search & Sort Row */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari nama akun, game, atau skin..."
            className="w-full pl-10 pr-9 py-2.5 bg-slate-900/90 border border-slate-800 rounded-xl text-xs sm:text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Status & Sort Selectors */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Status selector */}
          <select
            value={selectedStatus}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="ALL">Semua Status</option>
            <option value="AVAILABLE">Tersedia (Ready)</option>
            <option value="SOLD">Terjual</option>
          </select>

          {/* Sort selector */}
          <select
            value={selectedSort}
            onChange={(e) => onSortChange(e.target.value)}
            className="px-3 py-2 bg-slate-900 border border-slate-800 rounded-xl text-xs text-slate-200 focus:outline-none focus:border-cyan-500/50"
          >
            <option value="newest">Terbaru</option>
            <option value="popular">Paling Populer</option>
            <option value="price_asc">Harga Termurah</option>
            <option value="price_desc">Harga Tertinggi</option>
            <option value="discount_desc">Diskon Terbesar</option>
          </select>
        </div>
      </div>

      {/* Game Category Segmented Tabs (Interactive functional buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => onGameChange('ALL')}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
            selectedGame === 'ALL'
              ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
              : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}
        >
          Semua Game
        </button>
        {availableGames.map((game) => (
          <button
            key={game}
            onClick={() => onGameChange(game)}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-all shrink-0 ${
              selectedGame === game
                ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                : 'bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
            }`}
          >
            {game}
          </button>
        ))}

        <div className="ml-auto text-xs text-slate-500 hidden sm:block shrink-0">
          Menampilkan <span className="font-semibold text-slate-300">{totalResults}</span> akun
        </div>
      </div>
    </div>
  );
};
