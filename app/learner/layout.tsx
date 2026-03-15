"use client";

import { TraineeLayout } from "@/components/layout/TraineeLayout";

export default function LearnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <TraineeLayout>{children}</TraineeLayout>;
}
