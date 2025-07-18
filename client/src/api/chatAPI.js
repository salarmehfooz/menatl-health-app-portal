const BASE_URL = "http://localhost:5000/api/chat";

// ✅ Get all chat threads for the current user
export const fetchChats = async () => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/threads`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch chat threads");
  return await res.json(); // Returns array of thread objects
};

// ✅ Start a new thread by sending the first message
export const createChatThread = async ({ recipientId, message }) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ recipientId, message }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create chat thread");

  return data; // { thread, chatMessage }
};

// ✅ Fetch all messages in a thread
export const fetchMessagesByThread = async (threadId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}/thread/${threadId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Failed to fetch messages");
  return await res.json(); // Returns array of messages
};

// ✅ Send a message to an existing thread
export const sendChatMessage = async ({ threadId, message }) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ threadId, message }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Send chat error response:", data);
    throw new Error(data.message || "Failed to send message");
  }

  return data; // { thread, chatMessage }
};
