import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedTherapistForUser } from "../redux/assignmentSlice";

const AssignedTherapist = () => {
  const dispatch = useDispatch();

  const { therapist, loading, error } = useSelector(
    (state) => state.assignments
  );

  useEffect(() => {
    dispatch(getAssignedTherapistForUser());
  }, [dispatch]);

  if (loading) {
    return <div>Loading assigned therapist...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  if (!therapist) {
    return <div>You do not have an assigned therapist yet.</div>;
  }

  return (
    <div className="card p-3 mb-3">
      <h4>Your Assigned Therapist</h4>
      <p>
        <strong>Username: </strong> {"Dr "} {therapist.username}
      </p>
      <p>
        <strong>Email:</strong> {therapist.email}
      </p>
      {/* Add more info if you have, e.g. phone, specialty, etc. */}
    </div>
  );
};

export default AssignedTherapist;
