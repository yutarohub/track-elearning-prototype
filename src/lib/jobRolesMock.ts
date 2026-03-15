/**
 * スキル可視化プラットフォーム連動の職種（ジョブロール）
 * 本番では86職種のJDと連動
 */
export interface JobRole {
  id: string;
  name: string;
}

export const MOCK_JOB_ROLES: JobRole[] = [
  { id: "jr-01", name: "エンジニア（フロントエンド）" },
  { id: "jr-02", name: "エンジニア（バックエンド）" },
  { id: "jr-03", name: "エンジニア（インフラ）" },
  { id: "jr-04", name: "データサイエンティスト" },
  { id: "jr-05", name: "プロダクトマネージャー" },
  { id: "jr-06", name: "プロジェクトマネージャー" },
  { id: "jr-07", name: "UXデザイナー" },
  { id: "jr-08", name: "セキュリティエンジニア" },
  { id: "jr-09", name: "QAエンジニア" },
  { id: "jr-10", name: "DevOpsエンジニア" },
  { id: "jr-11", name: "ビジネスアナリスト" },
  { id: "jr-12", name: "企画・事業開発" },
  { id: "jr-13", name: "営業" },
  { id: "jr-14", name: "カスタマーサクセス" },
  { id: "jr-15", name: "人事・組織開発" },
  { id: "jr-16", name: "経理・財務" },
  { id: "jr-17", name: "法務" },
  { id: "jr-18", name: "新卒・若手社員" },
  { id: "jr-19", name: "管理職" },
  { id: "jr-20", name: "その他" },
];
