import React, { useState } from 'react';
import { useStore } from '../../context/StoreContext';
import { ImageUploader } from '../../components/common/ImageUploader';
import { ThemeSettings } from '../../types';
import { Palette, Check, Save, RotateCcw, Sparkles, Store, Sun, Moon } from 'lucide-react';
import { useToast } from '../../context/ToastContext';

// Color Presets for gaming aesthetic
const COLOR_PRESETS = [
  {
    name: 'Electric Blue (Default Vortex)',
    primary: '#2563eb',
    secondary: '#06b6d4',
    bg: '#070b14',
    card: '#0f172a',
  },
  {
    name: 'Neon Emerald & Cyber Teal',
    primary: '#059669',
    secondary: '#10b981',
    bg: '#05130e',
    card: '#0c221a',
  },
  {
    name: 'Crimson Dragon Blaze',
    primary: '#e11d48',
    secondary: '#f43f5e',
    bg: '#140609',
    card: '#220e13',
  },
  {
    name: 'Cyber Purple / Void',
    primary: '#7c3aed',
    secondary: '#a855f7',
    bg: '#0b0617',
    card: '#18102b',
  },
  {
    name: 'Amber Gold Sultan',
    primary: '#d97706',
    secondary: '#f59e0b',
    bg: '#130d04',
    card: '#241a08',
  },
];

export const AdminThemeSettingsPage: React.FC = () => {
  const { settings, updateSettings } = useStore();
  const { success } = useToast();

  // Branding states
  const [storeName, setStoreName] = useState(settings.storeName);
  const [tagline, setTagline] = useState(settings.tagline);
  const [logo, setLogo] = useState(settings.logo);
  const [favicon, setFavicon] = useState(settings.favicon);
  const [banner, setBanner] = useState(settings.banner);

  // Theme states
  const [primaryColor, setPrimaryColor] = useState(settings.themeSettings.primaryColor);
  const [secondaryColor, setSecondaryColor] = useState(settings.themeSettings.secondaryColor);
  const [bgColor, setBgColor] = useState(settings.themeSettings.bgColor);
  const [cardColor, setCardColor] = useState(settings.themeSettings.cardColor);
  const [textColor, setTextColor] = useState(settings.themeSettings.textColor);
  const [borderRadius, setBorderRadius] = useState(settings.themeSettings.borderRadius);
  const [buttonStyle, setButtonStyle] = useState<'solid' | 'gradient' | 'glow'>(settings.themeSettings.buttonStyle);
  const [mode, setMode] = useState<'dark' | 'light'>(settings.themeSettings.mode);

  const handleApplyPreset = (preset: typeof COLOR_PRESETS[0]) => {
    setPrimaryColor(preset.primary);
    setSecondaryColor(preset.secondary);
    setBgColor(preset.bg);
    setCardColor(preset.card);
  };

  const handleSaveTheme = (e: React.FormEvent) => {
    e.preventDefault();

    const newTheme: ThemeSettings = {
      primaryColor,
      secondaryColor,
      bgColor,
      cardColor,
      textColor,
      borderRadius,
      buttonStyle,
      mode,
    };

    updateSettings({
      storeName: storeName.trim() || 'VORTEX ID',
      tagline: tagline.trim() || 'Beli Aman, Main Nyaman.',
      logo,
      favicon,
      banner,
      themeSettings: newTheme,
    });

    success('Tema dan branding toko berhasil diperbarui secara instan!');
  };

  const handleResetToDefault = () => {
    handleApplyPreset(COLOR_PRESETS[0]);
    setBorderRadius(12);
    setButtonStyle('gradient');
    setMode('dark');
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="font-heading text-2xl font-bold text-white uppercase tracking-tight">
          Sistem Theme Customizer & Branding
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">
          Ubah nama toko, tagline, logo, palet warna neon gaming, dan hero banner. Perubahan langsung aktif ke seluruh aplikasi!
        </p>
      </div>

      <form onSubmit={handleSaveTheme} className="space-y-8">
        {/* Section 1: Store Branding & Identity */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            1. Identitas & Logo Toko
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Nama Toko (Store Name)</label>
              <input
                type="text"
                required
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                placeholder="Contoh: VORTEX ID"
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white font-bold tracking-wider"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">
                Nama ini tampil di header, footer, invoice, dan seluruh storefront.
              </span>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1">Tagline Toko</label>
              <input
                type="text"
                required
                value={tagline}
                onChange={(e) => setTagline(e.target.value)}
                placeholder="Contoh: Beli Aman, Main Nyaman."
                className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-white"
              />
            </div>
          </div>

          {/* Logo & Banner Uploader */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-2">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Logo Toko (Rasio 1:1)
              </label>
              <ImageUploader
                value={logo}
                onChange={setLogo}
                label=""
                helperText="Upload logo toko Anda. Format PNG/JPG transparan direkomendasikan."
                aspectRatio="square"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Banner Hero Storefront (Rasio 16:9)
              </label>
              <ImageUploader
                value={banner}
                onChange={setBanner}
                label=""
                helperText="Banner visual yang muncul di beranda pelanggan."
                aspectRatio="video"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Color Palette & Presets */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
              <Palette className="w-4 h-4 text-cyan-400" />
              <span>2. Palet Warna & Presets Gaming</span>
            </h2>
            <button
              type="button"
              onClick={handleResetToDefault}
              className="text-xs text-slate-400 hover:text-cyan-400 flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset Default</span>
            </button>
          </div>

          {/* Preset Buttons */}
          <div className="space-y-2">
            <label className="block text-xs text-slate-400">Pilih Preset Tema Cepat:</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {COLOR_PRESETS.map((preset) => (
                <button
                  key={preset.name}
                  type="button"
                  onClick={() => handleApplyPreset(preset)}
                  className={`p-3 rounded-xl border text-left flex items-center justify-between transition-all ${
                    primaryColor === preset.primary
                      ? 'border-cyan-400 bg-slate-800'
                      : 'border-slate-800 bg-slate-950/60 hover:border-slate-700'
                  }`}
                >
                  <div className="space-y-1">
                    <span className="text-xs font-semibold text-white block">{preset.name}</span>
                    <div className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.primary }} />
                      <span className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: preset.secondary }} />
                      <span className="w-3.5 h-3.5 rounded-full border border-slate-700" style={{ backgroundColor: preset.bg }} />
                    </div>
                  </div>
                  {primaryColor === preset.primary && <Check className="w-4 h-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>

          {/* Custom Color Pickers */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs pt-4 border-t border-slate-800">
            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Warna Primary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={primaryColor}
                  onChange={(e) => setPrimaryColor(e.target.value)}
                  className="w-24 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Warna Secondary</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={secondaryColor}
                  onChange={(e) => setSecondaryColor(e.target.value)}
                  className="w-24 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Background Toko</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={bgColor}
                  onChange={(e) => setBgColor(e.target.value)}
                  className="w-24 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs uppercase"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 font-semibold mb-1.5">Warna Card Kontainer</label>
              <div className="flex items-center gap-2">
                <input
                  type="color"
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="w-9 h-9 rounded-lg border border-slate-700 cursor-pointer bg-transparent"
                />
                <input
                  type="text"
                  value={cardColor}
                  onChange={(e) => setCardColor(e.target.value)}
                  className="w-24 px-2 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-white font-mono text-xs uppercase"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: Typography & Component Styling */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-5 shadow-xl">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            3. Bentuk Tombol & Sudut Kelengkungan (Border Radius)
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
            {/* Border Radius Slider */}
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-slate-300 font-semibold">Border Radius ({borderRadius}px)</label>
              </div>
              <input
                type="range"
                min="4"
                max="24"
                step="2"
                value={borderRadius}
                onChange={(e) => setBorderRadius(Number(e.target.value))}
                className="w-full accent-cyan-500 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-500">
                <span>Tajam (4px)</span>
                <span>Sedang (12px)</span>
                <span>Bulat (24px)</span>
              </div>
            </div>

            {/* Button Style */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Gaya Tombol Utama</label>
              <select
                value={buttonStyle}
                onChange={(e) => setButtonStyle(e.target.value as any)}
                className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white"
              >
                <option value="gradient">Gradient Futuristik (Modern)</option>
                <option value="solid">Solid Minimalis</option>
                <option value="glow">Neon Glow Cyber</option>
              </select>
            </div>

            {/* Dark / Light Mode */}
            <div className="space-y-1.5">
              <label className="text-slate-300 font-semibold">Mode Tampilan</label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMode('dark')}
                  className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 ${
                    mode === 'dark' ? 'bg-slate-800 border-cyan-400 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <Moon className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Dark Mode</span>
                </button>
                <button
                  type="button"
                  onClick={() => setMode('light')}
                  className={`flex-1 py-2 px-3 rounded-xl border flex items-center justify-center gap-2 ${
                    mode === 'light' ? 'bg-slate-800 border-cyan-400 text-white' : 'border-slate-800 text-slate-400'
                  }`}
                >
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Light Mode</span>
                </button>
              </div>
            </div>
          </div>

          {/* Live Component Preview Card */}
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
              Pratinjau Langsung Komponen:
            </span>

            <div className="flex flex-wrap items-center gap-4">
              <button
                type="button"
                style={{
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: buttonStyle === 'solid' ? primaryColor : undefined,
                  backgroundImage: buttonStyle === 'gradient' ? `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` : undefined,
                  boxShadow: buttonStyle === 'glow' ? `0 0 15px ${secondaryColor}60` : undefined,
                }}
                className="px-5 py-2.5 text-white font-semibold text-xs shadow-lg transition-transform"
              >
                Tombol Utama ({storeName})
              </button>

              <div
                style={{
                  borderRadius: `${borderRadius}px`,
                  backgroundColor: cardColor,
                  borderColor: primaryColor + '40',
                }}
                className="p-3 border text-xs text-slate-300"
              >
                Contoh Card dengan Border Radius {borderRadius}px
              </div>
            </div>
          </div>
        </div>

        {/* Submit Save Button */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-xs text-white bg-blue-600 hover:bg-blue-500 shadow-xl shadow-blue-600/20 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>Terapkan Semua Perubahan Tema</span>
          </button>
        </div>
      </form>
    </div>
  );
};
