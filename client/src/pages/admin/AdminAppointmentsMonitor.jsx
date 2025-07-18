import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllAppointmentsAdmin } from "../../redux/appointmentSlice";

const AdminAppointmentsMonitor = () => {
  const dispatch = useDispatch();
  const { appointments, loading } = useSelector((state) => state.appointment);

  useEffect(() => {
    dispatch(getAllAppointmentsAdmin());
  }, [dispatch]);

  return (
    <div className="container mt-4">
      <h2 className="mb-4">Monitor All Appointments</h2>
      {loading ? (
        <p>Loading appointments...</p>
      ) : (
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-secondary">
            <tr>
              <th>User</th>
              <th>Therapist</th>
              <th>Date/Time</th>
              <th>Status</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {appointments.map((a) => (
              <tr key={a._id}>
                <td>{a.userId?.name || "User"}</td>
                <td>{a.therapistId?.name || "Therapist"}</td>
                <td>{new Date(a.datetime).toLocaleString()}</td>
                <td>{a.status}</td>
                <td>{a.notes || "-"}</td>
              </tr>
            ))}
            {appointments.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center">
                  No appointments found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default AdminAppointmentsMonitor;
