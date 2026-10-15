import { DataIntegrationSource, TelemetryStreamEvent } from '../types';

export const INTEGRATION_SOURCES_DATA: DataIntegrationSource[] = [
  {
    id: 'source_scale',
    sourceName: 'Timbangan Digital Lantai & Indikator IoT (RS-232 / TCP)',
    category: 'Timbangan Digital',
    deviceOrApp: 'Digital Floor Scales (Tera Metrologi) di Sekup Gudang & Sekup Proses',
    protocol: 'RS-232 / TCP Socket',
    frequency: 'Per Transaksi Masuk/Keluar',
    dataPayloadFields: [
      { field: 'scale_id', type: 'string', description: 'ID Timbangan (Gudang-1, Proses-Molen1, Timbang-Karung)', example: 'SCALE-PRC-01' },
      { field: 'tare_kg', type: 'float', description: 'Berat wadah/keranjang/karung kosong', example: '1.20' },
      { field: 'gross_kg', type: 'float', description: 'Berat kotor total', example: '51.20' },
      { field: 'net_kg', type: 'float', description: 'Berat netto riil bahan tembakau', example: '50.00' },
      { field: 'batch_no', type: 'string', description: 'Nomor batch molen yang bersangkutan', example: 'BT-20261007-01' },
      { field: 'timestamp', type: 'datetime', description: 'Waktu presisi penimbangan tercatat', example: '2026-10-07 10:14:32' }
    ],
    automatedKpis: [
      { kpiCode: 'KP-BLD-02', kpiName: 'Validitas Data Susut Antar Molen', targetRole: 'Kepala Proses Blend', automatedCalculation: 'Sistem mengurangkan total berat masuk vs total berat keluar per batch molen untuk menghasilkan rasio susut riil otomatis.' },
      { kpiCode: 'MGR-OPS-02', kpiName: 'Rasio Kesusutan Divisi', targetRole: 'Manager Operasional', automatedCalculation: 'Agregasi akumulatif susut bahan bulanan dibandingkan total bahan baku masuk.' },
      { kpiCode: 'KG-STR-02', kpiName: 'Akurasi Penimbangan Masuk & Keluar', targetRole: 'Kepala Gudang Kecil', automatedCalculation: 'Sistem membandingkan angka timbangan lantai vs bobot surat jalan pengirim; selisih > 0.05% otomatis flagged.' },
      { kpiCode: 'MND-PRC-03', kpiName: 'Ketepatan Timbang Karung Hasil', targetRole: 'Mandor Proses Blend', automatedCalculation: 'Menghitung deviasi berat per karung terhadap target standar per koli (50.0 Kg).' }
    ],
    businessImpact: 'Menghilangkan pencatatan manual di kertas, mencegah rekayasa kesusutan seragam fiktif antar molen, dan memastikan keakuratan stok tembakau hingga desimal 0.1 Kg.',
    status: 'Terkoneksi'
  },
  {
    id: 'source_bos_erp',
    sourceName: 'Program BOS Perusahaan (Sistem ERP & Inventory Akuntansi)',
    category: 'Sistem ERP (BOS)',
    deviceOrApp: 'Server Database BOS PT. Batu Karang (Modul Persediaan & Pengolahan)',
    protocol: 'REST API / Webhook',
    frequency: 'Harian (09:00 WIB Cut-Off)',
    dataPayloadFields: [
      { field: 'transaction_id', type: 'string', description: 'ID transaksi perpindahan bahan', example: 'TRX-BOS-99201' },
      { field: 'doc_type', type: 'string', description: 'Tipe: Penerimaan, Pengeluaran Proses, Blend Jadi, Karung', example: 'HASIL_BLEND' },
      { field: 'sync_timestamp', type: 'datetime', description: 'Waktu staf men-submit data ke sistem BOS', example: '2026-10-07 08:35:10' },
      { field: 'inputted_by', type: 'string', description: 'User login staf administrasi', example: 'suryaning_admin' },
      { field: 'qty_system_kg', type: 'float', description: 'Jumlah tercatat di BOS', example: '513.80' },
      { field: 'is_revised', type: 'boolean', description: 'Apakah dokumen mengalami revisi/koreksi entri', example: 'false' }
    ],
    automatedKpis: [
      { kpiCode: 'ADM-BOS-01', kpiName: 'Ketepatan Laporan ke Akuntansi (Deadline 09:00 WIB)', targetRole: 'Kepala Administrasi 2', automatedCalculation: 'Otomatis bernilai 100% jika sync_timestamp < 09:00:00 WIB keesokan harinya; otomatis penalti jika terlambat.' },
      { kpiCode: 'ADM-BOS-02', kpiName: 'Akurasi Validasi Data BOS', targetRole: 'Kepala Administrasi 2', automatedCalculation: 'Dihitung dari persentase transaksi yang berstatus is_revised == false.' },
      { kpiCode: 'KG-STR-01', kpiName: 'Akurasi Stok Opname (Zero Discrepancy)', targetRole: 'Kepala Gudang Kecil', automatedCalculation: 'Membandingkan saldo buku di BOS dengan hasil penimbangan fisik saat stok opname berkala.' }
    ],
    businessImpact: 'Memastikan koordinasi antara Sekup Administrasi dengan Manager Akuntansi & Perpajakan 1 (Andi Adra A) berjalan tertib dan bebas keterlambatan.',
    status: 'Terkoneksi'
  },
  {
    id: 'source_iot_molen',
    sourceName: 'Sensor IoT Telemetri Mesin Molen & Nozzle Spuyer',
    category: 'IoT Mesin Molen',
    deviceOrApp: 'Edge Gateway IoT + Current Sensor + Pressure Switch pada Pipa Saos Molen 1, 2, 3',
    protocol: 'MQTT / IoT Sensor',
    frequency: 'Real-time (Detik/Event)',
    dataPayloadFields: [
      { field: 'molen_id', type: 'string', description: 'Identitas mesin molen', example: 'MOLEN-01' },
      { field: 'rotation_start', type: 'datetime', description: 'Waktu drum molen mulai berputar', example: '2026-10-07 09:15:00' },
      { field: 'rotation_stop', type: 'datetime', description: 'Waktu drum molen berhenti berputar', example: '2026-10-07 09:33:00' },
      { field: 'duration_minutes', type: 'float', description: 'Durasi pemutaran riil terukur otomatis', example: '18.0' },
      { field: 'target_duration_minutes', type: 'float', description: 'Durasi standar sesuai formula Pruf varietas', example: '18.0' },
      { field: 'spuyer_pressure_bar', type: 'float', description: 'Tekanan semprot saos casing/top saos', example: '3.8' },
      { field: 'spuyer_blocked_flag', type: 'boolean', description: 'Indikasi tekanan abnormal (penyumbatan spuyer)', example: 'false' }
    ],
    automatedKpis: [
      { kpiCode: 'KP-BLD-01', kpiName: 'Kepatuhan Siklus Proses Molen', targetRole: 'Kepala Proses Blend', automatedCalculation: 'Toleransi durasi riil vs target maksimal ± 60 detik. Diluar itu tercatat deviasi otomatis.' },
      { kpiCode: 'MND-PRC-01', kpiName: 'Kepatuhan Waktu Putar Molen Mandor', targetRole: 'Mandor Proses Blend', automatedCalculation: 'Persentase batch dengan durasi putar tepat sesuai target tanpa campur tangan manipulasi.' },
      { kpiCode: 'MND-PRC-02', kpiName: 'Pemeriksaan Spuyer Bebas Mampet', targetRole: 'Mandor Proses Blend', automatedCalculation: 'Sensor tekanan mendeteksi spuyer tersumbat secara otomatis tanpa menunggu inspeksi manual.' }
    ],
    businessImpact: 'Menghilangkan dugaan pengurangan waktu putar molen oleh operator, menjamin homogenitas saos tembakau, dan melindungi kualitas rasa khas rokok 153.',
    status: 'Siap Terhubung'
  },
  {
    id: 'source_lab_qc',
    sourceName: 'Digital Moisture Analyzer & Tablet Form QC Lapangan',
    category: 'Instrumen Lab QC',
    deviceOrApp: 'Halogen Moisture Analyzer (Lab QC) & Tablet Digital Inspeksi QC Blend',
    protocol: 'REST API / Webhook',
    frequency: 'Per Batch Selesai',
    dataPayloadFields: [
      { field: 'sample_id', type: 'string', description: 'ID Sampel uji laboratorium', example: 'SMPL-QC-153-09' },
      { field: 'batch_no', type: 'string', description: 'Nomor batch molen yang diuji', example: 'BT-20261007-01' },
      { field: 'moisture_percent', type: 'float', description: 'Kadar air tembakau blend terukur digital', example: '13.8' },
      { field: 'sauce_uniformity_score', type: 'int', description: 'Skor organoleptik kerataan saos (1-100)', example: '96' },
      { field: 'qc_verdict', type: 'string', description: 'Keputusan: Approved, Caution, Retur/Reject', example: 'Approved' },
      { field: 'retur_issue_duration_mins', type: 'int', description: 'Kecepatan terbit form retur jika reject', example: '15' }
    ],
    automatedKpis: [
      { kpiCode: 'QC-INS-02', kpiName: 'Kesesuaian Standar Kadar Air & Saos', targetRole: 'Kepala QC (Blend)', automatedCalculation: 'Otomatis dihitung persentase sampel yang berada dalam rentang toleransi standar (13.0% - 14.5%).' },
      { kpiCode: 'KP-BLD-03', kpiName: 'Tingkat Kelulusan Uji Awal Mutu', targetRole: 'Kepala Proses Blend', automatedCalculation: 'Terkait langsung dengan status verifikasi pertama sebelum pengemasan karung.' },
      { kpiCode: 'QC-INS-04', kpiName: 'Kecepatan Penerbitan Instruksi Retur', targetRole: 'Kepala QC (Blend)', automatedCalculation: 'Otomatis mengukur selisih waktu dari deteksi bahan cacat hingga form retur digital dikirim.' }
    ],
    businessImpact: 'Mencegah tembakau blend yang terlalu basah (berisiko jamur) atau terlalu kering (hancur/serbuk saat dilinting di Produksi II).',
    status: 'Terkoneksi'
  },
  {
    id: 'source_barcode_rfid',
    sourceName: 'Handheld Barcode / QR Scanner Label Karung & Gudang',
    category: 'Scanner Barcode',
    deviceOrApp: 'Mobile PDA / Barcode Scanner Android Petugas Timbang & Gudang',
    protocol: 'Barcode / RFID Scanner',
    frequency: 'Real-time (Detik/Event)',
    dataPayloadFields: [
      { field: 'sack_barcode', type: 'string', description: 'Barcode unik pada kertas keplek karung', example: '153BK-20261007-0042' },
      { field: 'blend_variety', type: 'string', description: 'Nama blend: 153-BK, SP 153-BK, Karang, LA Bold', example: '153 - BK' },
      { field: 'production_date', type: 'date', description: 'Tanggal olah molen', example: '2026-10-07' },
      { field: 'koli_weight_kg', type: 'float', description: 'Netto timbangan karung', example: '50.0' },
      { field: 'scanned_location', type: 'string', description: 'Lini Timbang, Gudang Persediaan, Loading Truk', example: 'GUDANG_PERS_BLEND' },
      { field: 'fifo_lot_sequence', type: 'int', description: 'Urutan antrean pengeluaran karung', example: '1' }
    ],
    automatedKpis: [
      { kpiCode: 'KP-BLD-04', kpiName: 'Akurasi Pelabelan Karung Blend', targetRole: 'Plt. Kepala Pengolahan 2', automatedCalculation: 'Sistem mencocokkan barcode keplek dengan fisik varian; salah label otomatis tercatat sebagai minus poin.' },
      { kpiCode: 'QC-INS-03', kpiName: 'Verifikasi Fisik vs Label Blend', targetRole: 'Quality Control Blend', automatedCalculation: 'Validasi otomatis saat QC melakukan sampling scan karung di gudang.' },
      { kpiCode: 'KG-STR-04', kpiName: 'Penerapan FIFO Gudang Karung', targetRole: 'Plt. Kepala Gudang Persediaan', automatedCalculation: 'Sistem mendeteksi jika karung dengan lot tanggal lebih baru dimuat mendahului lot lama (FIFO violation).' },
      { kpiCode: 'MND-BLD-01', kpiName: 'Pengawasan Output Penimbangan Karung', targetRole: 'Mandor Proses Blend', automatedCalculation: 'Menghitung total koli karung yang selesai ditimbang dan divalidasi barcode per shift kerja.' }
    ],
    businessImpact: 'Menjamin 100% keterlacakan (traceability) per karung, mencegah tertukarnya varian blend saat dikirim ke Produksi II SKT/SKM.',
    status: 'Siap Terhubung'
  },
  {
    id: 'source_hris_presensi',
    sourceName: 'Mesin Presensi Biometrik & HRIS Divisi Produksi I',
    category: 'Presensi HRIS',
    deviceOrApp: 'Biometric Face / Fingerprint Terminal di Pintu Masuk Divisi',
    protocol: 'REST API / Webhook',
    frequency: 'Real-time (Detik/Event)',
    dataPayloadFields: [
      { field: 'nik_karyawan', type: 'string', description: 'Nomor Induk Staf PT Batu Karang', example: 'BK-PP1-001' },
      { field: 'name', type: 'string', description: 'Nama staf & karyawan resmi', example: 'Lalu Mahendra Ali Akbar' },
      { field: 'role_section', type: 'string', description: 'Mandor Proses, Gudang, Administrasi, QC, Mekanik', example: 'Mandor Proses Blend' },
      { field: 'check_in', type: 'datetime', description: 'Waktu kedatangan', example: '2026-10-07 06:48:12' },
      { field: 'check_out', type: 'datetime', description: 'Waktu kepulangan', example: '2026-10-07 15:02:40' },
      { field: 'late_minutes', type: 'int', description: 'Menit keterlambatan masuk kerja', example: '0' },
      { field: 'status_kehadiran', type: 'string', description: 'Hadir, Izin, Sakit, Mangkir', example: 'Hadir' }
    ],
    automatedKpis: [
      { kpiCode: 'MGR-OPS-05', kpiName: 'Indeks Disiplin & Produktivitas SDM Divisi', targetRole: 'Manajer Operasional', automatedCalculation: 'Persentase kehadiran divisi dan rasio kepatuhan jam kerja dihitung otomatis setiap hari.' },
      { kpiCode: 'MND-BLD-04', kpiName: 'Disiplin & Absensi Staf Lini Proses', targetRole: 'Mandor Proses Blend', automatedCalculation: 'Monitoring tingkat kehadiran staf regu proses secara real-time.' },
      { kpiCode: 'ADM-BOS-03', kpiName: 'Disiplin Waktu Administrasi & Personalia', targetRole: 'Kepala Administrasi 1', automatedCalculation: 'Monitoring kedisiplinan jam masuk kerja, jam istirahat, dan nihil mangkir staf kantor.' }
    ],
    businessImpact: 'Mempermudah penerapan SK No: 01/AS/DRK/BKR/VII/2024 terkait reward, teguran, rolling kerja, atau pelimpahan ke HRD II jika ada staf yang indisipliner.',
    status: 'Terkoneksi'
  },
  {
    id: 'source_customs_ck5',
    sourceName: 'Log Portal Bea Cukai & Gate Pass Pengeluaran Tembakau',
    category: 'Bea Cukai',
    deviceOrApp: 'Sistem Terpadu Dokumen CK-5 & RFID Gate Pass Kendaraan Pengangkut',
    protocol: 'REST API / Webhook',
    frequency: 'Per Transaksi Masuk/Keluar',
    dataPayloadFields: [
      { field: 'ck5_number', type: 'string', description: 'Nomor resmi dokumen CK-5 Bea Cukai', example: 'CK5-BK-2026-1189' },
      { field: 'vehicle_plate', type: 'string', description: 'Nomor polisi armada angkutan', example: 'N 8842 AB' },
      { field: 'lead_seal_no', type: 'string', description: 'Nomor timah segel Bea & Cukai', example: 'SEAL-BC-9041' },
      { field: 'gross_weight_kg', type: 'float', description: 'Total berat tembakau blend keluar', example: '2500.0' },
      { field: 'destination', type: 'string', description: 'Tujuan: Divisi Produksi II SKT/SKM atau Pembeli Luar', example: 'PRODUKSI_II_SKT' },
      { field: 'customs_clearance_status', type: 'string', description: 'Status sah Bea Cukai: Approved, Pending, Hold', example: 'Approved' }
    ],
    automatedKpis: [
      { kpiCode: 'MGR-OPS-04', kpiName: 'Kepatuhan Bea & Cukai Divisi', targetRole: 'Manager Operasional', automatedCalculation: 'Poin 100 penuh jika zero kesalahan administrasi dokumen pengawasan cukai.' },
      { kpiCode: 'ADM-BOS-03', kpiName: 'Kepatuhan Dokumen CK-5 Bea Cukai', targetRole: 'Kepala Administrasi 2', automatedCalculation: 'Persentase pengiriman tembakau blend yang dilindungi dokumen CK-5 sah 100%.' },
      { kpiCode: 'ADM-GUD-01', kpiName: 'Ketepatan Penerbitan Surat Jalan & CK-5', targetRole: 'Admin Gudang Kecil', automatedCalculation: 'Dihitung dari ketepatan waktu terbitnya dokumen sebelum kendaraan bergerak meninggalkan gudang.' }
    ],
    businessImpact: 'Melindungi perusahaan dari denda perpajakan cukai, pelanggaran pita cukai tembakau, dan mematuhi audit regulasi pemerintah.',
    status: 'Terkoneksi'
  }
];

export const MOCK_TELEMETRY_EVENTS: TelemetryStreamEvent[] = [
  {
    id: 'stream-101',
    timestamp: '10:14:32 WIB',
    sourceCategory: 'Timbangan Digital',
    deviceName: 'Floor Scale #2 (Lantai Molen)',
    eventDescription: 'Penimbangan hasil akhir batch BT-20261007-01 selesai.',
    kpiCodeAffected: 'KP-BLD-02 (Susut Molen)',
    payloadSummary: 'Net: 513.8 Kg | Susut: 6.6 Kg (1.27%) &rarr; Nilai Riil & Wajar',
    integrityCheck: 'Valid & Lolos'
  },
  {
    id: 'stream-102',
    timestamp: '09:33:05 WIB',
    sourceCategory: 'IoT Mesin Molen',
    deviceName: 'Edge Sensor Molen #1',
    eventDescription: 'Siklus putaran molen selesai sesuai target durasi.',
    kpiCodeAffected: 'KP-BLD-01 (Timer Putar)',
    payloadSummary: 'Durasi: 18m 00s (Target: 18m) | Spuyer Saos: 3.8 Bar (Lancar)',
    integrityCheck: 'Valid & Lolos'
  },
  {
    id: 'stream-103',
    timestamp: '08:35:10 WIB',
    sourceCategory: 'Sistem ERP (BOS)',
    deviceName: 'BOS Cloud Sync Terminal',
    eventDescription: 'Submit Laporan Administrasi Mutasi Hasil Blend ke Divisi Akuntansi.',
    kpiCodeAffected: 'ADM-BOS-01 (Deadline 09:00 WIB)',
    payloadSummary: 'Waktu: 08:35 WIB (25 Menit Lebih Awal dari Cut-off 09:00 WIB)',
    integrityCheck: 'Valid & Lolos'
  },
  {
    id: 'stream-104',
    timestamp: '08:12:44 WIB',
    sourceCategory: 'Instrumen Lab QC',
    deviceName: 'Halogen Moisture Analyzer Shimadzu',
    eventDescription: 'Uji kadar air tembakau blend batch BT-20261007-01.',
    kpiCodeAffected: 'QC-INS-02 (Kadar Air)',
    payloadSummary: 'Hasil: 13.8% (Target: 13.0% - 14.5%) &rarr; Mutu Lolos',
    integrityCheck: 'Valid & Lolos'
  },
  {
    id: 'stream-105',
    timestamp: '07:45:20 WIB',
    sourceCategory: 'Scanner Barcode',
    deviceName: 'Zebra PDA Scanner Gudang',
    eventDescription: 'Verifikasi kartu gantung karung tembakau blend masuk.',
    kpiCodeAffected: 'KP-BLD-04 & QC-INS-03',
    payloadSummary: 'Scan 153BK-20261007-0042 | Berat: 50.0 Kg | Label & Fisik Klop',
    integrityCheck: 'Valid & Lolos'
  },
  {
    id: 'stream-106',
    timestamp: '06:55:00 WIB',
    sourceCategory: 'Presensi HRIS',
    deviceName: 'Biometric Face ID Terminal Pintu Utama',
    eventDescription: 'Presensi kedatangan shift I lini pengolahan.',
    kpiCodeAffected: 'MND-PRC-04 & MGR-OPS-05',
    payloadSummary: 'Kehadiran Regu Molen 1: 100% Hadir Tepat Waktu (Zero Late)',
    integrityCheck: 'Valid & Lolos'
  }
];
