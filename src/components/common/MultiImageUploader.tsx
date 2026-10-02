import React, { useRef, useState } from 'react';
import { Upload, X, Star, ArrowLeft, ArrowRight, Image as ImageIcon, AlertCircle } from 'lucide-react';

interface MultiImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
  maxImages?: number;
  label?: string;
  helperText?: string;
}

export const MultiImageUploader: React.FC<MultiImageUploaderProps> = ({
  images,
  onChange,
  maxImages = 10,
  label = 'Galeri Foto Showcase Akun (Maksimal 10 Slide)',
  helperText = 'Format: JPG, PNG, WEBP. Maks 5MB per foto. Foto pertama otomatis menjadi cover utama.',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    setErrorMsg(null);
    const availableSlots = maxImages - images.length;
    if (availableSlots <= 0) {
      setErrorMsg(`Sudah mencapai batas maksimal ${maxImages} foto.`);
      return;
    }

    const filesToProcess = Array.from(files).slice(0, availableSlots);
    const newImages: string[] = [];
    let processed = 0;

    filesToProcess.forEach((file) => {
      if (!file.type.startsWith('image/')) {
        setErrorMsg('Beberapa file diabaikan karena bukan format gambar yang didukung.');
        processed++;
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('File yang melebihi 5MB otomatis diabaikan.');
        processed++;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          newImages.push(reader.result);
        }
        processed++;
        if (processed === filesToProcess.length) {
          onChange([...images, ...newImages]);
        }
      };
      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleRemove = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleMove = (fromIndex: number, toIndex: number) => {
    if (toIndex < 0 || toIndex >= images.length) return;
    const updated = [...images];
    const item = updated.splice(fromIndex, 1)[0];
    updated.splice(toIndex, 0, item);
    onChange(updated);
  };

  const handleSetCover = (index: number) => {
    if (index === 0) return;
    handleMove(index, 0);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">
            {label}
          </label>
          <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
        </div>
        <span
          className={`text-xs font-mono font-bold px-2.5 py-1 rounded-md border ${
            images.length >= maxImages
              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
              : 'bg-slate-900 text-cyan-400 border-slate-800'
          }`}
        >
          {images.length} / {maxImages} Slide
        </span>
      </div>

      {/* Grid of uploaded images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {images.map((imgUrl, idx) => (
          <div
            key={idx}
            className={`group relative rounded-xl overflow-hidden border bg-slate-950 aspect-[4/3] flex flex-col justify-between transition-all ${
              idx === 0
                ? 'border-cyan-400 ring-2 ring-cyan-500/30'
                : 'border-slate-800 hover:border-slate-700'
            }`}
          >
            <img
              src={imgUrl}
              alt={`Slide ${idx + 1}`}
              className="w-full h-full object-cover object-center"
              referrerPolicy="no-referrer"
            />

            {/* Slide Index Badge */}
            <div className="absolute top-1.5 left-1.5 pointer-events-none">
              <span
                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded backdrop-blur-md ${
                  idx === 0
                    ? 'bg-cyan-500 text-slate-950'
                    : 'bg-slate-950/80 text-slate-300 border border-slate-800'
                }`}
              >
                {idx === 0 ? '★ Cover' : `Slide ${idx + 1}`}
              </span>
            </div>

            {/* Hover Action Bar */}
            <div className="absolute inset-0 bg-slate-950/80 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-between p-1.5">
              <div className="flex items-center justify-between">
                {idx !== 0 ? (
                  <button
                    type="button"
                    onClick={() => handleSetCover(idx)}
                    title="Jadikan Foto Utama (Cover)"
                    className="p-1 rounded bg-slate-800 hover:bg-cyan-500 hover:text-slate-950 text-slate-300 transition-colors"
                  >
                    <Star className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <div />
                )}

                <button
                  type="button"
                  onClick={() => handleRemove(idx)}
                  title="Hapus Foto Ini"
                  className="p-1 rounded bg-rose-600 hover:bg-rose-500 text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Move position controls */}
              <div className="flex items-center justify-between gap-1 pt-1">
                <button
                  type="button"
                  disabled={idx === 0}
                  onClick={() => handleMove(idx, idx - 1)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                  title="Geser ke kiri"
                >
                  <ArrowLeft className="w-3 h-3" />
                </button>
                <span className="text-[10px] text-slate-400 font-mono">#{idx + 1}</span>
                <button
                  type="button"
                  disabled={idx === images.length - 1}
                  onClick={() => handleMove(idx, idx + 1)}
                  className="p-1 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-slate-200 transition-colors"
                  title="Geser ke kanan"
                >
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Upload Trigger Button if under maxImages */}
        {images.length < maxImages && (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer border border-dashed border-slate-800 hover:border-cyan-500/50 bg-slate-900/40 hover:bg-slate-900/80 rounded-xl aspect-[4/3] flex flex-col items-center justify-center p-3 text-center transition-all group"
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/png,image/jpeg,image/webp,image/jpg"
              className="hidden"
              onChange={(e) => handleFiles(e.target.files)}
            />
            <div className="w-8 h-8 rounded-lg bg-slate-800/80 group-hover:bg-cyan-500/20 text-slate-400 group-hover:text-cyan-400 flex items-center justify-center transition-colors mb-1.5">
              <Upload className="w-4 h-4" />
            </div>
            <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white transition-colors block">
              + Tambah Slide
            </span>
            <span className="text-[10px] text-slate-500 mt-0.5">Bisa pilih banyak</span>
          </div>
        )}
      </div>

      {errorMsg && (
        <p className="text-xs text-rose-400 font-medium flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
          <span>{errorMsg}</span>
        </p>
      )}
    </div>
  );
};
