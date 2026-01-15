# The GOAT Initiative Website

A futuristic, government-themed Next.js 15 website for The GOAT Initiative.

## Features

- **Next.js 15** with App Router and TypeScript
- **Tailwind CSS** with dark mode (default) and custom color palette
- **Framer Motion** for smooth animations
- **Google Fonts**: Inter (body) & Orbitron (headings)
- CRT scanline overlay effect
- Topographic/hex grid background
- Floating HUD with real-time status
- Responsive navigation with clearance badge
- Trust banner with security indicators

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the site.

## Custom Colors

| Color | Hex | Usage |
|-------|-----|-------|
| Primary (Cyan) | `#00d4ff` | Main accent, links, highlights |
| Accent (Red) | `#ff2a6d` | Alerts, warnings, CTAs |
| Success (Green) | `#00ff9f` | Status indicators, badges |
| Dark BG | `#0a0a0f` to `#111111` | Background gradient |

## Project Structure

```
├── app/
│   ├── globals.css      # Global styles, CRT effects, custom classes
│   ├── layout.tsx       # Root layout with fonts and overlays
│   └── page.tsx         # Homepage
├── components/
│   ├── TrustBanner.tsx  # Top trust/security banner
│   ├── Navbar.tsx       # Fixed navigation with clearance badge
│   ├── FloatingHUD.tsx  # Bottom-right status panel
│   └── Footer.tsx       # Footer with disclaimer
├── tailwind.config.ts   # Custom Tailwind configuration
└── package.json
```

## License

© 2026 The GOAT Initiative | EIN: 99-3753614 | 501(c)(3)
