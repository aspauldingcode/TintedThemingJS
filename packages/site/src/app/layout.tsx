'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider } from '@tinted-theming/react'
import {
    defaultDark,
    defaultLight,
    ThemesLoader,
    type Base16Theme
} from '@tinted-theming/core'
import './globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [theme, setTheme] = useState<Base16Theme>(defaultDark)
    const [availableThemes, setAvailableThemes] = useState<Base16Theme[]>([
        defaultDark,
        defaultLight,
    ])

    // Load more themes from GitHub
    useEffect(() => {
        const loader = new ThemesLoader()
        const themePaths = [
            'base16/monokai.yaml',
            'base16/solarized-dark.yaml',
            'base16/solarized-light.yaml',
            'base16/nord.yaml',
            'base16/dracula.yaml',
            'base16/gruvbox-dark-hard.yaml',
            'base16/tokyo-night-dark.yaml',
        ]

        Promise.all(
            themePaths.map(async (path) => {
                try {
                    return await loader.loadBase16Theme(path)
                } catch (error) {
                    console.error(`Failed to load ${path}:`, error)
                    return null
                }
            })
        ).then((loadedThemes) => {
            const validThemes = loadedThemes.filter((t): t is Base16Theme => t !== null)
            setAvailableThemes((prev) => [...prev, ...validThemes])
        })
    }, [])

    return (
        <html lang="en">
            <head>
                <title>TintedTheming JS - Base16 & Base24 Themes</title>
                <meta name="description" content="TypeScript/JavaScript API for Base16 and Base24 color themes" />
            </head>
            <body>
                <ThemeProvider theme={theme} applyStyles>
                    <nav style={{
                        padding: '1.5rem 2rem',
                        borderBottom: '1px solid var(--base02)',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '1rem',
                        flexWrap: 'wrap',
                    }}>
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>
                            🎨 TintedTheming JS
                        </h1>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
                            <label htmlFor="theme-select" style={{ fontSize: '0.9rem', color: 'var(--base04)' }}>
                                Theme:
                            </label>
                            <select
                                id="theme-select"
                                value={theme.name}
                                onChange={(e) => {
                                    const selected = availableThemes.find(t => t.name === e.target.value)
                                    if (selected) setTheme(selected)
                                }}
                                style={{
                                    padding: '0.5rem 1rem',
                                    backgroundColor: 'var(--base01)',
                                    color: 'var(--base05)',
                                    border: '1px solid var(--base02)',
                                    borderRadius: '4px',
                                    fontSize: '0.9rem',
                                }}
                            >
                                {availableThemes.map((t) => (
                                    <option key={t.name} value={t.name}>
                                        {t.name} ({t.variant})
                                    </option>
                                ))}
                            </select>
                        </div>
                    </nav>
                    {children}
                </ThemeProvider>
            </body>
        </html>
    )
}
