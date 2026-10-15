import React, { useState, useMemo } from 'react';
import { HR_STAFF_MASTER_DATA, HrStaffRecord } from '../data/hrStaffMasterData';
import { 
  OfficialKpiProfile, 
  Kpi360Parameter, 
  KPI_16_RECOMMENDED_PARAMETERS 
} from '../data/kpi360TemplateData';
import { 
  getStaffKpiProfile, 
  saveStaffKpiProfile, 
  calculateProfileIndex, 
  getKriteriaFromScore 
} from '../data/kpiStaffProfilesData';
import { 
  Crown, 
  Users, 
  UserCheck, 
  CheckCircle2, 
  AlertCircle, 
  Sparkles, 
  Send, 
  ArrowLeft, 
  ShieldCheck, 
  Info, 
  Edit3, 
  FileText, 
  ThumbsUp, 
  AlertTriangle,
  Lightbulb,
  Building2,
  Calendar,
  Lock,
  ChevronRight,
  RotateCcw,
  Share2,
  ClipboardList,
  Clock
} from 'lucide-react';
import { formatWibDate, formatWibTime } from '../utils/indonesiaDateUtils';
import { KpiShareLinkModal } from './KpiShareLinkModal';
import { 
  getEvaluationQueue, 
  markQueueItemCompleted, 
  EvaluationQueueItem 
} from '../data/kpiEvaluationQueueData';

interface KpiRespondentSelfServiceProps {
  initialStaffNip?: string;
  onEvaluationSubmitted: (updatedProfile: OfficialKpiProfile) => void;
  onNavigateToOfficialSheet: () => void;
  onOpenShareModal?: () => void;
}

export const KpiRespondentSelfService: React.FC<KpiRespondentSelfServiceProps> = ({
  initialStaffNip = 'BK-PP1-025',
  onEvaluationSubmitted,
  onNavigateToOfficialSheet,
  onOpenShareModal
}) => {
  // Evaluated Staff
  const [evaluatedNip, setEvaluatedNip] = useState<string>(initialStaffNip);
  const [isInternalShareOpen, setIsInternalShareOpen] = useState<boolean>(false);

  // Manager Assigned Queue State
  const [evaluationQueue, setEvaluationQueue] = useState<EvaluationQueueItem[]>(() => getEvaluationQueue());
  const [queueMode, setQueueMode] = useState<'ASSIGNED_PKWT' | 'ALL_32'>('ASSIGNED_PKWT');
  const [queueCategoryFilter, setQueueCategoryFilter] = useState<'ALL_ASSIGNED' | 'PKWT_ONLY'>('ALL_ASSIGNED');

  // Evaluator Identity
  const [evaluatorType, setEvaluatorType] = useState<'ATASAN_LANGSUNG' | 'REKAN_LANGSUNG'>('ATASAN_LANGSUNG');
  const [evaluatorStaffNip, setEvaluatorStaffNip] = useState<string>('BK-PP1-021'); // Default Andhik Dharmabakti
  const [customEvaluatorName, setCustomEvaluatorName] = useState<string>('');
  const [customEvaluatorRole, setCustomEvaluatorRole] = useState<string>('');
  const [useCustomEvaluator, setUseCustomEvaluator] = useState<boolean>(false);

  // Target staff record from HR master data
  const targetStaffRecord = useMemo(() => {
    return HR_STAFF_MASTER_DATA.find(s => s.nip === evaluatedNip) || null;
  }, [evaluatedNip]);

  // Load current evaluated profile
  const targetProfile = useMemo(() => {
    return getStaffKpiProfile(evaluatedNip, 'RECOMMENDED_16');
  }, [evaluatedNip]);

  // Evaluator Info resolved
  const evaluatorInfo = useMemo(() => {
    if (useCustomEvaluator && customEvaluatorName.trim()) {
      return {
        nama: customEvaluatorName.trim(),
        jabatan: customEvaluatorRole.trim() || (evaluatorType === 'ATASAN_LANGSUNG' ? 'Atasan Langsung' : 'Rekan Kerja Langsung')
      };
    }
    const staff = HR_STAFF_MASTER_DATA.find(s => s.nip === evaluatorStaffNip);
    if (staff) {
      return {
        nama: staff.nama,
        jabatan: staff.jabatan
      };
    }
    return {
      nama: evaluatorType === 'ATASAN_LANGSUNG' ? 'Andhik Dharmabakti' : 'Ambar Istiqomah',
      jabatan: evaluatorType === 'ATASAN_LANGSUNG' ? 'Plt. Kepala Pengolahan 2' : 'Administrasi Cengkeh'
    };
  }, [useCustomEvaluator, customEvaluatorName, customEvaluatorRole, evaluatorStaffNip, evaluatorType]);

  // Working scores for each parameter (key: param.id, value: 1.0 - 5.0)
  const [scores, setScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    targetProfile.parameters.forEach(p => {
      // Default to target profile's current average or 4.0
      initial[p.id] = p.avgScore || 4.0;
    });
    return initial;
  });

  // Active category filter inside self-service form
  const [activeCategory, setActiveCategory] = useState<string>('ALL');

  // Qualitative feedback fields
  const [positiveFeedback, setPositiveFeedback] = useState<string>(
    evaluatorType === 'ATASAN_LANGSUNG'
      ? 'Memiliki komitmen tinggi pada absensi harian dan kepatuhan prosedur timbangan di lantai pabrik.'
      : 'Sangat kooperatif diajak kerja sama dalam serah terima shift dan menjaga kebersihan pos kerja bersama.'
  );

  const [improvementFeedback, setImprovementFeedback] = useState<string>(
    evaluatorType === 'ATASAN_LANGSUNG'
      ? 'Tingkatkan ketelitian verifikasi ganda pada nota timbang saat volume bongkar muat padat.'
      : 'Perlu lebih proaktif berkomunikasi jika ada kendala administrasi cut-off sebelum jam 09:00 WIB.'
  );

  const [recommendation, setRecommendation] = useState<string>(
    evaluatorType === 'ATASAN_LANGSUNG'
      ? 'Penerapan checklist verifikasi ganda (double sign-off) sebelum finalisasi nota timbang.'
      : 'Briefing koordinasi 5 menit di awal shift bersama tim operasional.'
  );

  // Submission state
  const [submittedReceipt, setSubmittedReceipt] = useState<{
    staffName: string;
    staffNip: string;
    evaluatorName: string;
    evaluatorRole: string;
    evaluatorType: string;
    submittedAt: string;
    averageScore: number;
    newIndexKinerja: number;
  } | null>(null);

  // Sync scores if evaluatedNip changes
  const handleTargetChange = (nip: string) => {
    setEvaluatedNip(nip);
    const prof = getStaffKpiProfile(nip, 'RECOMMENDED_16');
    const initial: Record<string, number> = {};
    prof.parameters.forEach(p => {
      initial[p.id] = p.avgScore || 4.0;
    });
    setScores(initial);
    setSubmittedReceipt(null);
  };

  // Support incoming deep link parameters from WhatsApp / Email / QR
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    const params = new URLSearchParams(window.location.search);
    const targetParam = params.get('targetNip') || params.get('nip') || params.get('staff');
    if (targetParam && HR_STAFF_MASTER_DATA.some(s => s.nip === targetParam)) {
      handleTargetChange(targetParam);
    }
    const evalTypeParam = params.get('evalType');
    if (evalTypeParam === 'ATASAN_LANGSUNG' || evalTypeParam === 'REKAN_LANGSUNG') {
      setEvaluatorType(evalTypeParam);
    }
    const evalNipParam = params.get('evalNip');
    if (evalNipParam && HR_STAFF_MASTER_DATA.some(s => s.nip === evalNipParam)) {
      setEvaluatorStaffNip(evalNipParam);
    }
  }, []);

  // Preset scoring buttons
  const handleApplyPreset = (val: number) => {
    const updated: Record<string, number> = {};
    targetProfile.parameters.forEach(p => {
      updated[p.id] = val;
    });
    setScores(updated);
  };

  // Submit Handler
  const handleSubmitEvaluation = (e: React.FormEvent) => {
    e.preventDefault();

    const isAtasan = evaluatorType === 'ATASAN_LANGSUNG';
    const respIndex = isAtasan ? 0 : 1; // R1 for atasan, R2 for direct peer

    // Update respondents list in profile
    const updatedResponden = [...targetProfile.responden];
    updatedResponden[respIndex] = `${evaluatorInfo.nama} (${isAtasan ? 'Atasan Langsung' : 'Rekan Kerja Langsung'})`;

    // Recalculate parameters
    const updatedParameters = targetProfile.parameters.map(param => {
      const submittedScore = scores[param.id] !== undefined ? scores[param.id] : param.avgScore;

      // If atasan on mutlak atasan, supervisor score dictates 100%
      if (param.evaluationAuthority === 'MUTLAK_ATASAN' && isAtasan) {
        const newAvg = Number(submittedScore.toFixed(2));
        return {
          ...param,
          totalScore: Number((newAvg * 4).toFixed(2)),
          avgScore: newAvg,
          kriteria: getKriteriaFromScore(newAvg)
        };
      }

      // Otherwise simulate 4-respondent average update
      // delta weight 25% (1 of 4 respondents)
      const currentAvg = param.avgScore;
      const delta = (submittedScore - currentAvg) * 0.25;
      let newAvg = Number((currentAvg + delta).toFixed(2));
      newAvg = Math.max(1.0, Math.min(5.0, newAvg));
      const newTotal = Number((newAvg * 4).toFixed(2));

      return {
        ...param,
        totalScore: newTotal,
        avgScore: newAvg,
        kriteria: getKriteriaFromScore(newAvg)
      };
    });

    // Update peer feedback
    const feedbackItem = {
      id: `feedback-self-${Date.now()}`,
      respondentName: evaluatorInfo.nama.toUpperCase(),
      relationType: 'LANGSUNG' as const,
      roleInFactory: evaluatorInfo.jabatan,
      positiveFeedback: positiveFeedback.trim() || 'Melaksanakan tugas operasional dengan dedikasi baik.',
      improvementFeedback: improvementFeedback.trim() || 'Pertahankan ritme kerja dan perhatikan ketelitian harian.',
      recommendation: recommendation.trim() || 'Koordinasi rutin di lantai pabrik.'
    };

    let updatedFeedbacks = [...targetProfile.peerFeedbacks];
    // Replace if same respondent or slot exists
    if (isAtasan) {
      updatedFeedbacks[3] = feedbackItem; // R4/Atasan slot
    } else {
      updatedFeedbacks[0] = feedbackItem; // R1/Direct peer slot
    }

    const updatedProfile: OfficialKpiProfile = {
      ...targetProfile,
      responden: updatedResponden,
      parameters: updatedParameters,
      peerFeedbacks: updatedFeedbacks
    };

    // Save to persistent storage
    saveStaffKpiProfile(updatedProfile);
    onEvaluationSubmitted(updatedProfile);

    // Calculate score summary for receipt
    const sumSubmitted = Object.values(scores).reduce((a, b) => a + b, 0);
    const avgSubmitted = Number((sumSubmitted / Object.values(scores).length).toFixed(2));
    const newIndex = calculateProfileIndex(updatedProfile);

    // Mark managerial evaluation queue item completed & refresh state
    const updatedQueue = markQueueItemCompleted(targetProfile.nip, newIndex);
    setEvaluationQueue(updatedQueue);

    const now = new Date();
    setSubmittedReceipt({
      staffName: targetProfile.nama,
      staffNip: targetProfile.nip,
      evaluatorName: evaluatorInfo.nama,
      evaluatorRole: evaluatorInfo.jabatan,
      evaluatorType: isAtasan ? 'Atasan Langsung (Prerogatif 100%)' : 'Rekan Kerja Hubungan Langsung (360° Peer)',
      submittedAt: `${formatWibDate(now)} - ${formatWibTime(now)}`,
      averageScore: avgSubmitted,
      newIndexKinerja: newIndex
    });
  };

  // Filtered parameters to display
  const displayedParams = activeCategory === 'ALL'
    ? targetProfile.parameters
    : targetProfile.parameters.filter(p => p.category === activeCategory);

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Explanation & Context */}
      <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 text-white p-5 sm:p-6 rounded-2xl border border-amber-500/30 shadow-md space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40 uppercase tracking-wider font-mono flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-amber-400" />
              <span>Jalur Mandiri Responden (Self-Service 360°)</span>
            </span>
            <span className="text-xs text-slate-300 font-medium hidden sm:inline">
              PT Batu Karang &bull; Divisi Produksi I
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={() => {
                if (onOpenShareModal) {
                  onOpenShareModal();
                } else {
                  setIsInternalShareOpen(true);
                }
              }}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black transition-all flex items-center gap-1.5 shadow-sm"
              title="Bagikan Tautan Kuesioner via URL / WhatsApp / QR Code"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan Tautan URL Responden</span>
            </button>

            <button
              onClick={onNavigateToOfficialSheet}
              className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold transition-all flex items-center gap-1.5 border border-white/20"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali ke Lembar Rapor Resmi</span>
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
            <span>Portal Kuesioner Penilaian Mandiri oleh Atasan &amp; Rekan Kerja Langsung</span>
          </h3>
          <p className="text-xs text-slate-300 max-w-4xl leading-relaxed mt-1">
            Dirancang agar <strong>Atasan Langsung</strong> dan <strong>Rekan Kerja yang memiliki Hubungan Kerja Langsung</strong> dapat menginput penilaian secara mandiri, rahasia (*blind evaluation*), 
            dan berbasis bukti perilaku nyata (BARS) tanpa memengaruhi independensi penilai lain.
          </p>
        </div>
      </div>

      {/* Success Receipt State */}
      {submittedReceipt && (
        <div className="bg-emerald-50 dark:bg-emerald-950/40 p-6 rounded-2xl border-2 border-emerald-400 dark:border-emerald-600 shadow-lg space-y-4 animate-in fade-in">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-black shadow-md shrink-0">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-mono font-bold text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded bg-emerald-200/60 dark:bg-emerald-900/60">
                PENGIRIMAN SUKSES &bull; TERSIMPAN KE DATABASE LOKAL
              </span>
              <h4 className="text-base sm:text-lg font-black text-emerald-950 dark:text-emerald-100">
                Penilaian Kinerja untuk {submittedReceipt.staffName} Berhasil Diterapkan!
              </h4>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200 dark:border-emerald-800 text-xs font-sans">
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">KARYAWAN DINILAI:</span>
              <strong className="text-slate-900 dark:text-white block font-bold text-xs">{submittedReceipt.staffName}</strong>
              <span className="text-[10px] text-slate-500 font-mono">NIP: {submittedReceipt.staffNip}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">IDENTITAS PENILAI:</span>
              <strong className="text-slate-900 dark:text-white block font-bold text-xs">{submittedReceipt.evaluatorName}</strong>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-semibold">{submittedReceipt.evaluatorType}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">WAKTU INPUT:</span>
              <strong className="text-slate-900 dark:text-white block font-mono text-xs">{submittedReceipt.submittedAt}</strong>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Terverifikasi Valid</span>
            </div>
            <div>
              <span className="text-slate-400 block text-[10px] font-medium">INDEX KINERJA TERKINI:</span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="px-2 py-0.5 rounded bg-emerald-500 text-slate-950 font-black font-mono text-sm">
                  {submittedReceipt.newIndexKinerja}
                </span>
                <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-300">
                  ({getKriteriaFromScore(submittedReceipt.newIndexKinerja)})
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-end gap-3 pt-2">
            <button
              onClick={() => setSubmittedReceipt(null)}
              className="px-4 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold transition-all flex items-center gap-1.5"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Input Penilaian untuk Staf Lain</span>
            </button>
            <button
              onClick={onNavigateToOfficialSheet}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-black shadow-sm transition-all flex items-center gap-1.5"
            >
              <span>Buka Lembar Rapor Resmi Karyawan</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Main Self-Service Form Container */}
      {!submittedReceipt && (
        <form onSubmit={handleSubmitEvaluation} className="space-y-6">
          
          {/* STEP 1: PILIH PERAN & IDENTITAS PENILAI */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                1
              </span>
              <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                Langkah 1: Identitas Penilai &amp; Hubungan Kerja
              </h4>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Type of Evaluator: Atasan Langsung vs Rekan Kerja Langsung */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                  Peran Hubungan Kerja Anda terhadap Karyawan:
                </label>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setEvaluatorType('ATASAN_LANGSUNG');
                      setPositiveFeedback('Memiliki komitmen tinggi pada absensi harian dan kepatuhan prosedur timbangan di lantai pabrik.');
                      setImprovementFeedback('Tingkatkan ketelitian verifikasi ganda pada nota timbang saat volume bongkar muat padat.');
                      setRecommendation('Penerapan checklist verifikasi ganda (double sign-off) sebelum finalisasi nota timbang.');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      evaluatorType === 'ATASAN_LANGSUNG'
                        ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/40 text-slate-950 dark:text-amber-200 shadow-xs ring-2 ring-amber-400/50'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs mb-1">
                      <Crown className="w-4 h-4 text-amber-500 shrink-0" />
                      <span>Atasan Langsung (R1)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Memiliki wewenang hierarkis, hak prerogatif atas kepatuhan SOP teknis &amp; sanksi operasional.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setEvaluatorType('REKAN_LANGSUNG');
                      setPositiveFeedback('Sangat kooperatif diajak kerja sama dalam serah terima shift dan menjaga kebersihan pos kerja bersama.');
                      setImprovementFeedback('Perlu lebih proaktif berkomunikasi jika ada kendala administrasi cut-off sebelum jam 09:00 WIB.');
                      setRecommendation('Briefing koordinasi 5 menit di awal shift bersama tim operasional.');
                    }}
                    className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                      evaluatorType === 'REKAN_LANGSUNG'
                        ? 'border-indigo-500 bg-indigo-500/10 dark:bg-indigo-950/40 text-slate-950 dark:text-indigo-200 shadow-xs ring-2 ring-indigo-400/50'
                        : 'border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div className="flex items-center gap-2 font-black text-xs mb-1">
                      <Users className="w-4 h-4 text-indigo-500 shrink-0" />
                      <span>Rekan Kerja Langsung (R2)</span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-tight">
                      Rekan satu lini/pos kerja, partner timbang, atau rekan serah terima shift harian.
                    </p>
                  </button>
                </div>
              </div>

              {/* Selector for Evaluator Name */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pilih Nama Anda (Penilai):
                  </label>
                  <button
                    type="button"
                    onClick={() => setUseCustomEvaluator(!useCustomEvaluator)}
                    className="text-[11px] text-indigo-600 dark:text-indigo-400 underline font-semibold"
                  >
                    {useCustomEvaluator ? 'Pilih dari Daftar Karyawan' : 'Tulis Manual Nama & Jabatan'}
                  </button>
                </div>

                {!useCustomEvaluator ? (
                  <select
                    value={evaluatorStaffNip}
                    onChange={(e) => setEvaluatorStaffNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-amber-500 outline-none"
                  >
                    {HR_STAFF_MASTER_DATA.filter(s => s.nip !== evaluatedNip).map(st => (
                      <option key={st.nip} value={st.nip}>
                        {st.nama} — {st.jabatan} ({st.sekup})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Nama Lengkap Penilai"
                      value={customEvaluatorName}
                      onChange={(e) => setCustomEvaluatorName(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                    />
                    <input
                      type="text"
                      placeholder="Jabatan di Pabrik"
                      value={customEvaluatorRole}
                      onChange={(e) => setCustomEvaluatorRole(e.target.value)}
                      className="px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs outline-none focus:ring-2 focus:ring-amber-500 font-semibold"
                    />
                  </div>
                )}

                <div className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800/80 text-[11px] text-slate-600 dark:text-slate-300 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>
                    Bertindak sebagai: <strong>{evaluatorInfo.nama}</strong> ({evaluatorInfo.jabatan})
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* STEP 2: PILIH KARYAWAN YANG DINILAI & PRIORITAS PENUGASAN MANAJER / PKWT */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  2
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Langkah 2: Karyawan yang Sedang Anda Nilai
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Karyawan dapat dipilih dari <strong>Antrean Penugasan Manajer (Prioritas PKWT)</strong> atau dibuka bebas untuk seluruh 32 staf pabrik.
                  </p>
                </div>
              </div>

              {/* Toggle Mode: Antrean Manajer vs Seluruh 32 Staf */}
              <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 self-start sm:self-auto text-xs">
                <button
                  type="button"
                  onClick={() => setQueueMode('ASSIGNED_PKWT')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                    queueMode === 'ASSIGNED_PKWT'
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <ClipboardList className="w-3.5 h-3.5" />
                  <span>Antrean Penugasan ({evaluationQueue.filter(q => q.status !== 'COMPLETED').length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setQueueMode('ALL_32')}
                  className={`px-3 py-1.5 rounded-lg font-bold text-xs transition-all flex items-center gap-1.5 ${
                    queueMode === 'ALL_32'
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Pilihan Bebas 32 Staf</span>
                </button>
              </div>
            </div>

            {/* MODE 1: KARTU ANTREAN PENUGASAN OLEH MANAJER (PRIORITAS HABIS PKWT) */}
            {queueMode === 'ASSIGNED_PKWT' && (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>Daftar Tugas Penilaian yang Telah Ditentukan oleh Manajer:</span>
                  </span>

                  <div className="flex items-center gap-1.5 text-[11px]">
                    <button
                      type="button"
                      onClick={() => setQueueCategoryFilter('ALL_ASSIGNED')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all ${
                        queueCategoryFilter === 'ALL_ASSIGNED'
                          ? 'bg-slate-900 dark:bg-slate-700 text-white'
                          : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      Semua Penugasan ({evaluationQueue.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setQueueCategoryFilter('PKWT_ONLY')}
                      className={`px-2.5 py-1 rounded-lg font-semibold transition-all flex items-center gap-1 ${
                        queueCategoryFilter === 'PKWT_ONLY'
                          ? 'bg-amber-500 text-slate-950 font-bold'
                          : 'bg-amber-100/70 dark:bg-amber-950/60 text-amber-900 dark:text-amber-300'
                      }`}
                    >
                      <Clock className="w-3 h-3" />
                      <span>Khusus Habis PKWT ({evaluationQueue.filter(q => q.employmentStatus.startsWith('PKWT')).length})</span>
                    </button>
                  </div>
                </div>

                {/* Queue Cards Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {evaluationQueue
                    .filter(item => {
                      if (queueCategoryFilter === 'PKWT_ONLY') return item.employmentStatus.startsWith('PKWT');
                      return true;
                    })
                    .map(item => {
                      const isSelected = item.targetNip === evaluatedNip;
                      const isPkwt = item.employmentStatus.startsWith('PKWT');
                      const isDone = item.status === 'COMPLETED';

                      return (
                        <div
                          key={item.id}
                          onClick={() => handleTargetChange(item.targetNip)}
                          className={`p-3 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between gap-2 text-left ${
                            isSelected
                              ? 'border-amber-500 bg-amber-500/10 dark:bg-amber-950/40 shadow-sm ring-2 ring-amber-400/40'
                              : isDone
                                ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50/30 dark:bg-emerald-950/20 hover:border-emerald-400'
                                : 'border-slate-200 dark:border-slate-800 hover:border-amber-400 dark:hover:border-amber-600 bg-white dark:bg-slate-900/80'
                          }`}
                        >
                          <div className="space-y-1">
                            <div className="flex items-center justify-between gap-1">
                              <span className="font-mono text-[10px] font-bold text-slate-500 dark:text-slate-400">
                                {item.targetNip}
                              </span>

                              <div className="flex items-center gap-1">
                                <span className={`text-[10px] font-mono font-bold px-1.5 py-0.2 rounded ${
                                  isPkwt ? 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/40' : 'bg-blue-500/20 text-blue-800 dark:text-blue-300'
                                }`}>
                                  {item.employmentStatus}
                                </span>

                                {isDone ? (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500 text-white font-bold flex items-center gap-0.5">
                                    <CheckCircle2 className="w-2.5 h-2.5" />
                                    <span>Selesai</span>
                                  </span>
                                ) : (
                                  <span className="text-[10px] px-1.5 py-0.2 rounded bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold">
                                    Perlu Dinilai
                                  </span>
                                )}
                              </div>
                            </div>

                            <div className="font-black text-xs text-slate-900 dark:text-white line-clamp-1">
                              {item.targetName}
                            </div>
                            <div className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">
                              {item.targetJabatan}
                            </div>
                          </div>

                          {/* Footer info: Days left & Assigner */}
                          <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-[10px]">
                            {isPkwt && item.daysRemaining !== undefined && (
                              <div className={`flex items-center gap-1 font-bold ${
                                item.daysRemaining <= 30
                                  ? 'text-red-600 dark:text-red-400'
                                  : 'text-amber-700 dark:text-amber-400'
                              }`}>
                                <Clock className="w-3 h-3" />
                                <span>Sisa {item.daysRemaining} Hari Habis Kontrak</span>
                              </div>
                            )}

                            <div className="text-slate-400 dark:text-slate-500 truncate">
                              Ditugaskan oleh: <span className="font-semibold text-slate-600 dark:text-slate-300">{item.assignedBy}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </div>
            )}

            {/* MODE 2: PILIHAN BEBAS SELURUH 32 STAF PABRIK */}
            {queueMode === 'ALL_32' && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300">
                    Pilih Karyawan Bebas dari Seluruh 32 Staf PT Batu Karang:
                  </label>
                  <button
                    type="button"
                    onClick={() => setQueueMode('ASSIGNED_PKWT')}
                    className="text-[11px] text-amber-600 dark:text-amber-400 underline font-semibold flex items-center gap-1"
                  >
                    <ClipboardList className="w-3.5 h-3.5" />
                    <span>Kembali ke Antrean Prioritas Manajer</span>
                  </button>
                </div>

                <select
                  value={evaluatedNip}
                  onChange={(e) => handleTargetChange(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border-2 border-indigo-400 dark:border-indigo-600 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-black text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  <optgroup label="Karyawan Menjelang Habis PKWT (Prioritas Perpanjangan Kontrak)">
                    {HR_STAFF_MASTER_DATA.filter(s => s.status.startsWith('PKWT')).map(st => (
                      <option key={st.nip} value={st.nip}>
                        [{st.status}] {st.nama} — {st.nip} ({st.jabatan} &bull; {st.sekup})
                      </option>
                    ))}
                  </optgroup>
                  <optgroup label="Karyawan Status Tetap (Evaluasi Reguler / Rolling / Promosi)">
                    {HR_STAFF_MASTER_DATA.filter(s => s.status === 'TETAP').map(st => (
                      <option key={st.nip} value={st.nip}>
                        [TETAP] {st.nama} — {st.nip} ({st.jabatan} &bull; {st.sekup})
                      </option>
                    ))}
                  </optgroup>
                </select>
              </div>
            )}

            {/* Target Details & PKWT Context Warning Banner */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="md:col-span-2 p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col justify-between gap-2">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Staf Aktif yang Dinilai:
                    </span>
                    <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                      targetStaffRecord?.status.startsWith('PKWT')
                        ? 'bg-amber-500 text-slate-950'
                        : 'bg-blue-600 text-white'
                    }`}>
                      {targetStaffRecord?.status || 'TETAP'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">NIP: {targetProfile.nip}</span>
                </div>

                <div className="space-y-0.5">
                  <div className="font-black text-slate-900 dark:text-white text-sm sm:text-base">
                    {targetProfile.nama}
                  </div>
                  <div className="text-slate-600 dark:text-slate-300 text-xs">
                    {targetProfile.jabatan} &bull; Level {targetProfile.level} &bull; Divisi {targetProfile.sekup}
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 flex flex-wrap items-center gap-3">
                  <span>Sanksi Administratif: <strong className="text-amber-600 dark:text-amber-400">{targetProfile.sanksiAdministratif.length > 0 ? targetProfile.sanksiAdministratif[0] : 'Nihil'}</strong></span>
                  <span>Divisi: <strong className="text-slate-700 dark:text-slate-200">{targetProfile.sekup}</strong></span>
                </div>
              </div>

              {/* Status Context & Expiry Alert */}
              <div className={`p-3.5 rounded-xl border text-xs flex flex-col justify-between gap-2 ${
                targetStaffRecord?.status.startsWith('PKWT')
                  ? 'bg-amber-50 dark:bg-amber-950/30 border-amber-300 dark:border-amber-800/80 text-amber-950 dark:text-amber-200'
                  : 'bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-800 text-blue-950 dark:text-blue-200'
              }`}>
                <div className="flex items-center gap-1.5 font-bold text-xs">
                  {targetStaffRecord?.status.startsWith('PKWT') ? (
                    <>
                      <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
                      <span>Evaluasi Masa Habis PKWT</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
                      <span>Evaluasi Karyawan Tetap</span>
                    </>
                  )}
                </div>

                <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-300">
                  {targetStaffRecord?.status.startsWith('PKWT')
                    ? 'Penilaian ini menentukan rekomendasi perpanjangan kontrak kerja waktu tertentu oleh Manajer Operasional dan Direksi.'
                    : 'Penilaian ini digunakan untuk kalibrasi kinerja tahunan/semesteran, penyesuaian rotasi shift, dan evaluasi kepatuhan SOP.'}
                </p>

                <div className="text-[10px] font-mono text-slate-500">
                  Otoritas: SK Direksi 01/AS/DRK/BKR/VII/2024
                </div>
              </div>
            </div>

          </div>

          {/* STEP 3: LEMBAR PEMBERIAN SKOR PER-PARAMETER BERDASARKAN BARS */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-2 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                  3
                </span>
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                    Langkah 3: Lembar Penilaian Parameter Perilaku Nyata (1.0 &ndash; 5.0)
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Gunakan skala perilaku nyata pabrik (*BARS*). Nilai Anda tersimpan mandiri untuk agregasi rapor 360°.
                  </p>
                </div>
              </div>

              {/* Quick Fill Presets */}
              <div className="flex items-center gap-1.5 self-start sm:self-auto text-xs shrink-0">
                <span className="text-[10px] font-bold text-slate-400 mr-1">Isi Cepat:</span>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(4.0)}
                  className="px-2.5 py-1 rounded-lg bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[11px] font-bold border border-emerald-300/40"
                  title="Set semua nilai ke 4.0 (Baik)"
                >
                  Semua 4.0 (Baik)
                </button>
                <button
                  type="button"
                  onClick={() => handleApplyPreset(3.5)}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 dark:bg-slate-800 dark:text-slate-200 text-[11px] font-bold border border-slate-300 dark:border-slate-700"
                  title="Set semua nilai ke 3.5 (Standar)"
                >
                  Semua 3.5
                </button>
              </div>
            </div>

            {/* Category Filter Chips */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
              <span className="text-[11px] font-bold text-slate-400 shrink-0">Filter Domain:</span>
              {['ALL', 'Kedisiplinan', 'Tanggungjawab', 'Sikap', 'Kompetensi'].map(cat => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all shrink-0 ${
                    activeCategory === cat
                      ? 'bg-amber-500 text-slate-950 shadow-xs'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
                  }`}
                >
                  {cat === 'ALL' ? `Semua (${targetProfile.parameters.length} Parameter)` : cat}
                </button>
              ))}
            </div>

            {/* Parameter Items Cards */}
            <div className="space-y-3.5 pt-2">
              {displayedParams.map((param) => {
                const currentVal = scores[param.id] !== undefined ? scores[param.id] : param.avgScore;
                const isMutlakAtasan = param.evaluationAuthority === 'MUTLAK_ATASAN';
                const isSystemData = param.evaluationAuthority === 'DATA_SISTEM';

                // Description according to current score
                let descText = param.barsDescription.level4;
                if (currentVal <= 1.0) descText = param.barsDescription.level1;
                else if (currentVal <= 2.0) descText = param.barsDescription.level2;
                else if (currentVal <= 3.0) descText = param.barsDescription.level3;
                else if (currentVal <= 4.0) descText = param.barsDescription.level4;
                else descText = param.barsDescription.level5;

                return (
                  <div
                    key={param.id}
                    className={`p-4 rounded-xl border transition-all ${
                      isMutlakAtasan && evaluatorType === 'ATASAN_LANGSUNG'
                        ? 'border-amber-300/80 dark:border-amber-800/80 bg-amber-50/30 dark:bg-amber-950/20'
                        : 'border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                      
                      {/* Left: Parameter Info */}
                      <div className="space-y-1 max-w-xl">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="font-mono text-xs font-black px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {param.subCategoryNumber}
                          </span>
                          <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                            {param.name}
                          </span>
                          
                          {isMutlakAtasan && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60">
                              <Crown className="w-3 h-3 text-amber-600" />
                              <span>Hak Mutlak Atasan</span>
                            </span>
                          )}

                          {isSystemData && (
                            <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60">
                              <Calendar className="w-3 h-3 text-emerald-600" />
                              <span>Data Presensi</span>
                            </span>
                          )}

                          <span className="text-[10px] font-medium text-slate-400 font-mono">
                            {param.category}
                          </span>
                        </div>

                        {/* Behavioral Description Preview */}
                        <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/60 text-[11px] text-slate-700 dark:text-slate-300 flex items-start gap-2">
                          <Info className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span className="leading-relaxed">
                            <strong>Perilaku Lapangan Teramati (Skor {currentVal.toFixed(1)}):</strong> {descText}
                          </span>
                        </div>
                      </div>

                      {/* Right: Quick Rating Selector (1, 2, 3, 4, 5) */}
                      <div className="flex items-center gap-1.5 self-start md:self-auto shrink-0">
                        {[1, 2, 3, 4, 5].map((starVal) => {
                          const isSelected = Math.round(currentVal) === starVal;
                          return (
                            <button
                              key={starVal}
                              type="button"
                              onClick={() => {
                                setScores(prev => ({
                                  ...prev,
                                  [param.id]: starVal
                                }));
                              }}
                              className={`w-9 h-9 rounded-xl font-black text-xs flex flex-col items-center justify-center transition-all ${
                                isSelected
                                  ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400 font-mono scale-105'
                                  : 'bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700'
                              }`}
                            >
                              <span>{starVal}</span>
                            </button>
                          );
                        })}

                        {/* Precise Manual Decimal Input */}
                        <div className="ml-2 flex items-center gap-1 bg-slate-100 dark:bg-slate-800 px-2 py-1.5 rounded-xl border border-slate-300 dark:border-slate-700">
                          <span className="text-[10px] font-mono text-slate-400">Skor:</span>
                          <input
                            type="number"
                            min="1.0"
                            max="5.0"
                            step="0.1"
                            value={currentVal}
                            onChange={(e) => {
                              const v = parseFloat(e.target.value);
                              if (!isNaN(v)) {
                                setScores(prev => ({
                                  ...prev,
                                  [param.id]: Math.min(5, Math.max(1, v))
                                }));
                              }
                            }}
                            className="w-12 text-center bg-transparent font-black font-mono text-xs text-slate-900 dark:text-white outline-none"
                          />
                        </div>
                      </div>

                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* STEP 4: MASUKAN KUALITATIF OPERASIONAL (SBI CATATAN REKAN & ATASAN) */}
          <div className="bg-white dark:bg-slate-900 p-5 sm:p-6 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-slate-200 dark:border-slate-800">
              <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-black text-xs flex items-center justify-center shrink-0">
                4
              </span>
              <div>
                <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider">
                  Langkah 4: Catatan Naratif Operasional (Kekuatan &amp; Area Pembenahan)
                </h4>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Wajib menyertakan bukti perilaku nyata (bukan sekadar "bagus" atau "buruk") agar bernilai pembinaan.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Positive Feedback */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Kekuatan Utama Karyawan di Lantai Kerja (+):</span>
                </label>
                <textarea
                  rows={3}
                  value={positiveFeedback}
                  onChange={(e) => setPositiveFeedback(e.target.value)}
                  placeholder="Contoh: Sangat disiplin hadir tepat waktu sebelum jam cut-off, teliti dalam menyusun nota timbang cengkeh..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              {/* Improvement Feedback */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-amber-700 dark:text-amber-400 flex items-center gap-1.5">
                  <AlertTriangle className="w-3.5 h-3.5" />
                  <span>Hal yang Perlu Ditingkatkan / Hambatan (-):</span>
                </label>
                <textarea
                  rows={3}
                  value={improvementFeedback}
                  onChange={(e) => setImprovementFeedback(e.target.value)}
                  placeholder="Contoh: Konsentrasi menurun saat ritme kerja dipercepat, perlu lebih berani mengoreksi selisih timbangan tanpa menunggu atasan..."
                  className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs leading-relaxed focus:ring-2 focus:ring-amber-500 outline-none"
                />
              </div>

            </div>

            {/* Recommendation / Action Step */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-indigo-700 dark:text-indigo-400 flex items-center gap-1.5">
                <Lightbulb className="w-3.5 h-3.5" />
                <span>Usulan Konkret Tindak Lanjut / Rekomendasi Pendampingan:</span>
              </label>
              <input
                type="text"
                value={recommendation}
                onChange={(e) => setRecommendation(e.target.value)}
                placeholder="Contoh: Simulasi alur timbang cepat dan pendampingan checklist verifikasi ganda."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-indigo-500 outline-none font-medium"
              />
            </div>
          </div>

          {/* STEP 5: FINAL SUBMIT BUTTON BAR */}
          <div className="bg-slate-100 dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="text-xs text-slate-600 dark:text-slate-300">
              <div>
                Menilai: <strong>{targetProfile.nama}</strong> ({targetProfile.nip})
              </div>
              <div className="text-[11px] text-slate-400">
                Sebagai: <strong>{evaluatorInfo.nama}</strong> &bull; {evaluatorType === 'ATASAN_LANGSUNG' ? 'Atasan Langsung (R1)' : 'Rekan Kerja Langsung (R2)'}
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onNavigateToOfficialSheet}
                className="px-4 py-2.5 rounded-xl bg-white dark:bg-slate-800 hover:bg-slate-50 text-slate-700 dark:text-slate-300 text-xs font-bold transition-all border border-slate-300 dark:border-slate-700"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black shadow-md transition-all flex items-center gap-2"
              >
                <Send className="w-4 h-4 text-slate-950" />
                <span>Kirim Penilaian Mandiri Ini</span>
              </button>
            </div>
          </div>

        </form>
      )}

      {/* Internal Fallback Share Modal */}
      {isInternalShareOpen && (
        <KpiShareLinkModal
          isOpen={isInternalShareOpen}
          onClose={() => setIsInternalShareOpen(false)}
          defaultStaffNip={evaluatedNip}
          defaultEvaluatorType={evaluatorType}
        />
      )}

    </div>
  );
};
