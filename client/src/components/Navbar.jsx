import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/authSlice";
import { Heart, Menu, X, User, LogOut, MessageCircle, Calendar, Activity, BookOpen } from "lucide-react";

const Navbar = () => {
  const [isOpen, setIsOpen] = React.useState(false);
  const { user, isAuthenticated } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const userNavItems = [
    { path: "/dashboard", label: "Dashboard", icon: User },
    { path: "/appointments/user", label: "Appointments", icon: Calendar },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/mood-log", label: "Mood Log", icon: Activity },
    { path: "/content-library", label: "Resources", icon: BookOpen },
  ];

  const therapistNavItems = [
    { path: "/therapist/dashboard", label: "Dashboard", icon: User },
    { path: "/appointments/therapist", label: "Appointments", icon: Calendar },
    { path: "/chat", label: "Chat", icon: MessageCircle },
  ];

  const adminNavItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: User },
    { path: "/admin/users", label: "Users", icon: User },
    { path: "/admin/appointments", label: "Appointments", icon: Calendar },
    { path: "/admin/content", label: "Content", icon: BookOpen },
    { path: "/admin/mood-logs", label: "Mood Logs", icon: Activity },
  ];

  const getNavItems = () => {
    if (!isAuthenticated) return [];

    switch (user?.role) {
      case "admin":
        return adminNavItems;
      case "therapist":
        return therapistNavItems;
      default:
        return userNavItems;
    }
  };

  return (
    <nav className="bg-white shadow-lg border-b border-blue-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg group-hover:from-blue-600 group-hover:to-blue-700 transition-all duration-200">
              <Heart className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors duration-200">MindCare</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {isAuthenticated ? (
              <>
                {getNavItems().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} to={item.path} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <Icon className="h-4 w-4" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                <div className="h-6 w-px bg-gray-200 mx-4" />

                <div className="flex items-center space-x-3">
                  <div className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-blue-50">
                    <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                      <span className="text-white font-medium text-sm">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-700">{user?.name || "User"}</span>
                  </div>

                  <button onClick={handleLogout} className="flex items-center space-x-2 px-4 py-2 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200">
                    <LogOut className="h-4 w-4" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-3">
                <Link to="/login" className="px-4 py-2 text-gray-700 hover:text-blue-600 font-medium transition-colors duration-200">
                  Sign In
                </Link>
                <Link to="/register" className="px-6 py-2 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 shadow-md hover:shadow-lg">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="p-2 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden border-t border-blue-100 bg-white shadow-lg">
          <div className="px-4 py-6 space-y-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-3 pb-4 border-b border-gray-200">
                  <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white font-medium">{user?.name?.charAt(0).toUpperCase() || "U"}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{user?.name || "User"}</p>
                    <p className="text-sm text-gray-500 capitalize">{user?.role || "User"}</p>
                  </div>
                </div>

                {getNavItems().map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200">
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}

                <button onClick={handleLogout} className="flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all duration-200 w-full">
                  <LogOut className="h-5 w-5" />
                  <span className="font-medium">Logout</span>
                </button>
              </>
            ) : (
              <div className="space-y-3">
                <Link to="/login" onClick={() => setIsOpen(false)} className="block px-4 py-3 text-gray-700 hover:bg-blue-50 hover:text-blue-600 font-medium rounded-lg transition-all duration-200">
                  Sign In
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="block px-4 py-3 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg transition-all duration-200 text-center">
                  Get Started
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
