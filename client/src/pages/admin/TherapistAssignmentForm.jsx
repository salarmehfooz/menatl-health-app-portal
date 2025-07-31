import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { assignUsers } from "../../redux/assignmentSlice";
import { useNavigate } from "react-router-dom";
import { Link } from "lucide-react";

const TherapistAssignmentForm = ({ existingAssignment, onSuccess }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const users = useSelector((state) => state.admin.users);
  const therapists = useSelector((state) => state.admin.therapists);

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedTherapist, setSelectedTherapist] = useState(existingAssignment?.therapistId?._id || "");
  const [selectedUsers, setSelectedUsers] = useState(existingAssignment?.assignedUsers?.map((u) => u._id) || []);

  const patients = users.filter((u) => u.role === "user");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await dispatch(
        assignUsers({
          therapistId: selectedTherapist,
          assignedUsers: selectedUsers,
        })
      ).unwrap();
      setLoading(false);
      navigate("/therapist-assignments");
      if (onSuccess) onSuccess();
    } catch (err) {
      setError(err);
      setLoading(false);
    }
  };

  const handleUserSelection = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(options[i].value);
    }
    setSelectedUsers(selected);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mr-4">
            <Link className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Register Therapist Assignments</h1>
            <p className="text-gray-600 mt-1">Assign therapists to patients.</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="therapistSelect" className="block text-gray-900 font-semibold mb-2">
              Therapist
            </label>
            <select id="therapistSelect" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={selectedTherapist} onChange={(e) => setSelectedTherapist(e.target.value)} required>
              <option value="" disabled>
                Select therapist
              </option>
              {therapists.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="patientsSelect" className="block text-gray-900 font-semibold mb-2">
              Assign Patients (multiple)
            </label>
            <select multiple id="patientsSelect" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={selectedUsers} onChange={handleUserSelection}>
              {patients.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.username}
                </option>
              ))}
            </select>
          </div>

          {error && <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4">{error}</div>}

          <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={loading}>
            {loading ? "Saving..." : "Save Assignment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default TherapistAssignmentForm;
