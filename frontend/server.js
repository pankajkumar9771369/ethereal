import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4173;

// Resolve path to 'dist' folder
const distPath = path.resolve(__dirname, 'dist');

// Log identifying info
console.log('Serving from:', distPath);

// Serve static files from the 'dist' directory
app.use(express.static(distPath));

// Health check for troubleshooting
app.get('/health', (req, res) => res.send('OK'));

// Handle SPA routing: for any request that doesn't match a file in 'dist', serve 'index.html'
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Frontend server running on port ${PORT}`);
});
