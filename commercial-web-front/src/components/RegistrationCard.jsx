import axios from 'axios';
import { useState } from 'react';
import toast from 'react-hot-toast';

export default function RegistrationCard(props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const backEndUrlRegistration = "http://localhost:3000/api/user"


  const backEndHandler = async (data) => {
    // console.log("Sending registration data to backend:", data);
    const formattedDataForBackend = {
      email : data.email,
      firstName : data.name,
      lastName : data.name,
      password : data.password
    }
    console.log("Formatted data for backend:", formattedDataForBackend);
    try {
      const res = await axios.post(backEndUrlRegistration, formattedDataForBackend);
      console.log("Backend response:", res.data);
      toast.success(res.data.message);
      // alert(res.data.message);
    } catch (error) {
      console.error("Error during registration:", error);
      toast.error("Registration failed. Please try again.");
      // toast.error(error.message || "Registration failed. Please try again.");
      // alert("Registration failed. Please try again.",error);
    }
  }

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];

    if (password.length >= 8) score++;
    else feedback.push('at least 8 characters');

    if (/[a-z]/.test(password)) score++;
    else feedback.push('a lowercase letter');

    if (/[A-Z]/.test(password)) score++;
    else feedback.push('an uppercase letter');

    if (/[0-9]/.test(password)) score++;
    else feedback.push('a number');

    if (/[^A-Za-z0-9]/.test(password)) score++;
    else feedback.push('a symbol');

    const isValid = score === 5;

    let strengthText = '';
    let strengthColor = '';

    if (password.length === 0) {
      return { score: 0, text: '', color: '', isValid: false, feedback };
    }

    if (score <= 2) {
      strengthText = 'Weak';
      strengthColor = 'bg-red-500';
    } else if (score <= 3) {
      strengthText = 'Fair';
      strengthColor = 'bg-yellow-500';
    } else if (score === 4) {
      strengthText = 'Good';
      strengthColor = 'bg-blue-500';
    } else {
      strengthText = 'Strong';
      strengthColor = 'bg-green-500';
    }

    return { score, text: strengthText, color: strengthColor, isValid, feedback };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }

    if (name === 'password') {
      const strength = checkPasswordStrength(value);
      setPasswordStrength(strength);
      
      if (formData.confirmPassword) {
        setPasswordMatch(value === formData.confirmPassword);
      }
    }
    
    if (name === 'confirmPassword') {
      setPasswordMatch(value === formData.password);
    }
  };

  const handleSubmit = () => {
    const newErrors = {};

    // Validate name
    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const strength = checkPasswordStrength(formData.password);
      if (!strength.isValid) {
        newErrors.password = `Password must contain: ${strength.feedback.join(', ')}`;
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      setPasswordMatch(false);
    }

    // Validate terms
    if (!agreedToTerms) {
      newErrors.terms = 'You must agree to the Terms of Service and Privacy Policy';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // console.log('Register:', formData);
    backEndHandler(formData);
  };

  const handleGoogleRegister = () => {
    console.log('Google registration clicked');
  };

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-300 mb-8">Sign up to get started</p>

        <div className="space-y-5">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.name ? 'focus:ring-red-500/50' : 'focus:ring-purple-500/50'} focus:border-transparent transition-all`}
              placeholder="John Doe"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-400">{errors.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-email" className="block text-sm font-medium text-gray-200 mb-2">
              Email Address
            </label>
            <input
              type="email"
              id="reg-email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.email ? 'focus:ring-red-500/50' : 'focus:ring-purple-500/50'} focus:border-transparent transition-all`}
              placeholder="you@example.com"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-400">{errors.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="reg-password" className="block text-sm font-medium text-gray-200 mb-2">
              Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="reg-password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 ${errors.password ? 'focus:ring-red-500/50' : 'focus:ring-purple-500/50'} focus:border-transparent transition-all`}
                placeholder="••••••••"
              />

              {/* Toggle button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showPassword ? "⌣" : "👁️"}
              </button>
            </div>

            {formData.password && passwordStrength.text && (
              <div className="mt-2">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-gray-300">Password Strength:</span>
                  <span className={`text-xs font-semibold ${
                    passwordStrength.score <= 2 ? 'text-red-400' :
                    passwordStrength.score <= 3 ? 'text-yellow-400' :
                    passwordStrength.score === 4 ? 'text-blue-400' : 'text-green-400'
                  }`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div
                    className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  ></div>
                </div>
              </div>
            )}

            {errors.password && (
              <p className="mt-1 text-sm text-red-400">{errors.password}</p>
            )}
          </div>


          <div>
          <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-200 mb-2">
            Confirm Password
          </label>

          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              id="confirm-password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                errors.confirmPassword
                  ? 'border-red-500 focus:ring-red-500/50'
                  : passwordMatch 
                    ? 'border-white/10 focus:ring-purple-500/50' 
                    : 'border-red-500/50 focus:ring-red-500/50'
              }`}
              placeholder="••••••••"
            />

            {/* Toggle button */}
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
            >
              {showConfirmPassword ? "⌣" : "👁️"}
            </button>
          </div>

          {!passwordMatch && formData.confirmPassword && !errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">Passwords do not match</p>
          )}
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>
          )}
        </div>


          <div>
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) {
                    setErrors(prev => ({ ...prev, terms: '' }));
                  }
                }}
                className="w-4 h-4 mt-1 rounded bg-white/5 border-white/10 cursor-pointer" 
              />
              <span className="ml-2 text-sm text-gray-300">
                I agree to the{' '}
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button className="text-blue-400 hover:text-blue-300 transition-colors">
                  Privacy Policy
                </button>
              </span>
            </div>
            {errors.terms && (
              <p className="mt-1 text-sm text-red-400">{errors.terms}</p>
            )}
          </div>

          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transform hover:scale-[1.02] transition-all"
          >
            Create Account
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
          onClick={handleGoogleRegister}
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
          Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account?{' '}
          <button
            onClick={props.onSwitchToLogin}
            className="text-blue-400 hover:text-blue-300 font-semibold transition-colors"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}