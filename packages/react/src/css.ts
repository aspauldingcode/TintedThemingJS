import type { Base16Theme, Base24Theme } from '@tinted-theming/core'

/**
 * Convert a Base16 theme to CSS custom properties
 * @param theme - Base16 or Base24 theme
 * @param prefix - CSS variable prefix (default: '--')
 * @returns Object with CSS variable names as keys
 */
export function themeToCSSVariables(
    theme: Base16Theme | Base24Theme,
    prefix = '--'
): Record<string, string> {
    return theme.toCSSVariables(prefix)
}

/**
 * Apply theme as inline styles for React components
 * @param theme - Base16 or Base24 theme
 * @param prefix - CSS variable prefix (default: '--')
 * @returns Style object for React inline styles
 * 
 * @example
 * ```tsx
 * <div style={themeToInlineStyles(myTheme)}>
 *   <p style={{ color: 'var(--base08)' }}>Red text</p>
 * </div>
 * ```
 */
export function themeToInlineStyles(
    theme: Base16Theme | Base24Theme,
    prefix = '--'
): React.CSSProperties {
    return themeToCSSVariables(theme, prefix) as React.CSSProperties
}

/**
 * Generate CSS string from theme
 * @param theme - Base16 or Base24 theme
 * @param selector - CSS selector (default: ':root')
 * @param prefix - CSS variable prefix (default: '--')
 * @returns CSS string
 * 
 * @example
 * ```tsx
 * const css = themeToCSSString(myTheme, '.themed')
 * // .themed { --base00: #181818; --base01: #282828; ... }
 * ```
 */
export function themeToCSSString(
    theme: Base16Theme | Base24Theme,
    selector = ':root',
    prefix = '--'
): string {
    const vars = themeToCSSVariables(theme, prefix)
    const declarations = Object.entries(vars)
        .map(([key, value]) => `  ${key}: ${value};`)
        .join('\n')
    return `${selector} {\n${declarations}\n}`
}
