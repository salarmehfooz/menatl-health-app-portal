// src/pages/therapist/TherapistDashboard.jsx
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getTherapistAppointments } from "../../redux/appointmentSlice";
import { useNavigate } from "react-router-dom";

const TherapistDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { therapistAppointments, loading } = useSelector((state) => state.appointment);

  useEffect(() => {
    if (user?._id) {
      dispatch(getTherapistAppointments(user._id));
    }
  }, [dispatch, user]);

  return (
    <div className="container mt-4">
      <h2>Welcome, {user?.name}</h2>
      <h4 className="mt-3">Your Appointments</h4>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <table className="table table-striped table-hover mt-3">
          <thead className="table-dark">
            <tr>
              <th>User</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {therapistAppointments?.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.userId?.name || "Anonymous"}</td>
                <td>{new Date(appt.datetime).toLocaleString()}</td>
                <td>{appt.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TherapistDashboard;
