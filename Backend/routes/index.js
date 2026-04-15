import express from "express";
import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";

const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/',(req, res) => res.json({ status: "All are working right now"}));
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);

export default router;