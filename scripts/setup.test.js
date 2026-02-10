#!/usr/bin/env node

const path = require('path');
const fs = require('fs-extra');
const { execFileSync } = require('child_process');

const BIN = path.join(__dirname, '..', 'bin', 'claude-code-booster');
const TEMPLATE_DIR = path.join(__dirname, '..', 'lib', 'assets');

let tmpDir;
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  PASS: ${message}`);
    passed++;
  } else {
    console.error(`  FAIL: ${message}`);
    failed++;
  }
}

const PROJECT_ROOT = path.join(__dirname, '..');

async function setup() {
  tmpDir = path.join(PROJECT_ROOT, 'dist');
  await fs.emptyDir(tmpDir);
}

async function teardown() {
  // temp ディレクトリは結果確認用に残す
}

function run(args = []) {
  execFileSync(process.execPath, [BIN, ...args], {
    env: { ...process.env, INIT_CWD: tmpDir },
    stdio: 'pipe',
  });
}

// --- テストケース ---

async function testInitialSetup() {
  console.log('\n[Test] Initial setup (no options)');
  await fs.emptyDir(tmpDir);
  run();

  assert(await fs.pathExists(path.join(tmpDir, '.claude')), '.claude が作成される');
  assert(await fs.pathExists(path.join(tmpDir, '.claude', 'skills')), '.claude/skills が作成される');
  assert(await fs.pathExists(path.join(tmpDir, 'docs')), 'docs が作成される');
  assert(await fs.pathExists(path.join(tmpDir, '.codex', 'skills')), '.codex/skills が作成される');
  assert(await fs.pathExists(path.join(tmpDir, '.gemini', 'skills')), '.gemini/skills が作成される');

  // skills の中身が一致するか確認
  const claudeSkills = await fs.readdir(path.join(tmpDir, '.claude', 'skills'));
  const codexSkills = await fs.readdir(path.join(tmpDir, '.codex', 'skills'));
  const geminiSkills = await fs.readdir(path.join(tmpDir, '.gemini', 'skills'));
  assert(claudeSkills.length > 0, '.claude/skills にファイルが存在する');
  assert(
    JSON.stringify(claudeSkills.sort()) === JSON.stringify(codexSkills.sort()),
    '.codex/skills の内容が .claude/skills と一致する',
  );
  assert(
    JSON.stringify(claudeSkills.sort()) === JSON.stringify(geminiSkills.sort()),
    '.gemini/skills の内容が .claude/skills と一致する',
  );
}

async function testUpdateOption() {
  console.log('\n[Test] --update option');
  await fs.emptyDir(tmpDir);

  // 初回セットアップ
  run();

  // .claude/skills 配下の既存ファイルを変更して --update で上書きされるか確認
  const skillDirs = await fs.readdir(path.join(tmpDir, '.claude', 'skills'));
  if (skillDirs.length > 0) {
    const markerFile = path.join(tmpDir, '.claude', 'skills', skillDirs[0], 'SKILL.md');
    if (await fs.pathExists(markerFile)) {
      await fs.writeFile(markerFile, 'MODIFIED');
    }
  }

  run(['--update']);

  // 上書きされていることを確認
  if (skillDirs.length > 0) {
    const markerFile = path.join(tmpDir, '.claude', 'skills', skillDirs[0], 'SKILL.md');
    if (await fs.pathExists(markerFile)) {
      const content = await fs.readFile(markerFile, 'utf-8');
      assert(content !== 'MODIFIED', '--update で .claude/skills が上書きされる');
    }
  }

  // --update でも .codex/skills, .gemini/skills が更新される
  assert(await fs.pathExists(path.join(tmpDir, '.codex', 'skills')), '--update で .codex/skills が存在する');
  assert(await fs.pathExists(path.join(tmpDir, '.gemini', 'skills')), '--update で .gemini/skills が存在する');

  const claudeSkills = await fs.readdir(path.join(tmpDir, '.claude', 'skills'));
  const codexSkills = await fs.readdir(path.join(tmpDir, '.codex', 'skills'));
  const geminiSkills = await fs.readdir(path.join(tmpDir, '.gemini', 'skills'));
  assert(
    JSON.stringify(claudeSkills.sort()) === JSON.stringify(codexSkills.sort()),
    '--update で .codex/skills の内容が .claude/skills と一致する',
  );
  assert(
    JSON.stringify(claudeSkills.sort()) === JSON.stringify(geminiSkills.sort()),
    '--update で .gemini/skills の内容が .claude/skills と一致する',
  );
}

// --- 実行 ---

(async () => {
  try {
    await setup();
    await testInitialSetup();
    await testUpdateOption();
  } catch (err) {
    console.error('\nUnexpected error:', err);
    failed++;
  } finally {
    await teardown();
  }

  console.log(`\nResults: ${passed} passed, ${failed} failed`);
  process.exitCode = failed > 0 ? 1 : 0;
})();
