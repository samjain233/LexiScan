import express from "express";
const router = express.Router();

import authRoutes from "./Auth/auth.routes.js";
import blogRoutes from "./Blog/blog.routes.js";
router.use("/auth", authRoutes);
router.use("/blog", blogRoutes);

export default router;
