import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadMessages, sendMessage, clearMessages } from "../redux/chatSlice";

const ChatInterface = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);

  const { user } = useSelector((state) => state.auth);
  const { currentMessages, loading, threads } = useSelector(
    (state) => state.chat
  );

  const [newMessage, setNewMessage] = useState("");
  const [localError, setLocalError] = useState("");

  const currentThread = threads.find((t) => t._id === threadId);

  useEffect(() => {
    if (!threadId || !currentThread) {
      setLocalError("Invalid or missing chat thread.");
      return;
    }

    setLocalError("");
    dispatch(clearMessages());
    dispatch(loadMessages(threadId)).catch(() => {
      setLocalError("Failed to fetch messages.");
    });
  }, [dispatch, threadId, currentThread]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      await dispatch(sendMessage({ threadId, message: newMessage })).unwrap();
      setNewMessage("");
    } catch (err) {
      console.error("Send error:", err);
      setLocalError("Failed to send message.");
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  if (!user) {
    return (
      <div className="container mt-4">
        <div className="alert alert-warning">Please log in to access chat.</div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Chat</h2>

      {localError && <div className="alert alert-danger">{localError}</div>}

      {!currentThread && (
        <div className="alert alert-info">
          No thread found. Please try again.
        </div>
      )}

      {currentThread && (
        <>
          <div
            className="border rounded p-3 mb-3"
            style={{ maxHeight: "400px", overflowY: "auto" }}
          >
            {loading && <p>Loading messages...</p>}

            {currentMessages.map((msg, index) => (
              <div
                key={index}
                className={`mb-2 ${
                  msg.sender === user.role ? "text-end" : "text-start"
                }`}
              >
                <span
                  className={`badge bg-${
                    msg.sender === user.role ? "primary" : "success"
                  }`}
                >
                  {msg.sender === user.role ? "You" : "Them"}
                </span>
                <p className="d-inline-block ms-2 mb-0">
                  {msg.message || "[No message]"}
                </p>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSend} className="d-flex">
            <input
              type="text"
              className="form-control me-2"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              type="submit"
              disabled={loading || !newMessage.trim()}
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </form>
        </>
      )}
    </div>
  );
};

export default ChatInterface;
