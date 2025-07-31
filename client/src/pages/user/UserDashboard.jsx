import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  Calendar,
  MessageCircle,
  Activity,
  BookOpen,
  Clock,
  TrendingUp,
  Heart,
  Plus,
  Users,
  FileText,
} from "lucide-react";
import AssignedTherapist from "../../components/AssignedTherapist";
import { fetchUserMoodLogs } from "../../redux/moodLogSlice"; // added import
import { getUserAppointments } from "../../redux/appointmentSlice"; // ✅ import added

const UserDashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { list: moodLogs, loading } = useSelector((state) => state.moodLogs); // updated selector
  const { list: appointments, loading: appointmentsLoading } = useSelector(
    (state) => state.appointments
  ); // ✅ new selector

  useEffect(() => {
    dispatch(fetchUserMoodLogs()); // fetch mood logs on mount
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(getUserAppointments(user._id)); // ✅ fetch user appointments
    }
  }, [dispatch, user?._id]);

  // Get most recent 4 mood logs sorted by date descending
  const recentMoods = [...moodLogs]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 4);

  // ✅ Upcoming Appointments (real data)
  const upcomingAppointments = appointments
    .filter((appt) => new Date(appt.datetime) > new Date())
    .sort((a, b) => new Date(a.datetime) - new Date(b.datetime))
    .slice(0, 3);

  const quickActions = [
    {
      title: "Book Appointment",
      description: "Schedule a session with a therapist",
      icon: Calendar,
      link: "/appointments/book",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
    },
    {
      title: "Start New Chat",
      description: "Message your therapist",
      icon: MessageCircle,
      link: "/start-chat/:therapistId",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
    },
    {
      title: "Log Mood",
      description: "Track your daily mood",
      icon: Activity,
      link: "/mood-log/new",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
    },
    {
      title: "Browse Resources",
      description: "Access helpful content",
      icon: BookOpen,
      link: "/content-library",
      color: "from-amber-500 to-amber-600",
      bgColor: "bg-amber-50",
    },
    {
      title: "View All Therapists",
      description: "Explore available therapists",
      icon: Users,
      link: "/therapist-list",
      color: "from-teal-500 to-teal-600",
      bgColor: "bg-teal-50",
    },
    {
      title: "Prescriptions",
      description: "View your medication history",
      icon: FileText,
      link: "/user-prescription",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
    },
  ];

  const getMoodColor = (mood) => {
    switch (mood) {
      case "excellent":
        return "text-green-600";
      case "good":
        return "text-blue-600";
      case "fair":
        return "text-yellow-600";
      case "poor":
        return "text-orange-600";
      case "very-poor":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getMoodBg = (mood) => {
    switch (mood) {
      case "excellent":
        return "bg-green-100";
      case "good":
        return "bg-blue-100";
      case "fair":
        return "bg-yellow-100";
      case "poor":
        return "bg-orange-100";
      case "very-poor":
        return "bg-red-100";
      default:
        return "bg-gray-100";
    }
  };
  

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {user?.username}!
            </h1>
            <p className="text-gray-600 mt-1">
              How are you feeling today? Let's continue your wellness journey.
            </p>
          </div>
        </div>
      </div>

      {/* Assigned Therapist */}
      <div className="mb-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            Your Therapist
          </h2>
          <AssignedTherapist />
        </div>
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => {
            const Icon = action.icon;
            return (
              <Link
                key={index}
                to={action.link}
                className={`group p-6 rounded-2xl ${action.bgColor} hover:shadow-lg transition-all duration-200 hover:-translate-y-1`}
              >
                <div
                  className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${action.color} mb-4 group-hover:scale-110 transition-transform duration-200`}
                >
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-2">
                  {action.title}
                </h3>
                <p className="text-gray-600 text-sm">{action.description}</p>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Mood Tracking */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Recent Mood Tracking
              </h2>
              <Link
                to="/mood-logs"
                className="flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all
                <TrendingUp className="h-4 w-4 ml-1" />
              </Link>
            </div>

            <div className="space-y-4">
              {loading ? (
                <p className="text-gray-500">Loading mood logs...</p>
              ) : recentMoods.length === 0 ? (
                <p className="text-gray-500">
                  No mood logs yet. Start tracking how you feel today!
                </p>
              ) : (
                recentMoods.map((entry, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 rounded-lg bg-gray-50"
                  >
                    <div className="flex items-center">
                      <div
                        className={`w-3 h-3 rounded-full ${getMoodBg(
                          entry.mood
                        )} mr-3`}
                      ></div>
                      <div>
                        <p className="font-medium text-gray-900 capitalize">
                          {entry.mood}
                        </p>
                        <p className="text-sm text-gray-500">
                          {new Date(entry.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center">
                      <span
                        className={`font-semibold ${getMoodColor(entry.mood)}`}
                      >
                        {entry.energyLevel}/10
                      </span>
                    </div>
                  </div>
                ))
              )}

              <Link
                to="/mood-log/new"
                className="flex items-center justify-center p-4 rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 text-gray-600 hover:text-blue-600"
              >
                <Plus className="h-5 w-5 mr-2" />
                Log today's mood
              </Link>
            </div>
          </div>
        </div>

        {/* Upcoming Appointments */}
        <div>
          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                Upcoming Sessions
              </h2>
              <Link
                to="/user/appointments"
                className="text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                View all
              </Link>
            </div>

            <div className="space-y-4">
              {appointmentsLoading ? (
                <p className="text-gray-500">Loading appointments...</p>
              ) : upcomingAppointments.length > 0 ? (
                upcomingAppointments.map((appointment) => (
                  <div
                    key={appointment._id}
                    className="p-4 rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-center mb-2">
                      <Calendar className="h-4 w-4 text-blue-600 mr-2" />
                      <span className="font-medium text-gray-900">
                        {"Dr "}
                        {appointment.therapistId?.username || "Therapist"}
                      </span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600 mb-1">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>
                        {new Date(appointment.datetime).toLocaleDateString()} at{" "}
                        {new Date(appointment.datetime).toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                        {appointment.time}
                      </span>
                    </div>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      {appointment.status}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500 mb-4">No upcoming appointments</p>
                  <Link
                    to="/appointments/book"
                    className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Book Session
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Wellness Tips */}
      <div className="mt-8">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Today's Wellness Tip
          </h2>
          <div className="flex items-start">
            <div className="p-2 bg-blue-100 rounded-lg mr-4">
              <Heart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-gray-700 leading-relaxed">
                Take a few minutes today to practice deep breathing. Inhale
                slowly for 4 counts, hold for 4, then exhale for 6. This simple
                technique can help reduce stress and improve your overall sense
                of well-being.
              </p>
              <Link
                to="/content-library"
                className="inline-flex items-center mt-3 text-blue-600 hover:text-blue-700 font-medium transition-colors"
              >
                More wellness tips
                <BookOpen className="h-4 w-4 ml-1" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;
