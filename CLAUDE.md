# CLAUDE.md - adv.nwdesigns.it

## Project Overview

**adv.nwdesigns.it** - Marketing campaign landing pages for nwdesigns digital agency.

Seven vertical landing pages targeting specific industries:
- **luxury** - Luxury brands and high-end services
- **automotive** - Car dealerships and automotive businesses
- **gold-traders** - Gold and precious metals traders
- **watch-dealers** - Luxury watch dealers
- **private-schools** - Private schools and educational institutions
- **senior-living** - Senior living and care facilities
- **family-companies** - Family-owned businesses

## Production URLs

| Page | URL |
|------|-----|
| Luxury | https://adv.nwdesigns.it/luxury/ |
| Automotive | https://adv.nwdesigns.it/automotive/ |
| Gold Traders | https://adv.nwdesigns.it/gold-traders/ |
| Watch Dealers | https://adv.nwdesigns.it/watch-dealers/ |
| Private Schools | https://adv.nwdesigns.it/private-schools/ |
| Senior Living | https://adv.nwdesigns.it/senior-living/ |
| Family Companies | https://adv.nwdesigns.it/family-companies/ |

## Architecture

```
adv.nwdesigns.it/
├── app/                     # Next.js App Router (minimal)
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Redirect to /luxury/
├── public/                  # Static landing pages
│   ├── _shared/             # Shared assets
│   │   ├── css/main.css     # Main stylesheet
│   │   ├── js/              # JavaScript modules
│   │   │   ├── main.js      # Main entry point
│   │   │   └── modules/     # Individual modules
│   │   ├── img/             # Images and SVGs
│   │   └── video/           # Background videos
│   ├── luxury/              # Each vertical has:
│   │   ├── index.html       # Landing page
│   │   ├── grazie.html      # Thank you page
│   │   ├── css/custom.css   # Vertical-specific styles
│   │   └── js/main.js       # Vertical-specific JS
│   └── [other verticals]/
├── package.json
├── next.config.ts           # trailingSlash: true
└── vercel.json              # URL rewrites
```

## Development Commands

```bash
bun install          # Install dependencies
bun dev              # Start dev server (port 3000)
bun build            # Build for production
vercel --prod        # Deploy to production
```

## Form Submission

Forms submit cross-origin to the main site's API:
- **Endpoint:** `https://www.nwdesigns.it/api/send-lead`
- **Method:** POST
- **Content-Type:** application/json

### Required Fields
- `nome`, `cognome`, `email`, `azienda` (required)
- `telefono`, `settore`, `sito`, `messaggio` (optional)
- `privacy` (required, boolean)
- `source` (vertical identifier)

### Honeypot Fields
- `website_url`, `fax_number` (must be empty)

## Design System

Inherits from main nwdesigns.it design system:
- **Background:** `#F0F0F0` (nw-bg)
- **Foreground:** `#2B2B2B` (nw-fg)
- **Accent:** `#D61313` (nw-accent)
- **Muted:** `#828282` (nw-muted)
- **Dark:** `#1E1E1E` (nw-dark)

### Typography
- Headlines: Aktiv Grotesk Extended
- Body: Mulish
- Labels: Space Mono (uppercase)

### Features
- Custom ring+dot cursor (desktop)
- Background video hero
- Floating mobile CTA
- Real-time form validation

## Related Projects

- **Main site:** https://www.nwdesigns.it (nwdesigns.it repo)
- **WordPress API:** https://api.nwdesigns.it

## Deployment

Deployed via Vercel:
- **Project:** adv-nwdesigns-it
- **Subdomain:** adv.nwdesigns.it
