import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatThreads } from "../../redux/chatSlice";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const TherapistChatThreads = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { threads, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user?.role === "therapist") {
      dispatch(getChatThreads());
    }
  }, [dispatch, user]);

  if (!user || user.role !== "therapist") {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Your Chat Threads</h1>
              <p className="text-gray-600 mt-1">Access denied.</p>
            </div>
          </div>
        </div>
        <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">Access denied.</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Your Chat Threads</h1>
            <p className="text-gray-600 mt-1">Connect with your patients.</p>
          </div>
        </div>
      </div>

      {/* Chat Threads List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading...</div>}
        {error && <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">{error}</div>}
        {!loading && threads.length === 0 && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">No chat threads available.</div>}
        {!loading && threads.length > 0 && (
          <div className="space-y-4">
            {threads.map((thread) => (
              <div key={thread._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-200 flex justify-between items-center">
                <div>
                  <h3 className="font-semibold text-gray-900">Patient: {thread.userId?.username || "Unknown"}</h3>
                  <p className="text-gray-600 text-sm mt-1">Last message: {thread.lastMessage || "No message yet"}</p>
                </div>
                <Link to={`/chat/${thread._id}`} className="inline-flex items-center px-3 py-1 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Open Chat
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistChatThreads;
