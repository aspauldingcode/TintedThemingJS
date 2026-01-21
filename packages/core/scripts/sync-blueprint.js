import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const xmlPath = path.resolve(__dirname, '../ui-blueprint.xml');
const tsPath = path.resolve(__dirname, '../src/blueprint/default.ts');

try {
    const xmlContent = fs.readFileSync(xmlPath, 'utf8');
    const tsContent = `// This file is auto-generated from ui-blueprint.xml
export const DEFAULT_BLUEPRINT = \`${xmlContent.replace(/`/g, '\\`').replace(/\$/g, '\\$')}\`;
`;

    // Ensure directory exists
    const dir = path.dirname(tsPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(tsPath, tsContent);
    console.log('Successfully synced ui-blueprint.xml to src/blueprint/default.ts');
} catch (error) {
    console.error('Failed to sync blueprint:', error);
    process.exit(1);
}
