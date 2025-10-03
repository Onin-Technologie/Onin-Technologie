# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is a modern, accessible, and performance-optimized website for Onin Technologie. The site follows web standards and best practices including WCAG AA accessibility, responsive design with 8pt grid system, and Progressive Web App capabilities.

## Project Structure

### Core Pages
- [index.html](index.html) - Modern landing page with portfolio and projects CTAs
- [projects.html](projects.html) - Comprehensive projects showcase with filtering
- [qr.html](qr.html) - Redirection page for QR code access
- [styles.css](styles.css) - Design system with CSS custom properties and 8pt grid

### Configuration Files
- [manifest.json](manifest.json) - PWA manifest for app-like experience
- [sw.js](sw.js) - Service Worker for offline functionality and caching
- [robots.txt](robots.txt) - Search engine crawling instructions
- [sitemap.xml](sitemap.xml) - SEO site structure for search engines
- [browserconfig.xml](browserconfig.xml) - Microsoft browser tile configuration
- [CNAME](CNAME) - GitHub Pages custom domain configuration

### Assets
- [Pictures/](Pictures/) - Logo and icon images (consider adding AVIF/WebP versions)

## Architecture & Design System

### Design Tokens
- **Color Scheme**: Royal blue (#1e40af) as primary color with full semantic palette
- **Grid System**: 8pt base unit with consistent spacing scale
- **Typography**: Inter font family with modular scale (1.25 ratio)
- **Responsive**: Mobile-first approach with logical breakpoints
- **Accessibility**: WCAG AA compliant with proper contrast ratios

### CSS Architecture
```css
:root {
  --space-4: 0.5rem;     /* 8px - base unit */
  --space-8: 1rem;       /* 16px */
  --space-16: 2rem;      /* 32px */
  /* ... full 8pt scale */

  --color-primary: #1e40af;
  --color-text-primary: #0f172a;
  /* ... semantic color system */
}
```

### Component Structure
- **Layout**: Flexbox and CSS Grid with semantic HTML
- **Navigation**: Sticky navigation with breadcrumbs
- **Theme Toggle**: System preference detection with manual override
- **Buttons**: Minimum 48px touch targets for accessibility
- **Cards**: Consistent elevation and hover states

## Development Commands

### Local Development
```bash
# Simple HTTP server (Python)
python -m http.server 8000

# Or using Node.js
npx serve .

# Or using PHP
php -S localhost:8000
```

### Testing & Validation
- **HTML Validation**: Use W3C HTML Validator
- **CSS Validation**: Use W3C CSS Validator
- **Accessibility**: Test with axe-core, WAVE, or similar tools
- **Performance**: Use Lighthouse for Core Web Vitals
- **Cross-browser**: Test in Chrome, Firefox, Safari, Edge

### Deployment
- **GitHub Pages**: Automatic deployment from main branch
- **Custom Domain**: onin-technologie.fr (configured in CNAME)
- **HTTPS**: Enforced by GitHub Pages

## Performance Optimizations

### Loading Strategy
- **Critical CSS**: Inlined theme toggle styles
- **Font Loading**: Preconnect and preload with font-display: swap
- **Service Worker**: Cache-first for static assets, network-first for dynamic content
- **Progressive Enhancement**: Works without JavaScript

### PWA Features
- **Offline Support**: Service Worker caching strategy
- **Install Prompt**: Web app manifest with shortcuts
- **Theme Integration**: Respects system preferences
- **Performance Budget**: Minimal dependencies, optimized images

## Accessibility Features

### WCAG AA Compliance
- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Readers**: Proper ARIA labels and semantic HTML
- **Color Contrast**: 4.5:1 minimum ratio for normal text
- **Focus Management**: Visible focus indicators
- **Reduced Motion**: Respects `prefers-reduced-motion`

### Semantic HTML
- **Landmarks**: `<nav>`, `<main>`, `<section>`, `<article>`
- **Headings**: Proper hierarchy (h1 → h2 → h3)
- **Lists**: Proper use of `<ol>`, `<ul>`, `<dl>`
- **Forms**: Associated labels and field descriptions

## SEO Optimization

### Meta Tags
- **Open Graph**: Complete social media preview setup
- **Twitter Cards**: Large image cards for link sharing
- **Schema.org**: Structured data for rich snippets
- **Canonical URLs**: Prevent duplicate content issues

### Content Strategy
- **Unique Titles**: Descriptive page titles under 60 characters
- **Meta Descriptions**: Compelling descriptions under 160 characters
- **URL Structure**: Clean, readable URLs
- **Internal Linking**: Strategic cross-page links

## Browser Support

### Modern Browsers
- **Chrome/Edge**: 90+
- **Firefox**: 90+
- **Safari**: 14+
- **Mobile**: iOS Safari 14+, Chrome Mobile 90+

### Progressive Enhancement
- **Core Functionality**: Works without JavaScript
- **CSS Custom Properties**: Fallbacks for older browsers
- **Flexbox/Grid**: Graceful degradation with float fallbacks

## Content Management

### Brand Guidelines
- **Company Name**: "Onin Technologie"
- **Language**: French (fr-FR locale)
- **Tone**: Professional, modern, accessible
- **Colors**: Royal blue primary, semantic color usage

### Content Structure
- **Homepage**: Professional introduction with clear CTAs
- **Projects Page**: Filterable portfolio with detailed project cards
- **External Links**: Portfolio link to https://ninoblz.github.io/Portfolio/index.html

## Future Enhancements

### Performance
- **Image Optimization**: Add AVIF/WebP versions with fallbacks
- **Critical CSS**: Extract and inline above-the-fold styles
- **Code Splitting**: Lazy load non-critical JavaScript

### Features
- **Contact Form**: Add accessible contact form with validation
- **Blog Section**: Consider adding blog functionality
- **Analytics**: Privacy-respecting analytics implementation
- **Internationalization**: Multi-language support if needed