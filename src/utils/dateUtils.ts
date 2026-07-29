export interface CalculatedAge {
  days: number;
  weeks: number;
  months: number;
  formatted: string;
}

/**
 * Calculates age in Days, Weeks, and Months from a birth or acquisition date.
 */
export function calculateAge(startDateStr: string): CalculatedAge {
  if (!startDateStr) {
    return { days: 0, weeks: 0, months: 0, formatted: '0d (0w / 0m)' };
  }

  const start = new Date(startDateStr);
  const now = new Date();

  const diffTime = Math.max(0, now.getTime() - start.getTime());
  const totalDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  const totalWeeks = Math.floor(totalDays / 7);
  
  // Approximate months
  let months = (now.getFullYear() - start.getFullYear()) * 12 + (now.getMonth() - start.getMonth());
  if (now.getDate() < start.getDate()) {
    months--;
  }
  months = Math.max(0, months);

  let formatted = '';
  if (months >= 1) {
    const remDays = totalDays - Math.floor(months * 30.4375);
    formatted = `${months}m ${Math.max(0, Math.floor(remDays / 7))}w (${totalDays}d)`;
  } else if (totalWeeks >= 1) {
    const remDays = totalDays % 7;
    formatted = `${totalWeeks}w ${remDays}d (${totalDays}d)`;
  } else {
    formatted = `${totalDays} days`;
  }

  return {
    days: totalDays,
    weeks: totalWeeks,
    months,
    formatted,
  };
}

/**
 * Gets standard incubation days by species.
 * Chicken: 21 days
 * Turkey: 28 days
 * Duck: 28 days
 * Quail: 17 days
 * Goose: 30 days
 */
export function getIncubationDaysForSpecies(species: string): number {
  switch (species) {
    case 'Turkey':
      return 28;
    case 'Duck':
      return 28;
    case 'Quail':
      return 17;
    case 'Goose':
      return 30;
    case 'Chicken':
    default:
      return 21;
  }
}

/**
 * Calculates days remaining until expected hatch date.
 */
export function calculateDaysRemaining(expectedHatchDateStr: string): { daysLeft: number; progressPercent: number; totalDays: number } {
  if (!expectedHatchDateStr) return { daysLeft: 0, progressPercent: 100, totalDays: 21 };

  const target = new Date(expectedHatchDateStr);
  const now = new Date();
  const diffTime = target.getTime() - now.getTime();
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return {
    daysLeft: Math.max(0, daysLeft),
    progressPercent: daysLeft <= 0 ? 100 : Math.max(0, Math.min(99, Math.round(((21 - daysLeft) / 21) * 100))),
    totalDays: 21,
  };
}

/**
 * Formats a YYYY-MM-DD date string into readable local format (e.g., "Jul 29, 2026")
 */
export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

/**
 * Returns today's date in YYYY-MM-DD string format
 */
export function getTodayDateString(): string {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}
