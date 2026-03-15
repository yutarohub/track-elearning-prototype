/**
 * コースレイティング用モック（UIのみ）
 */

export interface CourseReview {
  id: string;
  courseId: number;
  userName: string;
  rating: 1 | 2 | 3 | 4 | 5;
  comment: string;
  createdAt: string;
  helpfulCount?: number;
}

export interface CourseRatingSummary {
  courseId: number;
  courseTitle: string;
  category: string;
  averageRating: number;
  reviewCount: number;
  distribution: { 5: number; 4: number; 3: number; 2: number; 1: number };
}

export const MOCK_COURSE_RATING_SUMMARIES: CourseRatingSummary[] = [
  {
    courseId: 1,
    courseTitle: "Next.js アプリ開発入門",
    category: "フロントエンド",
    averageRating: 4.6,
    reviewCount: 28,
    distribution: { 5: 18, 4: 7, 3: 2, 2: 1, 1: 0 },
  },
  {
    courseId: 2,
    courseTitle: "TypeScript 基礎",
    category: "プログラミング",
    averageRating: 4.8,
    reviewCount: 42,
    distribution: { 5: 32, 4: 8, 3: 1, 2: 1, 1: 0 },
  },
  {
    courseId: 3,
    courseTitle: "ChatGPT 基礎講座 知識編",
    category: "AI/ML",
    averageRating: 4.4,
    reviewCount: 15,
    distribution: { 5: 8, 4: 5, 3: 1, 2: 1, 1: 0 },
  },
  {
    courseId: 4,
    courseTitle: "Google AI Explorer パス",
    category: "AI/ML",
    averageRating: 4.2,
    reviewCount: 9,
    distribution: { 5: 4, 4: 3, 3: 2, 2: 0, 1: 0 },
  },
  {
    courseId: 5,
    courseTitle: "データサイエンス入門",
    category: "データ",
    averageRating: 4.5,
    reviewCount: 22,
    distribution: { 5: 12, 4: 7, 3: 2, 2: 1, 1: 0 },
  },
  {
    courseId: 6,
    courseTitle: "JavaScript モダン開発",
    category: "フロントエンド",
    averageRating: 4.7,
    reviewCount: 35,
    distribution: { 5: 24, 4: 8, 3: 2, 2: 1, 1: 0 },
  },
  {
    courseId: 7,
    courseTitle: "DX 推進リーダー養成",
    category: "ビジネス",
    averageRating: 4.1,
    reviewCount: 8,
    distribution: { 5: 3, 4: 3, 3: 1, 2: 1, 1: 0 },
  },
];

export const MOCK_COURSE_REVIEWS: CourseReview[] = [
  { id: "r1", courseId: 1, userName: "受講者A", rating: 5, comment: "実践的で、すぐに業務に活かせる内容でした。", createdAt: "2025-03-12", helpfulCount: 5 },
  { id: "r2", courseId: 1, userName: "受講者B", rating: 4, comment: "説明が分かりやすく、演習も適切でした。", createdAt: "2025-03-10", helpfulCount: 2 },
  { id: "r3", courseId: 2, userName: "受講者C", rating: 5, comment: "型の考え方が身につき、コードの品質が上がりました。", createdAt: "2025-03-14", helpfulCount: 8 },
  { id: "r4", courseId: 2, userName: "受講者D", rating: 5, comment: "初めてのTypeScriptでしたが、無理なく学べました。", createdAt: "2025-03-11", helpfulCount: 3 },
  { id: "r5", courseId: 3, userName: "受講者E", rating: 4, comment: "AIの基礎を体系的に学べる良い講座です。", createdAt: "2025-03-09", helpfulCount: 1 },
  { id: "r6", courseId: 5, userName: "受講者F", rating: 5, comment: "データ分析の第一歩として最適。実データでの演習が良かった。", createdAt: "2025-03-08", helpfulCount: 4 },
  { id: "r7", courseId: 6, userName: "受講者G", rating: 4, comment: "モダンなJSの書き方がまとまっていて参考になりました。", createdAt: "2025-03-13", helpfulCount: 2 },
];
