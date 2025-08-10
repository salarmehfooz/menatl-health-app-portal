import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { loadMessages, sendMessage, clearMessages } from "../redux/chatSlice";
import { Send, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";

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
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

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

  const handleEmojiClick = (emojiObject) => {
    setNewMessage((prev) => prev + emojiObject.emoji);
    setShowEmojiPicker(false);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-center">
          Please log in to access chat.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      {currentThread && (
        <div className="mb-6 flex items-center gap-3 border-b border-gray-200 pb-4">
          <div className="p-3 bg-gradient-to-r from-green-500 to-green-600 rounded-full text-white font-bold shadow-sm">
            {user.role === "user"
              ? currentThread?.therapistId?.username?.[0]?.toUpperCase()
              : currentThread?.userId?.username?.[0]?.toUpperCase() || "?"}
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              {user.role === "user"
                ? `Dr. ${currentThread?.therapistId?.username || "Therapist"}`
                : currentThread?.userId?.username || "Patient"}
            </h1>
            <p className="text-sm text-gray-500">Chat conversation</p>
          </div>
        </div>
      )}

      {/* Chat Body */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 flex flex-col">
        {localError && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4">
            {localError}
          </div>
        )}

        {!currentThread && (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 mb-4">
            No thread found. Please try again.
          </div>
        )}

        {currentThread && (
          <>
            {/* Messages */}
            <div
              className="border border-gray-200 rounded-lg p-4 mb-4 flex flex-col flex-grow bg-gray-50"
              style={{ maxHeight: "400px", overflowY: "auto" }}
            >
              {loading && (
                <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
                  Loading messages...
                </div>
              )}

              {(() => {
                let lastDate = null;

                return currentMessages.map((msg, index) => {
                  const messageDateObj = new Date(msg.createdAt);
                  const messageDate = messageDateObj.toLocaleDateString([], {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  });

                  const messageTime = messageDateObj.toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  });

                  let dateSeparator = null;
                  if (messageDate !== lastDate) {
                    lastDate = messageDate;

                    const today = new Date();
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);

                    if (
                      messageDateObj.toDateString() === today.toDateString()
                    ) {
                      dateSeparator = "Today";
                    } else if (
                      messageDateObj.toDateString() === yesterday.toDateString()
                    ) {
                      dateSeparator = "Yesterday";
                    } else {
                      dateSeparator = messageDate;
                    }
                  }

                  return (
                    <div key={index}>
                      {/* Date Separator */}
                      {dateSeparator && (
                        <div className="flex items-center my-4">
                          <div className="flex-grow border-t border-gray-300"></div>
                          <span className="mx-3 text-xs text-gray-500 bg-white px-2 py-1 rounded-full shadow-sm">
                            {dateSeparator}
                          </span>
                          <div className="flex-grow border-t border-gray-300"></div>
                        </div>
                      )}

                      {/* Message Bubble */}
                      <div
                        className={`mb-3 flex ${
                          msg.sender === user.role
                            ? "justify-end"
                            : "justify-start"
                        }`}
                      >
                        <div
                          className={`p-3 rounded-2xl shadow-sm text-white max-w-[70%] ${
                            msg.sender === user.role
                              ? "bg-gradient-to-r from-blue-500 to-blue-600"
                              : "bg-gradient-to-r from-green-500 to-green-600"
                          }`}
                        >
                          <span className="block font-semibold text-sm mb-1">
                            {msg.sender === user.role
                              ? "You"
                              : user.role === "user"
                              ? `Dr. ${
                                  currentThread?.therapistId?.username ||
                                  "Therapist"
                                }`
                              : currentThread?.userId?.username || "Patient"}
                          </span>
                          <p className="text-sm break-words">
                            {msg.message || "[No message]"}
                          </p>
                          <span className="block text-xs opacity-80 mt-1 text-right">
                            {messageTime}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                });
              })()}

              <div ref={messagesEndRef} />
            </div>

            {/* Input + Emoji */}
            <form
              onSubmit={handleSend}
              className="flex items-center bg-gray-100 rounded-full p-2 mt-2 relative"
            >
              <button
                type="button"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                className="p-2 text-gray-500 hover:text-gray-700"
              >
                <Smile className="h-5 w-5" />
              </button>

              {showEmojiPicker && (
                <div className="absolute bottom-14 left-2 z-50 shadow-lg">
                  <EmojiPicker onEmojiClick={handleEmojiClick} />
                </div>
              )}

              <input
                type="text"
                className="flex-grow bg-transparent px-3 py-2 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message..."
                disabled={loading}
              />
              <button
                type="submit"
                className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
                disabled={loading || !newMessage.trim()}
              >
                <Send className="h-5 w-5" />
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default ChatInterface;
