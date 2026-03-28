# 01 — 技術スタックと設定

## 1. 技術スタック

| 項目 | 内容 |
|------|------|
| フレームワーク | Next.js 16.x (App Router) |
| UI | React 19 |
| 言語 | TypeScript 5 |
| スタイル | Tailwind CSS 4 (@tailwindcss/postcss) |
| アイコン | lucide-react |
| グラフ | recharts |
| フォント | next/font/google — Inter, `display: "optional"` |

## 2. package.json

### scripts

```json
{
  "scripts": {
    "dev": "next dev --hostname 127.0.0.1 --turbopack",
    "dev:kill": "lsof -ti :3000 | xargs kill -9 2>/dev/null; lsof -ti :3002 | xargs kill -9 2>/dev/null; rm -f .next/dev/lock 2>/dev/null; echo 'Port 3000/3002 freed, lock removed.'",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  }
}
```

- **dev:** Turbopack 使用。`--hostname 127.0.0.1` は一部環境で `uv_interface_addresses` エラーを避けるため。外すと localhost 全インターフェースで待ち受け。
- **dev:kill:** ポート 3000/3002 を占有しているプロセスを終了し、`.next/dev/lock` を削除。

### dependencies

```json
{
  "dependencies": {
    "lucide-react": "^0.577.0",
    "next": "16.1.6",
    "react": "19.2.3",
    "react-dom": "19.2.3",
    "recharts": "^3.8.0"
  }
}
```

### devDependencies

```json
{
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.1.6",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

## 3. next.config.ts

- **turbopack.root:** 親ディレクトリに別の lockfile がある場合にプロジェクトルートを明示。`process.cwd()` を指定。

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
};

export default nextConfig;
```

## 4. tsconfig.json

- **paths:** `"@/*": ["./src/*"]` でインポートに `@/` を使用。
- **plugins:** `{ "name": "next" }`。
- **jsx:** `"react-jsx"`。
- **moduleResolution:** `"bundler"`。

## 5. Tailwind / globals.css

- **Tailwind 4:** `@import "tailwindcss";` と `@theme inline { ... }` でテーマを定義。
- **body:** `background: var(--background); color: var(--foreground); font-family: Arial, Helvetica, sans-serif;`
- **キーフレーム:** `fade-in`、`slide-in-from-right`。クラス `.animate-fade-in-right` でステップ遷移などに使用。
- **スキップリンク:** `.skip-link` で画面外に配置し、`:focus` で左上に表示（背景 #4f46e5、白文字、角丸）。キーボードアクセシビリティ用。

## 6. ルートレイアウト (src/app/layout.tsx)

- **metadata:** title `"Track e-learning - New Hub"`, description `"Next Generation e-Learning Platform"`。
- **フォント:** `Inter({ subsets: ["latin"], display: "optional" })` を body に `className={inter.className}` で適用。
- **html:** `lang="ja"`。
- **body 直下:** `<AuthProvider>{children}</AuthProvider>`。全ページが認証コンテキスト内でレンダリングされる。

## 7. 注意事項

- プロジェクトルートで `npm run dev` / `npm run build` を実行すること。親に package-lock.json があると Next がルートを誤認識する場合があるため、`turbopack.root` で対処している。
