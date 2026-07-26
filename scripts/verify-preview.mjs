/** Khoi dong preview Pages, doi san sang, chay smoke + Lighthouse budget, roi tat server. */
import { spawn } from 'node:child_process';
import path from 'node:path';

const ROOT = process.cwd();
const URL_TARGET = 'http://127.0.0.1:4173/phongb-space/';
const viteBin = path.join(ROOT, 'node_modules', 'vite', 'bin', 'vite.js');

const preview = spawn(
  process.execPath,
  [viteBin, 'preview', '--base', '/phongb-space/', '--host', '127.0.0.1'],
  { cwd: ROOT, stdio: 'inherit' },
);

function runNode(args) {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, { cwd: ROOT, stdio: 'inherit' });
    child.on('error', reject);
    child.on('exit', (code) => resolve(code ?? 1));
  });
}

async function waitUntilReady() {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(URL_TARGET);
      if (response.ok) return;
    } catch {
      // Preview chua mo cong; thu lai o vong sau.
    }
    await new Promise((resolve) => setTimeout(resolve, 250));
  }
  throw new Error(`Preview khong san sang sau 30 giay: ${URL_TARGET}`);
}

let exitCode = 1;
try {
  await waitUntilReady();
  const smokeCode = await runNode(['scripts/smoke.mjs', URL_TARGET]);
  if (smokeCode !== 0) throw new Error('Smoke test khong dat');

  const auditCode = await runNode(['scripts/audit.mjs', URL_TARGET, 'mobile', '--assert']);
  if (auditCode !== 0) throw new Error('Lighthouse budget khong dat');
  exitCode = 0;
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
} finally {
  preview.kill();
}

process.exitCode = exitCode;
