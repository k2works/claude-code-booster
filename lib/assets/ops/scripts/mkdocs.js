'use strict';

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const isWindows = process.platform === 'win32';

/**
 * Windows 環境で DOCKER_HOST を正規化した環境変数を返す
 * @returns {NodeJS.ProcessEnv}
 */
function dockerEnv() {
  const env = { ...process.env };
  if (isWindows && env.DOCKER_HOST === 'npipe://./pipe/docker_engine') {
    env.DOCKER_HOST = 'npipe:////./pipe/docker_engine';
  }
  return env;
}

/**
 * docker compose コマンドを実行
 * @param {string} args - docker compose に渡す引数
 */
function dockerCompose(args) {
  execSync(`docker compose ${args}`, { stdio: 'inherit', env: dockerEnv() });
}

/**
 * MkDocs タスクを gulp に登録する
 * @param {import('gulp').Gulp} gulp - Gulp インスタンス
 */
export default function (gulp) {
  gulp.task('mkdocs:serve', (done) => {
    try {
      console.log('Starting MkDocs server...');
      dockerCompose('up -d mkdocs');
      console.log('\nDocumentation is available at http://localhost:8000');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('mkdocs:build', (done) => {
    try {
      console.log('Building MkDocs documentation...');
      const siteDir = path.join(process.cwd(), 'site');
      if (fs.existsSync(siteDir)) {
        fs.rmSync(siteDir, { recursive: true, force: true });
      }
      dockerCompose('run --rm mkdocs mkdocs build');
      console.log('\nBuild completed.');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('mkdocs:stop', (done) => {
    try {
      console.log('Stopping MkDocs server...');
      dockerCompose('down');
      console.log('Stopped.');
      done();
    } catch (error) {
      done(error);
    }
  });

  gulp.task('mkdocs:open', (done) => {
    try {
      const command = isWindows ? 'start http://localhost:8000' : 'open http://localhost:8000';
      execSync(command, { stdio: 'inherit' });
      done();
    } catch (error) {
      done(error);
    }
  });
}
