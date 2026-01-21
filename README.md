# TintedThemingJS

[![Build Status](https://github.com/aspauldingcode/TintedThemingJS/workflows/Build%20and%20Deploy/badge.svg)](https://github.com/aspauldingcode/TintedThemingJS/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

> TypeScript/JavaScript API for [Base16](https://github.com/tinted-theming/home) and Base24 color themes

A comprehensive npm package for working with Base16 and Base24 color schemes in web applications. Provides easy access to hundreds of color themes from the [TintedTheming/Schemes](https://github.com/tinted-theming/schemes) project.

## 🌟 Features

- 🎨 **Base16 & Base24 Support**: Complete implementation of both color specifications
- 🔄 **Dynamic Theme Loading**: Fetch themes from the official TintedTheming repository
- ⚛️ **React Integration**: Hooks and components for seamless React/Next.js integration
- 🎯 **Semantic Colors**: Easy access to semantic color mappings
- 📦 **ESM-First**: Modern ES modules with full TypeScript support
- 🌐 **Universal**: Works in Node.js and all modern browsers
- ⚡ **Zero Config**: Works out of the box with sensible defaults

## 📦 Packages

This monorepo contains three packages:

| Package | Description | Version |
|---------|-------------|---------|
| [`@tinted-theming/core`](./packages/core) | Core API for Base16/Base24 themes | ![npm](https://img.shields.io/npm/v/@tinted-theming/core) |
| [`@tinted-theming/react`](./packages/react) | React hooks and components | ![npm](https://img.shields.io/npm/v/@tinted-theming/react) |
| [`@tinted-theming/site`](./packages/site) | Demo Next.js site | - |

## 🚀 Quick Start

### Installation

```bash
# For vanilla JS/TS
npm install @tinted-theming/core

# For React/Next.js
npm install @tinted-theming/core @tinted-theming/react
```

### Basic Usage

```typescript
import { defaultDark, ThemesLoader } from '@tinted-theming/core'

// Use default theme (no network required)
console.log(defaultDark.palette.base08) // "#ab4642" (red)
console.log(defaultDark.semanticColors.blue) // "#7cafc2"

// Load theme from network
const loader = new ThemesLoader()
const monokai = await loader.loadBase16Theme('base16/monokai.yaml')
```

### React Usage

```tsx
import { ThemeProvider, useTheme } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

function App() {
  return (
    <ThemeProvider theme={defaultDark} applyStyles>
      <YourApp />
    </ThemeProvider>
  )
}

function YourApp() {
  const theme = useTheme()
  return <div style={{ color: theme.semanticColors.foreground }}>
    Hello from {theme.name}!
  </div>
}
```

## 🎨 Demo

Visit our [live demo](https://tintedthemingjs.vercel.app) to see all available themes and interact with the color palettes.

## 📖 Documentation

- [Core Package Documentation](./packages/core/README.md)
- [React Package Documentation](./packages/react/README.md)
- [API Reference](#api-reference)
- [Publishing Guide](#publishing-to-npm)

## 🏗️ Development

This project uses a monorepo structure with npm workspaces.

```bash
# Install dependencies for all packages
npm install

# Build all packages
npm run build

# Run development server (Next.js demo site)
npm run dev

# Clean all build artifacts
npm run clean
```

### Project Structure

```
TintedThemingJS/
├── packages/
│   ├── core/          # Core TypeScript API
│   ├── react/         # React hooks & components
│   └── site/          # Next.js demo site
├── package.json       # Workspace root
├── tsconfig.base.json # Shared TypeScript config
└── .github/
    └── workflows/
        └── deploy.yml # CI/CD configuration
```

## 🚢 Publishing to npm

### Prerequisites

1. Create an [npm account](https://www.npmjs.com/signup)
2. Verify your email address
3. Enable 2FA on your npm account (required for publishing)
4. Login to npm CLI: `npm login`

### Publishing Process

```bash
# 1. Build all packages
npm run build

# 2. Publish core package
cd packages/core
npm publish --access public

# 3. Publish react package
cd ../react
npm publish --access public
```

### Version Bumping

```bash
# Patch version (0.1.0 -> 0.1.1)
npm version patch

# Minor version (0.1.0 -> 0.2.0)
npm version minor

# Major version (0.1.0 -> 1.0.0)
npm version major
```

### Automated Publishing (Optional)

Add to `.github/workflows/publish.yml`:

```yaml
name: Publish to npm

on:
  release:
    types: [created]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          registry-url: 'https://registry.npmjs.org'
      - run: npm ci
      - run: npm run build
      - run: npm publish --workspace=packages/core --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
      - run: npm publish --workspace=packages/react --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 🚀 Deployment

### Vercel

The Next.js demo site automatically deploys to Vercel on every push to `main`.

**Setup:**
1. Create a [Vercel account](https://vercel.com/signup)
2. Import your GitHub repository
3. Set the root directory to `packages/site`
4. Add secrets to GitHub Actions:
   - `VERCEL_TOKEN`: Your Vercel API token
   - `VERCEL_ORG_ID`: Your Vercel organization ID
   - `VERCEL_PROJECT_ID`: Your Vercel project ID

### GitHub Pages

The site also deploys to GitHub Pages as a static export.

**Setup:**
1. Go to repository Settings → Pages
2. Set source to "GitHub Actions"
3. Push to `main` branch

## 🎯 Base16 Color Specification

Base16 themes follow a standardized 16-color palette:

- `base00-03`: Background colors (darkest to lightest)
- `base04-07`: Foreground colors (darkest to lightest)
- `base08`: Red
- `base09`: Orange
- `base0A`: Yellow
- `base0B`: Green
- `base0C`: Cyan
- `base0D`: Blue
- `base0E`: Purple
- `base0F`: Brown

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [TintedTheming/Schemes](https://github.com/tinted-theming/schemes) - Color scheme source
- [Base16](https://github.com/tinted-theming/home) - Color scheme specification
- Inspired by [TintedThemingSwift](https://github.com/aspauldingcode/TintedThemingSwift)

## 📬 Author

**Alex Spaulding**

---

Made with ❤️ for the theming community

