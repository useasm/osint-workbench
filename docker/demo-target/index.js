const express = require('express');
const app = express();

// Intentionally poor security headers for demo purposes
app.use((req, res, next) => {
  // Missing HSTS
  // Missing CSP
  // Missing X-Frame-Options
  // Missing X-Content-Type-Options
  res.setHeader('Server', 'Apache/2.4.41 (Ubuntu)');
  res.setHeader('X-Powered-By', 'PHP/7.4.3');
  // Insecure cookie
  res.setHeader('Set-Cookie', 'sessionid=abc123def456; Path=/');
  next();
});

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>Demo Security Target</title>
      <meta name="generator" content="WordPress 5.9">
      <meta name="description" content="Demo target for security scanning">
    </head>
    <body>
      <h1>Demo Security Target</h1>
      <p>This is a test application with intentionally poor security configurations.</p>
      <script src="/bundle.js"></script>
    </body>
    </html>
  `);
});

app.get('/robots.txt', (req, res) => {
  res.send('User-agent: *\nDisallow: /admin\nDisallow: /config');
});

app.get('/sitemap.xml', (req, res) => {
  res.send(`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>http://localhost/</loc></url>
  <url><loc>http://localhost/about</loc></url>
  <url><loc>http://localhost/contact</loc></url>
</urlset>`);
});

app.get('/about', (req, res) => {
  res.send('<h1>About</h1><p>Demo page</p>');
});

app.get('/contact', (req, res) => {
  res.send('<h1>Contact</h1><p>Contact page</p>');
});

const PORT = process.env.PORT || 80;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Demo target listening on port ${PORT}`);
});
