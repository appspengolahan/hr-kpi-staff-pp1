import React from 'react';
import { 
  Building2, 
  Award, 
  Activity, 
  Calculator, 
  Users, 
  ShieldCheck, 
  Layers, 
  ChevronLeft, 
  ChevronRight, 
  Sun, 
  Moon, 
  Maximize, 
  Minimize, 
  Download, 
  Workflow, 
  Terminal, 
  FileText,
  UserCheck,
  BrainCircuit,
  Bot
} from 'lucide-react';

export type UserRole = 
  | 'project_manager' 
  | 'site_engineer' 
  | 'vendor_mandor' 
  | 'client_qc' 
  | 'admin_bos';

interface SidebarProps {
  activeTab: 'kpi_matrix' | 'org_structure' | 'monitoring_harian' | 'kpi_evaluator' | 'staff_rotation' | 'data_integration' | 'executive_summary' | 'ai_council';
  setActiveTab: (tab: 'kpi_matrix' | 'org_structure' | 'monitoring_harian' | 'kpi_evaluator' | 'staff_rotation' | 'data_integration' | 'executive_summary' | 'ai_council') => void;
  isCollapsed: boolean;
  setIsCollapsed: (collapsed: boolean) => void;
  userRole: UserRole;
  setUserRole: (role: UserRole) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  isFullscreen: boolean;
  onToggleFullscreen: () => void;
  onOpenSwitchBoard: () => void;
  onOpenGasCenter: () => void;
  onOpenInstallModal: () => void;
  onOpenReport: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isCollapsed,
  setIsCollapsed,
  userRole,
  setUserRole,
  darkMode,
  setDarkMode,
  isFullscreen,
  onToggleFullscreen,
  onOpenSwitchBoard,
  onOpenGasCenter,
  onOpenInstallModal,
  onOpenReport
}) => {
  const navItems = [
    {
      id: 'monitoring_harian' as const,
      label: 'Monitoring Harian Real-Time',
      shortLabel: 'Monitoring',
      icon: Activity,
      badge: 'Live',
      badgeColor: 'bg-emerald-500 text-slate-950 font-bold'
    },
    {
      id: 'ai_council' as const,
      label: 'Dewan 6 Karyawan AI',
      shortLabel: 'Karyawan AI',
      icon: BrainCircuit,
      badge: '6 AI Staff',
      badgeColor: 'bg-indigo-500/20 text-indigo-300 font-bold'
    },
    {
      id: 'org_structure' as const,
      label: 'Struktur & Jobdesc Staf',
      shortLabel: 'Struktur',
      icon: Building2,
      badge: '13 Jabatan',
      badgeColor: 'bg-amber-500/20 text-amber-300'
    },
    {
      id: 'kpi_matrix' as const,
      label: 'Kamus & Matriks KPI Terukur',
      shortLabel: 'Matriks KPI',
      icon: Award,
      badge: '67 SOP',
      badgeColor: 'bg-blue-500/20 text-blue-300'
    },
    {
      id: 'kpi_evaluator' as const,
      label: 'Kalkulator & Evaluasi Kinerja',
      shortLabel: 'Kalkulator',
      icon: Calculator,
      badge: '32 Staf',
      badgeColor: 'bg-purple-500/20 text-purple-300'
    },
    {
      id: 'staff_rotation' as const,
      label: 'Rotasi & Pejabat Staf Dinamis',
      shortLabel: 'Rotasi',
      icon: Users,
      badge: 'HR Staff',
      badgeColor: 'bg-rose-500/20 text-rose-300'
    },
    {
      id: 'data_integration' as const,
      label: 'Integrasi Data & IoT Pabrik',
      shortLabel: 'Integrasi',
      icon: ShieldCheck,
      badge: '7 Sumber',
      badgeColor: 'bg-emerald-500/20 text-emerald-300'
    },
    {
      id: 'executive_summary' as const,
      label: 'Panduan Manager Operasional',
      shortLabel: 'Panduan',
      icon: Layers,
      badge: 'SK 01/2024',
      badgeColor: 'bg-slate-700 text-slate-300'
    }
  ];

  const roleLabels: Record<UserRole, { title: string; desc: string }> = {
    project_manager: { title: 'Project Manager (Manajer Operasional)', desc: 'Akses Penuh Divisi 1' },
    site_engineer: { title: 'Site Engineer (Kepala Pengolahan)', desc: 'Lini Mesin & QC' },
    vendor_mandor: { title: 'Vendor / Mandor Pengolahan', desc: 'Batch & Gudang' },
    client_qc: { title: 'Client / QC & Audit Perusahaan', desc: 'Standar Mutu' },
    admin_bos: { title: 'Admin (Administrasi BOS & Keuangan)', desc: 'Cut-off & Laporan' }
  };

  return (
    <>
      {/* Desktop & Tablet Sidebar - Sticky / Fixed on the Left */}
      <aside 
        className={`hidden md:flex flex-col bg-slate-900 dark:bg-slate-950 border-r border-slate-800 text-slate-300 transition-all duration-300 ease-in-out shrink-0 select-none z-30 sticky top-0 h-screen shadow-2xl ${
          isCollapsed ? 'w-20' : 'w-72'
        }`}
      >
        {/* Sidebar Header Brand */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-500 via-amber-600 to-amber-700 shadow-md ring-2 ring-amber-400/30 shrink-0">
              <span className="font-extrabold text-lg tracking-tighter text-slate-950 font-mono">153</span>
              <span className="absolute -bottom-1 -right-1 text-[8px] font-bold bg-red-600 text-white px-1 py-0.2 rounded uppercase">BK</span>
            </div>
            {!isCollapsed && (
              <div className="truncate">
                <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 block truncate">
                  PT. BATU KARANG 153
                </span>
                <h2 className="text-xs font-black text-white truncate font-serif">
                  DIVISI PRODUKSI I
                </h2>
                <span className="text-[9px] text-slate-400 truncate block">
                  (PENGOLAHAN)
                </span>
              </div>
            )}
          </div>

          {/* Collapse / Expand Toggle Button */}
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title={isCollapsed ? 'Perlebar Sidebar' : 'Kecilkan Mini Sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* RBAC Role Selector Box */}
        {!isCollapsed ? (
          <div className="p-3 border-b border-slate-800/80 bg-slate-950/40 shrink-0">
            <div className="flex items-center justify-between mb-1.5 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 font-semibold uppercase tracking-wider">
                <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                Role Akses (RBAC)
              </span>
              <span className="text-[9px] text-emerald-400 bg-emerald-950/60 px-1.5 py-0.2 rounded border border-emerald-500/20 font-mono">
                Aktif
              </span>
            </div>
            <select
              value={userRole}
              onChange={(e) => setUserRole(e.target.value as UserRole)}
              className="w-full bg-slate-800 text-slate-200 text-xs rounded-xl px-2.5 py-1.5 border border-slate-700 focus:outline-none focus:border-amber-400 transition cursor-pointer"
            >
              <option value="project_manager">Project Manager (Manajer Ops)</option>
              <option value="site_engineer">Site Engineer (Ka. Pengolahan)</option>
              <option value="vendor_mandor">Vendor / Mandor Lapangan</option>
              <option value="client_qc">Client / Tim QC &amp; Auditor</option>
              <option value="admin_bos">Admin (Administrasi BOS &amp; Keu)</option>
            </select>
            <p className="text-[10px] text-slate-400 mt-1 truncate">
              {roleLabels[userRole].desc}
            </p>
          </div>
        ) : (
          <div className="p-2 border-b border-slate-800 flex justify-center shrink-0" title={`Role: ${roleLabels[userRole].title}`}>
            <div className="w-8 h-8 rounded-lg bg-slate-800 text-amber-400 flex items-center justify-center text-xs">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
        )}

        {/* Navigation Items (Scrollable independently) */}
        <nav className="flex-1 overflow-y-auto p-3 space-y-1.5 no-scrollbar">
          <div className={`text-[10px] uppercase font-bold tracking-wider text-slate-500 px-2 py-1 ${isCollapsed ? 'text-center' : ''}`}>
            {isCollapsed ? 'MENU' : 'NAVIGASI UTAMA'}
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all relative group ${
                  isActive
                    ? 'bg-amber-500 text-slate-950 shadow-md font-bold'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                } ${isCollapsed ? 'justify-center px-0' : ''}`}
                title={isCollapsed ? item.label : undefined}
              >
                <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-slate-950' : 'text-slate-400 group-hover:text-amber-400'}`} />
                {!isCollapsed && (
                  <span className="truncate flex-1 text-left">{item.label}</span>
                )}
                {!isCollapsed && item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded font-mono shrink-0 ${item.badgeColor}`}>
                    {item.badge}
                  </span>
                )}
                {isCollapsed && isActive && (
                  <span className="absolute right-1 w-1.5 h-1.5 rounded-full bg-slate-950"></span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Quick Utility Tools in Sidebar */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/50 space-y-2 shrink-0">
          {!isCollapsed && (
            <div className="text-[10px] uppercase font-bold tracking-wider text-slate-500 px-1">
              EKOSISTEM PABRIK
            </div>
          )}

          {/* Switch Board Button */}
          <button
            onClick={onOpenSwitchBoard}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Buka Factory App Switch Board"
          >
            <Workflow className="w-4 h-4 text-amber-400 shrink-0" />
            {!isCollapsed && <span className="truncate flex-1 text-left">Switch Board (5 Apps)</span>}
          </button>

          {/* Headless GAS Center Button */}
          <button
            onClick={onOpenGasCenter}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Headless GAS Center & API Testing"
          >
            <Terminal className="w-4 h-4 text-emerald-400 shrink-0" />
            {!isCollapsed && <span className="truncate flex-1 text-left">Headless GAS Center</span>}
          </button>

          {/* Executive Report Modal Button */}
          <button
            onClick={onOpenReport}
            className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-semibold bg-gradient-to-r from-amber-500/20 to-amber-600/20 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 transition-all ${
              isCollapsed ? 'justify-center px-0' : ''
            }`}
            title="Rekap Matriks Direksi"
          >
            <FileText className="w-4 h-4 text-amber-400 shrink-0" />
            {!isCollapsed && <span className="truncate flex-1 text-left">Rekap Direksi</span>}
          </button>

          {/* System Control Actions: Theme, Fullscreen, Install */}
          <div className="pt-2 border-t border-slate-800/80 flex items-center justify-around text-slate-400">
            {/* Dark / Light Mode Toggle */}
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 hover:text-amber-400 hover:bg-slate-800 rounded-lg transition"
              title={darkMode ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
            >
              {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Fullscreen Toggle */}
            <button
              onClick={onToggleFullscreen}
              className="p-2 hover:text-white hover:bg-slate-800 rounded-lg transition"
              title={isFullscreen ? 'Keluar Layar Penuh' : 'Mode Layar Penuh (Fullscreen)'}
            >
              {isFullscreen ? <Minimize className="w-4 h-4" /> : <Maximize className="w-4 h-4" />}
            </button>

            {/* Install Web App Button */}
            <button
              onClick={onOpenInstallModal}
              className="p-2 hover:text-emerald-400 hover:bg-slate-800 rounded-lg transition"
              title="Install Web App ke PC / HP"
            >
              <Download className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Quick Bottom Navigation Bar for Comfortable Single-Thumb Use */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-slate-900/95 dark:bg-slate-950/95 backdrop-blur-md border-t border-slate-800 px-2 py-1.5 flex items-center justify-around shadow-2xl">
        <button
          onClick={() => setActiveTab('monitoring_harian')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'monitoring_harian' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Activity className="w-4 h-4" />
          <span>Monitor</span>
        </button>

        <button
          onClick={() => setActiveTab('ai_council')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'ai_council' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <BrainCircuit className="w-4 h-4" />
          <span>AI Staff</span>
        </button>

        <button
          onClick={() => setActiveTab('org_structure')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'org_structure' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>Struktur</span>
        </button>

        <button
          onClick={() => setActiveTab('kpi_matrix')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'kpi_matrix' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Award className="w-4 h-4" />
          <span>KPI</span>
        </button>

        <button
          onClick={() => setActiveTab('staff_rotation')}
          className={`flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium transition ${
            activeTab === 'staff_rotation' ? 'text-amber-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>Rotasi</span>
        </button>

        <button
          onClick={onOpenSwitchBoard}
          className="flex flex-col items-center gap-0.5 p-1.5 rounded-lg text-[10px] font-medium text-amber-300"
        >
          <Workflow className="w-4 h-4" />
          <span>Switch</span>
        </button>
      </div>
    </>
  );
};
