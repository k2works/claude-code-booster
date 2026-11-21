---
name: building-project
description: booster で展開した直後のテンプレートプロジェクトを、実プロジェクトとして立ち上げる。プロジェクト名のプレースホルダー置換（README・package.json・mkdocs.yml・flake.nix）、.gitignore の追加、領域ごとの初期コミットまでを一連で行う。「プロジェクト名を設定して」「プロジェクトを初期化したい」「新しいプロジェクトをセットアップしたい」「プレースホルダーを置換したい」「.gitignore を追加して初期コミットしたい」といった場面で必ず発動する。リポジトリがまだコミットゼロ、または {project_name} や Site Name が残っている場面でも積極的に使うこと。
---

# プロジェクトの立ち上げ（building-project）

テンプレートから展開した直後のリポジトリには、未置換のプレースホルダーと未追跡の大量のファイルが残っている。これを「名前が正しく、不要物が追跡されず、履歴が意味のある単位で始まる」状態にする。最初の履歴は後から変えにくいので、ここで整える価値がある。

## 手順

### 1. プロジェクト名を決める

2 種類の名前を区別する。

| 種類 | 用途 | 例 |
| :--- | :--- | :--- |
| 表示名 | README の見出し、mkdocs の `site_name` | 記事ホームレポジトリ |
| slug（ASCII） | npm の `name`、GitHub URL、Docker イメージ名 | article-home-repo |

npm 名と URL は ASCII 必須なので、表示名が日本語でも slug は別に要る。ユーザーが slug を指定しなければ、リポジトリのディレクトリ名を使い、その旨を完了時に伝える。GitHub のオーナー名は `git remote` や既存の URL（`k2works` など）から拾う。

### 2. プレースホルダーを探す

置換漏れを防ぐため、先に全体を検索する。

```bash
grep -rnE "\{project[-_ ]?name\}|Site Name|claude-code-booster" README.md package.json mkdocs.yml flake.nix
```

典型的な置換先は次のとおり。

- `README.md`: 見出し `{project-name}` → 表示名、`ghcr.io/<owner>/{project_name}` → slug
- `package.json`: `name`、`repository.url`、`bugs.url`、`homepage`
- `mkdocs.yml`: `site_name`（表示名）、`repo_url`、`repo_name`、GitHub リンク名（slug）
- `flake.nix`: `description` 内のリポジトリ名

次は触らない。後で上書きされる、または別の用途のためである。

- `docs/template/` の `{{プロジェクト名}}`: 報告書を作る時に埋めるテンプレート
- `.claude/agents/` 内の booster のパス: `npx boost --update` で上書きされる
- `package-lock.json`: `npm install` 時に `package.json` に追従する

### 3. 置換結果を検証する

```bash
node -e "console.log(JSON.parse(require('fs').readFileSync('package.json','utf8')).name)"
grep -nE "\{project|Site Name|claude-code-booster" README.md package.json mkdocs.yml flake.nix || echo "残存なし"
```

`package.json` が壊れていないことと、プレースホルダーが残っていないことの両方を確認する。

### 4. .gitignore を追加する

`.gitignore` が無ければ作る。まず `ls -A` で実際の構成（出力先、`.env` の運用）を確認し、次の方針で書く。

- 依存関係: `node_modules/`
- 環境変数と鍵: `.env`、`.env.*`、`.env.keys`。ただし `.env.example` と `.env.vault`（暗号化済み）は追跡対象として `!` で除外解除する
- ビルド成果物: `site/`、`dist/`、`build/`、`coverage/`
- ログ・一時ファイル、IDE 設定（`.idea/`、`.vscode/`）、OS ファイル
- Claude Code のローカル設定: `.claude/settings.local.json`、`.claude/agent-memory/`
- Terraform を使う場合: `.terraform/`、`*.tfstate*`、`*.tfvars`

言語別の無視設定は、アプリが未配置なら入れない。アプリを追加する時に追記する。追加後は `git status --short` で、`node_modules/` や `.idea/` が消え、`.env.example`・`.env.vault` が残っていることを確認する。

### 5. 領域ごとにコミットする

コミットは `git-commit` スキルに従う。1 コミット 1 目的を守り、最初のコミットで全部を `git add .` しない。順序と分け方は次のとおり。

| 順 | type | 内容 |
| :--- | :--- | :--- |
| 1 | `docs` | プロジェクト名の設定（README・package.json・mkdocs.yml・flake.nix） |
| 2 | `chore` | `.gitignore` |
| 3 | `chore` | AI エージェント設定（`.claude`・`.agents`・`CLAUDE.md`・`AGENTS.md`） |
| 4 | `docs` | `docs/` 配下 |
| 5 | `chore` | 運用・環境構成（`ops`・Docker・Nix・devcontainer・`.github`・`gulpfile.js`・`package-lock.json`・`.env.example`・`.env.vault`・`.gitattributes`） |
| 6 | `chore` | 空ディレクトリを `.gitkeep` で追跡（`apps/` など） |

`.gitignore` を先にコミットしておくと、後続の `git add` でビルド成果物や秘密情報を巻き込まない。コミットメッセージは日本語で書き、co-author 行や "Claude Code" の語は入れない（`git-commit` スキルの規則）。

### 6. 結果を確認する

```bash
git status --short
git log --oneline
```

`git status` が空で、履歴が上の単位に分かれていれば完了。

## 注意

- 改行コードの警告（LF が CRLF に置き換わる）は Windows では通常出る。コミットは成功しているので失敗と混同しない。`.gitattributes` が `*.nix` や `*.sh` を LF に固定している。
- 新規ファイル作成は本プロジェクトでは確認必須だが、ユーザーが「.gitignore を追加」のように明示した場合は承認済みとして進めてよい。
- slug を仮定した場合は、GitHub 上の実際のリポジトリ名と一致するかをユーザーに伝える。
