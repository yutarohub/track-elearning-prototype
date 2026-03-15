/**
 * コース・学習パス用タグ（ライブラリフィルター・コース作成で共通利用）
 */
export const COURSE_TAG_OPTIONS = [
  "生成AI",
  "アプリ開発",
  "機械学習",
  "データ分析",
  "セキュリティ",
  "クラウド",
  "デザイン思考",
  "プロジェクト管理",
  "プログラミング基礎",
] as const;

export type CourseTag = (typeof COURSE_TAG_OPTIONS)[number];
