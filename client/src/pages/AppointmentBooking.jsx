import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { bookAppointment } from "../redux/appointmentSlice";
import { fetchTherapistsThunk } from "../redux/adminSlice";
import { Calendar } from "lucide-react";

const AppointmentBooking = () => {
  const dispatch = useDispatch();
  const { therapists } = useSelector((state) => state.admin);
  const user = useSelector((state) => state.auth.user);
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
    setSuccessMsg("");

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
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center mb-4">
            <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
              <Calendar className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Book an Appointment
              </h1>
              <p className="text-gray-600 mt-1">
                Please log in to book an appointment.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Book an Appointment
            </h1>
            <p className="text-gray-600 mt-1">
              Schedule a session with a therapist.
            </p>
          </div>
        </div>
      </div>

      {/* Booking Form */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {successMsg && (
          <div className="bg-green-50 text-green-700 rounded-lg p-4 mb-4">
            {successMsg}
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg p-4 mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="therapistSelect"
              className="block text-gray-900 font-semibold mb-2"
            >
              Select Therapist
            </label>
            <select
              id="therapistSelect"
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={therapistId}
              onChange={(e) => setTherapistId(e.target.value)}
              required
            >
              <option value="">-- Choose Therapist --</option>
              {therapists.map((therapist) => (
                <option key={therapist._id} value={therapist._id}>
                  {"Dr "}
                  {therapist.username}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label
              htmlFor="datetime"
              className="block text-gray-900 font-semibold mb-2"
            >
              Date & Time
            </label>
            <input
              type="datetime-local"
              id="datetime"
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={datetime}
              onChange={(e) => setDatetime(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label
              htmlFor="notes"
              className="block text-gray-900 font-semibold mb-2"
            >
              Notes (optional)
            </label>
            <textarea
              id="notes"
              className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
            />
          </div>

          <button
            type="submit"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-400"
            disabled={loading}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AppointmentBooking;
