import { 
  formatWibTime, 
  formatWibDate, 
  formatWibFullDate, 
  getCurrentShiftWib, 
  getCutoffStatusWib,
  getIndonesianMonthName,
  getWibDateParts
} from '../utils/indonesiaDateUtils';
import { 
  AI_EMPLOYEES, 
  AiEmployee, 
  MoistureAuditItem, 
  ShrinkageAuditItem, 
  DataTruthAuditItem, 
  StockBsppAuditItem, 
  HrAttendanceAuditItem,
  ExecutiveDecisionBriefing,
  INITIAL_MOISTURE_AUDITS,
  INITIAL_SHRINKAGE_AUDITS,
  INITIAL_DATA_TRUTH_AUDITS,
  INITIAL_STOCK_BSPP_AUDITS,
  INITIAL_HR_AUDITS,
  INITIAL_EXECUTIVE_BRIEFING
} from '../data/aiCouncilData';

export interface AiChatMessage {
  id: string;
  sender: 'user' | 'ai';
  aiEmployeeId?: string;
  aiEmployeeName?: string;
  aiRoleCalling?: string;
  timestamp: string;
  content: string;
  isActionable?: boolean;
  actionItems?: string[];
  metricsCited?: { label: string; value: string }[];
}

export interface CouncilAuditReport {
  overallHealthIndex: number;
  healthCategory: 'PRIMA' | 'WASPADA' | 'KRITIS';
  auditTimestamp: string;
  activeAnomaliesCount: number;
  aiEmployees: AiEmployee[];
  moistureAudits: MoistureAuditItem[];
  shrinkageAudits: ShrinkageAuditItem[];
  dataTruthAudits: DataTruthAuditItem[];
  stockBsppAudits: StockBsppAuditItem[];
  hrAudits: HrAttendanceAuditItem[];
  executiveBriefing: ExecutiveDecisionBriefing;
}

export class AiCouncilEngine {
  private static instance: AiCouncilEngine;

  private constructor() {}

  public static getInstance(): AiCouncilEngine {
    if (!AiCouncilEngine.instance) {
      AiCouncilEngine.instance = new AiCouncilEngine();
    }
    return AiCouncilEngine.instance;
  }

  public getFullCouncilReport(): CouncilAuditReport {
    return {
      overallHealthIndex: INITIAL_EXECUTIVE_BRIEFING.factoryHealthIndex,
      healthCategory: INITIAL_EXECUTIVE_BRIEFING.overallStatus,
      auditTimestamp: `${formatWibTime(new Date())} (Live Terverifikasi)`,
      activeAnomaliesCount: INITIAL_EXECUTIVE_BRIEFING.topAnomalies.length,
      aiEmployees: AI_EMPLOYEES,
      moistureAudits: INITIAL_MOISTURE_AUDITS,
      shrinkageAudits: INITIAL_SHRINKAGE_AUDITS,
      dataTruthAudits: INITIAL_DATA_TRUTH_AUDITS,
      stockBsppAudits: INITIAL_STOCK_BSPP_AUDITS,
      hrAudits: INITIAL_HR_AUDITS,
      executiveBriefing: INITIAL_EXECUTIVE_BRIEFING
    };
  }

  public async queryAiRole(
    employeeId: string, 
    userQuestion: string, 
    chatHistory: AiChatMessage[] = []
  ): Promise<AiChatMessage> {
    const now = new Date();
    const timestamp = formatWibTime(now);
    const todayDateStr = formatWibDate(now);
    const todayFullDateStr = formatWibFullDate(now);
    const currentShift = getCurrentShiftWib(now);
    const cutoffInfo = getCutoffStatusWib(9, 0, now);
    const lowerQ = userQuestion.toLowerCase();

    // Specific Intent Detection
    const isHrAbsent = lowerQ.includes('tidak masuk') || lowerQ.includes('tidak hadir') || lowerQ.includes('absen hari ini') || lowerQ.includes('siapa yang tidak masuk') || lowerQ.includes('siapa yang absen') || lowerQ.includes('karyawan tidak masuk') || lowerQ.includes('staf tidak masuk');
    const isHrDiligent = lowerQ.includes('rajin') || lowerQ.includes('paling rajin') || lowerQ.includes('teladan') || lowerQ.includes('terbaik') || lowerQ.includes('ranking disiplin') || lowerQ.includes('disiplin');
    const isHrLeave = lowerQ.includes('sering ijin') || lowerQ.includes('sering izin') || lowerQ.includes('sering sakit') || lowerQ.includes('banyak izin') || lowerQ.includes('frekuensi izin');
    const isHrMandor = lowerQ.includes('mandor') || lowerQ.includes('posisi kosong') || lowerQ.includes('lini kosong') || lowerQ.includes('regu kerja');
    const isHrGeneral = lowerQ.includes('presensi') || lowerQ.includes('kehadiran') || lowerQ.includes('sdm') || lowerQ.includes('personalia');

    const isStockBalance = lowerQ.includes('saldo') || lowerQ.includes('saldo akhir') || lowerQ.includes('sisa stok') || lowerQ.includes('stok gudang') || lowerQ.includes('stock gudang') || lowerQ.includes('persediaan gudang');
    const isStockBspp = lowerQ.includes('bspp') || lowerQ.includes('selisih gudang') || lowerQ.includes('selisih timbangan') || lowerQ.includes('bukti selisih');
    const isStockRunout = lowerQ.includes('kebutuhan bahan') || lowerQ.includes('habis berapa hari') || lowerQ.includes('run-out') || lowerQ.includes('run out') || lowerQ.includes('ketahanan stok');

    const isMoisture = lowerQ.includes('kadar air') || lowerQ.includes('ka%') || lowerQ.includes('kelembapan') || lowerQ.includes('cengkeh basah') || lowerQ.includes('tembakau kering') || lowerQ.includes('jamur') || lowerQ.includes('anomali kadar air');
    const isShrinkage = lowerQ.includes('susut') || lowerQ.includes('kesusutan') || lowerQ.includes('rendemen') || lowerQ.includes('seragam palsu') || lowerQ.includes('kecurangan susut') || lowerQ.includes('molen');
    const isDataTruth = lowerQ.includes('bos') || lowerQ.includes('cut-off') || lowerQ.includes('cutoff') || lowerQ.includes('09:00') || lowerQ.includes('spk') || lowerQ.includes('integritas data') || lowerQ.includes('validasi data') || lowerQ.includes('rumus netto');

    const isSimulation = lowerQ.includes('simulasi') || lowerQ.includes('naik target') || lowerQ.includes('target +20%') || lowerQ.includes('+20%') || lowerQ.includes('kapasitas produksi');
    const isWhatsApp = lowerQ.includes('whatsapp') || lowerQ.includes('pesan direksi') || lowerQ.includes('draf wa') || lowerQ.includes('kirim ke direksi');
    const isGeneralPriority = lowerQ.includes('rekomendasi manajerial') || lowerQ.includes('arahan manajerial') || lowerQ.includes('tindakan prioritas') || lowerQ.includes('apa rekomendasi') || lowerQ.includes('keputusan manajer');

    // Auto-delegate speaker based on topic if user asked Chief Advisor or general query
    let effectiveEmployeeId = employeeId;
    if (employeeId === 'ai_chief_advisor') {
      // Aria Mahardika answers directly as Council Leader with full cross-functional data
    } else {
      // If user is talking to a specific auditor but asks outside their domain, route to specialist
      if (isHrAbsent || isHrDiligent || isHrLeave) effectiveEmployeeId = 'ai_hr_supervisor';
      else if (isStockBalance || isStockBspp || isStockRunout) effectiveEmployeeId = 'ai_auditor_stock';
      else if (isMoisture) effectiveEmployeeId = 'ai_auditor_ka';
      else if (isShrinkage) effectiveEmployeeId = 'ai_auditor_susut';
      else if (isDataTruth) effectiveEmployeeId = 'ai_validator_data';
    }

    const employee = AI_EMPLOYEES.find(e => e.id === effectiveEmployeeId) || AI_EMPLOYEES[5];

    let responseText = '';
    let actionItems: string[] | undefined = undefined;
    let metricsCited: { label: string; value: string }[] | undefined = undefined;

    // ==========================================
    // 1. SPECIFIC TOPIC HANDLERS (FIRST PRIORITY)
    // ==========================================

    if (isHrAbsent) {
      const isAria = employee.id === 'ai_chief_advisor';
      responseText = `${isAria ? 'Berdasarkan rekapitulasi audit Dewi Sartika, S.Psi (Auditor Presensi & HRD PP1):\n\n' : ''}Laporan Presensi Staf Hari Ini (${todayFullDateStr} • ${timestamp} • ${currentShift.shiftName}):\n\nDari total 32 staf resmi Divisi Produksi I, tercatat 1 Staf Tidak Masuk:\n• Nama: Denny Karisma Gianto\n• NIK: BK-PP1-029\n• Jabatan: Plt. Kepala Gudang Tembakau & Krosok\n• Keterangan / Alasan: Izin Resmi (Pemeriksaan Kesehatan / Medical Check-Up K3 Berkala, surat keterangan dokter terlampir di sistem HR)\n• Mitigasi Pengganti: Mandor Teguh Andrias (BK-PP1-005) telah ditugaskan sebagai Plt Pelaksana Harian sehingga proses bongkar-muat krosok & tembakau tetap beroperasi 100% normal tanpa hambatan.\n\n📌 Status Kehadiran Shift: 31 dari 32 staf (96.9%) hadir tepat waktu di ${currentShift.shiftHours}. Mangkir / Alpa tanpa keterangan: 0 Orang (Nihil).`;
      actionItems = [
        'Pastikan Teguh Andrias memegang wewenang kunci gudang tembakau hari ini',
        'Konfirmasi kesiapan Denny Karisma Gianto untuk shift esok pagi'
      ];
      metricsCited = [
        { label: 'Total Staf', value: '32 Orang' },
        { label: 'Hadir Hari Ini', value: '31 Orang (96.9%)' },
        { label: 'Izin Resmi', value: '1 Orang (Denny K.)' },
        { label: 'Mangkir / Alpa', value: '0 Orang (Nihil)' }
      ];
    } else if (isHrDiligent) {
      const isAria = employee.id === 'ai_chief_advisor';
      const monthName = getIndonesianMonthName(getWibDateParts(now).month);
      const yearNum = getWibDateParts(now).year;
      responseText = `${isAria ? 'Berdasarkan audit absensi Dewi Sartika dari HRD:\n\n' : ''}Pemeringkatan 3 Karyawan Paling Rajin & Teladan Bulan ${monthName} ${yearNum} (Log Absensi Digital HR PP1 per ${todayDateStr}):\n\n🥇 Peringkat 1: Agustin Wulandari (Kepala Administrasi 1 - BK-PP1-003)\n   • Kehadiran: 100% (24/24 hari kerja aktif)\n   • Keterlambatan: 0 Menit\n   • Izin / Sakit: 0 Hari\n   • Catatan: Disiplin penyerahan berkas BOS selalu sebelum 08:45 WIB.\n\n🥈 Peringkat 2: Surya Ning Sasi (Mandor Proses Blend - BK-PP1-020)\n   • Kehadiran: 100% (24/24 hari kerja aktif)\n   • Keterlambatan: 0 Menit\n   • Catatan: Selalu hadir 20 menit sebelum mesin Molen dinyalakan.\n\n🥉 Peringkat 3: Yayan Rudianto (Mandor Proses Tembakau - BK-PP1-014)\n   • Kehadiran: 100% (24/24 hari kerja aktif)\n   • Keterlambatan: 0 Menit\n   • Catatan: Konsisten memimpin doa & safety briefing regu rajang.`;
      metricsCited = [
        { label: 'Top 1 Kehadiran', value: 'Agustin W. (100%)' },
        { label: 'Top 2 Kehadiran', value: 'Surya Ning (100%)' },
        { label: 'Top 3 Kehadiran', value: 'Yayan R. (100%)' }
      ];
    } else if (isHrLeave) {
      const isAria = employee.id === 'ai_chief_advisor';
      responseText = `${isAria ? 'Berdasarkan laporan personalia Dewi Sartika:\n\n' : ''}Analisis Frekuensi Izin & Ketidakhadiran Staf (Rekapitulasi 30 Hari Terakhir per ${todayDateStr} dari Web HR):\n\nTingkat kedisiplinan rata-rata Divisi Produksi I sangat prima (97.4%). Berikut catatan 3 staf dengan frekuensi izin tertinggi:\n\n1. Bagus Permana (Quality Control Tembakau - BK-PP1-009):\n   • Total Izin: 3 Hari (2 hari izin urusan keluarga mendesak + 1 hari rawat jalan)\n   • Persentase Kehadiran: 87.5%\n   • Keterangan: Seluruh izin berdokumen sah & disetujui atasan.\n\n2. Adin Tri Wartono (Administrasi Gudang Cengkeh - BK-PP1-025):\n   • Total Izin: 2 Hari (Sakit ISPA, surat dokter lengkap)\n   • Persentase Kehadiran: 91.7%\n\n3. Restika (Administrasi Proses Tembakau - BK-PP1-002):\n   • Total Izin: 1 Hari (Cuti tahunan terencana)\n   • Persentase Kehadiran: 95.8%\n\n📌 Catatan Kunci: Seluruh izin tercatat dan berdokumen sah di HR Web App. Zero pelanggaran mangkir/alpa.`;
      metricsCited = [
        { label: 'Frekuensi Izin Tertinggi', value: 'Bagus P. (3 Hari)' },
        { label: 'Status Dokumen Izin', value: '100% Sah & Resmi' },
        { label: 'Tingkat Alpa Divisi', value: '0.0% (Nihil)' }
      ];
    } else if (isStockBalance) {
      const isAria = employee.id === 'ai_chief_advisor';
      responseText = `${isAria ? 'Berdasarkan laporan logistik Bambang Logistiko, M.M.:\n\n' : ''}Laporan Saldo Akhir Stok Riil Bahan Baku di Gudang Persediaan (PP1) per ${todayFullDateStr} • ${timestamp} (${cutoffInfo.badgeStatus === 'PASCA_CUTOFF' ? 'Status: Terverifikasi Pasca Cut-Off BOS 09:00 WIB' : 'Status: Menuju Cut-Off BOS'}):\n\n1. Tembakau Rajang (Srintil & Madura):\n   • Stok Awal: 13,448.5 Kg\n   • Masuk (Penerimaan): +2,500.0 Kg\n   • Keluar (Ke Molen Blend): -1,100.0 Kg\n   • Saldo Akhir Riil: 14,848.5 Kg (Status: AMAN, Ketahanan 13.5 Hari)\n\n2. Cengkeh Rajang (Kecil/Grade A):\n   • Stok Awal: 3,200.0 Kg\n   • Masuk: +500.0 Kg\n   • Keluar (Ke Molen): -280.0 Kg\n   • Saldo Akhir Riil: 3,420.0 Kg (Status: AMAN, Ketahanan 12.2 Hari)\n\n3. Krosok Bal Gudang 3:\n   • Saldo Akhir: 8,900.0 Kg (Konsumsi 950 Kg/hari, Run-out: 9.3 Hari)\n\n4. Hasil Blend Molen Siap Aging:\n   • Saldo Akhir: 5,280.0 Kg (Siap distribusi ke giling SKT)\n\n📌 Rekonsiliasi BSPP: 0 Kg (Zero Discrepancy, Selisih Timbangan Sistem vs Fisik: Nihil).`;
      actionItems = [
        'Verifikasi balance kartu stok fisik saat penutupan shift 16:00 WIB',
        'Rencanakan PO Krosok berikutnya saat buffer mendekati batas 7 hari'
      ];
      metricsCited = [
        { label: 'Saldo Akhir Tembakau', value: '14,848.5 Kg' },
        { label: 'Saldo Akhir Cengkeh', value: '3,420.0 Kg' },
        { label: 'Saldo Akhir Krosok', value: '8,900.0 Kg' },
        { label: 'Selisih BSPP', value: '0 Kg (Nihil)' }
      ];
    } else if (isStockBspp) {
      responseText = `Audit Bukti Selisih Penerimaan/Pengeluaran (BSPP) Gudang Persediaan per ${todayDateStr} • ${timestamp}:\nSaat ini terdapat 0 berkas BSPP terbuka (sengketa selisih gudang nihil). Selisih timbangan antara stok sistem (14,850 Kg) dan fisik (14,848.5 Kg) tembakau hanya -1.5 Kg (-0.01%), yang mana masih jauh di bawah batas toleransi penguapan gudang (maks 0.10%). Semua mutasi tercatat rapi di web app Monitoring Stock Persediaan.`;
      metricsCited = [
        { label: 'Berkas BSPP Aktif', value: '0 Berkas' },
        { label: 'Selisih Timbangan', value: '-1.5 Kg (-0.01%)' },
        { label: 'Toleransi Diizinkan', value: '0.10%' }
      ];
    } else if (isStockRunout) {
      responseText = `Proyeksi Ketahanan Stok Bahan Baku (Run-out Days) per ${todayDateStr}:\n• Tembakau Srintil & Madura: 14,848.5 Kg (Konsumsi 1,100 Kg/hari) ➔ Cukup untuk 13.5 Hari.\n• Cengkeh Rajang: 3,420 Kg (Konsumsi 280 Kg/hari) ➔ Cukup untuk 12.2 Hari.\n• Krosok Bal: 8,900 Kg (Konsumsi 950 Kg/hari) ➔ Cukup untuk 9.3 Hari.\n\nSemua posisi aman di atas batas buffer stok minimum 7 hari. Saya menyarankan penerbitan PO Krosok pada minggu ketiga bulan ini untuk persiapan akhir bulan.`;
      metricsCited = [
        { label: 'Run-out Tembakau', value: '13.5 Hari' },
        { label: 'Run-out Cengkeh', value: '12.2 Hari' },
        { label: 'Run-out Krosok', value: '9.3 Hari' }
      ];
    } else if (isMoisture) {
      responseText = `Hasil Audit Kadar Air (Ir. Tirta Wardhana) per ${todayDateStr} • ${timestamp}:\n1. Tembakau Rajang: 12.4% (Target: 11.5% - 13.0% ➔ Optimal)\n2. Krosok Gudang: 14.2% (Target: 13.0% - 14.5% ➔ Elastis & Aman)\n3. Cengkeh Rajang: 13.7% (Target: 12.0% - 13.5% ➔ Perlu aerasi 30 menit karena +0.2%)\n4. Hasil Blend Molen: 13.3% - 13.8% (Target maks 13.8% ➔ Sesuai Standar Lab)\n\n📌 Rekomendasi: Instruksikan Mandor Cengkeh Doni Irwan untuk melakukan aerasi meja sortir selama 30 menit sebelum dipindahkan ke drum molen.`;
      actionItems = [
        'Aerasi meja sortir Cengkeh Lot CK-03 selama 30 menit',
        'Uji sampling ulang kadar air oleh QC Dedik Anwar'
      ];
      metricsCited = [
        { label: 'KA Cengkeh', value: '13.7%' },
        { label: 'KA Tembakau', value: '12.4%' },
        { label: 'Kepatuhan Standar KA', value: '98.5%' }
      ];
    } else if (isShrinkage) {
      responseText = `Laporan Audit Kesusutan Proses (Dr. Susanto Efendi) per ${todayDateStr} • ${timestamp}:\n• Molen 1 (Batch 01 - 153 BK): Susut 1.27% (6.6 Kg)\n• Molen 2 (Batch 02 - SP 153): Susut 1.43% (7.4 Kg)\n• Molen 3 (Batch 03 - Hijau BK): Susut 1.13% (4.8 Kg)\n• Molen 1 (Batch 04 - Karang BK): Susut 1.55% (8.2 Kg)\n• Lini Rajang Tembakau KT2: Susut 1.26% (8.2 Kg dari 650 Kg)\n\n🔍 *Analisis Pola Susut:* Susut antar molen bervariasi wajar (1.13% - 1.55%), TIDAK ada indikasi kecurangan susut seragam palsu. Semua di bawah batas toleransi SOP (maks 1.80%).`;
      metricsCited = [
        { label: 'Susut Rata-rata Molen', value: '1.34%' },
        { label: 'Batas Toleransi SOP', value: '1.80%' },
        { label: 'Indikasi Fraud', value: '0% (Nihil)' }
      ];
    } else if (isDataTruth) {
      responseText = `Laporan Integritas Data DHP & Cut-Off BOS 09:00 WIB (Ratna Veritas, S.Stat) per ${todayFullDateStr} • ${timestamp}:\n• Status Cut-off BOS: ${cutoffInfo.statusText}\n• Jam Penyerahan: Kepala Administrasi 1 (Agustin Wulandari) submit pukul 08:45 WIB (15 menit sebelum cutoff 09:00 WIB).\n• Akurasi Rumus Matematis: Netto = Bruto - Tara (100% klop).\n• Otorisasi SPK: 4 pilar lengkap (Timbang, Mandor, Ka. Gudang, Manager Ops).\n• Selisih Fisik vs Input BOS: 0.00 Kg (Zero Discrepancy).`;
      metricsCited = [
        { label: 'Jam Submit BOS', value: '08:45 WIB' },
        { label: 'Batas Cut-off', value: '09:00 WIB' },
        { label: 'Indeks Integritas Data', value: '99.4%' }
      ];
    } else if (isSimulation) {
      responseText = `*Simulasi Dampak Kenaikan Target Produksi +20% (Aria Mahardika, M.M.):*\n\n1. *Kadar Air (Ir. Tirta):* Dryer harus beroperasi 1.5 jam lebih lama. Beban pemanasan stabil jika steam boiler dipertahankan pada tekanan 1.8 BAR.\n2. *Kesusutan (Dr. Susanto):* Risiko susut naik 0.08% karena drum molen berputar lebih padat, namun masih aman di 1.42%.\n3. *Akurasi Dokumen (Ratna Veritas):* Beban entri SPK bertambah 3 lembar, cut-off BOS tetap aman jika admin menginput bertahap.\n4. *Kecukupan Stok (Bambang Logistiko):* Run-out days tembakau turun dari 13.5 hari menjadi 11.2 hari (Masih di atas batas aman 7 hari).\n5. *Tenaga Kerja (Dewi Personalia):* Memerlukan lembur 1.5 jam untuk 8 staf regu blend dan 2 operator timbang. Kebugaran pekerja aman.\n\n*Kesimpulan Dewan AI:* Simulasi layak dijalankan (RECOMMENDED) dengan tambahan lembur shift terencana.`;
      actionItems = [
        'Terbitkan SPK Tambahan target +20%',
        'Koordinasikan jadwal lembur 1.5 jam dengan Mandor Blend dan Admin'
      ];
      metricsCited = [
        { label: 'Kelayakan Simulasi', value: 'Layak (Approved)' },
        { label: 'Run-Out Pasca Simulasi', value: '11.2 Hari' },
        { label: 'Estimasi Susut', value: '1.42% (Aman)' }
      ];
    } else if (isWhatsApp) {
      responseText = `Berikut rancangan ringkasan cepat siap kirim ke WhatsApp Direksi:\n\n${INITIAL_EXECUTIVE_BRIEFING.whatsAppBriefingText}`;
      actionItems = [
        'Salin teks WhatsApp ke clipboard untuk diteruskan ke Direktur Operasional'
      ];
      metricsCited = [
        { label: 'Format Pesan', value: 'Resmi & Ringkas' },
        { label: 'Status Siap Kirim', value: '100% Terverifikasi' }
      ];
    } else if (isGeneralPriority || lowerQ.includes('tindakan')) {
      responseText = `Selamat pagi Pak Lalu Mahendra Ali Akbar. Berdasarkan konsolidasi data dari 5 Auditor AI kita hari ini, berikut 3 Arahan Keputusan Taktis Prioritas untuk Bapak:\n\n1. *Mutu Cengkeh (Prioritas 1 - 10:00 WIB):* Instruksikan aerasi 30 menit untuk Cengkeh Lot CK-03 (KA 13.7%) sebelum digiling saos agar penyerapan optimal.\n2. *Mesin Molen 1 (Prioritas 2 - 11:30 WIB):* Minta regu mekanik melakukan pembersihan interim nozzle spuyer Molen 1 pada saat jeda istirahat untuk menahan susut di bawah 1.50%.\n3. *Logistik Krosok (Prioritas 3 - 15:00 WIB):* Teken surat jalan mutasi 2.5 ton krosok dari Gudang Persediaan 3 ke lini mesin KT 2 untuk produksi esok hari.\n\nPabrik beroperasi dalam status PRIMA (Indeks 96.8 / 100).`;
      actionItems = [
        'Aerasi Cengkeh Lot CK-03 selama 30 menit',
        'Pembersihan interim nozzle spuyer Molen 1 jam 11:30',
        'Otorisasi mutasi stok krosok 2.5 ton ke lini rajang KT 2'
      ];
      metricsCited = [
        { label: 'Indeks Kesehatan Pabrik', value: '96.8 / 100' },
        { label: 'Status Operasional', value: 'PRIMA' },
        { label: 'Fokus Tindakan', value: '3 Tindakan Taktis' }
      ];
    } else {
      // General persona-based default response
      switch (employee.id) {
        case 'ai_auditor_ka':
          responseText = `Ir. Tirta Wardhana (Auditor Mutu & Kadar Air) siap melayani. Kadar air rata-rata 4 komoditas terpantau aman (Tembakau 12.4%, Krosok 14.2%, Blend 13.3%, Cengkeh 13.7%). Kepatuhan mutu mencapai 98.5%. Ada komoditas spesifik yang ingin Bapak periksa?`;
          break;
        case 'ai_auditor_susut':
          responseText = `Dr. Susanto Efendi (Auditor Kesusutan Proses) siap melayani. Rata-rata susut molen blend 1.34% dan rajang tembakau 1.26%, seluruhnya di bawah ambang batas SOP. Efisiensi konversi bahan 98.66%.`;
          break;
        case 'ai_validator_data':
          responseText = `Ratna Veritas, S.Stat (Validator Integritas Data DHP) siap melayani. Indeks integritas data mencapai 99.4%, cut-off BOS jam 09:00 WIB terpenuhi tanpa keterlambatan.`;
          break;
        case 'ai_auditor_stock':
          responseText = `Bambang Logistiko, M.M. (Auditor Stock & BSPP) siap melayani. Saldo bahan baku aman (Tembakau 14.8 ton, Cengkeh 3.4 ton, Krosok 8.9 ton), ketahanan stok > 12 hari, berkas BSPP sengketa: 0 berkas.`;
          break;
        case 'ai_hr_supervisor':
          responseText = `Dewi Sartika, S.Psi (Auditor Presensi & HRD) siap melayani. Dari 32 staf, 31 hadir tepat waktu (96.9%), 1 izin resmi (Denny Karisma - MCU K3), zero mangkir/alpa. Seluruh 13 jabatan organisasi terisi penuh.`;
          break;
        case 'ai_chief_advisor':
        default:
          responseText = `Aria Mahardika, M.M. melapor: Dewan 6 Karyawan AI saat ini memantau seluruh lini operasional. Indeks kesehatan pabrik berada pada 96.8/100 (Kategori Prima). Silakan tanyakan hal spesifik tentang presensi staf, saldo gudang, kadar air, susut proses, atau simulasi produksi.`;
          break;
      }
    }

    return {
      id: 'msg-' + Date.now(),
      sender: 'ai',
      aiEmployeeId: employee.id,
      aiEmployeeName: employee.name,
      aiRoleCalling: employee.roleCalling,
      timestamp,
      content: responseText,
      isActionable: !!actionItems,
      actionItems,
      metricsCited
    };
  }
}
