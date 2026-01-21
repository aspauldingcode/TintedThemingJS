
// This file is a local shim to bypass build issues with @tinted-theming/core
// It contains the Blueprint logic required for the layout.

export const DEFAULT_BLUEPRINT = `<?xml version="1.0" encoding="UTF-8"?>
<blueprint version="1.0">
  <layout>
    <header height="auto" sticky="true">
      <grid columns="1fr auto 1fr" gap="1rem" align="center" padding="1rem 2rem">
        <!-- Left Column: Title -->
        <column align="start">
          <text variant="h1" size="1.25rem" weight="600">
            🎨 TintedThemingJS <span opacity="0.6">( {framework.name} )</span>
          </text>
        </column>
        
        <!-- Center Column: Framework Switcher (Desktop) -->
        <column align="center" visibility="desktop-only">
          <component type="framework-switcher" />
        </column>
        
        <!-- Right Column: Theme Switcher (Desktop) -->
        <column align="end" visibility="desktop-only">
          <row gap="0.5rem" align="center">
            <label for="theme-select" size="0.9rem" color="var(--base04)">Theme:</label>
            <component type="theme-switcher" />
          </row>
        </column>
        
        <!-- Mobile Toggle (Mobile) -->
        <column align="end" visibility="mobile-only">
           <component type="mobile-menu-toggle" />
        </column>
      </grid>
    </header>
    
    <body>
       <slot name="main-content" />
    </body>
    
    <mobile-menu>
       <component type="framework-switcher" />
       <component type="theme-switcher" />
    </mobile-menu>
  </layout>
</blueprint>
`;

export class BlueprintParser {
    parse(xml) {
        if (typeof DOMParser !== 'undefined') {
            return this.parseWithDOM(xml);
        } else {
            return this.parseSimple(xml);
        }
    }

    parseWithDOM(xml) {
        const parser = new DOMParser();
        const doc = parser.parseFromString(xml, "application/xml");

        const parseGrid = (el) => {
            const children = Array.from(el.children).filter(c => c.tagName === 'column').map(c => parseColumn(c));
            return {
                columns: el.getAttribute('columns') || '1fr',
                gap: el.getAttribute('gap') || '0',
                align: el.getAttribute('align') || 'stretch',
                padding: el.getAttribute('padding') || '0',
                maxWidth: el.getAttribute('maxWidth') || undefined,
                children
            };
        };

        const parseColumn = (el) => {
            return {
                align: el.getAttribute('align') || 'start',
                span: el.getAttribute('span') || undefined,
                visibility: el.getAttribute('visibility'),
                children: Array.from(el.children).map(c => parseNode(c))
            };
        };

        const parseNode = (el) => {
            const props = {};
            Array.from(el.attributes).forEach(attr => {
                props[attr.name] = attr.value;
            });

            const node = {
                type: el.tagName,
                props,
                children: Array.from(el.children).map(c => parseNode(c)),
                size: el.getAttribute('size') || undefined,
                weight: el.getAttribute('weight') || undefined,
                color: el.getAttribute('color') || undefined,
            };

            if (el.tagName === 'text') {
                node.text = el.innerHTML;
            }
            if (el.tagName === 'label') {
                node.text = el.textContent || '';
            }

            return node;
        };

        const headerEl = doc.querySelector('layout > header');
        const gridEl = headerEl?.querySelector('grid');

        const header = {
            height: headerEl?.getAttribute('height') || 'auto',
            sticky: headerEl?.getAttribute('sticky') === 'true',
            grid: gridEl ? parseGrid(gridEl) : { columns: '1fr', gap: '0', align: 'center', padding: '0', children: [] }
        };

        const bodyEl = doc.querySelector('layout > body');
        const bodyChildren = Array.from(bodyEl?.children || []).map(c => parseNode(c));

        const body = {
            children: bodyChildren,
            maxWidth: bodyEl?.getAttribute('maxWidth') || undefined,
            padding: bodyEl?.getAttribute('padding') || undefined,
        }

        const mobileMenuEl = doc.querySelector('layout > mobile-menu');
        const mobileChildren = Array.from(mobileMenuEl?.children || []).map(c => parseNode(c));

        return {
            header,
            body,
            mobileMenu: { children: mobileChildren }
        };
    }

    parseSimple(xml) {
        return {
            header: {
                height: '4rem',
                sticky: true,
                grid: {
                    columns: '1fr',
                    gap: '0',
                    align: 'center',
                    padding: '0 2rem',
                    children: [
                        { align: 'start', children: [{ type: 'text', text: 'TintedTheming', size: 'xl', weight: 'bold' }] }
                    ]
                }
            },
            body: {
                maxWidth: '1200px',
                padding: '2rem',
                children: [
                    { type: 'slot', props: { name: 'main-content' } }
                ]
            },
            mobileMenu: { children: [] }
        };
    }
}

export class BlueprintDomRenderer {
    constructor(layout, components, frameworkName) {
        this.layout = layout
        this.components = components
        this.frameworkName = frameworkName
    }

    render(target) {
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

    renderGrid(gridDef) {
        const grid = document.createElement('div')
        this.applyStyles(grid, {
            display: 'grid',
            width: '100%',
            maxWidth: gridDef.maxWidth || '100%',
            margin: '0 auto',
            padding: gridDef.padding || '0',
            gap: gridDef.gap || '0',
            gridTemplateColumns: isNaN(Number(gridDef.columns)) ? gridDef.columns : `repeat(${gridDef.columns}, 1fr)`,
            alignItems: gridDef.align || 'start'
        })

        gridDef.children.forEach(col => {
            const colEl = this.renderColumn(col)
            grid.appendChild(colEl)
        })

        return grid
    }

    renderColumn(colDef) {
        const col = document.createElement('div')
        const span = colDef.span || '1'
        this.applyStyles(col, {
            gridColumn: `span ${span}`,
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            justifyContent: colDef.align || 'start',
            alignItems: colDef.align === 'center' ? 'center' : colDef.align === 'right' ? 'flex-end' : 'flex-start'
        })

        if (colDef.visibility === 'desktop-only') col.classList.add('desktop-only')
        if (colDef.visibility === 'mobile-only') col.classList.add('mobile-only')

        colDef.children.forEach(node => {
            const nodeEl = this.renderNode(node)
            if (nodeEl) col.appendChild(nodeEl)
        })

        return col
    }

    renderNode(node) {
        if (node.type === 'text') {
            const el = document.createElement(node.size === 'xl' ? 'h1' : node.size === 'lg' ? 'h2' : 'span')
            el.textContent = node.text?.replace('{framework.name}', this.frameworkName) || ''
            this.applyStyles(el, {
                fontSize: node.size === 'xl' ? '1.25rem' : node.size === 'lg' ? '1rem' : '0.9rem',
                fontWeight: node.weight === 'bold' ? '600' : '400',
                color: node.color?.startsWith('var(') ? node.color : `var(--${node.color || 'base05'})`,
                opacity: '1'
            })
            if (node.text?.includes('{framework.name}') && node.text.includes('(')) {
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

    applyStyles(el, styles) {
        Object.assign(el.style, styles)
    }
}
