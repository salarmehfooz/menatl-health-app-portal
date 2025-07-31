import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMoodLogsThunk, deleteMoodLogThunk } from "../../redux/adminSlice";
import { Heart } from "lucide-react";

const AdminMoodLogsReview = () => {
  const dispatch = useDispatch();
  const { moodLogs = [], loading = false } = useSelector((state) => state.admin || {});

  useEffect(() => {
    dispatch(fetchMoodLogsThunk());
  }, [dispatch]);

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this mood log?")) {
      dispatch(deleteMoodLogThunk(id));
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Review Mood Logs</h1>
            <p className="text-gray-600 mt-1">Monitor user mood logs and insights.</p>
          </div>
        </div>
      </div>

      {/* Mood Logs Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading mood logs...</div>
        ) : (
          <table className="w-full border border-gray-200 rounded-lg shadow-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-4 text-left text-gray-900 font-semibold">User</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Mood</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Note</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Sleep Hours</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Energy Level</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Logged At</th>
                <th className="p-4 text-left text-gray-900 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {moodLogs.length > 0 ? (
                moodLogs.map((log) => (
                  <tr key={log._id} className="border-t border-gray-200 hover:bg-gray-50">
                    <td className="p-4">{log.userId?.username || "User"}</td>
                    <td className="p-4">{log.mood}</td>
                    <td className="p-4">{log.notes || "-"}</td>
                    <td className="p-4">{log.sleepHours}</td>
                    <td className="p-4">{log.energyLevel}</td>
                    <td className="p-4">{new Date(log.createdAt).toLocaleString()}</td>
                    <td className="p-4">
                      <button onClick={() => handleDelete(log._id)} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-4 text-center text-gray-600">
                    No mood logs found.
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

export default AdminMoodLogsReview;
