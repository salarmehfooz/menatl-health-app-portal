import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getChatThreads } from "../../redux/chatSlice";
import { Link } from "react-router-dom";
import { MessageCircle } from "lucide-react";

const UserChatThreads = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { threads, loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    if (user?.role === "user") {
      dispatch(getChatThreads());
    }
  }, [dispatch, user]);

  if (!user || user.role !== "user") {
    return (
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-10 flex flex-col sm:flex-row items-center gap-5">
          <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg">
            <MessageCircle className="h-12 w-12 text-white" />
          </div>
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
              Your Chat Threads
            </h1>
            <p className="text-gray-600 mt-2 text-lg font-medium">
              Access denied.
            </p>
          </div>
        </div>
        <div className="bg-yellow-50 text-yellow-900 rounded-xl p-6 text-center font-semibold shadow-md border border-yellow-200">
          Access denied.
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-12 flex flex-col sm:flex-row items-center gap-5">
        <div className="p-4 bg-gradient-to-r from-green-600 to-green-700 rounded-xl shadow-lg">
          <MessageCircle className="h-12 w-12 text-white" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 tracking-tight">
            Your Chat Threads
          </h1>
          <p className="text-gray-600 mt-2 text-lg font-medium">
            View your conversations with therapists.
          </p>
        </div>
      </div>

      {/* Chat Threads List */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-6 sm:p-10">
        {loading && (
          <div className="bg-blue-50 text-blue-700 rounded-xl p-6 text-center font-semibold shadow-md animate-pulse">
            Loading...
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 rounded-xl p-6 mb-8 font-semibold shadow-md border border-red-200">
            {error}
          </div>
        )}
        {threads.length === 0 && !loading && (
          <div className="bg-blue-50 text-blue-700 rounded-xl p-6 text-center font-semibold shadow-md">
            No chat threads available.
          </div>
        )}

        <div className="space-y-8">
          {threads.map((thread) => (
            <div
              key={thread._id}
              className="bg-gray-50 hover:bg-white transition-colors rounded-2xl shadow-lg border border-gray-300 p-6 sm:p-8 flex flex-col sm:flex-row justify-between items-center"
            >
              <div className="max-w-full sm:max-w-[70%]">
                <h3 className="font-semibold text-gray-900 text-lg sm:text-xl">
                  Doctor:{" "}
                  <span className="text-green-600">
                    {thread.therapistId?.username || "Unknown"}
                  </span>
                </h3>
                <p className="text-gray-600 text-base mt-2 italic truncate">
                  Last message: {thread.lastMessage || "No message yet"}
                </p>
              </div>
              <Link
                to={`/chat/${thread._id}`}
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700 transition-colors font-semibold text-sm sm:text-lg mt-4 sm:mt-0"
              >
                <MessageCircle className="h-6 w-6 mr-3" />
                Open Chat
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserChatThreads;
