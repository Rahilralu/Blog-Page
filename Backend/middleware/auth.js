import jwt from "jsonwebtoken";
import { pool } from "../config/config.js";
import { generateAccessToken } from "../utils/tokens.js";

export const authenticate_token = function (req, res, next) {
    try {
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if (!token) return res.status(401).json({ message: "No token" });

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
            if (err) return res.status(403).json({ message: "Invalid token" });
            req.user = user;
            next();
        });
    } catch (error) {
        console.log(error);
    }
}

export const cookievalidator = async function (req, res, next) {
    try {
        const token = req.cookies.refresh_token;
        if (!token) return res.status(401).json({ message: "No refresh token" });

        const result = await pool.query(
            "SELECT id, email FROM users WHERE refresh_token = $1",
            [token]
        );

        if (result.rows.length === 0) {
            return res.status(403).json({ message: "Token not in db, may be logged out" });
        }

        jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err) => {
            if (err) return res.status(403).json({ message: "Invalid refresh token" });
            const user = result.rows[0];
            const access_token = generateAccessToken(user.id, user.email);
            return res.json({ access_token });
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ success: false });
    }
}