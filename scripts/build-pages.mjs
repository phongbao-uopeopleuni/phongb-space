/** Chay pipeline build voi base GitHub Pages tren moi he dieu hanh. */
import { spawn } from 'node:child_process';

const npmCli = process.env.npm_execpath;
if (!npmCli) throw new Error('Khong tim thay npm CLI trong npm_execpath');

const child = spawn(process.execPath, [npmCli, 'run', 'build'], {
  cwd: process.cwd(),
  env: { ...process.env, GITHUB_PAGES: 'true' },
  stdio: 'inherit',
});

child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});
