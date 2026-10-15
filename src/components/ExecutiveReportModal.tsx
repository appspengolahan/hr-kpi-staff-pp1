import React, { useState } from 'react';
import { KPI_METRICS_DATA } from '../data/kpiMetricsData';
import { POSITIONS_DATA } from '../data/jobDescriptions';
import { formatWibDate } from '../utils/indonesiaDateUtils';
import { 
  FileText, 
  Printer, 
  Copy, 
  Check, 
  Download, 
  Building2, 
  ShieldCheck, 
  X,
  ExternalLink
} from 'lucide-react';

interface ExecutiveReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExecutiveReportModal: React.FC<ExecutiveReportModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyText = () => {
    let summaryText = `LAPORAN REKOMENDASI MATRIKS KPI & STRUKTUR OPERASIONAL
DIVISI PRODUKSI I (PENGOLAHAN) - PT. BATU KARANG (153)
Ketetapan Perusahaan No: 01/AS/DRK/BKR/VII/2024
======================================================\n\n`;

    POSITIONS_DATA.forEach(pos => {
      summaryText += `JABATAN: ${pos.title.toUpperCase()} ${pos.incumbentName ? `(${pos.incumbentName})` : ''}\n`;
      summaryText += `Atasan Langsung: ${pos.directSupervisor}\n`;
      summaryText += `Sekup: ${pos.operationalScope}\n`;
      summaryText += `Tanggung Jawab Utama: ${pos.dualAccountability.primaryResponsibility}\n`;
      summaryText += `Tanggung Jawab Kedua: ${pos.dualAccountability.secondaryResponsibility}\n`;
      summaryText += `METRIK KINERJA (KPI):\n`;

      const metrics = KPI_METRICS_DATA.filter(m => m.roleId === pos.id);
      metrics.forEach((m, idx) => {
        summaryText += `  ${idx + 1}. [${m.code}] ${m.name} (Bobot: ${m.weight}%)\n`;
        summaryText += `     - Target: ${m.target} | Frekuensi: ${m.frequency}\n`;
        summaryText += `     - Rumus: ${m.formula}\n`;
        summaryText += `     - Sumber Data: ${m.dataSource}\n`;
      });
      summaryText += `\n------------------------------------------------------\n\n`;
    });

    navigator.clipboard.writeText(summaryText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Bar */}
        <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold font-mono text-lg">
              153
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-400 text-slate-950 uppercase">
                  Dokumen Resmi Operasional
                </span>
                <span className="text-xs text-slate-400 font-mono">PT. BATU KARANG</span>
              </div>
              <h3 className="text-base sm:text-lg font-bold text-white tracking-tight mt-0.5">
                Rekapitulasi Matriks Penilaian Kinerja (KPI) Divisi Produksi I
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyText}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-all"
              title="Salin seluruh teks laporan"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Tersalin!' : 'Salin Teks'}</span>
            </button>

            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow"
              title="Cetak format laporan resmi"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Cetak / PDF</span>
            </button>

            <button
              onClick={onClose}
              className="text-slate-400 hover:text-white p-1 rounded-lg ml-1"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Printable Content Body */}
        <div className="p-6 sm:p-8 overflow-y-auto space-y-6 text-slate-800 text-xs leading-relaxed">
          
          {/* Official Document Letterhead */}
          <div className="text-center pb-6 border-b-2 border-slate-900 space-y-1">
            <h2 className="text-lg font-black text-slate-950 uppercase tracking-wider font-serif">
              PT. BATU KARANG &ndash; DIVISI PRODUKSI 1 (PENGOLAHAN)
            </h2>
            <p className="text-xs font-semibold text-slate-700">
              PENGOLAHAN BAHAN BAKU MENJADI TEMBAKAU BLENDED (SKT &amp; SKM)
            </p>
            <p className="text-[11px] text-slate-500 font-mono">
              Dasar Hukum: Ketetapan Perusahaan No: 01 / AS / DRK / BKR / VII / 2024
            </p>
            <div className="inline-block mt-2 bg-amber-100 text-amber-900 font-bold px-3 py-1 rounded text-xs">
              STANDAR OPERASIONAL &amp; METRIKS KPI TERUKUR TAHUN 2026/2027
            </div>
          </div>

          {/* Executive Summary Narrative */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-2">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              I. Latar Belakang &amp; Prinsip Penilaian Objektif
            </h4>
            <p className="text-slate-600">
              Divisi Produksi I (Pengolahan) mengemban amanah strategis menghasilkan tembakau blended berkualitas tinggi, efisiensi bahan optimal, dan susut terkendali. Untuk menghindari subjektivitas penilaian kinerja, disusun matriks penilaian berbasis 5 pilar utama:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 pt-1 font-semibold text-slate-800 text-[11px]">
              <div className="p-2 bg-white rounded border border-slate-200">1. Kualitas (Homogenitas, Kadar Air, Kerataan Saos)</div>
              <div className="p-2 bg-white rounded border border-slate-200">2. Produktivitas (Kapasitas Molen &amp; Throughput)</div>
              <div className="p-2 bg-white rounded border border-slate-200">3. Efisiensi (Pengendalian Kesusutan Bahan Riil)</div>
              <div className="p-2 bg-white rounded border border-slate-200">4. Administrasi (BOS &amp; Deadline 09:00 WIB)</div>
              <div className="p-2 bg-white rounded border border-slate-200">5. Kepatuhan (Bea Cukai CK-5 &amp; Disiplin K3)</div>
              <div className="p-2 bg-amber-50 text-amber-950 rounded border border-amber-200">6. Dual Accountability (Tanggung Jawab 1 &amp; 2)</div>
            </div>
          </div>

          {/* Full Metrics Table Per Position */}
          <div className="space-y-6">
            <h4 className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              II. Rincian Metrik Kinerja Terukur per Posisi Jabatan
            </h4>

            {POSITIONS_DATA.map((pos) => {
              const roleMetrics = KPI_METRICS_DATA.filter(m => m.roleId === pos.id);

              return (
                <div key={pos.id} className="border border-slate-200 rounded-xl overflow-hidden">
                  <div className="bg-slate-100 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-200">
                    <div>
                      <span className="font-bold text-slate-900 text-sm">
                        {pos.title}
                      </span>
                      {pos.incumbentName && (
                        <span className="text-slate-600 font-medium ml-2">
                          ({pos.incumbentName})
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-slate-500">
                      Atasan: <strong>{pos.directSupervisor}</strong> | Departemen: {pos.department}
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50/50 border-b border-slate-100 text-[11px] text-slate-700">
                    <strong>Tanggung Jawab Utama:</strong> {pos.dualAccountability.primaryResponsibility}<br />
                    <strong className="text-slate-600">Tanggung Jawab Kedua:</strong> {pos.dualAccountability.secondaryResponsibility}
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                        <tr>
                          <th className="py-2 px-3">Kode &amp; Indikator</th>
                          <th className="py-2 px-3">Formula Perhitungan</th>
                          <th className="py-2 px-3">Target</th>
                          <th className="py-2 px-3 text-center">Bobot</th>
                          <th className="py-2 px-3">Frekuensi</th>
                          <th className="py-2 px-3">Sumber Data</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {roleMetrics.map(m => (
                          <tr key={m.id} className="hover:bg-slate-50">
                            <td className="py-2.5 px-3">
                              <span className="font-mono font-bold text-slate-900">{m.code}</span>
                              <div className="text-slate-700 font-medium">{m.name}</div>
                            </td>
                            <td className="py-2.5 px-3 font-mono text-blue-900">{m.formula}</td>
                            <td className="py-2.5 px-3 font-bold text-emerald-800">{m.target}</td>
                            <td className="py-2.5 px-3 text-center font-bold font-mono">{m.weight}%</td>
                            <td className="py-2.5 px-3 text-slate-600">{m.frequency}</td>
                            <td className="py-2.5 px-3 text-slate-600">{m.dataSource}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Legal Sign-Off Block */}
          <div className="pt-8 border-t-2 border-slate-300 mt-8">
            <div className="text-center mb-6">
              <p className="text-xs text-slate-600">
                Malang, {formatWibDate(new Date())}<br />
                <strong>MANAJEMEN OPERASIONAL PT. BATU KARANG</strong>
              </p>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-12">
                <p className="text-slate-500 font-medium">Disusun &amp; Diajukan Oleh:</p>
                <div>
                  <p className="font-bold text-slate-950 underline">LALU MAHENDRA</p>
                  <p className="text-[11px] text-slate-600">Manager Operasional Divisi 1</p>
                </div>
              </div>

              <div className="space-y-12">
                <p className="text-slate-500 font-medium">Diketahui &amp; Dikoordinasikan:</p>
                <div>
                  <p className="font-bold text-slate-950 underline">ANDI ADRA A.</p>
                  <p className="text-[11px] text-slate-600">Manager Akuntansi &amp; Perpajakan 1</p>
                </div>
              </div>

              <div className="space-y-12 col-span-2 sm:col-span-1">
                <p className="text-slate-500 font-medium">Disetujui Oleh:</p>
                <div>
                  <p className="font-bold text-slate-950 underline">DIREKTUR PERUSAHAAN</p>
                  <p className="text-[11px] text-slate-600">PT. Batu Karang (153)</p>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-4 border-t border-slate-200 flex items-center justify-between shrink-0 text-xs">
          <span className="text-slate-500">
            Dokumen resmi terenkripsi sistem AI Studio &bull; Siap dicetak untuk arsip ISO/Audit
          </span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all"
          >
            Tutup
          </button>
        </div>

      </div>
    </div>
  );
};
