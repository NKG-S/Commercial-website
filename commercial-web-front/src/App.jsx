
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'
import { AdminProductPage } from '../pages/adminProductPage.jsx'
import { LoginAndRegistrationBackground } from '../pages/logAndRegPage.jsx'
import ProductCard from './components/ProductCard.jsx'
import { Toaster } from 'react-hot-toast'
import Home from '../pages/home.jsx'




function App() {

  return (
    <BrowserRouter>
      <Toaster position='top-center' duration='4000' />
      <div className="w-full h-screen bg-[#012561] text-secondary">
        {/* <Header/> */}



        <Routes>
          <Route path="/home" element={<Home />} />
          <Route path="/login" element={<LoginAndRegistrationBackground/>} />
          <Route path="/registration" element={<LoginAndRegistrationBackground/>} />
          <Route path="/forgot-password" element={<LoginAndRegistrationBackground />} />
          <Route path="/register" element={<h1>Register</h1>} />
          <Route path="/admin" element={<AdminProductPage/>} />
          <Route path="/product" element={<ProductCard />} />
        </Routes>
        
      </div>
    </BrowserRouter>
  )
}

export default App
