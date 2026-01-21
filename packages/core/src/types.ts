/**
 * Base16 color palette with 16 standardized colors
 */
export type Base16Palette = {
    base00: string // Default Background
    base01: string // Lighter Background
    base02: string // Selection Background
    base03: string // Comments, Invisibles
    base04: string // Dark Foreground
    base05: string // Default Foreground
    base06: string // Light Foreground
    base07: string // Light Background
    base08: string // Red
    base09: string // Orange
    base0A: string // Yellow
    base0B: string // Green
    base0C: string // Cyan
    base0D: string // Blue
    base0E: string // Purple
    base0F: string // Brown
}

/**
 * Base24 color palette extends Base16 with 8 additional colors
 */
export type Base24Palette = Base16Palette & {
    base10: string
    base11: string
    base12: string
    base13: string
    base14: string
    base15: string
    base16: string
    base17: string
}

/**
 * Theme variant: dark or light
 */
export type ThemeVariant = 'dark' | 'light'

/**
 * Base16 theme data structure as parsed from YAML
 */
export interface Base16ThemeData {
    system: 'base16'
    name: string
    author?: string
    variant: ThemeVariant
    palette: Base16Palette
}

/**
 * Base24 theme data structure as parsed from YAML
 */
export interface Base24ThemeData {
    system: 'base24'
    name: string
    author?: string
    variant: ThemeVariant
    palette: Base24Palette
}

/**
 * Semantic color names mapped to Base16 palette positions
 */
export interface SemanticColors {
    background: string
    foreground: string
    red: string
    orange: string
    yellow: string
    green: string
    cyan: string
    blue: string
    purple: string
    brown: string
}
