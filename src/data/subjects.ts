export type SubjectKey = 'navigation' | 'rieam' | 'meteorology' | 'safety' | 'tides' | 'communications' | 'legislation';

export interface SubjectInfo {
  name: string;
  icon: string;        // Ionicons icon name
  color: string;
  minPass: number;     // minimum pass percentage
  description: string; // Portuguese description
}

export const SUBJECTS: Record<SubjectKey, SubjectInfo> = {
  navigation: { name: 'Navegação', icon: 'compass-outline', color: '#1565C0', minPass: 75, description: 'Navegação e trabalho de carta' },
  rieam: { name: 'RIEAM', icon: 'warning-outline', color: '#E74C3C', minPass: 75, description: 'Regulamento Internacional para Evitar Abalroamentos no Mar' },
  meteorology: { name: 'Meteorologia', icon: 'cloud-outline', color: '#87CEEB', minPass: 60, description: 'Condições meteorológicas e previsão do tempo' },
  safety: { name: 'Segurança', icon: 'shield-checkmark-outline', color: '#00897B', minPass: 60, description: 'Segurança a bordo e procedimentos de emergência' },
  tides: { name: 'Marés', icon: 'water-outline', color: '#0F2847', minPass: 60, description: 'Marés e correntes' },
  communications: { name: 'Comunicações', icon: 'radio-outline', color: '#F4A935', minPass: 60, description: 'Radiocomunicações e GMDSS' },
  legislation: { name: 'Legislação', icon: 'document-text-outline', color: '#C4956A', minPass: 60, description: 'Legislação marítima portuguesa' },
};

export const SUBJECT_KEYS = Object.keys(SUBJECTS) as SubjectKey[];
export const OVERALL_MIN_PASS = 60;
export const REAL_EXAM_QUESTION_COUNT = 30;
export const REAL_EXAM_TIME_MINUTES = 180;
