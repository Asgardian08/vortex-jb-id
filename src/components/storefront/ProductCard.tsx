import React from 'react';
import { Product } from '../../types';
import { Shield, Sparkles, Eye, ArrowUpRight, Star } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickCheckout?: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickCheckout,
}) => {
  const isSold = product.status === 'SOLD';
  const hasDiscount = product.discountType !== 'NONE' && product.discountValue > 0;

  // Calculate discount percentage for badge display
  let discountBadgeText = '';
  if (product.discountType === 'PERCENTAGE') {
    discountBadgeText = `${product.discountValue}% OFF`;
  } else if (hasDiscount) {
    const pct = Math.round(((product.price - product.finalPrice) / product.price) * 100);
    discountBadgeText = `${pct}% OFF`;
  }

  return (
    <div
      onClick={() => onSelect(product)}
      className="group relative flex flex-col rounded-2xl bg-slate-900/70 border border-slate-800/80 hover:border-cyan-500/40 hover:bg-slate-900 transition-all duration-300 cursor-pointer overflow-hidden shadow-lg hover:shadow-cyan-500/5 hover:-translate-y-1"
    >
      {/* Card Image Container (65% presence) */}
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-slate-950">
        <img
          src={product.images[0] || '/src/assets/images/mlbb_mythic_showcase_1790923035330.jpg'}
          alt={product.name}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
          {/* Game Tag */}
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-slate-950/80 text-cyan-400 border border-cyan-500/30 backdrop-blur-md">
            {product.game}
          </span>

          {/* Status / Highlight Tag */}
          {isSold ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-rose-950/90 text-rose-300 border border-rose-500/40 backdrop-blur-md">
              TERJUAL
            </span>
          ) : hasDiscount ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40 backdrop-blur-md">
              {discountBadgeText}
            </span>
          ) : product.badge ? (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 border border-blue-500/40 backdrop-blur-md">
              {product.badge}
            </span>
          ) : null}
        </div>

        {/* Quick specs pill overlay at bottom of image */}
        <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-[11px] text-slate-300 font-medium">
          <span className="truncate max-w-[140px] text-cyan-300">{product.rank}</span>
          <span>{product.skinCount} Skin</span>
        </div>
      </div>

      {/* Card Content Area */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <h3 className="font-semibold text-sm text-white line-clamp-1 group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>

          {/* Clean unboxed metadata with subtle separators */}
          <div className="flex items-center gap-1.5 text-xs text-slate-400 mt-1 font-normal flex-wrap">
            <span className="flex items-center gap-0.5 text-amber-400 font-semibold">
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
              <span>{product.rating ? product.rating.toFixed(1) : '5.0'}</span>
              <span className="text-slate-500 font-normal text-[10px]">
                ({product.reviewCount || 4})
              </span>
            </span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>{product.platform}</span>
            <span aria-hidden="true" className="text-slate-600">·</span>
            <span>Lv. {product.level}</span>
          </div>
        </div>

        {/* Pricing & Action */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <div>
            {hasDiscount && (
              <p className="text-[11px] line-through text-slate-500 tabular-nums">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
            )}
            <p className="text-base font-bold text-white tabular-nums tracking-tight">
              Rp {product.finalPrice.toLocaleString('id-ID')}
            </p>
          </div>

          <div className="flex items-center gap-1.5">
            {!isSold && onQuickCheckout && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onQuickCheckout(product);
                }}
                className="px-2.5 py-1.5 rounded-lg text-xs font-semibold bg-cyan-600 hover:bg-cyan-500 text-white transition-colors shadow-sm"
              >
                Beli
              </button>
            )}
            <div className="w-8 h-8 rounded-lg bg-slate-800 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-300 flex items-center justify-center transition-colors">
              <ArrowUpRight className="w-4 h-4" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
