import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Sidebar, UserRole } from './components/Sidebar';
import { OrgStructureView } from './components/OrgStructureView';
import { KpiMetricsDirectory } from './components/KpiMetricsDirectory';
import { DailyMonitoringDashboard } from './components/DailyMonitoringDashboard';
import { KpiScorecardCalculator } from './components/KpiScorecardCalculator';
import { ExecutiveGuideView } from './components/ExecutiveGuideView';
import { DataIntegrationView } from './components/DataIntegrationView';
import { StaffRotationManager } from './components/StaffRotationManager';
import { AiCouncilDashboard } from './components/AiCouncilDashboard';
import { AiCouncilManualModal } from './components/AiCouncilManualModal';
import { ExecutiveReportModal } from './components/ExecutiveReportModal';
import { SwitchBoardModal } from './components/SwitchBoardModal';
import { HeadlessGasCenterModal } from './components/HeadlessGasCenterModal';
import { PWAInstallModal } from './components/PWAInstallModal';
import { RoleId, PersonnelAssignment, RotationHistoryItem } from './types';
import { 
  Building2, 
  Award, 
  Activity, 
  Calculator, 
  Layers, 
  ShieldCheck,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

const INITIAL_ASSIGNMENTS: Record<RoleId, PersonnelAssignment> = {
  mgr_ops: { roleId: 'mgr_ops', roleTitle: 'Manajer Operasional Produksi I', currentStaffName: 'Lalu Mahendra Ali Akbar', nik: 'BK-PP1-001', unit: 'Divisi 1 (Pengolahan)', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  ka_pengolahan2: { roleId: 'ka_pengolahan2', roleTitle: 'Plt. Kepala Pengolahan 2 (Cengkeh & Blend)', currentStaffName: 'Andhik Dharmabakti', nik: 'BK-PP1-021', unit: 'Pengolahan 2', status: 'Plt / Pjs', effectiveDate: '2024-09-17', lastAction: 'Promosi', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  ka_admin1: { roleId: 'ka_admin1', roleTitle: 'Kepala Administrasi 1', currentStaffName: 'Agustin Wulandari', nik: 'BK-PP1-003', unit: 'Administrasi', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  ka_gudang_pers1: { roleId: 'ka_gudang_pers1', roleTitle: 'Plt. Kepala Gudang (Kecil) Persediaan', currentStaffName: 'Yulia Wardana', nik: 'BK-PP1-007', unit: 'Gudang Persediaan', status: 'Plt / Pjs', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  mandor_blend: { roleId: 'mandor_blend', roleTitle: 'Mandor Proses Blend', currentStaffName: 'Surya Ning Sasi & Ogik Indrawan', nik: 'BK-PP1-020', unit: 'Proses Blend', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  mandor_tembakau: { roleId: 'mandor_tembakau', roleTitle: 'Mandor Proses Tembakau', currentStaffName: 'Yayan Rudianto & Adi Tri Vianto', nik: 'BK-PP1-014', unit: 'Proses Tembakau', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  mandor_cengkeh: { roleId: 'mandor_cengkeh', roleTitle: 'Mandor Proses Cengkeh', currentStaffName: 'Indah Nurmala & Doni Irwan Himawan', nik: 'BK-PP1-015', unit: 'Proses Cengkeh', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  mandor_gudang_tbk: { roleId: 'mandor_gudang_tbk', roleTitle: 'Mandor Gudang (Kecil) Tembakau & Krosok', currentStaffName: 'Teguh Andrias', nik: 'BK-PP1-005', unit: 'Gudang Tembakau', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  qc_staff: { roleId: 'qc_staff', roleTitle: 'Quality Control (Blend & Tembakau)', currentStaffName: 'Hendri Irawan & Matsukri', nik: 'BK-PP1-016', unit: 'Quality Control', status: 'Aktif', effectiveDate: '2024-09-26', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  admin_blend: { roleId: 'admin_blend', roleTitle: 'Administrasi Proses & Gudang Blend', currentStaffName: 'May Yesi Triana Putri & Brilliant Rachma S', nik: 'BK-PP1-019', unit: 'Administrasi Blend', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  admin_cengkeh: { roleId: 'admin_cengkeh', roleTitle: 'Administrasi Proses & Gudang Cengkeh', currentStaffName: 'Ambar Istiqomah & Adin Tri Wartono', nik: 'BK-PP1-006', unit: 'Administrasi Cengkeh', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  admin_tembakau: { roleId: 'admin_tembakau', roleTitle: 'Administrasi Proses & Gudang Tembakau', currentStaffName: 'Restika & Windi Qiroatul Afrilia', nik: 'BK-PP1-002', unit: 'Administrasi Tembakau', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' },
  mekanik_operator: { roleId: 'mekanik_operator', roleTitle: 'Mekanik & Operator Mesin Produksi', currentStaffName: 'Heri Pribadi & Santoso Sapto Atmojo', nik: 'BK-PP1-028', unit: 'Teknik Mesin', status: 'Aktif', effectiveDate: '2024-09-17', lastAction: 'Rotasi / Rolling', decreeNumber: '01/AS/DRK/BKR/VII/2024' }
};

export default function App() {
  const [activeTab, setActiveTab] = useState<'kpi_matrix' | 'org_structure' | 'monitoring_harian' | 'kpi_evaluator' | 'staff_rotation' | 'data_integration' | 'executive_summary' | 'ai_council'>(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      const validTabs = ['kpi_matrix', 'org_structure', 'monitoring_harian', 'kpi_evaluator', 'staff_rotation', 'data_integration', 'executive_summary', 'ai_council'];
      if (tabParam && validTabs.includes(tabParam)) {
        return tabParam as any;
      }
    }
    return 'ai_council';
  });
  const [selectedRoleId, setSelectedRoleId] = useState<RoleId | undefined>(undefined);
  
  // Navigation & Modals State
  const [isReportOpen, setIsReportOpen] = useState(false);
  const [isSwitchBoardOpen, setIsSwitchBoardOpen] = useState(false);
  const [isGasCenterOpen, setIsGasCenterOpen] = useState(false);
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);
  const [isAiManualOpen, setIsAiManualOpen] = useState(false);

  // Layout & UI State (Persisted)
  const [isCollapsed, setIsCollapsed] = useState<boolean>(() => {
    return localStorage.getItem('pp1_sidebar_collapsed') === 'true';
  });

  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('pp1_theme');
    if (saved) return saved === 'dark';
    return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isFullscreen, setIsFullscreen] = useState(false);

  // Role-Based Access Control
  const [userRole, setUserRole] = useState<UserRole>(() => {
    const savedRole = localStorage.getItem('pp1_user_role');
    return (savedRole as UserRole) || 'project_manager';
  });

  // Master Personnel Assignment
  const [assignments, setAssignments] = useState<Record<RoleId, PersonnelAssignment>>(INITIAL_ASSIGNMENTS);
  const [rotationHistory, setRotationHistory] = useState<RotationHistoryItem[]>([]);

  // Sync collapsed state to localStorage
  const handleSetCollapsed = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
    localStorage.setItem('pp1_sidebar_collapsed', String(collapsed));
  };

  // Sync dark mode to DOM & localStorage
  const handleToggleDarkMode = (dark: boolean) => {
    setDarkMode(dark);
    localStorage.setItem('pp1_theme', dark ? 'dark' : 'light');
    if (dark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Sync user role
  const handleSetUserRole = (role: UserRole) => {
    setUserRole(role);
    localStorage.setItem('pp1_user_role', role);
  };

  // Fullscreen Handler
  const handleToggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().then(() => setIsFullscreen(true)).catch(() => {});
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().then(() => setIsFullscreen(false)).catch(() => {});
      }
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  // Listen to browser navigation / deep links
  useEffect(() => {
    const handlePopState = () => {
      const searchParams = new URLSearchParams(window.location.search);
      const tabParam = searchParams.get('tab');
      const validTabs = ['kpi_matrix', 'org_structure', 'monitoring_harian', 'kpi_evaluator', 'staff_rotation', 'data_integration', 'executive_summary', 'ai_council'];
      if (tabParam && validTabs.includes(tabParam)) {
        setActiveTab(tabParam as any);
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const handleUpdateAssignment = (roleId: RoleId, updated: PersonnelAssignment, historyItem: RotationHistoryItem) => {
    setAssignments(prev => ({ ...prev, [roleId]: updated }));
    setRotationHistory(prev => [historyItem, ...prev]);
  };

  const handleSelectRoleFromOrg = (roleId: RoleId) => {
    setSelectedRoleId(roleId);
    setActiveTab('kpi_matrix');
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex flex-row font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 
        Sticky Mini Sidebar on the Left
        It stays anchored and NEVER scrolls when the user scrolls the right content area!
      */}
      <Sidebar 
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        isCollapsed={isCollapsed}
        setIsCollapsed={handleSetCollapsed}
        userRole={userRole}
        setUserRole={handleSetUserRole}
        darkMode={darkMode}
        setDarkMode={handleToggleDarkMode}
        isFullscreen={isFullscreen}
        onToggleFullscreen={handleToggleFullscreen}
        onOpenSwitchBoard={() => setIsSwitchBoardOpen(true)}
        onOpenGasCenter={() => setIsGasCenterOpen(true)}
        onOpenInstallModal={() => setIsInstallModalOpen(true)}
        onOpenReport={() => setIsReportOpen(true)}
      />

      {/* Main Right Scrollable Content Container */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-x-hidden">
        {/* Top Header */}
        <Header 
          onOpenReport={() => setIsReportOpen(true)}
          onOpenSwitchBoard={() => setIsSwitchBoardOpen(true)}
          onOpenGasCenter={() => setIsGasCenterOpen(true)}
          onOpenInstallModal={() => setIsInstallModalOpen(true)}
          onOpenAiCouncil={() => setActiveTab('ai_council')}
          onOpenAiManual={() => setIsAiManualOpen(true)}
          darkMode={darkMode}
          onToggleDarkMode={() => handleToggleDarkMode(!darkMode)}
          isFullscreen={isFullscreen}
          onToggleFullscreen={handleToggleFullscreen}
          userRole={userRole}
          setUserRole={handleSetUserRole}
        />

        {/* Main Content Area */}
        <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 lg:px-8 py-5 sm:py-7 pb-20 md:pb-7">
          {activeTab === 'org_structure' && (
            <OrgStructureView 
              onSelectRole={handleSelectRoleFromOrg} 
              assignments={assignments} 
            />
          )}

          {activeTab === 'kpi_matrix' && (
            <KpiMetricsDirectory initialRoleId={selectedRoleId} />
          )}

          {activeTab === 'monitoring_harian' && (
            <DailyMonitoringDashboard />
          )}

          {activeTab === 'ai_council' && (
            <AiCouncilDashboard 
              onNavigateToWorksheet={() => setActiveTab('monitoring_harian')}
              onNavigateToMonitoring={() => setActiveTab('monitoring_harian')}
              onNavigateToStaff={() => setActiveTab('staff_rotation')}
            />
          )}

          {activeTab === 'kpi_evaluator' && (
            <KpiScorecardCalculator />
          )}

          {activeTab === 'staff_rotation' && (
            <StaffRotationManager 
              assignments={assignments}
              onUpdateAssignment={handleUpdateAssignment}
              rotationHistory={rotationHistory}
            />
          )}

          {activeTab === 'data_integration' && (
            <DataIntegrationView />
          )}

          {activeTab === 'executive_summary' && (
            <ExecutiveGuideView 
              onGoToKpi={() => setActiveTab('kpi_matrix')}
              onGoToMonitoring={() => setActiveTab('monitoring_harian')}
            />
          )}
        </main>

        {/* Official Footer */}
        <footer className="bg-slate-900 dark:bg-slate-950 border-t border-slate-800 text-slate-400 py-6 text-xs mt-auto">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-7 h-7 rounded-lg bg-amber-500 text-slate-950 font-mono font-bold flex items-center justify-center text-xs">
                153
              </div>
              <div>
                <p className="font-semibold text-slate-200">
                  PT. BATU KARANG &ndash; DIVISI PRODUKSI I (PENGOLAHAN)
                </p>
                <p className="text-[11px] text-slate-500">
                  Sistem Monitoring Operasional, Matriks KPI Terukur &bull; Data Induk 32 Staf HR Resmi
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                SK Direksi: 01/AS/DRK/BKR/VII/2024
              </span>
              <span className="flex items-center gap-1.5 text-slate-400">
                <Clock className="w-3.5 h-3.5 text-amber-400" />
                SOP Cut-off BOS 09:00 WIB
              </span>
              <span className="text-slate-500">
                &copy; 2026/2027 Divisi Operasional
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Official Executive Report Modal */}
      {isReportOpen && (
        <ExecutiveReportModal 
          isOpen={isReportOpen} 
          onClose={() => setIsReportOpen(false)} 
        />
      )}

      {/* Factory App Switch Board Modal */}
      {isSwitchBoardOpen && (
        <SwitchBoardModal
          isOpen={isSwitchBoardOpen}
          onClose={() => setIsSwitchBoardOpen(false)}
        />
      )}

      {/* Headless GAS Center Modal */}
      {isGasCenterOpen && (
        <HeadlessGasCenterModal
          isOpen={isGasCenterOpen}
          onClose={() => setIsGasCenterOpen(false)}
        />
      )}

      {/* PWA Install Modal */}
      {isInstallModalOpen && (
        <PWAInstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />
      )}

      {/* Official AI Council Manual & PDF Modal */}
      {isAiManualOpen && (
        <AiCouncilManualModal 
          isOpen={isAiManualOpen} 
          onClose={() => setIsAiManualOpen(false)} 
        />
      )}
    </div>
  );
}
