import React, { useState } from 'react';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Building2, 
  ShieldCheck, 
  X,
  BrainCircuit,
  Bot,
  Droplets,
  TrendingDown,
  FileCheck,
  Boxes,
  UserCheck,
  Sparkles,
  BookOpen,
  AlertTriangle,
  Lock,
  ArrowRight,
  Clock
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { AI_EMPLOYEES } from '../data/aiCouncilData';
import { formatWibDate, formatWibDateTime } from '../utils/indonesiaDateUtils';

interface AiCouncilManualModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AiCouncilManualModal: React.FC<AiCouncilManualModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'ringkasan' | 'arsitektur' | 'detail_karyawan' | 'sop_eskalasi'>('ringkasan');
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);

  if (!isOpen) return null;

  const handleDownloadPdf = () => {
    setIsDownloadingPdf(true);
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPos = 20;

      // Helper for header on each page
      const renderPageHeader = (pageTitle: string) => {
        doc.setFillColor(15, 23, 42); // slate-900
        doc.rect(0, 0, pageWidth, 16, 'F');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(245, 158, 11); // amber-500
        doc.text('PT. BATU KARANG (153) — DIVISI PRODUKSI I (PENGOLAHAN)', 14, 10);

        doc.setFont('helvetica', 'normal');
        doc.setTextColor(203, 213, 225); // slate-300
        doc.text(pageTitle, pageWidth - 14, 10, { align: 'right' });

        doc.setDrawColor(226, 232, 240);
        doc.line(14, 18, pageWidth - 14, 18);
      };

      const renderPageFooter = (pageNum: number, totalPages: number) => {
        doc.setDrawColor(226, 232, 240);
        doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text(`Dokumen Resmi SOP Pengawasan AI • Dicetak ${formatWibDateTime(new Date())}`, 14, pageHeight - 7);
        doc.text(`Hal ${pageNum} dari ${totalPages}`, pageWidth - 14, pageHeight - 7, { align: 'right' });
      };

      // ==========================================
      // PAGE 1: COVER & EXECUTIVE SUMMARY
      // ==========================================
      renderPageHeader('MANUAL OPERASIONAL DEWAN AI');

      // Title Block
      yPos = 30;
      doc.setFillColor(241, 245, 249); // slate-100
      doc.roundedRect(14, yPos, pageWidth - 28, 38, 3, 3, 'F');
      
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.setTextColor(15, 23, 42);
      doc.text('BUKU PANDUAN & SISTEM KERJA', 20, yPos + 12);
      doc.text('DEWAN 6 KARYAWAN AI PENGAWAS OPERASIONAL', 20, yPos + 20);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(71, 85, 105);
      doc.text('AI Industrial Supervisor & Audit Council Divisi Produksi I (Pengolahan Tembakau)', 20, yPos + 28);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(2, 132, 199);
      doc.text('Prinsip: Read-Only / Zero-Mutation Watchdog (Fokus Audit, Analisa & Pengawasan)', 20, yPos + 34);

      yPos += 48;

      // Section: Landasan & Filosofi Utama
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('1. PRINSIP FUNDAMENTAL: ZERO-MUTATION & READ-ONLY WATCHDOG', 14, yPos);
      yPos += 7;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9);
      doc.setTextColor(51, 65, 85);
      const introText = [
        'Sistem Dewan 6 Karyawan AI didesain dengan batasan keamanan ketat:',
        '• TIDAK MENGUBAH / MENULIS DATA SUMBER: Seluruh kertas kerja Google Spreadsheet (DHP Tembakau,',
        '  Cengkeh, Krosok, Blend) serta Web Apps (Monitoring Stock PP1 & HR Staff) hanya dibaca (View-Only).',
        '• FOKUS PADA VALIDASI & DETEKSI ANOMALI: Menemukan ketidaksesuaian matematis, deviasi kadar air,',
        '  lonjakan susut, dan ketidaksesuaian logis sebelum laporan sampai ke meja Direksi.',
        '• DUKUNGAN KEPUTUSAN EKSEKUTIF: Menghasilkan rekomendasi tindakan prioritas dan simulasi skenario',
        '  untuk Manajer Operasional tanpa mengganggu kedaulatan entri data tim lapangan.'
      ];
      introText.forEach(line => {
        doc.text(line, 14, yPos);
        yPos += 5;
      });

      yPos += 4;

      // Section: Struktur Dewan 6 Karyawan AI
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('2. STRUKTUR 6 KARYAWAN AI & PEMBAGIAN WEWENANG PENGAWASAN', 14, yPos);
      yPos += 7;

      AI_EMPLOYEES.forEach((emp, idx) => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9.5);
        doc.setTextColor(30, 41, 59);
        doc.text(`${idx + 1}. [Peran ${emp.roleNumber}] ${emp.roleCalling} — ${emp.name}`, 14, yPos);
        yPos += 4.5;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8.5);
        doc.setTextColor(71, 85, 105);
        doc.text(`   • Sekup Pengawasan: ${emp.specialization}`, 14, yPos);
        yPos += 4;
        const mainMetric = emp.keyMetrics[0] ? `${emp.keyMetrics[0].label}: ${emp.keyMetrics[0].value}` : 'Standar SOP Aktif';
        doc.text(`   • Ambang / Standar: ${mainMetric}`, 14, yPos);
        yPos += 4;
        doc.text(`   • Output Kunci: ${emp.responsibilities.slice(0, 2).join('; ')}`, 14, yPos);
        yPos += 5.5;
      });

      renderPageFooter(1, 3);

      // ==========================================
      // PAGE 2: DETAILED OPERATIONAL PROCEDURES
      // ==========================================
      doc.addPage();
      renderPageHeader('PROSEDUR KERJA & AMBANG AUDIT');

      yPos = 26;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('3. STANDAR OPERASIONAL PROSEDUR (SOP) AUDIT PER KOMODITAS & PROSES', 14, yPos);
      yPos += 8;

      // Table Header
      doc.setFillColor(226, 232, 240);
      doc.rect(14, yPos, pageWidth - 28, 8, 'F');
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('Komoditas / Aspek', 18, yPos + 5.5);
      doc.text('Target Optimal', 65, yPos + 5.5);
      doc.text('Batas Bahaya (Alert)', 115, yPos + 5.5);
      doc.text('Tindakan Rekomendasi AI', 150, yPos + 5.5);
      yPos += 9;

      const sopRows = [
        { item: 'Cengkeh Rajang (KA%)', target: '12.0% – 13.5%', alert: '> 13.5% (Jamur) / < 11.5% (Hancur)', action: 'Aerasi/Jemur uap atau re-spray' },
        { item: 'Tembakau Rajang (KA%)', target: '11.5% – 13.0%', alert: '> 13.2% (Basah) / < 11.0% (Patah)', action: 'Pengaturan suhu drying cylinder' },
        { item: 'Krosok Gudang (KA%)', target: '13.0% – 14.5%', alert: '> 14.8% (Repacking riskan)', action: 'Pemisahan lot & ventilasi gudang' },
        { item: 'Hasil Blend Molen (KA%)', target: '12.5% – 13.8%', alert: 'Deviasi batch > 0.5%', action: 'Kalibrasi nozzle spuyer & mixer' },
        { item: 'Susut Rajang Tembakau', target: '1.2% – 1.8%', alert: '> 2.0% (Limbah debu tinggi)', action: 'Cek ketajaman pisau & feeder' },
        { item: 'Susut Rajang Cengkeh', target: '1.0% – 1.5%', alert: '> 1.8% (Ceceran lantai)', action: 'Audit blower & karung penampung' },
        { item: 'Susut Pengeringan Krosok', target: '2.5% – 3.8%', alert: '> 4.2% (Overheated)', action: 'Turunkan temperatur blower burner' },
        { item: 'Kesesuaian Rumus DHP', target: '100% Presisi', alert: 'Netto != Bruto - Tara', action: 'Karantina record, verifikasi fisik' },
        { item: 'Cutoff Entri DHP', target: '09:00 WIB', alert: 'Lewat jam 09:30 WIB', action: 'Notifikasi admin shift bersangkutan' },
        { item: 'Selisih Gudang (BSPP)', target: '0 Kg (Nol)', alert: 'Deviasi > 0.1% buffer', action: 'Opname fisik mendadak tim logistik' },
        { item: 'Presensi Staf Operator', target: '>= 95% Kehadiran', alert: '< 90% atau regu bolong', action: 'Rotasi staf cadangan / re-alokasi' }
      ];

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      sopRows.forEach((row, i) => {
        if (i % 2 === 1) {
          doc.setFillColor(248, 250, 252);
          doc.rect(14, yPos - 1, pageWidth - 28, 6.5, 'F');
        }
        doc.setTextColor(15, 23, 42);
        doc.text(row.item, 18, yPos + 3.5);
        doc.setTextColor(30, 41, 59);
        doc.text(row.target, 65, yPos + 3.5);
        doc.setTextColor(185, 28, 28);
        doc.text(row.alert, 115, yPos + 3.5);
        doc.setTextColor(3, 105, 161);
        doc.text(row.action, 150, yPos + 3.5);
        yPos += 7;
      });

      yPos += 6;

      // Section: Siklus Harian Pengawasan AI
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('4. SIKLUS HARIAN PENGAWASAN AI (DAILY AUDIT PROTOCOL)', 14, yPos);
      yPos += 7;

      const scheduleSteps = [
        { time: '07:00 – 07:30 WIB', title: 'Audit Kesiapan Shift Pagi & Presensi', desc: 'Peran 5 (Dewi Sartika) memindai absensi operator via HR Web App; deteksi kekosongan operator.' },
        { time: '08:00 – 09:00 WIB', title: 'Pemeriksaan Bahan Baku Awal (KA & Stock)', desc: 'Peran 1 & 4 memeriksa kondisi kelembapan lot tembakau & cengkeh yang akan diumpankan ke mesin.' },
        { time: '09:00 – 09:15 WIB', title: 'Cutoff Input & Validasi Integritas DHP', desc: 'Peran 3 (Ratna Veritas) mengunci data, memeriksa rumus Bruto-Tara-Netto-Susut seluruh batch.' },
        { time: '11:30 – 12:00 WIB', title: 'Audit Tengah Hari Susut & Efisiensi', desc: 'Peran 2 (Dr. Susanto) menghitung laju susut proses real-time; deteksi nozzle tersumbat.' },
        { time: '15:30 – 16:00 WIB', title: 'Rekonsiliasi BSPP & Penutupan Batch', desc: 'Peran 4 (Bambang Logistik) mencocokkan mutasi bahan keluar gudang vs hasil blend timbang.' },
        { time: '16:15 – 16:30 WIB', title: 'Sintesis Eksekutif & Ringkasan WhatsApp', desc: 'Peran 6 (Aria Mahardika) menerbitkan Factory Health Score & draf rekap untuk Direksi.' }
      ];

      scheduleSteps.forEach(st => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8.5);
        doc.setTextColor(2, 132, 199);
        doc.text(`[${st.time}] ${st.title}`, 14, yPos);
        yPos += 4;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(`  ${st.desc}`, 14, yPos);
        yPos += 5.5;
      });

      renderPageFooter(2, 3);

      // ==========================================
      // PAGE 3: INTEGRATION ARCHITECTURE & SIMULATION
      // ==========================================
      doc.addPage();
      renderPageHeader('ARSITEKTUR & PROTOKOL ESKALASI');

      yPos = 26;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('5. ARSITEKTUR KONEKSI DATA (100% NON-INVASIVE / VIEW-ONLY)', 14, yPos);
      yPos += 8;

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8.5);
      doc.setTextColor(51, 65, 85);
      const bridgeText = [
        'Diagram Alir Data Pengawasan:',
        '┌───────────────────────────────┐     Read-Only (Fetch/Parse)     ┌──────────────────────────────────┐',
        '│  Google Sheets DHP Harian     │ ──────────────────────────────> │                                  │',
        '│  (Tembakau, Cengkeh, Krosok)  │                                 │   MESIN PENGAWAS & AUDIT         │',
        '├───────────────────────────────┤     Read-Only (API/Snapshot)    │   DEWAN 6 KARYAWAN AI            │',
        '│  Web App Stock PP1 & BSPP     │ ──────────────────────────────> │   (Perhitungan Heuristik,        │',
        '├───────────────────────────────┤     Read-Only (Shift Roster)    │    Statistik, & Deteksi Deviasi) │',
        '│  Web App HR Staff & Karyawan  │ ──────────────────────────────> │                                  │',
        '└───────────────────────────────┘                                 └────────────────┬─────────────────┘',
        '                                                                                   │',
        '                                                                 Rekomendasi       │  Tanpa Mutasi Data',
        '                                                                 & Rekapitulasi    v',
        '                                                                  ┌──────────────────────────────────┐',
        '                                                                  │  MANAJER OPERASIONAL & DIREKSI   │',
        '                                                                  │  - Dashboard Indeks Kesehatan    │',
        '                                                                  │  - Simulasi Target Skenario      │',
        '                                                                  │  - Draf WhatsApp Harian          │',
        '                                                                  └──────────────────────────────────┘'
      ];
      doc.setFont('courier', 'normal');
      doc.setFontSize(7.5);
      bridgeText.forEach(line => {
        doc.text(line, 14, yPos);
        yPos += 3.8;
      });

      yPos += 6;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(15, 23, 42);
      doc.text('6. PROTOKOL ESKALASI ANOMALI (LEVEL 1 s/d LEVEL 3)', 14, yPos);
      yPos += 7;

      const escalations = [
        {
          level: 'LEVEL 1: PERINGATAN KUNING (DEVIASI RINGAN)',
          color: [217, 119, 6],
          desc: 'Kadar air menyentuh batas toleransi (+/- 0.3%) atau keterlambatan input < 30 menit. Tindakan: AI menampilkan badge kuning pada dashboard dan memberi notifikasi rutin.'
        },
        {
          level: 'LEVEL 2: PERINGATAN ORANYE (ANOMALI SEDANG)',
          color: [234, 88, 12],
          desc: 'Susut proses melonjak > 2.0%, formula selisih timbangan tidak balance, atau kekurangan 2 operator shift. Tindakan: Rekomendasi tindakan prioritas otomatis dibuat di konsol manajerial.'
        },
        {
          level: 'LEVEL 3: PERINGATAN MERAH (KRITIS / HALT PROSES)',
          color: [220, 38, 38],
          desc: 'Kadar air cengkeh > 14.0% (risiko jamur massal), selisih BSPP tidak berdokumen, atau potensi cacat mutu blend. Tindakan: AI mendesak tindakan stop-feed, eskalasi instan via draf WhatsApp Direksi.'
        }
      ];

      escalations.forEach(esc => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(9);
        doc.setTextColor(esc.color[0], esc.color[1], esc.color[2]);
        doc.text(esc.level, 14, yPos);
        yPos += 4.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(8);
        doc.setTextColor(71, 85, 105);
        doc.text(esc.desc, 14, yPos, { maxWidth: pageWidth - 28 });
        yPos += 9;
      });

      // Signature box
      yPos += 3;
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, yPos, pageWidth - 28, 24, 2, 2, 'F');
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(14, yPos, pageWidth - 28, 24, 2, 2, 'D');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.5);
      doc.setTextColor(15, 23, 42);
      doc.text('LEMBAR PENGESAHAN DOKUMEN SISTEM KERJA', 20, yPos + 6);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(71, 85, 105);
      doc.text('Ditetapkan untuk: Divisi Produksi I (Pengolahan) PT. BATU KARANG', 20, yPos + 11);
      doc.text(`Pemberlakuan Efektif: ${formatWibDate(new Date())} (Baku Terverifikasi)`, 20, yPos + 15);
      doc.text('Status Dokumen: Baku / Salinan Terverifikasi Sistem AI Studio', 20, yPos + 19);

      doc.text('Tertanda,', pageWidth - 60, yPos + 6);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text('Manajer Operasional PP1', pageWidth - 60, yPos + 19);

      renderPageFooter(3, 3);

      // Save document
      doc.save('Buku_Panduan_Dewan_6_Karyawan_AI_PT_Batu_Karang.pdf');
    } catch (err) {
      console.error('Error generating PDF:', err);
    } finally {
      setIsDownloadingPdf(false);
    }
  };

  const handleCopyText = () => {
    let text = `BUKU PANDUAN & SISTEM CARA KERJA
DEWAN 6 KARYAWAN AI PENGAWAS OPERASIONAL PABRIK
DIVISI PRODUKSI I (PENGOLAHAN) - PT. BATU KARANG (153)
PRINSIP UTAMA: 100% READ-ONLY / ZERO-MUTATION WATCHDOG
=============================================================

1. FILOSOFI DASAR SISTEM:
- Seluruh sumber data mentah (Google Sheets DHP Tembakau, Cengkeh, Krosok, Blend, Web Apps Stock BSPP, dan Web Apps HR Staff) hanya dibaca (View-Only).
- Sistem sama sekali TIDAK MEMILIKI HAK TULIS/HAPUS (No write/update/delete) ke database atau cell sumber.
- Fokus eksklusif pada audit kepatuhan, kebenaran rumus matematis, deteksi anomali, kalkulasi indeks kesehatan pabrik, dan penyusunan rekomendasi bagi Manajer Operasional.

2. STRUKTUR 6 KARYAWAN AI:
1. Peran 1: Auditor Mutu & Kadar Air (Ir. Tirta Wardhana)
   - Memantau KA% Cengkeh (12.0-13.5%), Tembakau (11.5-13.0%), Krosok (13.0-14.5%), Blend (12.5-13.8%).
   - Deteksi risiko jamur (KA terlalu tinggi) atau tembakau hancur/bubuk (KA terlalu kering).

2. Peran 2: Auditor Kesusutan Proses (Dr. Susanto Efendi)
   - Mengaudit rasio rendemen & susut rajang tembakau (< 1.8%), susut cengkeh (< 1.5%), susut krosok (< 3.8%).
   - Deteksi anomali susut minus (kebocoran timbangan) atau lonjakan susut abnormal (nozzle/feeder bocor).

3. Peran 3: Validator Integritas Data Proses (Ratna Veritas, S.Stat)
   - Mengaudit kebenaran rumus: Netto = Bruto - Tara; Susut = Netto Awal - Hasil.
   - Mengontrol kedisiplinan waktu cutoff entri data DHP harian sebelum jam 09:00 WIB.

4. Peran 4: Auditor Ketersediaan & Selisih Stock BSPP (Bambang Logistik, M.M.)
   - Mengintegrasikan data dari web monitoring-stock-pp-1-pro-api.vercel.app.
   - Memantau buffer stock, konsumsi bahan baku, akurasi stok fisik vs sistem, serta bukti selisih gudang (BSPP).

5. Peran 5: Auditor Presensi, HRD & Alokasi Peran (Dewi Sartika, S.Psi)
   - Mengintegrasikan data dari web hr-staff-pp-1-pro-api.vercel.app.
   - Memantau kehadiran 32 staf shift pengolahan, rasio operator mesin rajang/molen, dan mencegah kekurangan personel.

6. Peran 6: Penasihat Strategis Manajer Operasional (Aria Mahardika, M.M.)
   - Menghitung Factory Health Index (saat ini 96.8 / 100 PRIMA).
   - Menghubungkan seluruh temuan dari 5 AI spesialis menjadi 3 aksi prioritas dan draf laporan WhatsApp Direksi.

3. SIKLUS PENGAWASAN HARIAN:
- 07:00 WIB: Audit presensi & kesiapan regu shift pagi.
- 08:00 WIB: Audit kondisi kadar air & bahan baku siap olah.
- 09:00 WIB: Cutoff DHP & audit matematis konsistensi data.
- 11:30 WIB: Audit susut proses & efisiensi mesin tengah hari.
- 15:30 WIB: Rekonsiliasi BSPP pengeluaran gudang vs pemakaian proses.
- 16:15 WIB: Penerbitan Factory Health Score & draf briefing WhatsApp Direksi.
`;

    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-5 overflow-y-auto">
      <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-5xl w-full max-h-[94vh] flex flex-col shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden">
        
        {/* Top Bar Header */}
        <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-indigo-900/60 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/40 text-indigo-400 flex items-center justify-center font-bold font-mono text-lg shadow-inner">
              <BrainCircuit className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase tracking-wider">
                  Panduan Resmi Operasional
                </span>
                <span className="text-xs text-indigo-200 font-mono">PT. BATU KARANG (153)</span>
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-emerald-400 font-medium">
                  <Lock className="w-3 h-3" /> Read-Only Watchdog
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Buku Panduan &amp; Sistem Kerja Dewan 6 Karyawan AI
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all disabled:opacity-50"
              title="Download format PDF resmi"
            >
              <Download className={`w-3.5 h-3.5 ${isDownloadingPdf ? 'animate-bounce' : ''}`} />
              <span className="hidden sm:inline">{isDownloadingPdf ? 'Menyusun PDF...' : 'Unduh PDF (.pdf)'}</span>
              <span className="sm:hidden">PDF</span>
            </button>

            <button
              onClick={handlePrint}
              className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title="Cetak via browser"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak</span>
            </button>

            <button
              onClick={handleCopyText}
              className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700"
              title="Salin teks manual ke clipboard"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin' : 'Salin'}</span>
            </button>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors ml-1"
              aria-label="Tutup Panduan"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-slate-100 dark:bg-slate-950 border-b border-slate-200 dark:border-slate-800 px-4 py-2 flex items-center gap-2 overflow-x-auto shrink-0 text-xs">
          <button
            onClick={() => setActiveTab('ringkasan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ringkasan'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Ringkasan Eksekutif
          </button>
          <button
            onClick={() => setActiveTab('arsitektur')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'arsitektur'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Lock className="w-3.5 h-3.5 text-amber-500" />
            Arsitektur Zero-Mutation
          </button>
          <button
            onClick={() => setActiveTab('detail_karyawan')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'detail_karyawan'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <Bot className="w-3.5 h-3.5" />
            SOP 6 Karyawan AI
          </button>
          <button
            onClick={() => setActiveTab('sop_eskalasi')}
            className={`px-3 py-1.5 rounded-lg font-medium transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sop_eskalasi'
                ? 'bg-indigo-600 text-white shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5" />
            Siklus &amp; Eskalasi Anomali
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-800 dark:text-slate-200">
          
          {/* TAB 1: RINGKASAN EKSEKUTIF */}
          {activeTab === 'ringkasan' && (
            <div className="space-y-6">
              {/* Highlight Banner */}
              <div className="bg-gradient-to-r from-indigo-50 to-blue-50 dark:from-indigo-950/40 dark:to-blue-950/30 border border-indigo-200 dark:border-indigo-800/50 rounded-xl p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-indigo-600 text-white shrink-0 mt-0.5">
                    <ShieldCheck className="w-5 h-5" />
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-sm sm:text-base font-bold text-indigo-950 dark:text-indigo-200">
                      Misi Dewan 6 Karyawan AI Pengawas Operasional Pabrik
                    </h4>
                    <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                      Bertindak sebagai <span className="font-semibold text-indigo-600 dark:text-indigo-400">Auditor Digital Otonom &amp; Penasihat Strategis</span> bagi Manajer Operasional (Lalu Mahendra Ali Akbar) untuk mengawasi seluruh rantai pasok dan pemrosesan tembakau di Unit Pengolahan (PP1) PT. Batu Karang secara real-time, akurat, dan objektif.
                    </p>
                  </div>
                </div>
              </div>

              {/* Grid 6 Karyawan AI Cards */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Daftar Peran 6 Karyawan AI &amp; Domain Spesialisasi:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
                  {AI_EMPLOYEES.map((emp) => (
                    <div 
                      key={emp.id}
                      className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/60 shadow-sm hover:border-indigo-400 transition-all space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${emp.badgeColor}`}>
                          Peran {emp.roleNumber}
                        </span>
                        <span className="text-[10px] font-mono text-slate-400">
                          Real-Time / Per Batch
                        </span>
                      </div>

                      <div>
                        <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-tight">
                          {emp.roleCalling}
                        </h5>
                        <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          {emp.name}
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                        {emp.description}
                      </p>

                      <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
                        <span className="font-semibold">Standar Utama:</span>
                        <span className="font-mono text-slate-800 dark:text-slate-200">{emp.keyMetrics[0]?.value || 'SOP Aktif'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions at Bottom of Tab */}
              <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-slate-50 dark:bg-slate-950 rounded-xl border border-slate-200 dark:border-slate-800">
                <div className="text-xs text-slate-600 dark:text-slate-400">
                  Ingin membaca panduan ini secara offline di tablet / cetak fisik?
                </div>
                <button
                  onClick={handleDownloadPdf}
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow"
                >
                  <Download className="w-4 h-4" />
                  Unduh Dokumen PDF Lengkap (.pdf)
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: ARSITEKTUR ZERO-MUTATION */}
          {activeTab === 'arsitektur' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 flex items-start gap-3">
                <div className="p-2 rounded-lg bg-amber-500 text-slate-950 font-bold shrink-0">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-amber-950 dark:text-amber-200">
                    Protokol Non-Invasive &amp; Perlindungan Integritas Data Sumber
                  </h4>
                  <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                    Sesuai instruksi manajemen operasional: <strong className="text-amber-900 dark:text-amber-300">TIDAK DIPERKENANKAN MENGUBAH DATA APAPUN</strong> pada spreadsheet kertas kerja maupun web apps hulu. Sistem bekerja 100% sebagai pengawas, analis, dan pendeteksi anomali.
                  </p>
                </div>
              </div>

              {/* 3 Pillars of Security */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-sm">
                    1
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Read-Only Data Ingestion</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Data dari Google Sheets (ID: 1NDS55VchAgNAeJJbY12ANA8HyJDeNNhAZ33zbojpH5I) hanya diimpor dalam mode baca untuk ekstraksi data batch, berat, dan kadar air.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold text-sm">
                    2
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Isolasi Engine Audit</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Perhitungan deviasi susut, indeks kesehatan pabrik, dan simulasi penambahan target dijalankan di layer memori terpisah, tanpa pernah menyentuh formula cell asli.
                  </p>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/40 text-purple-600 dark:text-purple-400 flex items-center justify-center font-bold text-sm">
                    3
                  </div>
                  <h5 className="text-sm font-bold text-slate-900 dark:text-white">Jembatan Link Langsung</h5>
                  <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                    Aplikasi Stock &amp; HR dihubungkan melalui tautan otentik Vercel app dan pemantauan metrik KPI, menjaga kepemilikan otorisasi penuh di tangan admin masing-masing unit.
                  </p>
                </div>
              </div>

              {/* Data Flow Illustration */}
              <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto space-y-2 border border-slate-800">
                <div className="text-amber-400 font-bold">// ALUR PENGAWASAN AUDIT REAL-TIME</div>
                <div>[Kertas Kerja DHP Harian] ──(READ ONLY)──&gt; [Peran 1: Mutu KA &amp; Peran 2: Susut] ──┐</div>
                <div>[Web Stock PP1 &amp; BSPP]   ──(READ ONLY)──&gt; [Peran 4: Audit Stock &amp; Buffer]        ──┼─&gt; [Peran 6: Chief Advisor AI]</div>
                <div>[Web HR Staff &amp; Presensi]──(READ ONLY)──&gt; [Peran 5: Audit SDM &amp; Kehadiran]        ──┘      │</div>
                <div>                                                                                          v</div>
                <div className="text-emerald-400">[HASIL AUDIT] ──&gt; Indeks Kesehatan Pabrik &bull; Rekomendasi Tindakan &bull; Draf WhatsApp Direksi</div>
              </div>
            </div>
          )}

          {/* TAB 3: SOP DETAIL 6 KARYAWAN AI */}
          {activeTab === 'detail_karyawan' && (
            <div className="space-y-5">
              {AI_EMPLOYEES.map((emp) => (
                <div 
                  key={emp.id} 
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/40 space-y-3"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-200 dark:border-slate-800 pb-2.5">
                    <div className="flex items-center gap-2.5">
                      <span className={`text-xs font-bold px-2.5 py-1 rounded-lg ${emp.badgeColor}`}>
                        Peran {emp.roleNumber}
                      </span>
                      <div>
                        <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                          {emp.roleCalling}
                        </h4>
                        <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                          {emp.name} &bull; {emp.title}
                        </span>
                      </div>
                    </div>
                    <span className="text-xs text-slate-500 font-mono">
                      Frekuensi Audit: Real-Time / Per Batch
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                    <div className="space-y-1.5">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">Tugas Pokok &amp; Pengawasan:</div>
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                        {emp.description}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <div className="font-semibold text-slate-700 dark:text-slate-300">Indikator Kunci Audit:</div>
                      <ul className="space-y-1 text-slate-600 dark:text-slate-400">
                        {emp.keyMetrics.map((km, kIdx) => (
                          <li key={kIdx}>
                            &bull; <strong className="text-slate-900 dark:text-slate-200">{km.label}:</strong> {km.value} ({km.trend})
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-xs">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Tanggung Jawab &amp; Output Audit:</span>
                    <div className="flex flex-wrap gap-1.5 mt-1">
                      {emp.responsibilities.map((resp: string, rIdx: number) => (
                        <span key={rIdx} className="px-2 py-0.5 rounded bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400">
                          {resp}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* TAB 4: SIKLUS & ESKALASI ANOMALI */}
          {activeTab === 'sop_eskalasi' && (
            <div className="space-y-6">
              {/* Daily Schedule */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-indigo-500" />
                  Siklus Pengawasan Harian (Daily 24h Supervision Timeline)
                </h4>
                <div className="space-y-2.5">
                  {[
                    { time: '07:00 – 07:30 WIB', title: 'Audit Presensi Shift Pagi', role: 'Peran 5 (Dewi Sartika)', desc: 'Pengecekan absensi live via web HR. Memastikan regu rajang dan blend lengkap 100% sebelum mesin dinyalakan.' },
                    { time: '08:00 – 09:00 WIB', title: 'Audit Bahan Baku & Kadar Air Awal', role: 'Peran 1 (Ir. Tirta) & Peran 4 (Bambang)', desc: 'Validasi KA tembakau & cengkeh siap proses. Memastikan ketersediaan buffer gudang mencukupi target hari ini.' },
                    { time: '09:00 – 09:15 WIB', title: 'Cutoff Entri DHP & Validasi Formula', role: 'Peran 3 (Ratna Veritas)', desc: 'Penguncian rekapitulasi data harian. Validasi Bruto - Tara = Netto dan verifikasi paraf digital admin.' },
                    { time: '11:30 – 12:00 WIB', title: 'Audit Susut Tengah Hari & Performa Mesin', role: 'Peran 2 (Dr. Susanto)', desc: 'Mengevaluasi rendemen proses. Jika susut cengkeh > 1.8%, merekomendasikan pembersihan nozzle/blower.' },
                    { time: '15:30 – 16:00 WIB', title: 'Rekonsiliasi BSPP & Penutupan Batch', role: 'Peran 4 (Bambang Logistik)', desc: 'Pencocokan mutasi keluar bahan vs hasil timbang akhir blend mole. Memastikan nol bukti selisih fisik.' },
                    { time: '16:15 – 16:30 WIB', title: 'Sintesis Eksekutif & Ringkasan WhatsApp', role: 'Peran 6 (Aria Mahardika)', desc: 'Penerbitan skor kesehatan pabrik dan draf pesan rekapitulasi untuk diteruskan Manajer ke WhatsApp Direksi.' }
                  ].map((s, idx) => (
                    <div key={idx} className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2 py-0.5 rounded">
                            {s.time}
                          </span>
                          <span className="text-xs font-bold text-slate-900 dark:text-white">
                            {s.title}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {s.desc}
                        </p>
                      </div>
                      <span className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                        {s.role}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* 3 Escalation Levels */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-500" />
                  Matriks Eskalasi Anomali &amp; Tindakan Mitigasi
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  <div className="p-4 rounded-xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/50 dark:bg-amber-950/30 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-400 text-slate-950 uppercase">
                      Level 1: Deviasi Ringan
                    </span>
                    <h5 className="text-xs font-bold text-amber-900 dark:text-amber-200">Peringatan Kuning</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      KA menyentuh batas (+/- 0.3%) atau input telat &lt; 30 menit. Sistem memberi alert status dan rekomendasi penyesuaian burner.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-orange-200 dark:border-orange-900/60 bg-orange-50/50 dark:bg-orange-950/30 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-orange-500 text-white uppercase">
                      Level 2: Anomali Sedang
                    </span>
                    <h5 className="text-xs font-bold text-orange-900 dark:text-orange-200">Peringatan Oranye</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      Susut &gt; 2.0%, formula Bruto-Tara selisih, atau regu kurang 2 operator. Rekomendasi prioritas dibuat otomatis di dashboard.
                    </p>
                  </div>

                  <div className="p-4 rounded-xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/50 dark:bg-rose-950/30 space-y-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-rose-600 text-white uppercase">
                      Level 3: Kritis / Halt
                    </span>
                    <h5 className="text-xs font-bold text-rose-900 dark:text-rose-200">Peringatan Merah</h5>
                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      KA Cengkeh &gt; 14% (risiko jamur), selisih BSPP tanpa dokumen. Dewan AI mendesak stop-feed dan briefing instan via WhatsApp Direksi.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Modal Bottom Bar */}
        <div className="bg-slate-50 dark:bg-slate-950 px-4 sm:px-6 py-3 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Status Sistem: Siap Operasi &bull; File PDF Siap Unduh Kapan Saja</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              onClick={handleDownloadPdf}
              disabled={isDownloadingPdf}
              className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow transition-all disabled:opacity-50"
            >
              <Download className="w-3.5 h-3.5" />
              {isDownloadingPdf ? 'Menghasilkan PDF...' : 'Unduh Buku Panduan PDF'}
            </button>

            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors"
            >
              Tutup
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
