/**
 * Crée (ou promeut) un compte du personnel : admin par défaut.
 *
 *   node tools/create-admin.js prenom.nom@exemple.cm
 *   node tools/create-admin.js prenom.nom@exemple.cm --role editor
 *
 * Connexion à Supabase :
 *   - variables SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY si présentes
 *     (projet hébergé : Project Settings → API → service_role) ;
 *   - sinon Supabase local, via `supabase status -o env`.
 * La clé service-role n'est jamais écrite sur disque.
 *
 * Mot de passe : RGG_ADMIN_PASSWORD si défini, sinon un mot de passe
 * aléatoire est généré et affiché UNE fois. Le compte est confirmé
 * d'office (pas d'e-mail de confirmation à attendre).
 */
'use strict';

const crypto = require('crypto');
const { execSync } = require('child_process');

function fail(message) {
  console.error('Erreur : ' + message);
  process.exit(1);
}

/* ------------------------------------------------------------------
   Arguments
   ------------------------------------------------------------------ */
const args = process.argv.slice(2);
const email = (args.find((a) => !a.startsWith('--')) || '').trim().toLowerCase();
const roleIndex = args.indexOf('--role');
const role = roleIndex !== -1 ? args[roleIndex + 1] : 'admin';

if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
  fail('indiquez une adresse e-mail valide.\n  node tools/create-admin.js prenom.nom@exemple.cm [--role editor]');
}
if (!['admin', 'editor'].includes(role)) fail('--role doit valoir admin ou editor.');

/* ------------------------------------------------------------------
   Connexion
   ------------------------------------------------------------------ */
function connection() {
  if (process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return { url: process.env.SUPABASE_URL, key: process.env.SUPABASE_SERVICE_ROLE_KEY };
  }
  let out;
  try {
    out = execSync('supabase status -o env', { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });
  } catch (e) {
    fail('Supabase local injoignable. Lancez `supabase start`, ou définissez SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY.');
  }
  const env = {};
  out.split(/\r?\n/).forEach((line) => {
    const m = line.match(/^([A-Z_]+)="?(.*?)"?$/);
    if (m) env[m[1]] = m[2];
  });
  if (!env.API_URL || !env.SERVICE_ROLE_KEY) fail('`supabase status` ne fournit pas API_URL / SERVICE_ROLE_KEY.');
  return { url: env.API_URL, key: env.SERVICE_ROLE_KEY };
}

/* Mot de passe conforme à la règle du projet (12+ caractères,
   minuscules, majuscules, chiffres). */
function generatePassword() {
  const sets = ['abcdefghijkmnopqrstuvwxyz', 'ABCDEFGHJKLMNPQRSTUVWXYZ', '23456789'];
  const all = sets.join('');
  const pick = (s) => s[crypto.randomInt(s.length)];
  const chars = sets.map(pick);
  while (chars.length < 20) chars.push(pick(all));
  for (let i = chars.length - 1; i > 0; i--) {
    const j = crypto.randomInt(i + 1);
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

async function call(conn, method, path, body, extraHeaders) {
  const response = await fetch(conn.url.replace(/\/+$/, '') + path, {
    method,
    headers: Object.assign(
      {
        apikey: conn.key,
        Authorization: 'Bearer ' + conn.key,
        'Content-Type': 'application/json'
      },
      extraHeaders || {}
    ),
    body: body ? JSON.stringify(body) : undefined
  });
  const text = await response.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch (e) {
    data = text;
  }
  return { ok: response.ok, status: response.status, data };
}

async function findUserByEmail(conn) {
  for (let page = 1; page <= 50; page++) {
    const res = await call(conn, 'GET', '/auth/v1/admin/users?per_page=200&page=' + page);
    if (!res.ok) fail('lecture des utilisateurs impossible (HTTP ' + res.status + ').');
    const users = (res.data && res.data.users) || [];
    const found = users.find((u) => (u.email || '').toLowerCase() === email);
    if (found || users.length < 200) return found || null;
  }
  return null;
}

async function main() {
  const conn = connection();
  const password = process.env.RGG_ADMIN_PASSWORD || generatePassword();

  let user = await findUserByEmail(conn);
  let created = false;
  if (!user) {
    const res = await call(conn, 'POST', '/auth/v1/admin/users', {
      email,
      password,
      email_confirm: true
    });
    if (!res.ok) {
      const msg = (res.data && (res.data.msg || res.data.message || res.data.error_description)) || res.status;
      fail('création du compte refusée : ' + msg);
    }
    user = res.data;
    created = true;
  }

  const staff = await call(
    conn,
    'POST',
    '/rest/v1/staff?on_conflict=user_id',
    { user_id: user.id, role },
    { Prefer: 'resolution=merge-duplicates,return=minimal' }
  );
  if (!staff.ok) {
    const msg = (staff.data && (staff.data.message || staff.data.hint)) || staff.status;
    if (created) await call(conn, 'DELETE', '/auth/v1/admin/users/' + user.id);
    fail('attribution du rôle refusée : ' + msg);
  }

  console.log((created ? 'Compte créé' : 'Compte existant') + ' : ' + email + ' — rôle ' + role);
  if (created && !process.env.RGG_ADMIN_PASSWORD) {
    console.log('Mot de passe (affiché une seule fois, à changer après la première connexion) :');
    console.log('  ' + password);
  }
}

main().catch((e) => fail(e.message));
