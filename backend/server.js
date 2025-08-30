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

// backend/server.js
import ticketRoutes from "./routes/ticketRoutes.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import commentRoutes from "./routes/commentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { connectDB } from "./connection.js";
import express from "express";
import helmet from "helmet";

const app = express();
app.use(express.json());

// CORS: allow your Vercel frontend + local dev
const allowedOrigins = [
  "http://localhost:5173",
  "https://YOUR-FRONTEND-NAME.vercel.app", // 👈 replace with your actual frontend URL
];
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(cookieParser());

// ✅ Add secure headers with CSP
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "blob:"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net"],
        fontSrc: ["'self'", "https://cdn.jsdelivr.net"],
        imgSrc: ["'self'", "data:"],
        connectSrc: [
          "'self'",
          "http://localhost:5173",
          "https://YOUR-FRONTEND-NAME.vercel.app",
        ],
      },
    },
    crossOriginEmbedderPolicy: false,
  })
);

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/tickets", ticketRoutes);
app.use("/api/comments", commentRoutes);

// Health check root
app.get("/", (req, res) => {
  res.status(200).send("✅ API is running");
});

// ❌ 404 handler for unknown routes
app.use((req, res, next) => {
  res.status(404).json({ error: "Route not found" });
});

// ❌ Global error handler
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err);
  res.status(err.status || 500).json({
    error: err.message || "Internal Server Error",
  });
});

// 👉 Export the app for Vercel
export default app;

// 👉 Only listen when running locally (not on Vercel)
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () =>
    console.log(`API running on http://localhost:${PORT}`)
  );
}

