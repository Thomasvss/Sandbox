const SCORES_KEY = 'equalizer-run-scores';
const NAME_KEY = 'equalizer-run-name';
const MAX_SAVED_SCORES = 100;

export const MAX_NAME_LENGTH = 16;

export interface HighScore {
  name: string;
  score: number;
  savedAt: number;
}

export function loadHighScores(): HighScore[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(SCORES_KEY) ?? '[]');
    return Array.isArray(saved) ? saved.filter(isHighScore).sort(byScore) : [];
  } catch {
    return [];
  }
}

/** Adds a score and returns the updated table, highest score first. */
export function addHighScore(scores: HighScore[], entry: HighScore): HighScore[] {
  const updated = [...scores, entry].sort(byScore).slice(0, MAX_SAVED_SCORES);
  try {
    localStorage.setItem(SCORES_KEY, JSON.stringify(updated));
    localStorage.setItem(NAME_KEY, entry.name);
  } catch {
    // The table still works for this visit if storage is unavailable.
  }
  return updated;
}

export function loadLastName(): string {
  try {
    return localStorage.getItem(NAME_KEY) ?? '';
  } catch {
    return '';
  }
}

function byScore(a: HighScore, b: HighScore): number {
  return b.score - a.score || a.savedAt - b.savedAt;
}

function isHighScore(value: unknown): value is HighScore {
  const entry = value as HighScore | null;
  return (
    typeof entry?.name === 'string' &&
    typeof entry.score === 'number' &&
    typeof entry.savedAt === 'number'
  );
}
