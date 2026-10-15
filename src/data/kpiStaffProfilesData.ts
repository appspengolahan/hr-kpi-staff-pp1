import { HR_STAFF_MASTER_DATA, HrStaffRecord } from './hrStaffMasterData';
import { 
  OfficialKpiProfile, 
  Kpi360Parameter, 
  PeerFeedbackItem, 
  EvaluationAuthority,
  KPI_16_RECOMMENDED_PARAMETERS,
  KPI_20_LEGACY_PARAMETERS,
  OFFICIAL_ADIN_KPI_DATA
} from './kpi360TemplateData';

const KPI_STORAGE_KEY_PREFIX = 'batu_karang_kpi_profile_v2_';

// Helper to determine criteria label from score
export function getKriteriaFromScore(score: number): 'SANGAT KURANG' | 'KURANG' | 'CUKUP' | 'BAIK' | 'SANGAT BAIK' {
  if (score >= 4.1) return 'SANGAT BAIK';
  if (score >= 3.1) return 'BAIK';
  if (score >= 2.1) return 'CUKUP';
  if (score >= 1.1) return 'KURANG';
  return 'SANGAT KURANG';
}

// Deterministic pseudo-random score adjustment based on staff nip and parameter id
// Ensures scores are realistic, repeatable, and logically varied per role level
function calculateParamScore(
  baseScore: number, 
  staff: HrStaffRecord, 
  param: Kpi360Parameter
): { totalScore: number; avgScore: number; kriteria: 'SANGAT KURANG' | 'KURANG' | 'CUKUP' | 'BAIK' | 'SANGAT BAIK' } {
  // If this is Adin Tri Wartono, return the official exact baseline
  if (staff.nip === 'BK-PP1-025') {
    return {
      totalScore: param.totalScore,
      avgScore: param.avgScore,
      kriteria: param.kriteria
    };
  }

  // Level & Role bonus
  let bonus = 0;
  if (staff.level.includes('25')) bonus += 0.55; // Manajer Operasional
  else if (staff.level.includes('15')) bonus += 0.40; // Ka Admin, Plt Ka Pengolahan
  else if (staff.level.includes('9')) bonus += 0.25;  // Plt Ka Gudang, Mandor Senior, Mekanik Senior
  else if (staff.level.includes('7')) bonus += 0.15;  // Mandor / Admin 7
  else if (staff.level.includes('5')) bonus += 0.05;  // Level 5
  else bonus -= 0.05; // Level 3

  // Domain affinity
  if (staff.sekup === 'Administrasi') {
    if (param.category === 'Kompetensi' && param.name.includes('Akurasi')) bonus += 0.15;
    if (param.category === 'Kedisiplinan' && param.name.includes('Presensi')) bonus += 0.1;
  } else {
    // Operasional
    if (param.category === 'Kedisiplinan' && param.name.includes('APD')) bonus += 0.15;
    if (param.category === 'Tanggungjawab' && param.name.includes('Mesin')) bonus += 0.15;
  }

  // Deterministic variance using staff id and param id char codes
  const seed = (staff.id * 17 + param.name.length * 7 + param.subCategoryNumber.charCodeAt(0)) % 100;
  const variance = ((seed - 50) / 100) * 0.35; // between -0.17 and +0.17

  let finalAvg = Number((baseScore + bonus + variance).toFixed(2));
  finalAvg = Math.max(2.6, Math.min(4.9, finalAvg));
  const finalTotal = Number((finalAvg * 4).toFixed(2));

  return {
    totalScore: finalTotal,
    avgScore: finalAvg,
    kriteria: getKriteriaFromScore(finalAvg)
  };
}

// Generate realistic attendance data based on staff record
function generateAttendance(staff: HrStaffRecord) {
  if (staff.nip === 'BK-PP1-025') {
    return OFFICIAL_ADIN_KPI_DATA.catatanPresensi;
  }

  if (staff.level.includes('25') || staff.level.includes('15')) {
    return {
      persentaseKehadiran: 100,
      periode: 'Juli 2025 - Januari 2026',
      alpha: '-',
      ijinMenit: 0,
      sakit: '-',
      keterlambatan: '-',
      pulangAwalMenit: 0
    };
  }

  if (staff.level.includes('9')) {
    return {
      persentaseKehadiran: 99.65,
      periode: 'Juli 2025 - Januari 2026',
      alpha: '-',
      ijinMenit: 60,
      sakit: '-',
      keterlambatan: '-',
      pulangAwalMenit: 30
    };
  }

  if (staff.status === 'TETAP') {
    return {
      persentaseKehadiran: 98.85,
      periode: 'Juli 2025 - Januari 2026',
      alpha: '-',
      ijinMenit: 120,
      sakit: '1 Hari (Surat Dokter)',
      keterlambatan: '-',
      pulangAwalMenit: 60
    };
  }

  // PKWT
  const attendanceValues = [98.2, 97.8, 99.1, 98.5];
  const chosen = attendanceValues[staff.id % attendanceValues.length];
  return {
    persentaseKehadiran: chosen,
    periode: 'Juli 2025 - Januari 2026',
    alpha: '-',
    ijinMenit: 180,
    sakit: '-',
    keterlambatan: '1x (12 Menit)',
    pulangAwalMenit: 90
  };
}

// Generate realistic sanctions
function generateSanctions(staff: HrStaffRecord): string[] {
  if (staff.nip === 'BK-PP1-025') {
    return OFFICIAL_ADIN_KPI_DATA.sanksiAdministratif;
  }
  // All other staff currently clean or minor warning note
  if (staff.nip === 'BK-PP1-008') {
    return ['Catatan Pembinaan Disiplin: Keterlambatan Serah Terima Mesin Shift Malam (Teguran Lisan Mandor)'];
  }
  return [];
}

// Generate realistic 4 respondents for each staff member
function generateRespondents(staff: HrStaffRecord): string[] {
  if (staff.nip === 'BK-PP1-025') {
    return OFFICIAL_ADIN_KPI_DATA.responden;
  }

  if (staff.nip === 'BK-PP1-001') {
    return [
      'Direktur Operasional PT Batu Karang (Atasan)',
      'Agustin Wulandari (Kepala Administrasi 1)',
      'Andhik Dharmabakti (Plt. Ka Pengolahan 2)',
      'Yulia Wardana (Plt. Ka Gudang Persediaan 1)'
    ];
  }

  // Default hierarchical respondents
  let supervisor = 'Lalu Mahendra Ali Akbar (Manajer Operasional)';
  if (staff.sekup === 'Administrasi') {
    if (staff.nip !== 'BK-PP1-003') supervisor = 'Agustin Wulandari (Kepala Administrasi 1)';
  } else {
    if (staff.nip !== 'BK-PP1-021') supervisor = 'Andhik Dharmabakti (Plt. Ka Pengolahan 2)';
  }

  // Find 3 peer colleagues
  const peers = HR_STAFF_MASTER_DATA
    .filter(s => s.nip !== staff.nip && s.nip !== 'BK-PP1-001' && s.sekup === staff.sekup)
    .slice(0, 3)
    .map((p, idx) => `${p.nama} (${idx === 0 ? 'Senior Partner' : 'Rekan Kerja'})`);

  while (peers.length < 3) {
    peers.push('Rekan Divisi Terkait');
  }

  return [supervisor, peers[0], peers[1], peers[2]];
}

// Generate realistic peer feedbacks for each staff member
function generatePeerFeedbacks(staff: HrStaffRecord): PeerFeedbackItem[] {
  if (staff.nip === 'BK-PP1-025') {
    return OFFICIAL_ADIN_KPI_DATA.peerFeedbacks;
  }

  const isLeader = staff.level.includes('25') || staff.level.includes('15') || staff.level.includes('9');

  if (isLeader) {
    return [
      {
        id: `peer-${staff.nip}-1`,
        respondentName: 'LALU MAHENDRA ALI AKBAR',
        relationType: 'LANGSUNG',
        roleInFactory: 'Manajer Operasional Produksi I',
        positiveFeedback: `Memiliki jiwa kepemimpinan operasional yang handal dan kepatuhan SOP yang konsisten dalam mengarahkan personil tim ${staff.jabatan}.`,
        improvementFeedback: 'Perlu terus memperkuat koordinasi digital lintas seksi pengolahan tembakau & cengkeh agar alur BOS makin presisi.',
        recommendation: 'Peningkatan supervisi preventif pada saat jam pergantian shift kerja.'
      },
      {
        id: `peer-${staff.nip}-2`,
        respondentName: 'AGUSTIN WULANDARI',
        relationType: 'LANGSUNG',
        roleInFactory: 'Kepala Administrasi 1',
        positiveFeedback: 'Komunikasi administratif sangat jelas, tertib pengarsipan, dan cepat dalam verifikasi buku laporan bulanan.',
        improvementFeedback: 'Pertahankan stabilitas koordinasi saat volume order pabrik melonjak.',
        recommendation: 'Standarisasi checklist serah terima dokumen mingguan.'
      },
      {
        id: `peer-${staff.nip}-3`,
        respondentName: 'ANDHIK DHARMABAKTI',
        relationType: 'TIDAK_LANGSUNG',
        roleInFactory: 'Plt. Kepala Pengolahan 2',
        positiveFeedback: 'Rekan kerja tangguh yang responsif ketika terjadi kendala teknis penimbangan maupun pemrosesan bahan.',
        improvementFeedback: 'Perlu sosialisasi berkala SOP keselamatan kerja (K3) kepada operator dan helper baru.',
        recommendation: 'Pelatihan singkat K3 rutin 15 menit per awal bulan.'
      },
      {
        id: `peer-${staff.nip}-4`,
        respondentName: 'YULIA WARDHANA',
        relationType: 'TIDAK_LANGSUNG',
        roleInFactory: 'Plt. Ka Gudang Persediaan 1',
        positiveFeedback: 'Sangat kooperatif dalam sinkronisasi kartu stok gudang dan mutasi bahan baku.',
        improvementFeedback: 'Tingkatkan akurasi perkiraan estimasi kebutuhan bahan sebelum jam proses.',
        recommendation: 'Integrasi sistem rekap stok digital real-time.'
      }
    ];
  }

  // Operator / Pelaksana / Staff
  return [
    {
      id: `peer-${staff.nip}-1`,
      respondentName: 'ANDHIK DHARMABAKTI',
      relationType: 'LANGSUNG',
      roleInFactory: 'Plt. Kepala Pengolahan 2 (Atasan)',
      positiveFeedback: `Menunjukkan dedikasi dan kedisiplinan kerja yang baik dalam mengemban tugas sebagai ${staff.jabatan}. Selalu mematuhi jam shift.`,
      improvementFeedback: 'Tingkatkan ketelitian verifikasi data fisik agar tidak ada selisih catatan kerja dengan hasil akhir.',
      recommendation: 'Lakukan pemeriksaan silang (cross-check) sebelum menyerahkan hasil ke mandor.'
    },
    {
      id: `peer-${staff.nip}-2`,
      respondentName: 'OGIK INDRAWAN',
      relationType: 'LANGSUNG',
      roleInFactory: 'Mandor Proses Blend',
      positiveFeedback: 'Kerja sama tim sangat baik, sigap membantu rekan satu lini saat beban kerja sedang padat.',
      improvementFeedback: 'Perlu lebih percaya diri mengambil inisiatif saat menghadapi kendala alat ringan.',
      recommendation: 'Pendampingan pemeliharaan mandiri (autonomous maintenance).'
    },
    {
      id: `peer-${staff.nip}-3`,
      respondentName: 'AMBAR ISTIQOMAH',
      relationType: 'TIDAK_LANGSUNG',
      roleInFactory: 'Administrasi Cengkeh',
      positiveFeedback: 'Tertib administrasi dan komunikatif saat serah terima dokumen operasional.',
      improvementFeedback: 'Kerapian format dokumen form perlu dijaga tetap konsisten setiap hari.',
      recommendation: 'Penggunaan template standar cetak yang rapi.'
    },
    {
      id: `peer-${staff.nip}-4`,
      respondentName: 'DENNY KARISMA GIANTO',
      relationType: 'TIDAK_LANGSUNG',
      roleInFactory: 'Plt. Ka Gudang Tembakau',
      positiveFeedback: 'Penyampaian laporan mutasi cepat dan tertib menjaga kebersihan pos kerja.',
      improvementFeedback: 'Perhatikan jadwal cut-off rekapitulasi data harian sebelum jam 09:00 WIB.',
      recommendation: 'Disiplin cut-off sistem BOS tepat waktu.'
    }
  ];
}

// Generate the full baseline profile for any staff member
export function generateStaffBaselineProfile(
  staff: HrStaffRecord, 
  templateVersion: 'RECOMMENDED_16' | 'LEGACY_20' = 'RECOMMENDED_16'
): OfficialKpiProfile {
  // If Adin Tri Wartono, return the master baseline
  if (staff.nip === 'BK-PP1-025') {
    if (templateVersion === 'LEGACY_20') {
      return {
        ...OFFICIAL_ADIN_KPI_DATA,
        templateVersion: 'LEGACY_20',
        parameters: KPI_20_LEGACY_PARAMETERS
      };
    }
    return {
      ...OFFICIAL_ADIN_KPI_DATA,
      templateVersion: 'RECOMMENDED_16',
      parameters: KPI_16_RECOMMENDED_PARAMETERS
    };
  }

  const baseTemplateParams = templateVersion === 'RECOMMENDED_16' 
    ? KPI_16_RECOMMENDED_PARAMETERS 
    : KPI_20_LEGACY_PARAMETERS;

  const customizedParams: Kpi360Parameter[] = baseTemplateParams.map(param => {
    const { totalScore, avgScore, kriteria } = calculateParamScore(param.avgScore, staff, param);
    return {
      ...param,
      totalScore,
      avgScore,
      kriteria
    };
  });

  return {
    nama: staff.nama.toUpperCase(),
    nip: staff.nip,
    jabatan: staff.jabatan.toUpperCase(),
    periodePenilaian: 'JANUARI 2026',
    level: staff.level,
    sekup: staff.sekup.toUpperCase(),
    templateVersion,
    sanksiAdministratif: generateSanctions(staff),
    catatanPresensi: generateAttendance(staff),
    responden: generateRespondents(staff),
    parameters: customizedParams,
    peerFeedbacks: generatePeerFeedbacks(staff)
  };
}

// Fetch staff profile with local storage persistence
export function getStaffKpiProfile(
  nip: string, 
  requestedTemplate?: 'RECOMMENDED_16' | 'LEGACY_20'
): OfficialKpiProfile {
  const staff = HR_STAFF_MASTER_DATA.find(s => s.nip === nip) || HR_STAFF_MASTER_DATA[24]; // default to Adin (id 25)

  // Try reading from localStorage
  try {
    const storageKey = `${KPI_STORAGE_KEY_PREFIX}${nip}`;
    const savedJson = localStorage.getItem(storageKey);
    if (savedJson) {
      const parsed: OfficialKpiProfile = JSON.parse(savedJson);
      // If a specific template was explicitly asked and differs from parsed, adapt
      if (requestedTemplate && parsed.templateVersion !== requestedTemplate) {
        const baseline = generateStaffBaselineProfile(staff, requestedTemplate);
        // keep identity, presensi, sanctions, peerFeedbacks, but adapt parameters
        return {
          ...parsed,
          templateVersion: requestedTemplate,
          parameters: baseline.parameters
        };
      }
      return parsed;
    }
  } catch (err) {
    console.warn(`Error reading stored profile for NIP ${nip}:`, err);
  }

  // Fallback to newly generated baseline profile
  return generateStaffBaselineProfile(staff, requestedTemplate || 'RECOMMENDED_16');
}

// Save profile to localStorage
export function saveStaffKpiProfile(profile: OfficialKpiProfile): void {
  try {
    const storageKey = `${KPI_STORAGE_KEY_PREFIX}${profile.nip}`;
    localStorage.setItem(storageKey, JSON.stringify(profile));
  } catch (err) {
    console.error(`Error saving KPI profile for NIP ${profile.nip}:`, err);
  }
}

// Reset staff profile to clean factory baseline
export function resetStaffKpiProfile(nip: string, templateVersion: 'RECOMMENDED_16' | 'LEGACY_20' = 'RECOMMENDED_16'): OfficialKpiProfile {
  try {
    const storageKey = `${KPI_STORAGE_KEY_PREFIX}${nip}`;
    localStorage.removeItem(storageKey);
  } catch (err) {
    console.error(`Error resetting KPI profile for NIP ${nip}:`, err);
  }
  const staff = HR_STAFF_MASTER_DATA.find(s => s.nip === nip) || HR_STAFF_MASTER_DATA[24];
  return generateStaffBaselineProfile(staff, templateVersion);
}

// Check if staff has customized edits saved in localStorage
export function hasCustomKpiEdits(nip: string): boolean {
  try {
    const storageKey = `${KPI_STORAGE_KEY_PREFIX}${nip}`;
    return localStorage.getItem(storageKey) !== null;
  } catch {
    return false;
  }
}

// Calculate individual staff Performance Index
export function calculateProfileIndex(profile: OfficialKpiProfile): number {
  if (!profile.parameters || profile.parameters.length === 0) return 0;
  const raw = profile.parameters.reduce((acc, p) => acc + p.avgScore, 0);
  return Number((raw / profile.parameters.length).toFixed(2));
}

// Summary list of all 32 staff members with their current index
export function getAllStaffKpiSummaries(): Array<{
  nip: string;
  nama: string;
  jabatan: string;
  level: string;
  sekup: string;
  indexKinerja: number;
  kriteria: string;
  hasCustomEdits: boolean;
}> {
  return HR_STAFF_MASTER_DATA.map(staff => {
    const profile = getStaffKpiProfile(staff.nip, 'RECOMMENDED_16');
    const index = calculateProfileIndex(profile);
    const kriteria = getKriteriaFromScore(index);
    return {
      nip: staff.nip,
      nama: staff.nama,
      jabatan: staff.jabatan,
      level: staff.level,
      sekup: staff.sekup,
      indexKinerja: index,
      kriteria,
      hasCustomEdits: hasCustomKpiEdits(staff.nip)
    };
  });
}
