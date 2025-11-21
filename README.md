<div align="center">

# 🛍️ i-com - Premium E-Commerce Platform

### A full-stack e-commerce application built with the MERN stack, featuring product management, user authentication, shopping cart functionality, and order placement.

![MERN Stack](https://img.shields.io/badge/MERN-Stack-blue?style=flat-square)
![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat&logo=mongodb&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat&logo=express&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat&logo=react&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat&logo=nodedotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=flat&logo=supabase&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=flat&logo=jsonwebtokens&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=flat&logo=vite&logoColor=white)
[![GitHub](https://img.shields.io/badge/github-repo-black?style=for-the-badge&logo=github)](https://github.com/NKG-S/Commercial-website)


</div>


---

## 🌟 Overview

**i-com** is a modern e-commerce platform that enables users to browse, search, and purchase products seamlessly. Administrators have full control over product inventory with capabilities to add, edit, delete, and manage products. The platform features real-time cart management, secure JWT authentication, cloud-based image storage, and a responsive design optimized for all devices. Built with the MERN stack and enhanced with modern tools like Vite and Tailwind CSS, i-com delivers an enterprise-grade shopping experience.

### Key Highlights

- 🎨 **Modern UI/UX** - Clean, responsive design built with Tailwind CSS
- 🔐 **Secure Authentication** - JWT-based user authentication system
- 📦 **Advanced Inventory** - Real-time stock management with admin controls
- 🖼️ **Cloud Storage** - Seamless image handling via Supabase
- 🛒 **Smart Cart System** - Flexible checkout with individual or bulk purchases

---

## 🛠️ Tech Stack

<table>
  <tr>
    <td align="center" width="150">
      <strong>Frontend</strong>
    </td>
    <td>
      React.js (v18+), Vite, Tailwind CSS, Context API, Axios, React Hot Toast, Lucide React, React Router v6
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Backend</strong>
    </td>
    <td>
      Node.js, Express.js, JWT (Authentication), bcryptjs (Security)
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Database</strong>
    </td>
    <td>
      MongoDB (MongoDB Atlas) with Mongoose ODM
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Storage</strong>
    </td>
    <td>
      Supabase Cloud Storage
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Tools & Services</strong>
    </td>
    <td>
      npm, Git & GitHub, ESLint, Postman
    </td>
  </tr>
</table>


---


## ✨ Features

### 👤 User Features
- ✅ **User Authentication** - Secure sign up, login, and password recovery
- ✅ **Browse Products** - View all available products with detailed information
- ✅ **Product Search** - Real-time search by name, brand, or category
- ✅ **Category Browsing** - Explore products organized by intuitive categories
- ✅ **Product Details** - View comprehensive specifications, images, and pricing
- ✅ **Shopping Cart** - Add/remove items and manage quantities seamlessly
- ✅ **Place Orders** - Flexible checkout to purchase individual items or entire cart
- ✅ **User Profile** - View and update personal information and preferences
- ✅ **Order History** - Track and review all placed orders
- ✅ **Account Settings** - Change password and delete account options

### 🔐 Admin Features
- ✅ **Product Management** - Complete CRUD operations (Create, Read, Update, Delete)
- ✅ **Inventory Control** - Manage stock levels and product availability status
- ✅ **Product Search** - Quickly find and filter products in inventory
- ✅ **View All Products** - Access both available and unavailable items
- ✅ **Image Management** - Upload and manage product images via Supabase cloud storage
- ✅ **User Management** - View all registered users and their information
- ✅ **Admin Dashboard** - Centralized control panel for all administrative operations

### 🔒 Security Features
- ✅ **JWT Authentication** - Token-based secure authentication system
- ✅ **Role-Based Access Control** - Separate permissions for Users and Admins
- ✅ **Password Hashing** - bcryptjs encryption for password security
- ✅ **Secure Cloud Storage** - Protected image storage with Supabase
- ✅ **Input Validation** - Server-side validation and data sanitization
- ✅ **Protected API Routes** - Middleware-based route protection
- ✅ **CORS Configuration** - Cross-Origin Resource Sharing security

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Supabase** account

### 📥 Installation

### Prerequisites

Before you begin, ensure you have the following installed on your system:

| Requirement | Minimum Version | Download Link |
|------------|----------------|---------------|
| Node.js | v14.x or higher | [nodejs.org](https://nodejs.org/) |
| npm | v6.x or higher | Comes with Node.js |
| Git | Latest | [git-scm.com](https://git-scm.com/) |
| MongoDB Atlas Account | - | [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas) |
| Supabase Account | - | [supabase.com](https://supabase.com) |

### Verify Installation:
```bash
node --version  # Should show v14.x or higher
npm --version   # Should show v6.x or higher
git --version   # Should show installed version
```

### Step-by-Step Installation

**1️⃣ Clone the Repository**

```bash
git clone https://github.com/NKG-S/Commercial-website.git
cd Commercial-website
```

**2️⃣ Install Backend Dependencies**

```bash
cd commercial-web-back
npm install
```

Expected packages to be installed:
- express
- mongoose
- jsonwebtoken
- bcryptjs
- cors
- dotenv
- @supabase/supabase-js

**3️⃣ Install Frontend Dependencies**

```bash
cd ../commercial-web-front
npm install
```

Expected packages to be installed:
- react
- react-dom
- react-router-dom
- axios
- tailwindcss
- lucide-react
- react-hot-toast
- vite


**4️⃣ Configure Environment Variables**

```bash
# Navigate to backend directory
cd ../commercial-web-back

# Create .env file (or copy from .env.example if available)
touch .env

# Open .env in your text editor and add all required variables
# See the "Environment Variables" section above for details
```

**5️⃣ Set Up Supabase Storage Bucket**

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Storage** in the sidebar
4. Click **New Bucket**
5. Create a bucket named `images` (or match your `SUPABASE_BUCKET` value)
6. Set the bucket to **Public** if you want direct image access

**6️⃣ Verify Installation**

```bash
# Check if all dependencies are installed correctly
cd commercial-web-back
npm list --depth=0

cd ../commercial-web-front
npm list --depth=0
```


### 🔑 Environment Configuration

Create a `.env` file in the `commercial-web-back` directory:

```env
# MongoDB Configuration
MONGO_URL=your_mongodb_atlas_connection_string

# JWT Configuration
JWT_SECRET=your_secure_random_string_for_token_signing

# Supabase Configuration
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_public_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
SUPABASE_BUCKET=images
```

---

## 🚀 Run Locally

To run the application, you need to start both the **backend server** and **frontend client** in separate terminal windows.

### 🖥️ Terminal 1: Start Backend Server

```bash
# Navigate to backend directory
cd commercial-web-back

# Start the Express server
npm start
```

**✅ Expected Output:**
```
Server is running on http://localhost:3000
MongoDB Connected Successfully
```

**🔍 Troubleshooting:**
- If you see "MongoDB connection error", check your `MONGO_URL` in `.env`
- If port 3000 is in use, kill the process: `lsof -ti:3000 | xargs kill -9` (Mac/Linux)
- Check if all environment variables are properly set

### 🌐 Terminal 2: Start Frontend Client

```bash
# Navigate to frontend directory (open a new terminal)
cd commercial-web-front

# Start the Vite development server
npm run dev
```

**✅ Expected Output:**
```
VITE v5.x.x ready in xxx ms

➜ Local:   http://localhost:5173/
➜ Network: use --host to expose
➜ press h + enter to show help
```

### 🎯 Access the Application

- **Frontend Application:** Open your browser and visit **`http://localhost:5173`**
- **Backend API:** Running at **`http://localhost:3000`**
- **API Health Check:** Visit **`http://localhost:3000/api/health`** (if implemented)

### 🛑 Stopping the Application

- Press `Ctrl + C` in both terminal windows to stop the servers

### 📝 Additional Commands

```bash
# Backend commands
npm start          # Start server
npm run dev        # Start with nodemon (auto-restart)
npm test           # Run tests (if available)

# Frontend commands
npm run dev        # Start development server
npm run build      # Build for production
npm run preview    # Preview production build
npm run lint       # Run ESLint
```

---

## 🔗 API Documentation

### 👤 User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/check-email` | Check if email exists | ❌ |
| `POST` | `/` | Register new user | ❌ |
| `POST` | `/login` | User login | ❌ |
| `GET` | `/profile` | Get user profile | ✅ |
| `PUT` | `/profile` | Update profile | ✅ |
| `DELETE` | `/profile` | Delete account | ✅ |
| `POST` | `/cart/:productId` | Add to cart | ✅ |
| `GET` | `/cart` | Get cart items | ✅ |
| `DELETE` | `/cart/:productId` | Remove from cart | ✅ |


### 📦 Product Routes (`/api/product`)

| Method | Endpoint | Description | Access | Request Body |
|--------|----------|-------------|--------|--------------|
| `GET` | `/` | Get all products | 🌐 Public |
| `POST` | `/` | Create product | 🛡️ Admin |
| `GET` | `/:productId` | Get single product | 🌐 Public |
| `PUT` | `/:productId` | Update product | 🛡️ Admin |
| `DELETE` | `/:productId` | Delete product | 🛡️ Admin |

---

## 📁 Project Structure

```
Commercial-website/
│
├── commercial-web-back/          # Express.js Backend
│   ├── Controllers/              # Business Logic Layer
│   │   ├── userController.js
│   │   └── productController.js
│   ├── Routes/                   # API Route Definitions
│   │   ├── userRoutes.js
│   │   └── productRoutes.js
│   ├── Modules/                  # Mongoose Models
│   │   ├── User.js
│   │   └── Product.js
│   ├── index.js                  # Server Entry Point
│   └── .env                      # Environment Variables
│
└── commercial-web-front/         # React Frontend
    ├── src/
    │   ├── components/           # Reusable UI Components
    │   │   ├── Navbar.jsx
    │   │   ├── ProductCard.jsx
    │   │   └── Cart.jsx
    │   ├── pages/                # Page Components
    │   │   ├── Home.jsx
    │   │   ├── Products.jsx
    │   │   └── Admin.jsx
    │   ├── context/              # State Management
    │   │   └── AuthContext.jsx
    │   ├── App.jsx               # Main Application
    │   └── main.jsx              # React Entry Point
    └── package.json
```

### 📂 Key Directories Explained:

- **Controllers**: Handle business logic and database operations
- **Routes**: Define API endpoints and link them to controllers
- **Modules**: Mongoose schemas that define data structure
- **Middleware**: Functions that process requests before reaching controllers
- **Components**: Reusable React UI elements
- **Pages**: Full-page React components representing different routes
- **Context**: Global state management using React Context API
- **Utils**: Helper functions and API configuration

---

## 🔑 Key Features Explained

### 🔐 Authentication Flow

1. **User Registration**
   - User submits email and password
   - Backend validates input data
   - Password is hashed using bcryptjs with salt rounds
   - User data saved to MongoDB
   - Success response sent to client

2. **User Login**
   - User provides credentials
   - Backend verifies email exists
   - Password compared with hashed version
   - JWT token generated with user ID and role
   - Token sent to client and stored in localStorage

3. **Protected Routes**
   - Client sends JWT token in Authorization header
   - Backend middleware verifies token validity
   - User data extracted from token
   - Request proceeds if valid, otherwise 401 error

4. **Session Persistence**
   - Token stored in browser localStorage
   - Automatically included in API requests
   - Token remains valid until expiration
   - User stays logged in across page refreshes

### 🛡️ Admin Product Management

1. **Add Products**
   - Admin uploads product details and image
   - Image sent to Supabase cloud storage
   - Supabase returns public URL
   - Product data with image URL saved to MongoDB
   - Product appears in user catalog

2. **Edit Products**
   - Admin updates product information
   - If new image uploaded, old image replaced in Supabase
   - MongoDB document updated with new data
   - Changes reflected immediately

3. **Delete Products**
   - Admin initiates product deletion
   - Image removed from Supabase storage
   - Product document deleted from MongoDB
   - Product removed from all user carts

4. **Availability Control**
   - Admin can mark products as available/unavailable
   - Unavailable products hidden from regular users
   - Admins can still view and manage them
   - Useful for out-of-stock or seasonal items

### 🛒 Shopping Experience

1. **Browse Products**
   - Users view all available products
   - Products displayed in responsive grid
   - Each card shows image, name, price, category
   - Click for detailed view

2. **Search & Filter**
   - Real-time search by product name
   - Filter by categories
   - Sort by price, name, or date added
   - Instant results without page reload

3. **Product Details**
   - View full product information
   - See high-quality images
   - Read detailed descriptions
   - Check availability and stock

4. **Cart Management**
   - Add products with desired quantities
   - Update quantities in cart
   - Remove unwanted items
   - View total price calculation
   - Cart persists across sessions

5. **Checkout Process**
   - Option to buy single item instantly
   - Or proceed with entire cart
   - Review order summary
   - Confirm purchase
   - Receive order confirmation

---

## 🚨 Common Issues & Solutions

### ❌ Issue: `MONGO_URL is missing` or MongoDB connection fails

**Solution:**
1. Ensure `.env` file exists in `commercial-web-back` directory
2. Verify `MONGO_URL` is correctly formatted:
   ```env
   MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/database
   ```
3. Check MongoDB Atlas:
   - Network Access: Add your IP address (or 0.0.0.0/0 for development)
   - Database Access: Ensure user credentials are correct
4. Test connection string in MongoDB Compass

### ❌ Issue: Supabase image upload fails

**Solution:**
1. Verify all Supabase credentials in `.env`:
   ```env
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_ANON_KEY=your-anon-key
   SUPABASE_SERVICE_ROLE_KEY=your-service-key
   SUPABASE_BUCKET=images
   ```
2. Check Supabase Dashboard:
   - Ensure storage bucket exists
   - Verify bucket is set to Public
   - Check storage policies allow uploads
3. Test with a small image file first

### ❌ Issue: CORS errors in browser console

**Solution:**
```javascript
// Ensure backend has CORS configured (in index.js)
const cors = require('cors');
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));
```

### ❌ Issue: Port 3000 already in use

**Solution:**
```bash
# On Mac/Linux:
lsof -ti:3000 | xargs kill -9

# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID> /F

# Or change port in backend index.js:
const PORT = process.env.PORT || 3001;
```

### ❌ Issue: JWT token expires too quickly

**Solution:**
```javascript
// Adjust token expiration in your auth controller
const token = jwt.sign(
  { userId: user._id, role: user.role },
  process.env.JWT_SECRET,
  { expiresIn: '7d' } // Change from '1d' to '7d' or '30d'
);
```

### ❌ Issue: Frontend can't connect to backend

**Solution:**
1. Ensure backend is running on `http://localhost:3000`
2. Check axios baseURL in frontend:
   ```javascript
   // In utils/api.js or similar
   const api = axios.create({
     baseURL: 'http://localhost:3000/api'
   });
   ```
3. Verify no typos in API endpoints

### ❌ Issue: Images not displaying

**Solution:**
1. Check browser console for CORS errors
2. Verify image URLs are correct in MongoDB
3. Ensure Supabase bucket is set to Public
4. Check network tab in DevTools for failed requests

### ❌ Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install

# If still failing, try with legacy peer deps
npm install --legacy-peer-deps
```

---

## 📸 Screenshots

<div align="center">

### 🏠 Home Page
![Home Page](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Home.png)
*Modern hero section with featured products, categories, and promotional banners*

---

### 📦 Product Listing
![Product Listing](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Product.png)
*Responsive product grid with real-time search, category filters, and sorting options*

---

### 🔍 Product Details
![Product View](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Product_view.png)
*Detailed product information with images, specifications, and purchase options*

---

### 🗂️ Category Navigation
![Category](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Category.png)
*Browse products organized by intuitive categories*

---

### 📂 Category Product View
![Category View](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Catagory_view.png)
*Filtered product display based on selected category*

---

### 🛒 Shopping Cart
![Shopping Cart](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/cart.png)
*Interactive cart with quantity controls and price calculations*

---

### 💳 Cart Checkout
![Cart Checkout](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Cart_checkout.png)
*Seamless checkout process for entire cart*

---

### 🛍️ Product Checkout
![Product Checkout](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Product_checkout.png)
*Quick checkout option for individual products*

---

### 👤 User Profile (View Mode)
![Profile Uneditable](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Profile_uneditable.png)
*User profile dashboard displaying personal information*

---

### ✏️ User Profile (Edit Mode)
![Profile Editable](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Profile_editable.png)
*Edit and update user profile information*

---

### 📧 Contact Us
![Contact Us](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Contact_Us.png)
*Customer support and inquiry contact form*

---

### 🛡️ Admin Dashboard
![Admin Dashboard](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Admin.png)
*Comprehensive admin panel for inventory management and user oversight*

---

### ➕ Add Product (Admin)
![Add Product](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Add_Priduct.png)
*Admin interface for creating new products with image upload*

---

### ✏️ Edit Product (Admin)
![Edit Product](https://raw.githubusercontent.com/NKG-S/Commercial-website/main/Images/Edit_Product.png)
*Admin interface for updating existing product details*

</div>

---


## 🔗 Useful Links

### 📚 Official Documentation
- 🍃 **MongoDB Atlas**: [https://www.mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- ⚡ **Supabase**: [https://supabase.com](https://supabase.com)
- ⚛️ **React**: [https://react.dev](https://react.dev)
- 🚂 **Express**: [https://expressjs.com](https://expressjs.com)
- 🎨 **Tailwind CSS**: [https://tailwindcss.com](https://tailwindcss.com)
- 📘 **Mongoose**: [https://mongoosejs.com](https://mongoosejs.com)
- ⚡ **Vite**: [https://vitejs.dev](https://vitejs.dev)

### 🛠️ Tools & Resources
- 📦 **GitHub Repository**: [https://github.com/NKG-S/Commercial-website](https://github.com/NKG-S/Commercial-website)
- 🔑 **JWT.io**: [https://jwt.io](https://jwt.io)
- 📮 **Postman**: [https://www.postman.com](https://www.postman.com)
- 🎨 **Lucide Icons**: [https://lucide.dev](https://lucide.dev)
- 📊 **Can I Use**: [https://caniuse.com](https://caniuse.com)

### 🎓 Learning Resources
- [MongoDB University](https://university.mongodb.com/) - Free MongoDB courses
- [React Official Tutorial](https://react.dev/learn) - Learn React from scratch
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices) - Node.js tips
- [Tailwind CSS Tutorial](https://tailwindcss.com/docs) - Master utility-first CSS

---

## 🤝 Contributing

Contributions make the open-source community an amazing place to learn and create. Any contributions you make are **greatly appreciated**!

1. **Fork the Project**
2. **Create your Feature Branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your Changes**
   ```bash
   git commit -m 'Add some AmazingFeature'
   ```
4. **Push to the Branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**

---

## 👨‍💻 Author

**Nethmin Kavindu**

- 🌐 GitHub: [@NKG-S](https://github.com/NKG-S)
- 📧 Email: nethminkavindu@gmail.com
- 💼 LinkedIn: [nethminkavindu](https://linkedin.com/in/nethminkavindu)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

## 🙏 Acknowledgments

- React & Vite teams for the amazing development experience
- MongoDB for the flexible database solution
- Supabase for seamless cloud storage
- Tailwind CSS for the utility-first styling approach

---



**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Nethmin Kavindu](https://github.com/NKG-S)

