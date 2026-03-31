// Simple client-side store for tracking practice stats

export interface PracticeStats {
  totalAttempted: number;
  totalCorrect: number;
  totalWithWork: number;
  byCategory: Record<
    string,
    { attempted: number; correct: number }
  >;
  weeklyData: { day: string; correct: number; total: number }[];
}

const STORAGE_KEY = "khohai-learn-stats";

const defaultStats: PracticeStats = {
  totalAttempted: 0,
  totalCorrect: 0,
  totalWithWork: 0,
  byCategory: {
    algebra: { attempted: 0, correct: 0 },
    calculus: { attempted: 0, correct: 0 },
    probability: { attempted: 0, correct: 0 },
    geometry: { attempted: 0, correct: 0 },
  },
  weeklyData: [
    { day: "จันทร์", correct: 0, total: 0 },
    { day: "อังคาร", correct: 0, total: 0 },
    { day: "พุธ", correct: 0, total: 0 },
    { day: "พฤหัส", correct: 0, total: 0 },
    { day: "ศุกร์", correct: 0, total: 0 },
    { day: "เสาร์", correct: 0, total: 0 },
    { day: "อาทิตย์", correct: 0, total: 0 },
  ],
};

export function getStats(): PracticeStats {
  if (typeof window === "undefined") return defaultStats;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultStats;
    return JSON.parse(raw) as PracticeStats;
  } catch {
    return defaultStats;
  }
}

export function recordAnswer(category: string, correct: boolean, showedWork?: boolean) {
  const stats = getStats();
  stats.totalAttempted += 1;
  if (correct) stats.totalCorrect += 1;
  if (showedWork) stats.totalWithWork = (stats.totalWithWork || 0) + 1;

  if (!stats.byCategory[category]) {
    stats.byCategory[category] = { attempted: 0, correct: 0 };
  }
  stats.byCategory[category].attempted += 1;
  if (correct) stats.byCategory[category].correct += 1;

  // Update today's weekly data
  const dayIndex = new Date().getDay();
  // Convert: 0=Sun → index 6, 1=Mon → index 0, etc.
  const idx = dayIndex === 0 ? 6 : dayIndex - 1;
  stats.weeklyData[idx].total += 1;
  if (correct) stats.weeklyData[idx].correct += 1;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(stats));
  return stats;
}
