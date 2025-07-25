---
applyTo: "public/**"
---

# Public Directory Instructions

## Overview

The `public` directory contains static assets that are served directly by Next.js.

## File Organization

- `icons/` - App icons for PWA (various sizes)
- `images/` - Static images and graphics
- `manifest.json` - PWA manifest file
- `robots.txt` - Search engine crawling instructions
- `sitemap.xml` - Website sitemap
- `favicon.ico` - Website favicon
- `sw.js` - Service worker for PWA (if using custom implementation)

## PWA Requirements

### Manifest File

```json
{
  "name": "All-AI - Intelligent AI Chat",
  "short_name": "All-AI",
  "description": "Chat with multiple AI models intelligently",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#000000",
  "orientation": "portrait",
  "icons": [
    {
      "src": "/icons/icon-72x72.png",
      "sizes": "72x72",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-96x96.png",
      "sizes": "96x96",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-128x128.png",
      "sizes": "128x128",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-144x144.png",
      "sizes": "144x144",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-152x152.png",
      "sizes": "152x152",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-192x192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-384x384.png",
      "sizes": "384x384",
      "type": "image/png",
      "purpose": "maskable any"
    },
    {
      "src": "/icons/icon-512x512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "maskable any"
    }
  ],
  "categories": ["productivity", "utilities", "education"],
  "shortcuts": [
    {
      "name": "New Chat",
      "short_name": "Chat",
      "description": "Start a new conversation",
      "url": "/chat",
      "icons": [{ "src": "/icons/chat-192x192.png", "sizes": "192x192" }]
    },
    {
      "name": "Settings",
      "short_name": "Settings",
      "description": "Open app settings",
      "url": "/settings",
      "icons": [{ "src": "/icons/settings-192x192.png", "sizes": "192x192" }]
    }
  ]
}
```

### Required Icon Sizes

Generate app icons in these sizes for optimal PWA support:

- 72x72 (Android)
- 96x96 (Android)
- 128x128 (Chrome Web Store)
- 144x144 (Windows)
- 152x152 (iOS)
- 192x192 (Android, Chrome)
- 384x384 (Android splash)
- 512x512 (Android splash, Chrome)

### Image Optimization Guidelines

- Use WebP format for better compression
- Provide fallback formats (PNG/JPEG) for compatibility
- Optimize images for different screen densities (1x, 2x, 3x)
- Use appropriate compression levels
- Include proper alt text for accessibility

### SEO Files

#### Robots.txt

```
User-agent: *
Allow: /

# Sitemap
Sitemap: https://all-ai.app/sitemap.xml

# Disallow admin areas (if any)
Disallow: /admin/
Disallow: /api/
```

#### Sitemap.xml (Generated dynamically)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://all-ai.app/</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://all-ai.app/chat</loc>
    <lastmod>2025-01-20</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.8</priority>
  </url>
</urlset>
```

## File Naming Conventions

- Use kebab-case for file names
- Include dimensions in icon file names
- Use descriptive names for images
- Add version numbers for cacheable assets when needed

## Performance Considerations

- Compress all images appropriately
- Use modern image formats (WebP, AVIF) with fallbacks
- Implement proper caching headers
- Keep file sizes minimal for fast loading
- Use SVG for simple graphics and icons when possible

## Security

- Never store sensitive information in public directory
- Validate all uploaded assets
- Use proper MIME type checking
- Implement content security policies for served assets
