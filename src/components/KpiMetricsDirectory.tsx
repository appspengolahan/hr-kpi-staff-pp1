import React, { useState, useMemo } from 'react';
import { KPI_METRICS_DATA } from '../data/kpiMetricsData';
import { POSITIONS_DATA } from '../data/jobDescriptions';
import { KpiMetric, RoleId, KpiCategory } from '../types';
import { 
  Award, 
  Search, 
  Filter, 
  Sliders, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Database, 
  Activity, 
  Percent, 
  Scale, 
  Calculator,
  ChevronDown,
  Info
} from 'lucide-react';

interface KpiMetricsDirectoryProps {
  initialRoleId?: RoleId;
}

export const KpiMetricsDirectory: React.FC<KpiMetricsDirectoryProps> = ({ initialRoleId }) => {
  const [selectedRole, setSelectedRole] = useState<RoleId | 'all'>(initialRoleId || 'all');
  const [selectedCategory, setSelectedCategory] = useState<KpiCategory | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // State for interactive metric tester modal/widget
  const [activeTestMetric, setActiveTestMetric] = useState<KpiMetric | null>(null);
  const [testInputA, setTestInputA] = useState<number>(500);
  const [testInputB, setTestInputB] = useState<number>(508);

  const filteredMetrics = useMemo(() => {
    return KPI_METRICS_DATA.filter(metric => {
      const matchRole = selectedRole === 'all' || metric.roleId === selectedRole;
      const matchCategory = selectedCategory === 'all' || metric.category === selectedCategory;
      const matchQuery = 
        metric.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        metric.formula.toLowerCase().includes(searchQuery.toLowerCase());
      return matchRole && matchCategory && matchQuery;
    });
  }, [selectedRole, selectedCategory, searchQuery]);

  const categories: KpiCategory[] = ['Kualitas', 'Produktivitas', 'Efisiensi', 'Administrasi', 'Disiplin & K3'];

  const getRoleTitle = (roleId: RoleId) => {
    const role = POSITIONS_DATA.find(r => r.id === roleId);
    return role ? role.title : roleId;
  };

  const getCategoryBadgeClass = (category: KpiCategory) => {
    switch (category) {
      case 'Kualitas': return 'bg-emerald-100 text-emerald-800 border-emerald-200';
      case 'Produktivitas': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Efisiensi': return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Administrasi': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'Disiplin & K3': return 'bg-rose-100 text-rose-800 border-rose-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Info Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-800 border border-amber-500/20 uppercase tracking-wide">
                Kamus Metrik Objektif Divisi Produksi I
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {KPI_METRICS_DATA.length} Metrik Terdaftar
              </span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 tracking-tight">
              Daftar KPI Terukur per Jabatan Operasional & Pekerja
            </h2>
            <p className="text-xs text-slate-500 mt-0.5 max-w-3xl">
              Setiap metrik dilengkapi rumus matematis, bobot evaluasi, target operasional spesifik, frekuensi pemantauan, sumber data pembuktian, dan aturan eskalasi manajerial.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto">
            <span className="text-xs text-slate-500">Total Bobot per Jabatan:</span>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 font-mono">
              100% Akumulatif
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari kode KPI, rumus, kata kunci..."
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as RoleId | 'all')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50 appearance-none pr-8 cursor-pointer font-medium text-slate-800"
            >
              <option value="all">Semua Jabatan ({KPI_METRICS_DATA.length} Metrik)</option>
              {POSITIONS_DATA.map(pos => (
                <option key={pos.id} value={pos.id}>
                  {pos.title} {pos.incumbentName ? `(${pos.incumbentName})` : ''}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Category Filter */}
          <div className="relative">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value as KpiCategory | 'all')}
              className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 bg-slate-50 appearance-none pr-8 cursor-pointer font-medium text-slate-800"
            >
              <option value="all">Semua Kategori (Kualitas, Efisiensi, dll)</option>
              {categories.map(cat => (
                <option key={cat} value={cat}>Kategori: {cat}</option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Quick Category Tags */}
        <div className="flex items-center gap-1.5 mt-3 pt-3 border-t border-slate-100 overflow-x-auto no-scrollbar">
          <span className="text-[11px] text-slate-400 font-medium mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter Cepat:
          </span>
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
              selectedCategory === 'all'
                ? 'bg-slate-900 text-white'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua
          </button>
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 text-[11px] rounded-lg font-medium transition-all ${
                selectedCategory === cat
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filteredMetrics.map((kpi) => (
          <div 
            key={kpi.id}
            className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-amber-300 transition-all flex flex-col justify-between"
          >
            <div>
              {/* Header Badges */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                    {kpi.code}
                  </span>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${getCategoryBadgeClass(kpi.category)}`}>
                    {kpi.category}
                  </span>
                  <span className="text-[10px] font-medium px-2 py-0.5 rounded bg-slate-100 text-slate-600 flex items-center gap-1">
                    <Clock className="w-3 h-3 text-slate-400" />
                    {kpi.frequency}
                  </span>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-amber-900 shrink-0">
                  <Percent className="w-3.5 h-3.5 text-amber-600" />
                  <span className="text-xs font-bold font-mono">Bobot: {kpi.weight}%</span>
                </div>
              </div>

              {/* Title & Role */}
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                {getRoleTitle(kpi.roleId)}
              </div>
              <h3 className="text-base font-bold text-slate-900 mt-0.5 leading-snug">
                {kpi.name}
              </h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                {kpi.description}
              </p>

              {/* Formula & Target Box */}
              <div className="mt-3.5 bg-slate-50/90 rounded-xl p-3 border border-slate-200 space-y-2">
                <div>
                  <div className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1">
                    <Scale className="w-3 h-3 text-amber-600" />
                    Formula Matematis Terukur:
                  </div>
                  <div className="text-xs font-mono font-semibold text-blue-900 bg-white p-2 rounded-lg border border-blue-100 mt-1 break-words">
                    {kpi.formula}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <div>
                    <span className="text-[10px] text-slate-500 font-medium">Target Operasional:</span>
                    <div className="text-xs font-bold text-emerald-700 font-mono mt-0.5">
                      {kpi.target}
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 font-medium">Satuan Ukur:</span>
                    <div className="text-xs font-bold text-slate-800 font-mono mt-0.5">
                      {kpi.unit}
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Verification Source & Escalation */}
              <div className="mt-3 space-y-1.5 text-[11px]">
                <div className="flex items-start gap-1.5 text-slate-600">
                  <Database className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span><strong>Sumber Bukti:</strong> {kpi.dataSource}</span>
                </div>
                <div className="flex items-start gap-1.5 text-amber-900 bg-amber-50/60 p-2 rounded-lg border border-amber-200/50">
                  <AlertCircle className="w-3.5 h-3.5 text-amber-700 shrink-0 mt-0.5" />
                  <span><strong>Tindakan Eskalasi:</strong> {kpi.escalationRule}</span>
                </div>
              </div>
            </div>

            {/* Benchmark Footer */}
            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px]">
              <div className="flex items-center gap-3">
                <span className="text-emerald-700 flex items-center gap-1">
                  <CheckCircle className="w-3 h-3" /> Baik: <strong>{kpi.benchmarkGood}</strong>
                </span>
                <span className="text-rose-700 flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" /> Kurang: <strong>{kpi.benchmarkPoor}</strong>
                </span>
              </div>

              <button
                onClick={() => {
                  setActiveTestMetric(kpi);
                  setTestInputA(100);
                  setTestInputB(100);
                }}
                className="flex items-center gap-1 text-[11px] font-semibold text-amber-700 hover:text-amber-800 bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-all"
              >
                <Calculator className="w-3 h-3" />
                <span>Simulasi Hitung</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMetrics.length === 0 && (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center text-slate-500">
          <Info className="w-8 h-8 text-slate-400 mx-auto mb-2" />
          <p className="text-sm font-semibold">Tidak ada metrik KPI yang sesuai dengan kriteria filter.</p>
          <button
            onClick={() => {
              setSelectedRole('all');
              setSelectedCategory('all');
              setSearchQuery('');
            }}
            className="mt-3 text-xs text-amber-700 font-semibold underline"
          >
            Reset Semua Filter
          </button>
        </div>
      )}

      {/* Interactive Simulation Modal */}
      {activeTestMetric && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400">
                  {activeTestMetric.code}
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  Simulasi Hitung: {activeTestMetric.name}
                </h3>
                <p className="text-xs text-slate-500">
                  Formula: {activeTestMetric.formula}
                </p>
              </div>
              <button
                onClick={() => setActiveTestMetric(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-3">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Parameter 1 (Nilai Aktual / Realisasi):
                </label>
                <input
                  type="number"
                  value={testInputA}
                  onChange={(e) => setTestInputA(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Parameter 2 (Target / Dasar Perhitungan):
                </label>
                <input
                  type="number"
                  value={testInputB}
                  onChange={(e) => setTestInputB(Number(e.target.value))}
                  className="w-full px-3 py-1.5 text-xs font-mono rounded-lg border border-slate-200 bg-white"
                />
              </div>

              <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-500">Estimasi Pencapaian:</span>
                  <div className="text-lg font-bold font-mono text-blue-700">
                    {testInputB > 0 ? ((testInputA / testInputB) * 100).toFixed(2) : 0}%
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-500">Target Resmi:</span>
                  <div className="text-sm font-bold font-mono text-emerald-700">
                    {activeTestMetric.target}
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs text-slate-500 bg-amber-50 p-3 rounded-lg border border-amber-200 text-amber-900">
              <strong>Aturan Penilaian:</strong> Hasil dihitung secara transparan dan diverifikasi dengan {activeTestMetric.dataSource}.
            </div>

            <button
              onClick={() => setActiveTestMetric(null)}
              className="w-full py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-800 transition-all"
            >
              Tutup Simulasi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
