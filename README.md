# Stock Flow Management System - Professional Inventory Management Solution

## Overview

**Stock Flow Management System** is a modern, full-stack inventory management system designed specifically for battery and automotive parts retailers. Built with React.js and Node.js, it offers a comprehensive solution for managing products, categories, suppliers, orders, and users with a professional, responsive interface.

## Key Features

### Authentication & Authorization
- **JWT-based Authentication** - Secure login system
- **Role-based Access Control** - Admin and Customer roles
- **Protected Routes** - Secure access to different dashboard areas

### Category Management
- **Dynamic Categories** - Create, edit, and delete product categories
- **Category Synchronization** - Automatic syncing with product data
- **Professional UI** - Modern forms with validation and animations

### Product Management
- **Complete CRUD Operations** - Add, view, edit, and delete products
- **Category Integration** - Products linked to managed categories
- **Stock Management** - Real-time stock tracking with visual indicators
- **Search & Filter** - Advanced product search capabilities

### User Management
- **Customer Registration** - Self-service account creation
- **Admin Controls** - Manage user accounts and permissions
- **Profile Management** - Update personal information

### Order Management
- **Customer Orders** - Place and track orders
- **Admin Order Processing** - Review and manage incoming orders
- **Order History** - Complete order tracking system

### Modern UI/UX
- **Responsive Design** - Works perfectly on all devices
- **Dark Theme** - Professional dark mode interface
- **Smooth Animations** - Consistent framer-motion animations
- **Professional Notifications** - SweetAlert2 for user feedback

## Technology Stack

### Frontend
- **React 18** - Modern React with hooks
- **React Router DOM** - Client-side routing
- **Framer Motion** - Smooth animations and transitions
- **Tailwind CSS** - Utility-first CSS framework
- **SweetAlert2** - Beautiful alert dialogs
- **Axios** - HTTP client for API calls

### Backend
- **Node.js** - Server runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

## Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- Git

### 1. Clone the Repository
```bash
git clone <your-repository-url>
cd inventory
```

### 2. Backend Setup
```bash
cd server

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Configure your environment variables
# Edit .env file with your MongoDB URL and JWT secret
```

**Environment Variables (.env)**

For local development:
```env
MONGO_URL=mongodb://localhost:27017/inventory
JWT_SECRET=your_super_secret_jwt_key
PORT=5175
```

For production deployment, use your cloud MongoDB URL and ensure JWT_SECRET is secure.

### 3. Frontend Setup
```bash
cd ../frontend

# Install dependencies
npm install
```

### 4. Database Seeding
```bash
cd ../server

# Seed initial data (admin user and products)
npm run seed

# Seed categories (run this after the initial seed)
npm run seed-categories
```

### 5. Start the Application
```bash
# Terminal 1 - Start Backend Server
cd server
npm start

# Terminal 2 - Start Frontend Development Server
cd frontend
npm run dev
```

For local development, the application will be available at:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:5175

## Live Deployment

The application is deployed and ready for use:
- **Backend API**: https://stock-flow-management-system.onrender.com
- **API Endpoints**: https://stock-flow-management-system.onrender.com/api

To use the deployed backend with your local frontend, update your `frontend/.env` file:
```env
VITE_API_URL=https://stock-flow-management-system.onrender.com/api
```

## Default Login Credentials

### Admin Account
- **Email**: ashishtkmg@gmail.com
- **Password**: admin

## Usage Guide

### For Administrators
1. **Login** with admin credentials
2. **Manage Categories** - Add, edit, delete product categories
3. **Manage Products** - Full product lifecycle management
4. **Manage Users** - View and manage customer accounts
5. **Process Orders** - Review and fulfill customer orders

### For Customers
1. **Register** a new account or login
2. **Browse Products** - View available inventory
3. **Place Orders** - Add products to orders
4. **Track Orders** - View order status and history
5. **Manage Profile** - Update personal information

## Project Structure

```
inventory/
├── frontend/                 # React.js frontend
│   ├── src/
│   │   ├── components/       # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── context/         # React context providers
│   │   ├── utils/           # Utility functions
│   │   └── assets/          # Static assets
│   └── package.json
├── server/                   # Node.js backend
│   ├── controllers/         # Route controllers
│   ├── middleware/          # Custom middleware
│   ├── models/             # Mongoose models
│   ├── routes/             # API routes
│   ├── seed.js             # Database seeding
│   ├── seedCategories.js   # Category seeding
│   └── package.json
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration

### Categories
- `GET /api/category` - Get all categories
- `POST /api/category/add` - Create new category
- `PUT /api/category/:id` - Update category
- `DELETE /api/category/:id` - Delete category

### Products
- `GET /api/product` - Get all products
- `POST /api/product/add` - Create new product
- `PUT /api/product/:id` - Update product
- `DELETE /api/product/:id` - Delete product

### Orders
- `GET /api/order` - Get orders
- `POST /api/order/add` - Create new order
- `PUT /api/order/:id` - Update order status

### Users
- `GET /api/user` - Get all users (admin only)
- `PUT /api/user/:id` - Update user information

## Features in Detail

### Category Management
- **Synchronized Categories**: Categories are automatically created from product data
- **CRUD Operations**: Full create, read, update, delete functionality
- **Professional UI**: Modern forms with validation and smooth animations
- **Bulk Operations**: Efficient category management tools

### Product Management
- **Category Integration**: Products are linked to managed categories via dropdown
- **Stock Tracking**: Visual indicators for stock levels (Red: Out of stock, Yellow: Low stock, Green: In stock)
- **Search Functionality**: Real-time product search by name
- **Responsive Tables**: Mobile-friendly data presentation

### Animation System
- **Consistent Animations**: Framer Motion animations throughout the application
- **Loading States**: Professional loading indicators
- **Smooth Transitions**: Page transitions and component animations
- **Micro-interactions**: Button hover effects and form interactions

## Development

### Available Scripts

**Backend (server/)**
```bash
npm start          # Start development server
npm run seed       # Seed database with initial data
npm run seed-categories  # Seed categories from existing products
```

**Frontend (frontend/)**
```bash
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
```

## Security Features

- **JWT Authentication** - Secure token-based authentication
- **Password Hashing** - bcryptjs for secure password storage
- **Role-based Access** - Different permissions for admin and customers
- **Protected Routes** - Frontend route protection
- **CORS Configuration** - Secure cross-origin requests

## Deployment

### Production Build
```bash
# Build frontend
cd frontend
npm run build

# The build folder contains production-ready files
```

### Environment Configuration
Ensure production environment variables are properly configured:
- MongoDB connection string
- JWT secret key
- CORS origins
- Port configurations

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Developer

**Stock Flow Management System** - Professional Inventory Management Solution

---

For support or questions, please open an issue in the repository or contact the development team.

**Happy Inventory Managing!**
