import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllMoodLogs, addMoodLog } from "../redux/moodLogSlice";

const MoodLog = () => {
  const dispatch = useDispatch();
  const { moodLogs, loading } = useSelector((state) => state.moodLog);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    dispatch(fetchAllMoodLogs());
  }, [dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (title && description) {
      dispatch(addMoodLog({ title, description }));
      setTitle("");
      setDescription("");
    }
  };

  return (
    <div className="container mt-4">
      <h2>Log Your Mood</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <div className="form-group mb-2">
          <input
            className="form-control"
            placeholder="Mood Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="form-group mb-2">
          <textarea
            className="form-control"
            placeholder="Describe your mood"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <button className="btn btn-primary">Submit Mood</button>
      </form>

      <h4>Your Mood Logs</h4>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul className="list-group">
          {moodLogs.map((log) => (
            <li key={log._id} className="list-group-item">
              <strong>{log.title}</strong>
              <p className="mb-1">{log.description}</p>
              <small className="text-muted">
                {new Date(log.createdAt).toLocaleString()}
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MoodLog;
