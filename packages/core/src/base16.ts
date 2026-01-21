import type {
    Base16Palette,
    Base16ThemeData,
    SemanticColors,
    ThemeVariant,
} from './types.js'

/**
 * Base16 Theme class providing access to colors and metadata
 */
export class Base16Theme {
    readonly system = 'base16'
    readonly name: string
    readonly author?: string
    readonly variant: ThemeVariant
    readonly palette: Base16Palette

    constructor(data: Base16ThemeData) {
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
     * Get color by index (0-15)
     * @param index - Color index (0-15)
     * @returns Hex color string or undefined if index is out of range
     */
    colorAt(index: number): string | undefined {
        if (index < 0 || index > 15) {
            return undefined
        }
        const key = `base${index.toString(16).toUpperCase().padStart(2, '0')}` as keyof Base16Palette
        return this.palette[key]
    }

    /**
     * Get all colors as an array [base00, base01, ..., base0F]
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
        ]
    }

    /**
     * Get semantic color mappings for common use cases
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
    toJSON(): Base16ThemeData {
        return {
            system: 'base16',
            name: this.name,
            author: this.author,
            variant: this.variant,
            palette: this.palette,
        }
    }
}
