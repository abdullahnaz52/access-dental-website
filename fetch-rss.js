/**
 * ============================================================
 * Access Dental Care — Auto Blog RSS Fetcher
 * ============================================================
 * 
 * PURPOSE:
 *   Automatically fetches dental/health articles from trusted
 *   RSS feeds, reformats them, and saves to blog-posts.json
 *   which blogs.html will read on page load.
 * 
 * SETUP:
 *   1. npm install rss-parser node-cron node-fetch
 *   2. node fetch-rss.js          (run once manually to test)
 *   3. node fetch-rss-cron.js     (run as a cron/daemon)
 * 
 * DEPLOYMENT OPTIONS:
 *   A) Vercel Cron Jobs (vercel.json - see bottom of file)
 *   B) GitHub Actions (free, runs every 6 hours)
 *   C) Railway / Render free tier (always-on Node server)
 *   D) Your own Linux VPS: crontab -e → 0 */6 * * * node /path/fetch-rss.js
 * ============================================================
 */

const Parser  = require('rss-parser');
const fs      = require('fs');
const path    = require('path');

const parser  = new Parser({
  customFields: {
    item: [
      ['media:thumbnail', 'thumbnail'],
      ['media:content',   'mediaContent'],
      ['dc:creator',      'creator'],
    ]
  }
});

// ─── RSS FEED SOURCES ────────────────────────────────────────
// Add or remove feeds freely. 'category' maps to blog filter buttons.
const FEEDS = [
  {
    url:      'https://www.ada.org/en/publications/ada-news/rss',
    source:   'American Dental Association',
    category: 'oral-hygiene',
    author:   'ADA Editorial Team'
  },
  {
    url:      'https://www.dentalhealth.org/rss.xml',
    source:   'Oral Health Foundation',
    category: 'oral-hygiene',
    author:   'Oral Health Foundation'
  },
  {
    url:      'https://www.webmd.com/oral-health/rss.xml',
    source:   'WebMD Dental Health',
    category: 'oral-hygiene',
    author:   'WebMD Editorial'
  },
  {
    url:      'https://www.healthline.com/rss/health-news',
    source:   'Healthline',
    category: 'oral-hygiene',
    author:   'Healthline Editorial'
  },
  {
    url:      'https://www.medicalnewstoday.com/rss',
    source:   'Medical News Today',
    category: 'oral-hygiene',
    author:   'Medical News Today'
  },
  {
    url:      'https://newsinhealth.nih.gov/rss/news',
    source:   'NIH News in Health',
    category: 'oral-hygiene',
    author:   'National Institutes of Health'
  },
  // Add more feeds:
  // { url: 'YOUR_FEED_URL', source: 'Source Name', category: 'orthodontics', author: 'Team' }
];

// ─── KEYWORDS TO FILTER (only dental/health relevant) ────────
const DENTAL_KEYWORDS = [
  'dental', 'tooth', 'teeth', 'gum', 'oral', 'mouth', 'cavity',
  'orthodontic', 'braces', 'implant', 'whitening', 'periodontal',
  'hygiene', 'brush', 'floss', 'enamel', 'plaque', 'tartar',
  'root canal', 'crown', 'veneer', 'denture', 'jaw', 'bite',
  'health', 'diet', 'nutrition', 'sugar', 'fluoride', 'saliva'
];

// ─── CATEGORY DETECTOR ───────────────────────────────────────
function detectCategory(text) {
  const t = text.toLowerCase();
  if (/orthodont|brace|align|invisalign|retainer/.test(t))   return 'orthodontics';
  if (/implant|missing tooth|tooth loss/.test(t))            return 'dental-implants';
  if (/whiten|bleach|cosmet|veneer|smile makeover/.test(t))  return 'cosmetic-dentistry';
  if (/child|kid|pediatric|baby tooth|school/.test(t))       return 'pediatric-dentistry';
  if (/diet|food|sugar|nutrition|vitamin/.test(t))           return 'nutrition';
  return 'oral-hygiene';
}

// ─── SLUG GENERATOR ──────────────────────────────────────────
function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
    .substring(0, 80);
}

// ─── EXCERPT CLEANER ─────────────────────────────────────────
function cleanExcerpt(html, maxLen = 200) {
  return html
    .replace(/<[^>]+>/g, '')    // strip HTML tags
    .replace(/\s+/g, ' ')
    .trim()
    .substring(0, maxLen)
    .replace(/\s+\S*$/, '') + '…';
}

// ─── MAIN FETCH FUNCTION ─────────────────────────────────────
async function fetchAllFeeds() {
  const OUTPUT_FILE = path.join(__dirname, 'blog-posts.json');
  
  // Load existing posts (preserve manually written ones)
  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'));
  } catch {
    existing = [];
  }

  // Build a Set of existing slugs to avoid duplicates
  const existingSlugs = new Set(existing.map(p => p.slug));
  const newPosts      = [];

  for (const feed of FEEDS) {
    console.log(`\n📡 Fetching: ${feed.source}`);
    try {
      const parsed = await parser.parseURL(feed.url);

      for (const item of parsed.items.slice(0, 10)) { // max 10 per feed
        const title   = item.title || '';
        const content = (item.contentSnippet || item.content || item.summary || '');

        // ── Keyword relevance check ────────────────────────
        const combined = `${title} ${content}`.toLowerCase();
        const isRelevant = DENTAL_KEYWORDS.some(kw => combined.includes(kw));
        if (!isRelevant) continue;

        const slug = slugify(title);
        if (existingSlugs.has(slug)) continue;  // skip duplicates

        // ── Detect image ───────────────────────────────────
        let image = '';
        if (item.thumbnail && item.thumbnail.$) {
          image = item.thumbnail.$.url;
        } else if (item.mediaContent && item.mediaContent.$) {
          image = item.mediaContent.$.url;
        } else if (item.enclosure && item.enclosure.url) {
          image = item.enclosure.url;
        }

        const category = detectCategory(`${title} ${content}`);

        newPosts.push({
          id:         `rss-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
          slug,
          title:      title.trim(),
          category,
          author:     item.creator || feed.author,
          source:     feed.source,
          sourceUrl:  item.link || '',
          image:      image || `https://images.unsplash.com/photo-1588776814546-1ffbb172d936?w=600&q=80`,
          excerpt:    cleanExcerpt(content),
          content: `
            <p>${cleanExcerpt(content, 800)}</p>
            <p><strong>Source:</strong> <a href="${item.link || '#'}" target="_blank" rel="noopener">${feed.source}</a></p>
            <p><em>This article has been curated from ${feed.source} for educational purposes. 
            Always consult a qualified dental professional for personal advice. 
            <a href="https://accessdentalcare.in/contact">Book an appointment</a> with our specialists.</em></p>
          `.trim(),
          date:       item.pubDate
                        ? new Date(item.pubDate).toISOString().split('T')[0]
                        : new Date().toISOString().split('T')[0],
          readTime:   `${Math.ceil(content.split(' ').length / 200)} min read`,
          tags:       [category, 'dental-health', 'oral-care'],
          manual:     false,   // marks auto-fetched posts
        });

        existingSlugs.add(slug);
      }

      console.log(`  ✅ Processed ${parsed.items.length} items from ${feed.source}`);
    } catch (err) {
      console.error(`  ❌ Failed to fetch ${feed.source}: ${err.message}`);
    }
  }

  // Merge: manual posts first, then RSS posts, sorted by date descending
  const allPosts = [...existing, ...newPosts].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(allPosts, null, 2), 'utf8');
  console.log(`\n✅ Done! Total posts: ${allPosts.length} (${newPosts.length} new from RSS)`);
  return allPosts;
}

// ─── RUN ─────────────────────────────────────────────────────
fetchAllFeeds().catch(console.error);

// ─── CRON VARIANT (save as fetch-rss-cron.js) ────────────────
/*
const cron = require('node-cron');

// Run every 6 hours
cron.schedule('0 *\/6 * * *', () => {
  console.log('⏰ Cron: Running RSS fetch…');
  fetchAllFeeds().catch(console.error);
});

console.log('🕐 RSS cron scheduler started. Runs every 6 hours.');
*/

// ─── VERCEL CRON CONFIG (add to vercel.json) ─────────────────
/*
{
  "crons": [
    {
      "path": "/api/fetch-rss",
      "schedule": "0 *\/6 * * *"
    }
  ]
}

Then create /api/fetch-rss.js as a Vercel serverless function:

export default async function handler(req, res) {
  if (req.headers.authorization !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  await fetchAllFeeds();
  res.json({ ok: true });
}
*/

// ─── GITHUB ACTIONS VARIANT ──────────────────────────────────
/*
Save as .github/workflows/fetch-rss.yml:

name: Auto-fetch RSS Blogs
on:
  schedule:
    - cron: '0 *\/6 * * *'   # every 6 hours
  workflow_dispatch:           # allow manual trigger

jobs:
  fetch:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: node fetch-rss.js
      - uses: stefanzweifel/git-auto-commit-action@v4
        with:
          commit_message: 'Auto: update blog-posts.json from RSS'
          file_pattern: 'blog-posts.json'
*/
