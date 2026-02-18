import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import router from "./routes/routes.js";   
import bcrypt from "bcrypt";
dotenv.config();
const app = express()

app.use(cors());
app.use(express.json()); //req.body will broke
app.use('/',router) 

const PORT=process.env.PORT || 5000; 

app.listen(PORT,() =>{
    console.log(`Server running in ${PORT}`);
});