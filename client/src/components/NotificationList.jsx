import React, { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchNotifications, markNotificationAsReadOnServer, clearNotificationsOnServer } from "../redux/notificationSlice";
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

  if (loading) return <p className="text-center">Loading notifications...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div className="w-full sm:w-[320px] max-h-[400px] overflow-y-auto bg-white shadow-lg rounded-lg p-4 z-50">
      <audio ref={audioRef} src={notificationSound} preload="auto" />
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-lg font-semibold">Notifications</h3>
        <button className="text-sm text-blue-600 hover:underline" onClick={handleClearAll}>
          Clear All
        </button>
      </div>
      {list.length === 0 ? (
        <p className="text-sm text-gray-500">No notifications</p>
      ) : (
        <ul className="space-y-2">
          {list.map((notif) => (
            <li key={notif._id} className={`p-3 rounded-md cursor-pointer ${notif.read ? "bg-gray-100" : "bg-blue-100"}`} onClick={() => handleMarkRead(notif._id)}>
              <p className="text-sm">{notif.message}</p>
              <small className="text-xs text-gray-500 block mt-1">
                {new Date(notif.createdAt).toLocaleString()} <span className="font-medium">{notif.read ? "(Read)" : "(Unread)"}</span>
              </small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default NotificationList;
