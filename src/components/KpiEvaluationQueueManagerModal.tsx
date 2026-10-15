import React, { useState, useMemo } from 'react';
import { HR_STAFF_MASTER_DATA, HrStaffRecord } from '../data/hrStaffMasterData';
import { 
  EvaluationQueueItem, 
  getEvaluationQueue, 
  saveEvaluationQueue, 
  addEvaluationQueueItem,
  resetEvaluationQueueToFactory,
  EmploymentStatusType,
  EvaluationReason,
  ManagerAssignerRole
} from '../data/kpiEvaluationQueueData';
import { 
  ClipboardList, 
  Plus, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  UserCheck, 
  Crown, 
  Users, 
  X, 
  Share2, 
  Copy, 
  Check, 
  Trash2, 
  RotateCcw,
  ShieldCheck,
  Calendar,
  Briefcase,
  FileText,
  Sparkles,
  Info
} from 'lucide-react';

interface KpiEvaluationQueueManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectStaffForEvaluation: (nip: string) => void;
}

export const KpiEvaluationQueueManagerModal: React.FC<KpiEvaluationQueueManagerModalProps> = ({
  isOpen,
  onClose,
  onSelectStaffForEvaluation
}) => {
  const [queue, setQueue] = useState<EvaluationQueueItem[]>(() => getEvaluationQueue());
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'PKWT' | 'TETAP' | 'PENDING' | 'COMPLETED'>('ALL');
  const [isAddFormOpen, setIsAddFormOpen] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // New assignment form state
  const [newStaffNip, setNewStaffNip] = useState<string>('BK-PP1-020'); // Surya Ning Sasi (PKWT 4)
  const [newReason, setNewReason] = useState<EvaluationReason>('PERPANJANGAN_PKWT');
  const [newAssignedBy, setNewAssignedBy] = useState<ManagerAssignerRole>('Manajer Operasional Produksi I');
  const [newDeadline, setNewDeadline] = useState<string>('15 November 2026');
  const [newDaysRemaining, setNewDaysRemaining] = useState<number>(30);
  const [newAtasanNip, setNewAtasanNip] = useState<string>('BK-PP1-021');
  const [newRekanNip, setNewRekanNip] = useState<string>('BK-PP1-004');
  const [newNotes, setNewNotes] = useState<string>('Evaluasi kelayakan kerja operasional menjelang masa peninjauan.');

  const refreshQueue = () => {
    setQueue(getEvaluationQueue());
  };

  // Filtered queue items
  const filteredItems = useMemo(() => {
    return queue.filter(item => {
      if (activeTabFilter === 'PKWT') return item.employmentStatus.startsWith('PKWT');
      if (activeTabFilter === 'TETAP') return item.employmentStatus === 'TETAP';
      if (activeTabFilter === 'PENDING') return item.status !== 'COMPLETED';
      if (activeTabFilter === 'COMPLETED') return item.status === 'COMPLETED';
      return true;
    });
  }, [queue, activeTabFilter]);

  // Statistics
  const stats = useMemo(() => {
    const total = queue.length;
    const pkwtCount = queue.filter(q => q.employmentStatus.startsWith('PKWT')).length;
    const criticalCount = queue.filter(q => q.urgencyLevel === 'CRITICAL' && q.status !== 'COMPLETED').length;
    const completedCount = queue.filter(q => q.status === 'COMPLETED').length;
    const pendingCount = total - completedCount;
    return { total, pkwtCount, criticalCount, completedCount, pendingCount };
  }, [queue]);

  // Handle Add Item
  const handleAddNewAssignment = (e: React.FormEvent) => {
    e.preventDefault();
    const staff = HR_STAFF_MASTER_DATA.find(s => s.nip === newStaffNip);
    if (!staff) return;

    const atasan = HR_STAFF_MASTER_DATA.find(s => s.nip === newAtasanNip);
    const rekan = HR_STAFF_MASTER_DATA.find(s => s.nip === newRekanNip);

    let assignerName = 'Lalu Mahendra Ali Akbar';
    if (newAssignedBy === 'Kepala Administrasi 1') assignerName = 'Agustin Wulandari';
    if (newAssignedBy === 'Manajer HRD') assignerName = 'Tim HRD Korporat';

    const newItem: EvaluationQueueItem = {
      id: `queue-${Date.now()}`,
      targetNip: staff.nip,
      targetName: staff.nama,
      targetJabatan: staff.jabatan,
      employmentStatus: staff.status,
      daysRemaining: staff.status.startsWith('PKWT') ? newDaysRemaining : undefined,
      urgencyLevel: newDaysRemaining <= 30 ? 'CRITICAL' : newDaysRemaining <= 60 ? 'WARNING' : 'REGULAR',
      evaluationReason: newReason,
      assignedBy: newAssignedBy,
      assignedByName: assignerName,
      assignedAt: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
      deadlineDate: newDeadline,
      targetAtasanNip: newAtasanNip,
      targetAtasanName: atasan ? `${atasan.nama} (${atasan.jabatan})` : 'Atasan Langsung',
      targetRekanNip: newRekanNip,
      targetRekanName: rekan ? `${rekan.nama} (${rekan.jabatan})` : 'Rekan Kerja Langsung',
      status: 'PENDING',
      notes: newNotes
    };

    const updated = addEvaluationQueueItem(newItem);
    setQueue(updated);
    setIsAddFormOpen(false);
  };

  // Handle Delete Item
  const handleDeleteItem = (id: string) => {
    const updated = queue.filter(q => q.id !== id);
    saveEvaluationQueue(updated);
    setQueue(updated);
  };

  // Handle Reset to Default
  const handleReset = () => {
    if (confirm('Kembalikan antrean penugasan penilaian ke standar bawaan pabrik?')) {
      const reset = resetEvaluationQueueToFactory();
      setQueue(reset);
    }
  };

  // Copy shareable link for a queue item
  const handleCopyLink = (item: EvaluationQueueItem) => {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const pathname = typeof window !== 'undefined' ? window.location.pathname : '/';
    const url = `${origin}${pathname}?tab=kpi_evaluator&subtab=respondent_self_service&targetNip=${item.targetNip}&evalType=ATASAN_LANGSUNG`;
    
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(item.id);
      setTimeout(() => setCopiedId(null), 2500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl max-w-4xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-slate-900 via-amber-950 to-slate-900 p-5 text-white flex items-center justify-between border-b border-amber-500/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md">
              <ClipboardList className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-mono uppercase tracking-wider text-amber-300 font-bold block">
                OTORITAS MANAJERIAL OPERASIONAL &bull; HRD
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white flex items-center gap-2">
                <span>Manajemen Penugasan Penilaian Kinerja &amp; Masa Habis PKWT</span>
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

        {/* Top Summary Banner */}
        <div className="p-4 sm:p-5 bg-slate-50 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              Karyawan yang didaftarkan di sini akan <strong>otomatis menjadi kartu tugas prioritas</strong> ketika atasan atau rekan kerja membuka form pengisian mandiri. Memudahkan monitoring perpanjangan kontrak PKWT tanpa mencari manual.
            </p>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => setIsAddFormOpen(!isAddFormOpen)}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1.5 shadow-sm transition-all"
              >
                <Plus className="w-4 h-4" />
                <span>{isAddFormOpen ? 'Tutup Form' : 'Tugaskan Penilaian Baru'}</span>
              </button>

              <button
                type="button"
                onClick={handleReset}
                title="Reset ke Standar Pabrik"
                className="p-2 rounded-xl border border-slate-300 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-all text-xs"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Quick Stats Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] text-slate-400 font-medium block">TOTAL PENUGASAN:</span>
              <strong className="text-base font-black text-slate-900 dark:text-white font-mono">{stats.total} Karyawan</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/30">
              <span className="text-[10px] text-amber-700 dark:text-amber-400 font-bold block">STATUS PKWT (KONTRAK):</span>
              <strong className="text-base font-black text-amber-700 dark:text-amber-300 font-mono">{stats.pkwtCount} Staf</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
              <span className="text-[10px] text-red-700 dark:text-red-400 font-bold block">KRITIS (&lt; 30 HARI):</span>
              <strong className="text-base font-black text-red-600 dark:text-red-400 font-mono">{stats.criticalCount} Menunggu</strong>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
              <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold block">SELESAI DINILAI:</span>
              <strong className="text-base font-black text-emerald-600 dark:text-emerald-400 font-mono">{stats.completedCount} / {stats.total}</strong>
            </div>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5 text-xs">
          
          {/* Add Form Accordion */}
          {isAddFormOpen && (
            <form onSubmit={handleAddNewAssignment} className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border-2 border-amber-400/50 space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-2 border-b border-amber-200 dark:border-amber-900">
                <span className="font-bold text-amber-950 dark:text-amber-200 flex items-center gap-1.5 text-xs">
                  <Briefcase className="w-4 h-4 text-amber-600" />
                  <span>Formulir Penugasan Evaluasi Baru oleh Manajer</span>
                </span>
                <span className="text-[10px] text-slate-500 font-mono">Bisa untuk PKWT maupun Karyawan Tetap</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {/* Target Staf */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Pilih Karyawan yang Hendak Dinilai:
                  </label>
                  <select
                    value={newStaffNip}
                    onChange={(e) => setNewStaffNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {HR_STAFF_MASTER_DATA.map(st => (
                      <option key={st.nip} value={st.nip}>
                        [{st.status}] {st.nama} — {st.jabatan}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reason */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Alasan / Agenda Penilaian:
                  </label>
                  <select
                    value={newReason}
                    onChange={(e) => setNewReason(e.target.value as EvaluationReason)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="PERPANJANGAN_PKWT">Habis Masa Kontrak PKWT (Prioritas Perpanjangan)</option>
                    <option value="ROTASI_PROMOSI">Evaluasi Rotasi / Rolling / Promosi Jabatan</option>
                    <option value="REGULER_SEMESTER">Evaluasi Kinerja Reguler Semesteran</option>
                    <option value="EVALUASI_KHUSUS">Audit Kinerja Khusus / Indisipliner</option>
                  </select>
                </div>

                {/* Ditugaskan Oleh */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Otoritas Penugas:
                  </label>
                  <select
                    value={newAssignedBy}
                    onChange={(e) => setNewAssignedBy(e.target.value as ManagerAssignerRole)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 font-bold text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="Manajer Operasional Produksi I">Manajer Operasional (Lalu Mahendra)</option>
                    <option value="Kepala Administrasi 1">Kepala Administrasi 1 (Agustin Wulandari)</option>
                    <option value="Manajer HRD">Manajer HRD / Direksi Korporat</option>
                  </select>
                </div>

                {/* Atasan Penilai */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Target Atasan Penilai (R1):
                  </label>
                  <select
                    value={newAtasanNip}
                    onChange={(e) => setNewAtasanNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {HR_STAFF_MASTER_DATA.map(st => (
                      <option key={st.nip} value={st.nip}>
                        {st.nama} ({st.jabatan})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Rekan Penilai */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Target Rekan Penilai (R2):
                  </label>
                  <select
                    value={newRekanNip}
                    onChange={(e) => setNewRekanNip(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {HR_STAFF_MASTER_DATA.map(st => (
                      <option key={st.nip} value={st.nip}>
                        {st.nama} ({st.jabatan})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Deadline */}
                <div className="space-y-1">
                  <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    Batas Akhir Penilaian (Deadline):
                  </label>
                  <input
                    type="text"
                    value={newDeadline}
                    onChange={(e) => setNewDeadline(e.target.value)}
                    placeholder="Contoh: 15 November 2026"
                    className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-1">
                <label className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                  Instruksi / Catatan Khusus untuk Tim Penilai:
                </label>
                <input
                  type="text"
                  value={newNotes}
                  onChange={(e) => setNewNotes(e.target.value)}
                  placeholder="Catatan dari manajer..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-xs outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddFormOpen(false)}
                  className="px-3.5 py-1.5 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>Simpan &amp; Aktifkan Penugasan</span>
                </button>
              </div>
            </form>
          )}

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-3">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                onClick={() => setActiveTabFilter('ALL')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabFilter === 'ALL'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Semua ({queue.length})
              </button>

              <button
                onClick={() => setActiveTabFilter('PKWT')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTabFilter === 'PKWT'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 border border-amber-300 dark:border-amber-800'
                }`}
              >
                <Clock className="w-3.5 h-3.5" />
                <span>Khusus Habis PKWT ({stats.pkwtCount})</span>
              </button>

              <button
                onClick={() => setActiveTabFilter('TETAP')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabFilter === 'TETAP'
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Karyawan Tetap
              </button>

              <button
                onClick={() => setActiveTabFilter('PENDING')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabFilter === 'PENDING'
                    ? 'bg-red-500 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Belum Selesai ({stats.pendingCount})
              </button>

              <button
                onClick={() => setActiveTabFilter('COMPLETED')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTabFilter === 'COMPLETED'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
                }`}
              >
                Selesai ({stats.completedCount})
              </button>
            </div>

            <span className="text-[11px] text-slate-500">
              Menampilkan {filteredItems.length} karyawan
            </span>
          </div>

          {/* Cards List */}
          <div className="space-y-3">
            {filteredItems.map(item => {
              const isPkwt = item.employmentStatus.startsWith('PKWT');
              const isCompleted = item.status === 'COMPLETED';

              return (
                <div
                  key={item.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    isCompleted
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-300 dark:border-emerald-800'
                      : item.urgencyLevel === 'CRITICAL'
                        ? 'bg-red-50/40 dark:bg-red-950/20 border-red-300 dark:border-red-800'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    
                    {/* Left: Staff identity & Contract Info */}
                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-800 font-bold text-slate-700 dark:text-slate-300">
                          {item.targetNip}
                        </span>

                        <span className={`text-[10px] font-mono font-black px-2 py-0.5 rounded ${
                          isPkwt
                            ? 'bg-amber-500 text-slate-950'
                            : 'bg-blue-600 text-white'
                        }`}>
                          {item.employmentStatus}
                        </span>

                        {isPkwt && item.daysRemaining !== undefined && (
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1 ${
                            item.daysRemaining <= 30
                              ? 'bg-red-600 text-white animate-pulse'
                              : 'bg-amber-100 text-amber-900 dark:bg-amber-950 dark:text-amber-300'
                          }`}>
                            <AlertTriangle className="w-3 h-3" />
                            <span>Sisa {item.daysRemaining} Hari Habis Kontrak</span>
                          </span>
                        )}

                        <span className="text-[10px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                          {item.evaluationReason === 'PERPANJANGAN_PKWT' && 'Perpanjangan Masa PKWT'}
                          {item.evaluationReason === 'ROTASI_PROMOSI' && 'Rotasi / Promosi'}
                          {item.evaluationReason === 'REGULER_SEMESTER' && 'Reguler Semester'}
                          {item.evaluationReason === 'EVALUASI_KHUSUS' && 'Evaluasi Khusus'}
                        </span>
                      </div>

                      <h4 className="text-sm font-black text-slate-900 dark:text-white">
                        {item.targetName}
                      </h4>
                      <p className="text-slate-500 dark:text-slate-400 text-xs">
                        {item.targetJabatan}
                      </p>

                      {item.notes && (
                        <p className="text-[11px] text-slate-600 dark:text-slate-300 bg-slate-100/70 dark:bg-slate-800/60 p-2 rounded-xl mt-1">
                          <strong>Catatan Manajer:</strong> {item.notes}
                        </p>
                      )}

                      {/* Penilai assigned */}
                      <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Crown className="w-3.5 h-3.5 text-amber-500" />
                          <span>Atasan: <strong className="text-slate-700 dark:text-slate-200">{item.targetAtasanName}</strong></span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="w-3.5 h-3.5 text-indigo-500" />
                          <span>Rekan: <strong className="text-slate-700 dark:text-slate-200">{item.targetRekanName}</strong></span>
                        </span>
                        <span className="flex items-center gap-1 text-[10px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          <span>Deadline: {item.deadlineDate}</span>
                        </span>
                      </div>
                    </div>

                    {/* Right: Status & Action Buttons */}
                    <div className="flex flex-col sm:items-end justify-between gap-2 shrink-0">
                      <div>
                        {isCompleted ? (
                          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Selesai (Skor: {item.completedScore?.toFixed(2) || '4.00'})</span>
                          </div>
                        ) : (
                          <span className="px-2.5 py-1 rounded-xl bg-amber-500/20 text-amber-800 dark:text-amber-300 border border-amber-500/30 font-bold text-[10px] flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            <span>Menunggu Penilaian</span>
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleCopyLink(item)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                            copiedId === item.id
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                          }`}
                          title="Salin Tautan Khusus untuk Penilai"
                        >
                          {copiedId === item.id ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedId === item.id ? 'Tersalin' : 'Salin URL'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            onSelectStaffForEvaluation(item.targetNip);
                            onClose();
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs flex items-center gap-1 shadow-xs transition-all"
                        >
                          <UserCheck className="w-3.5 h-3.5" />
                          <span>Buka Evaluasi</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeleteItem(item.id)}
                          className="p-1.5 rounded-xl text-slate-400 hover:text-red-500 transition-all"
                          title="Hapus dari antrean"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                </div>
              );
            })}

            {filteredItems.length === 0 && (
              <div className="p-8 text-center bg-slate-50 dark:bg-slate-950 rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-500">
                Tidak ada penugasan evaluasi dalam kategori ini.
              </div>
            )}
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-500">
            <ShieldCheck className="w-4 h-4 text-emerald-500" />
            <span>Pemberitahuan Otomatis Terhubung ke Seluruh 32 Responden Staf PT Batu Karang</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 text-white font-bold text-xs"
          >
            Tutup Panel
          </button>
        </div>

      </div>
    </div>
  );
};
