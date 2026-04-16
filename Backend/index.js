import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import router from "./routes/index.js";

dotenv.config();
const app = express();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,  // 15 minutes
    max: 100,                    // 100 requests per window
    message: { error: 'Too many requests, slow down' }
});

app.use(helmet());
app.use(limiter);
app.use(cors({
    origin: [
        'https://blog-page-rho-indol.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());
app.use('/api', router);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on ${PORT}`));