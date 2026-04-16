import express from "express";
import authRoutes from "./authRoutes.js";
import postRoutes from "./postRoutes.js";
import commentRouter from "./commentRoutes.js";
const router = express.Router();

router.get('/health', (req, res) => res.json({ status: 'ok' }));
router.get('/',(req, res) => res.json({ status: "All are working right now"}));
router.use('/auth', authRoutes);
router.use('/posts', postRoutes);
router.use('/comments',commentRouter)

export default router;