import React from 'react';
import { 
  Boxes, 
  ExternalLink, 
  X, 
  Activity, 
  ShieldCheck, 
  Package, 
  Flame, 
  Users, 
  Radio,
  CheckCircle2,
  Workflow
} from 'lucide-react';

interface SwitchBoardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SWITCH_BOARD_APPS = [
  {
    id: 'blend',
    name: 'Rekap Data Proses Blend (PP1 Pro API)',
    scope: 'Mesin Molen, Saos, Kesusutan & Varietas 153',
    url: 'https://rekap-data-proses-blend-pro-api-eng.vercel.app/',
    icon: Flame,
    color: 'from-amber-500 to-amber-600',
    badge: 'Proses Utama',
    badgeColor: 'bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300',
    status: 'Live (200 OK)'
  },
  {
    id: 'stock',
    name: 'Monitoring Stock Persediaan PP1',
    scope: 'Gudang Persediaan Bahan Baku (Tembakau, Krosok, Cengkeh, Blend) & BSPP',
    url: 'https://monitoring-stock-pp-1-pro-api.vercel.app/',
    icon: Package,
    color: 'from-blue-500 to-blue-600',
    badge: 'Persediaan',
    badgeColor: 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300',
    status: 'Live (200 OK)'
  },
  {
    id: 'cengkeh',
    name: 'Rekap Data Proses Cengkeh',
    scope: 'Rajangan Cengkeh, Susut Rajang & Larutan Saos Cengkeh',
    url: 'https://rekap-data-proses-cengkeh-pro-api-l.vercel.app/',
    icon: Activity,
    color: 'from-purple-500 to-purple-600',
    badge: 'Unit Cengkeh',
    badgeColor: 'bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300',
    status: 'Live (200 OK)'
  },
  {
    id: 'tembakau',
    name: 'Rekap Data Proses Tembakau & Krosok',
    scope: 'Hulu Rajangan Tembakau, Penjemuran Bergula & Bersih Gagang',
    url: 'https://rekap-dataproses-tembakau-pro.vercel.app/',
    icon: Boxes,
    color: 'from-emerald-500 to-emerald-600',
    badge: 'Unit Tembakau',
    badgeColor: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/40 dark:text-emerald-300',
    status: 'Live (200 OK)'
  },
  {
    id: 'hr_staff',
    name: 'Sistem HR Staff PP1 (Single Source of Truth)',
    scope: 'Database 32 Staf Resmi, Penugasan Jabatan, Presensi & Rotasi',
    url: 'https://hr-staff-pp1-pro-api.vercel.app/',
    icon: Users,
    color: 'from-rose-500 to-rose-600',
    badge: 'Data Staf Murni',
    badgeColor: 'bg-rose-100 text-rose-800 dark:bg-rose-900/40 dark:text-rose-300',
    status: 'Live (200 OK)'
  }
];

export const SwitchBoardModal: React.FC<SwitchBoardModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-amber-500/10 text-amber-500">
              <Workflow className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Factory App Switch Board
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Pindah cepat antar aplikasi operasional dan kepegawaian di lingkungan Divisi Produksi I.
              </p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* App List Grid */}
        <div className="grid grid-cols-1 gap-3 max-h-[60vh] overflow-y-auto pr-1">
          {SWITCH_BOARD_APPS.map((app) => {
            const Icon = app.icon;
            return (
              <a
                key={app.id}
                href={app.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 hover:bg-amber-50/60 dark:hover:bg-amber-950/30 border border-slate-200/80 dark:border-slate-800 hover:border-amber-400/50 transition-all shadow-sm"
              >
                <div className="flex items-center gap-3.5">
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.color} text-white flex items-center justify-center shadow-md shrink-0`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {app.name}
                      </h4>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${app.badgeColor}`}>
                        {app.badge}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1">
                      {app.scope}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 text-slate-400 group-hover:text-amber-500 shrink-0 ml-2">
                  <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded">
                    <CheckCircle2 className="w-3 h-3" /> {app.status}
                  </span>
                  <ExternalLink className="w-4 h-4 transform group-hover:translate-x-0.5 transition-transform" />
                </div>
              </a>
            );
          })}
        </div>

        {/* Footer Note */}
        <div className="text-[11px] text-slate-500 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/50 p-3 rounded-2xl flex items-center justify-between">
          <span>Semua aplikasi terhubung dengan API Engine PT Batu Karang</span>
          <button 
            onClick={onClose}
            className="px-3 py-1 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl text-xs font-semibold"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
