# [Component Architecture] Track LMS: Admin Dashboard UI

## 1. App Layout Overview (全体レイアウト構造)
アプリケーション全体のレイアウトは、固定の「左側サイドバー (Sidebar)」、上部の「ヘッダー (Header)」、および動的に切り替わる「メインコンテンツ (Main Content)」の3つの主要セクションで構成される。

```text
<AppLayout>
  ├── <Sidebar />        (左側ナビゲーション)
  ├── <Header />         (上部グローバルヘッダー)
  └── <MainContent />    (ページ固有のコンテンツ領域)
</AppLayout>
```

---

## 2. Component Tree Detailed Specification (コンポーネント詳細ツリー)

画像から読み取れる「eラーニング管理」ページを構成するUIコンポーネントのツリー構造と、各機能の役割を定義する。

### 2.1. Sidebar `<Sidebar />`
システム内の各管理機能へアクセスするためのグローバルナビゲーション。
Track LMSの運用に必要な「学習管理」と「テナント（環境）管理」の機能がブロックで分かれている。

```text
<Sidebar>
  ├── <WorkspaceSelector />
  │    └── (左上) 現在のワークスペース（テナント）を表示・切り替えるドロップダウン。
  │
  ├── <NavigationBlock section="Learning"> (eラーニング運用・管理メニュー)
  │    ├── <NavItem active>eラーニング管理</NavItem>
  │    │    └── コースや学習パスの作成・編集、進捗の全体把握を行う。
  │    ├── <NavItem>eラーニング公開管理</NavItem>
  │    │    └── 作成したコースの受講者・グループへの公開設定を行う。
  │    ├── <NavItem>申請管理</NavItem>
  │    │    └── 受講者からのコース受講申請などを処理する。
  │    └── <NavItem>ディスカッション</NavItem>
  │         └── コース内の特定マテリアルに対する受講者からの質問・回答を管理する。
  │
  ├── <Divider /> (区切り線)
  │
  ├── <NavigationBlock section="TenantAdmin"> (システム・テナント全体管理メニュー)
  │    ├── <NavItem>メンバー</NavItem>
  │    │    └── 受講者アカウントの作成・アーカイブ、グループ管理を行う。
  │    ├── <NavItem>ディスカッション</NavItem>
  │    │    └── テナント全体のディスカッションを俯瞰管理する。
  │    ├── <NavItem>試験</NavItem>
  │    │    └── Track Testと連携した試験機能の配信設定などを行う。
  │    ├── <NavItem>契約</NavItem>
  │    │    └── 利用ライセンスの管理、受講者の契約への紐付けを行う。
  │    ├── <NavItem>ライブラリ</NavItem>
  │    │    └── ブック、チャレンジ、動画、アンケートなどのマテリアル(素材)を管理する。
  │    └── <NavItem>AIアシスタント</NavItem>
  │         └── 受講者とAIアシスタントとの会話ログを確認し、躓きを分析する。
  │
  └── <FloatingSupportButton />
       └── (左下) カスタマーサクセスへ問い合わせるためのチャット起動ボタン。
```

### 2.2. Header `<Header />`
現在のアカウント状態やテナント情報を表示する上部の固定ヘッダー。

```text
<Header>
  ├── <TenantInfo>
  │    ├── <Logo /> (Trackロゴ)
  │    └── <TenantName>Track Demo (track id)</TenantName>
  │
  └── <UserActions>
       ├── <IconButton icon="Bell" /> (通知機能)
       ├── <IconButton icon="Settings" /> (環境設定)
       └── <UserProfileDropdown>
            ├── <UserName>Track admin</UserName>
            └── <UserRoleBadge>管理者</UserRoleBadge>
</Header>
```

### 2.3. Main Content `<MainContent />` (現在の画面: eラーニング管理)
選択されたメニューに応じたデータや操作UIを表示する領域。画像は「eラーニング管理」の一覧画面。

```text
<MainContent>
  ├── <PageHeader>
  │    └── <PageTitle>eラーニング管理</PageTitle>
  │
  ├── <FilterSection>
  │    └── <SearchBar placeholder="検索" />
  │         └── コース名や種類で一覧を絞り込むためのテキストインプット。
  │
  └── <DataTable> (コース・学習パスの一覧テーブル)
       ├── <TableHeader>
       │    ├── タイトル
       │    ├── 受講者 (人数)
       │    ├── 種類 (コース / 学習パス)
       │    ├── 難易度 (入門 / 初級 / 中級)
       │    ├── 想定受講時間
       │    └── 進捗 (ステータスアイコン/バー)
       │
       ├── <TableBody>
       │    └── <TableRow> (各行のコンポーネント)
       │         ├── <TableCell type="Text">ChatGPT 基礎講座 知識編</TableCell>
       │         ├── <TableCell type="Number">4</TableCell>
       │         ├── <TableCell><Badge type="Ghost">コース</Badge></TableCell>
       │         ├── <TableCell><Badge type="Success">初級</Badge></TableCell>
       │         ├── <TableCell type="Text">3時間 2分</TableCell>
       │         └── <TableCell><ProgressIndicators stats="{completed: 4}" /></TableCell>
       │              └── (丸いバッジとプログレスバーを組み合わせた独自の進捗可視化UI)
       │
       └── <TablePagination>
            ├── <PageSelector>ページ 1 v</PageSelector>
            ├── <PaginationText>1-20 of 21</PaginationText>
            ├── <ArrowButtons direction="prev/next" />
            └── <RowsPerPageSelector>20件 v</RowsPerPageSelector>
</MainContent>
```

## 3. Implementation Notes for AI Agent (AIへの実装指示)
- **Styling (Tailwind CSS):**
  - 全体的に白とライトグレーを基調とし、サイドバーはダークネイビー（`bg-slate-900`等）を採用すること。
  - 角丸（`rounded-md` / `rounded-lg`）を多用し、柔らかくモダンなSaaSらしいUIにすること。
- **Component Reusability:** `<Badge />`コンポーネントは「種類」や「難易度」で多用されているため、色やテキストをPropsで変更できる再利用可能なコンポーネントとして設計すること。
- **Progress UI:** テーブル右端の「進捗」カラムは、黄色いプログレスバーと数字の入った丸いバッジを組み合わせたカスタムコンポーネント `<ProgressIndicator />` として切り出し、モックデータを流し込めるようにすること。
