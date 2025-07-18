import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment } from "../redux/appointmentSlice";
import { fetchTherapistsThunk } from "../redux/adminSlice";

const AppointmentBooking = () => {
  const dispatch = useDispatch();
  const { therapists } = useSelector((state) => state.admin);
  const user = useSelector((state) => state.auth.user); // safer to avoid destructuring null
  const { loading, error } = useSelector((state) => state.appointments);

  const [therapistId, setTherapistId] = useState("");
  const [datetime, setDatetime] = useState("");
  const [notes, setNotes] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    dispatch(fetchTherapistsThunk());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg(""); // Clear previous message

    if (!user) {
      alert("Please log in to book an appointment.");
      return;
    }

    if (therapistId && datetime) {
      try {
        await dispatch(
          bookAppointment({
            therapistId,
            datetime,
            notes,
          })
        ).unwrap();

        setSuccessMsg("Appointment booked successfully!");
        setTherapistId("");
        setDatetime("");
        setNotes("");
      } catch (err) {
        console.error("Booking failed:", err);
      }
    }
  };

  if (!user) {
    return (
      <div className="container mt-4">
        <h2>Book an Appointment</h2>
        <p>Please log in to book an appointment.</p>
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Book an Appointment</h2>

      {successMsg && <div className="alert alert-success">{successMsg}</div>}
      {error && <div className="alert alert-danger">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group mb-3">
          <label>Select Therapist</label>
          <select
            className="form-select"
            value={therapistId}
            onChange={(e) => setTherapistId(e.target.value)}
            required
          >
            <option value="">-- Choose Therapist --</option>
            {therapists.map((therapist) => (
              <option key={therapist._id} value={therapist._id}>
                {therapist.username}
              </option>
            ))}
          </select>
        </div>

        <div className="form-group mb-3">
          <label>Date & Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={datetime}
            onChange={(e) => setDatetime(e.target.value)}
            required
          />
        </div>

        <div className="form-group mb-3">
          <label>Notes (optional)</label>
          <textarea
            className="form-control"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
          />
        </div>

        <button className="btn btn-success" disabled={loading}>
          {loading ? "Booking..." : "Book Appointment"}
        </button>
      </form>
    </div>
  );
};

export default AppointmentBooking;
