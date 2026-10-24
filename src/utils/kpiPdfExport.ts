import { jsPDF } from 'jspdf';
import { OfficialKpiProfile, QualitativeSynthesis, Kpi360Parameter } from '../data/kpi360TemplateData';
import { KpiMetric } from '../types';
import { HrStaffRecord } from '../data/hrStaffMasterData';
import { formatWibDate, formatWibTime } from './indonesiaDateUtils';
import { getKriteriaFromScore } from '../data/kpiStaffProfilesData';

export type KpiExportTarget = 'ALL' | 'OFFICIAL_FORM' | 'QUALITATIVE_BARS' | 'WEIGHT_SIMULATION';

export interface KpiPdfExportOptions {
  profile: OfficialKpiProfile;
  synthesis: QualitativeSynthesis;
  domainAverages: { category: string; avg: number; count: number }[];
  indexKinerja: number;
  activeRole: { id: string; title: string; department?: string };
  roleMetrics: KpiMetric[];
  metricScores: Record<string, number>;
  totalWeightedScore: number;
  grade: string;
  actionAdvice: string;
  staffRecord?: HrStaffRecord;
}

// Helper to draw standard branded header on any page
function drawPageHeader(doc: jsPDF, title: string, subtitle: string, pageNum?: number, totalPages?: number) {
  const pageWidth = doc.internal.pageSize.getWidth();
  
  // Header background bar (slate-900)
  doc.setFillColor(15, 23, 42);
  doc.rect(0, 0, pageWidth, 17, 'F');
  
  // Gold accent strip
  doc.setFillColor(245, 158, 11);
  doc.rect(0, 17, pageWidth, 1.2, 'F');
  
  // Title texts
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text('PT BATU KARANG - DIVISI PRODUKSI I (PENGOLAHAN)', 14, 7.5);
  
  doc.setFontSize(7.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text(title.toUpperCase(), 14, 12.5);

  if (pageNum !== undefined && totalPages !== undefined) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(245, 158, 11);
    doc.text(`Hal ${pageNum} dari ${totalPages}`, pageWidth - 14, 10, { align: 'right' });
  }
}

// Helper to draw standard footer on any page
function drawPageFooter(doc: jsPDF, note: string = '') {
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const y = pageHeight - 9;
  
  doc.setDrawColor(226, 232, 240);
  doc.setLineWidth(0.3);
  doc.line(14, y - 2, pageWidth - 14, y - 2);
  
  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(148, 163, 184);
  
  const printStamp = `Dicetak: ${formatWibDate(new Date())} • ${formatWibTime(new Date())} | Sistem KPI 360° Divisi Produksi I PT Batu Karang`;
  doc.text(printStamp, 14, y + 2);
  
  if (note) {
    doc.setFont('helvetica', 'bold');
    doc.text(note, pageWidth - 14, y + 2, { align: 'right' });
  }
}

// Helper to draw employee identity banner
function drawIdentityBlock(doc: jsPDF, options: KpiPdfExportOptions, startY: number): number {
  const { profile, indexKinerja, staffRecord } = options;
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = startY;

  // Box background
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.setLineWidth(0.3);
  doc.roundedRect(14, y, pageWidth - 28, 24, 2, 2, 'FD');

  // Left col: Nama & Jabatan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(15, 23, 42);
  doc.text(profile.nama.toUpperCase(), 18, y + 6);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(71, 85, 105);
  doc.text(`Jabatan: ${profile.jabatan}`, 18, y + 11);
  doc.text(`NIP: ${profile.nip}  •  Level: ${profile.level}  •  Sekup: ${profile.sekup}`, 18, y + 16);
  
  const statusKontrak = staffRecord?.status || 'PKWT';
  doc.text(`Status Kepegawaian: ${statusKontrak}  •  Divisi: Produksi I (Pengolahan)`, 18, y + 21);

  // Right col: Badge Indeks Kinerja
  const rightBoxX = pageWidth - 64;
  doc.setFillColor(254, 243, 199); // amber-100
  doc.setDrawColor(245, 158, 11); // amber-500
  doc.roundedRect(rightBoxX, y + 3.5, 46, 17, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(146, 64, 14); // amber-800
  doc.text('INDEKS KINERJA 360°', rightBoxX + 23, y + 8, { align: 'center' });

  doc.setFontSize(11);
  doc.setTextColor(180, 83, 9); // amber-700
  doc.text(`${indexKinerja.toFixed(2)} / 5.00`, rightBoxX + 23, y + 14, { align: 'center' });

  doc.setFontSize(6.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(15, 23, 42);
  doc.text(`[ ${getKriteriaFromScore(indexKinerja)} ]`, rightBoxX + 23, y + 18.5, { align: 'center' });

  return y + 28;
}

// ============================================================================
// 1. LEMBAR FORMULIR RESMI KPI (TEMPLATE PT BATU KARANG)
// ============================================================================
export function renderOfficialFormPage(doc: jsPDF, options: KpiPdfExportOptions, pageNum: number, totalPages: number): void {
  const { profile } = options;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  drawPageHeader(
    doc, 
    'LEMBAR 1: FORMULIR RESMI PENILAIAN KINERJA KARYAWAN (KPI 360°)', 
    'Template Resmi PT Batu Karang',
    pageNum,
    totalPages
  );

  let y = drawIdentityBlock(doc, options, 22);

  // Parameters Table Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  const templateLabel = profile.templateVersion === 'COMBINED_20' 
    ? 'OPSI C - 20 POIN SINERGIS A & B' 
    : profile.templateVersion === 'RECOMMENDED_16' 
      ? 'OPSI B - 16 POIN LEAN INDUSTRI' 
      : 'OPSI A - 20 POIN WARISAN FISIK';
  doc.text(`TABEL PARAMETER EVALUASI KINERJA (${templateLabel})`, 14, y);
  y += 4;

  // Table columns definition
  const colX = {
    no: 14,
    param: 24,
    cat: 104,
    total: 138,
    avg: 156,
    kriteria: 172,
    rightEdge: pageWidth - 14
  };

  // Header row
  doc.setFillColor(241, 245, 249);
  doc.rect(14, y, pageWidth - 28, 6.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  doc.line(14, y + 6.5, pageWidth - 14, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('NO', colX.no + 3, y + 4.5, { align: 'center' });
  doc.text('PARAMETER PENILAIAN KINERJA', colX.param + 1, y + 4.5);
  doc.text('KATEGORI', colX.cat + 1, y + 4.5);
  doc.text('TOTAL', colX.total + 7, y + 4.5, { align: 'center' });
  doc.text('AVG', colX.avg + 6, y + 4.5, { align: 'center' });
  doc.text('KRITERIA (BARS)', colX.kriteria + 11, y + 4.5, { align: 'center' });

  y += 6.5;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);

  profile.parameters.forEach((param, index) => {
    const rowHeight = 5.2;
    // Alternate row shading
    if (index % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + rowHeight, pageWidth - 14, y + rowHeight);

    // No
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'bold');
    doc.text(param.subCategoryNumber, colX.no + 3, y + 3.8, { align: 'center' });

    // Name (truncated if too long)
    doc.setTextColor(15, 23, 42);
    let displayName = param.name;
    if (displayName.length > 52) {
      displayName = displayName.substring(0, 50) + '...';
    }
    doc.text(displayName, colX.param + 1, y + 3.8);

    // Category
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    doc.text(param.category, colX.cat + 1, y + 3.8);

    // Total
    doc.setFont('helvetica', 'bold');
    doc.text(param.totalScore.toFixed(1), colX.total + 7, y + 3.8, { align: 'center' });

    // Avg
    doc.setTextColor(180, 83, 9);
    doc.text(param.avgScore.toFixed(2), colX.avg + 6, y + 3.8, { align: 'center' });

    // Kriteria with BARS Level Tag
    doc.setTextColor(15, 23, 42);
    doc.setFontSize(5.8);
    const barsLvl = param.avgScore >= 4.05 ? 'L5' : param.avgScore >= 3.05 ? 'L4' : param.avgScore >= 2.05 ? 'L3' : param.avgScore >= 1.05 ? 'L2' : 'L1';
    doc.text(`[${barsLvl}] ${param.kriteria}`, colX.kriteria + 11, y + 3.8, { align: 'center' });
    doc.setFontSize(6.5);

    y += rowHeight;
  });

  // Summary box (Presensi & Sanksi)
  y += 3;
  const boxWidth = (pageWidth - 28 - 4) / 2;

  // Left summary: Presensi Riil
  doc.setFillColor(248, 250, 252);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, boxWidth, 23, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text('CATATAN PRESENSI RIIL OPERASIONAL', 18, y + 5);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tingkat Kehadiran: ${profile.catatanPresensi.persentaseKehadiran}% (${profile.catatanPresensi.periode || profile.periodePenilaian})`, 18, y + 10);
  doc.text(`Alpha: ${profile.catatanPresensi.alpha} hari  |  Ijin: ±${profile.catatanPresensi.ijinMenit} menit`, 18, y + 14.5);
  doc.text(`Sakit: ${profile.catatanPresensi.sakit} hari  |  Pulang Awal: ±${profile.catatanPresensi.pulangAwalMenit} menit`, 18, y + 19);

  // Right summary: Sanksi Administratif
  const rightX = 14 + boxWidth + 4;
  doc.setFillColor(profile.sanksiAdministratif.length > 0 ? 254 : 240, profile.sanksiAdministratif.length > 0 ? 242 : 253, profile.sanksiAdministratif.length > 0 ? 242 : 244);
  doc.setDrawColor(profile.sanksiAdministratif.length > 0 ? 248 : 187, profile.sanksiAdministratif.length > 0 ? 113 : 247, profile.sanksiAdministratif.length > 0 ? 113 : 208);
  doc.roundedRect(rightX, y, boxWidth, 23, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(profile.sanksiAdministratif.length > 0 ? 185 : 21, profile.sanksiAdministratif.length > 0 ? 28 : 128, profile.sanksiAdministratif.length > 0 ? 28 : 61);
  doc.text('CATATAN SANKSI ADMINISTRATIF & KEDISIPLINAN', rightX + 4, y + 5);

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  if (profile.sanksiAdministratif.length > 0) {
    profile.sanksiAdministratif.slice(0, 2).forEach((sanksi, i) => {
      const splitS = doc.splitTextToSize(`• ${sanksi}`, boxWidth - 8);
      doc.text(splitS, rightX + 4, y + 10 + i * 5);
    });
  } else {
    doc.text('• Nihil sanksi administratif (Catatan disiplin bersih)', rightX + 4, y + 10);
    doc.text('• Memenuhi seluruh protokol K3 & SOP Divisi Produksi I', rightX + 4, y + 15);
  }

  y += 26;

  // Signatures Section (3 Columns)
  const sigColWidth = (pageWidth - 28) / 3;
  const sigY = y + 2;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7);
  doc.setTextColor(71, 85, 105);

  doc.text('Pekerja Yang Dinilai,', 14 + sigColWidth * 0.5, sigY, { align: 'center' });
  doc.text('Atasan Penilai Langsung,', 14 + sigColWidth * 1.5, sigY, { align: 'center' });
  doc.text('Mengetahui HRD Korporat,', 14 + sigColWidth * 2.5, sigY, { align: 'center' });

  // Signature lines
  const lineY = sigY + 16;
  doc.setDrawColor(148, 163, 184);
  doc.line(14 + 10, lineY, 14 + sigColWidth - 10, lineY);
  doc.line(14 + sigColWidth + 10, lineY, 14 + sigColWidth * 2 - 10, lineY);
  doc.line(14 + sigColWidth * 2 + 10, lineY, 14 + sigColWidth * 3 - 10, lineY);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(profile.nama, 14 + sigColWidth * 0.5, lineY + 4, { align: 'center' });
  doc.text('Manajer Operasional / Plt', 14 + sigColWidth * 1.5, lineY + 4, { align: 'center' });
  doc.text('HRD Division Batu Karang', 14 + sigColWidth * 2.5, lineY + 4, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.5);
  doc.setTextColor(100, 116, 139);
  doc.text(`NIP: ${profile.nip}`, 14 + sigColWidth * 0.5, lineY + 7.5, { align: 'center' });
  doc.text('Divisi Produksi I', 14 + sigColWidth * 1.5, lineY + 7.5, { align: 'center' });
  doc.text('Pusat Administrasi & Legal', 14 + sigColWidth * 2.5, lineY + 7.5, { align: 'center' });

  drawPageFooter(doc, 'Lembar 1: Formulir Resmi KPI');
}

// ============================================================================
// 2. LEMBAR PENERJEMAH KUALITATIF & REKOMENDASI EKSEKUTIF (BARS)
// ============================================================================
export function renderQualitativePage(doc: jsPDF, options: KpiPdfExportOptions, pageNum: number, totalPages: number): void {
  const { profile, synthesis, domainAverages } = options;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  drawPageHeader(
    doc, 
    'LEMBAR 2: PENERJEMAH KUALITATIF & REKOMENDASI EKSEKUTIF (BARS)', 
    'Sintesis Narasi Perilaku Kerja Operasional Pabrik',
    pageNum,
    totalPages
  );

  let y = drawIdentityBlock(doc, options, 22);

  // Section 1: Behavioral Persona Summary
  doc.setFillColor(238, 242, 255); // indigo-50
  doc.setDrawColor(199, 210, 254);
  doc.roundedRect(14, y, pageWidth - 28, 30, 2, 2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(67, 56, 202); // indigo-700
  doc.text('I. SINTESIS PERSONA PERILAKU KERJA (NARRATIVE PERFORMANCE SYNTHESIS)', 18, y + 5.5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(51, 65, 85);
  const splitPersona = doc.splitTextToSize(synthesis.personaSummary, pageWidth - 36);
  doc.text(splitPersona, 18, y + 10.5);

  y += 33;

  // Section 2: Anomaly / Discrepancy Alert (if any)
  if (synthesis.discrepancyAlert.hasAlert) {
    doc.setFillColor(254, 242, 242); // red-50
    doc.setDrawColor(248, 113, 113);
    doc.roundedRect(14, y, pageWidth - 28, 20, 2, 2, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(185, 28, 28);
    doc.text(`[PERINGATAN ANOMALI LAPANGAN] ${synthesis.discrepancyAlert.title}`, 18, y + 5.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.setTextColor(127, 29, 29);
    const splitAlert = doc.splitTextToSize(synthesis.discrepancyAlert.description, pageWidth - 36);
    doc.text(splitAlert, 18, y + 10);

    y += 23;
  }

  // Section 3: Radar / Rekapitulasi 4 Domain Kompetensi
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('II. REKAPITULASI RATA-RATA 4 DOMAIN KOMPETENSI OPERASIONAL', 14, y);
  y += 4;

  const cardWidth = (pageWidth - 28 - 9) / 4;
  domainAverages.forEach((dom, i) => {
    const cardX = 14 + i * (cardWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(cardX, y, cardWidth, 16, 1.5, 1.5, 'FD');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.8);
    doc.setTextColor(71, 85, 105);
    doc.text(dom.category.toUpperCase(), cardX + cardWidth / 2, y + 4.5, { align: 'center' });

    doc.setFontSize(10.5);
    doc.setTextColor(15, 23, 42);
    doc.text(`${dom.avg.toFixed(2)}`, cardX + cardWidth / 2, y + 10.5, { align: 'center' });

    doc.setFontSize(6.2);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 116, 139);
    doc.text(`(${dom.count} Parameter)`, cardX + cardWidth / 2, y + 14, { align: 'center' });
  });

  y += 20;

  // Section 4: Evaluasi Rekan Kerja (Peer Review 360°)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('III. CATATAN KUALITATIF REKAN KERJA (PEER REVIEW 360°)', 14, y);
  y += 4;

  const validFeedbacks = profile.peerFeedbacks.filter(fb => fb.respondentName && fb.respondentName.trim().length > 0);
  if (validFeedbacks.length > 0) {
    const peerColWidth = (pageWidth - 28 - 4) / 2;
    validFeedbacks.slice(0, 2).forEach((fb, i) => {
      const peerX = 14 + i * (peerColWidth + 4);
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(203, 213, 225);
      doc.roundedRect(peerX, y, peerColWidth, 31, 1.5, 1.5, 'FD');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.2);
      doc.setTextColor(15, 23, 42);
      doc.text(`${fb.respondentName} (${fb.roleInFactory})`, peerX + 4, y + 5);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6.5);
      doc.setTextColor(16, 149, 102); // emerald-600
      const pos = doc.splitTextToSize(`(+) Kekuatan: ${fb.positiveFeedback}`, peerColWidth - 8);
      doc.text(pos, peerX + 4, y + 9.5);

      doc.setTextColor(217, 119, 6); // amber-600
      const imp = doc.splitTextToSize(`(-) Perlu Pembenahan: ${fb.improvementFeedback}`, peerColWidth - 8);
      doc.text(imp, peerX + 4, y + 18);

      if (fb.recommendation) {
        doc.setTextColor(79, 70, 229); // indigo-600
        const rec = doc.splitTextToSize(`Usulan: ${fb.recommendation}`, peerColWidth - 8);
        doc.text(rec, peerX + 4, y + 26.5);
      }
    });
    y += 35;
  } else {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(14, y, pageWidth - 28, 12, 1.5, 1.5, 'FD');
    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.text('(Responden rekan kerja dan catatan kualitatif dikosongkan)', 18, y + 7.5);
    y += 16;
  }

  // Section 5: Rencana Aksi Pembinaan Operasional (Action Plan 30-60-90 Hari)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(180, 83, 9);
  doc.text('IV. RENCANA AKSI PEMBINAAN OPERASIONAL (30-60-90 HARI)', 14, y);
  y += 4;

  const planWidth = (pageWidth - 28 - 6) / 3;
  synthesis.coachingActionPlan.forEach((plan, i) => {
    const planX = 14 + i * (planWidth + 3);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(planX, y, planWidth, 34, 1.5, 1.5, 'FD');

    // Header badge
    doc.setFillColor(245, 158, 11);
    doc.rect(planX, y, planWidth, 5, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(15, 23, 42);
    doc.text(plan.targetTimeline.toUpperCase(), planX + planWidth / 2, y + 3.5, { align: 'center' });

    doc.setFontSize(7.2);
    doc.setTextColor(67, 56, 202);
    doc.text(plan.focusArea, planX + 3, y + 9.5);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.4);
    doc.setTextColor(51, 65, 85);
    const stepLines = doc.splitTextToSize(plan.concreteStep, planWidth - 6);
    doc.text(stepLines, planX + 3, y + 14);

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(`Mentor: ${plan.mentor}`, planX + 3, y + 31);
  });

  drawPageFooter(doc, 'Lembar 2: Penerjemah Kualitatif BARS & Rekomendasi Eksekutif');
}

// ============================================================================
// 3. LEMBAR SIMULASI BOBOT METRIK JOB DESK (0 - 100)
// ============================================================================
export function renderWeightSimulationPage(doc: jsPDF, options: KpiPdfExportOptions, pageNum: number, totalPages: number): void {
  const { profile, activeRole, roleMetrics, metricScores, totalWeightedScore, grade, actionAdvice } = options;
  const pageWidth = doc.internal.pageSize.getWidth();
  
  drawPageHeader(
    doc, 
    'LEMBAR 3: SIMULASI BOBOT METRIK JOB DESK (0 - 100)', 
    'SK Direksi No: 01/AS/DRK/BKR/VII/2024 • Pembobotan Resmi Divisi',
    pageNum,
    totalPages
  );

  let y = drawIdentityBlock(doc, options, 22);

  // Role details block
  doc.setFillColor(241, 245, 249);
  doc.setDrawColor(203, 213, 225);
  doc.roundedRect(14, y, pageWidth - 28, 11, 1.5, 1.5, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`PERAN METRIK: ${activeRole.title.toUpperCase()}`, 18, y + 5);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);
  doc.setTextColor(71, 85, 105);
  doc.text(`Departemen: ${activeRole.department || 'Operasional Produksi I'}  •  Dasar Acuan: Evaluator Job Description & Matrix SOP Divisi`, 18, y + 8.8);

  y += 15;

  // Table of Metrics
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(15, 23, 42);
  doc.text(`RINCIAN METRIK BOBOT RESMI (${roleMetrics.length} METRIK TERDAFTAR)`, 14, y);
  y += 4;

  // Table header
  doc.setFillColor(226, 232, 240);
  doc.rect(14, y, pageWidth - 28, 6.5, 'F');
  doc.setDrawColor(203, 213, 225);
  doc.line(14, y, pageWidth - 14, y);
  doc.line(14, y + 6.5, pageWidth - 14, y + 6.5);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(6.8);
  doc.setTextColor(51, 65, 85);
  doc.text('NO', 18, y + 4.5, { align: 'center' });
  doc.text('KODE & INDIKATOR METRIK', 26, y + 4.5);
  doc.text('TARGET RESMI', 120, y + 4.5);
  doc.text('BOBOT', 145, y + 4.5, { align: 'center' });
  doc.text('SKOR', 162, y + 4.5, { align: 'center' });
  doc.text('KONTRIBUSI', 184, y + 4.5, { align: 'center' });

  y += 6.5;

  // Table rows
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6.8);

  roleMetrics.forEach((m, idx) => {
    const currentScore = metricScores[m.id] ?? 90;
    const weighted = Number(((currentScore * m.weight) / 100).toFixed(2));
    const rowHeight = 7;

    if (idx % 2 === 1) {
      doc.setFillColor(248, 250, 252);
      doc.rect(14, y, pageWidth - 28, rowHeight, 'F');
    }

    doc.setDrawColor(226, 232, 240);
    doc.line(14, y + rowHeight, pageWidth - 14, y + rowHeight);

    // No
    doc.setTextColor(100, 116, 139);
    doc.text(`${idx + 1}`, 18, y + 4.8, { align: 'center' });

    // Name & Code
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(m.name, 26, y + 3.5);
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(6.2);
    doc.setTextColor(100, 116, 139);
    doc.text(`Kode: ${m.code}`, 26, y + 6.2);
    doc.setFontSize(6.8);

    // Target
    doc.setTextColor(71, 85, 105);
    doc.text(`${m.target} ${m.unit}`, 120, y + 4.8);

    // Bobot
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(15, 23, 42);
    doc.text(`${m.weight}%`, 145, y + 4.8, { align: 'center' });

    // Skor Realisasi
    doc.setTextColor(180, 83, 9);
    doc.text(`${currentScore}`, 162, y + 4.8, { align: 'center' });

    // Kontribusi Tertimbang
    doc.setTextColor(67, 56, 202);
    doc.text(`+${weighted.toFixed(2)}`, 184, y + 4.8, { align: 'center' });

    y += rowHeight;
  });

  y += 6;

  // Final Results & Management Action Box
  doc.setFillColor(15, 23, 42); // slate-900
  doc.roundedRect(14, y, pageWidth - 28, 44, 2, 2, 'F');

  // Left summary in box
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.5);
  doc.setTextColor(245, 158, 11);
  doc.text('HASIL SIMULASI AKHIR EVALUASI BOBOT METRIK', 20, y + 8);

  doc.setFontSize(6.8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(226, 232, 240);
  doc.text('Skor Tertimbang Kumulatif:', 20, y + 14);

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(22);
  doc.setTextColor(255, 255, 255);
  doc.text(`${totalWeightedScore.toFixed(2)}`, 20, y + 25);

  doc.setFontSize(7.5);
  doc.setTextColor(148, 163, 184);
  doc.text('/ 100.00', 58, y + 25);

  // Grade badge
  doc.setFillColor(245, 158, 11);
  doc.roundedRect(20, y + 28, 55, 10, 1.5, 1.5, 'F');
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(15, 23, 42);
  doc.text(`GRADE: ${grade}`, 47.5, y + 34.5, { align: 'center' });

  // Right advice in box
  const rightAdviceX = 85;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8);
  doc.setTextColor(245, 158, 11);
  doc.text('ARAHAN TINDAK LANJUT MANAJEMEN OPERASIONAL:', rightAdviceX, y + 8);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.2);
  doc.setTextColor(241, 245, 249);
  const splitAdvice = doc.splitTextToSize(actionAdvice, pageWidth - rightAdviceX - 22);
  doc.text(splitAdvice, rightAdviceX, y + 14);

  doc.setFontSize(6.5);
  doc.setTextColor(148, 163, 184);
  doc.text('*Dasar hukum sanksi atau promosi: SK Direksi No: 01/AS/DRK/BKR/VII/2024 PT Batu Karang.', rightAdviceX, y + 36);

  drawPageFooter(doc, 'Lembar 3: Simulasi Bobot Metrik Job Desk (0-100)');
}

// ============================================================================
// MAIN EXPORT CONTROLLER
// ============================================================================
export function exportKpiPdf(target: KpiExportTarget, options: KpiPdfExportOptions): void {
  const { profile } = options;
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const sanitizedName = profile.nama.replace(/\s+/g, '_');
  const sanitizedPeriod = profile.periodePenilaian.replace(/\s+/g, '_');

  if (target === 'ALL') {
    // 3 Pages Total
    renderOfficialFormPage(doc, options, 1, 3);
    doc.addPage();
    renderQualitativePage(doc, options, 2, 3);
    doc.addPage();
    renderWeightSimulationPage(doc, options, 3, 3);

    doc.save(`KPI-360-LENGKAP-${sanitizedName}-${sanitizedPeriod}.pdf`);
  } else if (target === 'OFFICIAL_FORM') {
    renderOfficialFormPage(doc, options, 1, 1);
    doc.save(`KPI-360-LEMBAR-1-FORMULIR-RESMI-${sanitizedName}-${sanitizedPeriod}.pdf`);
  } else if (target === 'QUALITATIVE_BARS') {
    renderQualitativePage(doc, options, 1, 1);
    doc.save(`KPI-360-LEMBAR-2-PENERJEMAH-BARS-${sanitizedName}-${sanitizedPeriod}.pdf`);
  } else if (target === 'WEIGHT_SIMULATION') {
    renderWeightSimulationPage(doc, options, 1, 1);
    doc.save(`KPI-360-LEMBAR-3-BOBOT-METRIK-${sanitizedName}-${sanitizedPeriod}.pdf`);
  }
}
