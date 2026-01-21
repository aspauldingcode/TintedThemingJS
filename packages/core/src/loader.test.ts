import { describe, it, expect, vi } from 'vitest'
import { ThemesLoader } from './loader.js'
import { Base16Theme } from './base16.js'

describe('ThemesLoader', () => {
    it('should load a base16 theme', async () => {
        const mockYaml = `
system: base16
name: Monokai
author: Wimer Hazenberg
variant: dark
palette:
  base00: "#272822"
  base01: "#383830"
  base02: "#49483e"
  base03: "#75715e"
  base04: "#a59f85"
  base05: "#f8f8f2"
  base06: "#f5f4f1"
  base07: "#f9f8f5"
  base08: "#f92672"
  base09: "#fd971f"
  base0A: "#f4bf75"
  base0B: "#a6e22e"
  base0C: "#a1efe4"
  base0D: "#66d9ef"
  base0E: "#ae81ff"
  base0F: "#cc6633"
`
        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            text: () => Promise.resolve(mockYaml),
        })

        const loader = new ThemesLoader({ fetch: mockFetch as any })
        const theme = await loader.loadBase16Theme('base16/monokai.yaml')

        expect(theme).toBeInstanceOf(Base16Theme)
        expect(theme.name).toBe('Monokai')
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('base16/monokai.yaml'))
    })

    it('should throw error on failed fetch', async () => {
        const mockFetch = vi.fn().mockResolvedValue({
            ok: false,
            statusText: 'Not Found',
        })

        const loader = new ThemesLoader({ fetch: mockFetch as any })
        await expect(loader.loadBase16Theme('invalid.yaml')).rejects.toThrow('Failed to fetch')
    })

    it('should list themes correctly', async () => {
        const mockResponse = [
            { name: 'monokai.yaml', path: 'base16/monokai.yaml', type: 'file' },
            { name: 'invalid.txt', path: 'base16/invalid.txt', type: 'file' },
            { name: 'subdir', path: 'base16/subdir', type: 'dir' },
        ]

        const mockFetch = vi.fn().mockResolvedValue({
            ok: true,
            json: () => Promise.resolve(mockResponse),
        })

        const loader = new ThemesLoader({ fetch: mockFetch as any })
        const themes = await loader.listThemes('base16')

        expect(themes).toEqual(['base16/monokai.yaml'])
        expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('api.github.com/repos/tinted-theming/schemes/contents/base16'))
    })
})
