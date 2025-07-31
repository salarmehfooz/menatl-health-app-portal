import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAppointmentsAdmin } from "../../redux/appointmentSlice";
import { Calendar } from "lucide-react";

const AdminAppointmentsMonitor = () => {
  const dispatch = useDispatch();
  const { list: appointments = [], loading } = useSelector((state) => state.appointments || {});

  useEffect(() => {
    dispatch(getAllAppointmentsAdmin());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Monitor All Appointments</h1>
            <p className="text-gray-600 mt-1">View and manage all scheduled appointments.</p>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading appointments...</div>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-gray-900 font-semibold">User</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Therapist</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Date/Time</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Status</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Notes</th>
              </tr>
            </thead>
            <tbody>
              {appointments.length > 0 ? (
                appointments.map((a) => (
                  <tr key={a._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{a.userId?.username || "User"}</td>
                    <td className="p-4">{a.therapistId?.username || "Therapist"}</td>
                    <td className="p-4">{new Date(a.datetime).toLocaleString()}</td>
                    <td className="p-4">{a.status}</td>
                    <td className="p-4">{a.notes || "-"}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-600">
                    No appointments found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default AdminAppointmentsMonitor;
