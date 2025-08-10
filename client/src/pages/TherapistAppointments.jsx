import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getTherapistAppointments,
  updateAppointment,
} from "../redux/appointmentSlice";
import { Calendar, X } from "lucide-react";

const TherapistAppointments = () => {
  const dispatch = useDispatch();
  const {
    list: appointments,
    loading,
    error,
  } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalType, setModalType] = useState(""); // 'reschedule' or 'cancel'
  const [newDateTime, setNewDateTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.role === "therapist") {
      dispatch(getTherapistAppointments());
    }
  }, [dispatch, user]);

  const handleStatusChange = (id, newStatus) => {
    dispatch(updateAppointment({ id, updatedData: { status: newStatus } }));
  };

  const openModal = (appointment, type) => {
    setSelectedAppointment(appointment);
    setModalType(type);

    if (type === "reschedule") {
      const iso = new Date(appointment.datetime).toISOString().slice(0, 16);
      setNewDateTime(iso);
    } else {
      setCancelReason("");
    }

    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedAppointment(null);
    setNewDateTime("");
    setCancelReason("");
  };

  const handleSubmit = () => {
    if (!selectedAppointment) return;

    const id = selectedAppointment._id;
    let updatedData = {};

    if (modalType === "reschedule") {
      updatedData = {
        datetime: newDateTime,
        rescheduleReason: "Therapist rescheduled via UI",
      };
    } else if (modalType === "cancel") {
      updatedData = {
        status: "cancelled",
        notes: cancelReason,
      };
    }

    dispatch(updateAppointment({ id, updatedData }));
    closeModal();
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-10 flex items-center gap-5">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg shadow-md">
          <Calendar className="h-9 w-9 text-white" />
        </div>
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
            Your Appointments
          </h1>
          <p className="text-gray-600 mt-1 text-lg font-medium">
            Manage your scheduled sessions with patients.
          </p>
        </div>
      </div>

      {/* Appointments Table Container */}
      <div className="bg-white rounded-3xl shadow-xl border border-gray-300 p-8">
        {loading && (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-6 text-center font-semibold shadow-inner">
            Loading appointments...
          </div>
        )}
        {error && (
          <div className="bg-red-50 text-red-700 rounded-lg p-6 text-center font-semibold shadow-inner">
            Error: {error}
          </div>
        )}
        {!loading && appointments.length === 0 && (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-6 text-center font-semibold shadow-inner">
            No appointments found.
          </div>
        )}

        {!loading && appointments.length > 0 && (
          <div className="overflow-x-auto rounded-lg">
            <table className="w-full table-auto border-collapse">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  {["Patient", "Date & Time", "Status", "Notes", "Actions"].map(
                    (heading) => (
                      <th
                        key={heading}
                        className="py-4 px-6 text-left text-gray-900 font-semibold tracking-wide select-none"
                      >
                        {heading}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="border-b border-gray-200 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <td className="py-4 px-6 text-gray-900 font-medium whitespace-nowrap">
                      {appt.userId?.username ?? "Unknown"}
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-medium whitespace-nowrap">
                      {new Date(appt.datetime).toLocaleString()}
                    </td>
                    <td className="py-4 px-6 text-gray-900 font-semibold capitalize whitespace-nowrap">
                      {appt.status}
                      {appt.wasRescheduled && (
                        <span className="ml-3 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full select-none">
                          Rescheduled
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-gray-700 text-sm max-w-xs break-words">
                      {appt.notes || "-"}
                      {appt.rescheduleReason && (
                        <div className="text-gray-500 text-xs mt-1 italic select-text">
                          Reason: {appt.rescheduleReason}
                        </div>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex flex-col space-y-3">
                        {(appt.status === "scheduled" ||
                          appt.status === "rescheduled") && (
                          <>
                            <button
                              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold shadow-md"
                              onClick={() =>
                                handleStatusChange(appt._id, "completed")
                              }
                            >
                              Mark as Completed
                            </button>
                            <button
                              className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-semibold shadow-md"
                              onClick={() => openModal(appt, "reschedule")}
                            >
                              Reschedule
                            </button>
                            <button
                              className="w-full px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-semibold shadow-md"
                              onClick={() => openModal(appt, "cancel")}
                            >
                              Cancel
                            </button>
                          </>
                        )}

                        {(appt.status === "completed" ||
                          appt.status === "cancelled") && (
                          <span className="text-gray-700 font-semibold capitalize">
                            {appt.status}
                          </span>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold text-gray-900">
                {modalType === "reschedule"
                  ? "Reschedule Appointment"
                  : "Cancel Appointment"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700 transition"
                onClick={closeModal}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-6">
              {modalType === "reschedule" ? (
                <div>
                  <label
                    htmlFor="datetime"
                    className="block text-gray-900 font-semibold mb-2"
                  >
                    New Date & Time
                  </label>
                  <input
                    id="datetime"
                    type="datetime-local"
                    className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    value={newDateTime}
                    onChange={(e) => setNewDateTime(e.target.value)}
                  />
                </div>
              ) : (
                <div>
                  <label
                    htmlFor="cancelReason"
                    className="block text-gray-900 font-semibold mb-2"
                  >
                    Reason for Cancellation
                  </label>
                  <textarea
                    id="cancelReason"
                    className="w-full rounded-lg border border-gray-300 p-3 text-gray-900 resize-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    rows={4}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please enter a reason..."
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-3">
              <button
                className="inline-flex items-center px-5 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold shadow-sm"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-semibold shadow-sm"
                onClick={handleSubmit}
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TherapistAppointments;
