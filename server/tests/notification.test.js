import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js"; // Your Express app
import Notification from "../models/Notification.js";

let mongoServer;
let userToken, otherUserToken;
let userId, otherUserId;
let notificationId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Create two users manually (mocking auth system)
  // You can replace this with your actual auth registration/login if available

  // Create User 1
  const userRes = await request(app).post("/api/auth/register").send({
    name: "User One",
    email: "user1@test.com",
    password: "password123",
    role: "user",
  });
  const loginRes1 = await request(app).post("/api/auth/login").send({
    email: "user1@test.com",
    password: "password123",
  });
  userToken = loginRes1.body.token;
  userId = loginRes1.body.user.id;

  // Create User 2
  const userRes2 = await request(app).post("/api/auth/register").send({
    name: "User Two",
    email: "user2@test.com",
    password: "password123",
    role: "user",
  });
  const loginRes2 = await request(app).post("/api/auth/login").send({
    email: "user2@test.com",
    password: "password123",
  });
  otherUserToken = loginRes2.body.token;
  otherUserId = loginRes2.body.user.id;

  // Create a notification for User 1
  const notification = await Notification.create({
    recipientId: userId,
    senderId: null,
    type: "new_message",
    message: "You have a new message",
  });
  notificationId = notification._id.toString();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Notification API", () => {
  describe("GET /api/notifications/:userId", () => {
    it("should fetch all notifications for a user", async () => {
      const res = await request(app)
        .get(`/api/notifications/${userId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("recipientId");
      expect(res.body[0].recipientId).toBe(userId);
    });

    it("should return empty array if no notifications", async () => {
      const res = await request(app)
        .get(`/api/notifications/${otherUserId}`)
        .set("Authorization", `Bearer ${otherUserToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBe(0);
    });

    it("should reject unauthorized requests", async () => {
      const res = await request(app).get(`/api/notifications/${userId}`);

      expect(res.statusCode).toBe(401);
    });
  });

  describe("PATCH /api/notifications/:id/read", () => {
    it("should mark a notification as read", async () => {
      const res = await request(app)
        .patch(`/api/notifications/${notificationId}/read`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.read).toBe(true);
    });

    it("should return 404 if notification not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/notifications/${fakeId}/read`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body.message).toBe("Notification not found");
    });

    it("should reject unauthorized requests", async () => {
      const res = await request(app).patch(
        `/api/notifications/${notificationId}/read`
      );

      expect(res.statusCode).toBe(401);
    });
  });

  describe("DELETE /api/notifications/clear", () => {
    it("should clear all notifications for the authenticated user", async () => {
      // Create an extra notification for this user to clear
      await Notification.create({
        recipientId: userId,
        senderId: null,
        type: "new_message",
        message: "Another message",
      });

      const res = await request(app)
        .delete("/api/notifications/clear")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Notifications cleared");

      // Confirm no notifications remain for this user
      const check = await Notification.find({ recipientId: userId });
      expect(check.length).toBe(0);
    });

    it("should reject unauthorized requests", async () => {
      const res = await request(app).delete("/api/notifications/clear");
      expect(res.statusCode).toBe(401);
    });
  });
});
