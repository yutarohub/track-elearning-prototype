/**
 * 受講者スキルHub系画面用モック（保有・ギャップ・パス・履歴など）
 */

export interface OwnedSkill {
  id: string;
  name: string;
  level: number;
  maxLevel: 5;
  acquiredAt: string;
  source: string;
}

export const MOCK_OWNED_SKILLS: OwnedSkill[] = [
  { id: "s1", name: "チームマネジメント", level: 4, maxLevel: 5, acquiredAt: "2025-11-10", source: "スキル調査" },
  { id: "s2", name: "KPIの定義", level: 3, maxLevel: 5, acquiredAt: "2026-01-20", source: "eラーニング" },
  { id: "s3", name: "プロンプト設計", level: 2, maxLevel: 5, acquiredAt: "2026-02-05", source: "コース修了" },
  { id: "s4", name: "UIレビュー", level: 3, maxLevel: 5, acquiredAt: "2025-09-01", source: "試験" },
];

export interface SkillGapItem {
  code: string;
  skillName: string;
  requiredLevel: number;
  currentLevel: number;
  priority: "高" | "中" | "低";
  relatedTags: string[];
  summary: string;
}

export const MOCK_SKILL_GAPS: SkillGapItem[] = [
  {
    code: "generative-ai",
    skillName: "生成AI活用（業務適用）",
    requiredLevel: 4,
    currentLevel: 2,
    priority: "高",
    relatedTags: ["生成AI", "AI", "AI/ML"],
    summary: "職務記述書の必須スキルに対しレベルが不足しています。",
  },
  {
    code: "data-literacy",
    skillName: "データリテラシー",
    requiredLevel: 3,
    currentLevel: 1,
    priority: "中",
    relatedTags: ["データ", "データ分析"],
    summary: "ダッシュボード読解と根拠ある提案にギャップがあります。",
  },
  {
    code: "security-basics",
    skillName: "セキュリティ基礎",
    requiredLevel: 3,
    currentLevel: 2,
    priority: "中",
    relatedTags: ["セキュリティ技術", "セキュリティ"],
    summary: "全社必修ポリシーとの差分があります。",
  },
];

export interface RecommendedCourse {
  id: string;
  title: string;
  reason: string;
  gapCode: string;
}

export const MOCK_GAP_RECOMMENDATIONS: RecommendedCourse[] = [
  {
    id: "rc-1",
    title: "Google Gemini 基礎講座",
    reason: "ギャップ「生成AI活用」に直結（モック）",
    gapCode: "generative-ai",
  },
  {
    id: "rc-2",
    title: "データ分析(Python) 基礎講座",
    reason: "ギャップ「データリテラシー」の補完候補",
    gapCode: "data-literacy",
  },
  {
    id: "rc-3",
    title: "セキュリティ技術入門",
    reason: "ギャップ「セキュリティ基礎」の推奨コース",
    gapCode: "security-basics",
  },
];

export type PathStepState = "locked" | "active" | "completed";

export interface LearningPathStep {
  id: string;
  title: string;
  type: "コース" | "試験" | "ライブ";
  state: PathStepState;
}

export interface LearningPathSummary {
  id: string;
  title: string;
  progressLabel: string;
  steps: LearningPathStep[];
}

export const MOCK_LEARNING_PATHS: LearningPathSummary[] = [
  {
    id: "lp-1",
    title: "生成AIアシスタント活用パス（モック）",
    progressLabel: "2 / 5 完了",
    steps: [
      { id: "st-1", title: "Gemini 基礎", type: "コース", state: "completed" },
      { id: "st-2", title: "プロンプト設計ワーク", type: "コース", state: "completed" },
      { id: "st-3", title: "業務適用ケーススタディ", type: "コース", state: "active" },
      { id: "st-4", title: "ガバナンス基礎", type: "コース", state: "locked" },
      { id: "st-5", title: "スキルチェック", type: "試験", state: "locked" },
    ],
  },
  {
    id: "lp-2",
    title: "データドリブン意思決定入門",
    progressLabel: "0 / 3 完了",
    steps: [
      { id: "st-a", title: "データ可視化入門", type: "コース", state: "active" },
      { id: "st-b", title: "ライブハンズオン", type: "ライブ", state: "locked" },
      { id: "st-c", title: "小レポート提出", type: "試験", state: "locked" },
    ],
  },
];

export interface LearningHistoryRow {
  id: string;
  title: string;
  type: string;
  completedAt: string;
  score?: string;
}

export const MOCK_LEARNING_HISTORY: LearningHistoryRow[] = [
  { id: "h1", title: "ChatGPT 基礎講座 知識編", type: "eラーニング", completedAt: "2026-03-10", score: "修了" },
  { id: "h2", title: "スキル調査（カスタマーサクセス）", type: "スキル診断", completedAt: "2026-03-15" },
  { id: "h3", title: "UI-UX入門講座", type: "eラーニング", completedAt: "2026-02-28", score: "修了" },
];

export interface SkillTimelineEvent {
  id: string;
  date: string;
  label: string;
  detail: string;
}

export const MOCK_SKILL_TIMELINE: SkillTimelineEvent[] = [
  { id: "t1", date: "2026-03-15", label: "スキル調査入力", detail: "カスタマーサクセス職種モデル" },
  { id: "t2", date: "2026-03-01", label: "スキル調査入力", detail: "システムエンジニア職種モデル" },
  { id: "t3", date: "2026-02-20", label: "試験合格", detail: "セキュリティ基礎チェック" },
];

export interface LearnerNotification {
  id: string;
  title: string;
  body: string;
  at: string;
  unread: boolean;
}

export const MOCK_LEARNER_NOTIFICATIONS: LearnerNotification[] = [
  {
    id: "n1",
    title: "有償コース申請の結果",
    body: "「データ分析(Python) 基礎講座」の申請が承認されました。コース一覧から受講を開始できます。",
    at: "2026-03-27 11:00",
    unread: true,
  },
  {
    id: "n2",
    title: "管理者からの配信コース",
    body: "新しい必修コースが追加されました。ホームのバナーから確認できます。",
    at: "2026-03-26 09:30",
    unread: true,
  },
  {
    id: "n3",
    title: "ライブセッション開催リマインド",
    body: "「Difyで実現する AIエージェント活用術」は明日開催です。",
    at: "2026-03-24 08:00",
    unread: false,
  },
];

/** カタログ連動用（?source=gap） */
export const GAP_CATALOG_TAG_HINTS = ["生成AI", "データ", "AI", "セキュリティ技術", "AI/ML", "データ分析"];
