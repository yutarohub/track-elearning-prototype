# 05 — モックデータスキーマ

`src/lib/mockData.ts` に定義する型とエクスポート定数。再構築時はこのスキーマに沿ってデータを用意する。

---

## 1. 型定義

### Difficulty

```ts
export type Difficulty = "入門" | "初級" | "中級" | "上級";
```

### CourseType

```ts
export type CourseType = "コース" | "学習パス";
```

### CourseTag

```ts
export type CourseTag = "e-learning" | "training";
```

### CourseDelivery

```ts
export type CourseDelivery = "self" | "live";
```

### MaterialType

```ts
export type MaterialType = "video" | "pdf" | "slide" | "quiz";
```

### Course

```ts
export interface Course {
  id: number;
  title: string;
  learners: number;
  type: CourseType;
  delivery: CourseDelivery;
  difficulty: Difficulty;
  duration: string;
  progress: { completed: number; total: number };
  tags: CourseTag[];
  badgeId?: number;
  category: string;
  materialIds?: number[];
}
```

### Badge

```ts
export interface Badge {
  id: number;
  name: string;
  description: string;
  color: string;   // 例: "#6366f1"
  icon: string;   // 例: "🤖"
  courseIds: number[];
  issued: number;
  expires?: string;
}
```

### Material

```ts
export interface Material {
  id: number;
  title: string;
  type: MaterialType;
  size: string;      // 例: "248 MB"
  duration?: string; // 例: "28分"
  pages?: number;
  createdAt: string;
  updatedAt: string;
  thumbnail: string; // 例: "🎬"
  courseIds: number[];
}
```

---

## 2. エクスポート定数

- **MOCK_COURSES:** `Course[]`。20 件程度。id 1〜21、タイトル・受講者数・種類・難易度・時間・進捗・category・materialIds などを含む。一部は badgeId あり。
- **MOCK_BADGES:** `Badge[]`。5 件程度。ChatGPT マスター、Google AI Explorer、データサイエンティスト初級、JavaScript Developer、DX推進リーダーなど。color / icon / courseIds / issued を設定。
- **MOCK_MATERIALS:** `Material[]`。10 件以上。動画・PDF・スライド・クイズ。courseIds でコースと紐付け。

---

## 3. サンプル（最小構成）

### MOCK_COURSES の 1 件

```ts
{
  id: 3,
  title: "ChatGPT 基礎講座 知識編",
  learners: 4,
  type: "コース",
  delivery: "self",
  difficulty: "初級",
  duration: "3時間 2分",
  progress: { completed: 4, total: 4 },
  tags: ["e-learning", "training"],
  badgeId: 1,
  category: "AI/ML",
  materialIds: [101, 102],
}
```

### MOCK_BADGES の 1 件

```ts
{
  id: 1,
  name: "ChatGPT マスター",
  description: "ChatGPT基礎講座を修了した証明バッジ",
  color: "#6366f1",
  icon: "🤖",
  courseIds: [3],
  issued: 4,
}
```

### MOCK_MATERIALS の 1 件

```ts
{
  id: 101,
  title: "ChatGPT 基礎 — 導入動画",
  type: "video",
  size: "248 MB",
  duration: "28分",
  createdAt: "2024-04-01",
  updatedAt: "2024-06-10",
  thumbnail: "🎬",
  courseIds: [3],
}
```

---

## 4. 利用箇所

| データ | 利用ページ |
|--------|------------|
| MOCK_COURSES | dashboard, courses, publish（一覧・フィルタ・ウィザード完了時の追加） |
| MOCK_BADGES | dashboard, badges |
| MOCK_MATERIALS | library |

グラフ用の月別・コホートデータは各ページ内で定数として持つか、必要なら mockData に追加する。
