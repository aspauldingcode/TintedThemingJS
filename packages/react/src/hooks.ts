import { useMemo } from 'react'
import type { Base16Theme, Base24Theme } from '@tinted-theming/core'

/**
 * Hook to use a Base16 theme in React components
 * @param theme - Base16Theme instance
 * @returns Theme data with palette and semantic colors
 */
export function useBase16Theme(theme: Base16Theme) {
    return useMemo(
        () => ({
            name: theme.name,
            variant: theme.variant,
            isDark: theme.isDark,
            isLight: theme.isLight,
            palette: theme.palette,
            semantic: theme.semanticColors,
            allColors: theme.allColors,
        }),
        [theme]
    )
}

/**
 * Hook to use a Base24 theme in React components
 * @param theme - Base24Theme instance
 * @returns Theme data with palette and semantic colors
 */
export function useBase24Theme(theme: Base24Theme) {
    return useMemo(
        () => ({
            name: theme.name,
            variant: theme.variant,
            isDark: theme.isDark,
            isLight: theme.isLight,
            palette: theme.palette,
            semantic: theme.semanticColors,
            allColors: theme.allColors,
        }),
        [theme]
    )
}
