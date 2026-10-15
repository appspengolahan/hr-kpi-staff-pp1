import React, { useState } from 'react';
import { POSITIONS_DATA } from '../data/jobDescriptions';
import { HR_STAFF_MASTER_DATA, HrStaffRecord } from '../data/hrStaffMasterData';
import { PositionInfo, RoleId, PersonnelAssignment } from '../types';
import { 
  Users, 
  ShieldAlert, 
  GitBranch, 
  ChevronRight, 
  FileCheck2, 
  ArrowRightLeft, 
  Info,
  CheckCircle2, 
  Clock, 
  Sparkles,
  Search,
  ExternalLink,
  ShieldCheck,
  Building2,
  Filter,
  Phone,
  Mail,
  UserCheck
} from 'lucide-react';

interface OrgStructureViewProps {
  onSelectRole: (roleId: RoleId) => void;
  assignments?: Record<RoleId, PersonnelAssignment>;
}

export const OrgStructureView: React.FC<OrgStructureViewProps> = ({ onSelectRole, assignments }) => {
  const [activeView, setActiveView] = useState<'hierarchy' | 'staff_directory'>('hierarchy');
  const [selectedRole, setSelectedRole] = useState<PositionInfo>(POSITIONS_DATA[0]);
  const [staffSearchQuery, setStaffSearchQuery] = useState('');
  const [staffFilterSekup, setStaffFilterSekup] = useState<'Semua' | 'Operasional' | 'Administrasi'>('Semua');
  const [staffFilterStatus, setStaffFilterStatus] = useState<'Semua' | 'TETAP' | 'PKWT'>('Semua');

  const getIncumbentName = (roleId: RoleId, defaultName?: string) => {
    if (assignments && assignments[roleId]) {
      return assignments[roleId].currentStaffName;
    }
    return defaultName || 'Pejabat Ditugaskan';
  };

  const getStaffForRole = (roleId: RoleId): HrStaffRecord[] => {
    return HR_STAFF_MASTER_DATA.filter(s => s.mappedRoleId === roleId);
  };

  const filteredStaffList = HR_STAFF_MASTER_DATA.filter(staff => {
    const matchesSearch = 
      staff.nama.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.nip.toLowerCase().includes(staffSearchQuery.toLowerCase()) ||
      staff.jabatan.toLowerCase().includes(staffSearchQuery.toLowerCase());
    
    const matchesSekup = staffFilterSekup === 'Semua' || staff.sekup === staffFilterSekup;
    const matchesStatus = staffFilterStatus === 'Semua' || 
      (staffFilterStatus === 'TETAP' ? staff.status === 'TETAP' : staff.status.startsWith('PKWT'));

    return matchesSearch && matchesSekup && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Intro Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 rounded-2xl border border-slate-700/80 shadow-lg text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                Struktur Organisasi &amp; Job Description
              </span>
              <span className="text-xs text-amber-200/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                PT. BATU KARANG 153
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white font-serif uppercase">
              DIVISI PRODUKSI I (PENGOLAHAN)
            </h2>
            <p className="text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Struktur resmi pengolahan seluruh bahan baku (Tembakau, Krosok, Cengkeh, Saos &amp; Blend) berbasis Ketetapan SK No: 01/AS/DRK/BKR/VII/2024. Sumber data personil diisolir khusus Staf &amp; Karyawan terverifikasi dari Database HR Staff PP1.
            </p>
          </div>
          
          <div className="bg-slate-800/90 p-4 rounded-xl border border-amber-500/30 flex flex-col justify-center min-w-[280px]">
            <div className="text-xs text-slate-400 font-medium">Single Source of Truth:</div>
            <div className="text-xs font-bold text-amber-400 font-mono mt-0.5 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>32 Staf &amp; Karyawan Terdaftar</span>
            </div>
            <div className="text-[11px] text-slate-300 mt-1.5 flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span>Data Pekerja Harian Diisolir Terpisah</span>
            </div>
          </div>
        </div>
      </div>

      {/* View Switcher Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveView('hierarchy')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeView === 'hierarchy'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>Bagan Hirarki Struktural (13 Posisi Kunci)</span>
        </button>

        <button
          onClick={() => setActiveView('staff_directory')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeView === 'staff_directory'
              ? 'bg-amber-500 text-slate-950 shadow-sm'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Direktori 32 Staf HR (Single Source of Truth)</span>
          <span className="bg-slate-900 text-amber-300 text-[10px] px-1.5 py-0.2 rounded-full font-mono">
            32
          </span>
        </button>
      </div>

      {activeView === 'hierarchy' ? (
        <>
          {/* Visual Organizational Hierarchy Tree */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <GitBranch className="w-5 h-5 text-amber-600" />
                  Bagan Hirarki Operasional &amp; Koordinasi Lintas Sekup
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Klik pada jabatan untuk melihat rincian tugas pokok, wewenang resmi, serta klausul tanggung jawab ganda.
                </p>
              </div>
              <span className="text-xs font-medium px-2.5 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200">
                13 Gugus Tugas Staf
              </span>
            </div>

            {/* Level 1: Manager Operasional */}
            <div className="flex justify-center mb-6">
              <button
                onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'mgr_ops')!)}
                className={`group relative p-4 rounded-xl border-2 transition-all w-full max-w-lg text-left shadow-md ${
                  selectedRole.id === 'mgr_ops'
                    ? 'border-amber-500 bg-amber-50/90 ring-4 ring-amber-500/10'
                    : 'border-slate-300 bg-gradient-to-r from-slate-900 to-slate-800 text-white hover:border-amber-400'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase font-mono">
                      Level 1 - Top Divisi
                    </span>
                    <span className={`text-xs ${selectedRole.id === 'mgr_ops' ? 'text-amber-800' : 'text-slate-300'}`}>
                      NIP: BK-PP1-001
                    </span>
                  </div>
                  <ChevronRight className={`w-4 h-4 ${selectedRole.id === 'mgr_ops' ? 'text-amber-600' : 'text-amber-400'}`} />
                </div>
                <div className={`text-lg font-bold mt-1 ${selectedRole.id === 'mgr_ops' ? 'text-slate-900' : 'text-white'}`}>
                  Manajer Operasional Produksi I
                </div>
                <div className={`text-xs font-semibold ${selectedRole.id === 'mgr_ops' ? 'text-amber-700' : 'text-amber-400'}`}>
                  Pejabat: {getIncumbentName('mgr_ops', 'Lalu Mahendra Ali Akbar')}
                </div>
                <p className={`text-xs mt-1 line-clamp-2 ${selectedRole.id === 'mgr_ops' ? 'text-slate-600' : 'text-slate-300'}`}>
                  Pengendali menyeluruh disiplin, efisiensi bahan &amp; susut molen, mutu rasa blend, dan koordinasi dengan Direktur.
                </p>
              </button>
            </div>

            {/* Level 2: Jajaran Kepala Bagian / Sekup (Level 15 & 9) */}
            <div className="relative mb-6">
              <div className="text-center text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Level 2: Jajaran Kepala Sekup &amp; Administrasi
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                {/* Plt. Kepala Pengolahan 2 */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'ka_pengolahan2')!)}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    selectedRole.id === 'ka_pengolahan2'
                      ? 'border-blue-600 bg-blue-50/90 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50 hover:border-blue-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                      Level 15 - Sekup Operasional
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">BK-PP1-021</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">Plt. Kepala Pengolahan 2 (Cengkeh &amp; Blend)</div>
                  <div className="text-xs font-semibold text-blue-700 mt-0.5">
                    {getIncumbentName('ka_pengolahan2', 'Andhik Dharmabakti')}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Teknis molen blend &amp; rajang cengkeh, formula pruf, pencegahan susut tidak wajar, &amp; kebersihan spuyer.
                  </p>
                </button>

                {/* Kepala Administrasi 1 */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'ka_admin1')!)}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    selectedRole.id === 'ka_admin1'
                      ? 'border-purple-600 bg-purple-50/90 ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50 hover:border-purple-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-purple-100 text-purple-800">
                      Level 15 A - Sekup Administrasi
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">BK-PP1-003</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">Kepala Administrasi 1</div>
                  <div className="text-xs font-semibold text-purple-700 mt-0.5">
                    {getIncumbentName('ka_admin1', 'Agustin Wulandari')}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Validasi BOS, Laporan Akuntansi (Deadline Cut-Off 09:00 WIB), pengawasan dokumen Bea Cukai CK-5.
                  </p>
                </button>

                {/* Plt. Kepala Gudang Persediaan 1 */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'ka_gudang_pers1')!)}
                  className={`p-3.5 rounded-xl border-2 text-left transition-all ${
                    selectedRole.id === 'ka_gudang_pers1'
                      ? 'border-amber-600 bg-amber-50/90 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-slate-50 hover:border-amber-300 hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800">
                      Level 9 A - Gudang Persediaan
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">BK-PP1-007</span>
                  </div>
                  <div className="font-bold text-slate-900 text-sm mt-1">Plt. Kepala Gudang (Kecil) Persediaan</div>
                  <div className="text-xs font-semibold text-amber-700 mt-0.5">
                    {getIncumbentName('ka_gudang_pers1', 'Yulia Wardana')}
                  </div>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2">
                    Pengamanan fisik persediaan bahan (Tembakau, Krosok, Cengkeh, Blend), akurasi timbang, &amp; zero discrepancy.
                  </p>
                </button>
              </div>
            </div>

            {/* Level 3: Mandor Lini Operasional & Gudang */}
            <div className="mb-6">
              <div className="text-center text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Level 3: Mandor Lini Operasional &amp; Gudang
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Mandor Blend */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'mandor_blend')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'mandor_blend'
                      ? 'border-blue-500 bg-blue-50/80 ring-2 ring-blue-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-blue-700">Mandor Blend</span>
                    <span className="text-[10px] text-slate-400">2 Pejabat</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                    Surya Ning Sasi &amp; Ogik Indrawan
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Pengawasan mesin molen, timer putar, spuyer semprot saos, &amp; timbang koli.</div>
                </button>

                {/* Mandor Tembakau */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'mandor_tembakau')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'mandor_tembakau'
                      ? 'border-amber-500 bg-amber-50/80 ring-2 ring-amber-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-amber-700">Mandor Tembakau</span>
                    <span className="text-[10px] text-slate-400">2 Pejabat</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                    Yayan Rudianto &amp; Adi Tri Vianto
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Pengawasan mesin rajang tembakau &amp; krosok, susut rajang, serta penjemuran.</div>
                </button>

                {/* Mandor Cengkeh */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'mandor_cengkeh')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'mandor_cengkeh'
                      ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-emerald-700">Mandor Cengkeh</span>
                    <span className="text-[10px] text-slate-400">2 Pejabat</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                    Indah Nurmala &amp; Doni Irwan Himawan
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Pengawasan mesin rajang cengkeh, larutan saos, kadar air, &amp; pengeringan.</div>
                </button>

                {/* Mandor Gudang Tembakau */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'mandor_gudang_tbk')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'mandor_gudang_tbk'
                      ? 'border-slate-700 bg-slate-100 ring-2 ring-slate-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold text-slate-700">Mandor Gudang</span>
                    <span className="text-[10px] text-slate-400">1 Pejabat</span>
                  </div>
                  <div className="font-semibold text-slate-900 text-xs sm:text-sm mt-0.5">
                    Teguh Andrias
                  </div>
                  <div className="text-[11px] text-slate-500 mt-0.5">Penimbangan fisik vs surat jalan gudang, tata letak FIFO karung tembakau.</div>
                </button>
              </div>
            </div>

            {/* Level 4: Staf Fungsional Teknis, QC & Administrasi */}
            <div>
              <div className="text-center text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">
                Level 4: Staf Fungsional Teknis, Quality Control &amp; Administrasi
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                {/* QC Staff */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'qc_staff')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'qc_staff'
                      ? 'border-emerald-500 bg-emerald-50/80 ring-2 ring-emerald-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-emerald-700 block">Quality Control</span>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5 truncate">
                    Hendri Irawan, Matsukri dkk
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">5 Staf QC (Kadar air, rasa blend, &amp; stopline).</div>
                </button>

                {/* Mekanik & Operator */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'mekanik_operator')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'mekanik_operator'
                      ? 'border-cyan-500 bg-cyan-50/80 ring-2 ring-cyan-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-cyan-700 block">Mekanik &amp; Operator</span>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5 truncate">
                    Heri Pribadi, Santoso dkk
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">6 Operator (Boiler, RC4, KT2, Mesin Primery).</div>
                </button>

                {/* Admin Blend */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'admin_blend')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'admin_blend'
                      ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-purple-700 block">Admin Blend</span>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5 truncate">
                    May Yesi, Junita, Brilliant
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">3 Staf Admin (Input BOS blend &amp; gudang blend).</div>
                </button>

                {/* Admin Cengkeh */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'admin_cengkeh')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'admin_cengkeh'
                      ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-purple-700 block">Admin Cengkeh</span>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5 truncate">
                    Ambar I. &amp; Adin Tri W.
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">2 Staf Admin (Rekap proses &amp; gudang cengkeh).</div>
                </button>

                {/* Admin Tembakau */}
                <button
                  onClick={() => setSelectedRole(POSITIONS_DATA.find(p => p.id === 'admin_tembakau')!)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedRole.id === 'admin_tembakau'
                      ? 'border-purple-500 bg-purple-50/80 ring-2 ring-purple-500/20'
                      : 'border-slate-200 bg-slate-50/60 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <span className="text-[10px] font-bold text-purple-700 block">Admin Tembakau</span>
                  <div className="font-semibold text-slate-900 text-xs mt-0.5 truncate">
                    Restika, Windi, Nikmatul
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">3 Staf Admin (Rekap tembakau &amp; gudang kecil).</div>
                </button>
              </div>
            </div>
          </div>

          {/* Selected Role Detailed Inspector */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="bg-slate-900 p-5 text-white flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-500 text-slate-950 uppercase">
                    {selectedRole.id.toUpperCase()}
                  </span>
                  <span className="text-xs text-slate-400">
                    Atasan Langsung: <strong className="text-slate-200">{selectedRole.directSupervisor}</strong>
                  </span>
                </div>
                <h3 className="text-xl font-bold text-white mt-1">
                  {selectedRole.title}
                </h3>
                <div className="text-xs text-amber-300 mt-0.5">
                  Pejabat Aktif: {getIncumbentName(selectedRole.id, selectedRole.incumbentName)}
                </div>
              </div>

              <button
                onClick={() => onSelectRole(selectedRole.id)}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs hover:bg-amber-400 transition-all self-start md:self-center shadow-md"
              >
                <span>Lihat Kamus KPI Jabatan Ini</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Sekup & Ringkasan */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Sekup &amp; Ruang Lingkup Operasional:
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {selectedRole.operationalScope}
                  </p>
                </div>

                <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
                  <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
                    Ringkasan Tugas Pokok:
                  </div>
                  <p className="text-sm font-medium text-slate-800 leading-relaxed">
                    {selectedRole.summary}
                  </p>
                </div>
              </div>

              {/* Pejabat yang Terdaftar di Posisi Ini */}
              <div className="bg-amber-50/60 p-4 rounded-xl border border-amber-200">
                <div className="text-xs font-bold text-amber-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <UserCheck className="w-4 h-4 text-amber-700" />
                  <span>Daftar Staf HR Aktif pada Jabatan Ini ({getStaffForRole(selectedRole.id).length} Personil Terdata):</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                  {getStaffForRole(selectedRole.id).map(s => (
                    <div key={s.nip} className="bg-white p-2.5 rounded-lg border border-amber-200/80 shadow-xs flex items-center justify-between text-xs">
                      <div>
                        <div className="font-bold text-slate-900">{s.nama}</div>
                        <div className="text-[10px] text-slate-500 font-mono">{s.nip} &bull; Level: {s.level}</div>
                      </div>
                      <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                        s.status === 'TETAP' ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {s.status}
                      </span>
                    </div>
                  ))}
                  {getStaffForRole(selectedRole.id).length === 0 && (
                    <div className="text-xs text-slate-500 italic">Data staf mengikuti penugasan rotasi dinamis.</div>
                  )}
                </div>
              </div>

              {/* Rincian Tugas Pokok & Wewenang Resmi */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                    <FileCheck2 className="w-4 h-4 text-emerald-600" />
                    Uraian Tugas Pokok (Job Description)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {selectedRole.duties.map((duty, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-slate-50/70 p-2.5 rounded-lg border border-slate-100">
                        <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed">{duty}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4 text-amber-600" />
                    Wewenang Resmi (SK No: 01/AS/DRK/BKR/VII/2024)
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-600">
                    {selectedRole.authorities.map((auth, idx) => (
                      <li key={idx} className="flex items-start gap-2 bg-amber-50/40 p-2.5 rounded-lg border border-amber-100/60">
                        <span className="w-5 h-5 rounded-full bg-amber-200 text-amber-900 font-bold text-[10px] flex items-center justify-center shrink-0 mt-0.5">
                          {idx + 1}
                        </span>
                        <span className="leading-relaxed text-slate-700 font-medium">{auth}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Klausul Tanggung Jawab Ganda */}
              <div className="bg-red-50/60 border border-red-200 rounded-xl p-4 text-xs">
                <div className="flex items-center gap-2 font-bold text-red-900 mb-1">
                  <ShieldAlert className="w-4 h-4 text-red-600" />
                  <span>Klausul Pertanggungjawaban Ganda (Dual Accountability SK Hal. 2):</span>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-2 text-red-800">
                  <div>
                    <strong>Tanggung Jawab Utama:</strong> {selectedRole.dualAccountability.primaryResponsibility}
                  </div>
                  <div>
                    <strong>Tanggung Jawab Kedua:</strong> {selectedRole.dualAccountability.secondaryResponsibility}
                  </div>
                </div>
                <div className="mt-2 text-[11px] text-red-700/90 italic">
                  <strong>Syarat &amp; Ketentuan:</strong> {selectedRole.dualAccountability.conditions}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        /* Staff Directory - Single Source of Truth from HR App */
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-100">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200 uppercase tracking-wide">
                  Single Source of Truth
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  Sumber: https://hr-staff-pp1-pro-api.vercel.app/
                </span>
              </div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">
                Database 32 Staf &amp; Karyawan Divisi Produksi I (Pengolahan)
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Isolasi penuh data kepegawaian staf. Data pekerja harian telah dipisahkan untuk web apps terpisah.
              </p>
            </div>

            {/* External Link Button */}
            <a
              href="https://hr-staff-pp1-pro-api.vercel.app/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-all self-start md:self-auto"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-600" />
              <span>Buka Web Apps HR Staff</span>
            </a>
          </div>

          {/* Filters Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
            <div className="relative">
              <Search className="w-3.5 h-3.5 absolute left-3 top-3 text-slate-400" />
              <input
                type="text"
                placeholder="Cari Nama, NIP, atau Jabatan..."
                value={staffSearchQuery}
                onChange={(e) => setStaffSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium shrink-0">Sekup:</span>
              <select
                value={staffFilterSekup}
                onChange={(e) => setStaffFilterSekup(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Semua">Semua Sekup ({HR_STAFF_MASTER_DATA.length})</option>
                <option value="Operasional">Operasional ({HR_STAFF_MASTER_DATA.filter(s => s.sekup === 'Operasional').length})</option>
                <option value="Administrasi">Administrasi ({HR_STAFF_MASTER_DATA.filter(s => s.sekup === 'Administrasi').length})</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500 font-medium shrink-0">Status:</span>
              <select
                value={staffFilterStatus}
                onChange={(e) => setStaffFilterStatus(e.target.value as any)}
                className="w-full px-2.5 py-2 bg-white rounded-lg border border-slate-300 text-xs focus:outline-none focus:ring-1 focus:ring-amber-500"
              >
                <option value="Semua">Semua Status</option>
                <option value="TETAP">TETAP ({HR_STAFF_MASTER_DATA.filter(s => s.status === 'TETAP').length})</option>
                <option value="PKWT">PKWT Kontrak ({HR_STAFF_MASTER_DATA.filter(s => s.status.startsWith('PKWT')).length})</option>
              </select>
            </div>
          </div>

          {/* Staff Table */}
          <div className="overflow-x-auto border border-slate-200 rounded-xl">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-900 text-white font-semibold">
                <tr>
                  <th className="py-2.5 px-3">No</th>
                  <th className="py-2.5 px-3">NIP</th>
                  <th className="py-2.5 px-3">Nama Lengkap</th>
                  <th className="py-2.5 px-3">Jabatan Resmi (HR Single Source)</th>
                  <th className="py-2.5 px-3">Level</th>
                  <th className="py-2.5 px-3">Sekup</th>
                  <th className="py-2.5 px-3">Status</th>
                  <th className="py-2.5 px-3">Kontak</th>
                  <th className="py-2.5 px-3 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredStaffList.map((staff, idx) => (
                  <tr key={staff.id} className="hover:bg-amber-50/50 transition-colors">
                    <td className="py-2.5 px-3 text-slate-400 font-mono">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-mono font-bold text-slate-800">{staff.nip}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{staff.nama}</td>
                    <td className="py-2.5 px-3 text-slate-700">{staff.jabatan}</td>
                    <td className="py-2.5 px-3 font-mono text-slate-600">{staff.level}</td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        staff.sekup === 'Operasional' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}>
                        {staff.sekup}
                      </span>
                    </td>
                    <td className="py-2.5 px-3">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        staff.status === 'TETAP' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {staff.status}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 text-slate-500 text-[11px]">
                      <div>{staff.email}</div>
                      <div className="text-[10px] text-slate-400">{staff.telp}</div>
                    </td>
                    <td className="py-2.5 px-3 text-right">
                      <button
                        onClick={() => {
                          const targetPos = POSITIONS_DATA.find(p => p.id === staff.mappedRoleId) || POSITIONS_DATA[0];
                          setSelectedRole(targetPos);
                          setActiveView('hierarchy');
                        }}
                        className="px-2.5 py-1 rounded bg-slate-100 hover:bg-amber-500 hover:text-slate-950 text-slate-700 text-[10px] font-bold transition-all"
                      >
                        Lihat Jobdesc
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
