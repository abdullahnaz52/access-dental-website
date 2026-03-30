/* ═══════════════════════════════════════════════════════════
   /api/chat.js  — Vercel Serverless Proxy for Groq AI
   ═══════════════════════════════════════════════════════════
   This function runs on Vercel's server.
   The GROQ_API_KEY never leaves the server — it is read from
   Vercel Environment Variables, NOT from your source code.
   ═══════════════════════════════════════════════════════════ */

const GROQ_ENDPOINT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL    = 'llama-3.3-70b-versatile';

const SYSTEM_PROMPT = `You are a warm, professional AI dental assistant for Access Dental Care & Orthodontics — a premier clinic in Srinagar, J&K, India.

Clinic details:
- Address: Anzimar, Khanyar, Srinagar 190003
- Phone / WhatsApp: +91-7051111411
- Email: Shifaclinicc@gmail.com
- Hours: Monday–Saturday 9:00 AM – 7:00 PM
- Specialists: Dr. Sameer Malik (MDS Orthodontics, MFDS RCS Edinburgh, Fellowship Sick Kids Hospital Toronto) and Dr. Nida Lanker (BDS Gold Medalist)
- Services: Orthodontics, Dental Implants, Teeth Whitening, Root Canal, Crowns & Bridges, Pediatric Dentistry, Veneers, Extractions

Respond helpfully and concisely (2–4 sentences) to dental questions, appointment enquiries, and oral-health queries.
For booking: give the WhatsApp number +91-7051111411 and this form: https://docs.google.com/forms/d/e/1FAIpQLSe-gED_btapLIEsGG2r703JaFSzgeIhJhBLE5tgZHCZd8TIAA/viewform
Never give specific medical diagnoses. Encourage patients to visit for proper evaluation.`;

export default async function handler(req, res) {
  /* ── Only allow POST ── */
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  /* ── CORS — allow your GitHub Pages domain ── */
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  /* ── Handle preflight ── */
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  /* ── Read API key from Vercel Environment Variables ── */
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server configuration error — API key missing' });
  }

  /* ── Validate request body ── */
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid request: messages array required' });
  }

  /* ── Rate-limit guard: cap history at 24 turns ── */
  const trimmedMessages = messages.slice(-24);

  try {
    /* ── Call Groq ── */
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages:    [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmedMessages],
        max_tokens:  320,
        temperature: 0.65,
        stream:      false
      })
    });

    if (!groqRes.ok) {
      const errText = await groqRes.text();
      console.error('Groq API error:', groqRes.status, errText);
      return res.status(502).json({ error: `Groq API error: ${groqRes.status}` });
    }

    const data  = await groqRes.json();
    const reply = data.choices?.[0]?.message?.content?.trim() ?? '';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Proxy error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
