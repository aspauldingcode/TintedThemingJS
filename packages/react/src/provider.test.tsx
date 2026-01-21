import React from 'react'
import { render, screen } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import { ThemeProvider, useTheme } from './provider'
import { Base16Theme } from '@tinted-theming/core'

const testTheme = new Base16Theme({
    system: 'base16',
    name: 'Test',
    author: 'Author',
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
})

const TestComponent = () => {
    const theme = useTheme()
    return <div data-testid="theme-name">{theme.name}</div>
}

describe('ThemeProvider', () => {
    it('should provide theme to children', () => {
        render(
            <ThemeProvider theme={testTheme}>
                <TestComponent />
            </ThemeProvider>
        )
        expect(screen.getByTestId('theme-name')).toHaveTextContent('Test')
    })

    it('should apply CSS variables when applyStyles is true', () => {
        const { container } = render(
            <ThemeProvider theme={testTheme} applyStyles>
                <div>Content</div>
            </ThemeProvider>
        )
        const div = container.firstChild as HTMLElement
        expect(div.style.getPropertyValue('--base00')).toBe('#000000')
    })

    it('should throw error when used outside provider', () => {
        // Suppress console.error for this test as it's expected
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => { })
        expect(() => render(<TestComponent />)).toThrow('useTheme must be used within a ThemeProvider')
        consoleSpy.mockRestore()
    })

    it('should inject styles to root when applyVariablesToRoot is true', () => {
        const { unmount } = render(
            <ThemeProvider theme={testTheme} applyVariablesToRoot>
                <div>child</div>
            </ThemeProvider>
        )

        expect(document.documentElement.style.getPropertyValue('--base00')).toBe('#000000')
        expect(document.documentElement.style.getPropertyValue('--base0F')).toBe('#FFFFFF')

        unmount()

        expect(document.documentElement.style.getPropertyValue('--base00')).toBe('')
        expect(document.documentElement.style.getPropertyValue('--base0F')).toBe('')
    })
})
