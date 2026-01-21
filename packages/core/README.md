# @tinted-theming/core

TypeScript/JavaScript API for [Base16](https://github.com/tinted-theming/home) and Base24 color themes.

## Features

- 🎨 **Base16 & Base24 Support**: Complete implementation of both specifications
- 🔄 **Theme Loading**: Fetch themes from the official TintedTheming repository
- 🎯 **Semantic Colors**: Easy access to semantic color mappings
- ⚡ **Zero Runtime Dependencies**: Only `yaml` for parsing
- 🌐 **Universal**: Works in Node.js and browsers
- 📦 **ESM-First**: Modern ES modules with full TypeScript support

## Installation

```bash
npm install @tinted-theming/core
```

## Quick Start

### Using Default Themes

```typescript
import { defaultDark, defaultLight } from '@tinted-theming/core'

// Use built-in themes (no network required)
console.log(defaultDark.name) // "Default Dark"
console.log(defaultDark.palette.base08) // "#ab4642" (red)

// Access semantic colors
const { background, foreground, red } = defaultDark.semanticColors
```

### Loading Themes from Network

```typescript
import { ThemesLoader } from '@tinted-theming/core'

const loader = new ThemesLoader()

// Load a single theme
const monokai = await loader.loadBase16Theme('base16/monokai.yaml')
console.log(monokai.name) // "Monokai"

// Load multiple themes
const themes = await loader.loadThemes([
  'base16/monokai.yaml',
  'base16/solarized-dark.yaml',
  'base24/espresso.yaml',
])
```

### Using with CSS Variables

```typescript
import { defaultDark } from '@tinted-theming/core'

const cssVars = defaultDark.toCSSVariables()
// Returns: { '--base00': '#181818', '--base01': '#282828', ... }

// Apply to document
Object.assign(document.documentElement.style, cssVars)
```

## API Reference

### `Base16Theme`

Main class for Base16 themes (16 colors).

```typescript
class Base16Theme {
  name: string
  author?: string
  variant: 'dark' | 'light'
  palette: Base16Palette
  
  get isDark: boolean
  get isLight: boolean
  get allColors: string[]
  get semanticColors: SemanticColors
  
  colorAt(index: number): string | undefined
  toCSSVariables(prefix?: string): Record<string, string>
  toJSON(): Base16ThemeData
}
```

### `Base24Theme`

Extended class for Base24 themes (24 colors).

```typescript
class Base24Theme {
  // Same as Base16Theme, plus:
  asBase16Theme(): Base16Theme // Convert to Base16
}
```

### `ThemesLoader`

Load themes from the TintedTheming repository.

```typescript
class ThemesLoader {
  constructor(options?: LoaderOptions)
  
  loadBase16Theme(path: string): Promise<Base16Theme>
  loadBase24Theme(path: string): Promise<Base24Theme>
  loadTheme(path: string): Promise<Base16Theme | Base24Theme>
  loadThemes(paths: string[]): Promise<Array<Base16Theme | Base24Theme>>
}
```

**Options:**
```typescript
interface LoaderOptions {
  fetch?: typeof fetch // Custom fetch implementation
  baseUrl?: string     // Custom base URL
  ref?: string         // Git ref (default: 'spec-0.11')
}
```

### Default Themes

```typescript
export const defaultDark: Base16Theme
export const defaultLight: Base16Theme
```

## Base16 Color Specification

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

## License

MIT License - see LICENSE for details

## Acknowledgments

- [TintedTheming/Schemes](https://github.com/tinted-theming/schemes) - Color scheme source
- [Base16](https://github.com/tinted-theming/home) - Color scheme specification
