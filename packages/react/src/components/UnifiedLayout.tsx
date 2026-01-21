
import React, { useEffect, useState, ReactNode } from 'react'
import {
    BlueprintParser,
    DEFAULT_BLUEPRINT,
    type LayoutDefinition,
    type BlueprintGrid,
    type BlueprintColumn,
    type BlueprintNode
} from '@tinted-theming/core'

/**
 * Common prop types for components rendered by the layout
 */
interface ComponentProps {
    frameworkName: string;
    // Add other context props as needed
}

interface UnifiedLayoutProps {
    blueprint?: string;
    frameworkName: string;
    components?: Record<string, React.ComponentType<any>>;
    children?: ReactNode;
}

export const UnifiedLayout: React.FC<UnifiedLayoutProps> = ({
    blueprint = DEFAULT_BLUEPRINT,
    frameworkName,
    components = {},
    children
}) => {
    const [layout, setLayout] = useState<LayoutDefinition | null>(null)
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    useEffect(() => {
        const parser = new BlueprintParser()
        const parsed = parser.parse(blueprint)
        setLayout(parsed)
    }, [blueprint])

    if (!layout) return null

    const renderNode = (node: BlueprintNode, key: number): ReactNode => {
        if (node.type === 'text') {
            return (
                <span
                    key={key}
                    dangerouslySetInnerHTML={{
                        __html: (node.text || '').replace('{framework.name}', frameworkName)
                    }}
                    style={{
                        fontSize: node.props?.size,
                        fontWeight: node.props?.weight as any,
                        color: node.props?.color,
                        margin: 0,
                        ...(node.type === 'text' && node.props?.variant === 'h1' ? { display: 'block' } : {})
                    }}
                />
            )
        }

        if (node.type === 'component') {
            const type = node.props?.type
            if (type === 'mobile-menu-toggle') {
                return (
                    <button
                        key={key}
                        className="mobile-only"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        style={{
                            color: 'var(--base05)',
                            fontSize: '1.5rem',
                            padding: '0.2rem',
                        }}
                    >
                        {isMenuOpen ? '✕' : '☰'}
                    </button>
                )
            }

            const Component = components[type || '']
            if (Component) {
                return <Component key={key} frameworkName={frameworkName} {...node.props} />
            }
            return null
        }

        if (node.type === 'slot' && node.props?.name === 'main-content') {
            return <React.Fragment key={key}>{children}</React.Fragment>
        }

        const style: React.CSSProperties = {
            display: node.type === 'row' ? 'flex' : undefined,
            alignItems: node.props?.align === 'center' ? 'center' : undefined,
            gap: node.props?.gap,
        }

        if (node.type === 'label') {
            return (
                <label key={key} htmlFor={node.props?.for} style={{
                    fontSize: node.props?.size,
                    color: node.props?.color,
                    ...style
                }}>
                    {node.children?.map((c, i) => renderNode(c, i))}
                </label>
            )
        }

        // Generic container
        return (
            <div key={key} style={style}>
                {node.children?.map((c, i) => renderNode(c, i))}
            </div>
        )
    }

    const { header, mobileMenu } = layout

    return (
        <div className="unified-layout">
            <header style={{
                height: header.height,
                position: header.sticky ? 'sticky' : undefined,
                top: header.sticky ? 0 : undefined,
                zIndex: 100,
                backgroundColor: 'var(--base00)',
            }}>
                <nav style={{
                    display: 'grid',
                    gridTemplateColumns: header.grid.columns,
                    gap: header.grid.gap,
                    alignItems: header.grid.align,
                    padding: header.grid.padding,
                    borderBottom: '1px solid var(--base02)',
                }}>
                    {header.grid.children.map((col, i) => (
                        <div
                            key={i}
                            style={{
                                display: 'flex',
                                alignItems: 'center', // Default align items
                                justifyContent: col.align === 'center' ? 'center' : col.align === 'end' ? 'flex-end' : 'flex-start',
                                height: '100%',
                            }}
                            className={col.visibility}
                        >
                            {col.children?.map((node, j) => renderNode(node, j))}
                        </div>
                    ))}
                </nav>
            </header>

            {isMenuOpen && (
                <div className="mobile-only" style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    right: 0,
                    backgroundColor: 'var(--base01)',
                    borderBottom: '1px solid var(--base02)',
                    padding: '1rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    zIndex: 100,
                    boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
                }}>
                    {mobileMenu.children.map((node, i) => {
                        // Wrap top-level mobile menu items for spacing
                        return (
                            <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                                {/* Only support components in mobile menu for now as per blueprint */}
                                {node.type === 'component' && components[node.props?.type || ''] && (
                                    React.createElement(components[node.props?.type || '']!, { frameworkName })
                                )}
                            </div>
                        )
                    })}
                </div>
            )}

            <main>
                {/* Body children usually includes slot, let's render layout body definition */}
                {layout.body.children.map((node, i) => renderNode(node, i))}
            </main>
        </div>
    )
}
