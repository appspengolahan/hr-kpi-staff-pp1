// Data template resmi Penilaian Kinerja Karyawan (KPI 360°) PT BATU KARANG - DIVISI PRODUKSI I
// Dilengkapi BARS (Behaviorally Anchored Rating Scale) untuk menerjemahkan angka kuantitatif ke deskripsi kualitatif operasional

export type EvaluationAuthority = 'MUTLAK_ATASAN' | 'KOLABORASI_360' | 'DATA_SISTEM';

export interface Kpi360Parameter {
  id: string;
  category: 'Kedisiplinan' | 'Tanggungjawab' | 'Sikap' | 'Kompetensi';
  subCategoryNumber: string; // misal '1.a', '1.b'
  name: string;
  evaluationAuthority?: EvaluationAuthority; // Otoritas penilai: Mutlak Atasan, 360 Bersama, atau Data Sistem
  supervisorWeight?: number; // Persentase bobot atasan (100% jika mutlak atasan)
  totalScore: number; // Jumlah total dari 4 responden (skala 4 x 5 = 20)
  avgScore: number;   // Nilai rata-rata (skala 1 - 5)
  kriteria: 'SANGAT KURANG' | 'KURANG' | 'CUKUP' | 'BAIK' | 'SANGAT BAIK';
  // Deskripsi Perilaku Nyata Operasional (BARS)
  barsDescription: {
    level1: string; // 0.0 - 1.0 (Sangat Kurang)
    level2: string; // 1.1 - 2.0 (Kurang)
    level3: string; // 2.1 - 3.0 (Cukup)
    level4: string; // 3.1 - 4.0 (Baik)
    level5: string; // 4.1 - 5.0 (Sangat Baik)
  };
}

export interface PeerFeedbackItem {
  id: string;
  respondentName: string;
  nip?: string;
  relationType: 'LANGSUNG' | 'TIDAK_LANGSUNG';
  roleInFactory: string;
  positiveFeedback: string;
  improvementFeedback: string;
  recommendation?: string;
}

export type KpiTemplateVersion = 'RECOMMENDED_16' | 'LEGACY_20' | 'COMBINED_20';

export interface OfficialKpiProfile {
  nama: string;
  nip: string;
  jabatan: string;
  periodePenilaian: string;
  level: string;
  sekup: string;
  templateVersion?: KpiTemplateVersion;
  sanksiAdministratif: string[];
  catatanPresensi: {
    persentaseKehadiran: number;
    periode: string;
    alpha: number | string;
    ijinMenit: number;
    sakit: number | string;
    keterlambatan: number | string;
    pulangAwalMenit: number;
  };
  responden: string[];
  parameters: Kpi360Parameter[];
  peerFeedbacks: PeerFeedbackItem[];
}

// ============================================================================
// OPSI B: STRUKTUR REKOMENDASI 16 POIN STANDAR INDUSTRI (LEAN & EVIDENCE-BASED)
// ============================================================================
export const KPI_16_RECOMMENDED_PARAMETERS: Kpi360Parameter[] = [
  // 1. KEDISIPLINAN & KESELAMATAN (Bobot Domain 25%)
  {
    id: 'kpi-rec-1a',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.a',
    name: 'Ketepatan Waktu & Presensi Kerja',
    evaluationAuthority: 'DATA_SISTEM',
    supervisorWeight: 100,
    totalScore: 16.00,
    avgScore: 4.00,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tingkat kehadiran rendah (<85%), sering mangkir/alpha tanpa keterangan, keterlambatan >15 menit.',
      level2: 'Kehadiran 85-92%, beberapa kali terlambat, input data cut-off BOS sering melewati batas 09:00 WIB.',
      level3: 'Kehadiran standar pabrik 93-97%, izin terencana dengan surat keterangan, hadir tepat waktu.',
      level4: 'Konsisten hadir tepat waktu sebelum operasional dimulai, kehadiran 98-99.5%, siap sebelum jam cut-off.',
      level5: 'Kehadiran sempurna 100%, selalu hadir 15 menit lebih awal, teladan kedisiplinan divisi pengolahan.'
    }
  },
  {
    id: 'kpi-rec-1b',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.b',
    name: 'Kepatuhan Jam Istirahat & Efektivitas Shift',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Sering molor jam istirahat >20 menit, meninggalkan pos timbang tanpa izin saat antrean bongkar padat.',
      level2: 'Kerap kembali terlambat dari jam istirahat, ritme kerja terpotong dan memperlambat alur proses rajang.',
      level3: 'Paham batasan jam istirahat, kembali tepat waktu dengan sesekali toleransi kecil.',
      level4: 'Disiplin mematuhi jam istirahat shift, meninggalkan pos timbang hanya setelah koordinasi dengan partner.',
      level5: 'Sangat tertib dan efisien mengelola waktu kerja efektif, transisi istirahat tanpa jeda operasional.'
    }
  },
  {
    id: 'kpi-rec-1c',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.c',
    name: 'Kepatuhan K3 & Alat Pelindung Diri (APD)',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 16.00,
    avgScore: 4.00,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Menolak atau sengaja tidak menggunakan APD (helm/sepatu safety/masker) di lantai pengolahan bahan.',
      level2: 'Memakai APD hanya saat ada inspeksi atau teguran mandor/supervisor K3.',
      level3: 'Memakai APD standar sesuai ketentuan area timbang gudang cengkeh.',
      level4: 'Konsisten dan disiplin 100% menggunakan APD lengkap, mematuhi seluruh rambu keselamatan kerja.',
      level5: 'Pelopor keselamatan kerja (Safety Champion), aktif mengingatkan rekan kerja dan buruh bongkar muat.'
    }
  },
  {
    id: 'kpi-rec-1d',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.d',
    name: 'Kerapian, Kebersihan Area Kerja & 5R',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Area pos timbangan kotor berdebu, arsip nota berserakan, karung cengkeh tidak tertata rapi.',
      level2: 'Area kerja dibersihkan hanya jika diperingatkan mandor di akhir pergantian shift.',
      level3: 'Menjaga kebersihan meja kerja dan file administrasi timbang dalam batas wajar.',
      level4: 'Rapi menerapkan 5R (Ringkas, Rapi, Resik, Rawat, Rajin), dokumen SPK tersusun rapi per tanggal.',
      level5: 'Standar 5R sempurna, meja dan area timbang selalu bersih higienis, penataan arsip menjadi rujukan.'
    }
  },

  // 2. TANGGUNG JAWAB & INTEGRITAS (Bobot Domain 30%)
  {
    id: 'kpi-rec-2a',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.a',
    name: 'Kepatuhan terhadap SOP & Instruksi Kerja Pabrik',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Mengabaikan SOP penimbangan dan alur mutasi barang, berpotensi memicu kerugian finansial pabrik.',
      level2: 'Kerap melompati tahapan verifikasi dokumen alur BSPP demi mengejar kecepatan semata.',
      level3: 'Menjalankan SOP penimbangan cengkeh standar dengan supervisi normal.',
      level4: 'Kepatuhan tinggi pada seluruh tahapan instruksi kerja, taat checklist verifikasi administrasi.',
      level5: 'Kepatuhan SOP 100% tanpa celah, mampu memberi masukan penyempurnaan SOP yang lebih aplikatif.'
    }
  },
  {
    id: 'kpi-rec-2b',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.b',
    name: 'Akurasi Data & Ketelitian (Zero Variance Timbangan)',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.00,
    avgScore: 3.25,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Sering salah timbang atau salah input tara karung, memicu selisih persediaan fisik vs buku > toleransi pabrik (pernah kena SP/teguran).',
      level2: 'Ditemukan koreksi nota berulang, kurang teliti saat memeriksa berat netto karung gelondong kering.',
      level3: 'Akurasi dalam batas toleransi standar pabrik, selisih minor diselesaikan pada rekonsiliasi harian.',
      level4: 'Tingkat akurasi tinggi (>99.5%), teliti mengecek ulang angka timbangan sebelum penandatanganan nota.',
      level5: 'Zero Defect / Nol Kesalahan Timbang, rekonsiliasi harian selalu 100% klop, akurasi data sempurna.'
    }
  },
  {
    id: 'kpi-rec-2c',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.c',
    name: 'Penyelesaian Tugas Hingga Tuntas (Follow-Through)',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Pekerjaan sering terbengkalai di akhir shift, meninggalkan tumpukan SPK belum terinput ke rekan shift berikutnya.',
      level2: 'Menyelesaikan tugas hanya separuh, membutuhkan dorongan supervisor untuk merampungkan rekap harian.',
      level3: 'Menuntaskan seluruh tugas pokok administrasi harian sebelum meninggalkan tempat kerja.',
      level4: 'Tuntas menyelesaikan pekerjaan secara mandiri, serah terima shift terdokumentasi lengkap dan rapi.',
      level5: 'Tuntas melebihi ekspektasi, proaktif memvalidasi rekapitulasi ke mandor dan Plt. Ka. Pengolahan sebelum pulang.'
    }
  },
  {
    id: 'kpi-rec-2d',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.d',
    name: 'Penjagaan Aset, Timbangan, dan Inventaris Pabrik',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Ceroboh memperlakukan timbangan digital, komputer pos, atau perlengkapan kerja hingga memicu kerusakan.',
      level2: 'Kurang peduli pada kalibrasi dan kebersihan load-cell timbangan dari sisa kotoran bahan.',
      level3: 'Merawat alat kerja dan komputer administrasi dengan kewajaran operasional standar.',
      level4: 'Tertib menjaga kebersihan platform timbangan, rutin melaporkan jadwal kalibrasi ke tim maintenance.',
      level5: 'Sangat peduli terhadap efisiensi dan keamanan aset pabrik, zero insiden kerusakan alat akibat kelalaian.'
    }
  },

  // 3. KOMPETENSI OPERASIONAL (Bobot Domain 30%)
  {
    id: 'kpi-rec-3a',
    category: 'Kompetensi',
    subCategoryNumber: '3.a',
    name: 'Penguasaan Teknis & Kecepatan Layanan Timbang',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Proses penimbangan lamban, antrean buruh/truk menumpuk, sering salah ketik kode varietas cengkeh.',
      level2: 'Keterampilan sistem masih kaku, kecepatan entri data menurun saat volume pengolahan meningkat.',
      level3: 'Terampil mengoperasikan software persediaan dan timbangan digital dengan kecepatan standar.',
      level4: 'Cepat, tangkas, dan sigap memproses dokumen penimbangan dalam tempo kerja tinggi.',
      level5: 'Kecepatan dan ketepatan luar biasa, mampu mengelola alur penimbangan puncak tanpa terjadi antrean.'
    }
  },
  {
    id: 'kpi-rec-3b',
    category: 'Kompetensi',
    subCategoryNumber: '3.b',
    name: 'Penanganan Kendala Lapangan & Problem Solving',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.50,
    avgScore: 3.38,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Panik atau lepas tangan saat ada anomali selisih timbangan atau sistem BOS offline, melempar masalah ke orang lain.',
      level2: 'Menunggu arahan atasan sepenuhnya untuk masalah operasional rutin yang sebenarnya bisa diselesaikan mandiri.',
      level3: 'Mampu menyelesaikan masalah selisih timbangan ringan dengan cek silang fisik ke gudang.',
      level4: 'Tenang dan sistematis mengurai masalah data ganda atau kesalahan nota timbang secara tuntas.',
      level5: 'Sangat ahli memecahkan problem lapangan yang kompleks, mampu berkoordinasi cepat dengan IT/QC/Maintenance.'
    }
  },
  {
    id: 'kpi-rec-3c',
    category: 'Kompetensi',
    subCategoryNumber: '3.c',
    name: 'Inisiatif Perbaikan Kerja & Efisiensi Alur Timbang',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Pasif total, hanya menunggu komando meski melihat format atau alur kerja yang boros waktu dan berbelit.',
      level2: 'Inisiatif rendah, ragu memberikan ide perbaikan alur penimbangan bahan baku.',
      level3: 'Cukup tanggap memberikan ide sederhana saat dimintai masukan dalam rapat evaluasi shift.',
      level4: 'Proaktif mengusulkan penyederhanaan formulir pencatatan dan tata letak dokumen agar lebih ringkas.',
      level5: 'Inovatif, menghasilkan solusi praktis yang mempercepat alur penimbangan dan mengurangi potensi salah catat.'
    }
  },
  {
    id: 'kpi-rec-3d',
    category: 'Kompetensi',
    subCategoryNumber: '3.d',
    name: 'Fleksibilitas Penugasan & Tanggap Kondisi Darurat',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Kaku, menolak penugasan tambahan, menolak rotasi shift darurat saat rekan sakit.',
      level2: 'Menerima tugas tambahan dengan enggan dan menunjukkan sikap penurunan kualitas kerja.',
      level3: 'Bersedia menerima rotasi shift atau penugasan timbang mendadak dengan penyesuaian wajar.',
      level4: 'Adaptif dan sigap mem-backup rekan kerja yang berhalangan tanpa mengorbankan kualitas tugas pokok.',
      level5: 'Sangat fleksibel, siap menjadi ujung tombak penanganan lonjakan pasokan darurat di pabrik.'
    }
  },

  // 4. SIKAP KERJA & KOLABORASI TIM (Bobot Domain 15%)
  {
    id: 'kpi-rec-4a',
    category: 'Sikap',
    subCategoryNumber: '4.a',
    name: 'Kerjasama Tim & Saling Membantu Antar-Pos (Teamwork)',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Egois, enggan membantu rekan saat antrean bongkar muat cengkeh padat, memicu friksi di shift.',
      level2: 'Membantu hanya sebatas tugas formal, kurang memiliki solidaritas saat divisi menghadapi beban tinggi.',
      level3: 'Mampu bekerjasama dengan baik bersama sesama rekan administrasi dan petugas timbang.',
      level4: 'Solidaritas kerja tinggi, proaktif membantu kelancaran kerja rekan demi keberhasilan target shift pabrik.',
      level5: 'Membangun sinergi luar biasa di seluruh lini, menjadi perekat keharmonisan kerja tim pengolahan.'
    }
  },
  {
    id: 'kpi-rec-4b',
    category: 'Sikap',
    subCategoryNumber: '4.b',
    name: 'Komunikasi & Etika Kerja kepada Rekan Lapangan',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Gaya komunikasi kasar atau tertutup, sering memicu salah paham dengan mandor dan buruh.',
      level2: 'Penyampaian informasi timbang berbelit-belit dan lambat mengabarkan kendala ke pihak terkait.',
      level3: 'Berkomunikasi secara sopan dan jelas mengenai data mutasi bahan operasional harian.',
      level4: 'Komunikasi sangat santun, lugas, dan teratur saat menjelaskan angka timbangan pada serah terima.',
      level5: 'Teladan etika kerja, mampu meredakan ketegangan kerja lapangan dengan komunikasi yang solutif.'
    }
  },
  {
    id: 'kpi-rec-4c',
    category: 'Sikap',
    subCategoryNumber: '4.c',
    name: 'Keterbukaan terhadap Arahan & Kritik Atasan',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Defensif, membantah saat ditegur terkait insiden salah timbang, menyalahkan pihak lain.',
      level2: 'Mendengar teguran namun lambat memperbaiki kesalahan, berpotensi mengulangi kekeliruan sama.',
      level3: 'Menerima kritik dan evaluasi kerja atasan dengan sikap terbuka dan komitmen perbaikan wajar.',
      level4: 'Positif menyikapi teguran, segera mempraktikkan saran perbaikan dan checklist ganda secara konsisten.',
      level5: 'Sangat dewasa dan berjiwa besar dalam merespon evaluasi, proaktif meminta masukan berkala untuk berkembang.'
    }
  },
  {
    id: 'kpi-rec-4d',
    category: 'Sikap',
    subCategoryNumber: '4.d',
    name: 'Motivasi Kerja & Komitmen Terhadap Divisi',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tampak tidak bersemangat, bekerja seadanya, sering mengeluh dan meninggalkan pos sebelum waktunya.',
      level2: 'Semangat naik-turun tergantung suasana shift kerja dan tekanan antrean truk bahan.',
      level3: 'Menunjukkan komitmen kerja yang stabil, tertib, dan bertanggung jawab terhadap tugas harian.',
      level4: 'Antusias, berdedikasi tinggi menjaga keakuratan stok persediaan cengkeh demi target pabrik.',
      level5: 'Memiliki sense of ownership luar biasa, menularkan energi positif dan loyalitas ke seluruh tim.'
    }
  }
];

// ============================================================================
// OPSI A: TEMPLATE FISIK WARISAN (20 POIN LAMA PT BATU KARANG)
// ============================================================================
export const KPI_20_LEGACY_PARAMETERS: Kpi360Parameter[] = [
  // 1. KEDISIPLINAN
  {
    id: 'kpi-1a',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.a',
    name: 'Ketepatan Waktu',
    evaluationAuthority: 'DATA_SISTEM',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Sering datang terlambat >15 menit dan menunda penyerahan rekap gudang cengkeh.',
      level2: 'Sesekali terlambat, input data cut-off BOS sering melewati batas 09:00 WIB.',
      level3: 'Tepat waktu pada jam masuk normal, sesekali mepet saat pergantian shift gudang.',
      level4: 'Konsisten hadir tepat waktu sebelum operasional dimulai, siap sebelum jam cut-off.',
      level5: 'Selalu hadir 15 menit lebih awal, proaktif mempersiapkan form timbangan dan data harian.'
    }
  },
  {
    id: 'kpi-1b',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.b',
    name: 'Ketepatan mengerjakan pekerjaan',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.50,
    avgScore: 3.88,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Banyak selisih timbangan tidak terdokumentasi, laporan administrasi berantakan.',
      level2: 'Pekerjaan selesai tapi kerap ditemukan salah hitung tara karung cengkeh.',
      level3: 'Mengerjakan pekerjaan sesuai SOP standar, membutuhkan pengecekan ulang berkala.',
      level4: 'Mengerjakan input persediaan cengkeh secara teliti dan rapi sesuai instruksi kerja.',
      level5: 'Nol kesalahan data persediaan, rekonsiliasi fisik vs buku persediaan cengkeh selalu presisi.'
    }
  },
  {
    id: 'kpi-1c',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.c',
    name: 'Kedisiplinan masuk kerja',
    evaluationAuthority: 'DATA_SISTEM',
    supervisorWeight: 100,
    totalScore: 16.00,
    avgScore: 4.00,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tingkat kehadiran rendah (<85%), sering mangkir tanpa keterangan sah.',
      level2: 'Kehadiran 85-92%, sering izin mendadak yang mengganggu kelancaran timbang gudang.',
      level3: 'Kehadiran standar 93-97%, izin terencana dengan surat keterangan jelas.',
      level4: 'Kehadiran sangat tinggi 98-99.5%, zero mangkir/alpha, loyalitas absensi tinggi.',
      level5: 'Kehadiran sempurna 100% tanpa izin non-darurat, teladan kedisiplinan divisi.'
    }
  },
  // 2. TANGGUNGJAWAB
  {
    id: 'kpi-2a',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.a',
    name: 'Pengerjaan tugas',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Mengabaikan tugas harian, membiarkan tumpukan berkas SPK cengkeh tidak terinput.',
      level2: 'Mengerjakan hanya jika diperingatkan atasan, kurang peduli pada kelengkapan nota.',
      level3: 'Menyelesaikan seluruh tugas pokok administrasi gudang dengan hasil cukup.',
      level4: 'Bertanggung jawab penuh atas kebersihan data mutasi dan kartu stok cengkeh.',
      level5: 'Menuntaskan tugas melebihi ekspektasi, tuntas sebelum tenggat waktu dengan verifikasi berlapis.'
    }
  },
  {
    id: 'kpi-2b',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.b',
    name: 'Memimpin tim',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak mampu mengarahkan buruh/petugas timbang cengkeh, suasana kerja pasif.',
      level2: 'Canggung memberikan instruksi, arahan penimbangan sering membingungkan operator.',
      level3: 'Mampu memimpin rekan kerja setara pada tugas operasional penimbangan rutin.',
      level4: 'Mampu mengoordinasikan helper dan buruh gudang secara jelas dan tertib.',
      level5: 'Menjadi figur panutan tim, mampu menggerakkan tim menyelesaikan bongkar muat cepat.'
    }
  },
  {
    id: 'kpi-2c',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.c',
    name: 'Penambahan tugas',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.25,
    avgScore: 3.56,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Menolak atau mengeluh secara terbuka saat diberi tugas tambahan lintas bahan.',
      level2: 'Menerima tugas tambahan dengan enggan dan hasil pengerjaan lambat.',
      level3: 'Menerima tugas tambahan administratif jika diberikan panduan yang jelas.',
      level4: 'Siap membantu penimbangan darurat atau rekapitulasi tembakau saat rekan berhalangan.',
      level5: 'Proaktif meminta tugas tambahan ketika pekerjaan pokok cengkeh telah selesai.'
    }
  },
  {
    id: 'kpi-2d',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.d',
    name: 'Produktifitas',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Ritme kerja sangat lamban, banyak waktu luang terbuang percuma.',
      level2: 'Output administrasi sering tertunda saat volume penimbangan cengkeh meningkat.',
      level3: 'Output pekerjaan memenuhi kuota standar harian administrasi gudang kecil.',
      level4: 'Produktif dan tanggap mencatat setiap tonase bahan baku cengkeh masuk/keluar.',
      level5: 'Efisiensi kerja sangat tinggi, mampu melayani multi-titik penimbangan secara simultan.'
    }
  },
  // 3. SIKAP
  {
    id: 'kpi-3a',
    category: 'Sikap',
    subCategoryNumber: '3.a',
    name: 'Koordinasi',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Menutup diri, tidak mengabarkan jika stok cengkeh rajangan menipis ke mandor.',
      level2: 'Koordinasi lambat, mandor sering harus mendatangi meja admin untuk menanyakan data.',
      level3: 'Koordinasi berjalan lancar untuk alur standar gudang ke proses rajang.',
      level4: 'Komunikatif dan aktif menyampaikan status timbangan ke Plt. Ka Pengolahan 2.',
      level5: 'Koordinasi lintas bagian (Gudang-Mandor-QC) sangat harmonis dan proaktif.'
    }
  },
  {
    id: 'kpi-3b',
    category: 'Sikap',
    subCategoryNumber: '3.b',
    name: 'Inisiatif',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Pasif total, hanya menunggu perintah tanpa ada dorongan memperbaiki cara kerja.',
      level2: 'Inisiatif rendah, ragu mengambil tindakan kecil untuk merapikan karung cengkeh.',
      level3: 'Memiliki inisiatif cukup dalam menyelesaikan hambatan administratif kecil.',
      level4: 'Tanggap merapikan data dan mengusulkan perbaikan alur timbang agar lebih cepat.',
      level5: 'Kaya gagasan praktis untuk mencegah susut dan meningkatkan akurasi data gudang.'
    }
  },
  {
    id: 'kpi-3c',
    category: 'Sikap',
    subCategoryNumber: '3.c',
    name: 'Motivasi kerja',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tampak tidak bersemangat, bekerja seadanya dan sering meninggalkan area kerja.',
      level2: 'Semangat naik-turun tergantung suasana shift dan tekanan pekerjaan.',
      level3: 'Menunjukkan komitmen dan keseriusan bekerja secara stabil setiap hari.',
      level4: 'Antusias dan berdedikasi tinggi menjaga keakuratan stok persediaan cengkeh.',
      level5: 'Menularkan energi positif dan dedikasi kepada rekan-rekan kerja di divisi.'
    }
  },
  {
    id: 'kpi-3d',
    category: 'Sikap',
    subCategoryNumber: '3.d',
    name: 'Motivasi belajar',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Menolak mempelajari sistem/tools baru (misal: spreadsheet otomatis/GAS).',
      level2: 'Lambat mengadopsi instruksi baru, perlu diingatkan berulang kali.',
      level3: 'Bersedia belajar jika diarahkan atau ditraining oleh supervisor.',
      level4: 'Cepat tanggap mempelajari formula kalkulasi dan pelaporan digital pabrik.',
      level5: 'Belajar mandiri, menguasai alur sistem lebih cepat dan membantu mengajari rekan lain.'
    }
  },
  {
    id: 'kpi-3e',
    category: 'Sikap',
    subCategoryNumber: '3.e',
    name: 'Kepemimpinan',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.50,
    avgScore: 3.38,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak memiliki wibawa, tidak dihiraukan saat mengingatkan prosedur timbang.',
      level2: 'Kurang percaya diri saat memimpin briefing singkat di gudang kecil.',
      level3: 'Mampu mengendalikan situasi kerja dalam lingkup tugas pribadinya.',
      level4: 'Mampu memberi contoh teladan disiplin bagi staf pelaksana timbang.',
      level5: 'Kepemimpinan alami yang dihormati dan mampu menengahi perselisihan di lantai pabrik.'
    }
  },
  {
    id: 'kpi-3f',
    category: 'Sikap',
    subCategoryNumber: '3.f',
    name: 'Manajemen waktu',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Manajemen waktu kacau, pekerjaan harian selalu menumpuk di akhir jam shift.',
      level2: 'Kerap kewalahan membagi waktu antara input data dan cek fisik karung.',
      level3: 'Mampu membagi waktu kerja harian dengan cukup teratur.',
      level4: 'Rapi mengatur prioritas pekerjaan: timbang masuk, catat, lalu input sistem.',
      level5: 'Sangat terstruktur, waktu transisi pergantian shift berlangsung tanpa jeda/kendala.'
    }
  },
  {
    id: 'kpi-3g',
    category: 'Sikap',
    subCategoryNumber: '3.g',
    name: 'Penyesuaian Diri',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Kaku dan menolak jika dipindahkan jam shift atau diatur rolling posisi.',
      level2: 'Butuh waktu lama untuk beradaptasi dengan perubahan jadwal dan formula blend.',
      level3: 'Bisa menyesuaikan diri dengan pola kerja tim tanpa banyak kendala.',
      level4: 'Adaptif terhadap rotasi rekan kerja dan perubahan target harian dari manajemen.',
      level5: 'Sangat fleksibel, cepat menyesuaikan diri pada kondisi darurat pabrik.'
    }
  },
  // 4. KOMPETENSI
  {
    id: 'kpi-4a',
    category: 'Kompetensi',
    subCategoryNumber: '4.a',
    name: 'Komunikasi dan Presentasi',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 13.50,
    avgScore: 3.38,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Komunikasi tertutup, tidak melaporkan masalah penimbangan hingga timbul krisis.',
      level2: 'Penyampaian laporan berbelit-belit dan sulit dipahami rekan kerja/atasan.',
      level3: 'Menyampaikan informasi operasional dengan bahasa kerja yang cukup jelas.',
      level4: 'Komunikatif, lugas, dan teratur saat menjelaskan mutasi cengkeh pada serah terima.',
      level5: 'Komunikasi sangat persuasif, mampu memaparkan data audit persediaan secara prima.'
    }
  },
  {
    id: 'kpi-4b',
    category: 'Kompetensi',
    subCategoryNumber: '4.b',
    name: 'Pengetahuan',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak memahami jenis cengkeh, tara timbangan, atau toleransi susut dasar.',
      level2: 'Pengetahuan bahan baku cengkeh terbatas, sering salah klasifikasi kualitas.',
      level3: 'Memahami standar operasional gudang dan karakteristik fisik cengkeh rajangan.',
      level4: 'Menguasai SOP administrasi persediaan cengkeh dan alur BSPP secara komprehensif.',
      level5: 'Pakar teknis persediaan bahan baku, menjadi rujukan pertanyaan rekan kerja.'
    }
  },
  {
    id: 'kpi-4c',
    category: 'Kompetensi',
    subCategoryNumber: '4.c',
    name: 'Skill',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Keterampilan input spreadsheet sangat lambat dan sering membuat rumus error.',
      level2: 'Keterampilan teknis administrasi masih terbatas pada pola manual sederhana.',
      level3: 'Terampil mengoperasikan timbangan digital dan lembar administrasi persediaan.',
      level4: 'Cepat dan tepat dalam entri data buku persediaan, validasi tara, dan cetak laporan.',
      level5: 'Keterampilan tinggi dalam rekonsiliasi data otomatis dan verifikasi akurasi timbang.'
    }
  },
  {
    id: 'kpi-4d',
    category: 'Kompetensi',
    subCategoryNumber: '4.d',
    name: 'Kreativitas',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak ada upaya mencari jalan keluar praktis saat form habis atau sistem down.',
      level2: 'Hanya menjiplak cara lama meski diketahui alur lama memakan waktu lama.',
      level3: 'Cukup kreatif mencari solusi sementara saat terjadi kendala administratif.',
      level4: 'Mampu menyederhanakan format pencatatan agar lebih cepat dibaca staf penimbangan.',
      level5: 'Inovatif menciptakan metode pengecekan mandiri yang mengeliminasi human-error.'
    }
  },
  {
    id: 'kpi-4e',
    category: 'Kompetensi',
    subCategoryNumber: '4.e',
    name: 'Analisa',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.50,
    avgScore: 3.38,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak menyadari adanya selisih tonase cengkeh hingga ditegur oleh manajer.',
      level2: 'Kurang peka terhadap kejanggalan angka susut atau perbedaan berat karung.',
      level3: 'Mampu membandingkan angka timbangan masuk dan keluar secara standar.',
      level4: 'Mampu menganalisis tren susut penimbangan dan mendeteksi anomali sebelum membesar.',
      level5: 'Daya analisis mendalam terhadap faktor kelembapan dan dampak susut bahan cengkeh.'
    }
  },
  {
    id: 'kpi-4f',
    category: 'Kompetensi',
    subCategoryNumber: '4.f',
    name: 'Problem Solving',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.50,
    avgScore: 3.38,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Panik dan lepas tangan saat terjadi ketidakcocokan timbangan, melempar ke orang lain.',
      level2: 'Menunggu arahan atasan sepenuhnya untuk masalah penimbangan sepele.',
      level3: 'Mampu menyelesaikan masalah selisih timbangan ringan dengan cross-check fisik.',
      level4: 'Tenang dan sistematis mengurai masalah data ganda atau kesalahan nota timbang.',
      level5: 'Mampu menyelesaikan konflik operasional timbangan secara mandiri dan tuntas.'
    }
  }
];

// ============================================================================
// OPSI C: STRUKTUR KOMBINASI TERPADU (20 POIN SINERGIS A & B - SALING MELENGKAPI & BEBAS REDUNDAN)
// ============================================================================
// Menggabungkan ketelitian akurasi timbangan, K3, dan 5R dari Opsi B dengan
// manajemen waktu, growth mindset, kepemimpinan lapangan, dan analisis susut dari Opsi A.
export const KPI_COMBINED_HYBRID_PARAMETERS: Kpi360Parameter[] = [
  // 1. KEDISIPLINAN & BUDAYA KERJA (5 Parameter)
  {
    id: 'kpi-comb-1a',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.a',
    name: 'Ketepatan Waktu, Presensi & Absensi Kerja',
    evaluationAuthority: 'DATA_SISTEM',
    supervisorWeight: 100,
    totalScore: 16.00,
    avgScore: 4.00,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tingkat kehadiran rendah (<85%), sering mangkir/alpha tanpa keterangan, keterlambatan >15 menit.',
      level2: 'Kehadiran 85-92%, beberapa kali terlambat, input data cut-off BOS sering melewati batas 09:00 WIB.',
      level3: 'Kehadiran standar pabrik 93-97%, izin terencana dengan surat keterangan, hadir tepat waktu.',
      level4: 'Konsisten hadir tepat waktu sebelum operasional dimulai, kehadiran 98-99.5%, siap sebelum jam cut-off.',
      level5: 'Kehadiran sempurna 100%, selalu hadir 15 menit lebih awal, teladan kedisiplinan divisi pengolahan.'
    }
  },
  {
    id: 'kpi-comb-1b',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.b',
    name: 'Kepatuhan Jam Istirahat & Efektivitas Pergantian Shift',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Sering molor jam istirahat >20 menit, meninggalkan pos timbang tanpa izin saat antrean bongkar padat.',
      level2: 'Kerap kembali terlambat dari jam istirahat, ritme kerja terpotong dan memperlambat alur proses rajang.',
      level3: 'Paham batasan jam istirahat, kembali tepat waktu dengan sesekali toleransi kecil operasional.',
      level4: 'Disiplin mematuhi jam istirahat shift, meninggalkan pos timbang hanya setelah koordinasi dengan partner.',
      level5: 'Sangat tertib dan efisien mengelola waktu kerja efektif, transisi istirahat dan serah terima shift tanpa jeda.'
    }
  },
  {
    id: 'kpi-comb-1c',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.c',
    name: 'Kepatuhan K3 & Penggunaan Alat Pelindung Diri (APD)',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 16.00,
    avgScore: 4.00,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Menolak atau sengaja tidak menggunakan APD (helm/sepatu safety/masker) di lantai pengolahan bahan.',
      level2: 'Memakai APD hanya saat ada inspeksi atau teguran mandor/supervisor K3.',
      level3: 'Memakai APD standar sesuai ketentuan area timbang gudang cengkeh dan lantai proses.',
      level4: 'Konsisten dan disiplin 100% menggunakan APD lengkap, mematuhi seluruh rambu keselamatan kerja.',
      level5: 'Pelopor keselamatan kerja (Safety Champion), aktif mengingatkan rekan kerja dan buruh bongkar muat.'
    }
  },
  {
    id: 'kpi-comb-1d',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.d',
    name: 'Kerapian, Kebersihan Area Kerja & Budaya 5R',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Area pos timbangan kotor berdebu, arsip nota berserakan, karung cengkeh tidak tertata rapi.',
      level2: 'Area kerja dibersihkan hanya jika diperingatkan mandor di akhir pergantian shift.',
      level3: 'Menjaga kebersihan meja kerja dan file administrasi timbang dalam batas wajar.',
      level4: 'Rapi menerapkan 5R (Ringkas, Rapi, Resik, Rawat, Rajin), dokumen SPK tersusun rapi per tanggal.',
      level5: 'Standar 5R sempurna, meja dan area timbang selalu bersih higienis, penataan arsip menjadi rujukan.'
    }
  },
  {
    id: 'kpi-comb-1e',
    category: 'Kedisiplinan',
    subCategoryNumber: '1.e',
    name: 'Manajemen Waktu & Keteraturan Skala Prioritas Harian',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Manajemen waktu kacau, pekerjaan harian selalu menumpuk di akhir jam shift, sering panik.',
      level2: 'Kerap kewalahan membagi waktu antara input sistem dan pemeriksaan fisik karung bahan baku.',
      level3: 'Mampu membagi waktu kerja harian dengan cukup teratur sesuai jadwal operasional rutin.',
      level4: 'Rapi mengatur prioritas pekerjaan: timbang masuk, catat, verifikasi tara, lalu input sistem BOS tepat waktu.',
      level5: 'Sangat terstruktur dan efisien, mampu mengantisipasi beban puncak tanpa terjadi bottleneck operasional.'
    }
  },

  // 2. TANGGUNG JAWAB & AKURASI OPERASIONAL (5 Parameter)
  {
    id: 'kpi-comb-2a',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.a',
    name: 'Kepatuhan terhadap SOP & Regulasi Alur Mutasi Pabrik',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Mengabaikan SOP penimbangan dan alur mutasi barang, berpotensi memicu kerugian finansial pabrik.',
      level2: 'Kerap melompati tahapan verifikasi dokumen alur BSPP demi mengejar kecepatan semata.',
      level3: 'Menjalankan SOP penimbangan cengkeh standar dengan supervisi normal.',
      level4: 'Kepatuhan tinggi pada seluruh tahapan instruksi kerja, taat checklist verifikasi administrasi.',
      level5: 'Kepatuhan SOP 100% tanpa celah, mampu memberi masukan penyempurnaan SOP yang lebih aplikatif.'
    }
  },
  {
    id: 'kpi-comb-2b',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.b',
    name: 'Akurasi Penimbangan & Ketelitian Data (Zero Variance)',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.00,
    avgScore: 3.25,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Sering salah timbang atau salah input tara karung, memicu selisih persediaan fisik vs buku > toleransi pabrik (pernah kena SP/teguran).',
      level2: 'Ditemukan koreksi nota berulang, kurang teliti saat memeriksa berat netto karung gelondong kering.',
      level3: 'Akurasi dalam batas toleransi standar pabrik, selisih minor diselesaikan pada rekonsiliasi harian.',
      level4: 'Tingkat akurasi tinggi (>99.5%), teliti mengecek ulang angka timbangan sebelum penandatanganan nota.',
      level5: 'Zero Defect / Nol Kesalahan Timbang, rekonsiliasi harian selalu 100% klop, akurasi data sempurna.'
    }
  },
  {
    id: 'kpi-comb-2c',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.c',
    name: 'Penyelesaian Tugas Hingga Tuntas (Follow-Through)',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Pekerjaan sering terbengkalai di akhir shift, meninggalkan tumpukan SPK belum terinput ke rekan shift berikutnya.',
      level2: 'Menyelesaikan tugas hanya separuh, membutuhkan dorongan supervisor untuk merampungkan rekap harian.',
      level3: 'Menuntaskan seluruh tugas pokok administrasi harian sebelum meninggalkan tempat kerja.',
      level4: 'Tuntas menyelesaikan pekerjaan secara mandiri, serah terima shift terdokumentasi lengkap dan rapi.',
      level5: 'Tuntas melebihi ekspektasi, proaktif memvalidasi rekapitulasi ke mandor dan Plt. Ka. Pengolahan sebelum pulang.'
    }
  },
  {
    id: 'kpi-comb-2d',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.d',
    name: 'Penjagaan Aset, Timbangan Digital & Inventaris Pabrik',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Ceroboh memperlakukan timbangan digital, komputer pos, atau perlengkapan kerja hingga memicu kerusakan.',
      level2: 'Kurang peduli pada kalibrasi dan kebersihan load-cell timbangan dari sisa kotoran bahan.',
      level3: 'Merawat alat kerja dan komputer administrasi dengan kewajaran operasional standar.',
      level4: 'Tertib menjaga kebersihan platform timbangan, rutin melaporkan jadwal kalibrasi ke tim maintenance.',
      level5: 'Sangat peduli terhadap efisiensi dan keamanan aset pabrik, zero insiden kerusakan alat akibat kelalaian.'
    }
  },
  {
    id: 'kpi-comb-2e',
    category: 'Tanggungjawab',
    subCategoryNumber: '2.e',
    name: 'Produktivitas Kerja & Kesigapan Menerima Penugasan Ekstra',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Menolak tugas tambahan, ritme kerja lambat, banyak waktu luang terbuang percuma saat antrean padat.',
      level2: 'Menerima tugas perbantuan dengan enggan, output rekapitulasi menurun saat beban bahan meningkat.',
      level3: 'Produktivitas memenuhi kuota harian pabrik, bersedia menerima tugas ekstra jika dipandu supervisor.',
      level4: 'Produktif, sigap memproses volume timbangan tinggi, tanggap membantu penimbangan bahan lain saat darurat.',
      level5: 'Kapasitas kerja sangat tinggi, proaktif membantu kelancaran timbang lintas bahan dengan efisiensi maksimal.'
    }
  },

  // 3. SIKAP KERJA, KEPEMIMPINAN & KOLABORASI (5 Parameter)
  {
    id: 'kpi-comb-3a',
    category: 'Sikap',
    subCategoryNumber: '3.a',
    name: 'Kerjasama Tim & Saling Membantu Antar-Lini (Teamwork)',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Egois, enggan membantu rekan saat antrean bongkar muat cengkeh padat, memicu friksi di shift.',
      level2: 'Membantu hanya sebatas tugas formal, kurang memiliki solidaritas saat divisi menghadapi beban tinggi.',
      level3: 'Mampu bekerjasama dengan baik bersama sesama rekan administrasi dan petugas timbang.',
      level4: 'Solidaritas kerja tinggi, proaktif membantu kelancaran kerja rekan demi keberhasilan target shift pabrik.',
      level5: 'Membangun sinergi luar biasa di seluruh lini, menjadi perekat keharmonisan kerja tim pengolahan.'
    }
  },
  {
    id: 'kpi-comb-3b',
    category: 'Sikap',
    subCategoryNumber: '3.b',
    name: 'Koordinasi Lintas Bagian & Komunikasi Efektif',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Gaya komunikasi kasar atau tertutup, tidak mengabarkan jika stok menipis, memicu salah paham.',
      level2: 'Penyampaian informasi timbang berbelit-belit dan lambat mengabarkan kendala ke pihak terkait.',
      level3: 'Berkomunikasi secara sopan dan jelas mengenai data mutasi bahan operasional harian.',
      level4: 'Komunikasi sangat santun, lugas, dan teratur saat menjelaskan angka timbangan pada serah terima.',
      level5: 'Koordinasi lintas bagian (Gudang-Mandor-QC) sangat harmonis, mampu meredakan ketegangan kerja secara solutif.'
    }
  },
  {
    id: 'kpi-comb-3c',
    category: 'Sikap',
    subCategoryNumber: '3.c',
    name: 'Kepemimpinan Lapangan & Pengarahan Rekan/Helper',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 13.75,
    avgScore: 3.44,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak memiliki wibawa kerja, tidak dihiraukan saat mengingatkan prosedur timbang, suasana kerja pasif.',
      level2: 'Canggung memberikan instruksi, arahan penimbangan sering membingungkan buruh bongkar muat.',
      level3: 'Mampu mengarahkan buruh/helper penimbangan rutin dengan instruksi yang cukup jelas.',
      level4: 'Mampu mengoordinasikan buruh dan helper gudang secara tertib, memberi contoh teladan disiplin.',
      level5: 'Figur panutan lapangan yang disegani dan dihormati, mampu menggerakkan tim menuntaskan target cepat.'
    }
  },
  {
    id: 'kpi-comb-3d',
    category: 'Sikap',
    subCategoryNumber: '3.d',
    name: 'Keterbukaan terhadap Arahan, Evaluasi & Kritik Atasan',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 15.00,
    avgScore: 3.75,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Defensif, membantah saat ditegur terkait insiden salah timbang, menyalahkan pihak lain.',
      level2: 'Mendengar teguran namun lambat memperbaiki kesalahan, berpotensi mengulangi kekeliruan sama.',
      level3: 'Menerima kritik dan evaluasi kerja atasan dengan sikap terbuka dan komitmen perbaikan wajar.',
      level4: 'Positif menyikapi teguran, segera mempraktikkan saran perbaikan dan checklist ganda secara konsisten.',
      level5: 'Sangat dewasa dan berjiwa besar dalam merespon evaluasi, proaktif meminta masukan berkala untuk berkembang.'
    }
  },
  {
    id: 'kpi-comb-3e',
    category: 'Sikap',
    subCategoryNumber: '3.e',
    name: 'Motivasi Kerja, Dedikasi & Komitmen terhadap Divisi',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tampak tidak bersemangat, bekerja seadanya, sering mengeluh dan meninggalkan pos sebelum waktunya.',
      level2: 'Semangat naik-turun tergantung suasana shift kerja dan tekanan antrean truk bahan.',
      level3: 'Menunjukkan komitmen kerja yang stabil, tertib, dan bertanggung jawab terhadap tugas harian.',
      level4: 'Antusias, berdedikasi tinggi menjaga keakuratan stok persediaan cengkeh demi target pabrik.',
      level5: 'Memiliki sense of ownership luar biasa, menularkan energi positif dan loyalitas ke seluruh tim.'
    }
  },

  // 4. KOMPETENSI TEKNIS, ANALISIS & PENGEMBANGAN (5 Parameter)
  {
    id: 'kpi-comb-4a',
    category: 'Kompetensi',
    subCategoryNumber: '4.a',
    name: 'Penguasaan Teknis Sistem, Pengetahuan Bahan & Kecepatan Layanan',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak paham jenis bahan/tara timbangan, proses lamban, antrean menumpuk, sering salah kode varietas.',
      level2: 'Keterampilan teknis kaku, kecepatan entri data menurun saat volume pengolahan meningkat.',
      level3: 'Memahami karakteristik cengkeh/bahan baku dan terampil mengoperasikan software timbangan standar.',
      level4: 'Cepat, tangkas, dan sigap memproses dokumen penimbangan dalam tempo kerja tinggi dengan akurasi prima.',
      level5: 'Pakar teknis operasional penimbangan dan sistem persediaan, menjadi rujukan pertanyaan rekan kerja.'
    }
  },
  {
    id: 'kpi-comb-4b',
    category: 'Kompetensi',
    subCategoryNumber: '4.b',
    name: 'Daya Analisis Data, Deteksi Anomali & Kontrol Susut Bahan',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.50,
    avgScore: 3.38,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Tidak menyadari adanya selisih tonase hingga ditegur manajer, tidak peka terhadap kejanggalan tara.',
      level2: 'Kurang peka terhadap tren kenaikan susut atau ketidakwajaran angka penimbangan antar-batch.',
      level3: 'Mampu membandingkan angka timbangan masuk dan keluar secara standar sesuai pedoman toleransi.',
      level4: 'Kritis menganalisis tren susut penimbangan, sigap mendeteksi anomali data sebelum berlanjut ke audit.',
      level5: 'Daya analisis mendalam terhadap faktor kelembapan bahan, susut pengeringan, dan mitigasi risiko kerugian.'
    }
  },
  {
    id: 'kpi-comb-4c',
    category: 'Kompetensi',
    subCategoryNumber: '4.c',
    name: 'Penanganan Masalah Lapangan & Problem Solving Terukur',
    evaluationAuthority: 'MUTLAK_ATASAN',
    supervisorWeight: 100,
    totalScore: 13.50,
    avgScore: 3.38,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Panik atau lepas tangan saat ada selisih timbangan atau sistem BOS offline, melempar masalah ke orang lain.',
      level2: 'Menunggu arahan atasan sepenuhnya untuk masalah operasional rutin yang sebenarnya bisa dicek mandiri.',
      level3: 'Mampu menyelesaikan masalah selisih timbangan ringan dengan cek silang fisik ke gudang secara tenang.',
      level4: 'Tenang dan sistematis mengurai masalah data ganda atau kesalahan nota timbang secara tuntas.',
      level5: 'Sangat ahli memecahkan problem lapangan kompleks, sigap berkoordinasi cepat dengan IT, QC, dan Maintenance.'
    }
  },
  {
    id: 'kpi-comb-4d',
    category: 'Kompetensi',
    subCategoryNumber: '4.d',
    name: 'Inisiatif Inovasi & Perbaikan Alur Kerja Berkelanjutan',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.00,
    avgScore: 3.50,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Pasif total, hanya menjiplak cara lama meski diketahui alur kerja boros waktu dan berbelit-belit.',
      level2: 'Inisiatif rendah, ragu memberikan ide perbaikan alur penimbangan atau penyederhanaan form.',
      level3: 'Cukup tanggap memberikan ide sederhana saat dimintai masukan dalam rapat evaluasi shift.',
      level4: 'Proaktif mengusulkan penyederhanaan format pencatatan dan penataan dokumen agar lebih ringkas dan cepat.',
      level5: 'Inovatif, menghasilkan solusi praktis yang memangkas waktu tunggu antrean timbang dan mengeliminasi human-error.'
    }
  },
  {
    id: 'kpi-comb-4e',
    category: 'Kompetensi',
    subCategoryNumber: '4.e',
    name: 'Kemauan Belajar & Pengembangan Diri (Growth Mindset)',
    evaluationAuthority: 'KOLABORASI_360',
    supervisorWeight: 25,
    totalScore: 14.50,
    avgScore: 3.63,
    kriteria: 'BAIK',
    barsDescription: {
      level1: 'Menolak mempelajari sistem/tools baru (misal spreadsheet otomatis/BOS), resisten terhadap perubahan.',
      level2: 'Lambat mengadopsi instruksi digital baru, membutuhkan pengingat dan pendampingan berulang.',
      level3: 'Bersedia belajar jika diarahkan atau ditraining oleh supervisor dalam lingkup tugasnya.',
      level4: 'Cepat tanggap mempelajari formula kalkulasi baru, antusias mengupgrade keterampilan kerja mandiri.',
      level5: 'Pembelajar mandiri berkecepatan tinggi, proaktif menguasai sistem mutakhir dan aktif membimbing rekan lain.'
    }
  }
];

// Profile Resmi Adin Tri Wartono Default (Menggunakan Rekomendasi OPSI B - 16 Poin)
export const OFFICIAL_ADIN_KPI_DATA: OfficialKpiProfile = {
  nama: 'ADIN TRI WARTONO',
  nip: 'BK-PP1-025',
  jabatan: 'ADMIN PERSEDIAAN CENGKEH',
  periodePenilaian: 'JANUARI 2026',
  level: '3 / A',
  sekup: 'ADMINISTRASI',
  templateVersion: 'RECOMMENDED_16',
  sanksiAdministratif: [
    'Surat Teguran (Kesalahan Penimbangan Gld. Kering)'
  ],
  catatanPresensi: {
    persentaseKehadiran: 99.31,
    periode: 'Juli 2025 - Januari 2026',
    alpha: '-',
    ijinMenit: 300,
    sakit: '-',
    keterlambatan: '-',
    pulangAwalMenit: 170
  },
  responden: [
    'Andhik Dharmabakti (Atasan)',
    'Ambar Istiqomah (Peer)',
    'Indah Nurmala (Peer)',
    'Yulia Wardhana (Peer)'
  ],
  parameters: KPI_16_RECOMMENDED_PARAMETERS,
  peerFeedbacks: [
    {
      id: 'peer-1',
      respondentName: 'AMBAR ISTIQOMAH',
      nip: 'BK-PP1-006',
      relationType: 'LANGSUNG',
      roleInFactory: 'Senior Partner Administrasi Gudang Cengkeh',
      positiveFeedback: 'Memiliki ketelitian yang baik dalam pengarsipan nota sehingga meminimalkan kesalahan pencatatan rutin.',
      improvementFeedback: 'Belum bisa bekerja secara efisien di bawah tekanan tinggi (misal saat antrean bongkar muat cengkeh bersamaan).',
      recommendation: 'Perlu latihan simulasi alur kerja cepat saat jam sibuk dan pendampingan mitigasi stres.'
    },
    {
      id: 'peer-2',
      respondentName: 'INDAH NURMALA',
      nip: 'BK-PP1-014',
      relationType: 'LANGSUNG',
      roleInFactory: 'Administrasi Proses & Rekonsiliasi Bahan',
      positiveFeedback: 'Rekan kerja yang santun, sangat disiplin dalam absensi, dan mudah diajak kerja sama harian.',
      improvementFeedback: 'Perlu lebih percaya diri dan proaktif dalam berkoordinasi langsung dengan mandor rajang tanpa menunggu atasan.',
      recommendation: 'Dilibatkan lebih aktif dalam serah terima shift operasional harian.'
    },
    {
      id: 'peer-3',
      respondentName: 'YULIA WARDHANA',
      nip: 'BK-PP1-005',
      relationType: 'TIDAK_LANGSUNG',
      roleInFactory: 'Administrasi Persediaan Tembakau',
      positiveFeedback: 'Laporan administrasi tertib, format penyerahan buku stok selalu rapi dan mudah dicek silang.',
      improvementFeedback: 'Perlu memperdalam wawasan terkait integrasi data cut-off BOS jam 09:00 WIB agar selalu sinkron tepat waktu.',
      recommendation: 'Pelatihan singkat rekonsiliasi data digital BOS.'
    },
    {
      id: 'peer-4',
      respondentName: 'ANDHIK DHARMABAKTI',
      nip: 'BK-PP1-021',
      relationType: 'LANGSUNG',
      roleInFactory: 'Plt. Kepala Pengolahan 2 (Atasan Langsung)',
      positiveFeedback: 'Loyalitas dan komitmen absensi sangat tinggi (99,31%). Kepatuhan K3 & APD sangat baik di area timbangan.',
      improvementFeedback: 'Terkait insiden Surat Teguran kesalahan penimbangan: konsentrasi menurun saat ritme kerja dipercepat. Akurasi zero-variance harus ditingkatkan.',
      recommendation: 'Penerapan checklist verifikasi ganda (double sign-off) sebelum finalisasi nota timbang.'
    }
  ]
};

// Profile Legacy 20 Poin
export const OFFICIAL_ADIN_KPI_DATA_LEGACY_20: OfficialKpiProfile = {
  ...OFFICIAL_ADIN_KPI_DATA,
  templateVersion: 'LEGACY_20',
  parameters: KPI_20_LEGACY_PARAMETERS
};

// Profile Opsi C Kombinasi Sinergis 20 Poin
export const OFFICIAL_ADIN_KPI_DATA_COMBINED_20: OfficialKpiProfile = {
  ...OFFICIAL_ADIN_KPI_DATA,
  templateVersion: 'COMBINED_20',
  parameters: KPI_COMBINED_HYBRID_PARAMETERS
};

// Fungsi penerjemah kuantitatif ke kualitatif secara otomatis (Narrative Synthesis Engine)
export interface QualitativeSynthesis {
  personaSummary: string;
  topStrengths: { title: string; score: number; qualitativeReason: string }[];
  developmentAreas: { title: string; score: number; qualitativeReason: string }[];
  discrepancyAlert: {
    hasAlert: boolean;
    title: string;
    description: string;
    actionNeeded: string;
  };
  coachingActionPlan: {
    focusArea: string;
    concreteStep: string;
    targetTimeline: string;
    mentor: string;
  }[];
}

export function generateQualitativeSynthesis(profile: OfficialKpiProfile): QualitativeSynthesis {
  // Sort parameters by score
  const sorted = [...profile.parameters].sort((a, b) => b.avgScore - a.avgScore);
  const highest = sorted.slice(0, 3);
  const lowest = sorted.slice(-3).reverse();

  // Hitung rata-rata tiap domain
  const categories = ['Kedisiplinan', 'Tanggungjawab', 'Sikap', 'Kompetensi'] as const;
  const catScores: Record<string, number> = {};
  categories.forEach(cat => {
    const params = profile.parameters.filter(p => p.category === cat);
    if (params.length > 0) {
      const sum = params.reduce((acc, p) => acc + p.avgScore, 0);
      catScores[cat] = Number((sum / params.length).toFixed(2));
    } else {
      catScores[cat] = 0;
    }
  });

  const hasSanction = profile.sanksiAdministratif && profile.sanksiAdministratif.length > 0;
  const supervisorName = profile.responden && profile.responden.length > 0 
    ? profile.responden[0].replace(/\s*\([^)]*\)/, '')
    : 'Atasan Langsung';

  // Helper to extract exact BARS description for the specific score
  const getBarsForScore = (param: Kpi360Parameter, score: number): string => {
    if (score >= 4.1) return param.barsDescription.level5;
    if (score >= 3.1) return param.barsDescription.level4;
    if (score >= 2.1) return param.barsDescription.level3;
    if (score >= 1.1) return param.barsDescription.level2;
    return param.barsDescription.level1;
  };

  // Dynamic persona summary based on real-time calculated scores
  const topDomain = Object.entries(catScores).sort((a, b) => b[1] - a[1])[0];
  const lowDomain = Object.entries(catScores).sort((a, b) => a[1] - b[1])[0];
  
  const personaSummary = `Sdr. ${profile.nama} (${profile.jabatan}) menunjukkan profil kerja dengan capaian tertinggi pada domain ${topDomain?.[0]} (Skor: ${topDomain?.[1]?.toFixed(2)}/5.00) dan tingkat kehadiran ${profile.catatanPresensi.persentaseKehadiran}%. Kekuatan operasional paling menonjol tercatat pada parameter "${highest[0]?.name}" (Skor: ${highest[0]?.avgScore.toFixed(2)}). Sementara itu, area percepatan pembenahan difokuskan pada domain ${lowDomain?.[0]} (Skor: ${lowDomain?.[1]?.toFixed(2)}), khususnya pada aspek "${lowest[0]?.name}" (Skor: ${lowest[0]?.avgScore.toFixed(2)}).`;

  return {
    personaSummary,
    
    topStrengths: highest.map(p => ({
      title: `${p.name} (${p.category})`,
      score: p.avgScore,
      qualitativeReason: getBarsForScore(p, p.avgScore)
    })),

    developmentAreas: lowest.map(p => ({
      title: `${p.name} (${p.category})`,
      score: p.avgScore,
      qualitativeReason: getBarsForScore(p, p.avgScore)
    })),

    discrepancyAlert: {
      hasAlert: hasSanction,
      title: hasSanction 
        ? 'Peringatan Disparitas: Catatan Sanksi/Disiplin vs Penilaian Kinerja'
        : 'Status Integritas Penilaian: Konsisten & Objektif',
      description: hasSanction 
        ? `Terdapat catatan riil: ${profile.sanksiAdministratif[0]}. Penilaian atasan langsung telah dikalibrasi secara proporsional agar hasil KPI memotret realitas kinerja teknis lapangan secara objektif.`
        : `Tidak ditemukan catatan sanksi administratif pada berkas karyawan (${profile.nama}). Distribusi nilai 360° menunjukkan konsistensi antara evaluasi atasan, rekan sejawat, dan data presensi.`,
      actionNeeded: hasSanction
        ? `Supervisor / Atasan (${supervisorName}) perlu menjadwalkan konseling 1-on-1 dan verifikasi berkala terhadap mitigasi kesalahan kerja.`
        : `Pertahankan ritme kerja dan berikan apresiasi berkala atas konsistensi kinerja yang telah dicapai.`
    },

    coachingActionPlan: [
      {
        focusArea: `Peningkatan Standar: ${lowest[0]?.name || 'Ketelitian Operasional'}`,
        concreteStep: `Penerapan checklist kerja mandiri dan evaluasi mingguan bersama atasan langsung untuk meminimalkan deviasi operasional.`,
        targetTimeline: '30 Hari Pertama',
        mentor: `${supervisorName} (${profile.sekup === 'Administrasi' ? 'Seksi Administrasi' : 'Seksi Operasional'})`
      },
      {
        focusArea: `Penguatan Efisiensi & Kecepatan: ${lowest[1]?.name || 'Koordinasi Kerja'}`,
        concreteStep: `Pelatihan on-the-job alur kerja cepat dan koordinasi aktif lintas fungsi saat volume produksi tinggi.`,
        targetTimeline: '60 Hari',
        mentor: profile.responden?.[1] || 'Partner Kerja Senior'
      },
      {
        focusArea: 'Konsistensi 5R & Kepatuhan Prosedur Divisi Produksi I',
        concreteStep: 'Pemeriksaan rutin kerapian area kerja dan kepatuhan penginputan data sistem harian.',
        targetTimeline: '90 Hari',
        mentor: 'Manajer Operasional / Supervisor Terkait'
      }
    ]
  };
}
