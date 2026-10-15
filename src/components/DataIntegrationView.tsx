import React, { useState } from 'react';
import { INTEGRATION_SOURCES_DATA, MOCK_TELEMETRY_EVENTS } from '../data/integrationSourcesData';
import { VERIFIED_LIVE_APPS, VerifiedLiveApp } from '../data/liveWebAppsData';
import { DataIntegrationSource, TelemetryStreamEvent, MolenBatchLog } from '../types';
import { formatWibTime } from '../utils/indonesiaDateUtils';
import { 
  Network, 
  Cpu, 
  Database, 
  Scale, 
  Radio, 
  Barcode, 
  Users, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Terminal, 
  Zap, 
  Copy, 
  Check, 
  RefreshCw, 
  FileCode2,
  Workflow,
  Globe,
  Upload,
  Layers,
  Sparkles,
  ExternalLink,
  Flame,
  FileCheck
} from 'lucide-react';

interface DataIntegrationViewProps {
  onBatchImported?: (newBatch: MolenBatchLog) => void;
}

export const DataIntegrationView: React.FC<DataIntegrationViewProps> = ({ onBatchImported }) => {
  const [activeSubTab, setActiveSubTab] = useState<'existing_apps' | 'iot_catalog'>('existing_apps');
  const [selectedSource, setSelectedSource] = useState<DataIntegrationSource>(INTEGRATION_SOURCES_DATA[0]);
  const [telemetryEvents, setTelemetryEvents] = useState<TelemetryStreamEvent[]>(MOCK_TELEMETRY_EVENTS);
  const [copiedCode, setCopiedCode] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);

  // States for Existing App Sync Simulator
  const [syncStatusMessage, setSyncStatusMessage] = useState<string | null>(null);
  const [importedBatchesCount, setImportedBatchesCount] = useState<number>(0);
  const [sampleDataPreset, setSampleDataPreset] = useState<'batch_molen' | 'batch_timbang' | 'custom_json'>('batch_molen');
  const [jsonInput, setJsonInput] = useState<string>(`[
  {
    "batch_no": "BT-WEBAPP-20261007-08",
    "nama_mesin": "Molen #1",
    "jenis_tembakau": "153 - BK",
    "berat_masuk_kg": 525.0,
    "berat_keluar_kg": 518.2,
    "waktu_putar_menit": 18,
    "target_putar_menit": 18,
    "kadar_air_persen": 13.7,
    "spuyer_kondisi": "Lancar",
    "kerataan_saos": "Sangat Rata",
    "operator": "Slamet",
    "mandor": "Lendra"
  },
  {
    "batch_no": "BT-WEBAPP-20261007-09",
    "nama_mesin": "Molen #2",
    "jenis_tembakau": "SP 153 - BK",
    "berat_masuk_kg": 510.0,
    "berat_keluar_kg": 503.1,
    "waktu_putar_menit": 20,
    "target_putar_menit": 20,
    "kadar_air_persen": 14.0,
    "spuyer_kondisi": "Lancar",
    "kerataan_saos": "Sangat Rata",
    "operator": "Budi",
    "mandor": "Lendra"
  }
]`);

  // Generate JSON payload preview for IoT Catalog
  const payloadJson = React.useMemo(() => {
    const obj: Record<string, any> = {};
    selectedSource.dataPayloadFields.forEach(f => {
      if (f.type === 'float') obj[f.field] = parseFloat(f.example);
      else if (f.type === 'int') obj[f.field] = parseInt(f.example, 10);
      else if (f.type === 'boolean') obj[f.field] = f.example === 'true';
      else obj[f.field] = f.example;
    });
    return JSON.stringify(obj, null, 2);
  }, [selectedSource]);

  const handleCopyJson = () => {
    navigator.clipboard.writeText(payloadJson);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  const handleTriggerSimulatedEvent = () => {
    setIsSimulating(true);
    setTimeout(() => {
      const now = new Date();
      const timeStr = formatWibTime(now, true);
      
      const newEvent: TelemetryStreamEvent = {
        id: `stream-${Date.now()}`,
        timestamp: timeStr,
        sourceCategory: selectedSource.category,
        deviceName: selectedSource.deviceOrApp.split('(')[0],
        eventDescription: `Paket data telemetri otomatis terkirim dari ${selectedSource.sourceName}.`,
        kpiCodeAffected: selectedSource.automatedKpis[0]?.kpiCode || 'AUTO-KPI',
        payloadSummary: `Sinkronisasi sukses: ${selectedSource.dataPayloadFields[0]?.field} tervalidasi real-time.`,
        integrityCheck: 'Valid & Lolos'
      };

      setTelemetryEvents([newEvent, ...telemetryEvents]);
      setIsSimulating(false);
    }, 600);
  };

  // Process data sync from user's existing web apps
  const handleExecuteExistingAppSync = () => {
    try {
      const parsed = JSON.parse(jsonInput);
      if (!Array.isArray(parsed)) {
        alert("Format data harus berupa Array JSON [{...}, {...}]");
        return;
      }

      setIsSimulating(true);
      setTimeout(() => {
        setIsSimulating(false);
        setImportedBatchesCount(prev => prev + parsed.length);
        setSyncStatusMessage(`Berhasil menyinkronkan ${parsed.length} batch dari Web Apps Proses! Skor KPI Kepala Proses, Mandor, dan QC telah diperbarui otomatis.`);

        // Add to telemetry log
        const now = new Date();
        const timeStr = formatWibTime(now, true);
        
        parsed.forEach((item: any, idx: number) => {
          const raw = Number(item.berat_masuk_kg || 500);
          const out = Number(item.berat_keluar_kg || 493);
          const susutKg = Number((raw - out).toFixed(1));
          const susutPct = Number(((susutKg / raw) * 100).toFixed(2));

          const streamLog: TelemetryStreamEvent = {
            id: `stream-app-${Date.now()}-${idx}`,
            timestamp: timeStr,
            sourceCategory: 'Web Apps Proses (Internal)',
            deviceName: `${item.nama_mesin || 'Molen'} - ${item.jenis_tembakau || '153'}`,
            eventDescription: `Sinkronisasi data proses dari Web Apps: Batch ${item.batch_no || 'BT-00'}`,
            kpiCodeAffected: 'KP-BLD-01, KP-BLD-02, QC-INS-02',
            payloadSummary: `Masuk: ${raw} Kg | Hasil: ${out} Kg | Susut: ${susutKg} Kg (${susutPct}%) | Kadar Air: ${item.kadar_air_persen || 13.8}%`,
            integrityCheck: 'Valid & Lolos'
          };
          setTelemetryEvents(prev => [streamLog, ...prev]);
        });
      }, 700);

    } catch (err: any) {
      alert("JSON tidak valid: " + err.message);
    }
  };

  const getSourceIcon = (category: string) => {
    switch (category) {
      case 'Timbangan Digital': return <Scale className="w-4 h-4 text-amber-500" />;
      case 'Sistem ERP (BOS)': return <Database className="w-4 h-4 text-blue-500" />;
      case 'IoT Mesin Molen': return <Cpu className="w-4 h-4 text-emerald-500" />;
      case 'Instrumen Lab QC': return <Radio className="w-4 h-4 text-purple-500" />;
      case 'Scanner Barcode': return <Barcode className="w-4 h-4 text-rose-500" />;
      case 'Presensi HRIS': return <Users className="w-4 h-4 text-teal-500" />;
      case 'Bea Cukai': return <ShieldCheck className="w-4 h-4 text-indigo-500" />;
      default: return <Network className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 sm:p-7 rounded-2xl border border-slate-700/80 shadow-lg text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Integrasi Sumber Data
              </span>
              <span className="text-xs text-amber-200/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                Pemanfaatan Data Web Apps Proses yang Ada
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Menghubungkan Data Web Apps Proses ke Sistem KPI Otomatis
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              <strong>Kabar baik:</strong> Web apps proses yang sudah Anda miliki saat ini adalah <strong>sumber data paling ideal dan tercepat</strong>. Anda tidak perlu memasang sensor dari nol; cukup hubungkan data proses tersebut (via API/Webhook atau ekspor data) agar KPI terhitung otomatis.
            </p>
          </div>

          <div className="bg-slate-800/90 p-3.5 rounded-xl border border-amber-500/30 text-xs flex flex-col justify-center min-w-[260px]">
            <div className="text-slate-400 font-medium">Kesiapan Sumber Data Anda:</div>
            <div className="text-emerald-400 font-bold flex items-center gap-1.5 mt-0.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>SANGAT BISA LANGSUNG DIGUNAKAN</span>
            </div>
            <div className="text-[11px] text-slate-400 mt-1">
              Data digital proses &rarr; Otomatisasi Skor KPI 100%
            </div>
          </div>
        </div>

        {/* Sub Navigation: Existing Apps vs Future IoT Roadmap */}
        <div className="flex items-center gap-2 mt-5 pt-3 border-t border-slate-700/80">
          <button
            onClick={() => setActiveSubTab('existing_apps')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'existing_apps'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Globe className="w-4 h-4" />
            <span>Konektor Web Apps Proses Anda (Langkah Tercepat)</span>
          </button>

          <button
            onClick={() => setActiveSubTab('iot_catalog')}
            className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all ${
              activeSubTab === 'iot_catalog'
                ? 'bg-amber-500 text-slate-950 shadow'
                : 'text-slate-300 hover:text-white hover:bg-slate-800'
            }`}
          >
            <Cpu className="w-4 h-4" />
            <span>Katalog 7 Sumber Data Fisik &amp; IoT (Roadmap)</span>
          </button>
        </div>
      </div>

      {/* ================= VIEW 1: EXISTING WEB APPS CONNECTOR ================= */}
      {activeSubTab === 'existing_apps' && (
        <div className="space-y-6">
          
          {/* Verified Live Apps Grid */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase font-mono">
                    Status: 4 Web Apps Terverifikasi Aktif
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Divisi Produksi I PT Batu Karang</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1 flex items-center gap-2">
                  <Globe className="w-5 h-5 text-blue-600" />
                  Ekosistem 4 Web Apps Proses Anda yang Sudah Siap Terhubung
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Arsitektur: <strong>Headless React + Google Apps Script API</strong>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {VERIFIED_LIVE_APPS.map((app) => (
                <div 
                  key={app.id}
                  className="p-4 rounded-xl border border-slate-200 bg-slate-50/60 hover:bg-white hover:border-blue-300 transition-all flex flex-col justify-between space-y-3"
                >
                  <div className="space-y-2">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-blue-100 text-blue-800 font-mono">
                          {app.verificationStatus}
                        </span>
                        <h4 className="font-bold text-slate-900 text-sm mt-1">
                          {app.name}
                        </h4>
                      </div>
                      <a
                        href={app.url}
                        target="_blank"
                        rel="noreferrer"
                        className="p-1.5 rounded-lg bg-slate-100 hover:bg-blue-100 text-slate-600 hover:text-blue-700 transition-colors shrink-0"
                        title="Buka Web App Live"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>

                    <p className="text-xs text-slate-600 leading-relaxed">
                      {app.operationalScope}
                    </p>

                    <div className="space-y-1.5 text-[11px] pt-1">
                      <div className="text-slate-700">
                        <strong className="text-slate-900">Peran yang Diotomasi:</strong> {app.relevantPositions.join(', ')}
                      </div>
                      <div className="text-slate-700">
                        <strong className="text-slate-900">Data yang Dihasilkan:</strong> {app.providedData.join(' &bull; ')}
                      </div>
                      <div className="flex flex-wrap items-center gap-1 mt-1">
                        <strong className="text-slate-900 mr-1">KPI Terkait:</strong>
                        {app.automatedKpiCodes.map((code) => (
                          <span key={code} className="font-mono font-bold text-[10px] px-1.5 py-0.2 rounded bg-amber-100 text-amber-900 border border-amber-200">
                            {code}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200/80 space-y-1 text-[11px]">
                    <div className="text-blue-950 bg-blue-50/80 p-2 rounded border border-blue-100">
                      <strong>Hasil Analisa:</strong> {app.analysis}
                    </div>
                    <div className="text-emerald-950 bg-emerald-50/80 p-2 rounded border border-emerald-100">
                      <strong>Rekomendasi:</strong> {app.recommendation}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Why & How It Works Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-amber-700">
                <Zap className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Opsi 1: REST API / Webhook</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Sinkronisasi Real-Time Otomatis</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Setiap kali mandor/operator menekan tombol <em>"Simpan Batch"</em> di web apps proses Anda, sistem Anda langsung mengirim payload JSON ke endpoint web apps KPI ini.
              </p>
              <div className="text-[11px] font-mono text-blue-700 bg-blue-50 p-2 rounded">
                POST /api/v1/kpi/ingest-batch
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-blue-700">
                <Database className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Opsi 2: Shared Database / View</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Direct Query Database Proses</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jika web apps proses Anda menggunakan database (MySQL/PostgreSQL), web apps KPI ini cukup membaca tabel <code>t_batch_proses</code> dan <code>t_timbangan</code> secara berkala (Read-Only).
              </p>
              <div className="text-[11px] font-mono text-emerald-700 bg-emerald-50 p-2 rounded">
                SELECT * FROM v_daily_blend_kpi;
              </div>
            </div>

            <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm space-y-2">
              <div className="flex items-center gap-2 text-purple-700">
                <Upload className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">Opsi 3: Ekspor JSON / CSV Harian</span>
              </div>
              <h4 className="text-sm font-bold text-slate-900">Impor Sekali Klik per Shift</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Staf administrasi mengekspor file rekap harian dari web apps proses yang ada, lalu cukup drag-and-drop atau upload ke dalam aplikasi ini.
              </p>
              <div className="text-[11px] font-mono text-purple-700 bg-purple-50 p-2 rounded">
                File .JSON atau .CSV terformat
              </div>
            </div>
          </div>

          {/* Field Mapping Table: How existing data maps to KPIs */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Workflow className="w-4 h-4 text-amber-600" />
                  Matriks Pemetaan Kolom Data Web Apps Proses Anda &rarr; Rumus KPI
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Tabel ini menunjukkan bagaimana setiap data dari web apps proses Anda langsung diterjemahkan menjadi angka kinerja objektif.
                </p>
              </div>
              <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                100% Cocok Tanpa Ubah SOP
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="py-2.5 px-3">Kolom Data di Web Apps Anda</th>
                    <th className="py-2.5 px-3">Contoh Nilai</th>
                    <th className="py-2.5 px-3">Kode KPI yang Dihasilkan</th>
                    <th className="py-2.5 px-3">Jabatan Penanggung Jawab</th>
                    <th className="py-2.5 px-3">Logika Perhitungan Otomatis</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">berat_masuk_kg &amp; berat_keluar_kg</td>
                    <td className="py-2.5 px-3 font-mono">520.4 Kg &amp; 513.8 Kg</td>
                    <td className="py-2.5 px-3 font-bold font-mono text-amber-700">KP-BLD-02 &amp; MGR-OPS-02</td>
                    <td className="py-2.5 px-3 font-medium">Kepala Proses &amp; Manager Ops</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Otomatis hitung susut: ((520.4 - 513.8) / 520.4) * 100 = <strong>1.27%</strong>. Validasi bahwa tidak seragam dengan molen lain.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">waktu_putar_menit &amp; target_menit</td>
                    <td className="py-2.5 px-3 font-mono">18 Menit &amp; 18 Menit</td>
                    <td className="py-2.5 px-3 font-bold font-mono text-amber-700">KP-BLD-01 &amp; MND-PRC-01</td>
                    <td className="py-2.5 px-3 font-medium">Kepala Proses &amp; Mandor Proses</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Bandingkan waktu riil vs target putaran molen. Jika sama persis, skor otomatis <strong>100 Poin</strong>.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">kadar_air_persen</td>
                    <td className="py-2.5 px-3 font-mono">13.8%</td>
                    <td className="py-2.5 px-3 font-bold font-mono text-amber-700">QC-INS-02 &amp; KP-BLD-03</td>
                    <td className="py-2.5 px-3 font-medium">Kepala QC &amp; Kepala Proses</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Sistem cek rentang toleransi standar (13.0% - 14.5%). Nilai 13.8% otomatis berstatus <strong>Lolos Mutu</strong>.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">spuyer_kondisi &amp; kerataan_saos</td>
                    <td className="py-2.5 px-3 font-mono">&quot;Lancar&quot;, &quot;Sangat Rata&quot;</td>
                    <td className="py-2.5 px-3 font-bold font-mono text-amber-700">KP-BLD-05 &amp; MND-PRC-02</td>
                    <td className="py-2.5 px-3 font-medium">Mandor Proses Blend</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Memastikan nozzle semprot saos tidak tersumbat. Status &quot;Lancar&quot; = 100% pemenuhan checklist harian.
                    </td>
                  </tr>
                  <tr className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-blue-900">batch_no &amp; jenis_tembakau</td>
                    <td className="py-2.5 px-3 font-mono">BT-01, &quot;153 - BK&quot;</td>
                    <td className="py-2.5 px-3 font-bold font-mono text-amber-700">MGR-OPS-01 &amp; KP-BLD-01</td>
                    <td className="py-2.5 px-3 font-medium">Manajer Ops &amp; Ka Pengolahan 2</td>
                    <td className="py-2.5 px-3 text-slate-600">
                      Akumulasi total tonase output harian untuk mengukur persentase pemenuhan rencana produksi divisi.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Interactive Sync Simulator: Try importing existing web app batch data */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-600" />
                  Simulator Sinkronisasi Data Web Apps Proses Anda
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Uji coba menarik atau memasukkan contoh data dari web apps proses Anda sekarang untuk melihat kalkulasi KPI langsung bekerja.
                </p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={handleExecuteExistingAppSync}
                  disabled={isSimulating}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-500 text-white transition-all shadow-md active:scale-95 disabled:opacity-50"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                  <span>{isSimulating ? 'Memproses Sinkronisasi...' : 'Tarik Data & Hitung KPI'}</span>
                </button>
              </div>
            </div>

            {/* Notification Alert if synced */}
            {syncStatusMessage && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs text-emerald-950 flex items-center justify-between gap-3 animate-fade-in">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{syncStatusMessage}</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded font-mono">
                  +{importedBatchesCount} Batch Terinput
                </span>
              </div>
            )}

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold text-slate-700">
                  Data JSON Ekspor dari Web Apps Proses Anda:
                </label>
                <span className="text-[11px] text-slate-500">
                  Dapat diedit langsung atau disesuaikan dengan format web app Anda
                </span>
              </div>
              <textarea
                value={jsonInput}
                onChange={(e) => setJsonInput(e.target.value)}
                rows={11}
                className="w-full p-3 font-mono text-xs rounded-xl border border-slate-300 bg-slate-900 text-amber-300 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div className="text-[11px] text-slate-500 bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-start gap-2">
              <FileCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <strong>Langkah Teknis Selanjutnya:</strong> Berikan struktur data ini kepada tim pengembang web apps proses Anda. Mereka cukup menambahkan 1 baris HTTP call (Webhook) di aplikasi lama untuk mengirimkan data ini ke URL web apps KPI Anda setiap kali proses molen selesai.
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ================= VIEW 2: 7 DATA SOURCES IOT & HARDWARE CATALOG ================= */}
      {activeSubTab === 'iot_catalog' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column: 7 Sources Navigation (5 cols) */}
            <div className="lg:col-span-5 space-y-2.5">
              <div className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1 px-1">
                Katalog 7 Sumber Data Fisik &amp; Telemetri (Klik untuk Detail)
              </div>

              {INTEGRATION_SOURCES_DATA.map((source) => (
                <button
                  key={source.id}
                  onClick={() => setSelectedSource(source)}
                  className={`w-full p-4 rounded-xl border text-left transition-all flex items-start gap-3 ${
                    selectedSource.id === source.id
                      ? 'border-amber-500 bg-amber-50/90 ring-2 ring-amber-500/20 shadow-sm'
                      : 'border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="p-2 rounded-lg bg-slate-100 mt-0.5 shrink-0">
                    {getSourceIcon(source.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-slate-100 text-slate-700">
                        {source.category}
                      </span>
                      <span className="text-[10px] font-medium text-emerald-700 bg-emerald-50 px-1.5 py-0.2 rounded">
                        {source.protocol}
                      </span>
                    </div>
                    <div className="font-bold text-slate-900 text-xs sm:text-sm mt-1 truncate">
                      {source.sourceName}
                    </div>
                    <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                      {source.deviceOrApp}
                    </p>
                    <div className="flex items-center gap-1.5 mt-2 text-[10px] text-slate-600">
                      <span className="font-semibold text-amber-800">
                        {source.automatedKpis.length} KPI Terhubung Otomatis
                      </span>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            {/* Right Column: Deep-dive Spec & Payload (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
                
                {/* Header Selected Source */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="p-1.5 rounded-lg bg-amber-100 text-amber-900">
                        {getSourceIcon(selectedSource.category)}
                      </span>
                      <span className="text-xs font-mono font-bold text-slate-500 uppercase">
                        {selectedSource.category} &bull; {selectedSource.protocol}
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
                      {selectedSource.sourceName}
                    </h3>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Perangkat: {selectedSource.deviceOrApp}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <button
                      onClick={handleTriggerSimulatedEvent}
                      disabled={isSimulating}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-sm active:scale-95 disabled:opacity-50"
                    >
                      <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin' : ''}`} />
                      <span>Uji Kirim Data</span>
                    </button>
                  </div>
                </div>

                {/* Impact & KPI Automation Details */}
                <div className="space-y-3">
                  <div className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                    KPI yang Dihitung Secara Otomatis:
                  </div>
                  <div className="grid grid-cols-1 gap-2.5">
                    {selectedSource.automatedKpis.map((kpi, idx) => (
                      <div key={idx} className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold px-1.5 py-0.2 rounded bg-slate-900 text-amber-300 text-[10px]">
                              {kpi.kpiCode}
                            </span>
                            <span className="font-bold text-slate-900">{kpi.kpiName}</span>
                          </div>
                          <span className="text-[10px] text-slate-500 bg-white px-2 py-0.5 rounded border border-slate-200">
                            {kpi.targetRole}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-600 mt-1 leading-relaxed">
                          <strong>Logika Otomasi:</strong> {kpi.automatedCalculation}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Business Impact Note */}
                <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-950 space-y-1">
                  <div className="font-bold flex items-center gap-1.5 text-blue-900">
                    <CheckCircle2 className="w-4 h-4 text-blue-600 shrink-0" />
                    <span>Dampak Operasional terhadap Manajemen:</span>
                  </div>
                  <p className="text-[11px] leading-relaxed text-blue-900/90">
                    {selectedSource.businessImpact}
                  </p>
                </div>

                {/* JSON Schema & Field Mapping */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                      <FileCode2 className="w-4 h-4 text-slate-500" />
                      Format Payload JSON Telemetri API:
                    </div>
                    <button
                      onClick={handleCopyJson}
                      className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800"
                    >
                      {copiedCode ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCode ? 'Disalin!' : 'Salin JSON'}</span>
                    </button>
                  </div>

                  <div className="bg-slate-900 rounded-xl p-3.5 text-amber-300 font-mono text-[11px] overflow-x-auto shadow-inner">
                    <pre>{payloadJson}</pre>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* Live Stream Telemetry Feed (Visible in both views) */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-emerald-600" />
              Log Stream Data Masuk Real-Time (Data Sinkronisasi &amp; Audit Trail)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap kali batch dari web apps proses atau timbangan masuk, sistem langsung mengkalkulasi skor KPI yang relevan.
            </p>
          </div>
          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
            {telemetryEvents.length} Event Terekam
          </span>
        </div>

        <div className="space-y-2.5">
          {telemetryEvents.map((evt) => (
            <div 
              key={evt.id} 
              className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs hover:bg-white transition-all"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-[10px] font-bold text-slate-400">
                    {evt.timestamp}
                  </span>
                  <span className="font-semibold text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200 text-[10px]">
                    {evt.deviceName}
                  </span>
                  <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.2 rounded">
                    {evt.kpiCodeAffected}
                  </span>
                </div>
                <div className="font-medium text-slate-900 text-xs">
                  {evt.eventDescription}
                </div>
                <div className="text-[11px] text-slate-500 font-mono" dangerouslySetInnerHTML={{ __html: evt.payloadSummary }} />
              </div>

              <div className="self-end sm:self-center shrink-0">
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  {evt.integrityCheck}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
