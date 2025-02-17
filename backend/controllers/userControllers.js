import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';
import asyncHandler from 'express-async-handler';
import crypto from 'crypto';
import { send } from '../utils/send.js';


export const register =asyncHandler( async (req, res, next) => {
    let { username, email, password, confirmPassword } = req.body;

        // creating a new user
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
    let { email, password } = req.body;
    let existingUser = await User.findOne({email}).select("+password +role");
    
    if(!existingUser){
        throw new Error("User doesnt exist,Please Register");
    }
    
    let result = await existingUser.verifyPassword(password, existingUser.password);
    if(!result){
        throw new Error("Password is not correct");
    }
    
    let token = await generateToken(existingUser._id);
    
    res.status(200).json({
        username: existingUser.username,
        photo: existingUser.photo,
        email: existingUser.email,
        role: existingUser.role,
        token
    });
});

export const updateProfile=asyncHandler(async(req,res,next)=>{
    let {id}=req.params;
    await User.findByIdAndUpdate(id,{photo:req.file?.path},{new:true})
    res.sendStatus(201)
})

export const forgortPassword=asyncHandler(async(req,res,next)=>{
    const {email}=req.body;
    let exisitingUser=await User.findOne({email})
    if(!exisitingUser){
        throw new Error("User doesn't exist")
    }
    let resetPasswordToken=crypto.randomBytes(32).toString('hex')
    let resetPasswordTokenExpiresAt= Date.now()+ 15*60*1000;


    exisitingUser.resetPasswordToken=resetPasswordToken;
    exisitingUser.resetPasswordTokenExpiresAt=resetPasswordTokenExpiresAt;

    //save to db
    await exisitingUser.save({validateBeforeSave:false});
    
    let resetPasswordLink= `${req.protocol}://${req.hostname}:5000/api/user/reset-password/${resetPasswordToken}`
    let options={
        subject:"Reset your password",
        to:exisitingUser.email,
        text:`This is the reset password link, this expires in 1 hour ${resetPasswordLink} click here to reset the password`,
        html:`<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }
        .container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        .header {
            background-color: #007bff;
            color: #ffffff;
            padding: 10px 0;
            text-align: center;
        }
        .content {
            margin: 20px 0;
            text-align: center;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            margin: 20px 0;
            background-color: #007bff;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            color: #777777;
            font-size: 12px;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Reset Your Password</h1>
        </div>
        <div class="content">
            <p>We received a request to reset your password. Click the button below to reset it.</p>
            <a href="${resetPasswordLink}" class="button">Reset Password</a>
            <p>If you did not request a password reset, please ignore this email.</p>
        </div>
        <div class="footer">
            <p>&copy; 2023 Your Company. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
`
    }
    await send(options)
    
    res.status(200).json("Reset password link sent");
})

export const resetPassword=asyncHandler(async(req,res,next)=>{
    let {token}=req.params;
    let {password,confirmPassword}=req.body;

    let user=await User.findOne({
        resetPasswordToken:token,
        resetPasswordTokenExpiresAt:{$gt:Date.now()}
    })
    if(!user){
        throw new Error("Token expired")
    }
    user.password=password;
    user.confirmPassword=confirmPassword;
    user.resetPasswordToken=undefined;
    user.resetPasswordTokenExpiresAt=undefined;
    await user.save({validateBeforeSave:false})
    res.status(200).send("Password reset successfully!!")
}) 


export const logout=asyncHandler(async(req,res)=>{
    req.userId=null;
    res.sendStatus(200)
})


export const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select('-password');
    res.status(200).json(users);
  });
  
  export const deleteUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });