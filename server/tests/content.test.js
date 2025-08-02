import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js"; // Your Express app

let mongoServer;
let therapistToken, adminToken, userToken;
let contentId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Create a therapist user and login
  const therapistRes = await request(app).post("/api/auth/register").send({
    name: "Therapist",
    email: "therapist@example.com",
    password: "password123",
    role: "therapist",
  });

  const therapistLogin = await request(app).post("/api/auth/login").send({
    email: "therapist@example.com",
    password: "password123",
  });

  therapistToken = therapistLogin.body.token;

  // Create an admin user and login
  const adminRes = await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@example.com",
    password: "password123",
    role: "admin",
  });

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "password123",
  });

  adminToken = adminLogin.body.token;

  // Create a normal user and login
  const userRes = await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@example.com",
    password: "password123",
    role: "user",
  });

  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "password123",
  });

  userToken = userLogin.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Content API", () => {
  describe("POST /api/content", () => {
    it("should allow therapist to create content", async () => {
      const res = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          title: "Test Video",
          type: "video",
          url: "http://example.com/video.mp4",
          description: "A test video content",
          tags: ["test", "video"],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("_id");
      expect(res.body.title).toBe("Test Video");
      contentId = res.body._id;
    });

    it("should allow admin to create content", async () => {
      const res = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "Admin Article",
          type: "article",
          description: "Content by admin",
          tags: ["admin", "article"],
        });

      expect(res.statusCode).toBe(201);
      expect(res.body.title).toBe("Admin Article");
    });

    it("should forbid normal user from creating content", async () => {
      const res = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "User Content",
          type: "exercise",
          description: "User trying to create content",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "error",
        "Only therapists or admins can create content."
      );
    });
  });

  describe("GET /api/content", () => {
    it("should get all content for any authenticated user", async () => {
      const res = await request(app)
        .get("/api/content")
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
      expect(res.body.length).toBeGreaterThanOrEqual(1);
    });
  });

  describe("PUT /api/content/:id", () => {
    it("should allow therapist to update content", async () => {
      const res = await request(app)
        .put(`/api/content/${contentId}`)
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          title: "Updated Test Video",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.title).toBe("Updated Test Video");
    });

    it("should allow admin to update content", async () => {
      const res = await request(app)
        .put(`/api/content/${contentId}`)
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          description: "Updated by admin",
        });

      expect(res.statusCode).toBe(200);
      expect(res.body.description).toBe("Updated by admin");
    });

    it("should forbid normal user from updating content", async () => {
      const res = await request(app)
        .put(`/api/content/${contentId}`)
        .set("Authorization", `Bearer ${userToken}`)
        .send({
          title: "User Update Attempt",
        });

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "error",
        "Only therapists or admins can update content."
      );
    });

    it("should return 404 for non-existing content", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .put(`/api/content/${fakeId}`)
        .set("Authorization", `Bearer ${therapistToken}`)
        .send({
          title: "Non-existing",
        });

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Content not found");
    });
  });

  describe("DELETE /api/content/:id", () => {
    it("should allow therapist to delete content", async () => {
      const res = await request(app)
        .delete(`/api/content/${contentId}`)
        .set("Authorization", `Bearer ${therapistToken}`);

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("message", "Content deleted");
    });

    it("should forbid normal user from deleting content", async () => {
      // Create a content first by admin to test delete with user
      const createRes = await request(app)
        .post("/api/content")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          title: "To Delete",
          type: "article",
        });

      const newContentId = createRes.body._id;

      const res = await request(app)
        .delete(`/api/content/${newContentId}`)
        .set("Authorization", `Bearer ${userToken}`);

      expect(res.statusCode).toBe(403);
      expect(res.body).toHaveProperty(
        "error",
        "Only therapists or admins can delete content."
      );
    });

    it("should return 404 if content not found", async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .delete(`/api/content/${fakeId}`)
        .set("Authorization", `Bearer ${adminToken}`);

      expect(res.statusCode).toBe(404);
      expect(res.body).toHaveProperty("error", "Content not found");
    });
  });
});
