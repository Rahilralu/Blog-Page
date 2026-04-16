import express from "express";
import { authenticate_token } from "../middleware/auth.js";
import { get_all_posts,update_post,create_post,delete_post } from "../controllers/postController.js";
import { postLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', get_all_posts);
router.post('/', authenticate_token, postLimiter, create_post);
router.put('/:id',authenticate_token,update_post);
router.delete('/:id',authenticate_token,delete_post);

export default router;