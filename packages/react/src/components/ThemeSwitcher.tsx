
import React from 'react'
import type { Base16Theme, Base24Theme } from '@tinted-theming/core'

export interface ThemeSwitcherProps {
    currentThemeId: string;
    availableThemes: (Base16Theme | Base24Theme)[];
    remoteThemePaths: string[];
    isLoading: boolean;
    error: string | null;
    onThemeChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const ThemeSwitcher: React.FC<ThemeSwitcherProps> = ({
    currentThemeId,
    availableThemes,
    remoteThemePaths,
    isLoading,
    error,
    onThemeChange
}) => {
    return (
        <select
            value={currentThemeId}
            disabled={isLoading && availableThemes.length === 2 && !error}
            onChange={onThemeChange}
            style={{
                padding: '0.4rem 0.8rem',
                backgroundColor: 'var(--base01)',
                color: 'var(--base05)',
                border: '1px solid var(--base02)',
                borderRadius: '4px',
                fontSize: '0.9rem',
                maxWidth: '200px',
            }}
        >
            <optgroup label="Loaded Themes">
                {availableThemes.map((t) => {
                    const system = (t as any).system || 'base16';
                    const id = `${system}-${t.name}`;
                    return (
                        <option key={id} value={id}>
                            [{system.toUpperCase()}] {t.name} ({t.variant})
                        </option>
                    );
                })}
            </optgroup>
            {error && (
                <optgroup label="Error">
                    <option disabled>Error: {error}</option>
                </optgroup>
            )}
            {!isLoading && !error && remoteThemePaths.length > 0 && (
                <optgroup label="Remote Themes (Click to load)">
                    {remoteThemePaths
                        .filter(path => {
                            const [system, filename] = path.split('/')
                            const name = filename.replace('.yaml', '')
                            return !availableThemes.some(t => {
                                const tSystem = (t as any).system || 'base16'
                                return tSystem === system && t.name.toLowerCase() === name.toLowerCase()
                            })
                        })
                        .map((path) => {
                            const [system, filename] = path.split('/')
                            const name = filename.replace('.yaml', '')
                            return (
                                <option key={path} value={path}>
                                    [{system.toUpperCase()}] {name} (remote)
                                </option>
                            )
                        })}
                </optgroup>
            )}
        </select>
    )
}
