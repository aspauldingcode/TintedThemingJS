# @tinted-theming/react

React hooks and components for [Base16](https://github.com/tinted-theming/home) and Base24 color themes.

## Features

- ⚛️ **React Hooks**: `useBase16Theme`, `useBase24Theme`, `useTheme`
- 🎨 **Theme Provider**: Context-based theme management
- 🎯 **CSS Utilities**: Convert themes to CSS variables, inline styles
- 📦 **Zero Runtime Dependencies**: Only peer dependencies on React and `@tinted-theming/core`
- 🔥 **TypeScript**: Full type safety

## Installation

```bash
npm install @tinted-theming/core @tinted-theming/react react
```

## Quick Start

### ThemeProvider

```tsx
import { ThemeProvider } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

function App() {
  return (
    <ThemeProvider theme={defaultDark} applyStyles>
      <YourApp />
    </ThemeProvider>
  )
}
```

### useTheme Hook

```tsx
import { useTheme } from '@tinted-theming/react'

function MyComponent() {
  const theme = useTheme()
  
  return (
    <div style={{ 
      backgroundColor: theme.semanticColors.background,
      color: theme.semanticColors.foreground 
    }}>
      <h1 style={{ color: theme.semanticColors.blue }}>
        Hello from {theme.name}!
      </h1>
    </div>
  )
}
```

### CSS Variables

```tsx
import { themeToInlineStyles } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

function MyComponent() {
  return (
    <div style={themeToInlineStyles(defaultDark)}>
      {/* Use CSS variables */}
      <p style={{ color: 'var(--base08)' }}>Red text</p>
      <p style={{ color: 'var(--base0D)' }}>Blue text</p>
    </div>
  )
}
```

### Theme Hooks

```tsx
import { useBase16Theme } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

function MyComponent() {
  const theme = useBase16Theme(defaultDark)
  
  return (
    <div>
      <h1>{theme.name}</h1>
      <p>Variant: {theme.variant}</p>
      <div>
        {theme.allColors.map((color, i) => (
          <div key={i} style={{ backgroundColor: color, width: 50, height: 50 }} />
        ))}
      </div>
    </div>
  )
}
```

## API Reference

### Components

#### `ThemeProvider`

Provides theme context to child components.

```tsx
interface ThemeProviderProps {
  theme: Base16Theme | Base24Theme
  children: React.ReactNode
  applyStyles?: boolean // Apply CSS variables to wrapper
  prefix?: string       // CSS variable prefix (default: '--')
}
```

### Hooks

#### `useTheme()`

Get the current theme from context.

```tsx
const theme = useTheme()
```

#### `useBase16Theme(theme)`

Memoized hook for Base16 themes.

```tsx
const themeData = useBase16Theme(myTheme)
```

#### `useBase24Theme(theme)`

Memoized hook for Base24 themes.

```tsx
const themeData = useBase24Theme(myTheme)
```

### Utilities

#### `themeToCSSVariables(theme, prefix?)`

Convert theme to CSS custom properties object.

```tsx
const vars = themeToCSSVariables(myTheme)
// { '--base00': '#181818', '--base01': '#282828', ... }
```

#### `themeToInlineStyles(theme, prefix?)`

Convert theme to React inline styles.

```tsx
<div style={themeToInlineStyles(myTheme)}>...</div>
```

#### `themeToCSSString(theme, selector?, prefix?)`

Generate CSS string from theme.

```tsx
const css = themeToCSSString(myTheme, '.themed')
// .themed { --base00: #181818; ... }
```

## Examples

### Dynamic Theme Switching

```tsx
import { ThemeProvider } from '@tinted-theming/react'
import { defaultDark, defaultLight } from '@tinted-theming/core'
import { useState } from 'react'

function App() {
  const [isDark, setIsDark] = useState(true)
  const theme = isDark ? defaultDark : defaultLight
  
  return (
    <ThemeProvider theme={theme} applyStyles>
      <button onClick={() => setIsDark(!isDark)}>
        Toggle Theme
      </button>
      <YourApp />
    </ThemeProvider>
  )
}
```

### Loading Themes

```tsx
import { ThemeProvider } from '@tinted-theming/react'
import { ThemesLoader } from '@tinted-theming/core'
import { useEffect, useState } from 'react'

function App() {
  const [theme, setTheme] = useState(null)
  
  useEffect(() => {
    const loader = new ThemesLoader()
    loader.loadBase16Theme('base16/monokai.yaml')
      .then(setTheme)
  }, [])
  
  if (!theme) return <div>Loading...</div>
  
  return (
    <ThemeProvider theme={theme} applyStyles>
      <YourApp />
    </ThemeProvider>
  )
}
```

## License

MIT License - see LICENSE for details
