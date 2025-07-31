import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk, fetchTherapistsThunk } from "../../redux/adminSlice";
import { fetchAssignments, removeUserFromTherapist } from "../../redux/assignmentSlice";
import TherapistAssignmentForm from "./TherapistAssignmentForm";
import { Users, Trash2 } from "lucide-react";

const TherapistAssignmentsPage = () => {
  const dispatch = useDispatch();
  const { users, therapists, loading: adminLoading, error: adminError } = useSelector((state) => state.admin);
  const { assignments, loading: assignmentsLoading, error: assignmentError } = useSelector((state) => state.assignments);

  const isLoading = adminLoading || assignmentsLoading;
  const error = adminError || assignmentError;

  useEffect(() => {
    dispatch(fetchUsersThunk());
    dispatch(fetchTherapistsThunk());
    dispatch(fetchAssignments());
  }, [dispatch]);

  const handleRemoveUser = async (therapistId, userId) => {
    const confirm = window.confirm("Are you sure you want to unassign this user from the therapist?");
    if (!confirm) return;
    try {
      await dispatch(removeUserFromTherapist({ therapistId, userId })).unwrap();
      dispatch(fetchAssignments());
    } catch (err) {
      alert("Failed to remove user: " + err);
    }
  };

  const userOnly = users.filter((u) => u.role === "user");
  const filteredAssignments = assignments.filter((a) => a.assignedUsers && a.assignedUsers.length > 0);

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-teal-500 to-teal-600 rounded-lg mr-4">
            <Users className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Therapist Assignments</h1>
            <p className="text-gray-600 mt-1">View and manage therapist assignments.</p>
          </div>
        </div>
      </div>

      {/* Assignments Content */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {isLoading ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">Loading...</div>
        ) : error ? (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 text-center">Error: {error}</div>
        ) : (
          <>
            {/* Form to assign users */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Assign Users</h2>
              <TherapistAssignmentForm therapists={therapists} users={userOnly} />
            </div>

            {/* Current assignments list */}
            <div>
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Current Assignments</h2>
              {filteredAssignments.length === 0 ? (
                <div className="text-center p-4 text-gray-600">No assignments yet.</div>
              ) : (
                <div className="space-y-4">
                  {filteredAssignments.map((a, index) => (
                    <div key={a._id || `assignment-${index}`} className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
                      <h3 className="font-semibold text-gray-900">{a.therapistId?.username || "Unknown Therapist"}</h3>
                      <p className="text-gray-600 text-sm mb-2">Assigned to:</p>
                      <ul className="space-y-2">
                        {a.assignedUsers.map((u, idx) => (
                          <li key={u._id || `user-${idx}`} className="flex justify-between items-center">
                            <span className="text-gray-900">{u.username || "Unnamed User"}</span>
                            <button onClick={() => handleRemoveUser(a.therapistId._id, u._id)} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
                              <Trash2 className="h-4 w-4 mr-2" />
                              Remove
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default TherapistAssignmentsPage;
