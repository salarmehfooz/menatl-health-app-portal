import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTherapistAppointments } from "../../redux/appointmentSlice";
import { useNavigate, Link } from "react-router-dom";
import { Stethoscope, Calendar, MessageCircle, BookOpen, Heart, Pill, Library } from "lucide-react";
import AssignedUsersForTherapist from "../../components/AssignedUsers";

const TherapistDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { list: appointments, loading } = useSelector((state) => state.appointments);

  useEffect(() => {
    if (user?.role === "therapist") {
      dispatch(getTherapistAppointments());
    }
  }, [dispatch, user]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl shadow-lg p-8 mb-8 text-white animate-fade-in">
        <div className="flex items-center">
          <div className="p-3 bg-sky-500 bg-opacity-20 rounded-lg mr-4">
            <Stethoscope className="h-10 w-10 text-white" />
          </div>
          <div>
            <h1 className="text-4xl font-bold">Welcome, {user?.username}</h1>
            <p className="text-lg mt-2 opacity-90">Your hub for managing patient care and sessions.</p>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400 opacity-20 rounded-full blur-3xl animate-pulse" />
      </div>

      {user?.role === "therapist" && (
        <>
          {/* Assigned Users */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Assigned Patients</h2>
            <AssignedUsersForTherapist />
          </div>

          {/* Quick Actions */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <Link to="/therapist/appointments" className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg hover:from-yellow-600 hover:to-yellow-700 transition-all duration-200">
                <Calendar className="h-5 w-5 mr-2" />
                View Appointments
                <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">Manage your sessions</span>
              </Link>
              <Link to="/therapist/chat-threads" className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all duration-200">
                <MessageCircle className="h-5 w-5 mr-2" />
                Chats
                <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">Message your patients</span>
              </Link>
              <Link to="/therapist/content" className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg hover:from-purple-600 hover:to-purple-700 transition-all duration-200">
                <BookOpen className="h-5 w-5 mr-2" />
                Manage Content
                <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">Create self-help resources</span>
              </Link>
              <Link to="/therapist/moodlogview" className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-pink-500 to-pink-600 text-white rounded-lg hover:from-pink-600 hover:to-pink-700 transition-all duration-200">
                <Heart className="h-5 w-5 mr-2" />
                View Patient's Mood Log
                <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">Review mood logs</span>
              </Link>
              <Link to="/therapist/prescription-assign" className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-indigo-500 to-indigo-600 text-white rounded-lg hover:from-indigo-600 hover:to-indigo-700 transition-all duration-200">
                <Pill className="h-5 w-5 mr-2" />
                Prescription Management
                <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">Manage prescriptions</span>
              </Link>
              <Link to="/content-library" className="group relative inline-flex items-center px-4 py-3 bg-gradient-to-r from-gray-500 to-gray-600 text-white rounded-lg hover:from-gray-600 hover:to-gray-700 transition-all duration-200">
                <Library className="h-5 w-5 mr-2" />
                Explore Content
                <span className="absolute hidden group-hover:block -top-10 left-1/2 transform -translate-x-1/2 bg-gray-800 text-white text-xs rounded py-1 px-2">Browse resources</span>
              </Link>
            </div>
          </div>

          {/* Appointments Table */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 transform hover:scale-105 transition-transform duration-200">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Appointments</h2>
            {loading ? (
              <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center animate-pulse">Loading appointments...</div>
            ) : appointments?.length === 0 ? (
              <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">No appointments found.</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-gray-200 bg-gray-800 text-white">
                      <th className="py-3 px-4 text-left font-semibold">Patient</th>
                      <th className="py-3 px-4 text-left font-semibold">Date</th>
                      <th className="py-3 px-4 text-left font-semibold">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {appointments?.map((appt) => (
                      <tr key={appt._id} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-4 text-gray-900">{appt.userId?.username || "Anonymous"}</td>
                        <td className="py-3 px-4 text-gray-900">{new Date(appt.datetime).toLocaleString()}</td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2 py-1 text-xs font-medium rounded-full capitalize ${appt.status === "scheduled" ? "bg-blue-100 text-blue-700" : appt.status === "completed" ? "bg-green-100 text-green-700" : appt.status === "cancelled" ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-700"}`}>{appt.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default TherapistDashboard;
