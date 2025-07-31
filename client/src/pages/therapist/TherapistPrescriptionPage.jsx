import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createPrescription, fetchPrescriptions, updatePrescription } from "../../redux/prescriptionSlice";
import { getAssignedUsersForTherapist } from "../../redux/assignmentSlice";
import { Pill, FileText } from "lucide-react";

const TherapistPrescriptionPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // From assignmentSlice
  const { assignedUsers, loading: loadingAssignments, assignLoading, error: errorAssignments } = useSelector((state) => state.assignments);

  // From prescriptionSlice
  const { list: prescriptions = [], loading: loadingPrescriptions, error: errorPrescriptions } = useSelector((state) => state.prescriptions);

  // Local UI state for creation/update loading & errors
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [updateLoadingIds, setUpdateLoadingIds] = useState(new Set());
  const [updateError, setUpdateError] = useState(null);

  const [selectedUserId, setSelectedUserId] = useState("");
  const [notes, setNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  useEffect(() => {
    if (user?.id) {
      dispatch(getAssignedUsersForTherapist());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (selectedUserId) {
      dispatch(fetchPrescriptions(selectedUserId));
    }
  }, [dispatch, selectedUserId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUserId || !notes.trim()) return;

    setCreateLoading(true);
    setCreateError(null);
    try {
      await dispatch(
        createPrescription({
          userId: selectedUserId,
          therapistId: user.id,
          notes,
          fileUrl,
        })
      ).unwrap();

      // Clear form on success
      setNotes("");
      setFileUrl("");
    } catch (err) {
      setCreateError(err.message || "Failed to create prescription");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleToggle = async (prescription) => {
    setUpdateError(null);
    setUpdateLoadingIds((prev) => new Set(prev).add(prescription._id));

    try {
      await dispatch(
        updatePrescription({
          ...prescription,
          isActive: !prescription.isActive,
        })
      ).unwrap();
    } catch (err) {
      setUpdateError(err.message || "Failed to update prescription");
    } finally {
      setUpdateLoadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(prescription._id);
        return newSet;
      });
    }
  };

  if (!user) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mr-4">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Prescriptions</h1>
              <p className="text-gray-600 mt-1">Please log in to access this page.</p>
            </div>
          </div>
        </div>
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-center">Please log in to access this page.</div>
      </div>
    );
  }

  if (loadingAssignments) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mr-4">
              <Pill className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manage Prescriptions</h1>
              <p className="text-gray-600 mt-1">Loading assigned users...</p>
            </div>
          </div>
        </div>
        <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading assigned users...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-indigo-500 to-indigo-600 rounded-lg mr-4">
            <Pill className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Manage Prescriptions</h1>
            <p className="text-gray-600 mt-1">Create and manage prescriptions for your patients.</p>
          </div>
        </div>
      </div>

      {/* Prescription Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        {errorAssignments && <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4 text-center">{errorAssignments}</div>}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="patientSelect" className="block text-gray-900 font-semibold mb-2">
              Select Patient
            </label>
            <select id="patientSelect" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)} required>
              <option value="">-- Select a patient --</option>
              {assignedUsers.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.username || patient.email || "Unnamed"}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label htmlFor="notes" className="block text-gray-900 font-semibold mb-2">
              Notes
            </label>
            <textarea id="notes" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="Prescription notes" value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} required disabled={createLoading} />
          </div>
          <div className="mb-4">
            <label htmlFor="fileUrl" className="block text-gray-900 font-semibold mb-2">
              File URL (optional)
            </label>
            <input type="text" id="fileUrl" className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500" placeholder="https://example.com/file.pdf" value={fileUrl} onChange={(e) => setFileUrl(e.target.value)} disabled={createLoading} />
          </div>
          <button type="submit" className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400" disabled={!selectedUserId || !notes.trim() || assignLoading || createLoading}>
            {createLoading ? "Creating..." : "Create Prescription"}
          </button>
          {createError && <div className="bg-red-50 text-red-700 rounded-lg p-4 mt-4 text-center">{createError}</div>}
        </form>
      </div>

      {/* Prescriptions Table */}
      {selectedUserId && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Prescriptions for Selected Patient</h2>
          {loadingPrescriptions && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading prescriptions...</div>}
          {errorPrescriptions && <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">{errorPrescriptions}</div>}
          {updateError && <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center mb-4">{updateError}</div>}
          {!loadingPrescriptions && !errorPrescriptions && prescriptions.length === 0 && <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">No prescriptions found for this patient.</div>}
          {!loadingPrescriptions && !errorPrescriptions && prescriptions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">Date</th>
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">Notes</th>
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">File</th>
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">Status</th>
                    <th className="py-3 px-4 text-left text-gray-900 font-semibold">Toggle Active</th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr key={prescription._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4 text-gray-900">{new Date(prescription.createdAt).toLocaleDateString()}</td>
                      <td className="py-3 px-4 text-gray-900">{prescription.notes}</td>
                      <td className="py-3 px-4 text-gray-900">
                        {prescription.fileUrl ? (
                          <a href={prescription.fileUrl} target="_blank" rel="noreferrer" className="inline-flex items-center text-blue-600 hover:text-blue-700">
                            <FileText className="h-4 w-4 mr-1" />
                            View File
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-900">
                        <span className={prescription.isActive ? "text-green-600" : "text-red-600"}>{prescription.isActive ? "Active" : "Inactive"}</span>
                      </td>
                      <td className="py-3 px-4">
                        <input type="checkbox" checked={prescription.isActive} onChange={() => handleToggle(prescription)} aria-label={`Toggle active status for prescription on ${new Date(prescription.createdAt).toLocaleDateString()}`} disabled={updateLoadingIds.has(prescription._id)} className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default TherapistPrescriptionPage;
