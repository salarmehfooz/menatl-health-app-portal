import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createPrescription,
  fetchPrescriptions,
  updatePrescription,
} from "../../redux/prescriptionSlice";
import { getAssignedUsersForTherapist } from "../../redux/assignmentSlice";
import { Pill, FileText } from "lucide-react";

const TherapistPrescriptionPage = () => {
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);

  // Assignment state
  const {
    assignedUsers,
    loading: loadingAssignments,
    assignLoading,
    error: errorAssignments,
  } = useSelector((state) => state.assignments);

  // Prescriptions stored by user ID
  const {
    byUser,
    loading: loadingPrescriptions,
    error: errorPrescriptions,
  } = useSelector((state) => state.prescriptions);

  // Selected patient and prescriptions for that patient
  const [selectedUserId, setSelectedUserId] = useState("");
  const prescriptions = selectedUserId ? byUser[selectedUserId] || [] : [];

  // Local form and UI states
  const [notes, setNotes] = useState("");
  const [fileUrl, setFileUrl] = useState("");
  const [createLoading, setCreateLoading] = useState(false);
  const [createError, setCreateError] = useState(null);
  const [updateError, setUpdateError] = useState(null);
  const [updateLoadingIds, setUpdateLoadingIds] = useState(new Set());

  // Fetch assigned users when user loads
  useEffect(() => {
    if (user?.id) {
      dispatch(getAssignedUsersForTherapist());
    }
  }, [dispatch, user]);

  // Fetch prescriptions for selected patient
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
        <div className="bg-yellow-50 text-yellow-700 rounded-lg p-4 text-center">
          Please log in to access this page.
        </div>
      </div>
    );
  }

  if (loadingAssignments) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
          Loading assigned users...
        </div>
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
            <h1 className="text-3xl font-bold text-gray-900">
              Manage Prescriptions
            </h1>
            <p className="text-gray-600 mt-1">
              Create and manage prescriptions for your patients.
            </p>
          </div>
        </div>
      </div>

      {/* Prescription Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 mb-8">
        {errorAssignments && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4 text-center">
            {errorAssignments}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="patientSelect" className="block font-semibold mb-2">
              Select Patient
            </label>
            <select
              id="patientSelect"
              className="w-full rounded-lg border p-2"
              value={selectedUserId}
              onChange={(e) => setSelectedUserId(e.target.value)}
              required
            >
              <option value="">-- Select a patient --</option>
              {assignedUsers.map((patient) => (
                <option key={patient._id} value={patient._id}>
                  {patient.username || patient.email || "Unnamed"}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="notes" className="block font-semibold mb-2">
              Notes
            </label>
            <textarea
              id="notes"
              className="w-full rounded-lg border p-2"
              placeholder="Prescription notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              required
              disabled={createLoading}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="fileUrl" className="block font-semibold mb-2">
              File URL (optional)
            </label>
            <input
              type="text"
              id="fileUrl"
              className="w-full rounded-lg border p-2"
              placeholder="https://example.com/file.pdf"
              value={fileUrl}
              onChange={(e) => setFileUrl(e.target.value)}
              disabled={createLoading}
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-400"
            disabled={
              !selectedUserId || !notes.trim() || assignLoading || createLoading
            }
          >
            {createLoading ? "Creating..." : "Create Prescription"}
          </button>

          {createError && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 mt-4 text-center">
              {createError}
            </div>
          )}
        </form>
      </div>

      {/* Prescriptions Table */}
      {selectedUserId && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold mb-4">
            Prescriptions for Selected Patient
          </h2>

          {loadingPrescriptions && (
            <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
              Loading prescriptions...
            </div>
          )}

          {errorPrescriptions && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">
              {errorPrescriptions}
            </div>
          )}

          {updateError && (
            <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center mb-4">
              {updateError}
            </div>
          )}

          {!loadingPrescriptions && prescriptions.length === 0 && (
            <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
              No prescriptions found for this patient.
            </div>
          )}

          {!loadingPrescriptions && prescriptions.length > 0 && (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="py-3 px-4 text-left font-semibold">Date</th>
                    <th className="py-3 px-4 text-left font-semibold">Notes</th>
                    <th className="py-3 px-4 text-left font-semibold">File</th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Status
                    </th>
                    <th className="py-3 px-4 text-left font-semibold">
                      Toggle
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {prescriptions.map((prescription) => (
                    <tr
                      key={prescription._id}
                      className="border-b hover:bg-gray-50"
                    >
                      <td className="py-3 px-4">
                        {new Date(prescription.createdAt).toLocaleDateString()}
                      </td>
                      <td className="py-3 px-4">{prescription.notes}</td>
                      <td className="py-3 px-4">
                        {prescription.fileUrl ? (
                          <a
                            href={prescription.fileUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-700 inline-flex items-center"
                          >
                            <FileText className="h-4 w-4 mr-1" />
                            View File
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td
                        className={`py-3 px-4 ${
                          prescription.isActive
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {prescription.isActive ? "Active" : "Inactive"}
                      </td>
                      <td className="py-3 px-4">
                        <input
                          type="checkbox"
                          checked={prescription.isActive}
                          onChange={() => handleToggle(prescription)}
                          disabled={updateLoadingIds.has(prescription._id)}
                          aria-label={`Toggle active status for prescription on ${new Date(
                            prescription.createdAt
                          ).toLocaleDateString()}`}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded"
                        />
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
