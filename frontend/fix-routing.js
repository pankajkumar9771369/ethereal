import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const distPath = path.join(__dirname, 'dist');

// Ensure dist exists
if (!fs.existsSync(distPath)) {
    console.error('Dist folder not found!');
    process.exit(1);
}

// 1. Create _redirects for Render/Netlify
const redirectContent = '/* /index.html 200';
fs.writeFileSync(path.join(distPath, '_redirects'), redirectContent);
console.log('Created dist/_redirects');

// 2. Create 404.html as a fallback for other static hosts
const indexHtml = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
fs.writeFileSync(path.join(distPath, '404.html'), indexHtml);
console.log('Created dist/404.html (copy of index.html)');
