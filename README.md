# 🛍️ i-com - Premium E-Commerce Platform

> A modern, full-stack e-commerce solution with powerful admin controls and seamless user experience

[![Live Demo](https://img.shields.io/badge/demo-live-success?style=for-the-badge)](https://github.com/NKG-S/Commercial-website)
[![Report Bug](https://img.shields.io/badge/report-bug-red?style=for-the-badge)](https://github.com/NKG-S/Commercial-website/issues)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](LICENSE)

---

## 🌟 Overview

**i-com** is a sophisticated e-commerce platform designed to bridge the gap between inventory management and customer satisfaction. Built with modern web technologies, it empowers administrators with comprehensive product control while delivering an intuitive shopping experience to customers.

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
      React (Vite), Tailwind CSS, Axios, Context API
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Backend</strong>
    </td>
    <td>
      Node.js, Express.js, JWT, bcryptjs
    </td>
  </tr>
  <tr>
    <td align="center">
      <strong>Database</strong>
    </td>
    <td>
      MongoDB with Mongoose ODM
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
      <strong>Tools</strong>
    </td>
    <td>
      npm, Git, Postman
    </td>
  </tr>
</table>

---

## ✨ Features

### 👤 Customer Experience

- **🔍 Smart Browsing** - Explore products individually or filter by categories for quick discovery
- **⚡ Real-time Search** - Instant product search with dynamic results
- **🛒 Cart Management** - Add, remove, and adjust quantities with ease
- **💳 Flexible Checkout** - Buy single items instantly or checkout your entire cart
- **🔐 Secure Access** - Protected user authentication with encrypted credentials

### 🛡️ Admin Dashboard

- **📊 Inventory Control** - Full CRUD operations on product catalog
- **👁️ Exclusive Visibility** - View and manage out-of-stock items hidden from customers
- **📸 Media Management** - Streamlined image uploads powered by Supabase
- **🎛️ Centralized Hub** - Complete shop management from one interface

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed:
- **Node.js** (v14 or higher)
- **npm** or **yarn**
- **MongoDB Atlas** account
- **Supabase** account

### 📥 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/NKG-S/Commercial-website.git
   cd Commercial-website
   ```

2. **Backend Setup**
   ```bash
   cd commercial-web-back
   npm install
   ```

3. **Frontend Setup**
   ```bash
   cd ../commercial-web-front
   npm install
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

### 🏃 Running the Application

**Terminal 1 - Backend Server:**
```bash
cd commercial-web-back
npm start
# ✅ Server is running on http://localhost:3000 & MongoDB Connected
```

**Terminal 2 - Frontend Client:**
```bash
cd commercial-web-front
npm run dev
# ✅ VITE ready at http://localhost:5173
```

---

## 🔗 API Documentation

### 👤 User Routes (`/api/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/register` | Register a new user account | ❌ |
| `POST` | `/login` | User login & JWT token issue | ❌ |
| `GET` | `/profile` | Retrieve user profile details | ✅ |
| `PUT` | `/profile` | Update user profile information | ✅ |
| `GET` | `/cart` | Get user's cart items | ✅ |
| `POST` | `/cart/:productId` | Add product to cart | ✅ |
| `DELETE` | `/cart/:productId` | Remove product from cart | ✅ |

### 📦 Product Routes (`/api/product`)

| Method | Endpoint | Description | Access Level |
|--------|----------|-------------|--------------|
| `GET` | `/` | Fetch all available products | 🌐 Public |
| `POST` | `/` | Create new product with image | 🛡️ Admin Only |
| `PUT` | `/:productId` | Update product details | 🛡️ Admin Only |
| `DELETE` | `/:productId` | Delete a product | 🛡️ Admin Only |

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

## 🙏 Acknowledgments

- React & Vite teams for the amazing development experience
- MongoDB for the flexible database solution
- Supabase for seamless cloud storage
- Tailwind CSS for the utility-first styling approach

---



**⭐ Star this repository if you find it helpful!**

Made with ❤️ by [Nethmin Kavindu](https://github.com/NKG-S)

