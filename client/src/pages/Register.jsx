import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../redux/authSlice";
import { Eye, EyeOff, Heart, Lock, Mail, User, AlertCircle, Phone } from "lucide-react";

const Register = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
    gender: "other",
    emergencyContact: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "username is required";
    } else if (formData.username.trim().length < 2) {
      newErrors.username = "username must be at least 2 characters";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    try {
      await dispatch(register(formData)).unwrap();
      navigate("/dashboard");
    } catch (error) {
      console.error("Registration failed:", error);
    }
  };

  const passwordStrength = (password) => {
    if (!password) return { strength: 0, text: "" };

    let strength = 0;
    const checks = [
      { regex: /.{8,}/, text: "At least 8 characters" },
      { regex: /[a-z]/, text: "Lowercase letter" },
      { regex: /[A-Z]/, text: "Uppercase letter" },
      { regex: /\d/, text: "Number" },
      { regex: /[!@#$%^&*(),.?":{}|<>]/, text: "Special character" },
    ];

    checks.forEach((check) => {
      if (check.regex.test(password)) strength++;
    });

    const strengthText = ["Very Weak", "Weak", "Fair", "Good", "Strong"][Math.min(strength, 4)];
    return { strength, text: strengthText, checks };
  };

  const passwordInfo = passwordStrength(formData.password);

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-6">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl shadow-lg">
              <Heart className="h-10 w-10 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Start your journey</h2>
          <p className="text-gray-600">Create an account to begin your mental health journey</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-3" />
            <span className="text-red-700">{error}</span>
          </div>
        )}

        {/* Form */}
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-5">
            {/* Name */}
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-gray-400" />
                </div>
                <input id="username" name="username" type="text" value={formData.username} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.username ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="Enter your full name" />
              </div>
              {errors.username && <p className="mt-2 text-sm text-red-600">{errors.username}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.email ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="Enter your email" />
              </div>
              {errors.email && <p className="mt-2 text-sm text-red-600">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="password" name="password" type={showPassword ? "text" : "password"} value={formData.password} onChange={handleChange} className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.password ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="Create a password" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />}
                </button>
              </div>

              {/* Password Strength */}
              {formData.password && (
                <div className="mt-2">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm text-gray-600">Password strength:</span>
                    <span className={`text-sm font-medium ${passwordInfo.strength < 2 ? "text-red-600" : passwordInfo.strength < 4 ? "text-yellow-600" : "text-green-600"}`}>{passwordInfo.text}</span>
                  </div>
                  <div className="flex space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className={`h-2 flex-1 rounded-full ${i < passwordInfo.strength ? (passwordInfo.strength < 2 ? "bg-red-500" : passwordInfo.strength < 4 ? "bg-yellow-500" : "bg-green-500") : "bg-gray-200"}`} />
                    ))}
                  </div>
                </div>
              )}

              {errors.password && <p className="mt-2 text-sm text-red-600">{errors.password}</p>}
            </div>

            {/* Confirm Password */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input id="confirmPassword" name="confirmPassword" type={showConfirmPassword ? "text" : "password"} value={formData.confirmPassword} onChange={handleChange} className={`block w-full pl-10 pr-12 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ${errors.confirmPassword ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="Confirm your password" />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                  {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" /> : <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600 transition-colors" />}
                </button>
              </div>
              {errors.confirmPassword && <p className="mt-2 text-sm text-red-600">{errors.confirmPassword}</p>}
            </div>
            {/* Gender */}
            <div>
              <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-2">
                Gender
              </label>
              <select id="gender" name="gender" value={formData.gender} onChange={handleChange} className="block w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300">
                <option value="other">Other</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
            {/* Emergency Contact */}
            <div>
              <label htmlFor="emergencyContact" className="block text-sm font-medium text-gray-700 mb-2">
                Emergency Contact (Optional)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-gray-400" />
                </div>
                <input id="emergencyContact" name="emergencyContact" type="text" value={formData.emergencyContact} onChange={handleChange} className={`block w-full pl-10 pr-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200 ${errors.emergencyContact ? "border-red-300 bg-red-50" : "border-gray-300"}`} placeholder="Enter emergency contact number" />
              </div>
              {errors.emergencyContact && <p className="mt-2 text-sm text-red-600">{errors.emergencyContact}</p>}
            </div>

            {/* Role Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">I am a:</label>
              <div className="grid grid-cols-2 gap-3">
                <label className="relative">
                  <input type="radio" name="role" value="user" checked={formData.role === "user"} onChange={handleChange} className="sr-only" />
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.role === "user" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="text-center">
                      <User className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="font-medium text-gray-900">User</p>
                      <p className="text-sm text-gray-500">Seeking support</p>
                    </div>
                  </div>
                </label>

                <label className="relative">
                  <input type="radio" name="role" value="therapist" checked={formData.role === "therapist"} onChange={handleChange} className="sr-only" />
                  <div className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-200 ${formData.role === "therapist" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"}`}>
                    <div className="text-center">
                      <Heart className="h-8 w-8 mx-auto mb-2 text-gray-600" />
                      <p className="font-medium text-gray-900">Therapist</p>
                      <p className="text-sm text-gray-500">Providing care</p>
                    </div>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" disabled={loading} className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl">
            {loading ? (
              <div className="flex items-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Creating account...
              </div>
            ) : (
              "Create Account"
            )}
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500 transition-colors duration-200">
                Sign in here
              </Link>
            </p>
          </div>
        </form>

        {/* Support */}
        <div className="text-center pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500">
            Need help?{" "}
            <a href="mailto:support@mindcare.com" className="text-blue-600 hover:text-blue-500 transition-colors duration-200">
              Contact support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
