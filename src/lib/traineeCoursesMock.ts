/**
 * 受講者向けコース一覧用モック（おすすめ・自学習用・ライブイベント・全コース）
 */

export type TraineeCourseDelivery = "self" | "live";
export type TraineeDifficulty = "入門" | "初級" | "中級" | "上級";

export interface TraineeCourse {
  id: number;
  title: string;
  subtitle?: string;
  description?: string;
  thumbnail?: string;
  category: string;
  difficulty: TraineeDifficulty;
  duration: string;
  delivery: TraineeCourseDelivery;
  recommended: boolean;
  paid?: boolean;
  tags: string[];
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

export const MOCK_TRAINEE_COURSES: TraineeCourse[] = [
  {
    id: 1,
    title: "Difyで実現する AIエージェント活用術",
    subtitle: "効果的活用のポイントと実務方法",
    description: "効果的活用のポイントと実務方法",
    category: "AI/ML",
    difficulty: "初級",
    duration: "2時間50分",
    delivery: "live",
    recommended: true,
    paid: true,
    tags: ["ライブイベント", "有償", "生成AI"],
  },
  {
    id: 2,
    title: "UI-UX入門講座",
    subtitle: "デザインの基礎から実践まで",
    category: "デザイン",
    difficulty: "初級",
    duration: "2時間50分",
    delivery: "self",
    recommended: true,
    tags: ["デザイン"],
  },
  {
    id: 3,
    title: "Google Gemini 基礎講座",
    subtitle: "生成AIの基礎とプロンプト設計",
    category: "AI/ML",
    difficulty: "初級",
    duration: "1時間53分",
    delivery: "self",
    recommended: true,
    tags: ["生成AI"],
  },
  {
    id: 4,
    title: "Next.js アプリ開発入門",
    subtitle: "実践編",
    category: "フロントエンド",
    difficulty: "入門",
    duration: "2時間15分",
    delivery: "self",
    recommended: false,
    tags: ["フロントエンド", "システム開発"],
  },
  {
    id: 5,
    title: "TypeScript 基礎",
    subtitle: "型安全な開発の第一歩",
    category: "プログラミング",
    difficulty: "初級",
    duration: "4時間",
    delivery: "self",
    recommended: false,
    tags: ["プログラミング"],
  },
  {
    id: 6,
    title: "ChatGPT 基礎講座 知識編",
    subtitle: "知識編",
    category: "AI/ML",
    difficulty: "初級",
    duration: "3時間2分",
    delivery: "self",
    recommended: false,
    tags: ["データ", "AI", "生成AI"],
  },
  {
    id: 7,
    title: "データ分析(Python) 基礎講座",
    subtitle: "実践編",
    category: "データ",
    difficulty: "中級",
    duration: "14時間",
    delivery: "self",
    recommended: false,
    tags: ["データ", "AI"],
  },
  {
    id: 8,
    title: "Linux 入門講座",
    subtitle: "コマンドとシェル",
    category: "インフラ",
    difficulty: "入門",
    duration: "22時間57分",
    delivery: "self",
    recommended: false,
    tags: ["ソフトウェア開発"],
  },
  {
    id: 9,
    title: "基本情報対策 基礎講座",
    subtitle: "午前・午後対策",
    category: "資格対策",
    difficulty: "入門",
    duration: "1日 6時間",
    delivery: "self",
    recommended: false,
    tags: ["資格対策"],
  },
  {
    id: 10,
    title: "プログラミング (JavaScript) 基礎講座",
    subtitle: "実践編",
    category: "フロントエンド",
    difficulty: "初級",
    duration: "2日間 50分",
    delivery: "self",
    recommended: false,
    tags: ["フロントエンド", "システム開発"],
  },
  {
    id: 11,
    title: "ネットワーク基礎",
    subtitle: "TCP/IP とセキュリティ",
    category: "ネットワーク",
    difficulty: "初級",
    duration: "4時間30分",
    delivery: "self",
    recommended: false,
    tags: ["ネットワーク"],
  },
  {
    id: 12,
    title: "セキュリティ技術入門",
    subtitle: "脆弱性と対策",
    category: "セキュリティ",
    difficulty: "初級",
    duration: "3時間",
    delivery: "self",
    recommended: false,
    tags: ["セキュリティ技術"],
  },
  {
    id: 13,
    title: "ライブハンズオン React 入門",
    subtitle: "オンライン開催",
    category: "フロントエンド",
    difficulty: "初級",
    duration: "3時間",
    delivery: "live",
    recommended: true,
    paid: true,
    tags: ["ライブイベント", "有償"],
  },
  {
    id: 14,
    title: "コンピュータ入門講座",
    subtitle: "知識編",
    category: "基礎",
    difficulty: "入門",
    duration: "2時間",
    delivery: "self",
    recommended: false,
    tags: ["基礎"],
  },
  {
    id: 15,
    title: "プログラミング (Java) 基礎講座",
    subtitle: "実践編 ④例外処理・データベース",
    category: "プログラミング",
    difficulty: "初級",
    duration: "19時間47分",
    delivery: "self",
    recommended: false,
    tags: ["プログラミング"],
  },
];

export const MOCK_IN_PROGRESS_COURSES: TraineeCourse[] = [
  MOCK_TRAINEE_COURSES.find((c) => c.id === 6)!,
  MOCK_TRAINEE_COURSES.find((c) => c.id === 7)!,
  MOCK_TRAINEE_COURSES.find((c) => c.id === 14)!,
  MOCK_TRAINEE_COURSES.find((c) => c.id === 15)!,
].filter(Boolean) as TraineeCourse[];
