/**
 * 管理者ダッシュボード用モックデータ（LXP コックピット）
 */

export type CourseTagType = "公式" | "自社";

export interface CourseRow {
  id: number;
  name: string;
  tag: CourseTagType;
  totalLearners: number;
  avgCompletionRate: number; // 0-100
  summary: string;
  learners: { name: string; progress: number; lastLogin: string }[];
}

/** Zone 1: MAU（単一値は直近月の参照用） */
export const MOCK_PLATFORM_MAU = 1248;
export const MOCK_TRACK_OFFICIAL_MAU = 312;
export const MOCK_TRACK_MAU_PLAN_LIMIT = 500;

/** 月別 MAU 時系列（過去12ヶ月・グラフ・月フィルター用） */
export interface MauByMonth {
  yearMonth: string; // "2025-04"
  label: string;     // "2025年4月"
  platform: number;
  trackOfficial: number;
}

function buildMauByMonth(): MauByMonth[] {
  const now = new Date();
  const list: MauByMonth[] = [];
  for (let i = 11; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const yearMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
    const label = `${d.getFullYear()}年${d.getMonth() + 1}月`;
    // 直近月は既存モック値、それ以外はやや少なめのトレンド
    const isCurrent = i === 0;
    const platform = isCurrent ? MOCK_PLATFORM_MAU : Math.round(1248 - (11 - i) * 42 + (11 - i) * (11 - i) * 2);
    const trackOfficial = isCurrent ? MOCK_TRACK_OFFICIAL_MAU : Math.round(312 - (11 - i) * 12 + (11 - i) * 1.5);
    list.push({ yearMonth, label, platform: Math.max(200, platform), trackOfficial: Math.max(80, trackOfficial) });
  }
  return list;
}

export const MOCK_MAU_BY_MONTH: MauByMonth[] = buildMauByMonth();

/** Zone 1: AI インサイト（LXP リッチ版・変動する情報） */
export type InsightType = "trend" | "peak" | "completion" | "risk" | "action";

export interface AIInsightItem {
  id: string;
  type: InsightType;
  title: string;
  summary: string;
  detail?: string;
  metric?: string;
  metricLabel?: string;
  items?: string[];
  cta?: string;
}

export const MOCK_AI_INSIGHTS: AIInsightItem[] = [
  {
    id: "1",
    type: "trend",
    title: "コース受講の傾向",
    summary: "今週は「生成AI」「ChatGPT」系コースの受講が前週比 +24% 増。ビジネス・プログラミング系は横ばいです。",
    detail: "AI/生成AIカテゴリのアクティブ受講者数が 312 人で、先週 252 人から増加。未着手ユーザーへのレコメンド候補として最適です。",
    items: ["生成AI・プロンプトエンジニアリング", "ChatGPT 基礎講座 知識編", "AI・機械学習入門講座"],
    metric: "+24%",
    metricLabel: "前週比",
  },
  {
    id: "2",
    type: "peak",
    title: "受講が集中する時間帯",
    summary: "直近7日間で最も受講が集中した時間帯は 12:00–13:00（昼休み）と 21:00–22:00（夜）です。",
    detail: "平日は昼・夜の2ピーク、休日は 10:00–12:00 に集中。リマインドやコンテンツ配信のタイミング設計に活用できます。",
    metric: "12:00 / 21:00",
    metricLabel: "ピーク時刻",
  },
  {
    id: "3",
    type: "completion",
    title: "完了率が高いコース",
    summary: "平均完了率トップは「TypeScript 基礎」「ChatGPT 基礎講座 知識編」。コンテンツの質が受講継続に効いています。",
    detail: "未着手ユーザーへのプッシュや、似た難易度のコースへのクロスセルに活用可能です。",
    items: ["TypeScript 基礎 (72%)", "ChatGPT 基礎講座 知識編 (68%)", "Next.js アプリ開発入門 (65%)"],
    metric: "72%",
    metricLabel: "最高完了率",
  },
  {
    id: "4",
    type: "risk",
    title: "エンゲージメント注意",
    summary: "2週間以上未ログインの受講者が 45 名います。リマインド配信で再開を促すと定着率改善が期待できます。",
    detail: "うち 12 名はコース途中で離脱。個別メールまたは「続きから」通知の送信を推奨します。",
    metric: "45 名",
    metricLabel: "2週間未ログイン",
    cta: "リマインド一覧を開く",
  },
  {
    id: "5",
    type: "action",
    title: "推奨アクション",
    summary: "今月はTrack公式コンテンツのMAU枠に余裕があります。未着手ユーザーに「生成AI入門」をレコメンドしましょう。",
    detail: "公式MAU 312 / 500。余裕を活かしてAI系コースの案内を配信すると、課金枠の有効活用と学習機会の均等化が両立できます。",
    metric: "38%",
    metricLabel: "MAU余裕",
    cta: "レコメンド設定",
  },
];

/** 非推奨: 単一インサイト（後方互換） */
export const MOCK_AI_INSIGHT = MOCK_AI_INSIGHTS[4].summary;

/** Zone 2: コホート再帰率（登録週 × 1〜5週後ログイン率 %） */
export const MOCK_COHORT_RETENTION: { week: string; w1: number; w2: number; w3: number; w4: number; w5: number }[] = [
  { week: "2026-W01", w1: 92, w2: 78, w3: 65, w4: 58, w5: 52 },
  { week: "2026-W02", w1: 88, w2: 74, w3: 62, w4: 55, w5: 48 },
  { week: "2026-W03", w1: 95, w2: 82, w3: 70, w4: 64, w5: 58 },
  { week: "2026-W04", w1: 90, w2: 76, w3: 68, w4: 60, w5: 54 },
  { week: "2026-W05", w1: 85, w2: 72, w3: 60, w4: 53, w5: 47 },
  { week: "2026-W06", w1: 93, w2: 80, w3: 69, w4: 62, w5: 56 },
  { week: "2026-W07", w1: 89, w2: 75, w3: 63, w4: 57, w5: 51 },
  { week: "2026-W08", w1: 91, w2: 77, w3: 66, w4: 59, w5: 53 },
];

/** Zone 3: コース別 完了/進行中/未着手（上位20・積み上げ横棒用） */
export interface CourseStackItem {
  courseName: string;
  completed: number;
  inProgress: number;
  notStarted: number;
}

export const MOCK_COURSE_STACK: CourseStackItem[] = [
  { courseName: "自己学習力入門講座", completed: 123, inProgress: 99, notStarted: 97 },
  { courseName: "生成AI・プロンプトエンジニアリング", completed: 88, inProgress: 76, notStarted: 62 },
  { courseName: "AI・機械学習入門講座", completed: 72, inProgress: 58, notStarted: 44 },
  { courseName: "プログラミング (Python) 基礎講座実践編", completed: 65, inProgress: 52, notStarted: 38 },
  { courseName: "ChatGPT 基礎講座 知識編", completed: 54, inProgress: 42, notStarted: 28 },
  { courseName: "TypeScript 基礎", completed: 48, inProgress: 36, notStarted: 22 },
  { courseName: "Next.js アプリ開発入門", completed: 42, inProgress: 32, notStarted: 18 },
  { courseName: "データサイエンス入門", completed: 38, inProgress: 28, notStarted: 16 },
  { courseName: "Google AI Explorer パス", completed: 35, inProgress: 26, notStarted: 14 },
  { courseName: "JavaScript モダン開発", completed: 32, inProgress: 24, notStarted: 12 },
  { courseName: "React Hooks 実践", completed: 28, inProgress: 22, notStarted: 10 },
  { courseName: "API 設計入門", completed: 24, inProgress: 18, notStarted: 8 },
  { courseName: "SQL 入門", completed: 22, inProgress: 16, notStarted: 6 },
  { courseName: "Git ワークフロー", completed: 20, inProgress: 14, notStarted: 6 },
  { courseName: "セキュリティ基礎", completed: 18, inProgress: 12, notStarted: 4 },
  { courseName: "Docker 入門", completed: 16, inProgress: 10, notStarted: 4 },
  { courseName: "Tailwind CSS 実践", completed: 14, inProgress: 8, notStarted: 2 },
  { courseName: "アジャイル開発入門", completed: 12, inProgress: 6, notStarted: 2 },
  { courseName: "Node.js バックエンド", completed: 10, inProgress: 6, notStarted: 2 },
  { courseName: "GraphQL 基礎", completed: 8, inProgress: 4, notStarted: 2 },
];

/** Zone 4: コース一覧＋ドリルダウン用 */
export const MOCK_COURSE_TABLE: CourseRow[] = [
  {
    id: 1,
    name: "ChatGPT 基礎講座 知識編",
    tag: "公式",
    totalLearners: 124,
    avgCompletionRate: 68,
    summary: "生成AIの基礎とプロンプト設計を学ぶ公式コースです。業務での活用イメージを持ちながら進められます。",
    learners: [
      { name: "山田 太郎", progress: 100, lastLogin: "2026-03-14" },
      { name: "佐藤 花子", progress: 85, lastLogin: "2026-03-13" },
      { name: "鈴木 一郎", progress: 42, lastLogin: "2026-03-10" },
      { name: "田中美咲", progress: 18, lastLogin: "2026-03-08" },
    ],
  },
  {
    id: 2,
    name: "TypeScript 基礎",
    tag: "自社",
    totalLearners: 106,
    avgCompletionRate: 72,
    summary: "型安全なフロントエンド開発のためのTypeScript入門。実務で使える文法と型設計を習得します。",
    learners: [
      { name: "高橋 健", progress: 100, lastLogin: "2026-03-14" },
      { name: "伊藤 恵", progress: 90, lastLogin: "2026-03-12" },
      { name: "渡辺 翔", progress: 55, lastLogin: "2026-03-11" },
    ],
  },
  {
    id: 3,
    name: "生成AI・プロンプトエンジニアリング",
    tag: "公式",
    totalLearners: 226,
    avgCompletionRate: 58,
    summary: "プロンプト設計とLLM活用の実践スキルを習得する人気コース。ビジネス活用事例を豊富に扱います。",
    learners: [
      { name: "山本 直樹", progress: 100, lastLogin: "2026-03-14" },
      { name: "中村 優子", progress: 78, lastLogin: "2026-03-13" },
      { name: "小林 大輔", progress: 33, lastLogin: "2026-03-09" },
      { name: "加藤 美香", progress: 12, lastLogin: "2026-03-05" },
      { name: "吉田 隆", progress: 0, lastLogin: "2026-03-01" },
    ],
  },
  {
    id: 4,
    name: "Next.js アプリ開発入門",
    tag: "自社",
    totalLearners: 92,
    avgCompletionRate: 65,
    summary: "App Router と React Server Components を使ったモダンなNext.js開発の基礎を学びます。",
    learners: [
      { name: "松本 誠", progress: 100, lastLogin: "2026-03-14" },
      { name: "井上 さくら", progress: 60, lastLogin: "2026-03-12" },
      { name: "木村 拓也", progress: 25, lastLogin: "2026-03-08" },
    ],
  },
  {
    id: 5,
    name: "データサイエンス入門",
    tag: "公式",
    totalLearners: 82,
    avgCompletionRate: 61,
    summary: "Pythonと統計の基礎からデータ分析の実践まで。実データを用いたハンズオン形式です。",
    learners: [
      { name: "林 由美", progress: 100, lastLogin: "2026-03-13" },
      { name: "斎藤 浩二", progress: 45, lastLogin: "2026-03-10" },
      { name: "清水 あおい", progress: 20, lastLogin: "2026-03-07" },
    ],
  },
];
