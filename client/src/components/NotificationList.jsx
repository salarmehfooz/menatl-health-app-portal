import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchNotifications,
  markNotificationAsReadOnServer,
  clearNotificationsOnServer,
} from "../redux/notificationSlice";
import notificationSound from "../assets/notification.mp3"; // 🔔 Add a sound file in assets folder

const NotificationList = () => {
  const dispatch = useDispatch();
  const { list, loading, error } = useSelector((state) => state.notifications);
  const prevLengthRef = useRef(list.length);
  const audioRef = useRef(null);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // 🔊 Play sound if new notification arrives
  useEffect(() => {
    if (list.length > prevLengthRef.current) {
      audioRef.current?.play();
    }
    prevLengthRef.current = list.length;
  }, [list]);

  const handleMarkRead = (id) => {
    dispatch(markNotificationAsReadOnServer(id));
  };

  const handleClearAll = () => {
    dispatch(clearNotificationsOnServer());
  };

  if (loading)
    return (
      <p className="text-center text-gray-600 py-6 font-medium">
        Loading notifications...
      </p>
    );
  if (error)
    return (
      <p className="text-center text-red-600 py-6 font-semibold">
        Error: {error}
      </p>
    );

  return (
    <div className="w-full sm:w-[320px] max-h-[400px] overflow-y-auto bg-white shadow-xl rounded-xl p-5 z-50 border border-gray-200">
      <audio ref={audioRef} src={notificationSound} preload="auto" />
      <div className="flex justify-between items-center mb-4 border-b border-gray-200 pb-2">
        <h3 className="text-lg font-semibold text-gray-900 tracking-wide">
          Notifications
        </h3>
        <button
          className="text-sm text-blue-600 font-semibold hover:text-blue-800 transition"
          onClick={handleClearAll}
          aria-label="Clear all notifications"
        >
          Clear All
        </button>
      </div>

      {list.length === 0 ? (
        <p className="text-sm text-gray-500 italic text-center py-10">
          No notifications
        </p>
      ) : (
        <ul className="space-y-3">
          {list.map((notif) => (
            <li
              key={notif._id}
              className={`p-4 rounded-lg cursor-pointer shadow-sm transition hover:shadow-md ${
                notif.read ? "bg-gray-100" : "bg-blue-100"
              }`}
              onClick={() => handleMarkRead(notif._id)}
              title={notif.message}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  handleMarkRead(notif._id);
                }
              }}
            >
              <p className="text-sm text-gray-800 font-medium leading-snug">
                {notif.message}
              </p>
              <small className="text-xs text-gray-500 mt-1 block select-text">
                {new Date(notif.createdAt).toLocaleString()}{" "}
                <span className="font-semibold">
                  {notif.read ? "(Read)" : "(Unread)"}
                </span>
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
