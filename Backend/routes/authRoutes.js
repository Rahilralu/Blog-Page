import express from "express";
import { login_credential, deleteuser } from "../controllers/authController.js";
import { authenticate_token, cookievalidator } from "../middleware/auth.js";

const router = express.Router();

router.post('/login', login_credential);
router.post('/refresh', cookievalidator);
router.get('/logout', deleteuser);
router.get('/me', authenticate_token, (req, res) => {
    res.json({
        message: 'JWT is working!',
        user: req.user
    });
});

export default router;