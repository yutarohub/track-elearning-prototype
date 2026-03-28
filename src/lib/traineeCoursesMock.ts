/**
 * 受講者向けコース一覧用モック（おすすめ・自学習用・ライブイベント・全コース）
 */

export type TraineeCourseDelivery = "self" | "live";
export type TraineeDifficulty = "入門" | "初級" | "中級" | "上級";

/** DSS（デジタルスキル標準）の4象限 */
export type DssQuadrant = "why" | "what" | "how" | "mindset";

export type LiveEnrollmentStatus = "open" | "waitlist" | "next_session";
export type SelfPublishStatus = "published" | "coming_soon";

/** 有償オンデマンドの申請〜受講フロー（モック） */
export type PaidSelfFlowStatus = "none" | "pending_approval" | "approved";

export interface TraineeCourse {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  category: string;
  difficulty: TraineeDifficulty;
  duration: string;
  /** 所要時間（分）— フィルタ用 */
  durationMinutes: number;
  delivery: TraineeCourseDelivery;
  recommended: boolean;
  paid?: boolean;
  tags: string[];
  /** DSSカテゴリ（表示・フィルタ用） */
  dssQuadrant?: DssQuadrant;
  dssLabel?: string;
  /** ライブイベントの開催日時（ISO文字列） */
  liveAt?: string;
  /** 平均評価 0〜5 */
  ratingAvg: number;
  /** レビュー件数 */
  reviewCount: number;
  /** 公開日（新着ソート用） */
  releasedAt: string;
  /** 人気度（登録・修了の代理スコア） */
  popularityScore: number;
  /** 自学習: 公開ステータス */
  selfPublishStatus?: SelfPublishStatus;
  /** ライブ: 定員 */
  liveSeatsTotal?: number;
  liveSeatsLeft?: number;
  liveEnrollmentStatus?: LiveEnrollmentStatus;
  /** ライブ: プログラム期間表示 */
  liveProgramPeriod?: string;
  /** 自学習かつ有償: 申請・承認状態 */
  paidSelfFlowStatus?: PaidSelfFlowStatus;
}

/** サムネイルなし時用のプレースホルダー（グラデーション＋イニシャル） */
export function courseThumbnailUrl(course: TraineeCourse): string {
  if (course.thumbnail) return course.thumbnail;
  const colors: Record<TraineeCourseDelivery, string> = {
    self: "6366f1,8b5cf6",
    live: "10b981,14b8a6",
  };
  const c = colors[course.delivery];
  return `https://placehold.co/400x225/${c}/white?text=${encodeURIComponent(course.title.slice(0, 8))}`;
}

type RawTraineeCourse = Omit<
  TraineeCourse,
  | "durationMinutes"
  | "ratingAvg"
  | "reviewCount"
  | "releasedAt"
  | "popularityScore"
  | "selfPublishStatus"
  | "liveSeatsTotal"
  | "liveSeatsLeft"
  | "liveEnrollmentStatus"
  | "liveProgramPeriod"
  | "paidSelfFlowStatus"
>;

const RAW_TRAINEE_COURSES: RawTraineeCourse[] = [
  {
    id: 1,
    title: "Difyで実現する AIエージェント活用術",
    subtitle: "効果的活用のポイントと実務方法",
    description: "効果的活用のポイントと実務方法。生成AIエージェントを業務に組み込む設計と運用を学びます。",
    category: "AI/ML",
    difficulty: "初級",
    duration: "2時間50分",
    delivery: "live",
    recommended: true,
    paid: true,
    tags: ["ライブイベント", "有償", "生成AI"],
    dssQuadrant: "what",
    dssLabel: "AI",
    liveAt: "2026-04-01T14:00:00+09:00",
  },
  {
    id: 2,
    title: "UI-UX入門講座",
    subtitle: "デザインの基礎から実践まで",
    description: "UIとUXの基礎、ワイヤーフレームとプロトタイピングの考え方を体系的に学びます。",
    category: "デザイン",
    difficulty: "初級",
    duration: "2時間50分",
    delivery: "self",
    recommended: true,
    tags: ["デザイン"],
    dssQuadrant: "how",
    dssLabel: "デザイン思考",
  },
  {
    id: 3,
    title: "Google Gemini 基礎講座",
    subtitle: "生成AIの基礎とプロンプト設計",
    description: "Gemini の特徴と安全なプロンプト設計、業務での活用シナリオを扱います。",
    category: "AI/ML",
    difficulty: "初級",
    duration: "1時間53分",
    delivery: "self",
    recommended: true,
    tags: ["生成AI"],
    dssQuadrant: "what",
    dssLabel: "AI",
  },
  {
    id: 4,
    title: "Next.js アプリ開発入門",
    subtitle: "実践編",
    description: "Next.js のルーティングとデータ取得の基本。小さなアプリを一緒に作ります。",
    category: "フロントエンド",
    difficulty: "入門",
    duration: "2時間15分",
    delivery: "self",
    recommended: false,
    tags: ["フロントエンド", "システム開発"],
    dssQuadrant: "how",
    dssLabel: "業務効率化",
  },
  {
    id: 5,
    title: "TypeScript 基礎",
    subtitle: "型安全な開発の第一歩",
    description: "型システムとインターフェース、ジェネリクスの入門。実務で使える書き方を身につけます。",
    category: "プログラミング",
    difficulty: "初級",
    duration: "4時間",
    delivery: "self",
    recommended: false,
    tags: ["プログラミング"],
    dssQuadrant: "how",
    dssLabel: "業務効率化",
  },
  {
    id: 6,
    title: "ChatGPT 基礎講座 知識編",
    subtitle: "知識編",
    description: "LLM の仕組みと限界、プロンプトの型、業務文書作成への適用を学びます。",
    category: "AI/ML",
    difficulty: "初級",
    duration: "3時間2分",
    delivery: "self",
    recommended: false,
    tags: ["データ", "AI", "生成AI"],
    dssQuadrant: "what",
    dssLabel: "AI",
  },
  {
    id: 7,
    title: "データ分析(Python) 基礎講座",
    subtitle: "実践編",
    description: "pandas と可視化の基礎。実データを用いた分析フローの体験を行います。",
    category: "データ",
    difficulty: "中級",
    duration: "14時間",
    delivery: "self",
    recommended: false,
    paid: true,
    tags: ["データ", "AI"],
    dssQuadrant: "what",
    dssLabel: "データ分析",
  },
  {
    id: 8,
    title: "Linux 入門講座",
    subtitle: "コマンドとシェル",
    description: "シェルの基本操作、ファイル権限、パイプとリダイレクトをハンズオンで習得します。",
    category: "インフラ",
    difficulty: "入門",
    duration: "22時間57分",
    delivery: "self",
    recommended: false,
    tags: ["ソフトウェア開発"],
    dssQuadrant: "what",
    dssLabel: "クラウド",
  },
  {
    id: 9,
    title: "基本情報対策 基礎講座",
    subtitle: "午前・午後対策",
    description: "試験範囲の整理と演習。午前分野の用語整理から演習形式で進めます。",
    category: "資格対策",
    difficulty: "入門",
    duration: "1日 6時間",
    delivery: "self",
    recommended: false,
    tags: ["資格対策"],
    dssQuadrant: "mindset",
    dssLabel: "継続的学習",
  },
  {
    id: 10,
    title: "プログラミング (JavaScript) 基礎講座",
    subtitle: "実践編",
    description: "DOM 操作と非同期処理の入門。ミニ課題で手を動かします。",
    category: "フロントエンド",
    difficulty: "初級",
    duration: "2日間 50分",
    delivery: "self",
    recommended: false,
    tags: ["フロントエンド", "システム開発"],
    dssQuadrant: "how",
    dssLabel: "業務効率化",
  },
  {
    id: 11,
    title: "ネットワーク基礎",
    subtitle: "TCP/IP とセキュリティ",
    description: "OSI参照モデル、IP アドレス、DNS、代表的な脅威の概要を学びます。",
    category: "ネットワーク",
    difficulty: "初級",
    duration: "4時間30分",
    delivery: "self",
    recommended: false,
    tags: ["ネットワーク"],
    dssQuadrant: "what",
    dssLabel: "サイバーセキュリティ",
  },
  {
    id: 12,
    title: "セキュリティ技術入門",
    subtitle: "脆弱性と対策",
    description: "OWASP Top 10 の概要とセキュアコーディングの基本姿勢を解説します。",
    category: "セキュリティ",
    difficulty: "初級",
    duration: "3時間",
    delivery: "self",
    recommended: false,
    tags: ["セキュリティ技術"],
    dssQuadrant: "what",
    dssLabel: "サイバーセキュリティ",
  },
  {
    id: 13,
    title: "ライブハンズオン React 入門",
    subtitle: "オンライン開催",
    description: "講師と一緒にコンポーネント設計と Hooks を体験するライブセッションです。",
    category: "フロントエンド",
    difficulty: "初級",
    duration: "3時間",
    delivery: "live",
    recommended: true,
    paid: true,
    tags: ["ライブイベント", "有償"],
    dssQuadrant: "how",
    dssLabel: "業務効率化",
    liveAt: "2026-03-20T10:00:00+09:00",
  },
  {
    id: 14,
    title: "コンピュータ入門講座",
    subtitle: "知識編",
    description: "ハードウェアとOS、インターネットの仕組みをやさしく説明します。",
    category: "基礎",
    difficulty: "入門",
    duration: "2時間",
    delivery: "self",
    recommended: false,
    tags: ["基礎"],
    dssQuadrant: "mindset",
    dssLabel: "継続的学習",
  },
  {
    id: 15,
    title: "プログラミング (Java) 基礎講座",
    subtitle: "実践編 ④例外処理・データベース",
    description: "例外処理、JDBC の基礎、トランザクションの考え方を演習で学びます。",
    category: "プログラミング",
    difficulty: "初級",
    duration: "19時間47分",
    delivery: "self",
    recommended: false,
    tags: ["プログラミング"],
    dssQuadrant: "how",
    dssLabel: "業務効率化",
  },
  {
    id: 16,
    title: "クラウドアーキテクチャ設計（中級）",
    subtitle: "AWS  Well-Architected 入門",
    description: "可用性とコストのトレードオフ、マルチAZ構成の考え方をケーススタディで学びます。",
    category: "クラウド",
    difficulty: "中級",
    duration: "6時間30分",
    delivery: "self",
    recommended: false,
    paid: true,
    tags: ["クラウド", "AWS"],
    dssQuadrant: "what",
    dssLabel: "クラウド",
  },
  {
    id: 17,
    title: "DX推進リーダーシップ",
    subtitle: "組織変革の進め方",
    description: "ステークホルダー調整とロードマップ策定のフレームを、ワーク形式で体験します。",
    category: "経営・戦略",
    difficulty: "上級",
    duration: "5時間",
    delivery: "self",
    recommended: true,
    tags: ["DX", "リーダーシップ"],
    dssQuadrant: "why",
    dssLabel: "DXの実現",
  },
  {
    id: 18,
    title: "アジャイル開発実践ライブ",
    subtitle: "スクラムイベント体験",
    description: "スプリント計画とデイリーのファシリテーションをライブで疑似体験します。",
    category: "開発プロセス",
    difficulty: "中級",
    duration: "4時間",
    delivery: "live",
    recommended: false,
    paid: false,
    tags: ["ライブイベント", "アジャイル"],
    dssQuadrant: "mindset",
    dssLabel: "アジャイル",
    liveAt: "2026-03-25T13:00:00+09:00",
  },
  {
    id: 19,
    title: "生成AIガバナンスとリスク管理",
    subtitle: "PoCから本番まで",
    description: "利用ポリシー、ログ保管、個人情報と著作権の観点から社内ルール設計を学びます。",
    category: "AI/ML",
    difficulty: "上級",
    duration: "3時間20分",
    delivery: "self",
    recommended: false,
    tags: ["生成AI", "ガバナンス"],
    dssQuadrant: "what",
    dssLabel: "AI",
  },
  {
    id: 20,
    title: "データ可視化ダッシュボードハンズオン（ライブ）",
    subtitle: "Looker Studio 相当UI（モック）",
    description: "ダッシュボードの設計指針と、ライブでグラフを組み立てる演習です。",
    category: "データ",
    difficulty: "初級",
    duration: "2時間30分",
    delivery: "live",
    recommended: true,
    paid: true,
    tags: ["ライブイベント", "有償", "データ"],
    dssQuadrant: "how",
    dssLabel: "業務効率化",
    liveAt: "2026-03-18T15:00:00+09:00",
  },
];

const DURATION_MINUTES_BY_ID: Record<number, number> = {
  1: 170,
  2: 170,
  3: 113,
  4: 135,
  5: 240,
  6: 182,
  7: 840,
  8: 1377,
  9: 14 * 60,
  10: 2 * 8 * 60 + 50,
  11: 270,
  12: 180,
  13: 180,
  14: 120,
  15: 1187,
  16: 390,
  17: 300,
  18: 240,
  19: 200,
  20: 150,
};

function enrichCourse(raw: RawTraineeCourse): TraineeCourse {
  const id = raw.id;
  const ratingCycle = [4.2, 4.6, 4.8, 3.9, 4.1, 4.5];
  const countCycle = [210, 4, 18, 120, 56, 3];
  const ratingAvg = ratingCycle[id % ratingCycle.length];
  const reviewCount = countCycle[id % countCycle.length];
  const popularityScore =
    5000 -
    id * 40 +
    (raw.recommended ? 400 : 0) +
    (raw.delivery === "live" ? 250 : 0) +
    reviewCount * 2;
  const releasedAt = `2026-02-${String((id % 27) + 1).padStart(2, "0")}T00:00:00+09:00`;

  const base: TraineeCourse = {
    ...raw,
    durationMinutes: DURATION_MINUTES_BY_ID[id] ?? 120,
    ratingAvg,
    reviewCount,
    releasedAt,
    popularityScore,
  };

  if (raw.delivery === "self") {
    base.selfPublishStatus = id % 11 === 0 ? "coming_soon" : "published";
  }

  if (raw.delivery === "live") {
    base.liveSeatsTotal = 24 + (id % 5) * 6;
    const mod = id % 3;
    base.liveEnrollmentStatus = (["open", "waitlist", "next_session"] as const)[mod];
    base.liveSeatsLeft =
      base.liveEnrollmentStatus === "waitlist"
        ? 0
        : base.liveEnrollmentStatus === "next_session"
          ? undefined
          : 4 + (id % 8);
    base.liveProgramPeriod = "2026/03/01 〜 2026/03/31";
  }

  if (raw.delivery === "self" && raw.paid) {
    if (id === 7) base.paidSelfFlowStatus = "pending_approval";
    else if (id === 16) base.paidSelfFlowStatus = "none";
    else base.paidSelfFlowStatus = "approved";
  }

  return base;
}

export const MOCK_TRAINEE_COURSES: TraineeCourse[] = RAW_TRAINEE_COURSES.map(enrichCourse);

/**
 * コース開始（受講前）専用ページを出すサンプル（プロトタイプ）
 * 3: 無償自学習 / 7: 有償（承認待ちモック） / 1: ライブ（有償）
 */
export const SAMPLE_COURSE_START_IDS = new Set<number>([3, 7, 1]);

export function hasSampleCourseStartPage(courseId: number): boolean {
  return SAMPLE_COURSE_START_IDS.has(courseId);
}

/** タグフィルター用（運用ラベルは除外してもよいが、仕様上は全タグから選択可能にする） */
export const ALL_TRAINEE_COURSE_TAGS: string[] = Array.from(
  new Set(MOCK_TRAINEE_COURSES.flatMap((c) => c.tags)),
).sort((a, b) => a.localeCompare(b, "ja"));

export const MOCK_IN_PROGRESS_COURSES: TraineeCourse[] = [
  MOCK_TRAINEE_COURSES.find((c) => c.id === 6)!,
  MOCK_TRAINEE_COURSES.find((c) => c.id === 7)!,
  MOCK_TRAINEE_COURSES.find((c) => c.id === 14)!,
  MOCK_TRAINEE_COURSES.find((c) => c.id === 15)!,
].filter(Boolean) as TraineeCourse[];
