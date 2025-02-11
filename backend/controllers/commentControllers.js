import asyncHandler from "express-async-handler"
import Blog from "../models/Blog.js";
import Comment from "../models/Comment.js";

export const createComment=asyncHandler(async(req,res)=>{
    const {slug}=req.params;
    const {content}=req.body;

    if(!content){
        req.status(400);
        throw new Error("Content is required for comment");
    }

    const blog=await Blog.findOne({slug});
    if(!blog){
        req.status(404);
        throw new Error("Blog not found!")
    }

    let comment=await Comment.create({
        content,
        user:req.userId,
        blog:blog._id
    })
    //after comment is created it is being pushed into comments array on blog schema
    blog.comments.push(comment._id);
    await blog.save({validateBeforeSave:false});

   await comment.populate("user","username photo role -_id")

    res.status(201).json(comment)
})


export const getComments=asyncHandler(async(req,res)=>{
    const {slug}=req.params;

    const blog=await Blog.findOne({slug});
    if(!blog){
        req.status(404);
        throw new Error("Blog not found!")
    }
   let comments=await Comment.find({blog:blog._id}).sort("-createdAt").populate("user","username email photo -_id");

    res.status(200).json(comments);
});

export const deleteComment=asyncHandler(async(req,res)=>{
    let {slug,commentId}=req.params;

    let blog=await Blog.findOne({slug});

    if(!blog){
        return res.sendStatus(404)
    }

    let comment=await Comment.findById({commentId});
    if(!comment){
        return res.sendStatus(404)
    }

    if(comment.user!==req.userId){
        return res.status(401).json({message:"Unauthorised"})
    }

    await Comment.findByIdAndDelete(commentId);

    res.sendStatus(204);
})