# 02 — 認証とルーティング

## 1. 認証コンテキスト (src/context/AuthContext.tsx)

### 型定義

```ts
type User = {
  email: string;
  role: "admin" | "learner";
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  view: "admin" | "learner";
  setView: (view: "admin" | "learner") => void;
};
```

### 状態

- **user:** ログイン中のユーザー。null のときは未ログイン。
- **view:** 現在のビュー種別（管理者 / 受講者）。ヘッダーの切替ボタンで変更。
- **authChecked:** 初回の localStorage / pathname チェックが終わったか。false の間は「読み込み中」UIを表示。

### 永続化

- **localStorage キー:** `"track_user"`。値は `JSON.stringify(User)`。
- ページ読み込み時に `track_user` を読んで `setUser`。不正 JSON の場合は removeItem。

### ロジック（useEffect）

1. **pathname === "/login"** → `setAuthChecked(true)` のみ。リダイレクトしない。
2. **pathname == null**（ルーター未準備）→ `setAuthChecked(true)` のみ。
3. **localStorage に track_user あり** → パースして `setUser`、`setAuthChecked(true)`。
4. **pathname が /admin または /learner で始まり、かつ NODE_ENV === "development"** → デモユーザー `{ email: "demo@track.local", role: "admin" }` を setUser し localStorage に保存、`setAuthChecked(true)`。
5. **上記以外** → `router.push("/login")`、`setAuthChecked(true)`。

### login(email, password)

- 成功条件: `email === "yutaro.iwasaki@givery.co.jp"` かつ `password === "tracklms"`。
- 成功時: 新 User を setUser し localStorage に保存、`return true`。
- 失敗時: `return false`。

### logout()

- `setUser(null)`、localStorage の `track_user` を削除、`router.push("/login")`。

### setView (handleSetView)

- `setView(newView)` 後、`learner` なら `router.push("/learner/workspace")`、`admin` なら `router.push("/admin/dashboard")`。

### 読み込み中 UI

- `!authChecked` のとき、画面中央にダーク背景（`#0f1629`）、Track ロゴ風「T」、文言「読み込み中...」を表示。

---

## 2. ルート / (src/app/page.tsx)

- **クライアントコンポーネント**（"use client"）。
- `useEffect` 内で `router.replace("/login")` を実行。
- 表示は「リダイレクト中...」のローディング（背景 #0f1629、T ロゴ、テキスト）のみ。

---

## 3. ログイン画面 (src/app/login/page.tsx)

- **クライアントコンポーネント。**
- **状態:** email（初期値 `"yutaro.iwasaki@givery.co.jp"`）、password（初期値 `"tracklms"`）、error、loading。
- **送信:** `login(email, password)` を呼び、成功なら `router.push("/admin/courses")`、失敗なら `setError("IDまたはパスワードが正しくありません。")`。
- **UI:**
  - 背景: `#0f1629`。ぼかしのグラデーション円、装飾用の光る点。
  - 中央カード: 白半透明・角丸・backdrop-blur。タイトル「Track Hub」、サブ「新生 eラーニング統合ダッシュボード」。
  - フォーム: 「管理者ログイン」見出し、メール・パスワード入力（lucide-react の Mail / Lock アイコン）、エラー時は role="alert" でメッセージ表示、送信ボタン（loading 時はスピナーと aria-busy）。
  - アクセシビリティ: label の htmlFor と input の id（login-email, login-password）、autoComplete、ボタンに aria-label。

---

## 4. ルート一覧とガード

| パス | 認証不要 | 開発時デモユーザー |
|------|----------|---------------------|
| / | ✓（即 /login へ） | — |
| /login | ✓ | — |
| /admin/* | ✗ | ✓（直アクセスで自動セット） |
| /learner/* | ✗ | ✓（直アクセスで自動セット） |

管理画面ページはすべて `<AppLayout>` でラップし、`useAuth()` の `user` が null のときは AppLayout が children のみを表示（サイドバー・ヘッダーなし）。実質未ログイン時は AuthContext の effect で /login に飛ばすか、デモユーザーが入る。

---

## 5. 再実装時のチェックリスト

- [ ] AuthProvider をルート layout の body 直下に配置
- [ ] pathname が null のときのガード（setAuthChecked(true) のみ）
- [ ] 開発時 /admin または /learner 直アクセスでデモユーザーをセット
- [ ] ルート `/` はクライアントで `router.replace("/login")`
- [ ] ログイン成功時は `/admin/courses` へ push
- [ ] 認証情報は localStorage `track_user` に JSON で保存
