import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchTherapistsThunk } from "../redux/adminSlice";
import { startNewChat } from "../redux/chatSlice";
import { useNavigate } from "react-router-dom";
import { MessageCircle, X } from "lucide-react";

const StartNewChat = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedTherapist, setSelectedTherapist] = useState("");
  const [customMessage, setCustomMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showErrorModal, setShowErrorModal] = useState(false);

  const { therapists } = useSelector((state) => state.admin);
  const { user } = useSelector((state) => state.auth);
  const { loading, error } = useSelector((state) => state.chat);

  useEffect(() => {
    dispatch(fetchTherapistsThunk());
  }, [dispatch]);

  const handleStartChat = async () => {
    if (!selectedTherapist || !customMessage.trim()) {
      setErrorMessage("Please select a therapist and enter a message.");
      setShowErrorModal(true);
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
        setErrorMessage("Chat could not be started.");
        setShowErrorModal(true);
      }
    } catch (err) {
      console.error("Start chat error:", err);
      setErrorMessage("Could not start chat. Please try again.");
      setShowErrorModal(true);
    }
  };

  const closeErrorModal = () => {
    setShowErrorModal(false);
    setErrorMessage("");
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-green-500 to-green-600 rounded-lg mr-4">
              <MessageCircle className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Start New Chat</h1>
              <p className="text-gray-600 mt-1">Please log in to start a chat.</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-center">Please log in to start a chat.</div>
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
            <h1 className="text-3xl font-bold text-gray-900">Start New Chat</h1>
            <p className="text-gray-600 mt-1">Connect with a therapist to begin a conversation.</p>
          </div>
        </div>
      </div>

      {/* Chat Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {error && <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4 text-center">{error}</div>}
        <div className="mb-4">
          <label htmlFor="therapistSelect" className="block text-gray-900 font-semibold mb-2">
            Select Therapist
          </label>
          <select id="therapistSelect" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={selectedTherapist} onChange={(e) => setSelectedTherapist(e.target.value)}>
            <option value="">-- Choose a Therapist --</option>
            {therapists.length === 0 && <option disabled>No therapists found</option>}
            {therapists.map((therapist) => (
              <option key={therapist._id} value={therapist._id}>
                {therapist.username}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="message" className="block text-gray-900 font-semibold mb-2">
            Your Message
          </label>
          <input id="message" type="text" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Type your message..." value={customMessage} onChange={(e) => setCustomMessage(e.target.value)} />
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:bg-green-400" onClick={handleStartChat} disabled={!selectedTherapist || loading}>
          <MessageCircle className="h-4 w-4 mr-2" />
          {loading ? "Starting Chat..." : "Start Chat"}
        </button>
      </div>

      {/* Error Modal */}
      {showErrorModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Error</h2>
              <button className="text-gray-500 hover:text-gray-700" onClick={closeErrorModal} aria-label="Close">
                <X className="h-6 w-6" />
              </button>
            </div>
            <p className="text-gray-600 mb-4">{errorMessage}</p>
            <div className="flex justify-end">
              <button className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors" onClick={closeErrorModal}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StartNewChat;
