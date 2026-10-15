import React from 'react';
import { 
  Download, 
  Smartphone, 
  Laptop, 
  Share, 
  PlusSquare, 
  Check, 
  X, 
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface PWAInstallModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PWAInstallModal: React.FC<PWAInstallModalProps> = ({ isOpen, onClose }) => {
  const { isInstallable, isInstalled, isIOS, install } = usePWAInstall();

  if (!isOpen) return null;

  const handleInstallClick = async () => {
    if (isInstallable) {
      const success = await install();
      if (success) {
        onClose();
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <Download className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white">
                Install Web App DIVISI PRODUKSI I
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Akses instan dari Layar Utama HP / Desktop tanpa membuka browser terus-menerus.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status / Quick Action */}
        {isInstalled ? (
          <div className="bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500/30 p-4 rounded-2xl flex items-center gap-3 text-emerald-800 dark:text-emerald-300">
            <CheckCircle2 className="w-6 h-6 shrink-0" />
            <div>
              <h4 className="font-bold text-sm">Aplikasi Sudah Terpasang!</h4>
              <p className="text-xs text-emerald-700 dark:text-emerald-400">
                Aplikasi ini sedang berjalan dalam mode Standalone Native.
              </p>
            </div>
          </div>
        ) : isInstallable ? (
          <div className="bg-amber-50 dark:bg-amber-950/40 border border-amber-500/30 p-4 rounded-2xl space-y-3">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse"></span>
              <span className="font-bold text-xs text-amber-900 dark:text-amber-200">
                Perangkat Anda Siap Menginstall Secara Otomatis
              </span>
            </div>
            <button
              onClick={handleInstallClick}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-sm rounded-xl transition-all shadow-md active:scale-95 flex items-center justify-center gap-2"
            >
              <Download className="w-4 h-4" />
              <span>Install Sekarang ke HP / Komputer</span>
            </button>
          </div>
        ) : null}

        {/* Manual Platform Instructions */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            Panduan Instalasi Manual per Perangkat:
          </h4>

          {/* Android & Google Chrome */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Smartphone className="w-4 h-4 text-emerald-500" />
              <span>Android (Google Chrome)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              1. Buka menu titik tiga (&bull;&bull;&bull;) di pojok kanan atas browser.<br />
              2. Pilih <strong>"Tambahkan ke Layar Utama"</strong> atau <strong>"Install Aplikasi"</strong>.<br />
              3. Aplikasi akan muncul sebagai icon resmi 153 BK di HP Anda.
            </p>
          </div>

          {/* iPhone / iPad (iOS Safari) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Share className="w-4 h-4 text-blue-500" />
              <span>iPhone &amp; iPad (Safari)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              1. Tekan tombol <strong>Bagikan (Share)</strong> di bilah bawah Safari.<br />
              2. Geser ke bawah lalu ketuk <strong>"Tambah ke Layar Utama" (Add to Home Screen)</strong>.<br />
              3. Ketuk <strong>Tambah (Add)</strong> di pojok kanan atas.
            </p>
          </div>

          {/* PC / Laptop (Chrome / Edge) */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-800 space-y-1.5 text-xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
              <Laptop className="w-4 h-4 text-purple-500" />
              <span>PC / Laptop (Windows &amp; Mac)</span>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-[11px] leading-relaxed">
              Klik ikon instal (komputer dengan panah bawah) di address bar browser kanan atas, lalu klik <strong>"Install"</strong>.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 text-xs font-bold rounded-xl"
          >
            Mengerti
          </button>
        </div>
      </div>
    </div>
  );
};
