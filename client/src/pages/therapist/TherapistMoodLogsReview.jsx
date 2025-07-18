import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapistClientMoodLogs } from "../../redux/moodLogSlice";

const TherapistMoodLogsReview = () => {
  const dispatch = useDispatch();
  const { list: moodLogs, loading } = useSelector((state) => state.moodLogs);

  useEffect(() => {
    dispatch(fetchTherapistClientMoodLogs());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Client Mood Logs</h2>
      {loading ? (
        <p>Loading mood logs...</p>
      ) : (
        <table className="table table-striped table-bordered shadow-sm">
          <thead className="table-light">
            <tr>
              <th>Client</th>
              <th>Mood</th>
              <th>Note</th>
              <th>Logged At</th>
            </tr>
          </thead>
          <tbody>
            {moodLogs.length > 0 ? (
              moodLogs.map((log) => (
                <tr key={log._id}>
                  <td>{log.userId?.username || "Client"}</td>
                  <td>{log.mood}</td>
                  <td>{log.notes || "-"}</td>
                  <td>{new Date(log.createdAt).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">
                  No mood logs from your clients.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TherapistMoodLogsReview;
