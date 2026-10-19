import React, { useState, useEffect } from 'react';
import { 
  X, Check, AlertTriangle, ShieldAlert, Sparkles, UserCheck, 
  HelpCircle, Eye, RefreshCw, BookmarkCheck, Crown, Lock, Users,
  Sliders, ShieldCheck, ChevronDown, CheckCircle2, Trash2, RotateCcw
} from 'lucide-react';
import { 
  OfficialKpiProfile, 
  Kpi360Parameter, 
  PeerFeedbackItem,
  EvaluationAuthority
} from '../data/kpi360TemplateData';
import { HR_STAFF_MASTER_DATA } from '../data/hrStaffMasterData';

interface KpiDataEntryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: OfficialKpiProfile;
  onSaveProfile: (updatedProfile: OfficialKpiProfile) => void;
}

export const KpiDataEntryModal: React.FC<KpiDataEntryModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSaveProfile
}) => {
  // Active step inside entry modal
  const [entryMode, setEntryMode] = useState<'quick_matrix' | 'supervisor_prerogative' | 'bars_behavior' | 'peer_sbi' | 'attendance_sanctions' | 'reality_sop'>('quick_matrix');

  // Working state for parameters: each parameter has scores from 4 respondents
  const [workingParams, setWorkingParams] = useState<Array<Kpi360Parameter & { rScores: [number, number, number, number] }>>(() => {
    return currentProfile.parameters.map(p => {
      // Determine default authority based on standard industrial factory guidelines if not set
      let defaultAuth: EvaluationAuthority = p.evaluationAuthority || 'KOLABORASI_360';
      if (!p.evaluationAuthority) {
        if (p.subCategoryNumber === '1.a' || p.subCategoryNumber === '1.c') {
          defaultAuth = 'DATA_SISTEM';
        } else if (
          p.category === 'Tanggungjawab' || 
          p.subCategoryNumber === '1.b' || 
          p.subCategoryNumber === '1.d' ||
          p.subCategoryNumber === '3.a' ||
          p.subCategoryNumber === '3.e' ||
          p.subCategoryNumber === '3.f' ||
          p.subCategoryNumber === '4.a' ||
          p.subCategoryNumber === '4.b' ||
          p.subCategoryNumber === '4.c'
        ) {
          defaultAuth = 'MUTLAK_ATASAN';
        } else {
          defaultAuth = 'KOLABORASI_360';
        }
      }

      const avg = p.avgScore;
      // If mutlak atasan, set all respondents to supervisor's score
      if (defaultAuth === 'MUTLAK_ATASAN') {
        const s = Math.min(5, Math.max(1, Number(avg.toFixed(1))));
        return {
          ...p,
          evaluationAuthority: defaultAuth,
          rScores: [s, s, s, s] as [number, number, number, number]
        };
      }

      const r1 = Number((avg + (p.category === 'Kompetensi' ? -0.15 : 0.1)).toFixed(1));
      const r2 = Number((avg + (p.category === 'Kedisiplinan' ? 0.2 : -0.05)).toFixed(1));
      const r3 = Number((avg + 0.05).toFixed(1));
      const r4 = Number((p.totalScore - (r1 + r2 + r3)).toFixed(1));
      
      const clamp = (v: number) => Math.min(5, Math.max(1, Number(v.toFixed(1))));
      return {
        ...p,
        evaluationAuthority: defaultAuth,
        rScores: [clamp(r1), clamp(r2), clamp(r3), clamp(r4)] as [number, number, number, number]
      };
    });
  });

  // Working respondents names
  const [respondenList, setRespondenList] = useState<string[]>([...currentProfile.responden]);

  // Working peer feedback
  const [peerFeedbacks, setPeerFeedbacks] = useState<PeerFeedbackItem[]>(
    JSON.parse(JSON.stringify(currentProfile.peerFeedbacks))
  );

  // Working presensi & sanksi
  const [presensi, setPresensi] = useState({ ...currentProfile.catatanPresensi });
  const [sanksiText, setSanksiText] = useState(currentProfile.sanksiAdministratif.join('\n'));

  // Filter category in modal
  const [categoryFilter, setCategoryFilter] = useState<string>('ALL');

  // Synchronize modal state whenever profile or modal opens
  useEffect(() => {
    if (isOpen) {
      setWorkingParams(currentProfile.parameters.map(p => {
        let defaultAuth: EvaluationAuthority = p.evaluationAuthority || 'KOLABORASI_360';
        if (!p.evaluationAuthority) {
          if (p.name.includes('Presensi') || p.name.includes('Ketepatan Waktu')) {
            defaultAuth = 'DATA_SISTEM';
          } else if (
            p.name.includes('K3') ||
            p.name.includes('SOP') ||
            p.name.includes('Akurasi') ||
            p.name.includes('Zero Variance') ||
            p.name.includes('Istirahat') ||
            p.name.includes('Tuntas') ||
            p.name.includes('Penguasaan Teknis') ||
            p.name.includes('Problem Solving') ||
            p.name.includes('Kendala') ||
            p.name.includes('Fleksibilitas') ||
            p.name.includes('Arahan & Kritik') ||
            p.category === 'Tanggungjawab'
          ) {
            defaultAuth = 'MUTLAK_ATASAN';
          } else {
            defaultAuth = 'KOLABORASI_360';
          }
        }

        const avg = p.avgScore;
        if (defaultAuth === 'MUTLAK_ATASAN') {
          const s = Math.min(5, Math.max(1, Number(avg.toFixed(1))));
          return {
            ...p,
            evaluationAuthority: defaultAuth,
            rScores: [s, s, s, s] as [number, number, number, number]
          };
        }

        const r1 = Number((avg + (p.category === 'Kompetensi' ? -0.15 : 0.1)).toFixed(1));
        const r2 = Number((avg + (p.category === 'Kedisiplinan' ? 0.2 : -0.05)).toFixed(1));
        const r3 = Number((avg + 0.05).toFixed(1));
        const r4 = Number((p.totalScore - (r1 + r2 + r3)).toFixed(1));
        
        const clamp = (v: number) => Math.min(5, Math.max(1, Number(v.toFixed(1))));
        return {
          ...p,
          evaluationAuthority: defaultAuth,
          rScores: [clamp(r1), clamp(r2), clamp(r3), clamp(r4)] as [number, number, number, number]
        };
      }));
      setRespondenList([...currentProfile.responden]);
      setPeerFeedbacks(JSON.parse(JSON.stringify(currentProfile.peerFeedbacks)));
      setPresensi({ ...currentProfile.catatanPresensi });
      setSanksiText(currentProfile.sanksiAdministratif.join('\n'));
    }
  }, [isOpen, currentProfile]);

  // Handle single respondent score change
  const handleScoreChange = (paramId: string, respIndex: 0 | 1 | 2 | 3, valueStr: string) => {
    const val = parseFloat(valueStr);
    const validVal = isNaN(val) ? 0 : Math.min(5, Math.max(0, val));

    setWorkingParams(prev => prev.map(p => {
      if (p.id !== paramId) return p;
      const newScores = [...p.rScores] as [number, number, number, number];
      newScores[respIndex] = validVal;
      
      let sum = 0;
      let avg = 0;

      if (p.evaluationAuthority === 'MUTLAK_ATASAN') {
        // R1 (Atasan) is 100% decisive!
        avg = newScores[0];
        sum = Number((avg * 4).toFixed(2));
        newScores[1] = avg;
        newScores[2] = avg;
        newScores[3] = avg;
      } else {
        sum = newScores.reduce((acc, curr) => acc + curr, 0);
        avg = Number((sum / 4).toFixed(2));
      }

      // Calculate criteria
      let kriteria: Kpi360Parameter['kriteria'] = 'BAIK';
      if (avg <= 1.0) kriteria = 'SANGAT KURANG';
      else if (avg <= 2.0) kriteria = 'KURANG';
      else if (avg <= 3.0) kriteria = 'CUKUP';
      else if (avg <= 4.0) kriteria = 'BAIK';
      else kriteria = 'SANGAT BAIK';

      return {
        ...p,
        rScores: newScores,
        totalScore: Number(sum.toFixed(2)),
        avgScore: avg,
        kriteria
      };
    }));
  };

  // Toggle Authority (Mutlak Atasan vs Kolaborasi 360 vs Data Sistem)
  const handleToggleAuthority = (paramId: string, authority: EvaluationAuthority) => {
    setWorkingParams(prev => prev.map(p => {
      if (p.id !== paramId) return p;
      const newScores = [...p.rScores] as [number, number, number, number];
      let sum = 0;
      let avg = 0;

      if (authority === 'MUTLAK_ATASAN') {
        avg = newScores[0];
        sum = Number((avg * 4).toFixed(2));
        newScores[1] = avg;
        newScores[2] = avg;
        newScores[3] = avg;
      } else {
        sum = newScores.reduce((acc, curr) => acc + curr, 0);
        avg = Number((sum / 4).toFixed(2));
      }

      let kriteria: Kpi360Parameter['kriteria'] = 'BAIK';
      if (avg <= 1.0) kriteria = 'SANGAT KURANG';
      else if (avg <= 2.0) kriteria = 'KURANG';
      else if (avg <= 3.0) kriteria = 'CUKUP';
      else if (avg <= 4.0) kriteria = 'BAIK';
      else kriteria = 'SANGAT BAIK';

      return {
        ...p,
        evaluationAuthority: authority,
        rScores: newScores,
        totalScore: Number(sum.toFixed(2)),
        avgScore: avg,
        kriteria
      };
    }));
  };

  // Apply standard factory authority preset
  const handleApplyFactoryPresetAuthority = () => {
    setWorkingParams(prev => prev.map(p => {
      let auth: EvaluationAuthority = 'KOLABORASI_360';
      if (p.name.includes('Presensi') || p.name.includes('Ketepatan Waktu') || p.id === 'kpi-rec-1a') {
        auth = 'DATA_SISTEM';
      } else if (
        p.name.includes('K3') ||
        p.name.includes('SOP') ||
        p.name.includes('Akurasi') ||
        p.name.includes('Zero Variance') ||
        p.name.includes('Istirahat') ||
        p.name.includes('Tuntas') ||
        p.name.includes('Penguasaan Teknis') ||
        p.name.includes('Problem Solving') ||
        p.name.includes('Kendala') ||
        p.name.includes('Fleksibilitas') ||
        p.name.includes('Arahan & Kritik') ||
        p.category === 'Tanggungjawab' ||
        p.subCategoryNumber === '1.b' ||
        p.subCategoryNumber === '3.e' ||
        p.subCategoryNumber === '3.f'
      ) {
        auth = 'MUTLAK_ATASAN';
      } else {
        auth = 'KOLABORASI_360';
      }

      const newScores = [...p.rScores] as [number, number, number, number];
      let sum = 0;
      let avg = 0;

      if (auth === 'MUTLAK_ATASAN') {
        avg = newScores[0];
        sum = Number((avg * 4).toFixed(2));
        newScores[1] = avg;
        newScores[2] = avg;
        newScores[3] = avg;
      } else {
        sum = newScores.reduce((acc, curr) => acc + curr, 0);
        avg = Number((sum / 4).toFixed(2));
      }

      let kriteria: Kpi360Parameter['kriteria'] = 'BAIK';
      if (avg <= 1.0) kriteria = 'SANGAT KURANG';
      else if (avg <= 2.0) kriteria = 'KURANG';
      else if (avg <= 3.0) kriteria = 'CUKUP';
      else if (avg <= 4.0) kriteria = 'BAIK';
      else kriteria = 'SANGAT BAIK';

      return {
        ...p,
        evaluationAuthority: auth,
        rScores: newScores,
        totalScore: Number(sum.toFixed(2)),
        avgScore: avg,
        kriteria
      };
    }));
  };

  // Set score via BARS Level Selection
  const handleSelectBarsLevel = (paramId: string, level: 1 | 2 | 3 | 4 | 5) => {
    setWorkingParams(prev => prev.map(p => {
      if (p.id !== paramId) return p;
      const base = level;
      
      let newScores: [number, number, number, number];
      if (p.evaluationAuthority === 'MUTLAK_ATASAN') {
        newScores = [base, base, base, base];
      } else {
        newScores = [
          Math.min(5, Math.max(1, Number((base - 0.2).toFixed(1)))),
          Math.min(5, Math.max(1, base)),
          Math.min(5, Math.max(1, Number((base + 0.1).toFixed(1)))),
          Math.min(5, Math.max(1, base))
        ];
      }

      const sum = newScores.reduce((acc, curr) => acc + curr, 0);
      const avg = Number((sum / 4).toFixed(2));
      let kriteria: Kpi360Parameter['kriteria'] = 'BAIK';
      if (avg <= 1.0) kriteria = 'SANGAT KURANG';
      else if (avg <= 2.0) kriteria = 'KURANG';
      else if (avg <= 3.0) kriteria = 'CUKUP';
      else if (avg <= 4.0) kriteria = 'BAIK';
      else kriteria = 'SANGAT BAIK';

      return {
        ...p,
        rScores: newScores,
        totalScore: Number(sum.toFixed(2)),
        avgScore: avg,
        kriteria
      };
    }));
  };

  // Handle respondent name change with automatic synchronization to peer feedbacks
  const handleUpdateRespondent = (index: number, newName: string) => {
    const newList = [...respondenList];
    newList[index] = newName;
    setRespondenList(newList);

    // Sync to peerFeedbacks so respondentName matches immediately
    setPeerFeedbacks(prev => {
      const updated = [...prev];
      if (updated[index]) {
        updated[index] = {
          ...updated[index],
          respondentName: newName.trim()
        };
      }
      return updated;
    });
  };

  // Clear all respondents and their qualitative feedback notes
  const handleClearAllRespondents = () => {
    setRespondenList(['', '', '', '']);
    setPeerFeedbacks(prev => prev.map(fb => ({
      ...fb,
      respondentName: '',
      positiveFeedback: '',
      improvementFeedback: '',
      recommendation: ''
    })));
  };

  // Reset to clean standard respondents (strictly no self-evaluation)
  const handleResetToStandardRespondents = () => {
    const staff = HR_STAFF_MASTER_DATA.find(s => s.nip === currentProfile.nip);
    if (!staff) return;

    let r1 = 'Lalu Mahendra Ali Akbar (Manajer Operasional)';
    if (staff.nip === 'BK-PP1-001') {
      r1 = 'Direktur Operasional PT Batu Karang (Atasan)';
    } else if (staff.sekup === 'Administrasi' && staff.nip !== 'BK-PP1-003') {
      r1 = 'Agustin Wulandari (Kepala Administrasi 1)';
    } else if (staff.sekup === 'Operasional' && staff.nip !== 'BK-PP1-021') {
      r1 = 'Andhik Dharmabakti (Plt. Ka Pengolahan 2)';
    }

    const peers = HR_STAFF_MASTER_DATA
      .filter(s => s.nip !== staff.nip && s.nip !== 'BK-PP1-001' && !r1.toLowerCase().includes(s.nama.toLowerCase()))
      .slice(0, 3)
      .map(p => `${p.nama} (${p.jabatan})`);

    while (peers.length < 3) {
      peers.push(`Rekan Kerja Partner ${peers.length + 1}`);
    }

    const stdList = [r1, peers[0], peers[1], peers[2]];
    setRespondenList(stdList);
    setPeerFeedbacks(prev => prev.map((fb, idx) => ({
      ...fb,
      respondentName: stdList[idx] || ''
    })));
  };

  // Save changes and broadcast
  const handleSaveAll = () => {
    const sanksiArray = sanksiText
      .split('\n')
      .map(s => s.trim())
      .filter(s => s.length > 0);

    // If all respondents are blank, ensure all peerFeedbacks have empty respondentName
    const allRespondenEmpty = respondenList.every(r => !r || !r.trim());
    const finalPeerFeedbacks = peerFeedbacks.map((fb, idx) => {
      const respName = respondenList[idx] !== undefined ? respondenList[idx].trim() : '';
      return {
        ...fb,
        respondentName: allRespondenEmpty ? '' : (respName || fb.respondentName)
      };
    });

    const updated: OfficialKpiProfile = {
      ...currentProfile,
      responden: respondenList,
      catatanPresensi: {
        ...presensi,
        periode: presensi.periode || currentProfile.periodePenilaian
      },
      sanksiAdministratif: sanksiArray,
      parameters: workingParams.map(wp => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { rScores, ...cleanParam } = wp;
        return cleanParam;
      }),
      peerFeedbacks: finalPeerFeedbacks
    };

    onSaveProfile(updated);
    onClose();
  };

  const displayedParams = categoryFilter === 'ALL'
    ? workingParams
    : workingParams.filter(p => p.category === categoryFilter);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border-2 border-slate-300 dark:border-slate-700 w-full max-w-5xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Modal */}
        <div className="px-5 py-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 flex items-center justify-center font-black text-base shadow-sm">
              <Crown className="w-5 h-5 text-slate-950" />
            </div>
            <div>
              <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                <span>Modul Entri Data, Otoritas Atasan &amp; Kalibrasi KPI</span>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 dark:bg-amber-950/70 dark:text-amber-300 font-bold border border-amber-300">
                  Prerogatif Atasan &bull; 360° Hybrid
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Karyawan: <strong>{currentProfile.nama}</strong> ({currentProfile.nip}) &bull; {currentProfile.jabatan}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation Tabs inside Modal: Pill style with ample padding and sleek scrollbar so text is never obscured */}
        <div className="flex items-center gap-2 px-5 py-2.5 border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-900/90 overflow-x-auto text-xs shrink-0 [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-thumb]:bg-slate-300 dark:[&::-webkit-scrollbar-thumb]:bg-slate-700 [&::-webkit-scrollbar-thumb]:rounded-full">
          <button
            type="button"
            onClick={() => setEntryMode('quick_matrix')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ${
              entryMode === 'quick_matrix'
                ? 'bg-amber-500 text-slate-950 font-black shadow-xs ring-1 ring-amber-400'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <span>1. Entri Matriks &amp; Otoritas Penilai</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('supervisor_prerogative')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ${
              entryMode === 'supervisor_prerogative'
                ? 'bg-amber-600 text-white font-black shadow-xs ring-1 ring-amber-500'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Crown className="w-3.5 h-3.5 text-amber-400" />
            <span>2. Panduan Khusus Penilaian Mutlak Atasan</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('bars_behavior')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ${
              entryMode === 'bars_behavior'
                ? 'bg-indigo-600 text-white font-black shadow-xs ring-1 ring-indigo-500'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>3. Kalibrasi Perilaku BARS</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('peer_sbi')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ${
              entryMode === 'peer_sbi'
                ? 'bg-emerald-600 text-white font-black shadow-xs ring-1 ring-emerald-500'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5 text-white" />
            <span>4. Catatan Kualitatif SBI</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('attendance_sanctions')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ${
              entryMode === 'attendance_sanctions'
                ? 'bg-rose-600 text-white font-black shadow-xs ring-1 ring-rose-500'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <ShieldAlert className="w-3.5 h-3.5 text-white" />
            <span>5. Presensi &amp; Sanksi Riil</span>
          </button>

          <button
            type="button"
            onClick={() => setEntryMode('reality_sop')}
            className={`px-3.5 py-1.5 rounded-lg font-bold transition-all flex items-center gap-1.5 shrink-0 whitespace-nowrap shadow-2xs ${
              entryMode === 'reality_sop'
                ? 'bg-purple-600 text-white font-black shadow-xs ring-1 ring-purple-500'
                : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
            }`}
          >
            <HelpCircle className="w-3.5 h-3.5 text-white" />
            <span>6. SOP Anti-Bias Lengkap</span>
          </button>
        </div>

        {/* Modal Body Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
          
          {/* =========================================================================
              MODE 1: ENTRI MATRIKS & OTORITAS PENILAI
              ========================================================================= */}
          {entryMode === 'quick_matrix' && (
            <div className="space-y-4">
              
              {/* Presets and Guidance Bar */}
              <div className="bg-gradient-to-r from-amber-50 to-amber-100/70 dark:from-amber-950/40 dark:to-slate-900 p-4 rounded-xl border border-amber-300 dark:border-amber-800/80 text-xs text-amber-950 dark:text-amber-200 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-xs">
                <div className="flex items-start gap-2.5">
                  <Crown className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-amber-900 dark:text-amber-100 text-xs sm:text-sm">
                      Diferensiasi Otoritas: Penilaian Mutlak Atasan vs Rekan Kerja 360°
                    </strong>
                    <span className="text-[11px] text-amber-800/90 dark:text-amber-300/90 leading-relaxed block mt-0.5">
                      Untuk parameter yang bertanda <span className="font-bold underline">👑 Mutlak Atasan</span> (seperti Kepatuhan SOP, Kualitas Teknis &amp; Sanksi), 
                      nilai <strong>100% diputuskan oleh R1 (Atasan Langsung)</strong>. Kolom rekan kerja (R2-R4) otomatis terkunci agar tidak terjadi voting semu/kolusi.
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleApplyFactoryPresetAuthority}
                  className="px-3 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-xs flex items-center justify-center gap-1.5 shrink-0"
                  title="Otomatis kunci parameter kepatuhan & teknis ke Atasan, dan parameter kerjasama ke Rekan Kerja"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Terapkan Otoritas Standar Pabrik</span>
                </button>
              </div>

              {/* Responden Configuration Row */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2.5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700/80 pb-2">
                  <div>
                    <span className="text-[11px] font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider block">
                      Struktur 4 Responden Penilai:
                    </span>
                    <span className="text-[10px] text-slate-400">
                      R1 memiliki wewenang veto untuk parameter Mutlak Atasan. Nama responden otomatis sinkron dengan catatan kualitatif.
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      onClick={handleClearAllRespondents}
                      className="px-2.5 py-1 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-950/40 dark:hover:bg-red-900/60 text-red-700 dark:text-red-300 border border-red-200 dark:border-red-800 text-[10.5px] font-bold flex items-center gap-1 transition-all"
                      title="Hapus seluruh responden dan kosongkan catatan kualitatif (hapus dummy)"
                    >
                      <Trash2 className="w-3 h-3 text-red-600" />
                      <span>Kosongkan Responden</span>
                    </button>

                    <button
                      type="button"
                      onClick={handleResetToStandardRespondents}
                      className="px-2.5 py-1 rounded-lg bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-[10.5px] font-bold flex items-center gap-1 transition-all"
                      title="Isi ulang otomatis dengan atasan dan rekan kerja hirarkis tanpa evaluasi diri"
                    >
                      <RotateCcw className="w-3 h-3 text-slate-500" />
                      <span>Muat Standar Pabrik</span>
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
                  {respondenList.map((resp, i) => (
                    <div key={i} className={`p-2 rounded-lg border ${
                      i === 0 
                        ? 'bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-800' 
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700'
                    } space-y-1`}>
                      <div className="flex items-center justify-between">
                        <label className={`text-[10px] font-bold ${i === 0 ? 'text-amber-700 dark:text-amber-400 flex items-center gap-1' : 'text-slate-400'}`}>
                          {i === 0 && <Crown className="w-3 h-3 text-amber-500" />}
                          <span>R{i + 1} ({i === 0 ? 'Atasan Langsung' : i <= 2 ? 'Rekan Langsung' : 'Rekan Lintas Bagian'}):</span>
                        </label>
                      </div>
                      <input
                        type="text"
                        value={resp}
                        onChange={(e) => handleUpdateRespondent(i, e.target.value)}
                        placeholder={`Ketik nama Responden R${i + 1}...`}
                        className="w-full px-2 py-1 rounded border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-900 text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-1 focus:ring-amber-500"
                      />
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Filter Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
                <span className="text-[11px] font-semibold text-slate-400 shrink-0">Filter Kategori:</span>
                {['ALL', 'Kedisiplinan', 'Tanggungjawab', 'Sikap', 'Kompetensi'].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setCategoryFilter(cat)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                      categoryFilter === cat
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              {/* Matrix Table with Authority Badges & Column Locking */}
              <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700 shadow-xs max-h-[55vh]">
                <table className="w-full text-left border-collapse text-xs">
                  <thead className="sticky top-0 z-10 bg-slate-100 dark:bg-slate-800 shadow-xs">
                    <tr className="border-b border-slate-300 dark:border-slate-700">
                      <th className="py-2.5 px-2 text-center w-10 font-bold border-r border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">NO</th>
                      <th className="py-2.5 px-3 font-bold border-r border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">PARAMETER PENILAIAN</th>
                      <th className="py-2.5 px-2 text-center w-36 font-bold border-r border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-800">OTORITAS PENILAI</th>
                      <th className="py-2.5 px-1 text-center w-14 font-bold border-r border-slate-300 dark:border-slate-700 bg-amber-100/80 dark:bg-amber-950 text-amber-800 dark:text-amber-300" title={`R1 (Atasan Langsung) - ${respondenList[0]}`}>
                        R1 (Atasan)
                      </th>
                      <th className="py-2.5 px-1 text-center w-14 font-bold border-r border-slate-300 dark:border-slate-700 text-indigo-600 bg-slate-100 dark:bg-slate-800" title={`R2 (Rekan Kerja) - ${respondenList[1]}`}>R2</th>
                      <th className="py-2.5 px-1 text-center w-14 font-bold border-r border-slate-300 dark:border-slate-700 text-emerald-600 bg-slate-100 dark:bg-slate-800" title={`R3 (Rekan Kerja) - ${respondenList[2]}`}>R3</th>
                      <th className="py-2.5 px-1 text-center w-14 font-bold border-r border-slate-300 dark:border-slate-700 text-purple-600 bg-slate-100 dark:bg-slate-800" title={`R4 (Rekan Kerja) - ${respondenList[3]}`}>R4</th>
                      <th className="py-2.5 px-2 text-center w-16 font-bold border-r border-slate-300 dark:border-slate-700 bg-slate-200 dark:bg-slate-700">TOTAL</th>
                      <th className="py-2.5 px-2 text-center w-14 font-bold border-r border-slate-300 dark:border-slate-700 bg-amber-100 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300">AVG</th>
                      <th className="py-2.5 px-2 text-center w-20 font-bold bg-slate-100 dark:bg-slate-800">KRITERIA</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {displayedParams.map((p) => {
                      const isMutlakAtasan = p.evaluationAuthority === 'MUTLAK_ATASAN';
                      const isDataSistem = p.evaluationAuthority === 'DATA_SISTEM';

                      // Disparity check only for 360 collaborative parameters
                      const minScore = Math.min(...p.rScores);
                      const maxScore = Math.max(...p.rScores);
                      const hasDisparity = !isMutlakAtasan && (maxScore - minScore) >= 1.5;

                      return (
                        <tr 
                          key={p.id} 
                          className={`hover:bg-amber-50/40 dark:hover:bg-slate-800/40 transition-colors ${
                            isMutlakAtasan ? 'bg-amber-50/20 dark:bg-amber-950/10' : ''
                          }`}
                        >
                          <td className="py-2 px-2 text-center font-mono font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                            {p.subCategoryNumber}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {isMutlakAtasan && <Crown className="w-3 h-3 text-amber-500 shrink-0" />}
                              <span>{p.name}</span>
                            </div>
                            <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                              <span>Kategori: {p.category}</span>
                              {hasDisparity && (
                                <span className="inline-flex items-center gap-0.5 text-red-600 dark:text-red-400 font-bold bg-red-100 dark:bg-red-950/80 px-1 rounded text-[9px]" title="Perbedaan nilai antar responden sangat tinggi (>1.5 poin). Periksa potensi bias atau konflik penilaian!">
                                  <AlertTriangle className="w-2.5 h-2.5" />
                                  Disparitas ({maxScore} vs {minScore})
                                </span>
                              )}
                            </div>
                          </td>

                          {/* Evaluation Authority Selector */}
                          <td className="py-1 px-2 border-r border-slate-200 dark:border-slate-800 text-center">
                            <select
                              value={p.evaluationAuthority || 'KOLABORASI_360'}
                              onChange={(e) => handleToggleAuthority(p.id, e.target.value as EvaluationAuthority)}
                              className={`w-full py-1 px-1.5 rounded text-[10px] font-bold border cursor-pointer outline-hidden transition-all ${
                                isMutlakAtasan
                                  ? 'bg-amber-100 text-amber-900 border-amber-300 dark:bg-amber-950/80 dark:text-amber-300 dark:border-amber-700'
                                  : isDataSistem
                                  ? 'bg-emerald-100 text-emerald-900 border-emerald-300 dark:bg-emerald-950/80 dark:text-emerald-300 dark:border-emerald-700'
                                  : 'bg-indigo-50 text-indigo-800 border-indigo-200 dark:bg-indigo-950/80 dark:text-indigo-300 dark:border-indigo-800'
                              }`}
                            >
                              <option value="MUTLAK_ATASAN">👑 Mutlak Atasan (100%)</option>
                              <option value="KOLABORASI_360">👥 Kolaborasi 360°</option>
                              <option value="DATA_SISTEM">🖥️ Data Sistem</option>
                            </select>
                          </td>

                          {/* R1: Atasan Langsung Input */}
                          <td className="py-1 px-1 border-r border-slate-200 dark:border-slate-800 text-center bg-amber-50/50 dark:bg-amber-950/20">
                            <input
                              type="number"
                              min={1}
                              max={5}
                              step={0.1}
                              value={p.rScores[0]}
                              onChange={(e) => handleScoreChange(p.id, 0, e.target.value)}
                              className={`w-12 text-center py-1 rounded font-mono font-black text-slate-900 dark:text-white ${
                                isMutlakAtasan 
                                  ? 'border-2 border-amber-500 bg-amber-50 dark:bg-amber-950/60 shadow-xs ring-1 ring-amber-400' 
                                  : 'border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900'
                              }`}
                              title={isMutlakAtasan ? 'Nilai ini adalah penentu mutlak skor parameter ini (bobot 100%)' : 'Nilai dari Atasan Langsung'}
                            />
                          </td>

                          {/* R2, R3, R4 Inputs: Active if 360, Locked if Mutlak Atasan */}
                          {([1, 2, 3] as const).map(idx => (
                            <td key={idx} className="py-1 px-1 border-r border-slate-200 dark:border-slate-800 text-center">
                              {isMutlakAtasan ? (
                                <div 
                                  className="w-12 mx-auto py-1 px-0.5 rounded bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-[9px] font-mono font-bold text-slate-400 dark:text-slate-500 flex items-center justify-center gap-0.5 cursor-not-allowed"
                                  title="Kolom ini terkunci karena merupakan hak mutlak atasan langsung (R1)"
                                >
                                  <Lock className="w-2.5 h-2.5 text-amber-500/70" />
                                  <span>{p.rScores[0]}</span>
                                </div>
                              ) : (
                                <input
                                  type="number"
                                  min={1}
                                  max={5}
                                  step={0.1}
                                  value={p.rScores[idx]}
                                  onChange={(e) => handleScoreChange(p.id, idx, e.target.value)}
                                  className="w-12 text-center py-1 rounded border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white focus:ring-1 focus:ring-amber-500"
                                />
                              )}
                            </td>
                          ))}

                          {/* Computed Total */}
                          <td className="py-2 px-2 text-center font-mono font-bold bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-r border-slate-200 dark:border-slate-800">
                            {p.totalScore.toFixed(2)}
                          </td>

                          {/* Computed Avg */}
                          <td className="py-2 px-2 text-center font-mono font-black bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-r border-slate-200 dark:border-slate-800">
                            {p.avgScore.toFixed(2)}
                          </td>

                          {/* Computed Criteria */}
                          <td className="py-2 px-2 text-center">
                            <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              p.kriteria === 'SANGAT BAIK'
                                ? 'bg-blue-100 text-blue-800 dark:bg-blue-950/70 dark:text-blue-300'
                                : p.kriteria === 'BAIK'
                                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/70 dark:text-emerald-300'
                                : p.kriteria === 'CUKUP'
                                ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300'
                                : 'bg-red-100 text-red-800 dark:bg-red-950/70 dark:text-red-300'
                            }`}>
                              {p.kriteria}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 2: PANDUAN PENERAPAN PENILAIAN MUTLAK ATASAN
              ========================================================================= */}
          {entryMode === 'supervisor_prerogative' && (
            <div className="space-y-4 text-xs">
              <div className="bg-amber-50 dark:bg-amber-950/40 p-4 rounded-xl border border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200 space-y-2">
                <h4 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                  <Crown className="w-4 h-4 text-amber-600" />
                  <span>Arsitektur &amp; Mekanisme Penerapan: Penilaian Mutlak Atasan Langsung</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-amber-800 dark:text-amber-300">
                  Dalam operasional pabrik manufaktur (seperti PT Batu Karang), <strong>tidak semua metrik dapat diserahkan kepada voting rekan kerja</strong>. 
                  Jika rekan kerja diminta menilai kepatuhan SOP atau selisih stok cengkeh, akan terjadi kerancuan wewenang, potensi kolusi antar-pekerja shift, atau bias pertemanan (*halo effect*).
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* Pilar A */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-[10px]">A</span>
                    <span>1. Pembagian Wilayah Wewenang</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    <p>
                      <strong>Mutlak Atasan (100% Hak Supervisor):</strong>
                      <br />&bull; Kepatuhan SOP &amp; Regulasi Perusahaan (1.b, 1.d)
                      <br />&bull; Seluruh Tanggung Jawab &amp; Akurasi Hasil Kerja (2.a s/d 2.d)
                      <br />&bull; Kejujuran, Integritas Stok &amp; Loyalitas (3.e, 3.f)
                      <br />&bull; Kompetensi Teknis &amp; Problem Solving (4.a s/d 4.c)
                    </p>
                    <p className="pt-1 border-t border-slate-100 dark:border-slate-700">
                      <strong>Kolaborasi Rekan Kerja (360°):</strong>
                      <br />&bull; Kerjasama Tim, Koordinasi, Komunikasi &amp; Inisiatif Gotong Royong (3.b, 3.c, 3.d, 4.d, 4.e)
                    </p>
                  </div>
                </div>

                {/* Pilar B */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-[10px]">B</span>
                    <span>2. Rumus Teknis di Form 4-Kolom</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    <p>
                      Agar tetap kompatibel dengan lembar resmi PT Batu Karang yang memiliki kolom <strong>TOTAL (4 Data)</strong>:
                    </p>
                    <div className="p-2 rounded bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-[10px] space-y-1 text-slate-700 dark:text-slate-300">
                      <div>Rata-Rata (Avg) = Skor R1 (Atasan)</div>
                      <div>Total Skor = Rata-Rata &times; 4</div>
                      <div>R2, R3, R4 = Terkunci (Mengikuti R1)</div>
                    </div>
                    <p>
                      Dengan cara ini, total skor tetap berada di skala 20, namun angka tersebut murni 100% lahir dari keputusan manajerial atasan langsung tanpa bias rekan kerja.
                    </p>
                  </div>
                </div>

                {/* Pilar C */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-[10px]">C</span>
                    <span>3. Proteksi Anti-Otoriter</span>
                  </div>
                  <div className="space-y-1.5 text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                    <p>
                      Agar kewenangan mutlak ini <strong>tidak disalahgunakan</strong> menjadi subjektivitas atasan (*like or dislike*):
                    </p>
                    <p>
                      &bull; <strong>Wajib Audit Trail:</strong> Jika atasan memberi nilai $\le 2.0$ atau $5.0$, atasan wajib melampirkan nomor Surat Teguran/SP atau berita acara stok opname.
                      <br />&bull; <strong>Verifikasi Asisten Manajer:</strong> Hasil penilaian atasan langsung divalidasi oleh Asisten Manajer Produksi melalui tab Penerjemah Narasi Kualitatif sebelum ditandatangani.
                    </p>
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 3: KALIBRASI PERILAKU NYATA (BARS ENGINE)
              ========================================================================= */}
          {entryMode === 'bars_behavior' && (
            <div className="space-y-4">
              <div className="bg-indigo-50 dark:bg-indigo-950/40 p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-800/80 text-xs text-indigo-900 dark:text-indigo-200 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Cara Input Berbasis Realitas Nyata (BARS Method):</strong> Alih-alih menebak angka 1&ndash;5 secara subjektif, pilihlah deskripsi perilaku nyata yang memang benar-benar terjadi di lantai pabrik. Sistem akan otomatis mengisi angka kuantitatif yang setara dengan perilaku tersebut.
                </div>
              </div>

              <div className="space-y-4">
                {workingParams.map(param => (
                  <div key={param.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {param.subCategoryNumber}
                        </span>
                        <h4 className="font-bold text-slate-900 dark:text-white text-xs">
                          {param.name}
                        </h4>
                        <span className="text-[10px] text-slate-400">({param.category})</span>
                        {param.evaluationAuthority === 'MUTLAK_ATASAN' && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300">
                            👑 Mutlak Atasan
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <span className="text-slate-500 text-[11px]">Skor Saat Ini:</span>
                        <span className="font-mono font-black text-indigo-600 dark:text-indigo-400 text-sm">
                          {param.avgScore.toFixed(2)}
                        </span>
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200">
                          {param.kriteria}
                        </span>
                      </div>
                    </div>

                    {/* BARS Level Options */}
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-2 text-xs">
                      {([
                        { level: 1, label: 'Level 1 (0.0-1.0)', badge: 'Sangat Kurang', desc: param.barsDescription.level1, color: 'hover:border-red-500' },
                        { level: 2, label: 'Level 2 (1.1-2.0)', badge: 'Kurang', desc: param.barsDescription.level2, color: 'hover:border-orange-500' },
                        { level: 3, label: 'Level 3 (2.1-3.0)', badge: 'Cukup', desc: param.barsDescription.level3, color: 'hover:border-amber-500' },
                        { level: 4, label: 'Level 4 (3.1-4.0)', badge: 'Baik', desc: param.barsDescription.level4, color: 'hover:border-emerald-500' },
                        { level: 5, label: 'Level 5 (4.1-5.0)', badge: 'Sangat Baik', desc: param.barsDescription.level5, color: 'hover:border-blue-500' }
                      ] as const).map(option => {
                        const isCurrentActive = Math.round(param.avgScore) === option.level;
                        return (
                          <button
                            key={option.level}
                            type="button"
                            onClick={() => handleSelectBarsLevel(param.id, option.level)}
                            className={`p-2.5 rounded-lg border text-left transition-all flex flex-col justify-between ${
                              isCurrentActive
                                ? 'bg-amber-100/70 dark:bg-amber-950/60 border-amber-500 ring-2 ring-amber-400/50 shadow-xs'
                                : `bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 ${option.color}`
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="font-bold text-[10px] uppercase">{option.label}</span>
                              {isCurrentActive && <Check className="w-3.5 h-3.5 text-amber-600" />}
                            </div>
                            <p className="text-[10px] text-slate-600 dark:text-slate-300 line-clamp-4 leading-relaxed mb-2">
                              {option.desc}
                            </p>
                            <span className="text-[9px] font-semibold text-slate-400 block pt-1 border-t border-slate-100 dark:border-slate-800">
                              {option.badge}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 4: CATATAN KUALITATIF DENGAN FORMULA SBI
              ========================================================================= */}
          {entryMode === 'peer_sbi' && (
            <div className="space-y-4">
              <div className="bg-emerald-50 dark:bg-emerald-950/40 p-3.5 rounded-xl border border-emerald-200 dark:border-emerald-800/80 text-xs text-emerald-900 dark:text-emerald-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-2.5">
                  <BookmarkCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong>Formula SBI (Situation - Behavior - Impact):</strong> Umpan balik kualitatif tidak boleh klise seperti <em>"Kerjaannya bagus"</em>. Tuliskan <strong>Situasi</strong>, <strong>Perilaku</strong>, dan <strong>Dampak</strong> terhadap pabrik.
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={handleClearAllRespondents}
                    className="px-2.5 py-1 rounded-lg bg-red-100 hover:bg-red-200 dark:bg-red-950 dark:hover:bg-red-900 text-red-700 dark:text-red-300 text-[10.5px] font-bold flex items-center gap-1 transition-all border border-red-300 dark:border-red-800"
                    title="Kosongkan nama responden dan catatan kualitatif"
                  >
                    <Trash2 className="w-3 h-3 text-red-600" />
                    <span>Kosongkan Responden</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetToStandardRespondents}
                    className="px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[10.5px] font-bold flex items-center gap-1 transition-all border border-slate-300 dark:border-slate-700"
                  >
                    <RotateCcw className="w-3 h-3 text-slate-500" />
                    <span>Muat Standar</span>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                {peerFeedbacks.map((fb, idx) => (
                  <div key={fb.id} className="p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 space-y-3">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-700 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-mono text-xs flex items-center justify-center font-bold">
                          {idx + 1}
                        </span>
                        <div>
                          <input
                            type="text"
                            value={fb.respondentName}
                            onChange={(e) => {
                              const newFbs = [...peerFeedbacks];
                              newFbs[idx].respondentName = e.target.value;
                              setPeerFeedbacks(newFbs);
                              const newRespList = [...respondenList];
                              newRespList[idx] = e.target.value;
                              setRespondenList(newRespList);
                            }}
                            className="font-bold text-slate-900 dark:text-white text-xs bg-transparent border-b border-slate-300 dark:border-slate-600 focus:outline-hidden"
                            placeholder="Nama Responden (atau kosongkan)"
                          />
                          <span className="text-[10px] text-slate-400 block">{fb.roleInFactory}</span>
                        </div>
                      </div>

                      <select
                        value={fb.relationType}
                        onChange={(e) => {
                          const newFbs = [...peerFeedbacks];
                          newFbs[idx].relationType = e.target.value as 'LANGSUNG' | 'TIDAK_LANGSUNG';
                          setPeerFeedbacks(newFbs);
                        }}
                        className="text-xs px-2 py-1 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <option value="LANGSUNG">Hubungan Kerja Langsung (Rekan Harian)</option>
                        <option value="TIDAK_LANGSUNG">Hubungan Kerja Tidak Langsung (Lintas Bagian)</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1">
                          <Check className="w-3.5 h-3.5" />
                          <span>Kekuatan &amp; Perilaku Positif Teramati:</span>
                        </label>
                        <textarea
                          rows={3}
                          value={fb.positiveFeedback}
                          onChange={(e) => {
                            const newFbs = [...peerFeedbacks];
                            newFbs[idx].positiveFeedback = e.target.value;
                            setPeerFeedbacks(newFbs);
                          }}
                          className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
                          placeholder="Sebutkan perilaku positif konkret..."
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Area Perlu Pembenahan (Bottleneck / Kendala):</span>
                        </label>
                        <textarea
                          rows={3}
                          value={fb.improvementFeedback}
                          onChange={(e) => {
                            const newFbs = [...peerFeedbacks];
                            newFbs[idx].improvementFeedback = e.target.value;
                            setPeerFeedbacks(newFbs);
                          }}
                          className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
                          placeholder="Sebutkan insiden/situasi yang perlu diperbaiki..."
                        />
                      </div>
                    </div>

                    <div className="space-y-1 text-xs">
                      <label className="text-[11px] font-bold text-indigo-700 dark:text-indigo-400">
                        Usulan / Rekomendasi Solusi Pembinaan:
                      </label>
                      <input
                        type="text"
                        value={fb.recommendation || ''}
                        onChange={(e) => {
                          const newFbs = [...peerFeedbacks];
                          newFbs[idx].recommendation = e.target.value;
                          setPeerFeedbacks(newFbs);
                        }}
                        className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs text-slate-800 dark:text-slate-100"
                        placeholder="Contoh: Mengikuti pendampingan input BOS dan pelatihan manajemen tekanan shift..."
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 5: PRESENSI & SANKSI ADMINISTRATIF RIIL
              ========================================================================= */}
          {entryMode === 'attendance_sanctions' && (
            <div className="space-y-4">
              <div className="bg-red-50 dark:bg-red-950/40 p-3.5 rounded-xl border border-red-200 dark:border-red-800/80 text-xs text-red-900 dark:text-red-200 flex items-start gap-2.5">
                <ShieldAlert className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <div>
                  <strong>Validasi Data Faktual (Hard Data vs Persepsi):</strong> Penilaian kuantitatif sering kali bias karena rekan kerja memberi nilai 4 ("Baik"), padahal di sistem ada catatan insiden operasional atau surat peringatan. Data di bawah ini berfungsi sebagai <strong>penyeimbang (*triangulasi data*)</strong> agar rapor karyawan akurat.
                </div>
              </div>

              {/* Presensi Grid */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200 dark:border-slate-700 pb-2">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Catatan Presensi Periode Penilaian (Fingerprint / HRIS)
                  </h4>
                  <span className="text-[10px] text-slate-400">
                    Otomatis sinkron dengan kartu catatan presensi di Formulir Resmi
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-7 gap-2 text-xs">
                  <div className="col-span-2 sm:col-span-3 md:col-span-1">
                    <label className="text-[10px] text-slate-400 block font-medium">Periode Presensi</label>
                    <input
                      type="text"
                      value={presensi.periode || currentProfile.periodePenilaian}
                      onChange={(e) => setPresensi({ ...presensi, periode: e.target.value })}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white uppercase text-[11px]"
                      placeholder="JANUARI - OKTOBER"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Kehadiran (%)</label>
                    <input
                      type="number"
                      step={0.01}
                      value={presensi.persentaseKehadiran}
                      onChange={(e) => setPresensi({ ...presensi, persentaseKehadiran: parseFloat(e.target.value) || 0 })}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Alpha (Hari)</label>
                    <input
                      type="text"
                      value={presensi.alpha}
                      onChange={(e) => setPresensi({ ...presensi, alpha: e.target.value })}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Ijin (Menit)</label>
                    <input
                      type="number"
                      value={presensi.ijinMenit}
                      onChange={(e) => setPresensi({ ...presensi, ijinMenit: parseInt(e.target.value) || 0 })}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Sakit (Hari)</label>
                    <input
                      type="text"
                      value={presensi.sakit}
                      onChange={(e) => setPresensi({ ...presensi, sakit: e.target.value })}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Keterlambatan</label>
                    <input
                      type="text"
                      value={presensi.keterlambatan}
                      onChange={(e) => setPresensi({ ...presensi, keterlambatan: e.target.value })}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 block font-medium">Pulang Awal (Menit)</label>
                    <input
                      type="number"
                      value={presensi.pulangAwalMenit}
                      onChange={(e) => setPresensi({ ...presensi, pulangAwalMenit: parseInt(e.target.value) || 0 })}
                      className="w-full py-1.5 px-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-mono font-bold text-slate-900 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Sanksi Administratif Text */}
              <div className="bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center justify-between">
                  <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
                    Log Sanksi Administratif &amp; Insiden Operasional
                  </h4>
                  <span className="text-[10px] text-slate-400">1 baris = 1 poin sanksi / insiden</span>
                </div>
                <textarea
                  rows={4}
                  value={sanksiText}
                  onChange={(e) => setSanksiText(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs font-mono text-red-600 dark:text-red-400"
                  placeholder="Contoh: Surat Peringatan Pertama (SP I) Terkait Selisih Penimbangan Cengkeh..."
                />
              </div>
            </div>
          )}

          {/* =========================================================================
              MODE 6: SOP & METODE PENGINPUTAN AGAR MENUNJUKKAN REALITAS SEBENARNYA
              ========================================================================= */}
          {entryMode === 'reality_sop' && (
            <div className="space-y-4 text-xs">
              <div className="bg-purple-50 dark:bg-purple-950/40 p-4 rounded-xl border border-purple-200 dark:border-purple-800 text-purple-900 dark:text-purple-200 space-y-2">
                <h4 className="font-black text-sm uppercase tracking-wide flex items-center gap-2">
                  <Eye className="w-4 h-4 text-purple-600" />
                  <span>5 SOP Kunci: Bagaimana Penginputan Menunjukkan Realitas Sebenarnya</span>
                </h4>
                <p className="text-[11px] leading-relaxed text-purple-800 dark:text-purple-300">
                  Kelemahan terbesar evaluasi kuantitatif di perusahaan manufaktur adalah <strong>"Pukul Rata / Central Tendency"</strong> (semua dinilai 3 atau 4) dan <strong>"Halo Effect"</strong> (orang baik/ramah dinilai serba baik, mengabaikan kecerobohan teknis). Berikut metodologi operasional agar penginputan data mencerminkan realitas sesungguhnya di lantai pabrik:
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Pilar 1 */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-indigo-100 dark:bg-indigo-900/60 flex items-center justify-center text-[10px]">1</span>
                    <span>Terapkan BARS (Checklist Perilaku Nyata)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    Jangan meminta responden menilai <em>"Inisiatif: 1 sampai 5"</em>. Berikan lembar opsi perilaku konkret:
                    <br />&bull; <strong>Skor 2:</strong> Hanya bekerja jika ditegur atasan saat antrean truk datang.
                    <br />&bull; <strong>Skor 4:</strong> Langsung mengecek kebersihan gudang &amp; kadar air saat ada jeda shift tanpa disuruh.
                    <br />Penilai cukup mencentang perilaku yang terlihat &mdash; angka kuantitatif otomatis terkunci.
                  </p>
                </div>

                {/* Pilar 2 */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-amber-100 dark:bg-amber-900/60 flex items-center justify-center text-[10px]">2</span>
                    <span>Evidence-Based (Wajib Cantumkan Bukti untuk Nilai Ekstrem)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    Jika penilai memberi <strong>skor &le; 2 (Kurang)</strong> atau <strong>skor 5 (Sempurna)</strong>, form mewajibkan pengisian bukti kejadian:
                    <br />&bull; Tanggal kejadian operasional.
                    <br />&bull; Nomor Surat Tugas / Tiket Selisih Timbangan / Form Retur Bahan Baku.
                    <br />Ini mencegah fitnah pribadi atau pujian tanpa dasar.
                  </p>
                </div>

                {/* Pilar 3 */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-900/60 flex items-center justify-center text-[10px]">3</span>
                    <span>SOP Penulisan Umpan Balik Formula SBI</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    Larang komentar satu kalimat seperti <em>"Bagus, pertahankan"</em>. Terapkan standar wajib <strong>SBI</strong>:
                    <br />&bull; <strong>S (Situation):</strong> Pada minggu kedua saat bongkar muat 5 truk cengkeh...
                    <br />&bull; <strong>B (Behavior):</strong> Adin tidak memvalidasi ulang lembar tara timbangan...
                    <br />&bull; <strong>I (Impact):</strong> Mengakibatkan revisi berita acara 2 jam dan tim sorting menunggu.
                  </p>
                </div>

                {/* Pilar 4 */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2">
                  <div className="flex items-center gap-2 text-red-600 dark:text-red-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/60 flex items-center justify-center text-[10px]">4</span>
                    <span>Triangulasi Otomatis dengan Data Sistem (HRIS &amp; ERP)</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    Aplikasi ini mengintegrasikan presensi absensi sidik jari dan log sanksi. Jika rekan kerja memberi nilai 4 ("Baik"), namun sistem mencatat ada 1 Surat Peringatan (SP), modul evaluasi langsung memunculkan <strong>"Peringatan Anomali"</strong> untuk dikonfirmasi ulang oleh Manajer Operasional.
                  </p>
                </div>

                {/* Pilar 5 */}
                <div className="p-4 rounded-xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 space-y-2 md:col-span-2">
                  <div className="flex items-center gap-2 text-purple-600 dark:text-purple-400 font-bold text-xs uppercase">
                    <span className="w-5 h-5 rounded-full bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-[10px]">5</span>
                    <span>Kerahasiaan Penilai (*Confidential Blind Peer Review*) &amp; Bobot Berjenjang</span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
                    Rekan kerja lantai pabrik sering kali takut dinilai <em>"menusuk teman sendiri"</em> jika memberi nilai jujur. Oleh karena itu:
                    <br />&bull; Formulir rekan kerja bersifat anonim (*blind* kepada yang dinilai), hanya bisa dilihat oleh Atasan/Manajer.
                    <br />&bull; Penilaian atasan langsung (Plt. Kepala Pengolahan) memiliki bobot lebih tinggi pada hasil akhir (misal 40%), rekan kerja langsung (30%), dan rekan tidak langsung/QC (30%).
                  </p>
                </div>

              </div>
            </div>
          )}

        </div>

        {/* Modal Footer Controls */}
        <div className="px-5 py-3.5 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span>Status:</span>
            <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
              {workingParams.length} Parameter Siap Disinkronkan
            </span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-600 text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors flex-1 sm:flex-none text-center"
            >
              Batal
            </button>
            <button
              onClick={handleSaveAll}
              className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow-md flex items-center justify-center gap-1.5 flex-1 sm:flex-none"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Simpan &amp; Terapkan ke Dashboard</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
