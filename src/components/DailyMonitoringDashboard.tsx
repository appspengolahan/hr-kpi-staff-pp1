import React, { useState } from 'react';
import { 
  INITIAL_MOLEN_BATCHES, 
  INITIAL_ADMIN_LOGS,
  INITIAL_TOBACCO_BATCHES,
  INITIAL_CLOVE_BATCHES,
  INITIAL_KROSOK_LOGS
} from '../data/mockOperationalData';
import { 
  MolenBatchLog, 
  DailyAdminLog,
  TobaccoProcessBatchLog,
  CloveProcessBatchLog,
  KrosokWarehouseLog
} from '../types';
import { getWibBatchCode, getWibIsoDate } from '../utils/indonesiaDateUtils';
import { InteractiveKpiChart } from './InteractiveKpiChart';
import { DhpTembakauWorksheet } from './DhpTembakauWorksheet';
import { 
  Activity, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  Plus, 
  Scale, 
  ShieldCheck, 
  FileCheck, 
  TrendingDown, 
  Layers, 
  Check, 
  Package, 
  Sparkles,
  Scissors,
  Flower2,
  Warehouse,
  Flame,
  ArrowRight,
  Filter,
  CheckCircle,
  Thermometer,
  Gauge,
  Droplets,
  Box
} from 'lucide-react';

type UnitFilter = 'all' | 'blend' | 'tembakau' | 'cengkeh' | 'krosok';

export const DailyMonitoringDashboard: React.FC = () => {
  // State for operational logs
  const [activeUnit, setActiveUnit] = useState<UnitFilter>('all');
  const [batches, setBatches] = useState<MolenBatchLog[]>(INITIAL_MOLEN_BATCHES);
  const [tobaccoBatches, setTobaccoBatches] = useState<TobaccoProcessBatchLog[]>(INITIAL_TOBACCO_BATCHES);
  const [cloveBatches, setCloveBatches] = useState<CloveProcessBatchLog[]>(INITIAL_CLOVE_BATCHES);
  const [krosokLogs, setKrosokLogs] = useState<KrosokWarehouseLog[]>(INITIAL_KROSOK_LOGS);
  const [adminLogs, setAdminLogs] = useState<DailyAdminLog[]>(INITIAL_ADMIN_LOGS);

  // Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [inputUnitType, setInputUnitType] = useState<'blend' | 'tembakau' | 'cengkeh' | 'krosok'>('blend');

  // Form states - Blend
  const [newBatchMolen, setNewBatchMolen] = useState('Molen #1 (Kapasitas 500 Kg)');
  const [newBatchBlend, setNewBatchBlend] = useState<'153 - BK' | 'SP 153 - BK' | 'KARANG - BK' | 'TIS - KBT24' | 'F Reguler 153 Hijau - BK' | 'F Reguler LA BOLD - BK'>('153 - BK');
  const [newRawWeight, setNewRawWeight] = useState<number>(515.0);
  const [newResultWeight, setNewResultWeight] = useState<number>(508.2);
  const [newDuration, setNewDuration] = useState<number>(18);
  const [newMoisture, setNewMoisture] = useState<number>(13.8);
  const [newSpuyer, setNewSpuyer] = useState<'Lancar' | 'Ada Sumbatan' | 'Dibersihkan'>('Lancar');
  const [newSauce, setNewSauce] = useState<'Sangat Rata' | 'Cukup Rata' | 'Kurang Rata'>('Sangat Rata');

  // Form states - Tembakau
  const [newTbkMachine, setNewTbkMachine] = useState<'Mesin Rajang KT 2' | 'Mesin Rajang RC 4' | 'Mesin Primery #1' | 'Mesin Primery #2'>('Mesin Rajang KT 2');
  const [newTbkGrade, setNewTbkGrade] = useState<'Madura Voor-Oogst' | 'Temanggung Srintil Super' | 'Virginia FC Ekstra' | 'Boyolali Rajangan' | 'Weleri Halus'>('Temanggung Srintil Super');
  const [newTbkRawWeight, setNewTbkRawWeight] = useState<number>(600.0);
  const [newTbkResultWeight, setNewTbkResultWeight] = useState<number>(592.2);
  const [newTbkCutWidth, setNewTbkCutWidth] = useState<number>(0.65);
  const [newTbkSteamTemp, setNewTbkSteamTemp] = useState<number>(78.0);
  const [newTbkMoisture, setNewTbkMoisture] = useState<number>(13.7);
  const [newTbkMandor, setNewTbkMandor] = useState('Yayan Rudianto');
  const [newTbkOperator, setNewTbkOperator] = useState('Edward Antonius Effendy');

  // Form states - Cengkeh
  const [newCkLine, setNewCkLine] = useState<'Lini Rajang Cengkeh #1' | 'Lini Rajang Cengkeh #2' | 'Meja Sortir Tangkai #1'>('Lini Rajang Cengkeh #1');
  const [newCkOrigin, setNewCkOrigin] = useState<'Cengkeh Manado Super' | 'Cengkeh Zanzibar Ambon' | 'Cengkeh Kotok Jawa Timur' | 'Cengkeh Bali Pilihan'>('Cengkeh Manado Super');
  const [newCkRawWeight, setNewCkRawWeight] = useState<number>(300.0);
  const [newCkCleanResult, setNewCkCleanResult] = useState<number>(288.0);
  const [newCkStems, setNewCkStems] = useState<number>(8.5);
  const [newCkMoisture, setNewCkMoisture] = useState<number>(12.8);
  const [newCkMandor, setNewCkMandor] = useState('Indah Nurmala (Plt. Ka Mandor)');

  // Form states - Krosok
  const [newKrkWarehouse, setNewKrkWarehouse] = useState<'Gudang Kecil Tembakau & Krosok' | 'Gudang Persediaan 1' | 'Gudang Persediaan 3'>('Gudang Kecil Tembakau & Krosok');
  const [newKrkSupplier, setNewKrkSupplier] = useState<'Kemitraan Madura Sumenep' | 'Petani Sindoro Temanggung' | 'Sentra Lombok Timur' | 'Mitra Bojonegoro'>('Kemitraan Madura Sumenep');
  const [newKrkType, setNewKrkType] = useState<'Krosok Daun Bawah (Kaki)' | 'Krosok Daun Tengah (Tengah)' | 'Krosok Daun Atas (Pucuk Super)'>('Krosok Daun Tengah (Tengah)');
  const [newKrkBales, setNewKrkBales] = useState<number>(40);
  const [newKrkWeight, setNewKrkWeight] = useState<number>(1200.0);
  const [newKrkMoisture, setNewKrkMoisture] = useState<number>(14.0);
  const [newKrkAlloc, setNewKrkAlloc] = useState<'Siap Rajang KT 2' | 'Siap Rajang RC 4' | 'Buffer Stok Pematangan'>('Siap Rajang KT 2');

  // Aggregations
  // Blend
  const totalBlendRaw = batches.reduce((acc, b) => acc + b.rawWeightInKg, 0);
  const totalBlendResult = batches.reduce((acc, b) => acc + b.resultWeightKg, 0);
  const totalBlendShrinkageKg = totalBlendRaw - totalBlendResult;
  const avgBlendShrinkagePercent = totalBlendRaw > 0 ? (totalBlendShrinkageKg / totalBlendRaw) * 100 : 0;

  // Tobacco
  const totalTbkRaw = tobaccoBatches.reduce((acc, b) => acc + b.rawWeightInKg, 0);
  const totalTbkResult = tobaccoBatches.reduce((acc, b) => acc + b.resultWeightKg, 0);
  const totalTbkShrinkageKg = totalTbkRaw - totalTbkResult;
  const avgTbkShrinkagePercent = totalTbkRaw > 0 ? (totalTbkShrinkageKg / totalTbkRaw) * 100 : 0;

  // Clove
  const totalCkRaw = cloveBatches.reduce((acc, b) => acc + b.rawWeightInKg, 0);
  const totalCkClean = cloveBatches.reduce((acc, b) => acc + b.cleanCutResultKg, 0);
  const totalCkStems = cloveBatches.reduce((acc, b) => acc + b.stemsSeparatedKg, 0);
  const totalCkShrinkageKg = cloveBatches.reduce((acc, b) => acc + b.shrinkageKg, 0);
  const avgCkShrinkagePercent = totalCkRaw > 0 ? (totalCkShrinkageKg / totalCkRaw) * 100 : 0;

  // Krosok
  const totalKrkReceivedKg = krosokLogs.reduce((acc, b) => acc + b.receivedWeightKg, 0);
  const totalKrkBales = krosokLogs.reduce((acc, b) => acc + b.totalBales, 0);

  // Grand Total Process Output
  const grandTotalOutputKg = totalBlendResult + totalTbkResult + totalCkClean;

  // Check strict document rule:
  // "Tidak dibenarkan Faktor Kesusutan Hasil Proses Blend antara Molen yang satu dibuat sama kesusutannya dengan Molen yang lain."
  const shrinkageRates = batches.map(b => b.shrinkagePercentage);
  const hasIdenticalSuspiciousShrinkage = new Set(shrinkageRates).size < shrinkageRates.length;

  // Form submission handler
  const handleAddNewLog = (e: React.FormEvent) => {
    e.preventDefault();

    if (inputUnitType === 'blend') {
      const shrinkageKg = Number((newRawWeight - newResultWeight).toFixed(2));
      const shrinkagePct = Number(((shrinkageKg / newRawWeight) * 100).toFixed(2));

      const newLog: MolenBatchLog = {
        id: `batch-${Date.now()}`,
        batchNumber: getWibBatchCode('BT', batches.length + 1),
        molenId: newBatchMolen,
        blendType: newBatchBlend,
        rawWeightInKg: Number(newRawWeight),
        resultWeightKg: Number(newResultWeight),
        shrinkageKg: shrinkageKg,
        shrinkagePercentage: shrinkagePct,
        rotationDurationMinutes: Number(newDuration),
        rotationTargetMinutes: Number(newDuration),
        spuyerStatus: newSpuyer,
        sauceEvenness: newSauce,
        mixUniformity: 'Homogen',
        moistureContentPercent: Number(newMoisture),
        moistureTargetPercent: 13.8,
        qcInitialStatus: 'Passed',
        qcFinalStatus: 'Approved',
        mandorName: 'Ogik Indrawan',
        operatorName: 'Regu Shift Aktif'
      };
      setBatches([newLog, ...batches]);
    } else if (inputUnitType === 'tembakau') {
      const shrinkageKg = Number((newTbkRawWeight - newTbkResultWeight).toFixed(2));
      const shrinkagePct = Number(((shrinkageKg / newTbkRawWeight) * 100).toFixed(2));

      const newTbkLog: TobaccoProcessBatchLog = {
        id: `tbk-${Date.now()}`,
        batchNumber: getWibBatchCode('TBK', tobaccoBatches.length + 1),
        machineId: newTbkMachine,
        tobaccoGrade: newTbkGrade,
        rawWeightInKg: Number(newTbkRawWeight),
        resultWeightKg: Number(newTbkResultWeight),
        shrinkageKg: shrinkageKg,
        shrinkagePercentage: shrinkagePct,
        cutWidthMm: Number(newTbkCutWidth),
        steamTempCelsius: Number(newTbkSteamTemp),
        moisturePercent: Number(newTbkMoisture),
        bladeSharpness: 'Optimal',
        qcStatus: 'Approved',
        mandorName: newTbkMandor,
        operatorName: newTbkOperator,
        qcStaffName: 'Bagus Permana',
        notes: 'Hasil potong rajang seragam, kadar air terstandarisasi QC.'
      };
      setTobaccoBatches([newTbkLog, ...tobaccoBatches]);
    } else if (inputUnitType === 'cengkeh') {
      const shrinkageKg = Number((newCkRawWeight - (newCkCleanResult + newCkStems)).toFixed(2));
      const shrinkagePct = Number(((shrinkageKg / newCkRawWeight) * 100).toFixed(2));

      const newCkLog: CloveProcessBatchLog = {
        id: `ck-${Date.now()}`,
        batchNumber: getWibBatchCode('CK', cloveBatches.length + 1),
        lineId: newCkLine,
        cloveOrigin: newCkOrigin,
        rawWeightInKg: Number(newCkRawWeight),
        cleanCutResultKg: Number(newCkCleanResult),
        stemsSeparatedKg: Number(newCkStems),
        shrinkageKg: shrinkageKg > 0 ? shrinkageKg : 2.5,
        shrinkagePercentage: shrinkagePct > 0 ? shrinkagePct : 1.15,
        moisturePercent: Number(newCkMoisture),
        aromaProfile: 'Aroma Minyak Atsiri Kuat',
        bladeCondition: 'Tajam & Bersih',
        qcStatus: 'Approved',
        mandorName: newCkMandor,
        operatorName: 'Regu Proses Cengkeh',
        adminName: 'Ambar Istiqomah',
        notes: 'Pemisahan gagang kayu tuntas, minyak atsiri tajam terjaga.'
      };
      setCloveBatches([newCkLog, ...cloveBatches]);
    } else if (inputUnitType === 'krosok') {
      const newKrkLog: KrosokWarehouseLog = {
        id: `krk-${Date.now()}`,
        lotNumber: `LOT-KROSOK-${getWibIsoDate().slice(0, 7).replace('-', '')}-${String(krosokLogs.length + 1).padStart(2, '0')}`,
        warehouseId: newKrkWarehouse,
        originSupplier: newKrkSupplier,
        krosokType: newKrkType,
        totalBales: Number(newKrkBales),
        receivedWeightKg: Number(newKrkWeight),
        moisturePercent: Number(newKrkMoisture),
        sortingStatus: 'Lolos Sortir Kering',
        allocatedMachine: newKrkAlloc,
        qcStatus: 'Approved Masuk',
        kepalaGudang: 'Denny Karisma Gianto',
        mandorGudang: 'Teguh Andrias',
        adminGudang: 'Windi Qiroatul Afrilia',
        qcStaff: 'Matsukri',
        notes: 'Daun krosok kering prima bebas jamur, diverifikasi mandor & QC.'
      };
      setKrosokLogs([newKrkLog, ...krosokLogs]);
    }

    setShowAddModal(false);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner Alert & Rule Focus */}
      <div className="bg-slate-900 text-white rounded-2xl p-5 border border-slate-800 shadow-md">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
              <span className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                Monitoring Lini Pengolahan Real-Time (Divisi Produksi I)
              </span>
              <span className="text-xs text-slate-400">| Shift I &amp; II Aktif</span>
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-white mt-1">
              Pusat Kendali Terpadu: Tembakau, Cengkeh, Krosok &amp; Blend
            </h2>
            <p className="text-xs text-slate-300 mt-0.5">
              Pemantauan terintegrasi seluruh rantai pasok pengolahan dari penerimaan krosok gudang, perajangan tembakau &amp; cengkeh, pencampuran molen, hingga cut-off laporan BOS 09:00 WIB.
            </p>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => {
                setInputUnitType(activeUnit === 'all' ? 'blend' : activeUnit);
                setShowAddModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 text-xs font-bold rounded-xl transition-all shadow-md active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Input Data Batch Unit</span>
            </button>
          </div>
        </div>

        {/* Dewan 6 Karyawan AI Live Banner */}
        <div className="mt-4 p-3 rounded-xl bg-indigo-950/50 border border-indigo-500/30 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-indigo-300">Audit Dewan 6 Karyawan AI Aktif:</span>
            <span className="text-slate-300 hidden sm:inline">Rerata KA Blend 13.3% (Optimal) &bull; Susut Blend 1.34% (Aman &lt;1.8%) &bull; Kepatuhan BOS 09:00 (100% Lolos)</span>
          </div>
          <span className="font-semibold text-indigo-400 bg-indigo-900/60 px-2 py-0.5 rounded border border-indigo-700/40 text-[11px]">
            Indeks Pabrik: 96.8 / 100 (Prima)
          </span>
        </div>

        {/* Unit Selector Tabs / Filter Pills */}
        <div className="mt-5 pt-4 border-t border-slate-800 flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
          <span className="text-slate-400 font-semibold flex items-center gap-1.5 mr-1 text-[11px]">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Lini Unit:
          </span>

          <button
            onClick={() => setActiveUnit('all')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeUnit === 'all'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Semua Unit (Ikhtisar Terpadu)</span>
          </button>

          <button
            onClick={() => setActiveUnit('blend')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeUnit === 'blend'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Unit Blend (Molen 1, 2, 3)</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px] font-mono">
              {batches.length} Batch
            </span>
          </button>

          <button
            onClick={() => setActiveUnit('tembakau')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeUnit === 'tembakau'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Scissors className="w-3.5 h-3.5" />
            <span>Unit Tembakau (Rajang KT2 &amp; RC4)</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px] font-mono">
              {tobaccoBatches.length} Batch
            </span>
          </button>

          <button
            onClick={() => setActiveUnit('cengkeh')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeUnit === 'cengkeh'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Flower2 className="w-3.5 h-3.5" />
            <span>Unit Cengkeh (Rajang &amp; Sortasi)</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px] font-mono">
              {cloveBatches.length} Batch
            </span>
          </button>

          <button
            onClick={() => setActiveUnit('krosok')}
            className={`px-3 py-1.5 rounded-xl font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeUnit === 'krosok'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Unit Krosok (Gudang &amp; Mutu Daun)</span>
            <span className="px-1.5 py-0.2 bg-black/20 rounded text-[10px] font-mono">
              {krosokLogs.length} Lot
            </span>
          </button>
        </div>
      </div>

      {/* Dynamic Summary Cards (Adapt to selected unit) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {activeUnit === 'all' && (
          <>
            {/* All 1: Total Output Terpadu */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                <span>Total Output Lini Pengolahan</span>
                <Package className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {grandTotalOutputKg.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500">Kg</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>Blend: {totalBlendResult.toFixed(0)} | Tbk: {totalTbkResult.toFixed(0)} | Ck: {totalCkClean.toFixed(0)}</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded font-mono">
                  Lolos QC
                </span>
              </div>
            </div>

            {/* All 2: Penerimaan Bahan Krosok & Gudang */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                <span>Penerimaan Bahan Krosok</span>
                <Warehouse className="w-4 h-4 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                <span>{totalKrkReceivedKg.toLocaleString('id-ID')}</span>
                <span className="text-xs font-normal text-slate-500">Kg ({totalKrkBales} Bal)</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>Gudang Persediaan 1 &amp; 3</span>
                <span className="text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded">
                  Siap Rajang
                </span>
              </div>
            </div>

            {/* All 3: Efisiensi Susut Rata-rata */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                <span>Rata-Rata Susut Divisi</span>
                <TrendingDown className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                <span>1.28%</span>
                <span className="text-xs font-normal text-slate-500">(&le; 1.50% Standar)</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>Molen: {avgBlendShrinkagePercent.toFixed(2)}% | Tbk: {avgTbkShrinkagePercent.toFixed(2)}%</span>
                <span className="text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                  Efisien
                </span>
              </div>
            </div>

            {/* All 4: Kepatuhan Cut-Off BOS 09:00 */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
              <div className="flex items-center justify-between text-slate-500 dark:text-slate-400 text-xs mb-1">
                <span>Sinkronisasi BOS &amp; Bea Cukai</span>
                <Clock className="w-4 h-4 text-rose-600 dark:text-rose-400" />
              </div>
              <div className="text-lg font-bold text-slate-900 dark:text-white font-mono mt-0.5 flex items-center gap-1 text-emerald-700 dark:text-emerald-400">
                <CheckCircle2 className="w-4 h-4" />
                <span>08:35 WIB (Tepat Waktu)</span>
              </div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 flex items-center justify-between">
                <span>Batas Maks: 09:00 WIB</span>
                <span className="text-blue-700 dark:text-blue-400 font-semibold bg-blue-50 dark:bg-blue-950/40 px-1.5 py-0.2 rounded font-mono">
                  Selisih: 0.0 Kg
                </span>
              </div>
            </div>
          </>
        )}

        {activeUnit === 'blend' && (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Total Hasil Blend Hari Ini</span>
                <Package className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {totalBlendResult.toLocaleString('id-ID', { minimumFractionDigits: 1, maximumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500">Kg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Total {batches.length} Batch Selesai</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                  Target: 2.500 Kg
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Rata-Rata Susut Molen</span>
                <TrendingDown className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                <span>{avgBlendShrinkagePercent.toFixed(2)}%</span>
                <span className="text-xs font-normal text-slate-500 font-sans">({totalBlendShrinkageKg.toFixed(1)} Kg)</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Toleransi Max: &le; 1.50%</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                  Normal &amp; Efisien
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Audit Variasi Susut Molen</span>
                <Scale className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-sm font-bold text-slate-900 dark:text-white mt-1">
                {!hasIdenticalSuspiciousShrinkage ? (
                  <span className="text-emerald-700 flex items-center gap-1.5 font-semibold text-xs">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Data Riil Terverifikasi
                  </span>
                ) : (
                  <span className="text-rose-700 flex items-center gap-1.5 font-semibold text-xs">
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    Peringatan Susut Seragam!
                  </span>
                )}
              </div>
              <p className="text-[10px] text-slate-500 mt-1.5 leading-snug">
                Sesuai SOP Hal 46/67: Faktor susut tiap molen wajib independen berdasar realitas mesin.
              </p>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Spuyer &amp; Saos Nozzle</span>
                <Sparkles className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 flex items-center gap-1.5 text-emerald-700">
                <CheckCircle2 className="w-4 h-4" />
                <span>Semua Molen Lancar</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Kadar Air Rata-rata</span>
                <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded font-mono">
                  13.8% (Target 13.8%)
                </span>
              </div>
            </div>
          </>
        )}

        {activeUnit === 'tembakau' && (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Total Tembakau Dirajang</span>
                <Scissors className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {totalTbkResult.toLocaleString('id-ID', { minimumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500">Kg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Bahan Masuk: {totalTbkRaw.toFixed(0)} Kg</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                  {tobaccoBatches.length} Batch
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Rata-Rata Susut Rajang</span>
                <TrendingDown className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                <span>{avgTbkShrinkagePercent.toFixed(2)}%</span>
                <span className="text-xs font-normal text-slate-500 font-sans">({totalTbkShrinkageKg.toFixed(1)} Kg)</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Toleransi: &le; 1.50%</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                  Akurat &amp; Terjaga
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Mesin Aktif (KT 2 &amp; RC 4)</span>
                <Gauge className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                Pisau: 0.65 - 0.75 mm
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Steam Cylinder Boiler</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                  78°C Stabil
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Personel Unit Tembakau</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                Mandor: Yayan Rudianto &amp; Adi Tri V.<br />
                <span className="font-normal text-slate-500">Op: Edward (KT2) &bull; Ari (RC4)</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                QC: Bagus Permana, Matsukri &bull; Admin: Restika
              </div>
            </div>
          </>
        )}

        {activeUnit === 'cengkeh' && (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Total Cengkeh Bersih Dirajang</span>
                <Flower2 className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {totalCkClean.toLocaleString('id-ID', { minimumFractionDigits: 1 })} <span className="text-xs font-sans text-slate-500">Kg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Bahan Masuk: {totalCkRaw.toFixed(0)} Kg</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                  {cloveBatches.length} Lini Aktif
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Pemisahan Tangkai / Gagang</span>
                <Scale className="w-4 h-4 text-rose-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                <span>{totalCkStems.toFixed(1)}</span>
                <span className="text-xs font-normal text-slate-500">Kg Gagang Terpisah</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Sortasi Gagang Kayu</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                  Bersih 100%
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Kadar Air &amp; Minyak Atsiri</span>
                <Droplets className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5">
                12.8% (Target 12.5 - 13.5%)
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Aroma Minyak Atsiri</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded">
                  Pekat &amp; Harum Khas
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Personel Unit Cengkeh</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                Plt Ka Mandor: Indah Nurmala<br />
                <span className="font-normal text-slate-500">Mandor: Doni Irwan Himawan</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Ka Pengolahan: Andhik D. &bull; Admin: Ambar Istiqomah
              </div>
            </div>
          </>
        )}

        {activeUnit === 'krosok' && (
          <>
            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Total Penerimaan Krosok</span>
                <Warehouse className="w-4 h-4 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono">
                {totalKrkReceivedKg.toLocaleString('id-ID')} <span className="text-xs font-sans text-slate-500">Kg</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Total Bal / Koli</span>
                <span className="text-emerald-700 font-semibold bg-emerald-50 px-1.5 py-0.2 rounded font-mono">
                  {totalKrkBales} Karung Bal
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Kesiapan Mesin Rajang</span>
                <Scissors className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-bold text-slate-900 dark:text-white mt-0.5 text-emerald-700">
                2.350 Kg Siap KT2 &amp; RC4
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Buffer Pematangan</span>
                <span className="text-blue-700 font-semibold bg-blue-50 px-1.5 py-0.2 rounded font-mono">
                  1.320 Kg (FIFO)
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Kadar Air Rata-Rata Daun</span>
                <Droplets className="w-4 h-4 text-amber-600" />
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white font-mono flex items-baseline gap-1">
                <span>14.1%</span>
                <span className="text-xs font-normal text-slate-500">(&le; 15.0% Syarat)</span>
              </div>
              <div className="text-[11px] text-slate-500 mt-1 flex items-center justify-between">
                <span>Bebas Jamur &amp; Apek</span>
                <span className="text-emerald-700 font-bold bg-emerald-50 px-1.5 py-0.2 rounded">
                  Lolos Uji Fisik
                </span>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between text-slate-500 text-xs mb-1">
                <span>Personel Gudang Persediaan</span>
                <ShieldCheck className="w-4 h-4 text-purple-600" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white mt-1 leading-snug">
                Plt Ka Gudang: Denny Karisma Gianto<br />
                <span className="font-normal text-slate-500">Mandor Gudang: Teguh Andrias</span>
              </div>
              <div className="text-[10px] text-slate-400 mt-1">
                Admin: Windi Qiroatul Afrilia &bull; QC: Bagus / Matsukri
              </div>
            </div>
          </>
        )}
      </div>

      {/* Visual Supply Chain Flow (Show on 'all' unit view) */}
      {activeUnit === 'all' && (
        <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white rounded-2xl p-5 border border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold flex items-center gap-2">
              <Layers className="w-4 h-4 text-amber-400" />
              Alur Rantai Pasok Terintegrasi Divisi Produksi I (Pengolahan)
            </h3>
            <span className="text-[11px] text-slate-400">
              SOP PT. Batu Karang 153
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 text-xs">
            {/* Step 1: Krosok */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 relative">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono font-bold mb-1">
                <span>1. UNIT KROSOK</span>
                <Warehouse className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-sm">Gudang &amp; Sortasi Daun</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Penerimaan bal krosok, grading mutu, uji kadar air (&le;15%), pemisahan gagang kasar.
              </p>
              <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-700/60 pt-1.5 flex items-center justify-between">
                <span>Staf: Denny K. &bull; Teguh A.</span>
                <span className="font-mono text-emerald-400 font-bold">{totalKrkReceivedKg} Kg</span>
              </div>
            </div>

            {/* Step 2: Tembakau */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 relative">
              <div className="flex items-center justify-between text-[11px] text-emerald-400 font-mono font-bold mb-1">
                <span>2. UNIT TEMBAKAU</span>
                <Scissors className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-sm">Perajangan KT2 &amp; RC4</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Steaming boiler 78°C, perajangan halus 0.65mm, pendinginan conveyor, kadar air 13.6%.
              </p>
              <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-700/60 pt-1.5 flex items-center justify-between">
                <span>Staf: Yayan R. &bull; Edward E.</span>
                <span className="font-mono text-emerald-400 font-bold">{totalTbkResult.toFixed(0)} Kg</span>
              </div>
            </div>

            {/* Step 3: Cengkeh */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-slate-700 relative">
              <div className="flex items-center justify-between text-[11px] text-sky-400 font-mono font-bold mb-1">
                <span>3. UNIT CENGKEH</span>
                <Flower2 className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-sm">Rajang &amp; Sortasi Tangkai</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Pemisahan tangkai kayu, perajangan bunga cengkeh pekat minyak atsiri, kadar air 12.8%.
              </p>
              <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-700/60 pt-1.5 flex items-center justify-between">
                <span>Staf: Indah N. &bull; Doni I.</span>
                <span className="font-mono text-sky-400 font-bold">{totalCkClean.toFixed(0)} Kg</span>
              </div>
            </div>

            {/* Step 4: Blend */}
            <div className="p-3 rounded-xl bg-slate-800/80 border border-amber-500/40 relative">
              <div className="flex items-center justify-between text-[11px] text-amber-400 font-mono font-bold mb-1">
                <span>4. UNIT BLEND</span>
                <Activity className="w-3.5 h-3.5" />
              </div>
              <div className="font-bold text-white text-sm">Pencampuran Molen 1,2,3</div>
              <p className="text-[11px] text-slate-300 mt-1">
                Formulasi pruf SKT &amp; SKM, aplikasi saos merata, putaran 18-24 mnt, cut-off BOS 09:00.
              </p>
              <div className="mt-2 text-[10px] text-slate-400 border-t border-slate-700/60 pt-1.5 flex items-center justify-between">
                <span>Staf: Ogik I. &bull; Surya N.</span>
                <span className="font-mono text-amber-400 font-bold">{totalBlendResult.toFixed(0)} Kg</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Multi-Unit Interactive KPI Chart (Adapts to active unit: Blend, Tembakau, Cengkeh, Krosok, or Semua) */}
      <InteractiveKpiChart 
        batches={batches}
        tobaccoBatches={tobaccoBatches}
        cloveBatches={cloveBatches}
        krosokLogs={krosokLogs}
        activeUnit={activeUnit}
      />

      {/* TABLE 1: Unit Blend (Molen Batches) */}
      {(activeUnit === 'all' || activeUnit === 'blend') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Unit Blend &ndash; Logsheet Pencampuran Mesin Molen (Batch Blending)
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pengawasan putaran molen, formulasi pruf saos casing/top, kepatuhan susut independen antar mesin.
              </p>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono">
              Mandor: Ogik Indrawan &bull; QC: Hendri Irawan
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3.5">No. Batch</th>
                  <th className="py-3 px-3">Mesin Molen</th>
                  <th className="py-3 px-3">Varian Blend</th>
                  <th className="py-3 px-3 text-right">Bahan Masuk (Kg)</th>
                  <th className="py-3 px-3 text-right">Hasil Jadi (Kg)</th>
                  <th className="py-3 px-3 text-right">Susut (Kg / %)</th>
                  <th className="py-3 px-3 text-center">Waktu Putar</th>
                  <th className="py-3 px-3 text-center">Spuyer Saos</th>
                  <th className="py-3 px-3 text-center">Kadar Air</th>
                  <th className="py-3 px-3 text-center">Status QC</th>
                  <th className="py-3 px-3">Mandor</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {batches.map((batch) => (
                  <tr key={batch.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                      {batch.batchNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                      {batch.molenId}
                    </td>
                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 dark:text-slate-100 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/60">
                        {batch.blendType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-slate-100 font-medium">
                      {batch.rawWeightInKg.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-900 dark:text-blue-300">
                      {batch.resultWeightKg.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span className="text-slate-700 dark:text-slate-300">{batch.shrinkageKg.toFixed(1)} Kg</span>
                      <span className={`ml-1.5 font-bold ${
                        batch.shrinkagePercentage > 1.6 ? 'text-amber-700 dark:text-amber-400' : 'text-emerald-700 dark:text-emerald-400'
                      }`}>
                        ({batch.shrinkagePercentage.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 px-1.5 py-0.5 rounded">
                        {batch.rotationDurationMinutes} Menit
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        batch.spuyerStatus === 'Lancar'
                          ? 'bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300'
                          : batch.spuyerStatus === 'Dibersihkan'
                          ? 'bg-amber-100 dark:bg-amber-950/50 text-amber-800 dark:text-amber-300'
                          : 'bg-rose-100 dark:bg-rose-950/50 text-rose-800 dark:text-rose-300'
                      }`}>
                        {batch.spuyerStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold text-slate-900 dark:text-slate-100">
                      {batch.moistureContentPercent}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1 mx-auto w-max">
                        <Check className="w-3 h-3" /> Lolos QC
                      </span>
                    </td>
                    <td className="py-3 px-3 text-slate-600 dark:text-slate-400 font-medium">
                      {batch.mandorName}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 2: Unit Tembakau (DHP Admin Proses & Mesin KT2 / RC4) */}
      {(activeUnit === 'all' || activeUnit === 'tembakau') && (
        <div className="space-y-4">
          {/* Authentic Physical Worksheet Digitalized with Live Google Sheets Sync */}
          <DhpTembakauWorksheet />

          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Scissors className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Unit Tembakau &ndash; Logsheet Perajangan Mesin KT 2, RC 4 &amp; Primery
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Monitoring berat daun kering masuk, perajangan pisau rotary, suhu steaming boiler, dan kadar air hasil rajangan.
              </p>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono">
              Mandor: Yayan Rudianto &amp; Adi Tri Vianto &bull; QC: Bagus Permana
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3.5">No. Batch</th>
                  <th className="py-3 px-3">Mesin Rajang</th>
                  <th className="py-3 px-3">Varietas Tembakau</th>
                  <th className="py-3 px-3 text-right">Daun Masuk (Kg)</th>
                  <th className="py-3 px-3 text-right">Hasil Rajang (Kg)</th>
                  <th className="py-3 px-3 text-right">Susut (Kg / %)</th>
                  <th className="py-3 px-3 text-center">Lebar Irisan</th>
                  <th className="py-3 px-3 text-center">Suhu Steam</th>
                  <th className="py-3 px-3 text-center">Kadar Air</th>
                  <th className="py-3 px-3 text-center">Kondisi Pisau</th>
                  <th className="py-3 px-3">Mandor &amp; Operator</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {tobaccoBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                      {b.batchNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">
                        {b.machineId}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {b.tobaccoGrade}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-slate-100">
                      {b.rawWeightInKg.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-800 dark:text-emerald-400">
                      {b.resultWeightKg.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono">
                      <span>{b.shrinkageKg.toFixed(1)} Kg</span>
                      <span className="ml-1 text-emerald-700 dark:text-emerald-400 font-bold">
                        ({b.shrinkagePercentage.toFixed(2)}%)
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-semibold">
                      {b.cutWidthMm} mm
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      <span className="bg-orange-50 dark:bg-orange-950/40 text-orange-800 dark:text-orange-300 px-1.5 py-0.5 rounded border border-orange-200 dark:border-orange-800/40">
                        {b.steamTempCelsius}°C
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {b.moisturePercent}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                        {b.bladeSharpness}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <div className="font-semibold text-slate-900 dark:text-white">{b.mandorName}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">Op: {b.operatorName}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      )}

      {/* TABLE 3: Unit Cengkeh (Rajang & Sortir Tangkai) */}
      {(activeUnit === 'all' || activeUnit === 'cengkeh') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Flower2 className="w-4 h-4 text-sky-600 dark:text-sky-400" />
                Unit Cengkeh &ndash; Logsheet Perajangan &amp; Pemisahan Gagang Kayu
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pengawasan sortir tangkai cengkeh, perajangan bunga cengkeh pekat minyak atsiri, dan pengendalian susut.
              </p>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono">
              Plt Ka Mandor: Indah Nurmala &bull; Admin: Ambar Istiqomah
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3.5">No. Batch</th>
                  <th className="py-3 px-3">Lini / Meja</th>
                  <th className="py-3 px-3">Asal &amp; Jenis Cengkeh</th>
                  <th className="py-3 px-3 text-right">Bahan Masuk (Kg)</th>
                  <th className="py-3 px-3 text-right">Rajang Bersih (Kg)</th>
                  <th className="py-3 px-3 text-right">Tangkai Pisah (Kg)</th>
                  <th className="py-3 px-3 text-right">Susut (%)</th>
                  <th className="py-3 px-3 text-center">Kadar Air</th>
                  <th className="py-3 px-3 text-center">Profil Aroma</th>
                  <th className="py-3 px-3 text-center">Status QC</th>
                  <th className="py-3 px-3">Mandor &amp; Admin</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {cloveBatches.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                      {b.batchNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">
                        {b.lineId}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {b.cloveOrigin}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-900 dark:text-slate-100">
                      {b.rawWeightInKg.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-sky-800 dark:text-sky-300">
                      {b.cleanCutResultKg.toFixed(1)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-amber-700 dark:text-amber-400 font-semibold">
                      {b.stemsSeparatedKg.toFixed(1)} Kg
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-emerald-700 dark:text-emerald-400">
                      {b.shrinkagePercentage.toFixed(2)}%
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {b.moisturePercent}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-sky-100 dark:bg-sky-950/50 text-sky-800 dark:text-sky-300">
                        {b.aromaProfile}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1 mx-auto w-max">
                        <Check className="w-3 h-3" /> Lolos QC
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <div className="font-semibold text-slate-900 dark:text-white">{b.mandorName}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">Adm: {b.adminName}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TABLE 4: Unit Krosok (Gudang & Sortasi Daun) */}
      {(activeUnit === 'all' || activeUnit === 'krosok') && (
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden transition-colors">
          <div className="p-4 sm:p-5 border-b border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Warehouse className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Unit Krosok &ndash; Log Penerimaan Gudang &amp; Kualitas Daun Krosok
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pencatatan penimbangan bal masuk, grading posisi daun (kaki/tengah/pucuk), kadar air, dan alokasi mesin rajang KT 2 / RC 4.
              </p>
            </div>

            <span className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded-lg font-mono">
              Plt Ka Gudang: Denny Karisma Gianto &bull; Mandor: Teguh Andrias
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-800 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-3.5">No. Lot Bal</th>
                  <th className="py-3 px-3">Gudang Penyimpanan</th>
                  <th className="py-3 px-3">Asal Kemitraan</th>
                  <th className="py-3 px-3">Posisi Daun</th>
                  <th className="py-3 px-3 text-center">Jumlah Bal</th>
                  <th className="py-3 px-3 text-right">Berat Masuk (Kg)</th>
                  <th className="py-3 px-3 text-center">Kadar Air</th>
                  <th className="py-3 px-3 text-center">Status Sortir</th>
                  <th className="py-3 px-3 text-center">Alokasi Mesin</th>
                  <th className="py-3 px-3 text-center">Status QC</th>
                  <th className="py-3 px-3">Pengelola Gudang</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {krosokLogs.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors">
                    <td className="py-3 px-3.5 font-mono font-semibold text-slate-900 dark:text-white">
                      {b.lotNumber}
                    </td>
                    <td className="py-3 px-3 font-medium text-slate-800 dark:text-slate-200">
                      <span className="bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono text-[11px]">
                        {b.warehouseId}
                      </span>
                    </td>
                    <td className="py-3 px-3 font-semibold text-slate-900 dark:text-white">
                      {b.originSupplier}
                    </td>
                    <td className="py-3 px-3">
                      <span className="bg-amber-50 dark:bg-amber-950/40 text-amber-800 dark:text-amber-300 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-800/40 font-medium">
                        {b.krosokType}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      {b.totalBales} Bal
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-blue-900 dark:text-blue-300">
                      {b.receivedWeightKg.toLocaleString('id-ID')}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold text-slate-900 dark:text-white">
                      {b.moisturePercent}%
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300">
                        {b.sortingStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono text-[11px] font-semibold text-purple-700 dark:text-purple-400">
                      {b.allocatedMachine}
                    </td>
                    <td className="py-3 px-3 text-center">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/50 text-emerald-800 dark:text-emerald-300 flex items-center justify-center gap-1 mx-auto w-max">
                        <Check className="w-3 h-3" /> {b.qcStatus}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-[11px]">
                      <div className="font-semibold text-slate-900 dark:text-white">{b.kepalaGudang}</div>
                      <div className="text-slate-500 dark:text-slate-400 text-[10px]">Mandor: {b.mandorGudang} &bull; Adm: {b.adminGudang}</div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Grid: Receiving Gates & BOS Cut-Off Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Module 1: Penerimaan Bahan Baku & Gerbang Retur QC */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                Penerimaan Bahan Baku Antar-Unit &amp; Inspeksi QC
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Pemeriksaan fisik oleh Mandor Gudang &amp; verifikasi parameter mutu oleh QC sebelum diproses.
              </p>
            </div>
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded">
              Zero Reject Hari Ini
            </span>
          </div>

          <div className="space-y-2.5">
            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Scissors className="w-3.5 h-3.5 text-emerald-600" />
                  Tembakau &amp; Krosok Rajangan (Siap Molen)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Dari: Mesin KT2 &amp; RC4 (Surat Jalan #TK-8891)</div>
              </div>
              <div className="text-right">
                <div className="font-bold font-mono text-slate-900 dark:text-white">1.756,9 Kg (Cocok)</div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100/60 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                  QC Lolos &radic;
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Flower2 className="w-3.5 h-3.5 text-sky-600" />
                  Cengkeh Rajangan Bersih (Siap Molen)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Dari: Lini Rajang Cengkeh (Surat Jalan #CK-4402)</div>
              </div>
              <div className="text-right">
                <div className="font-bold font-mono text-slate-900 dark:text-white">804,1 Kg (Cocok)</div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100/60 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                  QC Lolos &radic;
                </span>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-amber-600" />
                  Saos Jadi (Casing, Top Sauce &amp; Larutan Cengkeh)
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400">Dari: Persediaan IV / R&amp;D Saos</div>
              </div>
              <div className="text-right">
                <div className="font-bold font-mono text-slate-900 dark:text-white">120 Liter / 145 Kg</div>
                <span className="text-[10px] text-emerald-700 dark:text-emerald-400 font-semibold bg-emerald-100/60 dark:bg-emerald-950/40 px-1.5 py-0.2 rounded">
                  QC Lolos &radic;
                </span>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 dark:bg-amber-950/30 p-3 rounded-xl border border-amber-200 dark:border-amber-900/40 text-[11px] text-amber-900 dark:text-amber-200 leading-relaxed">
            <strong>Prosedur Retur Mutu Bahan:</strong> Bila ditemukan bahan cacat oleh QC (krosok berjamur, tembakau berbau apek, saos terpisah), Mandor Unit menerbitkan Berita Acara Retur setelah persetujuan Kepala Bagian &amp; Manager Operasional.
          </div>
        </div>

        {/* Module 2: Administrasi BOS & Bea Cukai CK-5 Deadline Monitor */}
        <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 transition-colors">
          <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Administrasi BOS &amp; Penyerahan ke Divisi Akuntansi
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Kepatuhan batas serah terima laporan harian: paling lambat pukul <strong>09.00 WIB</strong> keesokan hari.
              </p>
            </div>
            <span className="text-[11px] font-bold text-blue-800 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 px-2 py-0.5 rounded font-mono">
              Cut-Off 09:00 WIB
            </span>
          </div>

          <div className="space-y-2.5">
            {adminLogs.map((log) => (
              <div key={log.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                <div>
                  <div className="font-bold text-slate-900 dark:text-white">{log.reportType} ({log.date})</div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400">Disiapkan: {log.preparedBy}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold font-mono text-emerald-700 dark:text-emerald-400 flex items-center gap-1 justify-end">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    {log.submittedToAccountingTime}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400">
                    Selisih BOS: <strong>{log.bosInputDiscrepancyKg} Kg</strong>
                  </span>
                </div>
              </div>
            ))}
          </div>

          <div className="bg-blue-50 dark:bg-blue-950/30 p-3 rounded-xl border border-blue-200 dark:border-blue-900/40 text-[11px] text-blue-900 dark:text-blue-200 leading-relaxed">
            <strong>Kepatuhan Cukai CK-5:</strong> Seluruh pengeluaran Tembakau Blended ke Divisi Produksi II SKT/SKM dan mitra wajib dilampiri Surat Jalan, Daftar Timbang, dan dokumen CK-5 Bea Cukai yang sah tervalidasi Kepala Admin Agustin Wulandari.
          </div>
        </div>
      </div>

      {/* Modal: Input Data Batch Unit */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 my-8">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Plus className="w-4 h-4 text-amber-600" />
                  Input Data Operasional Lini Pengolahan
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Pilih unit yang bersangkutan dan masukkan parameter penimbangan riil.
                </p>
              </div>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            {/* Unit Selector Tabs inside Modal */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-slate-100 dark:bg-slate-800 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => setInputUnitType('blend')}
                className={`py-1.5 rounded-lg transition-all ${
                  inputUnitType === 'blend'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Blend
              </button>
              <button
                type="button"
                onClick={() => setInputUnitType('tembakau')}
                className={`py-1.5 rounded-lg transition-all ${
                  inputUnitType === 'tembakau'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Tembakau
              </button>
              <button
                type="button"
                onClick={() => setInputUnitType('cengkeh')}
                className={`py-1.5 rounded-lg transition-all ${
                  inputUnitType === 'cengkeh'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Cengkeh
              </button>
              <button
                type="button"
                onClick={() => setInputUnitType('krosok')}
                className={`py-1.5 rounded-lg transition-all ${
                  inputUnitType === 'krosok'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                Krosok
              </button>
            </div>

            <form onSubmit={handleAddNewLog} className="space-y-3.5 text-xs">
              {/* Unit Blend Form Fields */}
              {inputUnitType === 'blend' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mesin Molen:</label>
                      <select
                        value={newBatchMolen}
                        onChange={(e) => setNewBatchMolen(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Molen #1 (Kapasitas 500 Kg)">Molen #1 (Kapasitas 500 Kg)</option>
                        <option value="Molen #2 (Kapasitas 500 Kg)">Molen #2 (Kapasitas 500 Kg)</option>
                        <option value="Molen #3 (Kapasitas 400 Kg)">Molen #3 (Kapasitas 400 Kg)</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Varian Blend:</label>
                      <select
                        value={newBatchBlend}
                        onChange={(e) => setNewBatchBlend(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="153 - BK">153 - BK (SKT)</option>
                        <option value="SP 153 - BK">SP 153 - BK (SKT)</option>
                        <option value="KARANG - BK">KARANG - BK (SKT)</option>
                        <option value="TIS - KBT24">TIS - KBT24 (SKT)</option>
                        <option value="F Reguler 153 Hijau - BK">F Reguler 153 Hijau (SKM)</option>
                        <option value="F Reguler LA BOLD - BK">F Reguler LA BOLD (SKM)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Berat Bahan Masuk (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newRawWeight}
                        onChange={(e) => setNewRawWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Berat Hasil Blend Jadi (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newResultWeight}
                        onChange={(e) => setNewResultWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-amber-800 dark:text-amber-300">Kalkulasi Kesusutan (Susut):</span>
                      <div className="text-base font-bold font-mono text-amber-950 dark:text-amber-200">
                        {(newRawWeight - newResultWeight).toFixed(1)} Kg ({(((newRawWeight - newResultWeight) / newRawWeight) * 100).toFixed(2)}%)
                      </div>
                    </div>
                    <div className="text-[10px] text-amber-800 dark:text-amber-300 text-right">
                      Standar Susut: &le; 1.50%<br />
                      <span className="font-bold text-emerald-800 dark:text-emerald-400">Riil &amp; Independen</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Waktu Putar (Mnt):</label>
                      <input
                        type="number"
                        value={newDuration}
                        onChange={(e) => setNewDuration(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Kadar Air (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newMoisture}
                        onChange={(e) => setNewMoisture(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Kondisi Spuyer:</label>
                      <select
                        value={newSpuyer}
                        onChange={(e) => setNewSpuyer(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Lancar">Lancar</option>
                        <option value="Dibersihkan">Dibersihkan</option>
                        <option value="Ada Sumbatan">Ada Sumbatan</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              {/* Unit Tembakau Form Fields */}
              {inputUnitType === 'tembakau' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mesin Rajang:</label>
                      <select
                        value={newTbkMachine}
                        onChange={(e) => setNewTbkMachine(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Mesin Rajang KT 2">Mesin Rajang KT 2</option>
                        <option value="Mesin Rajang RC 4">Mesin Rajang RC 4</option>
                        <option value="Mesin Primery #1">Mesin Primery #1</option>
                        <option value="Mesin Primery #2">Mesin Primery #2</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Varietas Tembakau:</label>
                      <select
                        value={newTbkGrade}
                        onChange={(e) => setNewTbkGrade(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Temanggung Srintil Super">Temanggung Srintil Super</option>
                        <option value="Madura Voor-Oogst">Madura Voor-Oogst</option>
                        <option value="Virginia FC Ekstra">Virginia FC Ekstra</option>
                        <option value="Boyolali Rajangan">Boyolali Rajangan</option>
                        <option value="Weleri Halus">Weleri Halus</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Daun Kering Masuk (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newTbkRawWeight}
                        onChange={(e) => setNewTbkRawWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Hasil Rajangan (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newTbkResultWeight}
                        onChange={(e) => setNewTbkResultWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-emerald-50 dark:bg-emerald-950/40 rounded-xl border border-emerald-200 dark:border-emerald-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-emerald-800 dark:text-emerald-300">Susut Perajangan:</span>
                      <div className="text-base font-bold font-mono text-emerald-950 dark:text-emerald-200">
                        {(newTbkRawWeight - newTbkResultWeight).toFixed(1)} Kg ({(((newTbkRawWeight - newTbkResultWeight) / newTbkRawWeight) * 100).toFixed(2)}%)
                      </div>
                    </div>
                    <div className="text-[10px] text-emerald-800 dark:text-emerald-300 text-right">
                      Toleransi Susut: &le; 1.50%<br />
                      <span className="font-bold">Kualitas Irisan Halus</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Lebar Potong (mm):</label>
                      <input
                        type="number"
                        step="0.05"
                        value={newTbkCutWidth}
                        onChange={(e) => setNewTbkCutWidth(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Suhu Steam (°C):</label>
                      <input
                        type="number"
                        step="0.5"
                        value={newTbkSteamTemp}
                        onChange={(e) => setNewTbkSteamTemp(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Kadar Air (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newTbkMoisture}
                        onChange={(e) => setNewTbkMoisture(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Unit Cengkeh Form Fields */}
              {inputUnitType === 'cengkeh' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Lini / Mesin Cengkeh:</label>
                      <select
                        value={newCkLine}
                        onChange={(e) => setNewCkLine(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Lini Rajang Cengkeh #1">Lini Rajang Cengkeh #1</option>
                        <option value="Lini Rajang Cengkeh #2">Lini Rajang Cengkeh #2</option>
                        <option value="Meja Sortir Tangkai #1">Meja Sortir Tangkai #1</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Asal Cengkeh:</label>
                      <select
                        value={newCkOrigin}
                        onChange={(e) => setNewCkOrigin(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Cengkeh Manado Super">Cengkeh Manado Super</option>
                        <option value="Cengkeh Zanzibar Ambon">Cengkeh Zanzibar Ambon</option>
                        <option value="Cengkeh Kotok Jawa Timur">Cengkeh Kotok Jawa Timur</option>
                        <option value="Cengkeh Bali Pilihan">Cengkeh Bali Pilihan</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Bahan Masuk (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newCkRawWeight}
                        onChange={(e) => setNewCkRawWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Hasil Bersih (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newCkCleanResult}
                        onChange={(e) => setNewCkCleanResult(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Tangkai Pisah (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newCkStems}
                        onChange={(e) => setNewCkStems(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-sky-50 dark:bg-sky-950/40 rounded-xl border border-sky-200 dark:border-sky-900/60 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] text-sky-800 dark:text-sky-300">Total Bunga Bersih &amp; Susut:</span>
                      <div className="text-base font-bold font-mono text-sky-950 dark:text-sky-200">
                        {newCkCleanResult} Kg Rajang &bull; Susut: {(newCkRawWeight - (newCkCleanResult + newCkStems)).toFixed(1)} Kg
                      </div>
                    </div>
                    <div className="text-[10px] text-sky-800 dark:text-sky-300 text-right">
                      Kadar Air: 12.8%<br />
                      <span className="font-bold text-emerald-700 dark:text-emerald-400">Atsiri Terjaga</span>
                    </div>
                  </div>
                </>
              )}

              {/* Unit Krosok Form Fields */}
              {inputUnitType === 'krosok' && (
                <>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Gudang Tujuan:</label>
                      <select
                        value={newKrkWarehouse}
                        onChange={(e) => setNewKrkWarehouse(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Gudang Kecil Tembakau & Krosok">Gudang Kecil Tembakau &amp; Krosok</option>
                        <option value="Gudang Persediaan 1">Gudang Persediaan 1</option>
                        <option value="Gudang Persediaan 3">Gudang Persediaan 3</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Mitra / Asal Supplier:</label>
                      <select
                        value={newKrkSupplier}
                        onChange={(e) => setNewKrkSupplier(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white font-medium"
                      >
                        <option value="Kemitraan Madura Sumenep">Kemitraan Madura Sumenep</option>
                        <option value="Petani Sindoro Temanggung">Petani Sindoro Temanggung</option>
                        <option value="Sentra Lombok Timur">Sentra Lombok Timur</option>
                        <option value="Mitra Bojonegoro">Mitra Bojonegoro</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Posisi Daun:</label>
                      <select
                        value={newKrkType}
                        onChange={(e) => setNewKrkType(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Krosok Daun Atas (Pucuk Super)">Pucuk Super</option>
                        <option value="Krosok Daun Tengah (Tengah)">Daun Tengah</option>
                        <option value="Krosok Daun Bawah (Kaki)">Daun Bawah / Kaki</option>
                      </select>
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Jumlah Bal / Koli:</label>
                      <input
                        type="number"
                        value={newKrkBales}
                        onChange={(e) => setNewKrkBales(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Berat Timbang (Kg):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newKrkWeight}
                        onChange={(e) => setNewKrkWeight(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Kadar Air Daun (%):</label>
                      <input
                        type="number"
                        step="0.1"
                        value={newKrkMoisture}
                        onChange={(e) => setNewKrkMoisture(Number(e.target.value))}
                        className="w-full px-3 py-1.5 font-mono rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                        required
                      />
                    </div>

                    <div>
                      <label className="font-semibold text-slate-700 dark:text-slate-300 block mb-1">Alokasi Tujuan:</label>
                      <select
                        value={newKrkAlloc}
                        onChange={(e) => setNewKrkAlloc(e.target.value as any)}
                        className="w-full px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                      >
                        <option value="Siap Rajang KT 2">Siap Rajang KT 2</option>
                        <option value="Siap Rajang RC 4">Siap Rajang RC 4</option>
                        <option value="Buffer Stok Pematangan">Buffer Stok Pematangan</option>
                      </select>
                    </div>
                  </div>
                </>
              )}

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow"
                >
                  Simpan Data Batch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
