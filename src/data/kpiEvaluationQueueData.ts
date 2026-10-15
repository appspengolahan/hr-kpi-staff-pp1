import { HR_STAFF_MASTER_DATA, HrStaffRecord } from './hrStaffMasterData';

export type EmploymentStatusType = 'PKWT 3' | 'PKWT 4' | 'TETAP';
export type EvaluationReason = 'PERPANJANGAN_PKWT' | 'ROTASI_PROMOSI' | 'REGULER_SEMESTER' | 'EVALUASI_KHUSUS';
export type EvaluationQueueStatus = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';
export type ManagerAssignerRole = 'Manajer Operasional Produksi I' | 'Kepala Administrasi 1' | 'Manajer HRD';

export interface EvaluationQueueItem {
  id: string;
  targetNip: string;
  targetName: string;
  targetJabatan: string;
  employmentStatus: EmploymentStatusType;
  contractEndDate?: string; // e.g. "2026-11-15"
  daysRemaining?: number;
  urgencyLevel: 'CRITICAL' | 'WARNING' | 'REGULAR';
  evaluationReason: EvaluationReason;
  assignedBy: ManagerAssignerRole;
  assignedByName: string;
  assignedAt: string; // e.g. "12 Oktober 2026"
  deadlineDate: string; // e.g. "30 Oktober 2026"
  targetAtasanNip: string;
  targetAtasanName: string;
  targetRekanNip: string;
  targetRekanName: string;
  status: EvaluationQueueStatus;
  completedAt?: string;
  completedScore?: number;
  notes?: string;
}

const STORAGE_KEY = 'pp1_kpi_evaluation_queue_v1';

// Initial realistic default evaluation queue focusing on PKWT endings + key assignments
export const INITIAL_EVALUATION_QUEUE: EvaluationQueueItem[] = [
  {
    id: 'queue-001',
    targetNip: 'BK-PP1-025',
    targetName: 'Adin Tri Wartono',
    targetJabatan: 'Administrasi Gudang (Kecil) Cengkeh',
    employmentStatus: 'PKWT 4',
    contractEndDate: '2026-11-15',
    daysRemaining: 31,
    urgencyLevel: 'CRITICAL',
    evaluationReason: 'PERPANJANGAN_PKWT',
    assignedBy: 'Kepala Administrasi 1',
    assignedByName: 'Agustin Wulandari',
    assignedAt: '10 Oktober 2026',
    deadlineDate: '28 Oktober 2026',
    targetAtasanNip: 'BK-PP1-021', // Andhik Dharmabakti
    targetAtasanName: 'Andhik Dharmabakti (Plt. Ka Pengolahan 2)',
    targetRekanNip: 'BK-PP1-006', // Ambar Istiqomah
    targetRekanName: 'Ambar Istiqomah (Adm. Cengkeh)',
    status: 'IN_PROGRESS',
    notes: 'Habis masa kontrak PKWT 4. Evaluasi kelayakan rekomendasi perpanjangan atau penyesuaian penempatan.'
  },
  {
    id: 'queue-002',
    targetNip: 'BK-PP1-019',
    targetName: 'May Yesi Triana Putri',
    targetJabatan: 'Adminsitrasi Proses Blend',
    employmentStatus: 'PKWT 4',
    contractEndDate: '2026-11-30',
    daysRemaining: 46,
    urgencyLevel: 'WARNING',
    evaluationReason: 'PERPANJANGAN_PKWT',
    assignedBy: 'Kepala Administrasi 1',
    assignedByName: 'Agustin Wulandari',
    assignedAt: '12 Oktober 2026',
    deadlineDate: '05 November 2026',
    targetAtasanNip: 'BK-PP1-021',
    targetAtasanName: 'Andhik Dharmabakti',
    targetRekanNip: 'BK-PP1-031',
    targetRekanName: 'Brilliant Rachma Shakira',
    status: 'PENDING',
    notes: 'Kajian performa ketertiban laporan harian proses blend menjelang habis PKWT.'
  },
  {
    id: 'queue-003',
    targetNip: 'BK-PP1-008',
    targetName: 'Edward Antonius Effendy',
    targetJabatan: 'Operator Mesin KT 2',
    employmentStatus: 'PKWT 3',
    contractEndDate: '2026-11-10',
    daysRemaining: 26,
    urgencyLevel: 'CRITICAL',
    evaluationReason: 'PERPANJANGAN_PKWT',
    assignedBy: 'Manajer Operasional Produksi I',
    assignedByName: 'Lalu Mahendra Ali Akbar',
    assignedAt: '08 Oktober 2026',
    deadlineDate: '25 Oktober 2026',
    targetAtasanNip: 'BK-PP1-028',
    targetAtasanName: 'Heri Pribadi (Mekanik Senior)',
    targetRekanNip: 'BK-PP1-010',
    targetRekanName: 'Nanang Widiyatmoko (Operator Primery)',
    status: 'PENDING',
    notes: 'Evaluasi kesiapan teknis mesin KT 2 dan kedisiplinan preventif maintenance.'
  },
  {
    id: 'queue-004',
    targetNip: 'BK-PP1-022',
    targetName: 'Windi Qiroatul Afrilia',
    targetJabatan: 'Administrasi Gudang (Kecil) Persediaan Tembakau & Krosok',
    employmentStatus: 'PKWT 4',
    contractEndDate: '2026-12-15',
    daysRemaining: 61,
    urgencyLevel: 'WARNING',
    evaluationReason: 'PERPANJANGAN_PKWT',
    assignedBy: 'Manajer HRD',
    assignedByName: 'Tim HRD Korporat',
    assignedAt: '14 Oktober 2026',
    deadlineDate: '15 November 2026',
    targetAtasanNip: 'BK-PP1-003',
    targetAtasanName: 'Agustin Wulandari (Ka. Adm 1)',
    targetRekanNip: 'BK-PP1-002',
    targetRekanName: 'Restika (Adm. Tembakau)',
    status: 'PENDING',
    notes: 'Audit ketelitian nota timbangan dan krosok tembakau gudang kecil.'
  },
  {
    id: 'queue-005',
    targetNip: 'BK-PP1-021',
    targetName: 'Andhik Dharmabakti',
    targetJabatan: 'Plt. Kepala Pengolahan 2 (Cengkeh & Blend)',
    employmentStatus: 'PKWT 4',
    contractEndDate: '2026-12-31',
    daysRemaining: 77,
    urgencyLevel: 'REGULAR',
    evaluationReason: 'ROTASI_PROMOSI',
    assignedBy: 'Manajer Operasional Produksi I',
    assignedByName: 'Lalu Mahendra Ali Akbar',
    assignedAt: '10 Oktober 2026',
    deadlineDate: '20 November 2026',
    targetAtasanNip: 'BK-PP1-001',
    targetAtasanName: 'Lalu Mahendra Ali Akbar (Manajer Ops)',
    targetRekanNip: 'BK-PP1-015',
    targetRekanName: 'Indah Nurmala (Mandor Cengkeh)',
    status: 'PENDING',
    notes: 'Evaluasi kepemimpinan manajerial Plt Pengolahan 2 untuk usulan pengangkatan definitif.'
  },
  {
    id: 'queue-006',
    targetNip: 'BK-PP1-004',
    targetName: 'Ogik Indrawan',
    targetJabatan: 'Mandor Proses Blend',
    employmentStatus: 'PKWT 4',
    contractEndDate: '2026-11-20',
    daysRemaining: 36,
    urgencyLevel: 'WARNING',
    evaluationReason: 'PERPANJANGAN_PKWT',
    assignedBy: 'Manajer Operasional Produksi I',
    assignedByName: 'Lalu Mahendra Ali Akbar',
    assignedAt: '11 Oktober 2026',
    deadlineDate: '30 Oktober 2026',
    targetAtasanNip: 'BK-PP1-021',
    targetAtasanName: 'Andhik Dharmabakti',
    targetRekanNip: 'BK-PP1-020',
    targetRekanName: 'Surya Ning Sasi (Mandor Blend)',
    status: 'PENDING',
    notes: 'Evaluasi pengawasan blending tembakau-cengkeh dan absensi regu kerja.'
  },
  {
    id: 'queue-007',
    targetNip: 'BK-PP1-001',
    targetName: 'Lalu Mahendra Ali Akbar',
    targetJabatan: 'Manajer Operasional Produksi I',
    employmentStatus: 'TETAP',
    urgencyLevel: 'REGULAR',
    evaluationReason: 'REGULER_SEMESTER',
    assignedBy: 'Manajer HRD',
    assignedByName: 'Direksi / HRD Korporat',
    assignedAt: '01 Oktober 2026',
    deadlineDate: '30 November 2026',
    targetAtasanNip: 'DIR-OPS-01',
    targetAtasanName: 'Direktur Operasional PT Batu Karang',
    targetRekanNip: 'BK-PP1-003',
    targetRekanName: 'Agustin Wulandari (Ka. Adm 1)',
    status: 'PENDING',
    notes: 'Evaluasi semesteran kepemimpinan operasional pabrik dan efisiensi throughput BOS.'
  }
];

export function getEvaluationQueue(): EvaluationQueueItem[] {
  if (typeof window === 'undefined') return INITIAL_EVALUATION_QUEUE;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_EVALUATION_QUEUE));
      return INITIAL_EVALUATION_QUEUE;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error loading evaluation queue:', err);
    return INITIAL_EVALUATION_QUEUE;
  }
}

export function saveEvaluationQueue(queue: EvaluationQueueItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch (err) {
    console.error('Error saving evaluation queue:', err);
  }
}

export function addEvaluationQueueItem(item: EvaluationQueueItem): EvaluationQueueItem[] {
  const current = getEvaluationQueue();
  // Check if exists
  const existsIndex = current.findIndex(q => q.targetNip === item.targetNip);
  let updated: EvaluationQueueItem[];
  if (existsIndex >= 0) {
    updated = [...current];
    updated[existsIndex] = { ...updated[existsIndex], ...item };
  } else {
    updated = [item, ...current];
  }
  saveEvaluationQueue(updated);
  return updated;
}

export function markQueueItemCompleted(targetNip: string, score: number): EvaluationQueueItem[] {
  const current = getEvaluationQueue();
  const now = new Date();
  const dateStr = `${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })} ${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')} WIB`;
  
  const updated = current.map(item => {
    if (item.targetNip === targetNip) {
      return {
        ...item,
        status: 'COMPLETED' as const,
        completedAt: dateStr,
        completedScore: score
      };
    }
    return item;
  });
  saveEvaluationQueue(updated);
  return updated;
}

export function resetEvaluationQueueToFactory(): EvaluationQueueItem[] {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY);
  }
  return INITIAL_EVALUATION_QUEUE;
}
