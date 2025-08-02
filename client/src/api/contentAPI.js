const BASE_URL = "https://mental-health-app-portal.onrender.com/api/content";

export const createContent = async (data) => {
  const res = await fetch(`${BASE_URL}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to create content");
  return res.json();
};

export const fetchAllContent = async () => {
  const response = await fetch(
    "https://mental-health-app-portal.onrender.com/api/content",
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch content: " + response.statusText);
  }

  return await response.json();
};

export const updateContent = async (id, data) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Failed to update content");
  return res.json();
};

export const deleteContent = async (id) => {
  const res = await fetch(`${BASE_URL}/${id}`, {
    method: "DELETE",
    headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
  });
  if (!res.ok) throw new Error("Failed to delete content");
  return res.json();
};
