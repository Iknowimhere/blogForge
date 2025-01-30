import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';


export const register = async (req, res, next) => {
    try{
    let { username, email, password, confirmPassword } = req.body;
    console.log(req.file);
    
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
    }catch(err){
        console.log(err);
        
        next(err)
    }
}

export const login = async (req, res, next) => {
    let {  email, password} = req.body;
    try{
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
    }catch(err){
        next(err)
    }
}