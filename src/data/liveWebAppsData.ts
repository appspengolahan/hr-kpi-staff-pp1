export interface VerifiedLiveApp {
  id: string;
  name: string;
  url: string;
  backendGasUrl: string;
  operationalScope: string;
  relevantPositions: string[];
  providedData: string[];
  automatedKpiCodes: string[];
  verificationStatus: 'Terverifikasi Aktif (200 OK)';
  integrationType: 'Headless Google Apps Script API & Direct JSON Sync';
  analysis: string;
  recommendation: string;
}

export const VERIFIED_LIVE_APPS: VerifiedLiveApp[] = [
  {
    id: 'app_blend_proses',
    name: 'Rekap Data Proses Blend (PP1 Pro API)',
    url: 'https://rekap-data-proses-blend-pro-api-eng.vercel.app/',
    backendGasUrl: 'https://script.google.com/macros/s/AKfycbySqTe0bHfMrtblCHlagbHQjLdwZwzH4pJj0kiXmr83OB2NW4QUE08ZDPGYAAo38itK/exec',
    operationalScope: 'Sekup Proses Blend: Monitoring Board & Rekap Data Proses Blend dengan Multi-Tier Sync dan Analisis Susut Komparatif Mesin Molen.',
    relevantPositions: [
      'Plt. Kepala Pengolahan 2 (Andhik Dharmabakti - BK-PP1-021)',
      'Mandor Proses Blend (Surya Ning Sasi - BK-PP1-020 & Ogik Indrawan - BK-PP1-004)',
      'Administrasi Proses Blend (May Yesi Triana Putri - BK-PP1-019 & Junita Ayu - BK-PP1-030)',
      'Quality Control Blend (Hendri Irawan - BK-PP1-016)'
    ],
    providedData: [
      'Data Batch Molen (Molen 1, Molen 2, Molen 3)',
      'Berat Bahan Masuk vs Hasil Jadi (Kg)',
      'Persentase Kesusutan Riil per Molen (Komparatif)',
      'Varian Blend (153-BK, SP 153-BK, Karang, LA Bold)',
      'Waktu Putar Molen & Target Durasi',
      'Kondisi Spuyer Nozzle & Kerataan Saos'
    ],
    automatedKpiCodes: ['KP-BLD-01', 'KP-BLD-02', 'KP-BLD-03', 'KP-BLD-05', 'MND-BLD-01', 'MND-BLD-02', 'ADM-BLD-01', 'MGR-OPS-02'],
    verificationStatus: 'Terverifikasi Aktif (200 OK)',
    integrationType: 'Headless Google Apps Script API & Direct JSON Sync',
    analysis: 'Aplikasi ini adalah JANTUNG UTAMA untuk data proses blend. Memiliki fitur "Analisis Susut Komparatif", yang membuktikan kepatuhan terhadap aturan: susut antar molen tidak boleh seragam palsu. Data batch yang dihasilkan sudah sangat matang dan siap diserap secara instan.',
    recommendation: 'Prioritas Utama Integrasi: Hubungkan endpoint GAS aplikasi ini ke Web App KPI via parameter master data atau webhook harian untuk mengotomasi KPI Kepala Pengolahan 2, Mandor Blend, dan Admin Blend secara 100% real-time.'
  },
  {
    id: 'app_stock_persediaan',
    name: 'Monitoring Stock Persediaan PP1 (Pro API)',
    url: 'https://monitoring-stock-pp-1-pro-api.vercel.app/',
    backendGasUrl: 'https://script.google.com/macros/s/AKfycbwpvTstV4SeELEB1QZgd2TR0sXIPFaJaO1owlVboHI0lnkacQPQ1_BwNrfpYMrUURVG/exec',
    operationalScope: 'Sekup Gudang (Kecil) Persediaan Blend: Monitoring stock persediaan bahan baku (Tembakau, Krosok, Cengkeh, Blend) dan BSPP.',
    relevantPositions: [
      'Plt. Kepala Gudang Persediaan 1 (Yulia Wardana - BK-PP1-007)',
      'Plt. Kepala Gudang Tembakau & Krosok (Denny Karisma Gianto - BK-PP1-029)',
      'Plt. Kepala Gudang Persediaan 3 (Suyanto - BK-PP1-024)',
      'Mandor Gudang Tembakau (Teguh Andrias - BK-PP1-005)',
      'Administrasi Gudang Blend (Brilliant Rachma Shakira - BK-PP1-031)',
      'Administrasi Gudang Cengkeh (Adin Tri Wartono - BK-PP1-025)',
      'Administrasi Gudang Tembakau (Windi Qiroatul Afrilia - BK-PP1-022)',
      'Kepala Administrasi 1 (Agustin Wulandari - BK-PP1-003)'
    ],
    providedData: [
      'Saldo Fisik Stok Komoditas (Tembakau, Krosok, Cengkeh, Blend)',
      'Mutasi Penerimaan Masuk & Pengeluaran ke Proses',
      'Data BSPP & Bahan Pembantu',
      'Rekonsiliasi DHP dan Setoran Harian',
      'Stok Karung & Buffer Persediaan'
    ],
    automatedKpiCodes: ['KG-STR-01', 'KG-STR-02', 'KG-STR-03', 'KG-STR-04', 'MND-GUD-01', 'MND-GUD-02', 'ADM-GUD-01', 'ADM-BOS-02'],
    verificationStatus: 'Terverifikasi Aktif (200 OK)',
    integrationType: 'Headless Google Apps Script API & Direct JSON Sync',
    analysis: 'Aplikasi ini memegang data persediaan gudang kecil dan mutasi stok. Sangat krusial untuk mengukur "Zero Discrepancy Stok Opname", akurasi timbangan masuk vs surat jalan, dan kepatuhan pengeluaran bahan ke lini proses.',
    recommendation: 'Tarik data mutasi komoditas harian dari endpoint GAS aplikasi ini untuk mengotomasi KPI Kepala Gudang, Mandor Gudang, dan rekonsiliasi data BOS Administrasi Gudang.'
  },
  {
    id: 'app_cengkeh_proses',
    name: 'Rekap Data Proses Cengkeh (Pro API)',
    url: 'https://rekap-data-proses-cengkeh-pro-api-l.vercel.app/',
    backendGasUrl: 'https://script.google.com/macros/s/AKfycbwafqhT23MJK9NsSIQmpeq0XMbTlRqZXvNN1LpGB36XS4gNEBpCE9hsdp4Jh_oUD54v4A/exec',
    operationalScope: 'Unit Proses Cengkeh: Dashboard dan rekapitulasi data kesusutan proses cengkeh dan larutan saos cengkeh.',
    relevantPositions: [
      'Plt. Kepala Mandor Proses Cengkeh (Indah Nurmala - BK-PP1-015)',
      'Mandor Proses Cengkeh (Doni Irwan Himawan - BK-PP1-026)',
      'Administrasi Proses Cengkeh (Ambar Istiqomah - BK-PP1-006)',
      'Quality Control Cengkeh & Tembakau (Dedik Anwar - BK-PP1-017 & Teguh Lutfiadi - BK-PP1-018)'
    ],
    providedData: [
      'Tonase Cengkeh Rajang yang Siap Ditransfer',
      'Kesusutan Proses Rajangan Cengkeh',
      'Batch Saos Larutan Cengkeh',
      'Tanggal Pengiriman ke Gudang Kecil Persediaan Blend'
    ],
    automatedKpiCodes: ['MND-CKH-01', 'MND-CKH-02', 'ADM-CKH-01', 'QC-INS-01'],
    verificationStatus: 'Terverifikasi Aktif (200 OK)',
    integrationType: 'Headless Google Apps Script API & Direct JSON Sync',
    analysis: 'Aplikasi ini melacak suplai cengkeh rajang masuk ke Sekup Blend. Data pengiriman dari aplikasi ini dapat langsung dicocokkan dengan data penerimaan di Gudang Kecil untuk memverifikasi kesesuaian fisik timbangan vs surat jalan intern.',
    recommendation: 'Jadikan data pengiriman dari app cengkeh ini sebagai pembanding otomatis (*cross-validation*) untuk mengukur kecepatan verifikasi bahan masuk dan zero selisih timbangan.'
  },
  {
    id: 'app_tembakau_proses',
    name: 'Rekap Data Proses Tembakau & Krosok (Pro API)',
    url: 'https://rekap-dataproses-tembakau-pro.vercel.app/',
    backendGasUrl: 'https://script.google.com/macros/s/AKfycbw34wezcB4YC4N-n2nL0ll9jofM3i9s5OHYxLZJ4Xu32_AmCEDcIAYi9V1AdPg2iACM/exec',
    operationalScope: 'Unit Proses Tembakau: Rekapitulasi data kesusutan proses tembakau (SKT & SKM), penjemuran, dan pembersihan gagang.',
    relevantPositions: [
      'Mandor Proses Tembakau (Yayan Rudianto - BK-PP1-014 & Adi Tri Vianto - BK-PP1-023)',
      'Administrasi Proses Tembakau & Krosok (Restika - BK-PP1-002 & Nikmatul Azizah - BK-PP1-032)',
      'Quality Control Tembakau (Matsukri - BK-PP1-027 & Bagus Permana - BK-PP1-009)'
    ],
    providedData: [
      'Tonase Tembakau Rajang & Krosok Rajang Masuk/Keluar',
      'Kesusutan Proses Rajang Tembakau SKT & SKM',
      'Data Penjemuran Tembakau Bergula',
      'Data Penjumputan Tembakau Bersih Gagang'
    ],
    automatedKpiCodes: ['MND-TBK-01', 'MND-TBK-02', 'ADM-TBK-01', 'QC-INS-01'],
    verificationStatus: 'Terverifikasi Aktif (200 OK)',
    integrationType: 'Headless Google Apps Script API & Direct JSON Sync',
    analysis: 'Aplikasi ini mencatat proses hulu tembakau dan krosok sebelum masuk ke Gudang Blend, termasuk aktivitas penjemuran tembakau bergula dan penjumputan gagang yang tertera pada SOP.',
    recommendation: 'Gunakan data proses tembakau dari aplikasi ini untuk langsung mengukur KPI Mandor Tembakau dan verifikasi bahan baku tembakau rajang masuk secara akurat.'
  },
  {
    id: 'app_hr_staff',
    name: 'Sistem HR Staff & Karyawan PP1 (Pro API)',
    url: 'https://hr-staff-pp-1-pro-api.vercel.app/',
    backendGasUrl: 'https://script.google.com/macros/s/AKfycbwp2EY-9bCx_5ja5wx6EHdKulCcXNWg5t5j7SfH_-mnvlHBTlsfXAhWK3MkP8Vt269m/exec',
    operationalScope: 'Sentral Database Kepegawaian Divisi Produksi I: Manajemen 32 staf kantor, karyawan tetap, kontrak bulanan, presensi, izin, dan rekam jejak rotasi/mutasi/promosi.',
    relevantPositions: [
      'Manajer Operasional Produksi I (Lalu Mahendra Ali Akbar - BK-PP1-001)',
      'Kepala Administrasi 1 (Agustin Wulandari - BK-PP1-003)',
      'Seluruh 32 Staf & Karyawan Resmi Divisi Produksi I (Pengolahan)'
    ],
    providedData: [
      'Data Induk Staf & Karyawan (NIP, Nama, Unit, Jabatan Aktif, Level, Status)',
      'Data Presensi & Log Absensi Harian (action=getPresensi)',
      'Catatan Izin, Sakit, Terlambat, dan Potongan Kehadiran',
      'Riwayat Mutasi, Rotasi, Promosi, dan Degradasi'
    ],
    automatedKpiCodes: ['MGR-OPS-05', 'MND-BLD-04', 'ADM-BOS-03'],
    verificationStatus: 'Terverifikasi Aktif (200 OK)',
    integrationType: 'Headless Google Apps Script API & Direct JSON Sync',
    analysis: 'Aplikasi ini adalah SUMBER KEBENARAN TUNGGAL (Single Source of Truth) untuk data personil dan presensi 32 staf Divisi Produksi I. Data pekerja harian diisolir total agar penilaian kinerja staf bersifat murni dan objektif.',
    recommendation: 'Jadikan basis data ini sebagai acuan otomatis penugasan pejabat pada setiap jabatan. Saat terjadi rotasi/mutasi di app HR, sistem KPI otomatis memperbarui nama pemegang jabatan dan mengaitkan skor evaluasinya.'
  }
];
