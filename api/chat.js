// Vercel Serverless Function — Groq AI Proxy
// Uses CommonJS (module.exports) — required for Vercel Node runtime

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

Respond helpfully and concisely (2-4 sentences) to dental questions, appointment enquiries, and oral-health queries.
For booking: give the WhatsApp number +91-7051111411 and this form: https://docs.google.com/forms/d/e/1FAIpQLSe-gED_btapLIEsGG2r703JaFSzgeIhJhBLE5tgZHCZd8TIAA/viewform
Never give specific medical diagnoses. Encourage patients to visit for proper evaluation.`;

module.exports = async function handler(req, res) {
  // ── CORS headers on EVERY response ──
  res.setHeader('Access-Control-Allow-Origin',  '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ── Handle OPTIONS preflight immediately ──
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ── Only POST allowed ──
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // ── Read API key from Vercel Environment Variable ──
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    console.error('GROQ_API_KEY is not set in Vercel environment variables');
    return res.status(500).json({ error: 'Server config error: API key missing' });
  }

  // ── Validate body ──
  const { messages } = req.body || {};
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'Bad request: messages array required' });
  }

  // ── Cap history to last 20 messages ──
  const trimmed = messages.slice(-20);

  try {
    const groqRes = await fetch(GROQ_ENDPOINT, {
      method:  'POST',
      headers: {
        'Content-Type':  'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model:       GROQ_MODEL,
        messages:    [{ role: 'system', content: SYSTEM_PROMPT }, ...trimmed],
        max_tokens:  320,
        temperature: 0.65,
        stream:      false
      })
    });

    if (!groqRes.ok) {
      const txt = await groqRes.text();
      console.error('Groq error:', groqRes.status, txt);
      return res.status(502).json({ error: `Groq API returned ${groqRes.status}` });
    }

    const data  = await groqRes.json();
    const reply = data?.choices?.[0]?.message?.content?.trim() ?? '';

    return res.status(200).json({ reply });

  } catch (err) {
    console.error('Proxy fetch error:', err.message);
    return res.status(500).json({ error: 'Internal server error: ' + err.message });
  }
};
