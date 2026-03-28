"use client";

import { TraineeShellLayout } from "@/components/layout/TraineeShellLayout";
import { TrackLearnerSidebar } from "@/components/layout/TrackLearnerSidebar";

export default function TrackLearnerLayout({ children }: { children: React.ReactNode }) {
  return <TraineeShellLayout sidebar={<TrackLearnerSidebar />}>{children}</TraineeShellLayout>;
}
