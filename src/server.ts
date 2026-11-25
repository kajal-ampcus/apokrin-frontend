import express from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { spawn, type ChildProcess } from 'node:child_process';
import http from 'node:http';

const PORT = Number(process.env.PORT) || 3000;
const PHP_PORT = Number(process.env.PHP_PORT) || 8080;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let phpServerProcess: ChildProcess | null = null;

function ensurePhpServer(): Promise<boolean> {
  return new Promise((resolve) => {
    const req = http.get(`http://127.0.0.1:${PHP_PORT}/health.php`, () => {
      resolve(true);
    });

    req.on('error', () => {
      const candidates = ['C:\\php\\php.exe', 'php'];
      let started = false;
      for (const bin of candidates) {
        try {
          phpServerProcess = spawn(bin, ['-S', `127.0.0.1:${PHP_PORT}`], {
            cwd: __dirname,
            stdio: 'ignore',
            detached: false,
          });
          phpServerProcess.on('error', () => {});
          started = true;
          console.log(`[Apokrin] Auto-started PHP backend on http://127.0.0.1:${PHP_PORT} using ${bin}`);
          break;
        } catch {
          // try next candidate
        }
      }
      setTimeout(() => resolve(started), 600);
    });

    req.setTimeout(500, () => {
      req.destroy();
      resolve(false);
    });
  });
}

async function startServer() {
  await ensurePhpServer();

  const app = express();
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ ok: true, service: 'apokrin-web' });
  });

  // Proxy contact submissions directly to the PHP PHPMailer backend
  app.post(['/api/contact', '/api/contact.php'], async (req, res) => {
    await ensurePhpServer();

    const payload = req.body ?? {};
    try {
      const phpResp = await fetch(`http://127.0.0.1:${PHP_PORT}/api/contact.php`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-Forwarded-For': (req.headers['x-forwarded-for'] as string) || req.ip || req.socket.remoteAddress || '127.0.0.1',
        },
        body: JSON.stringify(payload),
      });

      const data = await phpResp.json().catch(() => null);
      if (data) {
        return res.status(phpResp.status).json(data);
      }
      const rawText = await phpResp.text().catch(() => '');
      return res.status(phpResp.status).send(rawText);
    } catch (err: any) {
      console.error('[Apokrin] Failed to proxy request to PHP backend:', err?.message || err);
      return res.status(502).json({
        ok: false,
        success: false,
        message: 'Backend contact service is currently unavailable. Please make sure PHP server is running on port 8080.',
      });
    }
  });

  // If a direct request comes for contact.php on port 3000, forward to PHP server
  app.get('/contact.php', async (_req, res) => {
    try {
      const phpResp = await fetch(`http://127.0.0.1:${PHP_PORT}/contact.php`);
      const html = await phpResp.text();
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      return res.status(phpResp.status).send(html);
    } catch {
      return res.redirect('/contact');
    }
  });

  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distDir = path.resolve(__dirname, 'dist');
    app.use(express.static(distDir));
    app.get('/{*splat}', (_req, res) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  }

  function listen(portToUse: number) {
    const server = app.listen(portToUse, '0.0.0.0', () => {
      console.log(`Apokrin server listening on http://localhost:${portToUse}`);
    });

    server.on('error', (err: NodeJS.ErrnoException) => {
      if (err.code === 'EADDRINUSE') {
        console.warn(`Port ${portToUse} is in use. Attempting port ${portToUse + 1}...`);
        listen(portToUse + 1);
      } else {
        console.error('Server startup error:', err);
      }
    });
  }

  listen(PORT);
}

startServer();
