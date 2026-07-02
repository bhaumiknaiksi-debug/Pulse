// Vercel serverless proxy for OKX public API.
// Place this file at  api/okx.js  in the repo (same repo as index.html).
// The app calls /api/okx?path=/api/v5/... automatically if direct OKX access fails.
// Read-only: only allows GET requests to OKX public v5 endpoints.

export default async function handler(req, res) {
  const path = req.query.path || '';
  if (!path.startsWith('/api/v5/')) {
    res.status(400).json({ code: '400', msg: 'invalid path' });
    return;
  }
  try {
    const r = await fetch('https://www.okx.com' + path, {
      headers: { 'User-Agent': 'pulse-personal-terminal' }
    });
    const j = await r.json();
    res.setHeader('Cache-Control', 's-maxage=2, stale-while-revalidate=5');
    res.status(200).json(j);
  } catch (e) {
    res.status(502).json({ code: '502', msg: String(e) });
  }
}
