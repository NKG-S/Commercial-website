import axios from 'axios';
import { useState } from 'react';
import {toast} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom'



export default function LoginCard(props) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate()

  const backEndUrlLogin = "http://localhost:3000/api/user/login"

  const backEndHandler = async (data) => {
    const formattedDataForBackend = {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
    };
    console.log("Sending login data to backend:", formattedDataForBackend);


    try {
      const res = await axios.post(backEndUrlLogin, formattedDataForBackend);
      // console.log("Login successful:", res.data);
      toast.success(res.data.message);
      console.log("Backend response:", res.data.userdata);

      // If your backend returns a token (most do), save it
      if (res.data.token) {
        localStorage.setItem("token", res.data.token)
        if (res.data.user) { 
          localStorage.setItem("user", JSON.stringify(res.data.user))
          localStorage.setItem("isLoggedIn", "true");
        }
      }
      if (props.onLoginSuccess) { props.onLoginSuccess(res.data)}

      if (res.data.userdata && res.data.userdata.role == 'admin') {
        navigate("/admin");
      } else {
        navigate("/home");
      } 
      // else if (res.data.userdata && res.data.userdata.role == 'customer') {
      //   navigate("/home");
      // }

    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.message || error.message);
    }
  };




  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };


  const handlePasswordChange = (e) => {
    const newPassword = e.target.value;
    setPassword(newPassword);
    if (errors.password) {
      setErrors(prev => ({ ...prev, password: '' }));
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors(prev => ({ ...prev, email: '' }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const newErrors = {};

    // Validate email
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!password) {
      newErrors.password = 'Password is required';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Submit data
    const loginData = {
      email: email,
      password: password,
      rememberMe: rememberMe
    };
    console.log('Login:', loginData);
    backEndHandler(loginData);
  };

  const handleGoogleLogin = () => {
    console.log('Google login clicked');
  };

  const handleForgotPassword = () => {
    if (props.onForgotPassword) {
      props.onForgotPassword();
    }
  };

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Welcome Back</h2>
        <p className="text-gray-300 mb-8">Sign in to continue</p>

        <div className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500/50' : 'focus:ring-blue-500/50'} focus:border-transparent transition-all`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className={`w-full px-4 py-3 bg-white/5 border ${
                  errors.password ? 'border-red-500' : 'border-white/10'
                } rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${
                  errors.password ? 'focus:ring-red-500/50' : 'focus:ring-blue-500/50'
                } focus:border-transparent transition-all`}
                placeholder="••••••••"
              />

              {/* Eye button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? "⌣" : "👁️"}
              </button>
            </div>
          </div>


          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded bg-white/5 border-white/10" 
              />
              <span className="ml-2 text-sm text-gray-300">Remember me</span>
            </label>
            <button 
              onClick={handleForgotPassword}
              className="text-sm text-blue-400 hover:text-blue-300 transition-colors"
            >
              Forgot password?
            </button>
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-lg hover:from-blue-600 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transform hover:scale-[1.02] transition-all"
          >
            Sign In
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-white/10"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-4 bg-transparent text-gray-400">Or continue with</span>
          </div>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="w-full py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20 transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="currentColor"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="currentColor"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="currentColor"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="currentColor"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          Sign in with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-300">
          Don't have an account?{' '}
          <button
            onClick={props.onSwitchToRegister}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}