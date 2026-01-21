
import type { Base16Theme } from './base16.js'
import type { Base24Theme } from './base24.js'

export class ThemeManager {
    private theme: Base16Theme | Base24Theme

    constructor(initialTheme: Base16Theme | Base24Theme) {
        this.theme = initialTheme
    }

    setTheme(theme: Base16Theme | Base24Theme) {
        this.theme = theme
    }

    getTheme(): Base16Theme | Base24Theme {
        return this.theme
    }

    applyTo(target: HTMLElement) {
        // Apply variant attribute
        target.setAttribute('data-variant', this.theme.variant)

        // Apply CSS variables
        const styles = this.theme.toCSSVariables('--')
        for (const [key, value] of Object.entries(styles)) {
            target.style.setProperty(key, value)
        }
    }
}
