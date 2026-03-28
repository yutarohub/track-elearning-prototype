/**
 * フェーズ2（管理者）向けモック — 申請・メンバー・契約・ダッシュボードKPI
 */

export type ApplicationStatus = "pending" | "approved" | "rejected";

export interface CourseApplication {
  id: string;
  applicantName: string;
  applicantEmail: string;
  courseTitle: string;
  requestedAt: string;
  status: ApplicationStatus;
  note?: string;
}

export const MOCK_COURSE_APPLICATIONS: CourseApplication[] = [
  {
    id: "app-1",
    applicantName: "佐藤 花子",
    applicantEmail: "hanako.sato@example.com",
    courseTitle: "DX推進リーダーシップ（有償）",
    requestedAt: "2026-03-26",
    status: "pending",
    note: "事業部長承認済み・人事確認待ち",
  },
  {
    id: "app-2",
    applicantName: "鈴木 一郎",
    applicantEmail: "ichiro.suzuki@example.com",
    courseTitle: "データ分析(Python) 基礎講座（有償）",
    requestedAt: "2026-03-25",
    status: "pending",
  },
  {
    id: "app-3",
    applicantName: "高橋 美咲",
    applicantEmail: "misaki.takahashi@example.com",
    courseTitle: "生成AIガバナンスとリスク管理",
    requestedAt: "2026-03-20",
    status: "approved",
  },
  {
    id: "app-4",
    applicantName: "伊藤 健",
    applicantEmail: "ken.ito@example.com",
    courseTitle: "クラウドアーキテクチャ設計（中級）",
    requestedAt: "2026-03-18",
    status: "rejected",
    note: "ライセンス枠超過",
  },
];

export interface AdminMember {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  lastActive: string;
  trackMauCounted: boolean;
}

export const MOCK_ADMIN_MEMBERS: AdminMember[] = [
  {
    id: "m-1",
    name: "岩崎 雄太郎",
    email: "yutaro.iwasaki@example.com",
    department: "プロダクト開発本部",
    role: "受講者",
    lastActive: "2026-03-28 09:12",
    trackMauCounted: true,
  },
  {
    id: "m-2",
    name: "佐藤 花子",
    email: "hanako.sato@example.com",
    department: "カスタマーサクセス",
    role: "受講者",
    lastActive: "2026-03-27 18:40",
    trackMauCounted: true,
  },
  {
    id: "m-3",
    name: "管理者 太郎",
    email: "admin.track@example.com",
    department: "人事・人材開発",
    role: "管理者",
    lastActive: "2026-03-28 08:05",
    trackMauCounted: false,
  },
];

export interface ContractSummary {
  planName: string;
  mauLimit: number;
  mauCurrent: number;
  licenseSeats: number;
  licenseInUse: number;
  renewalDate: string;
}

export const MOCK_CONTRACT_SUMMARY: ContractSummary = {
  planName: "Track e-learning Enterprise（プロトタイプ）",
  mauLimit: 500,
  mauCurrent: 312,
  licenseSeats: 1200,
  licenseInUse: 884,
  renewalDate: "2027-03-31",
};

/** Miro 準拠のダッシュボード上段KPI（モック） */
export interface LearningHealthKpi {
  label: string;
  value: string;
  sub: string;
  trend?: string;
  accent: "emerald" | "sky" | "violet";
}

export const MOCK_LEARNING_HEALTH_KPIS: LearningHealthKpi[] = [
  {
    label: "学習ヘルス",
    value: "82",
    sub: "スコア（完了率・定着・満足度の合成・モック）",
    trend: "先月比 +4",
    accent: "emerald",
  },
  {
    label: "学習状況（アクティブ）",
    value: "68%",
    sub: "直近30日で1コース以上アクティブな割合",
    trend: "目標 70% に対し -2pt",
    accent: "sky",
  },
  {
    label: "MAU（Track公式・当月）",
    value: "312",
    sub: "課金対象MAU / 上限 500",
    trend: "上限の 62%",
    accent: "violet",
  },
];
