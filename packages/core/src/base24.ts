import type {
    Base24Palette,
    Base24ThemeData,
    SemanticColors,
    ThemeVariant,
} from './types.js'
import { Base16Theme } from './base16.js'
import type { Base16ThemeData } from './types.js'

/**
 * Base24 Theme class providing access to 24 colors and metadata
 */
export class Base24Theme {
    readonly name: string
    readonly author?: string
    readonly variant: ThemeVariant
    readonly palette: Base24Palette

    constructor(data: Base24ThemeData) {
        this.name = data.name
        this.author = data.author
        this.variant = data.variant
        this.palette = data.palette
    }

    /**
     * Check if this is a dark theme
     */
    get isDark(): boolean {
        return this.variant === 'dark'
    }

    /**
     * Check if this is a light theme
     */
    get isLight(): boolean {
        return this.variant === 'light'
    }

    /**
     * Get color by index (0-23)
     * @param index - Color index (0-23)
     * @returns Hex color string or undefined if index is out of range
     */
    colorAt(index: number): string | undefined {
        if (index < 0 || index > 23) {
            return undefined
        }
        const hex = index.toString(16).toUpperCase()
        const key = `base${hex.length === 1 ? '0' + hex : hex}` as keyof Base24Palette
        return this.palette[key]
    }

    /**
     * Get all colors as an array [base00, base01, ..., base17]
     */
    get allColors(): string[] {
        return [
            this.palette.base00,
            this.palette.base01,
            this.palette.base02,
            this.palette.base03,
            this.palette.base04,
            this.palette.base05,
            this.palette.base06,
            this.palette.base07,
            this.palette.base08,
            this.palette.base09,
            this.palette.base0A,
            this.palette.base0B,
            this.palette.base0C,
            this.palette.base0D,
            this.palette.base0E,
            this.palette.base0F,
            this.palette.base10,
            this.palette.base11,
            this.palette.base12,
            this.palette.base13,
            this.palette.base14,
            this.palette.base15,
            this.palette.base16,
            this.palette.base17,
        ]
    }

    /**
     * Get semantic color mappings (same as Base16)
     */
    get semanticColors(): SemanticColors {
        return {
            background: this.palette.base00,
            foreground: this.palette.base05,
            red: this.palette.base08,
            orange: this.palette.base09,
            yellow: this.palette.base0A,
            green: this.palette.base0B,
            cyan: this.palette.base0C,
            blue: this.palette.base0D,
            purple: this.palette.base0E,
            brown: this.palette.base0F,
        }
    }

    /**
     * Convert to Base16 theme (drops base10-base17)
     */
    asBase16Theme(): Base16Theme {
        const base16Data: Base16ThemeData = {
            system: 'base16',
            name: this.name,
            author: this.author,
            variant: this.variant,
            palette: {
                base00: this.palette.base00,
                base01: this.palette.base01,
                base02: this.palette.base02,
                base03: this.palette.base03,
                base04: this.palette.base04,
                base05: this.palette.base05,
                base06: this.palette.base06,
                base07: this.palette.base07,
                base08: this.palette.base08,
                base09: this.palette.base09,
                base0A: this.palette.base0A,
                base0B: this.palette.base0B,
                base0C: this.palette.base0C,
                base0D: this.palette.base0D,
                base0E: this.palette.base0E,
                base0F: this.palette.base0F,
            },
        }
        return new Base16Theme(base16Data)
    }

    /**
     * Convert theme palette to CSS custom properties
     * @param prefix - Optional prefix for CSS variables (default: '--')
     * @returns Object with CSS variable names as keys and colors as values
     */
    toCSSVariables(prefix = '--'): Record<string, string> {
        const vars: Record<string, string> = {}
        for (const [key, value] of Object.entries(this.palette)) {
            vars[`${prefix}${key}`] = value
        }
        return vars
    }

    /**
     * Convert theme to JSON-serializable object
     */
    toJSON(): Base24ThemeData {
        return {
            system: 'base24',
            name: this.name,
            author: this.author,
            variant: this.variant,
            palette: this.palette,
        }
    }
}
