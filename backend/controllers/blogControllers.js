// postBlog
// getBlogs
// getBlog
// updateBlog
// deleteBlog

import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";


export const postBlog=asyncHandler(async(req,res,next)=>{
    let {title,content,}=req.body;
    let newBlog=await Blog.create({
            title,
            content,
            featuredImage:req.file?.path
    })

    res.status(201).json(newBlog);
})

export const getBlogs=asyncHandler(async(req,res)=>{
    let blogs=await Blog.find()
    res.status(200).json(blogs)
})


export const getBlog=asyncHandler(async(req,res)=>{
    let {slug}=req.params;
    let blog=await Blog.findOne({slug})
    res.status(200).json(blog)
})

export const updateBlog=asyncHandler(async(req,res)=>{
    let {slug}=req.params;

    let blog=await Blog.findOne({slug})

    if(req.body.title){
        blog.title=req.body.title;
    }
    if(req.body.content){
        blog.content=req.body.content;
    }
    if(req.file){
        blog.featuredImage=req.file?.path;
    }

    await blog.save();

    res.status(200).json(blog);
})

export const deleteBlog=asyncHandler(async(req,res)=>{
    let {slug}=req.params;
    await Blog.findOneAndDelete({slug})
    res.sendStatus(204);
})