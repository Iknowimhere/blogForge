import { Router } from "express";
import { getCategories } from "../controllers/categryControllers.js";

let categoryRouter=Router();

categoryRouter.get("/",getCategories)

export default categoryRouter;