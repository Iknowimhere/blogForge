import { Router } from "express";
import multer from 'multer'
import storage from '../middlewares/fileUpload.js';
import { deleteBlog, getBlog, getBlogs, postBlog, updateBlog } from "../controllers/blogControllers.js";
let upload=multer({storage:storage})
let router=Router();

router.post("/",upload.single("featuredImage"),postBlog);
router.get("/",getBlogs);

router.get("/:slug",getBlog);
router.patch("/:slug",upload.single("featuredImage"),updateBlog);
router.delete("/:slug",deleteBlog);

export default router;