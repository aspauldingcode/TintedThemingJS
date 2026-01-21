
import type { LayoutDefinition, BlueprintNode, BlueprintGrid, BlueprintColumn } from './parser.js'

export type ComponentRenderer = (props: Record<string, string>, children?: HTMLElement[]) => HTMLElement

export class BlueprintDomRenderer {
    private layout: LayoutDefinition
    private components: Record<string, ComponentRenderer>
    private frameworkName: string

    constructor(layout: LayoutDefinition, components: Record<string, ComponentRenderer>, frameworkName: string) {
        this.layout = layout
        this.components = components
        this.frameworkName = frameworkName
    }

    render(target: HTMLElement) {
        target.innerHTML = ''

        // Header
        const header = document.createElement('header')
        this.applyStyles(header, {
            position: this.layout.header.sticky ? 'sticky' : 'relative',
            top: '0',
            zIndex: '50',
            width: '100%',
            height: this.layout.header.height,
            backgroundColor: 'var(--base00)',
            borderBottom: '1px solid var(--base02)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
        })

        // Grid Container (Header)
        const grid = this.renderGrid(this.layout.header.grid)
        header.appendChild(grid)
        target.appendChild(header)

        // Main Body
        const main = document.createElement('main')
        this.applyStyles(main, {
            maxWidth: this.layout.body.maxWidth || '100%',
            margin: '0 auto',
            padding: this.layout.body.padding || '0'
        })

        // Render body children
        this.layout.body.children.forEach(child => {
            const el = this.renderNode(child)
            if (el) main.appendChild(el)
        })

        target.appendChild(main)
    }

    private renderGrid(gridDef: BlueprintGrid): HTMLElement {
        const grid = document.createElement('div')
        this.applyStyles(grid, {
            display: 'grid',
            width: '100%',
            maxWidth: gridDef.maxWidth || '100%',
            margin: '0 auto',
            padding: gridDef.padding || '0',
            gap: gridDef.gap || '0',
            gridTemplateColumns: `repeat(${gridDef.columns}, 1fr)`,
            alignItems: gridDef.align || 'start'
        })

        gridDef.children.forEach(col => {
            const colEl = this.renderColumn(col)
            grid.appendChild(colEl)
        })

        return grid
    }

    private renderColumn(colDef: BlueprintColumn): HTMLElement {
        const col = document.createElement('div')
        const span = colDef.span || '1'
        this.applyStyles(col, {
            gridColumn: `span ${span}`,
            display: 'flex',
            flexDirection: 'column', // Default to column for flexibility
            gap: '0.5rem',
            justifyContent: colDef.align || 'start',
            alignItems: colDef.align === 'center' ? 'center' : colDef.align === 'right' ? 'flex-end' : 'flex-start'
        })

        // Handle visibility classes
        if (colDef.visibility === 'desktop-only') col.classList.add('desktop-only')
        if (colDef.visibility === 'mobile-only') col.classList.add('mobile-only')

        colDef.children.forEach(node => {
            const nodeEl = this.renderNode(node)
            if (nodeEl) col.appendChild(nodeEl)
        })

        return col
    }

    private renderNode(node: BlueprintNode): HTMLElement | null {
        if (node.type === 'text') {
            const el = document.createElement(node.size === 'xl' ? 'h1' : node.size === 'lg' ? 'h2' : 'span')
            el.textContent = node.text?.replace('{framework.name}', this.frameworkName) || ''
            this.applyStyles(el, {
                fontSize: node.size === 'xl' ? '1.25rem' : node.size === 'lg' ? '1rem' : '0.9rem',
                fontWeight: node.weight === 'bold' ? '600' : '400',
                color: node.color?.startsWith('var(') ? node.color : `var(--${node.color || 'base05'})`,
                opacity: '1'
            })
            // Framework-specific tweaks
            if (node.text?.includes('{framework.name}') && node.text.includes('(')) {
                // Approximate logic for the " (Vite)" opacity style
                el.innerHTML = node.text.replace('{framework.name}', this.frameworkName)
                    .replace(/\((.*?)\)/, '<span style="opacity: 0.6; fontWeight: 400">($1)</span>')
            }
            return el
        }

        if (node.type === 'component') {
            const type = node.props?.type
            if (type && this.components[type]) {
                return this.components[type](node.props || {})
            }
            console.warn(`[BlueprintDomRenderer] Component type "${type}" not found`)
            return null
        }

        if (node.type === 'row') {
            const div = document.createElement('div')
            this.applyStyles(div, {
                display: 'flex',
                gap: node.props?.gap || '0.5rem',
                alignItems: 'center'
            })
            node.children?.forEach(child => {
                const el = this.renderNode(child)
                if (el) div.appendChild(el)
            })
            return div
        }

        if (node.type === 'label') {
            const label = document.createElement('label')
            label.textContent = node.text || ''
            this.applyStyles(label, {
                fontSize: node.size === 'sm' ? '0.9rem' : '1rem',
                color: `var(--${node.color || 'base05'})`
            })
            if (node.props?.for) label.setAttribute('for', node.props.for)
            return label
        }

        return null
    }

    private applyStyles(el: HTMLElement, styles: Record<string, string>) {
        Object.assign(el.style, styles)
    }
}
