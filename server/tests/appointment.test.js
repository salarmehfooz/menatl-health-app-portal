import request from "supertest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import app from "../app.js";

let mongoServer;
let userToken, therapistToken, adminToken;
let userId, therapistId, adminId;
let appointmentId;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  // Register & login User
  const userRes = await request(app).post("/api/auth/register").send({
    name: "User A",
    email: "usera@example.com",
    password: "userpass",
    role: "user",
  });
  userId = userRes.body.user._id;

  const userLogin = await request(app).post("/api/auth/login").send({
    email: "usera@example.com",
    password: "userpass",
  });
  userToken = userLogin.body.token;

  // Register & login Therapist
  const therapistRes = await request(app).post("/api/auth/register").send({
    name: "Therapist T",
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

  // Register & login Admin
  const adminRes = await request(app).post("/api/auth/register").send({
    name: "Admin A",
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
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Appointment Routes", () => {
  it("POST /api/appointments - user books an appointment", async () => {
    const res = await request(app)
      .post("/api/appointments")
      .set("Authorization", `Bearer ${userToken}`)
      .send({
        therapistId: therapistId,
        date: "2025-08-05T10:00:00Z",
        description: "Therapy session",
      });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("_id");
    appointmentId = res.body._id;
  });

  it("GET /api/appointments/me/:id - fetch appointments for user", async () => {
    const res = await request(app)
      .get(`/api/appointments/me/${userId}`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toBeInstanceOf(Array);
    expect(res.body[0]).toHaveProperty("description", "Therapy session");
  });

  it("GET /api/appointments/therapist - fetch for therapist", async () => {
    const res = await request(app)
      .get("/api/appointments/therapist")
      .set("Authorization", `Bearer ${therapistToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("GET /api/appointments/admin/all - fetch all appointments for admin", async () => {
    const res = await request(app)
      .get("/api/appointments/admin/all")
      .set("Authorization", `Bearer ${adminToken}`);

    expect(res.statusCode).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it("PUT /api/appointments/:id - update appointment", async () => {
    const res = await request(app)
      .put(`/api/appointments/${appointmentId}`)
      .set("Authorization", `Bearer ${therapistToken}`)
      .send({
        status: "approved",
        notes: "Bring past records.",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "approved");
  });

  it("GET /api/appointments/:id/status - get appointment status", async () => {
    const res = await request(app)
      .get(`/api/appointments/${appointmentId}/status`)
      .set("Authorization", `Bearer ${userToken}`);

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status", "approved");
  });
});
