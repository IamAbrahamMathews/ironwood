// Ironwood Agent — Secure API Proxy
// This serverless function runs on Vercel's servers.
// The API key is stored as a Vercel Environment Variable (ANTHROPIC_API_KEY)
// and is NEVER exposed to the browser or the client.

export default async function handler(req, res) {

  // ── CORS headers — allow only your own domain ────────────────────────────
  res.setHeader('Access-Control-Allow-Origin', '*');  // tighten to your domain after deploy
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Preflight
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only accept POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Read the API key from the environment variable ────────────────────────
  const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

  if (!ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is not set.');
    return res.status(500).json({
      error: 'Server configuration error. API key not configured.'
    });
  }

  // ── Parse and validate the request body ──────────────────────────────────
  let body;
  try {
    body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
  } catch {
    return res.status(400).json({ error: 'Invalid JSON body.' });
  }

  const { messages, system } = body;

  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required.' });
  }

  // ── Basic input sanitisation — limit context window ───────────────────────
  const MAX_MESSAGES = 40;
  const trimmedMessages = messages.slice(-MAX_MESSAGES);

  // ── Forward to Anthropic API ──────────────────────────────────────────────
  try {
    const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type':        'application/json',
        'x-api-key':           ANTHROPIC_API_KEY,
        'anthropic-version':   '2023-06-01',
      },
      body: JSON.stringify({
        model:      'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system:     system || '',
        messages:   trimmedMessages,
      }),
    });

    const data = await anthropicRes.json();

    if (!anthropicRes.ok) {
      // Forward Anthropic's error status but never leak the key
      return res.status(anthropicRes.status).json({
        error: data?.error?.message || 'Anthropic API error.',
        type:  data?.error?.type    || 'api_error',
      });
    }

    // ── Return only the content to the browser ────────────────────────────
    return res.status(200).json({
      content: data.content,
      usage:   data.usage,
    });

  } catch (err) {
    console.error('Proxy fetch error:', err);
    return res.status(502).json({ error: 'Failed to reach Anthropic API.' });
  }
}
