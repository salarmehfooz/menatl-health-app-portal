import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js"; // Your Express app
import Assignment from "../models/assignmentModel.js";

let mongoServer;
let userToken, therapistToken, adminToken;
let moodLogId;
let userId, therapistId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Register & login a user (role: user)
  await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "user@test.com",
    password: "password123",
    role: "user",
  });
  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "password123",
  });
  userToken = userLogin.body.token;
  userId = userLogin.body.user.id;

  // Register & login a therapist
  await request(app).post("/api/auth/register").send({
    name: "Test Therapist",
    email: "therapist@test.com",
    password: "password123",
    role: "therapist",
  });
  const therapistLogin = await request(app).post("/api/auth/login").send({
    email: "therapist@test.com",
    password: "password123",
  });
  therapistToken = therapistLogin.body.token;
  therapistId = therapistLogin.body.user.id;

  // Register & login an admin
  await request(app).post("/api/auth/register").send({
    name: "Test Admin",
    email: "admin@test.com",
    password: "password123",
    role: "admin",
  });
  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@test.com",
    password: "password123",
  });
  adminToken = adminLogin.body.token;

  // Create Assignment of user to therapist
  await Assignment.create({
    therapistId,
    assignedUsers: [userId],
  });
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("MoodLog API", () => {
  describe("POST /api/mood-logs", () => {
    it("should allow a user to create a mood log", async () => {
      const res = await request(app)
        .post("/api/mood-logs")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          mood: "happy",
          notes: "Feeling good today",
          sleepHours: 7,
          energyLevel: 8,
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.mood).toBe("happy");
      moodLogId = res.body._id;
    });

    it("should forbid non-user roles from creating mood logs", async () => {
      const res = await request(app)
        .post("/api/mood-logs")
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          mood: "sad",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("Only users can create mood logs.");
    });
  });

  describe("GET /api/mood-logs/me", () => {
    it("should allow user to get their own mood logs", async () => {
      const res = await request(app)
        .get("/api/mood-logs/me")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });

    it("should forbid non-users from accessing this route", async () => {
      const res = await request(app)
        .get("/api/mood-logs/me")
        .set("Authorization", `Bearer ${therapistToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("Access denied.");
    });
  });

  describe("GET /api/mood-logs/therapist-clients", () => {
    it("should allow therapist to get mood logs of their assigned clients", async () => {
      const res = await request(app)
        .get("/api/mood-logs/therapist-clients")
        .set("Authorization", `Bearer ${therapistToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // The user created at least one log
      expect(res.body.some((log) => log.userId._id === userId)).toBe(true);
    });

    it("should forbid non-therapists from accessing", async () => {
      const res = await request(app)
        .get("/api/mood-logs/therapist-clients")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("Access denied");
    });
  });

  describe("GET /api/mood-logs/patient/:id", () => {
    it("should allow therapist or admin to get mood logs of a specific patient", async () => {
      const resTherapist = await request(app)
        .get(`/api/mood-logs/patient/${userId}`)
        .set("Authorization", `Bearer ${therapistToken}`);

      expect(resTherapist.statusCode).toBe(200);
      expect(Array.isArray(resTherapist.body)).toBe(true);

      const resAdmin = await request(app)
        .get(`/api/mood-logs/patient/${userId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(resAdmin.statusCode).toBe(200);
      expect(Array.isArray(resAdmin.body)).toBe(true);
    });

    it("should forbid other roles", async () => {
      const res = await request(app)
        .get(`/api/mood-logs/patient/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe(
        "Only therapists or admins can view patient mood logs."
      );
    });
  });

  describe("GET /api/mood-logs/admin/all", () => {
    it("should allow admin to get all mood logs", async () => {
      const res = await request(app)
        .get("/api/mood-logs/admin/all")
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it("should forbid non-admins", async () => {
      const res = await request(app)
        .get("/api/mood-logs/admin/all")
        .set("Authorization", `Bearer ${therapistToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe("Only admins can access all mood logs.");
    });
  });

  describe("DELETE /api/mood-logs/:id", () => {
    it("should allow therapist to delete a mood log", async () => {
      const res = await request(app)
        .delete(`/api/mood-logs/${moodLogId}`)
        .set("Authorization", `Bearer ${therapistToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Mood log deleted successfully.");
    });

    it("should forbid normal user from deleting mood log", async () => {
      // Create a mood log first by user
      const createRes = await request(app)
        .post("/api/mood-logs")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          mood: "sad",
        });

      const newLogId = createRes.body._id;

      const res = await request(app)
        .delete(`/api/mood-logs/${newLogId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body.error).toBe(
        "Only therapists or admins can delete mood logs."
      );
    });

    it("should return 404 if mood log not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/mood-logs/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.error).toBe("Mood log not found.");
    });
  });
});
