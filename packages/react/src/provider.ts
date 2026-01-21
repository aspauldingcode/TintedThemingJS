import React, { createContext, useContext, useMemo } from 'react'
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
}

/**
 * Provider component for theme context
 * 
 * @example
 * ```tsx
 * import { ThemeProvider } from '@tinted-theming/react'
 * import { defaultDark } from '@tinted-theming/core'
 * 
 * function App() {
 *   return (
 *     <ThemeProvider theme={defaultDark} applyStyles>
 *       <YourApp />
 *     </ThemeProvider>
 *   )
 * }
 * ```
 */
export function ThemeProvider({
    theme,
    children,
    applyStyles = false,
    prefix = '--',
}: ThemeProviderProps) {
    const styles = useMemo(() => {
        if (!applyStyles) return undefined
        return theme.toCSSVariables(prefix) as React.CSSProperties
    }, [theme, applyStyles, prefix])

    return (
        <ThemeContext.Provider value= { theme } >
        { applyStyles?<div style = { styles }>{ children }</div> : children
}
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
