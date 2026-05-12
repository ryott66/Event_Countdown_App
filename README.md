# countdown-app 引き継ぎドキュメント

> Claude Code に渡す引き継ぎ用ドキュメントです。
> Cowork（デスクトップ版Claude）での設計会話をもとに作成しました。
> **このファイルを読んでから実装を始めてください。**

---

## プロジェクト概要

**何を作るか：** 二人専用のイベントカウントダウンアプリ

**背景：**
- りょうさんが彼女Reminaさんへの誕生日サプライズとして毎年Webで何かを作っている
- 昨年（2025年）は誕生日カウントダウンページを作成・GitHub Pagesで公開（`ryott66.github.io/React_Page/`）
- 今年（2026年）は「一つのイベントだけでなく、様々なイベントを登録・管理できるアプリ」として発展させる
- Reminaさんの誕生日は **6月28日**（2026年は23歳）

**重要な価値観（実装時に常に意識すること）：**
> 「普通の世の中に存在するアプリではなく、私がいちいちコーディングして専用のページが出来上がるという良さがある」

つまりこのアプリは、汎用的なカウントダウンツールではなく、「りょうさんが手で作った、二人だけのもの」という質感を大切にして作ること。コードの随所にそのセンスが出るようにする。

---

## 技術スタック

| 役割 | 技術 |
|------|------|
| フロントエンド | React + TypeScript + Vite |
| ルーティング | React Router v6 |
| 認証 | Firebase Authentication（Googleログイン） |
| DB | Cloud Firestore |
| 画像ストレージ | Firebase Storage |
| デプロイ | GitHub Pages（`gh-pages`パッケージ） |
| PWA | `vite-plugin-pwa`（ホーム画面追加対応） |

**既存のReact_Pageリポジトリとの関係：**
- 完全に**別リポジトリ・別URL**で独立して作る
- 既存ページ（`ryott66.github.io/React_Page/`）はそのまま触らず残す
- ただし既存ページのCSSや実装（confettiなど）は参考・流用してよい

---

## 認証設計

### 管理者モード（りょうさん）
- Googleアカウントでログイン
- イベントの作成・編集・削除・閲覧すべて可能

### 閲覧モード（Reminaさん）
- **シークレットURL方式**：URLにキーを埋め込む
  ```
  https://ryott66.github.io/countdown-app/?key=XXXX
  ```
- このURLを知っていればGoogleログイン不要で閲覧できる
- 作成・編集・削除は不可（読み取り専用）
- ReminaさんにはこのURLをリリース時にLINEで一度送るだけでよい

**実装方針：**
- キーは Firestore の `config/guestKey` ドキュメントで管理（りょうさんがアプリ内から変更できるようにしておく）
- URLパラメータのキーと Firestore のキーを照合して認証状態を決定
- キーが一致すれば `isGuest: true` のコンテキストを付与

---

## アクセス制御
- Firestoreのセキュリティルール：認証済みユーザー（Google）またはゲストキー検証済みのみ読み取り可
- ゲストキー検証はクライアントサイドで行う（サーバーレス設計のため）
- 許可するGoogleアカウントは Firestore ルールで特定のメールアドレス2件に絞る

---

## 画面構成

```
① ログイン画面
    ├── Googleログインボタン（管理者用）
    └── または シークレットURLで自動ログイン（ゲスト用）

② イベント一覧（ホーム）
    ├── ヘッダー：「Our Events」 + 追加ボタン（管理者のみ表示）
    ├── セクション「これから」：残り日数順に並んだイベントカード
    │     └── カード：絵文字 ＋ タイトル ＋ 残り日数（大きく）＋ 日付
    └── セクション「過去」：終了済みイベント（薄く表示）

③ イベント詳細（カウントダウン）
    ├── 戻るボタン
    ├── 絵文字 ＋ イベント名 ＋ 日付
    ├── 日・時・分・秒 のライブカウントダウン
    ├── メモ表示
    ├── 画像ギャラリー（横スクロール）
    └── 当日：confetti爆発 ＋ お祝いメッセージ

④ イベント追加・編集フォーム（管理者のみ）
    ├── タイトル（必須）
    ├── 日付（必須）
    ├── 絵文字選択（必須）
    ├── テーマ選択（必須）→ 詳細は後述
    ├── メモ（任意）
    ├── 画像アップロード（複数枚・任意）
    └── カスタムページ設定（任意）→ 詳細は後述
```

---

## イベント詳細ページ：ハイブリッド方式

このアプリ最大の特徴。2つのモードを共存させる。

### A. テンプレート方式（通常）
- テーマを選ぶだけでデザインが決まる
- アプリ内で完結、コーディング不要
- 用意するテーマ（最低限）：

| テーマ | 用途 | カラー | 演出 |
|--------|------|--------|------|
| `birthday` | 誕生日 | ピンク系 | confetti |
| `travel` | 旅行・旅 | 青空系 | confetti |
| `anniversary` | 記念日 | ボルドー系 | confetti |
| `date` | デート・食事 | オレンジ系 | confetti |

### B. カスタムページ方式（特別なイベント用）
- りょうさんが自分でReactコンポーネントを書いて紐付ける
- 既存の誕生日ページのような自由な演出・レイアウトが可能
- `src/custom-pages/` フォルダに配置する

```
src/
  custom-pages/
    birthday-2026.tsx    ← 今年の誕生日用（りょうさんが書く）
    trip-summer-2026.tsx ← 夏旅行用（後で作る）
```

- Firestoreのイベントデータに `useCustomPage: true` と `customPageKey: "birthday-2026"` を持たせる
- カスタムコンポーネントには `event` オブジェクトがpropsで渡ってくる（タイトル・日付・画像URLなどを再利用可能）

```tsx
// EventDetail.tsx のルーティングイメージ
if (event.useCustomPage) {
  const CustomPage = customPageRegistry[event.customPageKey];
  return <CustomPage event={event} />;
} else {
  return <TemplateDetail event={event} />;
}
```

---

## Firestoreデータ構造

```
/events/{eventId}
  title: string           // "Reminaの誕生日"
  date: string            // "2026-06-28"
  emoji: string           // "🎂"
  theme: string           // "birthday" | "travel" | "anniversary" | "date"
  memo: string            // 任意
  imageUrls: string[]     // Firebase Storage の URL 配列（複数枚）
  useCustomPage: boolean  // false がデフォルト
  customPageKey: string   // useCustomPage=true のときのみ使用
  createdBy: string       // uid
  createdAt: Timestamp
  updatedAt: Timestamp

/config/guestKey
  key: string             // シークレットURLのキー文字列
```

---

## デザイン方針

既存の `React_Page` のCSSを継承・踏襲すること。

```css
/* 既存ページの主要スタイル値 */
background-color: #fff0f5;           /* ベース背景：淡いピンク */
font-family: 'Dancing Script', cursive; /* 見出し・タイトル */
color: #e68ab6;                      /* アクセントカラー（ピンク）*/
background-color: rgba(207, 220, 231, 0.4); /* ヘッダー */
color: rgb(200, 247, 255);           /* カウントダウン数字 */
```

- `Dancing Script`（Googleフォント）を必ず使う
- confettiは `canvas-confetti` パッケージ（既存と同じ）
- レスポンシブ対応：既存と同様に `clamp()` で `html font-size` を制御

---

## 拡張性のための設計方針

将来追加する可能性があるので、最初から設計に織り込んでおく：

- **コメント機能**：`/events/{eventId}/comments` サブコレクション
- **リアクション**：イベントへのハート・スタンプ
- **繰り返しイベント**：毎年の記念日（`recurring: boolean` フィールドを予約）
- **プッシュ通知**：イベント1週間前にお知らせ（PWA + Firebase Cloud Messaging）
- **カレンダービュー**：一覧の表示切り替え

コンポーネント・hooks・Firebase操作は必ず分離すること（ビジネスロジックをUIに直書きしない）。

---

## 実装ステップ（推奨順）

```
Step 1: Firebaseプロジェクト確認（コンソールで設定済みのはず）
          └ Authentication（Google有効化）
          └ Firestore（asia-northeast1）
          └ Storage

Step 2: Viteプロジェクト作成
          npm create vite@latest countdown-app -- --template react-ts

Step 3: 依存パッケージインストール
          firebase
          react-router-dom
          canvas-confetti + @types/canvas-confetti
          vite-plugin-pwa

Step 4: Firebase設定・環境変数（.env）

Step 5: 認証（Google + ゲストキー）

Step 6: Firestoreフック（useEvents, useEvent）

Step 7: イベント一覧ページ

Step 8: イベント追加・編集フォーム + Storageアップロード

Step 9: テンプレート詳細ページ（テーマ4種）

Step 10: カスタムページ基盤（registry + birthday-2026.tsx の雛形）

Step 11: PWA設定（manifest, icon）

Step 12: GitHub Pagesデプロイ設定
```

---

## りょうさんの要望・スタンス（暗黙の要件）

- **コードを理解しながら進めたい**：実装の都度、なぜそう書くかを簡潔に説明すること
- **拡張性を意識**：「後でこうできる」という設計の理由も伝えること
- **手作り感を大切に**：テンプレート方式だけでなく、自分でコードを書けるカスタム方式を残したのはこのため。実装は「コピペで動くだけ」ではなく、りょうさんが後から自分で手を入れられるコードにする
- **Remina への驚き**：完成物はReminaさんへのサプライズ。ロマンチックで温かみのある仕上がりを意識する
- **既存ページのリファクタリング**も将来的にやりたい（今回は対象外だが、既存コードの構造を把握しておくと後で役立つ）

---

## 参考：既存ページの構成

```
React_page/
  src/
    components/
      Header.tsx        ← fixed header, スムーズスクロール実装済み
      MainSection.tsx   ← カウントダウンロジック（流用可）
      BookSection.tsx   ← react-pageflip 使用
      Memories.tsx      ← 横スクロールギャラリー（流用可）
      TripSection.tsx
      Footer.tsx
    utils/
      handleButtonClick.ts
    index.css           ← デザイントークン参照元
```

`MainSection.tsx` のカウントダウンロジックと `canvas-confetti` の使い方は流用推奨。

---

*このドキュメントはCowork（デスクトップ版Claude）での設計セッションをもとに生成されました。*
*作成日：2026-05-12*
