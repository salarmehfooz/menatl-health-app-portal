import { useNavigate } from "react-router-dom";
import { Users, Calendar, BookOpen, Link, FileText, Heart } from "lucide-react";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: "Manage Users",
      description: "View and manage user accounts",
      icon: Users,
      link: "/admin/users",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Monitor Appointments",
      description: "Track all scheduled appointments",
      icon: Calendar,
      link: "/admin/appointments",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Manage Content",
      description: "Edit wellness resources",
      icon: BookOpen,
      link: "/admin/content",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Therapist Assignments",
      description: "View therapist assignments",
      icon: Link,
      link: "/therapist-assignments",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Register Therapist Assignments",
      description: "Assign therapists to users",
      icon: FileText,
      link: "/assignment-form",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
    },
    {
      title: "Mood Logs",
      description: "Review user mood logs",
      icon: Heart,
      link: "/admin/moodlogs",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-600 mt-1">Manage users, appointments, and content with ease.</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <div key={index} onClick={() => navigate(action.link)} className={`group p-6 rounded-2xl ${action.bgColor} hover:shadow-lg transition-all duration-200 hover:-translate-y-1 cursor-pointer`}>
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">{action.title}</h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
