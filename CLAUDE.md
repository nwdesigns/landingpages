# CLAUDE.md - Project Guidelines

## Onboarding

### Prerequisites

Before working on this project, ensure the following tools are installed:

#### 1. Bun (Required)

Bun is required for running the development server and managing dependencies.

```bash
# Install Bun via Homebrew
brew install oven-sh/bun/bun

# Verify installation
bun --version
```

#### 2. uv (Recommended)

uv is a fast Python package installer and resolver. It's useful for any Python-related tooling or scripts.

```bash
# Install uv via Homebrew
brew install uv

# Verify installation
uv --version
```

### Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   bun install
   ```
3. Start the development server:
   ```bash
   bun run dev
   ```

## Development

### Local Web Server

Always use Bun to run the local development server:

```bash
bun run dev
```

This will start a local web server for previewing landing pages.

### Project Structure

```
landingpages/
├── CLAUDE.md          # Project guidelines (this file)
├── package.json       # Dependencies and scripts
└── src/               # Source files for landing pages
```

## Notes

- All landing page previews should be done via `bun run dev`
- Do not use other web servers (python http.server, php -S, etc.) for development
