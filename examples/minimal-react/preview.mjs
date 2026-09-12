// Local-only preview of a production SPA. Close with Ctrl-C.
import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const tool = process.argv[2];
if (!['rspack', 'webpack'].includes(tool)) throw new Error('Choose rspack or webpack');
const root = fileURLToPath(new URL(`./dist/${tool}/`, import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml' };
createServer(async (req, res) => {
  try {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const candidate = resolve(root, `.${pathname}`);
    if (candidate !== resolve(root) && !candidate.startsWith(root.endsWith(sep) ? root : root + sep)) {
      res.writeHead(403).end(); return;
    }
    const file = (await stat(candidate).catch(() => null))?.isFile()
      ? candidate : extname(pathname) ? null : resolve(root, 'index.html');
    if (!file) { res.writeHead(404).end(); return; }
    res.setHeader('Content-Type', types[extname(file)] ?? 'application/octet-stream');
    res.end(await readFile(file));
  } catch { res.writeHead(400).end(); }
}).listen(Number(process.argv[3]), '127.0.0.1', () => console.log(`Preview: http://127.0.0.1:${process.argv[3]}`));
