import { RoleId } from '../types';
import { 
  formatWibShortDate, 
  formatWibDate, 
  formatWibFullDate, 
  formatWibTime,
  getWibDateParts 
} from '../utils/indonesiaDateUtils';

export interface AiEmployee {
  id: string;
  roleNumber: number;
  name: string;
  title: string;
  roleCalling: string; // e.g. "Auditor Mutu & Kadar Air"
  avatarInitials: string;
  badgeColor: string;
  iconName: string;
  department: string;
  specialization: string;
  description: string;
  scope: string[];
  externalAppUrl?: string;
  externalAppName?: string;
  keyMetrics: {
    label: string;
    value: string;
    status: 'optimal' | 'warning' | 'critical';
    trend: string;
  }[];
  responsibilities: string[];
}

export interface MoistureAuditItem {
  id: string;
  materialName: 'Tembakau Rajang' | 'Krosok' | 'Cengkeh Rajang' | 'Hasil Blend Molen';
  lotOrBatch: string;
  currentMoisture: number; // %
  targetMin: number;
  targetIdeal: number;
  targetMax: number;
  deltaPercent: number;
  status: 'OPTIMAL' | 'PERLU_PENYESUAIAN' | 'ANOMALI_BAHAYA';
  riskType?: 'Jamur / Kelembapan Berlebih' | 'Kerapuhan / Hancur Daun' | 'Normal';
  testedBy: string;
  timestamp: string;
  aiFinding: string;
  aiRecommendation: string;
}

export interface ShrinkageAuditItem {
  id: string;
  materialName: string;
  lineOrMachine: string;
  batchNumber: string;
  rawWeightKg: number;
  resultWeightKg: number;
  actualShrinkageKg: number;
  actualShrinkagePercent: number;
  standardToleranceMaxPercent: number;
  status: 'NORMAL' | 'MENDEKATI_BATAS' | 'ANOMALI_LONJAKAN' | 'ANOMALI_SERAGAM_PALSU';
  deviationKg: number;
  mandorInCharge: string;
  aiFinding: string;
  aiRecommendation: string;
}

export interface DataTruthAuditItem {
  id: string;
  documentType: 'DHP Tembakau' | 'DHP Blend Molen' | 'DHP Cengkeh' | 'Laporan Cut-Off BOS';
  referenceNo: string;
  checkTimestamp: string;
  testedRule: string;
  formulaCheckStatus: 'VALID' | 'SELISIH_MATEMATIS';
  spkStatus: 'TERDAFTAR_VALID' | 'DUPLIKAT' | 'FORMAT_SALAH';
  cutoffStatus: 'TEPAT_WAKTU (<09:00)' | 'TERLAMBAT';
  authorizationSignatures: {
    penimbang: boolean;
    mandor: boolean;
    kaGudang: boolean;
    managerOps: boolean;
  };
  accuracyScore: number; // 0 - 100
  aiVerdict: 'LOLOS_VERIFIKASI' | 'PERLU_REVISI_SEGERA' | 'DITAHAN';
  anomalyDetail?: string;
}

export interface StockBsppAuditItem {
  id: string;
  materialName: string;
  warehouseLocation: string;
  systemStockKg: number;
  physicalStockKg: number;
  discrepancyKg: number; // Selisih
  dailyBurnRateKg: number; // Konsumsi rata-rata harian
  estimatedDaysCover: number; // Berapa hari stok cukup
  minimumBufferKg: number;
  stockStatus: 'AMAN' | 'MENDEKATI_BUFFER' | 'KRITIS';
  activeBsppCount: number; // Bukti Selisih Penerimaan/Pengeluaran
  bsppNotes: string;
  aiProcurementAdvice: string;
}

export interface HrAttendanceAuditItem {
  id: string;
  unitLine: string;
  requiredHeadcount: number;
  presentHeadcount: number;
  keyStaffAssigned: {
    roleTitle: string;
    staffName: string;
    status: 'HADIR' | 'IZIN' | 'TERLAMBAT' | 'KOSONG';
  }[];
  lineCoverageScore: number; // 0 - 100
  shiftStatus: 'SIAP_PENUH' | 'PERLU_SUBSTITUSI' | 'BERISIKO';
  jobdescComplianceScore: number; // Kepatuhan SOP 13 Jabatan
  aiObservation: string;
}

export interface ExecutiveDecisionBriefing {
  generatedAt: string;
  period: string;
  factoryHealthIndex: number; // 0 - 100
  overallStatus: 'PRIMA' | 'WASPADA' | 'KRITIS';
  managerInCharge: string;
  topAnomalies: {
    category: string;
    severity: 'TINGGI' | 'SEDANG' | 'RENDAH';
    summary: string;
    assignedAiRole: string;
  }[];
  tacticalRecommendations: {
    priority: number;
    title: string;
    impactArea: string;
    rationale: string;
    actionSteps: string[];
    deadline: string;
    responsibleStaff: string;
  }[];
  whatsAppBriefingText: string;
}

export const AI_EMPLOYEES: AiEmployee[] = [
  {
    id: 'ai_auditor_ka',
    roleNumber: 1,
    name: 'Ir. Tirta Wardhana',
    title: 'Auditor Mutu & Kadar Air AI',
    roleCalling: 'Auditor Mutu & Kadar Air',
    avatarInitials: 'TW',
    badgeColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    iconName: 'Droplets',
    department: 'Quality Assurance & Fisik Bahan',
    specialization: 'Audit Kadar Air (KA%) 4 Bahan (Cengkeh, Krosok, Tembakau, Blend) & Deteksi Jamur/Kerapuhan',
    description: 'Bertanggung jawab memonitor fluktuasi kadar air bahan baku dan produk antara secara real-time. Memiliki toleransi ketat terhadap potensi pembusukan jamur atau pecahnya daun akibat kekeringan.',
    scope: [
      'Kadar air cengkeh rajang (Standar: 12.0% - 13.5%)',
      'Kadar air krosok gudang penerimaan (Standar: 13.0% - 14.5%)',
      'Kadar air tembakau rajang (Standar: 11.5% - 13.0%)',
      'Kadar air hasil olah blend mesin molen (Standar: 12.5% - 13.8%)',
      'Pengukuran delta KA sebelum dan sesudah proses casing/drying'
    ],
    keyMetrics: [
      { label: 'Rata-rata KA Blend', value: '13.3%', status: 'optimal', trend: '+0.1% stabil' },
      { label: 'Kesesuaian Standar', value: '98.5%', status: 'optimal', trend: 'Lolos uji lab' },
      { label: 'Peringatan Anomali', value: '1 Batch', status: 'warning', trend: 'Cengkeh Lot-03' }
    ],
    responsibilities: [
      'Mengidentifikasi perubahan KA per batch produksi',
      'Mendeteksi anomali kenaikan air yang memicu jamur pada masa simpan',
      'Mendeteksi kelembapan terlalu rendah yang menyebabkan serbuk tembakau berlebih',
      'Memberikan rekomendasi setelan suhu dryer dan kelembapan ruang aerasi'
    ]
  },
  {
    id: 'ai_auditor_susut',
    roleNumber: 2,
    name: 'Dr. Susanto Efendi',
    title: 'Auditor Kesusutan Proses AI',
    roleCalling: 'Auditor Kesusutan Proses',
    avatarInitials: 'SE',
    badgeColor: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    iconName: 'TrendingDown',
    department: 'Efisiensi Proses & Material Loss',
    specialization: 'Audit Kesusutan Proses Masing-Masing Bahan & Deteksi Kecurangan/Pola Susut Palsu',
    description: 'Mengaudit efisiensi konversi bahan baku menjadi bahan olahan. Membongkar anomali lonjakan susut abnormal maupun kesusutan seragam palsu (flat shrinkage) yang mengindikasikan rekayasa input.',
    scope: [
      'Kesusutan tembakau rajang SKT/SKM (Batas: maks 2.50%)',
      'Kesusutan cengkeh rajang & pemisahan gagang (Batas: maks 2.00%)',
      'Kesusutan sortir krosok bal (Batas: maks 3.50%)',
      'Kesusutan pencampuran blend Molen 1, 2, 3 (Batas: 1.00% - 1.80%)',
      'Korelasi susut terhadap timbangan debu/serbuk yang tertangkap filter'
    ],
    keyMetrics: [
      { label: 'Rerata Susut Blend', value: '1.34%', status: 'optimal', trend: 'Dalam batas SOP' },
      { label: 'Rerata Susut Tembakau', value: '1.24%', status: 'optimal', trend: 'Efisien' },
      { label: 'Deteksi Pola Seragam', value: 'Nihil', status: 'optimal', trend: 'Variasi alami wajar' }
    ],
    responsibilities: [
      'Menghitung persentase susut riil per nomor batch/SPK',
      'Mendeteksi lonjakan susut di atas toleransi baku',
      'Mengaudit kesusutan antar mesin molen (Molen 1 vs Molen 2 vs Molen 3)',
      'Menghitung estimasi rupiah/kg akibat kelebihan susut tidak wajar'
    ]
  },
  {
    id: 'ai_validator_data',
    roleNumber: 3,
    name: 'Ratna Veritas, S.Stat',
    title: 'Validator Integritas Data Proses AI',
    roleCalling: 'Validator Integritas Data Proses',
    avatarInitials: 'RV',
    badgeColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    iconName: 'FileCheck',
    department: 'Tata Kelola Data & Anti-Discrepancy',
    specialization: 'Validasi Kebenaran, Akurasi Rumus, Kelengkapan SPK, & Kepatuhan Cut-Off BOS 09:00',
    description: 'Menjaga integritas angka di seluruh datasheet operasional. Menghentikan kesalahan ketik (human error), angka fiktif, inkonsistensi matematis, dan kelalaian otorisasi tanda tangan pejabat sebelum diajukan ke Akuntansi.',
    scope: [
      'Validasi matematis: Netto = Bruto - Tara & Hasil Jadi + Susut = Netto Bahan',
      'Pemeriksaan duplikasi nomor SPK, batch, dan nomor lot penerimaan',
      'Verifikasi jam submit laporan harian terhadap cut-off BOS 09:00 WIB',
      'Pengecekan kelengkapan 4 pilar tanda tangan otorisasi (Penimbang, Mandor, Ka. Gudang, Manager)'
    ],
    keyMetrics: [
      { label: 'Skor Integritas Data', value: '99.4%', status: 'optimal', trend: 'Standar audit lolos' },
      { label: 'Kepatuhan Cut-Off BOS', value: '100%', status: 'optimal', trend: 'Submit 08:45 WIB' },
      { label: 'Validasi SPK & TTD', value: '100% Lengkap', status: 'optimal', trend: 'Zero fraud' }
    ],
    responsibilities: [
      'Memverifikasi seluruh baris entri di kertas kerja DHP',
      'Menandai seketika jika ada nilai selisih tara atau angka minus tidak logis',
      'Mengecek kepatuhan serah terima data ke sistem BOS kantor pusat',
      'Mengunci data yang telah lolos validasi untuk mencegah modifikasi sepihak'
    ]
  },
  {
    id: 'ai_auditor_stock',
    roleNumber: 4,
    name: 'Bambang Logistiko',
    title: 'Auditor Stok, Kebutuhan & BSPP AI',
    roleCalling: 'Auditor Stock, Kebutuhan & BSPP',
    avatarInitials: 'BL',
    badgeColor: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    iconName: 'Boxes',
    department: 'Manajemen Rantai Pasok & Gudang Persediaan',
    specialization: 'Audit Stok Fisik vs Buku, Proyeksi Run-out Days, & Verifikasi Bukti Selisih Gudang (BSPP)',
    description: 'Terhubung ke platform Monitoring Stock Persediaan. Mengawasi agar stok tidak sampai kekeringan (stockout) yang menghentikan lini produksi, serta meniadakan selisih timbangan gudang tanpa BSPP yang sah.',
    scope: [
      'Stok fisik komoditas tembakau, krosok, cengkeh, dan hasil olah blend',
      'Sinkronisasi live data ke Web App Monitoring Stock Persediaan PP1',
      'Prediksi kecukupan bahan baku (Run-out Days) untuk rencana kerja mingguan',
      'Audit Bukti Selisih Penerimaan/Pengeluaran (BSPP) aktif dan riwayat penyelesaiannya'
    ],
    externalAppUrl: 'https://monitoring-stock-pp-1-pro-api.vercel.app/',
    externalAppName: 'Monitoring Stock Persediaan PP1 (Pro API)',
    keyMetrics: [
      { label: 'Akurasi Stok Opname', value: '99.98%', status: 'optimal', trend: 'Zero discrepansi' },
      { label: 'Kecukupan Stok Tbk', value: '14 Hari', status: 'optimal', trend: 'Di atas buffer 7 hari' },
      { label: 'BSPP Terbuka', value: '0 Berkas', status: 'optimal', trend: 'Semua terselesaikan' }
    ],
    responsibilities: [
      'Mencocokkan saldo fisik gudang dengan mutasi harian kartu stok',
      'Memproyeksikan kebutuhan bahan untuk SPK minggu berjalan',
      'Mengaudit setiap terbitnya BSPP agar tidak terjadi manipulasi selisih timbang',
      'Memberikan alarm dini jika stok mendekati batas minimum buffer'
    ]
  },
  {
    id: 'ai_hr_supervisor',
    roleNumber: 5,
    name: 'Dewi Personalia, S.Psi',
    title: 'HRD & Pengawas Tenaga Kerja AI',
    roleCalling: 'HRD & Pengawas Tenaga Kerja',
    avatarInitials: 'DP',
    badgeColor: 'bg-rose-500/20 text-rose-300 border-rose-500/40',
    iconName: 'UserCheck',
    department: 'Manajemen SDM & Tata Kerja Operasional',
    specialization: 'Presensi 32 Staf Pabrik, Kepatuhan Jobdesc 13 Jabatan (SK 01/2024), & Kesiapan Regu Lini',
    description: 'Terhubung ke platform HR Staff & Karyawan PP1. Memastikan setiap lini kerja memiliki mandor, admin, operator timbang, dan QC yang bertugas sesuai SK resmi tanpa ada kekosongan peran yang menurunkan mutu.',
    scope: [
      'Presensi kehadiran 32 staf resmi Divisi Produksi I (Pengolahan)',
      'Sinkronisasi live data ke Web App HR Staff & Karyawan PP1',
      'Kesesuaian tugas wewenang berdasarkan 13 Jabatan Organisasi',
      'Kesiapan personil per shift dan pengawasan lembur kerja'
    ],
    externalAppUrl: 'https://hr-staff-pp-1-pro-api.vercel.app/',
    externalAppName: 'HR Staff & Karyawan PP1 (Pro API)',
    keyMetrics: [
      { label: 'Presensi Staf Hari Ini', value: '96.9%', status: 'optimal', trend: '31/32 Hadir' },
      { label: 'Cakupan Posisi Kunci', value: '100%', status: 'optimal', trend: 'Semua lini ber-mandor' },
      { label: 'Kepatuhan Jobdesc', value: '98.0%', status: 'optimal', trend: 'Sesuai SK 01/2024' }
    ],
    responsibilities: [
      'Memantau absensi staf dan pekerja harian setiap pergantian shift',
      'Mendeteksi kekosongan operator pada mesin yang sedang berjalan',
      'Menyesuaikan penugasan dengan matriks kompetensi dan rotasi',
      'Memberikan rekomendasi rotasi atau bantuan personil antar-unit'
    ]
  },
  {
    id: 'ai_chief_advisor',
    roleNumber: 6,
    name: 'Aria Mahardika, M.M.',
    title: 'Penasihat Strategis Manajer Operasional AI',
    roleCalling: 'Penasihat Strategis Manajer Operasional',
    avatarInitials: 'AM',
    badgeColor: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    iconName: 'BrainCircuit',
    department: 'Executive Decision Support & Komando Operasional',
    specialization: 'Sintesis Multi-Dimensi 5 Auditor AI, Skor Kesehatan Pabrik, & Rekomendasi Keputusan Taktis',
    description: 'Mitra berpikir utama Manajer Operasional (Lalu Mahendra Ali Akbar). Menggabungkan data mutu, susut, akurasi dokumen, persediaan stok, dan presensi SDM menjadi 3 tindakan taktis harian yang solutif.',
    scope: [
      'Sintesis komprehensif dari 5 Auditor AI spesialis',
      'Kalkulasi Skor Indeks Kesehatan Pabrik (0 - 100)',
      'Penyusunan Executive One-Pager & Pesan Rekap WhatsApp Direksi',
      'Simulasi keputusan operasional berbasis skenario (What-If Analysis)'
    ],
    keyMetrics: [
      { label: 'Indeks Kesehatan Pabrik', value: '96.8 / 100', status: 'optimal', trend: 'Kategori Prima' },
      { label: 'Prioritas Taktis Aktif', value: '3 Aksi', status: 'warning', trend: 'Fokus hari ini' },
      { label: 'Tingkat Keyakinan Rekomendasi', value: '99.1%', status: 'optimal', trend: 'Grounded Data' }
    ],
    responsibilities: [
      'Menyatukan temuan audit dari 5 karyawan AI menjadi satu peta situasi',
      'Menetapkan skala prioritas masalah yang membutuhkan instruksi Manajer',
      'Menyiapkan teks laporan singkat untuk Direksi dan Manajer Akuntansi',
      'Menjawab pertanyaan analitis manajer terkait risiko operasional'
    ]
  }
];

const todayShortWib = formatWibShortDate(new Date());
const todayFullWib = formatWibFullDate(new Date());
const todayDateWib = formatWibDate(new Date());
const nowWib = formatWibTime(new Date());

export const INITIAL_MOISTURE_AUDITS: MoistureAuditItem[] = [
  {
    id: 'moist-01',
    materialName: 'Tembakau Rajang',
    lotOrBatch: 'SPK-TBK-Srintil (Temanggung)',
    currentMoisture: 12.4,
    targetMin: 11.5,
    targetIdeal: 12.5,
    targetMax: 13.0,
    deltaPercent: -0.1,
    status: 'OPTIMAL',
    riskType: 'Normal',
    testedBy: 'Hendri Irawan (QC)',
    timestamp: `${todayShortWib} 07:45 WIB`,
    aiFinding: 'Kadar air tembakau Temanggung Srintil 12.4% berada persis di zona emas (11.5% - 13.0%). Daun memiliki elastisitas tinggi dan tidak mudah patah saat masuk konveyor.',
    aiRecommendation: 'Pertahankan suhu silinder pemanas pada 78°C. Tidak perlu penambahan uap boiler.'
  },
  {
    id: 'moist-02',
    materialName: 'Cengkeh Rajang',
    lotOrBatch: 'CK-Lot-03 (Kotok Jatim)',
    currentMoisture: 13.7,
    targetMin: 12.0,
    targetIdeal: 12.8,
    targetMax: 13.5,
    deltaPercent: +0.2,
    status: 'PERLU_PENYESUAIAN',
    riskType: 'Jamur / Kelembapan Berlebih',
    testedBy: 'Dedik Anwar (QC)',
    timestamp: `${todayShortWib} 08:15 WIB`,
    aiFinding: 'Kadar air cengkeh rajang 13.7% melebihi batas atas rekomendasi (13.5%). Ada potensi penurunan daya rekat larutan saos dan peningkatan kelembapan di dalam karung simpan.',
    aiRecommendation: 'Lakukan aerasi tambahan selama 30 menit sebelum pencampuran saos di meja pengondisian. Pantau kelembapan ruang buffer.'
  },
  {
    id: 'moist-03',
    materialName: 'Krosok',
    lotOrBatch: 'LOT-KROSOK-01 (Madura)',
    currentMoisture: 14.2,
    targetMin: 13.0,
    targetIdeal: 13.8,
    targetMax: 14.5,
    deltaPercent: +0.4,
    status: 'OPTIMAL',
    riskType: 'Normal',
    testedBy: 'Bagus Permana (QC)',
    timestamp: `${todayShortWib} 08:30 WIB`,
    aiFinding: 'Krosok Madura Sumenep berada di batas aman 14.2% (maks 14.5%). Kondisi daun lemas elastis, sangat cocok untuk pemotongan mesin KT 2 tanpa remuk.',
    aiRecommendation: 'Lolos uji masuk gudang persediaan. Lanjutkan pengalokasian ke lini rajang KT 2.'
  },
  {
    id: 'moist-04',
    materialName: 'Hasil Blend Molen',
    lotOrBatch: 'BT-Blend-01 (153 - BK)',
    currentMoisture: 13.8,
    targetMin: 12.5,
    targetIdeal: 13.5,
    targetMax: 13.8,
    deltaPercent: 0.0,
    status: 'OPTIMAL',
    riskType: 'Normal',
    testedBy: 'Hendri Irawan (QC)',
    timestamp: `${todayShortWib} 09:10 WIB`,
    aiFinding: 'Hasil blend SKT 153-BK di Molen 1 mencapai KA 13.8%, sesuai target racikan. Saos merata sempurna dan aroma tembakau terkunci optimal.',
    aiRecommendation: 'Segera lakukan pengarungan dan tutup rapat dengan plastik sealer sebelum didistribusikan ke Divisi Produksi II.'
  }
];

export const INITIAL_SHRINKAGE_AUDITS: ShrinkageAuditItem[] = [
  {
    id: 'shrnk-01',
    materialName: 'Tembakau Blend 153-BK',
    lineOrMachine: 'Molen #1 (Kapasitas 500 Kg)',
    batchNumber: 'BT-20261007-01',
    rawWeightKg: 520.4,
    resultWeightKg: 513.8,
    actualShrinkageKg: 6.6,
    actualShrinkagePercent: 1.27,
    standardToleranceMaxPercent: 1.80,
    status: 'NORMAL',
    deviationKg: -2.76, // Di bawah batas toleransi (efisien)
    mandorInCharge: 'Surya Ning Sasi',
    aiFinding: 'Susut 1.27% sangat ideal dan wajar untuk racikan 153-BK. Variasi susut antar molen terbukti organik dan tidak menunjukkan pola seragam buatan.',
    aiRecommendation: 'Pertahankan durasi putar 18 menit dan tekanan spuyer saos saat ini.'
  },
  {
    id: 'shrnk-02',
    materialName: 'Tembakau Blend KARANG-BK',
    lineOrMachine: 'Molen #1 (Kapasitas 500 Kg)',
    batchNumber: 'BT-20261007-04',
    rawWeightKg: 530.0,
    resultWeightKg: 521.8,
    actualShrinkageKg: 8.2,
    actualShrinkagePercent: 1.55,
    standardToleranceMaxPercent: 1.80,
    status: 'MENDEKATI_BATAS',
    deviationKg: -1.34,
    mandorInCharge: 'Surya Ning Sasi',
    aiFinding: 'Susut 1.55% berada di kuartil atas toleransi (1.80%). Ditemukan catatan spuyer sempat dibersihkan di tengah proses karena residu saos pekat.',
    aiRecommendation: 'Lakukan flushing nozzle spuyer sebelum memulai batch Karang berikutnya agar tidak ada saos yang terbuang menempel di dinding drum.'
  },
  {
    id: 'shrnk-03',
    materialName: 'Tembakau Temanggung Srintil',
    lineOrMachine: 'Mesin Rajang KT 2',
    batchNumber: 'TBK-20261007-01',
    rawWeightKg: 650.0,
    resultWeightKg: 641.8,
    actualShrinkageKg: 8.2,
    actualShrinkagePercent: 1.26,
    standardToleranceMaxPercent: 2.50,
    status: 'NORMAL',
    deviationKg: -8.05,
    mandorInCharge: 'Yayan Rudianto',
    aiFinding: 'Susut rajang tembakau 1.26% jauh di bawah toleransi 2.50%. Debu rajang yang tertangkap siklon hanya 1.8 Kg, menunjukkan pisau rajang baru bekerja dengan ketajaman presisi.',
    aiRecommendation: 'Kondisi pisau sangat prima. Catat jam kerja pisau untuk jadwal asah berkala.'
  },
  {
    id: 'shrnk-04',
    materialName: 'Cengkeh Manado Super',
    lineOrMachine: 'Lini Rajang Cengkeh #1',
    batchNumber: 'CK-20261007-01',
    rawWeightKg: 350.0,
    resultWeightKg: 335.5,
    actualShrinkageKg: 4.1,
    actualShrinkagePercent: 1.17,
    standardToleranceMaxPercent: 2.00,
    status: 'NORMAL',
    deviationKg: -2.90,
    mandorInCharge: 'Doni Irwan Himawan',
    aiFinding: 'Pemisahan tangkai cengkeh 10.4 Kg berhasil memurnikan bunga cengkeh tanpa susut liar. Susut bersih rajang 1.17% terkontrol sangat baik.',
    aiRecommendation: 'Timbang tangkai terpisah dan kirimkan ke gudang bahan pembantu untuk pencatatan DHP.'
  }
];

export const INITIAL_DATA_TRUTH_AUDITS: DataTruthAuditItem[] = [
  {
    id: 'truth-01',
    documentType: 'DHP Tembakau',
    referenceNo: 'SPK-TBK-Srintil-01',
    checkTimestamp: `${todayShortWib} 08:30 WIB`,
    testedRule: 'Matematika Timbangan Baku vs Hasil Jadi & Otorisasi 4 Pilar',
    formulaCheckStatus: 'VALID',
    spkStatus: 'TERDAFTAR_VALID',
    cutoffStatus: 'TEPAT_WAKTU (<09:00)',
    authorizationSignatures: {
      penimbang: true,
      mandor: true,
      kaGudang: true,
      managerOps: true
    },
    accuracyScore: 100,
    aiVerdict: 'LOLOS_VERIFIKASI',
    anomalyDetail: 'Semua rumus: Bruto 730 Kg - Tara 80 Kg = Netto 650 Kg, Hasil Olah 641.8 Kg + Susut 8.2 Kg = 650.0 Kg (Tepat Sempurna 100%).'
  },
  {
    id: 'truth-02',
    documentType: 'DHP Blend Molen',
    referenceNo: 'BT-Blend-01 s/d 04',
    checkTimestamp: `${todayShortWib} 08:45 WIB`,
    testedRule: 'Kepatuhan Penyerahan Laporan Administrasi BOS Sebelum 09:00 WIB',
    formulaCheckStatus: 'VALID',
    spkStatus: 'TERDAFTAR_VALID',
    cutoffStatus: 'TEPAT_WAKTU (<09:00)',
    authorizationSignatures: {
      penimbang: true,
      mandor: true,
      kaGudang: true,
      managerOps: true
    },
    accuracyScore: 99.8,
    aiVerdict: 'LOLOS_VERIFIKASI',
    anomalyDetail: 'Diserahkan oleh Agustin Wulandari pada pukul 08:45 WIB (15 menit sebelum batas cut-off 09:00 WIB). Selisih timbangan vs BOS = 0 Kg.'
  },
  {
    id: 'truth-03',
    documentType: 'DHP Cengkeh',
    referenceNo: 'CK-Rajang-01',
    checkTimestamp: `${todayShortWib} 08:50 WIB`,
    testedRule: 'Verifikasi Pemisahan Tangkai Kasar vs Susut Rajang',
    formulaCheckStatus: 'VALID',
    spkStatus: 'TERDAFTAR_VALID',
    cutoffStatus: 'TEPAT_WAKTU (<09:00)',
    authorizationSignatures: {
      penimbang: true,
      mandor: true,
      kaGudang: true,
      managerOps: true
    },
    accuracyScore: 100,
    aiVerdict: 'LOLOS_VERIFIKASI',
    anomalyDetail: 'Netto Baku 350 Kg = Hasil Bersih 335.5 Kg + Tangkai 10.4 Kg + Susut 4.1 Kg. Neraca massa seimbang 100%.'
  }
];

export const INITIAL_STOCK_BSPP_AUDITS: StockBsppAuditItem[] = [
  {
    id: 'stock-01',
    materialName: 'Tembakau Grade Srintil & Madura',
    warehouseLocation: 'Gudang Kecil Tembakau & Gudang Persediaan 1',
    systemStockKg: 14850.0,
    physicalStockKg: 14848.5,
    discrepancyKg: -1.5,
    dailyBurnRateKg: 1100.0,
    estimatedDaysCover: 13.5,
    minimumBufferKg: 6500.0,
    stockStatus: 'AMAN',
    activeBsppCount: 0,
    bsppNotes: 'Selisih -1.5 Kg (-0.01%) masuk dalam toleransi wajar susut penguapan alami. Zero berkas BSPP sengketa.',
    aiProcurementAdvice: 'Stok cukup untuk produksi hingga 21 Oktober 2026. Lakukan pesanan PO berikutnya pada tanggal 16 Oktober.'
  },
  {
    id: 'stock-02',
    materialName: 'Cengkeh Rajangan Kering',
    warehouseLocation: 'Gudang Persediaan Cengkeh (Kecil)',
    systemStockKg: 3420.0,
    physicalStockKg: 3420.0,
    discrepancyKg: 0.0,
    dailyBurnRateKg: 280.0,
    estimatedDaysCover: 12.2,
    minimumBufferKg: 1500.0,
    stockStatus: 'AMAN',
    activeBsppCount: 0,
    bsppNotes: 'Fisik dan kartu stok 100% sinkron (Zero Discrepancy). Karung bertingkat dengan label nomor batch jelas.',
    aiProcurementAdvice: 'Suplai cengkeh Manado & Ambon stabil. Aman untuk jadwal blending minggu depan.'
  },
  {
    id: 'stock-03',
    materialName: 'Krosok Bal Rajang',
    warehouseLocation: 'Gudang Persediaan 3',
    systemStockKg: 8900.0,
    physicalStockKg: 8900.0,
    discrepancyKg: 0.0,
    dailyBurnRateKg: 950.0,
    estimatedDaysCover: 9.3,
    minimumBufferKg: 4000.0,
    stockStatus: 'AMAN',
    activeBsppCount: 0,
    bsppNotes: 'Palet bal tersusun rapi menggunakan sistem FIFO. Bebas dari serangan hama dan genangan air.',
    aiProcurementAdvice: 'Alokasikan 2.5 ton krosok untuk persiapan running mesin rajangan akhir pekan.'
  }
];

export const INITIAL_HR_AUDITS: HrAttendanceAuditItem[] = [
  {
    id: 'hr-01',
    unitLine: 'Lini Proses Blend (Molen 1, 2, 3)',
    requiredHeadcount: 8,
    presentHeadcount: 8,
    keyStaffAssigned: [
      { roleTitle: 'Plt. Ka. Pengolahan 2', staffName: 'Andhik Dharmabakti', status: 'HADIR' },
      { roleTitle: 'Mandor Proses Blend', staffName: 'Surya Ning Sasi', status: 'HADIR' },
      { roleTitle: 'Mandor Pendamping Blend', staffName: 'Ogik Indrawan', status: 'HADIR' },
      { roleTitle: 'Admin Proses Blend', staffName: 'May Yesi Triana Putri', status: 'HADIR' }
    ],
    lineCoverageScore: 100,
    shiftStatus: 'SIAP_PENUH',
    jobdescComplianceScore: 100,
    aiObservation: 'Lini blend beroperasi dengan formasi komplit. Supervisi mandor dan pencatatan admin berjalan sinkron.'
  },
  {
    id: 'hr-02',
    unitLine: 'Lini Proses Tembakau & Rajang',
    requiredHeadcount: 6,
    presentHeadcount: 6,
    keyStaffAssigned: [
      { roleTitle: 'Mandor Proses Tembakau', staffName: 'Yayan Rudianto', status: 'HADIR' },
      { roleTitle: 'Mandor Pendamping Tembakau', staffName: 'Adi Tri Vianto', status: 'HADIR' },
      { roleTitle: 'Admin Tembakau', staffName: 'Restika', status: 'HADIR' },
      { roleTitle: 'QC Tembakau', staffName: 'Bagus Permana', status: 'HADIR' }
    ],
    lineCoverageScore: 100,
    shiftStatus: 'SIAP_PENUH',
    jobdescComplianceScore: 98,
    aiObservation: 'Operator timbang dan mandor hadir tepat waktu sebelum jam start mesin (06:45 WIB).'
  },
  {
    id: 'hr-03',
    unitLine: 'Gudang Persediaan 1 & Administrasi',
    requiredHeadcount: 5,
    presentHeadcount: 5,
    keyStaffAssigned: [
      { roleTitle: 'Plt. Ka. Gudang Persediaan 1', staffName: 'Yulia Wardana', status: 'HADIR' },
      { roleTitle: 'Kepala Administrasi 1', staffName: 'Agustin Wulandari', status: 'HADIR' },
      { roleTitle: 'Mandor Gudang Tbk/Krosok', staffName: 'Teguh Andrias', status: 'HADIR' }
    ],
    lineCoverageScore: 100,
    shiftStatus: 'SIAP_PENUH',
    jobdescComplianceScore: 100,
    aiObservation: 'SOP Cut-off penyerahan data BOS jam 09:00 terpenuhi tanpa kendala personil.'
  }
];

export const INITIAL_EXECUTIVE_BRIEFING: ExecutiveDecisionBriefing = {
  generatedAt: `${todayFullWib} &bull; ${nowWib}`,
  period: `Shift Operasional Aktif • ${todayDateWib}`,
  factoryHealthIndex: 96.8,
  overallStatus: 'PRIMA',
  managerInCharge: 'Lalu Mahendra Ali Akbar (Manajer Operasional Produksi I)',
  topAnomalies: [
    {
      category: 'Mutu / Kadar Air',
      severity: 'SEDANG',
      summary: 'Kadar air cengkeh Lot CK-03 terdeteksi 13.7% (+0.2% di atas standar ideal 13.5%).',
      assignedAiRole: 'Ir. Tirta Wardhana (Auditor Kadar Air)'
    },
    {
      category: 'Susut Mesin Molen',
      severity: 'RENDAH',
      summary: 'Kesusutan batch Karang-BK di Molen 1 mencapai 1.55% akibat residu saos pekat di dinding drum.',
      assignedAiRole: 'Dr. Susanto Efendi (Auditor Kesusutan)'
    },
    {
      category: 'Integrasi Data',
      severity: 'RENDAH',
      summary: 'Seluruh 4 pilar tanda tangan otorisasi DHP lengkap sebelum batas cut-off BOS 09:00 WIB.',
      assignedAiRole: 'Ratna Veritas (Validator Data)'
    }
  ],
  tacticalRecommendations: [
    {
      priority: 1,
      title: 'Instruksikan Pengondisian Aerasi Tambahan Cengkeh Lot CK-03 (30 Menit)',
      impactArea: 'Mutu Rasa & Daya Tahan Saos',
      rationale: 'Kadar air 13.7% jika langsung disaos dapat mengurangi absorbsi minyak atsiri dan mempercepat resiko jamur pada masa simpan karung blend.',
      actionSteps: [
        'Hubungi Mandor Cengkeh Doni Irwan Himawan untuk menunda transfer ke Molen selama 30 menit.',
        'Jalankan kipas aerasi di Meja Sortir #1 hingga KA turun ke rentang 13.0% - 13.2%.',
        'Lakukan uji sampling ulang oleh QC Dedik Anwar.'
      ],
      deadline: '10:00 WIB Hari Ini',
      responsibleStaff: 'Plt. Ka. Pengolahan 2 (Andhik D.) & Mandor Cengkeh (Doni I.)'
    },
    {
      priority: 2,
      title: 'Pembersihan Siklus Menengah (Interim Flushing) Nozzle Spuyer Molen #1',
      impactArea: 'Penekanan Kesusutan Blend',
      rationale: 'Residu saos pada batch Karang-BK berpotensi menaikkan susut batch berikutnya di atas 1.65%.',
      actionSteps: [
        'Lakukan penyemprotan air hangat bertekanan pada nozel casing Molen 1 saat jeda pergantian batch jam 11:30 WIB.',
        'Periksa kerataan semprotan piringan casing sebelum memuat tembakau 153-BK berikutnya.'
      ],
      deadline: '11:45 WIB Hari Ini',
      responsibleStaff: 'Mandor Blend (Surya Ning Sasi) & Mekanik Mesin (Heri Pribadi)'
    },
    {
      priority: 3,
      title: 'Validasi Persiapan Rencana Alokasi Krosok untuk Target Produksi Lini Rajang',
      impactArea: 'Keamanan Pasokan Gudang Persediaan',
      rationale: 'Run-out days krosok berada pada 9.3 hari. Mutasi 2.5 ton krosok ke lini rajang perlu disiapkan sore ini.',
      actionSteps: [
        'Koordinasikan Surat Jalan Intern mutasi antar gudang dengan Plt. Ka. Gudang Yulia Wardana.',
        'Pastikan bal krosok yang diambil menggunakan lot tertua (FIFO Lot-01 & Lot-02).'
      ],
      deadline: '15:00 WIB Sore Ini',
      responsibleStaff: 'Plt. Ka. Gudang Persediaan 1 (Yulia W.) & Ka. Administrasi 1 (Agustin W.)'
    }
  ],
  whatsAppBriefingText: `*LAPORAN EKSEKUTIF BRIEFING HARIAN PABRIK PENGOLAHAN (PP1)*
*PT BATU KARANG - DIVISI PRODUKSI I*
Tanggal: ${todayDateWib} | Cut-Off: 09:00 WIB
Manajer Operasional: Lalu Mahendra Ali Akbar

📊 *Indeks Kesehatan Pabrik:* 96.8 / 100 (STATUS: PRIMA)
👥 *Presensi Staf:* 31 / 32 Hadir (96.9%) - Seluruh 13 Jabatan Terisi

🔍 *HASIL AUDIT DEWAN 6 KARYAWAN AI:*
1. *Kadar Air (Ir. Tirta):* Rerata KA Blend 13.3% (Optimal). Cengkeh Lot-03 terdeteksi 13.7% (diberikan arahan aerasi 30 menit).
2. *Kesusutan (Dr. Susanto):* Susut blend 1.34% (Aman di bawah toleransi 1.80%). Zero kecurangan susut seragam.
3. *Akurasi Data (Ratna Veritas):* 100% data DHP tervalidasi matematis & lolos cut-off BOS 09:00 WIB.
4. *Stok & BSPP (Bambang Logistiko):* Stok tembakau & cengkeh aman untuk 12-14 hari produksi. BSPP aktif: 0 (Zero selisih).
5. *SDM & Presensi (Dewi Personalia):* Lini rajang & molen beroperasi penuh tanpa kekosongan mandor.
6. *Rekomendasi Manajer (Aria Mahardika):* Lakukan pembersihan interim spuyer Molen 1 jam 11:30 dan aerasi cengkeh sebelum disaos.

_Dilaporkan otomatis oleh Dewan Karyawan AI Pabrik PP1 terintegrasi._`
};
