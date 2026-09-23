#!/usr/bin/env node
/**
 * Campagne de mutation : lance la suite de tests contre chaque mutant de
 * data/mutants.js et indique s'il a été « tué » (au moins un test en échec)
 * ou s'il a « survécu » (tous les tests passent malgré le bug).
 *
 *   npm run mutants                          # tous les mutants (chacun contre la spec de son défi)
 *   npm run mutants -- --challenge pricing   # mutants d'un défi
 *   npm run mutants -- --spec tests/pricing.spec.js
 *   npm run mutants -- --challenge pricing --grep API   (sans navigateur)
 */
const { spawn, spawnSync } = require('child_process');
const path = require('path');
const http = require('http');
const os = require('os');
const net = require('net');

const args = process.argv.slice(2);
const opt = (name) => { const i = args.indexOf(`--${name}`); return i >= 0 ? args[i + 1] : undefined; };
const challenge = opt('challenge');
const specOverride = opt('spec');
const specFor = (challengeId) => specOverride || `tests/${challengeId}.spec.js`;
const grep = opt('grep');
const PORT = Number(opt('port') || 3100);
const root = path.join(__dirname, '..');

delete process.env.MUTANT;
const { mutants } = require('../data/mutants');
const selected = mutants.filter((m) => !challenge || m.challenge === challenge);

const waitForServer = (url, timeoutMs = 15000) => new Promise((resolve, reject) => {
  const start = Date.now();
  const tryOnce = () => http.get(url, (res) => { res.resume(); resolve(); })
    .on('error', () => (Date.now() - start > timeoutMs ? reject(new Error('serveur injoignable')) : setTimeout(tryOnce, 200)));
  tryOnce();
});

const portIsFree = () => new Promise((resolve) => {
  const probe = net.createServer().once('error', () => resolve(false))
    .once('listening', () => probe.close(() => resolve(true)));
  probe.listen(PORT);
});

let currentServer = null;
for (const sig of ['SIGINT', 'SIGTERM']) {
  process.on(sig, () => { if (currentServer) currentServer.kill(); process.exit(130); });
}

async function runAgainst(mutantId, specs) {
  if (!(await portIsFree())) {
    throw new Error(`Le port ${PORT} est déjà utilisé (serveur resté ouvert ?). Libérez-le ou utilisez --port.`);
  }
  const env = { ...process.env, PORT: String(PORT), MUTANT: mutantId || '' };
  const server = spawn(process.execPath, ['server.js'], { cwd: root, env, stdio: 'ignore' });
  currentServer = server;
  try {
    await waitForServer(`http://localhost:${PORT}/`);
    const pwArgs = ['playwright', 'test', ...specs, ...(grep ? ['--grep', grep] : []), '--reporter=dot', '--retries=0',
      '--output', path.join(os.tmpdir(), 'testing-site-mutants')];
    const res = spawnSync('npx', pwArgs, {
      cwd: root, env: { ...env, BASE_URL: `http://localhost:${PORT}` }, encoding: 'utf8',
    });
    return res.status === 0;
  } finally {
    server.kill();
    await new Promise((resolve) => (server.exitCode !== null ? resolve() : server.once('exit', resolve)));
    currentServer = null;
  }
}

(async () => {
  try {
    await campaign();
  } catch (err) {
    console.error(`❌ ${err.message}`);
    process.exit(1);
  }
})();

async function campaign() {
  const allSpecs = [...new Set(selected.map((m) => specFor(m.challenge)))];
  console.log(`Référence (aucun mutant) — ${allSpecs.join(', ')}…`);
  if (!(await runAgainst(null, allSpecs))) {
    console.error('❌ La suite échoue déjà sans mutant : corriger les tests avant la campagne.');
    process.exit(1);
  }

  const rows = [];
  for (const m of selected) {
    process.stdout.write(`  ${m.id.padEnd(36)} `);
    const passed = await runAgainst(m.id, [specFor(m.challenge)]);
    rows.push({ ...m, killed: !passed });
    console.log(passed ? '🟥 SURVIT' : '✅ tué');
  }

  const killed = rows.filter((r) => r.killed).length;
  const score = rows.length ? Math.round((killed / rows.length) * 100) : 0;
  console.log(`\nScore de mutation : ${killed}/${rows.length} (${score} %)`);
  rows.filter((r) => !r.killed).forEach((r) => console.log(`  • ${r.id} [${r.technique}] — ${r.description}`));
  process.exit(killed === rows.length ? 0 : 2);
}
