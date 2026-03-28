"use client";

import { useMemo, useState } from "react";
import { AppLayout } from "@/components/layout/AppLayout";
import {
  MOCK_AI_INSIGHTS,
  MOCK_TRACK_MAU_PLAN_LIMIT,
  MOCK_MAU_BY_MONTH,
  MOCK_COHORT_RETENTION,
  MOCK_COURSE_STACK,
} from "@/lib/dashboardMock";
import { MOCK_LEARNING_HEALTH_KPIS } from "@/lib/adminPhase2Mock";
import { MOCK_COURSES } from "@/lib/mockData";
import type { Course, CourseType, Difficulty } from "@/lib/mockData";
import { getDepartmentById, getDepartmentScale } from "@/lib/orgMock";
import { buildExecutiveSummaryLine, findRiskInsight } from "@/lib/dashboardExecutiveSummary";
import { DashboardStoryHeader } from "@/components/admin/dashboard/DashboardStoryHeader";
import {
  DashboardGlobalFilters,
  type DepartmentId,
} from "@/components/admin/dashboard/DashboardGlobalFilters";
import {
  DashboardSectionNav,
  type DashboardSectionTab,
} from "@/components/admin/dashboard/DashboardSectionNav";
import { DashboardExecutiveSummary } from "@/components/admin/dashboard/DashboardExecutiveSummary";
import { DashboardEngagementSection } from "@/components/admin/dashboard/DashboardEngagementSection";
import type { MauTab } from "@/components/admin/dashboard/DashboardMauBlock";
import { DashboardCourseSection } from "@/components/admin/dashboard/DashboardCourseSection";
import { DashboardCourseDrawer } from "@/components/admin/dashboard/DashboardCourseDrawer";

const PER_PAGE = 10;

export default function DashboardPage() {
  const [drawerCourse, setDrawerCourse] = useState<Course | null>(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<"all" | CourseType>("all");
  const [difficultyFilter, setDifficultyFilter] = useState<"all" | Difficulty>("all");
  const [page, setPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState<string>(() => {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  });
  const [mauTab, setMauTab] = useState<MauTab>("platform");
  const [selectedDepartmentId, setSelectedDepartmentId] = useState<DepartmentId>("all");
  const [sectionTab, setSectionTab] = useState<DashboardSectionTab>("summary");

  const filtered = useMemo(() => {
    let list = MOCK_COURSES;
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) => c.title.toLowerCase().includes(q) || c.type.toLowerCase().includes(q)
      );
    }
    if (typeFilter !== "all") list = list.filter((c) => c.type === typeFilter);
    if (difficultyFilter !== "all") list = list.filter((c) => c.difficulty === difficultyFilter);
    return list;
  }, [search, typeFilter, difficultyFilter]);

  const totalPages = Math.ceil(filtered.length / PER_PAGE) || 1;
  const paginated = useMemo(
    () => filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE),
    [filtered, page]
  );

  const currentMonthData = MOCK_MAU_BY_MONTH.find((m) => m.yearMonth === selectedMonth);
  const deptScale = getDepartmentScale(selectedDepartmentId);
  const platformMau = Math.round((currentMonthData?.platform ?? 0) * deptScale);
  const trackOfficialMau = Math.round((currentMonthData?.trackOfficial ?? 0) * deptScale);
  const trackMauPercent = Math.round((trackOfficialMau / MOCK_TRACK_MAU_PLAN_LIMIT) * 100);
  const selectedDepartment = getDepartmentById(selectedDepartmentId);
  const selectedMonthLabel = currentMonthData?.label ?? selectedMonth;

  const executiveSummaryLine = buildExecutiveSummaryLine({
    monthLabel: selectedMonthLabel,
    trackOfficialMau,
    planLimit: MOCK_TRACK_MAU_PLAN_LIMIT,
    trackMauPercent,
    riskInsight: findRiskInsight(MOCK_AI_INSIGHTS),
  });

  const scopeLabel = selectedDepartment ? `${selectedDepartment.name}（配下含む）` : "全社";

  return (
    <AppLayout>
      <div className="space-y-6 px-6 py-6">
        <DashboardStoryHeader
          executiveSummaryLine={executiveSummaryLine}
          filters={
            <DashboardGlobalFilters
              selectedDepartmentId={selectedDepartmentId}
              onDepartmentChange={setSelectedDepartmentId}
              selectedMonth={selectedMonth}
              onMonthChange={setSelectedMonth}
              monthOptions={MOCK_MAU_BY_MONTH.map((m) => ({
                yearMonth: m.yearMonth,
                label: m.label,
              }))}
              scopeLabel={scopeLabel}
            />
          }
        />

        <DashboardSectionNav active={sectionTab} onChange={setSectionTab} />

        {sectionTab === "summary" && (
          <DashboardExecutiveSummary
            kpis={MOCK_LEARNING_HEALTH_KPIS}
            trackOfficialMau={trackOfficialMau}
            planLimit={MOCK_TRACK_MAU_PLAN_LIMIT}
            trackMauPercent={trackMauPercent}
          />
        )}

        {sectionTab === "engagement" && (
          <DashboardEngagementSection
            mauTab={mauTab}
            onMauTabChange={setMauTab}
            mauByMonth={MOCK_MAU_BY_MONTH}
            platformMau={platformMau}
            trackOfficialMau={trackOfficialMau}
            planLimit={MOCK_TRACK_MAU_PLAN_LIMIT}
            trackMauPercent={trackMauPercent}
            selectedMonthLabel={selectedMonthLabel}
            cohortRows={MOCK_COHORT_RETENTION}
            insights={MOCK_AI_INSIGHTS}
          />
        )}

        {sectionTab === "courses" && (
          <DashboardCourseSection
            stackData={MOCK_COURSE_STACK}
            catalog={{
              search,
              onSearchChange: setSearch,
              typeFilter,
              onTypeFilterChange: setTypeFilter,
              difficultyFilter,
              onDifficultyFilterChange: setDifficultyFilter,
              page,
              onPageChange: setPage,
              filtered,
              paginated,
              totalPages,
              onRowClick: setDrawerCourse,
            }}
          />
        )}
      </div>

      <DashboardCourseDrawer course={drawerCourse} onClose={() => setDrawerCourse(null)} />
    </AppLayout>
  );
}
