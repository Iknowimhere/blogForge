import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';


export const register =asyncHandler( async (req, res, next) => {
    let { username, email, password, confirmPassword } = req.body;
        //verify user is in db already
        let existingUser=await User.findOne({email})
        if(existingUser){
           throw new Error("User already exists,Please Login")
        }
        //creating a new user
        let newUser = await User.create({
            username,
            email,
            role: req.body?.role || 'user',
            password,
            confirmPassword,
            photo:req.file?.path
        })
        //generate token
        let token=await generateToken(newUser._id);
        //sending response
        res.status(201).json({newUser,token});
})

export const login = asyncHandler(async (req, res, next) => {
    let {  email, password} = req.body;
        //verify user is in db already
        let existingUser=await User.findOne({email})
        if(!existingUser){
            throw new Error("User doesnt exist,Please Register")
        }
        //verify password
        let result=await existingUser.verifyPassword(password,existingUser.password)
        if(!result){
            throw new Error("Password is not correct")
        }
        //token
        let token=await generateToken(existingUser._id)
        //sending response
        res.status(201).json({existingUser,token});
})

export const updateProfile=asyncHandler(async(req,res,next)=>{
    let {id}=req.params;
    await User.findByIdAndUpdate(id,{photo:req.file?.path},{new:true})
    res.sendStatus(201)
})