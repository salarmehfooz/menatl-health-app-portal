import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTherapists } from "../../api/adminAPI";
import { Users, MessageCircle } from "lucide-react";

const TherapistList = () => {
  const [therapists, setTherapists] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const loadTherapists = async () => {
      try {
        const data = await fetchTherapists();
        setTherapists(data);
      } catch (err) {
        console.error("Failed to load therapists:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadTherapists();
  }, []);

  const handleMessage = (therapistId) => {
    navigate(`/start-chat/${therapistId}`);
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
              <Users className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Available Therapists</h1>
              <p className="text-gray-600 mt-1">Please log in to view therapists.</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-center">Please log in to view therapists.</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Available Therapists</h1>
            <p className="text-gray-600 mt-1">Connect with our professional therapists.</p>
          </div>
        </div>
      </div>

      {/* Therapist List */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {loading ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading therapists...</div>
        ) : therapists.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">No therapists found.</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {therapists.map((therapist) => (
              <div key={therapist._id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-lg transition-all duration-200">
                <h3 className="font-semibold text-gray-900 mb-2">{therapist.username}</h3>
                <p className="text-gray-600 text-sm mb-2">{therapist.email}</p>
                <p className="text-gray-500 text-sm mb-4">Gender: {therapist.gender || "N/A"}</p>
                <button onClick={() => handleMessage(therapist._id)} className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  <MessageCircle className="h-4 w-4 mr-2" />
                  Message
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default TherapistList;
