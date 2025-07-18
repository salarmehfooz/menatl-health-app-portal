import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTherapistAppointments,
  updateAppointment,
} from "../redux/appointmentSlice";

const TherapistAppointments = () => {
  const dispatch = useDispatch();
  // Slice state uses `list` and `loading` according to your slice
  const {
    list: appointments,
    loading,
    error,
  } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user?._id && user.role === "therapist") {
      dispatch(getTherapistAppointments(user._id));
    }
  }, [dispatch, user]);

  const handleStatusChange = (id, status) => {
    // According to your slice, updateAppointment expects { id, updatedData }
    dispatch(updateAppointment({ id, updatedData: { status } }));
  };

  return (
    <div className="container mt-4">
      <h2>Your Appointments</h2>
      {loading && <p>Loading appointments...</p>}
      {error && <p className="text-danger">Error: {error}</p>}
      {!loading && appointments.length === 0 && <p>No appointments yet.</p>}
      {!loading && appointments.length > 0 && (
        <table className="table table-striped mt-3">
          <thead>
            <tr>
              <th>Patient</th>
              <th>Date & Time</th>
              <th>Status</th>
              <th>Notes</th>
              <th>Update Status</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((appt) => (
              <tr key={appt._id}>
                <td>{appt.userId?.username || "Unknown"}</td>
                <td>{new Date(appt.datetime).toLocaleString()}</td>
                <td>{appt.status}</td>
                <td>{appt.notes || "-"}</td>
                <td>
                  <select
                    className="form-select"
                    value={appt.status}
                    onChange={(e) =>
                      handleStatusChange(appt._id, e.target.value)
                    }
                  >
                    <option value="scheduled">Scheduled</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default TherapistAppointments;
