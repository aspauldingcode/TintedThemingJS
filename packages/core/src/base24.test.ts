import { describe, it, expect } from 'vitest'
import { Base24Theme } from './base24'
import type { Base24Palette, Base24ThemeData } from './types'

const testPalette: Base24Palette = {
    base00: '#000000', base01: '#111111', base02: '#222222', base03: '#333333',
    base04: '#444444', base05: '#555555', base06: '#666666', base07: '#777777',
    base08: '#888888', base09: '#999999', base0A: '#AAAAAA', base0B: '#BBBBBB',
    base0C: '#CCCCCC', base0D: '#DDDDDD', base0E: '#EEEEEE', base0F: '#FFFFFF',
    base10: '#000010', base11: '#111111', base12: '#222212', base13: '#333313',
    base14: '#444414', base15: '#555515', base16: '#666616', base17: '#777717',
}

const testThemeData: Base24ThemeData = {
    system: 'base24',
    name: 'Test24',
    author: 'Author',
    variant: 'dark',
    palette: testPalette,
}

describe('Base24Theme', () => {
    it('should initialize and return correct colors', () => {
        const theme = new Base24Theme(testThemeData)
        expect(theme.system).toBe('base24')
        expect(theme.colorAt(0)).toBe('#000000')
        expect(theme.colorAt(23)).toBe('#777717')
        expect(theme.allColors).toHaveLength(24)
    })

    it('should convert to base16 theme', () => {
        const theme = new Base24Theme(testThemeData)
        const b16 = theme.asBase16Theme()
        expect(b16.name).toBe('Test24')
        expect(b16.allColors).toHaveLength(16)
        expect(b16.colorAt(15)).toBe('#FFFFFF')
    })
})
