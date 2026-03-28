"use client";

import { LearnerProgressProvider } from "@/context/LearnerProgressContext";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <LearnerProgressProvider>{children}</LearnerProgressProvider>;
}
