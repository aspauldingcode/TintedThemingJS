import { useState, useEffect } from 'react'
import { ThemeProvider, useTheme, UnifiedLayout, FrameworkSwitcher, ThemeSwitcher, QuickStartCode } from '@tinted-theming/react'
import {
  defaultDark,
  defaultLight,
  ThemesLoader,
  type Base16Theme,
  type Base24Theme
} from '@tinted-theming/core'

function MainContent() {
  const theme = useTheme()

  return (
    <main style={{ padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Hero Section */}
      <section style={{ marginBottom: '4rem', textAlign: 'center' }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          marginBottom: '1rem',
          background: `linear-gradient(135deg, var(--base0D), var(--base0E))`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
        }}>
          TintedTheming JS (Remix)
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--base04)',
          marginBottom: '2rem',
        }}>
          TypeScript/JavaScript API for Base16 and Base24 color themes
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a
            href="https://github.com/tinted-theming/schemes"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--base0D)',
              color: 'var(--base00)',
              borderRadius: '6px',
              fontWeight: 600,
              transition: 'transform 0.2s',
            }}
          >
            View Schemes →
          </a>
          <a
            href="https://github.com/aspauldingcode/TintedThemingJS"
            target="_blank"
            rel="noopener noreferrer"
            style={{
              padding: '0.75rem 1.5rem',
              backgroundColor: 'var(--base02)',
              color: 'var(--base05)',
              borderRadius: '6px',
              fontWeight: 600,
            }}
          >
            GitHub
          </a>
        </div>
      </section>

      {/* Current Theme Details */}
      <section style={{
        marginBottom: '3rem',
        padding: '2rem',
        backgroundColor: 'var(--base01)',
        borderRadius: '8px',
        border: '1px solid var(--base02)',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--base0D)' }}>
          Current Theme
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
          <div>
            <strong style={{ color: 'var(--base04)' }}>Name:</strong>
            <span style={{ color: 'var(--base05)', marginLeft: '0.5rem' }}>{theme.name}</span>
          </div>
          <div>
            <strong style={{ color: 'var(--base04)' }}>Author:</strong>
            <span style={{ color: 'var(--base05)', marginLeft: '0.5rem' }}>{theme.author || 'Unknown'}</span>
          </div>
          <div>
            <strong style={{ color: 'var(--base04)' }}>Variant:</strong>
            <span style={{
              color: theme.isDark ? 'var(--base0E)' : 'var(--base0A)',
              textTransform: 'uppercase',
              fontWeight: 600,
              marginLeft: '0.5rem'
            }}>{theme.variant}</span>
          </div>
          <div>
            <strong style={{ color: 'var(--base04)' }}>DOM Attr:</strong>
            <code style={{ fontSize: '0.8rem', marginLeft: '0.5rem', backgroundColor: 'var(--base00)', padding: '0.2rem 0.4rem', borderRadius: '4px' }}>
              data-variant="{theme.variant}"
            </code>
          </div>
        </div>
      </section>

      {/* Color Palette */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--base0D)' }}>
          {theme.system.toUpperCase()} Color Palette
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: '1rem'
        }}>
          {theme.allColors.map((color, index) => {
            const baseKey = `base${index.toString(16).toUpperCase().padStart(2, '0')}`
            return (
              <div
                key={baseKey}
                style={{
                  backgroundColor: color,
                  padding: '3rem 1rem 1rem',
                  borderRadius: '6px',
                  border: '1px solid var(--base02)',
                  position: 'relative',
                  transition: 'transform 0.2s',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                onClick={() => {
                  navigator.clipboard.writeText(color)
                }}
                title={`Click to copy ${color}`}
              >
                <div style={{
                  backgroundColor: theme.isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
                  color: theme.isDark ? '#000' : '#fff',
                  padding: '0.5rem',
                  borderRadius: '4px',
                  fontSize: '0.75rem',
                  fontWeight: 600,
                }}>
                  <div>{baseKey}</div>
                  <div style={{ fontSize: '0.7rem', opacity: 0.8 }}>{color}</div>
                </div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Semantic Colors */}
      <section style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1.5rem', color: 'var(--base0D)' }}>
          Semantic Colors
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
          gap: '1rem'
        }}>
          {Object.entries(theme.semanticColors || {}).map(([name, color]) => (
            <div
              key={name}
              style={{
                backgroundColor: 'var(--base01)',
                padding: '1rem',
                borderRadius: '6px',
                border: '1px solid var(--base02)',
                textAlign: 'center',
              }}
            >
              <div style={{
                width: '60px',
                height: '60px',
                backgroundColor: color,
                margin: '0 auto 0.5rem',
                borderRadius: '50%',
                border: '2px solid var(--base02)',
              }} />
              <div style={{
                fontSize: '0.85rem',
                fontWeight: 600,
                color: 'var(--base05)',
                textTransform: 'capitalize',
              }}>{name}</div>
              <div style={{
                fontSize: '0.7rem',
                color: 'var(--base04)',
                marginTop: '0.25rem',
              }}>{color}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Usage Example */}
      <section style={{
        padding: '2rem',
        backgroundColor: 'var(--base01)',
        borderRadius: '8px',
        border: '1px solid var(--base02)',
      }}>
        <h2 style={{ fontSize: '1.5rem', marginBottom: '1rem', color: 'var(--base0D)' }}>
          Quick Start
        </h2>
        <QuickStartCode framework="remix" />
      </section>
    </main>
  )
}

function App() {
  const [theme, setTheme] = useState<Base16Theme | Base24Theme>(defaultDark)
  const [availableThemes, setAvailableThemes] = useState<(Base16Theme | Base24Theme)[]>([
    defaultDark,
    defaultLight,
  ])
  const [remoteThemePaths, setRemoteThemePaths] = useState<string[]>([])
  const [isLoadingList, setIsLoadingList] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loader = new ThemesLoader()
    loader.listThemes().then(paths => {
      setRemoteThemePaths(paths)
      setIsLoadingList(false)
      setError(null)
    }).catch(err => {
      console.error('Failed to list themes:', err)
      setError(err.message || 'Failed to load themes')
      setIsLoadingList(false)
    })

    const initialPaths = [
      'base16/monokai.yaml',
      'base16/nord.yaml',
      'base16/dracula.yaml',
      'base24/espresso.yaml',
    ]

    Promise.all(
      initialPaths.map(async (path) => {
        try {
          return await loader.loadTheme(path)
        } catch (error) {
          return null
        }
      })
    ).then((loadedThemes) => {
      const validThemes = loadedThemes.filter((t): t is Base16Theme | Base24Theme => t !== null)
      setAvailableThemes((prev) => {
        const existingIds = new Set(prev.map(t => `${(t as any).system || 'base16'}-${t.name}`))
        const newThemes = validThemes.filter(t => !existingIds.has(`${(t as any).system || 'base16'}-${t.name}`))
        return [...prev, ...newThemes]
      })
    })
  }, [])

  const handleThemeChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    const alreadyLoaded = availableThemes.find(t => `${(t as any).system || 'base16'}-${t.name}` === value)

    if (alreadyLoaded) {
      setTheme(alreadyLoaded)
      return
    }

    const loader = new ThemesLoader()
    try {
      const loaded = await loader.loadTheme(value)
      setAvailableThemes(prev => [...prev, loaded])
      setTheme(loaded)
    } catch (error) {
      console.error(`Failed to load remote theme ${value}:`, error)
    }
  }

  const themeId = `${(theme as any).system || 'base16'}-${theme.name}`

  return (
    <ThemeProvider theme={theme} applyStyles applyVariantToRoot applyVariablesToRoot>
      <UnifiedLayout
        frameworkName="Remix"
        components={{
          'framework-switcher': FrameworkSwitcher,
          'theme-switcher': (props) => (
            <ThemeSwitcher
              {...props}
              currentThemeId={themeId}
              availableThemes={availableThemes}
              remoteThemePaths={remoteThemePaths}
              isLoading={isLoadingList}
              error={error}
              onThemeChange={handleThemeChange}
            />
          ),
          'quicky': (props) => <QuickStartCode framework="remix" {...props} />
        }}
      >
        <MainContent />
      </UnifiedLayout>
    </ThemeProvider>
  )
}

export default App
