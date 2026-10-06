// In-memory System Design progress. React state only - no persistence of any
// kind, no backend. A refresh resets it (by design).
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const ProgressContext = createContext(null);

export function SystemDesignProgress({ children }) {
  const [completedLessons, setCompletedLessons] = useState(() => new Set());

  const completeLesson = useCallback((lessonId) => {
    setCompletedLessons((prev) => {
      if (prev.has(lessonId)) return prev;
      const next = new Set(prev);
      next.add(lessonId);
      return next;
    });
  }, []);

  const restartLessons = useCallback(() => setCompletedLessons(new Set()), []);

  const value = useMemo(
    () => ({ completedLessons, completeLesson, restartLessons }),
    [completedLessons, completeLesson, restartLessons]
  );

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useSystemDesignProgress() {
  const ctx = useContext(ProgressContext);
  if (!ctx) {
    throw new Error(
      "useSystemDesignProgress must be used inside SystemDesignProgress"
    );
  }
  return ctx;
}
