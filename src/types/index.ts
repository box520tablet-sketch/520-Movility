export type SectionType = 'general' | 'movement';

export interface CategoryTab {
  id: string;
  name: string;
  section: SectionType;
  description?: string;
  order: number;
  isCustom?: boolean;
}

export interface Exercise {
  id: string;
  title: string;
  youtubeUrl: string;
  tabId: string;
  section: SectionType;
  durationSeconds: number; // Suggested duration in seconds (e.g. 120s = 2 min)
  hasSides: boolean; // Does it require Left & Right side stretches
  description: string;
  equipment: string; // e.g. "Banda elástica", "Foam roller", "Pica / PVC", "Sin material"
  difficulty: 'Principiante' | 'Intermedio' | 'Avanzado';
  targetFocus: string; // e.g. "Cápsula anterior", "Rotación externa", "Dorsiflexión"
  createdAt: string;
}

export interface User {
  id: string;
  name: string;
  phone: string;
  password?: string;
  role: 'user' | 'admin';
  createdAt: string;
  routinesCompleted: number;
  favoriteIds: string[];
}

export interface WorkoutSession {
  exercise: Exercise;
  currentSide: 'left' | 'right' | 'both';
  timeLeft: number;
  isRunning: boolean;
  totalElapsed: number;
}
