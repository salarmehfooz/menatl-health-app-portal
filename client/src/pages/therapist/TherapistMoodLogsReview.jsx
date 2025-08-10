import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapistClientMoodLogs } from "../../redux/moodLogSlice";
import { getAssignedUsersForTherapist } from "../../redux/assignmentSlice";
import { Heart } from "lucide-react";

const TherapistMoodLogsReview = () => {
  const dispatch = useDispatch();
  const [selectedUserId, setSelectedUserId] = useState("");

  // Auth info
  const { user } = useSelector((state) => state.auth);

  // Assigned users state
  const {
    assignedUsers,
    loading: loadingAssignments,
    error: errorAssignments,
  } = useSelector((state) => state.assignments);

  // Mood logs state
  const {
    list: moodLogs,
    loading,
    error,
  } = useSelector((state) => state.moodLogs);

  useEffect(() => {
    if (user?.id) {
      dispatch(getAssignedUsersForTherapist());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchTherapistClientMoodLogs(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-4">
              <Heart className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Review Client Mood Logs
              </h1>
              <p className="text-gray-600 mt-1">
                Please log in to view mood logs.
              </p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-center">
          Please log in to view mood logs.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-pink-500 to-pink-600 rounded-lg mr-4">
            <Heart className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Review Client Mood Logs
            </h1>
            <p className="text-gray-600 mt-1">
              View mood logs for your assigned patients.
            </p>
          </div>
        </div>
      </div>

      {/* Patient Selector */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          Select Patient
        </h2>
        {loadingAssignments && (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
            Loading assigned patients...
          </div>
        )}
        {errorAssignments && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">
            {errorAssignments}
          </div>
        )}
        {!loadingAssignments && !errorAssignments && (
          <select
            id="patientSelect"
            className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={selectedUserId}
            onChange={(e) => setSelectedUserId(e.target.value)}
            disabled={loadingAssignments}
          >
            <option value="">-- Select a patient --</option>
            {assignedUsers.map((patient) => (
              <option key={patient.id} value={patient.id}>
                {patient.username || patient.email || "Unnamed"}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Mood Logs Table */}
      {selectedUserId && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Mood Logs for Selected Patient
          </h2>
          {loading && (
            <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
              Loading mood logs...
            </div>
          )}
          {error && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">
              {error}
            </div>
          )}
          {!loading && !error && moodLogs.length === 0 && (
            <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
              No mood logs found for this patient.
            </div>
          )}
          {!loading && !error && moodLogs.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                      Mood
                    </th>
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                      Note
                    </th>
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                      Logged At
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {moodLogs.map((log) => (
                    <tr
                      key={log._id}
                      className="border-b border-gray-200 hover:bg-gray-50"
                    >
                      <td className="py-3 px-4 text-gray-900">{log.mood}</td>
                      <td className="py-3 px-4 text-gray-600 text-sm">
                        {log.notes?.trim() !== "" ? log.notes : "-"}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        {new Date(log.createdAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TherapistMoodLogsReview;
