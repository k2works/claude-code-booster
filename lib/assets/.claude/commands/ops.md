## Ops

アプリケーションの運用・構築・配置を統括的に管理し、本番環境への安全かつ効率的なデプロイを実現するコマンド。

### 使い方

```bash
/ops [オプション]
```

### オプション

- なし : 運用全体のステータス確認（デフォルト）
- `--setup [環境名]` : 環境構築の初期設定とインフラ準備
  - `--setup Java` : Java開発環境の構築とSpring Bootプロジェクトセットアップ
  - `--setup FrontEnd` : TypeScript/React開発環境の構築とViteプロジェクトセットアップ
- `--build` : アプリケーションのビルドとパッケージング
- `--deploy <環境>` : 指定環境へのデプロイ実行
- `--status <環境>` : 特定環境の動作状況確認
- `--rollback <環境>` : 指定環境での前バージョンへのロールバック
- `--logs <サービス>` : 特定サービスのログ確認
- `--health` : システム全体のヘルスチェック実行
- `--backup` : データベース・設定ファイルのバックアップ作成
- `--restore <バックアップ>` : 指定バックアップからの復元

### 基本例

```bash
# 運用全体の状況確認
/ops
「現在の環境構築・デプロイ・運用状況を包括的にレポート」

# 初回環境構築の実行
/ops --setup
「Docker環境・CI/CDパイプライン・インフラの初期構築」

# Java開発環境の構築
/ops --setup Java
「プロジェクト名と作成場所（デフォルト app/backend）を対話式で確認後、docs/reference/Javaアプリケーション環境構築ガイド.md、@docs/design/tech_stack.md、@docs/design/architecture_backend.md を基にしたJava開発環境の統合セットアップ」

# TypeScript/React開発環境の構築
/ops --setup FrontEnd
「プロジェクト名と作成場所（デフォルト app/frontend）を対話式で確認後、docs/reference/TypeScriptアプリケーション環境構築ガイド.md、@docs/design/tech_stack.md、@docs/design/architecture_frontend.md を基にしたTypeScript/React開発環境の統合セットアップ」

# プロダクション環境へのデプロイ
/ops --deploy production
「本番環境への安全なデプロイ実行とヘルスチェック」

# 開発環境のステータス確認
/ops --status development
「開発環境のサービス状況・パフォーマンス・エラー状況確認」

# システム全体のヘルスチェック
/ops --health
「全環境のサービス稼働状況・リソース使用量・アラート確認」

# 緊急時のロールバック
/ops --rollback production
「本番環境を前の安定バージョンにロールバック」
```

### 詳細機能

#### 環境構築とインフラ管理

開発ガイドに準拠した包括的な環境構築：

```bash
# 完全な環境構築
/ops --setup
```

**実行される構築作業**:
- **Docker環境**: コンテナ・ネットワーク・ボリュームの構築
- **CI/CDパイプライン**: GitHub Actions・Jenkins等の設定
- **データベース**: PostgreSQL・Redis等のセットアップ
- **監視システム**: ログ収集・メトリクス監視・アラート設定
- **セキュリティ**: SSL証明書・認証基盤・ファイアウォール設定

#### Java開発環境の統合セットアップ

ドキュメントベースの包括的Java開発環境構築コマンド：

```bash
# ドキュメント準拠のJava開発環境セットアップ（対話式）
/ops --setup Java
```

**参照ドキュメント**:
- `docs/reference/Javaアプリケーション環境構築ガイド.md`: 基本セットアップ手順とベストプラクティス
- `@docs/design/tech_stack.md`: 技術スタック選定理由と詳細仕様
- `@docs/design/architecture_backend.md`: ヘキサゴナルアーキテクチャ設計詳細

**初期設定プロセス**:

🎯 **対話式プロジェクト設定**:
- プロジェクト名の確認（例: meeting-room-system）
- パッケージ名の確認（例: com.example.{project-name}）
- グループID・アーティファクトIDの設定確認
- 作成場所の確認（デフォルト: `app/backend/`配下）

**注意点**
- `docs/reference/Javaアプリケーション環境構築ガイド.md`: のGradle プロジェクトの初期化部分は参考にしない
- app/backend/app のような構成にしてはいけない
- app/backend/{project-name} のような構成すること
- ディレクトリだけの場合もコミットしたいので `.gitkeep` を入れる

**構築される環境の詳細**:

**📋 基盤技術** (@docs/design/tech_stack.md 準拠):
- Java 21 LTS + Spring Boot 3.3.2
- Spring Security 6.3.1 (JWT Bearer認証)
- Spring Data JPA 3.3.2
- Gradle 8.5 + Gradle Wrapper

**🏗️ アーキテクチャ** (@docs/design/architecture_backend.md 準拠):
- ヘキサゴナルアーキテクチャ（ポートとアダプターパターン）
- ドメインモデルパターン
- レイヤー分離: Domain → Application → Infrastructure
- ディレクトリ構造: `src/main/java/{domain,application,infrastructure,shared}/`

**💾 データベース環境**:
- 開発・テスト: H2 Database 2.2.224 (In-Memory)
- 本番: PostgreSQL 15 + HikariCP 5.0.1
- マイグレーション: Flyway 9.22.3

**🔍 品質管理ツール**:
- テスト: JUnit 5 + AssertJ + Mockito + Testcontainers + ArchUnit
- 静的解析: SonarQube + Checkstyle 10.12.3 + SpotBugs + PMD
- カバレッジ: JaCoCo (80%目標)
- セキュリティ: OWASP Dependency Check 8.4.0
- 循環複雑度制限: 7以下

**⚙️ 開発支援機能**:
- Spring Boot DevTools (ホットリロード)
- Spring Boot Actuator (監視・メトリクス)
- 環境プロファイル分離 (dev/test/prod)
- H2 Console (開発時データベース可視化)

#### TypeScript/React開発環境の統合セットアップ

ドキュメントベースの包括的TypeScript/React開発環境構築コマンド：

```bash
# ドキュメント準拠のTypeScript/React開発環境セットアップ（対話式）
/ops --setup FrontEnd
```

**参照ドキュメント**:
- `docs/reference/TypeScriptアプリケーション環境構築ガイド.md`: TDD基盤セットアップ手順と開発規律
- `@docs/design/tech_stack.md`: フロントエンド技術スタック選定理由と詳細仕様
- `@docs/design/architecture_frontend.md`: SPA アーキテクチャとコンポーネント設計詳細

**初期設定プロセス**:

🎯 **対話式プロジェクト設定**:
- プロジェクト名の確認（例: meeting-room-reservation-ui）
- パッケージ名の確認（例: @mrs/frontend）
- 作成場所の確認（デフォルト: `app/frontend/`配下）
- 開発ポートの確認（デフォルト: 3000）

**注意点**
- `docs/reference/TypeScriptアプリケーション環境構築ガイド.md`: のVite プロジェクトの初期化部分は参考にしない
- app/frontend/app のような構成にしてはいけない
- app/frontend/{project-name} のような構成すること
- ディレクトリだけの場合もコミットしたいので `.gitkeep` を入れる

**構築される環境の詳細**:

**📋 基盤技術** (@docs/design/tech_stack.md 準拠):
- Node.js 20 LTS + TypeScript 5.4.0
- React 18.3.0 + React DOM 18.3.0
- Vite 5.2.0 (高速ビルドツール)
- Zustand 4.5.2 (クライアント状態管理)

**🏗️ アーキテクチャ** (@docs/design/architecture_frontend.md 準拠):
- SPA アーキテクチャ（Single Page Application）
- Container/Presentational パターン
- Custom Hooks による状態ロジック分離
- ディレクトリ構造: 11フォルダ構成 (`components/,pages/,hooks/,services/,stores/,types/,utils/,constants/,assets/,styles/,__tests__/`)

**🎨 UI/UX 技術**:
- Tailwind CSS 3.4.3 (ユーティリティファースト CSS)
- React Hook Form 7.51.4 (フォーム管理)
- React Router 6.23.1 (ルーティング)
- Lucide React 0.378.0 (アイコンライブラリ)

**🔄 データ管理**:
- TanStack React Query 5.40.1 (サーバー状態管理)
- Axios 1.7.2 (HTTP クライアント)
- React Hook Form + Zod 3.23.8 (バリデーション)

**🔍 品質管理ツール**:
- テスト: Vitest + @testing-library/react + @testing-library/jest-dom
- 静的解析: ESLint 8.57.0 + @typescript-eslint
- フォーマッター: Prettier 3.2.5
- カバレッジ: @vitest/coverage-v8 (80%目標)
- 循環複雑度制限: 7以下

**⚙️ 開発支援機能**:
- Vite HMR (ホットモジュールリロード)
- TypeScript 厳格設定 (strict: true)
- ESLint + Prettier 統合
- Gulp Guard 機能（自動テスト・リント・フォーマット）
- TDD サイクル支援（Red-Green-Refactor）

#### ビルドとパッケージング

複数言語・フレームワークに対応した統合ビルドシステム：

**対応技術スタック**:
- **Java**: Maven・Gradle による Spring Boot アプリケーション
- **Node.js**: npm・yarn による React・Vue.js アプリケーション  
- **Python**: pip・poetry による Django・FastAPI アプリケーション
- **.NET**: dotnet による ASP.NET Core アプリケーション

```bash
# 全サービスの統合ビルド
/ops --build
```

#### デプロイメント管理

ゼロダウンタイムデプロイとブルーグリーンデプロイメント：

**環境別デプロイ戦略**:
- **Development**: 即座デプロイ・自動テスト実行
- **Staging**: 統合テスト・パフォーマンステスト
- **Production**: ブルーグリーンデプロイ・段階的ロールアウト

```bash
# ステージング環境への自動デプロイ
/ops --deploy staging

# 本番環境への慎重なデプロイ
/ops --deploy production --strategy blue-green
```

#### 運用監視とログ管理

リアルタイム監視とプロアクティブなアラート：

**監視項目**:
- **パフォーマンス**: CPU・メモリ・ディスク・ネットワーク使用率
- **アプリケーション**: レスポンス時間・エラー率・スループット  
- **インフラ**: サーバー・データベース・外部API の稼働状況
- **ビジネス**: ユーザーアクティビティ・売上・KPI指標

```bash
# 特定サービスのリアルタイムログ
/ops --logs backend --follow

# システム全体の統合ダッシュボード
/ops --health --dashboard
```

#### バックアップと災害復旧

自動バックアップと迅速な災害復旧：

**バックアップ対象**:
- **データベース**: 完全バックアップ・増分バックアップ
- **アプリケーション**: 設定ファイル・静的リソース・ログ
- **インフラ**: 環境設定・SSL証明書・監視設定

```bash
# 自動バックアップの実行
/ops --backup --schedule daily

# 緊急時の完全復元
/ops --restore backup-2024-09-12-003000
```

### 出力例

```
運用管理ダッシュボード
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🚀 Overall Status: 全環境正常稼働中

📊 Environment Status:
├─ Development: ✅ 稼働中 (backend: http://localhost:5150, frontend: http://localhost:3000)
├─ Staging: ✅ 稼働中 (v1.2.1, デプロイ完了: 2024-09-11 14:30)
├─ Production: ✅ 稼働中 (v1.2.0, 99.99% アップタイム)
└─ Monitoring: ✅ 正常 (アラートなし)

💻 Infrastructure Health:
├─ Database: ✅ PostgreSQL 正常 (CPU: 15%, Memory: 45%)
├─ API Gateway: ✅ 正常 (平均レスポンス: 120ms)
├─ Load Balancer: ✅ 分散正常 (3インスタンス稼働)
└─ CDN: ✅ キャッシュ効率: 95%

📈 Performance Metrics:
├─ Requests/min: 1,247 (正常範囲)
├─ Error Rate: 0.02% (SLA内)
├─ Avg Response: 145ms (目標200ms未満)
└─ Active Users: 234 (ピーク時)

🔐 Security Status:
├─ SSL Certificates: ✅ 有効期限まで 85日
├─ Firewall: ✅ 不正アクセス検知なし
├─ Vulnerability Scan: ✅ 最終実行: 2024-09-10 (問題なし)
└─ Backup Status: ✅ 最新: 2024-09-12 03:00 (自動)

🚨 Recent Activity:
├─ 2024-09-12 09:30: Production自動スケーリング実行
├─ 2024-09-12 03:00: データベース自動バックアップ完了
└─ 2024-09-11 14:30: Stagingにv1.2.1デプロイ成功

🔜 Scheduled Tasks:
├─ 今日 20:00: 本番環境 v1.2.1 デプロイ予定
├─ 明日 03:00: データベース定期メンテナンス
└─ 2024-09-15: SSL証明書更新予定
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
```

### Claude との連携

```bash
# システム状況と組み合わせた総合分析
ps aux | grep -E "(java|node|postgres)"
netstat -tlnp | grep -E ":3000|:5432|:8080"
/ops --health
「実行中プロセスとポート使用状況を含めた運用状況の総合分析」

# Git状況と組み合わせたデプロイ準備
git log --oneline -5
git status
/ops --deploy staging
「最新コミットを含めたステージング環境へのデプロイ実行」

# ログ分析と組み合わせた障害対応
tail -100 /var/log/app.log
/ops --rollback production
「エラーログ分析に基づく緊急ロールバック実行」

# 設定ファイルと組み合わせた環境構築
cat docker-compose.yml
cat package.json
/ops --setup
「既存設定を考慮した環境構築とインフラ整備」

# ドキュメント準拠のJava開発環境構築（対話式）
cat docs/reference/Javaアプリケーション環境構築ガイド.md
cat docs/design/tech_stack.md
cat docs/design/architecture_backend.md
/ops --setup Java
# → プロジェクト名入力: "meeting-room-system"
# → 作成場所確認: "app/backend/" (Enter でデフォルト採用)
# → パッケージ名確認: "com.example.meetingroomsystem" (自動生成)
./gradlew build
「設計ドキュメント確認後、対話式でプロジェクト設定を確認し、Java環境構築と初回ビルド実行」

# ドキュメント準拠のTypeScript/React開発環境構築（対話式）
cat docs/reference/TypeScriptアプリケーション環境構築ガイド.md
cat docs/design/tech_stack.md
cat docs/design/architecture_frontend.md
/ops --setup FrontEnd
# → プロジェクト名入力: "meeting-room-reservation-ui"
# → 作成場所確認: "app/frontend/" (Enter でデフォルト採用)
# → パッケージ名確認: "@mrs/frontend" (自動生成)
# → 開発ポート確認: "3000" (Enter でデフォルト採用)
npm run dev
「設計ドキュメント確認後、対話式でプロジェクト設定を確認し、TypeScript/React環境構築と開発サーバー起動」
```

### 注意事項

- **前提条件**: Docker・Git・適切な権限設定が必要
- **制限事項**: 本番環境への直接アクセスは制限される場合あり
- **推奨事項**: 本番デプロイ前に必ずステージング環境での動作確認を実施

### ベストプラクティス

1. **段階的デプロイ**: Development → Staging → Production の順序を厳守
2. **自動化優先**: 手作業を最小限に抑え、スクリプトとCI/CDで自動化
3. **監視ファースト**: デプロイ前後の監視設定とアラート確認を徹底
4. **バックアップ確保**: 重要な変更前には必ずバックアップを作成
5. **ロールバック準備**: 緊急時の迅速なロールバック手順を事前準備
6. **セキュリティ重視**: 認証・認可・暗号化・ログ監査を常に実施

### 関連コマンド

- `/progress` : 開発進捗と運用準備状況の確認
- `/test` : デプロイ前の品質確認とテスト実行
- `/plan` : リリース計画と運用スケジュールの管理
- `/semantic-commit` : デプロイに適したコミット作成