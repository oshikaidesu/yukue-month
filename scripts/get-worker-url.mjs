#!/usr/bin/env node

/**
 * Cloudflare Workersのエンドポイントを取得するスクリプト
 * 
 * 使用方法:
 *   node scripts/get-worker-url.mjs
 * 
 * 出力:
 *   WorkersのエンドポイントURLを標準出力に出力
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const workersDir = join(__dirname, '..', 'workers');

async function getWorkerUrl() {
  try {
    // wrangler.tomlからworker名を取得
    const wranglerTomlPath = join(workersDir, 'wrangler.toml');
    if (!existsSync(wranglerTomlPath)) {
      throw new Error('workers/wrangler.tomlが見つかりません');
    }
    
    const wranglerToml = readFileSync(wranglerTomlPath, 'utf-8');
    const nameMatch = wranglerToml.match(/^name\s*=\s*["']?([^"'\n]+)["']?/m);
    const workerName = nameMatch ? nameMatch[1].trim() : null;
    
    if (!workerName) {
      throw new Error('workers/wrangler.tomlからworker名を取得できませんでした');
    }
    
    // Workersのデプロイ情報を確認
    try {
      // wrangler deployments listで最新のデプロイを確認
      const deploymentsOutput = execSync('npx wrangler deployments list', { 
        cwd: workersDir,
        encoding: 'utf-8',
        stdio: ['pipe', 'pipe', 'pipe']
      });
      
      // 出力からURLを抽出
      const urlMatch = deploymentsOutput.match(/https:\/\/[^\s]+/);
      if (urlMatch) {
        const workerUrl = urlMatch[0];
        console.log(workerUrl);
        return workerUrl;
      }
    } catch (e) {
      // deployments listが失敗しても続行
    }
    
    // デプロイ情報が取得できない場合、Cloudflareダッシュボードで確認するよう案内
    console.warn('⚠️  Workersのエンドポイントを自動取得できませんでした。');
    console.warn('');
    console.warn('📋 エンドポイントの確認方法:');
    console.warn('   1. Cloudflareダッシュボードにログイン');
    console.warn('   2. Workers & Pages → nicovideo-ogp を選択');
    console.warn('   3. 「設定」→「カスタムドメイン」またはデプロイ情報からエンドポイントを確認');
    console.warn('');
    console.warn('   通常の形式: https://nicovideo-ogp.YOUR-SUBDOMAIN.workers.dev');
    console.warn('');
    console.warn('   見つかったURLを .env.local に追加:');
    console.warn('   NEXT_PUBLIC_WORKER_URL=https://nicovideo-ogp.YOUR-SUBDOMAIN.workers.dev');
    return null;
  } catch (error) {
    console.error('❌ エラー:', error.message);
    console.error('');
    console.error('💡 手動で設定する場合:');
    console.error('   .env.localに以下を追加:');
    console.error('   NEXT_PUBLIC_WORKER_URL=https://nicovideo-ogp.YOUR-SUBDOMAIN.workers.dev');
    process.exit(1);
  }
}

getWorkerUrl();

