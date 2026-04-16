import rateLimit from 'express-rate-limit';

export const postLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: { success: false, message: "Post limit reached, try again in an hour" },
    standardHeaders: true,
    legacyHeaders: false,
});

export const commentLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 30,
    message: { success: false, message: "Comment limit reached, try again in 15 minutes" },
    standardHeaders: true,
    legacyHeaders: false,
});