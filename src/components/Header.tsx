import React, { useState, useRef, useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Clock, 
  Layers, 
  Award, 
  Activity, 
  Calculator, 
  FileText,
  Users,
  Workflow,
  Terminal,
  Sun,
  Moon,
  Download,
  Maximize,
  Minimize,
  ChevronDown,
  Sparkles,
  ExternalLink,
  Laptop,
  CheckCircle2,
  BrainCircuit,
  Bot,
  BookOpen,
  Calendar
} from 'lucide-react';
import { UserRole } from './Sidebar';
import { 
  formatWibTime, 
  formatWibFullDate, 
  getCurrentShiftWib, 
  getCutoffStatusWib 
} from '../utils/indonesiaDateUtils';

interface HeaderProps {
  onOpenReport: () => void;
  onOpenSwitchBoard?: () => void;
  onOpenGasCenter?: () => void;
  onOpenInstallModal?: () => void;
  onOpenAiCouncil?: () => void;
  onOpenAiManual?: () => void;
  darkMode?: boolean;
  onToggleDarkMode?: () => void;
  isFullscreen?: boolean;
  onToggleFullscreen?: () => void;
  userRole?: UserRole;
  setUserRole?: (role: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  onOpenReport,
  onOpenSwitchBoard,
  onOpenGasCenter,
  onOpenInstallModal,
  onOpenAiCouncil,
  onOpenAiManual,
  darkMode,
  onToggleDarkMode,
  isFullscreen,
  onToggleFullscreen
}) => {
  const [isToolsDropdownOpen, setIsToolsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Live Indonesian Clock & Timezone (WIB - Asia/Jakarta)
  const [liveDate, setLiveDate] = useState(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setLiveDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const wibTimeStr = formatWibTime(liveDate, true);
  const wibDateStr = formatWibFullDate(liveDate);
  const currentShift = getCurrentShiftWib(liveDate);
  const cutoffInfo = getCutoffStatusWib(9, 0, liveDate);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsToolsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-20 shadow-xl transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex items-center justify-between gap-3">
          
          {/* Logo & Division Identity */}
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-md ring-2 ring-amber-400/30 shrink-0">
              <span className="font-extrabold text-lg sm:text-xl tracking-tighter text-slate-950 font-mono">153</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] sm:text-[9px] font-bold bg-red-600 text-white px-1 py-0.2 rounded uppercase">BK</span>
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] sm:text-[11px] font-semibold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 tracking-wide uppercase">
                  PT. BATU KARANG
                </span>
                <span className="text-xs text-slate-400 hidden sm:inline-flex items-center gap-1 truncate">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  Sistem Monitoring Operasional &amp; KPI Real-Time
                </span>
              </div>
              <h1 className="text-sm sm:text-lg font-black text-white tracking-tight flex items-center gap-2 font-serif truncate">
                DIVISI PRODUKSI I (PENGOLAHAN)
              </h1>
              <p className="text-[11px] text-slate-400 hidden lg:block truncate">
                Pengolahan Seluruh Bahan Baku (Tembakau, Krosok, Cengkeh, Saos &amp; Blend) &bull; SK No: 01/AS/DRK/BKR/VII/2024
              </p>
            </div>
          </div>

          {/* Clean Executive Navbar Actions (Compact & Unified) */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Live Indonesian Locale Clock, Shift & Cut-Off Badge */}
            <div className="hidden lg:flex items-center gap-2 bg-slate-800/90 px-3 py-1.5 rounded-xl border border-slate-700 text-xs text-slate-300 shadow-inner">
              <div className="flex items-center gap-1.5 font-medium text-slate-200">
                <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="truncate max-w-[175px] xl:max-w-none">{wibDateStr}</span>
              </div>
              <span className="text-slate-600">|</span>
              <div className="flex items-center gap-1 font-mono font-bold text-amber-300">
                <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse shrink-0" />
                <span>{wibTimeStr}</span>
              </div>
              <span className="text-slate-600 hidden xl:inline">|</span>
              <span 
                className="hidden xl:inline-flex text-[10px] px-1.5 py-0.5 rounded font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                title={`${currentShift.shiftHours} - ${currentShift.description}`}
              >
                {currentShift.shiftName}
              </span>
              <span className="text-slate-600 hidden 2xl:inline">|</span>
              <span 
                className="hidden 2xl:inline-flex text-[10px] font-mono text-slate-400"
                title={cutoffInfo.statusText}
              >
                Cut-Off BOS: <strong className="text-amber-300 ml-1">09:00 WIB</strong>
              </span>
            </div>

            {/* Dewan 6 Karyawan AI Quick Access Button */}
            {onOpenAiCouncil && (
              <button
                type="button"
                onClick={onOpenAiCouncil}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/50 text-indigo-200 transition shadow-sm hover:shadow-indigo-500/20"
                title="Buka Dewan 6 Karyawan AI Pabrik"
              >
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                <span className="hidden sm:inline">Dewan 6 AI</span>
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              </button>
            )}

            {/* Quick Utility Icon: Dark / Light Mode */}
            {onToggleDarkMode && (
              <button
                type="button"
                onClick={onToggleDarkMode}
                className="p-2 rounded-lg text-slate-300 hover:text-amber-400 bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition"
                title={darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                aria-label="Toggle Theme"
              >
                {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
              </button>
            )}

            {/* Quick Utility Icon: Fullscreen */}
            {onToggleFullscreen && (
              <button
                type="button"
                onClick={onToggleFullscreen}
                className="hidden sm:flex p-2 rounded-lg text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700 border border-slate-700/60 transition"
                title={isFullscreen ? 'Keluar Fullscreen' : 'Layar Penuh (Fullscreen)'}
                aria-label="Toggle Fullscreen"
              >
                {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
              </button>
            )}

            {/* 
              KOTAK MERAH SOLUTION: 
              Dynamic Unified Tools Dropdown ("Menu Kontrol & Alat")
              Menggabungkan Switch Board Pabrik, GAS API Center, Install PWA, dan Rekap Direksi
              menjadi 1 toggle dropdown dinamis yang ramping dan tidak memenuhi navbar.
            */}
            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setIsToolsDropdownOpen(!isToolsDropdownOpen)}
                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-bold transition shadow-sm border ${
                  isToolsDropdownOpen
                    ? 'bg-amber-500 text-slate-950 border-amber-400 ring-2 ring-amber-400/30'
                    : 'bg-slate-800/90 hover:bg-slate-700/90 text-slate-100 border-slate-700'
                }`}
                title="Pusat Kontrol Pabrik, Integrasi API &amp; Rekap Direksi"
                aria-expanded={isToolsDropdownOpen}
              >
                <Workflow className="w-4 h-4 text-amber-400 transition" />
                <span className="font-semibold">Menu Cepat &amp; Alat</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isToolsDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Dynamic Dropdown Menu */}
              {isToolsDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 sm:w-84 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="px-3 py-2 border-b border-slate-800 flex items-center justify-between">
                    <div>
                      <p className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">Pusat Aksi &amp; Integrasi</p>
                      <p className="text-[10px] text-slate-400">Akses Cepat 1 Klik Seluruh Fitur Operasional</p>
                    </div>
                    <span className="text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                      Live Multi-Tier
                    </span>
                  </div>

                  <div className="py-1 space-y-1">
                    {/* Dewan 6 Karyawan AI Item */}
                    {onOpenAiCouncil && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenAiCouncil();
                        }}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl bg-indigo-950/40 hover:bg-indigo-900/60 border border-indigo-500/30 text-left transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center shrink-0 group-hover:bg-indigo-600 text-indigo-300 group-hover:text-white transition">
                          <BrainCircuit className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-bold text-indigo-200 group-hover:text-white">Dewan 6 Karyawan AI</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/30 text-indigo-200 font-mono font-bold">Live 24/7</span>
                          </div>
                          <p className="text-[10px] text-slate-300 truncate">Audit Kadar Air, Susut, BOS 09:00, Stok &amp; Presensi SDM</p>
                        </div>
                      </button>
                    )}

                    {/* Buku Panduan Dewan AI (PDF) */}
                    {onOpenAiManual && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenAiManual();
                        }}
                        className="w-full flex items-start gap-3 px-3 py-2 rounded-xl hover:bg-slate-800/90 text-left transition group border border-slate-700/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 group-hover:bg-amber-500 group-hover:text-slate-950 text-amber-400 transition">
                          <BookOpen className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white group-hover:text-amber-300">Buku Panduan Dewan AI</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/20 text-amber-300 font-mono font-bold">Unduh PDF</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">SOP 6 Karyawan AI, Zero-Mutation &amp; Siklus 24 Jam</p>
                        </div>
                      </button>
                    )}

                    {/* Rekap Direksi Item (Prominent Action at the top) */}
                    <button
                      type="button"
                      onClick={() => {
                        setIsToolsDropdownOpen(false);
                        onOpenReport();
                      }}
                      className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-amber-500/15 to-amber-600/10 hover:from-amber-500/25 hover:to-amber-600/20 border border-amber-500/30 text-left transition group"
                    >
                      <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 font-bold flex items-center justify-center shrink-0 shadow-sm transition">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-amber-300">Rekap Matriks Direksi</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/30 text-amber-200 font-mono font-bold">Cetak / PDF</span>
                        </div>
                        <p className="text-[10px] text-slate-300 truncate">Laporan resmi eksekutif, SK 01/2024 &amp; ringkasan KPI</p>
                      </div>
                    </button>

                    {/* Switch Board Modal Item */}
                    {onOpenSwitchBoard && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenSwitchBoard();
                        }}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/90 text-left transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center shrink-0 group-hover:bg-blue-500 group-hover:text-slate-950 text-blue-400 transition">
                          <Workflow className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white group-hover:text-blue-300">Switch Board Pabrik</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-blue-500/20 text-blue-300 font-mono">5 Web Apps</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">Pindah antar web apps: Stock, Blend, Cengkeh, HR Staff</p>
                        </div>
                      </button>
                    )}

                    {/* Headless GAS API Center Item */}
                    {onOpenGasCenter && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenGasCenter();
                        }}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/90 text-left transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:bg-emerald-500 group-hover:text-slate-950 text-emerald-400 transition">
                          <Terminal className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white group-hover:text-emerald-300">Headless GAS API Center</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-300 font-mono">0.01s REST</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">Cek latensi REST API, Google Sheets, &amp; sinkronisasi</p>
                        </div>
                      </button>
                    )}

                    {/* Install PWA Modal Item */}
                    {onOpenInstallModal && (
                      <button
                        type="button"
                        onClick={() => {
                          setIsToolsDropdownOpen(false);
                          onOpenInstallModal();
                        }}
                        className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/90 text-left transition group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center shrink-0 group-hover:bg-purple-500 group-hover:text-slate-950 text-purple-400 transition">
                          <Download className="w-4 h-4" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-semibold text-white group-hover:text-purple-300">Install Aplikasi (PWA)</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 font-mono">PC &amp; HP</span>
                          </div>
                          <p className="text-[10px] text-slate-400 truncate">Pasang ikon di desktop PC, laptop, atau layar utama HP</p>
                        </div>
                      </button>
                    )}

                    {/* Secondary Utilities Row inside Dropdown: Dark Mode & Fullscreen */}
                    <div className="pt-2 mt-1 border-t border-slate-800 grid grid-cols-2 gap-1.5">
                      {onToggleDarkMode && (
                        <button
                          type="button"
                          onClick={() => {
                            onToggleDarkMode();
                          }}
                          className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-amber-400 text-xs transition"
                          title="Ganti Mode Tampilan"
                        >
                          {darkMode ? <Sun className="w-3.5 h-3.5 text-amber-400" /> : <Moon className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="text-[11px] font-medium">{darkMode ? 'Mode Terang' : 'Mode Gelap'}</span>
                        </button>
                      )}

                      {onToggleFullscreen && (
                        <button
                          type="button"
                          onClick={() => {
                            onToggleFullscreen();
                          }}
                          className="flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white text-xs transition"
                          title="Mode Layar Penuh"
                        >
                          {isFullscreen ? <Minimize className="w-3.5 h-3.5 text-amber-400" /> : <Maximize className="w-3.5 h-3.5 text-slate-400" />}
                          <span className="text-[11px] font-medium">{isFullscreen ? 'Keluar Full' : 'Layar Penuh'}</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
