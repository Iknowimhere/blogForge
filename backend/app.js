import express from "express";
import db from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import blogRoutes from "./routes/blogRoutes.js";
import {rateLimit} from 'express-rate-limit'
import helmet from 'helmet';
import cors from 'cors';
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import categoryRouter from "./routes/categoryRoutes.js";
db();
let app = express();

let limiter=rateLimit({
  windowMs:15*60*1000,
  limit:100,
  standardHeaders:'draft-8',
  legacyHeaders:false
})

app.use(cors())
app.use(helmet());
app.use(limiter)

app.use(express.json());


app.use("/api/user", userRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/category",categoryRouter)

//global error handler
app.use(errorMiddleware);

export default app;
