import React, { createContext, useContext, useReducer, useCallback, useRef, useEffect } from 'react';
import { Question, ExamResult, calculateResults, selectQuestions } from '@/utils/examEngine';
import { SUBJECTS, SubjectKey, REAL_EXAM_QUESTION_COUNT, REAL_EXAM_TIME_MINUTES } from '@/data/subjects';
import questionsData from '@/data/questions.json';
import { saveExamResult } from '@/utils/storage';

export type ExamMode = 'real' | 'study' | 'custom';

export interface ExamConfig {
  questionCount: number;
  subjects: SubjectKey[];
  timeLimit: number | null; // in seconds, null = no limit
}

interface ExamState {
  mode: ExamMode | null;
  questions: Question[];
  currentIndex: number;
  answers: Record<number, number>;
  timeRemaining: number | null;
  timeSpent: number;
  isFinished: boolean;
  isStarted: boolean;
  config: ExamConfig;
  result: ExamResult | null;
  showFeedback: boolean; // for study mode
}

type ExamAction =
  | { type: 'START_EXAM'; mode: ExamMode; config?: ExamConfig }
  | { type: 'ANSWER_QUESTION'; questionIndex: number; answerIndex: number }
  | { type: 'NEXT_QUESTION' }
  | { type: 'PREV_QUESTION' }
  | { type: 'GO_TO_QUESTION'; index: number }
  | { type: 'TICK_TIMER' }
  | { type: 'FINISH_EXAM' }
  | { type: 'SHOW_FEEDBACK'; show: boolean }
  | { type: 'RESET' };

const initialState: ExamState = {
  mode: null,
  questions: [],
  currentIndex: 0,
  answers: {},
  timeRemaining: null,
  timeSpent: 0,
  isFinished: false,
  isStarted: false,
  config: {
    questionCount: REAL_EXAM_QUESTION_COUNT,
    subjects: [],
    timeLimit: null,
  },
  result: null,
  showFeedback: false,
};

function getDefaultConfig(mode: ExamMode): ExamConfig {
  switch (mode) {
    case 'real':
      return {
        questionCount: REAL_EXAM_QUESTION_COUNT,
        subjects: [],
        timeLimit: REAL_EXAM_TIME_MINUTES * 60,
      };
    case 'study':
      return {
        questionCount: 10,
        subjects: [],
        timeLimit: null,
      };
    case 'custom':
      return {
        questionCount: 20,
        subjects: [],
        timeLimit: null,
      };
  }
}

function examReducer(state: ExamState, action: ExamAction): ExamState {
  switch (action.type) {
    case 'START_EXAM': {
      const config = action.config || getDefaultConfig(action.mode);
      const allQuestions = questionsData.questions as Question[];
      const selected = selectQuestions(
        allQuestions,
        config.questionCount,
        config.subjects.length > 0 ? config.subjects : undefined
      );
      return {
        ...initialState,
        mode: action.mode,
        questions: selected,
        config,
        timeRemaining: config.timeLimit,
        isStarted: true,
        timeSpent: 0,
      };
    }
    case 'ANSWER_QUESTION': {
      return {
        ...state,
        answers: {
          ...state.answers,
          [action.questionIndex]: action.answerIndex,
        },
        showFeedback: state.mode === 'study',
      };
    }
    case 'NEXT_QUESTION': {
      if (state.currentIndex < state.questions.length - 1) {
        return {
          ...state,
          currentIndex: state.currentIndex + 1,
          showFeedback: false,
        };
      }
      return state;
    }
    case 'PREV_QUESTION': {
      if (state.currentIndex > 0) {
        return {
          ...state,
          currentIndex: state.currentIndex - 1,
          showFeedback: false,
        };
      }
      return state;
    }
    case 'GO_TO_QUESTION': {
      if (action.index >= 0 && action.index < state.questions.length) {
        return {
          ...state,
          currentIndex: action.index,
          showFeedback: false,
        };
      }
      return state;
    }
    case 'TICK_TIMER': {
      if (state.timeRemaining !== null && state.timeRemaining > 0) {
        const newTime = state.timeRemaining - 1;
        return {
          ...state,
          timeRemaining: newTime,
          timeSpent: state.timeSpent + 1,
          isFinished: newTime <= 0,
        };
      }
      return {
        ...state,
        timeSpent: state.timeSpent + 1,
      };
    }
    case 'FINISH_EXAM': {
      const subjectMinPass: Record<SubjectKey, number> = {} as Record<SubjectKey, number>;
      Object.entries(SUBJECTS).forEach(([key, val]) => {
        subjectMinPass[key as SubjectKey] = val.minPass;
      });
      const result = calculateResults(
        state.questions,
        state.answers,
        state.mode || 'real',
        state.timeSpent,
        subjectMinPass
      );
      return {
        ...state,
        isFinished: true,
        result,
      };
    }
    case 'SHOW_FEEDBACK': {
      return { ...state, showFeedback: action.show };
    }
    case 'RESET': {
      return initialState;
    }
    default:
      return state;
  }
}

interface ExamContextValue {
  state: ExamState;
  startExam: (mode: ExamMode, config?: ExamConfig) => void;
  answerQuestion: (questionIndex: number, answerIndex: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;
  goToQuestion: (index: number) => void;
  finishExam: () => Promise<void>;
  resetExam: () => void;
  currentQuestion: Question | null;
  progress: number;
  answeredCount: number;
}

const ExamContext = createContext<ExamContextValue | null>(null);

export function ExamProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(examReducer, initialState);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Timer management
  useEffect(() => {
    if (state.isStarted && !state.isFinished) {
      timerRef.current = setInterval(() => {
        dispatch({ type: 'TICK_TIMER' });
      }, 1000);
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    };
  }, [state.isStarted, state.isFinished]);

  // Auto-finish when timer runs out
  useEffect(() => {
    if (state.timeRemaining !== null && state.timeRemaining <= 0 && !state.isFinished && state.isStarted) {
      finishExam();
    }
  }, [state.timeRemaining]);

  const startExam = useCallback((mode: ExamMode, config?: ExamConfig) => {
    dispatch({ type: 'START_EXAM', mode, config });
  }, []);

  const answerQuestion = useCallback((questionIndex: number, answerIndex: number) => {
    dispatch({ type: 'ANSWER_QUESTION', questionIndex, answerIndex });
  }, []);

  const nextQuestion = useCallback(() => {
    dispatch({ type: 'NEXT_QUESTION' });
  }, []);

  const prevQuestion = useCallback(() => {
    dispatch({ type: 'PREV_QUESTION' });
  }, []);

  const goToQuestion = useCallback((index: number) => {
    dispatch({ type: 'GO_TO_QUESTION', index });
  }, []);

  const finishExam = useCallback(async () => {
    dispatch({ type: 'FINISH_EXAM' });
    // Save result (we'll get it from the next render)
  }, []);

  // Save result when exam finishes
  useEffect(() => {
    if (state.result) {
      saveExamResult(state.result);
    }
  }, [state.result]);

  const resetExam = useCallback(() => {
    dispatch({ type: 'RESET' });
  }, []);

  const currentQuestion = state.questions[state.currentIndex] || null;
  const progress = state.questions.length > 0
    ? (state.currentIndex + 1) / state.questions.length
    : 0;
  const answeredCount = Object.keys(state.answers).length;

  return (
    <ExamContext.Provider
      value={{
        state,
        startExam,
        answerQuestion,
        nextQuestion,
        prevQuestion,
        goToQuestion,
        finishExam,
        resetExam,
        currentQuestion,
        progress,
        answeredCount,
      }}
    >
      {children}
    </ExamContext.Provider>
  );
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) {
    throw new Error('useExam must be used within an ExamProvider');
  }
  return context;
}
