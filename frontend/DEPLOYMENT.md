# Stock Flow Management System - Frontend Deployment Guide

## 🚀 Netlify Deployment Instructions

### Prerequisites
- Backend deployed at: `https://stock-flow-management-system.onrender.com`
- Node.js 18+ installed locally
- Git repository with latest code

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=https://stock-flow-management-system.onrender.com/api
VITE_APP_NAME=Stock Flow Management System
VITE_APP_VERSION=1.0.0
```

### Local Build Test
1. Install dependencies:
   ```bash
   npm install
   ```

2. Test the build locally:
   ```bash
   npm run build
   ```

3. Preview the build:
   ```bash
   npm run preview
   ```

### Netlify Deployment Steps

#### Method 1: Connect GitHub Repository (Recommended)
1. Go to [Netlify](https://netlify.com) and log in
2. Click "New site from Git"
3. Choose GitHub and select your repository
4. Configure build settings:
   - **Build command**: `npm run build`
   - **Publish directory**: `dist`
   - **Node version**: `18`

5. Add environment variables in Netlify dashboard:
   - Go to Site settings → Environment variables
   - Add:
     - `VITE_API_URL` = `https://stock-flow-management-system.onrender.com/api`
     - `VITE_APP_NAME` = `Stock Flow Management System`
     - `VITE_APP_VERSION` = `1.0.0`

6. Deploy!

#### Method 2: Manual Upload
1. Build the project locally:
   ```bash
   npm run build
   ```

2. Go to Netlify and drag/drop the `dist` folder

### Post-Deployment Checklist
- [ ] Site loads without errors
- [ ] Routing works (no 404 on refresh)
- [ ] Login functionality works
- [ ] API calls reach the backend
- [ ] All CRUD operations function correctly
- [ ] No console errors

### Common Issues & Solutions

#### 1. Page Shows "Page Not Found" or Blank Screen
- **Cause**: Missing redirects configuration
- **Solution**: Ensure `netlify.toml` and `public/_redirects` exist

#### 2. API Calls Fail
- **Cause**: Incorrect API URL or CORS issues
- **Solution**: 
  - Check `VITE_API_URL` environment variable
  - Ensure backend allows your domain in CORS

#### 3. Build Fails
- **Cause**: Missing dependencies or syntax errors
- **Solution**: 
  - Run `npm run build` locally first
  - Check console for specific errors

#### 4. Environment Variables Not Working
- **Cause**: Variables not prefixed with `VITE_`
- **Solution**: All env vars must start with `VITE_`

### File Structure for Deployment
```
frontend/
├── public/
│   ├── _redirects          # SPA routing redirects
│   └── vite.svg
├── src/
│   ├── components/         # React components
│   ├── context/           # Auth context
│   ├── pages/             # Page components
│   └── utils/             # API utilities
├── dist/                  # Build output (auto-generated)
├── .env                   # Environment variables
├── .env.example          # Environment template
├── netlify.toml          # Netlify configuration
├── package.json          # Dependencies
└── vite.config.js        # Vite configuration
```

### Support
If you encounter issues:
1. Check browser console for errors
2. Verify all environment variables are set
3. Ensure backend is running and accessible
4. Check Netlify build logs for deployment issues

---
**Last Updated**: $(date)
**Frontend URL**: [Your Netlify URL]
**Backend URL**: https://stock-flow-management-system.onrender.com
