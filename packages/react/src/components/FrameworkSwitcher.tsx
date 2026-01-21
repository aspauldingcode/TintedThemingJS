
import React from 'react'

export const FrameworkSwitcher: React.FC<{ frameworkName: string }> = ({ frameworkName }) => {
    // Determine current path to set initial value
    // If we are in Next.js, pathname starts with /nextjs
    // If we are in Vite, pathname starts with /vite_reactjs
    const isVite = typeof window !== 'undefined' && window.location.pathname.startsWith('/vite_reactjs')
    const isVanillaJs = typeof window !== 'undefined' && window.location.pathname.startsWith('/vanilla-js')
    const isVanillaTs = typeof window !== 'undefined' && window.location.pathname.startsWith('/vanilla-ts')
    const isRemix = typeof window !== 'undefined' && window.location.pathname.startsWith('/remix')

    let currentPath = '/nextjs'
    if (isVite) currentPath = '/vite_reactjs/'
    if (isVanillaJs) currentPath = '/vanilla-js/'
    if (isVanillaTs) currentPath = '/vanilla-ts/'
    if (isRemix) currentPath = '/remix/'

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const targetPath = e.target.value
        // Use current origin but switch path
        window.location.href = `${window.location.origin}${targetPath}`
    }

    return (
        <select
            value={currentPath}
            onChange={handleChange}
            style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: 'var(--base01)',
                color: 'var(--base05)',
                border: '1px solid var(--base02)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textAlign: 'center',
            }}
        >
            <option value="/nextjs">Next.js</option>
            <option value="/vite_reactjs/">Vite + React</option>
            <option value="/vanilla-js/">Vanilla JS</option>
            <option value="/vanilla-ts/">Vanilla TS</option>
            <option value="/remix/">Remix</option>
        </select>
    )
}
