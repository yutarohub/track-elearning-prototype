# [Project Context] Track e-learning: Self-Learning Workspace UI Prototype

## 1. System Overview (システム概要)
本プロジェクトの目的は、ITエンジニア育成プラットフォーム「Track e-learning」から独立する新しい「Self-Learning (自学自習) ワークスペース」のフロントエンドUIプロトタイプを作成することである。
将来的に「Skill Hub」とのシームレスなマイクロサービス連携を前提としたモダンなUIを設計せよ。

## 2. Architectural Paradigm: Bootcamp vs Self-Learning
UI設計の方向性を決定づけるため、Track e-learningにおける2つの主要な学習パラダイムの違いを定義する。
本プロジェクトでは **「Self-Learning」の要件**に基づいてUIを構築すること。

| 比較項目 | Bootcamp (ブートキャンプ) | Self-Learning (セルフラーニング) [🎯本件の対象] |
| :--- | :--- | :--- |
| **主導パラダイム** | スケジュール主導 (Schedule-driven) | 自己進捗主導 (Progress-driven) |
| **UIのコアコンポーネント** | カレンダー、タイムライン (日付ベース) | パスウェイ、ステップリスト (進捗ベース) |
| **コンテンツ解放トリガー** | 指定された日時 (Cron) | 前提課題の完了状態 (Task Completion) |
| **ターゲットユースケース** | 新卒一括研修、期間固定の集合研修 | リスキリング、内定者学習、マイペース学習 |

## 3. Core UX Philosophy (UXの基本思想)
- **Active Learning (能動的学習):** 管理者がコンテンツを与えるのを待つのではなく、学習者自らが次々と学習を進められるUI。
- **Self-Resolution (自己解決の促進):** 躓いた際に学習が止まらないよう、AIや他者からのヒントを得やすい導線を配置する。

## 4. Feature Specifications & UI Requirements (機能とUI要件)
Self-Learningワークスペースに実装すべきコア機能と、プロトタイプにおけるUIコンポーネントの要件を定義する。

### 4.1. Automated Material Release (自動マテリアル公開 / 学習パス)
- **Functional Concept:** 前の課題（マテリアル）を完了すると、次の課題が自動でアンロックされる仕組み。
- **UI Requirements:**
  - 学習マテリアル（ブック、ビデオ、チャレンジ等）がステップバイステップで並ぶ「学習パス (Learning Path)」ビューを作成。
  - **State表現:**
    - `Completed` (完了): チェックマーク、アクセントカラー。
    - `Active` (現在進行中): ハイライト表示、[開始]ボタン。
    - `Locked` (未解放): グレーアウト、鍵アイコン、クリック不可。

### 4.2. AI Teaching Advisor (AIアシスタント)
- **Functional Concept:** 答えを教えるのではなく、学習者の自己解決を促す（思考のヒントを出す）教育特化型AIチャット。
- **UI Requirements:**
  - 画面右下（またはヘッダー右上）に常駐する Floating Action Button (FAB)。
  - クリックアクションにより、右側からオーバーレイする Slide-in Chat Panel を表示。
  - プロンプトの初期サジェストボタン（例：「エラーの意味がわからない」「考え方のヒントが欲しい」）を配置。

### 4.3. Peer Discussion (ディスカッション機能)
- **Functional Concept:** AIで解決できない疑問を、「クラス全体（他受講者）」や「管理者」に質問し、学び合う機能。
- **UI Requirements:**
  - 学習コンテンツ（エディタやテキストエリア）の近傍に配置されるインラインのアクションアイコン（💬）。
  - アイコンクリックで、スレッド形式の掲示板モーダルまたはサイドパネルが展開。
  - 投稿時に公開範囲（Public / Admin Only）を選択できるトグルUI。

### 4.4. Personal Notes (パーソナルノート)
- **Functional Concept:** 学習者が自身のためだけに記録するプライベートな備忘録機能。
- **UI Requirements:**
  - 各学習ページに紐づく、シンプルなテキストエリアUI。
  - （任意）Markdown記法をサポートし、コードスニペットなどをメモしやすくする。

### 4.5. Daily Report & Tracking (日報・目標管理)
- **Functional Concept:** 定期的な振り返りと、管理者・学習者自身による学習ペースの定点観測アンケート。
- **UI Requirements:**
  - **Dashboard Widget:** メインダッシュボード上に「本日の日報（未提出 / 提出済）」の状態を示すカードコンポーネントを配置。
  - 未提出の場合は、目立つCTAボタンで入力フォーム（モーダルまたは別ページ）へ誘導。

## 5. Development Instructions for AI Agent (開発エージェントへの指示)
1. **Component Design:** 上記の要素（学習パス、AIチャットパネル、ダッシュボードウィジェット）をTailwind CSSを用いてモダンかつクリーンにスタイリングせよ。
2. **Mock Data:** 各UIが機能しているように見せるため、適切なモックデータ（ダミーのクラス名、進捗率、AIの会話履歴など）をハードコードせよ。
3. **Interactivity:** ロック状態のUIや、AIチャットパネルの開閉など、フロントエンドのみで完結する状態管理（React `useState` 等）を実装せよ。
