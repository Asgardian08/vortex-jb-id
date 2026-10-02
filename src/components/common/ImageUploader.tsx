import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  label?: string;
  helperText?: string;
  aspectRatio?: 'square' | 'video' | 'wide' | 'auto';
  className?: string;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  value,
  onChange,
  label = 'Upload Gambar',
  helperText = 'Format: PNG, JPG, WEBP. Maksimal 5MB.',
  aspectRatio = 'square',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate MIME type
    if (!file.type.startsWith('image/')) {
      setErrorMsg('File harus berupa gambar (JPG, PNG, WEBP).');
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setErrorMsg('Ukuran file terlalu besar. Maksimal 5MB.');
      return;
    }

    setErrorMsg(null);
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        onChange(reader.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const getAspectClass = () => {
    switch (aspectRatio) {
      case 'video':
        return 'aspect-video';
      case 'wide':
        return 'aspect-[21/9]';
      case 'square':
        return 'aspect-square';
      default:
        return 'min-h-[160px]';
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      {label && <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider">{label}</label>}

      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative group cursor-pointer border border-dashed rounded-xl transition-all flex flex-col items-center justify-center p-4 text-center overflow-hidden ${
          value
            ? 'border-slate-700 bg-slate-900/60 hover:border-cyan-500/50'
            : 'border-slate-800 bg-slate-900/30 hover:bg-slate-900/60 hover:border-cyan-500/40'
        } ${getAspectClass()}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png,image/jpeg,image/webp,image/jpg"
          className="hidden"
          onChange={handleFileChange}
        />

        {value ? (
          <>
            <img
              src={value}
              alt="Uploaded preview"
              className="w-full h-full object-contain"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-slate-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <span className="text-xs font-medium text-slate-200 bg-slate-800/80 px-2.5 py-1 rounded-md border border-slate-700">
                Ganti Gambar
              </span>
              <button
                type="button"
                onClick={handleRemove}
                className="p-1.5 bg-rose-600/80 hover:bg-rose-600 text-white rounded-md transition-colors"
                title="Hapus gambar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 p-2">
            <div className="w-10 h-10 rounded-lg bg-slate-800/80 border border-slate-700 flex items-center justify-center text-slate-400 group-hover:text-cyan-400 group-hover:border-cyan-500/40 transition-colors">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <p className="text-xs font-medium text-slate-300 group-hover:text-white transition-colors">
                Klik untuk mengunggah file
              </p>
              <p className="text-[11px] text-slate-500 mt-0.5">{helperText}</p>
            </div>
          </div>
        )}
      </div>

      {errorMsg && <p className="text-xs text-rose-400 font-medium">{errorMsg}</p>}
    </div>
  );
};
