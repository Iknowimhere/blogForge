import express from 'express';
import db from './config/db.js';
import userRoutes from './routes/userRoutes.js'
db();
let app=express();

app.use(express.json())

app.use("/api/user",userRoutes);

//global error handler
app.use((err,req,res,next)=>{
    let statusCode=err.status || 500;
    let message=err.message || "Something went wrong!!Please try again Later";
    return res.status(statusCode).json(message)
})


export default app;