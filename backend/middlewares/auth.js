import User from "../models/User.js";
import jwt from "jsonwebtoken";
import asyncHandler from "express-async-handler";

export const auth = asyncHandler(async (req, res, next) => {
  let authHeaders = req.headers.authorization;
  if (!authHeaders) {
    res.status(401);
    throw new Error("Please Login!");
  }
  let token = authHeaders.split(" ")[1];
  let decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
  let user = await User.findById(decodedToken.id);
  if (!user) {
    throw new Error("User doesn't exist");
  }
  req.userId = user._id;
  next();
});

export const checkRole = (...roles) => {
  return asyncHandler(async (req, res, next) => {
    //find the user
    const user = await User.findById(req.userId).select("+role");
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }

    //verify role on user
    if (!roles.includes(user.role)) {
      res.status(403);
      throw new Error("Permission denied!");
    }
    next();
  });
};
