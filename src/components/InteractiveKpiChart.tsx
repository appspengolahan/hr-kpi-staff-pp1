import React, { useState, useRef } from 'react';
import { 
  MolenBatchLog, 
  TobaccoProcessBatchLog, 
  CloveProcessBatchLog, 
  KrosokWarehouseLog 
} from '../types';
import { 
  TrendingDown, 
  Layers, 
  BarChart3, 
  Activity, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle, 
  X, 
  Info,
  Maximize2,
  Scissors,
  Flower2,
  Warehouse
} from 'lucide-react';

interface InteractiveKpiChartProps {
  batches: MolenBatchLog[];
  tobaccoBatches?: TobaccoProcessBatchLog[];
  cloveBatches?: CloveProcessBatchLog[];
  krosokLogs?: KrosokWarehouseLog[];
  activeUnit?: 'all' | 'blend' | 'tembakau' | 'cengkeh' | 'krosok';
}

interface GenericChartPoint {
  id: string;
  code: string;
  subCode: string;
  val: number;
  unit: string;
  label: string;
  details: {
    title: string;
    subTitle: string;
    highlightLabel: string;
    highlightValue: string;
    items: { label: string; value: string; color?: string }[];
    notes: string;
  };
}

export const InteractiveKpiChart: React.FC<InteractiveKpiChartProps> = ({ 
  batches,
  tobaccoBatches = [],
  cloveBatches = [],
  krosokLogs = [],
  activeUnit = 'blend'
}) => {
  // Local unit selection if activeUnit is 'all'
  const [selectedUnit, setSelectedUnit] = useState<'blend' | 'tembakau' | 'cengkeh' | 'krosok'>('blend');
  const effectiveUnit = activeUnit === 'all' ? selectedUnit : activeUnit;

  // Selected metric per unit
  const [metricBlend, setMetricBlend] = useState<'shrinkage' | 'resultWeight' | 'moisture' | 'duration'>('shrinkage');
  const [metricTbk, setMetricTbk] = useState<'shrinkage' | 'resultWeight' | 'moisture' | 'steamTemp'>('shrinkage');
  const [metricCk, setMetricCk] = useState<'shrinkage' | 'cleanWeight' | 'stems' | 'moisture'>('shrinkage');
  const [metricKrk, setMetricKrk] = useState<'weight' | 'bales' | 'moisture'>('weight');

  const [selectedPoint, setSelectedPoint] = useState<GenericChartPoint & { x: number; y: number } | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // SVG Chart Dimensions
  const svgWidth = 840;
  const svgHeight = 280;
  const paddingLeft = 55;
  const paddingRight = 45;
  const paddingTop = 35;
  const paddingBottom = 45;

  const chartWidth = svgWidth - paddingLeft - paddingRight;
  const chartHeight = svgHeight - paddingTop - paddingBottom;

  // Build points based on effective unit & chosen metric
  const chartPoints: GenericChartPoint[] = React.useMemo(() => {
    if (effectiveUnit === 'tembakau') {
      return tobaccoBatches.map(b => {
        let val = b.shrinkagePercentage;
        let unit = '%';
        let label = 'Susut Rajang';

        if (metricTbk === 'resultWeight') {
          val = b.resultWeightKg;
          unit = 'Kg';
          label = 'Hasil Rajang';
        } else if (metricTbk === 'moisture') {
          val = b.moisturePercent;
          unit = '%';
          label = 'Kadar Air';
        } else if (metricTbk === 'steamTemp') {
          val = b.steamTempCelsius;
          unit = '°C';
          label = 'Suhu Steam Boiler';
        }

        return {
          id: b.id,
          code: b.batchNumber.replace('TBK-20261007-', 'T-'),
          subCode: b.machineId.replace('Mesin Rajang ', ''),
          val,
          unit,
          label,
          details: {
            title: `${b.batchNumber} (${b.tobaccoGrade})`,
            subTitle: `${b.machineId} &bull; Lebar irisan: ${b.cutWidthMm} mm`,
            highlightLabel: label,
            highlightValue: `${val} ${unit}`,
            items: [
              { label: 'Bahan Masuk', value: `${b.rawWeightInKg} Kg` },
              { label: 'Hasil Jadi', value: `${b.resultWeightKg} Kg`, color: 'text-emerald-300' },
              { label: 'Susut Riil', value: `${b.shrinkagePercentage}% (${b.shrinkageKg} Kg)`, color: 'text-amber-300' },
              { label: 'Suhu Boiler', value: `${b.steamTempCelsius}°C` },
              { label: 'Kadar Air', value: `${b.moisturePercent}%`, color: 'text-blue-300' },
              { label: 'Kondisi Pisau', value: b.bladeSharpness },
              { label: 'Mandor', value: b.mandorName },
              { label: 'Operator Mesin', value: b.operatorName }
            ],
            notes: b.notes || 'Parameter rajangan stabil, steam cylinder terjaga 78°C.'
          }
        };
      });
    }

    if (effectiveUnit === 'cengkeh') {
      return cloveBatches.map(b => {
        let val = b.shrinkagePercentage;
        let unit = '%';
        let label = 'Susut Cengkeh';

        if (metricCk === 'cleanWeight') {
          val = b.cleanCutResultKg;
          unit = 'Kg';
          label = 'Rajangan Bersih';
        } else if (metricCk === 'stems') {
          val = b.stemsSeparatedKg;
          unit = 'Kg';
          label = 'Gagang Terpisah';
        } else if (metricCk === 'moisture') {
          val = b.moisturePercent;
          unit = '%';
          label = 'Kadar Air';
        }

        return {
          id: b.id,
          code: b.batchNumber.replace('CK-20261007-', 'C-'),
          subCode: b.lineId.split(' ')[0],
          val,
          unit,
          label,
          details: {
            title: `${b.batchNumber} (${b.cloveOrigin})`,
            subTitle: b.lineId,
            highlightLabel: label,
            highlightValue: `${val} ${unit}`,
            items: [
              { label: 'Bahan Masuk', value: `${b.rawWeightInKg} Kg` },
              { label: 'Cengkeh Bersih', value: `${b.cleanCutResultKg} Kg`, color: 'text-sky-300' },
              { label: 'Gagang Terpisah', value: `${b.stemsSeparatedKg} Kg`, color: 'text-amber-300' },
              { label: 'Susut Proses', value: `${b.shrinkagePercentage}% (${b.shrinkageKg} Kg)` },
              { label: 'Kadar Air', value: `${b.moisturePercent}%`, color: 'text-blue-300' },
              { label: 'Aroma Atsiri', value: b.aromaProfile },
              { label: 'Mandor Cengkeh', value: b.mandorName },
              { label: 'Admin', value: b.adminName }
            ],
            notes: b.notes || 'Pemisahan gagang kayu rapi, minyak atsiri tajam terjaga.'
          }
        };
      });
    }

    if (effectiveUnit === 'krosok') {
      return krosokLogs.map(b => {
        let val = b.receivedWeightKg;
        let unit = 'Kg';
        let label = 'Berat Penerimaan';

        if (metricKrk === 'bales') {
          val = b.totalBales;
          unit = 'Bal';
          label = 'Jumlah Bal/Koli';
        } else if (metricKrk === 'moisture') {
          val = b.moisturePercent;
          unit = '%';
          label = 'Kadar Air Daun';
        }

        return {
          id: b.id,
          code: b.lotNumber.replace('LOT-KROSOK-202610-', 'L-'),
          subCode: b.warehouseId.split(' ')[0],
          val,
          unit,
          label,
          details: {
            title: `${b.lotNumber} (${b.krosokType})`,
            subTitle: `${b.warehouseId} &bull; ${b.originSupplier}`,
            highlightLabel: label,
            highlightValue: `${val} ${unit}`,
            items: [
              { label: 'Berat Masuk', value: `${b.receivedWeightKg} Kg`, color: 'text-blue-300' },
              { label: 'Jumlah Bal', value: `${b.totalBales} Bal` },
              { label: 'Kadar Air', value: `${b.moisturePercent}%`, color: 'text-emerald-300' },
              { label: 'Alokasi Mesin', value: b.allocatedMachine },
              { label: 'Status Sortir', value: b.sortingStatus },
              { label: 'Status QC', value: b.qcStatus },
              { label: 'Ka Gudang', value: b.kepalaGudang },
              { label: 'Mandor Gudang', value: b.mandorGudang }
            ],
            notes: b.notes || 'Krosok kering prima, bebas jamur atau bau apek.'
          }
        };
      });
    }

    // Default: Blend (Molen Batches)
    return batches.map(b => {
      let val = b.shrinkagePercentage;
      let unit = '%';
      let label = 'Susut Riil Molen';

      if (metricBlend === 'resultWeight') {
        val = b.resultWeightKg;
        unit = 'Kg';
        label = 'Hasil Jadi Blend';
      } else if (metricBlend === 'moisture') {
        val = b.moistureContentPercent;
        unit = '%';
        label = 'Kadar Air';
      } else if (metricBlend === 'duration') {
        val = b.rotationDurationMinutes;
        unit = 'Menit';
        label = 'Waktu Putar Molen';
      }

      return {
        id: b.id,
        code: b.batchNumber.replace('BT-20261007-', 'B-'),
        subCode: b.molenId.split(' ')[0] + ' ' + (b.molenId.split(' ')[1] || ''),
        val,
        unit,
        label,
        details: {
          title: `${b.batchNumber} (${b.blendType})`,
          subTitle: b.molenId,
          highlightLabel: label,
          highlightValue: `${val} ${unit}`,
          items: [
            { label: 'Bahan Masuk', value: `${b.rawWeightInKg} Kg` },
            { label: 'Hasil Jadi', value: `${b.resultWeightKg} Kg`, color: 'text-blue-300' },
            { label: 'Susut Molen', value: `${b.shrinkagePercentage}% (${b.shrinkageKg} Kg)`, color: 'text-amber-300' },
            { label: 'Waktu Putar', value: `${b.rotationDurationMinutes} Menit` },
            { label: 'Kadar Air', value: `${b.moistureContentPercent}%`, color: 'text-emerald-300' },
            { label: 'Spuyer Saos', value: b.spuyerStatus },
            { label: 'Mandor', value: b.mandorName },
            { label: 'Operator', value: b.operatorName }
          ],
          notes: b.notes || 'Pemeriksaan spuyer nozzle lancar, variasi susut independen terbukti.'
        }
      };
    });
  }, [effectiveUnit, batches, tobaccoBatches, cloveBatches, krosokLogs, metricBlend, metricTbk, metricCk, metricKrk]);

  // Compute scale boundaries
  const values = chartPoints.map(p => p.val);
  const minVal = values.length > 0 ? Math.min(...values) : 0;
  const maxVal = values.length > 0 ? Math.max(...values) : 10;

  let yMin = minVal * 0.9;
  let yMax = maxVal * 1.1;

  if (effectiveUnit === 'blend' && metricBlend === 'shrinkage') {
    yMin = 0.8;
    yMax = Math.max(1.8, Math.ceil(maxVal * 1.15 * 10) / 10);
  } else if (effectiveUnit === 'tembakau' && metricTbk === 'shrinkage') {
    yMin = 0.8;
    yMax = Math.max(1.8, Math.ceil(maxVal * 1.15 * 10) / 10);
  } else if (effectiveUnit === 'cengkeh' && metricCk === 'shrinkage') {
    yMin = 0.8;
    yMax = Math.max(1.8, Math.ceil(maxVal * 1.15 * 10) / 10);
  }

  const yRange = yMax - yMin || 1;

  // Calculate coordinates
  const points = chartPoints.map((pt, index) => {
    const x = paddingLeft + (index / Math.max(1, chartPoints.length - 1)) * chartWidth;
    const y = paddingTop + chartHeight - ((pt.val - yMin) / yRange) * chartHeight;
    return { ...pt, x, y };
  });

  const polylinePoints = points.map(p => `${p.x},${p.y}`).join(' ');

  // SVG Area path
  const areaPath = points.length > 0 
    ? `M ${points[0].x},${paddingTop + chartHeight} L ${points.map(p => `${p.x},${p.y}`).join(' L ')} L ${points[points.length - 1].x},${paddingTop + chartHeight} Z`
    : '';

  const handlePointClick = (pt: typeof points[0], e: React.MouseEvent) => {
    e.stopPropagation();
    if (selectedPoint?.id === pt.id) {
      setSelectedPoint(null);
    } else {
      setSelectedPoint(pt);
    }
  };

  // Header Title & Icon
  const unitInfo = {
    blend: { title: 'Unit Blend (Pencampuran Molen)', icon: Activity, color: 'text-amber-500' },
    tembakau: { title: 'Unit Tembakau (Perajangan KT2 & RC4)', icon: Scissors, color: 'text-emerald-500' },
    cengkeh: { title: 'Unit Cengkeh (Sortasi & Rajang Cengkeh)', icon: Flower2, color: 'text-sky-500' },
    krosok: { title: 'Unit Krosok (Penerimaan Bal & Gudang)', icon: Warehouse, color: 'text-blue-500' }
  }[effectiveUnit];

  const UnitIcon = unitInfo.icon;

  return (
    <div 
      ref={containerRef}
      className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-sm space-y-4 relative transition-colors"
      onClick={() => setSelectedPoint(null)}
    >
      {/* Top Header of the Chart */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
        <div>
          <div className="flex items-center gap-2">
            <span className={`p-1.5 rounded-lg bg-amber-500/10 ${unitInfo.color}`}>
              <UnitIcon className="w-4 h-4" />
            </span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">
              Matriks Grafik Produktivitas &amp; Pengendalian Mutu &ndash; {unitInfo.title}
            </h3>
            <span className="text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full border border-emerald-500/20 font-mono">
              Live Interaktif
            </span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Setiap titik grafik dilengkapi indikator angka riil. Klik titik mana saja untuk membuka kartu audit komparatif tepat di atas koordinat.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 bg-slate-100 dark:bg-slate-800/80 p-1 rounded-2xl text-xs">
          {/* Unit Toggle if 'all' view is active */}
          {activeUnit === 'all' && (
            <div className="flex items-center gap-1 pr-2 border-r border-slate-300 dark:border-slate-700 mr-1">
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedUnit('blend'); setSelectedPoint(null); }}
                className={`px-2 py-1 rounded-xl font-bold transition text-[11px] ${
                  selectedUnit === 'blend' ? 'bg-amber-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Blend
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedUnit('tembakau'); setSelectedPoint(null); }}
                className={`px-2 py-1 rounded-xl font-bold transition text-[11px] ${
                  selectedUnit === 'tembakau' ? 'bg-emerald-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Tembakau
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedUnit('cengkeh'); setSelectedPoint(null); }}
                className={`px-2 py-1 rounded-xl font-bold transition text-[11px] ${
                  selectedUnit === 'cengkeh' ? 'bg-sky-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Cengkeh
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedUnit('krosok'); setSelectedPoint(null); }}
                className={`px-2 py-1 rounded-xl font-bold transition text-[11px] ${
                  selectedUnit === 'krosok' ? 'bg-blue-500 text-slate-950' : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                Krosok
              </button>
            </div>
          )}

          {/* Unit Specific Metric Buttons */}
          {effectiveUnit === 'blend' && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricBlend('shrinkage'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricBlend === 'shrinkage' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Susut Molen (%)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricBlend('resultWeight'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricBlend === 'resultWeight' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Tonase Jadi (Kg)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricBlend('moisture'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricBlend === 'moisture' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Kadar Air (%)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricBlend('duration'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricBlend === 'duration' ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Waktu Putar
              </button>
            </>
          )}

          {effectiveUnit === 'tembakau' && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricTbk('shrinkage'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricTbk === 'shrinkage' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Susut Rajang (%)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricTbk('resultWeight'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricTbk === 'resultWeight' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Hasil Rajang (Kg)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricTbk('moisture'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricTbk === 'moisture' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Kadar Air (%)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricTbk('steamTemp'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricTbk === 'steamTemp' ? 'bg-emerald-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Suhu Steam (°C)
              </button>
            </>
          )}

          {effectiveUnit === 'cengkeh' && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricCk('shrinkage'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricCk === 'shrinkage' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Susut Cengkeh (%)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricCk('cleanWeight'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricCk === 'cleanWeight' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Rajang Bersih (Kg)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricCk('stems'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricCk === 'stems' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Gagang Pisah (Kg)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricCk('moisture'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricCk === 'moisture' ? 'bg-sky-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Kadar Air (%)
              </button>
            </>
          )}

          {effectiveUnit === 'krosok' && (
            <>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricKrk('weight'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricKrk === 'weight' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Berat Masuk (Kg)
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricKrk('bales'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricKrk === 'bales' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Jumlah Bal
              </button>
              <button
                type="button"
                onClick={(e) => { e.stopPropagation(); setMetricKrk('moisture'); setSelectedPoint(null); }}
                className={`px-2.5 py-1 rounded-xl font-medium transition ${metricKrk === 'moisture' ? 'bg-blue-500 text-slate-950 font-bold' : 'text-slate-600 dark:text-slate-300'}`}
              >
                Kadar Air (%)
              </button>
            </>
          )}
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full overflow-x-auto select-none pt-2">
        <svg 
          viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
          className="w-full h-auto min-w-[680px] drop-shadow-sm"
        >
          <defs>
            <linearGradient id="areaGradientMulti" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
            </linearGradient>
            <filter id="shadowFilterMulti" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, idx) => {
            const y = paddingTop + chartHeight * pct;
            const currentVal = yMax - pct * yRange;
            return (
              <g key={idx}>
                <line 
                  x1={paddingLeft} 
                  y1={y} 
                  x2={svgWidth - paddingRight} 
                  y2={y} 
                  stroke="currentColor" 
                  className="text-slate-200 dark:text-slate-800 stroke-[1]" 
                  strokeDasharray="4 4" 
                />
                <text 
                  x={paddingLeft - 8} 
                  y={y + 4} 
                  textAnchor="end" 
                  className="text-[10px] font-mono fill-slate-400 dark:fill-slate-500 font-semibold"
                >
                  {currentVal.toFixed(currentVal > 100 ? 0 : 1)}
                </text>
              </g>
            );
          })}

          {/* Shaded Area */}
          {areaPath && (
            <path 
              d={areaPath} 
              fill="url(#areaGradientMulti)" 
            />
          )}

          {/* Trend Polyline */}
          {polylinePoints && (
            <polyline 
              fill="none" 
              stroke="#f59e0b" 
              strokeWidth="3.5" 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              points={polylinePoints} 
              filter="url(#shadowFilterMulti)"
            />
          )}

          {/* Data Points with Numeric Labels Above */}
          {points.map((pt) => {
            const isSelected = selectedPoint?.id === pt.id;

            return (
              <g 
                key={pt.id} 
                className="group cursor-pointer transition-transform"
                onClick={(e) => handlePointClick(pt, e)}
              >
                {/* Numeric Pill Badge Directly Above Point */}
                <g transform={`translate(${pt.x}, ${pt.y - 14})`}>
                  <rect 
                    x="-20" 
                    y="-12" 
                    width="40" 
                    height="16" 
                    rx="8" 
                    className={`transition-all ${
                      isSelected 
                        ? 'fill-amber-400 stroke-amber-500 stroke-[1.5]' 
                        : 'fill-slate-900/90 dark:fill-slate-800/90 stroke-slate-700 stroke-[1]'
                    }`}
                  />
                  <text 
                    x="0" 
                    y="-1" 
                    textAnchor="middle" 
                    className={`text-[9px] font-mono font-bold ${
                      isSelected ? 'fill-slate-950 font-black' : 'fill-amber-300 dark:fill-amber-400'
                    }`}
                  >
                    {pt.val.toFixed(pt.val > 100 ? 0 : 2)}
                    {pt.unit === '%' ? '%' : ''}
                  </text>
                </g>

                {/* Outer halo */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isSelected ? 10 : 7} 
                  className={`transition-all ${
                    isSelected ? 'fill-amber-400/40 animate-ping' : 'fill-amber-500/20 group-hover:fill-amber-500/40'
                  }`}
                />

                {/* Center dot */}
                <circle 
                  cx={pt.x} 
                  cy={pt.y} 
                  r={isSelected ? 5.5 : 4.5} 
                  fill={isSelected ? '#f59e0b' : '#ffffff'} 
                  stroke="#d97706" 
                  strokeWidth="2.5" 
                />

                {/* X-axis labels */}
                <text 
                  x={pt.x} 
                  y={paddingTop + chartHeight + 16} 
                  textAnchor="middle" 
                  className={`text-[9px] font-mono transition-colors ${
                    isSelected ? 'fill-amber-500 font-bold' : 'fill-slate-500 dark:fill-slate-400'
                  }`}
                >
                  {pt.code}
                </text>
                <text 
                  x={pt.x} 
                  y={paddingTop + chartHeight + 28} 
                  textAnchor="middle" 
                  className="text-[8px] fill-slate-400 dark:fill-slate-500 font-medium"
                >
                  {pt.subCode}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Floating Pop-up Positioned Exactly Above Clicked Point */}
        {selectedPoint && (
          <div 
            className="absolute z-30 transition-all pointer-events-auto"
            style={{
              left: `${Math.min(80, Math.max(20, (selectedPoint.x / svgWidth) * 100))}%`,
              top: `${Math.max(5, (selectedPoint.y / svgHeight) * 100 - 50)}%`,
              transform: 'translateX(-50%)'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-slate-900 text-white rounded-2xl p-3.5 shadow-2xl border border-amber-500/60 w-72 sm:w-80 text-xs relative animate-in fade-in zoom-in-95 duration-150">
              {/* Close Button */}
              <button 
                onClick={() => setSelectedPoint(null)}
                className="absolute top-2 right-2 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Point Header Info */}
              <div className="flex items-center gap-2 border-b border-slate-800 pb-2 mb-2 pr-6">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse shrink-0"></span>
                <div className="min-w-0">
                  <div className="font-bold text-amber-400 font-mono text-[11px] truncate">
                    {selectedPoint.details.title}
                  </div>
                  <div className="text-[10px] text-slate-300 truncate">
                    {selectedPoint.details.subTitle}
                  </div>
                </div>
              </div>

              {/* Highlight Metric */}
              <div className="bg-slate-800/90 rounded-xl p-2 mb-2 flex items-center justify-between border border-slate-700">
                <span className="text-[10px] text-slate-300">{selectedPoint.details.highlightLabel}:</span>
                <span className="font-bold text-amber-300 font-mono text-sm">
                  {selectedPoint.details.highlightValue}
                </span>
              </div>

              {/* Items Grid */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] text-slate-300 mb-2">
                {selectedPoint.details.items.map((item, idx) => (
                  <div key={idx} className="bg-slate-950/60 p-1.5 rounded-lg">
                    <span className="text-slate-400 block text-[9px]">{item.label}:</span>
                    <strong className={`font-mono ${item.color || 'text-slate-100'}`}>
                      {item.value}
                    </strong>
                  </div>
                ))}
              </div>

              {/* Notes */}
              <div className="text-[9px] text-slate-400 flex items-center gap-1.5 pt-1.5 border-t border-slate-800">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="truncate">{selectedPoint.details.notes}</span>
              </div>

              {/* Caret pointing downwards directly to the dot */}
              <div className="absolute left-1/2 -bottom-2 -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-t-8 border-t-slate-900 drop-shadow-md"></div>
            </div>
          </div>
        )}
      </div>

      {/* Footer Rule Note */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[11px] text-slate-500 dark:text-slate-400 bg-slate-50 dark:bg-slate-800/50 p-3 rounded-2xl border border-slate-200/60 dark:border-slate-800">
        <div className="flex items-center gap-2">
          <Info className="w-4 h-4 text-amber-500 shrink-0" />
          <span>
            <strong>Standar Operasional (SK 01/2024):</strong> Seluruh data pemrosesan diintegrasikan dengan toleransi susut &le; 1.50% dan wajib merefleksikan hasil penimbangan faktual.
          </span>
        </div>
        <span className="font-mono text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 px-2 py-0.5 rounded-lg font-semibold self-start sm:self-auto">
          Toleransi: &le; 1.50%
        </span>
      </div>
    </div>
  );
};
