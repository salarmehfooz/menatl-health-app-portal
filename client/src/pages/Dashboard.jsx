import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Heart, Calendar, MessageCircle, Activity, Users, TrendingUp } from "lucide-react";

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      // Redirect to role-specific dashboard
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "therapist":
          navigate("/therapist/dashboard");
          break;
        default:
          navigate("/user/dashboard");
      }
    }
  }, [user, navigate]);

  // Fallback content while redirecting
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Loading Dashboard...</h2>
        <p className="text-gray-600">Redirecting you to your personalized dashboard</p>
      </div>
    </div>
  );
};

export default Dashboard;
