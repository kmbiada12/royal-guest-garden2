/**
 * Petit serveur de prévisualisation, sans dépendance externe.
 *
 *   node preview.js            → http://localhost:8080
 *   node preview.js 3000       → http://localhost:3000
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
const PORT = Number(process.argv[2]) || 8080;

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
  const url = new URL(req.url, 'http://localhost');
  let pathname = decodeURIComponent(url.pathname);
  if (pathname === '/') pathname = '/index.html';

  // Empêche toute sortie du dossier du site.
  const filePath = path.join(ROOT, path.normalize(pathname).replace(/^([/\\])+/, ''));
  if (!filePath.startsWith(ROOT)) {
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

server.listen(PORT, () => {
  console.log('Prévisualisation : http://localhost:' + PORT);
  console.log('Arrêter le serveur avec Ctrl+C.');
});