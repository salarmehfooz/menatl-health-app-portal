import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserMoodLogs } from "../redux/moodLogSlice";
import { Heart } from "lucide-react";

const MoodLog = () => {
  const dispatch = useDispatch();
  const { list: moodLogs = [], loading, error: fetchError } = useSelector((state) => state.moodLogs || {});

  useEffect(() => {
    dispatch(fetchUserMoodLogs());
  }, [dispatch]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Log Your Mood</h1>
            <p className="text-gray-600 mt-1">Track your emotions and well-being.</p>
          </div>
        </div>
      </div>

      {/* Mood Logs List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Your Mood Logs</h2>
        {loading ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading mood logs...</div>
        ) : moodLogs.length > 0 ? (
          <div className="space-y-4">
            {moodLogs.map((log) => (
              <div key={log._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-200">
                <h3 className="font-semibold text-gray-900">{log.mood.charAt(0).toUpperCase() + log.mood.slice(1)}</h3>
                <p className="text-gray-600 text-sm mt-1">{log.notes || "No notes provided"}</p>
                <p className="text-gray-500 text-sm mt-2">
                  Sleep: {log.sleepHours}h, Energy: {log.energyLevel} — {new Date(log.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">No mood logs found.</div>
        )}
      </div>
    </div>
  );
};

export default MoodLog;
