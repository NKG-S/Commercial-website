import axios from 'axios';
import { useState, useCallback, useEffect } from 'react';
import { UploadCloud, FileText, X } from 'lucide-react';
import toast from 'react-hot-toast';

// --- Mock SupabaseUploader (Included for functionality) ---
const uploadProfilePicture = async (file) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (!file) reject("No file provided");
      // Return a dummy URL for demonstration
      console.log("Mock upload complete for:", file.name);
      resolve(`https://api.dicebear.com/7.x/avataaars/svg?seed=${Date.now()}`);
    }, 1500);
  });
};

// --- ImageUpload Component ---
function ImageUpload({ onFilesChange }) {
  const [selectedFiles, setSelectedFiles] = useState([]);
  const MAX_FILES = 1;

  useEffect(() => {
    if (onFilesChange) {
      onFilesChange(selectedFiles);
    }
  }, [selectedFiles, onFilesChange]);

  const handleNewFiles = useCallback((newFiles) => {
    if (!newFiles || newFiles.length === 0) return;

    const filesArray = Array.from(newFiles);
    const imageFiles = filesArray.filter(file => file.type.startsWith('image/'));
    
    setSelectedFiles(prevFiles => {
      const allFiles = [...prevFiles, ...imageFiles];
      const validFiles = allFiles.slice(0, MAX_FILES);
      return validFiles;
    });
  }, [MAX_FILES]);

  const handleFileChange = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      handleNewFiles(event.target.files);
    }
    event.target.value = '';
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
      handleNewFiles(event.dataTransfer.files);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
  };

  const removeFile = useCallback((indexToRemove) => {
    setSelectedFiles(prevFiles => 
      prevFiles.filter((_, index) => index !== indexToRemove)
    );
  }, []);

  const isLimitReached = selectedFiles.length >= MAX_FILES;

  return (
    <div className="border border-white/20 rounded-xl p-4 bg-white/5">
      <h3 className="text-base font-semibold text-gray-200 mb-3">
        Profile Picture ({selectedFiles.length}/{MAX_FILES})
      </h3>

      <div className="flex items-center justify-center w-full">
        <label 
          htmlFor="dropzone-file" 
          className={`flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg transition-all duration-300 
            ${isLimitReached 
              ? 'bg-white/5 border-white/20 cursor-not-allowed text-gray-500' 
              : 'bg-purple-500/10 border-purple-400/50 cursor-pointer hover:bg-purple-500/20 text-purple-300'
            }`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center pt-2 pb-3">
            <UploadCloud className="w-6 h-6 mb-1" />
            {isLimitReached ? (
              <p className="text-sm font-medium">Profile picture uploaded</p>
            ) : (
              <p className="text-sm font-medium">Click to select or Drag & Drop</p>
            )}
            <p className="text-xs mt-1 text-gray-400">(Max {MAX_FILES} image)</p>
          </div>
          <input 
            id="dropzone-file" 
            type="file" 
            className="hidden"
            onChange={handleFileChange}
            accept="image/*" 
            disabled={isLimitReached}
          />
        </label>
      </div>
      
      {selectedFiles.length > 0 && (
        <ul className="mt-4 space-y-2">
          {selectedFiles.map((file, index) => (
            <li 
              key={`${file.name}-${index}`}
              className="flex items-center justify-between p-2 bg-white/10 border border-white/20 rounded-md"
            >
              <div className="flex items-center min-w-0 flex-1">
                <FileText className="w-4 h-4 mr-2 text-purple-400 flex-shrink-0" />
                <span className="text-xs font-medium text-gray-200 truncate">{file.name}</span>
                <span className="ml-2 text-[10px] text-gray-400 flex-shrink-0">
                  ({(file.size / 1024).toFixed(1)} KB)
                </span>
              </div>
              <button
                type="button"
                onClick={() => removeFile(index)}
                className="p-1 rounded-full hover:bg-red-500/20 text-red-400 transition-colors duration-150 flex-shrink-0 ml-4"
              >
                <X className="w-3 h-3" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

// --- RegistrationCard Component ---
export default function RegistrationCard(props) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [profileImage, setProfileImage] = useState([]);
  const [errors, setErrors] = useState({});
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, text: '', color: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const URL = "http://localhost:3000";

  // API Endpoints - Must match backend routes
  const backEndUrlRegistration = `${URL}/api/user`;
  const checkEmailUrl = `${URL}/api/user/check-email`; 

  const handleFilesChange = (files) => {
    setProfileImage(files);
  };

  // --- Main Registration Flow ---
  const backEndHandler = async (data) => {
    const toastId = 'registrationFlow'; 
    setIsSubmitting(true);

    try {
      // 1. CHECK EMAIL AVAILABILITY
      toast.loading("Checking email availability...", { id: toastId });
      
      try {
        // Calls the new 'checkEmail' controller function
        await axios.post(checkEmailUrl, { email: data.email });
      } catch (emailError) {
        if (emailError.response && emailError.response.status === 409) {
          throw new Error("This email is already registered.");
        }
        console.error("Email check failed:", emailError);
        throw new Error(emailError.response?.data?.message || "Failed to validate email.");
      }

      // 2. UPLOAD IMAGE (Only if email check passes)
      let imageUrl = ["/default_user.jpg"];

      if (data.image && data.image instanceof File) {
        toast.loading("Uploading profile picture...", { id: toastId });
        try {
          const uploadedUrl = await uploadProfilePicture(data.image);
          if (uploadedUrl) {
            imageUrl = [uploadedUrl];
            console.log("Image uploaded successfully:", uploadedUrl);
          }
        } catch (uploadError) {
          console.error("Upload error:", uploadError);
          toast.error("Failed to upload image. Using default.", { id: toastId });
        }
      }

      // 3. FINAL REGISTRATION
      toast.loading("Creating account...", { id: toastId });

      const formattedDataForBackend = {
        email: data.email,
        firstName: data.name,
        lastName: data.name,
        password: data.password,
        image: imageUrl // Sends Array<String>
      };

      console.log("Sending final data:", formattedDataForBackend);
      
      const res = await axios.post(backEndUrlRegistration, formattedDataForBackend);
      
      toast.success(res.data.message || "Registration Successful!", { id: toastId });

      // Clean up
      setFormData({ name: '', email: '', password: '', confirmPassword: '' });
      setProfileImage([]);
      setAgreedToTerms(false);

      // --- Added: Automatic Navigation to Login ---
      if (props.onSwitchToLogin) {
        // Slight delay to allow the user to see the "Success" toast
        setTimeout(() => {
          props.onSwitchToLogin();
        }, 2000); 
      }

    } catch (error) {
      console.error("Registration Process Error:", error);
      toast.error(error.message || "Registration failed.", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const checkPasswordStrength = (password) => {
    let score = 0;
    let feedback = [];
    if (password.length >= 8) score++; else feedback.push('at least 8 characters');
    if (/[a-z]/.test(password)) score++; else feedback.push('a lowercase letter');
    if (/[A-Z]/.test(password)) score++; else feedback.push('an uppercase letter');
    if (/[0-9]/.test(password)) score++; else feedback.push('a number');
    if (/[^A-Za-z0-9]/.test(password)) score++; else feedback.push('a symbol');
    
    let strengthText = '';
    let strengthColor = '';
    if (score <= 2) { strengthText = 'Weak'; strengthColor = 'bg-red-500'; }
    else if (score <= 3) { strengthText = 'Fair'; strengthColor = 'bg-yellow-500'; }
    else if (score === 4) { strengthText = 'Good'; strengthColor = 'bg-blue-500'; }
    else { strengthText = 'Strong'; strengthColor = 'bg-green-500'; }

    return { score, text: strengthText, color: strengthColor, isValid: score === 5, feedback };
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));

    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
      if (formData.confirmPassword) setPasswordMatch(value === formData.confirmPassword);
    }
    if (name === 'confirmPassword') setPasswordMatch(value === formData.password);
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email) newErrors.email = 'Email is required';
    else if (!validateEmail(formData.email)) newErrors.email = 'Please enter a valid email address';
    
    if (!formData.password) newErrors.password = 'Password is required';
    else {
      const strength = checkPasswordStrength(formData.password);
      if (!strength.isValid) newErrors.password = `Password must contain: ${strength.feedback.join(', ')}`;
    }

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
      setPasswordMatch(false);
    }

    if (!agreedToTerms) newErrors.terms = 'You must agree to the Terms of Service';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const dataToSend = {
      ...formData,
      image: profileImage.length > 0 ? profileImage[0] : null
    };

    backEndHandler(dataToSend);
  };

  return (
    <div className="w-full max-w-md">
      <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8">
        <h2 className="text-3xl font-bold text-white mb-2">Create Account</h2>
        <p className="text-gray-300 mb-8">Sign up to get started</p>

        <div className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
              placeholder="John Doe"
            />
            {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              disabled={isSubmitting}
              className={`w-full px-4 py-3 bg-white/5 border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
              placeholder="you@example.com"
            />
            {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-white/5 border ${errors.password ? 'border-red-500' : 'border-white/10'} rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all`}
                placeholder="••••••••"
              />
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
                  <span className="text-xs text-gray-300">Strength:</span>
                  <span className={`text-xs font-semibold ${passwordStrength.color.replace('bg-', 'text-').replace('500', '400')}`}>
                    {passwordStrength.text}
                  </span>
                </div>
                <div className="w-full bg-white/10 rounded-full h-1.5">
                  <div className={`h-1.5 rounded-full transition-all ${passwordStrength.color}`} style={{ width: `${(passwordStrength.score / 5) * 100}%` }}></div>
                </div>
              </div>
            )}
            {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-200 mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                disabled={isSubmitting}
                className={`w-full px-4 py-3 bg-white/5 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 transition-all ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-500/50' : passwordMatch ? 'border-white/10 focus:ring-purple-500/50' : 'border-red-500/50 focus:ring-red-500/50'
                }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-200"
              >
                {showConfirmPassword ? "⌣" : "👁️"}
              </button>
            </div>
            {!passwordMatch && formData.confirmPassword && !errors.confirmPassword && <p className="mt-1 text-sm text-red-400">Passwords do not match</p>}
            {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
          </div>

          <ImageUpload onFilesChange={handleFilesChange} />

          <div>
            <div className="flex items-start">
              <input 
                type="checkbox" 
                checked={agreedToTerms}
                onChange={(e) => {
                  setAgreedToTerms(e.target.checked);
                  if (errors.terms) setErrors(prev => ({ ...prev, terms: '' }));
                }}
                disabled={isSubmitting}
                className="w-4 h-4 mt-1 rounded bg-white/5 border-white/10 cursor-pointer" 
              />
              <span className="ml-2 text-sm text-gray-300">
                I agree to the <span className="text-blue-400 cursor-pointer">Terms</span> and <span className="text-blue-400 cursor-pointer">Privacy Policy</span>
              </span>
            </div>
            {errors.terms && <p className="mt-1 text-sm text-red-400">{errors.terms}</p>}
          </div>

          <button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold rounded-lg hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-purple-500/50 transform hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? 'Processing...' : 'Create Account'}
          </button>
        </div>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-sm"><span className="px-4 bg-transparent text-gray-400">Or continue with</span></div>
        </div>

        <button
          className="w-full py-3 bg-white/5 border border-white/10 text-white font-semibold rounded-lg hover:bg-white/10 flex items-center justify-center gap-3 disabled:opacity-50"
          disabled={isSubmitting}
        >
           <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
           Sign up with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-300">
          Already have an account? <button onClick={props.onSwitchToLogin} className="text-blue-400 hover:text-blue-300 font-semibold">Sign in</button>
        </p>
      </div>
    </div>
  );
}