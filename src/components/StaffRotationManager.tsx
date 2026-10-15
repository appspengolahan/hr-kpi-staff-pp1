import React, { useState } from 'react';
import { POSITIONS_DATA } from '../data/jobDescriptions';
import { HR_STAFF_MASTER_DATA } from '../data/hrStaffMasterData';
import { RoleId, PersonnelAssignment, RotationHistoryItem, StaffActionType } from '../types';
import { getWibIsoDate } from '../utils/indonesiaDateUtils';
import { 
  Users, 
  ArrowRightLeft, 
  TrendingUp, 
  TrendingDown, 
  ShieldAlert, 
  CheckCircle2, 
  Clock, 
  FileText, 
  UserPlus, 
  RefreshCw, 
  Search,
  ExternalLink,
  Award,
  Sparkles,
  Check
} from 'lucide-react';

interface StaffRotationManagerProps {
  assignments: Record<RoleId, PersonnelAssignment>;
  onUpdateAssignment: (roleId: RoleId, updated: PersonnelAssignment, historyItem: RotationHistoryItem) => void;
  rotationHistory: RotationHistoryItem[];
}

export const StaffRotationManager: React.FC<StaffRotationManagerProps> = ({
  assignments,
  onUpdateAssignment,
  rotationHistory
}) => {
  const [selectedRoleForAction, setSelectedRoleForAction] = useState<RoleId | null>(null);
  const [actionType, setActionType] = useState<StaffActionType>('Rotasi / Rolling');
  const [newStaffName, setNewStaffName] = useState('');
  const [effectiveDate, setEffectiveDate] = useState(() => getWibIsoDate());
  const [decreeNumber, setDecreeNumber] = useState('01 / AS / DRK / BKR / VII / 2024');
  const [actionReason, setActionReason] = useState('Penyegaran organisasi dan optimalisasi efisiensi pengolahan bahan');
  const [searchFilter, setSearchFilter] = useState('');

  // Live HR App integration simulation state
  const [isFetchingHrData, setIsFetchingHrData] = useState(false);
  const [hrSyncSuccess, setHrSyncSuccess] = useState<string | null>(null);

  const handleOpenActionModal = (roleId: RoleId) => {
    setSelectedRoleForAction(roleId);
    setNewStaffName('');
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoleForAction || !newStaffName.trim()) return;

    const current = assignments[selectedRoleForAction];
    const updated: PersonnelAssignment = {
      ...current,
      currentStaffName: newStaffName.trim(),
      effectiveDate: effectiveDate,
      lastAction: actionType,
      decreeNumber: decreeNumber,
      status: actionType === 'Pelimpahan HRD II' ? 'Rotasi' : 'Aktif',
      notes: actionReason
    };

    const historyItem: RotationHistoryItem = {
      id: `rot-${Date.now()}`,
      date: effectiveDate,
      roleId: selectedRoleForAction,
      roleTitle: current.roleTitle,
      previousStaff: current.currentStaffName,
      newStaff: newStaffName.trim(),
      actionType: actionType,
      decreeNumber: decreeNumber,
      reason: actionReason,
      approvedBy: 'Lalu Mahendra (Manager Operasional)'
    };

    onUpdateAssignment(selectedRoleForAction, updated, historyItem);
    setSelectedRoleForAction(null);
  };

  const handleSyncFromHrApp = () => {
    setIsFetchingHrData(true);
    setTimeout(() => {
      setIsFetchingHrData(false);
      setHrSyncSuccess('Berhasil terhubung ke https://hr-staff-pp1-pro-api.vercel.app/ (Endpoint Headless GAS). Daftar kandidat staf & presensi terupdate.');
    }, 800);
  };

  const filteredPositions = POSITIONS_DATA.filter(p => {
    const assignment = assignments[p.id];
    return p.title.toLowerCase().includes(searchFilter.toLowerCase()) ||
      (assignment && assignment.currentStaffName.toLowerCase().includes(searchFilter.toLowerCase())) ||
      p.department.toLowerCase().includes(searchFilter.toLowerCase());
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-amber-950 p-6 sm:p-7 rounded-2xl border border-slate-700/80 shadow-lg text-white">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="bg-amber-500 text-slate-950 text-xs font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider font-mono">
                Manajemen Personil Dinamis
              </span>
              <span className="text-xs text-amber-200/80 bg-amber-950/40 px-2 py-0.5 rounded border border-amber-500/20">
                SK No: 01/AS/DRK/BKR/VII/2024
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
              Sistem Rotasi, Mutasi, Promosi &amp; Degradasi Pejabat
            </h2>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-3xl leading-relaxed">
              Struktur jabatan bersifat tetap dan baku, namun <strong>nama pejabat dan personil bersifat dinamis</strong> karena adanya rotasi berkala, promosi kinerja, atau demosi. Skor KPI secara otomatis terikat pada personil yang saat itu menjabat.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <button
              onClick={handleSyncFromHrApp}
              disabled={isFetchingHrData}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-400 text-slate-950 transition-all shadow-md active:scale-95 disabled:opacity-50"
            >
              <RefreshCw className={`w-4 h-4 ${isFetchingHrData ? 'animate-spin' : ''}`} />
              <span>Sinkronisasi Database HR Staff</span>
            </button>
            <a
              href="https://hr-staff-pp1-pro-api.vercel.app/"
              target="_blank"
              rel="noreferrer"
              className="text-[11px] text-amber-300 hover:text-white flex items-center justify-center gap-1 underline"
            >
              <span>Buka Web App HR Staff Live</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {hrSyncSuccess && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-xs text-emerald-200 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>{hrSyncSuccess}</span>
            </div>
            <button onClick={() => setHrSyncSuccess(null)} className="text-slate-400 hover:text-white">&times;</button>
          </div>
        )}
      </div>

      {/* Control & Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Cari nama pejabat, jabatan, atau unit..."
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-500">
          <span>Total: <strong>{POSITIONS_DATA.length} Posisi Kunci</strong></span>
          <span>&bull;</span>
          <span className="text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
            {rotationHistory.length} Riwayat Rotasi Tercatat
          </span>
        </div>
      </div>

      {/* Grid of Positions and Current Assigned Staff */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredPositions.map((pos) => {
          const assignment = assignments[pos.id];
          const currentName = assignment ? assignment.currentStaffName : (pos.incumbentName || 'Belum Ditetapkan');
          const lastAction = assignment ? assignment.lastAction : 'Penetapan';
          const effectiveDateStr = assignment ? assignment.effectiveDate : '17/09/2024';

          return (
            <div 
              key={pos.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 hover:border-amber-300 transition-all flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-slate-900 text-amber-400 uppercase">
                    {pos.id.toUpperCase()}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    lastAction === 'Promosi'
                      ? 'bg-emerald-100 text-emerald-800'
                      : lastAction === 'Degradasi / Demosi'
                      ? 'bg-rose-100 text-rose-800'
                      : lastAction === 'Rotasi / Rolling'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {lastAction}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  {pos.department}
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-0.5">
                  {pos.title}
                </h3>

                {/* Current Active Staff Badge */}
                <div className="mt-3 p-3 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="text-[10px] text-slate-500 font-medium flex items-center justify-between">
                    <span>Pejabat Saat Ini:</span>
                    <span className="text-slate-400 font-mono text-[9px]">{effectiveDateStr}</span>
                  </div>
                  <div className="text-sm font-bold text-slate-950 flex items-center gap-2">
                    <Users className="w-4 h-4 text-amber-600 shrink-0" />
                    <span className="truncate">{currentName}</span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">
                    Atasan: <strong>{pos.directSupervisor}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-slate-600 mt-2 line-clamp-2">
                  {pos.summary}
                </p>
              </div>

              {/* Action Button: Trigger Rotation/Promotion/Demotion */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[10px] text-slate-400">
                  SK: {assignment?.decreeNumber || '01/AS/DRK/2024'}
                </span>
                <button
                  onClick={() => handleOpenActionModal(pos.id)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-200 transition-all active:scale-95"
                >
                  <ArrowRightLeft className="w-3.5 h-3.5 text-amber-700" />
                  <span>Ubah / Rotasi Pejabat</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotation Audit Trail Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-600" />
              Buku Riwayat Rotasi, Mutasi &amp; Promosi Divisi Produksi I
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Setiap pergantian personil tercatat dengan tanggal efektif, jenis tindakan, dan dasar SK Perusahaan.
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
            Audit Trail ISO/HR
          </span>
        </div>

        {rotationHistory.length === 0 ? (
          <div className="text-center py-6 text-slate-400 text-xs">
            Belum ada riwayat rotasi baru yang dilakukan dalam sesi ini.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200 uppercase text-[10px]">
                <tr>
                  <th className="py-2.5 px-3">Tanggal Efektif</th>
                  <th className="py-2.5 px-3">Jabatan</th>
                  <th className="py-2.5 px-3">Pejabat Lama</th>
                  <th className="py-2.5 px-3">Pejabat Baru</th>
                  <th className="py-2.5 px-3">Jenis Tindakan</th>
                  <th className="py-2.5 px-3">Dasar Ketetapan</th>
                  <th className="py-2.5 px-3">Keterangan / Alasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {rotationHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50">
                    <td className="py-2.5 px-3 font-mono font-semibold text-slate-900">{item.date}</td>
                    <td className="py-2.5 px-3 font-bold text-blue-900">{item.roleTitle}</td>
                    <td className="py-2.5 px-3 text-slate-500 line-through">{item.previousStaff}</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-800">{item.newStaff}</td>
                    <td className="py-2.5 px-3">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-amber-100 text-amber-900 border border-amber-200">
                        {item.actionType}
                      </span>
                    </td>
                    <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">{item.decreeNumber}</td>
                    <td className="py-2.5 px-3 text-slate-600">{item.reason}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal: Execute Rotation / Mutation / Promotion / Demotion */}
      {selectedRoleForAction && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-start justify-between border-b border-slate-100 pb-3">
              <div>
                <span className="text-[10px] font-bold px-2 py-0.2 rounded bg-amber-500 text-slate-950 uppercase font-mono">
                  FORM PERUBAHAN PEJABAT
                </span>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {assignments[selectedRoleForAction]?.roleTitle}
                </h3>
                <p className="text-xs text-slate-500">
                  Pejabat saat ini: <strong>{assignments[selectedRoleForAction]?.currentStaffName}</strong>
                </p>
              </div>
              <button
                onClick={() => setSelectedRoleForAction(null)}
                className="text-slate-400 hover:text-slate-600 p-1 text-lg font-bold"
              >
                &times;
              </button>
            </div>

            <form onSubmit={handleSaveAction} className="space-y-3.5 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Jenis Tindakan Kepegawaian:
                </label>
                <select
                  value={actionType}
                  onChange={(e) => setActionType(e.target.value as StaffActionType)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-slate-50 font-medium"
                >
                  <option value="Rotasi / Rolling">Rotasi / Rolling Kerja Internal</option>
                  <option value="Promosi">Promosi Jabatan (Kenaikan Level)</option>
                  <option value="Degradasi / Demosi">Degradasi / Demosi (Penurunan Level)</option>
                  <option value="Mutasi">Mutasi Antar Sekup</option>
                  <option value="Pelimpahan HRD II">Pelimpahan ke Divisi HRD II &amp; Umum II</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Nama Pejabat Baru (Ketik atau Pilih dari Database HR):
                </label>
                <input
                  type="text"
                  value={newStaffName}
                  onChange={(e) => setNewStaffName(e.target.value)}
                  placeholder="Masukkan nama staf yang ditugaskan..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-300 bg-white font-medium"
                  required
                />
                
                {/* Fast Selector from Live HR Database */}
                <div className="mt-2 space-y-1">
                  <span className="text-[10px] text-slate-400 font-semibold block">
                    Pilih Cepat dari Database HR Staff (https://hr-staff-pp1-pro-api.vercel.app/):
                  </span>
                  <div className="flex flex-wrap gap-1 max-h-28 overflow-y-auto p-1.5 bg-slate-50 rounded-lg border border-slate-200">
                    {HR_STAFF_MASTER_DATA.map((c) => (
                      <button
                        type="button"
                        key={c.nip}
                        onClick={() => setNewStaffName(`${c.nama} (${c.nip})`)}
                        className="px-2 py-0.5 rounded text-[10px] bg-white border border-slate-200 hover:bg-amber-50 hover:border-amber-300 text-slate-800 font-medium"
                      >
                        {c.nama} &bull; {c.nip} ({c.level})
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tanggal Efektif:</label>
                  <input
                    type="date"
                    value={effectiveDate}
                    onChange={(e) => setEffectiveDate(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Nomor SK / Dasar Ketetapan:</label>
                  <input
                    type="text"
                    value={decreeNumber}
                    onChange={(e) => setDecreeNumber(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50 font-mono text-[11px]"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Alasan &amp; Pertimbangan Manajerial:</label>
                <textarea
                  value={actionReason}
                  onChange={(e) => setActionReason(e.target.value)}
                  rows={2}
                  className="w-full px-3 py-1.5 rounded-lg border border-slate-300 bg-slate-50"
                  required
                />
              </div>

              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-950">
                <strong>Otoritas Manajer Operasional:</strong> Berdasarkan Ketetapan No: 01/AS/DRK/BKR/VII/2024, perubahan ini akan secara otomatis memperbarui kartu evaluasi KPI untuk personil yang baru ditugaskan.
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setSelectedRoleForAction(null)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:bg-slate-100 text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow"
                >
                  Simpan &amp; Terapkan Rotasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
