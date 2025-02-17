import express from 'express'
import { deleteUser, forgortPassword, getAllUsers, login, logout, register, resetPassword, updateProfile } from '../controllers/userControllers.js';
import multer from 'multer';
import storage from '../middlewares/fileUpload.js';
import { auth, checkRole } from '../middlewares/auth.js';

let upload = multer({ storage: storage, limits: { fileSize: 1 * 1024 * 1024 } })
let router = express.Router();


router.post("/register", upload.single("photo"), register);
router.post("/login", login);
router.post("/forgot-password",forgortPassword)
router.post("/reset-password/:token",resetPassword)
router.get("/logout",auth,logout);


router.patch("/profile/:id",auth,upload.single("photo"),updateProfile);

//admin

router.get('/', auth,checkRole("admin") ,getAllUsers);
router.delete('/:id',auth,checkRole("admin"), deleteUser);

export default router;