import express from "express";
import { authenticate_token } from "../middleware/auth.js";
import { get_comments, add_comment, delete_comment } from "../controllers/commentController.js";
import { commentLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/post/:postId', get_comments);
router.post('/post/:postId', authenticate_token, commentLimiter, add_comment);
router.delete('/:id', authenticate_token, delete_comment);

export default router;