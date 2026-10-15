import React, { useState, useMemo } from 'react';
import { HR_STAFF_MASTER_DATA, HrStaffRecord } from '../data/hrStaffMasterData';
import { 
  Share2, 
  Copy, 
  Check, 
  ExternalLink, 
  MessageCircle, 
  Mail, 
  QrCode, 
  UserCheck, 
  Crown, 
  Users, 
  X, 
  Sparkles,
  ShieldCheck,
  Info,
  Smartphone,
  Send
} from 'lucide-react';

interface KpiShareLinkModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultStaffNip?: string;
  defaultEvaluatorType?: 'ATASAN_LANGSUNG' | 'REKAN_LANGSUNG';
}

export const KpiShareLinkModal: React.FC<KpiShareLinkModalProps> = ({
  isOpen,
  onClose,
  defaultStaffNip = 'BK-PP1-025',
  defaultEvaluatorType = 'ATASAN_LANGSUNG'
}) => {
  const [selectedStaffNip, setSelectedStaffNip] = useState<string>(defaultStaffNip);
  const [evaluatorType, setEvaluatorType] = useState<'ATASAN_LANGSUNG' | 'REKAN_LANGSUNG' | 'OPEN'>(defaultEvaluatorType);
  const [selectedEvaluatorNip, setSelectedEvaluatorNip] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [showQr, setShowQr] = useState<boolean>(false);

  // Target staff details
  const targetStaff = useMemo(() => {
    return HR_STAFF_MASTER_DATA.find(s => s.nip === selectedStaffNip) || HR_STAFF_MASTER_DATA[0];
  }, [selectedStaffNip]);

  // Evaluator staff details (if pre-selected)
  const evaluatorStaff = useMemo(() => {
    if (!selectedEvaluatorNip) return null;
    return HR_STAFF_MASTER_DATA.find(s => s.nip === selectedEvaluatorNip) || null;
  }, [selectedEvaluatorNip]);

  // Generate dynamic shareable URL with URLSearchParams
  const generatedUrl = useMemo(() => {
    const origin = typeof window !== 'undefined' ? window.location.origin : 'https://ais-pre-23rwpi6vtd4d7smn6xmgyi-890363797197.asia-east1.run.app';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
    const params = new URLSearchParams();
    
    params.set('tab', 'kpi_evaluator');
    params.set('subtab', 'respondent_self_service');
    params.set('targetNip', selectedStaffNip);
    
    if (evaluatorType !== 'OPEN') {
      params.set('evalType', evaluatorType);
    }
    if (selectedEvaluatorNip) {
      params.set('evalNip', selectedEvaluatorNip);
    }

    return `${origin}${pathname}?${params.toString()}`;
  }, [selectedStaffNip, evaluatorType, selectedEvaluatorNip]);

  // Copy to clipboard handler
  const handleCopyLink = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(generatedUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  // Pre-formatted WhatsApp message
  const whatsappUrl = useMemo(() => {
    const roleLabel = evaluatorType === 'ATASAN_LANGSUNG' 
      ? 'Atasan Langsung' 
      : evaluatorType === 'REKAN_LANGSUNG' 
        ? 'Rekan Kerja Langsung' 
        : 'Responden Penilai';
    
    const recipientGreeting = evaluatorStaff 
      ? `Yth. Bapak/Ibu ${evaluatorStaff.nama} (${evaluatorStaff.jabatan})`
      : 'Yth. Bapak/Ibu Rekan Kerja / Atasan Langsung';

    const text = 
`*PEMBERITAHUAN PENILAIAN KINERJA 360° PT BATU KARANG*
Divisi Produksi I (Pengolahan)

${recipientGreeting},

Mohon kesediaan dan objektivitas Bapak/Ibu selaku *${roleLabel}* untuk mengisi Formulir Evaluasi Kinerja Mandiri bagi staf operasional berikut:

• *Nama Karyawan*: ${targetStaff.nama}
• *NIP*: ${targetStaff.nip}
• *Jabatan*: ${targetStaff.jabatan} (${targetStaff.sekup})
• *Periode*: Semester II - 2026

Pengisian dapat langsung dilakukan melalui smartphone atau komputer pada tautan resmi berikut:
${generatedUrl}

_Catatan: Sistem menggunakan panduan perilaku konkret (BARS) untuk menjaga objektivitas dan kerahasiaan pengisian._

Terima kasih atas kerja sama dan kontribusi Bapak/Ibu.
*Divisi HR & Operasional Pabrik*`;

    return `https://wa.me/?text=${encodeURIComponent(text)}`;
  }, [generatedUrl, targetStaff, evaluatorStaff, evaluatorType]);

  // Pre-formatted Email link
  const emailUrl = useMemo(() => {
    const subject = encodeURIComponent(`[Formulir Evaluasi 360°] Penilaian Kinerja Staf: ${targetStaff.nama} (${targetStaff.nip})`);
    const body = encodeURIComponent(
      `Yth. Tim Penilai / Atasan Langsung,\n\n` +
      `Berikut adalah tautan resmi pengisian evaluasi kinerja 360° untuk staf:\n` +
      `- Nama: ${targetStaff.nama}\n` +
      `- NIP: ${targetStaff.nip}\n` +
      `- Posisi: ${targetStaff.jabatan}\n\n` +
      `Silakan buka tautan berikut untuk mengisi lembar evaluasi:\n${generatedUrl}\n\n` +
      `Hormat kami,\nManajemen Operasional PT Batu Karang`
    );
    return `mailto:?subject=${subject}&body=${body}`;
  }, [generatedUrl, targetStaff]);

  // QR Code URL (using Google Charts API or reliable QR service)
  const qrCodeImageUrl = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(generatedUrl)}&color=0f172a&bgcolor=ffffff`;
  }, [generatedUrl]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                DISTRIBUSI KUESIONER MANDIRI
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
                Bagikan Tautan Evaluasi Kinerja (Deep-Link URL)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all"
            aria-label="Tutup"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1 text-xs">
          
          {/* Explanation Banner */}
          <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 flex items-start gap-3">
            <Info className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="text-[11px] leading-relaxed text-amber-950 dark:text-amber-200">
              <strong className="font-bold">Bagaimana Tautan Ini Bekerja?</strong>
              <p className="mt-0.5 text-amber-900/90 dark:text-amber-300/90">
                Ketika atasan atau rekan kerja membuka link ini dari HP/laptop, sistem akan <strong>langsung membuka formulir pengisian mandiri</strong> dengan data staf yang dinilai sudah otomatis terpilih. Penilai tidak perlu repot mencari menu di aplikasi.
              </p>
            </div>
          </div>

          {/* Form Step 1: Target Staf */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                1
              </span>
              <span>Pilih Karyawan yang Hendak Dinilai:</span>
            </label>
            <select
              value={selectedStaffNip}
              onChange={(e) => setSelectedStaffNip(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-amber-500 outline-none"
            >
              {HR_STAFF_MASTER_DATA.map(st => (
                <option key={st.nip} value={st.nip}>
                  {st.nama} — {st.nip} ({st.jabatan} - {st.sekup})
                </option>
              ))}
            </select>
          </div>

          {/* Form Step 2: Peran Responden */}
          <div className="space-y-3">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <span className="w-5 h-5 rounded-md bg-amber-500 text-slate-950 flex items-center justify-center font-bold text-[10px]">
                2
              </span>
              <span>Kategori Penerima Tautan (Responden):</span>
            </label>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setEvaluatorType('ATASAN_LANGSUNG')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  evaluatorType === 'ATASAN_LANGSUNG'
                    ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/40 text-slate-950 dark:text-amber-200 ring-2 ring-amber-400/50'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Crown className="w-4 h-4 text-amber-500" />
                  <span>Atasan Langsung</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Responden R1 (Kepala Unit/Plt/Manajer).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setEvaluatorType('REKAN_LANGSUNG')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  evaluatorType === 'REKAN_LANGSUNG'
                    ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/40 text-slate-950 dark:text-indigo-200 ring-2 ring-indigo-400/50'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <Users className="w-4 h-4 text-indigo-500" />
                  <span>Rekan Langsung</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Responden R2 (Rekan satu shift/pos).
                </p>
              </button>

              <button
                type="button"
                onClick={() => setEvaluatorType('OPEN')}
                className={`p-3 rounded-xl border text-left transition-all ${
                  evaluatorType === 'OPEN'
                    ? 'border-emerald-500 bg-emerald-500/10 dark:bg-emerald-950/40 text-slate-950 dark:text-emerald-200 ring-2 ring-emerald-400/50'
                    : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-1">
                  <UserCheck className="w-4 h-4 text-emerald-500" />
                  <span>Pilihan Bebas</span>
                </div>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Penilai memilih perannya sendiri saat membuka.
                </p>
              </button>
            </div>
          </div>

          {/* Optional: Nama Penilai Khusus */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[11px] font-bold text-slate-600 dark:text-slate-400">
                Tentukan Nama Spesifik Penilai (Opsional):
              </label>
              {selectedEvaluatorNip && (
                <button
                  type="button"
                  onClick={() => setSelectedEvaluatorNip('')}
                  className="text-[10px] text-red-500 hover:underline"
                >
                  Kosongkan (Biarkan Responden Memilih)
                </button>
              )}
            </div>
            <select
              value={selectedEvaluatorNip}
              onChange={(e) => setSelectedEvaluatorNip(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-amber-500"
            >
              <option value="">-- Biarkan Responden Memilih Namanya Sendiri saat Buka Link --</option>
              {HR_STAFF_MASTER_DATA.filter(s => s.nip !== selectedStaffNip).map(st => (
                <option key={st.nip} value={st.nip}>
                  {st.nama} — {st.jabatan} ({st.sekup})
                </option>
              ))}
            </select>
          </div>

          {/* Generated URL Box */}
          <div className="space-y-2 pt-1">
            <label className="block text-xs font-bold text-slate-900 dark:text-slate-100">
              Tautan Khusus URL yang Dihasilkan:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={generatedUrl}
                className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-950 font-mono text-[11px] text-slate-800 dark:text-slate-200 select-all truncate outline-none"
              />
              <button
                type="button"
                onClick={handleCopyLink}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-all shadow-sm shrink-0 ${
                  copied
                    ? 'bg-emerald-600 text-white'
                    : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
                }`}
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Tersalin!' : 'Salin URL'}</span>
              </button>
            </div>
          </div>

          {/* Quick Sharing Buttons */}
          <div className="space-y-2">
            <span className="block text-[11px] font-bold text-slate-500 dark:text-slate-400">
              Kirim Cepat melalui Aplikasi:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Kirim via WhatsApp</span>
              </a>

              <a
                href={emailUrl}
                className="px-3.5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs"
              >
                <Mail className="w-4 h-4" />
                <span>Kirim via Email</span>
              </a>

              <button
                type="button"
                onClick={() => setShowQr(!showQr)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs border border-slate-700"
              >
                <QrCode className="w-4 h-4 text-amber-400" />
                <span>{showQr ? 'Sembunyikan QR' : 'Tampilkan QR Code'}</span>
              </button>
            </div>
          </div>

          {/* QR Code Container */}
          {showQr && (
            <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 flex flex-col items-center justify-center gap-2 animate-in fade-in">
              <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                Pindai (Scan) QR Code dengan Kamera HP Atasan / Staf:
              </span>
              <div className="p-3 bg-white rounded-2xl shadow-md border border-slate-200">
                <img
                  src={qrCodeImageUrl}
                  alt="QR Code Evaluasi KPI"
                  className="w-44 h-44 object-contain"
                />
              </div>
              <p className="text-[10px] text-slate-500 text-center max-w-xs">
                Sangat praktis untuk evaluasi langsung di lantai pabrik saat supervisi lapangan.
              </p>
            </div>
          )}

          {/* Step Guide Workflow */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800 space-y-2">
            <h5 className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-500" />
              <span>Standar Operasional Prosedur (SOP) Distribusi Link:</span>
            </h5>
            <ol className="list-decimal list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
              <li>
                <strong>Salin URL atau Kirim WhatsApp:</strong> Kirimkan tautan kepada atasan langsung atau rekan kerja langsung staf terkait.
              </li>
              <li>
                <strong>Pengisian Mandiri (Blind Evaluation):</strong> Responden membuka link di browser HP/PC, memberi nilai 1–5 berdasarkan bukti perilaku BARS.
              </li>
              <li>
                <strong>Tersimpan Otomatis:</strong> Setelah responden menekan <em>\"Kirim Evaluasi Kinerja\"</em>, skor langsung diperbarui ke rapor resmi staf tanpa perlu entri manual ulang oleh admin.
              </li>
            </ol>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <Smartphone className="w-3.5 h-3.5" />
            <span>Responsif untuk HP Android, iOS, &amp; Laptop</span>
          </span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs transition-all"
          >
            Selesai
          </button>
        </div>

      </div>
    </div>
  );
};
