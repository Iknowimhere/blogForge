import Blog from "../models/Blog.js";
import asyncHandler from "express-async-handler";

//@desc     Post a Blog
//@route    /api/blog
//@access   Private
export const postBlog = asyncHandler(async (req, res, next) => {
    let { title, content, categories } = req.body;

    if (!title || !content || !categories) {
        res.status(400);
        throw new Error("Title,content and Categories are required!!");
    }
    let newBlog = await Blog.create({
        title,
        content,
        categories,
        author: req?.userId,
        featuredImage: req.file?.path
    })
    res.status(201).json(newBlog);
})

//@desc     Get Blogs
//@route    /api/blog
//@access   Public
export const getBlogs=asyncHandler(async(req,res)=>{
   let query={};
   req.query.categories?query.categories:query={}


    //pagination
    let page=req.query.page || 1;
    let limit=req.query.limit || 3;
    let skip=(page-1)*limit;
    let totalBlogs=await Blog.countDocuments();

    let blogs=await Blog.find(query).populate("author","username photo email -_id").sort("-createdAt").skip(skip).limit(limit);
    res.status(200).json({
        currentPage:page,
        totalBlogs,
        pages:Math.ceil(totalBlogs/limit),
        blogs
    })
})

//@desc     Get a Blog
//@route    /api/blog/:slug
//@access   Public
export const getBlog = asyncHandler(async (req, res) => {
    let { slug } = req.params;
    let blog = await Blog.findOne({ slug }).populate("author","photo email username").populate("comments","user")
    //update a view
    blog.views += 1;
    await blog.save()
    res.status(200).json(blog)
})

//@desc     Update a Blog
//@route    /api/blog/:slug
//@access   Private
export const updateBlog = asyncHandler(async (req, res) => {
    let { slug } = req.params;

    let blog = await Blog.findOne({ slug })

    if (req.body.title) {
        blog.title = req.body.title;
    }
    if (req.body.content) {
        blog.content = req.body.content;
    }
    if (req.file) {
        blog.featuredImage = req.file?.path;
    }

    await blog.save();

    res.status(200).json(blog);
})

//@desc     Delete a Blog
//@route    /api/blog/:slug
//@access   Private
export const deleteBlog = asyncHandler(async (req, res) => {
    let { slug } = req.params;
    await Blog.findOneAndDelete({ slug })
    res.sendStatus(204);
})

//@desc   Toggle a Like
//@route  /api/blog/:slug/like
//access  PrivateQ!`
export const ToggleLikeBlog = asyncHandler(async (req, res) => {
    let { slug } = req.params;

    let blog = await Blog.findOne({ slug });

    let userIndex = blog.likes.findIndex((doc) => {
        return doc.toString() === req.userId.toString()
    })

    if (userIndex === -1) {
        blog.likes.push(req.userId)
    } else {
        blog.likes.splice(userIndex, 1);
    }
    await blog.save();

    res.sendStatus(200);
})