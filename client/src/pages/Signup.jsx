import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Heart, Shield, Users, Sparkles, Eye, EyeOff, User, Phone, UserCheck } from "lucide-react";

const Signup = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    gender: "",
    emergencyContact: {
      name: "",
      phone: "",
    },
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("emergencyContact.")) {
      const field = name.split(".")[1];
      setFormData((prev) => ({
        ...prev,
        emergencyContact: {
          ...prev.emergencyContact,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!agreeToTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy");
      setLoading(false);
      return;
    }

    const result = await signup(formData);

    if (result.success) {
      navigate("/dashboard");
    } else {
      setError(result.error || "Signup failed");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen gradient-bg flex">
      {/* Left Side - Marketing Content */}
      <div className="hidden lg:flex lg:w-1/2 p-12 flex-col justify-start pt-16">
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
                <p className="text-gray-600 text-sm">Connect with licensed therapists and counselors who understand your unique journey.</p>
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

      {/* Right Side - Signup Form */}
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
              <Link to="/login" className="flex-1 text-center py-2">
                <span className="text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors">Sign In</span>
              </Link>
              <div className="flex-1 text-center py-2 bg-white rounded-md shadow-sm">
                <span className="text-sm font-medium text-gray-900">Sign Up</span>
              </div>
            </div>

            {/* Signup Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {error && <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg text-sm">{error}</div>}

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input type="text" name="username" value={formData.username} onChange={handleChange} className="auth-input pl-10" placeholder="ABDULLAH KHAN" required />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <input type="email" name="email" value={formData.email} onChange={handleChange} className="auth-input" placeholder="your.email@example.com" required />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="auth-input" required>
                  <option value="">Select your gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="non-binary">Non-binary</option>
                  <option value="prefer-not-to-say">Prefer not to say</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} className="auth-input pr-12" placeholder="••••••" required />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} className="auth-input pr-12" placeholder="••••••" required />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Emergency Contact Section */}
              <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Emergency Contact (Optional)</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Name</label>
                    <div className="relative">
                      <UserCheck className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="text" name="emergencyContact.name" value={formData.emergencyContact.name} onChange={handleChange} className="auth-input pl-10" placeholder="Emergency contact name" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Contact Phone</label>
                    <div className="relative">
                      <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                      <input type="tel" name="emergencyContact.phone" value={formData.emergencyContact.phone} onChange={handleChange} className="auth-input pl-10" placeholder="+1 (555) 123-4567" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <input type="checkbox" checked={agreeToTerms} onChange={(e) => setAgreeToTerms(e.target.checked)} className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500" />
                <label className="ml-2 text-sm text-gray-600">
                  I agree to the{" "}
                  <Link to="/terms" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link to="/privacy" className="text-indigo-600 hover:text-indigo-500 transition-colors">
                    Privacy Policy
                  </Link>
                </label>
              </div>

              <button type="submit" disabled={loading} className="auth-button">
                {loading ? "Creating Account..." : "Begin Your Wellness Journey"}
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

export default Signup;
