// import express from "express";
// import dotenv from "dotenv";
// import cors from "cors";
// import ticketRoutes from "./routes/ticketRoutes.js";
// import cookieParser from "cookie-parser";
// import commentRoutes from "./routes/commentRoutes.js";
// import authRoutes from "./routes/authRoutes.js";
// import userRoutes from "./routes/userRoutes.js";
// import { connectDB } from "./connection.js";
// import path from "path";

// dotenv.config();
// const app = express();

// // app.use(cors());
// app.use(cors({
//   origin: 'http://localhost:5173',
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

// app.use(express.json()); 
// app.use(cookieParser());


// app.use("/api/auth", authRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/tickets", ticketRoutes);
// app.use("/api/comments", commentRoutes);

// connectDB

// const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   connectDB();
//   console.log(`Server running on port ${PORT}`);
// });



import ticketRoutes from "./routes/ticketRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./connection.js";
import express from 'express'
// backend/server.js
// ... other requires (dotenv, routes, db connection, etc.)

const app = express();
app.use(express.json());

// CORS: allow your Vercel frontend + local dev
const allowedOrigins = [
  'http://localhost:5173',
  'https://YOUR-FRONTEND-NAME.vercel.app'
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json()); 
app.use(cookieParser());

connectDB()

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/comments", commentRoutes);

// 👉 Export the app for Vercel
export default app;

// 👉 Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => console.log(`API running on http://localhost:${PORT}`));
}
