# Tiger Yacht — Cinematic V4 Aligned

Premium video-first website aligned to the current Tiger Yacht public product/service offering.

This is a copy of the current working code from
**github.com/nithishibops/TIGER-YACHT-Luxury-Charter-Dubai**, deployed at
**tiger-yacht-luxury-charter-dubai.vercel.app**. It already includes:

- Current listed fleet and hourly rates — 38FT, 45FT, Majesty 44FT, Majesty
  50FT, 75FT, Sunseeker 50FT
- Tailored package add-ons and prices
- Jet Car, Jet Ski and Deep Sea Fishing
- 2H / 3H / 4H / 5H / 8H Dubai routes
- 4-step booking flow
- Live price estimator
- WhatsApp booking to +971 52 289 8960
- Vercel-ready static setup

## What's included in this zip

- `index.html` — full page markup and fleet/pricing content
- `styles.css` — all styling
- `script.js` — scroll-driven scene switching, live price estimator, WhatsApp booking handoff
- `vercel.json` — deployment config

**Not included:** `assets/stm-logo.png` and the `assets/videos/*.mp4` clips —
these are binary media files already sitting in your GitHub repo; keep using
those as-is, this zip doesn't need to touch them.

## Known issue: tigeryachtstm.com is not connected to this project

This Vercel project (`tiger-yacht-luxury-charter-dubai`) only has these
domains attached:
- tiger-yacht-luxury-charter-dubai.vercel.app
- tiger-yacht-luxury-charter-dubai-nithishibops-projects.vercel.app
- tiger-yacht-luxury-charter-dubai-git-main-nithishibops-projects.vercel.app

Your live custom domain **tigeryachtstm.com** points somewhere else — an
older, different multi-page site where the fleet section is stuck on
"Loading Fleet...". That's why the public site looks broken even though this
project works fine.

To fix it:
1. In the Vercel dashboard, open the `tiger-yacht-luxury-charter-dubai` project → Settings → Domains → add `tigeryachtstm.com`.
2. Update the DNS records at your domain registrar to match what Vercel shows.
3. Remove/disconnect whatever old host tigeryachtstm.com currently points to, so there's no conflict.
4. Wait for DNS propagation (usually under a few hours).

## Deploy

Push the folder to GitHub and import the repository into Vercel. No build command is required.
