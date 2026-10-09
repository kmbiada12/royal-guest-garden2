#!/usr/bin/env node
/* =========================================================================
   Royal Guest Garden — assemblage du déploiement Vercel
   -------------------------------------------------------------------------
   Construit le dossier servi par Vercel (.vercel-static) :

     - le site public à la racine (pages HTML, css/, js/, img/) ;
     - le back-office React compilé sous /admin (base '/admin/').

   Lancé par Vercel (vercel.json → buildCommand) avec les variables
   VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY / VITE_SITE_URL réglées dans
   le projet Vercel. Essai local possible :

     node tools/build-vercel.mjs

   (l'essai local compile avec les valeurs de développement par défaut ;
   seule la production Vercel exige les variables cloud.)
   ========================================================================= */

import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const adminDir = path.join(root, 'admin');
const outDir = path.join(root, '.vercel-static');
const adminBase = process.env.VITE_BASE || '/admin/';

function fail(message) {
  console.error(`[build-vercel] ERREUR — ${message}`);
  process.exit(1);
}

/* Valeurs par défaut en local (hors Vercel) : identiques à
   admin/.env.development, pour que `node tools/build-vercel.mjs` suivi de
   `node preview.js` serve un aperçu complet sur http://localhost:3002/admin
   (Supabase local doit tourner : .\start-local.ps1). */
if (!process.env.VERCEL) {
  process.env.VITE_SUPABASE_URL ||= 'http://127.0.0.1:54321';
  process.env.VITE_SUPABASE_ANON_KEY ||= 'sb_publishable_ACJWlzQHlZjBrEguHvfOxg_3BJgxAaH';
  process.env.VITE_SITE_URL ||= 'http://localhost:3003';
}

/* 1. Garde-fou : sur Vercel, le back-office doit être compilé avec les
      valeurs du projet cloud — sinon il chercherait la base locale. */
if (process.env.VERCEL) {
  const url = process.env.VITE_SUPABASE_URL || '';
  const key = process.env.VITE_SUPABASE_ANON_KEY || '';
  const site = process.env.VITE_SITE_URL || '';
  if (!/^https:\/\//.test(url) || /localhost|127\.0\.0\.1/.test(url)) {
    fail(
      'VITE_SUPABASE_URL manquante ou locale. Réglez VITE_SUPABASE_URL, ' +
        'VITE_SUPABASE_ANON_KEY et VITE_SITE_URL dans Settings → Environment ' +
        'Variables du projet Vercel (valeurs du projet Supabase cloud).'
    );
  }
  if (!key) fail('VITE_SUPABASE_ANON_KEY manquante dans les variables du projet Vercel.');
  if (!site) fail('VITE_SITE_URL manquante dans les variables du projet Vercel.');
}

/* 2. Compilation du back-office, servi sous /admin. */
console.log(`[build-vercel] Compilation du back-office (base ${adminBase})…`);
const installCmd = process.env.VERCEL
  ? 'npm ci --no-audit --no-fund'
  : 'npm install --no-audit --no-fund';
execSync(installCmd, { cwd: adminDir, stdio: 'inherit' });
execSync('npm run build', {
  cwd: adminDir,
  stdio: 'inherit',
  env: { ...process.env, VITE_BASE: adminBase }
});

/* 3. Assemblage du dossier de sortie. */
function copyDir(from, to) {
  fs.mkdirSync(to, { recursive: true });
  for (const entry of fs.readdirSync(from, { withFileTypes: true })) {
    if (entry.name.startsWith('.')) continue;
    const src = path.join(from, entry.name);
    const dst = path.join(to, entry.name);
    if (entry.isDirectory()) copyDir(src, dst);
    else fs.copyFileSync(src, dst);
  }
}

fs.rmSync(outDir, { recursive: true, force: true });
fs.mkdirSync(outDir, { recursive: true });

const SITE_PAGES = [
  'index.html',
  'rooms.html',
  'room.html',
  'services.html',
  'about.html',
  'contact.html',
  'reglement.html'
];
const SITE_DIRS = ['css', 'js', 'img'];

for (const page of SITE_PAGES) {
  const src = path.join(root, page);
  if (!fs.existsSync(src)) fail(`Page manquante : ${page}`);
  fs.copyFileSync(src, path.join(outDir, page));
}
for (const dir of SITE_DIRS) {
  const src = path.join(root, dir);
  if (!fs.existsSync(src)) fail(`Dossier manquant : ${dir}/`);
  copyDir(src, path.join(outDir, dir));
}

const adminDist = path.join(adminDir, 'dist');
if (!fs.existsSync(path.join(adminDist, 'index.html'))) {
  fail('admin/dist/index.html introuvable — la compilation a échoué ?');
}
copyDir(adminDist, path.join(outDir, 'admin'));

console.log('[build-vercel] OK — site à la racine, back-office sous /admin (.vercel-static/).');
