export type BookStage = 'Queue' | 'Processing' | 'Done' | 'Shared';

export interface Book {
  id: string;
  title: string;
  author: string;
  narrator: string;
  duration: string;       // e.g. "9h 22m"
  progress: number;       // 0–100 percent (used for Processing stage bar)
  stage: BookStage;
  stagedAt: string;       // ISO date — when it entered the current stage
  genre: string;
}

// Reference date: 2026-05-24
export const TODAY = '2026-05-24';

export function daysSince(dateStr: string): number {
  const then = new Date(dateStr).getTime();
  const now  = new Date(TODAY).getTime();
  return Math.floor((now - then) / 86_400_000);
}

export const STAGE_META: Record<BookStage, { label: string; color: string; headerBorder: string; icon: string }> = {
  Queue:      { label: 'Queue',      color: 'text-sky-400',    headerBorder: 'border-sky-500',    icon: '📥' },
  Processing: { label: 'Processing', color: 'text-yellow-300', headerBorder: 'border-yellow-400', icon: '⚙️' },
  Done:       { label: 'Done',       color: 'text-green-400',  headerBorder: 'border-green-500',  icon: '✅' },
  Shared:     { label: 'Shared',     color: 'text-purple-400', headerBorder: 'border-purple-500', icon: '🔗' },
};

export const STAGES: BookStage[] = ['Queue', 'Processing', 'Done', 'Shared'];

export const INITIAL_BOOKS: Book[] = [
  // Queue
  { id: 'b1', title: 'The Midnight Library',     author: 'Matt Haig',          narrator: 'Carey Mulligan',   duration: '8h 11m', progress: 0,  stage: 'Queue',      stagedAt: '2026-05-23', genre: 'Fiction'   },
  { id: 'b2', title: 'Project Hail Mary',         author: 'Andy Weir',          narrator: 'Ray Porter',       duration: '16h 10m',progress: 0,  stage: 'Queue',      stagedAt: '2026-05-14', genre: 'Sci-Fi'    },
  { id: 'b3', title: 'Educated',                  author: 'Tara Westover',      narrator: 'Julia Whelan',     duration: '12h 10m',progress: 0,  stage: 'Queue',      stagedAt: '2026-05-20', genre: 'Memoir'    },
  // Processing
  { id: 'b4', title: 'Atomic Habits',             author: 'James Clear',        narrator: 'James Clear',      duration: '5h 35m', progress: 62, stage: 'Processing', stagedAt: '2026-05-22', genre: 'Self-Help' },
  { id: 'b5', title: 'Dune',                      author: 'Frank Herbert',      narrator: 'Simon Vance',      duration: '21h 2m', progress: 29, stage: 'Processing', stagedAt: '2026-05-10', genre: 'Sci-Fi'    },
  { id: 'b6', title: 'The Body Keeps the Score',  author: 'Bessel van der Kolk',narrator: 'Sean Pratt',       duration: '16h 11m',progress: 85, stage: 'Processing', stagedAt: '2026-05-18', genre: 'Psychology'},
  // Done
  { id: 'b7', title: 'Sapiens',                   author: 'Yuval Noah Harari',  narrator: 'Derek Perkins',    duration: '15h 17m',progress: 100,stage: 'Done',       stagedAt: '2026-05-21', genre: 'History'   },
  { id: 'b8', title: 'The Alchemist',             author: 'Paulo Coelho',       narrator: 'Jeremy Irons',     duration: '4h 15m', progress: 100,stage: 'Done',       stagedAt: '2026-05-13', genre: 'Fiction'   },
  // Shared
  { id: 'b9', title: 'Born a Crime',              author: 'Trevor Noah',        narrator: 'Trevor Noah',      duration: '8h 44m', progress: 100,stage: 'Shared',     stagedAt: '2026-05-24', genre: 'Memoir'    },
  { id: 'b10',title: 'Becoming',                  author: 'Michelle Obama',     narrator: 'Michelle Obama',   duration: '19h 3m', progress: 100,stage: 'Shared',     stagedAt: '2026-05-15', genre: 'Biography' },
];
