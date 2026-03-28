"use client";

import { TraineeShellLayout } from "@/components/layout/TraineeShellLayout";
import { SkillHubSidebar } from "@/components/layout/SkillHubSidebar";

export default function SkillHubLayout({ children }: { children: React.ReactNode }) {
  return <TraineeShellLayout sidebar={<SkillHubSidebar />}>{children}</TraineeShellLayout>;
}
