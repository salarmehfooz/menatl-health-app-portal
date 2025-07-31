import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadMessages, sendMessage, clearMessages } from "../redux/chatSlice";
import { MessageCircle } from "lucide-react";

const ChatInterface = () => {
  const { threadId } = useParams();
  const dispatch = useDispatch();
  const messagesEndRef = useRef(null);
  const { user } = useSelector((state) => state.auth);
  const { currentMessages, loading, threads } = useSelector((state) => state.chat);

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
              <p className="text-gray-600 mt-1">Please log in to access chat.</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-center">Please log in to access chat.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4">
            <MessageCircle className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Chat</h1>
            <p className="text-gray-600 mt-1">Message your therapist.</p>
          </div>
        </div>
      </div>

      {/* Chat Interface */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {localError && <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4">{localError}</div>}

        {!currentThread && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 mb-4">No thread found. Please try again.</div>}

        {currentThread && (
          <>
            <div className="border border-gray-200 rounded-lg p-4 mb-4" style={{ maxHeight: "400px", overflowY: "auto" }}>
              {loading && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading messages...</div>}

              {currentMessages.map((msg, index) => (
                <div key={index} className={`mb-2 flex ${msg.sender === user.role ? "justify-end" : "justify-start"}`}>
                  <div className={`inline-block p-3 rounded-lg ${msg.sender === user.role ? "bg-blue-100 text-blue-900" : "bg-green-100 text-green-900"} max-w-[70%]`}>
                    <span className="font-semibold">{msg.sender === user.role ? "You" : "Them"}</span>
                    <p className="mt-1">{msg.message || "[No message]"}</p>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <form onSubmit={handleSend} className="flex space-x-2">
              <input type="text" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} placeholder="Type your message..." disabled={loading} />
              <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={loading || !newMessage.trim()}>
                {loading ? "Sending..." : "Send"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
