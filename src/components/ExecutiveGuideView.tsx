import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  Scale, 
  FileText, 
  Users, 
  Workflow, 
  Layers, 
  CheckCircle,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface ExecutiveGuideViewProps {
  onGoToKpi: () => void;
  onGoToMonitoring: () => void;
}

export const ExecutiveGuideView: React.FC<ExecutiveGuideViewProps> = ({ onGoToKpi, onGoToMonitoring }) => {
  return (
    <div className="space-y-6">
      {/* Hero Banner */}
      <div className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-4xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
              Panduan Eksekutif Manager Operasional
            </span>
            <span className="text-xs text-slate-400">Divisi Produksi I (Pengolahan) - PT. Batu Karang</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Pilar Pengendalian Operasional & Prinsip Penilaian KPI Objektif
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Sebagai Manajer Operasional, tanggung jawab utama Anda adalah memastikan pengolahan tembakau blended berjalan dengan efisiensi tinggi, susut terkendali secara riil, standar mutu rasa rokok 153 terjaga, administrasi akuntansi tepat waktu sebelum jam 09.00 WIB, dan penegakan tata tertib SDM yang tegas dan berkeadilan.
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={onGoToKpi}
              className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold rounded-xl transition-all shadow"
            >
              <span>Buka Matriks KPI Lengkap</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={onGoToMonitoring}
              className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-xl border border-slate-700 transition-all"
            >
              <span>Buka Monitoring Harian Real-Time</span>
            </button>
          </div>
        </div>
      </div>

      {/* 5 Core Pillars Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        {/* Pillar 1: Golden Rule Susut Molen */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-rose-700">
              <Scale className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Klausul Kritis Hal 46/67</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Integritas Data Kesusutan Molen (Anti-Susut Seragam)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Dokumen resmi perusahaan melarang keras: <em>&ldquo;Tidak dibenarkan faktor kesusutan hasil proses blend antara molen yang satu dibuat sama kesusutannya dengan molen yang lain.&rdquo;</em>
            </p>
            <div className="mt-3 bg-rose-50 p-3 rounded-xl border border-rose-200 text-xs text-rose-900">
              <strong>Tindakan Pengawasan:</strong> Jika ditemukan data susut molen persis seragam (misal semua 1.20%), lakukan penimbangan ulang mendadak dan audit lembar kerja timbang Mandor &amp; Admin Proses.
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100">
            Penanggung Jawab: Ka Proses, Mandor Proses, &amp; Ka Admin 2
          </div>
        </div>

        {/* Pillar 2: Deadline Laporan 09:00 WIB */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-blue-700">
              <Clock className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Disiplin Waktu Hal 6</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Batas Waktu Laporan Akuntansi (Maks. 09.00 WIB)
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Seluruh laporan administrasi mutasi bahan, pemakaian karung, hasil blend, dan stok gudang wajib tervalidasi dan diserahkan ke Divisi Akuntansi selambat-lambatnya keesokan hari maksimal pukul <strong>09.00 WIB</strong>.
            </p>
            <div className="mt-3 bg-blue-50 p-3 rounded-xl border border-blue-200 text-xs text-blue-900">
              <strong>Tindakan Pengawasan:</strong> Gunakan buku ekspedisi tanda terima berstempel waktu. Keterlambatan tanpa alasan kahar langsung mempengaruhi nilai KPI Kepala Administrasi 2.
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100">
            Penanggung Jawab: Kepala Administrasi 2 &amp; Staf Admin
          </div>
        </div>

        {/* Pillar 3: Sinkronisasi 3 Titik */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-amber-700">
              <Workflow className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Validasi Fisik vs Sistem</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Sinkronisasi 3 Titik: Timbangan &ndash; Surat Jalan &ndash; BOS
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Setiap perpindahan bahan (Penerimaan luar &rarr; Gudang Kecil &rarr; Lini Proses &rarr; Gudang &rarr; Produksi II) wajib diverifikasi melalui timbangan fisik ganda dan kartu mutasi Program BOS.
            </p>
            <div className="mt-3 bg-amber-50 p-3 rounded-xl border border-amber-200 text-xs text-amber-900">
              <strong>Tindakan Pengawasan:</strong> Toleransi selisih penimbangan masuk/keluar maksimal &le; 0.05%. Selisih lebih dari itu wajib dihentikan untuk kroscek bersama Mandor Gudang &amp; QC.
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100">
            Penanggung Jawab: Ka Gudang, Mandor, &amp; Admin Gudang
          </div>
        </div>

        {/* Pillar 4: Mutu Organoleptik & Spuyer Molen */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-emerald-700">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Standar Mutu Rasa 153</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Kadar Air, Kerataan Saos, &amp; Nozzle Spuyer
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Kualitas rasa rokok sangat bergantung pada kepatuhan formula Pruf, waktu putar mesin molen, dan kebersihan nozzle spuyer saos (casing, top, larutan cengkeh).
            </p>
            <div className="mt-3 bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-xs text-emerald-900">
              <strong>Tindakan Pengawasan:</strong> Spuyer wajib dicek setiap pergantian shift agar tidak ada kerak. QC berwenang menghentikan sementara putaran molen jika semprotan saos tidak rata.
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100">
            Penanggung Jawab: Ka Proses, Ka QC, &amp; Mandor Proses
          </div>
        </div>

        {/* Pillar 5: Ketetapan SDM No: 01/AS/DRK/BKR/VII/2024 */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-purple-700">
              <Users className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Regulasi Ketenagakerjaan</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Skema Teguran, Rolling, &amp; Pelimpahan ke HRD II
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Sebagai Manager Operasional, Anda berwenang melakukan rotasi internal, teguran disiplin, dan persetujuan usulan rolling dari kepala sekup.
            </p>
            <div className="mt-3 bg-purple-50 p-3 rounded-xl border border-purple-200 text-xs text-purple-900">
              <strong>Klausul Khusus:</strong> Staf/karyawan yang terbukti tidak dapat dibina setelah 3 kali teguran, atau sakit berat berkepanjangan, dapat diajukan pelimpahan ke Divisi HRD II &amp; Umum II.
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100">
            Wewenang Penuh: Manager Operasional
          </div>
        </div>

        {/* Pillar 6: Kepatuhan Dokumen CK-5 Bea Cukai */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm space-y-3 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-800">
              <FileText className="w-5 h-5" />
              <span className="text-xs font-bold uppercase tracking-wider">Kepatuhan Hukum &amp; Cukai</span>
            </div>
            <h3 className="text-base font-bold text-slate-900 mt-1">
              Pengawasan Barang Kena Cukai &amp; Limbah
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed mt-2">
              Persediaan tembakau blended dan pengeluaran limbah pabrik berada di bawah pengawasan ketat Bea &amp; Cukai. Dokumen CK-5 harus bebas dari koreksi atau selisih fisik.
            </p>
            <div className="mt-3 bg-slate-100 p-3 rounded-xl border border-slate-200 text-xs text-slate-800">
              <strong>Tindakan Pengawasan:</strong> Pastikan seluruh armada pengiriman dari Gudang Blend ke Produksi II memiliki dokumen CK-5 yang sudah ditandatangani dan diverifikasi.
            </div>
          </div>
          <div className="pt-2 text-[11px] text-slate-500 font-medium border-t border-slate-100">
            Penanggung Jawab: Ka Gudang &amp; Ka Admin 2
          </div>
        </div>

      </div>

      {/* Strategic Implementation Timeline */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
        <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          Rekomendasi Langkah Penerapan KPI Bertahap (Roadmap Implementasi)
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950">
              Tahap 1: Sosialisasi & Validasi (Minggu I)
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Penyelarasan Target & Jobdesc</h4>
            <p className="text-slate-600 leading-relaxed">
              Sosialisasikan matriks KPI ini kepada Kepala Proses, Kepala QC, Kepala Gudang, dan Kepala Administrasi 2. Pastikan setiap PIC memahami formula perhitungan dan sumber data verifikasi mereka.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-blue-600 text-white">
              Tahap 2: Uji Coba Monitoring (Minggu II-III)
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Pencatatan Harian Real-Time</h4>
            <p className="text-slate-600 leading-relaxed">
              Mulai penginputan data harian molen, susut per mesin, dan kepatuhan jam 09.00 WIB. Lakukan review harian untuk mendeteksi potensi selisih atau bottleneck sebelum evaluasi resmi.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-600 text-white">
              Tahap 3: Evaluasi & Insentif (Bulan I dan Seterusnya)
            </span>
            <h4 className="font-bold text-slate-900 text-sm">Penilaian Bulanan & Rekomendasi</h4>
            <p className="text-slate-600 leading-relaxed">
              Gunakan kalkulator skor KPI terintegrasi untuk menetapkan Grade (A/B/C/D). Berikan reward prestasi, coaching bagi grade C, dan tindak lanjut mutasi/pembinaan sesuai SK Direktur 2024.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
