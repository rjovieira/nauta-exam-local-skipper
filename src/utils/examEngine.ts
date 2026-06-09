import { SubjectKey } from '../data/subjects';

export interface Question {
  id: string;
  subject: SubjectKey;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
  assets: string | null;
}

export interface ExamResult {
  id: string;
  mode: 'real' | 'study' | 'custom';
  date: string;
  totalQuestions: number;
  correctAnswers: number;
  percentage: number;
  passed: boolean;
  timeSpent: number; // seconds
  subjectResults: Record<SubjectKey, SubjectResult>;
  answers: AnswerRecord[];
}

export interface SubjectResult {
  total: number;
  correct: number;
  percentage: number;
  passed: boolean;
  minPass: number;
}

export interface AnswerRecord {
  questionId: string;
  selectedAnswer: number | null;
  correctAnswer: number;
  isCorrect: boolean;
}

/**
 * Shuffle and select questions for an exam
 */
export function selectQuestions(
  allQuestions: Question[],
  count: number,
  subjects?: SubjectKey[]
): Question[] {
  let filtered = allQuestions;
  if (subjects && subjects.length > 0) {
    filtered = allQuestions.filter(q => subjects.includes(q.subject));
  }
  
  // Fisher-Yates shuffle
  const shuffled = [...filtered];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  return shuffled.slice(0, Math.min(count, shuffled.length));
}

/**
 * Calculate exam results from answers
 */
export function calculateResults(
  questions: Question[],
  answers: Record<number, number>,
  mode: 'real' | 'study' | 'custom',
  timeSpent: number,
  subjectMinPass: Record<SubjectKey, number>
): ExamResult {
  const answerRecords: AnswerRecord[] = questions.map((q, i) => ({
    questionId: q.id,
    selectedAnswer: answers[i] ?? null,
    correctAnswer: q.correctAnswer,
    isCorrect: answers[i] === q.correctAnswer,
  }));

  const correctAnswers = answerRecords.filter(a => a.isCorrect).length;
  const percentage = Math.round((correctAnswers / questions.length) * 100);

  // Calculate per-subject results
  const subjectResults: Record<string, SubjectResult> = {};
  const subjectGroups: Record<string, { total: number; correct: number }> = {};

  questions.forEach((q, i) => {
    if (!subjectGroups[q.subject]) {
      subjectGroups[q.subject] = { total: 0, correct: 0 };
    }
    subjectGroups[q.subject].total++;
    if (answers[i] === q.correctAnswer) {
      subjectGroups[q.subject].correct++;
    }
  });

  Object.entries(subjectGroups).forEach(([subject, data]) => {
    const pct = Math.round((data.correct / data.total) * 100);
    const minPass = subjectMinPass[subject as SubjectKey] || 60;
    subjectResults[subject] = {
      total: data.total,
      correct: data.correct,
      percentage: pct,
      passed: pct >= minPass,
      minPass,
    };
  });

  // Overall pass: >= 60% AND all subjects meet minimums
  const allSubjectsPassed = Object.values(subjectResults).every(s => s.passed);
  const passed = percentage >= 60 && allSubjectsPassed;

  return {
    id: `exam-${Date.now()}`,
    mode,
    date: new Date().toISOString(),
    totalQuestions: questions.length,
    correctAnswers,
    percentage,
    passed,
    timeSpent,
    subjectResults: subjectResults as Record<SubjectKey, SubjectResult>,
    answers: answerRecords,
  };
}

/**
 * Format seconds to MM:SS or HH:MM:SS
 */
export function formatTime(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Generate a unique exam ID
 */
export function generateExamId(): string {
  return `exam-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}
