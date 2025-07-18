import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMoodLogs } from "../../redux/moodLogSlice";

const AdminMoodLogsReview = () => {
  const dispatch = useDispatch();
  const { moodLogs, loading } = useSelector((state) => state.moodLog);

  useEffect(() => {
    dispatch(fetchAllMoodLogs());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Review Mood Logs</h2>
      {loading ? (
        <p>Loading mood logs...</p>
      ) : (
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>User</th>
              <th>Mood</th>
              <th>Note</th>
              <th>Logged At</th>
            </tr>
          </thead>
          <tbody>
            {moodLogs.map((log) => (
              <tr key={log._id}>
                <td>{log.userId?.name || "User"}</td>
                <td>{log.mood}</td>
                <td>{log.note || "-"}</td>
                <td>{new Date(log.createdAt).toLocaleString()}</td>
              </tr>
            ))}
            {moodLogs.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center">
                  No mood logs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminMoodLogsReview;
