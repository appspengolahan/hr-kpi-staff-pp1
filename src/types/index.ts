export type RoleId = 
  | 'mgr_ops'
  | 'ka_pengolahan2'
  | 'ka_admin1'
  | 'ka_gudang_pers1'
  | 'mandor_blend'
  | 'mandor_tembakau'
  | 'mandor_cengkeh'
  | 'mandor_gudang_tbk'
  | 'qc_staff'
  | 'admin_blend'
  | 'admin_cengkeh'
  | 'admin_tembakau'
  | 'mekanik_operator';

export interface PositionInfo {
  id: RoleId;
  title: string;
  incumbentName?: string;
  department: string;
  directSupervisor: string;
  subordinates: string[];
  operationalScope: string;
  summary: string;
  duties: string[];
  authorities: string[];
  dualAccountability: {
    primaryResponsibility: string;
    secondaryResponsibility: string;
    conditions: string;
  };
  interDepartmentRelations: {
    partnerRole: string;
    focusAreas: string[];
    criticalCheckpoints: string[];
  }[];
}

export type KpiCategory = 'Kualitas' | 'Produktivitas' | 'Efisiensi' | 'Administrasi' | 'Disiplin & K3';

export interface KpiMetric {
  id: string;
  roleId: RoleId;
  code: string;
  name: string;
  category: KpiCategory;
  description: string;
  formula: string;
  target: string;
  unit: string;
  weight: number; // percentage, e.g. 20
  frequency: 'Harian (Real-Time)' | 'Mingguan' | 'Bulanan' | 'Per Batch' | 'Bulanan / Stok Opname';
  dataSource: string;
  escalationRule: string;
  benchmarkGood: string;
  benchmarkPoor: string;
}

export interface MolenBatchLog {
  id: string;
  batchNumber: string;
  molenId: string; // Molen 1, Molen 2, Molen 3
  blendType: '153 - BK' | 'SP 153 - BK' | 'KARANG - BK' | 'TIS - KBT24' | 'F Reguler 153 Hijau - BK' | 'F Reguler LA BOLD - BK';
  rawWeightInKg: number; // Tembakau + Krosok + Cengkeh + Saos
  resultWeightKg: number;
  shrinkageKg: number;
  shrinkagePercentage: number;
  rotationDurationMinutes: number;
  rotationTargetMinutes: number;
  spuyerStatus: 'Lancar' | 'Ada Sumbatan' | 'Dibersihkan';
  sauceEvenness: 'Sangat Rata' | 'Cukup Rata' | 'Kurang Rata';
  mixUniformity: 'Homogen' | 'Cukup' | 'Kurang';
  moistureContentPercent: number; // Kadar air, misal 13.5%
  moistureTargetPercent: number;
  qcInitialStatus: 'Passed' | 'Caution' | 'Rejected';
  qcFinalStatus: 'Approved' | 'Retur/Reject';
  mandorName: string;
  operatorName: string;
  notes?: string;
}

export interface TobaccoProcessBatchLog {
  id: string;
  batchNumber: string;
  machineId: 'Mesin Rajang KT 2' | 'Mesin Rajang RC 4' | 'Mesin Primery #1' | 'Mesin Primery #2';
  tobaccoGrade: 'Madura Voor-Oogst' | 'Temanggung Srintil Super' | 'Virginia FC Ekstra' | 'Boyolali Rajangan' | 'Weleri Halus';
  rawWeightInKg: number;
  resultWeightKg: number;
  shrinkageKg: number;
  shrinkagePercentage: number;
  cutWidthMm: number; // e.g. 0.65 mm
  steamTempCelsius: number; // e.g. 78 C
  moisturePercent: number;
  bladeSharpness: 'Sangat Tajam (Baru)' | 'Optimal' | 'Perlu Diasah';
  qcStatus: 'Approved' | 'Caution' | 'Lolos Verifikasi';
  mandorName: string;
  operatorName: string;
  qcStaffName: string;
  notes?: string;
}

export interface CloveProcessBatchLog {
  id: string;
  batchNumber: string;
  lineId: 'Lini Rajang Cengkeh #1' | 'Lini Rajang Cengkeh #2' | 'Meja Sortir Tangkai #1';
  cloveOrigin: 'Cengkeh Manado Super' | 'Cengkeh Zanzibar Ambon' | 'Cengkeh Kotok Jawa Timur' | 'Cengkeh Bali Pilihan';
  rawWeightInKg: number;
  cleanCutResultKg: number;
  stemsSeparatedKg: number; // Gagang/tangkai yang dipisahkan
  shrinkageKg: number;
  shrinkagePercentage: number;
  moisturePercent: number; // Target 12.5% - 13.5%
  aromaProfile: 'Aroma Minyak Atsiri Kuat' | 'Normal' | 'Kurang Tajam';
  bladeCondition: 'Tajam & Bersih' | 'Dibersihkan Berkala';
  qcStatus: 'Approved' | 'Caution' | 'Lolos Verifikasi';
  mandorName: string;
  operatorName: string;
  adminName: string;
  notes?: string;
}

export interface KrosokWarehouseLog {
  id: string;
  lotNumber: string;
  warehouseId: 'Gudang Kecil Tembakau & Krosok' | 'Gudang Persediaan 1' | 'Gudang Persediaan 3';
  originSupplier: 'Kemitraan Madura Sumenep' | 'Petani Sindoro Temanggung' | 'Sentra Lombok Timur' | 'Mitra Bojonegoro';
  krosokType: 'Krosok Daun Bawah (Kaki)' | 'Krosok Daun Tengah (Tengah)' | 'Krosok Daun Atas (Pucuk Super)';
  totalBales: number; // Jumlah koli/bal
  receivedWeightKg: number;
  moisturePercent: number;
  sortingStatus: 'Lolos Sortir Kering' | 'Proses Aerasi' | 'Sortir Gagang Kasar';
  allocatedMachine: 'Siap Rajang KT 2' | 'Siap Rajang RC 4' | 'Buffer Stok Pematangan';
  qcStatus: 'Approved Masuk' | 'Lolos Uji Lab' | 'Karantina Fisik';
  kepalaGudang: string;
  mandorGudang: string;
  adminGudang: string;
  qcStaff: string;
  notes?: string;
}

export interface DailyAdminLog {
  id: string;
  date: string;
  reportType: 'Laporan Hasil Blend' | 'Laporan Gudang' | 'Laporan Bea Cukai CK-5' | 'Stok Opname';
  preparedBy: string;
  submittedToAccountingTime: string; // e.g. "08:45 WIB"
  isBeforeDeadline: boolean; // Deadline is 09:00 WIB
  bosInputDiscrepancyKg: number; // Selisih timbangan vs BOS
  status: 'Tervalidasi' | 'Revisi' | 'Terlambat';
}

export interface StaffPerformanceRecord {
  roleId: RoleId;
  staffName: string;
  period: string;
  kpiScores: {
    kpiId: string;
    metricName: string;
    targetValue: number;
    actualValue: number;
    weight: number;
    score: number; // 0 - 100
    weightedScore: number;
  }[];
  totalScore: number;
  grade: 'A (Sangat Baik)' | 'B (Baik / Standar)' | 'C (Perlu Pembinaan)' | 'D (Kritis / Sanksi)';
  managerialAction: string;
}

export type IntegrationProtocol = 'REST API / Webhook' | 'MQTT / IoT Sensor' | 'RS-232 / TCP Socket' | 'Database Query / CDC' | 'Barcode / RFID Scanner';

export interface DataIntegrationSource {
  id: string;
  sourceName: string;
  category: 'Timbangan Digital' | 'Sistem ERP (BOS)' | 'IoT Mesin Molen' | 'Instrumen Lab QC' | 'Scanner Barcode' | 'Presensi HRIS' | 'Bea Cukai';
  deviceOrApp: string;
  protocol: IntegrationProtocol;
  frequency: 'Real-time (Detik/Event)' | 'Per Batch Selesai' | 'Per Transaksi Masuk/Keluar' | 'Harian (09:00 WIB Cut-Off)';
  dataPayloadFields: {
    field: string;
    type: string;
    description: string;
    example: string;
  }[];
  automatedKpis: {
    kpiCode: string;
    kpiName: string;
    targetRole: string;
    automatedCalculation: string;
  }[];
  businessImpact: string;
  status: 'Terkoneksi' | 'Siap Terhubung' | 'Perlu Konverter';
}

export interface TelemetryStreamEvent {
  id: string;
  timestamp: string;
  sourceCategory: string;
  deviceName: string;
  eventDescription: string;
  kpiCodeAffected: string;
  payloadSummary: string;
  integrityCheck: 'Valid & Lolos' | 'Perlu Perhatian' | 'Anomali Terdeteksi';
}

export type StaffActionType = 'Rotasi / Rolling' | 'Mutasi' | 'Promosi' | 'Degradasi / Demosi' | 'Pelimpahan HRD II';

export interface PersonnelAssignment {
  roleId: RoleId;
  roleTitle: string;
  currentStaffName: string;
  nik?: string;
  unit: string;
  status: 'Aktif' | 'Rotasi' | 'Plt / Pjs' | 'Lowong';
  effectiveDate: string;
  lastAction: StaffActionType;
  decreeNumber: string;
  notes?: string;
}

export interface RotationHistoryItem {
  id: string;
  date: string;
  roleId: RoleId;
  roleTitle: string;
  previousStaff: string;
  newStaff: string;
  actionType: StaffActionType;
  decreeNumber: string;
  reason: string;
  approvedBy: string;
}


