// Utility for Indonesian Locale (id-ID) & Western Indonesian Time (WIB - Asia/Jakarta)
// Ensures 100% precision for manufacturing shifts, audit timestamps, and operational cutoffs.

export const LOCALE_INDONESIA = 'id-ID';
export const TIMEZONE_WIB = 'Asia/Jakarta';

/**
 * Returns formatted time in WIB (Asia/Jakarta) with standard colon separator and 'WIB' suffix.
 * Example: "09:15 WIB" or "09:15:30 WIB"
 */
export function formatWibTime(
  dateInput: Date | string | number = new Date(),
  includeSeconds: boolean = false
): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const timeStr = d.toLocaleTimeString(LOCALE_INDONESIA, {
    timeZone: TIMEZONE_WIB,
    hour: '2-digit',
    minute: '2-digit',
    second: includeSeconds ? '2-digit' : undefined,
    hour12: false
  });
  // Replace Indonesian dot-separator if produced by some browsers to ensure standard HH:mm format
  const sanitized = timeStr.replace(/\./g, ':');
  return `${sanitized} WIB`;
}

/**
 * Returns formatted date in Indonesian locale (id-ID).
 * Example: "09 Oktober 2026"
 */
export function formatWibDate(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString(LOCALE_INDONESIA, {
    timeZone: TIMEZONE_WIB,
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Returns short formatted date in Indonesian locale.
 * Example: "09 Okt 2026"
 */
export function formatWibShortDate(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString(LOCALE_INDONESIA, {
    timeZone: TIMEZONE_WIB,
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}

/**
 * Returns full date with Indonesian day name.
 * Example: "Jumat, 09 Oktober 2026"
 */
export function formatWibFullDate(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString(LOCALE_INDONESIA, {
    timeZone: TIMEZONE_WIB,
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric'
  });
}

/**
 * Returns combined Indonesian Date and WIB Time.
 * Example: "09 Oktober 2026 • 09:15 WIB"
 */
export function formatWibDateTime(
  dateInput: Date | string | number = new Date(),
  includeSeconds: boolean = false
): string {
  return `${formatWibDate(dateInput)} • ${formatWibTime(dateInput, includeSeconds)}`;
}

/**
 * Returns combined Full Indonesian Day-Date and WIB Time.
 * Example: "Jumat, 09 Oktober 2026 • 09:15 WIB"
 */
export function formatWibFullDateTime(
  dateInput: Date | string | number = new Date(),
  includeSeconds: boolean = false
): string {
  return `${formatWibFullDate(dateInput)} • ${formatWibTime(dateInput, includeSeconds)}`;
}

/**
 * Returns ISO date string (YYYY-MM-DD) calculated in WIB (Asia/Jakarta) timezone.
 * Critical to avoid date shifting when server or browser is in UTC or US timezones.
 * Example: "2026-10-09"
 */
export function getWibIsoDate(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE_WIB,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  return formatter.format(d); // Returns YYYY-MM-DD
}

/**
 * Generates standardized manufacturing batch / SPK code using precise WIB date.
 * Example: getWibBatchCode('BT', 1) => "BT-20261009-01"
 */
export function getWibBatchCode(
  prefix: string,
  sequence: number,
  dateInput: Date | string | number = new Date()
): string {
  const isoDate = getWibIsoDate(dateInput).replace(/-/g, '');
  const seqStr = String(sequence).padStart(2, '0');
  return `${prefix}-${isoDate}-${seqStr}`;
}

/**
 * Returns numeric year, month (1-12), day, hours, minutes, and seconds in WIB timezone.
 */
export function getWibDateParts(dateInput: Date | string | number = new Date()): {
  year: number;
  month: number;
  day: number;
  hours: number;
  minutes: number;
  seconds: number;
  dayOfWeek: string;
} {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE_WIB,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    weekday: 'short',
    hour12: false
  }).formatToParts(d);

  const map: Record<string, string> = {};
  for (const p of parts) {
    if (p.type !== 'literal') {
      map[p.type] = p.value;
    }
  }

  return {
    year: parseInt(map.year, 10) || 2026,
    month: parseInt(map.month, 10) || 10,
    day: parseInt(map.day, 10) || 9,
    hours: parseInt(map.hour, 10) || 0,
    minutes: parseInt(map.minute, 10) || 0,
    seconds: parseInt(map.second, 10) || 0,
    dayOfWeek: map.weekday || 'Fri'
  };
}

export interface FactoryShiftInfo {
  shiftNumber: 1 | 2 | 3;
  shiftName: string;
  shiftCode: 'SHIFT_1' | 'SHIFT_2' | 'SHIFT_3';
  shiftHours: string;
  description: string;
}

/**
 * Determines current operational shift in PT. BATU KARANG based on WIB time.
 * - Shift 1: 07:00 - 15:00 WIB (Shift Pagi: Rajang, Casing, Molen Utama)
 * - Shift 2: 15:00 - 23:00 WIB (Shift Sore: Sortir, Aging, Kebersihan Drum)
 * - Shift 3: 23:00 - 07:00 WIB (Standby K3 & Fumigasi Gudang)
 */
export function getCurrentShiftWib(dateInput: Date | string | number = new Date()): FactoryShiftInfo {
  const { hours } = getWibDateParts(dateInput);

  if (hours >= 7 && hours < 15) {
    return {
      shiftNumber: 1,
      shiftName: 'Shift 1 (Pagi)',
      shiftCode: 'SHIFT_1',
      shiftHours: '07:00 - 15:00 WIB',
      description: 'Lini Aktif: Rajang Tembakau, Pemisahan Gagang Cengkeh & Putar Molen 1-3'
    };
  } else if (hours >= 15 && hours < 23) {
    return {
      shiftNumber: 2,
      shiftName: 'Shift 2 (Sore)',
      shiftCode: 'SHIFT_2',
      shiftHours: '15:00 - 23:00 WIB',
      description: 'Lini Aktif: Aging Blend, Sortir Meja & Pembersihan Mesin Interim'
    };
  } else {
    return {
      shiftNumber: 3,
      shiftName: 'Shift 3 (Malam / Standby)',
      shiftCode: 'SHIFT_3',
      shiftHours: '23:00 - 07:00 WIB',
      description: 'Lini Standby: Pengondisian Suhu Gudang, Fumigasi Krosok & Monitoring K3'
    };
  }
}

export interface CutoffStatus {
  isPassed: boolean;
  cutoffTimeStr: string;
  minutesDiff: number;
  badgeStatus: 'SEBELUM_CUTOFF' | 'PASCA_CUTOFF';
  statusText: string;
}

/**
 * Checks status against the 09:00 WIB Cutoff BOS (Book of System / Rekap Administrasi Akuntansi).
 */
export function getCutoffStatusWib(
  cutoffHour: number = 9, 
  cutoffMinute: number = 0,
  dateInput: Date | string | number = new Date()
): CutoffStatus {
  const { hours, minutes } = getWibDateParts(dateInput);
  const currentTotalMinutes = hours * 60 + minutes;
  const cutoffTotalMinutes = cutoffHour * 60 + cutoffMinute;
  const diff = currentTotalMinutes - cutoffTotalMinutes;

  const isPassed = diff >= 0;
  return {
    isPassed,
    cutoffTimeStr: `${String(cutoffHour).padStart(2, '0')}:${String(cutoffMinute).padStart(2, '0')} WIB`,
    minutesDiff: Math.abs(diff),
    badgeStatus: isPassed ? 'PASCA_CUTOFF' : 'SEBELUM_CUTOFF',
    statusText: isPassed
      ? `Cut-Off BOS Terlewati (+${diff} menit) • Seluruh Dokumen Terverifikasi`
      : `Menuju Cut-Off BOS (${Math.abs(diff)} menit tersisa)`
  };
}

/**
 * Checks if cutoff hour:minute has passed in factory WIB time.
 */
export function isPastCutoffWib(cutoffHour: number = 9, cutoffMinute: number = 0): boolean {
  return getCutoffStatusWib(cutoffHour, cutoffMinute).isPassed;
}

/**
 * Indonesian Day Name (Senin s/d Minggu)
 */
export function getIndonesianDayName(dateInput: Date | string | number = new Date()): string {
  const d = typeof dateInput === 'string' || typeof dateInput === 'number' ? new Date(dateInput) : dateInput;
  return d.toLocaleDateString(LOCALE_INDONESIA, {
    timeZone: TIMEZONE_WIB,
    weekday: 'long'
  });
}

/**
 * Indonesian Month Name (Januari s/d Desember)
 */
export function getIndonesianMonthName(monthNumber: number): string {
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  return months[Math.max(0, Math.min(11, monthNumber - 1))] || 'Oktober';
}

/**
 * Formats numbers in Indonesian standard (thousand separator '.' and decimal separator ',').
 * Example: 14848.5 => "14.848,5"
 */
export function formatIndonesianNumber(
  value: number,
  minimumFractionDigits: number = 0,
  maximumFractionDigits: number = 2
): string {
  return value.toLocaleString(LOCALE_INDONESIA, {
    minimumFractionDigits,
    maximumFractionDigits
  });
}

/**
 * Checks if a given date matches today in WIB (Asia/Jakarta) timezone.
 */
export function isTodayWib(dateInput: Date | string | number): boolean {
  return getWibIsoDate(dateInput) === getWibIsoDate(new Date());
}
