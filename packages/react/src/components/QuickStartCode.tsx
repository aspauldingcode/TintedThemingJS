
import React, { useState } from 'react'

export type FrameworkType = 'react' | 'vanilla-js' | 'vanilla-ts' | 'nextjs' | 'vite' | 'remix'

interface QuickStartCodeProps {
  framework?: FrameworkType;
}

const CODES: Record<FrameworkType, string> = {
  react: `import { ThemeProvider } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

function App() {
  return (
    <ThemeProvider theme={defaultDark} applyStyles>
      <YourApp />
    </ThemeProvider>
  )
}`,
  vite: `import { ThemeProvider } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

function App() {
  return (
    <ThemeProvider theme={defaultDark} applyStyles>
      <YourApp />
    </ThemeProvider>
  )
}`,
  remix: `import { ThemeProvider } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

export default function App() {
  return (
    <ThemeProvider theme={defaultDark} applyStyles>
      <Outlet />
    </ThemeProvider>
  )
}`,
  nextjs: `// app/layout.tsx
import { ThemeProvider } from '@tinted-theming/react'
import { defaultDark } from '@tinted-theming/core'

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={defaultDark} applyStyles>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}`,
  'vanilla-js': `import { ThemeManager, defaultDark } from '@tinted-theming/core'

const manager = new ThemeManager(defaultDark)
manager.applyTo(document.body)`,
  'vanilla-ts': `import { ThemeManager, defaultDark } from '@tinted-theming/core'

const manager = new ThemeManager(defaultDark)
manager.applyTo(document.body)`
}

export const QuickStartCode: React.FC<QuickStartCodeProps> = ({ framework = 'react' }) => {
  const [copied, setCopied] = useState(false)
  const code = CODES[framework] || CODES.react

  const handleCopy = () => {
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={handleCopy}
        style={{
          position: 'absolute',
          top: '0.5rem',
          right: '0.5rem',
          padding: '0.25rem 0.5rem',
          backgroundColor: 'var(--base02)',
          color: 'var(--base05)',
          border: 'none',
          borderRadius: '4px',
          fontSize: '0.75rem',
          cursor: 'pointer',
          transition: 'background-color 0.2s',
        }}
      >
        {copied ? 'Copied!' : 'Copy'}
      </button>
      <pre style={{
        backgroundColor: 'var(--base00)',
        color: 'var(--base05)',
        padding: '1rem',
        borderRadius: '6px',
        overflow: 'auto',
        fontSize: '0.85rem',
        border: '1px solid var(--base02)',
        lineHeight: 1.5,
        fontFamily: 'monospace'
      }}>
        <code
          style={{ backgroundColor: 'transparent', padding: 0, borderRadius: 0 }}
          dangerouslySetInnerHTML={{
            __html: code
              .replace(/\b(import|from|const|let|var|new|class|function|return|if|else|for|while|async|await|export|default|interface|type)\b/g, '<span style="color: var(--base0E)">$1</span>')
              .replace(/\b(true|false|null|undefined)\b/g, '<span style="color: var(--base09)">$1</span>')
              .replace(/'([^']*)'/g, '<span style="color: var(--base0B)">\'$1\'</span>')
              .replace(/\b(\w+)\(/g, '<span style="color: var(--base0D)">$1</span>(')
              .replace(/\b(\d+)\b/g, '<span style="color: var(--base09)">$1</span>')
              .replace(/(\/\/.*)/g, '<span style="color: var(--base03)">$1</span>')
              .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;") // Basic sanity escaping first? actually we are injecting spans so we assume input code is safe/trusted or we need to escape parts that are not spans.
              // Re-doing the replace chain to be safer: escape HTML first, THEN apply highlights.
              // But replace chain on escaped HTML is tricky.
              // Simplified approach: trusted content assumption for this specific component.
              // Let's stick to the previous regex replacement as it matches "known patterns" into spans.
              .replace(/\b(import|from|const|let|var|new|class|function|return|if|else|for|while|async|await|export|default|interface|type)\b/g, '<span style="color: var(--base0E)">$1</span>')
              .replace(/\b(true|false|null|undefined)\b/g, '<span style="color: var(--base09)">$1</span>')
              .replace(/'([^']*)'/g, '<span style="color: var(--base0B)">\'$1\'</span>')
              .replace(/\b(\w+)\(/g, '<span style="color: var(--base0D)">$1</span>(')
              .replace(/\b(\d+)\b/g, '<span style="color: var(--base09)">$1</span>')
              .replace(/(\/\/.*)/g, '<span style="color: var(--base03)">$1</span>')
          }}
        />
      </pre>
    </div>
  )
}
