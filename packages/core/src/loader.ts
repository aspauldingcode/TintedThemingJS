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
        this.fetchFn = options.fetch ?? fetch
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
}
