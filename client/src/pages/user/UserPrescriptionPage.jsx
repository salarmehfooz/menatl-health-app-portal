import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPrescriptions } from "../../redux/prescriptionSlice";

const UserPrescriptionPage = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const {
    list: prescriptions,
    loading,
    error,
  } = useSelector((state) => state.prescriptions);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchPrescriptions(user._id));
    }
  }, [dispatch, user?._id]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold text-gray-900 mb-6">
        Your Prescriptions
      </h2>

      {loading ? (
        <p className="text-gray-500">Loading...</p>
      ) : error ? (
        <p className="text-red-500">Error: {error}</p>
      ) : prescriptions && prescriptions.length === 0 ? (
        <p className="text-gray-500">No active prescriptions found.</p>
      ) : (
        <ul className="space-y-6">
          {prescriptions.map((prescription) => (
            <li
              key={prescription._id}
              className="p-6 bg-white rounded-xl shadow border border-gray-200"
            >
              <p className="text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">Date:</span>{" "}
                {new Date(prescription.createdAt).toLocaleDateString()}
              </p>
              <p className="text-gray-700 mb-2">
                <span className="font-semibold text-gray-900">Notes:</span>{" "}
                {prescription.notes || "No notes provided."}
              </p>

              {prescription.fileUrl && (
                <p className="mb-2">
                  <a
                    href={prescription.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium"
                  >
                    📎 View File
                  </a>
                </p>
              )}

              <p className="text-gray-700">
                <span className="font-semibold text-gray-900">Status:</span>{" "}
                <span
                  className={`font-medium ${
                    prescription.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {prescription.isActive ? "Active" : "Inactive"}
                </span>
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserPrescriptionPage;
