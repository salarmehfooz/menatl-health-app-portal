import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import app from "../app.js"; // Your Express app entry

import User from "../models/user.js";

let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  await User.deleteMany();
});

const createUser = async (overrides = {}) => {
  const passwordHash = await bcrypt.hash("password123", 10);
  const user = await User.create({
    username: "testuser",
    email: "test@example.com",
    passwordHash,
    role: "user",
    ...overrides,
  });
  return user;
};

const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });
};

describe("Auth routes", () => {
  it("registers a new user", async () => {
    const res = await request(app).post("/api/auth/register").send({
      username: "newuser",
      email: "newuser@example.com",
      password: "password123",
      role: "user",
      gender: "female",
    });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user).toMatchObject({ username: "newuser", role: "user" });
  });

  it("logs in an existing user", async () => {
    const user = await createUser();
    const res = await request(app).post("/api/auth/login").send({
      email: user.email,
      password: "password123",
    });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
    expect(res.body.user.email).toBe(user.email);
  });

  it("rejects invalid login", async () => {
    const res = await request(app).post("/api/auth/login").send({
      email: "wrong@example.com",
      password: "badpassword",
    });
    expect(res.statusCode).toBe(400);
    expect(res.body.msg).toBe("Invalid credentials");
  });
});

describe("User management routes", () => {
  let user, therapist, admin;
  let userToken, therapistToken, adminToken;

  beforeEach(async () => {
    user = await createUser({ username: "normaluser", email: "user@example.com" });
    therapist = await createUser({ role: "therapist", email: "therapist@example.com" });
    admin = await createUser({ role: "admin", email: "admin@example.com" });

    userToken = generateToken(user);
    therapistToken = generateToken(therapist);
    adminToken = generateToken(admin);
  });

  // GET /api/users/therapists (public)
  it("fetches list of therapists", async () => {
    const res = await request(app).get("/api/users/therapists");
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.some(t => t.email === therapist.email)).toBe(true);
  });

  // GET /api/users (admin only)
  it("allows admin to get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("denies non-admin access to get all users", async () => {
    const res = await request(app)
      .get("/api/users")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  // DELETE /api/users/:id (admin only)
  it("allows admin to delete a user", async () => {
    const res = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.msg).toBe("User deleted.");
  });

  it("returns 404 when deleting nonexistent user", async () => {
    const res = await request(app)
      .delete(`/api/users/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("denies non-admin deleting a user", async () => {
    const res = await request(app)
      .delete(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  // GET /api/users/me (current user profile)
  it("gets current user profile", async () => {
    const res = await request(app)
      .get("/api/users/me")
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(user.email);
    expect(res.body).not.toHaveProperty("passwordHash");
  });

  it("rejects profile request without token", async () => {
    const res = await request(app).get("/api/users/me");
    expect(res.statusCode).toBe(401);
  });

  // PUT /api/users/me (update current user)
  it("updates current user profile", async () => {
    const res = await request(app)
      .put("/api/users/me")
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: "updatedUser", gender: "nonbinary" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("updatedUser");
    expect(res.body.user.gender).toBe("nonbinary");
  });

  // GET /api/users/:id (admin only)
  it("allows admin to get user by id", async () => {
    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.email).toBe(user.email);
  });

  it("returns 404 for non-existing user by id", async () => {
    const res = await request(app)
      .get(`/api/users/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${adminToken}`);
    expect(res.statusCode).toBe(404);
  });

  it("denies non-admin to get user by id", async () => {
    const res = await request(app)
      .get(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${userToken}`);
    expect(res.statusCode).toBe(403);
  });

  // PUT /api/users/:id (admin only)
  it("allows admin to update user by id", async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "adminUpdated", email: "updated@example.com", role: "user", gender: "male" });
    expect(res.statusCode).toBe(200);
    expect(res.body.user.username).toBe("adminUpdated");
    expect(res.body.user.email).toBe("updated@example.com");
  });

  it("returns 404 when updating non-existing user", async () => {
    const res = await request(app)
      .put(`/api/users/${new mongoose.Types.ObjectId()}`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ username: "doesntmatter" });
    expect(res.statusCode).toBe(404);
  });

  it("denies non-admin updating user by id", async () => {
    const res = await request(app)
      .put(`/api/users/${user._id}`)
      .set("Authorization", `Bearer ${userToken}`)
      .send({ username: "notallowed" });
    expect(res.statusCode).toBe(403);
  });
});
