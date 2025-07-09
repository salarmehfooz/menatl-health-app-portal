require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db.js");

const authRoutes = require("./routes/authRoute.js");
const userRoutes = require("./routes/userRoute.js");
const therapistRoutes = require("./routes/therapistRoutes.js");
const moodLogRoutes = require('./routes/moodLogRoutes.js');

const app = express();
app.use(cors());
app.use(express.json());

connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/user", userRoutes);
app.use("/api/therapist", therapistRoutes);
app.use('/api/moodlogs', moodLogRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

