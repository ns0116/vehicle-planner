# vehicle-planner — Claude Context

生成AIで自動車の商品企画書（コンセプト）を自律生成するWebアプリ。12段階レイヤー（PEST/3C分析〜デザイン思考〜自己批判による再構築）でプロの企画プロセスをエミュレートする。詳細は [`docs/AI_ARCHITECTURE.md`](docs/AI_ARCHITECTURE.md) を参照。

## スタック

- Node.js 20.19+ または 22.12+（Vite 8 の要件。CI は Node 20）/ フロントエンド中心。Google Gemini API を利用
- 可視化: `recharts`（レーダーチャート等）
- XSS対策: `rehype-sanitize`

## 実行

```bash
npm ci
npm run dev       # 開発サーバー（Vite）
npm run lint      # ESLint
npm run test      # Vitest（jsdom）
npm run build     # dist/ に出力
npm run preview   # build 結果の確認
```

CI（`.github/workflows/ci.yml`）は Node 20 で `lint` → `test` → `build` を実行する。変更後はこの 3 つが通ることを確かめる。

- Node 25 では Node 組み込みの `localStorage` が jsdom のものを上書きし、`utils.test.js` が `localStorage.clear is not a function` で落ちる。手元が Node 25 なら `NODE_OPTIONS=--no-experimental-webstorage npm run test` で実行する（CI の Node 20 では起きない）

### クラウドサンドボックスでの確認

Gemini の API キーは画面から入力してブラウザの localStorage に保存する方式で、環境変数からは読まない。そのためクラウドセッションでは企画書の生成（API 呼び出し）までは確かめられない。確認は `npm run lint`・`npm run test`・`npm run build` の 3 つで行い、画面の確認が必要な変更はプレビュー URL か手元でユーザーに確認してもらう。

## デザイン・企画スタイルの好み

個人の企画・デザインスタイルの好みは `CLAUDE.local.md`（非公開・gitignore対象）を参照。存在しない環境（フォーク・クラウドセッション等）では、このセクションの好みは前提とせず、一般的なベストプラクティスに従うこと。
