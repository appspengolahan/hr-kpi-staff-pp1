import React, { useState, useMemo } from 'react';
import { KPI_METRICS_DATA } from '../data/kpiMetricsData';
import { POSITIONS_DATA } from '../data/jobDescriptions';
import { HR_STAFF_MASTER_DATA, HrStaffRecord } from '../data/hrStaffMasterData';
import { RoleId, KpiMetric } from '../types';
import { 
  OFFICIAL_ADIN_KPI_DATA, 
  OFFICIAL_ADIN_KPI_DATA_LEGACY_20,
  KPI_16_RECOMMENDED_PARAMETERS,
  KPI_20_LEGACY_PARAMETERS,
  OfficialKpiProfile, 
  Kpi360Parameter, 
  generateQualitativeSynthesis, 
  QualitativeSynthesis 
} from '../data/kpi360TemplateData';
import {
  getStaffKpiProfile,
  saveStaffKpiProfile,
  resetStaffKpiProfile,
  hasCustomKpiEdits,
  calculateProfileIndex,
  getKriteriaFromScore
} from '../data/kpiStaffProfilesData';
import { 
  Calculator, 
  Award, 
  UserCheck, 
  ShieldAlert, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  AlertOctagon, 
  RefreshCw,
  FileBadge,
  User,
  Users,
  Search,
  FileText,
  AlertTriangle,
  Clock,
  Printer,
  Download,
  Eye,
  Info,
  ChevronRight,
  BarChart3,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Check,
  Target,
  Compass,
  MessageSquare,
  BookOpen,
  Edit3,
  SlidersHorizontal,
  Crown,
  Share2,
  ClipboardList,
  ChevronDown,
  Layers
} from 'lucide-react';
import { exportKpiPdf, KpiExportTarget } from '../utils/kpiPdfExport';
import { formatWibDate, formatWibTime } from '../utils/indonesiaDateUtils';
import { KpiDataEntryModal } from './KpiDataEntryModal';
import { KpiRespondentSelfService } from './KpiRespondentSelfService';
import { KpiShareLinkModal } from './KpiShareLinkModal';
import { KpiEvaluationQueueManagerModal } from './KpiEvaluationQueueManagerModal';
import { getEvaluationQueue } from '../data/kpiEvaluationQueueData';

export const KpiScorecardCalculator: React.FC = () => {
  // Main Tab State with deep link support
  const [activeTab, setActiveTab] = useState<'official_template' | 'qualitative_synthesis' | 'weight_calculator' | 'respondent_self_service'>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const subtab = params.get('subtab');
      if (subtab && ['official_template', 'qualitative_synthesis', 'weight_calculator', 'respondent_self_service'].includes(subtab)) {
        return subtab as any;
      }
    }
    return 'official_template';
  });

  // Selected Staff NIP with deep link support
  const [selectedStaffNip, setSelectedStaffNip] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const targetParam = params.get('targetNip') || params.get('nip') || params.get('staff');
      if (targetParam && HR_STAFF_MASTER_DATA.some(s => s.nip === targetParam)) {
        return targetParam;
      }
    }
    return 'BK-PP1-025'; // Default to Adin Tri Wartono
  });
  const [selectedBarsParam, setSelectedBarsParam] = useState<Kpi360Parameter | null>(null);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [isQueueManagerModalOpen, setIsQueueManagerModalOpen] = useState(false);
  const [switchToast, setSwitchToast] = useState<string | null>(null);

  // Manager evaluation queue tracking
  const evaluationQueue = useMemo(() => getEvaluationQueue(), [isQueueManagerModalOpen, activeTab]);
  const pendingQueueCount = useMemo(() => {
    return evaluationQueue.filter(q => q.status !== 'COMPLETED').length;
  }, [evaluationQueue]);

  // Selected Profile for 360 evaluation loaded dynamically per staff
  const [currentProfile, setCurrentProfile] = useState<OfficialKpiProfile>(() => {
    let initialNip = 'BK-PP1-025';
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const targetParam = params.get('targetNip') || params.get('nip') || params.get('staff');
      if (targetParam && HR_STAFF_MASTER_DATA.some(s => s.nip === targetParam)) {
        initialNip = targetParam;
      }
    }
    return getStaffKpiProfile(initialNip, 'RECOMMENDED_16');
  });

  // Check if current employee profile has custom saved modifications
  const isCustomEdited = useMemo(() => {
    return hasCustomKpiEdits(selectedStaffNip);
  }, [selectedStaffNip, currentProfile]);

  // Selected Staff record from HR Master Data
  const selectedStaffRecord = useMemo(() => {
    return HR_STAFF_MASTER_DATA.find(s => s.nip === selectedStaffNip) || null;
  }, [selectedStaffNip]);

  // Switch between Option B (16 Recommended Industrial Points) and Option A (20 Legacy Points)
  const handleSwitchTemplate = (version: 'RECOMMENDED_16' | 'LEGACY_20') => {
    const updated = getStaffKpiProfile(selectedStaffNip, version);
    setCurrentProfile(updated);
    saveStaffKpiProfile(updated);
  };

  // Filter category in Official Form
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<string>('ALL');

  // Qualitative Synthesis
  const synthesis: QualitativeSynthesis = useMemo(() => {
    return generateQualitativeSynthesis(currentProfile);
  }, [currentProfile]);

  // Calculations for Official Form
  const totalScoreSum = useMemo(() => {
    return currentProfile.parameters.reduce((acc, p) => acc + p.totalScore, 0);
  }, [currentProfile]);

  const avgScoreCalc = useMemo(() => {
    return Number((totalScoreSum / currentProfile.parameters.length).toFixed(2));
  }, [totalScoreSum, currentProfile.parameters.length]);

  const indexKinerja = useMemo(() => {
    return calculateProfileIndex(currentProfile);
  }, [currentProfile]);

  // Radar chart data for the 4 domains
  const domainAverages = useMemo(() => {
    const categories = ['Kedisiplinan', 'Tanggungjawab', 'Sikap', 'Kompetensi'] as const;
    return categories.map(cat => {
      const items = currentProfile.parameters.filter(p => p.category === cat);
      const avg = items.length > 0 
        ? items.reduce((acc, p) => acc + p.avgScore, 0) / items.length
        : 0;
      return {
        category: cat,
        avg: Number(avg.toFixed(2)),
        count: items.length
      };
    });
  }, [currentProfile]);

  // --- STATE FOR EXISTING WEIGHT CALCULATOR TAB ---
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId>('admin_cengkeh');
  const [selectionMode, setSelectionMode] = useState<'individual' | 'role'>('individual');

  const selectedStaff = useMemo(() => {
    return HR_STAFF_MASTER_DATA.find(s => s.nip === selectedStaffNip) || HR_STAFF_MASTER_DATA[0];
  }, [selectedStaffNip]);

  const activeRole = useMemo(() => {
    const roleId = selectionMode === 'individual' ? selectedStaff.mappedRoleId : selectedRoleId;
    return POSITIONS_DATA.find(p => p.id === roleId) || POSITIONS_DATA[0];
  }, [selectionMode, selectedStaff, selectedRoleId]);

  const roleMetrics = useMemo(() => {
    return KPI_METRICS_DATA.filter(m => m.roleId === activeRole.id);
  }, [activeRole]);

  const [metricScores, setMetricScores] = useState<Record<string, number>>(() => {
    const initial: Record<string, number> = {};
    roleMetrics.forEach(m => {
      initial[m.id] = 92;
    });
    return initial;
  });

  // Fully dynamic staff switcher: loads full parameters, presensi, sanctions, respondents, and peer review
  const handleStaffChange = (nip: string) => {
    setSelectedStaffNip(nip);
    const staff = HR_STAFF_MASTER_DATA.find(s => s.nip === nip);
    if (staff) {
      // 1. Load staff-specific KPI profile (with saved edits if present)
      const currentVersion = currentProfile.templateVersion || 'RECOMMENDED_16';
      const loadedProfile = getStaffKpiProfile(nip, currentVersion);
      setCurrentProfile(loadedProfile);

      // 2. Sync Role and Job Desk simulation metrics
      setSelectedRoleId(staff.mappedRoleId);
      const newMetrics = KPI_METRICS_DATA.filter(m => m.roleId === staff.mappedRoleId);
      const initial: Record<string, number> = {};
      newMetrics.forEach(m => {
        initial[m.id] = 92;
      });
      setMetricScores(initial);

      // 3. Temporary toast notification
      const newIndex = calculateProfileIndex(loadedProfile);
      setSwitchToast(`Profil dimuat: ${staff.nama} (Index Kinerja: ${newIndex} - ${getKriteriaFromScore(newIndex)})`);
      setTimeout(() => setSwitchToast(null), 4000);
    }
  };

  // Reset current staff profile to factory defaults
  const handleResetStaffToDefault = () => {
    const defaultProfile = resetStaffKpiProfile(selectedStaffNip, currentProfile.templateVersion);
    setCurrentProfile(defaultProfile);
    const newIndex = calculateProfileIndex(defaultProfile);
    setSwitchToast(`Data ${currentProfile.nama} dikembalikan ke nilai standar pabrik (Index: ${newIndex})`);
    setTimeout(() => setSwitchToast(null), 4000);
  };

  // Save changes from Data Entry Modal
  const handleSaveProfileFromModal = (updated: OfficialKpiProfile) => {
    setCurrentProfile(updated);
    saveStaffKpiProfile(updated);
    const newIndex = calculateProfileIndex(updated);
    setSwitchToast(`Perubahan KPI untuk ${updated.nama} berhasil disimpan ke database lokal (Index: ${newIndex})`);
    setTimeout(() => setSwitchToast(null), 4000);
  };

  const handleScoreChange = (metricId: string, value: number) => {
    setMetricScores(prev => ({
      ...prev,
      [metricId]: Math.min(100, Math.max(0, value))
    }));
  };

  const { totalWeightedScore, grade, actionAdvice } = useMemo(() => {
    let total = 0;
    roleMetrics.forEach(m => {
      const score = metricScores[m.id] ?? 90;
      total += (score * m.weight) / 100;
    });

    const rounded = Number(total.toFixed(2));
    let g: 'A (Sangat Baik)' | 'B (Baik / Standar)' | 'C (Perlu Pembinaan)' | 'D (Kritis / Sanksi)';
    let advice = '';

    if (rounded >= 92) {
      g = 'A (Sangat Baik)';
      advice = 'Performa Istimewa. Memenuhi seluruh target throughput, toleransi susut prima, dan kedisiplinan tinggi. Layak dipertimbangkan untuk Promosi atau Bonus Kinerja Semester.';
    } else if (rounded >= 80) {
      g = 'B (Baik / Standar)';
      advice = 'Kinerja Baik (Sesuai Standar Operasional Divisi). Pertahankan konsistensi harian dan perbaiki poin metrik yang masih berada di bawah target.';
    } else if (rounded >= 68) {
      g = 'C (Perlu Pembinaan)';
      advice = 'Performa Di Bawah Standar. Direkomendasikan Pembinaan Khusus & Evaluasi Mingguan oleh Manajer Operasional. Pelaksanaan Rolling Penugasan bila tidak ada kenaikan.';
    } else {
      g = 'D (Kritis / Sanksi)';
      advice = 'Performa Kritis / Pelanggaran Berat. Terbitkan Surat Peringatan (SP) sesuai SK Direksi No: 01/AS/DRK/BKR/VII/2024. Jika dalam 3x teguran tidak ada perbaikan, ajukan Pelimpahan ke HRD II.';
    }

    return { totalWeightedScore: rounded, grade: g, actionAdvice: advice };
  }, [roleMetrics, metricScores]);

  // Export PDF modular (Semua Lembar atau Lembar Pilihan)
  const [isExportDropdownOpen, setIsExportDropdownOpen] = useState(false);
  const [exportingTarget, setExportingTarget] = useState<KpiExportTarget | null>(null);

  const handleExportPdf = (target: KpiExportTarget) => {
    setExportingTarget(target);
    setIsExportingPdf(true);
    setIsExportDropdownOpen(false);

    setTimeout(() => {
      try {
        exportKpiPdf(target, {
          profile: currentProfile,
          synthesis,
          domainAverages,
          indexKinerja,
          activeRole,
          roleMetrics,
          metricScores,
          totalWeightedScore,
          grade,
          actionAdvice,
          staffRecord: selectedStaffRecord || undefined
        });

        const targetLabels: Record<KpiExportTarget, string> = {
          ALL: 'Laporan Lengkap 360° (Semua Lembar)',
          OFFICIAL_FORM: 'Lembar 1: Formulir Resmi KPI',
          QUALITATIVE_BARS: 'Lembar 2: Penerjemah Kualitatif & BARS',
          WEIGHT_SIMULATION: 'Lembar 3: Simulasi Bobot Metrik'
        };

        setSwitchToast(`PDF ${targetLabels[target]} untuk ${currentProfile.nama} berhasil diunduh!`);
        setTimeout(() => setSwitchToast(null), 4000);
      } catch (err) {
        console.error('Gagal mencetak PDF:', err);
      } finally {
        setIsExportingPdf(false);
        setExportingTarget(null);
      }
    }, 80);
  };

  // Filtered parameters for Official Form
  const displayedParams = useMemo(() => {
    if (activeCategoryFilter === 'ALL') return currentProfile.parameters;
    return currentProfile.parameters.filter(p => p.category === activeCategoryFilter);
  }, [currentProfile.parameters, activeCategoryFilter]);

  return (
    <div className="space-y-6">
      
      {/* Top Banner Navigation & Executive Tab Controls */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        {/* Header Title Section: Full width, clean hierarchy */}
        <div className="space-y-2 pb-4 border-b border-slate-100 dark:border-slate-800">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 uppercase tracking-wider font-mono">
              PT BATU KARANG &bull; DIVISI PRODUKSI I
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              Sistem Penilaian Kinerja 360° (Hybrid Kuantitatif &amp; Kualitatif)
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <FileBadge className="w-5 h-5 text-amber-500 shrink-0" />
                <span>Evaluator &amp; Lembar Penilaian Kinerja Karyawan (KPI)</span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-4xl leading-relaxed">
                Mengintegrasikan data kuantitatif kuesioner 4 responden dengan <strong className="text-slate-700 dark:text-slate-300">Penerjemah Narasi Kualitatif (BARS)</strong>, 
                sehingga angka skor 1–5 langsung dipahami sebagai perilaku nyata di lantai pabrik dan siap ditindaklanjuti.
              </p>
            </div>

            {/* Quick Export PDF with Modular Dropdown */}
            <div className="shrink-0 self-start lg:self-center relative">
              <div className="inline-flex rounded-xl shadow-sm">
                <button
                  type="button"
                  onClick={() => handleExportPdf('ALL')}
                  disabled={isExportingPdf}
                  className="px-3.5 py-2 rounded-l-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white text-xs font-semibold flex items-center gap-1.5 transition-all border border-slate-700 disabled:opacity-50"
                  title="Unduh seluruh lembar evaluasi (Formulir Resmi, BARS, & Simulasi Bobot)"
                >
                  <Download className={`w-3.5 h-3.5 text-amber-400 dark:text-white ${isExportingPdf && exportingTarget === 'ALL' ? 'animate-bounce' : ''}`} />
                  <span>{isExportingPdf && exportingTarget === 'ALL' ? 'Membuat PDF...' : 'Ekspor Semua Lembar'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setIsExportDropdownOpen(!isExportDropdownOpen)}
                  disabled={isExportingPdf}
                  className="px-2.5 py-2 rounded-r-xl bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold flex items-center transition-all border-y border-r border-slate-700 disabled:opacity-50 hover:bg-slate-750"
                  title="Buka pilihan cetak lembar spesifik"
                >
                  <ChevronDown className={`w-3.5 h-3.5 text-amber-400 transition-transform ${isExportDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
              </div>

              {/* Floating Dropdown Menu for Modular PDF Export */}
              {isExportDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setIsExportDropdownOpen(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-84 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl p-2.5 z-50 text-xs">
                    <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800">
                      <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                        <Layers className="w-4 h-4 text-amber-500" />
                        <span>Pilihan Ekspor Dokumen PDF</span>
                      </div>
                      <p className="text-[10.5px] text-slate-500 dark:text-slate-400 mt-0.5">
                        Cetak seluruh bundel 3-in-1 atau lembar spesifik saja:
                      </p>
                    </div>

                    <div className="py-1.5 space-y-1">
                      {/* Option 1: ALL */}
                      <button
                        type="button"
                        onClick={() => handleExportPdf('ALL')}
                        disabled={isExportingPdf}
                        className="w-full text-left p-2.5 rounded-xl hover:bg-amber-50 dark:hover:bg-amber-950/40 transition-all flex items-start gap-2.5 group border border-transparent hover:border-amber-200 dark:hover:border-amber-900/50"
                      >
                        <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-700 dark:text-amber-300 flex items-center justify-center shrink-0 mt-0.5 font-black text-xs font-mono">
                          ALL
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-amber-700 dark:group-hover:text-amber-400 flex items-center justify-between">
                            <span>1. Semua Lembar (3-in-1 Lengkap)</span>
                            <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300 font-mono font-bold">
                              3 Hal
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Menggabungkan Formulir Resmi, Sintesis BARS, & Simulasi Bobot ke dalam 1 berkas resmi.
                          </p>
                        </div>
                      </button>

                      <div className="border-t border-slate-100 dark:border-slate-800 my-1" />

                      {/* Option 2: Lembar 1 */}
                      <button
                        type="button"
                        onClick={() => handleExportPdf('OFFICIAL_FORM')}
                        disabled={isExportingPdf}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-start gap-2.5 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                          <FileText className="w-4 h-4 text-amber-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400">
                            2. Khusus Lembar Formulir Resmi KPI
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Hanya tabel parameter kuantitatif, data presensi, sanksi, & kolom tanda tangan.
                          </p>
                        </div>
                      </button>

                      {/* Option 3: Lembar 2 */}
                      <button
                        type="button"
                        onClick={() => handleExportPdf('QUALITATIVE_BARS')}
                        disabled={isExportingPdf}
                        className="w-full text-left p-2 rounded-xl hover:bg-indigo-50/60 dark:hover:bg-indigo-950/40 transition-all flex items-start gap-2.5 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center shrink-0 mt-0.5">
                          <Sparkles className="w-4 h-4 text-indigo-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                            3. Khusus Penerjemah Kualitatif (BARS)
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Persona perilaku kerja, anomali lapangan, peer review, & Action Plan 30-60-90.
                          </p>
                        </div>
                      </button>

                      {/* Option 4: Lembar 3 */}
                      <button
                        type="button"
                        onClick={() => handleExportPdf('WEIGHT_SIMULATION')}
                        disabled={isExportingPdf}
                        className="w-full text-left p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-all flex items-start gap-2.5 group"
                      >
                        <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center shrink-0 mt-0.5">
                          <Calculator className="w-4 h-4 text-emerald-500" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-bold text-slate-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400">
                            4. Khusus Simulasi Bobot Metrik Job Desk
                          </div>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                            Kalkulator bobot SK Direksi, total skor tertimbang (0-100), grade, & arahan manajemen.
                          </p>
                        </div>
                      </button>
                    </div>

                    <div className="px-3 py-2 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 rounded-xl text-[10.5px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                      <span>Staf: <strong className="text-slate-800 dark:text-slate-200">{currentProfile.nama}</strong></span>
                      <span className="font-mono text-[9.5px]">{currentProfile.periodePenilaian}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Action Toolbar: Organized Row */}
          <div className="pt-2 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider mr-1">
              Aksi Cepat:
            </span>

            <button
              onClick={() => setIsQueueManagerModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all border border-amber-400 hover:scale-[1.01]"
              title="Kelola Daftar Penugasan Evaluasi Kinerja (Prioritas Habis Kontrak PKWT)"
            >
              <ClipboardList className="w-3.5 h-3.5 text-slate-950" />
              <span>Antrean Penugasan Manajer</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 text-slate-950 font-mono font-bold">
                {pendingQueueCount} Tugas
              </span>
            </button>

            <button
              onClick={() => setIsShareModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm transition-all border border-indigo-500 hover:scale-[1.01]"
              title="Bagikan Tautan Kuesioner (WhatsApp / URL) ke Atasan atau Rekan Kerja"
            >
              <Share2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Bagikan Link Responden</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-800 text-indigo-100 font-mono font-bold">
                URL / WA
              </span>
            </button>

            <button
              onClick={() => setActiveTab('respondent_self_service')}
              className={`px-3 py-1.5 rounded-xl text-xs font-black flex items-center gap-1.5 shadow-sm transition-all border ${
                activeTab === 'respondent_self_service'
                  ? 'bg-amber-500 text-slate-950 border-amber-400'
                  : 'bg-emerald-600 hover:bg-emerald-500 text-white border-emerald-500'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Input Mandiri Responden</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 text-white font-mono">
                360°
              </span>
            </button>

            <button
              onClick={() => setIsEntryModalOpen(true)}
              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-black flex items-center gap-1.5 shadow-sm transition-all"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Entri / Kalibrasi Data KPI</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-slate-950/20 text-slate-950 font-mono">
                Admin
              </span>
            </button>
          </div>
        </div>

        {/* 4 Main View Switchers */}
        <div className="flex flex-wrap items-center gap-2 pt-1">
          <button
            onClick={() => setActiveTab('official_template')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'official_template'
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/50'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>1. Lembar Formulir Resmi KPI (Template PT Batu Karang)</span>
          </button>

          <button
            onClick={() => setActiveTab('qualitative_synthesis')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'qualitative_synthesis'
                ? 'bg-indigo-600 text-white shadow-sm ring-2 ring-indigo-400/50'
                : 'bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/60 dark:hover:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-800'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-400 animate-pulse" />
            <span>2. Penerjemah Kualitatif &amp; Rekomendasi Eksekutif (Solusi Kelemahan)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-indigo-500/30 text-white font-mono">Baru</span>
          </button>

          <button
            onClick={() => setActiveTab('weight_calculator')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'weight_calculator'
                ? 'bg-slate-800 text-white shadow-sm ring-2 ring-slate-600'
                : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
            }`}
          >
            <Calculator className="w-4 h-4" />
            <span>3. Simulasi Bobot Metrik Job Desk (0-100)</span>
          </button>

          <button
            onClick={() => setActiveTab('respondent_self_service')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'respondent_self_service'
                ? 'bg-amber-500 text-slate-950 shadow-sm ring-2 ring-amber-400/50'
                : 'bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/50 dark:hover:bg-emerald-900/50 text-emerald-800 dark:text-emerald-300 border border-emerald-300/60 dark:border-emerald-800/80'
            }`}
          >
            <UserCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
            <span>4. Jalur Mandiri Responden (Self-Service 360°)</span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-900 dark:text-emerald-200 font-mono font-black">
              Aktif
            </span>
          </button>
        </div>

        {/* Staff Profile Switcher Dropdown & Live Dynamic Indicator */}
        <div className="bg-slate-50 dark:bg-slate-950/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex flex-wrap items-center gap-2.5">
            <User className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
            <span className="font-semibold text-slate-700 dark:text-slate-300">Pilih Staf yang Dinilai:</span>
            <select
              value={selectedStaffNip}
              onChange={(e) => handleStaffChange(e.target.value)}
              className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold text-xs focus:ring-2 focus:ring-amber-500 outline-none max-w-xs sm:max-w-md truncate"
            >
              <optgroup label="Karyawan Menjelang Habis PKWT (Prioritas Perpanjangan)">
                {HR_STAFF_MASTER_DATA.filter(s => s.status.startsWith('PKWT')).map(st => (
                  <option key={st.nip} value={st.nip}>
                    [{st.status}] {st.nama} — {st.nip} ({st.jabatan})
                  </option>
                ))}
              </optgroup>
              <optgroup label="Karyawan Status Tetap (Evaluasi Reguler / Rolling / Promosi)">
                {HR_STAFF_MASTER_DATA.filter(s => s.status === 'TETAP').map(st => (
                  <option key={st.nip} value={st.nip}>
                    [TETAP] {st.nama} — {st.nip} ({st.jabatan})
                  </option>
                ))}
              </optgroup>
            </select>

            {/* Dynamic Index Indicator for Selected Staff */}
            <div className="flex items-center gap-1.5">
              <span className="px-2.5 py-1 rounded-lg bg-amber-500 text-slate-950 font-black font-mono text-xs shadow-xs flex items-center gap-1">
                <Award className="w-3.5 h-3.5" />
                <span>Index: {indexKinerja}</span>
                <span className="font-normal text-[10px] uppercase opacity-90">({getKriteriaFromScore(indexKinerja)})</span>
              </span>

              {/* Status Kontrak Badge */}
              {selectedStaffRecord && (
                <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold border ${
                  selectedStaffRecord.status.startsWith('PKWT')
                    ? 'bg-amber-100 text-amber-900 dark:bg-amber-950/60 dark:text-amber-300 border-amber-300 dark:border-amber-800'
                    : 'bg-blue-100 text-blue-900 dark:bg-blue-950/60 dark:text-blue-300 border-blue-300 dark:border-blue-800'
                }`}>
                  {selectedStaffRecord.status}
                </span>
              )}

              {isCustomEdited && (
                <div className="flex items-center gap-1.5">
                  <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 text-[10px] font-bold border border-emerald-300/40">
                    Kustom Tersimpan
                  </span>
                  <button
                    type="button"
                    onClick={handleResetStaffToDefault}
                    className="text-[10px] font-semibold text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400 underline transition-colors"
                    title="Kembalikan nilai ke standar bawaan pabrik"
                  >
                    Reset Nilai
                  </button>
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 text-slate-500 dark:text-slate-400 text-[11px] shrink-0">
            <span>Periode: <strong className="text-slate-800 dark:text-slate-200">{currentProfile.periodePenilaian}</strong></span>
            <span>&bull;</span>
            <span>Level: <strong className="font-mono text-slate-800 dark:text-slate-200">{currentProfile.level}</strong></span>
            <span>&bull;</span>
            <span>Sekup: <strong className="text-slate-800 dark:text-slate-200">{currentProfile.sekup}</strong></span>
          </div>
        </div>

        {/* Dynamic Toast Feedback when switching staff */}
        {switchToast && (
          <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-amber-950/30 border border-amber-400/40 text-amber-900 dark:text-amber-200 text-xs font-semibold flex items-center justify-between gap-2 animate-fadeIn">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
              <span>{switchToast}</span>
            </div>
            <button
              onClick={() => setSwitchToast(null)}
              className="text-amber-700 hover:text-amber-900 dark:text-amber-300 text-[10px] underline font-bold"
            >
              Tutup
            </button>
          </div>
        )}
      </div>

      {/* =========================================================================
          TAB 1: FORMULIR RESMI KPI 360° (PERSIS TEMPLATE PT BATU KARANG)
          ========================================================================= */}
      {activeTab === 'official_template' && (
        <div className="space-y-6">
          
          {/* Main Printable / Official Sheet Card */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-300 dark:border-slate-800 shadow-md p-5 sm:p-8 space-y-6">
            
            {/* Header Document Template */}
            <div className="border-b-2 border-slate-900 dark:border-slate-700 pb-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 flex items-center justify-center font-mono font-black text-slate-950 text-xl shadow-md border-2 border-amber-400">
                    153
                  </div>
                  <div>
                    <h3 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white font-serif">
                      PT BATU KARANG &ndash; DIVISI PRODUKSI I
                    </h3>
                    <h4 className="text-xs sm:text-sm font-bold tracking-wider text-slate-700 dark:text-slate-300 uppercase">
                      PENILAIAN KINERJA KARYAWAN (KPI)
                    </h4>
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 text-right text-xs">
                  <button
                    onClick={() => setIsEntryModalOpen(true)}
                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-xs transition-all"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Input / Edit Nilai 4 Responden</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleExportPdf('OFFICIAL_FORM')}
                    disabled={isExportingPdf}
                    className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all border border-slate-700 disabled:opacity-50"
                    title="Unduh file PDF khusus Lembar Formulir Resmi KPI ini"
                  >
                    <Download className={`w-3.5 h-3.5 text-amber-400 ${isExportingPdf && exportingTarget === 'OFFICIAL_FORM' ? 'animate-bounce' : ''}`} />
                    <span>{isExportingPdf && exportingTarget === 'OFFICIAL_FORM' ? 'Membuat PDF...' : 'Unduh PDF Formulir Ini'}</span>
                  </button>
                  <span className="inline-block px-2.5 py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 font-mono font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700">
                    DOKUMEN RESMI 360°
                  </span>
                </div>
              </div>

              {/* Identity Matrix Bar */}
              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 border-t border-slate-200 dark:border-slate-800 text-xs">
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">NAMA:</span>
                  <span className="font-bold text-slate-900 dark:text-white uppercase">{currentProfile.nama}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">JABATAN:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{currentProfile.jabatan}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">LEVEL / SEKUP:</span>
                  <span className="font-bold text-slate-900 dark:text-white font-mono">{currentProfile.level} &bull; {currentProfile.sekup}</span>
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 block font-medium">PERIODE PENILAIAN:</span>
                  <span className="font-bold text-amber-600 dark:text-amber-400">{currentProfile.periodePenilaian}</span>
                </div>
              </div>
            </div>

            {/* Template Version Switcher: Option B (16 Lean Industrial Parameters) vs Option A (20 Legacy) */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-3 bg-gradient-to-r from-amber-500/10 via-slate-50 to-slate-100 dark:from-amber-950/20 dark:via-slate-900/60 dark:to-slate-900 rounded-xl border border-amber-300/60 dark:border-amber-800/40">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-1.5">
                    <span>Struktur Formulir KPI 360°:</span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-800 dark:text-amber-300 font-bold border border-amber-500/30">
                      {currentProfile.parameters.length === 16 ? 'OPSI B (16 Poin Industri)' : 'OPSI A (20 Poin Warisan)'}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    {currentProfile.parameters.length === 16 
                      ? 'Format Standar Manufaktur: Dilengkapi K3, 5R, dan Akurasi Zero-Variance Timbangan (Bebas Duplikasi).' 
                      : 'Format Fisik Warisan: Mengikuti 20 item kuesioner lembar cetak lama PT Batu Karang.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <button
                  type="button"
                  onClick={() => handleSwitchTemplate('RECOMMENDED_16')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentProfile.parameters.length === 16
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5 text-slate-950" />
                  <span>Opsi B (16 Poin)</span>
                  <span className="text-[9px] uppercase px-1 rounded bg-amber-950/20 dark:bg-amber-950/40 text-slate-950 dark:text-amber-200 font-black">
                    Rekomendasi
                  </span>
                </button>
                <button
                  type="button"
                  onClick={() => handleSwitchTemplate('LEGACY_20')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                    currentProfile.parameters.length === 20
                      ? 'bg-amber-500 text-slate-950 shadow-sm'
                      : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Opsi A (20 Poin)</span>
                </button>
              </div>
            </div>

            {/* Layout: Left 2 Cols (Scorecard Table) & Right 1 Col (Side Indicators) */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              
              {/* Left Column: Parameter Scorecard Table */}
              <div className="lg:col-span-8 space-y-4">
                
                {/* Category Filter Chips & Calibration Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-1 text-xs">
                  <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
                    <span className="text-[11px] font-semibold text-slate-400 shrink-0">Filter:</span>
                    {['ALL', 'Kedisiplinan', 'Tanggungjawab', 'Sikap', 'Kompetensi'].map(cat => (
                      <button
                        key={cat}
                        onClick={() => setActiveCategoryFilter(cat)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all shrink-0 ${
                          activeCategoryFilter === cat
                            ? 'bg-amber-500 text-slate-950 shadow-xs'
                            : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {cat === 'ALL' ? `Semua Kategori (${currentProfile.parameters.length} Item)` : cat}
                      </button>
                    ))}
                  </div>

                  <button
                    onClick={() => setIsEntryModalOpen(true)}
                    className="text-indigo-600 dark:text-indigo-400 hover:underline font-bold text-[11px] flex items-center gap-1 shrink-0 self-start sm:self-auto"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5" />
                    <span>Kalibrasi Data Perilaku Lapangan</span>
                  </button>
                </div>

                {/* Scorecard Table */}
                <div className="overflow-x-auto rounded-xl border border-slate-300 dark:border-slate-700">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border-b border-slate-300 dark:border-slate-700">
                        <th className="py-2.5 px-3 font-bold border-r border-slate-300 dark:border-slate-700 w-12 text-center">NO</th>
                        <th className="py-2.5 px-3 font-bold border-r border-slate-300 dark:border-slate-700">PARAMETER PENILAIAN KINERJA</th>
                        <th className="py-2.5 px-2 font-bold border-r border-slate-300 dark:border-slate-700 w-16 text-center font-mono">TOTAL (4 Data)</th>
                        <th className="py-2.5 px-2 font-bold border-r border-slate-300 dark:border-slate-700 w-14 text-center font-mono">AVG</th>
                        <th className="py-2.5 px-3 font-bold border-r border-slate-300 dark:border-slate-700 w-20 text-center">KRITERIA</th>
                        <th className="py-2.5 px-2 font-bold text-center w-24">AKSI KUALITATIF</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                      {displayedParams.map((param, idx) => (
                        <tr 
                          key={param.id}
                          className="hover:bg-amber-50/50 dark:hover:bg-slate-800/50 transition-colors"
                        >
                          <td className="py-2 px-3 text-center font-mono font-bold text-slate-500 border-r border-slate-200 dark:border-slate-800">
                            {param.subCategoryNumber}
                          </td>
                          <td className="py-2 px-3 border-r border-slate-200 dark:border-slate-800">
                            <div className="font-semibold text-slate-900 dark:text-slate-100 flex items-center gap-1.5">
                              {param.evaluationAuthority === 'MUTLAK_ATASAN' && (
                                <Crown className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                              )}
                              <span>{param.name}</span>
                            </div>
                            <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                              <span className="text-[10px] text-slate-400 font-mono">
                                Kategori: {param.category}
                              </span>
                              {param.evaluationAuthority === 'MUTLAK_ATASAN' && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 dark:bg-amber-950/80 dark:text-amber-300 border border-amber-300/60" title="Parameter ini dinilai mutlak oleh Atasan Langsung (100% Hak Prerogatif)">
                                  <span>Mutlak Atasan</span>
                                </span>
                              )}
                              {param.evaluationAuthority === 'DATA_SISTEM' && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-bold px-1.5 py-0.2 rounded bg-emerald-100 text-emerald-900 dark:bg-emerald-950/80 dark:text-emerald-300 border border-emerald-300/60" title="Parameter ini disinkronkan dari data presensi/sistem">
                                  <span>Data Sistem</span>
                                </span>
                              )}
                              {(!param.evaluationAuthority || param.evaluationAuthority === 'KOLABORASI_360') && (
                                <span className="inline-flex items-center gap-0.5 text-[9px] font-medium px-1.5 py-0.2 rounded bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200 dark:border-slate-700" title="Dinilai bersama oleh Atasan dan 3 Rekan Kerja">
                                  <span>360° Rekan</span>
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-bold text-slate-700 dark:text-slate-300 border-r border-slate-200 dark:border-slate-800">
                            {param.totalScore.toFixed(2)}
                          </td>
                          <td className="py-2 px-2 text-center font-mono font-black text-indigo-600 dark:text-indigo-400 border-r border-slate-200 dark:border-slate-800">
                            {param.avgScore.toFixed(2)}
                          </td>
                          <td className="py-2 px-3 text-center border-r border-slate-200 dark:border-slate-800">
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300/40">
                              {param.kriteria}
                            </span>
                          </td>
                          <td className="py-2 px-2 text-center">
                            <button
                              onClick={() => setSelectedBarsParam(param)}
                              className="px-2 py-1 rounded bg-slate-100 hover:bg-indigo-50 dark:bg-slate-800 dark:hover:bg-indigo-950 text-indigo-600 dark:text-indigo-300 border border-slate-200 dark:border-slate-700 text-[10px] font-medium transition-colors flex items-center justify-center gap-1 mx-auto"
                              title="Lihat makna perilaku kualitatif (BARS)"
                            >
                              <Info className="w-3 h-3 text-indigo-500" />
                              <span>Arti Angka</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot className="bg-slate-50 dark:bg-slate-800/80 font-bold border-t-2 border-slate-300 dark:border-slate-700 text-xs">
                      <tr>
                        <td colSpan={2} className="py-2.5 px-3 text-right uppercase border-r border-slate-300 dark:border-slate-700">
                          Jumlah Skor Total
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-black text-slate-900 dark:text-white border-r border-slate-300 dark:border-slate-700">
                          {totalScoreSum.toFixed(2)}
                        </td>
                        <td className="py-2.5 px-2 text-center font-mono font-black text-indigo-600 dark:text-indigo-400 border-r border-slate-300 dark:border-slate-700">
                          {avgScoreCalc.toFixed(2)}
                        </td>
                        <td colSpan={2} className="py-2.5 px-3 text-center text-emerald-700 dark:text-emerald-400 font-bold">
                          INDEX KINERJA: {indexKinerja} ({getKriteriaFromScore(indexKinerja)})
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>

                {/* Quick Hint */}
                <div className="flex items-center gap-2 p-2.5 rounded-xl bg-indigo-50/70 dark:bg-indigo-950/40 border border-indigo-200/60 dark:border-indigo-800/60 text-xs text-indigo-900 dark:text-indigo-300">
                  <HelpCircle className="w-4 h-4 text-indigo-500 shrink-0" />
                  <span>
                    Klik tombol <strong>"Arti Angka"</strong> pada setiap baris untuk melihat deskripsi perilaku nyata (*Behaviorally Anchored Rating Scale*) di pabrik.
                  </span>
                </div>
              </div>

              {/* Right Column: Reference Indicators, Sanctions & Attendance */}
              <div className="lg:col-span-4 space-y-4">
                
                {/* 1. Indikator Skala KPI */}
                <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5 flex items-center justify-between">
                    <span>Indikator KPI:</span>
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                  </h5>
                  <div className="space-y-1 text-[11px] font-mono">
                    <div className={`flex justify-between py-0.5 px-1.5 rounded transition-all ${indexKinerja <= 1.0 ? 'bg-red-100 dark:bg-red-950/60 border border-red-300 font-bold' : ''}`}>
                      <span className={indexKinerja <= 1.0 ? "font-bold text-red-800 dark:text-red-300" : "text-slate-500"}>a. 0.0 &ndash; 1.0</span>
                      <span className="font-bold text-red-600">Sangat Kurang {indexKinerja <= 1.0 && '(Posisi Saat Ini)'}</span>
                    </div>
                    <div className={`flex justify-between py-0.5 px-1.5 rounded transition-all ${indexKinerja > 1.0 && indexKinerja <= 2.0 ? 'bg-orange-100 dark:bg-orange-950/60 border border-orange-300 font-bold' : ''}`}>
                      <span className={indexKinerja > 1.0 && indexKinerja <= 2.0 ? "font-bold text-orange-800 dark:text-orange-300" : "text-slate-500"}>b. 1.1 &ndash; 2.0</span>
                      <span className="font-bold text-orange-600">Kurang {indexKinerja > 1.0 && indexKinerja <= 2.0 && '(Posisi Saat Ini)'}</span>
                    </div>
                    <div className={`flex justify-between py-0.5 px-1.5 rounded transition-all ${indexKinerja > 2.0 && indexKinerja <= 3.0 ? 'bg-amber-100 dark:bg-amber-950/60 border border-amber-300 font-bold' : ''}`}>
                      <span className={indexKinerja > 2.0 && indexKinerja <= 3.0 ? "font-bold text-amber-800 dark:text-amber-300" : "text-slate-500"}>c. 2.1 &ndash; 3.0</span>
                      <span className="font-bold text-amber-600">Cukup {indexKinerja > 2.0 && indexKinerja <= 3.0 && '(Posisi Saat Ini)'}</span>
                    </div>
                    <div className={`flex justify-between py-0.5 px-1.5 rounded transition-all ${indexKinerja > 3.0 && indexKinerja <= 4.0 ? 'bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 font-bold' : ''}`}>
                      <span className={indexKinerja > 3.0 && indexKinerja <= 4.0 ? "font-bold text-emerald-800 dark:text-emerald-300" : "text-slate-500"}>d. 3.1 &ndash; 4.0</span>
                      <span className="font-bold text-emerald-800 dark:text-emerald-300">Baik {indexKinerja > 3.0 && indexKinerja <= 4.0 && '(Posisi Saat Ini)'}</span>
                    </div>
                    <div className={`flex justify-between py-0.5 px-1.5 rounded transition-all ${indexKinerja > 4.0 ? 'bg-blue-100 dark:bg-blue-950/60 border border-blue-300 font-bold' : ''}`}>
                      <span className={indexKinerja > 4.0 ? "font-bold text-blue-800 dark:text-blue-300" : "text-slate-500"}>e. 4.1 &ndash; 5.0</span>
                      <span className="font-bold text-blue-600">Sangat Baik {indexKinerja > 4.0 && '(Posisi Saat Ini)'}</span>
                    </div>
                  </div>
                </div>

                {/* 2. Sanksi Administratif (Anomali Alert) */}
                <div className="bg-red-50 dark:bg-red-950/40 p-4 rounded-xl border border-red-200 dark:border-red-900/60 space-y-2 text-xs">
                  <h5 className="font-bold text-red-800 dark:text-red-300 uppercase text-[11px] tracking-wider border-b border-red-200 dark:border-red-900/60 pb-1.5 flex items-center justify-between">
                    <span>Sanksi Administratif:</span>
                    <AlertTriangle className="w-3.5 h-3.5 text-red-600 animate-pulse" />
                  </h5>
                  {currentProfile.sanksiAdministratif.length > 0 ? (
                    <div className="space-y-1.5">
                      {currentProfile.sanksiAdministratif.map((sanksi, i) => (
                        <div key={i} className="text-[11px] font-semibold text-red-700 dark:text-red-300 bg-red-100/80 dark:bg-red-900/40 p-2 rounded-lg border border-red-200 dark:border-red-800">
                          &bull; {sanksi}
                        </div>
                      ))}
                      {currentProfile.nip === 'BK-PP1-025' && (
                        <p className="text-[10px] text-red-600/90 dark:text-red-400 italic">
                          Catatan: Insiden penimbangan cengkeh ini bertolak belakang dengan nilai rekan kerja yang memberi skor 3.88 ("Baik").
                        </p>
                      )}
                    </div>
                  ) : (
                    <span className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Nihil Sanksi (Catatan Disiplin Bersih)</span>
                    </span>
                  )}
                </div>

                {/* 3. Catatan Presensi Riil */}
                <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-1.5">
                    <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider">
                      Catatan Presensi:
                    </h5>
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-300">
                      {currentProfile.catatanPresensi.persentaseKehadiran}%
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 dark:text-slate-400">
                    Periode: {currentProfile.catatanPresensi.periode}
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 font-mono text-[11px] pt-1">
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block text-[9px]">ALPHA:</span>
                      <strong>{currentProfile.catatanPresensi.alpha}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block text-[9px]">IJIN:</span>
                      <strong>&plusmn; {currentProfile.catatanPresensi.ijinMenit} Menit</strong>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block text-[9px]">SAKIT:</span>
                      <strong>{currentProfile.catatanPresensi.sakit}</strong>
                    </div>
                    <div className="p-1.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700">
                      <span className="text-slate-400 block text-[9px]">PULANG AWAL:</span>
                      <strong>&plusmn; {currentProfile.catatanPresensi.pulangAwalMenit} Menit</strong>
                    </div>
                  </div>
                </div>

                {/* 4. Responden Penilaian (4 Rekan Kerja) */}
                <div className="bg-slate-50 dark:bg-slate-800/70 p-4 rounded-xl border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                  <h5 className="font-bold text-slate-900 dark:text-white uppercase text-[11px] tracking-wider border-b border-slate-200 dark:border-slate-700 pb-1.5 flex items-center justify-between">
                    <span>Responden Penilai:</span>
                    <Users className="w-3.5 h-3.5 text-slate-500" />
                  </h5>
                  <div className="space-y-1">
                    {currentProfile.responden.map((resp, i) => (
                      <div key={i} className="flex items-center gap-2 text-[11px] text-slate-700 dark:text-slate-300">
                        <span className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-medium">{resp}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom Section: PENILAIAN REKAN KERJA (PEER REVIEW 360°) */}
            <div className="border-t-2 border-slate-300 dark:border-slate-700 pt-5 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h4 className="text-sm font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                    <span>PENILAIAN REKAN KERJA (CATATAN KUALITATIF OPERASIONAL)</span>
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Catatan naratif rekan kerja yang memberikan konteks nyata di balik angka skor kuantitatif.
                  </p>
                </div>

                <button
                  onClick={() => setActiveTab('qualitative_synthesis')}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
                >
                  <span>Buka Analisis Kualitatif Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Grid 2 Cols: Hubungan Kerja Langsung & Tidak Langsung */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                
                {/* A. Hubungan Kerja Langsung */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="font-bold text-slate-900 dark:text-white uppercase text-[11px] border-b border-slate-200 dark:border-slate-700 pb-1.5 flex items-center justify-between">
                    <span>A. Hubungan Kerja Langsung</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold font-mono">2 Responden</span>
                  </div>

                  {currentProfile.peerFeedbacks.filter(f => f.relationType === 'LANGSUNG').map(fb => (
                    <div key={fb.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                        <span>{fb.respondentName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{fb.roleInFactory}</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Kekuatan:</strong> {fb.positiveFeedback}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span><strong>Perlu Pembenahan:</strong> {fb.improvementFeedback}</span>
                        </div>
                        {fb.recommendation && (
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                            Usulan: {fb.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                {/* B. Hubungan Kerja Tidak Langsung */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
                  <div className="font-bold text-slate-900 dark:text-white uppercase text-[11px] border-b border-slate-200 dark:border-slate-700 pb-1.5 flex items-center justify-between">
                    <span>B. Hubungan Kerja Tidak Langsung</span>
                    <span className="text-[10px] text-indigo-600 dark:text-indigo-400 font-semibold font-mono">2 Responden</span>
                  </div>

                  {currentProfile.peerFeedbacks.filter(f => f.relationType === 'TIDAK_LANGSUNG').map(fb => (
                    <div key={fb.id} className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 space-y-1.5">
                      <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100 text-[11px]">
                        <span>{fb.respondentName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">{fb.roleInFactory}</span>
                      </div>
                      <div className="space-y-1 text-[11px] text-slate-600 dark:text-slate-300">
                        <div className="flex items-start gap-1.5">
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                          <span><strong>Kekuatan:</strong> {fb.positiveFeedback}</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                          <span><strong>Perlu Pembenahan:</strong> {fb.improvementFeedback}</span>
                        </div>
                        {fb.recommendation && (
                          <div className="text-[10px] text-indigo-600 dark:text-indigo-400 italic pt-1 border-t border-slate-100 dark:border-slate-800">
                            Usulan: {fb.recommendation}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

              </div>
            </div>

          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 2: PENERJEMAH KUALITATIF & REKOMENDASI EKSEKUTIF (SOLUSI KELEMAHAN)
          ========================================================================= */}
      {activeTab === 'qualitative_synthesis' && (
        <div className="space-y-6">
          
          {/* Header Explanation Banner: Why Numbers Need Words */}
          <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-amber-950 p-6 rounded-2xl border border-indigo-500/30 text-white shadow-lg space-y-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold text-[10px] border border-amber-500/40 uppercase tracking-wider font-mono">
                Solusi Kelemahan Data Kuantitatif
              </span>
              <span className="text-xs text-slate-300 font-medium">
                Penerjemah Narasi Otomatis (Narrative Synthesis Engine)
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-400" />
                  <span>Dari Skor Kuantitatif Menjadi Penjelasan Kualitatif yang Aplikatif</span>
                </h3>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed mt-1">
                  Banyak orang kesulitan mencerna apa arti skor <strong>3,58</strong> atau <strong>3,38</strong>. 
                  Modul ini secara otomatis mengekstrak seluruh angka kuantitatif, catatan sanksi penimbangan, dan presensi riil menjadi 
                  <strong> narasi kepribadian kerja</strong>, <strong>identifikasi bias rekan kerja (*Halo Effect*)</strong>, 
                  serta <strong>rencana pembinaan terukur (30-60-90 hari)</strong> untuk manajemen.
                </p>
              </div>

              <button
                type="button"
                onClick={() => handleExportPdf('QUALITATIVE_BARS')}
                disabled={isExportingPdf}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-md transition-all shrink-0 self-start sm:self-center disabled:opacity-50"
                title="Unduh PDF khusus Lembar 2 Penerjemah Kualitatif BARS & Rekomendasi Eksekutif"
              >
                <Download className={`w-3.5 h-3.5 text-slate-950 ${isExportingPdf && exportingTarget === 'QUALITATIVE_BARS' ? 'animate-bounce' : ''}`} />
                <span>{isExportingPdf && exportingTarget === 'QUALITATIVE_BARS' ? 'Membuat PDF...' : 'Unduh PDF Lembar BARS'}</span>
              </button>
            </div>
          </div>

          {/* Persona & Radar Visual Analysis Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 7 Cols: Behavioral Persona Summary & Top Strengths/Weaknesses */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Persona Profile Card */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-500" />
                    <span>Profil Persona Performa Karyawan</span>
                  </h4>
                  <span className="text-[11px] font-mono font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800">
                    {currentProfile.nama}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-sans bg-slate-50 dark:bg-slate-950/50 p-4 rounded-xl border border-slate-200 dark:border-slate-800/80">
                  {synthesis.personaSummary}
                </p>
              </div>

              {/* Anomaly & Discrepancy Alert */}
              {synthesis.discrepancyAlert.hasAlert && (
                <div className="bg-red-50 dark:bg-red-950/40 p-5 rounded-2xl border-2 border-red-200 dark:border-red-900/60 space-y-2.5">
                  <div className="flex items-center gap-2 text-red-800 dark:text-red-300 font-bold text-xs uppercase tracking-wide">
                    <AlertTriangle className="w-4 h-4 text-red-600 animate-pulse" />
                    <span>{synthesis.discrepancyAlert.title}</span>
                  </div>
                  <p className="text-xs text-red-700 dark:text-red-300 leading-relaxed">
                    {synthesis.discrepancyAlert.description}
                  </p>
                  <div className="p-3 rounded-xl bg-white dark:bg-slate-900 border border-red-200 dark:border-red-900 text-xs text-slate-800 dark:text-slate-200 space-y-1">
                    <strong className="text-red-700 dark:text-red-400 block text-[11px]">Tindakan Manajerial yang Disarankan:</strong>
                    <span>{synthesis.discrepancyAlert.actionNeeded}</span>
                  </div>
                </div>
              )}

              {/* Strengths & Blindspots Two Columns */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                
                {/* 3 Top Strengths */}
                <div className="bg-emerald-50/60 dark:bg-emerald-950/30 p-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-emerald-800 dark:text-emerald-300 font-bold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>3 Kekuatan Terbesar (Keep):</span>
                  </div>
                  <div className="space-y-2">
                    {synthesis.topStrengths.map((st, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-emerald-200/80 dark:border-emerald-900/40 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                          <span>{st.title}</span>
                          <span className="font-mono text-emerald-600 dark:text-emerald-400 text-[11px]">
                            {st.score.toFixed(2)} / 5.00
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {st.qualitativeReason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* 3 Development Needs */}
                <div className="bg-amber-50/60 dark:bg-amber-950/30 p-4 rounded-2xl border border-amber-200 dark:border-amber-800/60 space-y-3">
                  <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-xs">
                    <Target className="w-4 h-4 text-amber-600" />
                    <span>3 Area Pembenahan (Improve):</span>
                  </div>
                  <div className="space-y-2">
                    {synthesis.developmentAreas.map((dev, i) => (
                      <div key={i} className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200/80 dark:border-amber-900/40 text-xs space-y-1">
                        <div className="flex items-center justify-between font-bold text-slate-900 dark:text-slate-100">
                          <span>{dev.title}</span>
                          <span className="font-mono text-amber-600 dark:text-amber-400 text-[11px]">
                            {dev.score.toFixed(2)} / 5.00
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-snug">
                          {dev.qualitativeReason}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

            </div>

            {/* Right 5 Cols: Visual Radar Chart & Domain Breakdown */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Radar Chart SVG Widget */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Compass className="w-4 h-4 text-indigo-500" />
                    <span>Visualisasi Radar 4 Pilar Kinerja</span>
                  </h4>
                  <span className="text-[10px] text-slate-400 font-mono">Skala 1.0 &ndash; 5.0</span>
                </div>

                {/* SVG Visual Representation of the 4 Domains */}
                <div className="relative flex items-center justify-center py-2">
                  <svg viewBox="0 0 280 260" className="w-full max-w-[260px] h-auto drop-shadow-sm">
                    {/* Concentric Polygons / Circles */}
                    {[1, 2, 3, 4, 5].map((lvl) => {
                      const r = (lvl / 5) * 90;
                      return (
                        <circle
                          key={lvl}
                          cx="140"
                          cy="130"
                          r={r}
                          fill="none"
                          stroke="currentColor"
                          className="text-slate-200 dark:text-slate-800"
                          strokeDasharray={lvl === 5 ? 'none' : '3,3'}
                          strokeWidth="1"
                        />
                      );
                    })}

                    {/* Axes lines (4 Axes: Top, Right, Bottom, Left) */}
                    <line x1="140" y1="40" x2="140" y2="220" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1" />
                    <line x1="50" y1="130" x2="230" y2="130" stroke="currentColor" className="text-slate-300 dark:text-slate-700" strokeWidth="1" />

                    {/*
                      4 Domains Coordinates:
                      Center = (140, 130)
                      1. Top: Kedisiplinan (Avg: 3.88) -> y = 130 - (3.88/5)*90 = 130 - 69.84 = 60.16 -> (140, 60.16)
                      2. Right: Tanggungjawab (Avg: 3.61) -> x = 140 + (3.61/5)*90 = 140 + 64.98 = 204.98 -> (205, 130)
                      3. Bottom: Sikap (Avg: 3.55) -> y = 130 + (3.55/5)*90 = 130 + 63.9 = 193.9 -> (140, 194)
                      4. Left: Kompetensi (Avg: 3.44) -> x = 140 - (3.44/5)*90 = 140 - 61.92 = 78.08 -> (78, 130)
                    */}
                    <polygon
                      points="140,60 205,130 140,194 78,130"
                      className="fill-indigo-500/25 stroke-indigo-600 dark:fill-indigo-500/35 dark:stroke-indigo-400 transition-all duration-500"
                      strokeWidth="2.5"
                    />

                    {/* Points on radar */}
                    <circle cx="140" cy="60" r="4.5" className="fill-amber-500 stroke-white stroke-2" />
                    <circle cx="205" cy="130" r="4.5" className="fill-amber-500 stroke-white stroke-2" />
                    <circle cx="140" cy="194" r="4.5" className="fill-amber-500 stroke-white stroke-2" />
                    <circle cx="78" cy="130" r="4.5" className="fill-amber-500 stroke-white stroke-2" />

                    {/* Labels */}
                    <text x="140" y="25" textAnchor="middle" className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200">
                      Kedisiplinan (3.88)
                    </text>
                    <text x="240" y="133" textAnchor="start" className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200">
                      Tanggungjawab (3.61)
                    </text>
                    <text x="140" y="240" textAnchor="middle" className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200">
                      Sikap (3.55)
                    </text>
                    <text x="40" y="133" textAnchor="end" className="text-[10px] font-bold fill-slate-800 dark:fill-slate-200">
                      Kompetensi (3.44)
                    </text>
                  </svg>
                </div>

                {/* Domain Score Breakdown List */}
                <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800 text-xs">
                  {domainAverages.map((dom, i) => (
                    <div key={i} className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60">
                      <span className="font-semibold text-slate-800 dark:text-slate-200">{dom.category}:</span>
                      <div className="flex items-center gap-2">
                        <div className="w-24 h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full ${
                              dom.avg >= 3.8 ? 'bg-emerald-500' :
                              dom.avg >= 3.5 ? 'bg-indigo-500' :
                              'bg-amber-500'
                            }`}
                            style={{ width: `${(dom.avg / 5) * 100}%` }}
                          />
                        </div>
                        <span className="font-mono font-bold text-slate-900 dark:text-white w-10 text-right">
                          {dom.avg.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-[10px] text-slate-400 italic">
                  *Visualisasi menunjukkan tonjolan ke arah kedisiplinan absensi, namun menyempit pada domain kompetensi penanganan masalah di bawah tekanan tinggi.
                </p>
              </div>

              {/* Coaching Action Plan (30-60-90 Days) */}
              <div className="bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-2">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <BookOpen className="w-4 h-4 text-amber-500" />
                    <span>Rencana Aksi Pembinaan (30-60-90 Hari)</span>
                  </h4>
                </div>

                <div className="space-y-2.5">
                  {synthesis.coachingActionPlan.map((plan, i) => (
                    <div key={i} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 text-xs space-y-1">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-indigo-600 dark:text-indigo-400">{plan.focusArea}</span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/10 text-amber-700 dark:text-amber-300 font-semibold">
                          {plan.targetTimeline}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-700 dark:text-slate-300">
                        {plan.concreteStep}
                      </p>
                      <div className="text-[10px] text-slate-400">
                        Mentor: <strong>{plan.mentor}</strong>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>

        </div>
      )}

      {/* =========================================================================
          TAB 3: SIMULASI BOBOT METRIK JOB DESK (FITUR ASLI YANG DIPERTAHANKAN)
          ========================================================================= */}
      {activeTab === 'weight_calculator' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100 dark:border-slate-800">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800 uppercase tracking-wide">
                    Evaluator Metrik Terukur
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    SK Direksi No: 01/AS/DRK/BKR/VII/2024
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
                  Kalkulator Penilaian Bobot KPI Staf (0 &ndash; 100)
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 max-w-3xl">
                  Simulasikan nilai target vs realisasi berdasarkan bobot persentase metrik resmi dari job description divisi.
                </p>
              </div>

              {/* Action Buttons & Mode Switcher */}
              <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
                <button
                  type="button"
                  onClick={() => handleExportPdf('WEIGHT_SIMULATION')}
                  disabled={isExportingPdf}
                  className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-all border border-slate-700 disabled:opacity-50"
                  title="Unduh PDF khusus Hasil Simulasi Bobot Metrik Job Desk ini"
                >
                  <Download className={`w-3.5 h-3.5 text-emerald-400 ${isExportingPdf && exportingTarget === 'WEIGHT_SIMULATION' ? 'animate-bounce' : ''}`} />
                  <span>{isExportingPdf && exportingTarget === 'WEIGHT_SIMULATION' ? 'Membuat PDF...' : 'Unduh PDF Simulasi'}</span>
                </button>

                {/* Mode Switcher */}
                <div className="flex items-center gap-2 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                  <button
                    onClick={() => setSelectionMode('individual')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectionMode === 'individual'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <User className="w-3.5 h-3.5" />
                    <span>Pilih Per Staf</span>
                  </button>
                  <button
                    onClick={() => setSelectionMode('role')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                      selectionMode === 'role'
                        ? 'bg-amber-500 text-slate-950 shadow-xs'
                        : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
                    }`}
                  >
                    <Users className="w-3.5 h-3.5" />
                    <span>Pilih Per Jabatan</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Metrics List & Result Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
              
              {/* Left 2 Cols: Sliders */}
              <div className="lg:col-span-2 space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-amber-600" />
                    Input Skor Pencapaian ({roleMetrics.length} Metrik Terdaftar)
                  </h4>
                  <button
                    onClick={() => {
                      const reset: Record<string, number> = {};
                      roleMetrics.forEach(m => reset[m.id] = 100);
                      setMetricScores(reset);
                    }}
                    className="text-[11px] text-amber-700 dark:text-amber-400 hover:underline font-semibold flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Setel 100
                  </button>
                </div>

                <div className="space-y-3">
                  {roleMetrics.map(metric => {
                    const currentScore = metricScores[metric.id] ?? 90;
                    const weighted = ((currentScore * metric.weight) / 100).toFixed(2);
                    return (
                      <div key={metric.id} className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white">{metric.name}</span>
                            <span className="text-slate-400 ml-2 font-mono text-[10px]">({metric.code} &bull; Bobot: {metric.weight}%)</span>
                          </div>
                          <div className="flex items-center gap-2 font-mono">
                            <span className="text-slate-400 text-[11px]">Nilai:</span>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              value={currentScore}
                              onChange={(e) => handleScoreChange(metric.id, Number(e.target.value))}
                              className="w-14 px-1.5 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 text-center font-bold"
                            />
                            <span className="font-bold text-indigo-600 dark:text-indigo-400 w-12 text-right">
                              +{weighted}
                            </span>
                          </div>
                        </div>

                        <input
                          type="range"
                          min="0"
                          max="100"
                          value={currentScore}
                          onChange={(e) => handleScoreChange(metric.id, Number(e.target.value))}
                          className="w-full accent-amber-500 h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg cursor-pointer"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Right Col: Scorecard Result Box */}
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-slate-900 via-slate-800 to-amber-950 p-6 rounded-2xl border border-slate-700 text-white shadow-lg space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">
                      Hasil Simulasi Bobot
                    </span>
                    <Award className="w-5 h-5 text-amber-400" />
                  </div>

                  <div className="text-center py-2">
                    <div className="text-[11px] text-slate-300 uppercase tracking-wider">
                      Total Skor Tertimbang
                    </div>
                    <div className="text-5xl font-black font-mono tracking-tight text-white mt-1">
                      {totalWeightedScore}
                    </div>
                    <div className="text-xs text-slate-400 mt-1">dari skala maksimal 100.00</div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-slate-800/80 border border-slate-700 flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-medium">Predikat Kelayakan:</div>
                      <div className="text-sm font-bold text-amber-300 mt-0.5">{grade}</div>
                    </div>
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-black text-sm ${
                      totalWeightedScore >= 92 ? 'bg-emerald-500 text-slate-950' :
                      totalWeightedScore >= 80 ? 'bg-blue-500 text-white' :
                      totalWeightedScore >= 68 ? 'bg-amber-500 text-slate-950' :
                      'bg-red-500 text-white'
                    }`}>
                      {grade.charAt(0)}
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-200/90 leading-relaxed space-y-1">
                    <div className="font-bold text-amber-400 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Rekomendasi Manajerial:</span>
                    </div>
                    <p className="text-[11px] text-slate-300">
                      {actionAdvice}
                    </p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          TAB 4: PORTAL PENGISIAN MANDIRI RESPONDEN (SELF-SERVICE 360°)
          ========================================================================= */}
      {activeTab === 'respondent_self_service' && (
        <KpiRespondentSelfService
          initialStaffNip={selectedStaffNip}
          onEvaluationSubmitted={(updatedProfile) => {
            setCurrentProfile(updatedProfile);
            setSelectedStaffNip(updatedProfile.nip);
          }}
          onNavigateToOfficialSheet={() => setActiveTab('official_template')}
          onOpenShareModal={() => setIsShareModalOpen(true)}
        />
      )}

      {/* =========================================================================
          MODAL: BARS (BEHAVIORALLY ANCHORED RATING SCALE) DESCRIPTOR
          ========================================================================= */}
      {selectedBarsParam && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 max-w-2xl w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold font-mono">
                  {selectedBarsParam.subCategoryNumber}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    Arti Kualitatif: {selectedBarsParam.name}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Kategori: {selectedBarsParam.category} &bull; Nilai Saat Ini: <strong className="font-mono text-indigo-600 dark:text-indigo-400">{selectedBarsParam.avgScore.toFixed(2)} / 5.00</strong>
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedBarsParam(null)}
                className="w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 flex items-center justify-center text-sm font-bold"
              >
                &times;
              </button>
            </div>

            <div className="space-y-2 text-xs">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                Tabel di bawah menjelaskan arti <strong>perilaku konkret di lantai pabrik</strong> untuk masing-masing level skor, 
                agar penilai tidak sekadar memberi nilai 1–5 secara subjektif:
              </p>

              {/* BARS Levels 1 - 5 */}
              <div className="space-y-2 pt-2">
                
                {/* Level 5 */}
                <div className={`p-3 rounded-xl border text-xs ${
                  selectedBarsParam.avgScore >= 4.1 
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-300 dark:border-blue-700 font-semibold' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between font-bold text-blue-700 dark:text-blue-300 mb-1">
                    <span>Level 5: Sangat Baik (4.1 &ndash; 5.0)</span>
                    <span className="text-[10px] font-mono">Performa Istimewa</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    {selectedBarsParam.barsDescription.level5}
                  </p>
                </div>

                {/* Level 4 (Active in current evaluation) */}
                <div className={`p-3 rounded-xl border text-xs ${
                  selectedBarsParam.avgScore >= 3.1 && selectedBarsParam.avgScore <= 4.0
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-400 dark:border-emerald-700 ring-2 ring-emerald-500/20' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between font-bold text-emerald-800 dark:text-emerald-300 mb-1">
                    <span>Level 4: Baik (3.1 &ndash; 4.0) &mdash; [Posisi Penilaian Saat Ini]</span>
                    <span className="text-[10px] font-mono">Standar Operasional</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    {selectedBarsParam.barsDescription.level4}
                  </p>
                </div>

                {/* Level 3 */}
                <div className={`p-3 rounded-xl border text-xs ${
                  selectedBarsParam.avgScore >= 2.1 && selectedBarsParam.avgScore <= 3.0
                    ? 'bg-amber-50 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700' 
                    : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-800'
                }`}>
                  <div className="flex items-center justify-between font-bold text-amber-800 dark:text-amber-300 mb-1">
                    <span>Level 3: Cukup (2.1 &ndash; 3.0)</span>
                    <span className="text-[10px] font-mono">Perlu Supervisi</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    {selectedBarsParam.barsDescription.level3}
                  </p>
                </div>

                {/* Level 2 */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-orange-700 dark:text-orange-400 mb-1">
                    <span>Level 2: Kurang (1.1 &ndash; 2.0)</span>
                    <span className="text-[10px] font-mono">Banyak Kendala</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    {selectedBarsParam.barsDescription.level2}
                  </p>
                </div>

                {/* Level 1 */}
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 text-xs">
                  <div className="flex items-center justify-between font-bold text-red-700 dark:text-red-400 mb-1">
                    <span>Level 1: Sangat Kurang (0.0 &ndash; 1.0)</span>
                    <span className="text-[10px] font-mono">Pelanggaran / Fatal</span>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">
                    {selectedBarsParam.barsDescription.level1}
                  </p>
                </div>

              </div>
            </div>

            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
              <button
                onClick={() => setSelectedBarsParam(null)}
                className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition-all"
              >
                Tutup Panduan BARS
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Interactive 360 Data Entry & Reality Calibration Modal */}
      {isEntryModalOpen && (
        <KpiDataEntryModal
          isOpen={isEntryModalOpen}
          onClose={() => setIsEntryModalOpen(false)}
          currentProfile={currentProfile}
          onSaveProfile={handleSaveProfileFromModal}
        />
      )}

      {/* Deep Link URL Sharing Modal for Atasan & Rekan Responden */}
      {isShareModalOpen && (
        <KpiShareLinkModal
          isOpen={isShareModalOpen}
          onClose={() => setIsShareModalOpen(false)}
          defaultStaffNip={selectedStaffNip}
          defaultEvaluatorType="ATASAN_LANGSUNG"
        />
      )}

      {/* Manager Evaluation Queue & PKWT Expiry Assignment Modal */}
      {isQueueManagerModalOpen && (
        <KpiEvaluationQueueManagerModal
          isOpen={isQueueManagerModalOpen}
          onClose={() => setIsQueueManagerModalOpen(false)}
          onSelectStaffForEvaluation={(nip) => {
            handleStaffChange(nip);
            setActiveTab('respondent_self_service');
          }}
        />
      )}

    </div>
  );
};
