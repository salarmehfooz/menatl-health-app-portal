import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserAppointments } from "../redux/appointmentSlice";

const UserAppointments = () => {
  const dispatch = useDispatch();
  const { appointments } = useSelector((state) => state.appointment);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?.id && user?.role === "user") {
      dispatch(getUserAppointments(user.id));
    }
  }, [dispatch, user]);

  return (
    <div className="container mt-4">
      <h2>Your Appointments</h2>
      {appointments.length === 0 ? (
        <p>You have no appointments.</p>
      ) : (
        <table className="table table-bordered mt-3">
          <thead>
            <tr>
              <th>Therapist</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.therapistId?.username || "Unknown"}</td>
                <td>{new Date(appt.datetime).toLocaleString()}</td>
                <td>{appt.status}</td>
                <td>{appt.notes || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default UserAppointments;
