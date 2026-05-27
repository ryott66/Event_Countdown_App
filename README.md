# Our Countdown

二人専用のイベントカウントダウン Web アプリ。

イベントを登録すると残り日数をカウントダウン表示し、特別な日には Reactで自作したカスタムページに切り替えられる。誕生日サプライズなど「手で作った特別なページ」と「日々のイベント管理」を共存させるためのアプリ。

**公開URL**: <https://ryott66.github.io/Event_Countdown_App/>

---

## 技術スタック

| 役割 | 技術 |
|---|---|
| フロントエンド | React 19 + TypeScript + Vite |
| ルーティング | React Router v7 (HashRouter) |
| 認証 | Firebase Authentication（Googleログイン） |
| DB | Cloud Firestore |
| 画像ストレージ | Firebase Storage |
| ホスティング | GitHub Pages（`gh-pages` パッケージ） |
| PWA | `vite-plugin-pwa`（ホーム画面追加対応） |
| 装飾 | `canvas-confetti`、`react-pageflip` |

---

## 画面構成

```
① LoginPage             未ログイン & ゲストキー不一致時に表示
② HomePage              Togetherカウンター + イベント一覧 + 共有ギャラリー（Memories）
③ EventDetailPage       テンプレート方式 or カスタムページ
④ EventFormPage         イベント追加・編集（管理者のみ）
```

イベント詳細は **テンプレート方式** と **カスタムページ方式** のハイブリッド。テンプレートはテーマ（birthday / travel / anniversary / date）を選ぶだけで完成。特別なイベント用に React コンポーネントを自分で書いて差し込むこともできる（後述）。

---

## 認証システム

ユーザー状態は4種類（[src/contexts/AuthContext.tsx](countdown-app/src/contexts/AuthContext.tsx)）。

| state | 条件 | 表示される画面 |
|---|---|---|
| `loading` | 初期認証チェック中 | ローディング |
| `admin` | Googleログイン済み **かつ** 管理者UIDリストに登録あり | 全機能（閲覧＋編集＋追加） |
| `guest` | 未ログイン **かつ** URL `?key=xxx` がFirestoreの `config/guestKey.key` と一致 | 閲覧のみ |
| `unauthorized` | 上記いずれでもない | LoginPage |

### 認証フロー
1. 起動時に `onAuthStateChanged` をリッスン
2. Firebaseユーザーが居る → `VITE_ADMIN_UIDS` に含まれれば `admin`、無ければ即 `signOut()` して `unauthorized`
3. Firebaseユーザーが居ない → URLの `?key=` を Firestore と照合、一致なら `guest`、無ければ `unauthorized`

### 管理者を追加する
新しい管理者を追加する場合：

1. 該当のGoogleアカウントで一度ログインを試みる（このとき unauthorized で弾かれてOK）
2. [Firebase Console](https://console.firebase.google.com/) → Authentication → Users で **UID** をコピー
3. [`countdown-app/.env`](countdown-app/.env) の `VITE_ADMIN_UIDS` にカンマ区切りで追加
   ```
   VITE_ADMIN_UIDS=既存UID,新しいUID
   ```
4. [`countdown-app/firestore.rules`](countdown-app/firestore.rules) と [`countdown-app/storage.rules`](countdown-app/storage.rules) の `isAdmin()` のリストにも同じUIDを追加
5. Firebase Console でルールを再公開
6. 再ビルド・再デプロイ（`npm run deploy`）

### ゲストアクセス
閲覧用URL：

```
https://ryott66.github.io/Event_Countdown_App/?key=XXXX
```

このURLを共有された人はGoogleログイン不要で閲覧できる。作成・編集・削除は不可。キー文字列は Firestore の `config/guestKey` ドキュメントで管理。

---

## Firebase設定

### Firebase Consoleでやる初期設定
1. **Authentication** → サインイン方法 → **Google** を有効化
2. **Firestore Database** → データベース作成（リージョン: `asia-northeast1`）
3. **Storage** → Storageバケット作成（同リージョン）
4. プロジェクト設定 → 全般 → ウェブアプリ追加 → 表示された設定値を `.env` にコピー

### セキュリティルールのデプロイ
リポジトリ内のルールファイル：
- [`countdown-app/firestore.rules`](countdown-app/firestore.rules)
- [`countdown-app/storage.rules`](countdown-app/storage.rules)

現状は Firebase Console で手動コピペでデプロイする運用：
1. Console → Firestore Database → ルール → ファイル内容を貼り付け → 公開
2. Console → Storage → ルール → ファイル内容を貼り付け → 公開

ルール変更時は両方デプロイすること。`firestore.rules` と `storage.rules` の管理者UIDリストは同期させる必要がある。

### 環境変数（.env）
`.env` は Git管理外。新規環境では以下を用意する：

```
VITE_FIREBASE_API_KEY=xxxx
VITE_FIREBASE_AUTH_DOMAIN=xxxx.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=xxxx
VITE_FIREBASE_STORAGE_BUCKET=xxxx.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=xxxx
VITE_FIREBASE_APP_ID=xxxx
VITE_ADMIN_UIDS=uid1,uid2
```

Firebase設定値はConsole「プロジェクト設定」から取得可能。Vite規約で `VITE_` プレフィックス必須。

---

## イベント詳細ページのカスタマイズ

このアプリ最大の特徴。テンプレートで簡単に作るか、自分で1ページを書くか選べる。

### A. テンプレート方式（通常）

テーマを選ぶだけでデザインが決まる。アプリ内のフォームで完結。

| テーマ | 用途 | カラー |
|---|---|---|
| `birthday` | 誕生日 | ピンク |
| `travel` | 旅行 | 青空 |
| `anniversary` | 記念日 | ボルドー |
| `date` | デート | オレンジ |

カラー・confetti色などは [src/constants/themes.ts](countdown-app/src/constants/themes.ts) で一元定義。テーマを追加するときはこのファイルに1セット追加するだけで EventFormPage / EventDetailPage 両方に反映される。

### B. カスタムページ方式（特別なイベント用）

`src/custom-pages/` にReactコンポーネントを配置して紐付ける。テンプレートでは表現しきれない演出やレイアウトに使う。

#### 実装手順

**1. コンポーネントを作る**
```tsx
// src/custom-pages/trip-summer-2026.tsx
import type { Event } from "../types";

interface Props {
  event: Event;
}

export default function TripSummer2026({ event }: Props) {
  // 自由にJSX/CSS/JSロジックを書く
  return <div>...</div>;
}
```

`event` propsには Firestore の全フィールド（`title` / `date` / `imageUrls` 等）が入ってくる。管理者がアプリ内でアップロードした写真もここから参照可能。

**2. レジストリに登録**
```ts
// src/custom-pages/index.ts
export const customPageRegistry = {
  "birthday-2026": lazy(() => import("./birthday-2026")),
  "trip-summer-2026": lazy(() => import("./trip-summer-2026")), // 追加
};
```

`lazy()` で囲うことで各カスタムページが個別チャンクに分割され、必要なときだけダウンロードされる。

**3. Firestoreでイベントを設定**
EventFormPage（イベント追加・編集画面）で：
- 「カスタムページを使う」をオン
- 「カスタムページキー」に `trip-summer-2026` を入力（レジストリのキーと一致させる）

EventDetailPage が `useCustomPage` と `customPageKey` を見て、テンプレートではなくカスタムページにルーティングする（[EventDetailPage.tsx:180-183](countdown-app/src/pages/EventDetailPage.tsx#L180-L183)）。

#### 既存のサンプル
[src/custom-pages/birthday-2026.tsx](countdown-app/src/custom-pages/birthday-2026.tsx) が動作例。HTMLFlipBook（本めくり）、横スクロールギャラリー、ライトボックスなど一通り入っている。

#### カスタムページに必要なFirebase設定
特になし。**既存の Firestore イベントドキュメントを利用するだけ**で、新たなコレクションやセキュリティルール変更は不要。

画像を追加で使いたい場合は2通り：
- `imageUrls` フィールド経由（管理者がアプリ内でアップロード → Storage に保存）
- `countdown-app/public/images/` 配下に静的ファイルとして配置（ビルドで配信、SW precache対象）

---

## 共有ギャラリー（Memories）

Homeページ下部の「Mirror Moments」「Cutest Moments」は**イベントに紐づかない共有写真集**。

- Firestore `config/galleries` ドキュメントに `mirrorUrls: string[]` `cuteUrls: string[]` として保存
- Firebase Storage 上は `events/galleries/{galleryKey}/...` に格納
- 新しいギャラリー種別を増やすには [src/constants/galleries.ts](countdown-app/src/constants/galleries.ts) に1行追加するだけで HomePage に自動反映

---

## Firestore データ構造

```
/events/{eventId}
  title: string           // "Reminaの誕生日"
  date: string            // "2026-06-28"
  emoji: string           // "🎂"
  theme: string           // "birthday" | "travel" | "anniversary" | "date"
  memo: string            // 任意
  iconUrl: string         // イベントカード用アイコン画像
  imageUrls: string[]     // Firebase Storage の URL 配列（複数枚）
  useCustomPage: boolean  // false がデフォルト
  customPageKey: string   // useCustomPage=true のときのみ使用
  createdBy: string       // uid
  createdAt: Timestamp
  updatedAt: Timestamp

/config/guestKey
  key: string             // シークレットURLのキー文字列

/config/galleries
  mirrorUrls: string[]    // Mirror Moments の写真URL一覧
  cuteUrls: string[]      // Cutest Moments の写真URL一覧
```

---

## デプロイ

### 自動デプロイ（GitHub Actions）

`main` ブランチへの push をトリガーに [`.github/workflows/deploy.yml`](.github/workflows/deploy.yml) が自動で実行される:

1. `countdown-app` で `npm ci` & `npm run build`
2. ビルド成果物 `dist/` を `gh-pages` ブランチに push
3. GitHub Pages が `gh-pages` ブランチを公開

通常運用では **PR をマージするだけで本番反映** される。`gh-pages` ブランチは Actions が自動で書き換えるので手で触らない。

### PR CI

`main` 向け PR が開かれた時 / PR ブランチに push された時に [`.github/workflows/ci.yml`](.github/workflows/ci.yml) が `npm run lint` + `npm run build` を走らせる。ビルド失敗のコードが main に入らないためのセーフティネット。

### GitHub Secrets（初期設定が必要）

ワークフローは Firebase 設定値を Secrets から読む。リポジトリの **Settings → Secrets and variables → Actions** に以下を登録しておく必要がある（ローカル `.env` と同じ値）:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_ADMIN_UIDS`

加えて **Settings → Actions → General → Workflow permissions** を「Read and write」にして、`GITHUB_TOKEN` に `gh-pages` ブランチへの push 権限を与える。

### 推奨ブランチ運用

```
feat/xxx → develop に PR & マージ
                    ↓
            develop → main に PR & マージ
                    ↓
              ← 自動デプロイ
```

- 機能ブランチは `develop` から切る
- 本番反映したいタイミングで `develop → main` の PR を立てる
- `main` への直 push も自動デプロイの対象だが、緊急時以外は PR 経由を推奨

### 手動デプロイ（フォールバック）

Actions が止まっている時や緊急時に手元から直接デプロイしたい場合:

```bash
cd countdown-app
npm run deploy
```

`predeploy` で `npm run build` が走り、`gh-pages -d dist` で GitHub Pages に push される。Actions 経由と結果は同じ。

### PWA（ホーム画面追加）
- `vite-plugin-pwa` で manifest と Service Worker を自動生成（[vite.config.ts](countdown-app/vite.config.ts)）
- HTML は **NetworkFirst** 戦略でキャッシュ（デプロイ後すぐに最新版が反映されるように）
- JS/CSS/画像は precache（ファイル名にハッシュが入るので入れ替わる）
- 既存のPWAは新SWがアクティブ化されるまで古い版を表示することがある（数秒〜数分のタイムラグ）

### デプロイ後の確認
- 新機能・新ページが反映されているか
- PWA起動時に白画面期間が発生しないか
- 認証関連を変更した場合は、admin / guest / unauthorized 各状態で動作確認

---

## プロジェクト構成

```
.
├── .github/
│   └── workflows/
│       ├── ci.yml           # PR時のlint+build検証
│       └── deploy.yml       # mainへのpushでgh-pagesに自動デプロイ
└── countdown-app/
    ├── public/              # 静的アセット（ビルドでそのまま配信）
    │   ├── images/          # 内蔵画像（カスタムページ・Togetherアイコン等から参照）
    │   ├── icon-192.png     # PWAアイコン
    │   ├── icon-512.png
    │   └── favicon.svg
    ├── src/
    │   ├── components/      # EventCard, TogetherCounter など共通UI
    │   ├── constants/       # themes, galleries, together の定義
    │   ├── contexts/        # AuthContext（認証状態）
    │   ├── custom-pages/    # ★イベント詳細のカスタムページ
    │   │   ├── index.ts     #   レジストリ
    │   │   └── birthday-2026.tsx
    │   ├── hooks/           # useEvents, useEvent, useGalleries
    │   ├── lib/             # firebase.ts, eventService.ts, imageCompression.ts
    │   ├── pages/           # HomePage, EventDetailPage, EventFormPage, LoginPage
    │   ├── types/           # 型定義
    │   ├── App.tsx          # ルーティング
    │   └── main.tsx         # エントリポイント
    ├── firestore.rules      # Firestore セキュリティルール
    ├── storage.rules        # Storage セキュリティルール
    ├── vite.config.ts       # Vite + PWA設定
    └── .env                 # 環境変数（Git管理外）
```

---

## デザイン方針

- ベース背景：淡いピンク（`#fff0f5`）
- アクセントカラー：ピンク（`#e68ab6`）
- タイトル系フォント：`Dancing Script`（Googleフォント）
- ヘッダー：`rgba(207, 220, 231, 0.4)` の半透明
- レスポンシブ：`clamp()` で `html font-size` を制御
- 当日演出：`canvas-confetti` で爆発

「汎用カウントダウンツール」ではなく、コードに手作り感が滲むことを優先する。テンプレート方式だけでなくカスタムページ方式を残しているのもこのため。

---

## セキュリティに関する注意

- **クライアントだけでは完全な秘匿はできない**。Firebase Web SDKの設計上、API KeyやFirebase設定値はビルド後のJSバンドルに公開される
- 本物のアクセス制御は **Firestore / Storage Security Rules** で行うこと。UI側の `isAdmin` チェックは見た目だけ
- `config/guestKey` は現状クライアントから読める仕様（読まないと照合できないため）。本気で秘匿したい場合は Cloud Functions 経由での照合に切り替える必要あり
- 管理者UIDが漏れても直ちに突破口にはならないが、Googleアカウント自体のセキュリティ（2段階認証）は前提

---

## 拡張アイデア

将来追加するときの取っ掛かり：

- **コメント機能**：`/events/{eventId}/comments` サブコレクション
- **リアクション**：イベントへのハート・スタンプ
- **繰り返しイベント**：毎年の記念日（`recurring: boolean` フィールドを予約）
- **プッシュ通知**：イベント1週間前にお知らせ（PWA + Firebase Cloud Messaging）
- **カレンダービュー**：一覧の表示切り替え
- **画像サムネイル別途生成**：ギャラリー用の小サイズ画像をアップロード時に同時保存して初回ロード高速化

コンポーネント・hooks・Firebase操作は分離する方針（ビジネスロジックをUIに直書きしない）。
