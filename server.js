const express = require('express');
const fetch = require('node-fetch'); // Ensure node-fetch version 2 is installed
const path = require('path');
const app = express();
const port = 3000;

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Parse JSON bodies
app.use(express.json());

// Your API key (keep this secure)
const apiKey = process.env.PHOTON_API_KEY;
app.use((req, res, next) => {
    console.log(`${req.method} request to ${req.url}`);
    next();
});

app.post('/api/generate', async (req, res) => {
    try {
        console.log('Received generation request:', req.body);
        const response = await fetch('https://api.lumalabs.ai/dream-machine/v1/generations/image', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify(req.body)
        });
        const data = await response.json();

        if (!response.ok) {
            console.error('API Error:', data);
            return res.status(response.status).json(data);
        }

        console.log('Generation response:', data);
        res.json(data);
    } catch (error) {
        console.error('Error generating image:', error.message);
        res.status(500).json({ error: error.message });
    }
});

app.get('/api/status/:id', async (req, res) => {
    try {
        const response = await fetch(`https://api.lumalabs.ai/dream-machine/v1/generations/${req.params.id}`, {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            }
        });
        const data = await response.json();

        if (!response.ok) {
            console.error('API Error:', data);
            return res.status(response.status).json(data);
        }

        res.json(data);
    } catch (error) {
        console.error('Error checking status:', error);
        res.status(500).json({ error: 'Error checking status' });
    }
});

// Serve the frontend
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/api/test', (req, res) => {
    res.json({ message: 'Server is working!' });
});

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});

