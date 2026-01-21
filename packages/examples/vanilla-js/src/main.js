import {
    ThemeManager,
    defaultDark,
    defaultLight,
    ThemesLoader
} from '@tinted-theming/core'

import {
    DEFAULT_BLUEPRINT,
    BlueprintParser,
    BlueprintDomRenderer
} from './local-core'

async function init() {
    // 1. Theme Setup
    const themeManager = new ThemeManager(defaultDark)
    themeManager.applyTo(document.body)
    const loader = new ThemesLoader()

    // State
    let availableThemes = [defaultDark, defaultLight]
    let remoteThemePaths = []
    let isLoadingList = true

    // 2. Blueprint Setup
    const parser = new BlueprintParser()
    const layoutDef = parser.parse(DEFAULT_BLUEPRINT)

    // Helper to render the whole app
    function renderApp() {
        const components = {
            'framework-switcher': () => {
                const select = document.createElement('select')
                Object.assign(select.style, {
                    padding: '0.4rem 0.8rem',
                    backgroundColor: 'var(--base01)',
                    color: 'var(--base05)',
                    border: '1px solid var(--base02)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    textAlign: 'center',
                    cursor: 'pointer'
                })

                const opts = [
                    { val: '/nextjs', label: 'Next.js' },
                    { val: '/remix', label: 'Remix' },
                    { val: '/vite', label: 'Vite + React' },
                    { val: '/vanilla-js', label: 'Vanilla JS' },
                    { val: '/vanilla-ts', label: 'Vanilla TS' }
                ]

                opts.forEach(o => {
                    const opt = document.createElement('option')
                    opt.value = o.val
                    opt.textContent = o.label
                    if (window.location.pathname.includes(o.val.replace(/^\//, ''))) opt.selected = true
                    select.appendChild(opt)
                })

                select.addEventListener('change', (e) => {
                    // Navigate to sister directories
                    // Assumes structure is /example-name/
                    const target = e.target.value
                    if (target.includes('vanilla')) {
                        window.location.href = target + '/'
                    } else {
                        // Just log for other framework demos if not deployed at root
                        console.log('Navigate to:', target)
                    }
                })
                return select
            },
            'theme-switcher': () => {
                const select = document.createElement('select')
                Object.assign(select.style, {
                    padding: '0.4rem 0.8rem',
                    backgroundColor: 'var(--base01)',
                    color: 'var(--base05)',
                    border: '1px solid var(--base02)',
                    borderRadius: '4px',
                    fontSize: '0.9rem',
                    maxWidth: '200px',
                    cursor: 'pointer'
                })

                // Default Group
                const defaultGroup = document.createElement('optgroup')
                defaultGroup.label = 'Loaded Themes'

                availableThemes.forEach(t => {
                    const opt = document.createElement('option')
                    const themeId = `${t.system || 'base16'}-${t.name}`
                    opt.value = themeId // Use ID for loaded themes
                    opt.textContent = t.name

                    const currentId = `${themeManager.theme.system || 'base16'}-${themeManager.theme.name}`
                    if (themeId === currentId) opt.selected = true
                    defaultGroup.appendChild(opt)
                })
                select.appendChild(defaultGroup)

                // Remote Group
                if (remoteThemePaths.length > 0) {
                    const remoteGroup = document.createElement('optgroup')
                    remoteGroup.label = 'Remote Themes'

                    const existingIds = new Set(availableThemes.map(t => `${t.system || 'base16'}-${t.name}`))

                    remoteThemePaths.forEach(path => {
                        const parts = path.split('/')
                        const name = parts[1].replace('.yaml', '')
                        const id = `${parts[0]}-${name}`

                        if (!existingIds.has(id)) {
                            const opt = document.createElement('option')
                            opt.value = path // Use path for remote
                            opt.textContent = name
                            remoteGroup.appendChild(opt)
                        }
                    })
                    select.appendChild(remoteGroup)
                } else if (isLoadingList) {
                    const loading = document.createElement('option')
                    loading.text = 'Loading themes...'
                    loading.disabled = true
                    select.appendChild(loading)
                }

                select.addEventListener('change', async (e) => {
                    const val = e.target.value

                    // Check if loaded
                    const alreadyLoaded = availableThemes.find(t => `${t.system || 'base16'}-${t.name}` === val)

                    if (alreadyLoaded) {
                        themeManager.setTheme(alreadyLoaded)
                        themeManager.applyTo(document.body)
                        renderApp()
                    } else {
                        // Load remote
                        try {
                            e.target.disabled = true
                            const originalText = e.target.options[e.target.selectedIndex].text
                            e.target.options[e.target.selectedIndex].text = 'Loading...'

                            const loaded = await loader.loadTheme(val)
                            availableThemes.push(loaded)
                            themeManager.setTheme(loaded)
                            themeManager.applyTo(document.body)
                            renderApp()
                        } catch (err) {
                            console.error(err)
                            alert('Failed to load theme')
                            e.target.disabled = false
                            renderApp() // Reset UI
                        }
                    }
                })
                return select
            },
            'mobile-menu-toggle': () => {
                const btn = document.createElement('button')
                btn.textContent = '☰'
                Object.assign(btn.style, {
                    background: 'none', border: 'none', color: 'var(--base05)', fontSize: '1.5rem', cursor: 'pointer', padding: '0 0.5rem'
                })
                return btn
            }
        }

        const renderer = new BlueprintDomRenderer(layoutDef, components, 'Vanilla JS')
        const app = document.getElementById('app')
        renderer.render(app)

        const main = app.querySelector('main')
        if (main) {
            const container = document.createElement('div')
            container.className = 'dynamic-content'
            Object.assign(container.style, { padding: '3rem 2rem', maxWidth: '1200px', margin: '0 auto' })
            main.appendChild(container)
            renderMainContent(container, themeManager.theme)
        }
    }

    // Initial render
    renderApp()
    themeManager.applyTo(document.body) // Ensure body gets vars

    // Fetch themes
    loader.listThemes().then(paths => {
        remoteThemePaths = paths
        isLoadingList = false
        renderApp()
    }).catch(err => console.error('Failed to list themes', err))

    // Preload
    const popular = ['base16/monokai.yaml', 'base16/dracula.yaml', 'base16/nord.yaml']
    Promise.all(popular.map(p => loader.loadTheme(p).catch(e => null))).then(loaded => {
        const valid = loaded.filter(t => t)
        if (valid.length > 0) {
            const newThemes = valid.filter(vt => !availableThemes.some(at => at.name === vt.name))
            availableThemes.push(...newThemes)
            renderApp()
        }
    })
}

/**
 * Highlights simple JS code with HTML spans
 */
function highlightCode(code) {
    // Basic syntax highlighting
    return code
        // Keywords
        .replace(/\b(import|from|const|let|var|new|class|function|return|if|else|for|while|async|await)\b/g, '<span style="color: var(--base0E)">$1</span>')
        // Booleans/Null
        .replace(/\b(true|false|null|undefined)\b/g, '<span style="color: var(--base09)">$1</span>')
        // Strings (single quotes)
        .replace(/'([^']*)'/g, '<span style="color: var(--base0B)">\'$1\'</span>')
        // Methods/Functions (naive)
        .replace(/\b(\w+)\(/g, '<span style="color: var(--base0D)">$1</span>(')
        // Numbers
        .replace(/\b(\d+)\b/g, '<span style="color: var(--base09)">$1</span>')
        // Comments
        .replace(/(\/\/.*)/g, '<span style="color: var(--base03)">$1</span>')
}

function renderMainContent(container, theme) {
    if (!container) return
    container.innerHTML = ''

    // --- Hero Section ---
    const heroSection = document.createElement('section')
    Object.assign(heroSection.style, { marginBottom: '4rem', textAlign: 'center' })
    heroSection.innerHTML = `
        <h1 style="
            font-size: 3rem;
            font-weight: 700;
            margin-bottom: 1rem;
            background: linear-gradient(135deg, var(--base0D), var(--base0E));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        ">
            TintedTheming JS (Vanilla)
        </h1>
        <p style="
            font-size: 1.25rem;
            color: var(--base04);
            margin-bottom: 2rem;
        ">
            TypeScript/JavaScript API for Base16 and Base24 color themes
        </p>
        <div style="display: flex; gap: 1rem; justify-content: center; flex-wrap: wrap;">
            <a href="https://github.com/tinted-theming/schemes" target="_blank" rel="noopener noreferrer" style="
                padding: 0.75rem 1.5rem;
                background-color: var(--base0D);
                color: var(--base00);
                border-radius: 6px;
                font-weight: 600;
                text-decoration: none;
                transition: transform 0.2s;
            ">View Schemes →</a>
            <a href="https://github.com/aspauldingcode/TintedThemingJS" target="_blank" rel="noopener noreferrer" style="
                padding: 0.75rem 1.5rem;
                background-color: var(--base02);
                color: var(--base05);
                border-radius: 6px;
                font-weight: 600;
                text-decoration: none;
            ">GitHub</a>
        </div>
    `
    container.appendChild(heroSection)

    // --- Current Theme Info ---
    const themeInfoSection = document.createElement('section')
    Object.assign(themeInfoSection.style, {
        marginBottom: '3rem',
        padding: '2rem',
        backgroundColor: 'var(--base01)',
        borderRadius: '8px',
        border: '1px solid var(--base02)',
    })

    const isDark = theme.variant === 'dark'
    const variantColor = isDark ? 'var(--base0E)' : 'var(--base0A)'

    themeInfoSection.innerHTML = `
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--base0D);">
            Current Theme
        </h2>
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1rem;">
            <div>
                <strong style="color: var(--base04);">Name:</strong>
                <span style="color: var(--base05); margin-left: 0.5rem;">${theme.name}</span>
            </div>
            <div>
                <strong style="color: var(--base04);">Author:</strong>
                <span style="color: var(--base05); margin-left: 0.5rem;">${theme.author || 'Unknown'}</span>
            </div>
            <div>
                <strong style="color: var(--base04);">Variant:</strong>
                <span style="
                    color: ${variantColor};
                    text-transform: uppercase;
                    font-weight: 600;
                    margin-left: 0.5rem;
                ">${theme.variant}</span>
            </div>
            <div>
                <strong style="color: var(--base04);">DOM Attr:</strong>
                <code style="font-size: 0.8rem; margin-left: 0.5rem;">data-variant="${theme.variant}"</code>
            </div>
        </div>
    `
    container.appendChild(themeInfoSection)

    // --- Color Palette ---
    const paletteSection = document.createElement('section')
    paletteSection.style.marginBottom = '3rem'

    const paletteHeader = document.createElement('h2')
    const systemName = theme.system || 'base16'
    paletteHeader.textContent = `${systemName.toUpperCase()} Color Palette`
    Object.assign(paletteHeader.style, {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: 'var(--base0D)'
    })
    paletteSection.appendChild(paletteHeader)

    const paletteGrid = document.createElement('div')
    Object.assign(paletteGrid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
        gap: '1rem'
    })

    const paletteEntries = Object.entries(theme.palette).sort()

    paletteEntries.forEach(([key, color]) => {
        const card = document.createElement('div')
        Object.assign(card.style, {
            backgroundColor: color,
            padding: '3rem 1rem 1rem',
            borderRadius: '6px',
            border: '1px solid var(--base02)',
            position: 'relative',
            cursor: 'pointer',
            overflow: 'hidden'
        })

        // Tooltip logic could be added here
        card.title = `Click to copy ${color}`
        card.onclick = () => {
            navigator.clipboard.writeText(color)
        }

        const label = document.createElement('div')
        Object.assign(label.style, {
            backgroundColor: isDark ? 'rgba(255,255,255,0.9)' : 'rgba(0,0,0,0.8)',
            color: isDark ? '#000' : '#fff',
            padding: '0.5rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: '600'
        })
        label.innerHTML = `
            <div>${key}</div>
            <div style="font-size: 0.7rem; opacity: 0.8;">${color}</div>
        `
        card.appendChild(label)
        paletteGrid.appendChild(card)
    })

    paletteSection.appendChild(paletteGrid)
    container.appendChild(paletteSection)

    // --- Semantic Colors ---
    const semanticSection = document.createElement('section')
    semanticSection.style.marginBottom = '3rem'

    const semanticHeader = document.createElement('h2')
    semanticHeader.textContent = 'Semantic Colors'
    Object.assign(semanticHeader.style, {
        fontSize: '1.5rem',
        marginBottom: '1.5rem',
        color: 'var(--base0D)'
    })
    semanticSection.appendChild(semanticHeader)

    const semanticGrid = document.createElement('div')
    Object.assign(semanticGrid.style, {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
        gap: '1rem'
    })

    // Robust semantic access:
    let semanticsToRender = {}
    if (theme.semanticColors) {
        semanticsToRender = theme.semanticColors
    } else if (theme.palette) {
        // Fallback reconstruction if getter is missing
        semanticsToRender = {
            background: theme.palette.base00,
            foreground: theme.palette.base05,
            red: theme.palette.base08,
            orange: theme.palette.base09,
            yellow: theme.palette.base0A,
            green: theme.palette.base0B,
            cyan: theme.palette.base0C,
            blue: theme.palette.base0D,
            purple: theme.palette.base0E,
            brown: theme.palette.base0F
        }
    }

    Object.entries(semanticsToRender).forEach(([name, color]) => {
        const item = document.createElement('div')
        Object.assign(item.style, {
            backgroundColor: 'var(--base01)',
            padding: '1rem',
            borderRadius: '6px',
            border: '1px solid var(--base02)',
            textAlign: 'center',
        })

        item.innerHTML = `
            <div style="
                width: 60px;
                height: 60px;
                background-color: ${color};
                margin: 0 auto 0.5rem;
                border-radius: 50%;
                border: 2px solid var(--base02);
            "></div>
            <div style="
                font-size: 0.85rem;
                font-weight: 600;
                color: var(--base05);
                text-transform: capitalize;
            ">${name}</div>
            <div style="
                font-size: 0.7rem;
                color: var(--base04);
                margin-top: 0.25rem;
            ">${color}</div>
        `
        semanticGrid.appendChild(item)
    })

    semanticSection.appendChild(semanticGrid)
    container.appendChild(semanticSection)

    // --- Quick Start ---
    const quickStartSection = document.createElement('section')
    Object.assign(quickStartSection.style, {
        padding: '2rem',
        backgroundColor: 'var(--base01)',
        borderRadius: '8px',
        border: '1px solid var(--base02)',
    })

    // Code to highlight
    const codeExample = `import { ThemeManager, defaultDark } from '@tinted-theming/core'

const manager = new ThemeManager(defaultDark)
manager.applyTo(document.body)`

    const highlighted = highlightCode(codeExample)

    quickStartSection.innerHTML = `
        <h2 style="font-size: 1.5rem; margin-bottom: 1rem; color: var(--base0D);">
            Quick Start
        </h2>
        <div style="position: relative;">
            <button onclick="navigator.clipboard.writeText(this.nextElementSibling.innerText); this.innerText = 'Copied!'; setTimeout(() => this.innerText = 'Copy', 2000);" style="
                position: absolute;
                top: 0.5rem;
                right: 0.5rem;
                padding: 0.25rem 0.5rem;
                background-color: var(--base02);
                color: var(--base05);
                border: none;
                border-radius: 4px;
                font-size: 0.75rem;
                cursor: pointer;
                transition: background-color 0.2s;
            ">Copy</button>
            <pre style="
                background-color: var(--base00);
                padding: 1rem;
                border-radius: 6px;
                overflow: auto;
                border: 1px solid var(--base02);
                font-family: monospace;
                font-size: 0.9rem;
            "><code style="color: var(--base05);">${highlighted}</code></pre>
        </div>
    `
    container.appendChild(quickStartSection)
}

init()
