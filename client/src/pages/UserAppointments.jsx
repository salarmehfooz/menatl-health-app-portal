import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getUserAppointments,
  updateAppointment,
} from "../redux/appointmentSlice";
import { Calendar, X } from "lucide-react";

const UserAppointments = () => {
  const dispatch = useDispatch();
  const { list: appointments } = useSelector((state) => state.appointments);
  const { user } = useSelector((state) => state.auth);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [modalType, setModalType] = useState(""); // 'reschedule' or 'cancel'
  const [newDateTime, setNewDateTime] = useState("");
  const [cancelReason, setCancelReason] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (user?.id && user?.role === "user") {
      dispatch(getUserAppointments(user.id));
    }
  }, [dispatch, user]);

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
        rescheduleReason: "User rescheduled via UI",
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
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center mb-4">
          <div className="p-2 bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg mr-4">
            <Calendar className="h-8 w-8 text-white" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Your Appointments
            </h1>
            <p className="text-gray-600 mt-1">
              Manage your scheduled sessions.
            </p>
          </div>
        </div>
      </div>

      {/* Appointments Table */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
        {appointments.length === 0 ? (
          <div className="bg-blue-50 text-blue-700 rounded-lg p-4 text-center">
            You have no appointments.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                    Therapist
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                    Date & Time
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                    Status
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                    Notes
                  </th>
                  <th className="py-3 px-4 text-left text-gray-900 font-semibold">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {appointments.map((appt) => (
                  <tr
                    key={appt._id}
                    className="border-b border-gray-200 hover:bg-gray-50"
                  >
                    <td className="py-3 px-4 text-gray-900">
                      {"Dr "} {appt.therapistId?.username || "Unknown"}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      {new Date(appt.datetime).toLocaleString()}
                    </td>
                    <td className="py-3 px-4 text-gray-900">
                      <span className="capitalize">{appt.status}</span>
                      {appt.wasRescheduled && (
                        <span className="ml-2 inline-flex items-center px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                          Rescheduled
                        </span>
                      )}
                    </td>
                    <td className="py-3 px-4 text-gray-600 text-sm">
                      {appt.notes || "-"}
                      {appt.rescheduleReason && (
                        <div className="text-gray-500 text-sm mt-1">
                          Reason: {appt.rescheduleReason}
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4">
                      {appt.status === "scheduled" ||
                      appt.status === "rescheduled" ? (
                        <div className="flex space-x-2">
                          <button
                            className="inline-flex items-center px-3 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors"
                            onClick={() => openModal(appt, "reschedule")}
                          >
                            Reschedule
                          </button>
                          <button
                            className="inline-flex items-center px-3 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                            onClick={() => openModal(appt, "cancel")}
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-gray-500 text-sm capitalize">
                          {appt.status}
                        </span>
                      )}
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
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {modalType === "reschedule"
                  ? "Reschedule Appointment"
                  : "Cancel Appointment"}
              </h2>
              <button
                className="text-gray-500 hover:text-gray-700"
                onClick={closeModal}
                aria-label="Close"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <div className="mb-4">
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
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
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
                    className="w-full rounded-lg border border-gray-300 p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows={3}
                    value={cancelReason}
                    onChange={(e) => setCancelReason(e.target.value)}
                    placeholder="Please enter a reason..."
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end space-x-2">
              <button
                className="inline-flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                onClick={closeModal}
              >
                Close
              </button>
              <button
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
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

export default UserAppointments;
