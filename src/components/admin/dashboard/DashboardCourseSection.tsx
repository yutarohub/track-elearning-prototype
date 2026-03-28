import { Layers } from "lucide-react";
import type { CourseStackItem } from "@/lib/dashboardMock";
import type { Course, CourseType, Difficulty } from "@/lib/mockData";
import { DashboardCourseAnalytics } from "./DashboardCourseAnalytics";
import { DashboardCourseCatalog } from "./DashboardCourseCatalog";

export interface DashboardCourseSectionProps {
  stackData: CourseStackItem[];
  catalog: {
    search: string;
    onSearchChange: (v: string) => void;
    typeFilter: "all" | CourseType;
    onTypeFilterChange: (v: "all" | CourseType) => void;
    difficultyFilter: "all" | Difficulty;
    onDifficultyFilterChange: (v: "all" | Difficulty) => void;
    page: number;
    onPageChange: (p: number) => void;
    filtered: Course[];
    paginated: Course[];
    totalPages: number;
    onRowClick: (course: Course) => void;
  };
}

export function DashboardCourseSection({ stackData, catalog }: DashboardCourseSectionProps) {
  return (
    <section id="dashboard-courses" aria-labelledby="dash-courses-heading" className="scroll-mt-24 space-y-4">
      <div className="flex items-center gap-2 text-slate-700">
        <Layers className="h-5 w-5 shrink-0 text-indigo-600" aria-hidden />
        <div>
          <h2 id="dash-courses-heading" className="text-sm font-semibold text-slate-900">
            3. コース・学習成果（詳細）
          </h2>
          <p className="text-xs text-slate-500">講座別の構成比を見たうえで、個別コースの運用情報にドリルダウンします。</p>
        </div>
      </div>
      <DashboardCourseAnalytics data={stackData} />
      <DashboardCourseCatalog {...catalog} />
    </section>
  );
}
