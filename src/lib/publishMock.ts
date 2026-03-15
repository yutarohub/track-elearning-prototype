/**
 * コース公開管理（/admin/publish）用モック
 */

export type PublishStatus = "published" | "draft" | "archived";

export type PublishTarget = "e-learning" | "training" | "live";

export interface PublishedCourse {
  id: string;
  courseName: string;
  status: PublishStatus;
  publishTarget: PublishTarget;
  learners: number;
  updatedAt: string;
  // コース情報（参考: コースを公開フォーム）
  description?: string;
  difficulty?: string;
  recommendedAudience?: string;
  whatYouLearn?: string;
  imageUrl?: string;
  liveType?: "online" | "offline";
  // 公開設定
  enrollmentLimit?: "public" | "application";
  recommend?: boolean;
  providerInfo?: boolean;
  // 申込（要申込時）
  applyFlow?: "immediate" | "approval";
  applyStartDate?: string;
  applyEndDate?: string;
  isSubscription?: boolean;
  price?: string;
  applyPeriod?: string;
  // 想定受講者（スキル可視化プラットフォーム連動）
  jobRoleId?: string;
}

/** コース名等の固有名詞はマスキング（○○社等） */
export const MOCK_PUBLISHED_COURSES: PublishedCourse[] = [
  { id: "1", courseName: "フロントエンド開発入門", status: "published", publishTarget: "e-learning", learners: 12, updatedAt: "2025-03-10" },
  { id: "2", courseName: "TypeScript 基礎", status: "published", publishTarget: "e-learning", learners: 20, updatedAt: "2025-03-12" },
  { id: "3", courseName: "AI 基礎講座 知識編", status: "draft", publishTarget: "e-learning", learners: 0, updatedAt: "2025-03-13" },
  { id: "4", courseName: "データサイエンス入門", status: "published", publishTarget: "training", learners: 9, updatedAt: "2025-03-08" },
  { id: "5", courseName: "ライブハンズオン（オンライン開催）", status: "published", publishTarget: "live", learners: 5, updatedAt: "2025-03-14" },
  { id: "6", courseName: "DX 推進リーダー養成", status: "draft", publishTarget: "training", learners: 0, updatedAt: "2025-03-11" },
  { id: "7", courseName: "旧版・アジャイル入門", status: "archived", publishTarget: "training", learners: 30, updatedAt: "2024-12-01" },
];

export const STATUS_LABEL: Record<PublishStatus, string> = {
  published: "公開中",
  draft: "下書き",
  archived: "非公開（アーカイブ）",
};

export const TARGET_LABEL: Record<PublishTarget, string> = {
  "e-learning": "eラーニング",
  training: "研修",
  live: "ライブ",
};
