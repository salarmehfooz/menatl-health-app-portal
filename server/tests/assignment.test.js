import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";

let mongoServer;
let adminToken, therapistToken, userToken;
let adminId, therapistId, userId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register Admin
  const adminRes = await request(app).post("/api/auth/register").send({
    name: "Admin",
    email: "admin@example.com",
    password: "adminpass",
    role: "admin",
  });
  adminId = adminRes.body.user._id;

  const adminLogin = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "adminpass",
  });
  adminToken = adminLogin.body.token;

  // Register Therapist
  const therapistRes = await request(app).post("/api/auth/register").send({
    name: "Therapist",
    email: "therapist@example.com",
    password: "therapistpass",
    role: "therapist",
  });
  therapistId = therapistRes.body.user._id;

  const therapistLogin = await request(app).post("/api/auth/login").send({
    email: "therapist@example.com",
    password: "therapistpass",
  });
  therapistToken = therapistLogin.body.token;

  // Register User
  const userRes = await request(app).post("/api/auth/register").send({
    name: "User",
    email: "user@example.com",
    password: "userpass",
    role: "user",
  });
  userId = userRes.body.user._id;

  const userLogin = await request(app).post("/api/auth/login").send({
    email: "user@example.com",
    password: "userpass",
  });
  userToken = userLogin.body.token;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Assignment Routes", () => {
  it("POST /api/assignment/assign - admin assigns users to therapist", async () => {
    const res = await request(app)
      .post("/api/assignment/assign")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        therapistId: therapistId,
        userIds: [userId],
      });

    expect(res.statusCode).toBe(200); // or 201 depending on controller
    expect(res.body).toHaveProperty("message");
  });

  it("GET /api/assignment/ - admin fetches all assignments", async () => {
    const res = await request(app)
      .get("/api/assignment/")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/assignment/ - therapist fetches all assignments", async () => {
    const res = await request(app)
      .get("/api/assignment/")
      .set("Authorization", `Bearer ${therapistToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/assignment/my-users - therapist fetches assigned users", async () => {
    const res = await request(app)
      .get("/api/assignment/my-users")
      .set("Authorization", `Bearer ${therapistToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/assignment/my-therapist - user fetches assigned therapist", async () => {
    const res = await request(app)
      .get("/api/assignment/my-therapist")
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("therapistId");
  });

  it("PUT /api/assignment/remove-user - admin removes user from therapist", async () => {
    const res = await request(app)
      .put("/api/assignment/remove-user")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        therapistId: therapistId,
        userId: userId,
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("message");
  });
});
