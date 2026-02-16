import { uploadAvatar } from './middleware/upload.js';
import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import logger from 'console';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.post('/test-upload', uploadAvatar.single('avatar'), (req, res) => {
    logger.log('File uploaded:', req.file);
    res.json({ url: req.file.path });
});

// Error handling
app.use((err, req, res, next) => {
    logger.error('Upload error (server side):', err);
    res.status(500).json({ error: err.message });
});

const PORT = 3002;
const server = app.listen(PORT, async () => {
    logger.log(`Test server running on port ${PORT}`);

    try {
        // Create a dummy file
        const dummyPath = path.join(__dirname, 'dummy.png');
        // Minimal valid PNG header
        const pngBuffer = Buffer.from('89504e470d0a1a0a0000000d49484452000000010000000108060000001f15c4890000000a49444154789c63000100000500010d0a2db40000000049454e44ae426082', 'hex');
        fs.writeFileSync(dummyPath, pngBuffer);

        // Use dynamic import for fetch (Node 18+)
        const FormData = (await import('formdata-node')).FormData;
        const { fileFromPath } = await import('formdata-node/file-from-path');

        // Actually we can use 'axios' if available or just basic http client
        // Let's use 'axios' since it's in package.json
        const axios = (await import('axios')).default;
        const form = new FormData();
        // axios serializes FormData differently depending on environment (browser vs node)
        // form-data (commonjs) vs formdata-node
        // Let's try native fetch if available (Node 18+)

        // Simplest: construct multipart body manually or use 'form-data' package if installed (it's not in package.json devDependencies, but maybe 'axios' uses it)
        // 'axios' dependency usually brings 'form-data' or similar.

        // Better: use 'form-data' package which is standard for node
        // But verify if it is available. It is not in package.json explicitly?
        // checking package.json...
        // "dependencies": { "axios": "^1.6.2", ... } 
        // axios >= 1.x supports multipart/form-data with `form-data` package.

        logger.log('Starting upload request...');

        // We will use the 'form-data' package which axios depends on
        // But since we can't be sure it's accessible easily, let's use a simpler approach:
        // We will assume 'form-data' is available via axios dependencies or we can just try to import it.

        // Alternative: Use a known failing input or just a basic check.
        // If I cannot easily run a client POST from here, maybe just checking initialization is enough.
        // But I wanted to test the upload.

        // Let's rely on the user to check "Failed to fetch".
        // I'll skip the self-request if it's too complex to setup without installed util packages.

        // ACTUALLY, I can use `curl` if available?
        // I am an agent, I can run `curl` in terminal!

    } catch (e) {
        logger.error('Client script error:', e);
    }
});
