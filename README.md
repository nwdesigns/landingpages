# adv.nwdesigns.it

Marketing campaign landing pages for **nwdesigns** digital agency.

## Landing Pages

Seven vertical landing pages targeting specific industries:

| Vertical         | Production URL                                                                   |
| ---------------- | -------------------------------------------------------------------------------- |
| Luxury           | [adv.nwdesigns.it/luxury/](https://adv.nwdesigns.it/luxury/)                     |
| Automotive       | [adv.nwdesigns.it/automotive/](https://adv.nwdesigns.it/automotive/)             |
| Gold Traders     | [adv.nwdesigns.it/gold-traders/](https://adv.nwdesigns.it/gold-traders/)         |
| Watch Dealers    | [adv.nwdesigns.it/watch-dealers/](https://adv.nwdesigns.it/watch-dealers/)       |
| Private Schools  | [adv.nwdesigns.it/private-schools/](https://adv.nwdesigns.it/private-schools/)   |
| Senior Living    | [adv.nwdesigns.it/senior-living/](https://adv.nwdesigns.it/senior-living/)       |
| Family Companies | [adv.nwdesigns.it/family-companies/](https://adv.nwdesigns.it/family-companies/) |

## Quick Start

```bash
# Clone the repository
git clone git@github.com:nwdesigns/landingpages.git
cd landingpages

# Install dependencies
bun install

# Start development server
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Project Structure

```
landingpages/
├── app/                      # Next.js App Router
├── public/                   # Static landing pages
│   ├── _shared/              # Shared assets (CSS, JS, images, video)
│   ├── luxury/               # Luxury vertical
│   ├── automotive/           # Automotive vertical
│   ├── gold-traders/         # Gold Traders vertical
│   ├── watch-dealers/        # Watch Dealers vertical
│   ├── private-schools/      # Private Schools vertical
│   ├── senior-living/        # Senior Living vertical
│   └── family-companies/     # Family Companies vertical
├── docs/                     # Documentation
│   └── ONBOARDING.md         # Developer onboarding guide
├── scripts/                  # Utility scripts
│   └── bootstrap.sh          # Automated setup script
└── .github/workflows/        # GitHub Actions
    └── sync-gitlab.yml       # Sync to GitLab mirror
```

## Commands

| Command                 | Description              |
| ----------------------- | ------------------------ |
| `bun dev`               | Start development server |
| `bun build`             | Build for production     |
| `./deploy.sh`           | Deploy to production     |
| `./deploy.sh --preview` | Deploy preview           |

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Runtime**: Bun
- **Styling**: Custom CSS + Tailwind
- **Deployment**: Vercel
- **CI/CD**: GitHub Actions (GitLab sync)

## Design System

| Color      | Variable      | Value     |
| ---------- | ------------- | --------- |
| Background | `--nw-bg`     | `#F0F0F0` |
| Foreground | `--nw-fg`     | `#2B2B2B` |
| Accent     | `--nw-accent` | `#D61313` |
| Muted      | `--nw-muted`  | `#828282` |
| Dark       | `--nw-dark`   | `#1E1E1E` |

**Typography**:

- Headlines: Aktiv Grotesk Extended
- Body: Mulish
- Labels: Space Mono (uppercase)

## Documentation

- [Onboarding Guide](docs/ONBOARDING.md) - Complete setup instructions for new developers

## Related

- **Main site**: [nwdesigns.it](https://www.nwdesigns.it)
- **API**: [api.nwdesigns.it](https://api.nwdesigns.it)

## License

Private - All rights reserved.
