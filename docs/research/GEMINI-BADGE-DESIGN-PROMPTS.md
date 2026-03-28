# Gemini 用：LXP バッジ／マイクロクレデンシャル モックデザインプロンプト

Track e-learning プロトタイプ向け。**人的資本・スキル証跡**として一覧・カードに載せるバッジ画像を生成するための指示です。  
（`src/lib/mockData.ts` の `MOCK_BADGES` 5件＋受講者画面用の汎用テンプレに対応）

## 使い方

1. Gemini（画像生成が使えるモデル）で、下記 **共通ブロック** の後に **バッジ別ブロック** をそのまま貼り付ける。  
2. 出力は **正方形 1024×1024 px**（または 512×512）を指定。Web では `64–128px` 表示想定なので、**太めのライン・シンプルなシルエット**が重要。  
3. 背景は **透明 PNG** を希望する場合はプロンプト末尾に `transparent background, PNG style alpha channel` を追加（モデルが未対応なら白背景で生成し、後から抜く）。  
4. **ChatGPT / Google の商標ロゴは使わない**。テキストも固有名詞は避け、モック用の汎用表現にする。

---

## 共通ブロック（すべてのバッジの先頭に付ける）

英語プロンプト（画像モデル向け・推奨）:

```text
Digital badge icon for an enterprise LXP (learning experience platform), flat vector style with subtle depth,
rounded shield or circular medallion shape, clean geometric composition, professional SaaS UI aesthetic,
no photorealistic humans, no stock photo, no watermarks, no trademark logos (no OpenAI, Google, ChatGPT marks),
high contrast readable at small size (64px thumbnail), centered emblem, soft inner highlight, crisp edges,
color palette hint will follow per badge.
```

日本語で追加指示する場合（文体の補足）:

```text
企業向けeラーニングの「修了証・デジタルバッジ」アイコン。フラット寄りのベクター風、
UIに埋め込める落ち着いたトーン。写真や実在ブランドロゴは不可。
```

---

## バッジ別プロンプト（MOCK_BADGES 対応）

各項目 = **共通ブロック** + **下記の色・モチーフブロック** を連結。

### 1. ChatGPT マスター（モック id:1・インディゴ #6366f1・🤖）

```text
Primary accent color indigo #6366f1 and deep slate #0f172a. Theme: conversational AI literacy and prompt skills.
Motifs: abstract chat bubble, neural node network, spark or light rays (generic, not branded).
Optional tiny Japanese subtitle area: leave blank or use placeholder bars, no readable brand text.
```

### 2. Google AI Explorer（モック id:2・バイオレット #8b5cf6・🔮）

```text
Primary accent color violet #8b5cf6 and dark purple #4c1d95. Theme: exploratory AI learning path completed.
Motifs: compass, path nodes, crystal or prism shape abstract (no Google G logo, no Gemini logo).
Sense of discovery and guided journey.
```

### 3. データサイエンティスト初級（モック id:3・スカイ #0ea5e9・📊）

```text
Primary accent color sky blue #0ea5e9 and navy #0c4a6e. Theme: introductory data science credential.
Motifs: bar chart silhouette, scatter points, pie segment abstract, database cylinder outline (simplified).
Analytical and trustworthy mood.
```

### 4. JavaScript Developer（モック id:4・アンバー #eab308・⚡）

```text
Primary accent color amber #eab308 and charcoal #1e293b. Theme: modern JavaScript development course completion.
Motifs: lightning bolt stylized, curly braces {}, chip or circuit trace (minimal, iconic).
Energetic but corporate-safe.
```

### 5. DX推進リーダー（モック id:5・ピンク #ec4899・🎯）

```text
Primary accent color pink #ec4899 and rose-900 tones. Theme: digital transformation leadership program.
Motifs: target rings, upward arrow, organizational nodes connected (abstract), ribbon banner for "achievement" feel.
Premium certificate vibe, optional small "EXP" style expiry ribbon corner (decorative only).
```

---

## 受講者画面用（汎用テンプレ 2種）

`app/learner/track/badges` の「オンボーディング完了」「セキュリティ基礎」や、動的「修了: ○○」用の**型**として使う。

### A. オンボーディング完了

```text
[共通ブロック]
Emerald green #059669 and white. Theme: employee onboarding completed.
Motifs: open door, checklist with checkmarks, handshake abstract (geometric), welcome arc.
Friendly, HR-safe, no faces.
```

### B. セキュリティ基礎

```text
[共通ブロック]
Teal #0d9488 and slate #334155. Theme: security awareness basics completed.
Motifs: shield with lock, keyhole abstract, padlock silhouette, subtle binary pattern in background (very faint).
Serious compliance tone.
```

### C. 汎用「コース修了」プレースホルダー（タイトル差し替え用）

```text
[共通ブロック]
Indigo #4f46e5 and violet #7c3aed gradient accent. Theme: generic course completion micro-credential.
Motifs: open book, graduation cap simplified, laurel branches partial arc, single star.
Leave center area slightly empty for future text overlay in UI; no long text in image.
```

---

## ネガティブプロンプト（品質・リスク回避）

生成 UI に「除外」欄がある場合、または追記するとき:

```text
Avoid: photorealistic people, blurry text, illegible tiny letters, official OpenAI/Google/Microsoft logos,
Apple logo, national flags, blood/gore, child imagery, cluttered background, 3D plastic toy look,
low resolution artifacts, asymmetric off-center crop for a square badge.
```

---

## 納品後のプロトタイプ取り込み（開発メモ）

- 保存先の例: `public/badges/chatgpt-master.png` など。  
- `Badge` 型に `imageUrl?: string` を足し、カードでは `icon` 絵文字の代わりに `<Image>` を使う形に拡張可能。  
- 同一デザイン言語で揃えるため、**一括生成時は共通ブロックと「shape: shield vs circle」を固定**することを推奨。

---

## 一括生成用ショートコマンド例（英語1本）

5枚まとめて依頼する場合:

```text
Generate 5 square digital badge icons (1024x1024) for the same enterprise LXP product, consistent style:
flat vector, shield or medallion, no logos, no photos. Variants:
(1) indigo AI chat literacy (2) violet AI exploration path (3) sky blue data analytics intro
(4) amber JavaScript dev (5) pink DX leadership. High contrast for small UI thumbnails.
```

このあと各バッジの **モチーフ詳細** は上記「バッジ別」節を追記すると精度が上がります。
