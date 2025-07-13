import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart, Shield, Users, Sparkles, Eye, EyeOff } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(email, password);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Login failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-center">
        <div className="max-w-md">
          {/* Logo */}
          <div className="flex items-center mb-12">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">MindEase</span>
          </div>

          {/* Main Heading */}
          <h1 className="text-4xl font-bold text-gray-800 mb-6 leading-tight">Your journey to better mental health starts here</h1>

          <p className="text-gray-600 mb-12 text-lg leading-relaxed">Join thousands who have found peace, support, and growth through our compassionate community and expert-guided resources.</p>

          {/* Features */}
          <div className="space-y-6">
            <div className="feature-card">
              <div className="feature-icon bg-blue-100">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Safe & Confidential</h3>
                <p className="text-gray-600 text-sm">Your privacy and security are our top priorities. All conversations are encrypted and protected.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-purple-100">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Expert Support</h3>
                <p className="text-gray-600 text-sm">Connect with therapists and counselors who understand your unique journey.</p>
              </div>
            </div>

            <div className="feature-card">
              <div className="feature-icon bg-green-100">
                <Sparkles className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-800 mb-1">Personalized Care</h3>
                <p className="text-gray-600 text-sm">Tailored resources and tools designed specifically for your mental health goals.</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold text-gray-800">MindEase</span>
          </div>

          {/* Card Container */}
          <div className="auth-card">
            {/* Form Header */}
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Welcome</h2>
              <p className="text-gray-600">Take the first step towards better mental wellness</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex bg-gray-100 rounded-lg p-1 mb-8">
              <div className="flex-1 text-center py-2 bg-white rounded-md shadow-sm">
                <span className="text-sm font-medium text-gray-900">Sign In</span>
              </div>
              <Link to="/signup" className="flex-1 text-center py-2">
                <span className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Sign Up</span>
              </Link>
            </div>

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="auth-input" placeholder="your.email@example.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} className="auth-input pr-12" placeholder="Enter your password" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                  <span className="ml-2 text-sm text-gray-600">Remember me</span>
                </label>
                <Link to="/forgot-password" className="text-sm text-indigo-600 hover:text-indigo-500 transition-colors">
                  Forgot password?
                </Link>
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Signing In..." : "Sign In to Your Journey"}
              </button>
            </form>
          </div>

          {/* Support Message - Outside the card */}
          <div className="mt-6 text-center">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-700">💙 You're taking a brave step towards better mental health. We're here to support you every step of the way.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
