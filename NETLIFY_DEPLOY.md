# Stock Flow Management System - Netlify Deployment

This repository contains a full-stack Stock Flow Management System.

## Repository Structure
```
inventory/
├── frontend/           # React frontend (Vite)
├── server/            # Node.js backend  
├── netlify.toml       # Netlify configuration
└── NETLIFY_DEPLOY.md  # This file
```

## Netlify Deployment Configuration

### Build Settings
- **Base directory**: `frontend`
- **Build command**: `npm run build`
- **Publish directory**: `frontend/dist`

### Environment Variables (Add in Netlify Dashboard)
```
VITE_API_URL=https://stock-flow-management-system.onrender.com/api
VITE_APP_NAME=Stock Flow Management System
VITE_APP_VERSION=1.0.0
```

### Backend
- Backend is deployed at: https://stock-flow-management-system.onrender.com
- Database: MongoDB Atlas

## Quick Deploy Steps
1. Connect this GitHub repository to Netlify
2. Set base directory to `frontend`  
3. Set build command to `npm run build`
4. Set publish directory to `frontend/dist`
5. Add the environment variables above
6. Deploy!

## Features
- ✅ Admin Dashboard with full CRUD operations
- ✅ Customer Portal for browsing and ordering
- ✅ User Management with role-based access
- ✅ Category and Product Management
- ✅ Supplier Management
- ✅ Order Processing System
- ✅ Real-time inventory tracking
