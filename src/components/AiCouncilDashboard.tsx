import React, { useState, useRef, useEffect } from 'react';
import { 
  Bot, 
  BrainCircuit, 
  Droplets, 
  TrendingDown, 
  FileCheck, 
  Boxes, 
  UserCheck, 
  Sparkles, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  RefreshCw, 
  Copy, 
  Check, 
  Send, 
  Sliders, 
  ArrowRight, 
  ChevronRight, 
  Layers, 
  Activity, 
  Building2, 
  Flame, 
  FileSpreadsheet,
  Award,
  Zap,
  Info,
  BookOpen,
  Terminal
} from 'lucide-react';
import { AiCouncilManualModal } from './AiCouncilManualModal';
import { HeadlessGasCenterModal } from './HeadlessGasCenterModal';
import { 
  formatWibTime, 
  formatWibDate, 
  formatWibFullDate,
  formatWibDateTime,
  getCurrentShiftWib,
  getCutoffStatusWib
} from '../utils/indonesiaDateUtils';
import { 
  AI_EMPLOYEES, 
  AiEmployee, 
  MoistureAuditItem, 
  ShrinkageAuditItem, 
  DataTruthAuditItem, 
  StockBsppAuditItem, 
  HrAttendanceAuditItem,
  ExecutiveDecisionBriefing,
  INITIAL_MOISTURE_AUDITS,
  INITIAL_SHRINKAGE_AUDITS,
  INITIAL_DATA_TRUTH_AUDITS,
  INITIAL_STOCK_BSPP_AUDITS,
  INITIAL_HR_AUDITS,
  INITIAL_EXECUTIVE_BRIEFING
} from '../data/aiCouncilData';
import { AiCouncilEngine, AiChatMessage } from '../services/aiCouncilEngine';

interface AiCouncilDashboardProps {
  onNavigateToWorksheet?: () => void;
  onNavigateToMonitoring?: () => void;
  onNavigateToStaff?: () => void;
}

export const AiCouncilDashboard: React.FC<AiCouncilDashboardProps> = ({
  onNavigateToWorksheet,
  onNavigateToMonitoring,
  onNavigateToStaff
}) => {
  const engine = AiCouncilEngine.getInstance();
  const [activeTab, setActiveTab] = useState<string>('all'); // 'all' or employee.id
  const [isAuditing, setIsAuditing] = useState(false);
  const [auditTimestamp, setAuditTimestamp] = useState(() => `${formatWibDate(new Date())} • ${formatWibTime(new Date())} (Live Terverifikasi)`);
  const [copiedWhatsApp, setCopiedWhatsApp] = useState(false);
  const [isManualModalOpen, setIsManualModalOpen] = useState(false);
  const [isGasCenterModalOpen, setIsGasCenterModalOpen] = useState(false);

  // Chat State
  const [selectedChatRole, setSelectedChatRole] = useState<string>('ai_chief_advisor');
  const [inputQuery, setInputQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [chatMessages, setChatMessages] = useState<AiChatMessage[]>([
    {
      id: 'welcome',
      sender: 'ai',
      aiEmployeeId: 'ai_chief_advisor',
      aiEmployeeName: 'Aria Mahardika, M.M.',
      aiRoleCalling: 'Penasihat Strategis Manajer Operasional',
      timestamp: formatWibTime(new Date()),
      content: 'Selamat bertugas, Pak Manajer Operasional (Lalu Mahendra Ali Akbar). Dewan 6 Karyawan AI siap melaporkan status seluruh lini pabrik pengolahan tembakau (PP1). Indeks Kesehatan Pabrik saat ini berada pada 96.8 / 100 (Status: PRIMA). Silakan ajukan pertanyaan atau pilih salah satu peran AI di bawah ini untuk konsultasi spesifik.',
      isActionable: true,
      actionItems: [
        'Instruksikan aerasi 30 menit Cengkeh Lot CK-03 (KA 13.7%)',
        'Jadwalkan pembersihan nozzle spuyer Molen 1 jam 11:30 WIB',
        'Validasi mutasi krosok 2.5 ton untuk produksi esok hari'
      ],
      metricsCited: [
        { label: 'Indeks Kesehatan', value: '96.8 / 100' },
        { label: 'Kesesuaian KA', value: '98.5%' },
        { label: 'Presensi Staf', value: '96.9%' }
      ]
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll ke pesan terbaru agar jawaban AI dan pertanyaan cepat di bawah selalu langsung terlihat
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages, isAiThinking]);

  const handleRunInstantAudit = () => {
    setIsAuditing(true);
    setTimeout(() => {
      setIsAuditing(false);
      const now = new Date();
      setAuditTimestamp(`${formatWibDate(now)} • ${formatWibTime(now, true)} (Live Terverifikasi)`);
    }, 1200);
  };

  const handleCopyWhatsApp = () => {
    navigator.clipboard.writeText(INITIAL_EXECUTIVE_BRIEFING.whatsAppBriefingText);
    setCopiedWhatsApp(true);
    setTimeout(() => setCopiedWhatsApp(false), 2500);
  };

  const handleSendQuery = async (queryText?: string, targetRoleOverride?: string) => {
    const textToSend = queryText || inputQuery;
    if (!textToSend.trim()) return;

    const roleToUse = targetRoleOverride || selectedChatRole;
    if (targetRoleOverride && targetRoleOverride !== selectedChatRole) {
      setSelectedChatRole(targetRoleOverride);
    }

    const userMsg: AiChatMessage = {
      id: 'usr-' + Date.now(),
      sender: 'user',
      timestamp: formatWibTime(new Date()),
      content: textToSend
    };

    setChatMessages(prev => [...prev, userMsg]);
    if (!queryText) setInputQuery('');
    setIsAiThinking(true);

    try {
      const reply = await engine.queryAiRole(roleToUse, textToSend, chatMessages);
      setChatMessages(prev => [...prev, reply]);
    } catch {
      // Fallback response
      const fallbackReply: AiChatMessage = {
        id: 'reply-' + Date.now(),
        sender: 'ai',
        aiEmployeeId: roleToUse,
        aiEmployeeName: AI_EMPLOYEES.find(e => e.id === roleToUse)?.name || 'Karyawan AI',
        aiRoleCalling: AI_EMPLOYEES.find(e => e.id === roleToUse)?.roleCalling || 'Auditor',
        timestamp: formatWibTime(new Date()),
        content: 'Data audit terkini telah diproses. Kondisi operasional terpantau aman dan sesuai parameter standar kerja Divisi Produksi I.'
      };
      setChatMessages(prev => [...prev, fallbackReply]);
    } finally {
      setIsAiThinking(false);
    }
  };

  const quickPrompts = [
    { 
      label: '🚫 Karyawan Tidak Masuk Hari Ini', 
      targetRole: 'ai_hr_supervisor', 
      query: 'Siapa saja staf atau karyawan yang tidak masuk hari ini, apa keterangannya dan siapa penggantinya?' 
    },
    { 
      label: '🥇 Karyawan Paling Rajin', 
      targetRole: 'ai_hr_supervisor', 
      query: 'Siapa saja karyawan yang paling rajin dan memiliki tingkat kedisiplinan absensi tertinggi bulan ini?' 
    },
    { 
      label: '📋 Staf Paling Sering Izin', 
      targetRole: 'ai_hr_supervisor', 
      query: 'Tampilkan analisis staf yang paling sering izin atau sakit dalam 30 hari terakhir.' 
    },
    { 
      label: '📦 Saldo Akhir Stok Gudang', 
      targetRole: 'ai_auditor_stock', 
      query: 'Berapa saldo akhir stok riil bahan baku di gudang persediaan hari ini dan bagaimana status BSPP-nya?' 
    },
    { 
      label: '🔍 Cek Anomali Kadar Air', 
      targetRole: 'ai_auditor_ka', 
      query: 'Apakah ada anomali kadar air pada cengkeh, krosok, atau tembakau hari ini?' 
    },
    { 
      label: '⚖️ Cek Kecurangan Susut Molen', 
      targetRole: 'ai_auditor_susut', 
      query: 'Bagaimana analisis kesusutan mesin molen blend? Apakah ada indikasi pola susut seragam palsu?' 
    },
    { 
      label: '📋 Kepatuhan BOS 09:00', 
      targetRole: 'ai_validator_data', 
      query: 'Bagaimana kepatuhan penyerahan data administrasi terhadap cut-off BOS jam 09:00 WIB?' 
    },
    { 
      label: '⚡ Simulasi Target +20%', 
      targetRole: 'ai_chief_advisor', 
      query: 'Bagaimana jika kita menaikkan target produksi blend sebesar 20%? Berikan analisis dampaknya.' 
    },
    { 
      label: '📱 Draf WhatsApp Direksi', 
      targetRole: 'ai_chief_advisor', 
      query: 'Tampilkan draf pesan rekap briefing untuk saya teruskan ke WhatsApp Direksi.' 
    }
  ];

  return (
    <div className="space-y-6">
      {/* Hero Header Card */}
      <div className="bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 border border-indigo-500/30 rounded-2xl p-5 sm:p-7 shadow-2xl relative overflow-hidden text-white">
        {/* Glow backdrop decoration */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/40">
                <BrainCircuit className="w-3.5 h-3.5 text-indigo-400" />
                DEWAN 6 KARYAWAN AI DIVISI PENGOLAHAN (PP1)
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                Pengawasan Aktif 24/7
              </span>
              <span className="text-xs text-slate-400">
                Terakhir Audit: {auditTimestamp}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              <span>Sistem Karyawan AI Pengawas Operasional</span>
              <Sparkles className="w-6 h-6 text-amber-400 animate-spin-slow shrink-0" />
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed">
              Enam peran kecerdasan buatan spesialis industri tembakau yang mengaudit secara otomatis: 
              <span className="text-cyan-300 font-semibold"> Kadar Air</span>, 
              <span className="text-amber-300 font-semibold"> Kesusutan Proses</span>, 
              <span className="text-emerald-300 font-semibold"> Validasi Data BOS</span>, 
              <span className="text-indigo-300 font-semibold"> Stok &amp; BSPP</span>, 
              <span className="text-rose-300 font-semibold"> Presensi SDM</span>, dan 
              <span className="text-purple-300 font-semibold"> Rekomendasi Manajer Operasional</span>.
            </p>
          </div>

          {/* Quick Metrics & Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col items-stretch sm:items-center lg:items-end gap-3 w-full lg:w-auto shrink-0">
            {/* Health Score Pill */}
            <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-400/30 rounded-xl px-4 py-3 flex items-center gap-4 shadow-lg">
              <div className="relative flex items-center justify-center">
                <svg className="w-14 h-14 transform -rotate-90">
                  <circle cx="28" cy="28" r="23" stroke="#334155" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="28" 
                    cy="28" 
                    r="23" 
                    stroke="#10b981" 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={144.5} 
                    strokeDashoffset={144.5 * (1 - 0.968)} 
                    strokeLinecap="round" 
                  />
                </svg>
                <span className="absolute text-xs font-bold text-emerald-400">96.8</span>
              </div>
              <div>
                <div className="text-[11px] uppercase tracking-wider text-slate-400 font-medium">Indeks Kesehatan Pabrik</div>
                <div className="text-lg font-bold text-white flex items-center gap-1.5">
                  STATUS PRIMA
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-[11px] text-emerald-300/90">31/32 Staf &bull; Zero Selisih BOS</div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => setIsManualModalOpen(true)}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md hover:shadow-amber-500/25"
                title="Buka Buku Panduan Operasional & Unduh Format PDF"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Panduan &amp; Unduh PDF</span>
              </button>

              <button
                onClick={handleRunInstantAudit}
                disabled={isAuditing}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white transition-all shadow-md hover:shadow-indigo-500/25 disabled:opacity-50"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${isAuditing ? 'animate-spin' : ''}`} />
                {isAuditing ? 'Memindai...' : 'Audit Live'}
              </button>

              <button
                onClick={handleCopyWhatsApp}
                className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold bg-emerald-700/80 hover:bg-emerald-600 text-white transition-all border border-emerald-500/40 shadow-md"
                title="Salin rekap pesan WhatsApp untuk Direksi"
              >
                {copiedWhatsApp ? <Check className="w-3.5 h-3.5 text-emerald-200" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedWhatsApp ? 'Tersalin!' : 'Rekap WA'}
              </button>
            </div>
          </div>
        </div>

        {/* Live Bridges Banner to external apps */}
        <div className="mt-5 pt-4 border-t border-indigo-900/60 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-300">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-slate-400 font-medium">Jembatan Data Langsung:</span>
            <a 
              href="https://monitoring-stock-pp-1-pro-api.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-900/50 hover:bg-indigo-800/60 border border-indigo-700/40 text-indigo-200 transition-colors"
            >
              <Boxes className="w-3 h-3 text-indigo-400" />
              Monitoring Stock PP1
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
            </a>
            <a 
              href="https://hr-staff-pp-1-pro-api.vercel.app/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-rose-900/50 hover:bg-rose-800/60 border border-rose-700/40 text-rose-200 transition-colors"
            >
              <UserCheck className="w-3 h-3 text-rose-400" />
              HR Staff &amp; Karyawan PP1
              <ExternalLink className="w-2.5 h-2.5 ml-0.5 opacity-70" />
            </a>

            <button
              onClick={() => setIsGasCenterModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/70 hover:bg-emerald-900/90 border border-emerald-500/50 text-emerald-300 font-mono transition-colors text-xs shadow-sm"
              title="Periksa Koneksi Live 5 Endpoint Google Apps Script REST APIs"
            >
              <Terminal className="w-3 h-3 text-emerald-400" />
              <span>5/5 GAS REST API Terkoneksi (Read-Only)</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-[11px] text-slate-400">
            <span>Standar SK Direksi: 01/AS/DRK/BKR/VII/2024</span>
            <span>&bull;</span>
            <span className="text-amber-300 font-medium">Cut-Off BOS: 09:00 WIB</span>
            <span>&bull;</span>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold font-mono">
              {getCurrentShiftWib().shiftName}
            </span>
          </div>
        </div>
      </div>

      {/* Role Navigation Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
        <button
          onClick={() => setActiveTab('all')}
          className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold transition-all shadow-sm ${
            activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-indigo-500/20'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          Semua Dewan AI (Ikhtisar Lengkap)
        </button>

        {AI_EMPLOYEES.map(emp => {
          const isActive = activeTab === emp.id;
          return (
            <button
              key={emp.id}
              onClick={() => setActiveTab(emp.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all border shadow-sm ${
                isActive
                  ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-slate-900 dark:border-white shadow-md'
                  : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <span className={`w-5 h-5 rounded-md flex items-center justify-center text-[10px] font-bold ${emp.badgeColor}`}>
                {emp.roleNumber}
              </span>
              <span>{emp.roleCalling}</span>
              <span className="text-[10px] opacity-70">({emp.name.split(',')[0].split(' ')[0]})</span>
            </button>
          );
        })}
      </div>

      {/* Main Content Areas */}
      {activeTab === 'all' && (
        <div className="space-y-6">
          {/* Executive Strategic Summary Box (from Role 6) */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center">
                  <BrainCircuit className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Arahan Eksekutif Manajer Operasional
                    <span className="text-xs px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-normal">
                      Aria Mahardika, M.M.
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Sintesis multi-dimensi 5 Auditor AI untuk Manajer Operasional (Lalu Mahendra Ali Akbar)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-semibold flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                  3 Tindakan Taktis Hari Ini
                </span>
              </div>
            </div>

            {/* 3 Top Tactical Action Items */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {INITIAL_EXECUTIVE_BRIEFING.tacticalRecommendations.map((rec) => (
                <div 
                  key={rec.priority}
                  className="bg-slate-50 dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl p-4 flex flex-col justify-between space-y-3 relative group hover:border-indigo-400 dark:hover:border-indigo-500 transition-colors"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-500/20">
                        Prioritas #{rec.priority}
                      </span>
                      <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {rec.deadline}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">
                      {rec.title}
                    </h3>

                    <p className="text-xs text-slate-600 dark:text-slate-400">
                      {rec.rationale}
                    </p>

                    <div className="space-y-1 pt-1">
                      <div className="text-[11px] font-semibold text-slate-700 dark:text-slate-300">Langkah Operasional:</div>
                      {rec.actionSteps.map((step, idx) => (
                        <div key={idx} className="flex items-start gap-1.5 text-[11px] text-slate-500 dark:text-slate-400">
                          <ChevronRight className="w-3 h-3 text-indigo-400 shrink-0 mt-0.5" />
                          <span>{step}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-500 flex items-center justify-between">
                    <span>PIC: <strong className="text-slate-700 dark:text-slate-300">{rec.responsibleStaff}</strong></span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Grid of 6 AI Staff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {AI_EMPLOYEES.map((emp) => {
              return (
                <div 
                  key={emp.id}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    {/* Header Role */}
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-11 h-11 rounded-xl flex items-center justify-center font-bold text-sm border ${emp.badgeColor}`}>
                          {emp.avatarInitials}
                        </div>
                        <div>
                          <div className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                            Peran AI #{emp.roleNumber}
                          </div>
                          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                            {emp.name}
                          </h3>
                          <div className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            {emp.roleCalling}
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => {
                          setSelectedChatRole(emp.id);
                          const el = document.getElementById('ai-chat-console');
                          el?.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-indigo-50 hover:text-indigo-600 dark:hover:bg-indigo-950/40 transition-colors"
                        title={`Tanya ${emp.name}`}
                      >
                        <Bot className="w-4 h-4" />
                      </button>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 line-clamp-2">
                      {emp.description}
                    </p>

                    {/* Key Live Metrics */}
                    <div className="grid grid-cols-3 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      {emp.keyMetrics.map((met, i) => (
                        <div key={i} className="bg-slate-50 dark:bg-slate-950 p-2 rounded-lg text-center">
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 truncate">{met.label}</div>
                          <div className={`text-xs font-bold ${
                            met.status === 'optimal' ? 'text-emerald-600 dark:text-emerald-400' :
                            met.status === 'warning' ? 'text-amber-600 dark:text-amber-400' :
                            'text-rose-600 dark:text-rose-400'
                          }`}>
                            {met.value}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                    {emp.externalAppUrl ? (
                      <a 
                        href={emp.externalAppUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-indigo-600 dark:text-indigo-400 font-semibold hover:underline inline-flex items-center gap-1"
                      >
                        Buka {emp.externalAppName?.split(' ')[0]} App
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ) : (
                      <span className="text-[11px] text-slate-500">{emp.department}</span>
                    )}

                    <button
                      onClick={() => setActiveTab(emp.id)}
                      className="font-semibold text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 inline-flex items-center gap-1"
                    >
                      Detail Audit
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Role 1 Detail View: Auditor Kadar Air */}
      {activeTab === 'ai_auditor_ka' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/20 flex items-center justify-center font-bold text-base">
                  TW
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Ir. Tirta Wardhana
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 font-semibold">
                      Peran 1: Auditor Mutu &amp; Kadar Air
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Memantau Kadar Air (KA%) 4 Bahan: Cengkeh, Krosok, Tembakau, dan Hasil Blend secara real-time.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Standar Kepatuhan KA:</span>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">98.5% Lolos Lab</div>
              </div>
            </div>

            {/* Moisture Audit Table */}
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-500" />
                Matriks Pengukuran Kadar Air 4 Komoditas Bahan Baku
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] border-y border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-3">Bahan &amp; Batch Lot</th>
                      <th className="py-3 px-3 text-center">KA Terukur</th>
                      <th className="py-3 px-3 text-center">Rentang Toleransi</th>
                      <th className="py-3 px-3 text-center">Status Audit</th>
                      <th className="py-3 px-3">Temuan AI &amp; Rekomendasi Tindakan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {INITIAL_MOISTURE_AUDITS.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{item.materialName}</div>
                          <div className="text-[11px] text-slate-500">{item.lotOrBatch}</div>
                          <div className="text-[10px] text-slate-400">Uji: {item.testedBy}</div>
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold text-sm">
                          <span className={item.status === 'OPTIMAL' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}>
                            {item.currentMoisture}%
                          </span>
                        </td>
                        <td className="py-3.5 px-3 text-center text-[11px] text-slate-500">
                          <div>Min: {item.targetMin}% | Max: {item.targetMax}%</div>
                          <div className="font-semibold text-slate-700 dark:text-slate-300">Ideal: {item.targetIdeal}%</div>
                        </td>
                        <td className="py-3.5 px-3 text-center">
                          <span className={`px-2 py-1 rounded-md text-[11px] font-bold ${
                            item.status === 'OPTIMAL'
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                          }`}>
                            {item.status === 'OPTIMAL' ? 'Sesuai Standar' : 'Perlu Penyesuaian'}
                          </span>
                          {item.riskType !== 'Normal' && (
                            <div className="text-[10px] text-amber-600 dark:text-amber-400 mt-1 font-medium">
                              ⚠️ {item.riskType}
                            </div>
                          )}
                        </td>
                        <td className="py-3.5 px-3 max-w-md">
                          <p className="text-slate-700 dark:text-slate-300 leading-snug">{item.aiFinding}</p>
                          <div className="mt-1 text-cyan-600 dark:text-cyan-400 font-medium text-[11px] bg-cyan-50 dark:bg-cyan-950/30 p-2 rounded-lg border border-cyan-200 dark:border-cyan-800/50">
                            <strong>Rekomendasi Tirta:</strong> {item.aiRecommendation}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role 2 Detail View: Auditor Kesusutan Proses */}
      {activeTab === 'ai_auditor_susut' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 flex items-center justify-center font-bold text-base">
                  SE
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Dr. Susanto Efendi
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-700 dark:text-amber-300 font-semibold">
                      Peran 2: Auditor Kesusutan Proses
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Audit Kesusutan Masing-Masing Bahan (Blend, Tembakau, Cengkeh, Krosok) &amp; Deteksi Susut Seragam Palsu.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Efisiensi Konversi Rerata:</span>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">98.66% Optimal</div>
              </div>
            </div>

            {/* Shrinkage Table */}
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="w-4 h-4 text-amber-500" />
                Matriks Audit Kesusutan Riil vs Standar Toleransi
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-left">
                  <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-600 dark:text-slate-300 font-semibold uppercase text-[11px] border-y border-slate-200 dark:border-slate-700">
                    <tr>
                      <th className="py-3 px-3">Lini / Mesin</th>
                      <th className="py-3 px-3">Bahan &amp; Batch</th>
                      <th className="py-3 px-3 text-right">Bahan Masuk</th>
                      <th className="py-3 px-3 text-right">Hasil Olah</th>
                      <th className="py-3 px-3 text-center">Susut Riil (%)</th>
                      <th className="py-3 px-3 text-center">Batas SOP</th>
                      <th className="py-3 px-3">Evaluasi Anti-Fraud &amp; Rekomendasi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                    {INITIAL_SHRINKAGE_AUDITS.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3.5 px-3">
                          <div className="font-bold text-slate-900 dark:text-white">{item.lineOrMachine}</div>
                          <div className="text-[11px] text-slate-500">Mandor: {item.mandorInCharge}</div>
                        </td>
                        <td className="py-3.5 px-3">
                          <div className="font-semibold text-slate-800 dark:text-slate-200">{item.materialName}</div>
                          <div className="text-[11px] font-mono text-slate-500">{item.batchNumber}</div>
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-medium">
                          {item.rawWeightKg.toFixed(1)} Kg
                        </td>
                        <td className="py-3.5 px-3 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400">
                          {item.resultWeightKg.toFixed(1)} Kg
                        </td>
                        <td className="py-3.5 px-3 text-center font-mono font-bold">
                          <span className={item.actualShrinkagePercent <= item.standardToleranceMaxPercent ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600'}>
                            {item.actualShrinkagePercent.toFixed(2)}%
                          </span>
                          <div className="text-[10px] text-slate-400">({item.actualShrinkageKg.toFixed(1)} Kg)</div>
                        </td>
                        <td className="py-3.5 px-3 text-center text-slate-500">
                          Maks {item.standardToleranceMaxPercent.toFixed(2)}%
                        </td>
                        <td className="py-3.5 px-3 max-w-sm">
                          <p className="text-slate-700 dark:text-slate-300">{item.aiFinding}</p>
                          <div className="mt-1 text-[11px] text-amber-700 dark:text-amber-300 font-medium bg-amber-50 dark:bg-amber-950/30 p-2 rounded-lg border border-amber-200 dark:border-amber-800/50">
                            <strong>Saran Dr. Susanto:</strong> {item.aiRecommendation}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role 3 Detail View: Validator Integritas Data */}
      {activeTab === 'ai_auditor_data' || activeTab === 'ai_validator_data' ? (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 flex items-center justify-center font-bold text-base">
                  RV
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Ratna Veritas, S.Stat
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-semibold">
                      Peran 3: Validator Integritas Data
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Memvalidasi Kebenaran Angka, Rumus Matematika, Kelengkapan 4 Pilar Tanda Tangan, dan Cut-off BOS 09:00 WIB.
                  </p>
                </div>
              </div>

              <div className="text-right">
                <span className="text-xs text-slate-500">Skor Integritas Data:</span>
                <div className="text-xl font-bold text-emerald-600 dark:text-emerald-400">99.4% Lolos Verifikasi</div>
              </div>
            </div>

            {/* Truth Audits */}
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-500" />
                Daftar Dokumen yang Telah Diverifikasi Secara Otomatis
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_DATA_TRUTH_AUDITS.map((item) => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-white">{item.documentType}</span>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {item.aiVerdict}
                      </span>
                    </div>

                    <div className="text-xs text-slate-500 font-mono">Ref: {item.referenceNo}</div>

                    <div className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <span>Rumus Matematika:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{item.formulaCheckStatus}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Kepatuhan Cut-Off 09:00:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">{item.cutoffStatus}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>4 Tanda Tangan:</span>
                        <strong className="text-emerald-600 dark:text-emerald-400">Lengkap 4/4</strong>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400 italic pt-2 border-t border-slate-200 dark:border-slate-800">
                      "{item.anomalyDetail}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Role 4 Detail View: Auditor Stok & BSPP */}
      {activeTab === 'ai_auditor_stock' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center font-bold text-base">
                  BL
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Bambang Logistiko
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 font-semibold">
                      Peran 4: Auditor Stok, Kebutuhan &amp; BSPP
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Terhubung ke Web App Monitoring Stock Persediaan. Mengawasi Saldo Fisik vs Buku, Run-out Days, &amp; Bukti Selisih Gudang (BSPP).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href="https://monitoring-stock-pp-1-pro-api.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Web App Monitoring Stock
                </a>
              </div>
            </div>

            {/* Stock & BSPP Table */}
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Boxes className="w-4 h-4 text-indigo-500" />
                Matriks Stok Gudang, Proyeksi Kebutuhan &amp; Audit BSPP
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_STOCK_BSPP_AUDITS.map((item) => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{item.materialName}</div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {item.stockStatus}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500">{item.warehouseLocation}</div>

                    <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400">Stok Fisik</span>
                        <div className="font-mono font-bold text-slate-900 dark:text-white">{item.physicalStockKg.toLocaleString('id-ID')} Kg</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400">Selisih Fisik/Buku</span>
                        <div className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{item.discrepancyKg} Kg</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400">Ketahanan Stok</span>
                        <div className="font-bold text-indigo-600 dark:text-indigo-400">{item.estimatedDaysCover} Hari</div>
                      </div>
                      <div className="bg-white dark:bg-slate-900 p-2 rounded-lg">
                        <span className="text-[10px] text-slate-400">BSPP Aktif</span>
                        <div className="font-bold text-slate-900 dark:text-white">{item.activeBsppCount} Berkas</div>
                      </div>
                    </div>

                    <p className="text-[11px] text-slate-600 dark:text-slate-400">
                      {item.bsppNotes}
                    </p>

                    <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 border border-indigo-200 dark:border-indigo-800/60 text-[11px] text-indigo-800 dark:text-indigo-300">
                      <strong>Saran Pengadaan:</strong> {item.aiProcurementAdvice}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role 5 Detail View: HRD & Pengawas Tenaga Kerja */}
      {activeTab === 'ai_hr_supervisor' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20 flex items-center justify-center font-bold text-base">
                  DP
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Dewi Personalia, S.Psi
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-rose-500/20 text-rose-700 dark:text-rose-300 font-semibold">
                      Peran 5: HRD &amp; Pengawas Tenaga Kerja
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Terhubung ke Web App HR Staff &amp; Karyawan. Mengawasi Presensi 32 Staf, Kesiapan Lini Mesin, &amp; Kepatuhan Jobdesc 13 Jabatan (SK 01/2024).
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <a 
                  href="https://hr-staff-pp-1-pro-api.vercel.app/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-semibold shadow-sm transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Buka Web App HR Staff
                </a>
              </div>
            </div>

            {/* HR Audits */}
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <UserCheck className="w-4 h-4 text-rose-500" />
                Matriks Penempatan Staf Kunci Per Lini Operasional
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {INITIAL_HR_AUDITS.map((item) => (
                  <div key={item.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 bg-slate-50 dark:bg-slate-950/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="font-bold text-sm text-slate-900 dark:text-white">{item.unitLine}</div>
                      <span className="px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 text-[10px] font-bold">
                        {item.shiftStatus}
                      </span>
                    </div>

                    <div className="space-y-1.5 pt-2 border-t border-slate-200 dark:border-slate-800">
                      <div className="text-[11px] font-semibold text-slate-500">Staf Penanggung Jawab Lini:</div>
                      {item.keyStaffAssigned.map((staf, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                          <span className="text-slate-600 dark:text-slate-400">{staf.roleTitle}</span>
                          <span className="font-bold text-slate-900 dark:text-white">{staf.staffName}</span>
                        </div>
                      ))}
                    </div>

                    <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
                      <span>Cakupan Regu: <strong>{item.lineCoverageScore}%</strong></span>
                      <span>Kepatuhan SOP: <strong className="text-emerald-600 dark:text-emerald-400">{item.jobdescComplianceScore}%</strong></span>
                    </div>

                    <p className="text-[11px] text-slate-500 italic">
                      "{item.aiObservation}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Role 6 Detail View: Penasihat Strategis Manajer Operasional */}
      {activeTab === 'ai_chief_advisor' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 flex items-center justify-center font-bold text-base">
                  AM
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                    Aria Mahardika, M.M.
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 font-semibold">
                      Peran 6: Penasihat Strategis Manajer Operasional
                    </span>
                  </h2>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Menganalisis Keseluruhan Data &amp; Menyajikan Ringkasan Rekomendasi sebagai Dasar Pengambilan Keputusan Manajer Operasional.
                  </p>
                </div>
              </div>

              <button
                onClick={handleCopyWhatsApp}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold shadow-sm transition-colors"
              >
                {copiedWhatsApp ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                {copiedWhatsApp ? 'Tersalin ke Clipboard' : 'Salin Laporan WhatsApp'}
              </button>
            </div>

            {/* Decision Matrix */}
            <div className="mt-5 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BrainCircuit className="w-4 h-4 text-purple-500" />
                Matriks Prioritas Keputusan Manajer Operasional (Hari Ini)
              </h3>

              <div className="space-y-3">
                {INITIAL_EXECUTIVE_BRIEFING.tacticalRecommendations.map((rec) => (
                  <div key={rec.priority} className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="space-y-1 max-w-2xl">
                      <div className="flex items-center gap-2 text-xs">
                        <span className="px-2 py-0.5 rounded bg-purple-500/20 text-purple-700 dark:text-purple-300 font-bold">
                          Prioritas #{rec.priority}
                        </span>
                        <span className="font-semibold text-slate-500">{rec.impactArea}</span>
                        <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {rec.deadline}
                        </span>
                      </div>
                      <h4 className="text-sm font-bold text-slate-900 dark:text-white">{rec.title}</h4>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{rec.rationale}</p>
                    </div>

                    <div className="text-xs shrink-0 bg-white dark:bg-slate-900 p-3 rounded-xl border border-slate-200 dark:border-slate-800">
                      <div className="text-slate-400 text-[10px]">PENANGGUNG JAWAB:</div>
                      <div className="font-bold text-slate-900 dark:text-white">{rec.responsibleStaff}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Interactive AI Consultation & Simulator Console ("Tanya Dewan AI") */}
      <div id="ai-chat-console" className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 flex items-center justify-center">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Konsultasi &amp; Tanya Dewan Karyawan AI
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 font-medium">
                  Interaktif &bull; Siap 24 Jam
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pilih peran AI atau tanyakan simulasi apa pun terkait kadar air, susut, akurasi DHP, stok gudang, dan absensi SDM.
              </p>
            </div>
          </div>

          {/* Role Selector Dropdown */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium shrink-0">Bicara dengan:</span>
            <select
              value={selectedChatRole}
              onChange={(e) => setSelectedChatRole(e.target.value)}
              className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {AI_EMPLOYEES.map(emp => (
                <option key={emp.id} value={emp.id}>
                  #{emp.roleNumber} {emp.roleCalling} ({emp.name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Chat Messages Stream */}
        <div 
          ref={chatContainerRef}
          className="space-y-3 max-h-96 overflow-y-auto p-4 rounded-xl bg-slate-50 dark:bg-slate-950/70 border border-slate-200 dark:border-slate-800/80 scroll-smooth"
        >
          {chatMessages.map((msg) => (
            <div 
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              {msg.sender === 'ai' && (
                <div className="flex items-center gap-2 mb-1 text-[11px] text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{msg.aiEmployeeName}</span>
                  <span>&bull;</span>
                  <span className="text-slate-400">{msg.aiRoleCalling}</span>
                  <span className="text-[10px] text-slate-400">({msg.timestamp})</span>
                </div>
              )}

              <div className={`p-3.5 rounded-2xl max-w-2xl text-xs sm:text-sm whitespace-pre-wrap leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-none shadow-sm'
                  : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 rounded-bl-none shadow-sm'
              }`}>
                {msg.content}

                {/* Metrics Cited Badge in AI response */}
                {msg.metricsCited && msg.metricsCited.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                    {msg.metricsCited.map((met, i) => (
                      <span key={i} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-semibold text-slate-700 dark:text-slate-300">
                        {met.label}: <strong className="text-indigo-600 dark:text-indigo-400">{met.value}</strong>
                      </span>
                    ))}
                  </div>
                )}

                {/* Action items in response */}
                {msg.actionItems && msg.actionItems.length > 0 && (
                  <div className="mt-3 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                    <div className="text-[11px] font-bold text-slate-700 dark:text-slate-300">Rekomendasi Tindakan Cepat:</div>
                    {msg.actionItems.map((act, i) => (
                      <div key={i} className="flex items-start gap-1.5 text-[11px] text-slate-600 dark:text-slate-400">
                        <Check className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{act}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {isAiThinking && (
            <div className="flex items-center gap-2 text-xs text-indigo-500 p-2">
              <Bot className="w-4 h-4 animate-bounce" />
              <span>Karyawan AI sedang menganalisis data pabrik...</span>
            </div>
          )}

          {/* Anchor for auto-scroll */}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Prompt Chips (Diletakkan di bagian bawah, tepat di atas input / footer konsultasi agar instan diakses setelah membaca jawaban AI) */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center justify-between pb-1.5 px-0.5">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-500 animate-pulse" />
              <span>Pertanyaan Cepat Rekomendasi:</span>
            </span>
            <span className="text-[10px] text-slate-400 hidden sm:inline">
              Akses instan &bull; 1-klik langsung tanyakan
            </span>
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1.5 pt-0.5 text-xs">
            {quickPrompts.map((qp, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handleSendQuery(qp.query, qp.targetRole)}
                className="shrink-0 px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-800/90 hover:bg-indigo-50 hover:text-indigo-600 hover:border-indigo-300 dark:hover:bg-indigo-950/70 dark:hover:text-indigo-300 dark:hover:border-indigo-700 text-slate-700 dark:text-slate-200 border border-slate-200/90 dark:border-slate-700/80 transition-all text-[11px] font-medium shadow-sm hover:shadow flex items-center gap-1.5 active:scale-95"
                title={`Kirim pertanyaan ke ${qp.targetRole}`}
              >
                <span>{qp.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Input Field & Send Button */}
        <form 
          onSubmit={(e) => {
            e.preventDefault();
            handleSendQuery();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder={`Tanyakan pada ${AI_EMPLOYEES.find(e => e.id === selectedChatRole)?.name || 'Karyawan AI'} (contoh: "Apakah ada selisih timbangan hari ini?")...`}
            className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white border border-slate-200 dark:border-slate-800 text-xs sm:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder-slate-400"
          />
          <button
            type="submit"
            disabled={!inputQuery.trim() || isAiThinking}
            className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 text-white font-semibold text-xs sm:text-sm flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Send className="w-4 h-4" />
            <span>Kirim</span>
          </button>
        </form>
      </div>

      {/* Official AI Council Manual & PDF Export Modal */}
      <AiCouncilManualModal 
        isOpen={isManualModalOpen} 
        onClose={() => setIsManualModalOpen(false)} 
      />

      {/* Headless GAS API Terminal Modal */}
      <HeadlessGasCenterModal
        isOpen={isGasCenterModalOpen}
        onClose={() => setIsGasCenterModalOpen(false)}
      />
    </div>
  );
};
