import User from '../models/User.js'
import  jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

export const auth=asyncHandler(async (req,res,next)=>{
    let token=req.headers.token?.split(" ")[1];
        let decodedToken=await jwt.verify(token,"JwtSecret")
        let user=await User.findById(decodedToken.id)
        if(!user){
            throw new Error("User doesn't exist")
        }
        req.userId=user._id;
        next()
})

