import { parse } from 'yaml'
import { Base16Theme } from './base16.js'
import { Base24Theme } from './base24.js'
import type { Base16ThemeData, Base24ThemeData } from './types.js'

/**
 * Fetch-like function signature for dependency injection
 */
export type FetchLike = typeof fetch

/**
 * Options for loading themes
 */
export interface LoaderOptions {
    /** Custom fetch implementation (defaults to global fetch) */
    fetch?: FetchLike
    /** Base URL for theme files (defaults to TintedTheming schemes repo) */
    baseUrl?: string
    /** Branch/ref to use (defaults to 'spec-0.11') */
    ref?: string
}

/**
 * Default base URL for theme files
 */
const DEFAULT_BASE_URL = 'https://raw.githubusercontent.com/tinted-theming/schemes'
const DEFAULT_REF = 'spec-0.11'

/**
 * Loader for fetching and parsing Base16/Base24 themes
 */
export class ThemesLoader {
    private readonly fetchFn: FetchLike
    private readonly baseUrl: string
    private readonly ref: string

    constructor(options: LoaderOptions = {}) {
        // Wrap fetch to ensure proper context (fixes "Illegal invocation" in some browsers)
        this.fetchFn = options.fetch ?? ((...args) => fetch(...args))
        this.baseUrl = options.baseUrl ?? DEFAULT_BASE_URL
        this.ref = options.ref ?? DEFAULT_REF
    }

    /**
     * Construct the full URL for a theme file
     * @param path - Relative path to theme file (e.g., 'base16/monokai.yaml')
     */
    private buildUrl(path: string): string {
        return `${this.baseUrl}/${this.ref}/${path}`
    }

    /**
     * Load a single Base16 theme from a YAML file
     * @param path - Relative path to theme file (e.g., 'base16/monokai.yaml')
     * @returns Base16Theme instance
     */
    async loadBase16Theme(path: string): Promise<Base16Theme> {
        const url = this.buildUrl(path)
        const response = await this.fetchFn(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch theme from ${url}: ${response.statusText}`)
        }

        const text = await response.text()
        const data = parse(text) as Base16ThemeData

        if (data.system !== 'base16') {
            throw new Error(`Expected base16 theme but got ${data.system}`)
        }

        return new Base16Theme(data)
    }

    /**
     * Load a single Base24 theme from a YAML file
     * @param path - Relative path to theme file (e.g., 'base24/espresso.yaml')
     * @returns Base24Theme instance
     */
    async loadBase24Theme(path: string): Promise<Base24Theme> {
        const url = this.buildUrl(path)
        const response = await this.fetchFn(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch theme from ${url}: ${response.statusText}`)
        }

        const text = await response.text()
        const data = parse(text) as Base24ThemeData

        if (data.system !== 'base24') {
            throw new Error(`Expected base24 theme but got ${data.system}`)
        }

        return new Base24Theme(data)
    }

    /**
     * Load a theme (auto-detects Base16 or Base24)
     * @param path - Relative path to theme file
     * @returns Base16Theme or Base24Theme instance
     */
    async loadTheme(path: string): Promise<Base16Theme | Base24Theme> {
        const url = this.buildUrl(path)
        const response = await this.fetchFn(url)

        if (!response.ok) {
            throw new Error(`Failed to fetch theme from ${url}: ${response.statusText}`)
        }

        const text = await response.text()
        const data = parse(text) as Base16ThemeData | Base24ThemeData

        if (data.system === 'base16') {
            return new Base16Theme(data as Base16ThemeData)
        } else if (data.system === 'base24') {
            return new Base24Theme(data as Base24ThemeData)
        } else {
            throw new Error(`Unknown theme system: ${(data as any).system}`)
        }
    }

    /**
     * Load multiple themes in parallel
     * @param paths - Array of relative paths to theme files
     * @returns Array of theme instances
     */
    async loadThemes(paths: string[]): Promise<Array<Base16Theme | Base24Theme>> {
        return Promise.all(paths.map((path) => this.loadTheme(path)))
    }

    /**
     * List all themes available in the remote repository
     * @param system - Optional system to filter by ('base16' or 'base24')
     * @returns Array of relative paths to theme files
     */
    async listThemes(system?: 'base16' | 'base24'): Promise<string[]> {
        const systems: Array<'base16' | 'base24'> = system ? [system] : ['base16', 'base24']

        const allPaths = await Promise.all(
            systems.map(async (s) => {
                const url = `https://api.github.com/repos/tinted-theming/schemes/contents/${s}?ref=${this.ref}`
                console.log(`[ThemesLoader] Fetching: ${url}`)
                const response = await this.fetchFn(url)

                if (!response.ok) {
                    console.error(`[ThemesLoader] Failed to fetch ${url}: ${response.status} ${response.statusText}`)
                    throw new Error(`Failed to list ${s} themes: ${response.statusText}`)
                }

                const data = await response.json() as Array<{ name: string; path: string; type: string }>
                const filtered = data
                    .filter((item) => item.type === 'file' && item.name.endsWith('.yaml'))
                    .map((item) => `${s}/${item.name}`)

                console.log(`[ThemesLoader] Found ${filtered.length} themes in ${s}`)
                return filtered
            })
        )

        const result = allPaths.flat()
        console.log(`[ThemesLoader] Total themes found: ${result.length}`)
        return result
    }
}
