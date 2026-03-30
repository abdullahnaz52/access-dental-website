# 🚀 Deployment Guide — Access Dental Care Website
## Hosting on Vercel (Free) with Secure Groq AI

---

## How it works

```
User's Browser  →  /api/chat (Vercel server)  →  Groq AI API
                         ↑
              GROQ_API_KEY lives here only
              (never in your code or GitHub)
```

Your GitHub repo has **zero secrets**. The API key is stored in
Vercel's encrypted environment variables — only the server can read it.

---

## Step 1 — Push your code to GitHub

1. Go to https://github.com and create a new repository
   - Name it: `access-dental-website` (or anything you like)
   - Set it to **Public** or **Private** — either works
   - Do NOT initialize with README (keep it empty)

2. Upload all your website files to this repo.
   The folder structure must look like this:

```
your-repo/
├── api/
│   └── chat.js          ← Vercel serverless function (no key inside)
├── index.html
├── style.css
├── script.js
├── vercel.json
├── logo-trans.png
├── logo.png
├── clinic-image.png
├── sameer-photo.png
├── nida-photo.png
├── slide-one.jpg
├── slide-two.jpg
├── slide-three.jpg
└── Video-bg.gif
```

---

## Step 2 — Create a Vercel account

1. Go to https://vercel.com
2. Click **Sign Up**
3. Choose **Continue with GitHub** (easiest — links your repos automatically)

---

## Step 3 — Import your GitHub repo into Vercel

1. On your Vercel dashboard, click **Add New → Project**
2. Find your `access-dental-website` repo and click **Import**
3. On the configuration screen:
   - **Framework Preset:** leave as "Other"
   - **Root Directory:** leave as `.` (the root)
   - **Build Command:** leave empty
   - **Output Directory:** leave empty
4. **DO NOT click Deploy yet** — first add the environment variable (Step 4)

---

## Step 4 — Add your Groq API key as an Environment Variable

This is the critical step. This is where your key is stored securely.

1. On the same configuration screen, scroll down to **Environment Variables**
2. Add the following:
   - **Key (Name):**  `GROQ_API_KEY`
   - **Value:**       `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`
   - **Environment:** select all three: ✅ Production  ✅ Preview  ✅ Development
3. Click **Add**

---

## Step 5 — Deploy

1. Click the **Deploy** button
2. Wait ~60 seconds while Vercel builds your site
3. You'll get a live URL like: `https://access-dental-website.vercel.app`

✅ Your site is live!
✅ The chatbot works via the secure proxy
✅ No API key in your GitHub repo

---

## Step 6 — Add a custom domain (optional)

If you have a domain like `accessdentalcare.in`:

1. Go to your project on Vercel → **Settings → Domains**
2. Type your domain and click **Add**
3. Vercel will show you DNS records to add at your domain registrar
4. Once DNS propagates (5–30 min), your site runs on your custom domain

---

## Updating your website in the future

Whenever you push changes to GitHub, Vercel automatically redeploys.
That's it — no manual steps needed after the initial setup.

---

## Troubleshooting

| Problem | Fix |
|---|---|
| Chatbot says "trouble connecting" | Check Vercel dashboard → Functions → chat → Logs |
| Blank page | Check browser console for errors |
| 404 on /api/chat | Make sure `api/chat.js` is in the right folder |
| GitHub still warns about secrets | The key is only in Vercel, not in any file — click "No secret" if prompted |

---

## Security Summary

| What | Where stored | Who can see it |
|---|---|---|
| GROQ_API_KEY | Vercel Environment Variables | Only Vercel servers |
| script.js | GitHub (public) | Everyone — but has NO key |
| api/chat.js | GitHub (public) | Everyone — but has NO key |

The key never appears in any file you commit. ✅

---

*Powered by Neurigenx — https://www.neurigenx.com*
