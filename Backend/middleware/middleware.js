import express from "express";
import bcrypt from "bcrypt";
import { saltRounds,pool } from "../config/config.js";
import pg from "pg"
import jwt from "jsonwebtoken";

export function generateRefreshToken(userId) {
    return jwt.sign(
        { userId },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '30d' }
    );
}

export function generateAccessToken(userId, email) {
    return jwt.sign(
        { userId, email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1h' }
    );
}

export const deleteuser = async function (req,res,next) {
   try{
     const token = req.cookies.refresh_token;
    if(!token) return res.status(401).json({message : "Logged Out"});
    else{
        const result=await pool.query(
            "UPDATE users SET refresh_token = null where refresh_token = $1",
            [token]
        )
        res.clearCookie('refresh_token');
        return res.status(200).json({message : "Logged Out"})
    }
   }
   catch(err){
    console.log(err);
    res.status(500).json({ success : false})
   }
}

export const cookievalidator = async function (req,res,next){
    const token = req.cookies.refresh_token;
    if (!token) return res.status(401).json({ message: "No refresh token" });
    else{
        const result = await pool.query(
            "SELECT id, email FROM users WHERE refresh_token = $1",
            [token]
        )
        if(result.rows.length === 0){
            return res.status(403).json({"Token not in db may be logged off"})
        }
        else{
            jwt.verify(token,process.env.REFRESH_TOKEN_SECRET,(err) => {
                if(err){
                    return res.status(403).json({"Error in token no refresh token"})
                }
                const user = result.rows[0]  // use the DB result instead
                const access_token = generateAccessToken(user.id, user.email)
                 return res.json({ access_token })
                req.user = user
                next()
            })
        }
    }}


    

export const authenticate_token = function (req,res,next) {
    try{
       const authHeader = req.headers['authorization']
       const token = authHeader && authHeader.split(' ')[1] ;
       if(token == null) {
            return res.status(401).json({ message: "No token" });;
       }    
       jwt.verify(token,process.env.ACCESS_TOKEN_SECRET,(err,user) => {
        if(err){
            return res.status(403).json({ message: "Invalid token" });
        }
        req.user = user
        next()
       })
    }
    catch(error){
        console.log(error)
    }
}

export const json_web_token = function (req,res,next) {
    try{
        const {username} = req.body;
        const user = { username:username }
        const access_token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET);
        res.json({access_token:access_token})
    }
    catch(error){
        console.log(error);
    }
}

export const login_credential = async function (req, res, next) {
    try {
        const { email, password, type } = req.body;

        if (type === 'Sign-In') {
            const result = await pool.query(
                "SELECT id, email, password FROM users WHERE email = $1",
                [email]
            );
            if (result.rows.length === 0) {
                return res.status(401).json({ success: false, message: "User not found" });
            }

            const user = result.rows[0];
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ success: false, message: "Wrong password" });
            }
            // generate fresh tokens on every login
            const access_token = generateAccessToken(user.id, user.email);
            const refresh_token = generateRefreshToken(user.id);
            // overwrite old refresh token in DB
            await pool.query(
                "UPDATE users SET refresh_token = $1 WHERE id = $2",
                [refresh_token, user.id]
            );
            // send refresh token as httpOnly cookie
            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });
            return res.status(200).json({
                success: true,
                access_token,
                user: { id: user.id, email: user.email }
            });
        }

        else if (type === 'Sign-Up') {
            const existing = await pool.query(
                "SELECT email FROM users WHERE email = $1",
                [email]
            );
            if (existing.rows.length > 0) {
                return res.status(400).json({ success: false, output: true });
            }

            const hash = await bcrypt.hash(password, saltRounds);

            // get the new user's id back from INSERT
            const newUser = await pool.query(
                "INSERT INTO users(email, password) VALUES($1, $2) RETURNING id, email",
                [email, hash]
            );
            const user = newUser.rows[0];

            // now generate tokens using real userId
            const refresh_token = generateRefreshToken(user.id);
            const access_token = generateAccessToken(user.id, user.email);

            // store refresh token
            await pool.query(
                "UPDATE users SET refresh_token = $1 WHERE id = $2",
                [refresh_token, user.id]
            );

            res.cookie('refresh_token', refresh_token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production',
                sameSite: 'strict',
                maxAge: 30 * 24 * 60 * 60 * 1000
            });

            return res.status(200).json({
                success: true,
                output: false,
                access_token,
                user: { id: user.id, email: user.email }
            });
        }

    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false });
    }
}