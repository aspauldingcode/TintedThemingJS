
import { ThemesLoader } from './packages/core/src/loader';

async function main() {
    console.log('Starting debug theme loader...');
    const loader = new ThemesLoader();

    try {
        console.log('Fetching themes...');
        const themes = await loader.listThemes();
        console.log('Themes found:', themes.length);
        if (themes.length > 0) {
            console.log('First 5 themes:', themes.slice(0, 5));
        } else {
            console.warn('No themes found!');
        }
    } catch (error) {
        console.error('Error fetching themes:', error);
    }
}

main();
