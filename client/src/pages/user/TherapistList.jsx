import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTherapists } from "../../api/adminAPI";

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
      <div className="container mt-4">
        <div className="alert alert-warning">
          Please log in to view therapists.
        </div>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Available Therapists</h2>
      {loading ? (
        <p>Loading therapists...</p>
      ) : (
        <div className="row">
          {therapists.map((therapist) => (
            <div className="col-md-4 mb-4" key={therapist._id}>
              <div className="card shadow-sm h-100">
                <div className="card-body">
                  <h5 className="card-title">{therapist.username}</h5>
                  <p className="card-text">{therapist.email}</p>
                  {/* Optional: Display gender or other fields if available */}
                  <p className="text-muted small">
                    Gender: {therapist.gender || "N/A"}
                  </p>
                  <button
                    className="btn btn-outline-primary"
                    onClick={() => handleMessage(therapist._id)}
                  >
                    Message
                  </button>
                </div>
              </div>
            </div>
          ))}
          {therapists.length === 0 && (
            <div className="col-12">
              <p>No therapists found.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TherapistList;
