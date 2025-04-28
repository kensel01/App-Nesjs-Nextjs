const express = require('express');
const path = require('path');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Proxy API requests to the backend
app.use('/api', createProxyMiddleware({ 
  target: 'http://localhost:3001', // NestJS backend port
  pathRewrite: {
    '^/api': '', // Remove /api prefix when forwarding to backend
  },
  changeOrigin: true,
  // Enhanced logging for debugging
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying request to: ${req.method} ${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log(`Received response from backend: ${proxyRes.statusCode}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.status(500).send('Proxy error: Unable to connect to backend');
  }
}));

// Serve static files
app.use(express.static(path.join(__dirname, 'dist')));

// Handle SPA routing by sending all non-API requests to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});