import React from 'react';
import { 
  X, 
  BookOpen, 
  Layers, 
  CheckCircle2, 
  AlertTriangle, 
  Award, 
  Users, 
  FileText, 
  Sparkles, 
  Calculator, 
  Clock, 
  ArrowRight,
  ShieldCheck,
  Check
} from 'lucide-react';

interface KpiGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const KpiGuideModal: React.FC<KpiGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn">
      <div 
        className="relative w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col overflow-hidden animate-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 text-white flex items-center justify-between border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-400/30 flex items-center justify-center text-amber-400 shadow-inner">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30 uppercase tracking-wider">
                  Panduan Resmi • PT Batu Karang
                </span>
                <span className="text-xs text-slate-300">Divisi Produksi I</span>
              </div>
              <h3 className="text-base sm:text-lg font-black tracking-tight text-white mt-0.5">
                Cara Kerja &amp; Alur Sistem Evaluasi Kinerja (KPI 360°)
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-slate-700 dark:text-slate-300 text-xs leading-relaxed">
          
          {/* Executive Philosophy Banner */}
          <div className="p-4 rounded-2xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/60 space-y-1.5">
            <div className="flex items-center gap-2 text-amber-900 dark:text-amber-200 font-bold text-sm">
              <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              <span>Mengapa Menggunakan Metode Hybrid 360°?</span>
            </div>
            <p className="text-slate-700 dark:text-slate-300 text-xs">
              Sistem ini memecahkan kelemahan penilaian konvensional di pabrik: 
              <strong> angka mentah (seperti 3.32 atau 3.58) sering kali membingungkan</strong> dan 
              <strong> penilaian sepihak rawan bias subjektif</strong>. Dengan menggabungkan 4 responden (Atasan + 3 Rekan Kerja), 
              data presensi riil, dan catatan insiden lapangan, sistem menghasilkan <strong>bukti dokumen yang adil, objektif, dan siap dipertanggungjawabkan ke HRD serta Direksi</strong>.
            </p>
          </div>

          {/* 4 Pillars of the Workflow */}
          <div className="space-y-3">
            <h4 className="font-black text-sm text-slate-900 dark:text-white flex items-center gap-2 uppercase tracking-wide">
              <Layers className="w-4 h-4 text-amber-500" />
              <span>4 Pilar Utama Alur Evaluasi Kinerja</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              
              {/* Pillar 1 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="w-6 h-6 rounded-lg bg-amber-500 text-slate-950 font-mono font-black flex items-center justify-center text-xs">
                    1
                  </span>
                  <span>Input 4 Responden (360° Lapangan)</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300">
                  Setiap staf dinilai oleh <strong>4 penilai</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pl-1">
                  <li><strong>1 Atasan Langsung:</strong> Memiliki otoritas tertinggi untuk parameter inti.</li>
                  <li><strong>3 Rekan Kerja (Peer Review):</strong> Mandor/admin/operator lain yang bersentuhan kerja sehari-hari.</li>
                  <li><strong>Data Presensi Riil:</strong> Tingkat kehadiran %, izin, alpa, dan catatan sanksi SP dari HRD.</li>
                </ul>
              </div>

              {/* Pillar 2 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="w-6 h-6 rounded-lg bg-blue-500 text-white font-mono font-black flex items-center justify-center text-xs">
                    2
                  </span>
                  <span>Lembar Formulir Resmi KPI (Template Pabrik)</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300">
                  Setiap parameter dinilai dalam skala <strong>1 – 5</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pl-1">
                  <li><strong>Total &amp; Rata-rata:</strong> Dijumlahkan dari 4 responden menghasilkan <em>Indeks Kinerja (1.00 – 5.00)</em>.</li>
                  <li><strong>Opsi C (20 Poin):</strong> Kombinasi Terpadu (Sinergis A &amp; B, saling melengkapi tanpa redundansi).</li>
                  <li><strong>Opsi B (16 Poin):</strong> Standar Manufaktur Lean (Bebas duplikasi, fokus K3, 5R &amp; Akurasi Timbangan).</li>
                  <li><strong>Opsi A (20 Poin):</strong> Template format warisan fisik klasik PT Batu Karang.</li>
                </ul>
              </div>

              {/* Pillar 3 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white font-mono font-black flex items-center justify-center text-xs">
                    3
                  </span>
                  <span>Penerjemah Narasi Kualitatif BARS</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300">
                  <em>Behaviorally Anchored Rating Scales (BARS)</em> menerjemahkan angka menjadi kata-kata:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pl-1">
                  <li><strong>Sintesis Persona:</strong> Menggambarkan karakter dan kebiasaan kerja di lantai pabrik.</li>
                  <li><strong>Deteksi Anomali:</strong> Menangkap jika rekan memberi nilai tinggi padahal ada sanksi teguran timbang.</li>
                  <li><strong>Action Plan:</strong> Rencana aksi pembinaan 30-60-90 hari bersama mentor.</li>
                </ul>
              </div>

              {/* Pillar 4 */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white">
                  <span className="w-6 h-6 rounded-lg bg-emerald-600 text-white font-mono font-black flex items-center justify-center text-xs">
                    4
                  </span>
                  <span>Simulasi Bobot Metrik Job Desk (SK Direksi)</span>
                </div>
                <p className="text-[11.5px] text-slate-600 dark:text-slate-300">
                  Sesuai <strong>SK Direksi No: 01/AS/DRK/BKR/VII/2024</strong>:
                </p>
                <ul className="list-disc list-inside space-y-1 text-[11px] text-slate-600 dark:text-slate-300 pl-1">
                  <li>Mengukur capaian target metrik spesifik per jabatan (misal: Kepala Gudang, Mandor, Mekanik).</li>
                  <li>Skor pencapaian dikalikan bobot % resmi menghasilkan <strong>Skor 0 – 100</strong>.</li>
                  <li>Menghasilkan Grade (A/B/C/D) untuk rekomendasi Promosi atau Sanksi SP.</li>
                </ul>
              </div>

            </div>
          </div>

          {/* Criteria & Grading Table */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-3">
            <h4 className="font-bold text-xs text-slate-900 dark:text-white uppercase tracking-wider flex items-center justify-between">
              <span>Tabel Skala Indeks Kinerja &amp; Rekomendasi HRD</span>
              <Award className="w-4 h-4 text-amber-500" />
            </h4>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-[11px]">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300 font-bold border-b border-slate-200 dark:border-slate-700">
                    <th className="p-2">Rentang Skor</th>
                    <th className="p-2">Kriteria</th>
                    <th className="p-2">Deskripsi Perilaku Pabrik</th>
                    <th className="p-2">Rekomendasi Tindak Lanjut</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="p-2 font-mono font-bold text-emerald-600 dark:text-emerald-400">4.10 – 5.00</td>
                    <td className="p-2 font-bold text-emerald-700 dark:text-emerald-300">SANGAT BAIK (A)</td>
                    <td className="p-2">Zero error, kedisiplinan prima, kepemimpinan aktif, inisiatif K3 tinggi.</td>
                    <td className="p-2 font-semibold">Layak Promosi / Diangkat Karyawan Tetap</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="p-2 font-mono font-bold text-indigo-600 dark:text-indigo-400">3.10 – 4.09</td>
                    <td className="p-2 font-bold text-indigo-700 dark:text-indigo-300">BAIK (B)</td>
                    <td className="p-2">Memenuhi seluruh target harian SOP pabrik, taat aturan, kerja sama solid.</td>
                    <td className="p-2 font-semibold">Perpanjangan Kontrak PKWT Lanjutan</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="p-2 font-mono font-bold text-amber-600 dark:text-amber-400">2.10 – 3.09</td>
                    <td className="p-2 font-bold text-amber-700 dark:text-amber-300">CUKUP (C)</td>
                    <td className="p-2">Ada selisih atau kelalaian kecil, butuh pengawasan berkala dari mandor.</td>
                    <td className="p-2 font-semibold">Pembinaan Khusus 60 Hari / Rolling Tugas</td>
                  </tr>
                  <tr className="hover:bg-slate-50 dark:hover:bg-slate-750">
                    <td className="p-2 font-mono font-bold text-red-600 dark:text-red-400">0.00 – 2.09</td>
                    <td className="p-2 font-bold text-red-700 dark:text-red-300">KURANG (D)</td>
                    <td className="p-2">Pelanggaran SOP berat, selisih timbangan berulang, absensi bermasalah.</td>
                    <td className="p-2 font-semibold">Surat Peringatan (SP) / Kontrak Berakhir</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* PKWT Contract Expiration Strategy */}
          <div className="p-4 rounded-2xl bg-gradient-to-r from-slate-900 to-indigo-950 text-white space-y-2.5">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-400" />
              <h4 className="font-bold text-xs uppercase tracking-wider text-amber-300">
                Hubungan Evaluasi dengan Karyawan Kontrak (PKWT)
              </h4>
            </div>
            <p className="text-[11.5px] text-slate-200 leading-relaxed">
              Bagi karyawan PKWT yang akan berakhir masa kontraknya (misal dalam 30–60 hari ke depan), sistem ini memberikan kepastian keputusan:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 text-[11px]">
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="font-bold text-amber-300 block mb-1">1. H-30 Sebelum Kontrak:</span>
                Antrean evaluasi otomatis memberi tanda mendesak kepada Manajer Operasional untuk memicu penilaian 360°.
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="font-bold text-amber-300 block mb-1">2. H-14 Pengambilan Keputusan:</span>
                Dokumen hasil evaluasi dicetak dan diserahkan ke HRD Korporat untuk penyusunan SK Perpanjangan atau Pengangkatan.
              </div>
              <div className="p-2.5 rounded-xl bg-white/10 border border-white/15">
                <span className="font-bold text-amber-300 block mb-1">3. Transparansi Karyawan:</span>
                Karyawan memahami kekuatan dan kelemahannya melalui lembar BARS yang diberikan saat sesi coaching.
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between shrink-0">
          <span className="text-[11px] text-slate-500">
            Panduan Operasional • Sistem Evaluasi Kinerja Divisi Produksi I
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 dark:bg-slate-700 dark:hover:bg-slate-600 text-white font-bold text-xs transition-all shadow-sm"
          >
            Mengerti &amp; Tutup Panduan
          </button>
        </div>

      </div>
    </div>
  );
};
