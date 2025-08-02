import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";

let mongoServer;
let userToken, therapistToken;
let userId, therapistId;
let threadId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register a user
  const userRes = await request(app).post("/api/auth/register").send({
    name: "Test User",
    email: "user@test.com",
    password: "password123",
    role: "user",
  });
  userId = userRes.body.user._id;

  const loginUserRes = await request(app).post("/api/auth/login").send({
    email: "user@test.com",
    password: "password123",
  });
  userToken = loginUserRes.body.token;

  // Register a therapist
  const therapistRes = await request(app).post("/api/auth/register").send({
    name: "Test Therapist",
    email: "therapist@test.com",
    password: "password123",
    role: "therapist",
  });
  therapistId = therapistRes.body.user._id;

  const loginTherapistRes = await request(app).post("/api/auth/login").send({
    email: "therapist@test.com",
    password: "password123",
  });
  therapistToken = loginTherapistRes.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Chat API", () => {
  describe("POST /api/chat", () => {
    it("should create a new thread and send a message when no threadId provided", async () => {
      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: therapistId,
          message: "Hello therapist!",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Message sent");
      expect(res.body.thread).toHaveProperty("_id");
      expect(res.body.chatMessage).toHaveProperty(
        "message",
        "Hello therapist!"
      );

      threadId = res.body.thread._id; // Save for later tests
    });

    it("should send a message to an existing thread when threadId provided", async () => {
      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          threadId,
          message: "Hello user, I got your message!",
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message", "Message sent");
      expect(res.body.thread._id).toBe(threadId);
      expect(res.body.chatMessage.message).toBe(
        "Hello user, I got your message!"
      );
    });

    it("should return 400 if message is missing", async () => {
      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: therapistId,
          message: "",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Missing message");
    });

    it("should return 400 if recipientId is missing when creating new thread", async () => {
      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          message: "Hello?",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Missing recipientId");
    });

    it("should return 404 if thread not found", async () => {
      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          threadId: new mongoose.Types.ObjectId(),
          message: "Hi",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "Thread not found");
    });

    it("should return 403 if trying to chat with invalid roles", async () => {
      // Attempt user->user chat (invalid)
      const anotherUserRes = await request(app)
        .post("/api/auth/register")
        .send({
          name: "Another User",
          email: "anotheruser@test.com",
          password: "password123",
          role: "user",
        });
      const anotherUserId = anotherUserRes.body.user._id;

      const res = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: anotherUserId,
          message: "Hey user!",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "message",
        "Only user ↔ therapist chat allowed"
      );
    });
  });

  describe("GET /api/chat/threads", () => {
    it("should get all threads for logged-in user", async () => {
      const res = await request(app)
        .get("/api/chat/threads")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      // Each thread should contain userId or therapistId populated
    });

    it("should deny access for invalid role", async () => {
      // Register admin role (invalid for this endpoint)
      const adminRes = await request(app).post("/api/auth/register").send({
        name: "Admin User",
        email: "admin@test.com",
        password: "password123",
        role: "admin",
      });
      const loginAdmin = await request(app).post("/api/auth/login").send({
        email: "admin@test.com",
        password: "password123",
      });

      const res = await request(app)
        .get("/api/chat/threads")
        .set("Authorization", `Bearer ${loginAdmin.body.token}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty("message", "Access denied: invalid role");
    });
  });

  describe("GET /api/chat/thread/:id", () => {
    it("should get all messages in the specified thread", async () => {
      const res = await request(app)
        .get(`/api/chat/thread/${threadId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThan(0);
      expect(res.body[0]).toHaveProperty("message");
    });

    it("should return 400 for invalid thread ID format", async () => {
      const res = await request(app)
        .get("/api/chat/thread/invalidThreadId")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message", "Invalid thread ID");
    });

    it("should return 404 if no messages in thread", async () => {
      // Create a new thread with no messages manually:
      const newThreadRes = await request(app)
        .post("/api/chat")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          recipientId: therapistId,
          message: "Initial message",
        });

      const newThreadId = newThreadRes.body.thread._id;

      // Remove all messages in that thread manually to simulate no messages:
      const ChatMessage = (await import("../models/chatMessage.js")).default;
      await ChatMessage.deleteMany({ threadId: newThreadId });

      const res = await request(app)
        .get(`/api/chat/thread/${newThreadId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("message", "No messages in this thread");
    });
  });
});
