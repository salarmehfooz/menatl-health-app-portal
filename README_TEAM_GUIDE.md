# ✅ Day 1 — Project Setup: Frontend + Backend Boilerplate (Vite + Tailwind + Express + MongoDB)

> This guide sets up both the client and server sides cleanly and professionally for your Mental Health Portal app using the MERN stack.

---

## 📁 Folder Structure

```
mental-health-portal/
├── client/        # Vite + React + Tailwind
├── server/        # Express + MongoDB backend
├── .gitignore
├── README.md
```

---

## 1️⃣ Initialize Project Repo

```bash
mkdir mental-health-portal && cd mental-health-portal
git init
```

---

## 2️⃣ Frontend Setup (Vite + Tailwind CSS)

```bash
npm create vite@latest client -- --template react
cd client
npm install
```

### Install TailwindCSS

```bash
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

### Configure Tailwind (tailwind.config.js)

```js
content: [
  "./index.html",
  "./src/**/*.{js,ts,jsx,tsx}"
],
```

### In `src/index.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;
```

### Run Frontend Dev Server

```bash
npm run dev
```

---

## 3️⃣ Backend Setup (Express + MongoDB)

```bash
cd ..
mkdir server && cd server
npm init -y
npm install express mongoose cors dotenv
```

### Create Files

```
server/
├── controllers/
├── models/
├── routes/
├── middleware/
├── config/
│   └── db.js
├── index.js
├── .env
```

### Example `index.js`

```js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
```

### Example `.env`

```
PORT=5000
MONGO_URI=your_mongodb_connection_string
```

### `config/db.js`

```js
import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
```

### Run Backend

```bash
node index.js
```

---

## ✅ Final Test

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:5000](http://localhost:5000)

Both should show a welcome message — you’re ready to move to **Day 2: Landing Page + Auth UI** 🎯
