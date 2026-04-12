import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/routes.js";   
import bcrypt from "bcrypt";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express()

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000'],
    credentials: true
}));
app.use(express.json()); //req.body will broke
app.use(cookieParser())
app.use('/',router) 


const PORT=process.env.PORT || 5000; 

app.listen(PORT,() =>{
    console.log(`Server running in ${PORT}`);
});