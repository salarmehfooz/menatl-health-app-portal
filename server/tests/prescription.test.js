import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js"; // Your Express app
import Prescription from "../models/prescriptionModel.js";

let mongoServer;
let therapistToken, userToken;
let therapistId, userId;
let prescriptionId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Create test users with different roles (adjust if you have a real auth route)
  // Register therapist
  await request(app).post("/api/auth/register").send({
    name: "Therapist One",
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

  // Register user
  await request(app).post("/api/auth/register").send({
    name: "User One",
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
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Prescription Controller", () => {
  describe("POST /api/prescriptions", () => {
    it("should allow therapist to create a prescription", async () => {
      const res = await request(app)
        .post("/api/prescriptions")
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          userId,
          therapistId,
          notes: "Take two pills daily",
          fileUrl: "http://example.com/prescription.pdf",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.notes).toBe("Take two pills daily");
      expect(res.body.userId).toBe(userId);
      expect(res.body.therapistId).toBe(therapistId);

      prescriptionId = res.body._id;
    });

    it("should reject non-therapist users", async () => {
      const res = await request(app)
        .post("/api/prescriptions")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          userId,
          therapistId,
          notes: "Invalid attempt",
        });

      expect(res.statusCode).toBe(403);
    });

    it("should reject unauthenticated requests", async () => {
      const res = await request(app).post("/api/prescriptions").send({
        userId,
        therapistId,
        notes: "Unauthorized",
      });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("PUT /api/prescriptions/:prescriptionId", () => {
    it("should allow therapist to update a prescription", async () => {
      const res = await request(app)
        .put(`/api/prescriptions/${prescriptionId}`)
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          userId,
          therapistId,
          notes: "Updated notes",
          fileUrl: "http://example.com/updated.pdf",
          isActive: false,
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.notes).toBe("Updated notes");
      expect(res.body.isActive).toBe(false);
    });

    it("should return 404 for non-existing prescription", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/prescriptions/${fakeId}`)
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          notes: "Trying to update non-existing",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Prescription not found");
    });

    it("should reject non-therapist users", async () => {
      const res = await request(app)
        .put(`/api/prescriptions/${prescriptionId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          notes: "Invalid update attempt",
        });

      expect(res.statusCode).toBe(403);
    });

    it("should reject unauthenticated requests", async () => {
      const res = await request(app)
        .put(`/api/prescriptions/${prescriptionId}`)
        .send({
          notes: "Unauthorized update",
        });

      expect(res.statusCode).toBe(401);
    });
  });

  describe("GET /api/prescriptions/:userId", () => {
    it("should allow user to get only active prescriptions", async () => {
      // Create a prescription that is inactive to test filtering
      await Prescription.create({
        userId,
        therapistId,
        notes: "Inactive prescription",
        isActive: false,
      });

      const res = await request(app)
        .get(`/api/prescriptions/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // All returned should be active
      expect(res.body.every((p) => p.isActive === true)).toBe(true);
    });

    it("should allow therapist to get all prescriptions (active and inactive)", async () => {
      const res = await request(app)
        .get(`/api/prescriptions/${userId}`)
        .set("Authorization", `Bearer ${therapistToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Should include inactive prescriptions as well
      expect(res.body.some((p) => p.isActive === false)).toBe(true);
    });

    it("should reject unauthenticated requests", async () => {
      const res = await request(app).get(`/api/prescriptions/${userId}`);

      expect(res.statusCode).toBe(401);
    });
  });
});
