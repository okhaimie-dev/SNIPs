# Deployment Guide

This guide covers how to deploy the Starknet Address Validator to various hosting platforms.

## Prerequisites

- Node.js 20.19+ or 22.12+
- Completed build of the application (`npm run build`)
- Built files in the `dist` directory

## Build Process

Before deploying, ensure you have a production build:

```bash
# Install dependencies
npm install

# Create production build
npm run build

# Preview build locally (optional)
npm run preview
```

The build process creates static files in the `dist` directory that can be served by any static web server.

## Deployment Options

### 1. GitHub Pages

#### Automated Deployment with GitHub Actions

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v4
      
    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: '20.19'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      if: github.ref == 'refs/heads/main'
      with:
        github_token: ${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
```

#### Manual Deployment

1. Build the project locally
2. Push the `dist` folder contents to the `gh-pages` branch
3. Enable GitHub Pages in repository settings

### 2. Vercel

#### Method 1: Vercel CLI

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### Method 2: Git Integration

1. Connect your GitHub repository to Vercel
2. Configure build settings:
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Install Command**: `npm ci`

#### Method 3: Manual Upload

```bash
# Build and deploy in one step
npm run build && vercel --prod
```

### 3. Netlify

#### Method 1: Netlify CLI

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Build and deploy
npm run build
netlify deploy --prod --dir=dist
```

#### Method 2: Git Integration

1. Connect repository to Netlify
2. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `20.19.0` (set in Environment Variables)

#### Method 3: Drag and Drop

1. Build the project: `npm run build`
2. Drag the `dist` folder to Netlify's deploy interface

### 4. AWS S3 + CloudFront

#### Setup S3 Bucket

```bash
# Install AWS CLI
aws configure

# Create S3 bucket
aws s3 mb s3://starknet-address-validator

# Enable static website hosting
aws s3 website s3://starknet-address-validator --index-document index.html --error-document index.html
```

#### Deploy to S3

```bash
# Build project
npm run build

# Upload to S3
aws s3 sync dist/ s3://starknet-address-validator --delete

# Set public read permissions
aws s3api put-bucket-policy --bucket starknet-address-validator --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::starknet-address-validator/*"
    }
  ]
}'
```

#### CloudFront Distribution

Create a CloudFront distribution pointing to your S3 bucket for CDN and HTTPS support.

### 5. Firebase Hosting

```bash
# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize project
firebase init hosting

# Build and deploy
npm run build
firebase deploy
```

Configure `firebase.json`:

```json
{
  "hosting": {
    "public": "dist",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "rewrites": [
      {
        "source": "**",
        "destination": "/index.html"
      }
    ]
  }
}
```

### 6. DigitalOcean App Platform

Create `app.yaml`:

```yaml
name: starknet-address-validator
static_sites:
- name: frontend
  source_dir: /
  github:
    repo: your-username/starknet-address-validator
    branch: main
  build_command: npm run build
  output_dir: dist
  routes:
  - path: /
```

### 7. Surge.sh

```bash
# Install Surge
npm install -g surge

# Build and deploy
npm run build
cd dist
surge
```

## Configuration Files

### Vite Configuration for Deployment

Update `vite.config.ts` for specific deployment needs:

```typescript
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig(({ command, mode }) => {
  const config = {
    plugins: [react()],
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };

  // Production optimizations
  if (command === 'build') {
    config.build = {
      // Optimize for production
      minify: 'terser',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            vendor: ['react', 'react-dom'],
            bech32: ['bech32'],
          },
        },
      },
    };
  }

  // GitHub Pages specific config
  if (mode === 'github-pages') {
    config.base = '/starknet-address-validator/';
  }

  return config;
});
```

### Environment Variables

For different environments, create `.env` files:

```bash
# .env.production
VITE_APP_TITLE="Starknet Address Validator"
VITE_APP_VERSION="1.0.0"
VITE_APP_ENVIRONMENT="production"
```

## Domain Configuration

### Custom Domain Setup

For custom domains, add these files to the `public` directory:

#### CNAME (for GitHub Pages)
```
validator.starknet.io
```

#### _redirects (for Netlify)
```
/*    /index.html   200
```

### SSL/HTTPS

Most hosting providers automatically provide SSL certificates. For manual setups:

1. **Let's Encrypt** (free)
2. **CloudFlare** (free tier available)
3. **AWS Certificate Manager** (free for AWS resources)

## Performance Optimization

### Build Optimizations

```bash
# Analyze bundle size
npm install -g vite-bundle-analyzer
npx vite-bundle-analyzer
```

### CDN Configuration

Configure caching headers for optimal performance:

```bash
# Example for Netlify (_headers file)
/*
  Cache-Control: public, max-age=31536000, immutable

/*.html
  Cache-Control: public, max-age=0, must-revalidate

/sw.js
  Cache-Control: no-cache
```

## Monitoring and Analytics

### Add Analytics (Optional)

Add to `index.html`:

```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_MEASUREMENT_ID"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'GA_MEASUREMENT_ID');
</script>
```

## Troubleshooting

### Common Issues

1. **404 Errors on Refresh**
   - Configure server to serve `index.html` for all routes
   - Add rewrite rules as shown in platform-specific sections

2. **Build Failures**
   - Ensure Node.js version is 20.19+ or 22.12+
   - Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

3. **Asset Loading Issues**
   - Check `base` URL in Vite config
   - Verify asset paths in deployed version

4. **Environment Variable Issues**
   - Ensure variables are prefixed with `VITE_`
   - Check environment-specific config files

### Health Checks

Add a health check endpoint by creating `public/health.json`:

```json
{
  "status": "healthy",
  "version": "1.0.0",
  "timestamp": "2025-01-01T00:00:00Z"
}
```

## Security Considerations

### Content Security Policy

Add to `index.html`:

```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data:;
  connect-src 'self';
">
```

### HTTPS Redirect

Most hosting providers handle this automatically. For manual setups, configure server-level redirects.

## Maintenance

### Updates

```bash
# Update dependencies
npm update

# Check for security vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix
```

### Monitoring

Set up monitoring for:
- Site uptime
- Performance metrics
- Error tracking
- User analytics

## Support

For deployment issues:

1. Check the specific hosting provider's documentation
2. Review build logs for errors
3. Test the build locally with `npm run preview`
4. Verify all environment variables are set correctly

## Conclusion

The Starknet Address Validator is a static site that can be deployed to virtually any hosting platform. Choose the option that best fits your needs:

- **GitHub Pages**: Free, integrated with GitHub repos
- **Vercel/Netlify**: Easy deployment with great performance
- **AWS/GCP**: Enterprise-grade scalability
- **Firebase**: Google's platform with additional services

All options will provide a fast, reliable service for validating Starknet addresses.