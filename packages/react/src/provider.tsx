import React, { createContext, useContext, useMemo, useEffect } from 'react'
import type { Base16Theme, Base24Theme } from '@tinted-theming/core'

/**
 * Context for providing theme to child components
 */
const ThemeContext = createContext<Base16Theme | Base24Theme | null>(null)

export interface ThemeProviderProps {
    theme: Base16Theme | Base24Theme
    children: React.ReactNode
    /** Apply theme as CSS variables to wrapper div */
    applyStyles?: boolean
    /** CSS variable prefix when applyStyles is true */
    prefix?: string
    /** 
     * Apply the theme variant as a data attribute to the wrapper/root.
     * Useful for Tailwind CSS (e.g. data-variant="dark")
     */
    variantAttribute?: string
    /**
     * If true, applies variantAttribute to document.documentElement instead of the wrapper div.
     * Note: This only happens on the client side.
     */
    applyVariantToRoot?: boolean
    /**
     * If true, applies CSS variables to document.documentElement.
     * Use this if you want base colors available globally (e.g. on body).
     */
    applyVariablesToRoot?: boolean
}

/**
 * Provider component for theme context
 */
export function ThemeProvider({
    theme,
    children,
    applyStyles = false,
    prefix = '--',
    variantAttribute = 'data-variant',
    applyVariantToRoot = false,
    applyVariablesToRoot = false,
}: ThemeProviderProps) {
    const styles = useMemo(() => {
        if (!applyStyles && !applyVariablesToRoot) return undefined
        return theme.toCSSVariables(prefix) as React.CSSProperties
    }, [theme, applyStyles, applyVariablesToRoot, prefix])

    useEffect(() => {
        if (typeof document !== 'undefined') {
            if (applyVariantToRoot) {
                document.documentElement.setAttribute(variantAttribute, theme.variant)
            }

            if (applyVariablesToRoot && styles) {
                const rootStyle = document.documentElement.style
                Object.entries(styles).forEach(([key, value]) => {
                    rootStyle.setProperty(key, value as string)
                })

                // Cleanup function
                return () => {
                    if (applyVariablesToRoot && styles) {
                        Object.keys(styles).forEach((key) => {
                            rootStyle.removeProperty(key)
                        })
                    }
                }
            }
        }
    }, [theme.variant, variantAttribute, applyVariantToRoot, applyVariablesToRoot, styles])

    const containerProps = useMemo(() => {
        if (!applyStyles) return {}
        const props: React.HTMLAttributes<HTMLDivElement> = { style: styles }
        if (!applyVariantToRoot) {
            (props as any)[variantAttribute] = theme.variant
        }
        return props
    }, [applyStyles, styles, applyVariantToRoot, variantAttribute, theme.variant])

    return (
        <ThemeContext.Provider value={theme}>
            {applyStyles ? (
                <div {...containerProps}>
                    {children}
                </div>
            ) : children}
        </ThemeContext.Provider>
    )
}

/**
 * Hook to access the current theme from context
 * @throws Error if used outside ThemeProvider
 * @returns Current theme from context
 * 
 * @example
 * ```tsx
 * function MyComponent() {
 *   const theme = useTheme()
 *   return <div style={{ color: theme.semanticColors.red }}>Red text</div>
 * }
 * ```
 */
export function useTheme(): Base16Theme | Base24Theme {
    const theme = useContext(ThemeContext)
    if (!theme) {
        throw new Error('useTheme must be used within a ThemeProvider')
    }
    return theme
}
