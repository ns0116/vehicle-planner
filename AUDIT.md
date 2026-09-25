# AUDIT.md — vehicle-planner

作成日: 2026-09-24
更新日: 2026-09-25（完了状況整理）

## 完了状況（最終確認: 2026-09-25）

> 状態はこの表が正。下の監査本文は 2026-09-24 監査時点の記録（原文のまま）。

**総合: 🟡 高は完了 / 残り 3件（中2・低1）**

| 優先度 | 完了 | 残り |
|---|---|---|
| 高 | 2/2 | 0 |
| 中 | 0/2 | 2 |
| 低 | 1/2 | 1 |

| # | 優先度 | 項目 | 状態 | 備考 |
|---|---|---|---|---|
| 1 | 高 | CLAUDE.mdの`.gitignore`除外を見直す | ✅ 2026-09-24 | `e637dc9`。デザイン・企画スタイルの好み（非公開希望）は`CLAUDE.local.md`（gitignore対象）に切り出し、CLAUDE.mdにはポインタと「無い環境では一般的なベストプラクティスに従う」旨のみ残した |
| 2 | 高 | SYSTEM_PROMPTの「9段階」表記を12段階に修正 | ✅ 2026-09-24 | `1319d9f` |
| 3 | 中 | lint/test/buildの実行コマンドをREADMEかCLAUDE.mdに明記 | ⬜ 未対応 | 両ファイルとも`npm run dev`のみ |
| 4 | 中 | クラウドサンドボックスでの動作確認手順を追記 | ⬜ 未対応 | README.mdにAPIキー入力手順はあるが、クラウド時の運用・プレビューURLの案内なし |
| 5 | 低 | `settings.local.json`の冗長な`git -C`許可を整理 | ⬜ 未対応 | Git管理外ファイル。影響はローカルのみ |
| 6 | 低 | `.claude/rules/`等の追加を検討 | ➖ 対応不要 | 監査時点で「現状は特に問題ない」と判断。必要になった時点で検討 |

## プロンプト監査結果

### 対象ファイルの有無
- `CLAUDE.md`（プロジェクトルート）: 存在する。ただし後述の通り **Gitに未コミット**。
- `.claude/agents/*`: 存在しない
- `.claude/skills/*`: 存在しない
- `.claude/commands/*`: 存在しない
- `.claude/rules/*`: 存在しない
- （参考）`.claude/settings.local.json`: 存在する。権限許可リストのみで、本タスクの直接の監査対象ではないが、タスク2のローカル依存調査で言及する。

`.claude/agents`・`.claude/skills`・`.claude/commands`・`.claude/rules` は一つも存在しないため、これらに起因する矛盾・重複は「対象ファイルなし」。

### 発見事項

1. **【重大】CLAUDE.md が `.gitignore` により除外され、Gitに未コミット**
   - `.gitignore:32` に以下の記述がある。
     ```
     # Claude Code
     CLAUDE.md
     ```
   - `git ls-files` の結果にも `CLAUDE.md` は含まれず、`git log -- CLAUDE.md` も履歴なし＝一度もコミットされたことがない。
   - つまりクラウドの隔離サンドボックス（まっさらな`git clone`）では、このファイルの内容（スタック概要・実行コマンド・デザイン/企画スタイルの好み）が**一切見えない**。
   - 実害はやや限定的：デザイン方針部分はCLAUDE.md自身が「元 `docs/AI_RULES.md`（Antigravity向けメモリ）より移植」と明記しており、`docs/AI_RULES.md`（Git追跡対象）にほぼ同一内容がある。一方で「## スタック」「## 実行」節（Node.jsバージョン、`npm run dev`など）はCLAUDE.md固有で、クラウド側では失われる（ただしREADME.mdにもほぼ同内容あり）。
   - 意図的な除外（社内規約のテンプレコピペ等）なのか、ユーザーの意図に反する見落としなのかは本調査からは断定できない。

2. 内容自体（29行）は簡潔で、記載範囲内での矛盾は見当たらない。「12段階レイヤー」という表記も `docs/AI_ARCHITECTURE.md`（12-Layer Architecture）と整合している。

3. **曖昧・不足**: CLAUDE.md 15行目は「詳細な起動コマンドはpackage.jsonを確認」と誘導するのみで、`npm run lint` / `npm run test`（vitest）といったコマンドの明記がない。README.mdにも同様の記載なし。`.github/workflows/ci.yml` では lint→test→build が実行されているのに、開発者向けドキュメントのどこにもその実行方法が書かれていない。

4. **抜けているコンテキスト**: CLAUDE.md 26行目で「APIキー管理は`localStorage`等で利便性を確保」と軽く触れているが、「クラウドセッションは毎回まっさらな状態なので、動作確認のたびにGemini APIキーを手動入力する必要がある」という運用上の注意はどこにも書かれていない。

### スコープ外だが関連する気づき（参考）
- `src/aiService.js:15` のSYSTEM_PROMPT本文（AIモデルに実際に渡されるプロンプト）に「全体としてLayer 1からLayer 9までの9段階のプロセスを経ますが」という記述が残っている。しかし実際の `LAYER_INSTRUCTIONS` 配列（`src/aiService.js:30-42`）はLayer 1〜12の**12段階**であり、CLAUDE.md/`docs/AI_ARCHITECTURE.md`の「12-Layer」という記述とも食い違う。恐らく9層→12層への拡張時の更新漏れ。CLAUDE.md/.claude配下ではないため本来のタスク1スコープ外だが、"プロンプトの矛盾"という観点で近いため記載する。

## ローカル依存リスト

### 総括
本プロジェクトはVite + React製の**クライアントサイド完結型**Webアプリ（Google Gemini APIをブラウザから直接呼び出す構成）。サーバーサイドコード・DB・ローカルハードウェア連携・ローカル動画/画像ファイル依存は、検索した範囲では**0件**。

### 確認した観点と結果
- `D:\`, `C:\Users`, `/mnt/`, `\\<NAS等のUNCパス>` のハードコード: 0件（`dist/` のビルド成果物を除く実ソース内）
- 動画/画像ファイルへの絶対パス参照、車載機器・外部ハードウェア連携コード: 0件（本アプリはテキスト生成＋`recharts`によるレーダーチャート可視化のみ）
- `import.meta.env` / `process.env` / `VITE_*` などの環境変数参照: 0件
- ローカルDB接続文字列、社内API/プライベートIPへの直接アクセス: 0件

### 見つかった軽微な項目
1. `README.md:32` — `http://localhost:5173` へのアクセス手順。Viteの既定の開発サーバーURLを案内しているだけで、コード上のハードブロッカーではない。ただしクラウドサンドボックス側でのアクセス方法（ポートフォワーディング/プレビュー機能の使い方）についての案内はどこにもない。
2. `.claude/settings.local.json:8` — `Bash(git -C /d/Naoyuki/Projects/vehicle-planner fetch origin)` のようにNaoyukiさんのローカル絶対パスが権限許可リストにハードコードされている。ただしこのファイルは `git ls-files` に現れず、Git管理外（未追跡）であることを確認済みのため、クラウドセッションのgit cloneには一切含まれず、実害はない。
3. Gemini APIキーは `src/App.jsx` / `src/aiService.js` の通り、ユーザーがUIから手動入力しブラウザの`localStorage`にのみ保存される方式。サーバー環境変数への依存が無い設計自体はクラウドサンドボックスと非常に相性が良い。ただしクラウドセッションはブラウザ状態を保持しないため、動作確認のたびにAPIキーの再入力が必要になる（コードの問題ではなく運用上の留意点）。

## 改善提案（優先度付き）

### 高
1. ✅ **対応済み** ~~CLAUDE.mdの`.gitignore`除外を見直す~~: `.gitignore:32`の`CLAUDE.md`行を削除しGit追跡対象に変更。個人の好み部分は`CLAUDE.local.md`（新規・gitignore対象）に分離した（2026-09-24）。
2. ✅ **対応済み** ~~`src/aiService.js:15` のSYSTEM_PROMPT内「9段階」表記を実態（12段階）に合わせて修正する~~（2026-09-24）。

### 中
3. README.mdまたはCLAUDE.mdに `npm run lint` / `npm run test`（vitest）/ `npm run build` の実行コマンドを明記する。CIでは使われているのに、開発者向けドキュメントのどこにも案内がない。
4. クラウドサンドボックスでの動作確認手順（その場でGemini APIキーを取得・入力する運用、`npm run dev`後のプレビューURL/ポートフォワーディングの扱い）をREADMEかCLAUDE.mdに1節追加する。

### 低
5. `.claude/settings.local.json` 内の `Bash(git -C /d/Naoyuki/Projects/vehicle-planner fetch origin)` / `Bash(git -C /d/Naoyuki/Projects/vehicle-planner status)` は、同ファイル内に既にある `Bash(git *)` の包括許可と重複しており冗長。整理してよい（このファイル自体はGit管理外のため、影響は本人のローカル環境のみ）。
6. `.claude/`配下に`agents`/`skills`/`commands`/`rules`が一切無い。現状は特に問題ないが、将来プロジェクト固有のガードレール（例: Gemini APIのレート制限対応方針、12層プロンプトを変更する際のレビュー規約など）を明文化したくなった場合は`.claude/rules/`等の追加を検討する余地がある。
