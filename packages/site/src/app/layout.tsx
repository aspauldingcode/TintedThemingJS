'use client'

import { useState, useEffect } from 'react'
import { ThemeProvider, UnifiedLayout, FrameworkSwitcher, ThemeSwitcher } from '@tinted-theming/react'
import {
    defaultDark,
    defaultLight,
    ThemesLoader,
    type Base16Theme,
    type Base24Theme
} from '@tinted-theming/core'
import './globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const [theme, setTheme] = useState<Base16Theme | Base24Theme>(defaultDark)
    const [availableThemes, setAvailableThemes] = useState<(Base16Theme | Base24Theme)[]>([
        defaultDark,
        defaultLight,
    ])
    const [remoteThemePaths, setRemoteThemePaths] = useState<string[]>([])
    const [isLoadingList, setIsLoadingList] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Initial load: fetch some popular themes and the full list of paths
    useEffect(() => {
        const loader = new ThemesLoader()

        // 1. Fetch full list of available theme paths
        loader.listThemes().then(paths => {
            setRemoteThemePaths(paths)
            setIsLoadingList(false)
            setError(null)
        }).catch(err => {
            console.error('Failed to list remote themes:', err)
            setError(err.message || 'Failed to load themes')
            setIsLoadingList(false)
        })

        // 2. Load some initial display themes
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
        // Check if we already have this theme loaded
        const alreadyLoaded = availableThemes.find(t => `${(t as any).system || 'base16'}-${t.name}` === value)

        if (alreadyLoaded) {
            setTheme(alreadyLoaded)
            return
        }

        // Otherwise, it's a remote path that needs to be loaded
        // Format of value for remote is "system/filename.yaml"
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

    // ... (rest of initial load logic)

    return (
        <html lang="en">
            <head>
                <title>TintedTheming JS - Base16 & Base24 Themes</title>
                <meta name="description" content="TypeScript/JavaScript API for Base16 and Base24 color themes" />
            </head>
            <body>
                <ThemeProvider theme={theme} applyStyles applyVariantToRoot applyVariablesToRoot>
                    <UnifiedLayout
                        frameworkName="Next.js"
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
                            )
                        }}
                    >
                        {children}
                    </UnifiedLayout>
                </ThemeProvider>
            </body>
        </html>
    )
}
