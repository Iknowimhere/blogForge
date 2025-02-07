import { Router } from "express";
import multer from 'multer'
import storage from '../middlewares/fileUpload.js';
import { deleteBlog, getBlog, getBlogs, postBlog, ToggleLikeBlog, updateBlog } from "../controllers/blogControllers.js";
import { auth, checkRole } from "../middlewares/auth.js";
let upload=multer({storage:storage})
let router=Router();

//public routes
router.get("/",getBlogs);
router.get("/:slug",getBlog);

//private routes
router.post("/",auth,checkRole('author','admin'),upload.single("featuredImage"),postBlog);
router.patch("/:slug",auth,checkRole('author','admin'),upload.single("featuredImage"),updateBlog);
router.delete("/:slug",auth,checkRole('admin','author'),deleteBlog);


router.post("/:slug/like",auth,ToggleLikeBlog);

export default router;