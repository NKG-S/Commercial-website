// commercial-web-front/src/App.jsx
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
// Pages
import Home from '../pages/home.jsx';
import { LoginAndRegistrationBackground } from '../pages/logAndRegPage.jsx';
import { AdminProductPage } from '../pages/adminProductPage.jsx';
import ProductPage from '../pages/productPage.jsx';
import ProductDetailsPage from '../pages/ProductDetailsPage.jsx';
import CategoryPage from '../pages/categoryPage.jsx';
import CategoryShowPage from '../pages/CategoryShowPage.jsx';
import CartPage from '../pages/cartPage.jsx';
// Components
import UserProfileCard from '../src/components/UserProfileCard.jsx';
import Settings from '../src/components/Settings.jsx';
import PurchaseCard from '../src/components/PurchaseCard.jsx';
import ContactUs from '../src/components/ContactUs.jsx';
import Footer from '../src/components/Footer.jsx';
import CartCheckout from '../src/components/CartCheckout.jsx';
// Protected Route
import ProtectedRoute from '../src/components/ProtectedRoute.jsx';
import Header from '../src/components/Header.jsx';

// Layout wrapper component
function Layout({ children }) {
  const location = useLocation();
  
  // Pages that should NOT show Header/Footer
  const noHeaderFooterRoutes = ['/login', '/registration', '/forgot-password'];
  const showHeaderFooter = !noHeaderFooterRoutes.includes(location.pathname);

  return (
    <div className="flex flex-col min-h-screen w-full bg-[#012561] text-secondary">
      {showHeaderFooter && <Header />}
      
      <main className="flex-1 w-full">
        {children}
      </main>
      
      {showHeaderFooter && <Footer />}
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" duration={4000} />
      <Layout>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginAndRegistrationBackground />} />
          <Route path="/registration" element={<LoginAndRegistrationBackground />} />
          <Route path="/forgot-password" element={<LoginAndRegistrationBackground />} />
          
          {/* Public Browsing */}
          <Route path="/product" element={<ProductPage />} />
          <Route path="/product/:productId" element={<ProductDetailsPage />} />
          <Route path="/category" element={<CategoryPage />} />
          <Route path="/category/:categoryName" element={<CategoryShowPage />} />
          <Route path="/contact" element={<ContactUs />} />
          
          {/* Protected: Any Logged-in User */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <UserProfileCard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cart"
            element={
              <ProtectedRoute>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/checkout"
            element={
              <ProtectedRoute>
                <CartCheckout />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase/:productId"
            element={
              <ProtectedRoute>
                <PurchaseCard />
              </ProtectedRoute>
            }
          />
          
          {/* Admin Only */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute adminOnly={true}>
                <AdminProductPage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;