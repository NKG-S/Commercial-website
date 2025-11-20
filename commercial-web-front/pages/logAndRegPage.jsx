import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import LoginCard from '../src/components/LoginCard.jsx';
import RegistrationCard from '../src/components/RegistrationCard.jsx';
import ForgotPasswordCard from '../src/components/ForgotPasswordCard.jsx';

export function LoginAndRegistrationBackground() {
  const location = useLocation();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login');

  // Update mode based on URL
  useEffect(() => {
    if (location.pathname === '/login') {
      setMode('login');
    } 
    else if (location.pathname === '/registration' || location.pathname === '/register') {
      setMode('signup');
    }
    else if (location.pathname === '/forgot-password') {
      setMode('forgot');
    }
  }, [location.pathname]);

  // Switch handlers update both UI + URL
  const goToLogin = () => {
    setMode('login');
    navigate('/login');
  };

  const goToRegister = () => {
    setMode('signup');
    navigate('/registration');
  };

  const goToForgotPassword = () => {
    setMode('forgot');
    navigate('/forgot-password');
  };

  return (
    <div className="w-full h-screen bg-[#EBF5F8] flex items-center justify-center py-10">
      {/* Card Container */}
      <div className="relative w-full h-screen backdrop-blur-xl bg-[#012561] flex items-center justify-center overflow-hidden">

        {/* Stack all three cards with fade animation */}
        <div className="relative w-full flex items-center justify-center min-h-[520px]">

          {/* LOGIN CARD */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center
              transition-opacity duration-500
              ${mode === 'login' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >
            <LoginCard 
              onSwitchToRegister={goToRegister}
              onForgotPassword={goToForgotPassword}
            />
          </div>

          {/* REGISTRATION CARD */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center
              transition-opacity duration-500
              ${mode === 'signup' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >
            <RegistrationCard onSwitchToLogin={goToLogin} />
          </div>

          {/* FORGOT PASSWORD CARD */}
          <div
            className={`
              absolute inset-0 flex items-center justify-center
              transition-opacity duration-500
              ${mode === 'forgot' ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
            `}
          >
            <ForgotPasswordCard onBackToLogin={goToLogin} />
          </div>

        </div>
      </div>
    </div>
  );
}