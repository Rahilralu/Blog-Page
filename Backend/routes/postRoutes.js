import express from "express";
import { authenticate_token } from "../middleware/auth.js";
import { get_all_posts } from "../controllers/postController.js";

const router = express.Router();

router.get('/', authenticate_token, get_all_posts);

export default router;