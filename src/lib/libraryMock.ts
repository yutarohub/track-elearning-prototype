/**
 * 統合ライブラリ管理画面用モックデータ
 * マテリアルカテゴリ・コースカテゴリごとの一覧と公開区分
 */

export type LibraryMaterialCategory =
  | "book"
  | "challenge"
  | "survey"
  | "video"
  | "app"
  | "file"
  | "slide"
  | "markdown";

export type LibraryCourseCategory = "course" | "learningpath";

export type PublishFilter = "e-learning" | "live" | "training";

/** コース一覧の複合フィルター: eラーニング（自学習・ライブ） / 集合研修 */
export type CoursePublishFilter = "e-learning-or-live" | "training";

export type BadgeKind = "Track公式" | "自社オリジナル" | "New" | "e-learning" | "live" | "training";

// ブック
export interface LibraryBook {
  id: number;
  name: string;
  chapters: number;
  estimatedTime: string;
  language: string;
  badges: BadgeKind[];
}

// アンケート
export interface LibrarySurvey {
  id: number;
  title: string;
  badges: BadgeKind[];
}

// 動画
export interface LibraryVideo {
  id: number;
  title: string;
  playbackTime: string;
  uploadTime: string;
  badges: BadgeKind[];
  thumbnail?: string;
}

// ファイル
export interface LibraryFile {
  id: number;
  title: string;
  fileType: string;
  fileSize: string;
  uploadTime: string;
  badges: BadgeKind[];
}

// アプリ
export interface LibraryApp {
  id: number;
  name: string;
  version: string;
  estimatedTime: string;
  badges: BadgeKind[];
}

// スライド
export interface LibrarySlide {
  id: number;
  title: string;
  pageCount: number;
  estimatedTime: string;
  language: string;
  badges: BadgeKind[];
}

// コース（公開区分・タグでフィルタ）
export interface LibraryCourseRow {
  id: number;
  title: string;
  estimatedTime: string;
  materialCount: number;
  publishType: PublishFilter;
  badges: BadgeKind[];
  tags: string[];
}

// 学習パス（公開区分・タグでフィルタ可能）
export interface LibraryLearningPath {
  id: number;
  title: string;
  courseCount: number;
  estimatedTime: string;
  hasElearning: boolean;
  publishType: PublishFilter;
  badges: BadgeKind[];
  tags: string[];
}

export const MOCK_LIBRARY_BOOKS: LibraryBook[] = [
  { id: 13057, name: "Java演習 Stream API v1.0", chapters: 2, estimatedTime: "15分", language: "日本語", badges: ["Track公式", "New"] },
  { id: 12956, name: "Java Basics: Methods v1.0", chapters: 3, estimatedTime: "30分", language: "英語", badges: ["Track公式", "New"] },
  { id: 12955, name: "Java Basics: Standard Input 2 v1.0", chapters: 1, estimatedTime: "30分", language: "英語", badges: ["Track公式", "New"] },
  { id: 12954, name: "Java Basics: Arrays v1.0", chapters: 1, estimatedTime: "30分", language: "英語", badges: ["Track公式", "New"] },
  { id: 12953, name: "Java Basics: Loops v1.0", chapters: 1, estimatedTime: "30分", language: "英語", badges: ["Track公式", "New"] },
];

export const MOCK_LIBRARY_SURVEYS: LibrarySurvey[] = [
  { id: 167, title: "【研修日報用】研修最終日 Survey", badges: ["Track公式"] },
  { id: 164, title: "受講後アンケート", badges: ["Track公式"] },
  { id: 160, title: "研修開始前アンケート", badges: ["自社オリジナル"] },
];

export const MOCK_LIBRARY_VIDEOS: LibraryVideo[] = [
  { id: 1, title: "デジタル人材育成講座", playbackTime: "25:39", uploadTime: "2025年7月8日", badges: ["自社オリジナル"] },
  { id: 2, title: "5-3_結合テスト・総合テスト_総合テスト", playbackTime: "00:08", uploadTime: "2025年3月12日", badges: ["Track公式"] },
];

export const MOCK_LIBRARY_FILES: LibraryFile[] = [
  { id: 1, title: "Webアプリ開発(バックエンド, Python Django, ORM版) 応用講座 実践編 8章_完成版.zip", fileType: "ZIPファイル", fileSize: "33.3 kB", uploadTime: "2026年3月4日", badges: ["Track公式", "New"] },
  { id: 2, title: "研修シラバス.xlsx", fileType: "Excel文書", fileSize: "10.4 kB", uploadTime: "2026年3月4日", badges: ["自社オリジナル"] },
];

export const MOCK_LIBRARY_APPS: LibraryApp[] = [
  { id: 7780, name: "宿泊施設のREST APIを実装せよ FastAPI編", version: "v1.1", estimatedTime: "6時間", badges: ["Track公式"] },
  { id: 4697, name: "宿泊施設のREST APIを実装せよ Spring編 (軽量版)", version: "v1.2", estimatedTime: "2時間", badges: ["Track公式"] },
  { id: 4466, name: "宿泊施設のREST APIを実装せよ Spring編", version: "v2.0", estimatedTime: "3時間", badges: ["Track公式"] },
  { id: 4293, name: "ダイスゲームのAPIを実装せよ Spring編", version: "v1.3", estimatedTime: "2時間", badges: ["Track公式"] },
];

export const MOCK_LIBRARY_SLIDES: LibrarySlide[] = [
  { id: 13091, title: "Linux 基礎講座 実践編 サービス", pageCount: 35, estimatedTime: "1時間", language: "日本語", badges: ["Track公式", "New"] },
  { id: 13089, title: "CI/CD (Terraform) 基礎講座 実践編", pageCount: 33, estimatedTime: "1時間", language: "日本語", badges: ["Track公式", "New"] },
  { id: 13088, title: "Linux 基礎講座 実践編 ネットワーク", pageCount: 50, estimatedTime: "1時間", language: "日本語", badges: ["Track公式", "New"] },
];

export const MOCK_LIBRARY_COURSES: LibraryCourseRow[] = [
  { id: 1, title: "CI/CD (Terraform) 基礎講座 実践編", estimatedTime: "1時間", materialCount: 1, publishType: "e-learning", badges: ["Track公式"], tags: ["クラウド", "アプリ開発"] },
  { id: 2, title: "Linux 基礎講座 実践編 3日版 【集合研修用】", estimatedTime: "14時間", materialCount: 14, publishType: "training", badges: ["Track公式", "training"], tags: ["プログラミング基礎"] },
  { id: 3, title: "運用・保守基礎講座 実践編", estimatedTime: "1時間", materialCount: 1, publishType: "e-learning", badges: ["Track公式"], tags: ["プロジェクト管理"] },
  { id: 4, title: "ライブハンズオン（オンライン開催）", estimatedTime: "2時間", materialCount: 1, publishType: "live", badges: ["live"], tags: ["生成AI", "アプリ開発"] },
  { id: 5, title: "オフライン集合研修 会場実施", estimatedTime: "6時間", materialCount: 1, publishType: "training", badges: ["training"], tags: ["デザイン思考"] },
];

export const MOCK_LIBRARY_LEARNING_PATHS: LibraryLearningPath[] = [
  { id: 1, title: "IPA情報処理技術者ラーニングパス", courseCount: 24, estimatedTime: "1週", hasElearning: true, publishType: "e-learning", badges: ["Track公式"], tags: ["プログラミング基礎", "データ分析"] },
  { id: 2, title: "クラウドインフララーニングパス", courseCount: 20, estimatedTime: "5日4時間", hasElearning: true, publishType: "e-learning", badges: ["Track公式"], tags: ["クラウド", "セキュリティ"] },
  { id: 3, title: "ライブハンズオン集中パス", courseCount: 5, estimatedTime: "2日", hasElearning: false, publishType: "live", badges: ["live"], tags: ["機械学習", "生成AI"] },
  { id: 4, title: "集合研修 管理職向けパス", courseCount: 8, estimatedTime: "3日", hasElearning: false, publishType: "training", badges: ["training"], tags: ["プロジェクト管理", "デザイン思考"] },
];
