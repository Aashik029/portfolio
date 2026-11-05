/* AASHIK — zero-dependency static server for the portfolio.
   Usage: node serve.js  (defaults to port 8347, opens your browser) */
'use strict';
const http = require('http');
const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');

const ROOT = __dirname;
const PORT = Number(process.env.PORT || 8347);
const HOST = '127.0.0.1';
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.pdf': 'application/pdf',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
};

const server = http.createServer((req, res) => {
  try {
    let pathname = decodeURIComponent(new URL(req.url, `http://${HOST}`).pathname);
    if (pathname.endsWith('/')) pathname += 'index.html';
    const file = path.normalize(path.join(ROOT, pathname));
    if (!file.startsWith(ROOT)) { res.writeHead(403); res.end('Forbidden'); return; }
    fs.stat(file, (err, stat) => {
      if (err || !stat.isFile()) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not found');
        return;
      }
      res.writeHead(200, {
        'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream',
        'Content-Length': stat.size,
        'Cache-Control': 'no-cache',
      });
      fs.createReadStream(file).pipe(res);
    });
  } catch {
    res.writeHead(400); res.end('Bad request');
  }
});

server.listen(PORT, HOST, () => {
  const url = `http://${HOST}:${PORT}/`;
  console.log(`\n  AASHIK — Portfolio\n  ${url}\n  Press Ctrl+C to stop.\n`);
  exec(`start "" "${url}"`);
});
