import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAssignedUsersForTherapist } from "../redux/assignmentSlice";

const AssignedUsersForTherapist = () => {
  const dispatch = useDispatch();

  const { assignedUsers, loading, error } = useSelector(
    (state) => state.assignments
  );

  useEffect(() => {
    dispatch(getAssignedUsersForTherapist());
  }, [dispatch]);

  if (loading) {
    return <div>Loading your assigned users...</div>;
  }

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  if (!assignedUsers || assignedUsers.length === 0) {
    return <div>You have no assigned users at the moment.</div>;
  }

  return (
    <div className="card p-3 mb-3">
      <h4>Your Assigned Users</h4>
      <ul>
        {assignedUsers.map((user) => (
          <li key={user._id}>
            <strong>{user.username}</strong> - {user.email}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AssignedUsersForTherapist;
