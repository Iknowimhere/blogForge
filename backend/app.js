import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
db();
let app = express();

app.use(express.json());

app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);

//global error handler
app.use((err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Something went wrong!!Please try again Later";
  return res.status(statusCode).json({
    status: "Failure",
    message,
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
  });
});

export default app;
