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
  /** ライブ・外部連携向けの講師情報 */
  instructorName?: string;
  instructorAvatarUrl?: string;
  instructorBio?: string;
  /** ライブ開催の次回日程（表示用） */
  nextLiveSchedule?: string;
  // 公開設定
  enrollmentLimit?: "public" | "application";
  recommend?: boolean;
  providerInfo?: boolean;
  /** 提供者情報を表示が有効なときの組織名・ロゴ・作成者 */
  providerName?: string;
  providerLogoUrl?: string;
  providerCreator?: string;
  // 申込（要申込時）
  applyFlow?: "immediate" | "approval";
  applyStartDate?: string;
  applyEndDate?: string;
  isSubscription?: boolean;
  price?: string;
  applyPeriod?: string;
  // 想定受講者（スキル開発プラットフォーム連動）
  jobRoleId?: string;
  // タグ（ライブラリフィルター・検索用）
  tags?: string[];
}

/** コース名等の固有名詞はマスキング（○○社等） */
export const MOCK_PUBLISHED_COURSES: PublishedCourse[] = [
  { id: "1", courseName: "フロントエンド開発入門", status: "published", publishTarget: "e-learning", learners: 12, updatedAt: "2025-03-10" },
  { id: "2", courseName: "TypeScript 基礎", status: "published", publishTarget: "e-learning", learners: 20, updatedAt: "2025-03-12" },
  { id: "3", courseName: "AI 基礎講座 知識編", status: "draft", publishTarget: "e-learning", learners: 0, updatedAt: "2025-03-13" },
  { id: "4", courseName: "データサイエンス入門", status: "published", publishTarget: "training", learners: 9, updatedAt: "2025-03-08" },
  {
    id: "5",
    courseName: "ライブハンズオン（オンライン開催）",
    status: "published",
    publishTarget: "live",
    learners: 5,
    updatedAt: "2025-03-14",
    liveType: "online",
    instructorName: "佐藤 講師",
    instructorBio: "クラウドインフラとDevOpsを専門とする社内認定トレーナー。",
    nextLiveSchedule: "2025/03/20 10:00-11:30",
  },
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

// Udemy 等の外部LMSから取り込まれることを想定したモックコース
export const MOCK_UDEMY_COURSES: PublishedCourse[] = [
  {
    id: "u-101",
    courseName: "【外部】Pythonで学ぶデータ分析入門",
    status: "published",
    publishTarget: "e-learning",
    learners: 0,
    updatedAt: "2025-03-15",
    description: "Python とライブラリを使った実践的なデータ分析の基礎を学ぶ外部LMSコースです。",
    difficulty: "初級",
    tags: ["データ分析", "プログラミング基礎"],
  },
  {
    id: "u-102",
    courseName: "【外部】プロジェクトマネジメント実践",
    status: "published",
    publishTarget: "e-learning",
    learners: 0,
    updatedAt: "2025-03-15",
    description: "スケジュール管理・リスク管理など、プロジェクトマネジメントの基礎を体系的に学ぶ外部コースです。",
    difficulty: "中級",
    tags: ["プロジェクト管理"],
  },
  {
    id: "u-103",
    courseName: "【外部】ライブ・クラウドインフラハンズオン",
    status: "published",
    publishTarget: "live",
    learners: 0,
    updatedAt: "2025-03-15",
    description: "クラウドインフラ構築をライブ形式で学ぶ外部LMSのハンズオンコースです。",
    liveType: "online",
    instructorName: "外部講師 A",
    nextLiveSchedule: "2025/03/25 19:00-21:00",
    tags: ["クラウド"],
  },
];

// 他社Track環境から展開されることを想定したモックコース
export const MOCK_OTHER_TRACK_COURSES: PublishedCourse[] = [
  {
    id: "ot-201",
    courseName: "【他社Track】デザイン思考ワークショップ",
    status: "published",
    publishTarget: "e-learning",
    learners: 0,
    updatedAt: "2025-03-10",
    description: "顧客課題の深掘りからプロトタイピングまでを学ぶ、他社Track環境で公開中のコースです。",
    difficulty: "初級",
    tags: ["デザイン思考"],
  },
  {
    id: "ot-202",
    courseName: "【他社Track】マネジャー向け1on1実践",
    status: "published",
    publishTarget: "e-learning",
    learners: 0,
    updatedAt: "2025-03-11",
    description: "1on1ミーティングの設計と実践を扱う他社Track環境の人気コースです。",
    difficulty: "中級",
    tags: ["プロジェクト管理"],
  },
];
