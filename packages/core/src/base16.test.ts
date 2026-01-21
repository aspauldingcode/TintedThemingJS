import { describe, it, expect } from 'vitest'
import { Base16Theme } from './base16.js'
import type { Base16ThemeData } from './types.js'

const testThemeData: Base16ThemeData = {
    system: 'base16',
    name: 'Test Theme',
    author: 'Test Author',
    variant: 'dark',
    palette: {
        base00: '#000000',
        base01: '#111111',
        base02: '#222222',
        base03: '#333333',
        base04: '#444444',
        base05: '#555555',
        base06: '#666666',
        base07: '#777777',
        base08: '#888888',
        base09: '#999999',
        base0A: '#AAAAAA',
        base0B: '#BBBBBB',
        base0C: '#CCCCCC',
        base0D: '#DDDDDD',
        base0E: '#EEEEEE',
        base0F: '#FFFFFF',
    },
}

describe('Base16Theme', () => {
    it('should initialize with correct data', () => {
        const theme = new Base16Theme(testThemeData)
        expect(theme.system).toBe('base16')
        expect(theme.name).toBe('Test Theme')
        expect(theme.author).toBe('Test Author')
        expect(theme.variant).toBe('dark')
    })

    it('should correctly identify dark/light variants', () => {
        const darkTheme = new Base16Theme(testThemeData)
        const lightTheme = new Base16Theme({ ...testThemeData, variant: 'light' })

        expect(darkTheme.isDark).toBe(true)
        expect(darkTheme.isLight).toBe(false)
        expect(lightTheme.isDark).toBe(false)
        expect(lightTheme.isLight).toBe(true)
    })

    it('should return correct color at index', () => {
        const theme = new Base16Theme(testThemeData)
        expect(theme.colorAt(0)).toBe('#000000')
        expect(theme.colorAt(15)).toBe('#FFFFFF')
        expect(theme.colorAt(16)).toBeUndefined()
    })

    it('should return all colors as array', () => {
        const theme = new Base16Theme(testThemeData)
        const colors = theme.allColors
        expect(colors).toHaveLength(16)
        expect(colors[0]).toBe('#000000')
        expect(colors[15]).toBe('#FFFFFF')
    })

    it('should return semantic colors', () => {
        const theme = new Base16Theme(testThemeData)
        const semantic = theme.semanticColors
        expect(semantic.background).toBe('#000000')
        expect(semantic.foreground).toBe('#555555')
        expect(semantic.red).toBe('#888888')
    })

    it('should convert to CSS variables', () => {
        const theme = new Base16Theme(testThemeData)
        const vars = theme.toCSSVariables()
        expect(vars['--base00']).toBe('#000000')
        expect(vars['--base0F']).toBe('#FFFFFF')

        const customVars = theme.toCSSVariables('color-')
        expect(customVars['color-base00']).toBe('#000000')
    })
})
