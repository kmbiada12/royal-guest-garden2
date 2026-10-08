/**
 * Petit serveur de prévisualisation, sans dépendance externe.
 *
 *   node preview.js            → http://localhost:3002
 *   node preview.js 3000       → http://localhost:3000
 *
 * Le back-office compilé est servi sous /admin (même adresse qu'en
 * production) s'il a été assemblé au préalable :
 *
 *   node tools/build-vercel.mjs   puis   node preview.js
 *   → http://localhost:3002/admin
 *
 * Le site fonctionne aussi en ouvrant directement index.html dans un
 * navigateur ; ce serveur est simplement plus fidèle (adresses propres,
 * routes /chambre?id=… rechargeables sans blocage).
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = Number(process.argv[2]) || 3002;
const ADMIN_PREFIX = '/admin';
const ADMIN_DIST = path.join(ROOT, '.vercel-static', 'admin');

const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff2': 'font/woff2'
};

const server = http.createServer((req, res) => {
  let pathname;
  try {
    pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  } catch (error) {
    // Adresse mal encodée (ex. /%E0) : on refuse au lieu de planter.
    res.writeHead(400).end('Requête invalide');
    return;
  }
  if (pathname === '/') pathname = '/index.html';

  // Back-office compilé, servi sous /admin comme en production.
  if (
    pathname === ADMIN_PREFIX ||
    pathname === ADMIN_PREFIX + '/' ||
    pathname.startsWith(ADMIN_PREFIX + '/')
  ) {
    serveAdmin(pathname, res);
    return;
  }

  // Empêche toute sortie du dossier du site.
  const filePath = path.join(ROOT, path.normalize(pathname).replace(/^([/\\])+/, ''));
  if (filePath !== ROOT && !filePath.startsWith(ROOT + path.sep)) {
    res.writeHead(403).end('Accès refusé');
    return;
  }

  // Fichiers et dossiers cachés (.git, .env…) jamais servis.
  if (path.relative(ROOT, filePath).split(path.sep).some((part) => part.startsWith('.'))) {
    res.writeHead(403).end('Accès refusé');
    return;
  }

  fs.readFile(filePath, (error, content) => {
    if (error) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        '<!DOCTYPE html><html lang="fr"><meta charset="utf-8">' +
          '<title>Page introuvable</title>' +
          '<body style="font-family:system-ui;padding:3rem;text-align:center">' +
          '<h1>404</h1><p>Cette page n\'existe pas.</p>' +
          '<p><a href="/index.html">Retour à l\'accueil</a></p></body></html>'
      );
      return;
    }
    res.writeHead(200, {
      'Content-Type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-cache'
    });
    res.end(content);
  });
});

/* Sert le back-office depuis .vercel-static/admin : les fichiers existants
   (assets…) directement, toute autre adresse /admin/… retombe sur
   index.html (application monopage). */
function serveAdmin(pathname, res) {
  const indexPath = path.join(ADMIN_DIST, 'index.html');

  fs.readFile(indexPath, (indexError, indexHtml) => {
    if (indexError) {
      res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(
        '<!DOCTYPE html><html lang="fr"><meta charset="utf-8">' +
          '<title>Back-office non compilé</title>' +
          '<body style="font-family:system-ui;padding:3rem;max-width:36rem;margin:auto">' +
          '<h1>Back-office introuvable</h1>' +
          '<p>Le back-office n\'a pas encore été compilé. Dans un terminal, à la racine du dépôt :</p>' +
          '<pre style="background:#f3f3f3;padding:.75rem;border-radius:.4rem">node tools/build-vercel.mjs</pre>' +
          '<p>Puis rechargez cette page.</p></body></html>'
      );
      return;
    }

    if (pathname === ADMIN_PREFIX || pathname === ADMIN_PREFIX + '/') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
      res.end(indexHtml);
      return;
    }

    const sub = pathname.slice(ADMIN_PREFIX.length);
    const cleaned = path.normalize(sub).replace(/^([/\\])+/, '');
    // Ceinture et bretelles : normalize() neutralise déjà les « .. » d'un
    // chemin enraciné, on les refuse aussi explicitement.
    if (cleaned.split(/[\\/]+/).some((part) => part === '..' || part === '.')) {
      res.writeHead(403).end('Accès refusé');
      return;
    }
    const filePath = path.join(ADMIN_DIST, cleaned);
    if (filePath !== ADMIN_DIST && !filePath.startsWith(ADMIN_DIST + path.sep)) {
      res.writeHead(403).end('Accès refusé');
      return;
    }

    fs.readFile(filePath, (error, content) => {
      if (error) {
        // Route de l'application monopage : /admin/… → index.html.
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-cache' });
        res.end(indexHtml);
        return;
      }
      res.writeHead(200, {
        'Content-Type': TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream',
        'Cache-Control': 'no-cache'
      });
      res.end(content);
    });
  });
}

// Écoute uniquement sur cette machine (pas d'accès depuis le réseau local).
server.listen(PORT, '127.0.0.1', () => {
  console.log('Prévisualisation : http://localhost:' + PORT);
  console.log('Arrêter le serveur avec Ctrl+C.');
});