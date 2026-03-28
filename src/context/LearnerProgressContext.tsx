"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export interface LearnerProgressState {
  completedCourseIds: number[];
  earnedBadgeIds: string[];
  updatedSkillIds: string[];
}

type LearnerProgressContextValue = LearnerProgressState & {
  markCourseCompleted: (courseId: number) => void;
  addBadge: (badgeId: string) => void;
  addUpdatedSkill: (skillId: string) => void;
};

const LearnerProgressContext = createContext<LearnerProgressContextValue | null>(null);

export function LearnerProgressProvider({ children }: { children: ReactNode }) {
  const [completedCourseIds, setCompletedCourseIds] = useState<number[]>([]);
  const [earnedBadgeIds, setEarnedBadgeIds] = useState<string[]>([]);
  const [updatedSkillIds, setUpdatedSkillIds] = useState<string[]>([]);

  const markCourseCompleted = useCallback((courseId: number) => {
    setCompletedCourseIds((prev) => (prev.includes(courseId) ? prev : [...prev, courseId]));
  }, []);

  const addBadge = useCallback((badgeId: string) => {
    setEarnedBadgeIds((prev) => (prev.includes(badgeId) ? prev : [...prev, badgeId]));
  }, []);

  const addUpdatedSkill = useCallback((skillId: string) => {
    setUpdatedSkillIds((prev) => (prev.includes(skillId) ? prev : [...prev, skillId]));
  }, []);

  const value = useMemo(
    () => ({
      completedCourseIds,
      earnedBadgeIds,
      updatedSkillIds,
      markCourseCompleted,
      addBadge,
      addUpdatedSkill,
    }),
    [
      completedCourseIds,
      earnedBadgeIds,
      updatedSkillIds,
      markCourseCompleted,
      addBadge,
      addUpdatedSkill,
    ],
  );

  return (
    <LearnerProgressContext.Provider value={value}>{children}</LearnerProgressContext.Provider>
  );
}

export function useLearnerProgress() {
  const ctx = useContext(LearnerProgressContext);
  if (!ctx) {
    throw new Error("useLearnerProgress must be used within LearnerProgressProvider");
  }
  return ctx;
}
