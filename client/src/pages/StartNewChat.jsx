import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapistsThunk } from "../redux/adminSlice";
import { startNewChat } from "../redux/chatSlice";
import { useNavigate } from "react-router-dom";

const StartNewChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [customMessage, setCustomMessage] = useState("");

  const { therapists } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchTherapistsThunk());
  }, [dispatch]);

  const handleStartChat = async () => {
    if (!selectedTherapist || !customMessage.trim()) {
      alert("Please select a therapist and enter a message.");
      return;
    }

    try {
      const result = await dispatch(
        startNewChat({
          recipientId: selectedTherapist,
          message: customMessage,
        })
      ).unwrap();

      if (result?.thread?._id) {
        navigate(`/chat/${result.thread._id}`);
      } else {
        alert("Chat could not be started.");
      }
    } catch (err) {
      console.error("Start chat error:", err);
      alert("Could not start chat. Please try again.");
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <h2>Start New Chat</h2>
        <p>Please log in to start a chat.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Start New Chat</h2>

      {error && <div className="alert alert-danger">{error}</div>}

      <div className="mb-3">
        <label className="form-label">Select Therapist</label>
        <select
          className="form-select"
          value={selectedTherapist}
          onChange={(e) => setSelectedTherapist(e.target.value)}
        >
          <option value="">-- Choose a Therapist --</option>
          {therapists.length === 0 && (
            <option disabled>No therapists found</option>
          )}
          {therapists.map((therapist) => (
            <option key={therapist._id} value={therapist._id}>
              {therapist.username}
            </option>
          ))}
        </select>
      </div>

      <div className="mb-3">
        <label className="form-label">Your Message</label>
        <input
          type="text"
          className="form-control"
          placeholder="Type your message..."
          value={customMessage}
          onChange={(e) => setCustomMessage(e.target.value)}
        />
      </div>

      <button
        className="btn btn-success"
        onClick={handleStartChat}
        disabled={!selectedTherapist || loading}
      >
        {loading ? "Starting Chat..." : "Start Chat"}
      </button>
    </div>
  );
};

export default StartNewChat;
