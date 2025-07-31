// src/api/authAPI.js

export const loginUser = async (credentials) => {
  const res = await fetch("http://localhost:5000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    throw new Error("Invalid login credentials");
  }

  const data = await res.json(); // contains { user, token }

  // ✅ Save token to localStorage
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const registerUser = async (userData) => {
  const res = await fetch("http://localhost:5000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!res.ok) {
    throw new Error("Registration failed");
  }

  const data = await res.json();

  // ✅ Save token
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

  return data;
};

export const fetchUserProfile = async (userId) => {
  const token = localStorage.getItem("token");

  const res = await fetch(`http://localhost:5000/api/users/me/${userId}`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch user profile");
  }

  return await res.json(); // returns { user }
};
